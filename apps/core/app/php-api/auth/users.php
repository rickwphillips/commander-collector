<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

requireAdmin();

$pdo = getAuthDB();
$stmt = $pdo->query('SELECT id, username, display_name, role FROM auth_users WHERE is_active = TRUE ORDER BY username ASC');
sendJSON($stmt->fetchAll());
