---
id: p342
name: Turn Structure — Phases, Steps, Priority Windows, and Cleanup
category: stack
cr_refs: [500.1, 500.2, 500.8, 500.11, 501.1, 502.1, 502.3, 502.4, 503.1, 503.1a, 504.1, 504.2, 505.1, 505.2, 505.6a, 505.6b, 506.1, 512.1, 513.1, 513.2, 514.1, 514.2, 514.3, 514.3a]
tags: [turn-structure, phases, steps, priority, untap-step, upkeep, draw-step, main-phase, combat, end-step, cleanup, hand-size, until-end-of-turn, extra-turns, skip-steps, Teferi-Mage-of-Zhalfir, Teferi-Time-Raveler, Day-Night, land-play, Emrakul]
created: 2026-03-29
examples_count: 2
---

# P342 — Turn Structure — Phases, Steps, Priority Windows, and Cleanup

## Abstract
A turn has five phases: **beginning phase** (untap, upkeep, draw), **precombat main phase**, **combat phase**, **postcombat main phase**, and **ending phase** (end step, cleanup). The untap step is unique — no player receives priority during it (502.4). The cleanup step is also normally priority-free, but can become a priority window if SBAs or triggers fire during it (514.3a). "Until end of turn" effects expire during cleanup (514.2). A land play is a special action, not a spell or ability — it can't be countered and doesn't use the stack (505.6b). Extra phases and turns are inserted immediately after the current phase/turn, and multiple extras stack in reverse order (most recently created happens first).

## The Definitive Rules

**CR 500.1** (verbatim): *"A turn consists of five phases, in this order: beginning, precombat main, combat, postcombat main, and ending. Each of these phases takes place even if nothing happens during the phase."*

**CR 502.4** (verbatim): *"No player receives priority during the untap step, so no spells can be cast or resolve and no abilities can be activated or resolve. Any ability that triggers during this step will be held until the next time a player would receive priority, which is usually during the upkeep step."*

**CR 505.6b** (verbatim): *"During either main phase, the active player may play one land card from their hand if the stack is empty, if the player has priority, and if they haven't played a land this turn (unless an effect states the player may play additional lands). This action doesn't use the stack. Neither the land nor the action of playing the land is a spell or ability, so it can't be countered, and players can't respond to it with instants or activated abilities."*

**CR 513.2** (verbatim): *"If a permanent with an ability that triggers 'at the beginning of the end step' enters the battlefield during this step, that ability won't trigger until the next turn's end step. Likewise, if a delayed triggered ability that triggers 'at the beginning of the next end step' is created during this step, that ability won't trigger until the next turn's end step. In other words, the step doesn't 'back up' so those abilities can go on the stack."*

**CR 514.2** (verbatim): *"Second, the following actions happen simultaneously: all damage marked on permanents (including phased-out permanents) is removed and all 'until end of turn' and 'this turn' effects end. This turn-based action doesn't use the stack."*

**CR 514.3a** (verbatim): *"At this point, the game checks to see if any state-based actions would be performed and/or any triggered abilities are waiting to be put onto the stack (including those that trigger 'at the beginning of the next cleanup step'). If so, those state-based actions are performed, then those triggered abilities are put on the stack, then the active player gets priority. Players may cast spells and activate abilities. Once the stack is empty and all players pass in succession, another cleanup step begins."*

## The Pattern

