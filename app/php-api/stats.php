<?php
require_once 'config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    sendError('Method not allowed', 405);
}

$playerId = isset($_GET['player_id']) ? (int)$_GET['player_id'] : null;
$deckId = isset($_GET['deck_id']) ? (int)$_GET['deck_id'] : null;

// Player-specific stats
if ($playerId) {
    $stmt = $pdo->prepare('
        SELECT
            p.id as player_id,
            p.name as player_name,
            COUNT(DISTINCT gr.game_id) as total_games,
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) as wins,
            ROUND(
                COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
                NULLIF(COUNT(DISTINCT gr.game_id), 0),
                1
            ) as win_rate,
            ROUND(AVG(gr.finish_position), 2) as avg_finish_position
        FROM players p
        LEFT JOIN game_results gr ON gr.player_id = p.id
        WHERE p.id = ?
        GROUP BY p.id
    ');
    $stmt->execute([$playerId]);
    $stats = $stmt->fetch();

    if (!$stats) {
        sendError('Player not found', 404);
    }

    sendJSON($stats);
}

// Deck-specific stats
if ($deckId) {
    $stmt = $pdo->prepare('
        SELECT
            d.id as deck_id,
            d.name as deck_name,
            d.commander,
            d.colors,
            p.name as player_name,
            COUNT(gr.id) as total_games,
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) as wins,
            ROUND(
                COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
                NULLIF(COUNT(gr.id), 0),
                1
            ) as win_rate,
            ROUND(AVG(gr.finish_position), 2) as avg_finish_position
        FROM decks d
        JOIN players p ON d.player_id = p.id
        LEFT JOIN game_results gr ON gr.deck_id = d.id
        WHERE d.id = ?
        GROUP BY d.id
    ');
    $stmt->execute([$deckId]);
    $stats = $stmt->fetch();

    if (!$stats) {
        sendError('Deck not found', 404);
    }

    sendJSON($stats);
}

// Overall stats
$overall = $pdo->query('
    SELECT
        (SELECT COUNT(*) FROM games) as total_games,
        (SELECT AVG(winning_turn) FROM games WHERE winning_turn IS NOT NULL) as avg_game_length,
        (SELECT COUNT(*) FROM players) as total_players,
        (SELECT COUNT(*) FROM decks) as total_decks
')->fetch();

// Top players by win rate (min 3 games)
$topPlayers = $pdo->query('
    SELECT
        p.id as player_id,
        p.name as player_name,
        COUNT(DISTINCT gr.game_id) as total_games,
        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) as wins,
        ROUND(
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
            NULLIF(COUNT(DISTINCT gr.game_id), 0),
            1
        ) as win_rate
    FROM players p
    JOIN game_results gr ON gr.player_id = p.id
    GROUP BY p.id
    HAVING COUNT(DISTINCT gr.game_id) >= 3
    ORDER BY win_rate DESC, wins DESC
    LIMIT 5
')->fetchAll();

// Top decks by win rate (min 3 games)
$topDecks = $pdo->query('
    SELECT
        d.id as deck_id,
        d.name as deck_name,
        d.commander,
        d.colors,
        p.name as player_name,
        COUNT(gr.id) as total_games,
        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) as wins,
        ROUND(
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
            NULLIF(COUNT(gr.id), 0),
            1
        ) as win_rate
    FROM decks d
    JOIN players p ON d.player_id = p.id
    JOIN game_results gr ON gr.deck_id = d.id
    GROUP BY d.id
    HAVING COUNT(gr.id) >= 3
    ORDER BY win_rate DESC, wins DESC
    LIMIT 5
')->fetchAll();

// Top commanders by win rate (min 3 games)
$topCommanders = $pdo->query('
    SELECT
        d.commander,
        COUNT(gr.id) as total_games,
        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) as wins,
        ROUND(
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
            NULLIF(COUNT(gr.id), 0),
            1
        ) as win_rate,
        COUNT(DISTINCT d.id) as decks_using
    FROM decks d
    JOIN game_results gr ON gr.deck_id = d.id
    GROUP BY d.commander
    HAVING COUNT(gr.id) >= 3
    ORDER BY win_rate DESC, wins DESC
    LIMIT 10
')->fetchAll();

// Recent games (GROUP_CONCAT handles 2HG multi-winner)
$recentGames = $pdo->query('
    SELECT
        g.id,
        g.played_at,
        g.winning_turn,
        g.game_type,
        GROUP_CONCAT(DISTINCT d.name ORDER BY d.name SEPARATOR \' & \') as winning_deck,
        GROUP_CONCAT(DISTINCT d.commander ORDER BY d.commander SEPARATOR \' & \') as winning_commander,
        GROUP_CONCAT(DISTINCT p.name ORDER BY p.name SEPARATOR \' & \') as winner
    FROM games g
    LEFT JOIN game_results gr ON gr.game_id = g.id AND gr.finish_position = 1
    LEFT JOIN decks d ON gr.deck_id = d.id
    LEFT JOIN players p ON gr.player_id = p.id
    GROUP BY g.id
    ORDER BY g.played_at DESC, g.id DESC
    LIMIT 10
')->fetchAll();

sendJSON([
    'overall' => $overall,
    'topPlayers' => $topPlayers,
    'topDecks' => $topDecks,
    'topCommanders' => $topCommanders,
    'recentGames' => $recentGames
]);
