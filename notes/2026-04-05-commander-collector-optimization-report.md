# Commander Collector — Architecture & Optimization Report

**Date**: 2026-04-05
**Scope**: Core, Deck, Game Manager, Stats, and Players systems
**Diagrams**: See `2026-04-05-commander-collector-architecture-diagrams.puml`

---

## System Overview

Commander Collector is a Next.js 16 + React 19 frontend paired with a PHP REST API backend (PDO/MySQL). It comprises five interconnected systems:

| System | Pages | PHP Endpoints | Largest Component |
|--------|-------|---------------|-------------------|
| **Deck** | 5 (list, detail, new, decklist, scan) | decks.php, deck-cards.php, scan.php, scryfall-cache.php | ScanDeckPage (1805 lines) |
| **Game** | 4 (list, detail, new, edit) | games.php | GameForm (300+ lines) |
| **Game Manager** | 1 (setup → board → end) | live-game.php | GameBoard + hooks |
| **Stats** | 2 (dashboard, customize) | stats.php, comparison.php, advanced-stats.php, stat-panels.php | StatsPage (~1000 lines) |
| **Players** | 2 (list, detail) | players.php | PlayerDetailPage (345 lines) |

A `packages/shared/` directory exists with 15 components already extracted, but adoption is incomplete — most pages still import from `app/components/`.

---

## Optimization Opportunities

### 1. CRITICAL — Duplicate Color Toggle Logic (8+ files) → `ColorPicker` Component

**Status**: Component created at `packages/shared/src/components/ColorPicker.tsx`

**Problem**: The exclusive colorless toggle pattern (clicking C clears WUBRG; clicking any color clears C) plus the ManaSymbol pip row is reimplemented in **at least 8 files**:

| File | Function Name | Pattern |
|------|---------------|---------|
| `core/app/decks/page.tsx` | `toggleColor()` | Filter (Set + AND/OR/Only) |
| `core/app/decks/new/page.tsx` | `handleColorClick()` | Identity (array, no mode) |
| `core/app/decks/detail/page.tsx` | `handleColorToggle()` | Identity (array, no mode) |
| `core/app/decks/scan/page.tsx` | `handleColorClick()` | Identity (array, no mode) |
| `core/app/stats/customize/ConditionColorPicker.tsx` | `handleColor()` | Filter (array + mode + nickname) |
| `decks/app/decks/page.tsx` | `toggleColor()` | Filter (duplicate app) |
| `decks/app/decks/new/page.tsx` | `handleColorClick()` | Identity (duplicate app) |
| `decks/app/decks/detail/page.tsx` | `handleColorToggle()` | Identity (duplicate app) |

**Solution**: `ColorPicker` bundles `ManaSymbol` pips + toggle logic into one component with two modes:

- **Identity mode** (new/edit deck): `<ColorPicker colors={colors} onColorsChange={setColors} />`
- **Filter mode** (list page, comparison builder): add `colorMode` + `onColorModeChange` — shows AND/OR/Only toggle and guild/shard/wedge nickname

Also exports `toggleColorSelection(current, color)` as a standalone pure function for any edge cases.

**Migration**: Each consuming page replaces ~15-25 lines (toggle function + JSX row) with a single `<ColorPicker>` import. `ConditionColorPicker.tsx` can be replaced entirely.

**Impact**: Eliminates ~120 lines of duplicated logic + JSX across 8+ files.

---

### 2. HIGH — Repeated Fetch/Loading/Error Boilerplate (25+ pages)

**Problem**: Every page independently implements the same tri-state pattern:

```typescript
const [data, setData] = useState<T[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchData()
    .then(setData)
    .catch(() => setError('Failed to load X'))
    .finally(() => setLoading(false));
}, []);
```

Found **29 loading state instances** and **62 setError instances** across 25 files.

**Status**: DONE — created `packages/shared/src/lib/useApiQuery.ts`

**Usage**:
```typescript
const { data, loading, error, refetch, setData } = useApiQuery(() => api.getDecks());
const { data, loading, error } = useApiQuery(() => api.getDeck(id), [id]);
```

