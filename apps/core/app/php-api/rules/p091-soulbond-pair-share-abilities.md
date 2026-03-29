---
id: p091
name: Soulbond — Paired Creatures and Shared Abilities
category: triggered
cr_refs: [702.95a, 702.95b, 702.95c, 702.95d, 702.95e]
tags: [soulbond, paired, unpaired, ETB, shared-abilities, control-loss, one-pair-only]
created: 2026-03-28
examples_count: 2
---

# P091 — Soulbond — Paired Creatures and Shared Abilities

## Abstract
Soulbond creates a pairing between two creatures you control. When either a soulbond creature or another creature enters, if both are unpaired, you may pair them together. While paired, both creatures share whatever abilities the soulbond cards grant to paired creatures. A creature can be paired with only one other creature. The pairing breaks if either creature leaves the battlefield, stops being a creature, or changes controller.

## The Definitive Rule

**CR 702.95a** (verbatim): *"Soulbond is a keyword that represents two triggered abilities. 'Soulbond' means 'When this creature enters, if you control both this creature and another creature and both are unpaired, you may pair this creature with another unpaired creature you control for as long as both remain creatures on the battlefield under your control' and 'Whenever another creature you control enters, if you control both that creature and this one and both are unpaired, you may pair that creature with this creature for as long as both remain creatures on the battlefield under your control.'"*

**CR 702.95d** (verbatim): *"A creature can be paired with only one other creature."*

**CR 702.95e** (verbatim): *"A paired creature becomes unpaired if any of the following occur: another player gains control of it or the creature it's paired with; it or the creature it's paired with stops being a creature; or it or the creature it's paired with leaves the battlefield."*

## The Pattern

```
SOULBOND PAIRING:
  Two triggers:
  1. When the soulbond creature enters: may pair with another unpaired creature you control
  2. When another creature enters: if soulbond creature is unpaired, may pair

  Pairing creates a "paired" designation (not a counter, just a rules state)
  Both creatures are now "paired" with each other

ABILITIES WHILE PAIRED:
  Soulbond creatures typically say "as long as [this creature] is paired with another creature,
    both creatures have [ability]"
  The ability is a static effect: both paired creatures share the bonus
  Example: "as long as Wolfir Silverheart is paired, both have +4/+4"

PAIRING BREAKS:
  Any of:
  - One leaves the battlefield
  - One stops being a creature
  - A player gains control of one (without the other)
  When broken: both become unpaired
  If the soulbond creature is now unpaired and another creature enters → can re-pair

ONE PAIR ONLY:
  Each creature is paired with exactly one other
  Can't have a chain (A-B-C where all three share abilities)
  If you have 3 soulbond creatures: you'll have one pair and one unpaired creature
    (Unless the third creature enters while the pair is already formed → third is unpaired)

PAIRING IS OPTIONAL:
  "You may pair" → optional
  Sometimes better not to pair (save for a better combo creature entering later)

PAIRING BETWEEN SOULBOND CREATURES:
  Two soulbond creatures entering together: trigger for each
    → Both can pair with each other
    → Second soulbond trigger: targets first soulbond creature (now unpaired? or paired?)
    → Resolution order matters: first trigger pairs them, second trigger finds both paired
```

## Definitive Conclusions

- **Soulbond pairing is optional.** You may choose not to pair.
- **Both creatures share the ability while paired.** Not just the soulbond creature.
- **Pairing breaks on: leaving battlefield, stopping being a creature, or control change.**
- **One pair maximum per creature.** Can't chain three creatures together.
- **Pairing can re-form.** If one creature leaves, the remaining soulbond creature can pair with a new entrant.

## Canonical Example
**Wolfir Silverheart (Soulbond, as long as paired, both have +4/+4):**
Wolfir Silverheart enters. Soulbond triggers: choose to pair with your 2/2 Soldier token. Both are now paired. Wolfir becomes 8/8 + 4/4 (its base 4/4 plus the bonus — wait: Wolfir is 4/4 base, +4/+4 bonus = 8/8). Soldier becomes 6/6 (+4/+4). Opponent kills the Soldier. Pair breaks. Wolfir is unpaired (and reverts to 4/4 base).

**Example 2 — Re-pairing:**
Wolfir Silverheart is unpaired (partner died). A new 1/1 creature enters. Soulbond trigger fires (from the 1/1 entering and the soulbond creature being unpaired). Pair them. Now the 1/1 becomes a 5/5 (+4/+4) and Wolfir is again 8/8.

## Commonly Confused With
- **P091 and P040 (Aura)** — Auras attach to permanents; soulbond creates a mutual pairing. Auras can be on opponents' permanents; soulbond requires both creatures to be yours.
- **P028 (Simultaneous ETB)** — When multiple creatures enter simultaneously, soulbond triggers for each can fire, but each pairing is independent.
