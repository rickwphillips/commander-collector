# Native game manager: parity audit against the web game manager

Audited 2026-10-29 against `apps/core/app/game-manager/**` (12.7k lines). The
native app (`apps/ios/`) was a first playable; this is every behaviour the web
board has that the iPad does not, grouped by surface. Items are ticked as they
land. The rule for the port: every overlay (menus, counters, commander damage,
card previews, kill prompts) renders **inside the seat panel, rotated with that
seat**, never as a system sheet facing one side of the table.

## A. Seat panel (web `PlayerCard`)

- [x] A1 Header bar: commander art thumbnail (tap = full card preview), one tax
      medallion per commander with tax > 0 showing `+2×tax`, XP diamond badge,
      PASS button on the active seat, centred player name over
      `deck · commander / partner`, status icons on the right (crown, castle,
      city skyline) with a dimmed icon when another seat holds the status, `+`
      state-menu trigger.
- [x] A2 Three-column body: commander damage drawer (left, collapsible, rail
      with chevron) · hero life (centre) · counters drawer (right, collapsible;
      collapsed rail shows a mini summary of non-zero counters). The hero life
      grows as drawers close (3 sizes).
- [x] A3 Hero life: colour ramp (`lifeColor`: greener above starting life,
      amber to red below, dark red at 0), `−`/`+` with long-press ±5 and a
      transient "+5"/"−5" tip, tap the number for a focus modal (±1 and ±5 rows).
- [x] A4 Counters column: Commander Tax (second row for a partner), Energy,
      Experience, Poison; each a stepper with glyph (tax medallion, {E} symbol,
      commander emblem, Phyrexian symbol), long-press ±5, tap value for focus
      modal; poison reads `n/10` (or /15 in 2HG), other rows reserve the same
      width; colours: poison green / red at lethal, energy cyan, XP gold.
      **Poison is a counter here, not a second hero number.**
