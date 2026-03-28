<?php
/**
 * rules/seed.php — Seed rules_patterns table from .md files in this directory.
 * Idempotent: uses INSERT ... ON DUPLICATE KEY UPDATE so safe to run repeatedly.
 *
 * Usage (CLI or via deploy script):
 *   php seed.php
 *   php seed.php --dry-run
 */

$isLocalDev = php_sapi_name() === 'cli-server' || php_sapi_name() === 'cli';

// Load config (DB credentials)
$scriptDir  = __DIR__;
$phpApiDir  = dirname($scriptDir);
require_once $phpApiDir . '/config.php';

$dryRun = in_array('--dry-run', $argv ?? []);

function parseFrontmatter(string $content): array {
    if (!str_starts_with($content, '---')) {
        return ['meta' => [], 'body' => $content];
    }
    $end = strpos($content, '---', 3);
    if ($end === false) {
        return ['meta' => [], 'body' => $content];
    }
    $yaml = substr($content, 3, $end - 3);
    $body = ltrim(substr($content, $end + 3));

    $meta = [];
    foreach (explode("\n", $yaml) as $line) {
        $line = trim($line);
        if (empty($line)) continue;
        [$key, $val] = array_pad(explode(':', $line, 2), 2, '');
        $meta[trim($key)] = trim($val);
    }
    return ['meta' => $meta, 'body' => $body];
}

$dir   = __DIR__;
$files = glob($dir . '/p[0-9][0-9][0-9]*.md');
sort($files);

if (empty($files)) {
    echo "No pattern files found in $dir\n";
    exit(1);
}

$db = getDB();

$upsertSQL = "
    INSERT INTO rules_patterns (pattern_id, name, category, cr_refs, tags, content, examples_count)
    VALUES (:pattern_id, :name, :category, :cr_refs, :tags, :content, :examples_count)
    ON DUPLICATE KEY UPDATE
        name           = VALUES(name),
        category       = VALUES(category),
        cr_refs        = VALUES(cr_refs),
        tags           = VALUES(tags),
        content        = VALUES(content),
        examples_count = VALUES(examples_count),
        updated_at     = CURRENT_TIMESTAMP
";
$stmt = $db->prepare($upsertSQL);

$count = 0;
foreach ($files as $file) {
    $raw      = file_get_contents($file);
    $parsed   = parseFrontmatter($raw);
    $meta     = $parsed['meta'];
    $body     = $parsed['body'];

    $patternId     = $meta['id']             ?? basename($file, '.md');
    $name          = $meta['name']           ?? $patternId;
    $category      = $meta['category']       ?? 'general';
    $crRefs        = $meta['cr_refs']        ?? null;
    $tags          = $meta['tags']           ?? null;
    $examplesCount = (int)($meta['examples_count'] ?? 0);

    if ($dryRun) {
        echo "  [dry-run] Would upsert: $patternId — $name\n";
        $count++;
        continue;
    }

    $stmt->execute([
        ':pattern_id'     => $patternId,
        ':name'           => $name,
        ':category'       => $category,
        ':cr_refs'        => $crRefs,
        ':tags'           => $tags,
        ':content'        => $body,
        ':examples_count' => $examplesCount,
    ]);
    echo "  Upserted: $patternId — $name\n";
    $count++;
}

echo $dryRun
    ? "Dry run complete: $count patterns would be seeded.\n"
    : "Seed complete: $count patterns upserted.\n";
