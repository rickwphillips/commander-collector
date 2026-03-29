---
id: p202
name: Trample + Deathtouch — Assigning 1 Damage Is Lethal
category: combat
cr_refs: [702.19b, 702.2b, 510.1c, 510.1d]
tags: [trample, deathtouch, combat-damage, lethal-damage, one-damage, assignment, Lotleth-Troll, Ochre-Jelly]
created: 2026-03-28
examples_count: 2
---

# P202 — Trample + Deathtouch — Assigning 1 Damage Is Lethal

## Abstract
Trample normally requires a creature to assign "lethal damage" to each blocker before routing excess to the defending player. Normally, "lethal damage" equals the blocker's toughness minus current damage on it. But when the attacking creature also has Deathtouch, any nonzero damage is lethal — so even 1 damage satisfies the trample "lethal damage" assignment. A Trample + Deathtouch creature assigns 1 damage to each blocker, then routes all remaining damage to the defending player. This combination is extremely efficient at defeating chump blocks.

## The Definitive Rules

**CR 702.19b** (verbatim): *"The controller of an attacking creature with trample first assigns damage to the creature or creatures blocking it. Once all those blocking creatures are assigned lethal damage, any remaining damage is assigned as its controller chooses among those blocking creatures and the player or planeswalker the creature is attacking."*

**CR 702.2b** (verbatim): *"A creature with toughness greater than 0 that's been dealt damage by a source with deathtouch since the last time state-based actions were checked will be destroyed as a state-based action. See rule 704."*

**CR 510.1c** (verbatim): *"A blocking creature's controller assigns damage for it in the same way an attacking creature's controller assigns damage, except that the blocking creature must assign lethal damage to each of the creatures it's blocking before assigning any damage to other creatures it's blocking."*

**CR 510.1d** (verbatim): *"If a creature has deathtouch, all damage is considered lethal. See rules 702.2 and 704.5h."*

## The Pattern

