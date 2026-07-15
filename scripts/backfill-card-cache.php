<?php
/**
 * Backfill scryfall_card_cache for any list_cards missing from it.
 * Usage: php scripts/backfill-card-cache.php [deck_id,deck_id,...]
 *   e.g. php scripts/backfill-card-cache.php 21,22,23,24
 *        php scripts/backfill-card-cache.php   (backfills all missing)
 *
 * Phase 2.2 cutover: reads from list_cards (via lists.deck_id join) instead
 * of deck_cards. The deck_id filter still works — it filters by lists.deck_id.
 */

require_once getenv('HOME') . '/auth_secrets_dev.php';
require_once __DIR__ . '/../apps/core/app/php-api/lib/scryfall-helpers.php';

$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
    DB_USER, DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// Optionally filter to specific deck IDs passed as argv (filters by lists.deck_id)
$deckFilter = '';
if (!empty($argv[1])) {
    $ids = array_map('intval', explode(',', $argv[1]));
    $ph = implode(',', $ids);
    $deckFilter = "AND l.deck_id IN ($ph)";
}

// Find all scryfall_ids in list_cards not yet in cache
$stmt = $pdo->query("
    SELECT DISTINCT lc.scryfall_id
    FROM list_cards lc
    JOIN lists l ON l.id = lc.list_id
    LEFT JOIN scryfall_card_cache sc ON sc.scryfall_id = lc.scryfall_id
    WHERE sc.scryfall_id IS NULL
      AND lc.scryfall_id IS NOT NULL
      AND l.deleted_at IS NULL
      $deckFilter
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

$identifiers = array_map(fn($id) => ['id' => $id], $missing);
[$found, $notFound] = scryfallCollection($identifiers);

$total = 0;
foreach ($found as $card) {
    $row = normaliseScryfallCard($card);
    $insert->execute([
        ':scryfall_id'    => $row['scryfall_id'],
        ':name'           => $row['name'],
        ':image_uri'      => $row['image_uri'],
        ':colors'         => $row['colors'],
        ':color_identity' => $row['color_identity'],
        ':type_line'      => $row['type_line'],
        ':mana_cost'      => $row['mana_cost'],
    ]);
    $total++;
}

foreach ($notFound as $nf) {
    if (isset($nf['_chunk_error'])) {
        echo "  [WARN] Scryfall returned {$nf['_chunk_error']} on a batch\n";
        continue;
    }
    echo "  [NOT FOUND] " . ($nf['id'] ?? json_encode($nf)) . "\n";
}

echo "Done. $total rows upserted into scryfall_card_cache.\n";