**Impact**: Eliminates ~200+ lines of boilerplate across 25 files, standardizes error handling, adds `refetch()` and `setData` for free.

---

### 3. HIGH — Delete Confirmation Dialog Pattern (6 pages)

**Status**: DONE — created `packages/shared/src/components/ConfirmDeleteDialog.tsx`

**Problem**: Six pages independently implement the same delete confirmation dialog with identical structure: open state, title, message, cancel/confirm buttons, `deleting` loading state, async delete call.

**Usage**:
```typescript
<ConfirmDeleteDialog
  open={deleteDialogOpen}
  title="Delete Game?"
  message="Are you sure? This action cannot be undone."
  onConfirm={async () => { await api.deleteGame(id); router.push('/games'); }}
  onClose={() => setDeleteDialogOpen(false)}
/>
```

Manages its own `deleting` state internally. Keeps dialog open on error so user can retry.

**Impact**: Eliminates ~150 lines of duplicated dialog code across 6 files. Also replaces `stats/customize/DeletePanelDialog.tsx` (single-use extraction).

---

### 4. HIGH — Duplicate `apps/decks/` Application

**Status**: DONE — removed `apps/decks/`, cleaned deploy.sh, start-dev.sh, and package-lock.json.

**Problem**: Full duplicate deck application at `apps/decks/app/decks/` mirroring `apps/core/app/decks/`. Identical next.config.ts, same basePath, same deploy target. Core was the actively developed version with newer features; decks was a stale copy being nominally synced via version bumps.

**Impact**: Eliminated ~3000+ lines of duplicate code, one less build step in deploy.

---

### 5. MEDIUM — API Data Re-Fetching (no client cache)

**Problem**: Every page independently calls `api.getPlayers()`, `api.getDecks()`, `api.getGames()` on mount. Found **15 separate calls** to these three endpoints across the app. Navigating between pages triggers redundant network requests for the same data.

**Recommendation**: Introduce a lightweight query cache layer. Options:

1. **Simple**: A `useQueryCache` hook wrapping `useApiQuery` with a shared `Map<string, {data, timestamp}>` in context. Stale-while-revalidate with a 30s TTL.
2. **Full**: Adopt `@tanstack/react-query` — fits naturally since all data fetching is already `async () => api.getX()`.

**Impact**: Reduces redundant API calls by ~60%, improves navigation speed, eliminates loading flicker on back-navigation.

---

### 6. MEDIUM — GameForm Shared Between Two Locations

**Status**: DONE — deleted stale `packages/shared/src/components/GameForm.tsx`.

**Problem**: GameForm existed in both `apps/core/app/components/` (actively used) and `packages/shared/src/components/` (624 lines behind, nothing imported it). The shared copy was dead code drifting further from the canonical version.

**Resolution**: Deleted the unused shared copy. Core's `app/components/GameForm.tsx` remains the single source of truth. Can be extracted to shared later when the package is more widely adopted.

---

### 7. MEDIUM — ScanDeckPage Decomposition (1805 lines)

**Problem**: `decks/scan/page.tsx` is the largest file in the project at 1805 lines. It handles:
- Image capture + pre-scan editor (rotation, brightness, contrast)
- Canvas tiling (3x3 + full)
- Batched scanning pipeline
- Scryfall bulk lookup with retry
- Card review grid with edit/delete/version-pick
- Import decklist parser
- Draft persistence (debounced save/restore)
- Save wizard (new deck vs existing deck)
- Multiple dialogs (edit card, add card, version picker, discard, scan results)

**Recommendation**: Extract into focused sub-components:

| Component | Lines (est.) | Responsibility |
|-----------|-------------|----------------|
| `ImageEditor` | ~120 | Rotation, brightness, contrast controls |
| `ScanPipeline` (hook) | ~200 | Tiling, batched scan, dedup, lookup |
| `CardReviewGrid` | ~300 | Card display, quantity controls, actions |
| `CardEditDialog` | ~100 | Name autocomplete, scryfall lookup |
| `VersionPickerDialog` | ~100 | Print selection grid |
| `DeckSaveForm` | ~150 | New/existing deck form + save logic |
| `ImportParser` (util) | ~50 | Decklist text → card objects |
| `ScanDeckPage` (orchestrator) | ~400 | State + step transitions |

