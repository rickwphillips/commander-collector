<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
$user = requireAuth();
$userId = $user['sub'] ?? null;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}
$db = getDB();

// Find the current user's active live session
$stmt = $db->prepare("
    SELECT state FROM live_game_sessions
    WHERE user_id = ? AND is_active = 1 AND expires_at > NOW()
    ORDER BY id DESC LIMIT 1
");
$stmt->execute([$userId]);
$session = $stmt->fetch();

if (!$session) {
    sendJSON(['game' => null]);
    exit;
}

$state = json_decode($session['state'], true);
$players = $state['players'] ?? [];

if (empty($players)) {
    sendJSON(['game' => null]);
    exit;
}

// Collect deck IDs from session state
$deckIds = [];
foreach ($players as $p) {
    if (!empty($p['deckId'])) {
        $deckIds[] = (int)$p['deckId'];
    }
}
$deckIds = array_values(array_unique($deckIds));

// Fetch card names per deck (just names — enough for context)
$cardsByDeck = [];
if (!empty($deckIds)) {
    $placeholders = implode(',', array_fill(0, count($deckIds), '?'));
    $stmt = $db->prepare("
        SELECT l.deck_id, lc.card_name,
               (lc.role = 'commander') AS is_commander,
               lc.role
        FROM list_cards lc
        JOIN lists l ON l.id = lc.list_id
        WHERE l.deck_id IN ($placeholders) AND l.role = 'main' AND l.deleted_at IS NULL
        ORDER BY l.deck_id, (lc.role = 'commander') DESC, lc.card_name ASC
    ");
    $stmt->execute($deckIds);
    foreach ($stmt->fetchAll() as $row) {
        $cardsByDeck[(string)$row['deck_id']][] = $row['card_name'];
    }
}

// Build response
$gamePlayers = [];
foreach ($players as $p) {
    $deckId = isset($p['deckId']) ? (string)$p['deckId'] : null;
    $cards  = ($deckId && isset($cardsByDeck[$deckId])) ? $cardsByDeck[$deckId] : [];
    $gamePlayers[] = [
        'playerName' => $p['playerName'] ?? 'Unknown',
        'deckName'   => $p['deckName']   ?? 'Unknown Deck',
        'commander'  => $p['commander']['name'] ?? null,
        'partner'    => $p['partner']['name']   ?? null,
        'deckId'     => $deckId,
        'cards'      => $cards,
    ];
}

sendJSON(['game' => ['players' => $gamePlayers]]);
