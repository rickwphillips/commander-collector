---
id: p170
name: Mutate — Merge with a Non-Human Creature
category: zones
cr_refs: [702.140a, 702.140b, 702.140c, 702.140d, 702.140e, 702.140f]
tags: [mutate, merge, non-human, creature, top-bottom, ability-stack, Ikoria, Gemrazer, Snapdax]
created: 2026-03-28
examples_count: 2
---

# P170 — Mutate — Merge with a Non-Human Creature

## Abstract
Mutate is an alternative cast that merges the mutating creature with a target non-Human creature you own. Instead of entering the battlefield normally, the mutating spell merges with its target: the controlling player chooses whether the mutating spell goes on top or bottom of the mutant stack. The combined permanent uses the characteristics of the topmost card (name, type, P/T) but has ALL abilities of every card in the pile. "Whenever a creature mutates" triggers fire when any merge happens. The key restriction: can't mutate onto Humans (thematically, monsters absorb monsters, not people).

## The Definitive Rules

**CR 702.140a** (verbatim): *"Mutate appears on some creature cards. It represents a static ability that functions while the spell with mutate is on the stack. 'Mutate [cost]' means 'You may pay [cost] rather than pay this spell's mana cost. If you do, it becomes a mutating creature spell and targets a non-Human creature with the same owner as this spell.' Casting a spell using its mutate ability follows the rules for paying alternative costs (see 601.2b and 601.2f–h)."*

**CR 702.140c** (verbatim): *"As a mutating creature spell resolves, if its target is legal, it doesn't enter the battlefield. Rather, it merges with the target creature and becomes one object represented by more than one card or token (see rule 729, 'Merging with Permanents'). The spell's controller chooses whether the spell is put on top of the creature or on the bottom. The resulting permanent is a mutated permanent."*

**CR 702.140e** (verbatim): *"A mutated permanent has all abilities of each card and token that represents it. Its other characteristics are derived from the topmost card or token."*

## The Pattern

```
MUTATE:
  Alternative cast: targets a non-Human creature you own (same owner)
  Instead of entering normally: merges with target creature
  Controller chooses: put on top or bottom of the pile
  Topmost card's characteristics: name, P/T, type
  ALL cards in pile: contribute their abilities

  MUTATE + NON-HUMAN:
    Humans can't be mutated onto
    "Non-Human creature" in terms of the creature's subtype (not the card type)
    If a creature has the Human subtype: it can't be a mutate target
    Changelings are all creature types INCLUDING Human: can't be mutated onto
    A Mutant or Beast (not Human) can be mutated onto

  MUTATE + TOP VS BOTTOM:
    Put on top: the mutating card's characteristics become the permanent's stats
    Put on bottom: the original creature's stats are on top (stay the same)
    Top gets the P/T and name of the topmost card
    Abilities: ALL cards in the pile contribute their abilities regardless of position

  MUTATE TRIGGER:
    CR 702.140d: "whenever a creature mutates" ability triggers when a spell merges with a creature
    Many mutate cards have: "Whenever this creature mutates, [effect]"
    The effect fires each time something new merges into the pile
    If you mutate 3 times: the trigger fires 3 times total (once per merge)

  MUTATE + COUNTERS:
    The merged permanent keeps all counters from the original creature
    +1/+1 counters, loyalty counters (if it became a planeswalker somehow), etc.
    The merged permanent is the SAME permanent (continuous identity) — same object

  MUTATE + AURAS/EQUIPMENT:
    Equipment attached to the original: stays attached after merging
    Auras enchanting the original: still attached (same object)
    The merged permanent takes on a new "top card" but is still the same object

  MUTATE + TARGET ILLEGAL:
    CR 702.140b: if target is illegal when mutate resolves → ceases to be a mutating creature spell → enters battlefield normally
    If the target dies in response to mutate → mutate spell becomes a normal creature spell entering normally
    No ETB trigger suppression in this case

  MUTATE PILE CHARACTERISTICS:
    Name and type: topmost card
    P/T: topmost card
    Abilities: ALL cards in pile (additive)
    Color: topmost card (unless other effects)

  MUTATE + FLICKERING:
    If a mutated permanent is exiled and returned: it re-enters as the topmost card only
    The pile is broken up — you choose which card re-enters? No.
    Actually: when a mutated permanent leaves the battlefield, the pile is separated — each card goes to its respective zone
    The permanent leaving: each component card goes to where it would naturally (topmost card as the "creature" you control probably — but this gets complex)
    CR 729: merged permanents have specific zone-change rules
```

## Definitive Conclusions

- **Mutate merges the spell with a non-Human creature** — top card determines stats, all provide abilities.
- **Place on top for new stats, on bottom for new abilities on existing stats**.
- **"Whenever this creature mutates" triggers fire** each time something merges into the pile.
- **If target is illegal at resolution**, mutate spell enters the battlefield normally as a creature.
- **Counters and attached equipment/auras** persist on the merged permanent.

## Canonical Example
**Gemrazer (Mutate {2}{G}, 4/4 Trample, Reach, ETB destroy target artifact/enchantment):**
Target: your 3/3 Brushwagg (non-Human). Pay {2}{G} to mutate.
Choose to put Gemrazer on top: permanent becomes 4/4 Trample Reach with "whenever this mutates, destroy target artifact or enchantment."
The 3/3 Brushwagg's abilities (none in this case) + Gemrazer's abilities.
Mutate trigger fires: destroy target artifact or enchantment.

**Example 2 — Mutate Pile Building:**
Start: Porcuparrot (1/1, Mutate) → on top.
Mutate Gyruda (Mutate, ETB mill 4) onto Porcuparrot: pile is [Gyruda on top, Porcuparrot on bottom].
Mutate trigger (Gyruda's): mill top 4, put any even-CMC creature from those mills onto battlefield.
Now mutate Gemrazer onto the pile: Gemrazer on top → pile is [Gemrazer, Gyruda, Porcuparrot].
Mutate triggers: Gemrazer trigger (destroy artifact/enchantment) + Gyruda trigger (mill 4 again).
The pile has all three sets of abilities.

## Commonly Confused With
- **P158 (Champion)** — Champion exiles a creature and returns it. Mutate merges permanents into one.
- **P148 (Morph)** — Morph creates a face-down creature with no text. Mutate merges multiple cards into one permanent.
- **P114 (Changeling)** — Changeling is every creature type INCLUDING Human, so it CANNOT be mutated onto (Human blocks mutate).
