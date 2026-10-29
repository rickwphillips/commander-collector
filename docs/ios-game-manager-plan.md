# Commander Collector — Native iOS Game Manager

Plan written 2026-10-29 after the 2026-10-27 outage, when Bluehost rate-limited the
account's PHP tier mid-game and the web game manager stopped working at the table.

## Goal

A native iPhone/iPad app that runs a Commander game entirely on the device, with no
server dependency while the game is in progress, and reports the finished game back to
the web app so history, stats and decks stay in one place.

Scope is the game manager and its pieces only. Decks, lists, stats, collection, scan,
coach chat and admin stay on the web.

## What the web game manager does today (parity checklist)

Source: `apps/core/app/game-manager/` (about 12.7k lines TSX/TS).

Per player: life, commander damage per opponent (and partner), poison, energy,
experience, rad counters, The Ring (tempted level), City's Blessing, monarch,
initiative/undercity, elimination with turn number, commander art, seat picker
(player + deck from the registry).

Table: turn counter and active-player rotation, turn timer (settings: enabled, seconds),
first-player roll, Two-Headed Giant teams, sound and highlight preferences, game log,
end-of-game summary and winner countdown, side-effect detection (e.g. life hits
zero prompts a kill), threat source attribution.

Remote players: phone "seat" view joined by code; events flow via a server queue and
server-sent events. In the native app this is replaced by local networking (see below).

Server calls the web version makes: getPlayers, getDecks, getGameSettings /
updateGameSettings, getActiveGame, createGame (final save), plus the live-game
session/stream calls. The native app needs only the first group.

## Architecture

- Swift 6, SwiftUI, SwiftData, Observation. iOS 18+. iPhone and iPad (the iPad
  table layout is the main event; the iPhone layout is the remote-seat layout).
- Local-first: every game action appends an `GameEvent` row to an on-device,
  append-only log keyed by a client-generated game UUID. Current board state is a
  pure fold over the log, so undo, replay and crash recovery come for free. This
  mirrors `gameLog.ts` and `remoteTransforms.ts` in the web app; port their logic,
  not the React components.
- Reference data (players, decks with commander/partner/colors) is cached in
  SwiftData and refreshed when online. The game can be set up and played from cache
  with no network at all. Unknown players/decks can be created locally as drafts and
  reconciled on upload.
- Commander art: Scryfall images cached on disk; the game plays without them.
- Auth: existing JWT login against `php-api/auth/`. Token in Keychain. Token expiry
  does not block play; it only blocks upload until re-login.
- Sync worker: an outbox of finished games. Uploads `POST games.php` with the exact
  payload the web app sends (`played_at`, `game_type`, `notes`, `results[]` with
  `deck_id`, `player_id`, `finish_position`, `eliminated_turn`, `team_number`), then
  pushes the event log so the web's game log view shows it. Retries with exponential
  backoff; the user sees Pending / Uploaded / Failed per game and can retry manually.

## Server changes required (small, do first)

1. Idempotent game create: accept a client-supplied `client_game_id` (UUID) on
   `POST games.php`; a repeat with the same id returns the existing game instead of
   inserting twice. Needed so a retry after a dropped response cannot duplicate a game.
2. Event-log upload: a `POST game-log.php` (or extend the save) that accepts the full
   event array for a game id, so the native log lands in `game_logs` like the web's
   does today via `session_code`.
3. OpenAPI spec for the endpoints the app uses (auth, players, decks, game-settings,
   games, game-log). The Swift client is generated from it with
   swift-openapi-generator. This also stops the web and iOS clients drifting apart.
4. Independent of iOS: exponential backoff on the web stream reconnect (`retry: 100`
   today). The 100 ms retry is what turned a 502 into an account-wide lockout.

## Remote seats without a server

Phase 2 replaces the server-queue/SSE model with MultipeerConnectivity: the host iPad
advertises the game, phones on the same Wi-Fi or Bluetooth join and get a seat. Events
travel peer-to-peer, the host remains the single writer of the event log, and nothing
leaves the table until upload. Phones can run the same app in seat mode; a web seat is
not supported in this mode.

Seat QR codes carry over (requested 2026-10-29). Today each PlayerCard / TeamPanel
shows a QR of `<origin>/game-manager/remote/?code=<seatCode>` plus the bare code for
typing. In the native host the QR per seat encodes a join token (host peer id + seat +
one-time code); the iPhone app scans it with VisionKit's DataScannerViewController
(camera) and auto-joins that seat over Multipeer, with the short code still shown for
manual entry. CoreImage's CIQRCodeGenerator renders the codes, so no third-party
package replaces qrcode.react.

## Phases and rough effort (evenings and weekends)

| Phase | Content | Effort |
|---|---|---|
| 0 | Server: idempotent create, event-log upload, OpenAPI spec, web stream backoff | 1 week |
| 1 | Xcode project, SwiftData models, event log + state fold ported from `gameLog.ts`, iPad board: life, commander damage, poison, turns, timer, elimination, winner, end summary; login; players/decks cache; finished-game outbox and upload; TestFlight | 6 to 8 weeks |
| 2 | Multipeer remote seats (iPhone seat view), monarch/initiative/ring/energy/experience/rad/City's Blessing, 2HG teams, first-player roll, sounds | 4 to 6 weeks |
| 3 | Polish: commander art cache, haptics, Dynamic Type, Stage Manager on iPad, App Store listing | 2 to 3 weeks |

