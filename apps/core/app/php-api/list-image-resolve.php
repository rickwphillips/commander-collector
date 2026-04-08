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
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);

$input  = getJSONInput();
$listId = (string)($input['list_id'] ?? '');
if (!$listId) sendError('list_id required');

$db = getDB();

// Find cards missing scryfall_id, missing from cache, or cached without an image
$stmt = $db->prepare("
    SELECT lc.id, lc.card_name, lc.scryfall_id
    FROM list_cards lc
    LEFT JOIN scryfall_card_cache sc ON sc.scryfall_id = lc.scryfall_id
    WHERE lc.list_id = ?
      AND (lc.scryfall_id IS NULL OR sc.scryfall_id IS NULL OR sc.image_uri IS NULL)
");
$stmt->execute([$listId]);
$missing = $stmt->fetchAll();

if (empty($missing)) {
    sendJSON(['updated' => []]);
}

// Batch fetch from Scryfall /cards/collection (max 75 per request)
$names   = array_column($missing, 'card_name');
$fetched = []; // canonical Scryfall name => normalised row

foreach (array_chunk($names, 75) as $chunk) {
    $identifiers = array_map(fn($n) => ['name' => $n], $chunk);

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
    if (!$raw || $code !== 200) continue;

    foreach (json_decode($raw, true)['data'] ?? [] as $card) {
        $imageUri     = $card['image_uris']['normal']
            ?? $card['card_faces'][0]['image_uris']['normal']
            ?? null;
        $backImageUri = $card['card_faces'][1]['image_uris']['normal'] ?? null;

        $row = [
            'scryfall_id'    => $card['id'],
            'name'           => $card['name'],
            'image_uri'      => $imageUri,
            'back_image_uri' => $backImageUri,
            'colors'         => implode('', $card['colors'] ?? []),
            'color_identity' => implode('', $card['color_identity'] ?? []),
            'type_line'      => $card['type_line'] ?? null,
            'mana_cost'      => $card['mana_cost'] ?? null,
        ];

        $db->prepare(
            'INSERT INTO scryfall_card_cache
                (scryfall_id, name, image_uri, back_image_uri, colors, color_identity, type_line, mana_cost)
             VALUES (?,?,?,?,?,?,?,?)
             ON DUPLICATE KEY UPDATE
                name=VALUES(name), image_uri=VALUES(image_uri), back_image_uri=VALUES(back_image_uri),
                colors=VALUES(colors), color_identity=VALUES(color_identity),
                type_line=VALUES(type_line), mana_cost=VALUES(mana_cost),
                cached_at=CURRENT_TIMESTAMP'
        )->execute([
            $row['scryfall_id'], $row['name'], $row['image_uri'], $row['back_image_uri'],
            $row['colors'], $row['color_identity'], $row['type_line'], $row['mana_cost'],
        ]);

        $fetched[$card['name']] = $row;
    }

    if (count($names) > 75) usleep(100000); // Scryfall rate limit between chunks
}

// Update list_cards.scryfall_id and return updated card data
$updated = [];
$updateStmt = $db->prepare('UPDATE list_cards SET scryfall_id = ? WHERE id = ?');

foreach ($missing as $row) {
    $match = $fetched[$row['card_name']] ?? null;
    if (!$match) {
        // Case-insensitive fallback
        foreach ($fetched as $canonicalName => $r) {
            if (strcasecmp($canonicalName, $row['card_name']) === 0) {
                $match = $r;
                break;
            }
        }
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

sendJSON(['updated' => $updated]);