- [x] A5 Commander damage column: one row per opponent: name (toggle shows
      CMD or player name, persisted), `⚔n` damage you dealt them, status badge
      row (crown/city/castle, ♥life, tax, poison, energy, XP; zero values
      hidden), inline `− n/21 +` stepper, second row for a partner, active-turn
      dot, strike-through when eliminated, ⚠ in the title at 21+, tap the name
      for the commander snapshot overlay (art backdrop, life, counters,
      "CMD dealt" list, each row tappable to hop to that seat's snapshot).
      Threat vignette: the most threatening commander's art fades in behind
      the column plus an inset red glow as damage climbs from 7 to 21.
- [x] A6 State menu overlay (`+`): Monarch / Initiative / City's Blessing rows
      with ⓘ reminder text and an active dot; Concede → "Are you sure" with
      Turn # input and a rotated CONCEDE? stamp; Undo Concede when eliminated.
- [x] A7 Reminder text: tapping a status icon in the header shows its rules
      text in-panel (web: tooltip); long-pressing toggles the status.
- [x] A8 Faded commander backdrop (art at 12 % opacity, or the commander name
      diagonally at 16 % when there is no art). Staggered reveal in turn order
      when a first player is freshly rolled (900 ms per seat, 800 ms fade,
      warm flash at the end); all at once on resume; active-turn highlight held
      off until the reveal finishes.
- [x] A9 Card previews: tap any commander art or name → full card image
      overlay in the panel, tap to zoom 2.5× and scroll.
- [x] A10 Side panels: the web gives the left/right seats the full table
      height and `clamp(160px, 21vw, 300px)` of width; top/bottom seats share
      only the centre column. The native layout squeezed the sides between the
      end panels. Match the web grid.

## B. Status effects and animations (all per seat, in panel)

- [x] B1 Damage flash: red glow on the life number for 0.6 s, red claw
      swipes (2 slashes; 5 when ≥5 life lost in one hit).
- [x] B2 Life cracks: five layered crack drawings over the life area whose
      opacity rises with the share of starting life lost (20/35/50/70/85 %).
- [x] B3 Energy > 5: blue pulse + jitter on the life number, cyan glow on all
      panel text scaling to 8 energy.
- [~] B4 Poison: green wash, drips from top and bottom edges scaling with
      progress to lethal, rising bubbles from 5, boiling bubbles at 9+, large
      Phyrexian symbols at the edges growing with progress, three drifting
      symbols at 9+, panel saturation, counter blur, poison pulse at 9, life
      number "boil" from 8. Sound: drone from 7, bubbles from 8, violin stabs
      at 9 (sound toggle).
- [x] B5 Monarch: large crown over the top-left of the life number with
      shimmer; slides in from above on gain (longer and delayed on a transfer
      between seats), slides out on loss; header crown shimmers.
- [x] B6 Initiative: dungeon wall texture + drifting, flickering torch with
      a flame that wobbles; 3 s fade in.
- [x] B7 City's Blessing: god rays, castle sliding in from the left, cathedral
      from the right, skyline, hills, fireworks, drifting clouds, marching
      flags; intro sting mp3 then a firework loop; 3.8 s exit tail.
- [x] B8 XP badge: gold diamond with the XP number, ember particles, rune
      glow, shimmer sweep, level-up flash + ripple on each increment.
- [x] B9 Eliminated: panel at 50 % opacity, rotated ELIMINATED / CONCEDED /
      POISONED stamp (gold with falling tears for a concede, green outlined
      for poison).
- [x] B10 Glass backing behind every control cluster while a busy animation
      (blessing, initiative, poison ≥ 60 %) is active.
- [x] B11 Threat names: five faint italic copies of the most threatening
      commander's name pulsing over the life area as damage approaches 21.
- [x] B12 Timer tokens: the active seat's border and shadow run green → amber
      → red with the turn timer and blink red when expired; "highlight mode"
      moves that colour to a header gradient instead of the border.
- [x] B13 Kill prompts as in-panel overlays: dark "Who brought X to 0?" and
      green "Who poisoned X?" with one button per living opponent and Skip.

## C. Centre zone (web `CenterZone`)

- [x] C1 Turn tracker mirrored for both long sides (Turn N / commander /
      player), big Next Turn (long-press = previous turn with a tip), pulse
      when ≤30 s remain, faster at ≤20 and ≤10.
- [x] C2 Roll for first player: every seat rolls a d20 with a spinning-die
      reveal staggered 230 ms, ties re-roll among the tied, house rules
      (Aces High, Eleven Beats Aces, No Loners, Adam's House Rules), result
      "X goes first" with Accept / Roll Again; Pick overlay grid; 2HG team roll.
- [x] C3 Dice & More: dice count 1 to 20, d6 / d20 / coin with spinning icons,
      staggered reveal, totals, history with Clear, last roll shown on its
      button, d6 and d20 sounds. Rolls logged as `die_roll`.
- [x] C4 Settings overlay: Timer / Highlight / Sound / Dark toggles synced to
      the server's game-settings, Notes, Game Log, Restart (confirm), End Game
      (confirm).
- [x] C5 Game log viewer formatted like the web's `GameLogList`; Notes editor.
- [x] C6 Winner banner along the bottom edge: "🏆 X wins — saving in 15s",
      Save Now, bounded retry on failure.
- [ ] C7 Rules Guru chat + quick rules lookup (web iframe today; WKWebView or
      Phase 2).

## D. Flow (setup, seating, end)

- [x] D1 Setup: 2/3/4 toggle, life presets 20/30/40 + custom, timer seconds,
      game type, **Random** fill (unique player, one of their decks per seat).
- [x] D2 Seating: dashed seat cards with position label / Tap to choose,
      "Seats filled n/m", Cancel / Start Game. Seat picker: deck-first
      selection (owner's decks grouped first), player, commander with
      Scryfall autocomplete and art preview, partner checkbox.
- [x] D3 **Create a deck** from the seat picker (name, commander search,
      partner, owner) posting to the web app, with offline queueing.
- [x] D4 Rematch / Restart: restart keeps the same seats and returns to setup;
      rematch of the last saved game pre-fills the seats.
- [x] D5 End summary: per player card with art, final life, poison, commander
      damage taken, place and eliminated turn; Log Game / New Game / Discard.
- [x] D6 Two-Headed Giant team panels (shared life/poison, team names, both
      pilots' counters, opposing team's commander damage) along the top and
      bottom edges. The iPad shows four single-seat panels today.
- [ ] D7 Remote seats: QR / seat code per seat and the "being viewed" eye
      (Phase 2, Multipeer).

Legend: [x] landed, [~] landed without the violin stabs (poison 9+ sound) yet.

## Order of work

1. A10, A1 to A9, B13 (panel rebuild with in-panel overlays and card art).
2. B1 to B12 (status effects, sounds).
3. C1 to C6 (centre zone, settings sync, roll-off, dice).
4. D1 to D5 (setup, random, deck creation, rematch, end summary).
5. D6 (2HG team panels), then C7 and D7.