```
THE FIVE PHASES IN ORDER (CR 500.1):
  1. Beginning Phase (3 steps):
     a) Untap Step
     b) Upkeep Step
     c) Draw Step
  2. Precombat Main Phase (no steps, ends when stack empty + all pass)
  3. Combat Phase (5 steps):
     a) Beginning of Combat Step
     b) Declare Attackers Step
     c) Declare Blockers Step (skipped if no attackers)
     d) Combat Damage Step (skipped if no attackers; may be 2 if first/double strike)
     e) End of Combat Step
  4. Postcombat Main Phase (no steps)
  5. Ending Phase (2 steps):
     a) End Step
     b) Cleanup Step

UNTAP STEP (502.1–502.4):
  Turn-based actions (no stack):
    1. Phased-in permanents with phasing phase out; phased-out ones phase in.
    2. Day/Night check for transform (if applicable).
    3. Active player's permanents untap (all that can).
  NO PRIORITY (502.4):
    Can't cast spells, can't activate abilities during untap step.
    Triggers from untap step HOLD until upkeep.
    Common triggers held: "At the beginning of your upkeep" — these fire upkeep, not untap.
  EFFECTS THAT DON'T UNTAP:
    Some permanents have effects like "doesn't untap during your next untap step."
    These are tracked and resolve here. They do NOT require priority.

UPKEEP STEP (503.1):
  No turn-based actions. Active player gets priority after triggers placed.
  TRIGGERS FIRE:
    "At the beginning of your upkeep, ..."
    Any triggers that triggered during untap step now go on the stack.
  IMPORTANT: Upkeep triggers go on stack BEFORE active player gets priority (503.1a).
    Active player can respond to upkeep triggers (or not).
  COMMON UPKEEP ABILITIES:
    Cumulative upkeep: put an age counter, then pay N×cost.
    Saga lore counters? No — Sagas get lore counters in the MAIN PHASE (505.4).
    "At the beginning of your upkeep, sacrifice [permanent] unless you pay {X}."
    Phyrexian Arena: "At the beginning of your upkeep, draw a card and lose 1 life."

DRAW STEP (504.1–504.2):
  Turn-based action: active player draws a card. Doesn't use the stack.
  Active player gets priority after.
  SKIPPING DRAW:
    Some effects skip the draw step (e.g., Teferi's Puzzle Box effects, certain older mechanics).
    Drawing beyond this step requires abilities/spells.
  REPLACEMENT EFFECTS ON DRAW:
    "Instead of drawing a card, [dredge]" (see P338).
    Orcish Bowmasters: triggers whenever any player draws EXCEPT the first each turn.
      On your draw step: your first draw triggers nothing. Additional card draws do trigger it.
      On opponent's draw step: their first draw triggers it.
  LEYLINE OF ANTICIPATION EFFECT:
    Doesn't change draw step. Just lets you cast spells at instant speed.
    Still have to cast them at times you have priority.

MAIN PHASE (505.1–505.6):
  Precombat main: before combat. Postcombat main: after combat.
  WHAT CAN YOU DO:
    Cast artifact, creature, enchantment, planeswalker, sorcery spells (505.6a):
      ONLY if you're the active player, it's your main phase, and the stack is empty.
      (Instants and abilities: any time you have priority, even outside main phase.)
    Play a land (505.6b): one per turn (unless effects say otherwise). Stack is empty, you have priority.
      Land play: NOT a spell/ability. Can't be countered. No response window.
      If opponent plays a land after your spell resolves, they just do it — no window to respond.
  SAGA LORE COUNTERS (505.4):
    At the start of your PRECOMBAT main phase (not upkeep): put a lore counter on each Saga.
    This is before you get priority — turn-based action.
  TWO MAIN PHASES:
    Cards that specify "first main phase" mean precombat main.
    "Second main phase" means postcombat main.
    "Main phase" means either.

ENDING PHASE — END STEP (513.1):
  "At the beginning of the end step" triggers fire.
  Active player gets priority.
  TIMING NOTE (513.2):
    If a permanent with an "at the beginning of the end step" trigger ENTERS DURING the end step:
      Its trigger won't fire until the NEXT TURN's end step.
    Similarly: delayed triggers created during the end step trigger NEXT TURN's end step.
    This prevents infinite "enter at end step → trigger again" loops.
  EFFECTS EXPIRING "AT END OF TURN":
    "Until end of turn" effects DON'T expire at the END STEP.
    They expire in the CLEANUP STEP (514.2).
    So: a creature pumped "until end of turn" is still pumped during the end step.
    Any triggered effects from pumped P/T: interact with the still-pumped stats.

CLEANUP STEP (514.1–514.3a):
  STEP 1 (turn-based, no stack): active player discards to max hand size (normally 7) (514.1).
  STEP 2 (turn-based, no stack): simultaneously —
    All damage marked on permanents is removed (514.2). (Damage doesn't carry between turns!)
    All "until end of turn" and "this turn" effects END (514.2).
    Tokens with "until end of turn" existence also end? No — tokens exist independently; their
      summoning haste expiration doesn't depend on "until end of turn."
  NORMALLY NO PRIORITY (514.3):
    No spells, no abilities during cleanup.
    BUT: if any SBAs or triggers fire in cleanup (514.3a):
      SBAs performed → triggers placed → active player gets priority → players may act.
      After stack resolves: ANOTHER cleanup step begins.
      This means: cleanup can repeat if triggers keep firing.
  EXAMPLE OF CLEANUP TRIGGER:
    You control a Madcap Experiment creature (hypothetically has an "at the beginning of the
      next cleanup step" trigger). That trigger fires, goes on stack in cleanup. Another cleanup step.
    More common: a creature that "can't untap next cleanup step" or damage-related triggers.
  DISCARDING TO HAND SIZE:
    If you have 10 cards, discard 3 to reach 7.
    Choice of which to discard is yours.
    NOT mandatory before cleanup — you simply do it as turn-based action.
    Discard triggers (Liliana of the Veil type: "whenever you discard") fire from this!
      But they wait until cleanup check at 514.3a.

EXTRA TURNS AND PHASES (500.8, 500.9):
  Extra turns are inserted immediately after the current turn.
  If multiple extra turns created: most recently created happens FIRST.
    Example: Emrakul, the Aeons Torn ({15}): "When you cast this, take an extra turn after this one."
    And Time Walk ({1}{U}): "Take an extra turn after this one."
    If both resolve in the same turn: Time Walk resolves last (if cast second) → its extra turn is first.
      Then Emrakul's extra turn. Then normal turn.
    Most recently resolved effect = first extra turn taken.
  SKIPPING STEPS/PHASES (500.11):
    "Skip your draw step": turn proceeds directly from upkeep to main phase.
    Multiple skip effects stack (e.g., skip your combat phase + extra turn without a combat).
    Skipped steps/phases don't fire any triggers.

LAND PLAY TIMING TRAP:
  You can only play a land during YOUR main phase, with the stack empty, and when you have priority.
  COMMON MISTAKE: trying to play a land "in response to" something.
    Can't play a land in response — it requires the stack to be empty.
  Can't play a land during combat (not a main phase).
  EFFECT: "You may play an additional land" — still requires main phase + empty stack.
    This expands the count but doesn't change the timing requirement.

CASTING INSTANTS DURING COMBAT:
  Instants and activated abilities: any time you have priority.
  This means: before attackers (beginning of combat), after attackers, after blockers, after damage.
  But NOT during assignment/dealing (no priority then).
  Giant Growth at instant speed: after blockers declared, before damage — correct window.
```

