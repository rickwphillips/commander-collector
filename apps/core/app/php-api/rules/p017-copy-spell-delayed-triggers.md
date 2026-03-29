---
id: p017
name: Copy Spell Delayed Triggers
category: stack
cr_refs: [707.10, 707.2, 603.7, 707.10a]
tags: [copy, spell-copy, delayed-trigger, hive-mind, pact, upkeep, lose-the-game, stack, APNAP]
created: 2026-03-28
examples_count: 1
---

# P017 — Copy Spell Delayed Triggers

## Abstract
A copy of a spell on the stack is treated as the spell itself for all purposes. When it resolves, it executes every part of the original spell's resolution — including creating delayed triggered abilities. Words like "you" in a copy refer to the controller of that copy, not the controller of the original. This means if the original spell creates an upkeep obligation ("at the beginning of your next upkeep, pay X or lose"), each opponent who controls a copy of that spell acquires their own independent upkeep obligation.

## The Definitive Rule

**CR 707.2**: *"When copying an object, the copy acquires the copiable values of the original object's characteristics and, for an object on the stack, choices made when casting or activating it..."*

**CR 707.10**: *"To copy a spell, activated ability, or triggered ability means to put a copy of it onto the stack... A copy of a spell is owned by the player who controls it."*

**CR 707.10a**: *"A copy of a spell or ability is controlled by the player who activated or triggered the copy."*

**CR 603.7**: Delayed triggered abilities are created during resolution of a spell or ability. Each copy that resolves creates its own delayed triggered ability independently.

**Hive Mind ruling (2009-10-01)**: *"If a copy says that it affects 'you,' it affects the controller of the copy, not the controller of the original spell."*

## The Pattern

```
WHEN a copy of a spell resolves:
  ✓ All spell effects execute as if it were the original
  ✓ Delayed triggered abilities are created for the copy's controller
  ✓ "You" = controller of the copy
  ✓ "Your next upkeep" = controller of the copy's next upkeep
  ✓ Each copy creates a fully independent obligation

HIVE MIND + PACT sequence:
  1. Player A casts Pact of Negation
  2. Hive Mind triggers — each other player gets a copy
  3. Copies resolve in LIFO/APNAP order (last placed = first resolved)
  4. Each copy resolves: counters target (or fails), creates upkeep trigger
  5. "At the beginning of YOUR next upkeep, pay {3}{U}{U} or lose"
     → "your" = each respective copy controller
  6. Original Pact resolves last for Player A
  Result: every opponent has a Pact upkeep obligation they can't pay
```

## Definitive Conclusions

- **Copies create delayed triggers.** A copy of Pact of Negation resolves like the original — including the "pay or lose" delayed trigger for the copy's controller.
- **"You" refers to the copy's controller.** Upkeep obligations bind the player who controlled the copy, not the player who cast the original.
- **Each copy is independent.** Three opponents each get their own obligation on their own next upkeep — not a shared trigger.
- **Hive Mind trigger resolves before the original spell.** Copies are placed on the stack (APNAP from left of active player), resolve in LIFO order, then the original resolves last.
- **Hive Mind copies are NOT "cast."** CR ruling: "The copies that Hive Mind's ability creates are created on the stack, so they're not 'cast.' Abilities that trigger when a player casts a spell won't trigger." Hive Mind does not chain.
- **Counterspelling the original** does not prevent the delayed triggers from the copies — those already resolved.

## Canonical Example
**Hive Mind + Pact of Negation (Commander kill):**
Player A has Hive Mind on the battlefield. Casts Pact of Negation in a 4-player game. Hive Mind triggers; opponents B, C, D each get a copy. Each copy resolves, creating an upkeep obligation for its controller. At each opponent's next upkeep, if they can't pay {3}{U}{U}, they lose. In a Commander pod without blue mana, this wins on the spot.

**Hive Mind + Slaughter Pact (opponent's creatures die):**
Any opponent casting an instant or sorcery triggers Hive Mind. Cast Slaughter Pact targeting an opponent's creature; opponents each get a copy and must target a creature (their own, if required by targeting rules). Each pays next upkeep or loses.

## Commonly Confused With
- **P012 (Recursive Replacement)** — P012 is about replacement effects re-applying to their own output. This pattern is about copies creating independent obligations via delayed triggers.
- **P003 (Zone Change Identity)** — P003 covers how objects lose identity crossing zones. Copies are never "the same object" as the original — they're always distinct objects on the stack.
- **P011 (Linked Ability Zone Reset)** — Linked abilities are about ETB/LTB pairs on the same object. Copies of spells that create delayed triggers are not "linked" to anything — the delayed trigger is created fresh during resolution.
