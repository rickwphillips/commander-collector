<?php
/**
 * Integration tests for the offline-client save path (v5.25.0, iOS Phase 0):
 *   - POST games.php with client_game_id is idempotent (repeat returns the
 *     same game with created=false, never a duplicate row)
 *   - POST games.php `events` lands in game_logs
 *   - POST game-log.php?action=upload replaces a game's durable log, and is
 *     gated on auth + participation
 *
 * Prerequisites: PHP dev server running on localhost:8081 against the dev DB
 * with migration v5.25.0 applied.
 *
 * Run with: php tests/php/games-upload.test.php
 */

require __DIR__ . '/api-client.php';

$admin = mintTestToken('admin', '1');
$outsider = mintTestToken('user', '00000000-0000-0000-0000-00000000dead', 'outsider');

$decks = apiCall('GET', 'decks.php', null, $admin)['body'];
check('decks.php returns at least two decks to play with', is_array($decks) && count($decks) >= 2);
if (!is_array($decks) || count($decks) < 2) {
    finishTests();
}
[$deckA, $deckB] = [$decks[0], $decks[1]];

$clientGameId = sprintf('%08x-%04x-4%03x-%04x-%012x', mt_rand(0, 0xffffffff), mt_rand(0, 0xffff), mt_rand(0, 0xfff), mt_rand(0x8000, 0xbfff), mt_rand(0, 0xffffffffffff));
$save = [
    'played_at'      => '2026-10-29',
    'notes'          => '__pw_ games-upload.test.php',
    'game_type'      => 'standard',
    'client_game_id' => strtoupper($clientGameId), // server must normalise case
    'results'        => [
        ['deck_id' => $deckA['id'], 'player_id' => $deckA['player_id'], 'finish_position' => 1],
        ['deck_id' => $deckB['id'], 'player_id' => $deckB['player_id'], 'finish_position' => 2, 'eliminated_turn' => 7],
    ],
    'events' => [
        ['type' => 'game_started', 'payload' => ['players' => 2]],
        ['type' => 'life_change', 'payload' => ['delta' => -5], 'ts' => '2026-10-29T18:00:00Z'],
        'not-an-event',
    ],
];

echo "POST games.php (idempotent create):\n";
$first = apiCall('POST', 'games.php', $save, $admin);
check('first save returns 201', $first['status'] === 201, (string)json_encode($first['body']));
check('first save reports created=true', ($first['body']['created'] ?? null) === true);
$gameId = $first['body']['id'] ?? '';
check('first save returns a game id', $gameId !== '');

$second = apiCall('POST', 'games.php', $save, $admin);
check('repeat save returns 200', $second['status'] === 200, (string)json_encode($second['body']));
check('repeat save reports created=false', ($second['body']['created'] ?? null) === false);
check('repeat save returns the same game id', ($second['body']['id'] ?? null) === $gameId);

$broken = $save;
$broken['results'] = [];
$retry = apiCall('POST', 'games.php', $broken, $admin);
check('repeat with an invalid body still returns the saved game (idempotency precedes validation)',
    $retry['status'] === 200 && ($retry['body']['id'] ?? null) === $gameId);

$bad = apiCall('POST', 'games.php', ['client_game_id' => 'nope'] + $save, $admin);
check('non-UUID client_game_id is rejected with 400', $bad['status'] === 400);

echo "game log via save payload:\n";
$game = apiCall('GET', 'games.php?id=' . $gameId, null, $admin)['body'];
check('saved game carries the uploaded log', is_array($game['log'] ?? null) && count($game['log']) === 2, (string)json_encode($game['log'] ?? null));
check('non-array events were dropped, order kept', ($game['log'][0]['type'] ?? null) === 'game_started' && ($game['log'][1]['type'] ?? null) === 'life_change');
check('client timestamp preserved', ($game['log'][1]['ts'] ?? null) === '2026-10-29T18:00:00Z');
check('missing timestamp filled in', !empty($game['log'][0]['ts']));

echo "POST game-log.php?action=upload:\n";
$events3 = [['type' => 'game_started'], ['type' => 'pass_turn'], ['type' => 'concede', 'payload' => ['seat' => 2]]];
$noAuth = apiCall('POST', 'game-log.php?action=upload', ['game_id' => $gameId, 'events' => $events3]);
check('upload without a token is 401', $noAuth['status'] === 401);
$forbidden = apiCall('POST', 'game-log.php?action=upload', ['game_id' => $gameId, 'events' => $events3], $outsider);
check('upload by a user who did not play is 403', $forbidden['status'] === 403, (string)json_encode($forbidden['body']));
$missing = apiCall('POST', 'game-log.php?action=upload', ['game_id' => '00000000-0000-0000-0000-000000000000', 'events' => $events3], $admin);
check('upload for an unknown game is 404', $missing['status'] === 404);
$empty = apiCall('POST', 'game-log.php?action=upload', ['game_id' => $gameId, 'events' => []], $admin);
check('upload with no events is 400', $empty['status'] === 400);
$ok = apiCall('POST', 'game-log.php?action=upload', ['game_id' => $gameId, 'events' => $events3], $admin);
check('upload by admin succeeds', $ok['status'] === 200 && ($ok['body']['count'] ?? null) === 3, (string)json_encode($ok['body']));
$game = apiCall('GET', 'games.php?id=' . $gameId, null, $admin)['body'];
check('upload replaced the log (3 events)', count($game['log'] ?? []) === 3 && ($game['log'][2]['type'] ?? null) === 'concede');

echo "cleanup:\n";
$del = apiCall('DELETE', 'games.php?id=' . $gameId, null, $admin);
check('test game deleted', $del['status'] === 200);
$gone = apiCall('POST', 'games.php', $save, $admin);
check('after delete the client id is free again (new game created)', $gone['status'] === 201 && ($gone['body']['id'] ?? '') !== $gameId);
if (($gone['body']['id'] ?? '') !== '') {
    apiCall('DELETE', 'games.php?id=' . $gone['body']['id'], null, $admin);
}

finishTests();
