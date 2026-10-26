<?php
/**
 * DELETE /test-fixtures.php — hard-delete every Playwright fixture.
 *
 * The e2e suite (run by deploy.sh against prod) names everything it creates
 * with a `__pw_` prefix. This endpoint removes all of them in one call:
 * players, and lists together with their cards and history, including lists
 * the regular DELETE only soft-deleted. The prefix is fixed here and nothing
 * else is accepted, so a caller cannot widen the sweep.
 *
 * Players that have ever been in a game or own a deck are never touched, as a
 * guard against a real player whose name happens to start with the prefix.
 */
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendError('Method not allowed', 405);
}

$pdo = getDB();
$pdo->beginTransaction();

$lists = $pdo->exec("
    DELETE FROM lists
    WHERE name LIKE '\\_\\_pw\\_%'
");

$players = $pdo->exec("
    DELETE FROM players
    WHERE name LIKE '\\_\\_pw\\_%'
      AND NOT EXISTS (SELECT 1 FROM game_results gr WHERE gr.player_id = players.id)
      AND NOT EXISTS (SELECT 1 FROM decks d WHERE d.player_id = players.id)
");

$pdo->commit();

sendJSON(['success' => true, 'players_removed' => $players, 'lists_removed' => $lists]);
