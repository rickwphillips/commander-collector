<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $db = getDB();
    $stmt = $db->query("SELECT pattern_id, name, category, cr_refs, tags, content, examples_count, updated_at FROM rules_patterns ORDER BY pattern_id");
    sendJSON(['patterns' => $stmt->fetchAll()]);
}

if ($method === 'POST' || $method === 'PUT') {
    $input = getJSONInput();

    $patternId     = trim($input['pattern_id']     ?? '');
    $name          = trim($input['name']           ?? '');
    $category      = trim($input['category']       ?? '');
    $crRefs        = $input['cr_refs']             ?? null;
    $tags          = $input['tags']                ?? null;
    $content       = $input['content']             ?? '';
    $examplesCount = (int)($input['examples_count'] ?? 0);

    if (!$patternId || !$name || !$category || !$content) {
        sendError('pattern_id, name, category, and content are required');
    }

    $db = getDB();

    $stmt = $db->prepare("
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
    ");
    $stmt->execute([
        ':pattern_id'     => $patternId,
        ':name'           => $name,
        ':category'       => $category,
        ':cr_refs'        => $crRefs,
        ':tags'           => $tags,
        ':content'        => $content,
        ':examples_count' => $examplesCount,
    ]);

    $row = $db->query("SELECT * FROM rules_patterns WHERE pattern_id = " . $db->quote($patternId))->fetch();
    sendJSON(['pattern' => $row], 201);
}

sendError('Method not allowed', 405);
