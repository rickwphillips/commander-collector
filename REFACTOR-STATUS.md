# REFACTOR-STATUS — Unified Card Workflow

_Initialized 2026-04-07. Updated by orchestrator after each dispatch/return._

## Phase 0 — Foundation (lib only)
- [x] Card primitives bundle — done (types/fromScryfall/tempId/index in apps/core/app/lib/cards/)
- [x] Filter & identity bundle — done (categorize/filter/colorIdentity/matchKey; twobrid axiom enforced)
- [x] Format validator bundle — done (formats/types/commander/index; needs Card.oracle_text/keywords/legalities — TODO, degrades gracefully)
- [x] API adapter bundle — done (lib/types.ts re-exports + 3 deprecated tags; api.ts read paths route through fromApiCard)
- [x] Phase 0 tests — done (143 new tests, 92% stmts / 95% lines on lib/cards; 576 total tests pass)
- [x] Phase 0 verifier — done (Phase 0 surface clean on lint/types/tests; all yellow is pre-existing)

### Phase 0 follow-ups
- `EditableCard` lives in `CardGridEditor.tsx` not `lib/types.ts` — deprecation deferred to Phase 1.
- Format validator needs `Card.oracle_text`, `keywords`, `legalities` for full Commander rule coverage. Decide: extend `Card` now vs accept graceful-degrade until Phase 1.
- `as unknown as` casts in `api.ts` (getDeckCards/getList/auditListImages) — Phase 1 removes them by migrating call sites to `Card[]`.
- `TypeCategory` is lowercase; existing `DeckFilters.tsx` uses titlecase — Phase 1 call site migration needed.

## Phase 1 — UI primitives
- [x] Wave 1: FlipCard, CardLookupField (+CardLookupTips), CardFilterBar, CardExportPanel, DeleteImpactDialog, Trash, CardImportPanel, CardTile — done
  - Follow-ups: CardLookupField bypasses cache for autocomplete/search (matches existing lib/scryfall.ts pattern) — Phase 5 consolidation; CardFilterBar has stub `cmcFilter`/`contains` — needs FilterSortState extension; fixed bad `@/app/lib/...` import in CardExportPanel
- [x] Wave 2: CardSearchDialog, CardListView — done (react-window not in deps; CardListView falls back >50)
- [x] Wave 3: CardInputPanel (+ScanInput stub), SaveToListDialog — done
- [x] Wave 4: CardListToolbar — done
- [x] Barrel index.ts — written (all named exports)
- [x] Phase 1 tests — done (124/124 pass across 14 files)
- [x] Sandbox mount (/dev/cards-sandbox) — done (506 lines, 0 TS errors)

### Phase 1 follow-ups
- [x] `react-window` virtual scroll — added v1.8.11, FixedSizeGrid + FixedSizeList wired in CardListView
- [x] `FilterSortState` extension — `cmcFilter` + `contains` real features, 32/32 tests pass
- [x] `mergeIntoBuffer` extracted to `lib/cards/mergeIntoBuffer.ts` with discriminated `MergeEvent` union
- [x] `CardInputPanel` toast/dialog — Snackbar + dialog queue replaces window.confirm
- [x] `CardSearchDialog` discriminated union — mode='edit' now requires initialCard at type level
- [x] `EditableCard` `@deprecated` JSDoc — surface area: decklist/page.tsx, lists/detail/page.tsx
- Commander legality: fixed in `formats/commander.ts` (legendary permanent + p/t) and `CardLookupField` (`is:commander`)
- Open: `CardLookupField` Scryfall direct calls — Phase 5 cache-layer consolidation
- Open: `ScanInput` stub — Phase 3 replaces

