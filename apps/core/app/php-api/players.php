<?php
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
requireAuth();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

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
            $stmt = $pdo->query('
                SELECT
                    p.*,
                    COUNT(DISTINCT gr.game_id) as total_games,
                    COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) as wins,
                    ROUND(
                        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
                        NULLIF(COUNT(DISTINCT gr.game_id), 0),
                        1
                    ) as win_rate
                FROM players p
                LEFT JOIN game_results gr ON gr.player_id = p.id
                GROUP BY p.id
                ORDER BY p.name ASC
            ');
            sendJSON($stmt->fetchAll());
        }
        break;

    case 'POST':
        $data = getJSONInput();

        if (empty($data['name'])) {
            sendError('Name is required');
        }

        $stmt = $pdo->prepare('INSERT INTO players (name) VALUES (?)');
        $stmt->execute([trim($data['name'])]);

        sendJSON([
            'id' => (int)$pdo->lastInsertId(),
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
            $params[] = $data['user_id'] !== null ? (int)$data['user_id'] : null;
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
