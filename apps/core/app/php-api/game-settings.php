<?php
require_once 'config.php';
require_once 'auth/middleware.php';
$user = requireAuth();
$userId = $user['sub'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return defaults if not authenticated
    $defaults = [
        'sound_enabled' => true,
        'highlight_mode' => true,
        'turn_timer_enabled' => true,
        'turn_timer_seconds' => 300,
    ];

    if (!$userId) {
        sendJSON($defaults);
        return;
    }

    // Fetch current user's game settings
    $db = getDB();
    $stmt = $db->prepare("
        SELECT id, sound_enabled, highlight_mode, turn_timer_enabled, turn_timer_seconds
        FROM game_settings
        WHERE user_id = ?
    ");
    $stmt->execute([$userId]);
    $row = $stmt->fetch();

    if (!$row) {
        // Return defaults if no record exists yet
        sendJSON($defaults);
        return;
    }

    sendJSON([
        'sound_enabled' => (bool)$row['sound_enabled'],
        'highlight_mode' => (bool)$row['highlight_mode'],
        'turn_timer_enabled' => (bool)$row['turn_timer_enabled'],
        'turn_timer_seconds' => (int)$row['turn_timer_seconds'],
    ]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Save or update game settings (partial update supported)
    // If not authenticated, return the provided values without saving
    $input = getJSONInput();

    $soundEnabled = isset($input['sound_enabled']) ? (bool)$input['sound_enabled'] : true;
    $highlightMode = isset($input['highlight_mode']) ? (bool)$input['highlight_mode'] : true;
    $timerEnabled = isset($input['turn_timer_enabled']) ? (bool)$input['turn_timer_enabled'] : true;
    $timerSeconds = isset($input['turn_timer_seconds']) ? (int)$input['turn_timer_seconds'] : 300;

    if ($timerSeconds < 0 || $timerSeconds > 3600) {
        sendError('turn_timer_seconds must be between 0 and 3600', 400);
    }

    // Only save if authenticated
    if ($userId) {
        $db = getDB();

        // Fetch current settings to merge with partial update
        $stmt = $db->prepare("
            SELECT sound_enabled, highlight_mode, turn_timer_enabled, turn_timer_seconds
            FROM game_settings
            WHERE user_id = ?
        ");
        $stmt->execute([$userId]);
        $existing = $stmt->fetch();

        // Merge provided values with existing (or defaults if no existing row)
        $soundEnabled = isset($input['sound_enabled']) ? (bool)$input['sound_enabled'] : ($existing['sound_enabled'] ?? true);
        $highlightMode = isset($input['highlight_mode']) ? (bool)$input['highlight_mode'] : ($existing['highlight_mode'] ?? true);
        $timerEnabled = isset($input['turn_timer_enabled']) ? (bool)$input['turn_timer_enabled'] : ($existing['turn_timer_enabled'] ?? true);
        $timerSeconds = isset($input['turn_timer_seconds']) ? (int)$input['turn_timer_seconds'] : ($existing['turn_timer_seconds'] ?? 300);

        $stmt = $db->prepare("
            INSERT INTO game_settings (user_id, sound_enabled, highlight_mode, turn_timer_enabled, turn_timer_seconds)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            sound_enabled = VALUES(sound_enabled),
            highlight_mode = VALUES(highlight_mode),
            turn_timer_enabled = VALUES(turn_timer_enabled),
            turn_timer_seconds = VALUES(turn_timer_seconds),
            updated_at = CURRENT_TIMESTAMP
        ");
        $stmt->execute([
            $userId,
            $soundEnabled ? 1 : 0,
            $highlightMode ? 1 : 0,
            $timerEnabled ? 1 : 0,
            $timerSeconds,
        ]);
    }

    sendJSON([
        'success' => true,
        'sound_enabled' => $soundEnabled,
        'highlight_mode' => $highlightMode,
        'turn_timer_enabled' => $timerEnabled,
        'turn_timer_seconds' => $timerSeconds,
    ]);
} else {
    sendError('Method not allowed', 405);
}
