---
id: p086
name: Devour — Sacrifice-on-Entry Counter Scaling
category: replacement
cr_refs: [702.82a, 702.82b, 702.82c]
tags: [devour, sacrifice, enter, counter, optional, scaling, token-synergy, as-enters]
created: 2026-03-28
examples_count: 2
---

# P086 — Devour — Sacrifice-on-Entry Counter Scaling

## Abstract
Devour is an "as this enters" static ability that lets you sacrifice any number of creatures as the permanent enters the battlefield. For each sacrificed creature, the devour permanent enters with N additional +1/+1 counters (where N is the devour number). Sacrifice is optional — you can sacrifice zero creatures. The sacrifices are made simultaneously as part of the "as enters" process. Devour [quality] restricts what types of creatures can be sacrificed.

## The Definitive Rule

**CR 702.82a** (verbatim): *"Devour is a static ability. 'Devour N' means 'As this object enters, you may sacrifice any number of creatures. This permanent enters with N +1/+1 counters on it for each creature sacrificed this way.'"*

**CR 702.82b** (verbatim): *"Some objects have abilities that refer to the number of creatures the permanent devoured. 'It devoured' means 'sacrificed as a result of its devour ability as it entered the battlefield.'"*

## The Pattern

```
DEVOUR AS-ENTERS:
  "As this object enters" = replacement effect (modifies how the permanent enters)
  Not a triggered ability (Torpor Orb doesn't affect devour)
  When the devour permanent enters:
    → You MAY sacrifice any number of qualifying creatures
    → For each sacrificed: the permanent enters with N more +1/+1 counters
    → No sacrifice: permanent enters with no counters from devour

COUNTER CALCULATION:
  Devour 2 + sacrifice 3 creatures = 6 +1/+1 counters (3 × 2)
  Devour 1 + sacrifice 5 creatures = 5 +1/+1 counters (5 × 1)
  Counters are placed as the permanent enters (simultaneously)

DOUBLING SEASON INTERACTION:
  Devour counters are placed "as this enters" → they're placement effects
  Doubling Season: doubles counters placed on permanents you control
  → Devour 1 sacrifice 3 + Doubling Season = 6 counters (3 doubled)

TOKEN SYNERGY:
  Devour works well with token generators
  Sacrifice tokens to scale up the devour permanent's power
  Tokens have CMC 0 but sacrifice counts regardless of CMC

WHICH CREATURES CAN BE SACRIFICED?
  Default: any creatures you control
  Devour [quality] (CR 702.82c): only [quality] permanents
  Example: Devour Faeries 2: only sacrifice Faeries

"IT DEVOURED" TRACKING:
  Some cards have abilities that say "if it devoured X creatures, do Y"
  This tracks how many creatures were sacrificed via this specific devour ability
  The count is part of the permanent's state (not a counter)

CAN SACRIFICE THE DEVOUR CREATURE ITSELF?
  "Sacrifice any number of creatures" — the devour creature is not yet on the battlefield
  during the "as enters" replacement effect (it's entering, not in)
  → Cannot sacrifice the devour creature itself
```

## Definitive Conclusions

- **Devour is optional.** Sacrifice zero or as many creatures as desired.
- **Devour is an "as enters" effect (replacement), not a trigger.** Torpor Orb doesn't suppress it.
- **N +1/+1 counters per sacrificed creature.** Scales linearly with sacrificed count.
- **Doubling Season doubles devour counters.**
- **Can't sacrifice the devour creature itself** — it's not on the battlefield yet.

## Canonical Example
**Predator Dragon (Devour 2):**
You control 4 Goblin tokens and cast Predator Dragon. As it enters, sacrifice all 4 Goblins (devour 2). Predator Dragon enters with 8 +1/+1 counters (4 goblins × 2). It's a flying 5/4 normally → now 13/12.

**Example 2 — Devour + Doubling Season:**
Devour 1 permanent, sacrifice 3 creatures, Doubling Season in play. Devour would place 3 counters → Doubling Season doubles → 6 counters.

## Commonly Confused With
- **P023 (Trigger Suppression vs. Replacement)** — Devour is an "as enters" replacement effect. Torpor Orb suppresses triggered ETBs, not replacement effects.
- **P086 and P048 (Emerge)** — Both sacrifice a creature as part of entering/casting. Devour is "as this enters" (optional, scales); Emerge is a cost-reduction alternative cost.
