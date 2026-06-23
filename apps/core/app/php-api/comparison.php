<?php
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
require_once __DIR__ . '/lib/sql-helpers.php';
$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$pdo = getDB();

// --- Parse request params ---
$groupBy        = $_GET['group_by'] ?? 'player';
$metricsParam   = $_GET['metrics'] ?? 'win_rate,total_games,wins';
$metrics        = array_filter(explode(',', $metricsParam));

// Conditions
$gameType        = $_GET['game_type'] ?? null;        // 'standard' or '2hg'
$podSize         = isset($_GET['pod_size']) ? (int)$_GET['pod_size'] : null;
$minWinTurn      = isset($_GET['min_winning_turn']) ? (int)$_GET['min_winning_turn'] : null;
$maxWinTurn      = isset($_GET['max_winning_turn']) ? (int)$_GET['max_winning_turn'] : null;
$minFinishPos    = isset($_GET['min_finish_position']) ? (int)$_GET['min_finish_position'] : null;
$dateFrom        = $_GET['date_from'] ?? null;
$dateTo          = $_GET['date_to'] ?? null;
$minGames        = isset($_GET['min_games']) ? (int)$_GET['min_games'] : 1;

// Array params (sent as required_player_ids[]=uuid&required_player_ids[]=uuid)
$reqPlayerIds    = isset($_GET['required_player_ids']) && is_array($_GET['required_player_ids'])
    ? array_map('strval', $_GET['required_player_ids']) : [];
$reqCommanders   = isset($_GET['required_commanders']) && is_array($_GET['required_commanders'])
    ? array_map('strval', $_GET['required_commanders']) : [];
$mustIncludeColors = isset($_GET['must_include_colors']) && is_array($_GET['must_include_colors'])
    ? array_values(array_filter(
        array_map('strtoupper', array_map('strval', $_GET['must_include_colors'])),
        fn($c) => in_array($c, ['W', 'U', 'B', 'R', 'G'], true)
    )) : [];
$colorMode        = in_array($_GET['color_mode'] ?? '', ['or', 'only'], true)
    ? $_GET['color_mode'] : 'and';

// Entity filter
$filterPlayerIds  = isset($_GET['filter_player_ids']) && is_array($_GET['filter_player_ids'])
    ? array_map('strval', $_GET['filter_player_ids']) : [];
$filterDeckIds    = isset($_GET['filter_deck_ids']) && is_array($_GET['filter_deck_ids'])
    ? array_map('strval', $_GET['filter_deck_ids']) : [];
$filterCommanders = isset($_GET['filter_commanders']) && is_array($_GET['filter_commanders'])
    ? array_map('strval', $_GET['filter_commanders']) : [];
$filterColors     = isset($_GET['filter_colors']) && is_array($_GET['filter_colors'])
    ? array_values(array_filter(
        array_map('strtoupper', array_map('strval', $_GET['filter_colors'])),
        fn($c) => in_array($c, ['W', 'U', 'B', 'R', 'G'], true)
    )) : [];
$filterColorMode  = in_array($_GET['filter_color_mode'] ?? '', ['or', 'only'], true)
    ? $_GET['filter_color_mode'] : 'and';

// Phase 2 — new condition params
$myGamesOnly      = filter_var($_GET['my_games_only'] ?? false, FILTER_VALIDATE_BOOLEAN)
    && !empty($user['player_id']);
$myDecksOnly      = filter_var($_GET['my_decks_only'] ?? false, FILTER_VALIDATE_BOOLEAN)
    && !empty($user['player_id']);
$oppPlayerIds     = isset($_GET['opponent_player_ids']) && is_array($_GET['opponent_player_ids'])
    ? array_map('strval', $_GET['opponent_player_ids']) : [];
$oppCommanders    = isset($_GET['opponent_commanders']) && is_array($_GET['opponent_commanders'])
    ? array_map('strval', $_GET['opponent_commanders']) : [];
