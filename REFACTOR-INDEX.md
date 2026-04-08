# REFACTOR-INDEX.md — Commander Collector Unified Card Workflow (v2)

## 1. Section Heading Hierarchy with Line Ranges

| Level | Heading | Lines |
|-------|---------|-------|
| H1 | Commander Collector — Unified Card Workflow Refactor (v2) | 1 |
| H2 | Context | 3–43 |
| H3 | Conceptual model (do NOT change) | 7–25 |
| H3 | Unification goal | 27–41 |
| H2 | Audit: What's Currently Wrong | 44–124 |
| H3 | Re-audit findings (corrects v1 audit errors) | 48–67 |
| H3 | Data model — the actual problem | 69–74 |
| H3 | Card display — 4 separate renderers | 76–80 |
| H3 | Flip-card animation — 4 implementations | 82–84 |
| H3 | Add/Edit dialogs — 3 implementations | 86–89 |
| H3 | Helpers tripled | 91–93 |
| H3 | Type categorization — 3x | 95–96 |
| H3 | Card-to-editable converters — 3x | 98–99 |
| H3 | Filtering — bespoke per page | 101–102 |
| H3 | Import/Export — fractured | 104–108 |
| H3 | Scryfall — split brain | 110–113 |
| H3 | Save flows — inconsistent | 115–118 |
| H3 | Monoliths | 120–124 |
| H2 | The Big Idea (revised) | 127–163 |
| H2 | Phase 0 — Foundation (lib only, no UI/DB changes) | 166–223 |
| H2 | Phase 1 — Atomic UI primitives | 226–398 |
| H3 | Phase 1 cross-cutting requirements | 367–393 |
| H2 | Phase 2 — Unified data model | 401–611 |
| H3 | Phase 2.1 — Migration | 405–528 |
| H3 | Phase 2.2 — PHP endpoint cutover | 532–566 |
| H3 | Phase 2.3 — Client hook + API | 570–574 |
| H3 | Risks | 576–597 |
| H3 | Verify | 599–611 |
| H2 | Phase 3 — Scan and import as input adapters | 614–649 |
| H2 | Phase 4 — Page collapse and route restructure | 653–673 |
| H2 | Phase 5 — Cleanup (gated, irreversible) | 677–712 |
| H2 | What this design buys you | 716–723 |
| H2 | Test coverage targets | 726–778 |
| H2 | Production cutover | 782–853 |
| H2 | Out of scope for v1 | 856–872 |
| H2 | Live game and deck identity (clarification) | 874–876 |
| H2 | Cross-cutting notes | 878–884 |
| H2 | Critical files to read before starting | 888–896 |

---

## 2. Phase Dependency Graph

```
Phase 0 (lib foundation)
  └── Phase 1 (UI primitives — all dead-coded until later)
        └── Phase 2.1 (additive migration — no deck_cards drop)
              └── Phase 2.2 (atomic PHP cutover — all readers patched in one PR)
                    └── Phase 2.3 (client hook + API)
                          └── [bake one dev cycle]
                                ├── Phase 3 (scan/import refactor)
                                └── Phase 4 (page collapse + routes)  ← ships with Phase 3
                                      └── [soak period]
                                            └── Phase 5 (cleanup — irreversible, separate PR)
```

**Intra-phase dependencies:**
- Phase 0 → `lib/cards/colorIdentity.ts` must exist before `lib/formats/commander.ts` can use it.
- Phase 0 → `lib/cards/matchKey.ts` must exist before `CardInputPanel` dedup (Phase 1) can use it.
- Phase 0 → `lib/cards/filter.ts` must exist before `CardFilterBar` (Phase 1) can use it.
- Phase 1 → `CardLookupField` must exist before `CardSearchDialog`, `CardInputPanel`, `SaveToListDialog`, deck-new wizard.
- Phase 1 → `CardListView` must exist before `CardListToolbar` and `CardInputPanel` are useful.
- Phase 2.1 → parity script (`scripts/verify-deck-list-parity.sh`) ships WITH 2.1, not Phase 5 (line 568).
- Phase 2.2 → parity script must pass BEFORE Phase 2.2 merges (lines 576–577).
- Phase 2.2 → back-sync script (`scripts/sync-list-cards-to-deck-cards.php`) ships in Phase 2.2's PR for rollback (line 827).
- Phase 5 → `deck_cards` drop is gated by `mysqldump` checkpoint + parity script clean (line 700).
- Phases 0+1 ship together. Phases 3+4 ship together. Phase 5 is its own PR (line 884).

