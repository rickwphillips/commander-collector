<?php
require_once 'config.php';
require_once 'auth/middleware.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// ── GET ──────────────────────────────────────────────────────────────────────
// GET /lists              — all lists with card_count
// GET /lists?id=<id>      — single list + cards
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id) {
        $stmt = $db->prepare('SELECT id, name, description, created_at, updated_at FROM lists WHERE id = ?');
        $stmt->execute([$id]);
        $list = $stmt->fetch();
        if (!$list) sendError('List not found', 404);

        $cards = $db->prepare(
            'SELECT lc.id, lc.list_id, lc.scryfall_id, lc.card_name, lc.quantity,
                    lc.is_commander, lc.is_proxy,
                    sc.image_uri, sc.back_image_uri, sc.colors, sc.color_identity, sc.type_line, sc.mana_cost
             FROM list_cards lc
             LEFT JOIN scryfall_card_cache sc ON lc.scryfall_id = sc.scryfall_id
             WHERE lc.list_id = ?
             ORDER BY lc.is_commander DESC, lc.card_name ASC'
        );
        $cards->execute([$id]);
        $cardRows = $cards->fetchAll();

        foreach ($cardRows as &$c) {
            $c['quantity']     = (int) $c['quantity'];
            $c['is_commander'] = (int) $c['is_commander'];
            $c['is_proxy']     = (int) $c['is_proxy'];
        }

        $list['cards'] = $cardRows;
        sendJSON($list);
    }

    // All lists
    $stmt = $db->query(
        'SELECT l.id, l.name, l.description, l.created_at, l.updated_at,
                COUNT(lc.id) AS card_count
         FROM lists l
         LEFT JOIN list_cards lc ON lc.list_id = l.id
         GROUP BY l.id
         ORDER BY l.updated_at DESC'
    );
    $lists = $stmt->fetchAll();
    foreach ($lists as &$l) {
        $l['card_count'] = (int) $l['card_count'];
    }
    sendJSON($lists);
}