$oppColors        = isset($_GET['opponent_colors']) && is_array($_GET['opponent_colors'])
    ? array_values(array_filter(
        array_map('strtoupper', array_map('strval', $_GET['opponent_colors'])),
        fn($c) => in_array($c, ['W', 'U', 'B', 'R', 'G'], true)
    )) : [];
$oppColorMode     = in_array($_GET['opponent_color_mode'] ?? '', ['or', 'only'], true)
    ? $_GET['opponent_color_mode'] : 'and';
$excludePlayerIds = isset($_GET['exclude_player_ids']) && is_array($_GET['exclude_player_ids'])
    ? array_map('strval', $_GET['exclude_player_ids']) : [];
$topN             = isset($_GET['top_n']) ? max(1, (int)$_GET['top_n']) : null;

// Validate groupBy
$validGroupBys = [
    'player', 'deck', 'commander', 'color', 'deck_age',
    'pod_size', 'game_length', 'game_type',
    'month', 'year', 'season', 'day_of_week',
    'opponent_player', 'opponent_commander',
];
if (!in_array($groupBy, $validGroupBys, true)) {
    sendError("Invalid group_by: $groupBy");
}

// Perspective player for opponent group-bys
$perspectivePlayerId = null;
if (in_array($groupBy, ['opponent_player', 'opponent_commander'], true)) {
    if ($myGamesOnly && !empty($user['player_id'])) {
        $perspectivePlayerId = (string)$user['player_id'];
    } elseif (!empty($reqPlayerIds)) {
        $perspectivePlayerId = $reqPlayerIds[0];
    } else {
        sendError('opponent_player and opponent_commander group-bys require a perspective player (set required_player_ids or my_games_only)');
    }
}

// --- Build shared WHERE clause ---
$where  = ['1=1'];
$params = [];

if ($gameType && in_array($gameType, ['standard', '2hg'], true)) {
    $where[] = 'g.game_type = ?';
    $params[] = $gameType;
}

if ($podSize !== null) {
    if ($podSize >= 5) {
        $where[] = 'pod.pod_size >= 5';
    } else {
        $where[] = 'pod.pod_size = ?';
        $params[] = $podSize;
    }
}

if ($minWinTurn !== null) {
    $where[] = 'g.winning_turn >= ?';
    $params[] = $minWinTurn;
}

if ($maxWinTurn !== null) {
    $where[] = 'g.winning_turn <= ?';
    $params[] = $maxWinTurn;
}

if ($minFinishPos !== null) {
    $where[] = 'gr.finish_position <= ?';
    $params[] = $minFinishPos;
}

if ($dateFrom) {
    $where[] = 'g.played_at >= ?';
    $params[] = $dateFrom;
}
if ($dateTo) {
    $where[] = 'g.played_at <= ?';
    $params[] = $dateTo;
}

// Required players in pod (games where ALL listed players were present)
foreach ($reqPlayerIds as $pid) {
    $where[] = 'g.id IN (SELECT game_id FROM game_results WHERE player_id = ?)';
    $params[] = $pid;
}

// Required commanders in pod
foreach ($reqCommanders as $cmd) {
    $where[] = 'g.id IN (SELECT gr2.game_id FROM game_results gr2 JOIN decks d2 ON gr2.deck_id = d2.id WHERE d2.commander = ?)';
    $params[] = $cmd;
}

// Color column map shared by must_include_colors and filter_colors
$colorColumnMap = ['W' => 'has_w', 'U' => 'has_u', 'B' => 'has_b', 'R' => 'has_r', 'G' => 'has_g'];

