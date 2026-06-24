# Unified Card Workflow Refactor — Implementation Orchestrator Prompt

You are the orchestrator for implementing the refactor plan at:
`/Users/rickphillips/FreddyRhetorickContexts/commander-collector/REFACTOR-PLAN-unified-card-workflow.md`

## Your role

You coordinate spawned agents and stay available for real-time interaction with me. Do not implement code yourself — delegate everything to subagents so your context stays clean. Your job is dispatch, integration, and unblocking.

## Hard rules

- **Read the plan ONCE at startup**, then build an index. Do not re-read the full plan repeatedly. Pass relevant excerpts to subagents.
- **Never load the entire plan into a subagent prompt.** Each subagent gets ONLY the sections it needs (one Phase subsection, one component spec, one migration block). Keep subagent prompts under ~3000 tokens of plan content.
- **Phases have hard ordering.** Phase 0 must complete before Phase 1; Phase 2.1 before 2.2; etc. Within a phase, parallelize aggressively.
- **Decks and lists are PEERS.** Read `/Users/rickphillips/.claude/projects/-Users-rick-FreddyRhetorickContexts/memory/feedback_commander_collector_deck_list_peers.md` before dispatching anything that touches the deck/list relationship. Brief every subagent on this rule. **Both are first-class. Neither is subordinate. Decks keep their own commander/colors/has_* columns forever. Lists keep their own role flags forever. They are allowed to disagree.**
- **Dev DB only** (`commander_collector`). Never deploy. Never run migrations against prod. Per memory rule `feedback_dev_first.md`.
- **Never run unprompted git commits, pushes, or destructive commands.** Per memory rule `feedback_no_unprompted_actions.md`.
- **Ask through skills, not raw tools.** When testing DB reads/writes use the `request-record` and `write-record` skills. When checking version use `cc-status`. Per memory rules `feedback_test_through_skills.md` and `feedback_check_tools_before_api.md`.

## Model selection

**Use Sonnet for ALL subagents in this refactor**, including the scribe and routine implementation work. Do not use Haiku for any phase. The plan is dense, the peers rule is easy to violate, and the cutover is risky enough that the marginal cost of Sonnet is worth it.

This is a refactor-specific override. Routine commander-collector work outside this refactor still defaults to Haiku per memory rule `feedback_commander_haiku.md`.

## Concurrency

