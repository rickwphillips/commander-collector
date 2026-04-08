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

$deckId = trim((string) ($_GET['id'] ?? ''));
if ($deckId === '') sendError('id required');

$db = getDB();

$stmt = $db->prepare("
    SELECT lc.card_name, lc.quantity,
           (lc.role = 'commander') AS is_commander,
           lc.is_proxy, lc.role,
           sc.type_line, sc.mana_cost
    FROM list_cards lc
    JOIN lists l ON l.id = lc.list_id
    LEFT JOIN scryfall_card_cache sc ON lc.scryfall_id = sc.scryfall_id
    WHERE l.deck_id = ? AND l.role = 'main' AND l.deleted_at IS NULL
    ORDER BY (lc.role = 'commander') DESC, lc.card_name
");
$stmt->execute([$deckId]);
$cards = $stmt->fetchAll();

if (empty($cards)) sendError('No cards found for deck', 404);

sendJSON(['cards' => $cards]);
