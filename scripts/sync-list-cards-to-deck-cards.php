<?php
declare(strict_types=1);

/**
 * sync-list-cards-to-deck-cards.php
 *
 * PURPOSE
 * -------
 * Emergency rollback tool for the Phase 2.2 unified-card-workflow cutover.
 * If the Phase 2.2 deploy breaks something catastrophically in production,
 * this script repopulates `deck_cards` from `list_cards` so the OLD
 * pre-Phase-2.2 code can read deck cards again.
 *
 * This is a one-way sync: list_cards → deck_cards.
 * list_cards is the new write target (Phase 2.2+).
 * deck_cards is the old read target (pre-Phase-2.2).
 *
 * WHEN TO RUN
 * -----------
 * Only during an emergency rollback of the Phase 2.2 cutover.
 * Phase 2.2 must have been deployed and is being reverted.
 * Run `verify-deck-list-parity.php` after this script to confirm sync.
 *
 * WHAT IT CHANGES
 * ---------------
 * For every `lists` row where deck_id IS NOT NULL AND role = 'main' AND
 * deleted_at IS NULL, it:
 *   1. DELETEs all existing deck_cards rows for that deck_id
 *   2. INSERTs fresh rows copied from list_cards for that list
 * Each deck's DELETE + INSERT is wrapped in a transaction.
 *
 * WARNING: THIS SCRIPT REPLACES deck_cards CONTENT WITH list_cards CONTENT.
 * Run only as part of an emergency rollback.
 * Run `verify-deck-list-parity.php` after to confirm.
 *
 * HOW TO ROLL BACK IF THIS SCRIPT BREAKS SOMETHING
 * -------------------------------------------------
 * deck_cards is also seeded by the v4.8.0 migration backfill block
 * ("Backfill: list_cards from deck_cards" section). If this script corrupts
 * deck_cards, re-run that INSERT INTO list_cards / INSERT INTO lists block
 * from v4.8.0.sql for the affected deck_ids, then re-run this script.
 * Alternatively, restore from the pre-deploy DB snapshot.
 *
 * USAGE
 * -----
 * php scripts/sync-list-cards-to-deck-cards.php --dry-run    # preview only
 * php scripts/sync-list-cards-to-deck-cards.php --confirm    # actually do it
 *
 * Requires ~/auth_secrets_dev.php defining DB_HOST, DB_NAME, DB_USER, DB_PASS.
 *
 * EXIT CODES
 * ----------
 * 0 — all decks synced successfully (or dry-run completed)
 * 1 — one or more decks failed, others may have succeeded
 * 2 — catastrophic failure (could not connect, could not load lists, etc.)
 */

// ── Argument parsing ──────────────────────────────────────────────────────────

$args    = array_slice($argv, 1);
$dryRun  = in_array('--dry-run', $args, true);
$confirm = in_array('--confirm', $args, true);

if (!$dryRun && !$confirm) {
    fwrite(STDERR, implode("\n", [
        'sync-list-cards-to-deck-cards.php: destructive script requires explicit flag.',
        '',
        '  --dry-run    Preview what would be synced without touching the database.',
        '  --confirm    Actually execute the DELETE + INSERT for each deck.',
        '',
        'Use --dry-run first to verify scope, then --confirm to execute.',
        '',
    ]) . "\n");
    exit(2);
}

if ($dryRun && $confirm) {
    fwrite(STDERR, "Error: --dry-run and --confirm are mutually exclusive.\n");
    exit(2);
}

// ── DB connection ─────────────────────────────────────────────────────────────

$secrets = getenv('HOME') . '/auth_secrets_dev.php';
if (!file_exists($secrets)) {
    fwrite(STDERR, "Error: secrets file not found at {$secrets}\n");
    exit(2);
}

require_once $secrets;

try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
} catch (\PDOException $e) {
    fwrite(STDERR, "Error: could not connect to database: " . $e->getMessage() . "\n");
    exit(2);
}

// ── Mode banner ───────────────────────────────────────────────────────────────

if ($dryRun) {
    echo "[DRY RUN] No database writes will occur.\n";
    echo str_repeat('-', 60) . "\n";
} else {
    echo "[CONFIRM] Executing destructive sync: list_cards → deck_cards.\n";
    echo str_repeat('-', 60) . "\n";
}

// ── Load all eligible lists ───────────────────────────────────────────────────
// Lists that are the 'main' list for a deck and are not soft-deleted.
// deck_id IS NOT NULL + role = 'main' + deleted_at IS NULL.