// Deck must include colors (condition — applies to the deck played by each game_result row)
if (!empty($mustIncludeColors)) {
    if ($colorMode === 'or') {
        $clauses = array_map(fn($c) => 'd.' . $colorColumnMap[$c] . ' = 1', $mustIncludeColors);
        $where[] = '(' . implode(' OR ', $clauses) . ')';
    } elseif ($colorMode === 'only') {
        foreach ($mustIncludeColors as $c) {
            $where[] = 'd.' . $colorColumnMap[$c] . ' = 1';
        }
        foreach (array_diff(array_keys($colorColumnMap), $mustIncludeColors) as $c) {
            $where[] = 'd.' . $colorColumnMap[$c] . ' = 0';
        }
    } else { // 'and' (default)
        foreach ($mustIncludeColors as $c) {
            $where[] = 'd.' . $colorColumnMap[$c] . ' = 1';
        }
    }
}

// Entity color filter (applies to all group_bys — narrows which entity rows appear in results)
if (!empty($filterColors)) {
    if ($filterColorMode === 'or') {
        $clauses = array_map(fn($c) => 'd.' . $colorColumnMap[$c] . ' = 1', $filterColors);
        $where[] = '(' . implode(' OR ', $clauses) . ')';
    } elseif ($filterColorMode === 'only') {
        foreach ($filterColors as $c) {
            $where[] = 'd.' . $colorColumnMap[$c] . ' = 1';
        }
        foreach (array_diff(array_keys($colorColumnMap), $filterColors) as $c) {
            $where[] = 'd.' . $colorColumnMap[$c] . ' = 0';
        }
    } else { // 'and' (default)
        foreach ($filterColors as $c) {
            $where[] = 'd.' . $colorColumnMap[$c] . ' = 1';
        }
    }
}

// My games only — restrict to games where the authenticated user's player was present
if ($myGamesOnly) {
    $where[] = 'g.id IN (SELECT game_id FROM game_results WHERE player_id = ?)';
    $params[] = (string)$user['player_id'];
}

// My decks only — restrict to game results using a deck owned by the authenticated user's player
if ($myDecksOnly) {
    $where[] = 'd.player_id = ?';
    $params[] = (string)$user['player_id'];
}

// Opponent players — ALL listed players must be in the same game
foreach ($oppPlayerIds as $pid) {
    $where[] = 'g.id IN (SELECT game_id FROM game_results WHERE player_id = ?)';
    $params[] = $pid;
}

// Opponent commanders — ALL listed commanders must appear in the same game
foreach ($oppCommanders as $cmd) {
    $where[] = 'g.id IN (SELECT gr2.game_id FROM game_results gr2 JOIN decks d2 ON gr2.deck_id = d2.id WHERE d2.commander = ?)';
    $params[] = $cmd;
}

// Opponent colors — at least one opponent's deck (not this row's player) matches the color filter
if (!empty($oppColors)) {
    $oppBase = 'SELECT gr2.game_id FROM game_results gr2 JOIN decks d2 ON gr2.deck_id = d2.id WHERE gr2.player_id != gr.player_id';
    if ($oppColorMode === 'or') {
        $clauses = array_map(fn($c) => 'd2.' . $colorColumnMap[$c] . ' = 1', $oppColors);
        $where[] = 'g.id IN (' . $oppBase . ' AND (' . implode(' OR ', $clauses) . '))';
    } elseif ($oppColorMode === 'only') {
        $incClauses = array_map(fn($c) => 'd2.' . $colorColumnMap[$c] . ' = 1', $oppColors);
        $excClauses = array_map(
            fn($c) => 'd2.' . $colorColumnMap[$c] . ' = 0',
            array_diff(array_keys($colorColumnMap), $oppColors)
        );
        $where[] = 'g.id IN (' . $oppBase . ' AND ' . implode(' AND ', array_merge($incClauses, $excClauses)) . ')';
    } else { // 'and'
        $clauses = array_map(fn($c) => 'd2.' . $colorColumnMap[$c] . ' = 1', $oppColors);
        $where[] = 'g.id IN (' . $oppBase . ' AND ' . implode(' AND ', $clauses) . ')';
    }
}

