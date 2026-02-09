<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJSONInput();

// Validate required fields
if (empty($data['username']) || empty($data['password']) || empty($data['display_name']) || empty($data['invite_code'])) {
    sendError('Username, password, display name, and invite code are required');
}

$username = trim($data['username']);
$displayName = trim($data['display_name']);
$password = $data['password'];
$inviteCode = trim($data['invite_code']);

// Validate username format
if (!preg_match('/^[a-zA-Z0-9_]{3,50}$/', $username)) {
    sendError('Username must be 3-50 characters and contain only letters, numbers, and underscores');
}

// Validate password length
if (strlen($password) < 8) {
    sendError('Password must be at least 8 characters');
}

$pdo = getAuthDB();

// Validate invite code
$stmt = $pdo->prepare('SELECT * FROM auth_invite_codes WHERE code = ? AND used_by IS NULL');
$stmt->execute([$inviteCode]);
$invite = $stmt->fetch();

if (!$invite) {
    sendError('Invalid or already used invite code', 400);
}

// Check expiration
if ($invite['expires_at'] && strtotime($invite['expires_at']) < time()) {
    sendError('Invite code has expired', 400);
}

// Check username uniqueness
$stmt = $pdo->prepare('SELECT id FROM auth_users WHERE username = ?');
$stmt->execute([$username]);
if ($stmt->fetch()) {
    sendError('Username already taken');
}

// Create user
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('INSERT INTO auth_users (username, display_name, password_hash) VALUES (?, ?, ?)');
    $stmt->execute([$username, $displayName, $passwordHash]);
    $userId = (int)$pdo->lastInsertId();

    // Mark invite code as used
    $stmt = $pdo->prepare('UPDATE auth_invite_codes SET used_by = ?, used_at = CURRENT_TIMESTAMP WHERE id = ?');
    $stmt->execute([$userId, $invite['id']]);

    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    sendError('Registration failed', 500);
}

// Auto-login: generate token
$user = [
    'id' => $userId,
    'username' => $username,
    'display_name' => $displayName,
    'role' => 'user',
];
$token = createToken($user);

sendJSON([
    'token' => $token,
    'user' => $user,
], 201);
