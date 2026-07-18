# Commander Collector — Holistic Code Review

_Multi-agent audit: 14 subsystem reviewers, adversarial verification on every medium-or-higher finding, synthesis pass. Generated 2026-07-17._

## Executive summary

The commander-collector monorepo is functionally rich but its PHP API — the sole authorization boundary in a static-export prod architecture — is systematically weak on authorization. The dominant risk is authz: several endpoints perform state-changing operations with no per-resource ownership check (lists.php, decks.php, players.php, games.php all let any authenticated user mutate or destroy any other user's data), and a few endpoints have no authentication at all (changelog.php is anonymously destructible in prod; feedback-review.php leaks all user feedback and additionally 500s on every request due to a schema mismatch). Compounding this, the JWT layer is fully stateless with no revocation/token-version, so account deactivation, role de-escalation, and password changes have no effect for up to 24h. A second cluster is the dev/prod basePath gotcha: raw <a>/window.open navigations bypass Next's basePath and 404 in production. A third recurring class is incomplete per-commander (partner/background) tax and Two-Headed Giant handling across the event log, the rules-AI context, and 2HG commander-damage elimination. Finally, the test suite gives a false sense of safety: coverage is never enforced in CI, is scoped only to app/lib (excluding all game-state logic), the PHP tests are never executed, and the auth boundary has zero negative tests. Most items are bounded by an invite-only, small trusted playgroup and a communal (ownerless) data model, which is why several nominally-high issues were calibrated to medium — but the missing-auth and no-revocation issues are genuine and should be closed first.

**Totals after verification + dedup:** 60 ranked findings. By severity: 6 high, 21 medium, 33 low. By category: security 21, correctness 23, architecture 9, performance 5, test-coverage 6.

## Cross-cutting themes

- Authorization vs authentication confusion: requireAuth() proves identity, not ownership, and nearly every mutating PHP endpoint (lists, decks, players, games) trusts a client-supplied id with no owner/participant/admin check — a pervasive IDOR class amplified by a shared cross-project auth DB.
- Endpoints missing authentication entirely, via the 'include auth/middleware.php but never call requireAuth()' antipattern (feedback-review, message/session-feedback) or omitting middleware outright (changelog.php) — remotely exploitable because prod is a static export served by live PHP.
- Stateless JWT with no revocation/token-version/jti: deactivation, role downgrade, and password change are all unenforced until the 24h token naturally expires.
- The dev/prod basePath gotcha recurs: raw <a href> and window.open() bypass Next's basePath and 404 in production, while every correct sibling uses next/link or router.push.
- Per-commander (partner/background) tax and Two-Headed Giant rules are modeled incompletely and inconsistently across the event log, the rules-AI game context, and 2HG commander-damage elimination.
- Copy-paste duplication between apps/core/app and packages/@commander/shared (~18 modules), with type contracts already drifted (string vs number IDs) — fixes land in only one fork.
- Test-coverage theater: the 90% threshold is never invoked by CI, is scoped only to app/lib (excluding all game-state logic), the PHP behavioral tests are never run, and the auth boundary has no negative tests.
- UUID-vs-INT type confusion: setup.sql still declares INT PKs while all code inserts CHAR(36) UUIDs, and me.php casts a UUID player id to (int), corrupting it to 0.

## High severity (6)

### #1. [security] changelog.php exposes POST/PUT/DELETE with no authentication — anonymous defacement and data loss
`apps/core/app/php-api/changelog.php:27` · unit `php-stats`

**Why it matters:** The file includes only config.php — no middleware, no requireAuth/requireAdmin. In prod (static export, live PHP) any anonymous internet caller can DELETE a changelog release (cascading into changelog_changes) or POST/PUT attacker-controlled release text rendered on the public changelog page. This is the most accessible issue: no token of any kind is required. (Reported by two units; deduplicated.)

**Fix:** require_once auth/middleware.php and gate POST/PUT/DELETE behind requireAdmin(); leave GET public if the changelog is meant to be world-readable. Mirror stat-panels.php.

### #2. [security] lists.php mutations enforce no ownership — any authenticated user can edit/delete/restore/re-parent any user's list (IDOR)
`apps/core/app/php-api/lists.php:390` · unit `php-content`

**Why it matters:** Every mutating branch (PATCH, DELETE, detach_deck, attach_deck, restore) resolves the list by id only, never AND user_id = sub. Any authed user who knows/enumerates another user's list UUID can overwrite its cards, soft-delete, restore, or graft it onto another deck, with the audit row attributed to the attacker. The sibling list-image-resolve.php performs exactly the missing check with an anti-IDOR comment, proving this is a defect, not shared-by-design.

**Fix:** Scope every mutating query (and GET-all) to WHERE id = ? AND user_id = ? (return 404 on mismatch), matching list-image-resolve.php. For attach_deck, also verify the target deck is owned by the caller.

### #3. [security] requireAuth/requireAdmin trust stale JWT claims — deactivation and role de-escalation unenforced for up to 24h
`apps/core/app/php-api/auth/middleware.php:60` · unit `php-auth`

**Why it matters:** Authorization comes purely from the JWT payload (role, sub); is_active and role are read from the DB only at login and frozen into a 24h token with no revocation/token-version. Setting is_active=FALSE or downgrading an admin has no effect on privileged endpoints (users.php, invite.php) until the token expires — a deactivated/demoted user keeps admin access for up to a day.

**Fix:** In requireAuth(), load the auth_users row by sub after decoding: reject if is_active is false and source role from the DB. Add a token-version/password_changed_at column checked at auth time for immediate revocation, or use short TTL + refresh.

### #4. [correctness] feedback-review.php always 500s (nonexistent columns) AND leaks all user feedback unauthenticated
`apps/core/app/php-api/rules/feedback-review.php:30` · unit `php-rules-chat`

**Why it matters:** The SELECT references mf.wrong_ruling/incomplete/unclear, which do not exist in rules_guru_message_feedback (real columns: wrong_conclusion, missing_cr_rules, off_topic, hard_to_apply, cards_not_relevant). With PDO ERRMODE_EXCEPTION every GET throws 'Unknown column' → 500, so the v5.5.0 feedback-review queue is fully non-functional. Separately the file includes middleware.php but never calls requireAuth()/requireAdmin(), so once the query is fixed it dumps every user's free-text notes/snippets anonymously. (Two findings on the same file merged; unified fix.)

**Fix:** Correct the SELECT to the actual schema columns and add requireAdmin() immediately after getDB(), matching the other rules/ admin endpoints.

### #5. [correctness] Color/mana filter pips are mouse-only — no keyboard or screen-reader operability
`apps/core/app/components/DeckFilters.tsx:461` · unit `core-components`

**Why it matters:** The primary color/mana filter renders each pip as a bare MUI Box (div) with onClick but no role=button, tabIndex, or onKeyDown; basic pips pass no onClick to ManaSymbol so it renders a non-interactive span. The entire color/mana filter is unreachable by Tab, unactivatable by Enter/Space, and exposes no role/name to AT. Sibling chips are real buttons, confirming the omission is unintended.

**Fix:** Render each pip as a real button (pass onClick to ManaSymbol, or wrapper component='button'/role='button' + tabIndex=0 + onKeyDown), with aria-pressed and an aria-label from SYMBOL_NAMES/COLOR_NAMES.

### #6. [test-coverage] Auth/authz layer has no negative tests — signature/expiry rejection and admin gating unverified
`apps/core/app/php-api/auth/jwt.php:21` · unit `tests-coverage`

**Why it matters:** jwt_decode (signature/exp/structure), requireAuth, requireAdmin, and requireAuthOrSessionCode are the security boundary for every endpoint under static export, yet no test asserts that a tampered signature, expired/malformed token, non-admin role, or invalid session code is REJECTED — the only auth test code mints valid tokens. A future reorder that skips the signature check or drops the role check would ship green. jwt_decode also accepts tokens lacking an exp claim, which nothing surfaces.

**Fix:** Add PHP unit tests for jwt_decode (bad signature, tampered payload, expired exp, missing exp, wrong part count) and middleware role/session-code rejection, and wire them into the CI PHP job.

## Medium severity (21)

### #7. [security] games.php: any authenticated user can read, overwrite, or delete every game
`apps/core/app/php-api/games.php:368` · unit `php-game`

**Why it matters:** games has no owner column; PUT/DELETE mutate purely by id and GET-all returns every game to any caller gated only by requireAuth() against the shared rickwphi_auth DB. Any rickwphillips.com account can wipe or rewrite the entire shared game history. Calibrated to medium because the data model is communal by design; the aggravator is the shared auth DB widening who can obtain a token.

**Fix:** Add an owner/creator (or participant) concept and scope PUT/DELETE/GET to the caller, or at minimum require role==admin for destructive mutations if games are intentionally communal.

### #8. [security] decks.php: no ownership check + player_id mass-assignment — any user can hard-delete or steal any deck
`apps/core/app/php-api/decks.php:208` · unit `php-content`

**Why it matters:** DELETE is a hard DELETE FROM decks WHERE id=? for any id; PUT accepts player_id as an updatable field, letting a caller transfer any deck to any player; POST attributes new decks to arbitrary player_id. Ownership is modeled via players.user_id (as my-collection.php resolves) but no branch joins players or checks the caller owns the target player. Medium because this is the app-wide trusted-co-editor model, not a broken privilege boundary.

**Fix:** Resolve the caller's player_id from user_id and require the target deck's player to match before UPDATE/DELETE (404 on mismatch); drop player_id from the PUT updatable set; on POST validate the supplied player_id belongs to the caller.

### #9. [security] players.php: any authenticated user can delete or re-own any player, including reassigning user_id
`apps/core/app/php-api/players.php:76` · unit `php-stats`

**Why it matters:** PUT accepts a client-supplied user_id and writes it to any player row unconditionally, and DELETE removes any player by id — both gated only by requireAuth(). Since players.user_id is the identity key all 'my games/decks' scoping depends on, one user can hijack another's player identity or orphan shared game_results linkage. This bypasses the guarded one-time claim in register.php.

**Fix:** Restrict player mutation (especially user_id reassignment and DELETE) to requireAdmin(), or scope to the caller's own linked player.

### #10. [security] register.php lets a registrant claim any unlinked player identity via client-supplied player_id
`apps/core/app/php-api/auth/register.php:74` · unit `php-lib-sweep`

**Why it matters:** Registration runs UPDATE players SET user_id=? WHERE id=? AND user_id IS NULL with player_id taken straight from the request body, with no proof the registrant is that player. Any invited user can register claiming another member's still-unlinked player row (with full game history/stats), then inherit that identity via my-collection/comparison scoping. Bounded to invited users; the victim has no account yet.

**Fix:** Bind the allowed player_id into the invite code at issue time, or require admin confirmation, rather than trusting an arbitrary client-supplied id.

### #11. [security] rules/message-feedback.php & session-feedback.php: unauthenticated writes + user_id always NULL (undefined $currentUserId)
`apps/core/app/php-api/rules/message-feedback.php:45` · unit `php-rules-chat`

**Why it matters:** Both files include middleware but never call requireAuth(), so anonymous callers can flood rules_guru_message_feedback/session_feedback with arbitrary rows. Both also bind $currentUserId ?? null, but $currentUserId is never assigned anywhere (requireAuth sets $GLOBALS['currentUser']), so every feedback row is written user_id NULL and attribution is silently dead. (Three findings across two units merged.)

**Fix:** Call $user = requireAuth() after the includes and bind $user['sub'] for the user_id column in both files.

### #12. [correctness] auth/me.php casts UUID player id to (int), returning a corrupted id (0) to the client
`apps/core/app/php-api/auth/me.php:38` · unit `php-stats`

**Why it matters:** Player ids are UUID strings (SELECT UUID()) and every stats endpoint casts player_id to (string). me.php returns (int)$linkedPlayer['id'], which truncates a UUID to a leading integer or 0, so the authenticated user's own linked-player id is always wrong — breaking any client feature keyed off user.player.id.

**Fix:** Return (string)$linkedPlayer['id'] to preserve the UUID.

### #13. [correctness] 2HG commander damage aggregated per-team on the primary seat — 21 split across both heads wrongly eliminates the team
`apps/core/app/game-manager/components/TeamPanel.tsx:1053` · unit `core-game-manager`

**Why it matters:** The panel routes all commander damage from an opposing commander onto the team's primary seat, and reconcileTeams sums own/partner across both heads for the 21-lethal check. MTG tracks commander damage per player even in 2HG (CR 903.10a/810), so a commander dealing 11 to one teammate and 10 to the other (neither lethal) is stored as 21 and triggers a joint elimination the rules don't sanction. The UI cannot even express per-head damage.

**Fix:** Track commander damage per receiving head (target the actually-damaged seat idx, not always primary.idx) and evaluate the 21 threshold per head in reconcileTeams (own[t]>=21 for a single t) rather than summing across the team.

### #14. [correctness] ComparisonPanel highlights the WORST entity as best for 'Consistency' and 'First Eliminated Rate'
`apps/core/app/stats/ComparisonPanel.tsx:47` · unit `core-pages`

**Why it matters:** LOWER_IS_BETTER omits std_dev_finish_position ('Consistency', low=good) and first_elimination_rate ('% knocked out first', higher=worse), both offered by the builder. So the trophy/bold/primary winner highlight is applied via Math.max to the least consistent player and the one eliminated first most often — the panel awards 'best' to the worst performer.

**Fix:** Add both metrics to LOWER_IS_BETTER, ideally by deriving each metric's direction from a single shared per-metric definition used by the builder too.

### #15. [correctness] setup.sql declares auth_users.id (and invite FKs) as INT AUTO_INCREMENT but all code inserts CHAR(36) UUIDs
`apps/core/app/php-api/auth/setup.sql:6` · unit `php-auth`

**Why it matters:** The canonical provisioning script is stale: bootstrap.php/register.php insert UUIDs into id and invite.php writes UUID sub into created_by/used_by, but the columns are INT. Provisioning a fresh auth DB from this file (also duplicated in scripts/setup-local-db.sql) either errors on the first bootstrap (strict mode) or coerces UUIDs to 0 and collides the PK, corrupting identity/ownership. Live prod escaped only via a manual migration.

**Fix:** Update setup.sql (and setup-local-db.sql) so auth_users.id and invite created_by/used_by are CHAR(36) to match the UUID contract and the live schema.

### #16. [correctness] v3.10.0 uses DROP INDEX IF EXISTS ... ON table — MariaDB-only syntax, fatal on stock MySQL
`migrations/v3.10.0.sql:22` · unit `sql-migrations`

**Why it matters:** MySQL (verified: local dev is MySQL 9.x) does not support IF EXISTS on DROP INDEX — it is a hard ER_PARSE_ERROR. The deploy runner applies each file with mysql < file under set -e, so on a fresh MySQL DB this aborts the whole migration, never records v3.10.0, and wedges the chain. Works in prod only because prod happens to be MariaDB. Bites fresh/reprovisioned DBs, not currently-running envs.

**Fix:** Replace with the INFORMATION_SCHEMA.STATISTICS guard + PREPARE/EXECUTE pattern already used in v4.8.0/v5.15.0, and drop the non-portable DROP INDEX IF EXISTS statements.

### #17. [correctness] partnerCommanderTax changes are never recorded in the durable game event log
`apps/core/app/game-manager/gameLog.ts:211` · unit `core-game-manager`

**Why it matters:** diffGameEvents only diffs the primary commanderTax field; it has no branch for partnerCommanderTax (the second per-commander tax, the whole point of the model). Every partner-commander tax change is silently dropped from the buffered log promoted to game_logs, so any partner/background deck's tax history is incomplete.

**Fix:** Add a diff branch for a.partnerCommanderTax !== b.partnerCommanderTax, emitting a commander_tax event tagged for the partner commander.

### #18. [correctness] Partner/background commander tax dropped from the game context sent to the rules AI
`apps/core/app/game-manager/components/CenterZone.tsx:148` · unit `rules-guru-shared`

**Why it matters:** buildGameContext serializes only the primary commanderTax; partnerCommanderTax is never emitted, and rules-guru's GameContextPlayer/gameContext.ts has no partner term. For partner/background decks the second commander's accrued tax is invisible to the AI, which then reasons about recast cost from incomplete information (e.g. advises recasting for base cost when +4 is owed).

**Fix:** Add partnerCommanderTax to the CenterZone payload and to rules-guru's GameContextPlayer, and render both taxes in formatPlayerStateLine/formatBoardStateLines.

### #19. [correctness] getDeviceId() calls crypto.randomUUID() unguarded — throws in an insecure context (LAN phone in dev) _(plausible)_
`apps/core/app/lib/api.ts:71` · unit `core-lib-api`

**Why it matters:** crypto.randomUUID is defined only in a secure context; over a plain-http LAN origin it is undefined and throws. getDeviceId() is called by the deck scanner (ScanInput.tsx), a mobile-first flow explicitly supported over the LAN dev URL, so a first-time scan on a phone crashes. The codebase already guards the identical call in GuruChat.tsx but not here.

**Fix:** Guard as GuruChat does: id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`; — a plain random fallback is fine for a localStorage scoping key.

### #20. [correctness] Messages typed while a response is in flight are silently discarded
`apps/rules-guru/app/chat/page.tsx:522` · unit `rules-guru-shared`

**Why it matters:** handleSend bails on `if (!raw || loading) return;`, but the shared ChatInput keeps Send enabled during loading (warning 'Interrupt and send') and clears the input via setValue('') before calling onSend. A follow-up typed during streaming is cleared and then dropped — the advertised interrupt/steer feature (which starts with abortRef.current?.()) is unreachable.

**Fix:** Remove `loading` from the early-return guard so the interrupt path runs (it already aborts the prior request), or disable Send in ChatInput while loading if interruption isn't supported. Make the UI and handler agree.

### #21. [correctness] My Collection game-history cards open '/games/detail' via window.open — ignores basePath, 404s in prod
`apps/core/app/my-collection/page.tsx:349` · unit `core-pages`

**Why it matters:** window.open() with a bare absolute path does not get Next's basePath applied. In prod (basePath /app/projects/commander) clicking a game opens rickwphillips.com/games/detail (portfolio root, 404) instead of the real route. Works in dev only. Documented basePath gotcha.

**Fix:** Prepend the app basePath (the existing ASSET_BASE constant) or navigate via next/navigation router.push, which applies basePath.

### #22. [correctness] GameForm 'Add Deck' link uses a raw anchor — ignores basePath, 404s in prod
`apps/core/app/components/GameForm.tsx:374` · unit `core-components`

**Why it matters:** The empty-state button renders component='a' href='/decks/new'. Next only prepends basePath to next/link and router navigations, not raw anchors, so in prod this lands on rickwphillips.com/decks/new (404). Reachable only in the zero-decks first-run state, hence medium.

**Fix:** Use component={Link} href='/decks/new' (next/link), matching EmptyState/PageContainer/DeckActions.

### #23. [architecture] GameForm mutates shared module-level default result arrays, corrupting the reset template
`apps/core/app/components/GameForm.tsx:196` · unit `core-components`

**Why it matters:** defaultResults/default2hgResults are module constants of mutable objects; useState binds them by reference and updateResult mutates element objects in place (shallow array copy only). This pollutes the constants for the whole SPA session, so 'resets' (game-mode toggle, fresh mounts) start from a polluted template. Client-side stale-form defect (submit recomputes positions, so no DB corruption).

**Fix:** Never store/reset to the shared constant by reference and never mutate elements: useState(() => defaultResults.map(r => ({...r}))) and replace target objects in updateResult (newResults[index] = {...newResults[index], [field]: value}); same in handleGameTypeChange/addPlayer.

### #24. [architecture] Large-scale copy-paste duplication between apps/core/app and packages/@commander/shared
`apps/core/app/lib/api.ts:112` · unit `core-arch`

**Why it matters:** apps/core maintains private copies of ~18 modules that also live in the shared package (8 byte-for-byte identical: LogoutButton, ColorIdentityChips, StatsCard, DarkModeToggle, EmptyState, utils.ts, version.ts, statsSections.ts). Both forks are live (rules-guru + core consume shared), so every shared fix must be made twice and drift is already present (see next finding). Violates the workspace 'duplication under 3%' standard.

**Fix:** Delete the core copies and re-export from @commander/shared (or import shared directly); reconcile the ID-type drift first so shared can be the single source of truth.

### #25. [test-coverage] Coverage threshold measures only app/lib, excluding all game-state logic
`apps/core/vitest.config.ts:19` · unit `tests-coverage`

**Why it matters:** include is ['app/lib/**/*.ts'], so the entire event-log reducer (remoteTransforms.ts: tax, damage, 2HG reconcileTeams, elimination), threatSource.ts, gameLog.ts, and detectSideEffects.ts contribute zero measured lines. The 90% gate can stay green while the most rule-bearing, correctness-critical code is untested.

**Fix:** Widen include to also cover app/game-manager/**/*.ts (or app/**), excluding purely presentational .tsx if desired.

### #26. [test-coverage] CI never runs coverage — the 90% threshold is decorative
`apps/core/package.json:12` · unit `tests-coverage`

**Why it matters:** vitest thresholds are only enforced with --coverage. The core test script is 'vitest' (no --coverage) and CI runs npm test → turbo run test → vitest, never test:coverage. The 90% gate is never evaluated on PRs; combined with the include-scope issue, there is effectively no enforced coverage floor. (Test failures still block the build.)

**Fix:** Point CI at npm run test:coverage (or make turbo 'test' run vitest run --coverage) so the threshold is enforced on PRs.

### #27. [test-coverage] PHP behavioral tests are never executed by CI or the test runner (dead tests)
`apps/core/tests/php/sql-helpers.test.php:1` · unit `tests-coverage`

**Why it matters:** tests/php/*.test.php are PHP-CLI scripts; turbo test only collects JS/TS and the CI php-lint job only runs php -l over source, never the tests. So sql-helpers.test.php (validating comparisonMetricExpr, winRateDistinct, podSizeSubquery) and the integration test provide zero regression protection — a broken stats SQL builder ships without failing CI.

**Fix:** Add a CI step (in the PHP job) that runs each tests/php/*.test.php via php CLI and fails on non-zero exit.

## Low severity (33)

- **#28 [security]** `apps/core/app/php-api/auth/change-password.php:33` — Password change does not invalidate outstanding tokens
  - _Fix:_ Add password_changed_at (or token_version), include it in createToken, and reject in requireAuth tokens issued before the last password change.
- **#29 [security]** `apps/core/app/php-api/auth/register.php:50` — Username enumeration via register message + login timing side channel
  - _Fix:_ Return a generic 'username unavailable' without confirming existence, and run a dummy password_verify against a constant hash when the user is not found so login timing is uniform.
- **#30 [security]** `apps/core/app/php-api/rules/patterns.php:79` — patterns.php lets any authenticated user overwrite verified-pattern text injected into the Rules Guru system prompt
  - _Fix:_ Gate the POST/PUT branch with requireAdmin() instead of plain requireAuth().
- **#31 [security]** `apps/core/app/php-api/rules/chat-stream.php:12` — rules/chat-stream.php SSE endpoint is unauthenticated
  - _Fix:_ Add requireAuth() after the includes, matching chat.php's GET poll path.
- **#32 [correctness]** `apps/core/app/php-api/games.php:281` — games.php PUT bypasses all POST validation (game_type whitelist, player count, 2HG pairing)
  - _Fix:_ Factor the POST validation (game_type whitelist, player count, 2HG pairing) into a shared function and call it from PUT before replacing results.
- **#33 [correctness]** `apps/core/app/php-api/head-to-head.php:24` — head-to-head.php pairwise detail miscounts ties as player2 wins
  - _Fix:_ Emit both player1_won and player2_won (strict < each way) and count a third draw case, mirroring the aggregate SUM logic.
- **#34 [correctness]** `apps/core/app/php-api/lists.php:559` — lists.php DELETE version-conflict passes a 3rd arg to sendError(), silently dropping current_version
  - _Fix:_ Use the existing sendConflict($cv) helper here as the other branches do.
- **#35 [correctness]** `apps/rules-guru/app/chat/page.tsx:213` — Rate-limit retry countdown is written to an unmounted ref — users get no backoff feedback
  - _Fix:_ Attach thinkingRef to a rendered element (or drop the dead machinery and route the retry countdown into visible state ThinkingIndicator renders).
- **#36 [test-coverage]** `apps/core/tests/php/sql-helpers-integration.test.php:68` — Integration test asserts only key presence, not values — passes on null/wrong data
  - _Fix:_ Assert values against a seeded fixture (known games → known wins/win_rate), and run the file in CI.
- **#37 [test-coverage]** `apps/core/app/game-manager/threatSource.ts:18` — computeThreatSource (2HG/partner threat selection) has no test and is outside coverage scope
  - _Fix:_ Add unit tests covering partner damage, 2HG pooling, art/tiebreak ordering, and intensity clamping, and bring app/game-manager into coverage.
- **#38 [performance]** `apps/core/app/components/cards/ListGallery.tsx:58` — ListGallery re-renders every CardTile on any change — no memo, inline callbacks, index-based keys
  - _Fix:_ Wrap CardTile in React.memo, key by a stable id (card_name), and derive per-card handlers stably.
- **#39 [correctness]** `apps/core/app/components/AuthGuard.tsx:15` _(plausible)_ — Type contract drift between duplicated copies: panel/player IDs are string in core but number in shared
  - _Fix:_ Pick one ID representation (string, matching PHP/PDO) and align shared with core before de-duplicating; define a single shared StatPanel/Player type so the ID type can't drift again.
- **#40 [architecture]** `apps/core/app/lib/api.ts:112` _(plausible)_ — Two divergent apiFetch implementations with incompatible signatures
  - _Fix:_ Consolidate to one apiFetch in @commander/shared that supports the params/PHP-bracket contract, delete core's copy, and have core re-export it.
- **#41 [correctness]** `migrations/v4.7.0.sql:485` _(plausible)_ — v4.7.0 is a large destructive, non-transactional migration dropping FKs by hardcoded auto-generated names
  - _Fix:_ Resolve FK names dynamically from information_schema before dropping, guard each DDL for idempotency, split into resumable steps, and document a mandatory backup.
- **#42 [security]** `apps/core/app/php-api/live-game.php:79` _(unverified)_ — Remote event queue is unbounded and appendable by any seat (state-blob bloat / DoS)
  - _Fix:_ Cap queued event count and per-event payload size, reject beyond the limit, and optionally restrict appends to non-host seats.
- **#43 [security]** `apps/core/app/php-api/live-game.php:281` _(unverified)_ — Any remote seat code can deactivate (end) the entire live session
  - _Fix:_ Require the host seat ('bottom') to end the session, matching PUT and consume.
- **#44 [security]** `apps/core/app/php-api/tts-export.php:149` _(unverified)_ — tts-export.php downloads card image URLs with no host allow-list (SSRF)
  - _Fix:_ Apply the same parse_url host === 'cards.scryfall.io' allow-list (plus the fixed back host) before fetching, mirroring card-image.php.
- **#45 [security]** `apps/core/app/php-api/players-public.php:9` _(unverified)_ — players-public.php returns all unclaimed player names/UUIDs with no authentication
  - _Fix:_ Confirm public intent and document it; if unintended, gate behind requireAuth() and avoid returning ids.
- **#46 [security]** `apps/core/app/php-api/rules/seed.php:60` _(unverified)_ — rules/seed.php has no CLI-only guard — a web request triggers DB upserts
  - _Fix:_ Wrap execution in if (PHP_SAPI !== 'cli') { http_response_code(404); exit; } (or require an admin token).
- **#47 [correctness]** `migrations/v3.11.0.sql:4` _(unverified)_ — Early ADD COLUMN migrations lack the idempotency guard the project later standardizes on
  - _Fix:_ Wrap these ADD COLUMN statements in the same information_schema.COLUMNS COUNT guard used in v4.8.0/v5.15.0.
- **#48 [architecture]** `migrations/v5.18.0.sql:20` _(unverified)_ — house_rules stores deck_id/player_id with no foreign key — orphaned rows on deck/player deletion
  - _Fix:_ After correcting the charset, add FK (deck_id)/(player_id) ... ON DELETE CASCADE, or replicate the explicit PHP-side cleanup games.php does for game_logs.
- **#49 [architecture]** `apps/core/app/game-manager/page.tsx:192` _(unverified)_ — commit() performs a network write inside a setState updater (impure, double-fires under StrictMode/concurrent React)
  - _Fix:_ Compute next state in the pure updater and perform persistence outside setState (capture next and call updateLiveGame after, or in an effect keyed to a committed-state ref).
- **#50 [correctness]** `apps/core/app/game-manager/components/GameBoard.tsx:247` _(unverified)_ — Winner auto-save retry can call onSaveGame after the board no longer has a valid winner
  - _Fix:_ Gate the auto-save effect and saveWithRetry on winner != null, and bail out when no winner is currently derivable.
- **#51 [correctness]** `apps/core/app/lib/teams.ts:14` _(unverified)_ — teamName() renders literal 'Team null' / 'Team undefined' when teamNumber is nullish
  - _Fix:_ Return a neutral label when teamNumber is nullish: if (teamNumber == null) return 'Team'; else teamNames?.[teamNumber]?.trim() || `Team ${teamNumber}`.
- **#52 [architecture]** `apps/core/app/lib/api.ts:129` _(unverified)_ — apiFetch has no request timeout/abort — a stalled request hangs the real-time poller indefinitely
  - _Fix:_ Wrap fetch with an AbortController-based timeout (e.g. AbortSignal.timeout(15000) merged with any caller signal) so stalled requests reject and the poller can surface an error/retry.
- **#53 [performance]** `apps/core/app/components/ThemeProvider.tsx:55` _(unverified)_ — ComparisonPanel/ThemeProvider/AuthGuard context values are new objects with non-memoized callbacks each render
  - _Fix:_ Wrap the callbacks in useCallback and the value in useMemo keyed to [mode, toggleTheme] / [user, logout].
- **#54 [correctness]** `apps/core/app/admin/page.tsx:25` _(unverified)_ — Non-admin redirect uses window.location.href='/' which ignores basePath and leaves the app in prod
  - _Fix:_ Redirect via next/navigation router.replace('/') (basePath-aware) or prepend the app basePath.
- **#55 [architecture]** `apps/core/app/dev/cards-sandbox/page.tsx:1` _(unverified)_ — Dev-only cards sandbox is statically exported and reachable in production
  - _Fix:_ Return notFound() when process.env.NODE_ENV !== 'development', or exclude the dev/ tree from the production export.
- **#56 [architecture]** `apps/core/app/game-manager/components/CenterZone.tsx:255` _(unverified)_ — Production basePath hardcoded and recomputed inline in 6+ files instead of the ASSET_BASE export
  - _Fix:_ Import ASSET_BASE (a single BASE_PATH constant) everywhere a basePath is needed and delete the inline NODE_ENV branches.
- **#57 [architecture]** `apps/rules-guru/app/components/AuthGuard.tsx:1` _(unverified)_ — AuthGuard is duplicated byte-for-byte between rules-guru and the shared package
  - _Fix:_ Delete the local AuthGuard and import { AuthGuard } from '@commander/shared/components/AuthGuard'; factor the shared api auth helpers into the shared lib and consume them.
- **#58 [performance]** `apps/core/app/php-api/advanced-stats.php:266` _(unverified)_ — advanced-stats.php computeStreaks runs a dead O(n^2) first pass that is immediately overwritten
  - _Fix:_ Delete the dead first loop; the recompute below is authoritative.
- **#59 [performance]** `apps/core/app/php-api/advanced-stats.php:80` _(unverified)_ — advanced-stats.php pulls entire game_results history into PHP with no LIMIT (unbounded)
  - _Fix:_ Compute streaks in SQL (window functions) or at minimum bound the working set; avoid two full-history fetchAll() passes per request.
- **#60 [performance]** `apps/core/app/php-api/comparison.php:549` _(unverified)_ — comparison.php computeRecentWinRate issues an N+1 query per result entity
  - _Fix:_ Compute recent_win_rate in a single windowed query (ROW_NUMBER partitioned by entity, keep last 5), and remove the dead $wins line.
