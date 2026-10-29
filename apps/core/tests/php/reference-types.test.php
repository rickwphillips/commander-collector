<?php
/**
 * The players and decks list endpoints must return numbers as JSON numbers.
 * MySQL hands ROUND()/SUM() aggregates back as strings through PDO, which the
 * web's JavaScript tolerated for months and the native app's generated client
 * (docs/openapi.yaml: win_rate number, card_count integer) rejects outright.
 * Found 2026-10-29 when the iPad's first "Refresh from web" failed.
 *
 * Prerequisites: PHP dev server on localhost:8081 against the dev DB.
 * Run with: php tests/php/reference-types.test.php
 */
require __DIR__ . '/api-client.php';

$token = mintTestToken('admin', '786efb3f-0dd4-11f1-ad3b-02001720fff7');

// json_encode writes a whole-number float as 100, not 100.0, so a rate is a
// JSON number of either kind; what must never appear is the string "100.0".
function isNumberOrNull($v): bool { return $v === null || is_int($v) || is_float($v); }

$players = apiCall('GET', '/players.php', null, $token);
check('players list is 200', $players['status'] === 200);
check('players list is a non-empty array', is_array($players['body']) && count($players['body']) > 0 && array_is_list($players['body']));
foreach ($players['body'] as $i => $p) {
    check("player $i total_games is int", is_int($p['total_games']));
    check("player $i wins is int", is_int($p['wins']));
    check("player $i win_rate is a number or null", isNumberOrNull($p['win_rate']));
}

$decks = apiCall('GET', '/decks.php', null, $token);
check('decks list is 200', $decks['status'] === 200);
check('decks list is a non-empty array', is_array($decks['body']) && count($decks['body']) > 0 && array_is_list($decks['body']));
foreach ($decks['body'] as $i => $d) {
    check("deck $i card_count is int", is_int($d['card_count']));
    check("deck $i total_games is int", is_int($d['total_games']));
    check("deck $i win_rate is a number or null", isNumberOrNull($d['win_rate']));
    foreach (['has_w', 'has_u', 'has_b', 'has_r', 'has_g'] as $flag) {
        check("deck $i $flag is int", is_int($d[$flag]));
    }
}

$first = $decks['body'][0];
$byPlayer = apiCall('GET', '/decks.php?player_id=' . $first['player_id'], null, $token);
check('decks by player is 200', $byPlayer['status'] === 200);
foreach ($byPlayer['body'] as $i => $d) {
    check("player deck $i total_games is int", is_int($d['total_games']));
    check("player deck $i win_rate is a number or null", isNumberOrNull($d['win_rate']));
}

$one = apiCall('GET', '/decks.php?id=' . $first['id'], null, $token);
check('deck by id is 200', $one['status'] === 200);
check('deck by id total_games is int', is_int($one['body']['total_games']));
check('deck by id avg_finish_position is a number or null', isNumberOrNull($one['body']['avg_finish_position']));
check('deck by id win_rate is a number or null', isNumberOrNull($one['body']['win_rate']));

finishTests();
