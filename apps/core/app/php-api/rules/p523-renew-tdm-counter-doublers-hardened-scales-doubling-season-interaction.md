---
id: p523
name: Renew (TDM) + Counter Doublers — Hardened Scales and Doubling Season Interaction
category: cross-mechanic
cr_refs: [702.87, 613.3, 702.25a]
tags: [renew, counter-doubler, hardened-scales, doubling-season, vorinclex, +1/+1-counter, graveyard-activation, tarkir-dragonstorm, TDM, synergy]
created: 2026-03-30
examples_count: 3
---

# P523 — Renew (TDM) + Counter Doublers — Hardened Scales and Doubling Season Interaction

## Abstract
Renew grants +1/+1 counters to a target creature as a graveyard-activated ability. Counter-doubling effects (Doubling Season, Hardened Scales, Vorinclex) interact with Renew's counter placement. **Doubling Season** doubles each +1/+1 counter placed by Renew — if Renew grants 2 counters, Doubling Season produces 4. **Hardened Scales** adds an additional counter: if Renew grants 2 counters, Hardened Scales adds 1, producing 3 total. **Vorinclex** halves counters placed: if Renew grants 3 counters, Vorinclex reduces them to 1 (rounding down). These interactions are pure layer-system applications with no special rules — Renew is an ability that places counters, and counter doublers/modifiers apply to all counters placed.

## The Definitive Rules

**CR 702.87 (Doubling Season):** *"If an effect would put one or more tokens onto the battlefield under your control, put twice that many of those tokens onto the battlefield instead. If an effect would put one or more counters on a permanent you control, put twice that many of those counters on that permanent instead."*

**CR 702.25a (Hardened Scales):** *"If one or more +1/+1 counters would be put on a creature you control, instead put that many plus one +1/+1 counter on that permanent."*

**Vorinclex, Monstrosity (Oracle text):** *"If an effect would put one or more counters on a permanent you control, it puts twice that many of those counters on that permanent instead. If a permanent you control would gain one or more counters, it gains that many more of that type. If an effect would put one or more counters on an opponent or a permanent an opponent controls, it puts half that many of those counters on that player or permanent instead, rounded down."*

**Doubling Season + Hardened Scales stacking:** When both are active, first Doubling Season applies (doubles the count), then Hardened Scales applies (adds 1). If Renew grants 2 counters with both effects in play: 2 → 4 (Doubling Season) → 5 (Hardened Scales).

## The Pattern

```
RENEW COUNTER PLACEMENT — BASELINE:

  Renew grants counters to a TARGET creature.
  Example: "Champion of Dusan: {1}{G}, Exile this card from your graveyard: Put a +1/+1
    counter and a trample counter on target creature."
  That creature receives exactly the counters listed.

WITH COUNTER DOUBLERS:

  DOUBLING SEASON applies to Renew:
    Renew grants N +1/+1 counters → Doubling Season → 2N counters placed instead.
    Example: Champion of Dusan grants 1 +1/+1 counter with Doubling Season out.
      → 2 +1/+1 counters placed on the target.
    Note: Renew also grants a trample counter in this card's example.
      Doubling Season: "put twice that many of those counters"
      → 2 trample counters placed instead of 1? Yes.
      Both counter types are affected.

  HARDENED SCALES applies to Renew:
    Renew grants N +1/+1 counters → Hardened Scales → N+1 counters placed instead.
    Example: Champion of Dusan grants 1 +1/+1 counter with Hardened Scales out.
      → 2 +1/+1 counters placed (1 + 1 from Scales).
    Note: Hardened Scales specifically says "+1/+1 counters" — it does NOT affect the
      trample counter from this card. Only +1/+1 counters get the +1 bonus.

  VORINCLEX applies to Renew:
    Renew grants N +1/+1 counters → Vorinclex → floor(N/2) counters placed instead.
    Example: Champion of Dusan grants 1 +1/+1 counter with Vorinclex out.
      → 0 +1/+1 counters (1/2 = 0 rounded down). The trample counter is halved too.

COMBINATION — DOUBLING SEASON + HARDENED SCALES:

  Both effects apply. Order matters (per layer system).
  Counters are placed via Renew → Doubling Season applies (doubles) → Hardened Scales applies (+1).

  Example: Renew grants 1 +1/+1 counter with both Doubling Season and Hardened Scales out.
    1 counter from Renew
    → 2 counters (Doubling Season effect)
    → 3 counters (Hardened Scales +1)
    Result: 3 +1/+1 counters on the target.

  If Renew grants 3 +1/+1 counters with both out:
    3 → 6 (Doubling Season) → 7 (Hardened Scales).

VORINCLEX OVERRIDES DOUBLERS:

  Vorinclex's halving effect is NOT additive with Doubling Season.
  Vorinclex: "put half that many ... on a permanent an opponent controls"
    "If a permanent you control would gain one or more counters, it gains that many more"
    → Your permanents actually DOUBLE (your half + the extra half).
    → Opponent permanents are halved.

  So if you control both Vorinclex and Doubling Season (you control Vorinclex, opponent's
    creature gets counters from a Renew you're casting):
    Opponent gets half the counters due to Vorinclex's opponent effect.
    Your creature gets doubled due to Vorinclex's personal effect.

RENEW GRANTING MULTIPLE COUNTER TYPES:

  Some Renew cards grant multiple counter types:
    "Put a +1/+1 counter and a trample counter on target creature."

  Doubling Season applies to EACH type separately.
    → 2 +1/+1 counters and 2 trample counters.

  Hardened Scales applies ONLY to +1/+1 counters (by name).
    → If Doubling Season is out first (8 +1/+1, 2 trample), then Hardened Scales:
      9 +1/+1 (8+1) and 2 trample (unchanged).

RENEW GRANTING VARIABLE COUNTERS (LASYD PROWLER):

  Lasyd Prowler ({2}{G}{G}: 5/5):
    "Renew — {1}{G}, Exile: Put X +1/+1 counters on target creature, where X is the
     number of land cards in your graveyard."

  X is determined at the time of activation (Renew activation).
  Doubling Season doubles the result.
    If X = 4 (four lands in your GY): grant 4 counters with Doubling Season out → 8 counters.
  Hardened Scales adds 1 to the total after doubling.
    → 9 counters (8 + 1 from Scales).

RENEW + EQUIPMENT GRANTING +1/+1:

  Renew grants counters to a target creature that might have Equipment.
  Equipment P/T bonuses are separate from counters.
  If Renew grants +1/+1 counters with Doubling Season out, the creature gets:
    - The counters placed (doubled)
    - Plus any Equipment bonus (applied separately via layer 7b and 7c)
    Neither affects the other.

DOES RENEW INTERACT UNUSUALLY WITH HARDENED SCALES?

  No. Hardened Scales is straightforward: +1/+1 counters placed via ANY source (Renew
    included) get +1 additional counter.
  Renew's graveyard activation doesn't bypass Hardened Scales — the counter is placed,
    Scales sees it, Scales adds 1.
```