## Status effects: how the native board renders them (decided 2026-10-29)

The web effects are CSS keyframes and stacked absolutely-positioned DOM/SVG
(PlayerCard.keyframes.ts, PoisonOverlay, CityBlessing, EliminatedOverlay,
counterEffects.ts). On an iPad every one of them has a GPU-native equivalent that
costs less than compositing a DOM; the art direction carries over, the mechanism
does not. Mapping:

| Web effect | Native mechanism |
|---|---|
| Damage flash (red text-shadow + brightness burst on a life hit) | SwiftUI `.phaseAnimator` on the life label driving `.shadow` and `.brightness`; a `.sensoryFeedback(.impact)` on the same change. |
| Poison boil (translate/skew jitter from 8 poison), counter blur as poison nears lethal | `.distortionEffect` Metal shader (per-pixel wobble whose amplitude is the poison progress) over the card surface; blur via `.blur(radius:)` keyed to the same progress. One shader replaces three keyframes. |
| Poison overlay: green wash, drips, rising/boiling bubbles, phyrexian glyphs | SpriteKit `SKEmitterNode` for bubbles hosted in a `SpriteView` with a transparent background; drips and wash as a `.colorEffect` shader (`Canvas` for the glyphs). Emitter birth rate = poison progress. |
| XP shimmer / sweep / ember / rune glow (gold, intensity ramps to 10 XP) | `.layerEffect` shader for the sweep and shimmer (a moving highlight band over the counter), `TimelineView(.animation)` + `Canvas` for the embers. Glow as `.shadow` with the counterEffects ramp. |
| Energy pulse / sizzle (cyan, above 5) | `.phaseAnimator` pulse on scale + glow; sizzle as a `.distortionEffect` with tiny amplitude, gated on energy > 5. |
| City's Blessing scene: god rays, castle, hills, skyline, cathedral, fireworks, clouds, marching flags, with enter/exit | A SwiftUI scene composed of `Canvas` layers (skyline, hills, castle) with `TimelineView` for clouds and flags, god rays as a `.colorEffect` shader, fireworks as a short-lived `SKEmitterNode`. Flags still show commander art (cached). Enter/exit with `.transition(.asymmetric)` and `matchedGeometryEffect`. |
| Eliminated / Conceded / Poisoned word + falling tears | Word as a `Text` with `.contentTransition(.numericText())`-style reveal; tears as a small `SKEmitterNode`. |
| Monarch, initiative crown/torch, winner countdown | Symbol Effects on SF Symbols (`.symbolEffect(.pulse)`, `.bounce`) and `.phaseAnimator` for the countdown. |

Rules for the port: every effect is gated on the same thresholds as the web
(counterEffects.ts formulas move into the Kit as pure functions so the thresholds are
tested, not eyeballed); all effects respect Reduce Motion (`accessibilityReduceMotion`
drops emitters and distortion, keeps colour changes); shaders live in one `.metal`
file under apps/ios/App/Shaders and are compiled at build time; emitters are `.sks`
files editable in Xcode's particle editor so the look can be tuned without code. No
Lottie or other animation package.

## Testing

- XCTest on the event log and state fold: this is where correctness lives. Port the
  existing web unit cases for `gameLog.ts` / `remoteTransforms.ts` as fixtures so both
  clients are proven against the same event sequences.
- Snapshot tests for the board at the three sizes (iPad landscape, iPad portrait,
  iPhone seat).
- Sync tests against the local PHP API (`:8081`) with a flaky-network harness:
  drop the response after the server commits, confirm no duplicate game.
- Playwright on the web side stays as is; add one spec that reads a game uploaded by
  the iOS client and renders its log.

## Setup you will need

- Apple Developer Program (99 USD/yr) for TestFlight and the App Store.
- Xcode 26 on the Mac. Bundle id under your existing team. One App Store Connect
  record. No new backend hosting.

## Risks

- Dual maintenance of the game manager's rules. Mitigated by porting the event model
  (not the UI) and by shared fixture tests; the UI is expected to differ.
- Player/deck drift: a deck renamed on the web while a game is open offline. Upload
  references ids, not names, so this is cosmetic.
- Shared hosting remains the weak link for upload. Mitigated by the outbox: an upload
  can wait a day with no harm. Moving the PHP API off Bluehost is a separate decision.

## Decisions (confirmed 2026-10-29)

- iPad-first for Phase 1; the iPhone layout is the remote-seat view.
- Web remote seats are not supported for native-hosted games.
- The app lives at `commander-collector/apps/ios/` in the monorepo so it shares the
  OpenAPI spec and the event-log fixtures.
- The web stream reconnect uses incremental random backoff (shipped in
  `apps/core/app/lib/sseReconnect.ts`; Phase 0 item 4).

## Phase 0 status

- [x] Web stream reconnect: exponential backoff with jitter, 1 s base, 30 s cap,
      reset on first message; server fallback `retry:` raised from 100 ms to 3 s.
- [x] Idempotent `POST games.php` via `client_game_id` (v5.25.0; repeat returns `{id, created: false}`).
- [x] Event-log upload: `events` on `POST games.php`, or `POST game-log.php?action=upload` (v5.25.0).
- [x] OpenAPI spec for auth, players, decks, game-settings, games, game-log: `docs/openapi.yaml` (v5.25.0).
