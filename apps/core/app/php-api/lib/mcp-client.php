<?php
// Thin client for the commander-mcp HTTP transport.
//
// FastMCP streamable-http requires a two-step session dance per tool call:
//   1. POST /mcp with method=initialize → server returns mcp-session-id header
//   2. POST /mcp with that header + method=tools/call → response is SSE-framed
//
// The notifications/initialized notification is optional in practice (FastMCP
// accepts tools/call as soon as a session id exists). Skipping it saves a round
// trip on every PHP request.
//
// MCP_BASE defaults to http://127.0.0.1:8001 (matches the FastMCP default port).
// Override by defining MCP_BASE in auth_secrets.php on a per-host basis.

if (!defined('MCP_BASE')) {
    define('MCP_BASE', 'http://127.0.0.1:8001');
}
if (!defined('MCP_TIMEOUT_SECONDS')) {
    define('MCP_TIMEOUT_SECONDS', 6);
}

/**
 * Call a tool on the commander-mcp HTTP server and return its structuredContent.
 *
 * Returns null if the MCP is unreachable or returns no structured content. The
 * caller should fall back gracefully (e.g. send a Confidence-unknown envelope)
 * rather than treat null as a hard error.
 */
function mcpCallTool(string $toolName, array $arguments): ?array {
    // Step 1: initialize → grab mcp-session-id header.
    $initBody = json_encode([
        'jsonrpc' => '2.0',
        'id'      => 1,
        'method'  => 'initialize',
        'params'  => [
            'protocolVersion' => '2025-03-26',
            'capabilities'    => new stdClass(),
            'clientInfo'      => ['name' => 'commander-collector-php', 'version' => '1'],
        ],
    ]);

    $sessionId = null;
    $ch = curl_init(MCP_BASE . '/mcp');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $initBody,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Accept: application/json, text/event-stream',
        ],
        CURLOPT_HEADER         => true,
        CURLOPT_TIMEOUT        => MCP_TIMEOUT_SECONDS,
    ]);
    $resp = curl_exec($ch);
    if ($resp === false) {
        // curl_close() is a no-op since PHP 8.0; rely on the GC to release the handle.
        return null;
    }
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    $headerBlob = substr($resp, 0, $headerSize);
    foreach (preg_split("/\r\n|\n/", $headerBlob) as $line) {
        if (preg_match('/^mcp-session-id:\s*(\S+)/i', $line, $m)) {
            $sessionId = $m[1];
            break;
        }
    }
    // curl_close() is a no-op since PHP 8.0; rely on the GC to release the handle.
    if (!$sessionId) {
        return null;
    }

    // Step 2: tools/call with session id.
    // Empty assoc arrays encode as JSON `[]` but MCP requires `arguments` to
    // be a JSON object; cast empty input to stdClass so json_encode emits `{}`.
    $args = empty($arguments) ? new stdClass() : $arguments;
    $callBody = json_encode([
        'jsonrpc' => '2.0',
        'id'      => 2,
        'method'  => 'tools/call',
        'params'  => [
            'name'      => $toolName,
            'arguments' => $args,
        ],
    ]);

    $ch = curl_init(MCP_BASE . '/mcp');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $callBody,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Accept: application/json, text/event-stream',
            'mcp-session-id: ' . $sessionId,
        ],
        CURLOPT_TIMEOUT        => MCP_TIMEOUT_SECONDS,
    ]);
    $body = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    // curl_close() is a no-op since PHP 8.0; rely on the GC to release the handle.
    if ($body === false || $httpCode !== 200) {
        return null;
    }

    // Parse SSE: lines of "data: {json}" separated by blank lines. Concatenate
    // all data lines for the first message event and decode.
    $dataLines = [];
    foreach (preg_split("/\r\n|\n/", $body) as $line) {
        if (strncmp($line, 'data:', 5) === 0) {
            $dataLines[] = ltrim(substr($line, 5));
        }
    }
    if (!$dataLines) {
        return null;
    }
    $envelope = json_decode(implode('', $dataLines), true);
    if (!is_array($envelope) || !isset($envelope['result'])) {
        return null;
    }
    // Prefer structuredContent (typed dict); fall back to first content text JSON.
    if (isset($envelope['result']['structuredContent']) && is_array($envelope['result']['structuredContent'])) {
        return $envelope['result']['structuredContent'];
    }
    if (isset($envelope['result']['content'][0]['text'])) {
        $decoded = json_decode($envelope['result']['content'][0]['text'], true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }
    return null;
}

/**
 * Wrap mcpCallTool() with a Confidence-style "unknown" envelope for unreachable cases.
 * Callers can echo the result directly via sendJSON().
 */
function mcpCallToolOrUnknown(string $toolName, array $arguments, string $unreachableCaveat): array {
    $result = mcpCallTool($toolName, $arguments);
    if ($result === null) {
        return [
            'band'    => 'unknown',
            'data'    => null,
            'sources' => [],
            'caveats' => [$unreachableCaveat],
        ];
    }
    return $result;
}
