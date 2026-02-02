<?php
require_once 'config.php';

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
                LEFT JOIN decks d ON d.player_id = p.id
                LEFT JOIN game_results gr ON gr.deck_id = d.id
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

        $stmt = $pdo->prepare('UPDATE players SET name = ? WHERE id = ?');
        $stmt->execute([trim($data['name']), $id]);

        if ($stmt->rowCount() === 0) {
            sendError('Player not found', 404);
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
