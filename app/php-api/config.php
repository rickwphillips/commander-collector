<?php
// Database configuration
// Detects local dev (PHP built-in server) vs production (Bluehost)
$isLocalDev = php_sapi_name() === 'cli-server';

if ($isLocalDev) {
    // Local development - requires local MySQL
    // Run: mysql -u root < scripts/setup-local-db.sql
    define('DB_HOST', '127.0.0.1');
    define('DB_NAME', 'commander_collector');
    define('DB_USER', 'commander_dev');
    define('DB_PASS', 'devpassword');
} else {
    // Production (Bluehost)
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'rickwphi_app_commander');
    define('DB_USER', 'rickwphi_app_user');
    define('DB_PASS', 'cSewi_5Kpi6p');
}

// CORS headers for development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Create PDO connection
function getDB() {
    try {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit();
    }
}

// Helper to get JSON input
function getJSONInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

// Helper to send JSON response
function sendJSON($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

// Helper to send error response
function sendError($message, $status = 400) {
    http_response_code($status);
    echo json_encode(['error' => $message]);
    exit();
}
