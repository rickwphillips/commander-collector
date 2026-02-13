<?php
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
requireAuth();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    sendError('Method not allowed', 405);
}

// A) Color Meta Analysis
$colorMeta = $pdo->query('
    SELECT
        d.colors,
        LENGTH(REPLACE(d.colors, "C", "")) as color_count,
        COUNT(DISTINCT d.id) as deck_count,
        COUNT(gr.id) as total_games,
        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) as wins,
        ROUND(
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
            NULLIF(COUNT(gr.id), 0),
            1
        ) as win_rate,
        ROUND(AVG(gr.finish_position), 2) as avg_finish_position
    FROM decks d
    JOIN game_results gr ON gr.deck_id = d.id
    GROUP BY d.colors
    ORDER BY total_games DESC
')->fetchAll();

// B) Performance by Game Size (pod size)
$gameSizeRaw = $pdo->query('
    SELECT
        pod.pod_size,
        COUNT(DISTINCT gr.game_id) as total_games,
        gr.player_id,
        p.name as player_name,
        COUNT(gr.id) as games_played,
        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) as wins,
        ROUND(
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
            NULLIF(COUNT(gr.id), 0),
            1
        ) as win_rate,
        ROUND(AVG(gr.finish_position), 2) as avg_finish_position
    FROM game_results gr
    JOIN players p ON gr.player_id = p.id
    JOIN (
        SELECT game_id, COUNT(*) as pod_size
        FROM game_results
        GROUP BY game_id
    ) pod ON pod.game_id = gr.game_id
    GROUP BY pod.pod_size, gr.player_id
    ORDER BY pod.pod_size, wins DESC
')->fetchAll();

// Group by pod size
$gameSizeStats = [];
foreach ($gameSizeRaw as $row) {
    $podSize = (int)$row['pod_size'];
    if (!isset($gameSizeStats[$podSize])) {
        $gameSizeStats[$podSize] = [
            'pod_size' => $podSize,
            'total_games' => (int)$row['total_games'],
            'entries' => [],
        ];
    }
    $gameSizeStats[$podSize]['entries'][] = [
        'player_id' => (int)$row['player_id'],
        'player_name' => $row['player_name'],
        'games_played' => (int)$row['games_played'],
        'wins' => (int)$row['wins'],
        'win_rate' => (float)$row['win_rate'],
        'avg_finish_position' => (float)$row['avg_finish_position'],
    ];
}
$gameSizeStats = array_values($gameSizeStats);

// C) Win Streaks & Trends — per player
$playerResults = $pdo->query('
    SELECT
        gr.player_id,
        p.name as player_name,
        gr.finish_position,
        g.played_at,
        g.id as game_id
    FROM game_results gr
    JOIN players p ON gr.player_id = p.id
    JOIN games g ON gr.game_id = g.id
    ORDER BY gr.player_id, g.played_at DESC, g.id DESC
')->fetchAll();

$playerStreaks = computeStreaks($playerResults, 'player');

// C2) Win Streaks & Trends — per deck
$deckResults = $pdo->query('
    SELECT
        gr.deck_id,
        d.name as deck_name,
        d.commander,
        d.colors,
        p.name as player_name,
        gr.player_id,
        gr.finish_position,
        g.played_at,
        g.id as game_id
    FROM game_results gr
    JOIN decks d ON gr.deck_id = d.id
    JOIN players p ON gr.player_id = p.id
    JOIN games g ON gr.game_id = g.id
    ORDER BY gr.deck_id, g.played_at DESC, g.id DESC
')->fetchAll();

$deckStreaks = computeStreaks($deckResults, 'deck');

sendJSON([
    'colorMeta' => $colorMeta,
    'gameSizeStats' => $gameSizeStats,
    'playerStreaks' => $playerStreaks,
    'deckStreaks' => $deckStreaks,
]);

function computeStreaks(array $rows, string $mode): array {
    $grouped = [];
    foreach ($rows as $row) {
        $key = $mode === 'player' ? $row['player_id'] : $row['deck_id'];
        $grouped[$key][] = $row;
    }

    $results = [];
    foreach ($grouped as $games) {
        if (empty($games)) continue;

        $first = $games[0];
        $totalGames = count($games);
        $totalWins = 0;

        // Current streak (already sorted DESC by date)
        $currentStreakType = $games[0]['finish_position'] == 1 ? 'W' : 'L';
        $currentStreak = 0;
        foreach ($games as $g) {
            $isWin = $g['finish_position'] == 1;
            if ($isWin) $totalWins++;
            if (($isWin && $currentStreakType === 'W') || (!$isWin && $currentStreakType === 'L')) {
                if ($currentStreak < count($games)) {
                    // Only count consecutive from start
                    $idx = array_search($g, $games);
                    if ($idx === $currentStreak) {
                        $currentStreak++;
                    }
                }
            }
        }

        // Recompute current streak properly
        $currentStreak = 0;
        $currentStreakType = $games[0]['finish_position'] == 1 ? 'W' : 'L';
        foreach ($games as $g) {
            $isWin = $g['finish_position'] == 1;
            if (($isWin && $currentStreakType === 'W') || (!$isWin && $currentStreakType === 'L')) {
                $currentStreak++;
            } else {
                break;
            }
        }

        // Longest win streak (walk chronological order = reverse)
        $longestWinStreak = 0;
        $tempStreak = 0;
        for ($i = count($games) - 1; $i >= 0; $i--) {
            if ($games[$i]['finish_position'] == 1) {
                $tempStreak++;
                if ($tempStreak > $longestWinStreak) {
                    $longestWinStreak = $tempStreak;
                }
            } else {
                $tempStreak = 0;
            }
        }

        // Last 5 games
        $last5 = array_slice($games, 0, 5);
        $last5Games = count($last5);
        $last5Wins = 0;
        foreach ($last5 as $g) {
            if ($g['finish_position'] == 1) $last5Wins++;
        }

        $overallWinRate = $totalGames > 0 ? round($totalWins * 100.0 / $totalGames, 1) : 0;
        $recentWinRate = $last5Games > 0 ? round($last5Wins * 100.0 / $last5Games, 1) : 0;

        // Trend
        $trend = 'steady';
        if ($totalGames >= 5) {
            if ($recentWinRate > $overallWinRate + 10) {
                $trend = 'hot';
            } elseif ($recentWinRate < $overallWinRate - 10) {
                $trend = 'cold';
            }
        }

        $entry = [
            'current_streak' => $currentStreak,
            'current_streak_type' => $currentStreakType,
            'longest_win_streak' => $longestWinStreak,
            'last_5_wins' => $last5Wins,
            'last_5_games' => $last5Games,
            'overall_win_rate' => $overallWinRate,
            'recent_win_rate' => $recentWinRate,
            'trend' => $trend,
        ];

        if ($mode === 'player') {
            $entry['player_id'] = (int)$first['player_id'];
            $entry['player_name'] = $first['player_name'];
        } else {
            $entry['deck_id'] = (int)$first['deck_id'];
            $entry['deck_name'] = $first['deck_name'];
            $entry['commander'] = $first['commander'];
            $entry['colors'] = $first['colors'];
            $entry['player_name'] = $first['player_name'];
        }

        $results[] = $entry;
    }

    // Sort by longest win streak desc
    usort($results, function ($a, $b) {
        return $b['longest_win_streak'] - $a['longest_win_streak'];
    });

    return $results;
}