try {
    $listStmt = $pdo->query(
        "SELECT l.id AS list_id, l.deck_id, d.name AS deck_name
         FROM lists l
         JOIN decks d ON d.id = l.deck_id
         WHERE l.deck_id IS NOT NULL
           AND l.role = 'main'
           AND l.deleted_at IS NULL
         ORDER BY d.name ASC"
    );
    $lists = $listStmt->fetchAll();
} catch (\PDOException $e) {
    fwrite(STDERR, "Error: could not query lists: " . $e->getMessage() . "\n");
    exit(2);
}

$totalLists = count($lists);

if ($totalLists === 0) {
    echo "No eligible lists found (deck_id IS NOT NULL AND role = 'main' AND deleted_at IS NULL).\n";
    echo "Nothing to sync.\n";
    exit(0);
}

echo "Found {$totalLists} deck(s) to sync.\n\n";

// ── Prepared statements ───────────────────────────────────────────────────────

$stmtCountListCards = $pdo->prepare(
    'SELECT COUNT(*) FROM list_cards WHERE list_id = :list_id'
);

// Counts are done before the transaction so we can print them in dry-run mode.
// In wet-run mode we re-use the same count for the progress line.

if (!$dryRun) {
    $stmtDelete = $pdo->prepare(
        'DELETE FROM deck_cards WHERE deck_id = :deck_id'
    );

    $stmtInsert = $pdo->prepare(
        'INSERT INTO deck_cards
             (id, deck_id, scryfall_id, card_name, quantity, is_commander, is_proxy, is_custom, role)
         SELECT
             UUID(),
             :deck_id,
             lc.scryfall_id,
             lc.card_name,
             lc.quantity,
             lc.is_commander,
             lc.is_proxy,
             lc.is_custom,
             lc.role
         FROM list_cards lc
         WHERE lc.list_id = :list_id'
    );
}

// ── Main sync loop ────────────────────────────────────────────────────────────

$syncedDecks      = 0;
$failedDecks      = 0;
$totalCardsSynced = 0;

foreach ($lists as $i => $list) {
    $listId   = $list['list_id'];
    $deckId   = $list['deck_id'];
    $deckName = $list['deck_name'];
    $position = ($i + 1) . '/' . $totalLists;

    // Count cards in list_cards for this list.
    $stmtCountListCards->execute([':list_id' => $listId]);
    $cardCount = (int) $stmtCountListCards->fetchColumn();

    if ($dryRun) {
        printf(
            "[%s] Would sync %d card(s) to deck \"%s\" (deck_id=%s)\n",
            $position,
            $cardCount,
            $deckName,
            $deckId
        );
        $totalCardsSynced += $cardCount;
        $syncedDecks++;
        continue;
    }

    // Wet run: DELETE existing deck_cards for this deck, then INSERT from list_cards.
    // Wrap in a transaction so a partial sync doesn't leave the deck half-empty.
    try {
        $pdo->beginTransaction();

        $stmtDelete->execute([':deck_id' => $deckId]);

        $stmtInsert->execute([
            ':deck_id' => $deckId,
            ':list_id' => $listId,
        ]);

        $pdo->commit();

        printf(
            "[%s] Synced %d card(s) to deck \"%s\"\n",
            $position,
            $cardCount,
            $deckName
        );

        $syncedDecks++;
        $totalCardsSynced += $cardCount;

    } catch (\PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        $failedDecks++;

        fwrite(
            STDERR,
            sprintf(
                "[%s] FAILED deck \"%s\" (deck_id=%s): %s\n",
                $position,
                $deckName,
                $deckId,
                $e->getMessage()
            )
        );
    }
}

// ── Summary ───────────────────────────────────────────────────────────────────

echo "\n" . str_repeat('-', 60) . "\n";

if ($dryRun) {
    printf(
        "[DRY RUN] Would sync %d deck(s), %d total card(s).\n",
        $syncedDecks,
        $totalCardsSynced
    );
    printf("Pass --confirm to execute.\n");
    exit(0);
}

if ($failedDecks === 0) {
    printf(
        "Synced %d deck(s), %d total card(s). deck_cards is now in sync with list_cards.\n",
        $syncedDecks,
        $totalCardsSynced
    );
    echo "Next step: run `php scripts/verify-deck-list-parity.php` to confirm.\n";
    exit(0);
}

printf(
    "Synced %d deck(s), %d total card(s). %d deck(s) FAILED — see stderr for details.\n",
    $syncedDecks,
    $totalCardsSynced,
    $failedDecks
);
echo "Run `php scripts/verify-deck-list-parity.php` to check remaining parity.\n";
exit(1);
