---
id: p128
name: Plot — Special Action Exile for Free Future Cast
category: stack
cr_refs: [702.170a, 702.170b, 702.170c, 702.170d, 702.170e, 702.170f, 116.2]
tags: [plot, special-action, exile, main-phase, stack-empty, free-cast, next-turn, assassins-creed]
created: 2026-03-28
examples_count: 2
---

# P128 — Plot — Special Action Exile for Free Future Cast

## Abstract
Plot is a special action (no stack) that exiles a card from your hand by paying the plot cost during your main phase when the stack is empty. Once plotted, the card can be cast for free from exile during any main phase on a future turn. Plot is similar to Foretell but with key differences: plot requires the stack to be empty (foretell just requires priority), plot casts on any future main phase (foretell also requires the stack to be empty when casting), and plot has no "face down" concealment (the plotted card's identity may be known).

## The Definitive Rule

**CR 702.170a** (verbatim): *"'Plot [cost]' means 'Any time you have priority during your main phase while the stack is empty, you may exile this card from your hand and pay [cost]. It becomes a plotted card.'"*

**CR 702.170d** (verbatim): *"A plotted card's owner may cast it from exile without paying its mana cost during their main phase while the stack is empty during any turn after the turn in which it became plotted."*

## The Pattern

```
PLOT — SPECIAL ACTION:
  Requirement: have priority, in YOUR main phase, stack empty
  Action: exile the card from hand + pay the plot cost
  The card becomes a "plotted card" in exile
  No stack — can't be countered, no response opportunity

PLOTTED CARD — FREE CAST:
  On any FUTURE TURN (not the same turn it was plotted):
  During your main phase, stack empty: cast for free (no mana cost)
  "Without paying its mana cost" → alternate cost (not free-free: still follows casting rules)
  Can still use kicker, pay costs embedded in the spell, etc.

PLOT vs FORETELL (P060):
  Foretell: any time you have priority during YOUR turn (not requiring stack-empty for exiling)
            cast starting NEXT turn
            face down (hidden)
  Plot:     main phase + stack empty when exiling
            cast starting NEXT TURN (same restriction)
            the card is exiled but not necessarily hidden (depends on card)
  Both: free cast on future turns

PLOTTED STATUS:
  "Plotted" is a designation for a card in exile
  Other effects can cause a card to become plotted (702.170c)
  The plotted status enables the free cast

MULTIPLE PLOTTED CARDS:
  Can have multiple cards plotted in exile simultaneously
  Each can be cast on the appropriate turns

FREE CAST RULES:
  "Cast without paying mana cost" → follow alternate cost rules
  If the spell has additional costs (bargain, kicker): can still be paid
  The free cast is the alternate cost, not "all costs are free"

PLOT + X SPELLS:
  X in the mana cost: when cast for free, X = 0 (can't pay X separately unless paying the full cost)
  Generally, spells with X in their cost become X=0 when cast for free
```

## Definitive Conclusions

- **Plot is a main-phase, stack-empty special action** — no stack, no response.
- **Plotted cards are cast for free on any future main phase** (stack empty).
- **NOT the same turn it's plotted** — must wait until the next turn at minimum.
- **"Cast for free" means alternate cost applies** — still pays additional costs if chosen.
- **X spells cast for free have X = 0.**

## Canonical Example
**Ezio Auditore da Firenze + a plotted spell (Assassin's Creed):**
Main phase, stack empty: pay the plot cost on a card → exiled as a plotted card.
Next main phase (or later): cast the plotted card for free from exile.

**Example 2 — Plot vs Foretell:**
Both Foretell and Plot let you pay now, cast for free later.
Key difference: Foretell can be done while holding priority during your turn (doesn't need stack empty for the exile step). Plot requires stack-empty AND main phase for the exile.
Both require stack-empty for casting.

## Commonly Confused With
- **P060 (Foretell)** — Very similar: special action → exile → free future cast. Foretell has less strict exile timing but the card is face-down.
- **P081 (Suspend)** — Suspend also exiles and later casts for free, but via time counters removed during upkeep.
- **P064 (Companion)** — Also involves casting from a non-hand zone; companion starts outside the game.