// Exclude players — none of these players may be in the game
foreach ($excludePlayerIds as $pid) {
    $where[] = 'g.id NOT IN (SELECT game_id FROM game_results WHERE player_id = ?)';
    $params[] = $pid;
}

// --- Metric expressions (delegated to lib/sql-helpers.php) ---
function metricExpression(string $metric): string {
    return comparisonMetricExpr($metric);
}

// --- Build GROUP BY specific query ---
function buildQuery(
    string $groupBy,
    array $where,
    array &$params,
    int $minGames,
    array $filterPlayerIds,
    array $filterDeckIds,
    array $filterCommanders,
    bool $needsRecent,
    ?int $topN = null,
    ?int $perspectivePlayerId = null
): string {
    $podSubquery = podSizeSubquery();

    // Determine SELECT, GROUP BY, ORDER BY, and entity filter for each groupBy
    switch ($groupBy) {
        case 'player':
            $select  = 'gr.player_id AS id, p.name AS label, NULL AS sublabel';
            $joins   = "JOIN players p ON gr.player_id = p.id JOIN decks d ON gr.deck_id = d.id JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = 'gr.player_id';
            $orderBy = 'win_rate DESC';
            if ($filterPlayerIds) {
                $in = implode(',', array_fill(0, count($filterPlayerIds), '?'));
                $where[] = "gr.player_id IN ($in)";
                $params  = array_merge($params, $filterPlayerIds);
            }
            break;

        case 'deck':
            $select  = "gr.deck_id AS id, d.name AS label, p.name AS sublabel, d.commander AS commander, IF(d.colors IS NULL OR d.colors = '', 'C', d.colors) AS colors";
            $joins   = "JOIN decks d ON gr.deck_id = d.id JOIN players p ON d.player_id = p.id JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = 'gr.deck_id';
            $orderBy = 'win_rate DESC';
            if ($filterDeckIds) {
                $in = implode(',', array_fill(0, count($filterDeckIds), '?'));
                $where[] = "gr.deck_id IN ($in)";
                $params  = array_merge($params, $filterDeckIds);
            }
            if ($filterPlayerIds) {
                $in = implode(',', array_fill(0, count($filterPlayerIds), '?'));
                $where[] = "d.player_id IN ($in)";
                $params  = array_merge($params, $filterPlayerIds);
            }
            break;

        case 'commander':
            $select  = 'd.commander AS id, d.commander AS label, NULL AS sublabel';
            $joins   = "JOIN decks d ON gr.deck_id = d.id JOIN players p ON gr.player_id = p.id JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = 'd.commander';
            $orderBy = 'win_rate DESC';
            if ($filterCommanders) {
                $in = implode(',', array_fill(0, count($filterCommanders), '?'));
                $where[] = "d.commander IN ($in)";
                $params  = array_merge($params, $filterCommanders);
            }
            break;

        case 'color':
            // colors column is canonical WUBRG order since migration; empty/null → 'C'
            $normColors = "IF(d.colors IS NULL OR d.colors = '', 'C', d.colors)";
            $select  = "$normColors AS id, $normColors AS label, NULL AS sublabel, $normColors AS colors";
            $joins   = "JOIN decks d ON gr.deck_id = d.id JOIN players p ON gr.player_id = p.id JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = $normColors;
            $orderBy = 'win_rate DESC';
            // filter_colors now handled in shared WHERE via has_X columns
            break;

        case 'deck_age':
            // Bucket deck age at time of play
            $select  = "CASE
                WHEN DATEDIFF(g.played_at, d.created_at) <= 30 THEN 'new'
                WHEN DATEDIFF(g.played_at, d.created_at) <= 90 THEN 'growing'
                ELSE 'established'
              END AS id,
              CASE
                WHEN DATEDIFF(g.played_at, d.created_at) <= 30 THEN 'New (0-30 days)'
                WHEN DATEDIFF(g.played_at, d.created_at) <= 90 THEN 'Growing (31-90 days)'
                ELSE 'Established (91+ days)'
              END AS label,
              NULL AS sublabel";
            $joins   = "JOIN decks d ON gr.deck_id = d.id JOIN players p ON gr.player_id = p.id JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = "CASE WHEN DATEDIFF(g.played_at, d.created_at) <= 30 THEN 'new' WHEN DATEDIFF(g.played_at, d.created_at) <= 90 THEN 'growing' ELSE 'established' END";
            $orderBy = 'total_games DESC';
            if ($filterPlayerIds) {
                $in = implode(',', array_fill(0, count($filterPlayerIds), '?'));
                $where[] = "gr.player_id IN ($in)";
                $params  = array_merge($params, $filterPlayerIds);
            }
            break;

        case 'pod_size':
            $select  = "pod.pod_size AS id, CONCAT(pod.pod_size, '-player') AS label, NULL AS sublabel";
            $joins   = "JOIN decks d ON gr.deck_id = d.id JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = 'pod.pod_size';
            $orderBy = 'pod.pod_size ASC';
            // Entity filter: narrow whose stats appear per bucket
            if ($filterPlayerIds) {
                $in = implode(',', array_fill(0, count($filterPlayerIds), '?'));
                $where[] = "gr.player_id IN ($in)";
                $params  = array_merge($params, $filterPlayerIds);
            }
            break;

        case 'game_length':
            $select  = "CASE
                WHEN g.winning_turn IS NULL THEN 'unknown'
                WHEN g.winning_turn <= 4 THEN '1-4'
                WHEN g.winning_turn <= 9 THEN '5-9'
                WHEN g.winning_turn <= 14 THEN '10-14'
                ELSE '15+'
              END AS id,
              CASE
                WHEN g.winning_turn IS NULL THEN 'Unknown'
                WHEN g.winning_turn <= 4 THEN '1-4 turns'
                WHEN g.winning_turn <= 9 THEN '5-9 turns'
                WHEN g.winning_turn <= 14 THEN '10-14 turns'
                ELSE '15+ turns'
              END AS label,
              NULL AS sublabel";
            $joins   = "JOIN decks d ON gr.deck_id = d.id JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = "CASE WHEN g.winning_turn IS NULL THEN 'unknown' WHEN g.winning_turn <= 4 THEN '1-4' WHEN g.winning_turn <= 9 THEN '5-9' WHEN g.winning_turn <= 14 THEN '10-14' ELSE '15+' END";
            $orderBy = 'id ASC';
            if ($filterPlayerIds) {
                $in = implode(',', array_fill(0, count($filterPlayerIds), '?'));
                $where[] = "gr.player_id IN ($in)";
                $params  = array_merge($params, $filterPlayerIds);
            }
            break;

        case 'game_type':
            $select  = 'g.game_type AS id, g.game_type AS label, NULL AS sublabel';
            $joins   = "JOIN decks d ON gr.deck_id = d.id JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = 'g.game_type';
            $orderBy = 'total_games DESC';
            if ($filterPlayerIds) {
                $in = implode(',', array_fill(0, count($filterPlayerIds), '?'));
                $where[] = "gr.player_id IN ($in)";
                $params  = array_merge($params, $filterPlayerIds);
            }
            break;

        case 'month':
            $select  = "DATE_FORMAT(g.played_at, '%Y-%m') AS id, DATE_FORMAT(g.played_at, '%b %Y') AS label, NULL AS sublabel";
            $joins   = "JOIN decks d ON gr.deck_id = d.id JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = "DATE_FORMAT(g.played_at, '%Y-%m')";
            $orderBy = 'id DESC';
            if ($filterPlayerIds) {
                $in = implode(',', array_fill(0, count($filterPlayerIds), '?'));
                $where[] = "gr.player_id IN ($in)";
                $params  = array_merge($params, $filterPlayerIds);
            }
            break;

        case 'year':
            $select  = "YEAR(g.played_at) AS id, YEAR(g.played_at) AS label, NULL AS sublabel";
            $joins   = "JOIN decks d ON gr.deck_id = d.id JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = 'YEAR(g.played_at)';
            $orderBy = 'id DESC';
            if ($filterPlayerIds) {
                $in = implode(',', array_fill(0, count($filterPlayerIds), '?'));
                $where[] = "gr.player_id IN ($in)";
                $params  = array_merge($params, $filterPlayerIds);
            }
            break;

        case 'season':
            $select  = "CONCAT(YEAR(g.played_at), '-Q', QUARTER(g.played_at)) AS id,
              CONCAT('Q', QUARTER(g.played_at), ' ', YEAR(g.played_at)) AS label,
              NULL AS sublabel";
            $joins   = "JOIN decks d ON gr.deck_id = d.id JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = "CONCAT(YEAR(g.played_at), '-Q', QUARTER(g.played_at))";
            $orderBy = 'id DESC';
            if ($filterPlayerIds) {
                $in = implode(',', array_fill(0, count($filterPlayerIds), '?'));
                $where[] = "gr.player_id IN ($in)";
                $params  = array_merge($params, $filterPlayerIds);
            }
            break;

        case 'day_of_week':
            $select  = "DAYOFWEEK(g.played_at) AS id,
              CASE DAYOFWEEK(g.played_at)
                WHEN 1 THEN 'Sunday' WHEN 2 THEN 'Monday' WHEN 3 THEN 'Tuesday'
                WHEN 4 THEN 'Wednesday' WHEN 5 THEN 'Thursday' WHEN 6 THEN 'Friday'
                ELSE 'Saturday'
              END AS label,
              NULL AS sublabel";
            $joins   = "JOIN decks d ON gr.deck_id = d.id JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = 'DAYOFWEEK(g.played_at)';
            $orderBy = 'id ASC';
            if ($filterPlayerIds) {
                $in = implode(',', array_fill(0, count($filterPlayerIds), '?'));
                $where[] = "gr.player_id IN ($in)";
                $params  = array_merge($params, $filterPlayerIds);
            }
            break;

        case 'opponent_player':
            $select  = 'opp_player.id AS id, opp_player.name AS label, NULL AS sublabel';
            $joins   = "JOIN players p ON gr.player_id = p.id"
                . " JOIN decks d ON gr.deck_id = d.id"
                . " JOIN game_results gr_opp ON gr_opp.game_id = gr.game_id AND gr_opp.player_id != gr.player_id"
                . " JOIN players opp_player ON gr_opp.player_id = opp_player.id"
                . " JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = 'opp_player.id';
            $orderBy = 'win_rate DESC';
            if ($perspectivePlayerId) {
                $where[] = 'gr.player_id = ?';
                $params[] = $perspectivePlayerId;
            }
            if ($filterPlayerIds) {
                $in = implode(',', array_fill(0, count($filterPlayerIds), '?'));
                $where[] = "opp_player.id IN ($in)";
                $params  = array_merge($params, $filterPlayerIds);
            }
            break;

        case 'opponent_commander':
            $select  = 'd_opp.commander AS id, d_opp.commander AS label, NULL AS sublabel';
            $joins   = "JOIN players p ON gr.player_id = p.id"
                . " JOIN decks d ON gr.deck_id = d.id"
                . " JOIN game_results gr_opp ON gr_opp.game_id = gr.game_id AND gr_opp.player_id != gr.player_id"
                . " JOIN decks d_opp ON gr_opp.deck_id = d_opp.id"
                . " JOIN $podSubquery ON pod.game_id = g.id";
            $groupSql = 'd_opp.commander';
            $orderBy = 'win_rate DESC';
            if ($perspectivePlayerId) {
                $where[] = 'gr.player_id = ?';
                $params[] = $perspectivePlayerId;
            }
            if ($filterCommanders) {
                $in = implode(',', array_fill(0, count($filterCommanders), '?'));
                $where[] = "d_opp.commander IN ($in)";
                $params  = array_merge($params, $filterCommanders);
            }
            break;

        default:
            sendError("Unsupported group_by: $groupBy");
    }

    $whereClause = implode(' AND ', $where);
    $havingClause = "COUNT(gr.id) >= $minGames";
    $limitClause = $topN !== null ? "LIMIT $topN" : '';

    $sql = "
        SELECT
            $select,
            COUNT(gr.id) AS total_games,
            SUM(gr.finish_position = 1) AS wins,
            ROUND(SUM(gr.finish_position = 1) / COUNT(gr.id) * 100, 1) AS win_rate,
            ROUND(AVG(gr.finish_position), 2) AS avg_finish_position,
            ROUND(AVG(CASE WHEN gr.finish_position > 1 THEN gr.eliminated_turn END), 1) AS avg_survival_turns,
            ROUND(AVG(CASE WHEN gr.finish_position = 1 THEN g.winning_turn END), 1) AS avg_turns_to_win,
            ROUND(SUM(gr.finish_position <= 2) / COUNT(gr.id) * 100, 1) AS top2_rate,
            ROUND(SUM(gr.finish_position > 1) / COUNT(gr.id) * 100, 1) AS elimination_rate,
            ROUND(STDDEV_POP(gr.finish_position), 2) AS std_dev_finish_position,
            ROUND(SUM(gr.finish_position = pod.pod_size) / COUNT(gr.id) * 100, 1) AS first_elimination_rate
        FROM game_results gr
        JOIN games g ON gr.game_id = g.id
        $joins
        WHERE $whereClause
        GROUP BY $groupSql
        HAVING $havingClause
        ORDER BY $orderBy
        $limitClause
    ";

    return $sql;
}

