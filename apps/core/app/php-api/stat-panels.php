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
    $config = isset($row['config']) ? (is_string($row['config']) ? json_decode($row['config'], true) : $row['config']) : null;
    return [
        'id' => (int)$row['id'],
        'user_id' => (int)$row['user_id'],
        'name' => $row['name'],
        'sections' => $sections,
        'panel_type' => $row['panel_type'] ?? 'predefined',
        'config' => $config,
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

        $panelType = $data['panel_type'] ?? 'predefined';
        if (!in_array($panelType, ['predefined', 'comparison'], true)) {
            sendError('Invalid panel_type');
        }

        $sections = [];
        $config   = null;

        if ($panelType === 'comparison') {
            // Validate comparison config
            if (empty($data['config']) || !is_array($data['config'])) {
                sendError('Comparison panel requires a config object');
            }
            $cfg = $data['config'];
            if (empty($cfg['groupBy'])) {
                sendError('config.groupBy is required');
            }
            if (empty($cfg['metrics']) || !is_array($cfg['metrics'])) {
                sendError('config.metrics must be a non-empty array');
            }
            $config = json_encode($cfg);
            $sections = [];
        } else {
            // Predefined panel validation
            if (empty($data['sections']) || !is_array($data['sections'])) {
                sendError('At least one section is required');
            }
            foreach ($data['sections'] as $s) {
                if (!in_array($s, $validSections, true)) {
                    sendError("Invalid section: $s");
                }
            }
            $sections = array_values($data['sections']);
        }

        // Enforce 10-panel limit
        $countStmt = $pdo->prepare('SELECT COUNT(*) as cnt FROM stat_panels WHERE user_id = ?');
        $countStmt->execute([$user['sub']]);
        if ((int)$countStmt->fetch()['cnt'] >= 10) {
            sendError('Maximum of 10 panels allowed', 400);
        }

        $stmt = $pdo->prepare('INSERT INTO stat_panels (user_id, name, sections, panel_type, config) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([
            $user['sub'],
            trim($data['name']),
            json_encode($sections),
            $panelType,
            $config,
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

        if (isset($data['config'])) {
            if (!is_array($data['config'])) {
                sendError('config must be an object');
            }
            if (empty($data['config']['groupBy'])) {
                sendError('config.groupBy is required');
            }
            if (empty($data['config']['metrics'])) {
                sendError('config.metrics is required');
            }
            $fields[] = 'config = ?';
            $params[] = json_encode($data['config']);
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
