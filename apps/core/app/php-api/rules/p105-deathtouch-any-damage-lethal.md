---
id: p105
name: Deathtouch — Any Nonzero Damage Is Lethal
category: combat
cr_refs: [702.2a, 702.2b, 702.2c, 702.2d, 704.5g]
tags: [deathtouch, lethal-damage, SBA, trample, indestructible, regeneration, combat, first-strike]
created: 2026-03-28
examples_count: 2
---

# P105 — Deathtouch — Any Nonzero Damage Is Lethal

## Abstract
Deathtouch is a static ability that makes any nonzero damage dealt by that source "lethal" for state-based action purposes. A creature that has been dealt any damage by a deathtouch source (even 1 damage) is destroyed by SBA 704.5g at the next SBA check. This is not a triggered ability — it modifies the SBA that checks for lethal damage. Key interactions: deathtouch + trample means only 1 damage needs to be assigned to each blocker before routing excess to the player; deathtouch CANNOT kill an indestructible creature (indestructible ignores 704.5g).

## The Definitive Rule

**CR 702.2b** (verbatim): *"A creature with toughness greater than 0 that's been dealt damage by a source with deathtouch since the last time state-based actions were checked is destroyed as a state-based action. See rule 704."*

**CR 702.2c** (verbatim): *"Any nonzero amount of combat damage assigned to a creature by a source with deathtouch is considered to be lethal damage for the purposes of determining if excess damage is being dealt."*

## The Pattern

```
DEATHTOUCH — CORE RULE:
  Any amount of damage ≥ 1 from a deathtouch source:
    SBA 704.5g: creature is destroyed (if not indestructible)
  This is not a triggered ability — the SBA fires on the next check
  The creature isn't destroyed AT THE MOMENT of damage — SBAs fire later

DEATHTOUCH + TRAMPLE (see P001):
  CR 702.2c: deathtouch makes ANY damage "lethal"
  Trample rule: you must assign "lethal" damage to each blocker before excess
  With deathtouch + trample: assign 1 to each blocker → excess tramples through
  Even a 10/10 blocker: assign 1 deathtouch damage (lethal for trample purposes)
    → remaining 9+ damage tramples to defending player

DEATHTOUCH + INDESTRUCTIBLE:
  Indestructible ignores SBA 704.5g (lethal damage → destroyed)
  Deathtouch works by making damage "lethal" → triggers 704.5g
  Indestructible ignores that SBA → creature survives
  Deathtouch CANNOT kill an indestructible creature

DEATHTOUCH + FIRST STRIKE:
  First strike deals damage in first combat damage step
  If a first strike deathtouch creature deals damage in step 1:
    The damaged creature is destroyed by SBAs before step 2
  The deathtouch creature may not even take damage
  (This is why first-strike deathtouch is extremely powerful)

DEATHTOUCH + REGENERATION:
  Regeneration is a destruction-replacement effect
  When 704.5g would destroy the creature: regeneration replaces it
  Regeneration CAN save a creature from deathtouch damage
  The creature is tapped, damage removed, removed from combat

DEATHTOUCH FROM ANY ZONE (702.2d):
  Deathtouch works regardless of what zone the source deals damage from
  A spell in the graveyard with deathtouch that somehow deals damage: still applies
  Last known information used if object changed zones before damage resolves (702.2e)

MULTIPLICITY OF DEATHTOUCH:
  Multiple deathtouch instances are redundant (702.2f) — doesn't make it more deadly
  A creature with 2 instances of deathtouch: still just "any damage is lethal"

DEATHTOUCH + DAMAGE PREVENTION:
  If damage is prevented, the creature wasn't "dealt damage" → deathtouch doesn't trigger
  Protection prevents damage → creature with protection from the source survives
```

## Definitive Conclusions

- **Any nonzero damage from a deathtouch source destroys the damaged creature** (via SBA 704.5g).
- **Deathtouch + trample: assign 1 to each blocker, route the rest to the player.** The 1 is "lethal" for trample assignment purposes.
- **Deathtouch cannot kill an indestructible creature.** Indestructible ignores 704.5g.
- **Regeneration CAN save from deathtouch.** It replaces the destruction.
- **Deathtouch + first strike is extremely powerful:** first strike deals damage, SBAs destroy the blocker before it can deal damage back.
- **Prevented damage ≠ dealt damage.** Prevention stops deathtouch from triggering.

## Canonical Example
**1/1 Deathtouch vs 5/5:**
1/1 deals 1 damage. SBA check: 5/5 was dealt damage by a deathtouch source → 704.5g → destroyed.
The 5/5 is NOT destroyed at the moment of damage — the next SBA check handles it.

**Example 2 — Deathtouch + Trample vs Indestructible Blocker:**
10/10 deathtouch trample attacker blocked by 6/6 indestructible.
Damage assignment: assign 1 to indestructible blocker (lethal for trample). Route 9 to defending player.
SBA: the 6/6 received deathtouch damage → 704.5g would trigger → but indestructible ignores it → blocker survives.
Defending player takes 9 damage.

## Commonly Confused With
- **P001 (Threshold Damage Assignment)** — Full coverage of deathtouch + trample damage assignment math.
- **P104 (Indestructible)** — Indestructible ignores 704.5g, which is exactly what deathtouch triggers.
- **P037 (Infect/Wither)** — Infect damage goes to poison counters/-1/-1 counters, not regular damage. Infect with deathtouch: infect applies to creatures → -1/-1 counters (not regular damage) → but deathtouch still applies because it was "dealt damage" by a deathtouch source.