$needsRecent = in_array('recent_win_rate', $metrics, true);

$sql = buildQuery(
    $groupBy, $where, $params, $minGames,
    $filterPlayerIds, $filterDeckIds, $filterCommanders,
    $needsRecent, $topN, $perspectivePlayerId
);

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
} catch (PDOException $e) {
    error_log('comparison.php query failed: ' . $e->getMessage());
    sendError('Query failed', 500);
}

// --- Compute recent_win_rate if requested ---
function computeRecentWinRate(
    PDO $pdo,
    string $groupBy,
    array $rows,
    array $where,
    array $params,
    array $filterPlayerIds,
    array $filterDeckIds,
    array $filterCommanders
): array {
    $recent = [];
    foreach ($rows as $row) {
        $entityId   = $row['id'];
        $localWhere = $where;
        $localParams = $params;

        switch ($groupBy) {
            case 'player':
                $localWhere[] = 'gr.player_id = ?';
                $localParams[] = (string)$entityId;
                break;
            case 'deck':
                $localWhere[] = 'gr.deck_id = ?';
                $localParams[] = (string)$entityId;
                break;
            case 'commander':
                $localWhere[] = 'd.commander = ?';
                $localParams[] = $entityId;
                break;
            case 'color':
                $localWhere[] = "IF(d.colors IS NULL OR d.colors = '', 'C', d.colors) = ?";
                $localParams[] = $entityId;
                break;
            default:
                $recent[$entityId] = null;
                continue 2;
        }

        $podSub = podSizeSubquery();
        $joins = 'JOIN decks d ON gr.deck_id = d.id JOIN players p ON gr.player_id = p.id'
            . " JOIN $podSub ON pod.game_id = g.id";

        $whereClause = implode(' AND ', $localWhere);
        $subSql = "
            SELECT gr.finish_position
            FROM game_results gr
            JOIN games g ON gr.game_id = g.id
            $joins
            WHERE $whereClause
            ORDER BY g.played_at DESC, g.id DESC
            LIMIT 5
        ";

        $subStmt = $pdo->prepare($subSql);
        $subStmt->execute($localParams);
        $subRows = $subStmt->fetchAll();

        if (count($subRows) === 0) {
            $recent[$entityId] = null;
        } else {
            $wins = array_sum(array_column($subRows, 'finish_position'));
            // finish_position=1 means win; sum of (fp===1) per row
            $wCount = count(array_filter($subRows, fn($r) => (int)$r['finish_position'] === 1));
            $recent[$entityId] = round($wCount / count($subRows) * 100, 1);
        }
    }
    return $recent;
}

