---
id: p131
name: Impending — Delayed Creature with Time Counter Countdown
category: continuous
cr_refs: [702.176a]
tags: [impending, time-counter, not-a-creature, countdown, end-step, removal, alternative-cost]
created: 2026-03-28
examples_count: 2
---

# P131 — Impending — Delayed Creature with Time Counter Countdown

## Abstract
Impending lets you cast a creature for a cheaper cost, but it enters with N time counters and IS NOT a creature until all time counters are removed. One counter is removed at each end of your turn. Once all counters are gone, it becomes a creature. While it has time counters, it's NOT a creature — but it is a permanent (usually an artifact, enchantment, etc.). Key interactions: removal that targets "creatures" doesn't affect it while it has time counters; creature-based triggers don't fire until it becomes a creature.

## The Definitive Rule

**CR 702.176a** (verbatim): *"'Impending N—[cost]' means 'You may choose to pay [cost] rather than pay this spell's mana cost,' 'If you chose to pay this permanent's impending cost, it enters with N time counters on it,' 'As long as this permanent's impending cost was paid and it has a time counter on it, it's not a creature,' and 'At the beginning of your end step, if this permanent's impending cost was paid and it has a time counter on it, remove a time counter from it.'"*

## The Pattern

```
IMPENDING — STATES:
  BEFORE (while has time counters + impending cost was paid):
    Not a creature — doesn't trigger "creature enters" effects
    Can't attack, can't block, doesn't count for "creatures you control" effects
    IS a permanent of its other types (artifact? enchantment?)
    Removal that says "destroy target creature" cannot target it
  AFTER (when last time counter removed):
    Becomes a creature again → now targetable by creature removal
    Does NOT trigger ETB (it was already on the battlefield, just wasn't a creature)

TIME COUNTER REMOVAL:
  At the beginning of YOUR end step: remove one time counter
  N counters → N end steps to become a creature
  Proliferate can add time counters back → delay it further
  Vampire Hexmage: "remove all counters from target permanent" → removes all time counters → immediately becomes a creature

IMPENDING + PROLIFERATE:
  Proliferate can ADD time counters to an impending permanent
  This extends how long it's NOT a creature
  Opponent using proliferate: can delay your creature from awakening

IMPENDING + REMOVAL:
  "Destroy target creature": can't target impending permanent (not a creature)
  "Destroy target permanent": CAN target it
  "Exile target creature": can't target it while not a creature
  "Exile target nonland permanent": CAN target it

IMPENDING + ETB TRIGGERS:
  The permanent entered the battlefield as its non-creature form
  When the last time counter is removed and it becomes a creature:
    No ETB trigger fires (it didn't "enter the battlefield" — it was already there)
  Contrast: bounce and replay → that would trigger ETB

CASTING OPTIONS:
  Cast at full cost: enters as a creature immediately (no time counters, no impending restriction)
  Cast at impending cost: enters with N time counters, not a creature until countdown

COUNTING AS A CREATURE:
  While not a creature: doesn't satisfy "creatures you control" counts
  Effects like "number of creatures you control": don't count impending permanents with counters
```

## Definitive Conclusions

- **While impending permanent has time counters, it's NOT a creature.** Can't be targeted by creature-specific removal.
- **Each end step removes one time counter.** After N end steps, it becomes a creature.
- **No ETB trigger fires when it becomes a creature** (it was already on battlefield).
- **Proliferate can delay the countdown by adding time counters.**
- **Cast at full cost → enters as a creature immediately** (impending counters only apply to impending cost cast).

## Canonical Example
**Ghalta and Mavren (Impending 4 — {1}{G}{W}):**
Pay impending cost {1}{G}{W}: enters with 4 time counters. NOT a creature.
Your end steps pass: 3 counters, 2, 1, 0 → last counter removed → becomes a creature.
While counting down: opponents can't Terminate it (needs "creature" target).
They CAN Beast Within it (target permanent, not just creature).

**Example 2 — Vampire Hexmage shortcut:**
Opponent has an impending creature with 3 time counters. You cast Vampire Hexmage.
Vampire Hexmage's activated ability: "Remove all counters from target permanent."
Target the impending permanent → all 3 time counters removed at once → immediately becomes a creature.
Then it can be attacked/blocked/targeted by creature removal.

## Commonly Confused With
- **P081 (Suspend)** — Suspend counts down time counters in exile before casting. Impending is on the battlefield counting down before becoming a creature.
- **P112 (Vanishing)** — Vanishing also removes time counters each upkeep, but sacrifices at zero. Impending becomes a creature at zero.
- **P041 (Morph)** — Morph also delays characteristics (2/2 face-down vs its real form). Both withhold creature identity until conditions met.
