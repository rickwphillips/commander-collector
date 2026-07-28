# Changelog

## [5.22.0] - 2026-07-28

### Fixed

- Card counts summed rows instead of copies. A `list_cards` row can hold many copies (Island x13), so `cards.length` / `count($rows)` under-reported every deck: a 99-card deck stored in 79 rows displayed as `79 / 79`. Introduced one aggregator, `totalCardCount()` in `@commander/shared/lib/cardCount`, re-exported from `@/lib/cards/count` so app import paths are unchanged, and routed all 16 call sites through it (deck page counter, `DeckBreakdown` in both core and shared, `CardListDisplay`, `CardImportPanel`, `commander.ts` legality check)
- The coach/guru agent was handed row counts. `coach-chat.php` injected the front end's `cards.length` into the system prompt as `Cards: N`, while its own `list_decks` tool already used `SUM(lc.quantity)`, so the model could see two different totals for one deck. `lookup_decklist` (`total_cards`) and `get_list_cards` (`total`) also returned `count($rows)`. Added `cardQuantityTotal()` in `php-api/lib/card-count.php` as the PHP mirror and used it in all three places

### Added

- The deck page counter's denominator is the deck's target size rather than the buffer total. `requiredListSize()` (`lib/formats/deckSize.ts`) returns 99 for one commander and 98 for two (partner / background / Doctor's companion), since CR 903.5a puts the commander inside the 100 and commanders are deck-native; 100 when the commanders are stored in the list itself via `list_cards.role`; and null for standalone lists, which fall back to the buffer total
- The counter renders in `error.main` at weight 600 with an "N cards over the limit" tooltip when the deck exceeds its target, via a new `overBy` prop on `DeckFilters`. Measured against the whole deck rather than the filtered view, so filtering does not clear the warning

## [5.19.0] - 2026-07-15

### Added

- Rematch: a `RematchButton` on the dashboard, the games list, and each game's detail page starts a new game pre-filled from a prior one. With no `gameId` it targets the most recent game (and hides itself when there is none); on a detail page it targets that game. It navigates to `/game-manager?rematch=<id>`, where `buildRematchPrefill` maps the recorded results to one seat per player (same player, deck, commander/partner), ordered by team then finish, and seeds game type, pod size, and starting life. Everything stays editable before the game starts; nothing is recorded automatically
- `GET /games?recent=1` returns the most recent game (by `played_at`, then `id`) in the same shape as the by-id branch, or null when none exist

### Changed

- `games.php`: the per-seat results query is now a single shared `$GAME_RESULTS_SQL` used by both the by-id and all-games branches (it also now selects `decks.partner`), so the result shape stays identical in one place

## [5.18.0] - 2026-07-14

### Fixed

- Live game security: host-only actions (overwriting full state via `PUT /live-game`, draining the queue via `?consume=1`, and the SSE `role=host` stream) now require the resolved seat to be the host seat (`bottom`). A remote seat code can no longer overwrite authoritative state or steal the host's event queue
- Live game security: `POST /live-game` (session create) now requires a JWT and takes `user_id` from the token `sub`, never a client-supplied value, so a session can no longer be deactivated on another user's behalf by guessing their id
- Live game: the SSE host drain emits before clearing and clears only on confirmed delivery (matched by `(seat, ts)`), so remote deltas are no longer lost when the host connection drops/reconnects, and a phone append mid-emit is preserved
- Remote elimination undo now checks every cause: undoing a life/poison/commander-damage change no longer revives a player still eliminated by another cause (via a shared `stillEliminated` helper), and a conceded player is never auto-revived
- `DeckFilters.parseManaValue`: a monocolored hybrid `{2/W}` contributes its numeral (2) to mana value; color/color (`{G/W}`) and Phyrexian (`{W/P}`) still contribute 1
- Remote panel: the "connection lost" banner clears via a functional `setState` so it is no longer read from a stale effect closure (it never cleared after recovery)

### Added

- `house_rules` table for the deckbuilder tool (per-user/per-deck house rules and saved reference rulings)

## [5.15.0] - 2026-07-09

### Fixed

- Commander art now shows on the live-game remote and the board even when a phone can't reach the image CDN directly. Art is served through the host as an art crop, resolved by commander name so it fills in even for older games whose saved state never stored an art URL (`artCropUrl: null`)

### Performance

- Commander art crops fetched through the host (`card-image.php?art=`) are cached server-side in a new `art_b64` column, so the board and remote load each crop once instead of re-downloading it from Scryfall on every view. Kept separate from the full-card `image_b64` cache that card previews use

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

