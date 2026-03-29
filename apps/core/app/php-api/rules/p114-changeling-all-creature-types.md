---
id: p114
name: Changeling — All Creature Types Always
category: continuous
cr_refs: [702.73a, 702.73b, 205.3m]
tags: [changeling, creature-type, all-subtypes, tribal, lord, soulshift, champion, shapeshifter]
created: 2026-03-28
examples_count: 2
---

# P114 — Changeling — All Creature Types Always

## Abstract
Changeling is a static ability that makes the creature have every creature type simultaneously, at all times. A changeling is a Wizard, Elf, Dragon, Goblin, Human, Vampire, Zombie — every creature type on the type list — at once. This interacts with tribal lords ("Elves you control get +1/+1"), champion ("champion a Goblin"), soulshift ("return a Spirit"), and any other effect that cares about creature type. Changeling works in all zones — it's not just a battlefield characteristic.

## The Definitive Rule

**CR 702.73a** (verbatim): *"Changeling is a static ability. The effect of changeling is characteristic-defining. 'Changeling' means 'This object is every creature type.' This effect works everywhere, even outside the game."*

**CR 702.73b** (verbatim): *"Multiple instances of changeling on the same object are redundant."*

## The Pattern

```
CHANGELING — CORE RULE:
  The permanent/card has ALL creature types simultaneously
  Every single creature type in the Oracle type list applies
  This is a characteristic-defining ability (CDA) — applies in layer 4 (type changes)

WHAT CHANGELING ENABLES:
  Lords: "Elves you control get +1/+1" → changeling is an Elf → gains the bonus
  Champion: "Champion an Elf" → changeling qualifies as an Elf
  Soulshift N: "Return a Spirit with CMC ≤ N" → changeling qualifies as a Spirit
  Tribal spells: "Goblin spell" → changeling in hand qualifies if cast as a Goblin
  Creature-type restrictions: "Can only be blocked by Goblins" → changeling blocks it
  Legendary rules: changeling isn't affected — the legend rule uses the name, not type

CHANGELING IN ALL ZONES (702.73a):
  Not just on the battlefield — works in hand, graveyard, exile, library
  Important for: searching for a creature type, tribal graveyard effects
  "Search your library for a Human" → changeling qualifies from library
  "Return a Zombie from graveyard" → changeling in graveyard qualifies

TYPE CHANGES AND LAYERS:
  Changeling is a CDA → applies in layer 4 before other type-changing effects
  Effect that sets creature type to "Goblin only": overrides changeling in layer 4
  If such an effect overwrites all creature types → changeling's "all types" may be replaced
  Depends on timestamp — usually the most recent effect wins

TYPE MATTERS FOR SYNERGIES:
  Multiple lords each separately apply to a changeling
  A changeling with 5 lords that each care about different types gets all 5 bonuses

SHAPESHIFTER SUBTYPE:
  Changelings are Shapeshifters (printed type on the card)
  They are also every other creature type
```

## Definitive Conclusions

- **Changeling is every creature type at all times, in all zones.**
- **All tribal synergies and creature-type-dependent effects apply to changelings.**
- **Multiple lords each apply separately** — a changeling benefits from all tribal lords in play.
- **Type-overwriting effects (layer 4) can replace changeling's type with something specific** — recent timestamp wins.
- **Works for searching libraries and returning from graveyards** (any creature type search).

## Canonical Example
**Cairn Wanderer (Changeling) + Elf lord + Goblin lord + Dragon lord:**
All three lords say "Creatures of this type you control get +2/+2." Cairn Wanderer is all three types → gets +2/+2 three times → ends up as a +6/+6-pumped creature.

**Example 2 — Champion interaction:**
You have Changeling in play. Opponent plays "Champion a Goblin." They can champion your changeling (it's a Goblin). Your changeling is exiled. When their creature dies, changeling returns (it was the championed permanent).

## Commonly Confused With
- **P055 (Champion)** — Champion exiles then returns a creature of a specific type. Changeling qualifies for any type.
- **P063 (Mutate)** — Mutate restricts to "non-Human." A changeling is a Human → can't be mutated onto.
- **P004 (Layer Dependency)** — Changeling is a CDA in layer 4. Type overwriting effects work by layer rules.
