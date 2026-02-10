<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$pdo = getDB();
$stmt = $pdo->query('SELECT id, name FROM players WHERE user_id IS NULL ORDER BY name ASC');
sendJSON($stmt->fetchAll());
