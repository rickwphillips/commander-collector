<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendError('Method not allowed', 405);
}

$user = requireAuth();
$data = getJSONInput();

if (empty($data['current_password']) || empty($data['new_password'])) {
    sendError('Current password and new password are required');
}

if (strlen($data['new_password']) < 8) {
    sendError('New password must be at least 8 characters');
}

$pdo = getAuthDB();

// Fetch current password hash
$stmt = $pdo->prepare('SELECT password_hash FROM auth_users WHERE id = ?');
$stmt->execute([$user['sub']]);
$dbUser = $stmt->fetch();

if (!$dbUser || !password_verify($data['current_password'], $dbUser['password_hash'])) {
    sendError('Current password is incorrect', 401);
}

// Update password
$newHash = password_hash($data['new_password'], PASSWORD_BCRYPT);
$stmt = $pdo->prepare('UPDATE auth_users SET password_hash = ? WHERE id = ?');
$stmt->execute([$newHash, $user['sub']]);

sendJSON(['success' => true, 'message' => 'Password updated successfully']);
