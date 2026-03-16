# Commander Collector — Search Architecture & Improvement Plan

> **Status**: Planning document. No code has been changed. Review and approve before implementation.

---

## Table of Contents

1. [Architecture Diagram](#architecture-diagram)
2. [Search Paths Reference](#search-paths-reference)
3. [Color Filter Semantics](#color-filter-semantics)
4. [Current Bugs & Gaps](#current-bugs--gaps)
5. [Missing Scenarios](#missing-scenarios)
6. [Proposed Changes](#proposed-changes)
7. [Panel Builder Enhancements](#panel-builder-enhancements)
8. [New API Capabilities](#new-api-capabilities)
9. [Implementation Plan](#implementation-plan)

---

## Architecture Diagram

See [`search-architecture.png`](./Commander%20Collector%20—%20Search%20Architecture.png) (generated from `search-architecture.puml`).

---

## Search Paths Reference

### Path 1 — Decks Page (Client-Side)

**File**: `app/decks/page.tsx`
**How it works**: Loads ALL decks once via `api.getDecks()`, then filters entirely in-browser using `useMemo`.

| Filter | Input | Logic |
|--------|-------|-------|
| Text search | `TextField` | `deck.name.includes(q) \|\| deck.commander.includes(q)` — case-insensitive substring |
| Player | `Select` dropdown | Exact match on `player_name` |
| Color | 5 color chip toggles | **AND** — deck must contain ALL selected colors (`deck.colors.includes(c)`) |
| Sort | `Select` dropdown | name A-Z/Z-A, win rate high/low, games most/least |

**How to affect it**: All filtering is in `filteredDecks` useMemo (lines 104–154). No backend call is made for filtering — changes here are frontend-only.

---

### Path 2 — Comparison Builder (Stats Page → `comparison.php`)

**File**: `app/stats/page.tsx` → `app/lib/api.ts:buildComparisonParams()` → `app/php-api/comparison.php`

This is the most powerful path. The frontend builds a `ComparisonConfig` object that gets serialized to query params.

#### Group By (`group_by`)

Controls how results are bucketed. One of:

| Value | Groups by | Notes |
|-------|-----------|-------|
| `player` | Player | Entity filter: `filter_player_ids[]` |
| `deck` | Deck | Entity filter: `filter_deck_ids[]`, `filter_player_ids[]` |
| `commander` | Commander name | Entity filter: `filter_commanders[]` |
| `color` | Exact color string | Entity filter: `filter_colors[]` — **see bugs below** |
| `deck_age` | New / Growing / Established | Bins by DATEDIFF(played_at, deck.created_at) |
| `pod_size` | Number of players | Numeric; ≥5 treated as "5+" |
| `game_length` | Turn buckets | 1-4, 5-9, 10-14, 15+ |
| `game_type` | standard / 2hg | |
| `month` | YYYY-MM | |
| `year` | YYYY | |
| `season` | Q1–Q4 per year | |
| `day_of_week` | Mon–Sun | |

#### Metrics (`metrics`, comma-separated)

| Value | SQL expression |
|-------|----------------|
| `win_rate` | `SUM(finish_position=1) / COUNT(*) * 100` |
| `total_games` | `COUNT(gr.id)` |
| `wins` | `SUM(finish_position=1)` |
| `avg_finish_position` | `AVG(finish_position)` |
| `avg_survival_turns` | `AVG(eliminated_turn)` where finish_position > 1 |
| `avg_turns_to_win` | `AVG(winning_turn)` where finish_position = 1 |
| `top2_rate` | `SUM(finish_position <= 2) / COUNT(*) * 100` |
| `elimination_rate` | `SUM(finish_position > 1) / COUNT(*) * 100` |
| `recent_win_rate` | Last 5 games win rate — runs N additional queries (one per entity) |

#### Conditions (narrow which games are counted)

| Param | Type | Effect |
|-------|------|--------|
| `game_type` | `standard\|2hg\|all` | `g.game_type = ?` |
| `pod_size` | int | `pod.pod_size = ?` (≥5 → `>= 5`) |
| `min_winning_turn` | int | `g.winning_turn >= ?` |
| `max_winning_turn` | int | `g.winning_turn <= ?` |
| `min_finish_position` | int | `gr.finish_position <= ?` (confusingly named — lower = better) |
| `date_from` | YYYY-MM-DD | `g.played_at >= ?` |
| `date_to` | YYYY-MM-DD | `g.played_at <= ?` |
| `min_games` | int | `HAVING COUNT(gr.id) >= ?` |
| `required_player_ids[]` | int[] | Subquery: `g.id IN (SELECT game_id WHERE player_id = ?)` — one per ID, all must be in same game |
| `required_commanders[]` | string[] | Subquery: commander must be present in the game |
| `must_include_colors[]` | string[] | `d.has_X = 1` for each color — **AND only, see bugs** |

#### Entity Filters (narrow which rows appear in results)

| Param | Applies when group_by = |
|-------|------------------------|
| `filter_player_ids[]` | player, deck, deck_age, pod_size, game_length, game_type, month, year, season, day_of_week |
| `filter_deck_ids[]` | deck |
| `filter_commanders[]` | commander |
| `filter_colors[]` | **color only** — **see bugs** |

---

### Path 3 — Stats / Advanced Stats

**Files**: `app/php-api/stats.php`, `app/php-api/advanced-stats.php`
No search params beyond `player_id` / `deck_id`. Returns pre-aggregated data.

---

### Path 4 — Head to Head

**File**: `app/php-api/head-to-head.php`
Params: `player1` (int), `player2` (int) — both optional.
Runs two queries: one for 2-player games, one for multiplayer.

---

### Path 5 — Simple Entity Lookups

| Endpoint | Params | Notes |
|----------|--------|-------|
| `decks.php` | `id`, `player_id` | Returns stats joined |
| `players.php` | `id` | Returns stats joined |
| `games.php` | `id` | Returns all results via GROUP_CONCAT |

---

## Color Filter Semantics

### The Correct Mental Model

> A deck that **contains** a color **is** that color.
> A deck with colors `BG` **is** both Black and Green.
> Filtering for B should return ALL decks where `has_b = 1` — including `B`, `BG`, `WBG`, `WUBRG`, etc.

### Three Modes Needed

| Mode | When to apply | SQL pattern (example: B selected + G selected) |
|------|--------------|-----------------------------------------------|
| **AND** *(default)* | 2+ colors — "contains all of these" | `has_b = 1 AND has_g = 1` |
| **OR** | 2+ colors — "contains any of these" | `(has_b = 1 OR has_g = 1)` |
| **Only** | 1+ colors — "contains exactly these and nothing else" | `has_b = 1 AND has_g = 1 AND has_w = 0 AND has_u = 0 AND has_r = 0` |

**Single color selected:**
- AND and OR are equivalent — `has_b = 1`
- Only = mono-color — `has_b = 1 AND has_w = 0 AND has_u = 0 AND has_r = 0 AND has_g = 0`

**No colors selected:** no filter applied.

The mode toggle (AND / OR / Only) should only appear when at least one color is selected.

---

## Current Bugs & Gaps

### Bug 1 — `filter_colors` uses exact string match, not has_X columns

**Location**: `comparison.php`, lines 197–212 (inside `case 'color':`)

**Current behavior**:
```php
$where[] = "($normColors) = ?";  // exact match: colors = 'B'
$params[] = $normalized;
```

**Problem**: If you filter for `B`, you only get decks where `colors = 'B'` (mono-black). Decks with `colors = 'BG'` or `colors = 'WB'` are excluded — violating the "is that color" rule.

**Expected**: `has_b = 1` (returns all decks containing B, regardless of other colors).

---

### Bug 2 — `filter_colors` only works when `group_by = color`

**Location**: `comparison.php` — `filter_colors` is only consumed inside `case 'color':`. For all other group_bys, it is silently ignored.

**Problem**: You cannot say "show me player stats, but only counting games where they played a Black deck." The `filter_colors` entity filter should be applicable for any `group_by`.

---

### Bug 3 — Decks page color filter is hardcoded AND

**Location**: `app/decks/page.tsx`, lines 121–128

**Current behavior**:
```ts
for (const c of colorFilter) {
  if (!d.colors.includes(c)) return false;  // AND — must include ALL
}
```

**Problem**: No way to do OR ("show me decks that run B or G") or Only ("show me mono-black decks").

---

### Bug 4 — `must_include_colors` is AND-only, no OR or Only mode

**Location**: `comparison.php`, lines 113–116; `types.ts` `ComparisonConditions.must_include_colors`

**Problem**: Same as Bug 3 — the condition "deck must include colors" supports AND only. No OR or Only.

---

## Missing Scenarios

The following queries **cannot be expressed** with the current API surface:

| # | Scenario | Why it fails |
|---|----------|-------------|
| 1 | "Show me all decks that run Black OR Green" | No OR mode on color filter |
| 2 | "Show me only mono-black decks" | No Only mode |
| 3 | "Show me only Golgari (exactly BG) decks" | No Only mode |
| 4 | "Show player win rates in games where they played a Black deck" | `filter_colors` ignored when `group_by = player` |
| 5 | "Compare commander win rates for commanders with Black in their color identity" | Same — `filter_colors` not applied to `group_by = commander` |
| 6 | "Show stats for decks that contain B or G (not necessarily both)" | No OR mode in `must_include_colors` |
| 7 | "Show deck stats for decks that are exactly W/U (no other colors)" | No Only mode in `must_include_colors` |

---

## Proposed Changes

### Change 1 — New `color_mode` param for `must_include_colors` (comparison.php)

**Add**: `color_mode` query param — `'and'` (default) | `'or'` | `'only'`

**PHP logic (comparison.php)**:
```php
// Current (AND only):
foreach ($mustIncludeColors as $color) {
    $where[] = 'd.' . $colorColumnMap[$color] . ' = 1';
}

// Proposed:
if (!empty($mustIncludeColors)) {
    if ($colorMode === 'or') {
        $clauses = array_map(fn($c) => 'd.' . $colorColumnMap[$c] . ' = 1', $mustIncludeColors);
        $where[] = '(' . implode(' OR ', $clauses) . ')';
    } elseif ($colorMode === 'only') {
        foreach ($mustIncludeColors as $c) {
            $where[] = 'd.' . $colorColumnMap[$c] . ' = 1';
        }
        $excluded = array_diff(array_keys($colorColumnMap), $mustIncludeColors);
        foreach ($excluded as $c) {
            $where[] = 'd.' . $colorColumnMap[$c] . ' = 0';
        }
    } else { // 'and' (default)
        foreach ($mustIncludeColors as $c) {
            $where[] = 'd.' . $colorColumnMap[$c] . ' = 1';
        }
    }
}
```

---

### Change 2 — Fix `filter_colors` to use has_X columns + apply to all group_bys

**Current**: Only in `case 'color':`, uses exact string match.
**Proposed**: Move `filter_colors` processing to the shared WHERE block (before `buildQuery()`), apply `has_X` logic with mode support.

New param: `filter_color_mode` — `'and'` | `'or'` | `'only'`

```php
// Move out of case 'color': into shared WHERE section
if (!empty($filterColors)) {
    $validColors = array_intersect(array_map('strtoupper', $filterColors), ['W', 'U', 'B', 'R', 'G']);
    if (!empty($validColors)) {
        if ($filterColorMode === 'or') {
            $clauses = array_map(fn($c) => 'd.' . $colorColumnMap[$c] . ' = 1', $validColors);
            $where[] = '(' . implode(' OR ', $clauses) . ')';
        } elseif ($filterColorMode === 'only') {
            foreach ($validColors as $c) $where[] = 'd.' . $colorColumnMap[$c] . ' = 1';
            foreach (array_diff(['W','U','B','R','G'], $validColors) as $c) {
                $where[] = 'd.' . $colorColumnMap[$c] . ' = 0';
            }
        } else { // 'and'
            foreach ($validColors as $c) $where[] = 'd.' . $colorColumnMap[$c] . ' = 1';
        }
    }
}
```

> **Note**: When `group_by = color`, the existing exact-match entity filter in the `case 'color':` block should be **removed** — it will be replaced by the shared WHERE above.

---

### Change 3 — Decks page color filter: add AND / OR / Only toggle

**Current**: Hardcoded AND — no toggle exists.

**Proposed state**:
```ts
type ColorMode = 'and' | 'or' | 'only';
const [colorMode, setColorMode] = useState<ColorMode>('and');
```

**Toggle UI**: A small segmented control (MUI `ToggleButtonGroup`) that appears **only when at least one color chip is selected**. Positioned inline with the color chips.

**Filter logic**:
```ts
if (colorFilter.size > 0) {
  result = result.filter((d) => {
    const selected = [...colorFilter];
    if (colorMode === 'or') {
      return selected.some(c => d.colors.includes(c));
    } else if (colorMode === 'only') {
      const hasAll = selected.every(c => d.colors.includes(c));
      const hasNone = ['W','U','B','R','G']
        .filter(c => !selected.includes(c as MtgColor))
        .every(c => !d.colors.includes(c));
      return hasAll && hasNone;
    } else { // 'and'
      return selected.every(c => d.colors.includes(c));
    }
  });
}
```

---

### Change 4 — TypeScript types

Update `ComparisonConditions` and `ComparisonEntityFilter` in `app/lib/types.ts`:

```ts
export type ColorFilterMode = 'and' | 'or' | 'only';

export interface ComparisonConditions {
  // ... existing fields ...
  must_include_colors?: string[];
  color_mode?: ColorFilterMode;           // NEW — default 'and'
}

export interface ComparisonEntityFilter {
  // ... existing fields ...
  colors?: string[];
  color_mode?: ColorFilterMode;           // NEW — default 'and'
}
```

---

### Change 5 — `buildComparisonParams()` in `api.ts`

Add `color_mode` and `filter_color_mode` to the URL builder:

```ts
if (c.must_include_colors?.length) {
  c.must_include_colors.forEach(color => parts.push(`must_include_colors[]=${encodeURIComponent(color)}`));
  if (c.color_mode && c.color_mode !== 'and') {
    parts.push(`color_mode=${c.color_mode}`);
  }
}

if (ef?.colors?.length) {
  ef.colors.forEach(c => parts.push(`filter_colors[]=${encodeURIComponent(c)}`));
  if (ef.color_mode && ef.color_mode !== 'and') {
    parts.push(`filter_color_mode=${ef.color_mode}`);
  }
}
```

---

### Change 6 — Stats page UI: add color mode toggle

In the Conditions panel (where `must_include_colors` chips are shown) and the Entity Filter panel (where `filter_colors` is shown): add an AND / OR / Only `ToggleButtonGroup` that appears when ≥1 color is selected.

---

---

## Panel Builder Enhancements

> Scope: `app/stats/customize/page.tsx` → `ComparisonBuilder` sub-form.
> The predefined-sections tab is low value and will be removed. The builder becomes the single panel type.

### Builder Structure (A → D sections, revised)

#### Section A — Conditions *(what games are counted)*

| Control | Current | Change |
|---------|---------|--------|
| Game Type | ChipGroup (All/Commander/2HG) | No change |
| Pod Size | ChipGroup (Any/3/4/5+) | No change |
| Game Length | number + checkboxes | No change |
| Count As Win | ChipGroup | No change |
| **Deck colors** | 5 chips, AND-only | Add AND / OR / Only toggle beneath chips; appears when ≥1 chip selected |
| **My games only** | *(missing)* | Add toggle — "Only count games where I was at the table." Requires claimed player; hidden if user has no claimed player |
| **Opponent players** | *(missing)* | Multi-select autocomplete — "These players were also in the pod." Each selected player is required (ALL must be present) |
| **Opponent commanders** | freeSolo, no suggestions | Pull options from loaded `decks` data; "These commanders were also in the pod." |
| **Opponent colors** | *(missing)* | 5 chips + AND / OR / Only toggle — "At least one opponent's deck matched this color filter." |
| **Exclude players** | *(missing)* | Multi-select autocomplete — "These players were NOT in the pod." |
| Required players | Autocomplete | Rename label to "All of these players were present" for clarity |
| Required commanders | freeSolo, no suggestions | Pull from loaded decks data |
| Date range | Two date pickers | No change |
| Min games | Number field | No change |
| **Top N results** | *(missing)* | Number field — "Show only top N results (by primary metric)." Optional, no limit if blank |

#### Section B — Group By *(how results are bucketed)*

**Entity group-bys** (rows = a specific entity):

| Value | Rows represent | New? |
|-------|---------------|------|
| Player | Each player | existing |
| Deck | Each deck | existing |
| Commander | Each commander | existing |
| Color | Each color identity | existing |
| Deck Age | New / Growing / Established | existing |
| **Opponent Player** | Each co-player — "When [player] was at the table, how did you/everyone do?" | **new** |
| **Opponent Commander** | Each opposing commander — "When [commander] was in the pod, how did you/everyone do?" | **new** |

**Game property group-bys** (rows = a game attribute): no change — Pod Size, Game Length, Game Type, Month, Year, Season, Day of Week.

#### Section C — Narrow To *(which entities appear in results)*

| group_by | Current | Change |
|----------|---------|--------|
| player | Player autocomplete | Add color filter (with mode) — "only players who played decks of this color" |
| deck | Player + deck autocompletes | Add color filter with mode |
| commander | Free-text autocomplete | Pull commander options from loaded decks data |
| color | Text autocomplete + hardcoded combo list | **Replace** with 5 chips + AND/OR/Only mode — matches the same has_X semantics |
| deck_age | Player autocomplete | Add color filter with mode |
| opponent_player | *(new)* | Player autocomplete — "show only these opponents in results" |
| opponent_commander | *(new)* | Commander autocomplete — "show only these commanders in results" |
| all non-entity group_bys | Player autocomplete | Add color filter with mode |

**Color filter in Narrow To** is the same AND/OR/Only chip control as section A. It applies `has_X` logic against the entity's deck(s), fixing the current exact-string-match bug.

#### Section D — Metrics *(what is calculated per row)*

| Metric | Current | Change |
|--------|---------|--------|
| Win Rate | ✓ | No change |
| Wins | ✓ | No change |
| Total Games | ✓ | No change |
| Avg Finish Position | ✓ | No change |
| Recent Win Rate | ✓ | No change |
| Avg Survival Turns | ✓ | No change |
| Avg Turns to Win | ✓ | No change |
| Top-2 Rate | ✓ | No change |
| Elimination Rate | ✓ | No change |
| **Consistency Score** | *(missing)* | Std dev of finish position — low = consistent, high = swingy |
| **First Eliminated Rate** | *(missing)* | % of games where this entity was knocked out first (finish_position = pod_size) |

---

## New API Capabilities

### New `comparison.php` Parameters

#### Conditions — Opponent Filters

| Param | Type | SQL |
|-------|------|-----|
| `opponent_player_ids[]` | int[] | `g.id IN (SELECT game_id FROM game_results WHERE player_id = ?)` — one subquery per ID, all must be in same game; same pattern as `required_player_ids` but semantically "someone else at the table" |
| `opponent_commanders[]` | string[] | `g.id IN (SELECT gr2.game_id FROM game_results gr2 JOIN decks d2 ON gr2.deck_id = d2.id WHERE d2.commander = ?)` — one per commander |
| `opponent_colors[]` + `opponent_color_mode` | string[], 'and'\|'or'\|'only' | `g.id IN (SELECT gr2.game_id FROM game_results gr2 JOIN decks d2 ON gr2.deck_id = d2.id WHERE d2.has_X = 1 ...)` — at least one opponent's deck matches the color filter |
| `exclude_player_ids[]` | int[] | `g.id NOT IN (SELECT game_id FROM game_results WHERE player_id = ?)` — one per ID |
| `my_games_only` | bool | `g.id IN (SELECT game_id FROM game_results WHERE player_id = ?)` using `$user->player_id`; no-op if user has no claimed player |

#### Conditions — Result Limiting

| Param | Type | SQL |
|-------|------|-----|
| `top_n` | int | Wrap the main query in a subquery or use `LIMIT ?` after `ORDER BY` |

> **Note on `top_n`**: The current query structure uses `ORDER BY` + `HAVING`. `LIMIT` must come after both. This is straightforward for most group_bys. For `recent_win_rate`, the post-query PHP loop still runs but only on the top-N rows, so no performance concern.

#### New Group-Bys: `opponent_player` and `opponent_commander`

These group-bys answer: *"For each entity that appeared in the same game as the results-subject, what are the stats?"*

**`opponent_player`**
- Requires a perspective player (set via `my_games_only` or `required_player_ids`) — otherwise every player appears as both subject and opponent.
- SQL pattern: self-join on `game_results` — the outer row is the "me" side, the join pulls co-players.

```sql
SELECT
    opp_player.id AS id,
    opp_player.name AS label,
    NULL AS sublabel,
    COUNT(gr.id) AS total_games,
    SUM(gr.finish_position = 1) AS wins,
    ...
FROM game_results gr
JOIN games g ON gr.game_id = g.id
JOIN decks d ON gr.deck_id = d.id
-- Co-player join
JOIN game_results gr_opp ON gr_opp.game_id = gr.game_id
    AND gr_opp.player_id != gr.player_id
JOIN players opp_player ON gr_opp.player_id = opp_player.id
JOIN (SELECT game_id, COUNT(*) AS pod_size FROM game_results GROUP BY game_id) pod
    ON pod.game_id = g.id
WHERE [shared WHERE] AND gr.player_id = :perspective_player_id
GROUP BY opp_player.id
```

**`opponent_commander`** — same pattern, join on `decks d_opp` to get commander name.

> These group-bys are only meaningful when a perspective player is set. The form should enforce this — the perspective player field becomes required (not optional) when either group-by is selected.

#### New Metrics

| Metric | SQL expression |
|--------|----------------|
| `std_dev_finish_position` | `ROUND(STDDEV_POP(gr.finish_position), 2)` |
| `first_elimination_rate` | `ROUND(SUM(gr.finish_position = pod.pod_size) / COUNT(gr.id) * 100, 1)` — requires pod subquery (already present) |

#### TypeScript Type Changes (`app/lib/types.ts`)

```ts
export type ColorFilterMode = 'and' | 'or' | 'only';

export type ComparisonGroupBy =
  | 'player' | 'deck' | 'commander' | 'color' | 'deck_age'
  | 'pod_size' | 'game_length' | 'game_type'
  | 'month' | 'year' | 'season' | 'day_of_week'
  | 'opponent_player'       // NEW
  | 'opponent_commander';   // NEW

export type ComparisonMetric =
  | 'win_rate' | 'total_games' | 'wins' | 'avg_finish_position'
  | 'recent_win_rate' | 'avg_survival_turns' | 'avg_turns_to_win'
  | 'top2_rate' | 'elimination_rate'
  | 'std_dev_finish_position'  // NEW
  | 'first_elimination_rate';  // NEW

export interface ComparisonConditions {
  game_type?: 'all' | 'standard' | '2hg';
  pod_size?: number;
  min_winning_turn?: number;
  max_winning_turn?: number;
  min_finish_position?: number;
  required_player_ids?: number[];
  required_commanders?: string[];
  date_from?: string;
  date_to?: string;
  min_games?: number;
  must_include_colors?: string[];
  color_mode?: ColorFilterMode;           // NEW
  my_games_only?: boolean;               // NEW
  opponent_player_ids?: number[];        // NEW
  opponent_commanders?: string[];        // NEW
  opponent_colors?: string[];            // NEW
  opponent_color_mode?: ColorFilterMode; // NEW
  exclude_player_ids?: number[];         // NEW
}

export interface ComparisonEntityFilter {
  player_ids?: number[];
  deck_ids?: number[];
  commanders?: string[];
  colors?: string[];
  color_mode?: ColorFilterMode;          // NEW
}

export interface ComparisonConfig {
  groupBy: ComparisonGroupBy;
  conditions: ComparisonConditions;
  entityFilter?: ComparisonEntityFilter;
  metrics: ComparisonMetric[];
  top_n?: number;                        // NEW
}
```

---

## Implementation Plan

Suggested order. Each step is independently reviewable and deployable.

### Phase 1 — Bug Fixes (no new features, no UI changes)

| Step | What | Files |
|------|------|-------|
| 1 | Fix `filter_colors`: move to shared WHERE, switch exact-match to `has_X` columns | `comparison.php` |
| 2 | Add `color_mode` + `filter_color_mode` params | `comparison.php` |
| 3 | Update TypeScript types (color mode only) | `app/lib/types.ts` |
| 4 | Update `buildComparisonParams()` for color modes | `app/lib/api.ts` |
| 5 | Add color mode toggle to Decks page filter bar | `app/decks/page.tsx` |
| 6 | Add color mode toggle to customize builder (section A + section C) | `app/stats/customize/page.tsx` |

### Phase 2 — New Conditions

| Step | What | Files |
|------|------|-------|
| 7 | Add `my_games_only`, `opponent_player_ids[]`, `opponent_commanders[]`, `opponent_colors[]`, `opponent_color_mode`, `exclude_player_ids[]` params | `comparison.php` |
| 8 | Add `top_n` support (`LIMIT` on main query) | `comparison.php` |
| 9 | Update TypeScript types (all new condition + config fields) | `app/lib/types.ts` |
| 10 | Update `buildComparisonParams()` for new params | `app/lib/api.ts` |
| 11 | Add new condition controls to builder form (opponent filters, my-games toggle, exclude, top N) | `app/stats/customize/page.tsx` |

### Phase 3 — New Group-Bys & Metrics

| Step | What | Files |
|------|------|-------|
| 12 | Add `opponent_player` and `opponent_commander` group-bys | `comparison.php` |
| 13 | Add `std_dev_finish_position` and `first_elimination_rate` metrics | `comparison.php` |
| 14 | Update TypeScript types (new group-bys + metrics) | `app/lib/types.ts` |
| 15 | Add new group-bys to builder section B (with perspective-player enforcement) | `app/stats/customize/page.tsx` |
| 16 | Add new metrics to builder section D | `app/stats/customize/page.tsx` |
| 17 | Add Narrow To controls for `opponent_player` and `opponent_commander` group-bys | `app/stats/customize/page.tsx` |

### Phase 4 — Panel Builder Cleanup

| Step | What | Files |
|------|------|-------|
| 18 | Remove predefined-sections tab; builder becomes single panel type | `app/stats/customize/page.tsx` |
| 19 | Fix commander autocomplete to pull from loaded decks data | `app/stats/customize/page.tsx` |
| 20 | Replace color group-by entity filter (text autocomplete) with chip picker | `app/stats/customize/page.tsx` |
| 21 | Add color filter (with mode) to Narrow To for all group-bys | `app/stats/customize/page.tsx` |

No DB migrations needed for any phase. All new SQL uses existing columns and relationships.
