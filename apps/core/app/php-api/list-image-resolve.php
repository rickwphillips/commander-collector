<?php
/**
 * List Image Resolve
 *
 * POST { list_id } — Finds list_cards entries missing scryfall data, batch-fetches
 * from Scryfall, caches results, and updates list_cards.scryfall_id.
 * Called automatically when a list is opened.
 */
require_once 'config.php';
require_once 'auth/middleware.php';
$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);

$input  = getJSONInput();
$listId = (string)($input['list_id'] ?? '');
$limit  = isset($input['limit']) ? max(1, min(75, (int)$input['limit'])) : 75;
if (!$listId) sendError('list_id required');

$db = getDB();

// Verify the authenticated user owns this list
$userId = $user['sub'] ?? null;
$ownerCheck = $db->prepare('SELECT id FROM lists WHERE id = ? AND user_id = ? AND deleted_at IS NULL');
$ownerCheck->execute([$listId, $userId]);
if (!$ownerCheck->fetch()) sendError('List not found', 404);

// Count total still unresolved (for progress tracking)
$totalStmt = $db->prepare("
    SELECT COUNT(*) FROM list_cards lc
    LEFT JOIN scryfall_card_cache sc ON sc.scryfall_id = lc.scryfall_id
    WHERE lc.list_id = ?
      AND (lc.scryfall_id IS NULL OR sc.scryfall_id IS NULL)
");
$totalStmt->execute([$listId]);
$totalMissing = (int)$totalStmt->fetchColumn();

// Find the next batch of cards missing scryfall_id, missing from cache, or cached without an image
$stmt = $db->prepare("
    SELECT lc.id, lc.card_name, lc.scryfall_id
    FROM list_cards lc
    LEFT JOIN scryfall_card_cache sc ON sc.scryfall_id = lc.scryfall_id
    WHERE lc.list_id = ?
      AND (lc.scryfall_id IS NULL OR sc.scryfall_id IS NULL)
    LIMIT ?
");
$stmt->execute([$listId, $limit]);
$missing = $stmt->fetchAll();

if (empty($missing)) {
    sendJSON(['updated' => [], 'remaining' => 0]);
}

// Split missing cards: those with a known scryfall_id use ID lookup (reliable),
// those without use name lookup (fallback for newly imported cards).
$byId   = array_filter($missing, fn($r) => !empty($r['scryfall_id']));
$byName = array_filter($missing, fn($r) =>  empty($r['scryfall_id']));

// fetched[scryfall_id] => normalised cache row
$fetched = [];

function scryfallBatch(array $identifiers): array {
    $ch = curl_init('https://api.scryfall.com/cards/collection');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode(['identifiers' => $identifiers]),
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'User-Agent: CommanderCollector/1.0 (list-image-resolve)',
        ],
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    return ($raw && $code === 200) ? (json_decode($raw, true)['data'] ?? []) : [];
}

function normaliseCard(array $card): array {
    return [
        'scryfall_id'    => $card['id'],
        'name'           => $card['name'],
        'image_uri'      => $card['image_uris']['normal']
                            ?? $card['card_faces'][0]['image_uris']['normal']
                            ?? null,
        'back_image_uri' => $card['card_faces'][1]['image_uris']['normal'] ?? null,
        'colors'         => implode('', $card['colors'] ?? []),
        'color_identity' => implode('', $card['color_identity'] ?? []),
        'type_line'      => $card['type_line'] ?? null,
        'mana_cost'      => $card['mana_cost'] ?? null,
    ];
}

$cacheStmt = $db->prepare(
    'INSERT INTO scryfall_card_cache
        (id, scryfall_id, name, image_uri, back_image_uri, colors, color_identity, type_line, mana_cost)
     VALUES (UUID(),?,?,?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE
        name=VALUES(name), image_uri=VALUES(image_uri), back_image_uri=VALUES(back_image_uri),
        colors=VALUES(colors), color_identity=VALUES(color_identity),
        type_line=VALUES(type_line), mana_cost=VALUES(mana_cost),
        cached_at=CURRENT_TIMESTAMP'
);

function cacheAndStore(array $row, PDOStatement $stmt, array &$fetched): void {
    $stmt->execute([
        $row['scryfall_id'], $row['name'], $row['image_uri'], $row['back_image_uri'],
        $row['colors'], $row['color_identity'], $row['type_line'], $row['mana_cost'],
    ]);
    $fetched[$row['scryfall_id']] = $row;
}

// Fetch by known scryfall_id — guaranteed match, handles DFC names correctly.
$idChunks = array_chunk(array_values($byId), 75);
foreach ($idChunks as $i => $chunk) {
    $identifiers = array_map(fn($r) => ['id' => $r['scryfall_id']], $chunk);
    foreach (scryfallBatch($identifiers) as $card) {
        cacheAndStore(normaliseCard($card), $cacheStmt, $fetched);
    }
    if ($i < count($idChunks) - 1) usleep(100000);
}

// Fetch by name for cards with no scryfall_id yet — keyed by name temporarily.
$fetchedByName = [];
$nameChunks = array_chunk(array_values($byName), 75);
foreach ($nameChunks as $i => $chunk) {
    $identifiers = array_map(fn($r) => ['name' => $r['card_name']], $chunk);
    foreach (scryfallBatch($identifiers) as $card) {
        $row = normaliseCard($card);
        cacheAndStore($row, $cacheStmt, $fetched);
        $fetchedByName[strtolower($card['name'])] = $row;
    }
    if ($i < count($nameChunks) - 1) usleep(100000);
}

// Update list_cards.scryfall_id and return updated card data
$updated = [];
$updateStmt = $db->prepare('UPDATE list_cards SET scryfall_id = ? WHERE id = ?');

foreach ($missing as $row) {
    // Cards with a known scryfall_id: look up by id in fetched.
    if (!empty($row['scryfall_id'])) {
        $match = $fetched[$row['scryfall_id']] ?? null;
    } else {
        // Cards without: match by name (case-insensitive).
        $match = $fetchedByName[strtolower($row['card_name'])] ?? null;
    }
    if (!$match) continue;

    $updateStmt->execute([$match['scryfall_id'], $row['id']]);

    $updated[] = [
        'id'             => (string)$row['id'],
        'card_name'      => $row['card_name'],
        'scryfall_id'    => $match['scryfall_id'],
        'image_uri'      => $match['image_uri'],
        'back_image_uri' => $match['back_image_uri'],
        'type_line'      => $match['type_line'],
        'mana_cost'      => $match['mana_cost'],
        'colors'         => $match['colors'],
        'color_identity' => $match['color_identity'],
    ];
}

sendJSON(['updated' => $updated, 'remaining' => max(0, $totalMissing - count($updated))]);
