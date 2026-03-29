---
id: p039
name: Equipment — Attach Mechanics, Summoning Sickness, and Illegal Attachment
category: continuous
cr_refs: [702.6a, 301.5b, 301.5c, 301.5d, 704.5n]
tags: [equipment, equip, attach, sorcery-speed, summoning-sickness, illegal, SBA, control, reconfigure]
created: 2026-03-28
examples_count: 2
---

# P039 — Equipment — Attach Mechanics, Summoning Sickness, and Illegal Attachment

## Abstract
Equipment is an artifact with an equip activated ability that attaches it to a creature you control. Key restrictions: equip activates only at sorcery speed (main phase, stack empty); summoning sickness doesn't prevent being equipped, only prevents the equipped creature from using {T} abilities on that creature; an Equipment's controller and the equipped creature's controller can differ; illegal attachments are corrected by SBA (Equipment becomes unattached but stays on the battlefield).

## The Definitive Rule

**CR 702.6a** (verbatim): *"Equip is an activated ability of Equipment cards. 'Equip [cost]' means '[Cost]: Attach this permanent to target creature you control. Activate only as a sorcery.'"*

**CR 301.5b**: Equipment enters the battlefield unattached. The equip ability attaches it.

**CR 301.5c**: An Equipment that equips an illegal or nonexistent permanent becomes unattached but remains on the battlefield (SBA, CR 704.5n).

**CR 301.5d**: Equipment's controller and equipped creature's controller can differ. Only the Equipment's controller can activate equip abilities. But abilities granted to the equipped creature are activated by the equipped creature's controller.

## The Pattern

```
EQUIP TIMING:
  "Activate only as a sorcery" = main phase + stack empty + priority
  Can't equip at instant speed unless something grants instant speed to equip
  Can equip a creature that just entered this turn (summoning sickness doesn't
    prevent BEING equipped — only prevents tapping to attack/use {T} abilities)

SUMMONING SICKNESS + EQUIPMENT:
  Creature just entered → you can equip it (equip is your activated ability)
  The equipped creature can't attack if it has summoning sickness
  But the equipment's stats/abilities still apply immediately
  Example: Haste-granting equipment (Swiftfoot Boots) — can attach to new creature
    and it gains haste → can attack that turn

CONTROL SPLIT:
  You equip your creature → opponent gains control of the creature
  Equipment stays attached → your equipment, their creature
  YOU still control the equipment → only you can pay equip again
  THEY control the equipped creature → any granted abilities are activated by THEM
  Example: Opponent's creature with your Sword of Fire and Ice gains protection
    from red and blue and the triggered ability — but the trigger is controlled
    by the equipment's controller (you) since the ability is on the equipment,
    not granted to the creature

ILLEGAL ATTACHMENT SBA (704.5n):
  Equipment on non-creature → becomes unattached (SBA), stays on battlefield
  Equipment on creature with protection from Equipment's quality → unattaches (SBA)
  Equipment that loses "Equipment" subtype → unattaches (SBA)
  Unattached Equipment stays on battlefield (not destroyed, not graveyarded)

RECONFIGURE:
  A creature artifact with reconfigure can become attached to another creature
  by paying the reconfigure cost (like equip, but the permanent itself is a creature)
  While attached, it's no longer a creature — it's just equipment bonded to the host
  (CR 702.151 covers this; not detailed here)
```

## Definitive Conclusions

- **Equip is sorcery-speed only.** You can't flash-equip unless something grants that permission.
- **Summoning sickness doesn't prevent equipping.** The equip ability belongs to the Equipment, not the creature. A newly-entered creature CAN be equipped, but still can't attack or use {T} abilities.
- **Haste-granting equipment can enable new creatures to attack.** Attach Swiftfoot Boots to a creature that just entered → it gains haste → it can attack.
- **An Equipment can be controlled by a different player than the equipped creature.** Only the equipment controller can pay equip; granted abilities on the creature are used by the creature's controller.
- **Illegal attachment becomes unattached, not destroyed.** The Equipment stays on the battlefield and can be re-equipped legally later.

## Canonical Example
**Grafted Wargear stolen mid-equip:**
Grafted Wargear gives +3/+2 and "When Grafted Wargear becomes unattached from a permanent, destroy that permanent." You equip it to your creature. Opponent casts Act of Treason stealing your creature. Your equipment is still attached (control of creature changed, not equipment). Opponent now controls the creature, you control the equipment. At end of turn (when Act of Treason's control effect ends), the creature returns to you normally. But if YOU re-equip Grafted Wargear to a different creature, the Wargear unattaches from the current creature → "when it becomes unattached, destroy that permanent" → that creature is destroyed.

**Example 2 — Creature enters with protection from Equipment's quality:**
Creature with protection from artifacts enters. You have an equipment attached to a different creature. You can't equip the protection-from-artifacts creature. If through some effect the equipment became attached to it, SBA would immediately unattach it.

## Commonly Confused With
- **P027 (Protection — DEBT Only)** — Protection's E pillar prevents Equipment from attaching. An Equipment attached to a protected creature becomes unattached by SBA.
- **P039 is the companion to Aura attachment rules (P040)** — Auras and Equipment both become detached by SBA when the host becomes illegal; the key difference is that Auras go to the graveyard while Equipment stays on the battlefield.
