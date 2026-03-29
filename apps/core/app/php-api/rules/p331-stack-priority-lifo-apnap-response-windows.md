---
id: p331
name: The Stack and Priority — LIFO Order, APNAP, Response Windows, No Priority During Resolution
category: stack
cr_refs: [116.1, 117.1a, 117.3a, 117.3b, 117.3c, 117.4, 117.5, 117.7, 405.1, 405.2, 405.3, 405.5, 405.6, 603.3, 603.3b]
tags: [stack, priority, LIFO, APNAP, response, counter-spell, triggers, simultaneous-triggers, no-priority-during-resolution, mana-ability, special-action, SBA-first, window-to-respond, Counterspell, Doom-Blade, Stifle]
created: 2026-03-29
examples_count: 2
---

# P331 — The Stack and Priority — LIFO Order, APNAP, Response Windows, No Priority During Resolution

## Abstract
The **stack** is the zone where spells and abilities wait to resolve. It operates **LIFO** (last in, first out): the most recently added object resolves first. A player with **priority** may cast spells, activate abilities, or take special actions. After EVERY spell or ability resolves (or after a player casts/activates/takes an action), the active player gets priority again. Before priority is granted, **state-based actions** are checked, then **triggered abilities** from the stack are placed in APNAP order. **No player has priority while a spell or ability is resolving** — there is no "interrupt mid-resolution" window except for **mana abilities** (which don't use the stack at all). APNAP (Active Player, Non-Active Player) ordering determines who puts triggered abilities on the stack when multiple trigger simultaneously.

## The Definitive Rules

**CR 405.2** (verbatim): *"The stack keeps track of the order that spells and/or abilities were added to it. Each time an object is put on the stack, it's put on top of all objects already there."*

**CR 405.5** (verbatim): *"When all players pass in succession, the top (last-added) spell or ability on the stack resolves. If the stack is empty when all players pass, the current step or phase ends and the next begins."*

**CR 117.1a** (verbatim): *"A player with priority may cast spells, activate abilities, and take special actions. A player may cast a spell or take a special action any time they have priority. A player may activate an activated ability any time they have priority."*

**CR 117.3a** (verbatim): *"The active player receives priority at the beginning of most steps and phases, after any turn-based actions (see rule 703) have been dealt with and triggered abilities that triggered at the beginning of that step or phase have been put on the stack."*

**CR 117.3b** (verbatim): *"The active player receives priority after a spell or ability (other than a mana ability) resolves."*

**CR 117.3c** (verbatim): *"If a player has priority and casts a spell or activates an ability, that player receives priority again after the spell or ability is placed on the stack."*

**CR 117.4** (verbatim): *"If all players pass in succession (that is, if all players pass without taking any actions in between passing), the spell or ability on top of the stack resolves or, if the stack is empty, the phase or step ends."*

**CR 117.5** (verbatim): *"Before any player receives priority, the game checks for any of the listed conditions for state-based actions, then performs all applicable state-based actions simultaneously as a single event. If any state-based actions were performed, the check repeats; otherwise all triggered abilities that are waiting to be put on the stack are put on the stack using the APNAP order rule (see rule 101.4). These steps repeat in order until no state-based actions are performed and no triggered abilities are waiting to be put on the stack. Then the appropriate player receives priority."*

**CR 603.3b** (verbatim): *"Multiple abilities triggered at the same time are placed in APNAP order. Each player, in APNAP order, puts each triggered ability they control with a trigger condition that isn't another ability triggering on the stack in any order they choose."*

**CR 117.7** (verbatim): *"If a player casts a spell or activates an ability while another spell or ability is already on the stack, the new spell or ability has been added on top of the previous one. It will resolve first. This is informally called 'casting in response' or 'activating in response.'"*

## The Pattern

```
LIFO — LAST IN, FIRST OUT:
  The stack = a pile. Most recent item on top.
  "Resolves" = top item on stack resolves (all players passed).
  Effect: spells/abilities added LATER resolve FIRST.
  Consequence: if you respond to a spell, your response resolves before the original.
  Example: Opponent casts Doom Blade targeting your creature.
    You cast Giant Growth on your creature (in response, goes on stack above Doom Blade).
    Giant Growth resolves first: creature gets +3/+3.
    Then Doom Blade resolves: destroys "target creature you don't control."
      Does Doom Blade still work? Yes, if creature is still a legal target.
      Giant Growth didn't save the creature from Doom Blade — just gave it more P/T.
    WAIT: did Giant Growth help? Only if creature is now above Doom Blade's lethal threshold.
      If creature is now 4/4 after Giant Growth: Doom Blade still destroys it (Doom Blade says "destroy").
      Giant Growth didn't protect from destroy. You'd need a counterspell or hexproof effect.

PRIORITY SEQUENCE — WHEN DOES EACH PLAYER GET TO ACT:
  1. Step/Phase begins. Turn-based actions happen.
  2. SBAs checked, triggers placed on stack (APNAP order).
  3. Active player gets priority.
  4. Active player may: cast a spell, activate an ability, take special action, or PASS.
  5. If active player passes: non-active player(s) get priority in turn order.
  6. If ALL players pass without acting: top of stack resolves (or phase ends if empty).
  7. After resolution: SBAs checked, new triggers placed. Active player gets priority again (117.3b).
  8. Return to step 4.

  KEY: After casting/activating (117.3c): you get priority AGAIN.
    This means: you can cast multiple spells/abilities before passing.
    "I cast Thoughtseize, then cast Inquisition of Kozilek" — both go on stack before passing.
    Opponent can't counter Thoughtseize before Inquisition goes on stack (you still have priority).
    BUT: once you PASS, opponent gets to respond.

  TRIGGER TIMING (117.5):
    Before ANYONE gets priority: SBAs checked first.
    Then: triggered abilities go on stack (APNAP).
    THEN: player gets priority.
    This means: if casting a spell triggers multiple abilities, none of them can be responded to
      before they're all placed on the stack (they're all placed simultaneously in APNAP order).

NO PRIORITY DURING RESOLUTION:
  CR 117.2e: "No player has priority while a spell or ability is resolving."
  This means: mid-resolution, no one can respond.
  If a spell says "Destroy creature X, then draw 3 cards": no window between the destroy and draw.
  If a triggered ability says "Whenever creature dies, each player draws a card": once this triggers
    and starts to resolve, all players draw simultaneously without priority in between.
  The ONLY exception: mana abilities (605.3b). They resolve immediately and can be used
    mid-resolution when mana is required (e.g., if a spell says "As an additional cost... pay {2}").

RESPONDING TO TRIGGERS (key misconception):
  Triggers go on the stack and CAN be responded to.
  But: the MOMENT the trigger fires does not give opponents priority.
  Priority is given after SBAs are checked and all triggers are placed on the stack.
  Example: Your creature attacks. Declare Attackers step.
    Attack trigger fires ("Whenever this attacks, deal 3 damage to any target").
    Attack trigger goes on stack.
    Now opponent has priority. Opponent can:
      1. Cast an instant.
      2. Activate abilities.
      3. Counter the trigger with Stifle (if they have it).
    Opponent can respond to the trigger BEFORE it resolves.

  Difference: "trigger fired" vs. "trigger resolved."
    Triggered abilities on the stack CAN be countered (by Stifle, etc.) or responded to.
    ONCE the trigger is resolving: no priority, no response window.

COUNTERSPELL TIMING:
  Counterspell ({U}{U}): "Counter target spell."
  Targets a SPELL on the stack. Can only be cast while target is still on the stack.
  The counterspell goes on top of the stack. When it resolves: the target spell is countered.
  You must have priority AND a legal target (the spell on the stack) to cast a counterspell.
  "Can I counter that after it resolves?" NO. Once it resolves, it's no longer a spell on the stack.
  "Can I counter a mana ability?" NO. Mana abilities don't go on the stack (605.3b).

APNAP ORDER — SIMULTANEOUS TRIGGERS:
  Multiple abilities trigger at the same time. Who controls what?
  APNAP: Active Player's triggers go on stack first (chosen in any order).
    Then Non-Active Player(s) in turn order.
    Each player chooses the ORDER of their own triggers.
  WHY IT MATTERS: order determines what resolves last (= what resolves closest to resolution time).
    The LAST trigger placed goes on TOP of the stack (resolves FIRST).
  Example: Etb triggers from multiple permanents entering.
    Active player controls A and B (both trigger). Active player chooses: put A first, then B.
    Non-active player controls C (triggers). C goes on top.
    Stack (top to bottom): C, B, A.
    Resolution order: C first, B second, A third.
    Active player wanted A to resolve first — they couldn't achieve that because APNAP puts
    non-active player's triggers on top.

  APNAP example: both players have death triggers.
    Attacker has "When this dies, draw a card." Blocker has "When this dies, opponent loses 2 life."
    Both die simultaneously (mutual combat). Both triggers fire.
    If it's active player's combat (attacker belongs to active player):
      Active player's trigger (draw a card) goes first. Non-active player's trigger (lose 2 life) goes on top.
      Stack: [lose 2 life] on top, [draw a card] below.
      Resolution: active player loses 2 life first, then draws a card.
      Non-active player benefits from having the trigger resolve first (if that matters).

EMPTY STACK AND STEP TRANSITIONS:
  When all players pass with stack empty: the step/phase ends and the next begins.
  Main Phase → Declare Attackers: both players had priority, both passed. Beginning of combat step begins.
  IMPORTANT: the active player can act during each priority window before passing.
    If you have something to do: do it before passing. Once all pass, the step ends.
  "I want to cast a spell at the start of opponent's combat step": wait until they declare attackers
    (or better: the beginning of combat step, before attackers are declared).
    Opponent doesn't declare attackers yet at beginning of combat step. Stack is empty.
    Active player (opponent) gets priority. If they pass without doing anything: you get priority.
    You cast your instant. Opponent gets priority again. If both pass: your instant resolves.
    Then opponent gets priority in beginning of combat step again.
    If opponent passes: declare attackers step begins.

TIMING TRICKERY — PRIORITY AFTER CASTING:
  CR 117.3c: After casting, the caster gets priority AGAIN.
  This means: spells can be "stacked" by the same player.
  You have Shock and Lightning Bolt. Cast Shock targeting opponent.
    You get priority again immediately. Cast Lightning Bolt targeting opponent.
    Both on stack: [Lightning Bolt] on top, [Shock] below.
    Opponent gets priority. If they counterspell: they pick one target (usually the more dangerous one).
    You can preemptively stack both to force a two-for-one trade against counterspells.
  Opponent can't counter both with a single Counterspell.
  This is the "play around counters" technique.
```

## Definitive Conclusions

- **LIFO: last spell on the stack resolves first** — responding means your spell resolves before the original.
- **After every resolution (and after every cast/activate/action), active player gets priority first** — non-active players respond after.
- **No priority during resolution** — you can't interrupt mid-resolution; the exception is mana abilities.
- **Triggers go on the stack and CAN be countered (Stifle) or responded to** — but not before they're placed on the stack.
- **APNAP order for simultaneous triggers** — active player's triggers go on first, non-active player's go on last (= resolve first).
- **Mana abilities never use the stack** — they resolve immediately and can't be responded to.
- **When all players pass with empty stack: step ends** — understand your priority windows before passing.

## Canonical Example
**Counterspell Timing — Two Spells on One Turn:**
Your turn. You have Negate ({1}{U}) and Shock ({R}) in hand. Opponent is at 2 life.
You cast Shock targeting opponent. Both on stack: [Shock].
CR 117.3c: you get priority again. You cast Negate targeting... wait, Negate counters a "noncreature spell." Nothing to counter from your side.
Actually: cast Shock, then pass. Opponent gets priority.
Opponent casts Counterspell ({U}{U}) targeting Shock.
Stack: [Counterspell] → [Shock].
You get priority (in response to Counterspell). You cast Negate targeting Counterspell.
Stack: [Negate] → [Counterspell] → [Shock].
All players pass. Negate resolves: Counterspell is countered (it was a noncreature spell).
Stack: [Shock]. All players pass. Shock resolves: opponent takes 2 damage. They're at 0 life.
SBA: 0 life → opponent loses.

The LIFO created a chain: you "countered the counterspell" to protect Shock.

**Example 2 — APNAP Trigger Ordering:**
Active player's turn. Both players have creatures with "when this creature enters, deal 1 damage to any target."
Active player casts Wrath of God (destroy all creatures). Multiple creatures entering is irrelevant; creatures are dying.
Wait: both players' creatures have "when this creature dies, create a 1/1 token" instead.
All creatures die simultaneously from Wrath.
Triggers fire simultaneously. Multiple "when creature dies" triggers from both players.

APNAP: Active player puts their triggers on stack first (ordered however they choose).
  Active player controls 3 creatures, each with "when this dies, draw a card."
  Active player orders: [Creature 1 trigger], [Creature 2 trigger], [Creature 3 trigger] on stack.
Non-active player controls 2 creatures, each with "when this dies, create a 1/1 token."
  Non-active player orders: [Creature A trigger], [Creature B trigger] on top.

Stack (top to bottom): [Creature B token], [Creature A token], [Creature 3 draw], [Creature 2 draw], [Creature 1 draw].
Resolution order: Creature B token, Creature A token, Creature 3 draw, Creature 2 draw, Creature 1 draw.

Non-active player's token triggers resolve first. They get tokens first.
Then active player draws cards.
This matters if card drawn gives active player a way to destroy those tokens (edge case),
or if some effect cares about the order (e.g., "next creature to enter is exiled" effects).

The key: APNAP means the non-active player's triggers go on TOP of the stack (and resolve first).
Active player can plan knowing this.

## Commonly Confused With
- **P007 (Response Window)** — The fundamental question "is there a window to respond here?" The answer is almost always YES — players get priority after each spell/ability is placed on stack, and after each resolution. Exception: special actions (morph turn-up, land play) don't use stack.
- **P002 (Replacement vs. Triggered)** — SBAs and replacement effects happen without the stack; they're not "spells or abilities on the stack." Priority checks (117.5) happen before priority is granted, not as a stack interaction.
- **P303 (Split Second)** — Split Second prevents CASTING spells and ACTIVATING non-mana abilities in response to the split-second spell. But it doesn't stop triggered abilities from going on the stack, and mana abilities still work.
- **P328 (Mana Abilities)** — CR 605.3b: mana abilities don't go on the stack; they resolve immediately when activated. This is the primary exception to "everything uses the stack."