**Impact**: Each piece becomes testable, reusable (ImageEditor could be used elsewhere), and comprehensible in isolation.

---

### 8. MEDIUM — PHP Win Rate Calculation Repeated 4 Times

**Problem**: The same SQL win rate expression appears in:
- `stats.php` (overall, topPlayers, topDecks, topCommanders)
- `comparison.php` (metric expressions)
- `advanced-stats.php` (color meta, game size)
- `players.php` (player list with stats)

```sql
ROUND(COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0
      / NULLIF(COUNT(DISTINCT gr.game_id), 0), 1) as win_rate
```

**Recommendation**: Create `php-api/lib/sql-helpers.php` with reusable SQL fragment builders:

```php
function winRateExpr($alias = 'win_rate') {
    return "ROUND(SUM(gr.finish_position = 1) / NULLIF(COUNT(gr.id), 0) * 100, 1) as $alias";
}

function podSizeSubquery() {
    return "(SELECT game_id, COUNT(*) AS pod_size FROM game_results GROUP BY game_id) pod";
}
```

**Impact**: Single source of truth for stat calculations. Prevents subtle formula divergence (already see `COUNT(DISTINCT gr.game_id)` vs `COUNT(gr.id)` inconsistency between endpoints).

---

### 9. LOW — Color Name Constants Duplicated

**Problem**: Color-to-name mappings exist in two places:
- `ManaSymbol.tsx`: `COLOR_NAME = { W: 'White', U: 'Blue', ... }`
- `DeckFilters.tsx`: `SYMBOL_NAMES = { W: 'White', U: 'Blue', ... }` (plus hybrids)

**Recommendation**: Move base color names to `utils.ts` alongside `MTG_COLORS`. Extend in `DeckFilters` for hybrid/Phyrexian names only.

**Impact**: Minor — prevents name divergence.

---

### 10. LOW — Mana Symbol Image Path Hardcoded

**Problem**: `ManaSymbol.tsx` uses `${ASSET_BASE}/mana/{color}.svg` and `ManaCost.tsx` uses `"/mana/{code}.svg"`. The asset base differs between them (one respects ASSET_BASE, the other hardcodes root-relative).

**Recommendation**: Standardize on a single `getManaSymbolPath(code)` utility that handles the base path correctly in both dev and prod.

**Impact**: Prevents broken images in certain deploy configurations.

---

## Summary Priority Matrix

| # | Opportunity | Impact | Effort | Lines Saved |
|---|-----------|--------|--------|-------------|
| 4 | Remove duplicate `apps/decks/` (DONE) | High | Low | ~3000 |
| 1 | `ColorPicker` component (CREATED) | High | Low | ~120 |
| 2 | `useApiQuery` hook (DONE) | High | Medium | ~200+ |
| 3 | `ConfirmDeleteDialog` component (DONE) | High | Low | ~150 |
| 6 | GameForm — delete stale shared copy (DONE) | Medium | Low | ~300 |
| 5 | API query cache (DEFERRED) | Medium | Medium | 0 (perf) |
| 7 | ScanDeckPage decomposition | Medium | High | 0 (readability) |
| 8 | PHP SQL helper functions | Medium | Low | ~60 |
| 9 | Consolidate color name constants | Low | Low | ~15 |
| 10 | Standardize mana symbol paths | Low | Low | ~5 |

**Total estimated lines eliminated**: ~3,800+
**Total components consolidated**: 6 new shared utilities/components

---

## Architecture Notes

**What's already good**:
- Clean separation: typed API client (`api.ts`) ↔ PHP REST endpoints
- Shared type system (`types.ts`) ensures frontend/backend contract
- `packages/shared/` extraction already started (15 components)
- `remoteTransforms.ts` is pure-functional — excellent pattern for game state
- Color handling is consistent (WUBRG canonical order, boolean flags for indexing)

**Architectural risk**:
- No client-side query cache means every navigation triggers full re-fetch
- `ScanDeckPage` at 1805 lines is approaching unmaintainable territory
- ~~The `apps/decks/` duplicate could lead to feature drift~~ (removed)
