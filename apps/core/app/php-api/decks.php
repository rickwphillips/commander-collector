<?php
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
require_once __DIR__ . '/lib/sql-helpers.php';
$currentUser = requireAuth();

function colorsToFields(string $colors): array {
    $s = strtoupper(trim($colors));
    $has_w = (int)(strpos($s, 'W') !== false);
    $has_u = (int)(strpos($s, 'U') !== false);
    $has_b = (int)(strpos($s, 'B') !== false);
    $has_r = (int)(strpos($s, 'R') !== false);
    $has_g = (int)(strpos($s, 'G') !== false);
    $canonical = ($has_w ? 'W' : '') . ($has_u ? 'U' : '') . ($has_b ? 'B' : '')
               . ($has_r ? 'R' : '') . ($has_g ? 'G' : '');
    return [
        'colors' => $canonical ?: 'C',
        'has_w'  => $has_w,
        'has_u'  => $has_u,
        'has_b'  => $has_b,
        'has_r'  => $has_r,
        'has_g'  => $has_g,
    ];
}

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (string)$_GET['id'] : null;
$playerId = isset($_GET['player_id']) ? (string)$_GET['player_id'] : null;
$action = isset($_GET['action']) ? (string)$_GET['action'] : null;
$wantTrash = isset($_GET['trash']) && $_GET['trash'] !== '0';

// Decks are soft-deleted (deleted_at, v4.8.0 trash). Collection reads skip
// trashed decks; the by-id read still returns one so game history and stats
// keep resolving the deck that was played. cleanup-trash.php purges trashed
// decks that have no game results after 30 days; a deck that was ever played
// is never hard-deleted.

