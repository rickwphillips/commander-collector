---
id: p069
name: Reconfigure — Equipment/Creature Hybrid Switching
category: zones
cr_refs: [702.151a, 702.151b]
tags: [reconfigure, equipment, creature, artifact, attach, unattach, sorcery-speed, hybrid, stops-being-creature]
created: 2026-03-28
examples_count: 2
---

# P069 — Reconfigure — Equipment/Creature Hybrid Switching

## Abstract
Reconfigure is found on artifact creatures that are also Equipment. It lets you switch a reconfigure permanent between functioning as an Equipment (attached to another creature) and functioning as a standalone creature. When attached to another creature via reconfigure, the reconfigure permanent STOPS being a creature. When unattached, it is again a creature. This is a critical distinction: the permanent is either a creature OR an equipment providing its bonuses — never both simultaneously with the same object.

## The Definitive Rule

**CR 702.151a** (verbatim): *"Reconfigure represents two activated abilities. Reconfigure [cost] means '[Cost]: Attach this permanent to another target creature you control. Activate only as a sorcery' and '[Cost]: Unattach this permanent. Activate only if this permanent is attached to a creature and only as a sorcery.'"*

**CR 702.151b** (verbatim): *"Attaching an Equipment with reconfigure to another creature causes the Equipment to stop being a creature until it becomes unattached from that creature."*

## The Pattern

```
RECONFIGURE STATES:
  State 1 — Unattached (creature):
    → Is an artifact creature (both types)
    → Can attack and block
    → Cannot use reconfigure-unattach ability (not attached)
    → Can activate reconfigure-attach to become attached to a creature

  State 2 — Attached (equipment, not creature):
    → Is an artifact Equipment (NOT a creature)
    → Cannot attack or block
    → Provides equipment bonuses to the attached creature
    → Can activate reconfigure-unattach to return to creature form

RECONFIGURE SEQUENCE:
  Attach: [Cost]: target another creature you control → this becomes attached, stops being a creature
  Unattach: [Cost] → this detaches, becomes a creature again
  Both are sorcery-speed only

WHEN ATTACHED:
  The reconfigure permanent provides Equipment bonuses (P/T, abilities printed on it)
  It is NOT a creature → no summoning sickness issues when entering attached-state
  It is NOT attacking or blocking
  It's still an artifact (SBA: if host leaves, equipment unattaches per SBA 704.5n)

WHEN ATTACHED TO ILLEGAL TARGET:
  If the creature it's attached to gets protection from artifacts:
    Equipment becomes illegally attached (SBA 704.5n)
    SBA: unattach the Equipment
    Equipment returns to being a creature (after unattachment)

SUMMONING SICKNESS AND RECONFIGURE:
  If reconfigure permanent JUST entered the battlefield:
    As a creature: can't attack (summoning sickness)
    Can still be used via reconfigure to attach to another creature (sorcery-speed, not attacking)
  If it was previously a creature and got attached (became equipment):
    The attachment doesn't reset summoning sickness tracking
    When it becomes unattached (creature again): it needs to have been under your control
      since the start of your turn to attack

SELF-EQUIPMENT:
  "Attach this permanent to another target creature you control"
  Cannot attach to itself (CR says "another")
  Must target a different creature you control
```

## Definitive Conclusions

- **Reconfigure permanents are either a creature (unattached) OR an equipment (attached) — never both.**
- **Attaching stops being a creature.** No attacking, no blocking, no summoning sickness concerns.
- **Both attach and unattach are sorcery-speed.** Cannot reconfigure at instant speed without special effects.
- **If the host leaves or becomes an illegal attachment target,** the reconfigure permanent unattaches and becomes a creature again.
- **Cannot attach to itself.** Must target "another" creature.

## Canonical Example
**Nettlecyst (Reconfigure {3}):**
Nettlecyst enters as an artifact creature. It's a 0/0 with "+1/+1 for each artifact and enchantment you control" (applied to whatever it's on). As a standalone creature: Nettlecyst is a 0/0 that grows with artifacts. Pay {3}: attach Nettlecyst to your 3/3 creature. Nettlecyst stops being a creature; your 3/3 gains Nettlecyst's bonus (total power/toughness goes up). Pay {3} again: Nettlecyst unattaches, becomes a creature again.

**Example 2 — Reconfigure when host dies:**
Nettlecyst is attached to a creature. Opponent destroys the host creature. SBA: Nettlecyst unattaches (host is dead, nothing to be attached to). Nettlecyst returns to being a creature on your battlefield. Because it was an equipment (not a creature) when the turn started, it cannot attack this turn (even though it's now a creature) — it didn't exist as a creature at the start of your turn.

## Commonly Confused With
- **P039 (Equipment)** — Normal equipment always stays equipment; reconfigure equipment toggles between creature and equipment. The sorcery-speed restriction on attach is the same.
- **P058 (Crew)** — Vehicles become creatures temporarily (until end of turn). Reconfigure is permanent (until next reconfigure activation).
