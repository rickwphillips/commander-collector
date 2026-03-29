---
id: p022
name: End-Turn Stack Exile
category: stack
cr_refs: [714.1, 714.2, 714.3, 714.4, 714.5, 603.7b]
tags: [end-turn, sundial, stack-exile, delayed-trigger, cleanup, end-step, exile, skip, until-end-of-turn]
created: 2026-03-28
examples_count: 1
---

# P022 — End-Turn Stack Exile

## Abstract
"End the turn" is a specific game action that exiles all spells and abilities currently on the stack, then jumps directly to the cleanup step. It does not skip the cleanup step itself. This creates four distinct strategic uses: (1) exiling delayed triggered abilities before they resolve, (2) preventing end-step triggers from firing by skipping the end step entirely, (3) exiling opponents' spells and responses mid-stack, and (4) leaving "until end of turn" effects active until cleanup anyway. Knowing what ends and what doesn't is essential.

## The Definitive Rule

**CR 714.1**: *"Ending the turn" means: exile all spells and abilities on the stack; remove all attacking/blocking creatures from combat; state-based actions are checked; skip to the cleanup step.*

**CR 714.2**: Effects that say "until end of turn" end during the cleanup step — which still happens after the turn is ended.

**CR 714.4**: *"If a permanent phased out or is owned by a player who has left the game, it's not returned to the battlefield."*

**Sundial ruling (2011-09-22)**: *"If Sundial's ability is activated before the end step, any 'at the beginning of the end step' triggered abilities won't get the chance to trigger that turn because the end step is skipped."*

**Sundial ruling (2011-09-22)**: *"Though spells and abilities exiled won't get a chance to resolve, they don't count as being 'countered.'"*

## The Pattern

```
"END THE TURN" SEQUENCE:
  1. All spells and abilities on the stack → exiled (not countered)
  2. Attacking/blocking creatures removed from combat
  3. State-based actions checked (no priority, no new triggers)
  4. Skip to cleanup step

WHAT ENDS vs. WHAT DOESN'T:
  ✓ Delayed triggered abilities on the stack → EXILED (gone forever)
  ✓ Counterspells / removal on the stack → EXILED
  ✗ "Until end of turn" effects → STILL END at cleanup (cleanup still happens)
  ✗ "At end of turn" triggers already on stack → EXILED (can't fire)
  ✗ "At beginning of end step" triggers (if Sundial used before end step) → NEVER FIRE this turn

FOUR USE CASES:

1. EXILE DELAYED TRIGGERS (most common):
   "At the beginning of the next end step, sacrifice [creature]"
   → Trigger fires when end step begins, goes on stack
   → Activate Sundial in response
   → Trigger exiled → creature stays

2. SKIP END STEP TRIGGERS:
   Activate Sundial during your second main phase (before end step)
   → End step never begins → "at beginning of end step" triggers
     don't fire this turn → delayed to next turn's end step

3. EXILE OPPONENTS' STACK:
   Opponents cast instant in response to something
   → Activate Sundial → their spell exiled (not countered)
   → Note: only works on YOUR turn

4. "UNTIL END OF TURN" EFFECTS:
   Haste, pump spells, temporary control all end at cleanup anyway
   → Sundial does NOT extend these permanently
```

## Definitive Conclusions

- **Exiled is not countered.** Counterspell triggers / abilities that care about being countered don't apply. The card simply never resolves.
- **Cleanup still happens.** "Until end of turn" effects end normally. Sundial skips *to* cleanup, not *past* it.
- **Your turn only.** Sundial requires activation during your turn. Can't use it to exile opponents' end-step obligations on their turn.
- **Delayed triggers fired but not yet resolved are gone.** If "at beginning of next end step, sacrifice" is already on the stack when you activate Sundial, it's exiled. If the end step never began (Sundial before end step), the trigger never fires.
- **If triggered abilities fire during cleanup, there's another cleanup.** Ruling: "If any triggered abilities do trigger during the cleanup step, they're put onto the stack. Players get a chance to act, then another cleanup step occurs." This can chain if abilities keep triggering.
- **Phased-out permanents don't return.** Ending the turn doesn't restore phased-out permanents — they phase back in on their controller's next untap step as normal.

## Canonical Example
**Sundial + Phyrexian Processor / token makers:**
Cast Phyrexian Processor, pay 20 life, get "at beginning of each end step, create a 20/20." At your end step, the trigger fires and goes on the stack. Activate Sundial. Trigger exiled. The 20/20 trigger is gone. You avoided paying the "sacrifice at end of turn" or "at end of turn, exile the token" clauses of various effects by ending the turn before the obligation resolves.

**Sundial + Act of Treason:**
Act of Treason: gain control of target creature until end of turn, it gains haste. At end of turn, return it. Activate Sundial during your second main phase. End step skipped → "at beginning of end step, return" trigger never fires this turn. The creature stays under your control through cleanup (haste ends, but control persists until next trigger fires at next end step). Activate Sundial again next turn to permanently steal it — but only if the obligation is a delayed trigger, not a "for as long as" continuous effect.

## Commonly Confused With
- **P016 (Phasing)** — Phasing is not affected by Sundial ending the turn. Phased-out permanents remain phased out.
- **P006 (Intervening If Clause)** — Sundial exiles triggers before they resolve. If they have an intervening-if clause, that clause evaluation never happens since the trigger is exiled before it reaches resolution.
- **P007 (Priority Windows)** — The window to activate Sundial is the priority window after delayed triggers are placed on the stack (at the beginning of end step). There IS a window: the end step begins, "at beginning of end step" triggers fire and are placed, players receive priority — at that point Sundial can be activated to exile them.
