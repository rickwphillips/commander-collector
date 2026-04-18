<?php
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
require_once __DIR__ . '/lib/sql-helpers.php';
requireAuth();

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

        $fields = ['name = ?'];
        $params = [trim($data['name'])];

        if (array_key_exists('user_id', $data)) {
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
