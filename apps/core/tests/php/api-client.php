<?php
/**
 * Shared HTTP helpers for the PHP integration tests that hit the local dev API
 * (php -S on localhost:8081, see tests/php/*.test.php headers).
 *
 * Tokens are minted locally from the dev JWT secret; no SSH, no browser.
 */

require '/Users/rickphillips/auth_secrets_dev.php';

const API_BASE = 'http://localhost:8081/php-api';

function mintTestToken(string $role = 'admin', string $sub = '1', string $username = 'rick'): string {
    $b64 = fn(string $raw) => rtrim(strtr(base64_encode($raw), '+/', '-_'), '=');
    $header  = $b64(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = $b64(json_encode([
        'sub' => $sub, 'username' => $username, 'display_name' => ucfirst($username),
        'role' => $role, 'exp' => time() + 3600,
    ]));
    $sig = $b64(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$sig";
}

/**
 * One request. Returns ['status' => int, 'body' => decoded JSON or null].
 * $token null sends no Authorization header.
 */
function apiCall(string $method, string $path, ?array $body = null, ?string $token = null): array {
    $headers = "Content-Type: application/json\r\n";
    if ($token !== null) {
        $headers .= "Authorization: Bearer $token\r\n";
    }
    $ctx = stream_context_create(['http' => [
        'method'        => $method,
        'header'        => $headers,
        'content'       => $body === null ? '' : json_encode($body),
        'timeout'       => 10,
        'ignore_errors' => true,
    ]]);
    $raw = @file_get_contents(API_BASE . '/' . $path, false, $ctx);
    $status = 0;
    foreach ($http_response_header ?? [] as $h) {
        if (preg_match('#^HTTP/\S+\s+(\d{3})#', $h, $m)) {
            $status = (int)$m[1];
        }
    }
    return ['status' => $status, 'body' => $raw === false ? null : json_decode($raw, true)];
}

$GLOBALS['__t'] = ['passed' => 0, 'failed' => 0];

function check(string $label, bool $condition, string $detail = ''): void {
    if ($condition) {
        $GLOBALS['__t']['passed']++;
        echo "  ✓ $label\n";
    } else {
        $GLOBALS['__t']['failed']++;
        echo "  ✗ $label" . ($detail !== '' ? " — $detail" : '') . "\n";
    }
}

function finishTests(): void {
    ['passed' => $p, 'failed' => $f] = $GLOBALS['__t'];
    echo "\n" . str_repeat('─', 50) . "\n$p passed, $f failed\n";
    exit($f > 0 ? 1 : 0);
}
