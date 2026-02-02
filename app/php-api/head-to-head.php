<?php
require_once 'config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    sendError('Method not allowed', 405);
}

$player1Id = isset($_GET['player1']) ? (int)$_GET['player1'] : null;
$player2Id = isset($_GET['player2']) ? (int)$_GET['player2'] : null;

// Specific head-to-head between two players
if ($player1Id && $player2Id) {
    $stmt = $pdo->prepare('
        SELECT
            g.id as game_id,
            g.played_at,
            gr1.finish_position as player1_finish,
            gr2.finish_position as player2_finish,
            CASE WHEN gr1.finish_position < gr2.finish_position THEN 1 ELSE 0 END as player1_won
        FROM games g
        JOIN game_results gr1 ON gr1.game_id = g.id
        JOIN decks d1 ON gr1.deck_id = d1.id AND d1.player_id = ?
        JOIN game_results gr2 ON gr2.game_id = g.id
        JOIN decks d2 ON gr2.deck_id = d2.id AND d2.player_id = ?
        ORDER BY g.played_at DESC
    ');
    $stmt->execute([$player1Id, $player2Id]);
    $games = $stmt->fetchAll();

    $player1Wins = 0;
    $player2Wins = 0;
    foreach ($games as $game) {
        if ($game['player1_won']) {
            $player1Wins++;
        } else {
            $player2Wins++;
        }
    }

    sendJSON([
        'total_games' => count($games),
        'player1_wins' => $player1Wins,
        'player2_wins' => $player2Wins,
        'games' => $games
    ]);
}

// All head-to-head records
$records = $pdo->query('
    SELECT
        p1.id as player1_id,
        p1.name as player1_name,
        p2.id as player2_id,
        p2.name as player2_name,
        COUNT(*) as total_games,
        SUM(CASE WHEN gr1.finish_position < gr2.finish_position THEN 1 ELSE 0 END) as player1_wins,
        SUM(CASE WHEN gr2.finish_position < gr1.finish_position THEN 1 ELSE 0 END) as player2_wins
    FROM games g
    JOIN game_results gr1 ON gr1.game_id = g.id
    JOIN decks d1 ON gr1.deck_id = d1.id
    JOIN players p1 ON d1.player_id = p1.id
    JOIN game_results gr2 ON gr2.game_id = g.id AND gr2.id > gr1.id
    JOIN decks d2 ON gr2.deck_id = d2.id
    JOIN players p2 ON d2.player_id = p2.id
    WHERE p1.id < p2.id
    GROUP BY p1.id, p2.id
    ORDER BY total_games DESC
')->fetchAll();

sendJSON($records);
