---
id: p108
name: Flying and Reach — Evasion and Blocking Rules
category: combat
cr_refs: [702.9a, 702.9b, 702.9c, 702.17a, 702.17b, 702.17c, 509.1]
tags: [flying, reach, evasion, blocking, can-be-blocked, cant-be-blocked, ground-creature]
created: 2026-03-28
examples_count: 2
---

# P108 — Flying and Reach — Evasion and Blocking Rules

## Abstract
Flying is an evasion ability: a creature with flying can only be blocked by creatures with flying or reach. Reach specifically allows non-flying ground creatures to block flying creatures. A creature with flying CAN block any creature regardless of whether that creature has flying. The key asymmetry: flying restricts who can BLOCK a flyer, but not who the flyer can BLOCK. Reach only allows blocking flyers — reach creatures don't gain evasion themselves.

## The Definitive Rule

**CR 702.9b** (verbatim): *"A creature with flying can't be blocked except by creatures with flying and/or reach. A creature with flying can block a creature with or without flying. (See rule 509, 'Declare Blockers Step,' and rule 702.17, 'Reach.')"*

**CR 702.17b** (verbatim): *"A creature with flying can't be blocked except by creatures with flying and/or reach. (See rule 509, 'Declare Blockers Step,' and rule 702.9, 'Flying.')"*

## The Pattern

```
FLYING — BLOCKING RESTRICTION:
  A creature with flying:
    CAN ONLY be blocked by: creatures with flying AND/OR reach
    CAN block: any creature (with or without flying)
  Creature without flying or reach:
    CAN'T block a flying creature
    CAN be blocked by flying creatures

REACH — GROUND-TO-AIR BLOCKING:
  A creature with reach (but not flying):
    CAN block flying creatures
    Is still a "ground" creature itself (doesn't have flying evasion)
    Can be blocked by any creature (ground creatures included)
  Reach only changes the blocking restriction — not the creature's own evasion

LAYERED EVASION:
  Multiple evasion abilities can stack:
  "Flying AND intimidate": can only be blocked by flyers/reach AND artifact/same-color
    → Must satisfy ALL restrictions simultaneously
  "Fear": can only be blocked by artifact creatures and black creatures
    Flying + fear: flyer with fear → must be blocked by flying/reach AND artifact/black

LOSING FLYING MID-COMBAT:
  If a creature loses flying AFTER blockers are declared:
    Blocking doesn't get retroactively "undeclared" — the block stands
    (Legality of blocking checks at declare blockers time, not continuously)
  If a non-flying creature is ASSIGNED to block a flyer and then gains flying:
    It already legally blocked at the time — the block is valid

REACHING EVERYTHING:
  "Reach" says nothing about blocking non-flying creatures
  A reach creature blocks ground creatures normally (no restriction)
  Reach only enables the one extra thing: blocking flyers
```

## Definitive Conclusions

- **Flying creatures can only be blocked by flying or reach creatures.**
- **Flying creatures can block anything** — ground, flying, etc.
- **Reach only enables blocking flying creatures.** Reach creatures have no evasion themselves.
- **Legality is checked at declare blockers.** Mid-combat ability changes don't retroactively unblock.
- **Multiple evasion restrictions must ALL be satisfied** by a potential blocker.

## Canonical Example
**Ornithopter (Flying 0/2) attacks:**
Opponent has 2/2 ground creature: can't block (no flying/reach).
Opponent has 1/3 Reach creature: CAN block (reach).
Opponent has 2/2 flying creature: CAN block (flying).

**Example 2 — Flying blocking a ground attacker:**
Opponent attacks with 6/6 ground creature (no evasion).
You have 1/4 flying creature. It CAN block the 6/6.
The 6/6 has no flying — but that only restricts WHO CAN BLOCK IT (no restriction), not who it can be blocked by.

## Commonly Confused With
- **P027 (Protection)** — Protection from blue prevents being blocked by blue creatures. Stacks with flying restrictions: must satisfy both.
- **P013 (Banding)** — Banding changes damage assignment, not blocking legality.
- **P105 (Deathtouch)** — A ground 1/1 deathtouch cannot block a flyer (no reach/flying) even though it would kill in combat.
