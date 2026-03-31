<?php
require_once 'config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($method) {
    case 'GET':
        // Return all releases with their changes, ordered by sort_order DESC
        $releases = $pdo->query(
            'SELECT id, version, date, title FROM changelog_releases ORDER BY sort_order DESC'
        )->fetchAll();

        $changeStmt = $pdo->prepare(
            'SELECT type, text FROM changelog_changes WHERE release_id = ? ORDER BY sort_order'
        );

        foreach ($releases as &$release) {
            $changeStmt->execute([$release['id']]);
            $release['changes'] = $changeStmt->fetchAll();
            unset($release['id']); // Don't expose internal ID
        }

        sendJSON($releases);
        break;

    case 'POST':
        // Create a new release with changes
        // Requires: { version, date, title, changes: [{ type, text }] }
        $input = getJSONInput();
        if (empty($input['version']) || empty($input['date']) || empty($input['title'])) {
            sendError('version, date, and title are required');
        }

        $pdo->beginTransaction();
        try {
            // Get the highest current sort_order and add 1
            $maxSort = $pdo->query('SELECT COALESCE(MAX(sort_order), 0) FROM changelog_releases')->fetchColumn();

            $stmt = $pdo->prepare(
                'INSERT INTO changelog_releases (version, date, title, sort_order) VALUES (?, ?, ?, ?)'
            );
            $stmt->execute([$input['version'], $input['date'], $input['title'], $maxSort + 1]);
            $releaseId = $pdo->lastInsertId();

            if (!empty($input['changes'])) {
                $changeStmt = $pdo->prepare(
                    'INSERT INTO changelog_changes (release_id, type, text, sort_order) VALUES (?, ?, ?, ?)'
                );
                foreach ($input['changes'] as $i => $change) {
                    $changeStmt->execute([$releaseId, $change['type'], $change['text'], $i]);
                }
            }

            $pdo->commit();
            sendJSON(['version' => $input['version']], 201);
        } catch (Exception $e) {
            $pdo->rollBack();
            sendError('Failed to create release: ' . $e->getMessage(), 500);
        }
        break;

    case 'PUT':
        // Update an existing release by version
        // Requires: { version, date?, title?, changes?: [{ type, text }] }
        $input = getJSONInput();
        if (empty($input['version'])) {
            sendError('version is required');
        }

        $release = $pdo->prepare('SELECT id FROM changelog_releases WHERE version = ?');
        $release->execute([$input['version']]);
        $row = $release->fetch();
        if (!$row) sendError('Release not found', 404);

        $pdo->beginTransaction();
        try {
            $updates = [];
            $params = [];
            if (isset($input['date'])) { $updates[] = 'date = ?'; $params[] = $input['date']; }
            if (isset($input['title'])) { $updates[] = 'title = ?'; $params[] = $input['title']; }

            if ($updates) {
                $params[] = $row['id'];
                $pdo->prepare('UPDATE changelog_releases SET ' . implode(', ', $updates) . ' WHERE id = ?')
                    ->execute($params);
            }

            if (isset($input['changes'])) {
                $pdo->prepare('DELETE FROM changelog_changes WHERE release_id = ?')->execute([$row['id']]);
                $changeStmt = $pdo->prepare(
                    'INSERT INTO changelog_changes (release_id, type, text, sort_order) VALUES (?, ?, ?, ?)'
                );
                foreach ($input['changes'] as $i => $change) {
                    $changeStmt->execute([$row['id'], $change['type'], $change['text'], $i]);
                }
            }

            $pdo->commit();
            sendJSON(['updated' => true]);
        } catch (Exception $e) {
            $pdo->rollBack();
            sendError('Failed to update release: ' . $e->getMessage(), 500);
        }
        break;

    case 'DELETE':
        // Delete a release by version
        $version = $_GET['version'] ?? null;
        if (!$version) sendError('version query param required');

        $stmt = $pdo->prepare('DELETE FROM changelog_releases WHERE version = ?');
        $stmt->execute([$version]);

        if ($stmt->rowCount() === 0) sendError('Release not found', 404);
        sendJSON(['deleted' => true]);
        break;

    default:
        sendError('Method not allowed', 405);
}