---

## 3. Per-Phase Summary and Touched Files

### Phase 0 — Foundation (lines 166–223)
**Summary:** Pure lib layer — canonical types, adapters, helpers — no UI or DB changes; all existing behavior preserved.

**Files created:**
- `app/lib/cards/types.ts` — `Card` interface, `toApiCard`/`fromApiCard` (0|1↔boolean boundary)
- `app/lib/cards/fromScryfall.ts` — single `cardFromScryfall(name, data, opts?: { proxy? })`
- `app/lib/cards/tempId.ts` — single `tempId()`
- `app/lib/cards/categorize.ts` — merges existing `getTypeCategory()` from 3 sites
- `app/lib/cards/filter.ts` — `filterCards()` + `sortCards()` driven by `FilterSortState`
- `app/lib/cards/colorIdentity.ts` — canonical color-identity with runtime axiom assertion
- `app/lib/cards/matchKey.ts` — `matchKey(card)` + `normalize(name)` for dedup
- `app/lib/cards/index.ts` — barrel
- `app/lib/formats/types.ts` — `ValidationResult`, `Violation` shapes
- `app/lib/formats/commander.ts` — Commander rules, 90-day legality TTL, partner variants
- `app/lib/formats/index.ts` — format validator registry

**Files modified:**
- `app/lib/types.ts` — re-export from `lib/cards/types`; mark `EditableCard`/`DeckCard`/`ListCard`/`ScannedCard` as `@deprecated`
- `app/lib/api.ts` — route all card row reads/writes through `fromApiCard`/`toApiCard`

**Scripts:**
- `scripts/refresh-card-cache.php` — manual legality re-fetch after ban announcements

---

### Phase 1 — Atomic UI Primitives (lines 226–398)
**Summary:** Create every shared UI primitive as dead code; all existing pages untouched; sandbox route for verification.

**Files created under `app/components/cards/`:**
- `FlipCard.tsx` — single 3D flip source (replaces all 4 copies)
- `CardTile.tsx` — card visual wrapping `FlipCard`; 5 lookup-state badges; placeholder `card-not-found.webp`
- `CardSearchDialog.tsx` — add/edit dialog with Scryfall search, modes `"add" | "edit"`
- `CardLookupField.tsx` — the universal card-name input (autocomplete + query mode, scrollable results, per-result qty stepper, help tooltip)
- `CardFilterBar.tsx` — filter AND sort (one feature); default sort alphabetical
- `CardListView.tsx` — gallery/text/breakdown toggle, edit mode, undo/redo stack (50 steps), virtual scroll >50 cards, 409 conflict dialog
- `CardInputPanel.tsx` — 4 tabs: Lookup / Import / Paste / Scan; singleton toggle; dedup rules; basic lands exempt
- `CardExportPanel.tsx` — TCGPlayer text, CSV, TTS (calls `tts-export.php` with `list_id`)
- `CardListToolbar.tsx` — single toolbar: all actions, undo/redo, detach (deck context only)
- `SaveToListDialog.tsx` — 5 destinations: new standalone list / new deck / attach to existing deck / save into deck context / append to existing list; auto-naming rules
- `DeleteImpactDialog.tsx` — impact-surfacing confirmation for deck/list deletes
- `Trash.tsx` — 30-day soft-delete view with restore
- `index.ts` — barrel

**Files created elsewhere:**
- `app/dev/cards-sandbox/page.tsx` — dev-only fixture sandbox
- `tests/components/cards/*.test.ts` — Vitest tests per primitive (all greenfield)

**Cross-cutting requirements (lines 367–393):**
- Mobile-first hard constraint (375px viewport)
- Virtual scrolling via `react-window` when `cards.length > 50`
- Keyboard shortcuts via `useKeyboardShortcuts` hook
- Accessibility baseline (ARIA, focus trap, arrow-key nav, WCAG AA contrast)

---

### Phase 2.1 — Migration (lines 405–528)
**Summary:** Additive-only SQL migration; `deck_cards` stays as read-shadow; backfills all existing deck cards into `list_cards`.

