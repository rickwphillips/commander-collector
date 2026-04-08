<?php
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
require_once __DIR__ . '/lib/sql-helpers.php';
requireAuth();

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
            sendJSON($deck);
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
                WHERE d.player_id = ?
                GROUP BY d.id
                ORDER BY d.name ASC
            ");
            $stmt->execute([$playerId]);
            sendJSON($stmt->fetchAll());
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
                GROUP BY d.id
                ORDER BY d.name ASC
            ");
            sendJSON($stmt->fetchAll());
        }
        break;

    case 'POST':
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

        $stmt = $pdo->prepare('DELETE FROM decks WHERE id = ?');
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            sendError('Deck not found', 404);
        }

        sendJSON(['success' => true]);
        break;

    default:
        sendError('Method not allowed', 405);
}
