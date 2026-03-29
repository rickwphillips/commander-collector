---
id: p182
name: Ravenous — Enter with X Counters, Draw if X >= 5
category: replacement
cr_refs: [702.156a]
tags: [ravenous, X-cost, +1/+1, enters-with, draw, five-or-more, Dominaria-United, Phyrexian-Rager]
created: 2026-03-28
examples_count: 2
---

# P182 — Ravenous — Enter with X Counters, Draw if X >= 5

## Abstract
Ravenous is found on creatures with {X} in their mana cost. It represents a replacement effect (enters with X +1/+1 counters) and a triggered ability (if X was 5 or more, draw a card). Ravenous makes the creature scale with mana investment: spend more mana, get a larger creature. The draw trigger at X=5 or more incentivizes spending at least 5 mana on X, making ravenous creatures efficient if cast for maximum value. Multiple Doubling Season/Hardened Scales interactions apply to the counters placed.

## The Definitive Rules

**CR 702.156a** (verbatim): *"Ravenous is a keyword found on some creature cards with {X} in their mana cost. Ravenous represents both a replacement effect and a triggered ability. 'Ravenous' means 'This permanent enters with X +1/+1 counters on it' and 'When this permanent enters, if X is 5 or more, draw a card.' See rule 107.3m."*

## The Pattern

```
RAVENOUS:
  Replacement effect: enters with X +1/+1 counters (instead of no counters)
  Triggered: if X was 5 or more when cast, draw a card when it enters

  RAVENOUS + X VALUE:
    X is chosen when casting (part of the total cost)
    The X value is locked in for the ravenous replacement
    Ravenous uses the X from the casting, not from any other calculation

  RAVENOUS + DRAW THRESHOLD:
    X ≥ 5: draw a card trigger fires
    X = 4: four +1/+1 counters, no draw
    X = 5: five +1/+1 counters + draw a card
    X = 10: ten +1/+1 counters + draw a card
    The draw only triggers ONCE regardless of X value (X of 5 or X of 20: same one draw)

  RAVENOUS + DOUBLING SEASON:
    Doubling Season: "if a counter would be placed on a permanent you control, place twice as many"
    Ravenous enters with X counters → Doubling Season → 2X counters
    Very powerful: X = 5 → 10 +1/+1 counters + draw

  RAVENOUS + HARDENED SCALES:
    Hardened Scales: "+1 more counter whenever a counter is placed on a creature you control"
    Ravenous enters with X counters → Hardened Scales adds 1 per PLACEMENT EVENT
    Wait: does placing X counters simultaneously = one event or X events?
    Replacement effects on entering: "enters with X counters" is one replacement effect
    Hardened Scales says "whenever one or more +1/+1 counters would be placed"
    One "placing" event: X+1 counters total (Hardened Scales adds 1 to the event, not to each counter)
    Result: X+1 counters instead of X counters

  RAVENOUS + CAST WITHOUT MANA COST:
    If cast "without paying its mana cost" (via cascade, etc.): X = 0
    Ravenous: enters with 0 counters (effectively no bonus), no draw (X = 0 < 5)
    Ravenous is intended to be paid for normally

  RAVENOUS + COPY:
    If you copy a Ravenous spell on the stack: the copy uses the same X value
    The copy also enters with X counters and triggers the draw if X ≥ 5
```

## Definitive Conclusions

- **Ravenous enters with X +1/+1 counters** equal to the chosen X.
- **If X ≥ 5, draw a card** when it enters.
- **One draw trigger regardless of X** — X = 5 or X = 20 both draw exactly one card.
- **Doubling Season doubles the counter count** (entering with 2X counters).
- **Cast without paying mana (X = 0)**: no counters, no draw.

## Canonical Example
**Phyrexian Gargantua-style with Ravenous (hypothetical):**
Pay {5} for X = 5: 5 +1/+1 counters + draw a card when it enters.
A 5/5 creature (assuming 0/0 base) + card draw for 5 mana.
Or with Doubling Season: pay {3} for X = 3 → 6 counters → 6/6 (would be a 3/3 without Doubling Season).
The economics: Ravenous creatures are usually 0/0 base, so all their P/T comes from the counters.

**Example 2 — Voracious Hydra (Ravenous, {X}{G}{G}):**
Pay X = 5, total cost {5}{G}{G} = 7 mana → enters as 5/5 + draw a card.
Also: "When Voracious Hydra enters, choose one — Voracious Hydra fights target creature you don't control, OR double the number of +1/+1 counters on Voracious Hydra."
Double mode with Ravenous: 5 counters → double → 10 counters → 10/10.
Ravenous + doubling mode = enormous 10/10 for 7 mana + card draw.

## Commonly Confused With
- **P182 vs Bloodthirst (P118)** — Bloodthirst enters with counters based on damage dealt. Ravenous enters with counters based on X paid.
- **P182 vs Modular (P115)** — Modular enters with N counters (fixed) and transfers on death. Ravenous enters with X counters (variable).
- **P115 (Sunburst)** — Sunburst enters with one counter per color spent. Ravenous enters with X counters.
