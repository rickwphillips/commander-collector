<?php
require_once 'config.php';
require_once 'auth/middleware.php';
$currentUser = requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();

// ── Helper: send a 409 Version Conflict response with current_version ──────────
function sendConflict(int $currentVersion): void {
    http_response_code(409);
    echo json_encode([
        'error'           => 'Version conflict — list was modified by another session',
        'current_version' => $currentVersion,
    ]);
    exit();
}

// ── Helper: write a list_history audit row (same transaction as caller) ────────
function writeListHistory(PDO $pdo, string $listId, string $userId, string $action, ?array $beforeSnapshot, ?array $afterSnapshot, string $source = 'manual'): void {
    $stmt = $pdo->prepare("
        INSERT INTO list_history (id, list_id, user_id, action, before_snapshot, after_snapshot, source)
        VALUES (UUID(), ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $listId,
        $userId,
        $action,
        $beforeSnapshot !== null ? json_encode($beforeSnapshot) : null,
        $afterSnapshot !== null ? json_encode($afterSnapshot) : null,
        $source,
    ]);
}

// ── Helper: count cards for a list (used for card-mutation audit snapshots) ────
function getListCardCount(PDO $pdo, string $listId): int {
    $stmt = $pdo->prepare('SELECT COALESCE(SUM(quantity), 0) FROM list_cards WHERE list_id = ?');
    $stmt->execute([$listId]);
    return (int) $stmt->fetchColumn();
}

// ── GET ──────────────────────────────────────────────────────────────────────
// GET /lists                                  — all lists with card_count
// GET /lists?id=<uuid>                        — single list + cards
// GET /lists?deck_id=<uuid>&role=main         — the deck's main list + cards
if ($method === 'GET') {
    $id     = isset($_GET['id'])      ? trim($_GET['id'])      : '';
    $deckId = isset($_GET['deck_id']) ? trim($_GET['deck_id']) : '';
    $role   = isset($_GET['role'])    ? trim($_GET['role'])    : '';

    // Resolve list id from (deck_id, role) if needed.
    if (!$id && $deckId) {
        $resolveSql = $role
            ? 'SELECT id FROM lists WHERE deck_id = ? AND role = ? AND deleted_at IS NULL LIMIT 1'
            : 'SELECT id FROM lists WHERE deck_id = ? AND deleted_at IS NULL ORDER BY (role = "main") DESC, created_at ASC LIMIT 1';
        $resolve = $db->prepare($resolveSql);
        $resolve->execute($role ? [$deckId, $role] : [$deckId]);
        $id = (string) ($resolve->fetchColumn() ?: '');
        if (!$id) sendError('No list found for that deck', 404);
    }

    if ($id) {
        $stmt = $db->prepare(
            'SELECT id, deck_id, format, role, name, description, version, created_at, updated_at
             FROM lists WHERE id = ? AND deleted_at IS NULL'
        );
        $stmt->execute([$id]);
        $list = $stmt->fetch();
        if (!$list) sendError('List not found', 404);

        // is_commander column was dropped in v5.0.0; derive it from role for response compat.
        $cards = $db->prepare(
            "SELECT lc.id, lc.list_id, lc.scryfall_id, lc.card_name, lc.quantity,
                    (lc.role = 'commander') AS is_commander, lc.is_proxy, lc.role,
                    sc.image_uri, sc.back_image_uri, sc.colors, sc.color_identity, sc.type_line, sc.mana_cost
             FROM list_cards lc
             LEFT JOIN scryfall_card_cache sc ON lc.scryfall_id = sc.scryfall_id
             WHERE lc.list_id = ?
             ORDER BY (lc.role = 'commander') DESC, lc.card_name ASC"
        );
        $cards->execute([$id]);
        $cardRows = $cards->fetchAll();

        foreach ($cardRows as &$c) {
            $c['quantity']     = (int) $c['quantity'];
            $c['is_commander'] = (int) $c['is_commander'];
            $c['is_proxy']     = (int) $c['is_proxy'];
        }

        $list['version'] = (int) $list['version'];
        $list['cards'] = $cardRows;
        sendJSON($list);
    }

    // All lists (non-deleted)
    $stmt = $db->query(
        'SELECT l.id, l.deck_id, l.format, l.role, l.name, l.description, l.version, l.created_at, l.updated_at,
                COALESCE(SUM(lc.quantity), 0) AS card_count
         FROM lists l
         LEFT JOIN list_cards lc ON lc.list_id = l.id
         WHERE l.deleted_at IS NULL
         GROUP BY l.id
         ORDER BY l.updated_at DESC'
    );
    $lists = $stmt->fetchAll();
    foreach ($lists as &$l) {
        $l['card_count'] = (int) $l['card_count'];
        $l['version']    = (int) $l['version'];
    }
    sendJSON($lists);
}

