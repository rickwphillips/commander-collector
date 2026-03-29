---
id: p225
name: Heroic — Triggers Whenever a Spell Targets the Creature
category: triggered
cr_refs: [702.108a, 702.108b]
tags: [heroic, target-trigger, spell-targeting, Theros, Hero-of-Iroas, Favored-Hoplite, Phalanx-Leader]
created: 2026-03-28
examples_count: 2
---

# P225 — Heroic — Triggers Whenever a Spell Targets the Creature

## Abstract
Heroic is a triggered ability from Theros block: "Whenever you cast a spell that targets this creature, [effect]." Heroic triggers whenever ANY spell you cast has this creature as a target — buffs, auras, combat tricks, pump spells, even when targeting for removal protection spells. Heroic creates a "target me" incentive: build a creature with heroic, protect it and target it repeatedly for exponential value. The creature grows, gets counters, or creates tokens each time it's targeted by a spell.

## The Definitive Rules

**CR 702.108a** (verbatim): *"Heroic is a triggered ability. 'Heroic — [Effect]' means 'Whenever you cast a spell that targets this creature, [effect].'"*

**CR 702.108b** (verbatim): *"Heroic abilities triggered by a spell will resolve before that spell."*

## The Pattern

```
HEROIC:
  "Whenever you cast a spell that targets this creature" → effect
  Triggers: any spell YOU cast that has this creature as a target
  Doesn't trigger: opponent's spells targeting it (only your own)
  Doesn't trigger: abilities targeting it (abilities, not spells)
  Doesn't trigger: spells you cast that DON'T target it (e.g., global effects)

HEROIC + TIMING:
  CR 702.108b: heroic trigger resolves BEFORE the spell that triggered it
  Cast Giant Growth targeting heroic creature:
  - Giant Growth goes on stack
  - Heroic trigger goes on stack on top
  - Heroic trigger resolves first: +1/+1 counter placed (or other effect)
  - Then Giant Growth resolves: +3/+3 until end of turn
  The hero gains the counter before the pump resolves

HEROIC + CANTRIPS:
  Cantrip spells that target: Triton Tactics, Inside Out, Defiant Strike
  Defiant Strike ({W}): target creature gets +1/+0 until end of turn, then draw a card
  Cast Defiant Strike targeting heroic creature:
  - Heroic triggers (put on stack after Strike)
  - Heroic resolves: +1/+1 counter
  - Defiant Strike resolves: +1/+0 until end of turn AND draw a card
  One {W} cantrip: permanent +1/+1 counter + card draw + +1/+0 this turn. Extraordinary value.

HEROIC + AURAS:
  Casting an Aura spell with target = heroic creature triggers Heroic
  Bestow spells (P223): casting with bestow targets the creature → Heroic triggers
  Casting an Aura and Heroic: trigger before the Aura attaches → resolve in order

HEROIC + MULTIPLE HEROIC:
  Multiple heroic abilities on the same creature: each triggers independently
  Each spell triggers each heroic separately
  E.g., two heroic creatures and one spell targeting both: each creature's heroic triggers once

HEROIC + SPELL THAT TARGETS TWO:
  A spell can target multiple creatures: "deal 2 damage to each of up to two target creatures"
  If your heroic creature is one target AND your other creature is another: heroic triggers once for the heroic one
  Heroic triggers once per spell regardless of how many times the spell targets it

HEROIC + COPY SPELLS:
  Copying a spell that targeted heroic: the copy targets it too (if you choose)
  But heroic triggers on CASTING: copies aren't cast
  Reverberate targeting your Giant Growth (which targeted heroic creature): copy of Giant Growth
  The copy isn't cast → heroic doesn't trigger from the copy
  But: if you cast Reverberate and target Giant Growth (as a spell on the stack), does casting Reverberate trigger heroic?
  Reverberate targets Giant Growth (a spell), not your creature — no heroic trigger from Reverberate itself

HERO OF IROAS ({1}{W}):
  2/2 Hero. "Heroic — whenever you cast a spell that targets Hero of Iroas, put a +1/+1 counter on it."
  Also: "Aura spells you cast cost {1} less to cast."
  Build a "Bogles"-style aura deck: cheap auras target Hero, each triggers heroic counter
  End result: massive Hero with many +1/+1 counters from cheap aura casts

FAVORED HOPLITE ({W}):
  1/1 Soldier. "Heroic — put a +1/+1 counter on Favored Hoplite and it gains indestructible until end of turn."
  Very efficient: 1-mana creature that protects itself AND grows when targeted
  Target Favored Hoplite with any spell: it gains indestructible for that turn → opponent can't Doom Blade the spell effect

PHALANX LEADER ({1}{W}):
  1/1 Soldier. "Heroic — put a +1/+1 counter on EACH creature you control."
  Target Phalanx Leader → EACH of your creatures gets a +1/+1 counter
  With 5 creatures: one targeting spell puts 5 counters across the board
  "Win-more" heroic: wide board + Phalanx Leader = explosive growth per targeting spell

HEROIC + PROTECTION SPELLS:
  Gods Willing ({W}): "target creature gains protection from the color of your choice until end of turn. Scry 1."
  Heroic: cast Gods Willing → Heroic triggers
  Net: +1/+1 counter + protection from opponent's chosen color + scry 1 for {W}
  Heroic decks love Gods Willing because it targets while also protecting the hero
```

## Definitive Conclusions

- **Heroic triggers on your spells targeting the creature** — not opponent's spells, not abilities.
- **Heroic resolves before the targeting spell** — counter is placed before the pump resolves.
- **Copy spells don't trigger heroic** — copies aren't "cast."
- **Phalanx Leader**: applying heroic to scale across your whole board from one targeting.
- **Favored Hoplite**: indestructible + counter on each target — extremely efficient protection.

## Canonical Example
**Heroic Aggro deck in Theros Standard:**
Turn 1: Play Hero of Iroas.
Turn 2: Cast Ordeal of Heliod ({1}{W} Aura, bestow {5}{W}): target Hero of Iroas.
Heroic triggers: +1/+1 counter on Hero (now 3/3 from the counter + it was 2/2, plus Ordeal adds more counters).
Ordeal resolves: enchants Hero with Ordeal enchantment.
Turn 3: Cast Gods Willing ({W}) on Hero: Heroic triggers again (+1/+1 counter). Hero now 4/4.
Gods Willing resolves: Hero gets protection from chosen color + scry 1.
Turn 4: Attack with Hero. When Hero attacks with 3 total counters on Ordeal: Ordeal triggers, Hero gains 10 life.
Three spells cast (two on Hero): Hero of Iroas is now a 5/5 with lifelink and protection.

**Example 2 — Phalanx Leader in Go Wide:**
You control five 1/1 tokens and Phalanx Leader.
Cast Triton Tactics ({W}): "up to two target creatures each get +0/+3 until end of turn."
Target Phalanx Leader (and another creature).
Phalanx Leader's Heroic triggers: put a +1/+1 counter on EACH creature you control.
Five tokens + Phalanx Leader = six creatures each get +1/+1 counters.
One {W} cantrip: six permanent +1/+1 counters. Incredible scaling.

## Commonly Confused With
- **P225 vs Battalion** — Battalion triggers when attacking with 3+ creatures. Heroic triggers when targeted by your spells.
- **P225 vs Renown** — Renown triggers when the creature deals combat damage to a player. Heroic triggers on targeting by your spells.
- **P220 (Ward)** — Ward is a protection trigger that counters opponent's targeting spells. Heroic is a trigger that REWARDS your own targeting spells.
