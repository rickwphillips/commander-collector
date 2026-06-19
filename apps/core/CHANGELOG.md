# Changelog

## [5.9.0] - 2026-06-19

### Fixed

- Remote-driven life and poison kills now trigger the host's attribution prompt (previously the prompt only fired from host-side button presses; kills delivered over SSE silently bypassed it)

### Performance

- Game Manager: `PlayerPanel` split into a thin hook-orchestrator (~500 LOC) + a memoized presentational `PlayerCard`. A life change in one seat no longer re-renders the JSX for the other seats at the table
- Game Manager: view-only player overlay (host viewing another seat) now renders `PlayerCard` directly instead of mounting the full `PlayerPanel` hook tree. ~26 hook invocations and the per-render O(players²) threat-source computation skipped per open. Regression-guarded by a test

### Internal

- Game Manager host action path unified through `applyEvent` + a new `detectSideEffects(prev, next)` helper. Host UI consequences (kill prompts, monarch transfer animation) now derive from state diffs, so the same UI fires whether the action came from a button press or an SSE-applied remote event
- `LiveGameEvent` is now a discriminated union; 13 runtime non-null assertions in the event dispatcher were deleted in favor of compile-time narrowing
- `apiFetch` accepts a `params:` option (`URLSearchParams` based, PHP `[]` syntax preserved); 30 endpoint call sites migrated off inline `encodeURIComponent`
- Deprecated `DeckCard` / `ListCard` types removed; `CardListDetail.cards` is now `Card[]` directly. Four `as unknown as ...` schema-mismatch casts deleted from the API client
- Persistence in the Game Manager is now event-driven through a single `commit(updater)` helper (replaces three overlapping `useEffect`s with a 100ms debounce ref)
- Reducer set in `remoteTransforms.ts` is now the single source of truth for state mutations; host-side handlers no longer carry inlined duplicates (drift risk eliminated)
- Behavior hooks extracted to `app/game-manager/hooks/`: `useDamageFlash`, `useMonarchTransition`, `useCitysBlessingExit`, `useLongPress`, `useLocalStorageBool`
- Test count: 734 → 754

## [5.8.0] - 2026-05-20

- Replace live game polling with SSE (host 500ms + remote 1s polls removed, ~18,300 req/hr to ~300 req/hr)

## [5.7.0] - 2026-05-18

- Card metadata resolver, coach list editing, security fixes, and test coverage

## [5.6.0] - 2026-05-17

- Coach chat SSE streaming replaces fire-and-forget polling

## [5.5.0] - 2026-05-16

- Commander MCP integration: hover tooltips for **CR rule refs** and **P-numbers** in Rules Guru, PHP proxy (`/rules/cr-rule.php`, `/rules/pattern.php`) talking to the FastMCP streamable-HTTP transport, deck bracket scoring, banned-card badges, quick-lookup rules UI components
- Card name catalog shared package so Rules Guru only flags actual cards (fixes spinning on non-card bold text)
- Rules Guru feedback system: per-message thumb rating, session feedback drawer, three-state inline chip rating for card relevance (good / not relevant / bad)
- Replace chat polling loop with SSE stream
- New test suite for Rules Guru (vitest + testing-library covering API, SSE, MessageFeedback)
- Fixes: deckId int→string cast in active-game.php, card catalog apostrophe mismatch, double .php extension on MCP brain endpoints, session feedback drawer scroll/backdrop, full-width chat when drawer open

## [5.4.1] - 2026-05-06

- Fix game save 500 (missing id in game_results insert) and win-condition not firing when first player is seat 0

