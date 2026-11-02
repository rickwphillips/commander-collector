<?php
/**
 * Integration tests for deck soft delete (v5.26.0):
 *   - DELETE decks.php moves the deck to the trash instead of removing it
 *   - trashed decks leave the list and per-player reads, stay readable by id
 *   - game results that used the deck survive the delete
 *   - GET decks.php?trash=1 lists it; POST ?action=restore brings it back
 *   - a second DELETE and a restore of a live deck answer 409
 *
 * Prerequisites: PHP dev server running on localhost:8081 against the dev DB.
 *
 * Run with: php tests/php/decks-trash.test.php
 */

require __DIR__ . '/api-client.php';

$admin = mintTestToken('admin', '1');

$players = apiCall('GET', 'players.php', null, $admin)['body'];
check('players.php returns a player to own the deck', is_array($players) && count($players) >= 1);
if (!is_array($players) || count($players) < 1) {
    finishTests();
}
$player = $players[0];

$created = apiCall('POST', 'decks.php', [
    'player_id' => $player['id'], 'name' => '__pw_ trash test deck', 'commander' => 'Krenko, Mob Boss', 'colors' => 'R',
], $admin);
check('POST decks.php creates the deck', $created['status'] === 201 && !empty($created['body']['id']));
$deckId = $created['body']['id'] ?? '';
if ($deckId === '') {
    finishTests();
}

// A second live deck for the opposing seat.
$others = array_values(array_filter(apiCall('GET', 'decks.php', null, $admin)['body'] ?? [], fn($d) => $d['id'] !== $deckId));
check('another live deck exists for the second seat', count($others) >= 1);
$other = $others[0];

$game = apiCall('POST', 'games.php', [
    'played_at' => '2026-11-02', 'notes' => '__pw_ decks-trash.test.php', 'game_type' => 'standard',
    'results' => [
        ['deck_id' => $deckId, 'player_id' => $player['id'], 'finish_position' => 1],
        ['deck_id' => $other['id'], 'player_id' => $other['player_id'], 'finish_position' => 2],
    ],
], $admin);
check('POST games.php records a game with the deck', in_array($game['status'], [200, 201], true) && !empty($game['body']['id']));
$gameId = $game['body']['id'] ?? '';

$del = apiCall('DELETE', "decks.php?id=$deckId", null, $admin);
check('DELETE decks.php answers success', $del['status'] === 200 && ($del['body']['success'] ?? false) === true);

$list = apiCall('GET', 'decks.php', null, $admin)['body'] ?? [];
check('trashed deck is absent from the list read', !in_array($deckId, array_column($list, 'id'), true));

$byPlayer = apiCall('GET', 'decks.php?player_id=' . $player['id'], null, $admin)['body'] ?? [];
check('trashed deck is absent from the player read', !in_array($deckId, array_column($byPlayer, 'id'), true));

$byId = apiCall('GET', "decks.php?id=$deckId", null, $admin);
check('trashed deck is still readable by id', $byId['status'] === 200 && ($byId['body']['id'] ?? '') === $deckId);
check('by-id read carries deleted_at', !empty($byId['body']['deleted_at']));

if ($gameId !== '') {
    $g = apiCall('GET', "games.php?id=$gameId", null, $admin)['body'] ?? [];
    $seats = array_column($g['results'] ?? [], 'deck_id');
    check('game results still hold the trashed deck (no cascade)', in_array($deckId, $seats, true));
}

$trash = apiCall('GET', 'decks.php?trash=1', null, $admin)['body'] ?? [];
$mine = array_values(array_filter($trash, fn($d) => $d['id'] === $deckId));
check('trash listing includes the deck', count($mine) === 1);
check('trash row counts the game it was played in', ($mine[0]['total_games'] ?? -1) === 1);

$again = apiCall('DELETE', "decks.php?id=$deckId", null, $admin);
check('deleting a trashed deck again answers 409', $again['status'] === 409);

$restore = apiCall('POST', "decks.php?id=$deckId&action=restore", null, $admin);
check('restore answers success', $restore['status'] === 200 && ($restore['body']['success'] ?? false) === true);

$list = apiCall('GET', 'decks.php', null, $admin)['body'] ?? [];
check('restored deck is back in the list read', in_array($deckId, array_column($list, 'id'), true));

$restoreLive = apiCall('POST', "decks.php?id=$deckId&action=restore", null, $admin);
check('restoring a live deck answers 409', $restoreLive['status'] === 409);

// Cleanup: remove the game, then trash the deck. With no game results left it
// is eligible for the 30-day purge, so the dev DB does not accumulate rows.
if ($gameId !== '') {
    apiCall('DELETE', "games.php?id=$gameId", null, $admin);
}
apiCall('DELETE', "decks.php?id=$deckId", null, $admin);

finishTests();
