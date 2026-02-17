<?php
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
$user = requireAuth();

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;
$shareCode = isset($_GET['share_code']) ? trim($_GET['share_code']) : null;

$validSections = [
    'overall', 'topPlayers', 'topDecks', 'topCommanders',
    'h2h', 'multiplayer', 'twoHg', 'colorMeta',
    'podSize', 'playerStreaks', 'deckStreaks'
];

function resolveOwnerName($userId) {
    try {
        $authDb = getAuthDB();
        $stmt = $authDb->prepare('SELECT display_name FROM auth_users WHERE id = ?');
        $stmt->execute([$userId]);
        $row = $stmt->fetch();
        return $row ? $row['display_name'] : 'Unknown';
    } catch (Exception $e) {
        return 'Unknown';
    }
}

function formatPanel($row) {
    $sections = $row['sections'];
    if (is_string($sections)) {
        $sections = json_decode($sections, true) ?? [];
    }
    return [
        'id' => (int)$row['id'],
        'user_id' => (int)$row['user_id'],
        'name' => $row['name'],
        'sections' => $sections,
        'is_shared' => (bool)$row['is_shared'],
        'share_code' => $row['share_code'],
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'],
        'owner_name' => $row['owner_name'] ?? null,
    ];
}

switch ($method) {
    case 'GET':
        if ($shareCode) {
            // Lookup shared panel by share code
            $stmt = $pdo->prepare('SELECT * FROM stat_panels WHERE share_code = ? AND is_shared = 1');
            $stmt->execute([$shareCode]);
            $panel = $stmt->fetch();
            if (!$panel) {
                sendError('Panel not found', 404);
            }
            $panel['owner_name'] = resolveOwnerName($panel['user_id']);
            sendJSON(formatPanel($panel));
        } elseif ($id) {
            // Get single panel (must be owner)
            $stmt = $pdo->prepare('SELECT * FROM stat_panels WHERE id = ? AND user_id = ?');
            $stmt->execute([$id, $user['sub']]);
            $panel = $stmt->fetch();
            if (!$panel) {
                sendError('Panel not found', 404);
            }
            sendJSON(formatPanel($panel));
        } else {
            // Get all: own panels + shared panels from others
            $ownStmt = $pdo->prepare('SELECT * FROM stat_panels WHERE user_id = ? ORDER BY created_at DESC');
            $ownStmt->execute([$user['sub']]);
            $own = $ownStmt->fetchAll();

            $sharedStmt = $pdo->prepare('SELECT * FROM stat_panels WHERE is_shared = 1 AND user_id != ? ORDER BY name ASC');
            $sharedStmt->execute([$user['sub']]);
            $shared = $sharedStmt->fetchAll();

            // Resolve owner names for shared panels
            $ownerCache = [];
            foreach ($shared as &$panel) {
                $uid = $panel['user_id'];
                if (!isset($ownerCache[$uid])) {
                    $ownerCache[$uid] = resolveOwnerName($uid);
                }
                $panel['owner_name'] = $ownerCache[$uid];
            }
            unset($panel);

            sendJSON([
                'own' => array_map('formatPanel', $own),
                'shared' => array_map('formatPanel', $shared),
            ]);
        }
        break;

    case 'POST':
        $data = getJSONInput();

        if (empty($data['name'])) {
            sendError('Panel name is required');
        }
        if (empty($data['sections']) || !is_array($data['sections'])) {
            sendError('At least one section is required');
        }

        // Validate section IDs
        foreach ($data['sections'] as $s) {
            if (!in_array($s, $validSections, true)) {
                sendError("Invalid section: $s");
            }
        }

        // Enforce 10-panel limit
        $countStmt = $pdo->prepare('SELECT COUNT(*) as cnt FROM stat_panels WHERE user_id = ?');
        $countStmt->execute([$user['sub']]);
        if ((int)$countStmt->fetch()['cnt'] >= 10) {
            sendError('Maximum of 10 panels allowed', 400);
        }

        $stmt = $pdo->prepare('INSERT INTO stat_panels (user_id, name, sections) VALUES (?, ?, ?)');
        $stmt->execute([
            $user['sub'],
            trim($data['name']),
            json_encode(array_values($data['sections'])),
        ]);

        $newId = (int)$pdo->lastInsertId();
        $fetch = $pdo->prepare('SELECT * FROM stat_panels WHERE id = ?');
        $fetch->execute([$newId]);
        sendJSON(formatPanel($fetch->fetch()), 201);
        break;

    case 'PUT':
        if (!$id) {
            sendError('Panel ID is required');
        }

        // Verify ownership
        $stmt = $pdo->prepare('SELECT * FROM stat_panels WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $user['sub']]);
        $panel = $stmt->fetch();
        if (!$panel) {
            sendError('Panel not found', 404);
        }

        $data = getJSONInput();
        $fields = [];
        $params = [];

        if (isset($data['name']) && !empty(trim($data['name']))) {
            $fields[] = 'name = ?';
            $params[] = trim($data['name']);
        }

        if (isset($data['sections']) && is_array($data['sections'])) {
            if (empty($data['sections'])) {
                sendError('At least one section is required');
            }
            foreach ($data['sections'] as $s) {
                if (!in_array($s, $validSections, true)) {
                    sendError("Invalid section: $s");
                }
            }
            $fields[] = 'sections = ?';
            $params[] = json_encode(array_values($data['sections']));
        }

        if (isset($data['is_shared'])) {
            $isShared = (bool)$data['is_shared'];
            $fields[] = 'is_shared = ?';
            $params[] = $isShared ? 1 : 0;

            // Generate share_code on first share
            if ($isShared && empty($panel['share_code'])) {
                $code = bin2hex(random_bytes(8));
                $fields[] = 'share_code = ?';
                $params[] = $code;
            }
        }

        if (empty($fields)) {
            sendError('No fields to update');
        }

        $params[] = $id;
        $updateStmt = $pdo->prepare('UPDATE stat_panels SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $updateStmt->execute($params);

        $fetch = $pdo->prepare('SELECT * FROM stat_panels WHERE id = ?');
        $fetch->execute([$id]);
        sendJSON(formatPanel($fetch->fetch()));
        break;

    case 'DELETE':
        if (!$id) {
            sendError('Panel ID is required');
        }

        $stmt = $pdo->prepare('DELETE FROM stat_panels WHERE id = ? AND user_id = ?');
        $stmt->execute([$id, $user['sub']]);

        if ($stmt->rowCount() === 0) {
            sendError('Panel not found', 404);
        }

        sendJSON(['success' => true]);
        break;

    default:
        sendError('Method not allowed', 405);
}
