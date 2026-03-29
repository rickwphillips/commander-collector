---
id: p041
name: Morph — Face-Down Identity, Copiable Values, and Turn-Face-Up
category: zones
cr_refs: [708.2a, 708.3, 708.4, 708.8, 708.9, 116.2b]
tags: [morph, disguise, cloak, face-down, identity, copiable-values, 2/2, ETB, turn-face-up, special-action, split-second]
created: 2026-03-28
examples_count: 3
---

# P041 — Morph — Face-Down Identity, Copiable Values, and Turn-Face-Up

## Abstract
Face-down creatures (via morph, disguise, cloak, or other effects) have no characteristics other than being a 2/2 colorless creature with no name, no types, no abilities, and no mana cost. All other characteristics are hidden. Turning a face-down permanent face-up is a special action (not an activated ability) — it can be done at instant speed, including while a split-second spell is on the stack. ETB abilities do NOT trigger when a permanent turns face-up because it already entered the battlefield. However, "as [this] is turned face up" abilities do apply as the permanent is turning face up.

## The Definitive Rule

**CR 708.2a** (verbatim): *"If a face-up permanent is turned face down by a spell or ability that doesn't list any characteristics for that object, it becomes a 2/2 face-down creature with no text, no name, no subtypes, and no mana cost."*

**CR 708.3** (verbatim): *"Objects that are put onto the battlefield face down are turned face down before they enter the battlefield, so the permanent's enters-the-battlefield abilities won't trigger (if triggered) or have any effect (if static)."*

**CR 708.8** (verbatim): *"As a face-down permanent is turned face up, its copiable values revert to its normal copiable values. Any effects that have been applied to the face-down permanent still apply to the face-up permanent. Any abilities relating to the permanent entering the battlefield don't trigger and don't have any effect, because the permanent has already entered the battlefield."*

**CR 116.2b**: Turning a face-down creature face up is a special action — any time a player has priority.

## The Pattern

```
FACE-DOWN CHARACTERISTICS:
  No name, no card types, no subtypes, no mana cost, no abilities, no color
  Just: 2/2 colorless creature (unless the effect specifying face-down states otherwise)
  Can't be named by "name a card" effects
  Can't be targeted by "target [subtype] creature" (has no subtypes)
  Can be targeted by "target creature" (is a creature)
  You can look at your own face-down permanents any time
  Opponents cannot look at face-down permanents you control

MULTIPLE FACE-DOWN PERMANENTS:
  Must be distinguishable (CR 708.6)
  Use dice, counters, ordering to keep them distinct
  You must be able to identify which is which if asked

ENTERING FACE-DOWN (ETBs):
  Permanent turns face-down before entering → ETB triggers don't fire
  Static ETB abilities don't have any effect either
  "Enters with X counters" → doesn't apply (already face-down before entering)
  BUT: effects already on the battlefield DO apply to the face-down permanent
  Example: "All creatures get +1/+1" → face-down creature gets +1/+1 → 3/3

TURNING FACE-UP — SPECIAL ACTION:
  Not an activated ability → not stopped by Split Second (P026)
  Not on the stack → can't be countered, targeted, or responded to
  Pay the morph/disguise cost → immediately turn face-up
  Instant speed → can be done during combat, in response to anything
  ETB abilities do NOT trigger (already on battlefield, just flipping)
  "As [this] is turned face up" abilities DO apply (they're handled as the face-up event)

EFFECTS APPLIED TO FACE-DOWN PERSIST ON FACE-UP:
  +1/+1 counters added to a face-down creature → still there when turned face-up
  Enchantment attached → still attached when turned face-up
  Summoning sickness → if the creature entered face-down, it had sickness;
    turning face-up doesn't reset it; but the face-up characteristics may include haste

COPIABLE VALUES:
  Face-down = 2/2 colorless, no name, no types, no abilities, no mana cost
  A copy of a face-down creature copies these values (per layer 1 copy effect)
  When original is later turned face-up, the copy is NOT affected (707.2b)

DISGUISE AND CLOAK VARIANTS:
  Disguise: like morph but 2/2 with ward {2}
  Cloak (from Facedown effects): face-down but often can't be turned face-up normally
  All follow the same 708 rules
```

## Definitive Conclusions

- **A face-down creature is a 2/2 colorless creature with no name, no types, no abilities.** That's all opponents know.
- **Turning face-up is a special action, not an activated ability.** It can happen through a Split Second window (P026).
- **ETB abilities do NOT trigger when turning face-up.** The permanent is already on the battlefield.
- **"As [this] is turned face up" abilities DO apply.** These are handled during the turning-face-up event, not after.
- **Effects applied to the face-down creature remain after turning face-up.** Counters, attached enchantments, damage marks all persist.
- **Copying a face-down creature copies the 2/2 colorless characteristics.** The copy doesn't inherit the original's true identity when the original turns face-up later.
- **You must be able to distinguish your face-down permanents.** Rules obligation — use markers or ordering.

## Canonical Example
**Morph creature vs. Split Second:**
Opponent casts Krosan Grip (Split Second) targeting your enchantment. You can't cast spells or activate abilities. But you CAN turn your morph creature face-up (special action, CR 116.2b). Your face-down 2/2 becomes Exalted Angel (4/5 flying lifelink), changing the combat math. Krosan Grip resolves, destroys your enchantment, but your Angel is now revealed.

**Example 2 — No ETB when turning face-up:**
You cast Brine Elemental face-down. Later you turn it face-up. Brine Elemental has "When Brine Elemental enters, each opponent skips their next untap step." Turning face-up does NOT trigger this — the Brine Elemental already entered the battlefield (face-down). The ETB condition is "when it enters" — it already entered. No effect.

**Example 3 — Copying a face-down creature:**
A Clone enters as a copy of your face-down creature. Clone copies the face-down characteristics: 2/2 colorless, no name, no types, no abilities. You turn your original face-up: it becomes a 4/4 dragon with flying. The Clone is still a 2/2 colorless. Clone's copiable values were set when it entered (CR 707.2b); original changing doesn't affect the copy.

## Commonly Confused With
- **P026 (Split Second Incomplete Lock)** — Turning face-up is a special action that works through Split Second. P026 establishes this; P041 clarifies why (special action, not activated ability).
- **P003 (Zone Change Identity)** — A face-down creature that leaves and returns to the battlefield is a new object. But turning it face-up while still on the battlefield is NOT a zone change — same object, just revealed.
- **P023 (Trigger Suppression vs. Replacement)** — ETBs don't trigger when entering face-down (the face-down status precedes entering). Different from Torpor Orb suppressing ETBs.
