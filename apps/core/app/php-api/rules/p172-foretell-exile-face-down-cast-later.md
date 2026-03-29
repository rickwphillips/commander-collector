---
id: p172
name: Foretell — Exile Face-Down for Reduced Future Cast
category: zones
cr_refs: [702.143a, 702.143b, 702.143c, 702.143d, 702.143e]
tags: [foretell, exile, face-down, alternative-cost, special-action, Kaldheim, Alrund-Epiphany, Doomskar]
created: 2026-03-28
examples_count: 2
---

# P172 — Foretell — Exile Face-Down for Reduced Future Cast

## Abstract
Foretell lets you pay {2} during your turn to exile a card from your hand face-down. On a future turn (after the current turn ends), you may cast the exiled card for its foretell cost rather than its mana cost. Foretell costs are typically cheaper than the regular cost, making high-mana spells accessible if you plan ahead. The card is exiled face-down — opponents don't know what you're foretelling (bluffing potential). The special action (paying {2} to exile) doesn't use the stack. In Kaldheim, foretell represented the Norse oracles seeing the future.

## The Definitive Rules

**CR 702.143a** (verbatim): *"Foretell is a keyword that functions while the card with foretell is in a player's hand. Any time a player has priority during their turn, that player may pay {2} and exile a card with foretell from their hand face down. That player may look at that card as long as it remains in exile. They may cast that card after the current turn has ended by paying any foretell cost it has rather than paying that spell's mana cost. Casting a spell this way follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.143b** (verbatim): *"Exiling a card using its foretell ability is a special action, which doesn't use the stack. See rule 116, 'Special Actions.'"*

## The Pattern

```
FORETELL:
  Special action: pay {2}, exile a foretell card from hand face-down (any time during your turn, any priority)
  After this turn ends: may cast the exiled card for its foretell cost (alternative to mana cost)
  The exiled card is face-down (you can look at it; opponents can't)

  FORETELL + TIMING OF EXILE:
    Must be YOUR turn and you must have priority
    No stack required for the exile (special action, no stack)
    Can exile during combat, end step, etc. — any time on YOUR turn you have priority
    The exile doesn't interfere with anything

  FORETELL + CASTING RESTRICTION:
    "After the current turn has ended" — can't foretell and cast same turn
    Turn 2: pay {2}, exile Alrund's Epiphany face-down
    Turn 3: cast from exile for foretell cost {5}{U}{U} (instead of {7}{U})
    2+5+1+1 = 9 mana total over 2 turns vs 9 mana in 1 turn — similar, but spreads the cost

  FORETELL + DISCOUNT:
    Often: foretell cost + {2} ≈ normal cost (two-turn investment)
    The REAL benefit: spread mana investment, dodge discard, hidden information
    Doomskar (Wrath of God variant): regular {3}{W}{W}, foretell cost {1}{W}{W}
    Pay {2} turn 2 + pay {1}{W}{W} turn 3 = {4} total vs {5} normally → 1 mana saved AND hidden

  FORETELL + HIDDEN INFORMATION:
    Card is exiled face-down — opponents don't know if it's Doomskar, Alrund's Epiphany, or a bad card
    They might not play into a board wipe because of uncertainty
    Strategic bluffing: exile something face-down to represent a threat

  FORETELL + MULTIPLE CARDS:
    CR 702.143e: if multiple foretold cards are in exile, must be able to differentiate them
    You know what each one is (can look at them); opponents don't
    Order must be maintained so you can identify which is which

  FORETELL VS PLOT:
    Plot: exile a card from hand for free, cast for free in a future main phase (stack empty)
    Foretell: exile for {2}, cast for foretell cost in a future main phase (any priority, but usually main phase)
    Plot: free cast; foretell: reduced cost cast
    Plot requires stack empty to exile; foretell can exile any time you have priority

  FORETELL + DISCARD PROTECTION:
    Cards in exile can't be discarded
    If your hand would be discarded (Liliana): foretell cards are safe in exile
    Strategic: foretell your best card before opponent casts Thoughtseize

  FORETELL CARDS:
    Alrund's Epiphany ({6}{U}{U} → foretell {5}{U}{U}): extra turn, create 2 Bird tokens
    Doomskar ({3}{W}{W} → foretell {1}{W}{W}): destroy all creatures
    Saw It Coming ({2}{U} → foretell {1}{U}): counter target spell
    Behold the Multiverse ({3}{U} → foretell {1}{U}): scry 2, draw 2
```

## Definitive Conclusions

- **Foretell exiles face-down for {2}** — a special action during your turn.
- **Cast for reduced foretell cost on a FUTURE turn** (not the same turn).
- **Card is hidden from opponents** — enables bluffing and discard protection.
- **Different from plot** — foretell costs {2} to exile and foretell cost to cast; plot is free exile and free cast.
- **Saw It Coming** is notable: foretell a counterspell to cast cheaply next turn.

## Canonical Example
**Doomskar (Foretell {1}{W}{W}, normal {3}{W}{W}):**
Turn 2: pay {2}, exile Doomskar face-down. You have "something" in exile.
Turn 3: opponent builds a threatening board. Opponents hesitate to overcommit (foretell bluff).
Turn 4: your main phase. Pay {1}{W}{W} (foretell cost) → Doomskar casts for 3 mana instead of 5.
Destroy all creatures. Board wiped for 5 total mana spread across two turns ({2} + {1}{W}{W}) instead of {3}{W}{W} in one turn.
Hidden information made the opponent play cautiously OR overcommit into the wipe.

**Example 2 — Alrund's Epiphany:**
Turn 2: foretell for {2} → 7-mana extra turn spell now costs {5}{U}{U} next turn.
Turn 4: pay {5}{U}{U} → Alrund's Epiphany → create two 1/1 Bird tokens with flying, take an extra turn.
Standard: this enabled easy extra-turn chains in the Kaldheim standard season.

## Commonly Confused With
- **P128 (Plot)** — Plot exiles from hand for free and casts for free later. Foretell costs {2} to exile and foretell cost to cast (cheaper, not free).
- **P164 (Rebound)** — Rebound exiles AFTER casting and re-casts at next upkeep. Foretell exiles BEFORE first cast.
- **P146 (Suspend)** — Suspend exiles with time counters and eventual free cast. Foretell has no countdown; cast whenever after the same turn.
