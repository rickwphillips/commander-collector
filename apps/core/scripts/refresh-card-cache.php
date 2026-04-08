<?php
/**
 * refresh-card-cache.php
 *
 * Manual legality re-fetch script. Run after a ban announcement to walk every
 * row in scryfall_card_cache and pull fresh legalities from Scryfall.
 *
 * Usage:
 *   php scripts/refresh-card-cache.php
 *
 * Requires: Phase 2.1 migration (adds `legalities` and `legalities_cached_at`
 * columns to scryfall_card_cache). If columns are absent the script exits early
 * with a clear message.
 *
 * Rate limit: 75ms between requests (Scryfall asks for 50–100ms).
 */

// ── Bootstrap ─────────────────────────────────────────────────────────────────

// Resolve project root so require_once works regardless of cwd.
$scriptDir  = __DIR__;
$projectRoot = dirname($scriptDir); // apps/core/

require_once $projectRoot . '/app/php-api/config.php';

// config.php is designed for HTTP requests; suppress any header/CORS side-effects
// when running under CLI (headers are no-ops in CLI anyway, but be explicit).
if (php_sapi_name() !== 'cli') {
    fwrite(STDERR, "This script must be run from the command line.\n");
    exit(1);
}

// ── Schema guard ──────────────────────────────────────────────────────────────

$db = getDB();

$schemaCheck = $db->prepare(
    "SELECT COUNT(*) AS col_count
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'scryfall_card_cache'
       AND COLUMN_NAME IN ('legalities', 'legalities_cached_at')"
);
$schemaCheck->execute();
$colCount = (int) $schemaCheck->fetchColumn();

if ($colCount < 2) {
    $missing = $colCount === 0
        ? 'legalities and legalities_cached_at'
        : ($colCount === 1 ? 'one of legalities / legalities_cached_at' : '');
    fwrite(STDERR, "ERROR: Column(s) missing from scryfall_card_cache: {$missing}.\n");
    fwrite(STDERR, "This script requires the Phase 2.1 migration (v4.7.0). Run migrations first.\n");
    exit(1);
}

// ── Load all rows ordered by oldest cached_at first ──────────────────────────

$rows = $db->query(
    "SELECT id, scryfall_id, name
     FROM scryfall_card_cache
     ORDER BY cached_at ASC"
)->fetchAll();

$total   = count($rows);
$refreshed = 0;
$errors    = 0;
$skipped   = 0;

echo "Starting legality refresh for {$total} cached cards...\n";

// ── Per-card update ───────────────────────────────────────────────────────────

$updateStmt = $db->prepare(
    "UPDATE scryfall_card_cache
     SET legalities            = :legalities,
         legalities_cached_at  = NOW()
     WHERE id = :id"
);

foreach ($rows as $i => $row) {
    $position = $i + 1;

    // Skip rows without a Scryfall ID (shouldn't happen, but be safe).
    if (empty($row['scryfall_id'])) {
        $skipped++;
        continue;
    }

    // ── Fetch from Scryfall ───────────────────────────────────────────────────

    $url = 'https://api.scryfall.com/cards/' . urlencode($row['scryfall_id']);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => ['User-Agent: CommanderCollector/1.31.0'],
    ]);
    $raw  = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);

    // ── Handle errors ─────────────────────────────────────────────────────────

    if ($curlError) {
        fwrite(STDERR, "[{$position}/{$total}] cURL error for '{$row['name']}' ({$row['scryfall_id']}): {$curlError}\n");
        $errors++;
        usleep(75000);
        continue;
    }

    if ($code === 404) {
        // Card removed or UUID changed on Scryfall (reprints, errata, etc.)
        fwrite(STDERR, "[{$position}/{$total}] 404 Not Found for '{$row['name']}' ({$row['scryfall_id']}) — card may have been removed or UUID rotated on Scryfall.\n");
        $errors++;
        usleep(75000);
        continue;
    }

    if ($code !== 200) {
        fwrite(STDERR, "[{$position}/{$total}] HTTP {$code} for '{$row['name']}' ({$row['scryfall_id']})\n");
        $errors++;
        usleep(75000);
        continue;
    }

    // ── Parse response ────────────────────────────────────────────────────────

    $card = json_decode($raw, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        fwrite(STDERR, "[{$position}/{$total}] JSON parse error for '{$row['name']}': " . json_last_error_msg() . "\n");
        $errors++;
        usleep(75000);
        continue;
    }

    if (!isset($card['legalities']) || !is_array($card['legalities'])) {
        fwrite(STDERR, "[{$position}/{$total}] Missing legalities field for '{$row['name']}' ({$row['scryfall_id']})\n");
        $errors++;
        usleep(75000);
        continue;
    }

    // ── Persist ───────────────────────────────────────────────────────────────

    $updateStmt->execute([
        ':legalities' => json_encode($card['legalities']),
        ':id'         => $row['id'],
    ]);

    $refreshed++;

    // ── Progress every 50 cards ───────────────────────────────────────────────

    if ($refreshed % 50 === 0) {
        echo "[{$position}/{$total}] Refreshed {$row['name']}\n";
    }

    // ── Rate limit: 75ms ──────────────────────────────────────────────────────
    usleep(75000);
}

// ── Summary ───────────────────────────────────────────────────────────────────

echo "\nDone. Refreshed {$refreshed} cards, {$errors} errors, {$skipped} skipped (no scryfall_id).\n";