**Migration file:** `migrations/v<next>.sql` (filename MUST match `package.json` version — bump in same commit)

**DB changes:**
- `lists`: add `deck_id`, `format`, `role`, `source`, `deleted_at`, `version`; indexes on `deck_id` and `deleted_at`
- `game_results`: add `cardlist_snapshot JSON NULL`
- `scan_drafts` → renamed to `buffer_drafts`; add `device_id`, `context_type`, `context_ref`; new composite PK
- `decks`: add `deleted_at`, index; add `format VARCHAR(32) DEFAULT 'commander'`
- `list_cards`: add `is_custom`, `role ENUM('commander','partner')`
- `deck_cards`: widen `scryfall_id` to `VARCHAR(64)`; add `is_custom`, `role`
- `scryfall_card_cache`: widen `scryfall_id` to `VARCHAR(64)`; add `legalities JSON`, `legalities_cached_at`, `prices JSON`, `prices_cached_at`
- New tables: `system_state`, `list_history`
- Backfill `role='commander'`/`'partner'` from `is_commander` and `decks.partner` name match
- Backfill: INSERT into `lists` for every deck that has cards; INSERT into `list_cards` from `deck_cards` via new `lists` rows

**Scripts shipped with 2.1:**
- `scripts/verify-deck-list-parity.sh` — row-count parity check; also runs in `npm run test:run`
- `docs/current-schema.sql` — committed schema snapshot from pre-flight dump

**`deck_cards` is NOT dropped here.**

---

### Phase 2.2 — PHP Endpoint Cutover (lines 532–566)
**Summary:** Single-write cutover in one atomic PR; `deck_cards` frozen; all readers patched to `list_cards` joined via `lists.deck_id`.

**Files modified:**
- `php-api/lists.php` — becomes canonical card-container endpoint; accepts `?deck_id=N`; writes `list_history` on every mutation; optimistic concurrency (`version` column); universal `buffer_drafts` autosave
- `php-api/deck-cards.php` — stops writing `deck_cards`; becomes read/write shim over `list_cards` via deck's main list
- `php-api/decks.php` — unchanged; creating a deck does NOT create a list
- `php-api/coach-chat.php` — all `deck_cards` SQL queries rewritten to `JOIN lists … JOIN list_cards`; `deck_id` tool params unchanged
- `php-api/rules/chat.php` — patched from `deck_cards` to `list_cards` join
- `php-api/rules/active-game.php` — patched (line 49 reads `deck_cards`)
- `php-api/my-collection.php` — patched
- `php-api/deck-profile.php` — patched
- `php-api/tts-export.php` — patched (already supports `?list_id=N`)
- `php-api/cleanup-trash.php` — **new**; lazy daily purge via `register_shutdown_function`
- `scripts/seed-precon-decks.php` — rewritten to insert into `list_cards`
- `scripts/seed-otj-mkm-fallout-decks.php` — rewritten
- `scripts/seed-more-precon-decks.php` — rewritten
- `scripts/backfill-card-cache.php` — trivial JOIN patch
- `apps/core/app/my-collection/CoachChat.tsx` — reword string literal from `deck_cards` to "deck's card list"
- `scripts/sync-list-cards-to-deck-cards.php` — **new rollback script**

**Not touched:** `games.deck_id`, `coach-chat.php` tool param names, `comparison.php`, `stats.php`, `advanced-stats.php`, `live_game_sessions.state` JSON, `migrations/v2.0.0.sql`

---

### Phase 2.3 — Client Hook + API (lines 570–574)
**Summary:** TypeScript hook layer so all list-editing surfaces share one data contract.

**Files created:**
- `app/lib/lists/useList.ts` — `useList({ id?, deckId? })` → `{list, cards, save, addCards, removeCard, updateCard, attachToDeck, detachFromDeck}`
- `app/lib/lists/api.ts` — typed wrappers around `lists.php`

**Files modified:**
- `app/lib/decks/useDeck.ts` — internally reads main list via `useList({ deckId })`

---

### Phase 3 — Scan and Import as Input Adapters (lines 614–649)
**Summary:** Gut the 1,368-LOC scan monolith; scan becomes one tab of `CardInputPanel`; import loses its own component.

