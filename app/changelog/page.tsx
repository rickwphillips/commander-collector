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
    version: '1.17.3',
    date: '2026-03-25T00:00:00',
    title: 'Fix remote panel overwriting host state on any action',
    changes: [
      { type: 'fixed', text: 'All remote panel actions (life changes, poison, commander damage, Pass Turn, and more) now fetch the current game state from the database before writing — preventing any remote tap from overwriting the host\'s most recent turn or state changes' },
    ],
  },
  {
    version: '1.17.2',
    date: '2026-03-24T00:00:00',
    title: 'Fix remote heartbeat overwriting host turn in DB',
    changes: [
      { type: 'fixed', text: 'Remote panel heartbeat now reads the current game state from the database before writing the check-in timestamp, preventing stale local state from overwriting the host\'s most recent turn change' },
    ],
  },
  {
    version: '1.17.1',
    date: '2026-03-24T00:00:00',
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
