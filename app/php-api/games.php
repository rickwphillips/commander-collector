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
                JOIN players p ON gr.player_id = p.id
                WHERE gr.game_id = ?
                ORDER BY gr.finish_position ASC
            ');
            $resultStmt->execute([$id]);
            $game['results'] = $resultStmt->fetchAll();

            sendJSON($game);
        } else {
            // Get all games with winner info (GROUP_CONCAT handles 2HG multi-winner)
            $stmt = $pdo->query('
                SELECT
                    g.*,
                    GROUP_CONCAT(DISTINCT d.name ORDER BY d.name SEPARATOR \' & \') as winning_deck,
                    GROUP_CONCAT(DISTINCT d.commander ORDER BY d.commander SEPARATOR \' & \') as winning_commander,
                    GROUP_CONCAT(DISTINCT p.name ORDER BY p.name SEPARATOR \' & \') as winner
                FROM games g
                LEFT JOIN game_results gr ON gr.game_id = g.id AND gr.finish_position = 1
                LEFT JOIN decks d ON gr.deck_id = d.id
                LEFT JOIN players p ON gr.player_id = p.id
                GROUP BY g.id
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
                    JOIN players p ON gr.player_id = p.id
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
        $gameType = isset($data['game_type']) ? $data['game_type'] : 'standard';
        if (!in_array($gameType, ['standard', '2hg'])) {
            sendError('Invalid game type');
        }

        if (count($data['results']) < 2) {
            sendError('At least 2 players required');
        }
        if ($gameType === 'standard' && count($data['results']) > 8) {
            sendError('Maximum 8 players allowed');
        }
        if ($gameType === '2hg') {
            if (count($data['results']) !== 4) {
                sendError('2-Headed Giant requires exactly 4 players');
            }
            $team1Count = 0;
            $team2Count = 0;
            foreach ($data['results'] as $result) {
                if (!isset($result['team_number']) || !in_array($result['team_number'], [1, 2])) {
                    sendError('Each player in 2HG must be assigned to Team 1 or Team 2');
                }
                if ($result['team_number'] === 1) $team1Count++;
                else $team2Count++;
            }
            if ($team1Count !== 2 || $team2Count !== 2) {
                sendError('Each team must have exactly 2 players in 2HG');
            }
        }

        try {
            $pdo->beginTransaction();

            // Insert game
            $stmt = $pdo->prepare('
                INSERT INTO games (played_at, winning_turn, notes, game_type)
                VALUES (?, ?, ?, ?)
            ');
            $stmt->execute([
                $data['played_at'],
                $data['winning_turn'] ?? null,
                $data['notes'] ?? null,
                $gameType
            ]);
            $gameId = (int)$pdo->lastInsertId();

            // Insert results
            $resultStmt = $pdo->prepare('
                INSERT INTO game_results (game_id, deck_id, player_id, finish_position, eliminated_turn, team_number)
                VALUES (?, ?, ?, ?, ?, ?)
            ');

            foreach ($data['results'] as $result) {
                if (empty($result['deck_id']) || !isset($result['finish_position'])) {
                    throw new Exception('Invalid result data');
                }

                // Default player_id to deck owner if not provided
                $playerId = null;
                if (!empty($result['player_id'])) {
                    $playerId = (int)$result['player_id'];
                } else {
                    $deckStmt = $pdo->prepare('SELECT player_id FROM decks WHERE id = ?');
                    $deckStmt->execute([(int)$result['deck_id']]);
                    $deck = $deckStmt->fetch();
                    if (!$deck) {
                        throw new Exception('Deck not found: ' . $result['deck_id']);
                    }
                    $playerId = (int)$deck['player_id'];
                }

                $resultStmt->execute([
                    $gameId,
                    (int)$result['deck_id'],
                    $playerId,
                    (int)$result['finish_position'],
                    $result['eliminated_turn'] ?? null,
                    $result['team_number'] ?? null
                ]);
            }

            $pdo->commit();
            sendJSON(['id' => $gameId], 201);

        } catch (Exception $e) {
            $pdo->rollBack();
            sendError('Failed to create game: ' . $e->getMessage(), 500);
        }
        break;

    case 'PUT':
        if (!$id) {
            sendError('Game ID is required');
        }

        $data = getJSONInput();

        // Build dynamic update query
        $updates = [];
        $params = [];

        if (isset($data['played_at'])) {
            $updates[] = 'played_at = ?';
            $params[] = $data['played_at'];
        }
        if (array_key_exists('winning_turn', $data)) {
            $updates[] = 'winning_turn = ?';
            $params[] = $data['winning_turn'];
        }
        if (array_key_exists('notes', $data)) {
            $updates[] = 'notes = ?';
            $params[] = $data['notes'];
        }

        if (empty($updates)) {
            sendError('No fields to update');
        }

        $params[] = $id;
        $stmt = $pdo->prepare('UPDATE games SET ' . implode(', ', $updates) . ' WHERE id = ?');
        $stmt->execute($params);

        if ($stmt->rowCount() === 0) {
            sendError('Game not found', 404);
        }

        sendJSON(['success' => true]);
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
