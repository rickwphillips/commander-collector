<?php
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
requireAuth();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (string)$_GET['id'] : null;

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

            // Get results for each game (prepare once, execute per game)
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
            foreach ($games as &$game) {
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
            if (count($data['results']) < 4 || count($data['results']) % 2 !== 0) {
                sendError('2HG requires at least 4 players in pairs');
            }
            $teamCounts = [];
            foreach ($data['results'] as $result) {
                if (!isset($result['team_number']) || !is_numeric($result['team_number']) || (int)$result['team_number'] < 1) {
                    sendError('Each player in 2HG must be assigned to a team');
                }
                $tn = (int)$result['team_number'];
                $teamCounts[$tn] = ($teamCounts[$tn] ?? 0) + 1;
            }
            if (count($teamCounts) < 2) {
                sendError('2HG requires at least 2 teams');
            }
            foreach ($teamCounts as $count) {
                if ($count !== 2) {
                    sendError('Each team must have exactly 2 players in 2HG');
                }
            }
        }

        // Derive winning_turn: max eliminated_turn across all non-winning results
        $winningTurn = null;
        foreach ($data['results'] as $result) {
            if ((int)($result['finish_position'] ?? 0) !== 1) {
                $et = $result['eliminated_turn'] ?? null;
                if ($et !== null && $et !== '' && (int)$et > ($winningTurn ?? 0)) {
                    $winningTurn = (int)$et;
                }
            }
        }

        try {
            $pdo->beginTransaction();

            // Insert game
            $gameId = $pdo->query("SELECT UUID()")->fetchColumn();
            $stmt = $pdo->prepare('
                INSERT INTO games (id, played_at, winning_turn, notes, game_type)
                VALUES (?, ?, ?, ?, ?)
            ');
            $stmt->execute([
                $gameId,
                $data['played_at'],
                $winningTurn,
                $data['notes'] ?? null,
                $gameType
            ]);

            // Insert results (prepare statements once outside the loop)
            $resultStmt = $pdo->prepare('
                INSERT INTO game_results (id, game_id, deck_id, player_id, finish_position, eliminated_turn, team_number)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ');
            $deckStmt = $pdo->prepare('SELECT player_id FROM decks WHERE id = ?');

            foreach ($data['results'] as $result) {
                if (empty($result['deck_id']) || !isset($result['finish_position'])) {
                    throw new Exception('Invalid result data');
                }

                // Default player_id to deck owner if not provided
                $playerId = null;
                if (!empty($result['player_id'])) {
                    $playerId = (string)$result['player_id'];
                } else {
                    $deckStmt->execute([(string)$result['deck_id']]);
                    $deck = $deckStmt->fetch();
                    if (!$deck) {
                        throw new Exception('Deck not found: ' . $result['deck_id']);
                    }
                    $playerId = (string)$deck['player_id'];
                }

                $resultStmt->execute([
                    $pdo->query('SELECT UUID()')->fetchColumn(),
                    $gameId,
                    (string)$result['deck_id'],
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
            sendError('Failed to create game', 500);
        }
        break;

    case 'PUT':
        if (!$id) {
            sendError('Game ID is required');
        }

        $data = getJSONInput();

        try {
            $pdo->beginTransaction();

            // Update game fields
            $updates = [];
            $params = [];

            if (isset($data['played_at'])) {
                $updates[] = 'played_at = ?';
                $params[] = $data['played_at'];
            }
            if (array_key_exists('notes', $data)) {
                $updates[] = 'notes = ?';
                $params[] = $data['notes'];
            }
            if (isset($data['game_type'])) {
                $updates[] = 'game_type = ?';
                $params[] = $data['game_type'];
            }

            if (!empty($updates)) {
                $params[] = $id;
                $stmt = $pdo->prepare('UPDATE games SET ' . implode(', ', $updates) . ' WHERE id = ?');
                $stmt->execute($params);
            }

            // If results are provided, replace all existing results and re-derive winning_turn
            if (isset($data['results']) && is_array($data['results'])) {
                // Derive winning_turn: max eliminated_turn across all non-winning results
                $newWinningTurn = null;
                foreach ($data['results'] as $result) {
                    if ((int)($result['finish_position'] ?? 0) !== 1) {
                        $et = $result['eliminated_turn'] ?? null;
                        if ($et !== null && $et !== '' && (int)$et > ($newWinningTurn ?? 0)) {
                            $newWinningTurn = (int)$et;
                        }
                    }
                }
                $pdo->prepare('UPDATE games SET winning_turn = ? WHERE id = ?')
                    ->execute([$newWinningTurn, $id]);

                // Delete existing results
                $deleteStmt = $pdo->prepare('DELETE FROM game_results WHERE game_id = ?');
                $deleteStmt->execute([$id]);

                // Insert new results (prepare statements once outside the loop)
                $resultStmt = $pdo->prepare('
                    INSERT INTO game_results (id, game_id, deck_id, player_id, finish_position, eliminated_turn, team_number)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ');
                $deckStmt = $pdo->prepare('SELECT player_id FROM decks WHERE id = ?');

                foreach ($data['results'] as $result) {
                    if (empty($result['deck_id']) || !isset($result['finish_position'])) {
                        throw new Exception('Invalid result data');
                    }

                    $playerId = null;
                    if (!empty($result['player_id'])) {
                        $playerId = (string)$result['player_id'];
                    } else {
                        $deckStmt->execute([(string)$result['deck_id']]);
                        $deck = $deckStmt->fetch();
                        if ($deck) {
                            $playerId = (string)$deck['player_id'];
                        }
                    }

                    $resultStmt->execute([
                        $pdo->query('SELECT UUID()')->fetchColumn(),
                        $id,
                        (string)$result['deck_id'],
                        $playerId,
                        (int)$result['finish_position'],
                        $result['eliminated_turn'] ?? null,
                        $result['team_number'] ?? null
                    ]);
                }
            }

            $pdo->commit();
            sendJSON(['success' => true]);

        } catch (Exception $e) {
            $pdo->rollBack();
            sendError('Failed to update game', 500);
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