## Phase 2.1 — Additive migration
- [x] Schema dumper → `apps/core/docs/current-schema.sql` — orchestrator-handled (subagent blocked on mysql hook; skill not available to subagents)
- [x] Discrepancy report → `apps/core/docs/phase-2-1-schema-discrepancies.md` — no blockers, 3 open questions for orchestrator
- [x] Parity script → `scripts/verify-deck-list-parity.php` — uses role='main', PHP+PDO pattern
- [x] Cache refresh script → `apps/core/scripts/refresh-card-cache.php` — schema-detection guard at startup, references v4.7.0 (may need rename)
- [x] `.htaccess` deploy fix — comments added to all 3 deploy scripts (functional fix was already in place from 2026-03-30)
- [x] Migration author — done. Two migrations: `v4.7.0.sql` (UUID PK conversion via shadow columns, 738 lines) + `v4.8.0.sql` (Phase 2.1 schema additions on the now-UUID schema, 448 lines). package.json bumped to 4.8.0.
- [x] Migration verifier — **PASS**. Cloned `commander_collector` → `commander_collector_v48_test`, ran both migrations end-to-end, verified 23 tables / 12 FKs / all id columns char(36) (except pattern_errors varchar(16) preserved) / all row counts match baseline / all Phase 2.1 columns present / scan_drafts→buffer_drafts rename complete with user_id varchar(36) / system_state and list_history created with char(36) ids / 4 main lists backfilled from 4 decks with cards / 102+389=491 list_cards / 5 commander roles (correct: 4 from deck backfill + 1 pre-existing standalone) / 0 partner roles (correct: no decks have partners) / schema_migrations has all 8 v4.x rows. Clone dropped on success.

### Phase 1.5 (UUID conversion) — folded into v4.7.0
The user called INT primary keys "a rookie mistake from the beginning" mid-Phase-2.1. v4.7.0 became the UUID conversion migration (replacing the original v4.7.0 INT-based Phase 2.1 work) and v4.8.0 carries the Phase 2.1 schema additions on top with everything CHAR(36) from birth. Both verified together.

### Phase 2.1 notes
- Long-lived scribe pattern not supported in this session (no SendMessage tool); orchestrator maintains REFACTOR-STATUS.md directly.
- `schema_migrations` table is 7 entries behind reality (last tracked v3.10.0, schema reflects v4.6.0). Backfill needed.
- `decks.partner` already exists (v4.6.0) — migration must use IF NOT EXISTS guard.
- `list_cards.scryfall_id` already VARCHAR(64) — no widening needed; only `deck_cards` and `scryfall_card_cache` need it.
- [ ] Cache refresh script (scripts/refresh-card-cache.php) — not started
- [ ] .htaccess deploy fix — not started
- [ ] Migration author (migrations/v<next>.sql + version bump) — not started
- [ ] Migration verifier — not started

## Phase 2.2 — Atomic cutover
- [ ] Reader inventory — not started
- [ ] PHP cutover (lists, deck-cards, decks, coach-chat, my-collection, deck-profile, comparison, stats, advanced-stats, tts-export, rules/chat, rules/active-game, scan) — not started
- [ ] TS cutover (useList, api.ts, CoachChat.tsx) — not started
- [ ] Seed scripts rewrite — not started
- [ ] Backsync rollback script — not started
- [ ] list_history audit-write — not started
- [ ] cleanup-trash.php — not started
- [ ] buffer-draft.php rename + extension — not started
- [ ] Phase 2.2 verifier — not started

## Phase 3 — Scan refactor
- [ ] Extract ocr.ts + imageEditor.ts → lib/scan/ — not started
- [ ] Snapshot tests (must run before old code deleted) — not started
- [ ] ScanInput component — not started
- [ ] Page collapse (decks/scan/page.tsx → ~150 LOC) — not started
- [ ] Delete CardListImport — not started

## Phase 4 — Page collapse + routes
- [ ] Wizard rewrite (/decks/new) — not started
- [ ] /decks/[id]/list route — not started
- [ ] /lists/[id] route — not started
- [ ] Redirect stubs — not started
- [ ] Navigation updates — not started
- [ ] Test path updates — not started

## Phase 5 — Cleanup (irreversible)
- [ ] Delete legacy components — not started
- [ ] lib/scryfall/client.ts — not started
- [ ] list-audit.php → list-image-resolve.php rename — not started
- [ ] Final migration (drop deck_cards, drop is_commander) — not started
- [ ] architecture-diagrams.puml update — not started
- [ ] PHP shim (410 Gone) — not started
- [ ] Final verifier — not started

## Notes / Blockers
- Subagents in this session lack Write tool permission; orchestrator writes files on their behalf based on returned content. Consider granting Write to subagents to reduce round-trips.
