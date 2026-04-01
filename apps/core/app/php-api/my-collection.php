<?php
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
$user = requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET') sendError('Method not allowed', 405);

$db = getDB();
$userId = $user['sub'];

// Bootstrap coach_notes table if it doesn't exist
$db->exec("
    CREATE TABLE IF NOT EXISTS coach_notes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        player_id INT NOT NULL,
        topic VARCHAR(200) NOT NULL,
        observation TEXT NOT NULL,
        reasoning TEXT,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_player (player_id),
        UNIQUE KEY uq_player_topic (player_id, topic)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
");

// Resolve the user's linked player_id
$stmt = $db->prepare("SELECT id, name FROM players WHERE user_id = ? LIMIT 1");
$stmt->execute([$userId]);
$player = $stmt->fetch();

if (!$player) {
    sendJSON([
        'player'      => null,
        'summary'     => null,
        'decks'       => [],
        'lists'       => [],
        'recentGames' => [],
        'commanders'  => [],
        'nemeses'     => [],
        'streaks'     => null,
        'colorStats'  => [],
    ]);
}

$playerId = (int)$player['id'];

// ── Summary stats ─────────────────────────────────────────────────────────
$stmt = $db->prepare("
    SELECT
        COUNT(DISTINCT gr.game_id) AS total_games,
        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) AS wins,
        ROUND(
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
            NULLIF(COUNT(DISTINCT gr.game_id), 0), 1
        ) AS win_rate,
        ROUND(AVG(gr.finish_position), 2) AS avg_finish,
        (SELECT COUNT(*) FROM decks WHERE player_id = ?) AS total_decks,
        (SELECT COUNT(*) FROM lists WHERE user_id = ?) AS total_lists
    FROM game_results gr
    WHERE gr.player_id = ?
");
$stmt->execute([$playerId, $userId, $playerId]);
$summary = $stmt->fetch();

// ── Decks with stats ──────────────────────────────────────────────────────
$stmt = $db->prepare("
    SELECT
        d.id, d.name, d.commander, d.colors, d.created_at,
        COUNT(gr.id) AS total_games,
        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) AS wins,
        ROUND(
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
            NULLIF(COUNT(gr.id), 0), 1
        ) AS win_rate,
        (SELECT COALESCE(SUM(dc.quantity), 0) FROM deck_cards dc WHERE dc.deck_id = d.id) AS card_count
    FROM decks d
    LEFT JOIN game_results gr ON gr.deck_id = d.id
    WHERE d.player_id = ?
    GROUP BY d.id
    ORDER BY total_games DESC, d.name ASC
");
$stmt->execute([$playerId]);
$decks = $stmt->fetchAll();

// ── Lists ─────────────────────────────────────────────────────────────────
$stmt = $db->prepare("
    SELECT l.id, l.name, l.description, l.created_at, l.updated_at,
           COALESCE(SUM(lc.quantity), 0) AS card_count
    FROM lists l
    LEFT JOIN list_cards lc ON lc.list_id = l.id
    WHERE l.user_id = ?
    GROUP BY l.id
    ORDER BY l.updated_at DESC
");
$stmt->execute([$userId]);
$lists = $stmt->fetchAll();
foreach ($lists as &$l) {
    $l['card_count'] = (int)$l['card_count'];
}
unset($l);

// ── Recent games (last 20) ───────────────────────────────────────────────
$stmt = $db->prepare("
    SELECT
        g.id AS game_id,
        g.played_at,
        g.winning_turn,
        g.game_type,
        gr.finish_position,
        d.name AS deck_name,
        d.commander,
        d.colors AS deck_colors,
        (SELECT p2.name FROM players p2
         JOIN game_results gr2 ON gr2.player_id = p2.id
         WHERE gr2.game_id = g.id AND gr2.finish_position = 1
         LIMIT 1) AS winner_name,
        (SELECT COUNT(*) FROM game_results gr3 WHERE gr3.game_id = g.id) AS pod_size
    FROM game_results gr
    JOIN games g ON g.id = gr.game_id
    JOIN decks d ON d.id = gr.deck_id
    WHERE gr.player_id = ?
    ORDER BY g.played_at DESC, g.id DESC
    LIMIT 20
");
$stmt->execute([$playerId]);
$recentGames = $stmt->fetchAll();

// ── Commander performance ─────────────────────────────────────────────────
$stmt = $db->prepare("
    SELECT
        d.commander,
        COUNT(gr.id) AS total_games,
        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) AS wins,
        ROUND(
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
            NULLIF(COUNT(gr.id), 0), 1
        ) AS win_rate,
        ROUND(AVG(gr.finish_position), 2) AS avg_finish,
        COUNT(DISTINCT d.id) AS deck_count
    FROM game_results gr
    JOIN decks d ON d.id = gr.deck_id
    WHERE gr.player_id = ?
    GROUP BY d.commander
    ORDER BY total_games DESC
");
$stmt->execute([$playerId]);
$commanders = $stmt->fetchAll();

// ── Nemeses: opponents who beat you most ──────────────────────────────────
$stmt = $db->prepare("
    SELECT
        p2.id AS opponent_id,
        p2.name AS opponent_name,
        COUNT(DISTINCT g.id) AS games_together,
        SUM(CASE WHEN opp_gr.finish_position = 1 THEN 1 ELSE 0 END) AS their_wins,
        SUM(CASE WHEN my_gr.finish_position = 1 THEN 1 ELSE 0 END) AS my_wins
    FROM game_results my_gr
    JOIN games g ON g.id = my_gr.game_id
    JOIN game_results opp_gr ON opp_gr.game_id = g.id AND opp_gr.player_id != ?
    JOIN players p2 ON p2.id = opp_gr.player_id
    WHERE my_gr.player_id = ?
    GROUP BY p2.id
    HAVING games_together >= 2
    ORDER BY their_wins DESC, games_together DESC
    LIMIT 10
");
$stmt->execute([$playerId, $playerId]);
$nemeses = $stmt->fetchAll();

// ── Nemesis commanders: commanders that beat you ──────────────────────────
$stmt = $db->prepare("
    SELECT
        d2.commander AS enemy_commander,
        COUNT(DISTINCT g.id) AS games_against,
        SUM(CASE WHEN opp_gr.finish_position = 1 THEN 1 ELSE 0 END) AS their_wins,
        SUM(CASE WHEN my_gr.finish_position = 1 THEN 1 ELSE 0 END) AS my_wins
    FROM game_results my_gr
    JOIN games g ON g.id = my_gr.game_id
    JOIN game_results opp_gr ON opp_gr.game_id = g.id AND opp_gr.player_id != ?
    JOIN decks d2 ON d2.id = opp_gr.deck_id
    WHERE my_gr.player_id = ?
    GROUP BY d2.commander
    HAVING games_against >= 2
    ORDER BY their_wins DESC, games_against DESC
    LIMIT 10
");
$stmt->execute([$playerId, $playerId]);
$nemesisCommanders = $stmt->fetchAll();

// ── Win/loss streaks ──────────────────────────────────────────────────────
$stmt = $db->prepare("
    SELECT
        gr.finish_position,
        g.played_at
    FROM game_results gr
    JOIN games g ON g.id = gr.game_id
    WHERE gr.player_id = ?
    ORDER BY g.played_at DESC, g.id DESC
");
$stmt->execute([$playerId]);
$results = $stmt->fetchAll();

$currentStreak = 0;
$currentStreakType = null;
$bestWinStreak = 0;
$worstLossStreak = 0;
$tempStreak = 0;
$tempType = null;

foreach ($results as $r) {
    $isWin = ((int)$r['finish_position'] === 1);
    $type = $isWin ? 'win' : 'loss';

    if ($tempType === $type) {
        $tempStreak++;
    } else {
        $tempType = $type;
        $tempStreak = 1;
    }

    if ($currentStreakType === null) {
        $currentStreakType = $type;
    }
    if ($currentStreakType === $type && $currentStreak < $tempStreak) {
        $currentStreak = $tempStreak;
    }

    if ($isWin && $tempStreak > $bestWinStreak) $bestWinStreak = $tempStreak;
    if (!$isWin && $tempStreak > $worstLossStreak) $worstLossStreak = $tempStreak;
}

// Current streak is from the most recent games
$currentStreak = 0;
$currentStreakType = null;
foreach ($results as $r) {
    $isWin = ((int)$r['finish_position'] === 1);
    $type = $isWin ? 'win' : 'loss';
    if ($currentStreakType === null) {
        $currentStreakType = $type;
        $currentStreak = 1;
    } elseif ($currentStreakType === $type) {
        $currentStreak++;
    } else {
        break;
    }
}

$streaks = [
    'current_type'     => $currentStreakType,
    'current_count'    => $currentStreak,
    'best_win_streak'  => $bestWinStreak,
    'worst_loss_streak' => $worstLossStreak,
];

// ── Color identity performance ────────────────────────────────────────────
$stmt = $db->prepare("
    SELECT
        d.colors,
        COUNT(gr.id) AS total_games,
        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) AS wins,
        ROUND(
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
            NULLIF(COUNT(gr.id), 0), 1
        ) AS win_rate
    FROM game_results gr
    JOIN decks d ON d.id = gr.deck_id
    WHERE gr.player_id = ?
    GROUP BY d.colors
    ORDER BY total_games DESC
");
$stmt->execute([$playerId]);
$colorStats = $stmt->fetchAll();

// ── Pod size performance ──────────────────────────────────────────────────
$stmt = $db->prepare("
    SELECT
        pod.pod_size,
        COUNT(*) AS total_games,
        SUM(CASE WHEN gr.finish_position = 1 THEN 1 ELSE 0 END) AS wins,
        ROUND(
            SUM(CASE WHEN gr.finish_position = 1 THEN 1 ELSE 0 END) * 100.0 /
            NULLIF(COUNT(*), 0), 1
        ) AS win_rate
    FROM game_results gr
    JOIN (
        SELECT game_id, COUNT(*) AS pod_size
        FROM game_results
        GROUP BY game_id
    ) pod ON pod.game_id = gr.game_id
    WHERE gr.player_id = ?
    GROUP BY pod.pod_size
    ORDER BY pod.pod_size
");
$stmt->execute([$playerId]);
$podSizeStats = $stmt->fetchAll();

// ── Coach notes ───────────────────────────────────────────────────────────
$stmt = $db->prepare("
    SELECT id, topic, observation, reasoning, created_at, updated_at
    FROM coach_notes
    WHERE player_id = ?
    ORDER BY updated_at DESC
");
$stmt->execute([$playerId]);
$coachNotes = $stmt->fetchAll();

sendJSON([
    'player'            => $player,
    'summary'           => $summary,
    'decks'             => $decks,
    'lists'             => $lists,
    'recentGames'       => $recentGames,
    'commanders'        => $commanders,
    'nemeses'           => $nemeses,
    'nemesisCommanders' => $nemesisCommanders,
    'streaks'           => $streaks,
    'colorStats'        => $colorStats,
    'podSizeStats'      => $podSizeStats,
    'coachNotes'        => $coachNotes,
]);
