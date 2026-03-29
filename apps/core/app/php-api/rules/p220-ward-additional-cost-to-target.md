---
id: p220
name: Ward — Triggered Counter Unless Additional Cost Paid When Targeted
category: triggered
cr_refs: [702.20a, 702.20b, 702.20c]
tags: [ward, targeting-protection, additional-cost, triggered-counter, Sheoldred, Wandering-Emperor, protection-light]
created: 2026-03-28
examples_count: 2
---

# P220 — Ward — Triggered Counter Unless Additional Cost Paid When Targeted

## Abstract
Ward is a triggered ability: whenever this permanent becomes the target of a spell or ability an opponent controls, the spell/ability is countered unless that opponent pays the ward cost. Ward acts as a "tax" on targeting — opponents can still target it, but they must pay extra (mana, life, discard, etc.) or the spell is countered. Unlike Hexproof (which prevents targeting entirely), Ward allows targeting but penalizes it. If multiple ward abilities exist on the same permanent, each triggers separately when targeted — opponents must pay each ward cost or the spell is countered for each unpaid ward.

## The Definitive Rules

**CR 702.20a** (verbatim): *"Ward is a triggered ability. 'Ward [cost]' means 'Whenever this permanent becomes the target of a spell or ability an opponent controls, counter that spell or ability unless that opponent pays [cost].'"*

**CR 702.20b** (verbatim): *"A permanent can have multiple instances of ward. Each triggers separately."*

**CR 702.20c** (verbatim): *"Ward doesn't trigger when the permanent is targeted by a spell or ability that its controller controls."*

## The Pattern

```
WARD TRIGGER:
  Triggers: "whenever this permanent becomes the target of a spell or ability an opponent controls"
  Effect: counter the spell/ability unless opponent pays the ward cost
  The opponent pays the cost as part of resolving the ward trigger
  If they don't pay: the targeting spell/ability is countered (goes to graveyard if spell)

WARD + OWN TARGETING:
  Ward only triggers on OPPONENT'S targeting (CR 702.20c)
  YOU can target your own permanent normally — no ward trigger
  Useful: self-buff, self-protection spells ignore ward on your own permanents

WARD + MULTIPLE WARD:
  Multiple ward abilities: each triggers separately when targeted
  Example: "Ward {1}" and "Ward {2}" on same creature:
  Target it: BOTH ward triggers go on the stack
  Opponent must resolve each: pay {1} AND pay {2} = {3} total, or the spell is countered
  Each ward trigger independently can counter the spell if its cost isn't paid

WARD + HEXPROOF COMPARISON:
  Hexproof: can't be targeted at all by opponent's spells/abilities
  Ward: CAN be targeted, but costs extra (or spell is countered)
  Ward leaves a window: if opponent is rich in mana, they can still kill it
  Hexproof is "harder" protection; Ward is softer (taxing)

WARD + COST TYPES:
  Ward {2}: pay 2 generic mana
  Ward {U}: pay 1 blue mana
  Ward—discard a card: discard as the cost
  Ward—pay 3 life: pay life as the cost
  Ward {2}{B}: pay 2 generic + 1 black
  Sheoldred, the Apocalypse: Ward {2} — pay {2} or lose the targeting spell

WARD + COPYING:
  If a spell that targeted a warded permanent is countered by ward: it's countered
  But if the targeting spell had already created a copy (e.g., via Twincast): the copy is a different spell
  Ward counters the ORIGINAL targeting spell (when ward trigger resolves)
  The copy might not have been the target yet (Twincast creates a new spell targeting separately)

WARD + FLASH:
  If a warded permanent is given ward at instant speed (enchantment, effect):
  Ward triggers on the NEXT targeting, not on targetings that already happened
  Ward is a static ability — once it's on the permanent, all future targeted spells/abilities trigger it

WARD + EQUIP:
  Equip is an activated ability: "Equip {cost}: attach to target creature you control."
  Ward only triggers on OPPONENT'S targeting — equipping to YOUR OWN warded creature doesn't trigger ward
  Equipping to OPPONENT'S warded creature (if somehow legal) would trigger ward

WARD IN COMMANDER:
  Ward makes commanders harder to remove efficiently
  Sheoldred, the Apocalypse has Ward {2}: Doom Blade costs effectively {1}{B}+{2}={1}{B}{2}
  In long Commander games: the ward tax adds up — opponents burn mana to remove it

WANDERING EMPEROR (Ward variant):
  Wandering Emperor has flash and a +1/+1 counter ability with ward-like protection
  Example: "Ward—sacrifice a permanent" — sacrifice something or lose the targeting spell
  Extremely punishing ward: sacrificing your own permanents to protect the Emperor

SHEOLDRED, THE APOCALYPSE:
  {2}{B}{B}: 4/5 Phyrexian legendary creature
  "Whenever you draw a card, you gain 2 life."
  "Whenever an opponent draws a card, they lose 2 life."
  Ward {2}: pay {2} or the targeting spell is countered.
  In Legacy/Modern: 4/5 plus life swing per draw makes Sheoldred an absolute must-kill
  But Ward {2} makes removing it cost 2 extra mana — often they can't until turn 5+
```

## Definitive Conclusions

- **Ward triggers when an opponent's spell/ability targets the permanent**; countered unless ward cost paid.
- **Own targeting doesn't trigger ward** — you can freely target your own warded permanents.
- **Multiple ward instances**: each triggers independently — pay all or any can counter the spell.
- **Ward is softer than hexproof** — opponents can still target by paying the cost.
- **Various ward costs**: mana, life, discarding, sacrificing — each creates different pressures.

## Canonical Example
**Sheoldred, the Apocalypse (Ward {2}) in Modern:**
Opponent casts Fatal Push ({B}): "destroy target creature with mana value 2 or less."
Sheoldred has mana value 4 — Fatal Push can't target it due to mana value restriction (not ward).
Opponent casts Doom Blade ({1}{B}): target Sheoldred.
Ward trigger: counter Doom Blade unless opponent pays {2}.
Opponent is tapped out except for {1}{B} used for Doom Blade.
They can't pay {2}: Doom Blade is countered. Sheoldred survives.
Next turn: opponent has {1}{B}{2} = {1}{B} + 2 mana ready. They can use Doom Blade and pay Ward.
The Ward {2} bought one turn of protection — often enough to generate critical value.

**Example 2 — Ward—Discard (Wandering Emperor style):**
Opponent controls a creature with "Ward—discard a card."
Your opponent casts Doom Blade targeting that creature.
Ward triggers: "counter Doom Blade unless Doom Blade's controller discards a card."
Your opponent has 5 cards. They discard one.
Doom Blade resolves and destroys the creature.
Ward—discard is MUCH more punishing: in late game with few cards, the discard cost is prohibitive.
Sometimes: opponent can't/won't pay Ward and the removal spell fails.

## Commonly Confused With
- **P103 (Hexproof)** — Hexproof prevents targeting entirely. Ward allows targeting but counters the spell if cost isn't paid.
- **P201 (Protection)** — Protection also prevents targeting (and damage/enchanting/blocking). Ward is only targeting protection with a payment option.
- **P186 (Disguise)** — Disguise's face-down state has Ward {2}; it's the same Ward mechanic applied to a specific game state.
