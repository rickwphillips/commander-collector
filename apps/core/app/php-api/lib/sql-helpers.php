<?php
/**
 * Shared SQL expression builders for stat calculations.
 *
 * Two counting modes exist for good reason:
 *   - "Distinct" (COUNT(DISTINCT gr.game_id)): Used when JOINing game_results
 *     to players/decks, where 2HG could produce multiple rows per game.
 *   - "Row" (COUNT(gr.id)): Used in the comparison engine where each
 *     game_result row represents one participation — one row = one data point.
 */

// ── Counting ────────────────────────────────────────────────────────────────

/** Count unique games (safe for JOINs that may fan out rows). */
function totalGamesDistinct(string $alias = 'total_games'): string {
    return "COUNT(DISTINCT gr.game_id) AS $alias";
}

/** Count result rows (one row = one participation). */
function totalGames(string $alias = 'total_games'): string {
    return "COUNT(gr.id) AS $alias";
}

/** Count first-place finishes. */
function winsExpr(string $alias = 'wins'): string {
    return "COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) AS $alias";
}

/** SUM-style wins (returns integer, used in comparison metric expressions). */
function winsSumExpr(): string {
    return 'SUM(gr.finish_position = 1)';
}

/** Count distinct decks. */
function deckCountExpr(string $alias = 'deck_count'): string {
    return "COUNT(DISTINCT d.id) AS $alias";
}

// ── Rates ───────────────────────────────────────────────────────────────────

/**
 * Win rate using DISTINCT game count as denominator.
 * Formula: wins * 100.0 / NULLIF(distinct_games, 0), rounded to 1 decimal.
 */
function winRateDistinct(string $alias = 'win_rate'): string {
    return "ROUND(
        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
        NULLIF(COUNT(DISTINCT gr.game_id), 0),
        1
    ) AS $alias";
}

/**
 * Win rate using row count as denominator.
 * Formula: wins * 100.0 / NULLIF(row_count, 0), rounded to 1 decimal.
 */
function winRateRows(string $alias = 'win_rate'): string {
    return "ROUND(
        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
        NULLIF(COUNT(gr.id), 0),
        1
    ) AS $alias";
}

/** Average finish position, 2 decimal places. */
function avgFinishExpr(string $alias = 'avg_finish_position'): string {
    return "ROUND(AVG(gr.finish_position), 2) AS $alias";
}

// ── Subqueries ──────────────────────────────────────────────────────────────

/** Pod size subquery — join as: JOIN {podSizeSubquery()} ON pod.game_id = gr.game_id */
function podSizeSubquery(): string {
    return '(SELECT game_id, COUNT(*) AS pod_size FROM game_results GROUP BY game_id) pod';
}

// ── Comparison metric expressions (no AS alias — used inline) ───────────────

/**
 * Returns the SQL expression for a comparison metric.
 * These use COUNT(gr.id) as denominator (row-based counting).
 */
function comparisonMetricExpr(string $metric): string {
    switch ($metric) {
        case 'win_rate':                return 'ROUND(SUM(gr.finish_position = 1) / COUNT(gr.id) * 100, 1)';
        case 'total_games':             return 'COUNT(gr.id)';
        case 'wins':                    return 'SUM(gr.finish_position = 1)';
        case 'avg_finish_position':     return 'ROUND(AVG(gr.finish_position), 2)';
        case 'avg_survival_turns':      return 'ROUND(AVG(CASE WHEN gr.finish_position > 1 THEN gr.eliminated_turn END), 1)';
        case 'avg_turns_to_win':        return 'ROUND(AVG(CASE WHEN gr.finish_position = 1 THEN g.winning_turn END), 1)';
        case 'top2_rate':               return 'ROUND(SUM(gr.finish_position <= 2) / COUNT(gr.id) * 100, 1)';
        case 'elimination_rate':        return 'ROUND(SUM(gr.finish_position > 1) / COUNT(gr.id) * 100, 1)';
        case 'std_dev_finish_position': return 'ROUND(STDDEV_POP(gr.finish_position), 2)';
        case 'first_elimination_rate':  return 'ROUND(SUM(gr.finish_position = pod.pod_size) / COUNT(gr.id) * 100, 1)';
        default:                        return 'NULL';
    }
}
