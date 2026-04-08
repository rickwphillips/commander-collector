<?php
declare(strict_types=1);

require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
requireAuth();

$user   = $GLOBALS['currentUser'];
$userId = (string) $user['sub'];   // VARCHAR(36) — JWT sub is the project user_id
$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Validate context_type against the ENUM defined in the v4.8.0 schema.
 */
function isValidContextType(string $value): bool {
    return in_array($value, [
        'new_list',
        'new_deck_list',
        'existing_list',
        'existing_deck_list',
    ], true);
}

/**
 * Extract and validate the composite key params from a query string (GET/DELETE).
 * Returns ['device_id', 'context_type', 'context_ref'] or calls sendError().
 *
 * context_ref: CHAR(36) NOT NULL DEFAULT '' — empty string is the sentinel for
 * "no specific reference." Missing param is treated identically to empty string.
 */
function getKeyParams(): array {
    $deviceId    = isset($_GET['device_id'])    ? trim((string) $_GET['device_id'])    : '';
    $contextType = isset($_GET['context_type']) ? trim((string) $_GET['context_type']) : '';
    $contextRef  = isset($_GET['context_ref'])  ? (string) $_GET['context_ref']        : '';

    if ($deviceId === '') {
        sendError('Missing required parameter: device_id', 400);
    }
    if ($contextType === '') {
        sendError('Missing required parameter: context_type', 400);
    }
    if (!isValidContextType($contextType)) {
        sendError(
            'Invalid context_type. Must be one of: new_list, new_deck_list, existing_list, existing_deck_list',
            400
        );
    }

    return [$deviceId, $contextType, $contextRef];
}

// ── Routes ────────────────────────────────────────────────────────────────────

switch ($method) {

    // ── GET ───────────────────────────────────────────────────────────────────
    // GET /buffer-draft?device_id=X&context_type=Y[&context_ref=Z]
    // Returns the buffer's state JSON, or 404 if not found.
    case 'GET':
        [$deviceId, $contextType, $contextRef] = getKeyParams();

        $stmt = $pdo->prepare(
            'SELECT state FROM buffer_drafts
             WHERE user_id = ? AND device_id = ? AND context_type = ? AND context_ref = ?'
        );
        $stmt->execute([$userId, $deviceId, $contextType, $contextRef]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            sendJSON(['state' => null]);
        }

        sendJSON(['state' => json_decode($row['state'], true)]);
        break;

    // ── POST ──────────────────────────────────────────────────────────────────
    // POST /buffer-draft
    // Body: { device_id, context_type, context_ref?, state }
    // Upserts the buffer for the composite key (user_id, device_id, context_type, context_ref).
    // state must be a JSON object (not array, not scalar).
    case 'POST':
        $data = getJSONInput();

        $deviceId    = isset($data['device_id'])    ? trim((string) $data['device_id'])    : '';
        $contextType = isset($data['context_type']) ? trim((string) $data['context_type']) : '';
        // context_ref: empty string is the sentinel for "no specific reference"
        $contextRef  = isset($data['context_ref'])  ? (string) $data['context_ref']        : '';
        $state       = $data['state'] ?? null;

        if ($deviceId === '') {
            sendError('Missing required field: device_id', 400);
        }
        if ($contextType === '') {
            sendError('Missing required field: context_type', 400);
        }
        if (!isValidContextType($contextType)) {
            sendError(
                'Invalid context_type. Must be one of: new_list, new_deck_list, existing_list, existing_deck_list',
                400
            );
        }
        if ($state === null) {
            sendError('Missing required field: state', 400);
        }
        // Require state to be an object (associative array after decode), not an array or scalar.
        if (!is_array($state) || array_is_list($state)) {
            sendError('state must be a JSON object, not an array or scalar', 400);
        }

        $json = json_encode($state);
        if ($json === false) {
            sendError('state could not be encoded as JSON', 400);
        }

        $stmt = $pdo->prepare(
            'INSERT INTO buffer_drafts (user_id, device_id, context_type, context_ref, state)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE state = VALUES(state), updated_at = CURRENT_TIMESTAMP'
        );
        $stmt->execute([$userId, $deviceId, $contextType, $contextRef, $json]);

        sendJSON(['success' => true]);
        break;

    // ── DELETE ────────────────────────────────────────────────────────────────
    // DELETE /buffer-draft?device_id=X&context_type=Y[&context_ref=Z]
    // Deletes the buffer for the composite key.
    case 'DELETE':
        [$deviceId, $contextType, $contextRef] = getKeyParams();

        $stmt = $pdo->prepare(
            'DELETE FROM buffer_drafts
             WHERE user_id = ? AND device_id = ? AND context_type = ? AND context_ref = ?'
        );
        $stmt->execute([$userId, $deviceId, $contextType, $contextRef]);

        sendJSON(['success' => true]);
        break;

    default:
        sendError('Method not allowed', 405);
}
