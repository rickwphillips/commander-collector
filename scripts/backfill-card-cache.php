<?php
/**
 * Backfill scryfall_card_cache for any deck_cards missing from it.
 * Usage: php scripts/backfill-card-cache.php [deck_id,deck_id,...]
 *   e.g. php scripts/backfill-card-cache.php 21,22,23,24
 *        php scripts/backfill-card-cache.php   (backfills all missing)
 */

require_once getenv('HOME') . '/auth_secrets_dev.php';

$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
    DB_USER, DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// Optionally filter to specific deck IDs passed as argv
$deckFilter = '';
if (!empty($argv[1])) {
    $ids = array_map('intval', explode(',', $argv[1]));
    $ph = implode(',', $ids);
    $deckFilter = "AND dc.deck_id IN ($ph)";
}

// Find all scryfall_ids not yet in cache
$stmt = $pdo->query("
    SELECT DISTINCT dc.scryfall_id
    FROM deck_cards dc
    LEFT JOIN scryfall_card_cache sc ON sc.scryfall_id = dc.scryfall_id
    WHERE sc.scryfall_id IS NULL $deckFilter
");
$missing = $stmt->fetchAll(PDO::FETCH_COLUMN);

if (empty($missing)) {
    echo "Nothing to backfill.\n";
    exit(0);
}

echo "Backfilling " . count($missing) . " cards…\n";

$insert = $pdo->prepare("
    INSERT INTO scryfall_card_cache
        (scryfall_id, name, image_uri, colors, color_identity, type_line, mana_cost)
    VALUES
        (:scryfall_id, :name, :image_uri, :colors, :color_identity, :type_line, :mana_cost)
    ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        image_uri = VALUES(image_uri),
        colors = VALUES(colors),
        color_identity = VALUES(color_identity),
        type_line = VALUES(type_line),
        mana_cost = VALUES(mana_cost)
");

$chunks = array_chunk($missing, 75);
$total = 0;

foreach ($chunks as $i => $chunk) {
    $identifiers = array_map(fn($id) => ['id' => $id], $chunk);
    $payload = json_encode(['identifiers' => $identifiers]);

    $ch = curl_init('https://api.scryfall.com/cards/collection');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'User-Agent: CommanderCollectorCacheBackfill/1.0',
        ],
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($code !== 200) {
        echo "  [WARN] Scryfall returned $code on batch $i\n";
        usleep(200000);
        continue;
    }

    $data = json_decode($body, true);

    foreach ($data['data'] ?? [] as $card) {
        // Handle double-faced cards
        $imageUri = $card['image_uris']['normal']
            ?? $card['card_faces'][0]['image_uris']['normal']
            ?? null;

        $colors = implode('', $card['colors'] ?? []);
        $colorIdentity = implode('', $card['color_identity'] ?? []);

        $insert->execute([
            ':scryfall_id'   => $card['id'],
            ':name'          => $card['name'],
            ':image_uri'     => $imageUri,
            ':colors'        => $colors,
            ':color_identity' => $colorIdentity,
            ':type_line'     => $card['type_line'] ?? null,
            ':mana_cost'     => $card['mana_cost'] ?? null,
        ]);
        $total++;
    }

    foreach ($data['not_found'] ?? [] as $nf) {
        echo "  [NOT FOUND] " . ($nf['id'] ?? json_encode($nf)) . "\n";
    }

    echo "  Batch " . ($i + 1) . "/" . count($chunks) . " — $total cached so far\n";
    usleep(100000); // 100ms between batches
}

echo "Done. $total rows upserted into scryfall_card_cache.\n";
