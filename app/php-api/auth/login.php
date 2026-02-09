<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJSONInput();

if (empty($data['username']) || empty($data['password'])) {
    sendError('Username and password are required');
}

$pdo = getAuthDB();

// Find user
$stmt = $pdo->prepare('SELECT * FROM auth_users WHERE username = ? AND is_active = TRUE');
$stmt->execute([trim($data['username'])]);
$user = $stmt->fetch();

if (!$user || !password_verify($data['password'], $user['password_hash'])) {
    sendError('Invalid username or password', 401);
}

// Update last login
$stmt = $pdo->prepare('UPDATE auth_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
$stmt->execute([$user['id']]);

// Generate token
$token = createToken($user);

sendJSON([
    'token' => $token,
    'user' => [
        'id' => (int)$user['id'],
        'username' => $user['username'],
        'display_name' => $user['display_name'],
        'role' => $user['role'],
    ],
]);