```
TRAMPLE + DEATHTOUCH INTERACTION:
  Trample rule: assign lethal damage to each blocker, then excess damage to player/planeswalker
  Deathtouch rule: ANY nonzero damage from a deathtouch source = lethal to a creature
  Combined: 1 damage to each blocker = "lethal" damage (per deathtouch rule)
  → After assigning 1 to each blocker, ALL remaining power goes through to the player

  EXAMPLE CALCULATION:
    5/5 Trample + Deathtouch attacker, blocked by three 1/1 tokens:
    Normal (no deathtouch): must assign 1+1+1=3 damage to kill blockers, 2 goes through
    With deathtouch: assign 1+1+1=3 damage (1 each = "lethal" per deathtouch), 2 goes through
    Same result here because the tokens die to 1 damage anyway!

    5/5 Trample + Deathtouch attacker, blocked by three 3/3 creatures:
    Normal (no deathtouch): must assign 3+3+3=9 damage to blockers, 0 goes through (only 5 power)
    With deathtouch: assign 1+1+1=3 damage (1 = lethal per deathtouch), 2 damage goes to player!
    Deathtouch gives 2 "free" damage through, plus ALL three 3/3s die to 1 damage each.
    MASSIVE swing: normally 0 damage through, with deathtouch combo = 2 damage + 3 creatures die.

  ASSIGNMENT RULES:
    Must assign AT LEAST 1 damage to each blocker (can't assign 0 to any blocker)
    Can assign MORE than 1 to a blocker (strategic choice)
    But minimum is 1 (with deathtouch, 1 = lethal)
    Example: want to kill one specific 8/8 blocker more definitively? Assign 4 to it + 1 to others

  DEATHTOUCH + TRAMPLE + MULTIPLE BLOCKERS:
    Each blocker needs exactly 1 damage assigned (minimum lethal)
    N blockers → assign N damage total (1 each), (Power - N) damage goes through
    If Power ≤ N: all damage must go to blockers, 0 goes through (not enough for all blockers + player)
    Exception: 0/X blockers with 0 toughness? Normally toughness ≤ 0 is handled by SBAs, but...
    In practice: you have enough power to deal 1 to each if you have any blockers

  TRAMPLE + DEATHTOUCH + REGENERATION:
    Regenerating blocker: takes 1 damage (lethal via deathtouch), SBAs would destroy it
    But regeneration triggers: blocker regenerates (tap, remove damage, leave combat)
    Does the trample damage "go through" to the player? The blocker was assigned lethal damage...
    Key ruling: the assignment rules happen simultaneously at damage step
    If the regenerated blocker stays alive (healed), the 1 damage assigned to it was still dealt
    Trample says "after assigning lethal damage to each blocker": the 1 damage IS the lethal assignment
    Trample damage to player = remaining after lethal assigned to all blockers
    Regeneration doesn't undo trample damage going through

  TRAMPLE + DEATHTOUCH + INDESTRUCTIBLE BLOCKER:
    Indestructible blocker: takes 1 damage (deathtouch lethal), but indestructible = not destroyed
    Is 1 damage still "lethal"? CR 510.1d says "all damage is considered lethal" for deathtouch
    But indestructible means it won't die despite being "dealt lethal damage"
    The assignment rule: only need to assign LETHAL damage per CR 510.1c/d
    So: assign 1 to the indestructible blocker (lethal per deathtouch) → excess tramples through
    The indestructible blocker doesn't die, but the trample damage DOES go through
    This is the key ruling — deathtouch + trample bypasses indestructible blockers for trample!

NOTABLE CARDS:
  Vorinclex, Voice of Hunger (Trample + "opponents can't untap if damaged")
  Progenitor Mimic with deathtouch source
  Lotleth Troll: can gain trample; no natural deathtouch but combo with Basilisk Collar
  Basilisk Collar: equipment that gives deathtouch AND lifelink
  Ochre Jelly (splits when blocked by multiple)
  Any creature + Basilisk Collar = trample + deathtouch combo
```

## Definitive Conclusions

- **Trample + Deathtouch**: assigning 1 damage to each blocker is legally "lethal" (per deathtouch).
- **All remaining power tramples through** after assigning 1 to each blocker.
- **Kills large blockers** cheaply — a 1/1 blocker and a 10/10 blocker each only need 1 damage.
- **Against indestructible blockers**: still assign 1 (lethal per deathtouch rule), excess tramples through.
- **Basilisk Collar** is the easiest way to give any creature both deathtouch and lifelink.

## Canonical Example
**Inferno Titan (6/6 trample, some fire abilities) vs. three 2/2 blockers:**
Without deathtouch: must assign 2+2+2=6 to blockers, 0 damage to player.
Add Basilisk Collar (deathtouch): assign 1+1+1=3, 3 damage to player.
Three 2/2s all die to 1 damage (deathtouch), AND 3 damage goes to player/planeswalker.
Basilisk Collar transform any trampling creature into "can't be chump blocked for free."

**Example 2 — Indestructible Blocker:**
6/6 Trample + Deathtouch attacker. Opponent blocks with Darksteel Colossus (indestructible).
Assign 1 damage to Darksteel Colossus (lethal per deathtouch, but indestructible so it survives).
5 remaining power → 5 damage to player.
Darksteel Colossus doesn't die. But player takes 5 damage.
Without deathtouch: would need to assign 11 damage to Darksteel Colossus (toughness 11), can't trample.

## Commonly Confused With
- **P105 (Deathtouch)** — Deathtouch alone (without trample) kills blockers but excess damage still stops at blockers.
- **P160 (Annihilator)** — Annihilator forces sacrifice before blockers. Trample+Deathtouch routes damage through to player after combat damage assignment.
- **P104 (Indestructible)** — Indestructible prevents death from deathtouch damage. BUT trample still gets excess through when assigning 1 (lethal per deathtouch) to the indestructible blocker.
