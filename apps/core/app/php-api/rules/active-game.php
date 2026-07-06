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

$gameType        = $state['gameType'] ?? 'commander';
$teamNames       = $state['teamNames'] ?? null;
$commanderDamage = $state['commanderDamage'] ?? [];
$currentIdx      = (int)($state['currentPlayerIdx'] ?? 0);
$turnNumber      = $state['turnNumber'] ?? null;
$is2hg           = $gameType === '2hg';
$currentPlayer   = $players[$currentIdx]['playerName'] ?? null;
$activeTeam      = $is2hg ? ($players[$currentIdx]['teamNumber'] ?? null) : null;
$currentTeam     = ($activeTeam !== null && $teamNames)
    ? ($teamNames[$activeTeam] ?? "Team {$activeTeam}")
    : ($activeTeam !== null ? "Team {$activeTeam}" : null);

// Collect deck IDs from session state
$deckIds = [];
foreach ($players as $p) {
    if (!empty($p['deckId'])) {
        $deckIds[] = (string)$p['deckId'];
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
foreach ($players as $idx => $p) {
    $deckId = isset($p['deckId']) ? (string)$p['deckId'] : null;
    $cards  = ($deckId && isset($cardsByDeck[$deckId])) ? $cardsByDeck[$deckId] : [];

    $entry = [
        'playerName'    => $p['playerName'] ?? 'Unknown',
        'deckName'      => $p['deckName']   ?? 'Unknown Deck',
        'commander'     => $p['commander']['name'] ?? null,
        'partner'       => $p['partner']['name']   ?? null,
        'deckId'        => $deckId,
        'cards'         => $cards,
        'life'          => $p['life'] ?? null,
        'poison'        => $p['poison'] ?? 0,
        'energy'        => $p['energy'] ?? 0,
        'experience'    => $p['experience'] ?? 0,
        'commanderTax'  => $p['commanderTax'] ?? 0,
        'isEliminated'  => !empty($p['isEliminated']),
        'isConceded'    => !empty($p['isConceded']),
        'isMonarch'     => !empty($p['isMonarch']),
        'hasInitiative' => !empty($p['hasInitiative']),
        'hasCitysBlessing' => !empty($p['hasCitysBlessing']),
    ];

    if (!empty($p['teamNumber'])) {
        $tNum = (int)$p['teamNumber'];
        $entry['teamNumber'] = $tNum;
        $entry['teamName'] = is_array($teamNames) ? ($teamNames[$tNum] ?? "Team {$tNum}") : "Team {$tNum}";
    }

    $dmgReceived = $commanderDamage[$idx] ?? $commanderDamage[(string)$idx] ?? null;
    if (is_array($dmgReceived)) {
        $dmg = [];
        foreach ($dmgReceived as $srcIdx => $vals) {
            if (!is_array($vals)) continue;
            [$regular, $partner] = [$vals[0] ?? 0, $vals[1] ?? 0];
            if ($regular > 0 || $partner > 0) {
                $srcName = $players[(int)$srcIdx]['playerName'] ?? (string)$srcIdx;
                $dmg[$srcName] = $partner > 0 ? [$regular, $partner] : [$regular];
            }
        }
        if (!empty($dmg)) {
            $entry['commanderDamage'] = $dmg;
        }
    }

    $gamePlayers[] = $entry;
}

sendJSON(['game' => [
    'gameType'      => $gameType,
    'turnNumber'    => $turnNumber,
    'currentPlayer' => $currentPlayer,
    'currentTeam'   => $currentTeam,
    'players'       => $gamePlayers,
]]);
