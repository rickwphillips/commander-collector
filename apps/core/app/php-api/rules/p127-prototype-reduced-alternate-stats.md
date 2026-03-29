---
id: p127
name: Prototype — Reduced Cost with Alternate Power/Toughness
category: costs
cr_refs: [702.160a, 718.1, 718.2, 718.3]
tags: [prototype, alternative-cost, power, toughness, artifact-creature, smaller-version, copy]
created: 2026-03-28
examples_count: 2
---

# P127 — Prototype — Reduced Cost with Alternate Power/Toughness

## Abstract
Prototype lets you cast an artifact creature for a reduced mana cost — but with different (smaller) power and toughness. The full-cost version enters at full power/toughness; the prototype version enters smaller but cheaper. Crucially, the prototype version is still the same card — same abilities, same card type. The choice is made at cast time. Copies of a prototyped card copy the chosen characteristics (including the smaller P/T). On the battlefield, the card's characteristics are determined by whether it was cast prototyped or not.

## The Definitive Rule

**CR 702.160a** (verbatim): *"Prototype is a static ability that appears on prototype cards that have a secondary set of power, toughness, and mana cost characteristics. A player who casts a spell with prototype can choose to cast that card 'prototyped.' If they do, the alternative set of its power, toughness, and mana cost characteristics are used."*

## The Pattern

```
PROTOTYPE CASTING OPTIONS:
  Option A: Cast at full mana cost → full power/toughness on battlefield
  Option B: Cast prototyped at alternative cost → smaller power/toughness on battlefield
  Choice made at cast time (announcement)

PROTOTYPED CHARACTERISTICS:
  When cast prototyped: the spell has the prototype cost and prototype P/T
  These are copiable values (layer 1 applies)
  The back characteristics (full size): NOT active when cast prototyped

ON THE BATTLEFIELD:
  A prototyped permanent: has the prototype P/T and prototype cost as its characteristics
  A non-prototyped permanent: has the full P/T and full cost

SAME CARD, DIFFERENT STATS:
  Both versions have the same abilities (printed abilities still apply)
  The only difference is P/T and mana cost
  Color: determined by the mana cost used (prototyped → prototype mana cost color)

COPYING A PROTOTYPE SPELL:
  Copy of a prototyped spell: copies the prototype version (smaller P/T and cost)
  Copy of a non-prototyped spell: copies the full version

CLONE EFFECTS:
  A Clone copying a prototyped permanent on the battlefield: copies the prototype version
  A Clone copying a non-prototyped permanent: copies the full version

PROTOTYPE + AFFINITY/COST REDUCTION:
  If you cast prototyped: the prototype cost is the cost before reductions
  Affinity would reduce the prototype mana cost
  (Can't use affinity to reduce the FULL cost while getting prototype P/T)

PROTOTYPE + POWER/TOUGHNESS MATTERS:
  A prototyped creature may have lower power than its full version
  Effects that care about power (mentor, training, modular transfer): use current P/T
```

## Definitive Conclusions

- **Prototype gives a choice: cheap+small or expensive+large.** Same abilities either way.
- **The chosen version's P/T and mana cost are the copiable values.**
- **Copies copy the version that was cast** (prototype or full).
- **Same card type, same abilities, different stats per casting mode.**

## Canonical Example
**Blitz Automaton (Prototype {1}{R}, 2/1 / Full {5}{R}, 5/4, Haste, Can't Block):**
Wait, let me use a real prototype example.
**Phyrexian Fleshgorger (Prototype {1}{B}, 3/3 Menace, Lifelink / Full {7}, 7/5 Menace, Lifelink, Ward — pay life = power):**
Pay {1}{B}: cast prototyped → 3/3 Menace, Lifelink on battlefield.
Pay {7}: cast normally → 7/5 Menace, Lifelink, Ward-life on battlefield.
Both have menace and lifelink. The difference is size and ward availability.

**Example 2 — Prototype + Copy:**
You cast Phyrexian Fleshgorger prototyped ({1}{B}, 3/3).
A Fork copies it on the stack: copy is a 3/3 prototype version.
Both resolve as 3/3 versions.

## Commonly Confused With
- **P098 (Double-Faced Cards)** — DFCs have two faces but only one is visible at a time; the back face is a different card type sometimes. Prototype cards are single-faced; the choice is at cast time.
- **P099 (Modal Spells)** — Modal spells choose different effects. Prototype chooses different costs/P/T.
- **P041 (Morph)** — Morph also has two versions (face-down 2/2 and face-up real card). Prototype doesn't hide information — the card is played face-up in either version.
