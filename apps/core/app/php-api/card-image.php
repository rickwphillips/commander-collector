<?php
require_once 'config.php';
require_once 'auth/middleware.php';
// JWT (host board) or a valid live-game session code (unauthenticated remote).
requireAuthOrSessionCode();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$scryfallId = trim($_GET['scryfall_id'] ?? '');
$url        = trim($_GET['url'] ?? '');
$artFlag    = ($_GET['art'] ?? '') !== '';

// Art-crop endpoint: serve the commander art crop as a base64 data URI for the
// phone remote (which can't reach the CDN directly). The crop URL is NEVER taken
// from the query — prod mod_security blocks URL-valued query params (?art=<url>
// returns 406) — it is derived here from the card's own cached 'normal' image_uri
// (same Scryfall path, only the size segment differs), keyed by scryfall_id.
// Cached in its own art_b64 column so it never collides with the full-card
// image_b64 that card previews use, and so the board/remote fetch each crop once
// instead of re-downloading it from Scryfall on every view.
if ($artFlag) {
    if (!$scryfallId) {
        sendError('scryfall_id is required');
    }
    $db = getDB();
    $stmt = $db->prepare('SELECT image_uri, art_b64 FROM scryfall_card_cache WHERE scryfall_id = ? LIMIT 1');
    $stmt->execute([$scryfallId]);
    $row = $stmt->fetch();
    if ($row && !empty($row['art_b64'])) {
        sendJSON(['data_uri' => 'data:image/jpeg;base64,' . $row['art_b64'], 'cached' => true]);
    }
    $normal = $row['image_uri'] ?? '';
    if ($normal === '' || strpos($normal, '/normal/') === false) {
        sendError('No art crop available for this card', 404);
    }
    $artSrc = str_replace('/normal/', '/art_crop/', $normal);
    if (parse_url($artSrc, PHP_URL_HOST) !== 'cards.scryfall.io') {
        sendError('Unsupported art host', 400);
    }
    $ch = curl_init($artSrc);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTPHEADER     => ['User-Agent: CommanderCollector/2.3.0'],
    ]);
    $imageData = curl_exec($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    if ($curlError || $httpCode !== 200 || !$imageData) {
        sendError('Failed to fetch art image', 502);
    }
    $artB64 = base64_encode($imageData);
    // The row exists (we just read image_uri from it); fill in art_b64.
    $upd = $db->prepare('UPDATE scryfall_card_cache SET art_b64 = ? WHERE scryfall_id = ?');
    $upd->execute([$artB64, $scryfallId]);
    sendJSON(['data_uri' => 'data:image/jpeg;base64,' . $artB64, 'cached' => false]);
}

if (!$scryfallId) {
    sendError('scryfall_id is required');
}

$db = getDB();

// Check if we already have a cached base64 image
$stmt = $db->prepare('SELECT image_b64, image_uri FROM scryfall_card_cache WHERE scryfall_id = ? LIMIT 1');
$stmt->execute([$scryfallId]);
$row = $stmt->fetch();

if ($row && !empty($row['image_b64'])) {
    sendJSON(['data_uri' => 'data:image/jpeg;base64,' . $row['image_b64'], 'cached' => true]);
}

// Determine the source URL: prefer explicit ?url= param, else use image_uri from cache
$imageUrl = $url ?: ($row['image_uri'] ?? '');
if (!$imageUrl) {
    sendError('No image URL available for this card', 404);
}
// Only ever proxy Scryfall's image CDN. The ?url= param is client-supplied, so
// without this the endpoint would fetch arbitrary URLs and return the body
// base64-encoded (SSRF). Legitimate callers always pass the card's own
// cards.scryfall.io image_uri; same host allow-list the art-crop path uses.
if (parse_url($imageUrl, PHP_URL_HOST) !== 'cards.scryfall.io') {
    sendError('Unsupported image host', 400);
}

// Download the image
$ch = curl_init($imageUrl);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 30,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTPHEADER     => ['User-Agent: CommanderCollector/2.3.0'],
]);
$imageData = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);

if ($curlError || $httpCode !== 200 || !$imageData) {
    sendError('Failed to fetch card image', 502);
}

$b64 = base64_encode($imageData);

// Store in cache — update image_b64 (and image_uri if we have a fresh url)
if ($row) {
    $upd = $db->prepare(
        'UPDATE scryfall_card_cache SET image_b64 = ?' .
        ($url ? ', image_uri = ?' : '') .
        ' WHERE scryfall_id = ?'
    );
    $params = $url ? [$b64, $url, $scryfallId] : [$b64, $scryfallId];
    $upd->execute($params);
} else {
    // Row doesn't exist yet — insert a minimal stub so the b64 isn't lost
    $ins = $db->prepare(
        'INSERT INTO scryfall_card_cache (scryfall_id, name, image_uri, image_b64, colors, color_identity)
         VALUES (?, ?, ?, ?, \'\', \'\')
         ON DUPLICATE KEY UPDATE image_b64 = VALUES(image_b64)'
    );
    $ins->execute([$scryfallId, '', $url ?: '', $b64]);
}

sendJSON(['data_uri' => 'data:image/jpeg;base64,' . $b64, 'cached' => false]);
