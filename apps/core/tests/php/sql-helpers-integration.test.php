<?php
/**
 * Integration tests for refactored PHP endpoints.
 * Hits the running dev API and verifies responses have correct structure
 * and stat calculations are non-null.
 *
 * Prerequisites: PHP dev server running on localhost:8081
 *
 * Run with: php tests/php/sql-helpers-integration.test.php
 */

$passed = 0;
$failed = 0;
$errors = [];

// ── Mint a dev JWT ──────────────────────────────────────────────────────────
require '/Users/rickphillips/auth_secrets_dev.php';

function mintToken(): string {
    $header  = rtrim(strtr(base64_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT'])), '+/', '-_'), '=');
    $payload = rtrim(strtr(base64_encode(json_encode([
        'sub' => '1', 'username' => 'rick', 'display_name' => 'Rick',
        'role' => 'admin', 'exp' => time() + 3600,
    ])), '+/', '-_'), '=');
    $sig = rtrim(strtr(base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true)), '+/', '-_'), '=');
    return "$header.$payload.$sig";
}

$token = mintToken();
$base  = 'http://localhost:8081/php-api';

function apiGet(string $path): array|null {
    global $token, $base;
    $ctx = stream_context_create(['http' => [
        'header' => "Authorization: Bearer $token\r\nContent-Type: application/json\r\n",
        'timeout' => 10,
    ]]);
    $raw = @file_get_contents("$base/$path", false, $ctx);
    if ($raw === false) return null;
    return json_decode($raw, true);
}

function assert_ok(string $label, bool $condition, string $detail = ''): void {
    global $passed, $failed, $errors;
    if ($condition) {
        $passed++;
        echo "  ✓ $label\n";
    } else {
        $failed++;
        $errors[] = $label;
        echo "  ✗ $label" . ($detail ? " — $detail" : "") . "\n";
    }
}

// ── Test: stats.php overall ─────────────────────────────────────────────────
echo "stats.php (overall):\n";
$stats = apiGet('stats.php');
assert_ok('returns JSON', $stats !== null);
assert_ok('has overall section', isset($stats['overall']));
assert_ok('has topPlayers', isset($stats['topPlayers']) && is_array($stats['topPlayers']));
assert_ok('has topDecks', isset($stats['topDecks']) && is_array($stats['topDecks']));
assert_ok('has topCommanders', isset($stats['topCommanders']) && is_array($stats['topCommanders']));
assert_ok('has recentGames', isset($stats['recentGames']) && is_array($stats['recentGames']));

if (!empty($stats['topPlayers'])) {
    $p = $stats['topPlayers'][0];
    assert_ok('topPlayer has total_games', isset($p['total_games']) && $p['total_games'] > 0);
    assert_ok('topPlayer has wins', array_key_exists('wins', $p));
    assert_ok('topPlayer has win_rate', isset($p['win_rate']));
    assert_ok('topPlayer has player_name', isset($p['player_name']));
}

if (!empty($stats['topDecks'])) {
    $d = $stats['topDecks'][0];
    assert_ok('topDeck has total_games', isset($d['total_games']) && $d['total_games'] > 0);
    assert_ok('topDeck has wins', array_key_exists('wins', $d));
    assert_ok('topDeck has win_rate', isset($d['win_rate']));
}

if (!empty($stats['topCommanders'])) {
    $c = $stats['topCommanders'][0];
    assert_ok('topCommander has total_games', isset($c['total_games']));
    assert_ok('topCommander has win_rate', isset($c['win_rate']));
    assert_ok('topCommander has decks_using', isset($c['decks_using']));
}

// ── Test: stats.php player-specific ─────────────────────────────────────────
echo "\nstats.php (player_id=1):\n";
$playerStats = apiGet('stats.php?player_id=1');
assert_ok('returns JSON', $playerStats !== null);
if ($playerStats && !isset($playerStats['error'])) {
    assert_ok('has total_games', array_key_exists('total_games', $playerStats));
    assert_ok('has wins', array_key_exists('wins', $playerStats));
    assert_ok('has win_rate', array_key_exists('win_rate', $playerStats));
    assert_ok('has avg_finish_position', array_key_exists('avg_finish_position', $playerStats));
} else {
    assert_ok('player exists', false, $playerStats['error'] ?? 'null response');
}

// ── Test: stats.php deck-specific ───────────────────────────────────────────
echo "\nstats.php (deck_id=1):\n";
$deckStats = apiGet('stats.php?deck_id=1');
assert_ok('returns JSON', $deckStats !== null);
if ($deckStats && !isset($deckStats['error'])) {
    assert_ok('has total_games', array_key_exists('total_games', $deckStats));
    assert_ok('has wins', array_key_exists('wins', $deckStats));
    assert_ok('has win_rate', array_key_exists('win_rate', $deckStats));
    assert_ok('has avg_finish_position', array_key_exists('avg_finish_position', $deckStats));
} else {
    assert_ok('deck exists', false, $deckStats['error'] ?? 'null response');
}

