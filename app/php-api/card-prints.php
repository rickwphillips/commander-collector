<?php
require_once 'config.php';
require_once 'auth/middleware.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$name = trim($_GET['name'] ?? '');
if (!$name) {
    sendError('name is required');
}

// Search Scryfall for all printings with unique art/version
// q: exact card name, unique=prints returns every printing
$query = 'q=' . urlencode('"' . $name . '"') . '&unique=prints&order=released&dir=desc';
$url   = 'https://api.scryfall.com/cards/search?' . $query;

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 20,
    CURLOPT_HTTPHEADER     => ['User-Agent: CommanderCollector/2.3.0'],
]);
$raw  = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (!$raw || $code !== 200) {
    sendError('Failed to fetch printings from Scryfall', 502);
}

$data = json_decode($raw, true);
if (!isset($data['data'])) {
    sendJSON(['prints' => []]);
}

$db = getDB();

// Collect scryfall_ids to check which are already image-cached
$ids = array_map(fn($c) => $c['id'], $data['data']);
$placeholders = implode(',', array_fill(0, count($ids), '?'));
$cached = [];
if ($ids) {
    $stmt = $db->prepare(
        "SELECT scryfall_id, image_b64 IS NOT NULL AND image_b64 != '' AS has_b64
         FROM scryfall_card_cache WHERE scryfall_id IN ($placeholders)"
    );
    $stmt->execute($ids);
    foreach ($stmt->fetchAll() as $row) {
        $cached[$row['scryfall_id']] = (bool) $row['has_b64'];
    }
}

$prints = [];
foreach ($data['data'] as $card) {
    $imageUri = $card['image_uris']['normal']
        ?? $card['card_faces'][0]['image_uris']['normal']
        ?? null;

    $prints[] = [
        'scryfall_id'      => $card['id'],
        'name'             => $card['name'],
        'set_name'         => $card['set_name'] ?? '',
        'set_code'         => $card['set'] ?? '',
        'collector_number' => $card['collector_number'] ?? '',
        'image_uri'        => $imageUri,
        'released_at'      => $card['released_at'] ?? '',
        'image_cached'     => $cached[$card['id']] ?? false,
    ];
}

sendJSON(['prints' => $prints]);