**Files created:**
- `app/components/scan/ScanInput.tsx` — pure producer `onCardsRecognized: (cards: Card[]) => void`; no save logic
- `app/lib/scan/ocr.ts` — extracted from `decks/scan/page.tsx`
- `app/lib/scan/imageEditor.ts` — extracted from `decks/scan/page.tsx`

**Files modified:**
- `app/decks/scan/page.tsx` — collapses from 1,368 LOC to ~150; now just `<CardListView editMode>` with `CardInputPanel` defaulted to Scan tab

**Files deleted:**
- `app/components/CardListImport.tsx` — callers mount `<CardListView editMode>` directly

**Tests:**
- `tests/components/scan/ScanInput.test.ts` — snapshot tests against fixture images

---

### Phase 4 — Page Collapse and Route Restructure (lines 653–673)
**Summary:** Route restructure so deck-card editor and standalone list editor are literally the same component; legacy URLs redirect.

**Files created:**
- `app/decks/[id]/list/page.tsx` — `<CardListView editMode>` with `commanderId` set

**Files modified:**
- `app/decks/decklist/page.tsx` → `redirect('/decks/' + id + '/list')` stub
- `app/lists/detail/page.tsx` → `redirect('/lists/' + id)` stub (if needed)
- `app/lists/[id]/page.tsx` — same `<CardListView editMode>` without `commanderId`
- `app/layout.tsx` — navigation updated
- `app/page.tsx` — navigation updated
- `DeckActions.tsx` — navigation updated
- `app/decks/new/page.tsx` — thin wizard collapsed to 3-field form using `CardLookupField`; creates deck row only, no list

**Tests:**
- Route redirect tests; existing Vitest tests with hard-coded old paths updated

---

### Phase 5 — Cleanup (gated, irreversible) (lines 677–712)
**Summary:** Delete legacy components, drop `deck_cards` table, unify Scryfall client; gated by parity script + manual backup.

**Files deleted:**
- `app/components/CardGridEditor.tsx`
- `app/components/CardListDisplay.tsx`
- `app/components/CardListImport.tsx`
- `app/components/DeckFilters.tsx`
- `app/decks/scan/components/CardReviewGrid.tsx`
- `app/decks/scan/components/CardAddDialog.tsx`
- `app/decks/scan/components/CardEditDialog.tsx`
- Inline `GalleryCard` in `decks/decklist` and `lists/detail`
- `app/lib/scryfall.ts` (direct client calls)

**Files created:**
- `app/lib/scryfall/client.ts` — single Scryfall client, always routes through `php-api/scryfall-cache.php`; methods: `searchByName`, `getById`, `getPrints`, `getImage`

**Files modified:**
- `php-api/deck-cards.php` — 410 Gone or read-only shim for one release
- `php-api/list-audit.php` → renamed to `php-api/list-image-resolve.php` + all callers updated
- `docs/architecture-diagrams.puml` — updated post-drop

**Migration:** `migrations/v<next>.sql` — drops `deck_cards` table. **Gated by `mysqldump` + `verify-deck-list-parity.sh` clean.**

**Deck-native columns NOT dropped (ever):** `decks.commander`, `decks.partner`, `decks.colors`, `decks.has_w/u/b/r/g` (lines 681–682)

---

## 4. Cross-References by Topic

### Deck/List Peers Rule
> **Decks and lists are PEERS. Both are first-class. Neither is subordinate to the other.**

| Location | Content |
|----------|---------|
| Lines 7–16 | Full conceptual model definition; the most important rule in the plan |
| Line 9 | "Read `feedback_commander_collector_deck_list_peers.md` if there is any doubt" |
| Lines 11–12 | `decks.commander`, `decks.partner`, `decks.colors`, `decks.has_*` are deck-native and stay forever; `list_cards.role` is list-native and stays forever |
| Lines 13–14 | Attachment is luxury, not containment; either side can be deleted without affecting the other |
| Lines 20–23 | ER diagram: `Deck 1──0..* List`, `List *──0..1 Deck`, `List 1──* ListCard` |
| Lines 136–141 | A deck may have 0..N lists; a freshly created deck with zero lists is a valid state |
| Lines 153–158 | Deletion semantics: delete a deck → per-list choice; delete a list → deck becomes listless (valid), deck not touched |
| Lines 530–531 | `decks.id` untouched; `games.deck_id` and all downstream references unchanged |
| Lines 553 | `decks.php` unchanged; creating a deck does NOT create a list |
| Lines 661–662 | Deck-attached list view and standalone list view are literally the same component with different props |
| Lines 665 | New deck wizard creates decks row ONLY — no list row |
| Lines 681–682 | Phase 5: deck-native columns (`commander`, `partner`, `colors`, `has_*`) NOT dropped in Phase 5 or any other phase |
| Line 876 | Live game: deck identity is deck-native and stable; list mutations between session start and end have no effect |

