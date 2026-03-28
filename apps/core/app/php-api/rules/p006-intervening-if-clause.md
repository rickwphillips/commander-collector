---
id: p006
name: Intervening If Clause
category: triggered
cr_refs: [603.4]
tags: [triggered, condition, if-clause, upkeep, state-check, double-check, felidar, win-condition]
created: 2026-03-28
examples_count: 3
---

# P006 — Intervening If Clause

## Abstract
A triggered ability written as "When/Whenever/At [event], **if [condition]**, [effect]" checks the condition TWICE: once at trigger time (to decide whether to trigger at all) and once at resolution (to decide whether to do anything). Both checks must pass. This is not true of all "if" clauses — only those that immediately follow the trigger word.

## The Definitive Rule

**CR 603.4 verbatim:**
*"A triggered ability may read 'When/Whenever/At [trigger event], if [condition], [effect].' When the trigger event occurs, the ability checks whether the stated condition is true. The ability triggers only if it is; otherwise it does nothing. If the ability triggers, it checks the stated condition again as it resolves. If the condition isn't true at that time, the ability is removed from the stack and does nothing."*

This is called the **"intervening 'if' clause"** rule.

**Important scope**: This rule ONLY applies when the "if" immediately follows a trigger condition. An "if" elsewhere in a card's text is just normal conditional logic with one check.

## The Pattern

```
Format: "When/Whenever/At [TRIGGER EVENT], if [CONDITION], [EFFECT]"

CHECK 1 — At trigger time:
  IF condition is true: ability triggers, goes on stack
  IF condition is false: ability does NOT trigger (nothing happens)

CHECK 2 — At resolution:
  IF condition is still true: effect resolves normally
  IF condition is now false: ability is removed from stack, does nothing

NOTE: The ability CAN be responded to between the two checks.
A savvy opponent can change the condition between check 1 and check 2 to fizzle the effect.
```

## Definitive Conclusions

- **If condition is false at trigger time**: The ability never triggers. It does NOT go on the stack at all. No way to make it resolve.
- **If condition becomes false by resolution time**: The ability is on the stack but removed without effect. The condition window is fully in play.
- **Opponent can interact**: Between check 1 (trigger placed on stack) and check 2 (resolution), both players have priority. An opponent can change the condition to fizzle the trigger.
- **Non-intervening "if" (elsewhere in text)**: Only checked once — at resolution. Example: "Target player draws 2 cards. If that player has more than 7 cards in hand, they discard down to 7" — the "if" here is checked only once at resolution, not at trigger time.

## Canonical Example (verbatim from CR 603.4):
Felidar Sovereign: "At the beginning of your upkeep, if you have 40 or more life, you win the game."
- If you have 39 life when upkeep begins: ability does NOT trigger. You can't win this way this turn.
- If you have 42 life when upkeep begins: ability triggers, goes on stack.
- Opponent uses a damage spell to bring you to 39 life before Felidar's trigger resolves.
- Trigger resolves: condition checked again — you have 39 life. Trigger fizzles. You don't win.

## Additional Examples

**Example 2 — State changes in response:**
"Whenever you cast a spell, if you have no cards in hand, draw 3 cards." You cast a spell with no cards in hand → trigger fires. Opponent has no action. Trigger resolves → still no cards in hand → draw 3. (Opponent couldn't easily change this condition between cast and resolution in this case.)

**Example 3 — Single "if" check (NOT intervening):**
"Whenever a creature enters under your control, if it has flying, put a +1/+1 counter on it." This IS an intervening-if clause. If the creature doesn't have flying when it enters, the trigger doesn't fire. If it gains flying after entering but before the trigger resolves (e.g., you give it flying in response), the second check at resolution will still see flying and the trigger fires. (Wait — the second check applies.) If the creature entered with flying (check 1: yes), loses flying before trigger resolves (check 2: no) → trigger fizzles. Correct and precise.

## Commonly Confused With
- **P002 (Replacement vs. Trigger)** — Only triggered abilities have the intervening-if clause. Replacement effects apply once at event time with no double-check.
- **P007 (Priority Windows)** — The window between check 1 and check 2 is a real priority window where opponents can interact.