$recentRates = [];
if ($needsRecent) {
    $recentRates = computeRecentWinRate(
        $pdo, $groupBy, $rows, $where, $params,
        $filterPlayerIds, $filterDeckIds, $filterCommanders
    );
}

// --- Format response ---
$entities = array_map(function($row) use ($needsRecent, $recentRates) {
    $id = $row['id'];
    return [
        'id'                  => $id,
        'label'               => (string)$row['label'],
        'sublabel'            => $row['sublabel'] ?? null,
        'commander'           => $row['commander'] ?? null,
        'colors'              => $row['colors'] ?? null,
        'total_games'         => (int)$row['total_games'],
        'wins'                => (int)$row['wins'],
        'win_rate'            => $row['win_rate'] !== null ? (float)$row['win_rate'] : null,
        'avg_finish_position' => $row['avg_finish_position'] !== null ? (float)$row['avg_finish_position'] : null,
        'recent_win_rate'     => $needsRecent ? ($recentRates[$id] ?? null) : null,
        'avg_survival_turns'  => $row['avg_survival_turns'] !== null ? (float)$row['avg_survival_turns'] : null,
        'avg_turns_to_win'    => $row['avg_turns_to_win'] !== null ? (float)$row['avg_turns_to_win'] : null,
        'top2_rate'                => $row['top2_rate'] !== null ? (float)$row['top2_rate'] : null,
        'elimination_rate'         => $row['elimination_rate'] !== null ? (float)$row['elimination_rate'] : null,
        'std_dev_finish_position'  => $row['std_dev_finish_position'] !== null ? (float)$row['std_dev_finish_position'] : null,
        'first_elimination_rate'   => $row['first_elimination_rate'] !== null ? (float)$row['first_elimination_rate'] : null,
    ];
}, $rows);