## Definitive Conclusions

- **No priority in untap step** — no spells or abilities during untap; triggers from untap wait until upkeep.
- **Land play requires empty stack + main phase** — it's a special action, can't be countered, can't be responded to.
- **"Until end of turn" expires in CLEANUP, not at end step** — the pumped creature is still pumped during the end step.
- **Cleanup can generate priority** — if SBAs or triggers fire during cleanup, players get priority and another cleanup follows.
- **ETB during end step: no same-turn trigger** — "at beginning of end step" triggers from ETBs during end step wait until next turn.
- **Extra turns stack LIFO** — most recently created extra turn happens first.

## Canonical Example
**Cleanup Discard Triggering Priority:**
You control Liliana of the Veil ({1}{B}{B}), a planeswalker. Her +1 is "Each player discards a card."
You also have an unusual setup: Waste Not ({1}{B}) enchantment: "Whenever an opponent discards a creature card, put a 2/2 zombie onto the battlefield. Whenever an opponent discards a land card, add {B}{B}. Whenever an opponent discards another card, draw a card."

Your hand at end of your turn: 9 cards (2 over the 7-card limit).
Cleanup step begins:
  Step 1: you must discard 2 cards to reach 7. You choose to discard two cards.
    Suppose these are lands. (Your cards; Waste Not only triggers when OPPONENTS discard.)
    No triggers from your own discards.
  Step 2: damage removed, "until end of turn" effects end.
  Check (514.3a): any SBAs? Any triggers? No (you didn't trigger Waste Not with your own discards).
  No priority window needed. Turn ends. Opponent's turn begins.

Now: opponent's hand at end of their turn: 9 cards.
Their cleanup step:
  Step 1: opponent discards 2. Suppose they discard Llanowar Elves (creature) and Island (land).
  Waste Not triggers TWICE:
    Trigger 1: opponent discarded a creature → put 2/2 zombie token.
    Trigger 2: opponent discarded a land → add {B}{B}.
  Check 514.3a: triggers waiting. Opponents' SBAs? No.
  BUT WAIT: this is OPPONENT's cleanup. They have priority in their cleanup (if triggered).
    Actually: the ACTIVE player (opponent) gets priority in their cleanup step when triggers fire.
    The triggers go on the stack. Active player gets priority. They can respond. You can respond.
  Stack resolves:
    Trigger 2 resolves: add {B}{B} (mana doesn't persist to main, but this is end step).
      Actually the {B}{B} are floating. They'll be lost at the end of the step. But they're there for now.
    Trigger 1 resolves: 2/2 zombie enters under your control.
  Another cleanup step: damage removed, effects end. Check again. No new triggers. Turn ends.

**Example 2 — ETB "At the Beginning of the End Step" During End Step:**
Opponent controls Abyssal Gatekeeper: "When Abyssal Gatekeeper dies, each player sacrifices a creature."
You're in your end step. Active player gets priority.
You cast Sneak Attack ({3}{R}) activation: "Put a creature card from your hand onto the battlefield.
  That creature gains haste. Sacrifice it at the beginning of the next end step."
You pay {R} and put Griselbrand (7/7 lifelink) onto the battlefield.
Griselbrand has: "Lifelink. Pay 7 life: draw 7 cards."
Delayed triggered ability created: "at the beginning of the next end step, sacrifice Griselbrand."

Now: is the "at the beginning of the end step" trigger for Griselbrand's sacrifice due NOW?
CR 513.2: if a delayed trigger is created DURING the end step → it triggers at the NEXT turn's end step.
Result: Griselbrand stays until the NEXT end step (your opponent's or next turn's).
You get a full round with Griselbrand: draw 7 cards (if you pay 7 life), attack next turn.
At the beginning of the NEXT end step: Griselbrand is sacrificed.

This is the key interaction for Sneak Attack + end-of-turn timing: always cast Sneak Attack creatures
DURING the end step (not earlier) to get an extra turn of use. Wait — if you cast it during
YOUR end step: it survives to attack NEXT TURN (opponent's end step is first end step after yours),
then gets sacrificed at the beginning of THAT end step (before you attack again).

Actually: cast during your end step → sacrifice triggers at NEXT end step → opponent's end step.
Cast during opponent's end step → sacrifice at YOUR next end step (so you get to attack on your turn).
The sweet spot is opponent's end step: Griselbrand survives through opponent's turn + your untap, draw, combat.
Then gets sacrificed at the beginning of YOUR end step. One full attacking turn.

## Commonly Confused With
- **P331 (Stack / Priority / LIFO)** — Turn structure determines WHEN players get priority; the stack determines HOW spells and abilities interact during those priority windows. P342 covers the structural timeline; P331 covers what happens within each priority window.
- **P341 (Combat Phase Steps)** — P342 covers the full turn including combat; P341 goes deep into the combat phase specifically (attacker declaration, blocker declaration, damage assignment).
- **P332 (Phasing)** — Phasing occurs during the untap step (502.1) as a turn-based action. P342 establishes that untap step has no priority; P332 details how phasing interacts with zones, triggers, and counters.
- **P338 (Graveyard Recursion)** — Effects that trigger "at the beginning of the end step" or create delayed end-step triggers interact with CR 513.2's rule about ETB during end step. P342 establishes the turn-structure constraint; P338 covers recursion mechanics.
