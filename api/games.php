<?php
require_once 'config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

switch ($method) {
    case 'GET':
        if ($id) {
            // Get single game with results
            $stmt = $pdo->prepare('SELECT * FROM games WHERE id = ?');
            $stmt->execute([$id]);
            $game = $stmt->fetch();

            if (!$game) {
                sendError('Game not found', 404);
            }

            // Get results for this game
            $resultStmt = $pdo->prepare('
                SELECT
                    gr.*,
                    d.name as deck_name,
                    d.commander,
                    d.colors,
                    p.name as player_name
                FROM game_results gr
                JOIN decks d ON gr.deck_id = d.id
                JOIN players p ON d.player_id = p.id
                WHERE gr.game_id = ?
                ORDER BY gr.finish_position ASC
            ');
            $resultStmt->execute([$id]);
            $game['results'] = $resultStmt->fetchAll();

            sendJSON($game);
        } else {
            // Get all games with winner info
            $stmt = $pdo->query('
                SELECT
                    g.*,
                    d.name as winning_deck,
                    d.commander as winning_commander,
                    p.name as winner
                FROM games g
                LEFT JOIN game_results gr ON gr.game_id = g.id AND gr.finish_position = 1
                LEFT JOIN decks d ON gr.deck_id = d.id
                LEFT JOIN players p ON d.player_id = p.id
                ORDER BY g.played_at DESC, g.id DESC
            ');
            $games = $stmt->fetchAll();

            // Get results for each game
            foreach ($games as &$game) {
                $resultStmt = $pdo->prepare('
                    SELECT
                        gr.*,
                        d.name as deck_name,
                        d.commander,
                        d.colors,
                        p.name as player_name
                    FROM game_results gr
                    JOIN decks d ON gr.deck_id = d.id
                    JOIN players p ON d.player_id = p.id
                    WHERE gr.game_id = ?
                    ORDER BY gr.finish_position ASC
                ');
                $resultStmt->execute([$game['id']]);
                $game['results'] = $resultStmt->fetchAll();
            }

            sendJSON($games);
        }
        break;

    case 'POST':
        $data = getJSONInput();

        if (empty($data['played_at'])) {
            sendError('Game date is required');
        }
        if (empty($data['results']) || !is_array($data['results'])) {
            sendError('Game results are required');
        }
        if (count($data['results']) < 2) {
            sendError('At least 2 players required');
        }
        if (count($data['results']) > 4) {
            sendError('Maximum 4 players allowed');
        }

        try {
            $pdo->beginTransaction();

            // Insert game
            $stmt = $pdo->prepare('
                INSERT INTO games (played_at, winning_turn, notes)
                VALUES (?, ?, ?)
            ');
            $stmt->execute([
                $data['played_at'],
                $data['winning_turn'] ?? null,
                $data['notes'] ?? null
            ]);
            $gameId = (int)$pdo->lastInsertId();

            // Insert results
            $resultStmt = $pdo->prepare('
                INSERT INTO game_results (game_id, deck_id, finish_position, eliminated_turn)
                VALUES (?, ?, ?, ?)
            ');

            foreach ($data['results'] as $result) {
                if (empty($result['deck_id']) || !isset($result['finish_position'])) {
                    throw new Exception('Invalid result data');
                }

                $resultStmt->execute([
                    $gameId,
                    (int)$result['deck_id'],
                    (int)$result['finish_position'],
                    $result['eliminated_turn'] ?? null
                ]);
            }

            $pdo->commit();
            sendJSON(['id' => $gameId], 201);

        } catch (Exception $e) {
            $pdo->rollBack();
            sendError('Failed to create game: ' . $e->getMessage(), 500);
        }
        break;

    case 'DELETE':
        if (!$id) {
            sendError('Game ID is required');
        }

        try {
            $pdo->beginTransaction();

            // Delete results first (due to foreign key)
            $stmt = $pdo->prepare('DELETE FROM game_results WHERE game_id = ?');
            $stmt->execute([$id]);

            // Delete game
            $stmt = $pdo->prepare('DELETE FROM games WHERE id = ?');
            $stmt->execute([$id]);

            if ($stmt->rowCount() === 0) {
                $pdo->rollBack();
                sendError('Game not found', 404);
            }

            $pdo->commit();
            sendJSON(['success' => true]);

        } catch (Exception $e) {
            $pdo->rollBack();
            sendError('Failed to delete game', 500);
        }
        break;

    default:
        sendError('Method not allowed', 405);
}
