<?php
/**
 * Every php-api endpoint must enforce auth, or be listed here with a reason.
 *
 * This guards a specific failure mode that has already happened once:
 * rules/chat-stream.php required auth/middleware.php but never called
 * requireAuth(), so it served conversation content to anonymous callers.
 * Including the middleware looks like enforcement at a glance; only calling
 * it is enforcement. A grep for "auth" would have passed that file.
 *
 * The allowlist is the point of the test. Adding an endpoint to it is a
 * deliberate, reviewable act; forgetting requireAuth() is not.
 *
 * Run with: php tests/php/endpoint-auth.test.php
 */

$phpApiDir = realpath(__DIR__ . '/../../app/php-api');

// Files that legitimately run without requireAuth(). Key => why.
$allowed = [
    // Auth entry points and libraries — these are what issue the token.
    'auth/bootstrap.php'     => 'first-run admin bootstrap',
    'auth/jwt.php'           => 'JWT encode/decode library, not an endpoint',
    'auth/login.php'         => 'issues the token',
    'auth/register.php'      => 'issues the token',
    'auth/middleware.php'    => 'defines requireAuth() itself',

    // Shared includes, not routable endpoints.
    'config.php'             => 'shared include; guards its own CLI use',
    'lib/card-classify.php'  => 'include',
    'lib/card-count.php'     => 'include',
    'lib/game-log-buffer.php' => 'include',
    'lib/mcp-client.php'     => 'include',
    'lib/scryfall-helpers.php' => 'include',
    'lib/sql-helpers.php'    => 'include',

    // CLI-only: guarded by a php_sapi_name() check, not by a token.
    'cleanup-trash.php'      => 'CLI guard (also callable as an include)',
    'rules/seed.php'         => 'CLI guard',

    // Seat code is the credential, same model as live-game.php.
    'game-log.php'           => 'live session code is the credential',
    'live-game-stream.php'   => 'live session code is the credential',

    // Deliberately public.
    'players-public.php'     => 'unclaimed players, id + name only',
    'health/mcp.php'         => 'uptime probe; the watcher cannot mint a JWT',

    // 410 tombstones — no data path left to protect.
    'deck-cards.php'         => '410 Gone shim',
    'scan-draft.php'         => '410 Gone shim',
];

$enforcers = ['requireAuth', 'requireAdmin', 'requireAuthOrSessionCode'];

/**
 * True if $src actually calls one of $enforcers.
 *
 * Tokenised rather than grepped on purpose. A regex over the raw source also
 * matches "// requireAuth();" and prose in a doc comment — including the
 * comment in chat-stream.php that explains why the call is there — so a
 * deleted call with its comment left behind would slip through. Only a real
 * T_STRING followed by "(" counts.
 */
function callsEnforcer(string $src, array $enforcers): bool {
    $tokens = token_get_all($src);
    $count = count($tokens);

    for ($i = 0; $i < $count; $i++) {
        $token = $tokens[$i];
        if (!is_array($token) || $token[0] !== T_STRING) {
            continue;
        }
        if (!in_array($token[1], $enforcers, true)) {
            continue;
        }

        // Skip whitespace, then require an opening paren: a call, not a mention.
        $j = $i + 1;
        while ($j < $count && is_array($tokens[$j]) && $tokens[$j][0] === T_WHITESPACE) {
            $j++;
        }
        if ($j < $count && $tokens[$j] === '(') {
            return true;
        }
    }

    return false;
}

/** Files under $dir, as paths relative to it. */
function phpFilesIn(string $dir): array {
    $found = [];
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS));
    foreach ($it as $file) {
        if ($file->getExtension() === 'php') {
            $found[] = substr($file->getPathname(), strlen($dir) + 1);
        }
    }
    sort($found);
    return $found;
}

$passed = 0;
$failed = 0;

foreach (phpFilesIn($phpApiDir) as $rel) {
    $src = file_get_contents("$phpApiDir/$rel");

    if (callsEnforcer($src, $enforcers)) {
        $passed++;
        continue;
    }

    if (isset($allowed[$rel])) {
        echo "  – $rel — unauthenticated by design ({$allowed[$rel]})\n";
        $passed++;
        continue;
    }

    echo "  ✗ $rel — no requireAuth()/requireAdmin()/requireAuthOrSessionCode() call,\n";
    echo "      and not in the documented allowlist in " . basename(__FILE__) . ".\n";
    $failed++;
}

// A stale allowlist entry is a bug too: it means the file moved or was deleted
// and the exemption is now silently covering nothing.
foreach (array_keys($allowed) as $rel) {
    if (!file_exists("$phpApiDir/$rel")) {
        echo "  ✗ allowlist entry '$rel' no longer exists — remove it\n";
        $failed++;
    }
}

echo "\n" . str_repeat('─', 50) . "\n";
echo "$passed passed, $failed failed\n";
exit($failed > 0 ? 1 : 0);
