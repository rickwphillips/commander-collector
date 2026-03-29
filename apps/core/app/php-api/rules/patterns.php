<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

function generateSuggestedQuestions(string $patternId, string $name, string $content): ?string {
    $apiKey = defined('ANTHROPIC_API_KEY') ? ANTHROPIC_API_KEY : null;
    if (!$apiKey) return null;

    // Send just the first 600 chars of content to keep the prompt lean
    $excerpt = mb_substr($content, 0, 600);

    $payload = json_encode([
        'model'      => 'claude-haiku-4-5-20251001',
        'max_tokens' => 200,
        'system'     => 'You are an MTG rules expert. Given a rules interaction pattern, output ONLY a JSON array of exactly 3 short, natural questions (under 10 words each) that a player might ask which this pattern answers. No explanation, no markdown — just the JSON array.',
        'messages'   => [[
            'role'    => 'user',
            'content' => "Pattern: {$name}\n\n{$excerpt}",
        ]],
    ]);

    $ch = curl_init('https://api.anthropic.com/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'x-api-key: ' . $apiKey,
            'anthropic-version: 2023-06-01',
        ],
        CURLOPT_TIMEOUT => 15,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($httpCode !== 200 || !$response) return null;

    $data = json_decode($response, true);
    $text = trim($data['content'][0]['text'] ?? '');

    // Validate it's a JSON array
    $questions = json_decode($text, true);
    if (!is_array($questions) || count($questions) === 0) return null;

    return json_encode(array_values(array_slice($questions, 0, 3)));
}

if ($method === 'GET') {
    $db = getDB();
    $stmt = $db->query("SELECT pattern_id, name, category, cr_refs, tags, content, examples_count, updated_at, suggested_questions FROM rules_patterns ORDER BY updated_at DESC");
    $patterns = $stmt->fetchAll();

    // Lazily generate questions for any pattern missing them
    $needsGeneration = array_filter($patterns, fn($p) => empty($p['suggested_questions']));
    if (!empty($needsGeneration)) {
        $update = $db->prepare("UPDATE rules_patterns SET suggested_questions = :q WHERE pattern_id = :id");
        foreach ($needsGeneration as &$p) {
            $questions = generateSuggestedQuestions($p['pattern_id'], $p['name'], $p['content']);
            if ($questions) {
                $update->execute([':q' => $questions, ':id' => $p['pattern_id']]);
                $p['suggested_questions'] = $questions;
            }
        }
        unset($p);
    }

    sendJSON(['patterns' => array_values($patterns)]);
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
            name              = VALUES(name),
            category          = VALUES(category),
            cr_refs           = VALUES(cr_refs),
            tags              = VALUES(tags),
            content           = VALUES(content),
            examples_count    = VALUES(examples_count),
            suggested_questions = NULL,
            updated_at        = CURRENT_TIMESTAMP
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
