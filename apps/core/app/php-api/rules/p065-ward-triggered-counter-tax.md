---
id: p065
name: Ward — Triggered Counter Tax
category: triggered
cr_refs: [702.21a, 702.21b]
tags: [ward, trigger, counter, tax, targeting, opponent, cost, hexproof-variant, X-ward]
created: 2026-03-28
examples_count: 2
---

# P065 — Ward — Triggered Counter Tax

## Abstract
Ward triggers whenever an opponent targets the permanent with a spell or ability. When it resolves, the spell or ability is countered unless the opponent pays the ward cost. Ward is NOT the same as hexproof — the permanent CAN be targeted, and the spell/ability DOES go on the stack. Ward creates a triggered ability that gives opponents a chance to pay the tax. If the tax is not paid, the spell/ability is countered. Multiple ward abilities on the same permanent stack.

## The Definitive Rule

**CR 702.21a** (verbatim): *"Ward is a triggered ability. Ward [cost] means 'Whenever this permanent becomes the target of a spell or ability an opponent controls, counter that spell or ability unless that player pays [cost].'"*

**CR 702.21b** (verbatim): *"Some ward abilities include an X in their cost and state what X is equal to. This value is determined at the time the ability resolves, not locked in as the ability triggers."*

## The Pattern

```
WARD SEQUENCE:
  1. Opponent casts spell or activates ability that targets this permanent
  2. Spell/ability goes on the stack normally (ward is triggered, not preventative)
  3. Ward trigger fires and goes on the stack ABOVE the targeting spell/ability
  4. Players pass priority
  5. Ward trigger resolves:
     → Counter the targeting spell/ability UNLESS the opponent pays [cost]
     → If opponent pays: targeting spell/ability remains on stack, resolves normally
     → If opponent doesn't pay: targeting spell/ability is countered

WARD IS TRIGGERED (NOT REPLACEMENT):
  The targeting spell/ability IS placed on the stack — ward doesn't prevent targeting
  Ward is different from hexproof/shroud:
    Hexproof/shroud: can't be targeted at all (prevention)
    Ward: can be targeted, but there's a cost to make it stick
  Opponents can target wards permanent (the spell goes on stack) then choose not to pay
    (Perhaps to "waste" the ward trigger — they announce target, ward triggers, they don't pay)
    Actually: an opponent can't target something they know will fail — wait
    Ward doesn't make the spell fizzle before targeting; it counters after targeting
    So opponent intentionally targeting to waste a "when targeted" trigger can still trigger ward

MULTIPLE WARD INSTANCES:
  If a permanent has "Ward {2}" and "Ward {3}":
    Both trigger when targeted by opponent
    Both triggers go on the stack
    To make the spell stick: opponent must pay BOTH ward costs separately
    Pay Ward {2} → that trigger resolved; spell still on stack
    Pay Ward {3} → that trigger resolved; spell resolves
  Ward triggers are independent; must satisfy each one

X IN WARD:
  "Ward X, where X is this creature's power" (CR 702.21b)
  X is determined at TIME OF RESOLUTION, not when triggered
  If the creature's power changes between triggering and resolving:
    Use the power at resolution time
  This can be relevant with pump spells in response

WARD DOESN'T HELP AGAINST:
  Non-targeting effects (Wrath of God doesn't target → ward irrelevant)
  Your own spells (ward only triggers for opponent's spells/abilities)
  "Each" effects (overloaded Cyclonic Rift doesn't target → no ward trigger)
  Abilities you control targeting the permanent

WHAT GETS COUNTERED:
  If ward tax not paid: the targeting spell/ability is countered
  "Can't be countered" spells that target warded permanent:
    Ward trigger fires, tries to counter → can't (spell has protection)
    Ward effectively does nothing against uncounterable spells
```

## Definitive Conclusions

- **Ward is a triggered ability, not prevention.** Opponents CAN target warded permanents; the spell goes on the stack.
- **Ward counters the targeting spell/ability if the cost isn't paid.** No payment → countered.
- **Multiple ward instances require paying each separately.** Two ward triggers = two costs to pay.
- **Ward's X is determined at resolution.** If power changes between trigger and resolution, use the new value.
- **Ward doesn't stop overloaded/non-targeting effects.** Only protects against targeted spells/abilities.

## Canonical Example
**Hexdrinker (ward {2} once leveled):**
Opponent casts Lightning Bolt targeting Hexdrinker. Ward triggers, goes on stack above Lightning Bolt. Ward trigger resolves: counter Lightning Bolt unless opponent pays {2}. Opponent pays {2} — Lightning Bolt stays on stack, deals 3 damage to Hexdrinker.

**Example 2 — Ward X:**
Creature has "Ward — pay life equal to this creature's power." Creature is currently a 4/4. Opponent targets it. Ward triggers. In response, opponent plays Giant Growth on the creature (they might even be doing this to be tricky). Ward resolves: creature is now 7/7 — opponent must pay 7 life or the targeting spell is countered. (This is an extreme edge case — usually the warded creature's power doesn't change before ward resolves.)

## Commonly Confused With
- **P027 (Protection — DEBT)** — Protection's T prevents targeting entirely. Ward allows targeting but creates a triggered counter-unless-you-pay. Uncounterable spells bypass ward; protection's T prevents the targeting itself.
- **P008 (Can't vs. May)** — "Can't be countered" + ward: ward triggers but can't counter the uncounterable spell → ward has no effect.
