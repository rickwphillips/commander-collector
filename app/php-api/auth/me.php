<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$user = requireAuth();

// Fetch fresh user data from DB
$pdo = getAuthDB();
$stmt = $pdo->prepare('SELECT id, username, display_name, role, is_active, created_at, last_login FROM auth_users WHERE id = ? AND is_active = TRUE');
$stmt->execute([$user['sub']]);
$dbUser = $stmt->fetch();

if (!$dbUser) {
    sendError('User not found or inactive', 401);
}

sendJSON([
    'user' => [
        'id' => (int)$dbUser['id'],
        'username' => $dbUser['username'],
        'display_name' => $dbUser['display_name'],
        'role' => $dbUser['role'],
        'created_at' => $dbUser['created_at'],
        'last_login' => $dbUser['last_login'],
    ],
]);