// ── POST ─────────────────────────────────────────────────────────────────────
// POST /lists — create list
// Body: { name, description?, cards? }
//
// POST /lists?action=detach_deck — detach deck's card list, save as new list
// Body: { deck_id, name }
//
// POST /lists?action=attach_deck — attach list to deck (copies cards into deck_cards)
// Body: { list_id, deck_id }
elseif ($method === 'POST') {
    $action = $_GET['action'] ?? '';
    $input  = getJSONInput();

    if ($action === 'detach_deck') {
        $deckId = (int) ($input['deck_id'] ?? 0);
        $name   = trim($input['name'] ?? '');
        if (!$deckId)  sendError('deck_id required');
        if (!$name)    sendError('name required');

        // Verify deck exists
        $chk = $db->prepare('SELECT id FROM decks WHERE id = ?');
        $chk->execute([$deckId]);
        if (!$chk->fetch()) sendError('Deck not found', 404);

        $db->beginTransaction();
        try {
            // Create list
            $ins = $db->prepare('INSERT INTO lists (name) VALUES (?)');
            $ins->execute([$name]);
            $listId = (int) $db->lastInsertId();

            // Copy deck_cards → list_cards
            $copy = $db->prepare(
                'INSERT INTO list_cards (list_id, scryfall_id, card_name, quantity, is_commander, is_proxy)
                 SELECT ?, scryfall_id, card_name, quantity, is_commander, is_proxy
                 FROM deck_cards WHERE deck_id = ?'
            );
            $copy->execute([$listId, $deckId]);

            // Remove deck's cards
            $del = $db->prepare('DELETE FROM deck_cards WHERE deck_id = ?');
            $del->execute([$deckId]);

            $db->commit();
            sendJSON(['success' => true, 'list_id' => $listId], 201);
        } catch (Exception $e) {
            $db->rollBack();
            sendError('Failed to detach: ' . $e->getMessage(), 500);
        }
    }

    if ($action === 'attach_deck') {
        $listId = (int) ($input['list_id'] ?? 0);
        $deckId = (int) ($input['deck_id'] ?? 0);
        if (!$listId) sendError('list_id required');
        if (!$deckId) sendError('deck_id required');

        // Verify both exist
        $chkL = $db->prepare('SELECT id FROM lists WHERE id = ?');
        $chkL->execute([$listId]);
        if (!$chkL->fetch()) sendError('List not found', 404);

        $chkD = $db->prepare('SELECT id FROM decks WHERE id = ?');
        $chkD->execute([$deckId]);
        if (!$chkD->fetch()) sendError('Deck not found', 404);

        $db->beginTransaction();
        try {
            // Replace deck cards with list cards
            $del = $db->prepare('DELETE FROM deck_cards WHERE deck_id = ?');
            $del->execute([$deckId]);

            $copy = $db->prepare(
                'INSERT INTO deck_cards (deck_id, scryfall_id, card_name, quantity, is_commander, is_proxy)
                 SELECT ?, scryfall_id, card_name, quantity, is_commander, is_proxy
                 FROM list_cards WHERE list_id = ?'
            );
            $copy->execute([$deckId, $listId]);

            $db->commit();
            sendJSON(['success' => true]);
        } catch (Exception $e) {
            $db->rollBack();
            sendError('Failed to attach: ' . $e->getMessage(), 500);
        }
    }

    // Create list (with optional cards)
    $name        = trim($input['name'] ?? '');
    $description = trim($input['description'] ?? '');
    $cards       = $input['cards'] ?? [];

    if (!$name) sendError('name required');

    $db->beginTransaction();
    try {
        $ins = $db->prepare('INSERT INTO lists (name, description) VALUES (?, ?)');
        $ins->execute([$name, $description ?: null]);
        $listId = (int) $db->lastInsertId();

        if (!empty($cards)) {
            $cardIns = $db->prepare(
                'INSERT INTO list_cards (list_id, scryfall_id, card_name, quantity, is_commander, is_proxy)
                 VALUES (?, ?, ?, ?, ?, ?)'
            );
            foreach ($cards as $card) {
                $cardName    = trim($card['card_name'] ?? '');
                $scryfallId  = $card['scryfall_id'] ?? null;
                $quantity    = max(1, (int) ($card['quantity'] ?? 1));
                $isCommander = empty($card['is_commander']) ? 0 : 1;
                $isProxy     = empty($card['is_proxy']) ? 0 : 1;
                if (!$cardName) continue;
                $cardIns->execute([$listId, $scryfallId ?: null, $cardName, $quantity, $isCommander, $isProxy]);
            }
        }

        $db->commit();
        sendJSON(['success' => true, 'list_id' => $listId], 201);
    } catch (Exception $e) {
        $db->rollBack();
        sendError('Failed to create list: ' . $e->getMessage(), 500);
    }
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
// PATCH /lists?id=<id> — update list name/description
// Body: { name?, description?, cards? }
elseif ($method === 'PATCH') {
    $id    = (int) ($_GET['id'] ?? 0);
    $input = getJSONInput();
    if (!$id) sendError('id required');

    $chk = $db->prepare('SELECT id FROM lists WHERE id = ?');
    $chk->execute([$id]);
    if (!$chk->fetch()) sendError('List not found', 404);

    if (isset($input['name']) || isset($input['description'])) {
        $fields = [];
        $params = [];
        if (isset($input['name'])) {
            $fields[] = 'name = ?';
            $params[] = trim($input['name']);
        }
        if (isset($input['description'])) {
            $fields[] = 'description = ?';
            $params[] = trim($input['description']) ?: null;
        }
        $params[] = $id;
        $db->prepare('UPDATE lists SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);
    }

    if (isset($input['cards'])) {
        $db->beginTransaction();
        try {
            $del = $db->prepare('DELETE FROM list_cards WHERE list_id = ?');
            $del->execute([$id]);
            $ins = $db->prepare(
                'INSERT INTO list_cards (list_id, scryfall_id, card_name, quantity, is_commander, is_proxy)
                 VALUES (?, ?, ?, ?, ?, ?)'
            );
            foreach ($input['cards'] as $card) {
                $cardName    = trim($card['card_name'] ?? '');
                $scryfallId  = $card['scryfall_id'] ?? null;
                $quantity    = max(1, (int) ($card['quantity'] ?? 1));
                $isCommander = empty($card['is_commander']) ? 0 : 1;
                $isProxy     = empty($card['is_proxy']) ? 0 : 1;
                if (!$cardName) continue;
                $ins->execute([$id, $scryfallId ?: null, $cardName, $quantity, $isCommander, $isProxy]);
            }
            $db->commit();
        } catch (Exception $e) {
            $db->rollBack();
            sendError('Failed to save cards: ' . $e->getMessage(), 500);
        }
    }

    sendJSON(['success' => true]);
}

// ── DELETE ────────────────────────────────────────────────────────────────────
// DELETE /lists?id=<id>
elseif ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if (!$id) sendError('id required');

    $stmt = $db->prepare('DELETE FROM lists WHERE id = ?');
    $stmt->execute([$id]);
    sendJSON(['success' => true]);
}

else {
    sendError('Method not allowed', 405);
}