## Definitive Conclusions

- **Doubling Season doubles each counter type placed by Renew** — if Renew grants 2 +1/+1 counters and a trample counter, Doubling Season produces 4 +1/+1 and 2 trample.
- **Hardened Scales adds 1 to +1/+1 counters only** — it does not affect other counter types granted by Renew; the +1 is added after doubling if both are active.
- **Doubling Season + Hardened Scales stack** — the doubled count receives the Scales +1; 1 counter → 2 (DS) → 3 (Scales).
- **Vorinclex halves counters on opponent permanents, doubles on your own** — if you activate Renew targeting an opponent's creature with Vorinclex in play, they get half counters.
- **Variable-count Renew (Lasyd Prowler) is doubled/scaled per the final count** — X is determined, then doubling/scaling applies to the result.

## Canonical Example

**Renew + Doubling Season:**

You control Doubling Season. You activate Champion of Dusan's Renew: pay {1}{G}, exile Champion from your graveyard. Target is your Grizzly Bears. Champion grants "a +1/+1 counter and a trample counter."

Doubling Season applies: 1 +1/+1 → 2 +1/+1; 1 trample → 2 trample.

Grizzly Bears becomes a 4/4 with trample (base 2/2 + 2 +1/+1 + 2 trample... wait, trample isn't a +/+ counter, it's a keyword counter). Grizzly Bears now has 2 +1/+1 counters and a trample keyword counter. It's a 4/4 with trample.

**Example 2 — Hardened Scales Only:**

You control Hardened Scales. Renew grants 3 +1/+1 counters to a creature.

Hardened Scales applies: 3 → 4 +1/+1 counters on the creature.

**Example 3 — Both Doubling Season and Hardened Scales:**

You control both Doubling Season and Hardened Scales. Renew grants 2 +1/+1 counters to Grizzly Bears.

Doubling Season applies first (timestamp from when it entered): 2 → 4 +1/+1 counters.
Hardened Scales applies next: 4 → 5 +1/+1 counters.

Grizzly Bears is now a 7/7.

## Commonly Confused With
- **P025 (Counter Placement — Cost vs. Effect)** — P025 covers Doubling Season with loyalty counters vs. Doubling Season with spell cost counters. P523 applies those same principles to Renew's counter grants.
- **P518 (Endure)** — Endure chooses between counters and tokens; Doubling Season affects either path. Renew always grants counters (no token option), so Doubling Season always applies.
- **P508 (Sagas — Proliferate)** — P508 covers how proliferate interacts with different countdown mechanics. P523 covers how counter doublers interact with Renew, a different counter-granting source.
