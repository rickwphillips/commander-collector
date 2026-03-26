'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Stack, Box, Chip, Grow, Divider } from '@mui/material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import BuildIcon from '@mui/icons-material/Build';
import BugReportIcon from '@mui/icons-material/BugReport';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { PageContainer } from '@/components/PageContainer';

type ChangeType = 'added' | 'changed' | 'fixed' | 'improved';

interface Change {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  title: string;
  changes: Change[];
}

const changeTypeConfig: Record<
  ChangeType,
  { label: string; color: string; icon: React.ReactElement }
> = {
  added: { label: 'Added', color: '#2e7d32', icon: <NewReleasesIcon sx={{ fontSize: 14 }} /> },
  changed: { label: 'Changed', color: '#ed6c02', icon: <BuildIcon sx={{ fontSize: 14 }} /> },
  fixed: { label: 'Fixed', color: '#d32f2f', icon: <BugReportIcon sx={{ fontSize: 14 }} /> },
  improved: {
    label: 'Improved',
    color: '#0288d1',
    icon: <AutoAwesomeIcon sx={{ fontSize: 14 }} />,
  },
};

const releases: Release[] = [
  {
    version: '1.23.4',
    date: '2026-03-25',
    title: 'Code quality cleanup',
    changes: [
      { type: 'improved', text: 'Life and poison change logic now delegates to the shared pure functions used by remote panels, eliminating duplicated state logic' },
      { type: 'improved', text: 'Opponent list for kill attribution prompts extracted into a shared helper, used in both life and poison kill flows' },
      { type: 'improved', text: 'Dice panel sizing now uses a compact helper function instead of repeated ternary chains' },
      { type: 'improved', text: 'Last rolled type and display value are now memoized, avoiding redundant recomputation on every render' },
      { type: 'improved', text: 'Player position lookups (tooltip rotation, placement) use lookup objects instead of chained ternaries' },
    ],
  },
  {
    version: '1.23.3',
    date: '2026-03-25',
    title: 'CMD damage snapshot tooltip refinements',
    changes: [
      { type: 'improved', text: 'CMD damage source name tooltip is now click-only — tap or click the name to open, tap/click again or tap outside to close' },
      { type: 'improved', text: 'City\'s Blessing status now appears in the snapshot tooltip alongside Monarch and Initiative' },
      { type: 'improved', text: 'All counters (poison, energy, XP, commander tax) are always visible in the snapshot, dimmed when zero rather than hidden' },
      { type: 'fixed', text: 'Snapshot tooltip only triggers on the player/commander name text, not the stats row below it' },
    ],
  },
  {
    version: '1.23.2',
    date: '2026-03-25',
    title: 'Dice panel & CMD damage tooltip improvements',
    changes: [
      { type: 'improved', text: 'Dice panel controls and all three roll buttons are now on a single row' },
      { type: 'improved', text: 'Roll results display larger; multi-dice results animate with a spinning die or coin icon then reveal one at a time with a stagger' },
      { type: 'improved', text: 'Separator icons between multi-dice results are positioned at the number\'s midpoint and stay stable throughout the animation' },
      { type: 'improved', text: 'Hovering a commander name in the CMD damage section shows a mini snapshot panel with that player\'s current life, all counters (poison, energy, XP, tax), and game statuses (Monarch, Initiative, City\'s Blessing)' },
      { type: 'improved', text: 'Snapshot tooltip placement rotates to face the center of the board based on panel position' },
      { type: 'fixed', text: 'Snapshot tooltip now only triggers on the player/commander name, not the stats row' },
    ],
  },
  {
    version: '1.23.1',
    date: '2026-03-25',
    title: 'Auto-save countdown on game end',
    changes: [
      { type: 'improved', text: 'When the last player is eliminated, a banner counts down 15 seconds then automatically saves the game and navigates to the results screen' },
      { type: 'improved', text: 'Cancel button during the countdown returns to the live game, allowing corrections before saving' },
      { type: 'fixed', text: 'If a correction during the countdown restores more than one active player, the countdown cancels automatically' },
    ],
  },
  {
    version: '1.23.0',
    date: '2026-03-25',
    title: 'Commander damage threat visuals & auto-elimination',
    changes: [
      { type: 'added', text: 'Commander damage panel shows the threatening commander\'s art as a vignette background that intensifies as damage approaches 21' },
      { type: 'added', text: 'Threatening commander\'s name appears scattered as ghost text across the life total panel, growing more visible as damage climbs' },
      { type: 'improved', text: 'Commander damage elimination now checks each commander individually — 21 from a single commander is lethal, not the combined total' },
      { type: 'fixed', text: 'Players are automatically eliminated when commander damage or any source brings their life to 0 — no manual step needed' },
      { type: 'fixed', text: 'Commander damage to 0 life auto-attributes to the dealing player\'s commander; manual life changes still show the attribution prompt' },
      { type: 'fixed', text: 'Eliminated players on their turn can still pass the turn from the remote panel' },
      { type: 'improved', text: 'Commander damage elimination logic consolidated into a single shared source used by both host and remote panel' },
    ],
  },
  {
    version: '1.22.0',
    date: '2026-03-25',
    title: 'Remote panel sync & Game Setup random fill',
    changes: [
      { type: 'fixed', text: 'Remote panel now correctly receives live game state updates — root cause was LiteSpeed caching GET responses, serving stale data on every poll' },
      { type: 'fixed', text: 'Starting a new game now deactivates all previous active sessions, preventing the remote from reconnecting to a stale old game' },
      { type: 'fixed', text: 'Remote optimistic updates restored with a grace period — taps on the remote panel reflect instantly without reverting' },
      { type: 'added', text: 'Random button on the Game Setup page fills all player slots automatically with shuffled deck and player assignments' },
    ],
  },
  {
    version: '1.21.1',
    date: '2026-03-25',
    title: 'Changelog date fix',
    changes: [
      { type: 'fixed', text: 'Changelog entries since v1.18.0 were displaying one day early due to a duplicate timezone suffix — all dates now render correctly' },
    ],
  },
  {
    version: '1.21.0',
    date: '2026-03-25',
    title: 'Remote sync fixes, life panel redesign',
    changes: [
      { type: 'fixed', text: 'Remote player panel now always uses the server as source of truth — eliminates the life total reverting after changes' },
      { type: 'fixed', text: 'Host event polling no longer pauses when the game manager window is minimized or backgrounded' },
      { type: 'fixed', text: 'Remote connection no longer drops on a single failed poll — requires 3 consecutive failures before ending, with a reconnect banner and rejoin option' },
      { type: 'improved', text: 'Diagnostic server-side logging added to trace sync issues' },
      { type: 'improved', text: 'Life +/− buttons moved to directly below the life total number on each player panel' },
      { type: 'improved', text: 'Crack texture overlay now transitions smoothly as life drops, expanding outward from the centre with each layer fading in independently' },
    ],
  },
  {
    version: '1.20.0',
    date: '2026-03-25',
    title: 'Kill attribution panels, compact menus, dice UX',
    changes: [
      { type: 'improved', text: 'Kill attribution prompt ("Who brought X to 0?" / "Who poisoned X?") now appears as an overlay on the affected player\'s own panel instead of a modal dialog, keeping it spatially connected to the action' },
      { type: 'added', text: 'Remote panel now shows kill attribution overlays when the remote player\'s life hits 0 or poison reaches 10, and sends the attribution to the host as a queued event' },
      { type: 'improved', text: 'Settings menu condensed to fit without scrolling — Timer, Highlight, and Notes controls on one row; Restart and End Game on the next' },
      { type: 'changed', text: 'Remote player code list removed from settings menu — QR codes remain accessible via long press on each player\'s panel header' },
      { type: 'improved', text: 'Dice menu condensed to fit without scrolling' },
      { type: 'improved', text: 'Last-used dice button turns yellow after a roll to indicate which type was most recently rolled' },
      { type: 'improved', text: 'Last-used dice button displays the result inline (e.g. "total 17")' },
      { type: 'improved', text: 'All roll results (including single-die and coin flip) now display in the result area above the buttons' },
    ],
  },
  {
    version: '1.19.0',
    date: '2026-03-25',
    title: 'Delta event queue for live sync',
    changes: [
      { type: 'improved', text: 'Remote players now send lightweight actions (life change, pass turn, etc.) instead of full game state — eliminating the race condition where a remote write could revert the host\'s turn advance' },
      { type: 'fixed', text: 'Turn number can no longer be accidentally overwritten by a remote player\'s action — the host is the sole authority on turn state' },
      { type: 'improved', text: 'Multiple remote players can now make changes simultaneously without one stomping the other\'s update' },
      { type: 'improved', text: 'Host polls for remote events every 1 second (down from 3 seconds) for noticeably faster sync' },
      { type: 'added', text: 'Remote panel connection check-in now uses the event queue, keeping the connected indicator alive without full state writes' },
      { type: 'improved', text: 'Life total on the remote panel is larger for easier reading across the table' },
      { type: 'added', text: 'Dark mode toggle added to the bottom of the remote panel' },
      { type: 'improved', text: 'Life +/− buttons styled as rounded squares with a matching ripple shape' },
      { type: 'improved', text: 'Energy counter life total now shows an emanating glow ripple, a constant darker-blue spread shadow, and an electrical sizzle jitter that scales with energy count' },
      { type: 'added', text: 'Experience counter badge now animates on gain: diagonal shimmer sweep, level-up scale flash, floating ember particles, and a slow breathing rune glow' },
    ],
  },
  {
    version: '1.18.0',
    date: '2026-03-25',
    title: 'Live game session stability',
    changes: [
      { type: 'improved', text: 'Remote player actions (life, poison, commander damage, Pass Turn) now reliably reflect the host\'s current game state — stale data from delayed polling can no longer overwrite the host\'s turn or player changes' },
      { type: 'improved', text: 'Remote panel heartbeat and all action writes use a read-modify-write pattern, ensuring only the intended change is applied on top of the latest database state' },
      { type: 'improved', text: 'Host page reload no longer replays stale saved state into a live session — the session is verified active before any writes are permitted' },
      { type: 'fixed', text: 'Starting a new game now ensures the previous session is fully cleaned up before creating the new one' },
    ],
  },
  {
    version: '1.17.4',
    date: '2026-03-25',
    title: 'Fix stale game state persisting across sessions',
    changes: [
      { type: 'fixed', text: 'When resuming a game after a page reload, the host now verifies the session is still active before writing — preventing stale saved state from overwriting a live session that has since moved on' },
      { type: 'fixed', text: 'Starting a new game now waits for the previous session to be fully deleted before creating the new one, preventing the old session from lingering in the database' },
    ],
  },
  {
    version: '1.17.3',
    date: '2026-03-25',
    title: 'Fix remote panel overwriting host state on any action',
    changes: [
      { type: 'fixed', text: 'All remote panel actions (life changes, poison, commander damage, Pass Turn, and more) now fetch the current game state from the database before writing — preventing any remote tap from overwriting the host\'s most recent turn or state changes' },
    ],
  },
  {
    version: '1.17.2',
    date: '2026-03-24',
    title: 'Fix remote heartbeat overwriting host turn in DB',
    changes: [
      { type: 'fixed', text: 'Remote panel heartbeat now reads the current game state from the database before writing the check-in timestamp, preventing stale local state from overwriting the host\'s most recent turn change' },
    ],
  },
  {
    version: '1.17.1',
    date: '2026-03-24',
    title: 'Remove localStorage from remote panel',
    changes: [
      { type: 'fixed', text: 'Remote panel no longer caches the game code in localStorage — the database and URL code param are now the sole source of truth, preventing stale sessions from auto-loading after a game has ended' },
    ],
  },
  {
    version: '1.17.0',
    date: '2026-03-24',
    title: 'Live Game Session — Remote Player Panel',
    changes: [
      { type: 'added', text: 'Remote player panels let each player connect to their own panel on any device using a unique seat code' },
      { type: 'added', text: 'QR codes in the game state menu and panel header for instant remote access — long-press the player name to open' },
      { type: 'added', text: 'Remote panel shows whose turn it is, highlights the active player in the commander damage section, and supports text size controls' },
      { type: 'added', text: 'Host board shows a pulsing phone icon when a remote player is connected; QR overlay closes automatically on checkin' },
      { type: 'fixed', text: 'Game sessions are now properly marked inactive when a game ends, is discarded, or a new game starts' },
      { type: 'fixed', text: 'Remote panel no longer requires login — the seat code is the credential' },
      { type: 'improved', text: 'Game state menu, settings, and dice overlays are now scrollable on small screens' },
    ],
  },
  {
    version: '1.16.2',
    date: '2026-03-24',
    title: 'Remote Panel Fixes & QR Polish',
    changes: [
      { type: 'fixed', text: 'Remote player panel no longer redirects to login — the seat code is all you need to access your panel' },
      { type: 'fixed', text: 'Remote panel now reliably syncs with the host — DB is the source of truth, polling no longer reverts local changes' },
      { type: 'improved', text: 'Long-pressing the player name / commander in the panel header now opens the QR code overlay' },
      { type: 'fixed', text: 'Long-pressing the Monarch, Initiative, or City\'s Blessing icons no longer accidentally opens the QR overlay' },
    ],
  },
  {
    version: '1.16.1',
    date: '2026-03-24',
    title: 'Scrollable Game Overlays',
    changes: [
      { type: 'fixed', text: 'Game state menu, settings, and dice overlays are now scrollable — content no longer gets cut off on small panels or phones' },
    ],
  },
  {
    version: '1.16.0',
    date: '2026-03-24',
    title: 'Remote Player Panel',
    changes: [
      { type: 'added', text: 'Live game session infrastructure — DB tables and PHP API for persisting game state server-side with per-seat unique access codes' },
      { type: 'added', text: 'QR codes and seat codes in the game state menu and player panel header for easy remote access from any device' },
      { type: 'added', text: 'In-panel QR overlay (long-press header or tap seat code in state menu) — tapping copies the code to clipboard and closes' },
      { type: 'improved', text: 'State menu converted to a full-panel centered overlay for easier tapping on phone screens' },
      { type: 'added', text: 'Text size controls on the remote player panel' },
      { type: 'fixed', text: 'Remote panel turn timer now counts up correctly and blinks red when time is up' },
      { type: 'improved', text: 'Active player highlighted in the commander damage section on the remote panel so you can see whose turn it is' },
      { type: 'improved', text: 'CMD Damage title moved inside the grid, commander damage rows vertically centered like life and counters' },
    ],
  },
  {
    version: '1.15.3',
    date: '2026-03-24',
    title: 'Date Timezone Fix',
    changes: [
      { type: 'fixed', text: 'Game dates now display correctly in local time (EST) — previously showed one day behind due to JavaScript parsing date-only strings as UTC midnight' },
      { type: 'fixed', text: 'New game form and Game Manager now default to today\'s local date instead of the UTC date' },
    ],
  },
  {
    version: '1.15.2',
    date: '2026-03-23',
    title: 'Game Manager — Responsive Scaling & Scrollable Damage',
    changes: [
      { type: 'improved', text: 'Player panels and center tile now scale fluidly across phone (landscape), iPad, and desktop using dvh/dvw viewport units with clamp()' },
      { type: 'improved', text: 'Side panel column widths scale with viewport width (clamp 140–340px); center tile row height scales with viewport height (clamp 120–220px)' },
      { type: 'improved', text: 'Life total font size scales with viewport height (clamp 34–128px depending on text size mode) so it no longer overflows on small screens' },
      { type: 'improved', text: 'Center tile Next Turn button, roll buttons, and all text scale with the smaller of dvh/dvw for consistent proportions' },
      { type: 'improved', text: 'Commander damage section is now scrollable — header stays fixed, damage rows scroll when they overflow available height' },
    ],
  },
  {
    version: '1.15.1',
    date: '2026-03-23',
    title: 'Game Manager — Player Positioning & Tooltip Fixes',
    changes: [
      { type: 'fixed', text: 'Player 2 now correctly placed on the left, player 4 on the right (was reversed)' },
      { type: 'fixed', text: 'Player 2 no longer missing in 3-player games' },
      { type: 'improved', text: 'Left player given more horizontal space (340px) in 3-player games' },
      { type: 'fixed', text: 'Header tooltip for left and right players no longer clips off screen edge' },
    ],
  },
  {
    version: '1.15.0',
    date: '2026-03-22',
    title: 'Game Manager — Game State Submenu & Concede Flow',
    changes: [
      { type: 'added', text: 'Game state icons (Monarch, Initiative, City\'s Blessing) moved into a slide-in submenu opened by a + button; active icons remain as passive indicators in the header' },
      { type: 'added', text: 'Long press any active game state icon in the header to turn it off' },
      { type: 'added', text: 'Concede flow moved into the game state submenu with a confirmation step; card flashes gold border and glow with a CONCEDE? overlay' },
      { type: 'added', text: 'Conceded players show a gold-tinted panel, CONCEDED text, and animated falling tear drops' },
      { type: 'improved', text: 'Rules tooltips now correctly positioned for all rotated player panels (left, right, top) without clipping off screen edges' },
      { type: 'improved', text: 'Initiative rules text corrected to reference the Undercity for both the initial trigger and upkeep trigger' },
      { type: 'improved', text: 'Concede state visually distinct from combat/poison elimination — gold styling vs red' },
    ],
  },
  {
    version: '1.14.1',
    date: '2026-03-22',
    title: 'Game Manager — Monarch Animation & Turn Highlight',
    changes: [
      { type: 'added', text: 'Monarch crown enter/exit animations — crown drops in from above on grant, floats upward on loss; transfers delay the receiving crown until the departing one has left' },
      { type: 'added', text: 'Header Highlight mode — translucent colored bar on the current player\'s name strip instead of a card border; color tracks the turn timer (blue when off, green → yellow → red as time runs out)' },
      { type: 'improved', text: 'Header Highlight is now the default current-turn indicator; border outline mode still available via the settings toggle' },
    ],
  },
  {
    version: '1.14.0',
    date: '2026-03-22',
    title: 'Game Manager — Settings Panel & UX Polish',
    changes: [
      { type: 'added', text: 'In-game settings panel (gear icon, top-right): toggle turn timer on/off, open game notes, restart or end game — restoring last timer value when re-enabled' },
      { type: 'added', text: 'Discard Results button on the end game screen — clears the session and returns to the games list without logging' },
      { type: 'added', text: 'Custom D20 SVG icon for the d20 dice button — two overlapping inscribed triangles forming the icosahedron face pattern' },
      { type: 'fixed', text: 'Turn number no longer stalls when the first player is eliminated — increment now tracks when turn order crosses the first player\'s seat position rather than requiring a landing' },
      { type: 'fixed', text: 'Seat assignment order corrected: 3-player uses bottom/left/top, 4-player uses bottom/left/top/right' },
      { type: 'fixed', text: 'Turn timer set to 0 no longer causes an instant red border flash — shows a calm blue outline instead' },
      { type: 'improved', text: 'Dice panel buttons restyled to match settings panel — larger, full-width, with icons for d6, d20, and coin flip' },
      { type: 'improved', text: 'Game notes and game controls (restart, end game) consolidated into the settings panel' },
    ],
  },
  {
    version: '1.13.4',
    date: '2026-03-21',
    title: 'Game Manager — Life Total Visual Overhaul',
    changes: [
      { type: 'added', text: 'Life total color shifts proportionally — blood red as life decreases from starting total, green as it rises above it' },
      { type: 'added', text: 'Commander status panel life total (♥) uses the same proportional color as the main life number' },
      { type: 'added', text: 'Crack texture appears on the life total number and intensifies with damage — clipped to exact glyph shapes via CSS background-clip' },
      { type: 'added', text: 'Damage swipe animation: two angled slashes cross the life total on each hit, forming an asymmetric X; three additional slashes fire on long-press (−5)' },
    ],
  },
  {
    version: '1.13.3',
    date: '2026-03-21',
    title: 'Game Manager — Turn Timer Enhancements',
    changes: [
      { type: 'added', text: 'Next Turn button pulses with increasing urgency as the turn timer counts down — slow pulse at 30s, faster at 20s, rapid orange-red glow at 10s' },
      { type: 'added', text: 'Turn timer can now be set to 0 to disable the time limit entirely (no countdown, no pulse)' },
    ],
  },
  {
    version: '1.13.2',
    date: '2026-03-21',
    title: 'Game Manager — iPad Layout & Text Scaling',
    changes: [
      { type: 'improved', text: 'Center zone no longer dominates on iPad Pro — row height capped at 220px so player panels fill the remaining space' },
      { type: 'improved', text: 'Left and right player panels widened from 220px to 260px for more room' },
      { type: 'improved', text: 'Text size toggle now scales the center panel (Next Turn button, turn tracker text, roll/accept buttons) and player panel header (commander art, player name, status icons)' },
      { type: 'fixed', text: 'Commander Damage section converted to CSS grid with safe-center alignment — title no longer clips at the top when content overflows' },
      { type: 'fixed', text: 'Two-digit values (e.g. 21 commander damage, 10 poison) no longer wrap in the Commander Damage and Counters columns at large text sizes — columns widen at XL and nowrap is enforced' },
      { type: 'fixed', text: 'Counters section is now scrollable so Commander Tax is always reachable when the panel is short' },
      { type: 'fixed', text: 'Center panel turn tracker text no longer overflows the card at large text sizes — Stack width set to 80% keeping text centered and contained' },
      { type: 'added', text: 'Commander Damage section has a CMD / Player toggle button to switch between displaying commander names and player names' },
      { type: 'changed', text: 'Next Turn button changed from filled to outlined style' },
    ],
  },
  {
    version: '1.13.1',
    date: '2026-03-19',
    title: 'Game Manager — Bug Fixes',
    changes: [
      { type: 'fixed', text: 'Roll for first player UI now correctly shown after game restart — isResumed flag was persisting across restarts, causing the roll screen to be skipped' },
      { type: 'fixed', text: 'Dungeon stone background image now loads correctly in production — asset path was missing the basePath prefix' },
    ],
  },
  {
    version: '1.13.0',
    date: '2026-03-19',
    title: 'Game Manager — Visual Effects & Polish',
    changes: [
      { type: 'added', text: "City's Blessing animated panel — castle silhouette slides in from the left, god rays fan out from the top-left corner, multicolored fireworks launch in sequence, and clouds drift slowly across the top" },
      { type: 'added', text: "City's Blessing exit sequence — reverses entrance: clouds stop, fireworks fade, rays fade out, then castle slides back off-screen" },
      { type: 'added', text: 'Initiative torch overlay — dungeon stone background fades in when initiative is held; an animated torch silhouette wanders across the panel with a drifting flame animation and flickering glow' },
      { type: 'added', text: 'Initiative icon (castle) shown in the commander damage list alongside crown and City\'s Blessing icons when the source player holds the initiative' },
      { type: 'added', text: 'Monarch icon replaced with a crown SVG; all status header icons now have tooltips' },
      { type: 'added', text: 'Ixalan set symbol added as an in-code SVG for the City\'s Blessing status icon' },
      { type: 'added', text: 'Toggleable text size mode in the game manager panel — cycles through compact, normal, and large layouts' },
      { type: 'improved', text: "City's Blessing icon uses a royal purple gradient (pink → violet → deep indigo) in all locations when active" },
      { type: 'fixed', text: 'Commander damage minus button no longer adds life back when damage is already at 0 — uses actual delta to prevent phantom life gain' },
      { type: 'fixed', text: "City's Blessing clouds no longer appear immediately on activation — they are delayed to start alongside the fireworks" },
      { type: 'fixed', text: 'XP icon in commander damage status row no longer shows a white background in dark mode — fixed by providing an explicit background surface for the blend mode to composite against' },
      { type: 'added', text: 'Tooltips on all status indicators in the commander damage list — shows current value for Life, Poison, Energy, and Experience; label only for Monarch, City\'s Blessing, and Initiative' },
      { type: 'improved', text: 'Tooltip text rotates to match each panel\'s orientation — readable for players at top, left, and right positions' },
    ],
  },
  {
    version: '1.12.1',
    date: '2026-03-19',
    title: 'Game Setup — Position Arrows',
    changes: [
      { type: 'added', text: 'Directional arrow icons on each player slot in Game Setup — shows which board position (bottom/top/left/right) each slot maps to, updating dynamically with player count' },
    ],
  },
  {
    version: '1.12.0',
    date: '2026-03-19',
    title: 'Game Manager — XP Animations, First Player UX & Turn Logic',
    changes: [
      { type: 'added', text: 'Experience counter animations — persistent gold glow scaling with XP count, shimmer sweep every 3s, flash+scale on increment, diamond ripple ring on increment' },
      { type: 'added', text: 'XP diamond badge in player header — gold diamond with Upgrade icon and count; flashes and ripples on each increment' },
      { type: 'added', text: 'Opponent status pips in commander damage section — shows ♥ life, ☠ poison, ⚡ energy, and XP icon + count for each opponent under their commander name' },
      { type: 'added', text: 'Choose First Player option — square button alongside Roll; shows player name buttons to set first player manually' },
      { type: 'added', text: 'First player recorded in game notes — auto-appends "First player (rolled/chosen): Name" when first player is set' },
      { type: 'added', text: 'Previous turn via long-hold on Next Turn button (500ms) — goes counter-clockwise, decrements turn number on wrap; blocked at first player on turn 1' },
      { type: 'improved', text: 'Roll animation — smoother sinusoidal deceleration, live player name updates during roll with spring-bounce transition' },
      { type: 'improved', text: 'Roll panel redesigned — Roll button (110×110 with d20 icon) and Choose button (80×80) square; Accept and Roll Again match same sizes' },
      { type: 'improved', text: 'Player name in roll result styled large bold italic; "goes first!" thin and theme-colored; gold glow pulse animation on final result' },
      { type: 'fixed', text: 'Turn number now correctly increments when the first player takes their next turn — was incorrectly incrementing based on absolute clockwise position index rather than who was chosen first' },
      { type: 'fixed', text: 'Game state correctly cleared from localStorage on restart — useEffect now removes the key when phase transitions to setup, preventing stale state from being written back' },
      { type: 'improved', text: 'Commander damage section scrollable when many opponents are shown' },
      { type: 'improved', text: 'Life color in opponent status pips matches life total color (primary/error) instead of green scale' },
    ],
  },
  {
    version: '1.11.1',
    date: '2026-03-18',
    title: 'Game Manager Layout Fixes',
    changes: [
      { type: 'fixed', text: '2-player games now correctly show bottom and top panels (was assigning right position to 2nd player, which had 0px column width)' },
      { type: 'fixed', text: '3-player games use bottom, right, and top positions; left panel correctly hidden' },
      { type: 'fixed', text: 'Guard logic updated — right hidden for 2-player, left hidden for 2 and 3-player' },
      { type: 'added', text: 'Back button on game setup page to return to games list' },
    ],
  },
  {
    version: '1.11.0',
    date: '2026-03-18',
    title: 'Game Manager — Kill Attribution, Auto-Elimination & Notes',
    changes: [
      { type: 'added', text: 'Auto-eliminate players when life reaches 0, poison reaches 10, or commander damage from a single source reaches 21 — reversed automatically if the condition is undone' },
      { type: 'added', text: 'Kill attribution prompt for life kills — asks who dealt the final blow and records it in game notes' },
      { type: 'added', text: 'Kill attribution prompt for poison kills — asks who applied the lethal poison and records it in game notes' },
      { type: 'added', text: 'Commander damage kills auto-record the source commander (and partner) in game notes' },
      { type: 'added', text: 'Game notes modal — Notes icon in the center zone opens an editable notes dialog; highlights when notes are present' },
      { type: 'added', text: 'Kill events auto-populate game notes with turn number and attribution; notes are saved to the game record on log' },
      { type: 'added', text: 'Play Game button on games page linking directly to the game manager' },
      { type: 'improved', text: 'Win dialog deferred until kill attribution prompt is resolved — ensures final blow note is captured before saving' },
      { type: 'improved', text: 'Commander damage controls disabled and struck through for eliminated players' },
      { type: 'improved', text: 'Commander damage number column widened to prevent wrapping on two-digit values' },
      { type: 'improved', text: 'First player roll animation is noticeably faster' },
      { type: 'fixed', text: 'Game save navigation corrected to /games/detail?id= route' },
      { type: 'fixed', text: 'Game notes saved with kill events stripped of internal tracking tags' },
    ],
  },
  {
    version: '1.10.0',
    date: '2026-03-18',
    title: 'Query Sentence & Comparison Builder Overhaul',
    changes: [
      {
        type: 'added',
        text: 'Guild, shard, and wedge name toggles in Query Sentence — independently substitute Ravnica guild names (2-color), Alara shard names, and Khans wedge names; All/None shortcuts; all enabled by default',
      },
      {
        type: 'added',
        text: 'My Decks Only checkbox in comparison builder — restricts results to decks owned by the claimed player, regardless of who piloted them',
      },
      {
        type: 'added',
        text: 'Commander metadata column in comparison results — deck group-by now returns commander name; toggle visibility via Show checkboxes on the panel',
      },
      {
        type: 'added',
        text: 'Show/hide metadata checkboxes on results panel — independently toggle Colors, Player, and Commander columns',
      },
      {
        type: 'added',
        text: 'Search added to games page (by player, deck, or commander) and players page (by name)',
      },
      {
        type: 'improved',
        text: 'Color combination names (guild/shard/wedge) appear in all three color pickers when AND mode is active and colors match a known combination',
      },
      {
        type: 'improved',
        text: 'Query sentence uses guild/shard/wedge names consistently across subject, entity filter, and opponent color clauses',
      },
      {
        type: 'improved',
        text: 'My Games Only + game type combined into a single sentence clause ("in my Commander games" / "in my 2HG games")',
      },
      {
        type: 'improved',
        text: 'My Games Only and My Decks Only moved above Deck must include colors in Section A',
      },
      {
        type: 'improved',
        text: 'Ranked metrics now use natural-language list ("Win Rate, Wins, and Total Games") instead of bullet separators',
      },
      {
        type: 'changed',
        text: '"Filter by deck color" removed from Section C — consolidated into "Deck must include colors" in Section A to eliminate redundant constraint',
      },
      {
        type: 'fixed',
        text: 'Color picker normalizes selection order to WUBRG before storing — guild/shard/wedge name matches correctly regardless of click order',
      },
      {
        type: 'fixed',
        text: 'Guild/shard/wedge name suppressed in OR mode and shown only in AND mode',
      },
    ],
  },
  {
    version: '1.9.2',
    date: '2026-03-18',
    title: 'Color Picker & UI Polish',
    changes: [
      {
        type: 'improved',
        text: 'New deck form now uses mana symbol pips for color identity selection instead of letter toggle buttons',
      },
      {
        type: 'fixed',
        text: 'Mana symbols no longer clipped by card borders on the decks list',
      },
      {
        type: 'improved',
        text: 'Single-color pip now has consistent right margin matching multi-color arrangements',
      },
      {
        type: 'improved',
        text: 'Colorless (C) support added to deck edit dialog and decks page color filter',
      },
    ],
  },
  {
    version: '1.9.1',
    date: '2026-03-17',
    title: 'Mana Symbol Visuals',
    changes: [
      {
        type: 'added',
        text: 'Mana symbol SVG icons — all color identity displays now show official mana pip icons (W/U/B/R/G/C)',
      },
      {
        type: 'added',
        text: 'Geometric pip arrangements — 3 colors display as a triangle, 4 as a square, 5 as a pentagon',
      },
      {
        type: 'added',
        text: 'Colorless (C) option in color pickers throughout the app, mutually exclusive with WUBRG',
      },
      {
        type: 'improved',
        text: 'Color identity sentence in comparison builder now reads as a subject ("Show me all white and blue commanders…") rather than a condition clause',
      },
      {
        type: 'improved',
        text: 'Deck list filter and edit dialog use interactive mana symbol toggles instead of checkboxes',
      },
    ],
  },
  {
    version: '1.9.0',
    date: '2026-03-17',
    title: 'Custom Comparison Builder Overhaul',
    changes: [
      {
        type: 'improved',
        text: 'Color filter in comparison builder now uses has_W/U/B/R/G columns instead of exact string match — AND/OR/Only modes work correctly for all group-bys',
      },
      {
        type: 'added',
        text: 'Opponent filters in comparison conditions — filter games by opponent players, opponent commanders, and opponent deck colors (with AND/OR/Only mode)',
      },
      {
        type: 'added',
        text: 'Opponent group-bys — group results by Opponent Player or Opponent Commander to see your performance against specific opponents',
      },
      {
        type: 'added',
        text: 'New metrics: Consistency Score (std dev of finish position) and First Eliminated Rate',
      },
      {
        type: 'added',
        text: 'My Games Only condition — restrict results to games you personally played in (requires claimed player)',
      },
      {
        type: 'added',
        text: 'Exclude Players condition — remove specific players from pod when counting stats',
      },
      {
        type: 'added',
        text: 'Top N results limit — show only the top N entities in comparison results',
      },
      {
        type: 'added',
        text: 'Color filter (with AND/OR/Only mode) in Section C Narrow To — filter by deck color for player, deck, deck_age, and game-property group-bys',
      },
      {
        type: 'added',
        text: 'Query Sentence — live natural-language description of the current comparison query, updating in real time as conditions are configured in the panel builder',
      },
      {
        type: 'changed',
        text: 'Panel builder is now comparison-only — Pre-built Sections tab removed; all new panels use the custom comparison builder',
      },
      {
        type: 'improved',
        text: 'Commander autocomplete in conditions now pulls from your loaded decks data instead of requiring free-text entry',
      },
      {
        type: 'fixed',
        text: 'Color filter on decks page now uses has_X columns with AND/OR/Only mode instead of exact string match',
      },
      {
        type: 'fixed',
        text: 'stat_panels.user_id column widened to VARCHAR(36) to match UUID-based auth system',
      },
    ],
  },
  {
    version: '1.8.1',
    date: '2026-02-23',
    title: 'Versioned DB Migrations',
    changes: [
      {
        type: 'improved',
        text: 'Deploy script now applies versioned DB migrations automatically — schema changes in migrations/v*.sql run before PHP deploy, tracked in schema_migrations table',
      },
    ],
  },
  {
    version: '1.8.0',
    date: '2026-02-23',
    title: 'Color Stats, 2HG Overhaul & UX Polish',
    changes: [
      {
        type: 'added',
        text: 'Color Presence stats — win rates for all decks containing each color (W/U/B/R/G), regardless of other colors in the identity',
      },
      {
        type: 'added',
        text: 'Color Complexity stats — performance breakdown by number of colors (Colorless through Five-color)',
      },
      {
        type: 'added',
        text: 'Must Include Colors condition in comparison builder — filter results to decks containing all specified colors',
      },
      {
        type: 'changed',
        text: '2HG game form redesigned — replaced per-player team assignment with direct team cards; each non-winning team has its own Eliminated Turn field',
      },
      {
        type: 'added',
        text: 'Add Team button in 2HG form — supports up to 4 teams with finish positions ordered by elimination turn',
      },
      {
        type: 'changed',
        text: 'Game Length (winning turn) is now auto-derived from the last-eliminated player\'s turn — no longer a manual input field',
      },
      {
        type: 'changed',
        text: 'Game Length filter on custom panel form replaced with number input plus "or more" / "or less" / "Any" controls; supports both min and max turn bounds',
      },
      {
        type: 'changed',
        text: 'Game Type filter label updated from "Standard" to "Commander" on the comparison builder',
      },
      {
        type: 'improved',
        text: 'Overall stats cards on home and stats pages link to their respective pages; Avg Turns links to Stats',
      },
      {
        type: 'improved',
        text: 'Test coverage: api.ts at 94%+ branch coverage (31 new tests); StatsCard at 100% across all metrics; 92 total tests',
      },
    ],
  },
  {
    version: '1.7.1',
    date: '2026-02-22',
    title: 'Coverage Reporting',
    changes: [
      {
        type: 'added',
        text: 'V8 coverage reporting — npm run test:coverage shows per-file line/branch/function percentages',
      },
      {
        type: 'improved',
        text: 'Tested files hit 95–100% line coverage; statsSections, ColorIdentityChips, and StatsCard at 100%',
      },
    ],
  },
  {
    version: '1.7.0',
    date: '2026-02-22',
    title: 'Test Suite',
    changes: [
      { type: 'added', text: 'Vitest test suite — 58 tests across 5 files' },
      {
        type: 'added',
        text: 'Unit tests for statsSections: getSectionDef lookups, VALID_SECTION_IDS membership, DEFAULT_SECTION_ORDER',
      },
      {
        type: 'added',
        text: 'Hook tests for useHiddenStats: toggle, showAll, hideAll, panel visibility, localStorage persistence',
      },
      {
        type: 'added',
        text: 'API tests: auth headers, .php endpoint insertion, 401 handling, typed method endpoints',
      },
      { type: 'added', text: 'Component tests for ColorIdentityChips and StatsCard' },
    ],
  },
  {
    version: '1.6.0',
    date: '2026-02-20',
    title: 'Auth & Security',
    changes: [
      {
        type: 'fixed',
        text: 'Logout now works correctly when switching between apps — login page clears its own stored token on explicit logout',
      },
      {
        type: 'fixed',
        text: 'Auth user IDs upgraded to UUIDs — removed integer casts that would break after the ID type migration',
      },
      {
        type: 'improved',
        text: 'User registration and bootstrap generate a UUID before insert rather than relying on lastInsertId()',
      },
    ],
  },
  {
    version: '1.5.0',
    date: '2026-02-19',
    title: 'Comparison Builder',
    changes: [
      {
        type: 'added',
        text: 'Comparison Builder — create custom stat queries with conditions, group-by, entity filters, and metrics',
      },
      {
        type: 'added',
        text: '12 group-by types: Player, Deck, Commander, Color, Deck Age, Pod Size, Game Length, Game Type, Month, Year, Season, Day of Week',
      },
      {
        type: 'added',
        text: '9 metrics: Win Rate, Wins, Total Games, Avg Finish Position, Recent Win Rate, Avg Survival Turns, Avg Turns to Win, Top-2 Rate, Elimination Rate',
      },
      {
        type: 'added',
        text: 'Condition filters: game type, pod size, game length, required player/commander in pod, finish position, date range, min games threshold',
      },
      {
        type: 'added',
        text: 'Color identity chips in comparison results for deck and color group-bys',
      },
      { type: 'added', text: 'Panel preview button on the Customize page with inline results' },
      {
        type: 'added',
        text: 'Inline panel toggle — show any panel directly on the Stats page from the settings drawer',
      },
      {
        type: 'improved',
        text: 'Section Visibility drawer now includes Your Panels and Shared Panels sections',
      },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-02-17',
    title: 'Stats Customization & Sharing',
    changes: [
      { type: 'added', text: 'Hide stats sections — click the eye icon on any section to hide it' },
      {
        type: 'added',
        text: 'Settings drawer — toggle all section visibility with Show All / Hide All',
      },
      {
        type: 'added',
        text: 'Custom panels — save named views with your preferred sections and order',
      },
      { type: 'added', text: 'Drag-and-drop panel builder at Stats > Customize' },
      {
        type: 'added',
        text: 'Panel sharing — toggle a panel to shared and copy the link for others',
      },
      {
        type: 'added',
        text: 'Shared panel URL support — open a shared link to load that panel view',
      },
      {
        type: 'added',
        text: 'View selector dropdown on stats page to switch between default and custom panels',
      },
      { type: 'added', text: 'Hide shared panels from your view selector via settings drawer' },
      {
        type: 'improved',
        text: 'Stats page refactored for dynamic section rendering and ordering',
      },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-02-13',
    title: 'Two-Headed Giant Stats',
    changes: [
      { type: 'added', text: 'Two-Headed Giant stats section on stats page' },
      { type: 'added', text: 'Team pairing records — wins, games, and win rate per duo' },
      { type: 'added', text: 'Individual player 2HG records' },
      { type: 'added', text: 'Recent 2HG game history with winning team and decks' },
      { type: 'changed', text: 'Replaced "Coming Soon! 2HG" placeholder with live data' },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-02-12',
    title: 'Deck Filtering & Advanced Stats',
    changes: [
      { type: 'added', text: 'Deck page search — filter by deck name or commander' },
      { type: 'added', text: 'Deck page player filter dropdown' },
      { type: 'added', text: 'Deck page color identity toggle filters (W/U/B/R/G)' },
      { type: 'added', text: 'Deck page sort options — name, win rate, games played' },
      { type: 'added', text: 'Color Meta Analysis on stats page — win rates by color identity' },
      { type: 'added', text: 'Performance by Pod Size — player breakdowns for 2-6 player games' },
      {
        type: 'added',
        text: 'Player Streaks & Form — current streak, best streak, hot/cold/steady trend',
      },
      { type: 'added', text: 'Deck Streaks & Form — same streak tracking per deck' },
      { type: 'added', text: 'Changelog page' },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-02-04',
    title: 'User-Player Association',
    changes: [
      { type: 'added', text: 'Link player profiles to authenticated user accounts' },
      { type: 'added', text: 'Admin can assign users to players from player detail page' },
      { type: 'improved', text: 'Player detail page shows linked user info' },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-02-04',
    title: 'Initial Release',
    changes: [
      { type: 'added', text: 'Player management — add, edit, delete players' },
      { type: 'added', text: 'Deck tracking with commander and color identity' },
      { type: 'added', text: 'Game logging with finish positions and elimination turns' },
      { type: 'added', text: 'Statistics dashboard — top players, decks, commanders' },
      { type: 'added', text: 'Head-to-head records (1v1 and multiplayer)' },
      { type: 'added', text: 'JWT authentication with invite-only registration' },
      { type: 'added', text: 'Dark/light mode toggle' },
      { type: 'added', text: 'Responsive design for mobile and desktop' },
    ],
  },
];

export default function ChangelogPage() {

  return (
    <PageContainer title="Changelog" subtitle="What's new in Commander Collector">
      <Stack spacing={3}>
        {releases.map((release, index) => (
          <Grow key={release.version} in timeout={600 + index * 200}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Chip
                    label={`v${release.version}`}
                    sx={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      backgroundColor: index === 0 ? 'primary.main' : 'action.selected',
                      color: index === 0 ? '#fff' : 'text.primary',
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {release.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(release.date + 'T00:00:00').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1}>
                  {release.changes.map((change, i) => {
                    const config = changeTypeConfig[change.type];
                    return (
                      <Stack key={i} direction="row" alignItems="flex-start" spacing={1.5}>
                        <Chip
                          icon={config.icon}
                          label={config.label}
                          size="small"
                          sx={{
                            backgroundColor: config.color,
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            minWidth: 90,
                            '& .MuiChip-icon': { color: '#fff' },
                          }}
                        />
                        <Typography variant="body2" sx={{ pt: 0.3 }}>
                          {change.text}
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grow>
        ))}
      </Stack>
    </PageContainer>
  );
}
