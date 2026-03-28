<?php
require_once 'config.php';
require_once 'auth/middleware.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

// GET ?deck_id=<id> — get all cards for a deck
if ($method === 'GET') {
    $deckId = isset($_GET['deck_id']) ? (int) $_GET['deck_id'] : 0;
    if (!$deckId) {
        sendError('deck_id is required');
    }

    $db   = getDB();
    $stmt = $db->prepare(
        'SELECT dc.id, dc.deck_id, dc.scryfall_id, dc.card_name, dc.quantity, dc.is_commander, dc.is_proxy,
                sc.image_uri, sc.colors, sc.color_identity, sc.type_line, sc.mana_cost
         FROM deck_cards dc
         LEFT JOIN scryfall_card_cache sc ON dc.scryfall_id = sc.scryfall_id
         WHERE dc.deck_id = ?
         ORDER BY dc.is_commander DESC, dc.card_name ASC'
    );
    $stmt->execute([$deckId]);
    $cards = $stmt->fetchAll();

    foreach ($cards as &$card) {
        $card['quantity']     = (int) $card['quantity'];
        $card['is_commander'] = (int) $card['is_commander'];
        $card['is_proxy']     = (int) $card['is_proxy'];
    }

    sendJSON($cards);
}

// POST — save (replace) the full card list for a deck
// Body: { "deck_id": 1, "cards": [{ "card_name": "...", "scryfall_id": "...", "quantity": 1, "is_commander": false }] }
elseif ($method === 'POST') {
    $input  = getJSONInput();
    $deckId = isset($input['deck_id']) ? (int) $input['deck_id'] : 0;
    $cards  = $input['cards'] ?? [];

    if (!$deckId) {
        sendError('deck_id is required');
    }
    if (!is_array($cards)) {
        sendError('cards must be an array');
    }

    $db = getDB();

    // Verify deck exists
    $chk = $db->prepare('SELECT id FROM decks WHERE id = ?');
    $chk->execute([$deckId]);
    if (!$chk->fetch()) {
        sendError('Deck not found', 404);
    }

    $db->beginTransaction();
    try {
        // Replace all cards for this deck
        $del = $db->prepare('DELETE FROM deck_cards WHERE deck_id = ?');
        $del->execute([$deckId]);

        $ins = $db->prepare(
            'INSERT INTO deck_cards (deck_id, scryfall_id, card_name, quantity, is_commander, is_proxy)
             VALUES (?, ?, ?, ?, ?, ?)'
        );

        foreach ($cards as $card) {
            $cardName    = trim($card['card_name'] ?? '');
            $scryfallId  = $card['scryfall_id'] ?? null;
            $quantity    = max(1, (int) ($card['quantity'] ?? 1));
            $isCommander = empty($card['is_commander']) ? 0 : 1;
            $isProxy     = empty($card['is_proxy']) ? 0 : 1;

            if (!$cardName) continue;

            $ins->execute([$deckId, $scryfallId ?: null, $cardName, $quantity, $isCommander, $isProxy]);
        }

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        sendError('Failed to save cards: ' . $e->getMessage(), 500);
    }

    sendJSON(['success' => true, 'deck_id' => $deckId], 201);
}

// DELETE ?deck_id=<id> — remove all cards from a deck
elseif ($method === 'DELETE') {
    $deckId = isset($_GET['deck_id']) ? (int) $_GET['deck_id'] : 0;
    if (!$deckId) {
        sendError('deck_id is required');
    }

    $db   = getDB();
    $stmt = $db->prepare('DELETE FROM deck_cards WHERE deck_id = ?');
    $stmt->execute([$deckId]);

    sendJSON(['success' => true]);
}

else {
    sendError('Method not allowed', 405);
}
