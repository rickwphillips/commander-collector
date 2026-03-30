---
id: p215
name: Storm — Copy Count from Spells Cast This Turn
category: stack
cr_refs: [702.40a, 702.40b]
tags: [storm, copy, storm-count, grapeshot, Tendrils-of-Agony, Mind-Stump, Ad-Nauseam, storm-combo]
created: 2026-03-28
examples_count: 2
---

# P215 — Storm — Copy Count from Spells Cast This Turn

## Abstract
Storm triggers when you cast a spell: "copy this spell for each other spell cast this turn before it." Storm is one of the most explosive mechanics in MTG — decks built around it (Legacy Storm, Vintage Storm) win by casting a chain of cheap cantrips, rituals, and artifact draws in a single turn to build storm count, then cast a storm "payoff" (Tendrils of Agony, Grapeshot) with 10+ storm count. Each copy is an independent spell that can deal damage, drain life, etc. Storm is banned or restricted in most formats for being too powerful with the right enablers.

## The Definitive Rules

**CR 702.40a** (verbatim): *"Storm is a triggered ability. When you cast a spell with storm, it triggers. 'Storm' means 'When you cast this spell, copy it for each other spell that was cast before it this turn. If the spell has any targets, you may choose new targets for any of the copies.'"*

**CR 702.40b** (verbatim): *"If a spell has storm and other abilities that trigger when it's cast, the storm trigger is put on the stack last. The storm copies are put on the stack immediately when the storm trigger resolves."*

## The Pattern

```
STORM COUNT:
  Storm count = number of spells cast this turn BEFORE this storm spell
  "This turn" means the entire current turn — includes ALL spells by ALL players
  Spells cast by opponents (in response) before the storm spell also count
  Example: on your turn, cast 5 spells, opponent casts 1 in response = 6 total before your storm spell
  Your storm spell: copies 6 times
  Copies are NOT "cast" and don't increase storm count for later storm spells
  Countered spells and spells from non-hand zones (escape, flashback) DO count (Gatherer 2022-12-08)

STORM COPIES:
  Each copy is a separate spell on the stack (created when storm trigger resolves)
  Copies can be responded to individually
  Copies don't trigger storm again (they're copies, not new storm spells being "cast")
  Copies can have new targets chosen (CR 702.40a: "you may choose new targets for any copies")

STORM + GRAPESHOT:
  Grapeshot ({1}{R}): "Deal 1 damage to any target."
  Storm trigger: copy for each prior spell this turn.
  10 spells cast this turn before Grapeshot → 10 copies → 11 total instances of Grapeshot
  11 × 1 damage = 11 damage distributed to targets = kill opponent (starting at 20 life)
  With 20 storm count: kill from 20 life in one turn

STORM + TENDRILS OF AGONY:
  Tendrils of Agony ({2}{B}{B}): "target player loses 2 life and you gain 2 life."
  Storm copies: each copy also drains 2 life.
  10 storm count: 11 instances of drain = 22 life lost / 22 life gained.
  "Achieving storm" in Legacy Storm: cast cheap spells to hit 10 storm count, then Tendrils.

STORM COMBO SEQUENCE (Legacy ANT — Ad Nauseam Tendrils):
  Turn 1 or 2: play Lotus Petal, Dark Ritual, Dark Ritual, Lion's Eye Diamond...
  Cast Infernal Tutor for Tendrils, then cast Ad Nauseam (draw cards off life loss)...
  Full storm sequence can produce 15-20 spells cast in one turn
  Final spell: Tendrils of Agony with storm count ~10 = game over

STORM + RESPONDING:
  Storm trigger goes on the stack when the storm spell is cast
  Before storm trigger resolves: opponent can counter the original storm spell
  If original spell is countered: storm trigger is still on the stack!
  Storm trigger resolves: copies are made (even though original was countered)
  Wait: storm trigger "copy it" — can you copy a countered spell?
  If the original spell was countered (moved to graveyard), the storm trigger references "it"
  The storm trigger is a triggered ability that fires when the spell was CAST
  When storm trigger resolves: the copies are created from the original spell's characteristics (still accessible)
  So: countering the original storm spell doesn't stop the copies!
  Rule: counter the copies before they resolve (flusterstorm is designed for this).
  To prevent all storm copies: counter the original before storm trigger is put on stack, OR counter all copies.

FLUSTERSTORM (countering storm):
  Flusterstorm ({U}): "Counter target instant or sorcery spell. Storm."
  Cast Flusterstorm with storm → copies of Flusterstorm are created (one per spell cast this turn)
  Each Flusterstorm copy can counter one spell
  Counter the original storm spell + all copies with multiple Flusterstorm copies
  This is the main anti-storm technology in Legacy

STORM + BUYBACK:
  Cast a buyback storm spell: original storm spell resolves, returns to hand (if buyback paid)
  Storm copies were already created before resolution
  The copies don't benefit from buyback (no cost was paid for them)
```

## Definitive Conclusions

- **Storm copies one spell per spell cast this turn** before the storm spell.
- **Storm count includes all players' spells** cast this turn before the storm spell.
- **Countering the original doesn't stop copies** — storm trigger was already put on stack.
- **Flusterstorm counters all** by creating a counter for each storm copy.
- **Grapeshot/Tendrils** are the primary storm payoffs — 10+ storm count wins most games.

## Canonical Example
**Turn 4, Storm player:**
Spells cast this turn before Grapeshot:
1. Simian Spirit Guide (exile for {R})
2. Rite of Flame ({R} add {R}{R})
3. Cabal Ritual ({B}{B} add {B}{B}{B})
4. Dark Ritual ({B} add {B}{B}{B})
5. Manamorphose ({1}{R/G} add 2 mana, draw 1)
6. Gitaxian Probe ({U/P}: draw 1)
7. Gitaxian Probe (another)
8. Cabal Therapy (flash into graveyard for {B})
Storm count: 8 spells before Grapeshot.
Cast Grapeshot: 8 copies + original = 9 instances of "deal 1 damage to any target."
Direct to opponent's face: 9 damage. Not quite lethal.
Need 2 more spells in the chain for a 11-damage kill.

**Example 2 — Flusterstorm Defense:**
Opponent's storm turn, storm count is 8. They cast Tendrils of Agony.
Storm trigger goes on stack: "create 8 copies of Tendrils."
You have Flusterstorm in hand ({U}).
Cast Flusterstorm targeting the ORIGINAL Tendrils spell.
Storm count for Flusterstorm = 9 (the 8 prior spells + Tendrils). Storm trigger creates 9 copies of Flusterstorm.
Total: 10 Flusterstorms (1 original + 9 copies). Need to counter: 1 original Tendrils + 8 Tendrils copies = 9 targets.
Assign each of the 10 Flusterstorms to a Tendrils target (one is extra). Counter all 9 Tendrils = entire storm chain stopped.
Note: Flusterstorm does NOT count its own casting in storm — only spells cast BEFORE it. (Gatherer ruling 2022-12-08)
Flusterstorm is the premier Storm hate in Legacy precisely for this property.

## Commonly Confused With
- **P101 (Replicate)** — Replicate copies for each PAID cost; Storm copies for each PRIOR spell. Both create copies but via different mechanisms.
- **P177 (Casualty)** — Casualty creates one copy by sacrificing a creature. Storm creates N copies based on prior spells.
- **P156 (Cascade)** — Cascade casts a free spell; storm creates copies of the storm spell itself.
