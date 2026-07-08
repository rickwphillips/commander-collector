<?php
require_once __DIR__ . '/jwt.php';

// Ensure secrets are loaded (config.php may have already loaded them)
if (!defined('JWT_SECRET')) {
    $isLocalDev = php_sapi_name() === 'cli-server';
    $homeDir = $_SERVER['HOME'] ?? getenv('HOME') ?: null;
    if (!$homeDir && isset($_SERVER['DOCUMENT_ROOT'])) {
        $homeDir = dirname($_SERVER['DOCUMENT_ROOT']);
    }
    $secretsFile = $isLocalDev
        ? $homeDir . '/auth_secrets_dev.php'
        : $homeDir . '/auth_secrets.php';

    if (!file_exists($secretsFile)) {
        http_response_code(500);
        echo json_encode(['error' => 'Server configuration error']);
        exit();
    }
    require_once $secretsFile;
}

// Auth database connection (separate from app database)
function getAuthDB() {
    try {
        $pdo = new PDO(
            'mysql:host=' . AUTH_DB_HOST . ';dbname=' . AUTH_DB_NAME . ';charset=utf8mb4',
            AUTH_DB_USER,
            AUTH_DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Auth database connection failed']);
        exit();
    }
}

function getBearerToken() {
    // Method 1: getallheaders()
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    // Method 2: Apache/Bluehost passes it as HTTP_AUTHORIZATION
    if (empty($auth)) {
        $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    }

    if (preg_match('/Bearer\s+(.+)$/i', $auth, $matches)) {
        return $matches[1];
    }
    return null;
}

function requireAuth() {
    $token = getBearerToken();
    if (!$token) {
        sendError('Authentication required', 401);
    }

    $payload = jwt_decode($token, JWT_SECRET);
    if (!$payload) {
        sendError('Invalid or expired token', 401);
    }

    $GLOBALS['currentUser'] = $payload;
    return $payload;
}

// Allow either a normal JWT (host board) OR an active, unexpired live-game
// session code (the unauthenticated remote panel). Used by read-only card-art
// endpoints so a phone connected by code can load art through the host without a
// login. The code is ephemeral and destroyed when the game ends.
function requireAuthOrSessionCode() {
    $token = getBearerToken();
    if ($token) {
        $payload = jwt_decode($token, JWT_SECRET);
        if ($payload) {
            $GLOBALS['currentUser'] = $payload;
            return $payload;
        }
    }

    $code = $_GET['code'] ?? '';
    if ($code !== '') {
        $pdo = getDB();
        $stmt = $pdo->prepare('
            SELECT 1
            FROM live_game_seats seat
            JOIN live_game_sessions s ON seat.session_id = s.id
            WHERE seat.code = ? AND s.is_active = 1 AND s.expires_at > NOW()
            LIMIT 1
        ');
        $stmt->execute([$code]);
        if ($stmt->fetch()) {
            return ['session_code' => $code];
        }
    }

    sendError('Authentication required', 401);
}

function generateUUID(): string {
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function requireAdmin() {
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        sendError('Admin access required', 403);
    }
    return $user;
}
