<?php
require_once 'config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$playerId = isset($_GET['player_id']) ? (int)$_GET['player_id'] : null;

switch ($method) {
    case 'GET':
        if ($id) {
            // Get single deck with player info and stats
            $stmt = $pdo->prepare('
                SELECT
                    d.*,
                    p.name as player_name,
                    COUNT(DISTINCT gr.game_id) as total_games,
                    COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) as wins,
                    ROUND(
                        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
                        NULLIF(COUNT(DISTINCT gr.game_id), 0),
                        1
                    ) as win_rate,
                    ROUND(AVG(gr.finish_position), 2) as avg_finish_position
                FROM decks d
                JOIN players p ON d.player_id = p.id
                LEFT JOIN game_results gr ON gr.deck_id = d.id
                WHERE d.id = ?
                GROUP BY d.id
            ');
            $stmt->execute([$id]);
            $deck = $stmt->fetch();

            if (!$deck) {
                sendError('Deck not found', 404);
            }
            sendJSON($deck);
        } elseif ($playerId) {
            // Get all decks for a player
            $stmt = $pdo->prepare('
                SELECT
                    d.*,
                    p.name as player_name,
                    COUNT(DISTINCT gr.game_id) as total_games,
                    COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) as wins
                FROM decks d
                JOIN players p ON d.player_id = p.id
                LEFT JOIN game_results gr ON gr.deck_id = d.id
                WHERE d.player_id = ?
                GROUP BY d.id
                ORDER BY d.name ASC
            ');
            $stmt->execute([$playerId]);
            sendJSON($stmt->fetchAll());
        } else {
            // Get all decks with player info
            $stmt = $pdo->query('
                SELECT
                    d.*,
                    p.name as player_name,
                    COUNT(DISTINCT gr.game_id) as total_games,
                    COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) as wins,
                    ROUND(
                        COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 /
                        NULLIF(COUNT(DISTINCT gr.game_id), 0),
                        1
                    ) as win_rate
                FROM decks d
                JOIN players p ON d.player_id = p.id
                LEFT JOIN game_results gr ON gr.deck_id = d.id
                GROUP BY d.id
                ORDER BY d.name ASC
            ');
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

        $colors = isset($data['colors']) ? strtoupper(trim($data['colors'])) : '';

        $stmt = $pdo->prepare('
            INSERT INTO decks (player_id, name, commander, colors)
            VALUES (?, ?, ?, ?)
        ');
        $stmt->execute([
            (int)$data['player_id'],
            trim($data['name']),
            trim($data['commander']),
            $colors
        ]);

        sendJSON([
            'id' => (int)$pdo->lastInsertId(),
            'player_id' => (int)$data['player_id'],
            'name' => trim($data['name']),
            'commander' => trim($data['commander']),
            'colors' => $colors,
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
            $updates[] = 'colors = ?';
            $params[] = strtoupper(trim($data['colors']));
        }
        if (isset($data['player_id'])) {
            $updates[] = 'player_id = ?';
            $params[] = (int)$data['player_id'];
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
