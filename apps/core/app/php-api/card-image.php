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
$artUrl     = trim($_GET['art'] ?? '');

// Art-crop pass-through: proxy a specific Scryfall art_crop URL for the phone
// remote (which can't reach the CDN directly). Kept OUT of the full-card image
// cache (image_b64) on purpose — the panels want the art crop as background,
// while card previews want the whole card, so the two must not share a slot.
if ($artUrl !== '') {
    if (parse_url($artUrl, PHP_URL_HOST) !== 'cards.scryfall.io') {
        sendError('Unsupported art host', 400);
    }
    // Cache the crop server-side keyed by the scryfall_id embedded in the
    // art_crop URL filename (.../art_crop/front/a/b/<uuid>.jpg). Stored in its
    // own art_b64 column so it never collides with the full-card image_b64 that
    // card previews use — and so the board/remote fetch each crop once instead
    // of re-downloading it from Scryfall on every view.
    $artId = '';
    if (preg_match('#/([0-9a-fA-F-]{36})\.[a-z]+#', $artUrl, $m)) {
        $artId = $m[1];
    }
    $db = getDB();
    if ($artId !== '') {
        $stmt = $db->prepare('SELECT art_b64 FROM scryfall_card_cache WHERE scryfall_id = ? LIMIT 1');
        $stmt->execute([$artId]);
        $cachedRow = $stmt->fetch();
        if ($cachedRow && !empty($cachedRow['art_b64'])) {
            sendJSON(['data_uri' => 'data:image/jpeg;base64,' . $cachedRow['art_b64'], 'cached' => true]);
        }
    }
    $ch = curl_init($artUrl);
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
    if ($artId !== '') {
        // The row usually already exists (a lookupCard populated it); only fill
        // in art_b64. If the row is somehow missing the crop still returns.
        $upd = $db->prepare('UPDATE scryfall_card_cache SET art_b64 = ? WHERE scryfall_id = ?');
        $upd->execute([$artB64, $artId]);
    }
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