// ── Test: players.php ───────────────────────────────────────────────────────
echo "\nplayers.php:\n";
$players = apiGet('players.php');
assert_ok('returns array', is_array($players) && !isset($players['error']));
if (!empty($players)) {
    $p = $players[0];
    assert_ok('player has total_games', array_key_exists('total_games', $p));
    assert_ok('player has wins', array_key_exists('wins', $p));
    assert_ok('player has win_rate', array_key_exists('win_rate', $p));
    assert_ok('player has name', isset($p['name']));
}

// ── Test: decks.php ─────────────────────────────────────────────────────────
echo "\ndecks.php:\n";
$decks = apiGet('decks.php');
assert_ok('returns array', is_array($decks) && !isset($decks['error']));
if (!empty($decks)) {
    $d = $decks[0];
    assert_ok('deck has total_games', array_key_exists('total_games', $d));
    assert_ok('deck has wins', array_key_exists('wins', $d));
    assert_ok('deck has win_rate', array_key_exists('win_rate', $d));
    assert_ok('deck has player_name', isset($d['player_name']));
    assert_ok('deck has card_count', array_key_exists('card_count', $d));
}

// ── Test: decks.php single deck ─────────────────────────────────────────────
echo "\ndecks.php (id=1):\n";
$deck = apiGet('decks.php?id=1');
assert_ok('returns JSON', $deck !== null);
if ($deck && !isset($deck['error'])) {
    assert_ok('has total_games', array_key_exists('total_games', $deck));
    assert_ok('has wins', array_key_exists('wins', $deck));
    assert_ok('has win_rate', array_key_exists('win_rate', $deck));
    assert_ok('has avg_finish_position', array_key_exists('avg_finish_position', $deck));
} else {
    assert_ok('deck exists', false, $deck['error'] ?? 'null response');
}

// ── Test: advanced-stats.php ────────────────────────────────────────────────
echo "\nadvanced-stats.php:\n";
$adv = apiGet('advanced-stats.php');
assert_ok('returns JSON', $adv !== null);
assert_ok('has colorMeta', isset($adv['colorMeta']) && is_array($adv['colorMeta']));
assert_ok('has gameSizeStats', isset($adv['gameSizeStats']));
assert_ok('has colorPresence', isset($adv['colorPresence']) && is_array($adv['colorPresence']));
assert_ok('has colorCount', isset($adv['colorCount']) && is_array($adv['colorCount']));
assert_ok('has twoHgStats', isset($adv['twoHgStats']));

if (!empty($adv['colorMeta'])) {
    $cm = $adv['colorMeta'][0];
    assert_ok('colorMeta has deck_count', array_key_exists('deck_count', $cm));
    assert_ok('colorMeta has total_games', array_key_exists('total_games', $cm));
    assert_ok('colorMeta has win_rate', array_key_exists('win_rate', $cm));
    assert_ok('colorMeta has avg_finish_position', array_key_exists('avg_finish_position', $cm));
}

if (!empty($adv['colorPresence'])) {
    assert_ok('colorPresence has 5 colors', count($adv['colorPresence']) === 5);
    $cp = $adv['colorPresence'][0];
    assert_ok('colorPresence has color_key', isset($cp['color_key']));
    assert_ok('colorPresence has deck_count', array_key_exists('deck_count', $cp));
    assert_ok('colorPresence has win_rate', array_key_exists('win_rate', $cp));
}

if (!empty($adv['colorCount'])) {
    $cc = $adv['colorCount'][0];
    assert_ok('colorCount has color_count', array_key_exists('color_count', $cc));
    assert_ok('colorCount has deck_count', array_key_exists('deck_count', $cc));
    assert_ok('colorCount has win_rate', array_key_exists('win_rate', $cc));
}

// ── Test: comparison.php ────────────────────────────────────────────────────
echo "\ncomparison.php:\n";
$comp = apiGet('comparison.php?group_by=player&metrics=win_rate,total_games,wins');
assert_ok('returns JSON', $comp !== null);
if ($comp && !isset($comp['error'])) {
    assert_ok('has groupBy', isset($comp['groupBy']) && $comp['groupBy'] === 'player');
    assert_ok('has entities', isset($comp['entities']) && is_array($comp['entities']));
    if (!empty($comp['entities'])) {
        $e = $comp['entities'][0];
        assert_ok('entity has label', isset($e['label']));
        assert_ok('entity has total_games', array_key_exists('total_games', $e));
        assert_ok('entity has wins', array_key_exists('wins', $e));
        assert_ok('entity has win_rate', array_key_exists('win_rate', $e));
    }
} else {
    assert_ok('comparison works', false, $comp['error'] ?? 'null response');
}

// ── Summary ─────────────────────────────────────────────────────────────────
echo "\n" . str_repeat('─', 50) . "\n";
echo "$passed passed, $failed failed\n";

if ($failed > 0) {
    echo "\nFailed tests:\n";
    foreach ($errors as $e) {
        echo "  - $e\n";
    }
    exit(1);
}
exit(0);