// ── POST ─────────────────────────────────────────────────────────────────────
// POST /lists                        — create list
// Body: { name, description?, format?, role?, cards? }
//
// POST /lists?id=<uuid>&action=detach_deck — detach list from its deck (relationship only)
// Phase 2.2 cutover: relationship-only attach/detach replaces row-copy attach/detach (was deck_cards copy)
//
// POST /lists?id=<uuid>&action=attach_deck — attach standalone list to a deck (relationship only)
// Body: { deck_id: '<uuid>' }
//
// POST /lists?id=<uuid>&action=restore — un-soft-delete a list
elseif ($method === 'POST') {
    $action  = $_GET['action'] ?? '';
    $listId  = isset($_GET['id']) ? trim($_GET['id']) : '';
    $input   = getJSONInput();
    $userId  = $currentUser['sub'];

    // ── detach_deck ──────────────────────────────────────────────────────────
    if ($action === 'detach_deck') {
        if (!$listId) sendError('id required');

        // 1. Verify list exists and is not soft-deleted
        $chkL = $db->prepare('SELECT id, deck_id, version FROM lists WHERE id = ? AND deleted_at IS NULL');
        $chkL->execute([$listId]);
        $listRow = $chkL->fetch();
        if (!$listRow) sendError('List not found', 404);

        // 2. If already standalone, return idempotent success
        if ($listRow['deck_id'] === null) {
            sendJSON(['success' => true, 'noop' => true]);
        }

        $oldDeckId = $listRow['deck_id'];

        // Optional optimistic concurrency
        $clientVersion = isset($input['version']) ? (int) $input['version'] : null;

        $db->beginTransaction();
        try {
            if ($clientVersion !== null) {
                $upd = $db->prepare(
                    'UPDATE lists SET deck_id = NULL, version = version + 1
                     WHERE id = ? AND version = ?'
                );
                $upd->execute([$listId, $clientVersion]);
                if ($upd->rowCount() === 0) {
                    $db->rollBack();
                    $cur = $db->prepare('SELECT version FROM lists WHERE id = ?');
                    $cur->execute([$listId]);
                    $cv = (int) $cur->fetchColumn();
                    sendConflict($cv);
                }
            } else {
                $upd = $db->prepare('UPDATE lists SET deck_id = NULL, version = version + 1 WHERE id = ?');
                $upd->execute([$listId]);
            }

            // Fetch new version
            $verStmt = $db->prepare('SELECT version FROM lists WHERE id = ?');
            $verStmt->execute([$listId]);
            $newVersion = (int) $verStmt->fetchColumn();

            // Phase 2.2 cutover: relationship-only detach (was: copy cards out of deck_cards).
            // AUDIT: action='detach'
            writeListHistory(
                $db, $listId, $userId, 'detach',
                ['deck_id' => $oldDeckId],
                ['deck_id' => null]
            );

            $db->commit();
            sendJSON(['success' => true, 'version' => $newVersion]);
        } catch (Exception $e) {
            $db->rollBack();
            sendError('Failed to detach: ' . $e->getMessage(), 500);
        }
    }

    // ── attach_deck ──────────────────────────────────────────────────────────
    if ($action === 'attach_deck') {
        if (!$listId) sendError('id required');
        $deckId = trim($input['deck_id'] ?? '');
        if (!$deckId) sendError('deck_id required');

        // 1. Verify list exists and is not soft-deleted
        $chkL = $db->prepare('SELECT id, deck_id, role, version FROM lists WHERE id = ? AND deleted_at IS NULL');
        $chkL->execute([$listId]);
        $listRow = $chkL->fetch();
        if (!$listRow) sendError('List not found', 404);

        // 2. Verify deck exists and is not soft-deleted
        $chkD = $db->prepare('SELECT id FROM decks WHERE id = ? AND deleted_at IS NULL');
        $chkD->execute([$deckId]);
        if (!$chkD->fetch()) sendError('Deck not found', 404);

        // 3. Verify the list is currently standalone
        if ($listRow['deck_id'] !== null) {
            sendError('List is already attached to deck ' . $listRow['deck_id'] . '. Detach first if you want to move it.', 409);
        }

        // 4. Role conflict check: if both this list and the deck already have a 'main' list, conflict
        if ($listRow['role'] === 'main') {
            $roleChk = $db->prepare(
                "SELECT COUNT(*) FROM lists WHERE deck_id = ? AND role = 'main' AND deleted_at IS NULL"
            );
            $roleChk->execute([$deckId]);
            if ((int) $roleChk->fetchColumn() > 0) {
                sendError(
                    "Role conflict: this list has role='main' but the target deck already has a 'main' list. " .
                    "Pick a different role for one of them before attaching.",
                    409
                );
            }
        }

        // Optional optimistic concurrency
        $clientVersion = isset($input['version']) ? (int) $input['version'] : null;

        $db->beginTransaction();
        try {
            if ($clientVersion !== null) {
                $upd = $db->prepare(
                    'UPDATE lists SET deck_id = ?, version = version + 1
                     WHERE id = ? AND version = ?'
                );
                $upd->execute([$deckId, $listId, $clientVersion]);
                if ($upd->rowCount() === 0) {
                    $db->rollBack();
                    $cur = $db->prepare('SELECT version FROM lists WHERE id = ?');
                    $cur->execute([$listId]);
                    $cv = (int) $cur->fetchColumn();
                    sendConflict($cv);
                }
            } else {
                $upd = $db->prepare('UPDATE lists SET deck_id = ?, version = version + 1 WHERE id = ?');
                $upd->execute([$deckId, $listId]);
            }

            // Fetch new version
            $verStmt = $db->prepare('SELECT version FROM lists WHERE id = ?');
            $verStmt->execute([$listId]);
            $newVersion = (int) $verStmt->fetchColumn();

            // Phase 2.2 cutover: relationship-only attach (was: copy cards into deck_cards).
            // AUDIT: action='attach'
            writeListHistory(
                $db, $listId, $userId, 'attach',
                ['deck_id' => null],
                ['deck_id' => $deckId]
            );

            $db->commit();
            sendJSON(['success' => true, 'version' => $newVersion]);
        } catch (Exception $e) {
            $db->rollBack();
            sendError('Failed to attach: ' . $e->getMessage(), 500);
        }
    }

    // ── restore ──────────────────────────────────────────────────────────────
    if ($action === 'restore') {
        if (!$listId) sendError('id required');

        $chk = $db->prepare('SELECT id, deleted_at, version FROM lists WHERE id = ?');
        $chk->execute([$listId]);
        $listRow = $chk->fetch();
        if (!$listRow) sendError('List not found', 404);

        if ($listRow['deleted_at'] === null) {
            sendJSON(['success' => true, 'noop' => true]);
        }

        $oldDeletedAt = $listRow['deleted_at'];
        $clientVersion = isset($input['version']) ? (int) $input['version'] : null;

        $db->beginTransaction();
        try {
            if ($clientVersion !== null) {
                $upd = $db->prepare(
                    'UPDATE lists SET deleted_at = NULL, version = version + 1
                     WHERE id = ? AND version = ?'
                );
                $upd->execute([$listId, $clientVersion]);
                if ($upd->rowCount() === 0) {
                    $db->rollBack();
                    $cur = $db->prepare('SELECT version FROM lists WHERE id = ?');
                    $cur->execute([$listId]);
                    $cv = (int) $cur->fetchColumn();
                    sendConflict($cv);
                }
            } else {
                $upd = $db->prepare('UPDATE lists SET deleted_at = NULL, version = version + 1 WHERE id = ?');
                $upd->execute([$listId]);
            }

            $verStmt = $db->prepare('SELECT version FROM lists WHERE id = ?');
            $verStmt->execute([$listId]);
            $newVersion = (int) $verStmt->fetchColumn();

            writeListHistory(
                $db, $listId, $userId, 'restore',
                ['deleted_at' => $oldDeletedAt],
                ['deleted_at' => null]
            );

            $db->commit();
            sendJSON(['success' => true, 'version' => $newVersion]);
        } catch (Exception $e) {
            $db->rollBack();
            sendError('Failed to restore: ' . $e->getMessage(), 500);
        }
    }

    // ── create ───────────────────────────────────────────────────────────────
    $name        = trim($input['name'] ?? '');
    $description = trim($input['description'] ?? '');
    $format      = trim($input['format'] ?? 'commander');
    $role        = trim($input['role'] ?? 'main') ?: null;
    $cards       = $input['cards'] ?? [];

    if (!$name) sendError('name required');

    $db->beginTransaction();
    try {
        // Generate UUID in PHP so we can reference it for the history write before commit.
        $newListId = $db->query('SELECT UUID()')->fetchColumn();
        $ins = $db->prepare(
            'INSERT INTO lists (id, name, description, format, role, user_id)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $ins->execute([$newListId, $name, $description ?: null, $format, $role, $userId]);

        if (!empty($cards)) {
            $cardIns = $db->prepare(
                'INSERT INTO list_cards (id, list_id, scryfall_id, card_name, quantity, role, is_proxy)
                 VALUES (UUID(), ?, ?, ?, ?, ?, ?)'
            );
            foreach ($cards as $card) {
                $cardName    = trim($card['card_name'] ?? '');
                $scryfallId  = $card['scryfall_id'] ?? null;
                $quantity    = max(1, (int) ($card['quantity'] ?? 1));
                $isCommander = empty($card['is_commander']) ? 0 : 1;
                $role        = $isCommander ? 'commander' : null;
                $isProxy     = empty($card['is_proxy']) ? 0 : 1;
                if (!$cardName) continue;
                $cardIns->execute([$newListId, $scryfallId ?: null, $cardName, $quantity, $role, $isProxy]);
            }
        }

        $afterSnap = [
            'name'        => $name,
            'description' => $description ?: null,
            'format'      => $format,
            'role'        => $role,
            'deck_id'     => null,
            'card_count'  => array_sum(array_column($cards, 'quantity')) ?: count($cards),
        ];
        writeListHistory($db, $newListId, $userId, 'create', null, $afterSnap);

        $db->commit();
        sendJSON(['success' => true, 'list_id' => $newListId], 201);
    } catch (Exception $e) {
        $db->rollBack();
        sendError('Failed to create list: ' . $e->getMessage(), 500);
    }
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
// PATCH /lists?id=<uuid>       — update list name/description/format/role and/or replace cards
// Body: { name?, description?, format?, role?, cards?, version? }
elseif ($method === 'PATCH') {
    $id    = isset($_GET['id']) ? trim($_GET['id']) : '';
    $input = getJSONInput();
    $userId = $currentUser['sub'];

    if (!$id) sendError('id required');

    $chk = $db->prepare(
        'SELECT id, deck_id, format, role, name, description, version FROM lists WHERE id = ? AND deleted_at IS NULL'
    );
    $chk->execute([$id]);
    $listRow = $chk->fetch();
    if (!$listRow) sendError('List not found', 404);

    $clientVersion = isset($input['version']) ? (int) $input['version'] : null;

    $db->beginTransaction();
    try {
        $metaChanged = false;
        $beforeSnap  = [
            'name'        => $listRow['name'],
            'description' => $listRow['description'],
            'format'      => $listRow['format'],
            'role'        => $listRow['role'],
        ];

        if (isset($input['name']) || isset($input['description']) || isset($input['format']) || isset($input['role'])) {
            $fields = ['updated_at = CURRENT_TIMESTAMP'];
            $params = [];

            if (isset($input['name'])) {
                $fields[] = 'name = ?';
                $params[] = trim($input['name']);
            }
            if (isset($input['description'])) {
                $fields[] = 'description = ?';
                $params[] = trim($input['description']) ?: null;
            }
            if (isset($input['format'])) {
                $fields[] = 'format = ?';
                $params[] = trim($input['format']);
            }
            if (isset($input['role'])) {
                $fields[] = 'role = ?';
                $params[] = trim($input['role']) ?: null;
            }

            if ($clientVersion !== null) {
                $fields[] = 'version = version + 1';
                $params[] = $id;
                $params[] = $clientVersion;
                $upd = $db->prepare(
                    'UPDATE lists SET ' . implode(', ', $fields) . ' WHERE id = ? AND version = ?'
                );
                $upd->execute($params);
                if ($upd->rowCount() === 0) {
                    $db->rollBack();
                    $cur = $db->prepare('SELECT version FROM lists WHERE id = ?');
                    $cur->execute([$id]);
                    $cv = (int) $cur->fetchColumn();
                    sendConflict($cv);
                }
            } else {
                $fields[] = 'version = version + 1';
                $params[] = $id;
                $db->prepare('UPDATE lists SET ' . implode(', ', $fields) . ' WHERE id = ?')->execute($params);
            }

            $metaChanged = true;
        }

        $cardsBefore = null;
        $cardsAfter  = null;

        if (isset($input['cards'])) {
            $cardsBefore = getListCardCount($db, $id);

            $del = $db->prepare('DELETE FROM list_cards WHERE list_id = ?');
            $del->execute([$id]);
            $ins = $db->prepare(
                'INSERT INTO list_cards (id, list_id, scryfall_id, card_name, quantity, role, is_proxy)
                 VALUES (UUID(), ?, ?, ?, ?, ?, ?)'
            );
            $totalQty = 0;
            foreach ($input['cards'] as $card) {
                $cardName    = trim($card['card_name'] ?? '');
                $scryfallId  = $card['scryfall_id'] ?? null;
                $quantity    = max(1, (int) ($card['quantity'] ?? 1));
                $isCommander = empty($card['is_commander']) ? 0 : 1;
                $role        = $isCommander ? 'commander' : null;
                $isProxy     = empty($card['is_proxy']) ? 0 : 1;
                if (!$cardName) continue;
                $ins->execute([$id, $scryfallId ?: null, $cardName, $quantity, $role, $isProxy]);
                $totalQty += $quantity;
            }
            $cardsAfter = $totalQty;

            // If no meta fields were touched, still bump version for card changes
            if (!$metaChanged) {
                if ($clientVersion !== null) {
                    $bump = $db->prepare('UPDATE lists SET version = version + 1 WHERE id = ? AND version = ?');
                    $bump->execute([$id, $clientVersion]);
                    if ($bump->rowCount() === 0) {
                        $db->rollBack();
                        $cur = $db->prepare('SELECT version FROM lists WHERE id = ?');
                        $cur->execute([$id]);
                        $cv = (int) $cur->fetchColumn();
                        sendConflict($cv);
                    }
                } else {
                    $db->prepare('UPDATE lists SET version = version + 1 WHERE id = ?')->execute([$id]);
                }
            }
        }

        // Fetch final version
        $verStmt = $db->prepare('SELECT version FROM lists WHERE id = ?');
        $verStmt->execute([$id]);
        $newVersion = (int) $verStmt->fetchColumn();

        // Audit write
        if ($metaChanged || $cardsAfter !== null) {
            $afterFields = [];
            if (isset($input['name']))        $afterFields['name']        = trim($input['name']);
            if (isset($input['description'])) $afterFields['description'] = trim($input['description']) ?: null;
            if (isset($input['format']))      $afterFields['format']      = trim($input['format']);
            if (isset($input['role']))        $afterFields['role']        = trim($input['role']) ?: null;

            $afterSnap = $metaChanged ? $afterFields : [];
            if ($cardsAfter !== null) {
                $beforeSnap['card_count'] = $cardsBefore;
                $afterSnap['card_count']  = $cardsAfter;
            }

            writeListHistory($db, $id, $userId, 'update', $beforeSnap, $afterSnap);
        }

        $db->commit();
        sendJSON(['success' => true, 'version' => $newVersion]);
    } catch (Exception $e) {
        $db->rollBack();
        sendError('Failed to update list: ' . $e->getMessage(), 500);
    }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
// DELETE /lists?id=<uuid> — soft-delete (sets deleted_at). Hard delete is not exposed.
// Query param: version=<n> for optimistic concurrency (optional).
elseif ($method === 'DELETE') {
    $id     = isset($_GET['id']) ? trim($_GET['id']) : '';
    $userId = $currentUser['sub'];

    if (!$id) sendError('id required');

    $chk = $db->prepare(
        'SELECT id, deck_id, format, role, name, description, version FROM lists WHERE id = ? AND deleted_at IS NULL'
    );
    $chk->execute([$id]);
    $listRow = $chk->fetch();
    if (!$listRow) sendError('List not found', 404);

    $clientVersion = isset($_GET['version']) ? (int) $_GET['version'] : null;

    $db->beginTransaction();
    try {
        if ($clientVersion !== null) {
            $upd = $db->prepare(
                'UPDATE lists SET deleted_at = CURRENT_TIMESTAMP, version = version + 1
                 WHERE id = ? AND version = ?'
            );
            $upd->execute([$id, $clientVersion]);
            if ($upd->rowCount() === 0) {
                $db->rollBack();
                $cur = $db->prepare('SELECT version FROM lists WHERE id = ?');
                $cur->execute([$id]);
                $cv = (int) $cur->fetchColumn();
                sendError('Version conflict — list was modified by another session', 409, ['current_version' => $cv]);
            }
        } else {
            $upd = $db->prepare(
                'UPDATE lists SET deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ?'
            );
            $upd->execute([$id]);
        }

        $beforeSnap = [
            'name'        => $listRow['name'],
            'description' => $listRow['description'],
            'format'      => $listRow['format'],
            'role'        => $listRow['role'],
            'deck_id'     => $listRow['deck_id'],
        ];
        writeListHistory($db, $id, $userId, 'soft_delete', $beforeSnap, null);

        $db->commit();
        sendJSON(['success' => true]);
    } catch (Exception $e) {
        $db->rollBack();
        sendError('Failed to delete list: ' . $e->getMessage(), 500);
    }
}

else {
    sendError('Method not allowed', 405);
}
