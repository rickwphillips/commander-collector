<?php
/**
 * Seed changelog_releases and changelog_changes tables from the extracted JSON.
 * Run locally: php scripts/seed-changelog.php
 * Run on prod: scp to server, then: php /tmp/seed-changelog.php
 */

// Load DB config
$homeDir = $_SERVER['HOME'] ?? getenv('HOME') ?: null;
$isLocalDev = in_array(php_sapi_name(), ['cli-server', 'cli'])
    && file_exists($homeDir . '/auth_secrets_dev.php');
$secretsFile = $isLocalDev
    ? $homeDir . '/auth_secrets_dev.php'
    : $homeDir . '/auth_secrets.php';
require_once $secretsFile;

$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
    DB_USER,
    DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
);

// Check if data already exists
$count = $pdo->query('SELECT COUNT(*) FROM changelog_releases')->fetchColumn();
if ($count > 0) {
    echo "changelog_releases already has $count entries. Skipping seed.\n";
    exit(0);
}

$json = file_get_contents(__DIR__ . '/../changelog-seed.json');
if (!$json) {
    // Try /tmp fallback for remote execution
    $json = file_get_contents('/tmp/changelog-seed.json');
}
if (!$json) {
    echo "ERROR: Could not find changelog-seed.json\n";
    exit(1);
}

$releases = json_decode($json, true);
if (!$releases) {
    echo "ERROR: Invalid JSON\n";
    exit(1);
}

$pdo->beginTransaction();
try {
    $releaseStmt = $pdo->prepare(
        'INSERT INTO changelog_releases (version, date, title, sort_order) VALUES (?, ?, ?, ?)'
    );
    $changeStmt = $pdo->prepare(
        'INSERT INTO changelog_changes (release_id, type, text, sort_order) VALUES (?, ?, ?, ?)'
    );

    // Releases are in newest-first order; assign sort_order descending
    $sortOrder = count($releases);

    foreach ($releases as $release) {
        $releaseStmt->execute([
            $release['version'],
            $release['date'],
            $release['title'],
            $sortOrder--,
        ]);
        $releaseId = $pdo->lastInsertId();

        foreach ($release['changes'] as $i => $change) {
            $changeStmt->execute([
                $releaseId,
                $change['type'],
                $change['text'],
                $i,
            ]);
        }
    }

    $pdo->commit();
    echo "Seeded " . count($releases) . " releases successfully.\n";
} catch (Exception $e) {
    $pdo->rollBack();
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
