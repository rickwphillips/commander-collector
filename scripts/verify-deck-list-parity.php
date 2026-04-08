<?php
/**
 * verify-deck-list-parity.php
 *
 * POST-CUTOVER PURPOSE (Phase 2.2+)
 * ----------------------------------
 * After the Phase 2.2 reader cutover, list_cards is the source of truth.
 * deck_cards is a frozen snapshot (untouched since v4.8.0 backfill, dropped
 * in Phase 5). This script verifies the v4.8.0 backfill remains consistent
 * with the frozen deck_cards snapshot — used to detect any post-cutover
 * regression where list_cards diverges from what was backfilled.
 *
 * WHAT THIS CHECKS
 * ----------------
 * For every deck that has rows in the frozen deck_cards snapshot:
 *   - There is exactly one lists row with deck_id = deck.id AND role = 'main'
 *   - COUNT(*) in deck_cards for that deck equals COUNT(*) in list_cards for
 *     that deck's main list
 *
 * A mismatch means something wrote to list_cards after the backfill without
 * a corresponding update to deck_cards (which should not happen during Phase
 * 2.x — deck_cards is frozen until Phase 5 drops it).
 *
 * SUCCESS
 * -------
 * All decks checked, zero parity violations found.
 * Exit code 0. Output: "Checked N decks, 0 parity violations."
 *
 * ON FAILURE
 * ----------
 * One or more decks show a count mismatch or missing list.
 * Exit code 1. Output lists every offending deck_id with its counts.
 *
 * TRANSITIONAL SCRIPT
 * -------------------
 * This script exists to guard against post-cutover regressions during Phase
 * 2.x. Phase 5 drops deck_cards along with this script. Do not use it as
 * a pre-cutover parity check — use it AFTER Phase 2.2 is in place.
 *
 * USAGE
 * -----
 * php scripts/verify-deck-list-parity.php
 *
 * Requires ~/auth_secrets_dev.php defining DB_HOST, DB_NAME, DB_USER, DB_PASS.
 */

$secrets = getenv('HOME') . '/auth_secrets_dev.php';
require_once $secrets;

$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
    DB_USER, DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// ── Step 1: find all decks that have rows in the frozen deck_cards snapshot ──

$deckStmt = $pdo->query(
    'SELECT dc.deck_id, COUNT(*) AS deck_card_count
     FROM deck_cards dc
     GROUP BY dc.deck_id'
);
$decks = $deckStmt->fetchAll(PDO::FETCH_ASSOC);

$totalDecks = count($decks);
$violations = [];

if ($totalDecks === 0) {
    echo "Checked 0 decks, 0 parity violations.\n";
    echo "NOTE: No rows found in the frozen deck_cards snapshot. Phase 5 may have already dropped it.\n";
    exit(0);
}

// ── Step 2: for each deck, verify list_cards count matches the frozen snapshot ──

foreach ($decks as $row) {
    $deckId        = $row['deck_id'];  // CHAR(36) UUID — do not cast to int
    $deckCardCount = (int) $row['deck_card_count'];

    // Check for exactly one 'main' list for this deck
    $listStmt = $pdo->prepare(
        "SELECT id
         FROM lists
         WHERE deck_id = :deck_id AND role = 'main' AND deleted_at IS NULL"
    );
    $listStmt->execute([':deck_id' => $deckId]);
    $listIds = $listStmt->fetchAll(PDO::FETCH_COLUMN);

    if (count($listIds) === 0) {
        $violations[] = [
            'deck_id'         => $deckId,
            'issue'           => 'MISSING_LIST',
            'deck_card_count' => $deckCardCount,
            'list_card_count' => null,
            'list_id'         => null,
        ];
        continue;
    }

    if (count($listIds) > 1) {
        $violations[] = [
            'deck_id'         => $deckId,
            'issue'           => 'DUPLICATE_LISTS (' . implode(', ', $listIds) . ')',
            'deck_card_count' => $deckCardCount,
            'list_card_count' => null,
            'list_id'         => null,
        ];
        continue;
    }

    $listId = $listIds[0];

    // Count list_cards rows for the deck's main list
    $countStmt = $pdo->prepare(
        'SELECT COUNT(*) AS list_card_count
         FROM list_cards
         WHERE list_id = :list_id'
    );
    $countStmt->execute([':list_id' => $listId]);
    $listCardCount = (int) $countStmt->fetchColumn();

    if ($listCardCount !== $deckCardCount) {
        $violations[] = [
            'deck_id'         => $deckId,
            'issue'           => 'COUNT_MISMATCH',
            'deck_card_count' => $deckCardCount,
            'list_card_count' => $listCardCount,
            'list_id'         => $listId,
        ];
    }
}

// ── Step 3: report ────────────────────────────────────────────────────────────

$violationCount = count($violations);
echo "Checked {$totalDecks} decks, {$violationCount} parity violations.\n";
echo "(Compares list_cards totals against the frozen deck_cards v4.8.0 backfill snapshot.)\n";

if ($violationCount === 0) {
    echo "All list_cards counts match the frozen deck_cards snapshot. Backfill is consistent.\n";
    exit(0);
}

echo "\nVIOLATIONS:\n";
echo str_pad('deck_id', 38) . str_pad('list_id', 38) . str_pad('issue', 35)
    . str_pad('deck_cards', 12) . str_pad('list_cards', 12) . "\n";
echo str_repeat('-', 135) . "\n";

foreach ($violations as $v) {
    echo str_pad($v['deck_id'], 38)
        . str_pad($v['list_id'] ?? '—', 38)
        . str_pad($v['issue'], 35)
        . str_pad($v['deck_card_count'], 12)
        . str_pad($v['list_card_count'] ?? '—', 12) . "\n";
}

echo "\nPost-cutover regression detected: list_cards diverges from the frozen deck_cards snapshot.\n";
echo "Investigate whether list_cards was modified outside of the normal Phase 2.2 write paths.\n";
echo "Phase 5 will drop deck_cards entirely — resolve any regression before proceeding to Phase 5.\n";

exit(1);
