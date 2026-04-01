<?php
/**
 * Deck Profile — returns card list for UI display.
 * Stats, matchups, and game history are served on-demand via coach tools.
 * GET /deck-profile?id=<deck_id>
 */
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET') sendError('Method not allowed', 405);

$deckId = (int) ($_GET['id'] ?? 0);
if (!$deckId) sendError('id required');

$db = getDB();

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

if (empty($cards)) sendError('No cards found for deck', 404);

sendJSON(['cards' => $cards]);
