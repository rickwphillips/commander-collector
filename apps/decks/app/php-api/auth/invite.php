<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/middleware.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        // Generate invite code - admin only
        $user = requireAdmin();

        $data = getJSONInput();

        // Default 7 day expiration, or custom
        $expiresIn = isset($data['expires_in_days']) ? (int)$data['expires_in_days'] : 7;
        $expiresAt = date('Y-m-d H:i:s', time() + ($expiresIn * 24 * 60 * 60));

        // Generate random code
        $code = bin2hex(random_bytes(8)); // 16-char hex string

        $pdo = getAuthDB();
        $stmt = $pdo->prepare('INSERT INTO auth_invite_codes (code, created_by, expires_at) VALUES (?, ?, ?)');
        $stmt->execute([$code, $user['sub'], $expiresAt]);

        sendJSON([
            'code' => $code,
            'expires_at' => $expiresAt,
            'link' => 'https://rickwphillips.com/app/register/?code=' . $code,
        ], 201);
        break;

    case 'GET':
        // List invite codes - admin only
        $user = requireAdmin();

        $pdo = getAuthDB();
        $stmt = $pdo->query('
            SELECT
                ic.*,
                creator.username as created_by_username,
                used_user.username as used_by_username
            FROM auth_invite_codes ic
            JOIN auth_users creator ON ic.created_by = creator.id
            LEFT JOIN auth_users used_user ON ic.used_by = used_user.id
            ORDER BY ic.created_at DESC
        ');
        sendJSON($stmt->fetchAll());
        break;

    default:
        sendError('Method not allowed', 405);
}