// Build conditions object for response (only non-null fields)
$conditions = array_filter([
    'game_type'            => ($gameType && $gameType !== 'all') ? $gameType : null,
    'pod_size'             => $podSize,
    'min_winning_turn'     => $minWinTurn,
    'max_winning_turn'     => $maxWinTurn,
    'min_finish_position'  => $minFinishPos,
    'required_player_ids'  => $reqPlayerIds ?: null,
    'required_commanders'  => $reqCommanders ?: null,
    'date_from'            => $dateFrom,
    'date_to'              => $dateTo,
    'min_games'            => $minGames > 1 ? $minGames : null,
    'must_include_colors'  => $mustIncludeColors ?: null,
    'color_mode'           => ($mustIncludeColors && $colorMode !== 'and') ? $colorMode : null,
    'my_games_only'        => $myGamesOnly ?: null,
    'my_decks_only'        => $myDecksOnly ?: null,
    'opponent_player_ids'  => $oppPlayerIds ?: null,
    'opponent_commanders'  => $oppCommanders ?: null,
    'opponent_colors'      => $oppColors ?: null,
    'opponent_color_mode'  => ($oppColors && $oppColorMode !== 'and') ? $oppColorMode : null,
    'exclude_player_ids'   => $excludePlayerIds ?: null,
], fn($v) => $v !== null);

sendJSON([
    'groupBy'    => $groupBy,
    'metrics'    => array_values($metrics),
    'conditions' => $conditions,
    'top_n'      => $topN,
    'entities'   => $entities,
]);
