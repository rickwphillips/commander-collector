<?php
/**
 * Regression tests for php-api/lib/sql-helpers.php
 *
 * Verifies that helper functions produce SQL fragments identical to the
 * inline expressions they replace. Run with:
 *
 *   php tests/php/sql-helpers.test.php
 *
 * Exit code 0 = all pass, 1 = failures.
 */

require_once __DIR__ . '/../../app/php-api/lib/sql-helpers.php';

$passed = 0;
$failed = 0;
$errors = [];

function assertEq(string $label, string $actual, string $expected): void {
    global $passed, $failed, $errors;
    // Normalize whitespace for comparison (inline SQL may have different formatting)
    $normActual   = preg_replace('/\s+/', ' ', trim($actual));
    $normExpected = preg_replace('/\s+/', ' ', trim($expected));
    if ($normActual === $normExpected) {
        $passed++;
        echo "  ✓ $label\n";
    } else {
        $failed++;
        $errors[] = $label;
        echo "  ✗ $label\n";
        echo "    expected: $normExpected\n";
        echo "    actual:   $normActual\n";
    }
}

// ── totalGamesDistinct ──────────────────────────────────────────────────────
echo "totalGamesDistinct:\n";

assertEq(
    'default alias',
    totalGamesDistinct(),
    'COUNT(DISTINCT gr.game_id) AS total_games'
);

assertEq(
    'custom alias',
    totalGamesDistinct('game_count'),
    'COUNT(DISTINCT gr.game_id) AS game_count'
);

// Matches: stats.php:22, players.php:27, decks.php:38, advanced-stats.php:37,125, coach-chat.php:153, my-collection.php:51
assertEq(
    'matches stats.php player query',
    totalGamesDistinct('total_games'),
    'COUNT(DISTINCT gr.game_id) AS total_games'
);

// ── totalGames (row-based) ──────────────────────────────────────────────────
echo "\ntotalGames:\n";

assertEq(
    'default alias',
    totalGames(),
    'COUNT(gr.id) AS total_games'
);

// Matches: comparison.php:246 (case 'total_games'), stats.php:54 (deck-specific)
assertEq(
    'matches comparison.php total_games metric',
    totalGames('total_games'),
    'COUNT(gr.id) AS total_games'
);

// ── winsExpr ────────────────────────────────────────────────────────────────
echo "\nwinsExpr:\n";

assertEq(
    'default alias',
    winsExpr(),
    'COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) AS wins'
);

// Matches: stats.php:23, players.php:28, decks.php:39, advanced-stats.php:20,126, coach-chat.php:154
assertEq(
    'matches stats.php wins expression',
    winsExpr('wins'),
    'COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) AS wins'
);

// ── winsSumExpr ─────────────────────────────────────────────────────────────
echo "\nwinsSumExpr:\n";

// Matches: comparison.php:247 (case 'wins')
assertEq(
    'matches comparison.php wins metric',
    winsSumExpr(),
    'SUM(gr.finish_position = 1)'
);

// ── deckCountExpr ───────────────────────────────────────────────────────────
echo "\ndeckCountExpr:\n";

// Matches: advanced-stats.php:18,226,234,242,250,258,270
assertEq(
    'matches advanced-stats.php deck_count',
    deckCountExpr(),
    'COUNT(DISTINCT d.id) AS deck_count'
);

assertEq(
    'custom alias',
    deckCountExpr('num_decks'),
    'COUNT(DISTINCT d.id) AS num_decks'
);

// ── winRateDistinct ─────────────────────────────────────────────────────────
echo "\nwinRateDistinct:\n";

// Matches: stats.php:24-28, players.php:29-33, decks.php:40-44, advanced-stats.php:127-131, coach-chat.php:155
$expectedDistinct = 'ROUND( COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(DISTINCT gr.game_id), 0), 1 ) AS win_rate';
assertEq(
    'matches stats.php/players.php win_rate',
    winRateDistinct(),
    $expectedDistinct
);

assertEq(
    'custom alias',
    winRateDistinct('wr'),
    str_replace('AS win_rate', 'AS wr', $expectedDistinct)
);

// ── winRateRows ─────────────────────────────────────────────────────────────
echo "\nwinRateRows:\n";

// Matches: stats.php:56-60 (deck-specific), advanced-stats.php:21-25 (colorMeta), coach-chat.php:141
$expectedRows = 'ROUND( COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(gr.id), 0), 1 ) AS win_rate';
assertEq(
    'matches stats.php deck-specific / advanced-stats colorMeta',
    winRateRows(),
    $expectedRows
);

// ── avgFinishExpr ───────────────────────────────────────────────────────────
echo "\navgFinishExpr:\n";

// Matches: stats.php:29, comparison.php:248, advanced-stats.php:26, coach-chat.php:156
assertEq(
    'default alias',
    avgFinishExpr(),
    'ROUND(AVG(gr.finish_position), 2) AS avg_finish_position'
);

assertEq(
    'custom alias',
    avgFinishExpr('avg_finish'),
    'ROUND(AVG(gr.finish_position), 2) AS avg_finish'
);

// ── podSizeSubquery ─────────────────────────────────────────────────────────
echo "\npodSizeSubquery:\n";

// Matches: comparison.php:272, advanced-stats.php:51-53, coach-chat.php:215, my-collection.php:287-289
assertEq(
    'matches comparison.php/advanced-stats.php pod subquery',
    podSizeSubquery(),
    '(SELECT game_id, COUNT(*) AS pod_size FROM game_results GROUP BY game_id) pod'
);

// ── comparisonMetricExpr ────────────────────────────────────────────────────
echo "\ncomparisonMetricExpr:\n";

// These must exactly match comparison.php:244-256 (the metricExpression function)
$expectedMetrics = [
    'win_rate'                => 'ROUND(SUM(gr.finish_position = 1) / COUNT(gr.id) * 100, 1)',
    'total_games'             => 'COUNT(gr.id)',
    'wins'                    => 'SUM(gr.finish_position = 1)',
    'avg_finish_position'     => 'ROUND(AVG(gr.finish_position), 2)',
    'avg_survival_turns'      => 'ROUND(AVG(CASE WHEN gr.finish_position > 1 THEN gr.eliminated_turn END), 1)',
    'avg_turns_to_win'        => 'ROUND(AVG(CASE WHEN gr.finish_position = 1 THEN g.winning_turn END), 1)',
    'top2_rate'               => 'ROUND(SUM(gr.finish_position <= 2) / COUNT(gr.id) * 100, 1)',
    'elimination_rate'        => 'ROUND(SUM(gr.finish_position > 1) / COUNT(gr.id) * 100, 1)',
    'std_dev_finish_position' => 'ROUND(STDDEV_POP(gr.finish_position), 2)',
    'first_elimination_rate'  => 'ROUND(SUM(gr.finish_position = pod.pod_size) / COUNT(gr.id) * 100, 1)',
];

foreach ($expectedMetrics as $metric => $expected) {
    assertEq(
        "metric: $metric",
        comparisonMetricExpr($metric),
        $expected
    );
}

assertEq(
    'unknown metric returns NULL',
    comparisonMetricExpr('nonexistent'),
    'NULL'
);

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
