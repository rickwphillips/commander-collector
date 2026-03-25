<?php
// Temporary diagnostic log endpoint — remove after debugging sync issues
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('POST only', 405);
}

$input = getJSONInput();
$source  = isset($input['source'])  ? substr(preg_replace('/[^a-zA-Z0-9_\-]/', '', $input['source']), 0, 32) : 'unknown';
$level   = isset($input['level'])   ? strtoupper(substr($input['level'], 0, 8)) : 'INFO';
$message = isset($input['message']) ? substr($input['message'], 0, 512) : '';
$data    = isset($input['data'])    ? substr(json_encode($input['data']), 0, 1024) : '';

$homeDir = $_SERVER['HOME'] ?? getenv('HOME') ?: dirname($_SERVER['DOCUMENT_ROOT']);
$logFile = $homeDir . '/commander-debug.log';

$line = sprintf(
    "[%s] [%s] [%s] %s %s\n",
    date('Y-m-d H:i:s'),
    $level,
    $source,
    $message,
    $data
);

file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX);

sendJSON(['ok' => true]);
