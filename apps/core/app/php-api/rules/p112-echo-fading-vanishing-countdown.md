---
id: p112
name: Echo, Fading, and Vanishing — Countdown Sacrifice Mechanics
category: triggered
cr_refs: [702.30a, 702.32a, 702.63a, 702.63b, 702.63c]
tags: [echo, fading, vanishing, upkeep, sacrifice, time-counter, fade-counter, countdown, proliferate]
created: 2026-03-28
examples_count: 2
---

# P112 — Echo, Fading, and Vanishing — Countdown Sacrifice Mechanics

## Abstract
Three mechanics share the structure of a countdown that leads to sacrifice: Echo triggers once to demand a payment (or sacrifice); Fading removes one fade counter per upkeep and sacrifices when none remain; Vanishing similarly ticks down time counters and sacrifices when the last is removed. All three result in the permanent leaving if not managed. Key differences: Echo is a one-time triggered payment, while Fading and Vanishing are ongoing tick-down SBA/trigger chains. Proliferate can extend Fading and Vanishing permanents by adding counters.

## The Definitive Rule

**CR 702.30a** (verbatim): *"Echo is a triggered ability. 'Echo [cost]' means 'At the beginning of your upkeep, if this permanent came under your control since the beginning of your last upkeep, sacrifice it unless you pay [cost].'"*

**CR 702.32a** (verbatim): *"'Fading N' means 'This permanent enters with N fade counters on it' and 'At the beginning of your upkeep, remove a fade counter from this permanent. If you can't, sacrifice the permanent.'"*

**CR 702.63a** (verbatim): *"'Vanishing N' means 'This permanent enters with N time counters on it,' 'At the beginning of your upkeep, if this permanent has a time counter on it, remove a time counter from it,' and 'When the last time counter is removed from this permanent, sacrifice it.'"*

## The Pattern

```
ECHO:
  Triggers: At beginning of YOUR upkeep
  Condition: if this came under your control since your LAST upkeep
  (Effectively: "your first upkeep after you gained control of it")
  Effect: pay echo cost OR sacrifice the permanent
  One-time: only triggers once (the first upkeep after gaining control)

  Stealing + echo: if you steal a creature with echo, YOU must pay the echo cost
    (or sacrifice the stolen creature) on your next upkeep
  Bouncing + recasting: new object, echo triggers again on next upkeep

FADING:
  Enters with N fade counters (static "as enters" ability)
  Each upkeep: remove one fade counter
  If no fade counter to remove: sacrifice the permanent
  Counter management: can proliferate to add fade counters (extend lifetime)
  Counter removal: removing counters faster (e.g., Clockspinning) shortens life
  N fade counters = N upkeeps before it dies (starting with first upkeep being removal)

VANISHING:
  Enters with N time counters
  Each upkeep: if it has time counters, remove one
  When LAST counter is removed: sacrifice it (this is a triggered ability, not SBA)
    → There is a trigger window — opponent can respond (but the sacrifice is mandatory)
  Proliferate: add time counters to extend its life
  Vanishing without a number: starts with 0 time counters → sacrificed at first upkeep? No:
    "At the beginning of your upkeep, if this permanent has a time counter on it, remove one"
    → If no counters: trigger doesn't remove (nothing to remove), no sacrifice from the removal
    → BUT "when last counter is removed" needs a counter to have been removed... tricky edge

FADING vs VANISHING:
  Fading: sacrifice when you CAN'T remove (no counters) — sacrifice is part of the removal ability
  Vanishing: sacrifice is a SEPARATE trigger that fires when last counter is removed
  → Stifle can counter the vanishing sacrifice trigger; fading sacrifice is part of the upkeep ability

EXTEND OR SHORTEN LIFETIME:
  Proliferate can add counters to both fading and vanishing permanents
  Doubling Season: entering with double counters doubles the lifetime
  Clockspinning / Hex Parasite: remove counters faster
```

## Definitive Conclusions

- **Echo triggers once** — your first upkeep after gaining control. Pay or sacrifice.
- **Fading removes one counter per upkeep; when none remain, sacrifice** — part of the same ability.
- **Vanishing removes one counter per upkeep; the LAST removal triggers a sacrifice** — separate trigger, can be Stifled.
- **Proliferate extends Fading/Vanishing lifetime** by adding the relevant counter type.
- **Stealing a creature with Echo**: you pay the cost on your next upkeep.

## Canonical Example
**Blastoderm (Fading 3):**
Enters with 3 fade counters. Upkeep 1: 2 counters. Upkeep 2: 1 counter. Upkeep 3: 0 counters.
At upkeep 3, the ability tries to remove a counter but can't → sacrifice Blastoderm.

**Example 2 — Vanishing + Stifle:**
Teferi's Drake (Vanishing 2) has 1 time counter. Your upkeep: remove the last counter. The "when last time counter is removed, sacrifice it" trigger goes on the stack. Opponent Stifles it. Teferi's Drake survives (with no time counters). But next upkeep: the removal trigger checks "if it has a time counter" → no counter → trigger doesn't fire. The sacrifice trigger can only fire when the last is removed — and you can't remove what's not there. Drake survives indefinitely (until killed another way).

## Commonly Confused With
- **P081 (Suspend)** — Suspend also uses time counters and each upkeep removes one; but suspend's trigger is a cast (from exile), not a sacrifice.
- **P054 (Proliferate)** — Proliferate can add fade or time counters to extend fading/vanishing permanents.
- **P097 (Saga)** — Sagas use lore counters that increase (not decrease) each upkeep, triggering chapter abilities.