### Color Identity Axiom (`{2/W}` adds W only, not colorless)
> **AXIOM: a card is colored OR colorless, never both. C is mutually exclusive with W/U/B/R/G.**

| Location | Content |
|----------|---------|
| Lines 209–214 | Full axiom definition in `lib/cards/colorIdentity.ts`; runtime `assert(!(hasColor && hasColorless))`; twobrid `{2/W}` contributes W only; Phyrexian `{W/P}` contributes W only; two-color hybrid `{G/W}` contributes both |
| Lines 209 | "Fixes a known bug in the current filter: monocolored hybrid mana ('twobrid') like `{2/W}` … currently treated as also colorless, which violates the invariant" |
| Lines 210–214 | Required unit tests: `{G/W}`→`['G','W']`; `{2/W}`→`['W']` (not `['W','C']`); `{W/P}`→`['W']`; `{2}` only→`['C']`; any colored card → C never appears |
| Line 735 | Phase 0 test coverage: `lib/cards/filter.ts` — "color predicate (including the `{2/W}` twobrid case)" |
| Line 745 | Phase 1 test: `CardFilterBar` — "respects color identity axiom" |

### Dedup Rules
> Dedup is controlled by per-input singleton toggle; match key prefers `scryfall_id`, falls back to normalized name with warning.

| Location | Content |
|----------|---------|
| Lines 342–346 | Singleton ON → dedupe (already-in-list toast); Singleton OFF → increment quantity; default derived from buffer context (Commander → ON; standalone no-format → OFF) |
| Line 346 | Basic lands always exempt from singleton dedup; always increment |
| Lines 350–353 | Match key (Option C with warnings): (1) both have `scryfall_id` → match silently; (2) name-fallback → warning toast ("Possible duplicate — merge?") before merging; never silent merge without IDs |
| Line 353 | Async resolve promotion: when pending row gets `scryfall_id`, re-run match check; if collision with resolved row → same warning flow |
| Lines 355–358 | Printing variation (same name, different `scryfall_id`): Singleton ON → merge across printings; Singleton OFF → keep as separate rows, do NOT increment |
| Line 359 | `lib/cards/matchKey.ts` is the single implementation used by all four input methods |
| Line 747 | Phase 1 test: `CardInputPanel` — "singleton toggle gates dedup; basic lands always exempt; printing-variation rules; name-fallback dedup warning" |

---

## 5. Quick-Reference: What Survives Forever (never collapse, never drop)

| Object | Columns that stay | Reason |
|--------|------------------|--------|
| `decks` table | `id`, `commander`, `partner`, `colors`, `has_w/u/b/r/g`, `format`, `player_id` | Deck identity is deck-native; peers rule |
| `lists` table | `id`, `deck_id` (nullable), `format`, `role`, `name`, `source`, `deleted_at`, `version` | Universal card container |
| `list_cards` table | `list_id`, `scryfall_id`, `card_name`, `quantity`, `is_commander`, `is_proxy`, `is_custom`, `role` | list-native; replaces `deck_cards` |
| `game_results.deck_id` | FK to `decks.id` | Never cascaded; coach-chat, stats, history all use this |
| `coach-chat.php` tool params | `deck_id` param names | Only the SQL underneath changes in Phase 2.2 |

## 6. Files to Read Before Starting Any Phase (lines 888–896)

- `app/lib/types.ts`
- `app/lib/api.ts`
- `app/decks/scan/page.tsx` (1,368-LOC monolith)
- `app/components/CardGridEditor.tsx`
- `app/decks/decklist/page.tsx` and `app/lists/detail/page.tsx` (near-duplicates)
- `app/php-api/lists.php`
- `app/php-api/decks.php`, `app/php-api/deck-cards.php`
- `app/php-api/coach-chat.php` ⚠ (70+ `deck_id` refs — left untouched in v2)