switch ($method) {
    case 'GET':
        $_tgD = totalGamesDistinct();
        $_w   = winsExpr();
        $_wrD = winRateDistinct();
        $_af  = avgFinishExpr();

        if ($id) {
            // Get single deck with player info and stats
            $stmt = $pdo->prepare("
                SELECT
                    d.*,
                    p.name as player_name,
                    $_tgD,
                    $_w,
                    $_wrD,
                    $_af
                FROM decks d
                JOIN players p ON d.player_id = p.id
                LEFT JOIN game_results gr ON gr.deck_id = d.id
                WHERE d.id = ?
                GROUP BY d.id
            ");
            $stmt->execute([$id]);
            $deck = $stmt->fetch();

            if (!$deck) {
                sendError('Deck not found', 404);
            }
            sendJSON(castStatFields($deck));
        } elseif ($playerId) {
            // Get all decks for a player
            $stmt = $pdo->prepare("
                SELECT
                    d.*,
                    p.name as player_name,
                    $_tgD,
                    $_w
                FROM decks d
                JOIN players p ON d.player_id = p.id
                LEFT JOIN game_results gr ON gr.deck_id = d.id
                WHERE d.player_id = ? AND d.deleted_at IS NULL
                GROUP BY d.id
                ORDER BY d.name ASC
            ");
            $stmt->execute([$playerId]);
            sendJSON(castStatRows($stmt->fetchAll()));
        } elseif ($wantTrash) {
            // Trash: the caller's soft-deleted decks (every user's for admins),
            // newest deletion first, with what a restore would bring back.
            $sql = "
                SELECT
                    d.id, d.player_id, d.name, d.commander, d.partner, d.colors, d.deleted_at,
                    p.name as player_name,
                    (SELECT COUNT(DISTINCT gr.game_id) FROM game_results gr WHERE gr.deck_id = d.id) AS total_games,
                    (SELECT COALESCE(SUM(lc.quantity), 0)
                       FROM list_cards lc
                       JOIN lists l ON l.id = lc.list_id
                       WHERE l.deck_id = d.id AND l.role = 'main' AND l.deleted_at IS NULL) AS card_count,
                    (SELECT COUNT(*) FROM lists l WHERE l.deck_id = d.id AND l.deleted_at IS NULL) AS attached_list_count
                FROM decks d
                JOIN players p ON d.player_id = p.id
                WHERE d.deleted_at IS NOT NULL" . (isAdmin($currentUser) ? '' : ' AND p.user_id = ?') . "
                ORDER BY d.deleted_at DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(isAdmin($currentUser) ? [] : [$currentUser['sub']]);
            $rows = $stmt->fetchAll();
            foreach ($rows as &$r) {
                $r['total_games'] = (int)$r['total_games'];
                $r['card_count'] = (int)$r['card_count'];
                $r['attached_list_count'] = (int)$r['attached_list_count'];
            }
            unset($r);
            sendJSON($rows);
        } else {
            // Get all decks with player info
            $stmt = $pdo->query("
                SELECT
                    d.*,
                    p.name as player_name,
                    $_tgD,
                    $_w,
                    $_wrD,
                    (SELECT COALESCE(SUM(lc.quantity), 0)
                       FROM list_cards lc
                       JOIN lists l ON l.id = lc.list_id
                       WHERE l.deck_id = d.id AND l.role = 'main' AND l.deleted_at IS NULL) AS card_count
                FROM decks d
                JOIN players p ON d.player_id = p.id
                LEFT JOIN game_results gr ON gr.deck_id = d.id
                WHERE d.deleted_at IS NULL
                GROUP BY d.id
                ORDER BY d.name ASC
            ");
            sendJSON(castStatRows($stmt->fetchAll()));
        }
        break;

    case 'POST':
        if ($action === 'restore') {
            // POST /decks?id=<uuid>&action=restore — take a deck out of the trash.
            if (!$id) {
                sendError('Deck ID is required');
            }
            $row = $pdo->prepare('SELECT id, deleted_at FROM decks WHERE id = ?');
            $row->execute([$id]);
            $deck = $row->fetch();
            if (!$deck) {
                sendError('Deck not found', 404);
            }
            if (!isAdmin($currentUser) && !userOwnsDeck($pdo, $id, $currentUser['sub'])) {
                sendError('You can only restore your own decks', 403);
            }
            if ($deck['deleted_at'] === null) {
                sendError('Deck is not in the trash', 409);
            }
            $stmt = $pdo->prepare('UPDATE decks SET deleted_at = NULL WHERE id = ?');
            $stmt->execute([$id]);
            sendJSON(['success' => true]);
        }
        if ($action !== null) {
            sendError('Unknown action', 400);
        }

        $data = getJSONInput();

        if (empty($data['player_id'])) {
            sendError('Player ID is required');
        }
        if (empty($data['name'])) {
            sendError('Deck name is required');
        }
        if (empty($data['commander'])) {
            sendError('Commander is required');
        }

        // Ownership: a deck may only be created for a player the caller owns
        // (admins may create for anyone).
        if (!isAdmin($currentUser) && !userOwnsPlayer($pdo, (string)$data['player_id'], $currentUser['sub'])) {
            sendError('You can only create decks for your own player', 403);
        }

        $colorFields = colorsToFields(isset($data['colors']) ? $data['colors'] : '');
        $partner = isset($data['partner']) && trim($data['partner']) !== '' ? trim($data['partner']) : null;

        $newDeckId = $pdo->query("SELECT UUID()")->fetchColumn();
        $stmt = $pdo->prepare('
            INSERT INTO decks (id, player_id, name, commander, partner, colors, has_w, has_u, has_b, has_r, has_g)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([
            $newDeckId,
            (string)$data['player_id'],
            trim($data['name']),
            trim($data['commander']),
            $partner,
            $colorFields['colors'],
            $colorFields['has_w'],
            $colorFields['has_u'],
            $colorFields['has_b'],
            $colorFields['has_r'],
            $colorFields['has_g'],
        ]);

        sendJSON([
            'id' => $newDeckId,
            'player_id' => (string)$data['player_id'],
            'name' => trim($data['name']),
            'commander' => trim($data['commander']),
            'partner' => $partner,
            'colors' => $colorFields['colors'],
            'has_w' => $colorFields['has_w'],
            'has_u' => $colorFields['has_u'],
            'has_b' => $colorFields['has_b'],
            'has_r' => $colorFields['has_r'],
            'has_g' => $colorFields['has_g'],
            'created_at' => date('Y-m-d H:i:s')
        ], 201);
        break;

    case 'PUT':
        if (!$id) {
            sendError('Deck ID is required');
        }

        // Ownership: must own the deck (via its player) or be admin.
        $exists = $pdo->prepare('SELECT id FROM decks WHERE id = ?');
        $exists->execute([$id]);
        if (!$exists->fetch()) {
            sendError('Deck not found', 404);
        }
        if (!isAdmin($currentUser) && !userOwnsDeck($pdo, $id, $currentUser['sub'])) {
            sendError('You can only edit your own decks', 403);
        }

        $data = getJSONInput();
        $updates = [];
        $params = [];

        if (isset($data['name'])) {
            $updates[] = 'name = ?';
            $params[] = trim($data['name']);
        }
        if (isset($data['commander'])) {
            $updates[] = 'commander = ?';
            $params[] = trim($data['commander']);
        }
        if (isset($data['colors'])) {
            $colorFields = colorsToFields($data['colors']);
            $updates[] = 'colors = ?';
            $params[] = $colorFields['colors'];
            $updates[] = 'has_w = ?';
            $params[] = $colorFields['has_w'];
            $updates[] = 'has_u = ?';
            $params[] = $colorFields['has_u'];
            $updates[] = 'has_b = ?';
            $params[] = $colorFields['has_b'];
            $updates[] = 'has_r = ?';
            $params[] = $colorFields['has_r'];
            $updates[] = 'has_g = ?';
            $params[] = $colorFields['has_g'];
        }
        if (isset($data['player_id'])) {
            // Reassigning a deck: the target player must also belong to the
            // caller (or the caller is admin), so a deck can't be handed to or
            // taken from another user's identity.
            if (!isAdmin($currentUser) && !userOwnsPlayer($pdo, (string)$data['player_id'], $currentUser['sub'])) {
                sendError('You can only assign decks to your own player', 403);
            }
            $updates[] = 'player_id = ?';
            $params[] = (string)$data['player_id'];
        }
        if (array_key_exists('partner', $data)) {
            $updates[] = 'partner = ?';
            $params[] = $data['partner'] !== null && trim($data['partner']) !== '' ? trim($data['partner']) : null;
        }

        if (empty($updates)) {
            sendError('No fields to update');
        }

        $params[] = $id;
        $stmt = $pdo->prepare('UPDATE decks SET ' . implode(', ', $updates) . ' WHERE id = ?');
        $stmt->execute($params);

        if ($stmt->rowCount() === 0) {
            sendError('Deck not found', 404);
        }

        sendJSON(['success' => true]);
        break;

    case 'DELETE':
        if (!$id) {
            sendError('Deck ID is required');
        }

        // Ownership: must own the deck (via its player) or be admin.
        $exists = $pdo->prepare('SELECT id FROM decks WHERE id = ?');
        $exists->execute([$id]);
        if (!$exists->fetch()) {
            sendError('Deck not found', 404);
        }
        if (!isAdmin($currentUser) && !userOwnsDeck($pdo, $id, $currentUser['sub'])) {
            sendError('You can only delete your own decks', 403);
        }

        // Soft delete: the row and its game results stay so games and stats
        // keep their history. Restore with POST ?id=&action=restore.
        $stmt = $pdo->prepare('UPDATE decks SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL');
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            sendError('Deck is already in the trash', 409);
        }

        sendJSON(['success' => true]);
        break;

    default:
        sendError('Method not allowed', 405);
}
