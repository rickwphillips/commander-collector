---
id: p155
name: Unleash and Scavenge — Rakdos and Golgari Counter Mechanics
category: costs
cr_refs: [702.98a, 702.97a]
tags: [unleash, scavenge, +1/+1, cant-block, graveyard-activation, sorcery-speed, Rakdos, Golgari, Dreg-Mangler]
created: 2026-03-28
examples_count: 2
---

# P155 — Unleash and Scavenge — Rakdos and Golgari Counter Mechanics

## Abstract
Two Ravnica mechanics involving +1/+1 counters. **Unleash** lets you choose to have a creature enter with an additional +1/+1 counter — but if it has any +1/+1 counter, it can't block. You must choose power vs. defensive ability. **Scavenge** is an activated graveyard ability: pay a cost, exile the card from your graveyard, put a number of +1/+1 counters equal to the scavenge creature's power on target creature. It can only be activated at sorcery speed. Together they represent Ravnica's Rakdos (attack at all costs) and Golgari (death is a resource) philosophies.

## The Definitive Rules

**CR 702.98a** (verbatim): *"Unleash is a keyword that represents two static abilities. 'Unleash' means 'You may have this permanent enter with an additional +1/+1 counter on it' and 'This permanent can't block as long as it has a +1/+1 counter on it.'"*

**CR 702.97a** (verbatim): *"Scavenge is an activated ability that functions only while the card with scavenge is in a graveyard. 'Scavenge [cost]' means '[Cost], Exile this card from your graveyard: Put a number of +1/+1 counters equal to the power of the card you exiled on target creature. Activate only as a sorcery.'"*

## The Pattern

```
UNLEASH:
  Two static abilities:
    1. Optional: may enter with one additional +1/+1 counter
    2. Restriction: can't block while it has ANY +1/+1 counter

  UNLEASH CHOICE:
    Made as the creature enters (ETB replacement effect)
    Choose: enter smaller (can block) OR enter bigger (can't block)
    The Rakdos philosophy: sacrifice defense for offense

  UNLEASH + COUNTER REMOVAL:
    If the +1/+1 counter is removed: the creature CAN block again
    Removing the counter lifts the "can't block" restriction
    Contagion Clasp (-1/-1 counter on a 2/2 unleashed): +1 and -1 cancel → 1/1 with no counter → can block

  UNLEASH + OTHER COUNTER SOURCES:
    If an unleashed creature (with no unleash counter) gains a counter FROM ANOTHER SOURCE:
    The unleash restriction checks "as long as it has a +1/+1 counter" — from ANY source
    Proliferate giving it a counter → it now "has a +1/+1 counter" → can't block
    The restriction is purely state-based: has a counter → can't block

  UNLEASH + VIGILANCE:
    Vigilance doesn't affect blocking; it affects attacking (doesn't tap)
    An unleashed creature with vigilance: still can't block while it has a counter

SCAVENGE:
  Activated graveyard ability: [cost], exile this from graveyard → put N counters on target creature
  N = the power of the SCAVENGED card (the one being exiled from graveyard)
  Sorcery speed only: main phase, stack empty
  Target: any creature (yours or opponent's — but "target creature" without restriction)
    Wait: actually "target creature" — must be on battlefield
    You can target opponents' creatures too! (Unusual, but legal)
    Typically you target your own creatures

  SCAVENGE POWER CALCULATION:
    The power used is the scavenged card's power IN THE GRAVEYARD (last known information)
    If the card had P/T modification effects while on battlefield: those may not apply in graveyard
    In graveyard: printed power (unless modified by static abilities in the graveyard)
    Dreg Mangler (3/3, Scavenge {5}{B}{G}): exile from graveyard → 3 counters

  SCAVENGE + HASTE:
    Scavenge ability: activated at sorcery speed (no haste bypasses this)
    Must be in your main phase, stack empty

  SCAVENGE + COST REDUCTION:
    Scavenge cost can be reduced by cost-reduction effects
    Typically expensive: Dreg Mangler costs {5}{B}{G} to scavenge
    High cost limits repeated use

SYNERGY:
  Unleash + Scavenge: play aggressively (unleash), creatures die in combat, scavenge the dead ones onto living creatures
  Golgari + Rakdos crossover: Junk/Midrange strategies in Standard used this heavily
```

## Definitive Conclusions

- **Unleash enters with a counter (bigger) but can't block** — strategic tradeoff of power vs. defense.
- **ANY +1/+1 counter prevents blocking** — not just the unleash counter.
- **Removing the unleash counter** re-enables blocking.
- **Scavenge exiles the card from graveyard** and transfers its power as counters to another creature.
- **Scavenge is sorcery speed** — must be main phase with empty stack.

## Canonical Example
**Dreg Mangler (3/3, Haste, Unleash, Scavenge {5}{B}{G}):**
Option A: Unleash → enters as 4/4 with haste, can't block.
Attacks → dies to a 4/4 blocker.
Scavenge: pay {5}{B}{G}, exile Dreg Mangler from graveyard → put 3 (its power) counters on another creature.
Option B: Enter as 3/3, can block, no counters.

**Example 2 — Unleash + Counter Removal:**
Play Goblin Rabblemaster variant with unleash (enters as 3/2 with counter). Can't block.
Opponent casts a -1/-1 counter spell on it (e.g., Contagion Clasp). +1/+1 and -1/-1 counters cancel (SBA) → no counters remain → creature CAN block now (but is 2/1).

## Commonly Confused With
- **P115 (Modular)** — Modular transfers counters on death to artifact creatures. Scavenge transfers counters via an activated ability from the graveyard.
- **P139 (Wither)** — Wither deals damage as -1/-1 counters. Scavenge adds +1/+1 counters. Counter interaction when these overlap.
- **P153 (Evolve)** — Evolve adds counters when bigger creatures enter. Unleash adds a counter at entry but costs blocking.
