<?php
// One-time use: creates the first admin account
// DELETE THIS FILE after bootstrapping!
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$pdo = getAuthDB();

// Only works if no users exist
$stmt = $pdo->query('SELECT COUNT(*) as count FROM auth_users');
$count = $stmt->fetch()['count'];

if ($count > 0) {
    sendError('Bootstrap already completed. Delete this file.', 403);
}

$data = getJSONInput();

if (empty($data['username']) || empty($data['password']) || empty($data['display_name'])) {
    sendError('Username, password, and display_name are required');
}

if (strlen($data['password']) < 8) {
    sendError('Password must be at least 8 characters');
}

$passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);

$stmt = $pdo->prepare('INSERT INTO auth_users (username, display_name, password_hash, role) VALUES (?, ?, ?, ?)');
$stmt->execute([
    trim($data['username']),
    trim($data['display_name']),
    $passwordHash,
    'admin'
]);

$userId = (int)$pdo->lastInsertId();

$user = [
    'id' => $userId,
    'username' => trim($data['username']),
    'display_name' => trim($data['display_name']),
    'role' => 'admin',
];

$token = createToken($user);

sendJSON([
    'message' => 'Admin account created. DELETE bootstrap.php now!',
    'token' => $token,
    'user' => $user,
], 201);
