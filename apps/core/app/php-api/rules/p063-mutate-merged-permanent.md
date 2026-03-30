---
id: p063
name: Mutate — Merged Permanent Rules
category: zones
cr_refs: [702.140a, 702.140b, 702.140c, 702.140d, 702.140e, 702.140f, 729]
tags: [mutate, merge, permanent, top-card, characteristics, ETB, LTB, all-abilities, human-restriction]
created: 2026-03-28
examples_count: 2
---

# P063 — Mutate — Merged Permanent Rules

## Abstract
Mutate is an alternative-cost mechanic that, instead of entering the battlefield, merges the mutating creature with a target non-Human creature. The merged permanent is one object with multiple cards representing it. Its characteristics come from the topmost card/token, but it has ALL abilities of every merged component. When the merged permanent dies, every component goes to its owner's graveyard individually — all death triggers and LTB triggers fire separately for each component.

## The Definitive Rule

**CR 702.140a** (verbatim): *"Mutate appears on some creature cards. It represents a static ability that functions while the spell with mutate is on the stack. 'Mutate [cost]' means 'You may pay [cost] rather than pay this spell's mana cost. If you do, it becomes a mutating creature spell and targets a non-Human creature with the same owner as this spell.'"*

**CR 702.140c** (verbatim): *"As a mutating creature spell resolves, if its target is legal, it doesn't enter the battlefield. Rather, it merges with the target creature and becomes one object represented by more than one card or token. The spell's controller chooses whether the spell is put on top of the creature or on the bottom. The resulting permanent is a mutated permanent."*

**CR 702.140e** (verbatim): *"A mutated permanent has all abilities of each card and token that represents it. Its other characteristics are derived from the topmost card or token."*

## The Pattern

```
MUTATE SEQUENCE:
  1. Cast spell using mutate cost (alternative cost)
  2. Spell becomes a "mutating creature spell" targeting a non-Human creature
     (must have the same owner as the casting player's — usually just "yours")
  3. Target must be non-Human (Human type prevents mutation)
  4. On resolution: mutating spell merges INTO the target creature
     → Caster chooses: put mutating card on top OR on bottom of target creature
     → Combined object is now one "mutated permanent"

CHARACTERISTICS OF MUTATED PERMANENT:
  Power/toughness/name/type/mana cost/color: FROM THE TOPMOST card/token only
  Abilities: ALL abilities from EVERY component (top, middle, bottom)
  If topmost card has "3/3": permanent is 3/3 (even if component was 5/5)
  If any component has flying: permanent has flying (all abilities combined)

MERGING DOESN'T TRIGGER ETB:
  The mutating spell doesn't "enter the battlefield" — it merges
  Normal ETB triggers do NOT fire for the mutating card
  HOWEVER: "whenever a creature mutates" triggers do fire (CR 702.140d)
  The "whenever this creature mutates" trigger fires for the merged permanent

ILLEGAL TARGET AT RESOLUTION:
  If target becomes illegal before spell resolves (e.g., the target left):
  CR 702.140b: spell ceases to be mutating and resolves as a normal creature spell
  → It ENTERS the battlefield normally (with ETBs)

DEATH AND ZONE CHANGES:
  When mutated permanent leaves the battlefield: each component goes separately
  All components go to their respective zones (each owner's graveyard)
  Death triggers fire for each component separately
  LTB triggers fire (last known info includes the merged state)
  This allows powerful "dies" trigger stacking through mutation

MUTATION TRIGGER COUNTING:
  "Whenever this creature mutates" — the trigger counts from the first mutation
  If you mutate the same creature 3 times: each mutation triggers once
  All three triggers go on the stack (APNAP) after each mutation

HUMAN RESTRICTION:
  Target must be non-Human at time of casting AND at time of resolution
  If target gains Human subtype after being targeted: target becomes illegal
  → Spell enters battlefield normally (CR 702.140b)
  Cannot mutate tokens that are Humans (rare but possible)
```

## Definitive Conclusions

- **Mutated permanents have ALL abilities from all components.** Characteristics (P/T, name, color) come from topmost only.
- **Mutating doesn't trigger ETB.** Instead, "whenever a creature mutates" triggers fire.
- **If the mutation target leaves before the spell resolves,** the mutating spell enters as a normal creature (ETBs fire).
- **When a mutated permanent dies,** each component goes to its owner's graveyard — death triggers fire per component.
- **Target must be non-Human.** Humans are immune to mutation; they can't be targeted by mutate spells.
- **Brokkos cast from graveyard via its own ability MUST use the mutate cost.** "You may cast this card from your graveyard using its mutate ability" only grants permission to cast it from the graveyard — you still must pay the mutate cost. You cannot choose to pay the regular mana cost instead. (Gatherer ruling 2020-04-17: "If you cast Brokkos with the permission granted by its last ability, you must pay its mutate cost to cast it. You can't choose to pay its mana cost or another alternative cost.")
- **Nethroi's "return creatures" targets use power as it exists in the graveyard,** not on the battlefield. A 0/0 creature card that will enter as a 15/15 can still be targeted (power is 0 in the graveyard). (Gatherer ruling 2020-04-17)

## Canonical Example
**Gemrazer (Mutate {1}{G}) on a Gilded Goose:**
Gilded Goose is non-Human. Cast Gemrazer for mutate cost. Choose to put Gemrazer on top. Result: the merged permanent has Gemrazer's P/T (4/4) and name, AND retains all of Gilded Goose's abilities (the food-making ability, the mana ability). "Whenever this creature mutates" trigger fires: destroy target noncreature, nonland permanent.

**Example 2 — Target becomes Human:**
Mutate spell targets Shapeshifter. In response, opponent's effect makes Shapeshifter a Human. At resolution, target is Human (illegal). Mutating spell ceases to be mutating and enters as a normal creature (ETBs fire, no merge).

## Commonly Confused With
- **P028 (Simultaneous ETB)** — Mutating doesn't trigger ETB; "whenever a creature mutates" is the trigger instead.
- **P040 (Aura Attachment)** — Auras attach to a creature but remain separate objects. Mutating merges into one object with combined characteristics.
