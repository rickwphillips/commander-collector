---
id: p051
name: Dredge — Draw Replacement and Library Minimum
category: replacement
cr_refs: [702.52a, 702.52b, 614.1]
tags: [dredge, graveyard, draw, replacement, mill, library-minimum, self-mill, dredge-chain]
created: 2026-03-28
examples_count: 2
---

# P051 — Dredge — Draw Replacement and Library Minimum

## Abstract
Dredge is a static ability that functions only while the card is in the graveyard. It offers an optional replacement for any draw: instead of drawing, you may mill N cards and return the dredge card to your hand. Because dredge replaces a draw, it interacts with any effect that triggers on drawing or replaces drawing. You can dredge multiple cards in a turn by chaining draws — each time you would draw, you may choose to dredge instead. Critically, you cannot dredge if your library has fewer cards than the dredge number (even 1 fewer means no dredge).

## The Definitive Rule

**CR 702.52a** (verbatim): *"Dredge is a static ability that functions only while the card with dredge is in a player's graveyard. 'Dredge N' means 'As long as you have at least N cards in your library, if you would draw a card, you may instead mill N cards and return this card from your graveyard to your hand.'"*

**CR 702.52b** (verbatim): *"A player with fewer cards in their library than the number required by a dredge ability can't mill any of them this way."*

## The Pattern

```
DREDGE AS REPLACEMENT:
  Dredge is a replacement effect (614.1)
  "If you would draw a card, you may instead..."
  → Replaces the draw event entirely
  → No card is drawn; N cards are milled; dredge card returns to hand

WHEN CAN YOU DREDGE?
  Any time you would draw a card:
    - Your draw step
    - Cantrip effects ("draw a card")
    - Wheel effects (each draw in a multi-draw)
    - Forced draws (opponent makes you draw)
  You choose: take the draw OR apply dredge

LIBRARY MINIMUM:
  Must have AT LEAST N cards in library
  Fewer than N: cannot dredge (CR 702.52b)
  Exactly N: can dredge (mills exactly N, possibly milling dredge cards)
  Zero library: can never dredge

CHAINING DREDGE:
  Dredge replaces a single draw
  If you mill another dredge card while dredging, it goes to graveyard
  NEXT draw: can dredge the newly-milled dredge card instead
  Allows rapid library self-mill by chaining each draw into a dredge

DREDGE + DRAW REPLACEMENTS:
  Multiple replacement effects can apply to the same draw
  If Notion Thief would redirect your draw AND you have a dredge card:
    → Dredge replaces your draw first (the draw doesn't happen, so nothing to redirect)
    → Or Notion Thief applies first, redirecting the draw to opponent → opponent could dredge
    → Player whose draw it is chooses which replacement applies first
  If you must draw from empty library and dredge card is in graveyard:
    → Dredge requires N cards in library — if < N, can't dredge
    → If exactly 0 cards and dredge N > 0: can't dredge → must draw → dies to SBA

WHAT DREDGE DOESN'T DO:
  Dredge doesn't trigger "draw a card" abilities (the draw was replaced)
  Dredge is not "cast" or "played" — it's a static replacement ability
  The dredge card in hand hasn't been "cast" — it needs to be played normally
```

## Definitive Conclusions

- **Dredge is an optional replacement for drawing.** Choose each time you would draw.
- **Cannot dredge with fewer library cards than the dredge number.** Even 1 card short = no dredge.
- **Dredge doesn't trigger "when you draw a card" abilities.** The draw was replaced, not executed.
- **Chaining dredge is possible.** Each draw in a turn can trigger a new dredge choice if a dredge card is in the graveyard.
- **Dredge cards returned to hand have not been cast.** Still need to be played normally.
- **"Puts a card into your hand" ≠ draw — dredge can't replace it.** Dredge only replaces events that specifically use the word "draw." Effects that put cards into your hand (e.g., tutors, topdeck-to-hand effects) don't trigger dredge. (Gatherer ruling 2024-01-12: "If an effect puts a card into your hand without specifically using the word 'draw,' you're not drawing a card. Dredge can't replace this event.")
- **One draw cannot be replaced by multiple dredge abilities simultaneously.** Even if two dredge cards are in your graveyard, one draw = one dredge choice. (Gatherer ruling 2024-01-12)
- **Dredge resolution is atomic once announced.** Once you announce you're using dredge, no player can take any actions until the dredge card is in your hand and the milled cards are in your graveyard. (Gatherer ruling 2024-01-12)

## Canonical Example
**Golgari Grave-Troll (Dredge 6):**
At your draw step, Grave-Troll is in your graveyard and you have 20 cards in library. You may: (a) draw a card normally, or (b) mill 6 cards and return Grave-Troll to your hand. You choose (b). Mill reveals: Stinkweed Imp (Dredge 5), 3 lands, a spell. Next draw (cantrip): Stinkweed Imp is now in graveyard. You mill 5 and return Stinkweed Imp to hand. Chaining continues through draws.

**Example 2 — Library nearly empty:**
You have 4 cards in library. Golgari Grave-Troll (Dredge 6) is in graveyard. You would draw a card. Dredge 6 requires at least 6 cards in library. You have 4 → cannot dredge. Must draw normally. If library were empty and you had to draw, you would lose to SBA 704.5b regardless.

## Commonly Confused With
- **P012 (Recursive Replacement)** — Dredge replaces a draw but doesn't generate a new draw event recursively.
- **P020 (Replacement Draw Redirection)** — If Notion Thief is in play, the player whose draw it is chooses which replacement (dredge or Thief) applies first, since they both modify the same draw event.