Up to **8 agents at a time** when natural parallelism exists. Do NOT pad waves to hit 8 — spawn only what genuinely has no dependencies on in-flight work. The cap is a ceiling, not a target. 4–6 is often the right number; 8 is the upper bound for the densest parallel waves (e.g. Phase 1's first wave of independent UI primitives).

## Startup sequence

Before dispatching any implementation work, do these in order:

### Step 1 — Build the plan index
Spawn one Sonnet subagent to read `REFACTOR-PLAN-unified-card-workflow.md` end to end and produce `REFACTOR-INDEX.md` at the project root. The index contains:
- Section heading hierarchy with line ranges
- Dependency graph between phases (which phase blocks which)
- For each phase: one-line summary + list of files/components/migrations the phase touches
- Cross-references for the peers rule, the color identity axiom, and the dedup rules

After this completes, YOU read the index (not the plan) for dispatch decisions. You only re-read specific plan sections when extracting excerpts for subagents.

### Step 2 — Spawn the scribe
Spawn one long-lived Sonnet subagent whose ONLY job is to maintain `REFACTOR-STATUS.md`. Its prompt:

> You are the scribe for the unified card workflow refactor. Maintain `/Users/rickphillips/FreddyRhetorickContexts/commander-collector/REFACTOR-STATUS.md`. Structure: one section per phase, with checkboxes for each task, agent assigned, status (not started / in progress / blocked / done), start time, end time, and notes/blockers. Update on every SendMessage from the orchestrator. Do not modify any other file. Do not read code. Do not spawn subagents. Keep the file scannable — under 200 lines. Initialize the file now with the phase/task skeleton from `REFACTOR-INDEX.md`.

Keep the scribe alive for the entire refactor. Send it a status update after every dispatch and every subagent return.

### Step 3 — Confirm with me
Once the index is built and the scribe is alive, summarize the dispatch plan in one paragraph and wait for my "go" before spawning Phase 0.

## Dispatch strategy by phase

### Phase 0 — Foundation (lib only, no UI/DB changes)

Parallel wave (up to 4 simultaneously):

1. **Card primitives bundle** — `lib/cards/types.ts` + `fromScryfall.ts` + `tempId.ts`
2. **Filter and identity bundle** — `lib/cards/categorize.ts` + `lib/cards/filter.ts` + `lib/cards/colorIdentity.ts` + `lib/cards/matchKey.ts` (emphasize the `{2/W}` axiom and the runtime assertion)
3. **Format validator bundle** — `lib/formats/index.ts` + `types.ts` + `commander.ts` (this is the hardest reasoning in Phase 0 — flag for extra care)
4. **API adapter bundle** — modifications to `lib/types.ts` and `lib/api.ts`

Each subagent gets:
- The Phase 0 section of the plan (~1500 tokens)
- The peers rule note (one paragraph)
- The color identity axiom note (one paragraph)
- File paths for the files it should create or modify

After all four return, dispatch one **test author subagent** to write the 90% line coverage test suite for Phase 0 lib. After tests land, dispatch one **verifier subagent** to run `npm run lint` and `npm run test:run` and report.

Pause for my approval before advancing to Phase 1.

### Phase 1 — UI primitives

First wave (independent components, up to 8 in parallel):
- `FlipCard`
- `CardLookupField` (dual-mode autocomplete/query, cheat sheet, per-result qty stepper)
- `CardFilterBar` (filter+sort unified)
- `CardExportPanel` (TCGPlayer/CSV/TTS)
- `DeleteImpactDialog`
- `Trash`
- `CardImportPanel` (parseImport wrapper)
- `CardTile` (depends on FlipCard — spawn after FlipCard returns, OR make CardTile its own second-wave item)

Second wave (depends on first):
- `CardSearchDialog` (depends on `CardLookupField`)
- `CardListView` (depends on `CardTile`, `CardFilterBar`)

Third wave:
- `CardInputPanel` (depends on `CardLookupField`, `CardSearchDialog`, `CardImportPanel` + needs `ScanInput` placeholder for the Scan tab — use a stub until Phase 3)
- `SaveToListDialog` (depends on `CardLookupField` for commander pickers)

Fourth wave:
- `CardListToolbar` (depends on `CardInputPanel`, `CardExportPanel`)

Each subagent gets:
- Its specific component spec from Phase 1 (~500 tokens)
- The peers rule paragraph
- The Phase 1 cross-cutting requirements section (mobile, virtual scroll, keyboard shortcuts, a11y baseline)
- Paths to existing primitives it should reuse (`ManaSymbol`, `ManaCost`, `ColorIdentityChips`)

After all components return, spawn a **Phase 1 test subagent** to write the behavior checklists per the test coverage section of the plan. After tests pass, spawn a **sandbox subagent** to mount everything in `/dev/cards-sandbox` for manual verification.

Pause for my approval before advancing to Phase 2.1.

### Phase 2.1 — First migration (additive)

Pre-flight wave (parallel, up to 4):
- **Schema dumper** — dump live dev DB schema to `docs/current-schema.sql`, diff against plan assumptions, report discrepancies. **If the live schema differs from the plan, surface to me — do not silently update either.**
- **Parity script author** — write `scripts/verify-deck-list-parity.sh`
- **Cache refresh script author** — write `scripts/refresh-card-cache.php` for manual legalities refresh
- **`.htaccess` deploy fix** — read `feedback_htaccess_deploy.md` first, then fix the deploy script

Then sequentially:
- **Migration author** (extra-careful Sonnet subagent) — writes `migrations/v<next>.sql` based on the Phase 2.1 SQL block in the plan, adjusted for any discrepancies the schema dumper found. This includes: the new columns on `lists`, `decks`, `deck_cards`, `list_cards`, `scryfall_card_cache`, plus the `system_state` table, `list_history` table, `buffer_drafts` rename and extension, `game_results.cardlist_snapshot`, and the role/is_custom backfill UPDATEs. **Bump `apps/core/package.json` version in the same commit so the migration filename matches.**
- **Migration verifier** — run the migration against a fresh `commander_collector` dev DB seeded with realistic test data. Run the parity script. Report.

Pause for my approval before advancing to Phase 2.2.

### Phase 2.2 — Atomic cutover (the highest-risk phase)

Single sequential PR — all changes land together. Multiple subagents collaborate but their work merges into one branch.

1. **Reader inventory subagent** — re-grep the codebase for every `deck_cards` reader and writer. Compare against the plan's inventory. Surface anything new.
2. **PHP cutover subagent** — rewrite all readers and writers in one pass: `lists.php`, `deck-cards.php`, `decks.php`, `coach-chat.php`, `my-collection.php`, `deck-profile.php`, `comparison.php`, `stats.php`, `advanced-stats.php`, `tts-export.php`, `rules/chat.php`, `rules/active-game.php`, `scan.php`. **Coach-chat keeps its `deck_id` tool params; only the SQL underneath changes** (joins through `lists.deck_id`).
3. **TS cutover subagent** — rewrite the `useList` hook, `api.ts` wrappers, `CoachChat.tsx` string literal that mentions `deck_cards`.
4. **Seed scripts subagent** — rewrite the 3 seed scripts to insert into `list_cards`.
5. **Backsync script subagent** — write `scripts/sync-list-cards-to-deck-cards.php` for emergency rollback.
6. **`list_history` subagent** — implement the audit-write inside `lists.php` for every save (create / update / rename / detach / attach / soft_delete / restore).
7. **`cleanup-trash.php` subagent** — implement the lazy on-app-open trash cleanup with `register_shutdown_function`, keyed off `system_state.last_cleanup_at`.
8. **`buffer-draft.php` rename + extension subagent** — generalize from scan-only to all input methods.
9. **Verifier** — parity script + manual checklist from the cutover section of the plan.

These 1-9 sequential because the PR must be atomic. Within each step you can spawn helper subagents for sub-tasks (e.g. step 2 can spawn one subagent per PHP file in parallel, then merge).

Pause for my approval before advancing to Phase 3.

### Phase 3 — Scan refactor

Sequential, with one parallelizable point:

1. **Extract subagent** — pull `ocr.ts` and `imageEditor.ts` out of the 1,368-LOC scan page into `lib/scan/`. Keep behavior identical.
2. **Snapshot test subagent** — write Vitest snapshot test against fixture images. **MUST run before the next subagent deletes the old code.**
3. **`ScanInput` subagent** — build the new component using the extracted lib.
4. **Page collapse subagent** — replace `decks/scan/page.tsx` with the ~150 LOC thin orchestrator (`<ScanInput>` → buffer → `<CardListView editMode>` → `<SaveToListDialog>`).
5. **`CardListImport` delete subagent** — remove and update callers.

Pause for my approval before advancing to Phase 4.

### Phase 4 — Page collapse and route restructure

Parallel wave (up to 4):
- **Wizard rewrite subagent** — thin `/decks/new` wizard using `CardLookupField`. **Remember: wizard creates a `decks` row only, NO `lists` row.** The deck is born complete with its commander identity in `decks.commander`.
- **`/decks/[id]/list` route subagent**
- **`/lists/[id]` route subagent**
- **Redirect stub subagent** — `decks/decklist` → `/decks/[id]/list`, `lists/detail` → `/lists/[id]`

Then:
- **Navigation update subagent** — `layout.tsx`, `page.tsx`, `DeckActions.tsx`, anywhere matching old paths.
- **Test update subagent** — fix hard-coded paths in existing tests.

Pause for my approval before advancing to Phase 5.

### Phase 5 — Cleanup (irreversible)

Parallel wave (up to 6):
- **Delete subagent** — remove `CardGridEditor`, `CardListDisplay`, `CardListImport`, `DeckFilters`, `CardReviewGrid`, `CardAddDialog`, `CardEditDialog`, inline `GalleryCard` definitions, `lib/scryfall.ts`.
- **Scryfall client subagent** — build `lib/scryfall/client.ts` (always routes through `php-api/scryfall-cache.php`).
- **`list-audit.php` rename subagent** — rename to `list-image-resolve.php`, update all callers.
- **Final migration subagent** — drop `deck_cards`, drop `is_commander` (replaced by `role`). **DO NOT drop `decks.commander`, `decks.partner`, `decks.colors`, `decks.has_*`** — those are deck-native per the peers rule and stay forever.
- **`docs/architecture-diagrams.puml` update subagent**
- **PHP shim subagent** — convert `decks.php` / `deck-cards.php` deck-cards endpoints to 410 Gone shims for one release.

Then:
- **Final verifier** — `npm run build` clean, grep zero matches for deleted component names and `deck_cards`, full manual sweep from the plan's Phase 5 verify section.

Pause for my final sign-off.

## Real-time interaction protocol

While agents are running in the background, stay available for me.

- Spawn implementation agents with `run_in_background: true`.
- After dispatching a wave, return control to me with a one-paragraph status: which agents are running, expected next wave, anything that needs my input.
- When a background agent completes, update the scribe via `SendMessage` and tell me in one sentence.
- **Do NOT auto-advance to the next phase without my approval at phase boundaries.** Within a phase, fan out automatically; between phases, wait.
- I will say "go" or "next phase" or "blocked on X" — you respond by dispatching the next wave or asking clarifying questions.
- If a subagent reports a blocker, surface it to me immediately. Do not try to resolve plan ambiguities yourself; ask me.

## What NOT to delegate

- Plan interpretation questions ("what does the user mean by X?") — ask me.
- Decisions not covered in the plan — ask me.
- Anything that touches prod — never, regardless of agent suggestion.
- Anything that changes the deck/list peers rule — ask me first.
- Cross-phase dependencies — you sequence them, don't let agents decide.
- Changing the Sonnet override — always Sonnet for this refactor.

## Start

1. Spawn the index-builder subagent.
2. Spawn the scribe subagent and have it initialize `REFACTOR-STATUS.md` from the index.
3. Summarize the dispatch plan in one paragraph and wait for my "go" before Phase 0.
