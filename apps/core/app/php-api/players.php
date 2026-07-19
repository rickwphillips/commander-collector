<?php
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
require_once __DIR__ . '/lib/sql-helpers.php';
$currentUser = requireAuth();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (string)$_GET['id'] : null;

switch ($method) {
    case 'GET':
        if ($id) {
            // Get single player
            $stmt = $pdo->prepare('SELECT * FROM players WHERE id = ?');
            $stmt->execute([$id]);
            $player = $stmt->fetch();

            if (!$player) {
                sendError('Player not found', 404);
            }
            sendJSON($player);
        } else {
            // Get all players with stats
            $_tg = totalGamesDistinct();
            $_w  = winsExpr();
            $_wr = winRateDistinct();
            $stmt = $pdo->query("
                SELECT
                    p.*,
                    $_tg,
                    $_w,
                    $_wr
                FROM players p
                LEFT JOIN game_results gr ON gr.player_id = p.id
                WHERE p.name NOT LIKE '\\_\\_pw\\_%'
                GROUP BY p.id
                ORDER BY p.name ASC
            ");
            sendJSON($stmt->fetchAll());
        }
        break;

    case 'POST':
        $data = getJSONInput();

        if (empty($data['name'])) {
            sendError('Name is required');
        }

        $newId = $pdo->query("SELECT UUID()")->fetchColumn();
        $stmt = $pdo->prepare('INSERT INTO players (id, name) VALUES (?, ?)');
        $stmt->execute([$newId, trim($data['name'])]);

        sendJSON([
            'id' => $newId,
            'name' => trim($data['name']),
            'created_at' => date('Y-m-d H:i:s')
        ], 201);
        break;

    case 'PUT':
        if (!$id) {
            sendError('Player ID is required');
        }

        $data = getJSONInput();

        if (empty($data['name'])) {
            sendError('Name is required');
        }

        // Ownership: only the owner or an admin may edit a player. Unclaimed
        // players (user_id NULL) belong to no one and are admin-only to manage.
        $lookup = $pdo->prepare('SELECT id, user_id FROM players WHERE id = ?');
        $lookup->execute([$id]);
        $existingPlayer = $lookup->fetch();
        if (!$existingPlayer) {
            sendError('Player not found', 404);
        }
        $admin = isAdmin($currentUser);
        $owns  = $existingPlayer['user_id'] !== null && $existingPlayer['user_id'] === $currentUser['sub'];
        if (!$admin && !$owns) {
            sendError('You can only edit your own player', 403);
        }

        $fields = ['name = ?'];
        $params = [trim($data['name'])];

        if (array_key_exists('user_id', $data)) {
            // Reassigning the account link is admin-only — otherwise a user could
            // claim another account's identity (account takeover).
            if (!$admin) {
                sendError('Only an admin can reassign a player to a different account', 403);
            }
            $fields[] = 'user_id = ?';
            $params[] = $data['user_id'] !== null ? (string)$data['user_id'] : null;
        }

        $params[] = $id;
        $stmt = $pdo->prepare('UPDATE players SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->execute($params);

        if ($stmt->rowCount() === 0) {
            // Check if player exists (row may exist but values unchanged)
            $check = $pdo->prepare('SELECT id FROM players WHERE id = ?');
            $check->execute([$id]);
            if (!$check->fetch()) {
                sendError('Player not found', 404);
            }
        }

        sendJSON(['success' => true]);
        break;

    case 'DELETE':
        if (!$id) {
            sendError('Player ID is required');
        }

        // Ownership: only the owner or an admin may delete a player. Unclaimed
        // players (user_id NULL) are admin-only.
        $lookup = $pdo->prepare('SELECT id, user_id FROM players WHERE id = ?');
        $lookup->execute([$id]);
        $existingPlayer = $lookup->fetch();
        if (!$existingPlayer) {
            sendError('Player not found', 404);
        }
        if (!isAdmin($currentUser)
            && !($existingPlayer['user_id'] !== null && $existingPlayer['user_id'] === $currentUser['sub'])) {
            sendError('You can only delete your own player', 403);
        }

        $stmt = $pdo->prepare('DELETE FROM players WHERE id = ?');
        $stmt->execute([$id]);

        if ($stmt->rowCount() === 0) {
            sendError('Player not found', 404);
        }

        sendJSON(['success' => true]);
        break;

    default:
        sendError('Method not allowed', 405);
}
