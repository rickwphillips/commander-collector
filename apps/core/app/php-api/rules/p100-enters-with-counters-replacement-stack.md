---
id: p100
name: Enters-With-Counters Replacement Stack — Multiple Modifiers
category: replacement
cr_refs: [614.12, 614.12a, 614.15]
tags: [enters-with-counters, replacement, doubling-season, vorinclex, hardened-scales, multiple-replacements, order]
created: 2026-03-28
examples_count: 2
---

# P100 — Enters-With-Counters Replacement Stack — Multiple Modifiers

## Abstract
When a permanent would enter with counters, multiple replacement effects can modify how many counters it enters with. The order these replacements apply matters enormously. The affected player (or the permanent's controller) chooses the order when multiple replacements apply. Doubling Season, Vorinclex, Hardened Scales, and "enters with N counters" are all replacement effects that modify the same event. Understanding the application order reveals how stacking these effects creates multiplicative counter counts.

## The Definitive Rule

**CR 614.12** (key rule): *"Some replacement effects modify how a permanent enters the battlefield... If two or more replacement effects would modify how a permanent enters the battlefield, the player who is not the controller of the permanent in question, then in APNAP order... apply the replacement effects in whichever order the controller chooses."*

**CR 614.12a**: The permanent's controller chooses the order in which replacement effects modify the entering event.

**CR 614.15**: Self-replacement effects (on the permanent itself) apply before others.

## The Pattern

```
ENTERS-WITH-COUNTERS REPLACEMENTS:
  Common modifiers:
  1. Hardened Scales: "if one or more +1/+1 counters would be placed, place one more"
     → ADDS one counter before doubling (or after, depending on order chosen)
  2. Doubling Season: "if one or more counters would be placed, double them"
     → DOUBLES the total
  3. Vorinclex, Monstrous Raider: "if counters would be placed on a permanent you control,
     double them"
     → DOUBLES the total
  4. The permanent's "enters with N counters" ability (self-replacement)
     → This is the BASE event: "enters with N counters"

SELF-REPLACEMENT APPLIES FIRST (CR 614.15):
  "Enters with N counters" is a self-replacement effect
  It applies before external effects
  The base is "enters with N counters"

ORDER CHOICE:
  Controller chooses remaining replacement order
  MAXIMIZE counters order:
    1. Apply Hardened Scales (+1 counter) first → N+1 counters
    2. Apply Doubling Season (×2) next → (N+1)×2 counters
  ALTERNATE order:
    1. Apply Doubling Season (×2) → N×2 counters
    2. Apply Hardened Scales (+1) → N×2+1 counters

EXAMPLE WITH SPECIFIC NUMBERS:
  Permanent "enters with 2 counters" + Hardened Scales + Doubling Season

  Order A (maximize): Hardened Scales first, then Doubling:
    Start: 2 counters (base)
    Hardened Scales: 2 + 1 = 3
    Doubling Season: 3 × 2 = 6 counters

  Order B: Doubling first, then Hardened Scales:
    Start: 2 counters
    Doubling Season: 2 × 2 = 4
    Hardened Scales: 4 + 1 = 5 counters

  Order A (6) > Order B (5): choose Order A to maximize

VORINCLEX + DOUBLING SEASON:
  "Enters with 2 counters" + Vorinclex + Doubling Season
  Both double, applied in any order:
    Order A: Doubling (×2 = 4), Vorinclex (×2 = 8): 8 counters
    Order B: Vorinclex (×2 = 4), Doubling (×2 = 8): 8 counters
    Same result (multiplication is commutative)

  Add Hardened Scales: choose Hardened Scales LAST for max effect
    2 → ×2 (Doubling) → 4 → ×2 (Vorinclex) → 8 → +1 (HS) → 9
```

## Definitive Conclusions

- **Self-replacement effects ("enters with N counters") apply before external replacements.**
- **The controller chooses the order of remaining replacements.** Maximize by applying additive effects first, then multiplicative.
- **Hardened Scales + Doubling Season:** applying Hardened Scales first (then Doubling) yields more counters.
- **Multiple Doubling Seasons or Vorinclexes:** each doubles the running total. With two Doubling Seasons: 2 → 4 → 8.

## Canonical Example
**Primordial Hydra (enters with X +1/+1 counters) with Hardened Scales and Doubling Season (X=4):**
Base: 4 counters. Order A (optimal): Hardened Scales (+1) = 5, then Doubling Season (×2) = 10 counters. Order B: Doubling (×2) = 8, Hardened Scales (+1) = 9. Choose Order A for 10 counters.

**Example 2 — Hardened Scales only:**
Any creature entering with 3 +1/+1 counters + Hardened Scales: 3 + 1 = 4 counters. Simple addition. No multiplication.

## Commonly Confused With
- **P025 (Counter Placement — Cost vs. Effect)** — P025 covers cost vs. effect distinction. P100 specifically addresses how multiple replacement effects stack when a permanent enters with counters.
- **P002 (Replacement vs. Trigger)** — These are all replacement effects. The ordering question is specific to "enters the battlefield" replacement effects (CR 614.12).
