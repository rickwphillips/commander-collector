---
id: p044
name: Epic — Permanent No-Cast Lock and Upkeep Copy
category: stack
cr_refs: [702.50a, 702.50b, 707.10]
tags: [epic, no-cast, lock, upkeep, copy, delayed-trigger, sorcery, cant-cast, saviors-of-kamigawa]
created: 2026-03-28
examples_count: 2
---

# P044 — Epic — Permanent No-Cast Lock and Upkeep Copy

## Abstract
Epic creates two effects: a permanent "you can't cast spells" restriction for the rest of the game, and a delayed triggered ability that copies the epic spell at each of your upkeeps. The no-cast restriction is permanent and applies even to instants. However, it only prevents CASTING — effects that put spells on the stack without casting (such as the epic ability's own copies) still function. The upkeep copies can have their targets changed each time they trigger.

## The Definitive Rule

**CR 702.50a** (verbatim): *"Epic represents two spell abilities, one of which creates a delayed triggered ability. 'Epic' means 'For the rest of the game, you can't cast spells,' and 'At the beginning of each of your upkeeps for the rest of the game, copy this spell except for its epic ability. If the spell has any targets, you may choose new targets for the copy.'"*

**CR 702.50b** (verbatim): *"A player can't cast spells once a spell with epic they control resolves, but effects (such as the epic ability itself) can still put copies of spells onto the stack."*

## The Pattern

```
EPIC CREATES TWO EFFECTS ON RESOLUTION:

  EFFECT 1: PERMANENT NO-CAST RESTRICTION
    "You can't cast spells for the rest of the game"
    → ALL spells: instants, sorceries, creatures, everything
    → This restriction is on the PLAYER, not the zone
    → Applies even to future turns, opponent's turns (if you had instants)
    → Cannot be undone (no way to remove this effect in standard play)
    → Still applies after the epic card leaves the battlefield

  EFFECT 2: DELAYED TRIGGERED ABILITY
    "At the beginning of each of your upkeeps, copy this spell"
    → Copy is placed on the stack without casting (CR 702.50b)
    → Copy doesn't have the epic ability (so copies don't cause more copies)
    → You may choose new targets for the copy each upkeep
    → "The rest of the game" = for all future turns, including extra turns

WHAT YOU CAN STILL DO:
  ✓ Activate abilities (equip, loyalty abilities, {T} abilities)
  ✓ Take special actions (turn morph face-up, etc.)
  ✓ Effects put copies of spells onto the stack (the epic ability does this)
  ✓ Triggered abilities trigger and go on stack normally
  ✓ Replacement effects apply normally
  ✗ Cast any spell from any zone (hand, graveyard via flashback, etc.)

COPIES DON'T COPY THE EPIC ABILITY:
  "Copy this spell except for its epic ability"
  The copy is the original spell without epic
  → Resolving the copy won't add another "can't cast spells" restriction
  → Resolving the copy won't create more upkeep copies
  → The copy just does what the original spell does (minus epic)

TIMING OF COPIES:
  At the beginning of each of your upkeeps
  The copy is put on stack → priority → you can respond to the copy (with what?
    you can't cast, but opponents can counter the copy, etc.)
  Choose new targets for the copy at this point (when trigger creates the copy)
  Actually: targets for the copy are chosen when the copy is put on the stack
    (same as all copies — you choose targets when putting on stack per 603.3d)
```

## Definitive Conclusions

- **Epic's no-cast restriction is permanent and total.** You can never cast a spell again for the rest of the game after resolving an epic spell.
- **Activated abilities, triggered abilities, and special actions still work.** Only casting is blocked.
- **The upkeep copies bypass the cast restriction.** They're put on the stack, not cast.
- **Copies don't re-trigger more copies.** The copy lacks the epic ability.
- **New targets can be chosen each upkeep.** The copy of the epic spell doesn't have to hit the same target every turn.
- **The restriction persists even if the epic card leaves the battlefield.** It's on the player, not the permanent.

## Canonical Example
**Eternal Dominion (epic, steal best permanent each upkeep):**
You cast Eternal Dominion (search opponent's library for permanent with highest CMC, put under your control). Epic resolves. You can't cast spells for the rest of the game. Each upkeep: copy of Eternal Dominion goes on stack, you choose targets (can pick different opponents' permanents each turn). The copies can be countered by opponents. But each turn you choose: target a different player, target a different permanent type. You lose the ability to cast, but gain a repeating steal engine.

**Example 2 — No-cast applies to instants:**
After resolving an epic spell, opponent attacks. You have Fog in hand. You CANNOT cast Fog — you can't cast any spells. The no-cast restriction applies to all spell types, including instants. You can only prevent damage via activated abilities, triggered abilities, or static effects that are already on the battlefield.

## Commonly Confused With
- **P021 (Casting Restriction Hard Lock)** — Epic creates a similar lock to Knowledge Pool + Teferi but on the CASTER themselves. P021 is about lock conditions preventing everyone from casting; P044 is a self-imposed permanent lock.
- **P026 (Split Second)** — Split Second temporarily prevents casting; Epic permanently prevents it. Same category of cast restriction, different scope.
