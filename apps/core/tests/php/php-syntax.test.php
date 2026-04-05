<?php
/**
 * Syntax validation for refactored PHP files.
 * Verifies each file parses without errors (php -l).
 *
 * Run with: php tests/php/php-syntax.test.php
 */

$phpApiDir = __DIR__ . '/../../app/php-api';

$files = [
    'lib/sql-helpers.php',
    'stats.php',
    'players.php',
    'comparison.php',
    'advanced-stats.php',
    'decks.php',
];

$passed = 0;
$failed = 0;

foreach ($files as $file) {
    $path = "$phpApiDir/$file";
    if (!file_exists($path)) {
        echo "  ✗ $file — FILE NOT FOUND\n";
        $failed++;
        continue;
    }

    $output = [];
    $exitCode = 0;
    exec("php -l " . escapeshellarg($path) . " 2>&1", $output, $exitCode);

    if ($exitCode === 0) {
        echo "  ✓ $file\n";
        $passed++;
    } else {
        echo "  ✗ $file\n";
        foreach ($output as $line) {
            echo "    $line\n";
        }
        $failed++;
    }
}

echo "\n" . str_repeat('─', 50) . "\n";
echo "$passed passed, $failed failed\n";
exit($failed > 0 ? 1 : 0);
