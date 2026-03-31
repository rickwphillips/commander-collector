<?php
/**
 * Deck Profile — returns full deck data for coach context.
 * GET /deck-profile?id=<deck_id>
 * Returns: cards, game history, matchup records, avg finish, recent results.
 */
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET') sendError('Method not allowed', 405);

$deckId = (int) ($_GET['id'] ?? 0);
if (!$deckId) sendError('id required');

$db = getDB();

// Deck basics
$stmt = $db->prepare("SELECT d.id, d.name, d.commander, d.colors, p.name AS player_name
    FROM decks d JOIN players p ON p.id = d.player_id WHERE d.id = ?");
$stmt->execute([$deckId]);
$deck = $stmt->fetch();
if (!$deck) sendError('Deck not found', 404);

// Cards
$stmt = $db->prepare("
    SELECT dc.card_name, dc.quantity, dc.is_commander, dc.is_proxy,
           sc.type_line, sc.mana_cost
    FROM deck_cards dc
    LEFT JOIN scryfall_card_cache sc ON dc.scryfall_id = sc.scryfall_id
    WHERE dc.deck_id = ?
    ORDER BY dc.is_commander DESC, dc.card_name
");
$stmt->execute([$deckId]);
$cards = $stmt->fetchAll();

// Overall deck stats
$stmt = $db->prepare("
    SELECT COUNT(*) AS total_games,
        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) AS wins,
        ROUND(COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 1) AS win_rate,
        ROUND(AVG(gr.finish_position), 2) AS avg_finish,
        MIN(g.played_at) AS first_played,
        MAX(g.played_at) AS last_played
    FROM game_results gr
    JOIN games g ON g.id = gr.game_id
    WHERE gr.deck_id = ?
");
$stmt->execute([$deckId]);
$stats = $stmt->fetch();

// Record vs opposing commanders
$stmt = $db->prepare("
    SELECT d2.commander AS opponent_commander,
        COUNT(DISTINCT g.id) AS games,
        SUM(CASE WHEN my.finish_position = 1 THEN 1 ELSE 0 END) AS my_wins,
        SUM(CASE WHEN opp.finish_position = 1 THEN 1 ELSE 0 END) AS their_wins
    FROM game_results my
    JOIN games g ON g.id = my.game_id
    JOIN game_results opp ON opp.game_id = g.id AND opp.player_id != my.player_id
    JOIN decks d2 ON d2.id = opp.deck_id
    WHERE my.deck_id = ?
    GROUP BY d2.commander
    HAVING games >= 1
    ORDER BY games DESC, their_wins DESC
    LIMIT 15
");
$stmt->execute([$deckId]);
$matchups = $stmt->fetchAll();

// Recent game results (last 10)
$stmt = $db->prepare("
    SELECT g.played_at, gr.finish_position,
        (SELECT COUNT(*) FROM game_results gr2 WHERE gr2.game_id = g.id) AS pod_size,
        g.winning_turn
    FROM game_results gr
    JOIN games g ON g.id = gr.game_id
    WHERE gr.deck_id = ?
    ORDER BY g.played_at DESC, g.id DESC
    LIMIT 10
");
$stmt->execute([$deckId]);
$recentGames = $stmt->fetchAll();

// Finish position distribution
$stmt = $db->prepare("
    SELECT gr.finish_position, COUNT(*) AS count
    FROM game_results gr WHERE gr.deck_id = ?
    GROUP BY gr.finish_position ORDER BY gr.finish_position
");
$stmt->execute([$deckId]);
$finishDist = $stmt->fetchAll();

sendJSON([
    'deck'          => $deck,
    'cards'         => $cards,
    'stats'         => $stats,
    'matchups'      => $matchups,
    'recentGames'   => $recentGames,
    'finishDistribution' => $finishDist,
]);
