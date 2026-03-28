<?php
require_once 'config.php';
require_once 'auth/middleware.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$scryfallId = trim($_GET['scryfall_id'] ?? '');
$url        = trim($_GET['url'] ?? '');

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
