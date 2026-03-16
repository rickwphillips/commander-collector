# Commander Collector — Search & Panel Builder Implementation

## What This Is

You are implementing a planned set of improvements to the **Commander Collector** project — a Next.js/PHP app for tracking Magic: The Gathering Commander game data. The full plan lives at:

```
commander-collector/docs/SEARCH_PLAN.md
```

**Read that file first.** It contains the complete architecture, all bugs, all proposed changes, full TypeScript type diffs, SQL patterns, and a 4-phase implementation plan. Do not start coding until you have read it.

---

## Project Location

```
/Users/rick/FreddyRhetorickProjects/commander-collector/
```

Key files for this work:

| File | Role |
|------|------|
| `app/php-api/comparison.php` | Main search/analytics endpoint — most changes go here |
| `app/lib/types.ts` | TypeScript types for all comparison config, conditions, metrics |
| `app/lib/api.ts` | API client — `buildComparisonParams()` serializes config to query string |
| `app/decks/page.tsx` | Decks page with client-side color filter |
| `app/stats/customize/page.tsx` | Panel builder UI — `ComparisonBuilder` sub-form |

---

## Stack

- **Next.js 16** (App Router, `'use client'` pages), **React 19**, **TypeScript 5 strict**
- **MUI 7** + Emotion for UI components
- **PHP** endpoints in `app/php-api/` — pattern: `require_once 'config.php'`, switch on `$_SERVER['REQUEST_METHOD']`, helpers: `getDB()`, `sendJSON()`, `sendError()`
- **MySQL** — DB: `rickwphi_app_commander`
- Auth via JWT — `requireAuth()` returns `$user` with `player_id` if the user has claimed a player

---

## Color Semantics — Critical Concept

> A deck that **contains** a color **is** that color.
> Filtering for B must return ALL decks where `has_b = 1`, not just mono-black.

Three filter modes are needed everywhere colors are filtered:

| Mode | SQL (example: B + G selected) |
|------|-------------------------------|
| **AND** (default) | `has_b = 1 AND has_g = 1` |
| **OR** | `(has_b = 1 OR has_g = 1)` |
| **Only** | `has_b = 1 AND has_g = 1 AND has_w = 0 AND has_u = 0 AND has_r = 0` |

"Only" applies to whatever colors are selected — if just B is selected, Only = mono-black.

---

## Implementation Phases (from SEARCH_PLAN.md)

### Phase 1 — Bug Fixes
1. Fix `filter_colors` in `comparison.php`: move out of `case 'color':`, switch from exact string match to `has_X` columns, apply to all group_bys
2. Add `color_mode` + `filter_color_mode` params to `comparison.php`
3. Update TypeScript types (add `ColorFilterMode`, `color_mode` to conditions + entity filter)
4. Update `buildComparisonParams()` in `api.ts`
5. Add color mode toggle (AND/OR/Only `ToggleButtonGroup`) to Decks page filter bar
6. Add color mode toggles to `ComparisonBuilder` section A (conditions) and section C (Narrow To)

### Phase 2 — New Conditions
7. Add to `comparison.php`: `my_games_only`, `opponent_player_ids[]`, `opponent_commanders[]`, `opponent_colors[]` + `opponent_color_mode`, `exclude_player_ids[]`
8. Add `top_n` (`LIMIT` after `ORDER BY`)
9. Update TypeScript types (all new condition + config fields)
10. Update `buildComparisonParams()`
11. Add new condition controls to builder form

### Phase 3 — New Group-Bys & Metrics
12. Add `opponent_player` and `opponent_commander` group-bys to `comparison.php` (self-join pattern — see SEARCH_PLAN.md for SQL)
13. Add `std_dev_finish_position` (`STDDEV_POP`) and `first_elimination_rate` (`finish_position = pod_size`) metrics
14. Update TypeScript types
15–17. Add to builder UI: new group-bys in section B (with perspective-player enforcement), new metrics in section D, Narrow To controls for new group-bys

### Phase 4 — Panel Builder Cleanup
18. Remove predefined-sections tab — builder is the only panel type
19. Fix commander autocomplete to pull options from loaded `decks` data
20. Replace color group-by entity filter (text autocomplete + hardcoded combo list) with chip picker
21. Add color filter with mode to Narrow To for all group-bys

---

## Rules

- **Implement one phase at a time.** Complete it, verify no TypeScript errors (`npm run build`), then move to the next.
- **No DB migrations needed** — all changes use existing columns (`has_w`, `has_u`, `has_b`, `has_r`, `has_g`).
- **Do not change the predefined-section panel type** until Phase 4 — earlier phases must not break existing panels.
- When adding the color mode toggle UI, use MUI `ToggleButtonGroup` with `exclusive` prop. The toggle should only render when ≥1 color chip is selected.
- For `opponent_player` / `opponent_commander` group-bys: the perspective-player field in section A becomes **required** (show a validation error if not set) when either is selected.
- `recent_win_rate` metric runs N additional PHP queries (one per result row). It works correctly with `top_n` because the post-query PHP loop already iterates over `$rows`, which will be limited.

---

## Where to Start

1. Read `commander-collector/docs/SEARCH_PLAN.md` in full
2. Read the four key files listed above
3. Confirm your understanding of the color semantics and the `filter_colors` bug before touching any code
4. Begin Phase 1, Step 1: fix `filter_colors` in `comparison.php`
