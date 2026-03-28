---
id: p007
name: Priority Windows
category: stack
cr_refs: [117.1, 117.3, 117.4, 117.5, 605.1, 605.3]
tags: [priority, stack, instant, response, lifelink, mana, SBA, window, respond]
created: 2026-03-28
examples_count: 4
---

# P007 — Priority Windows

## Abstract
"Can I respond to X?" is always answerable with a definitive yes or no. The answer depends entirely on whether X uses the stack (creating a priority window) or doesn't. Anything that doesn't use the stack — SBAs, replacement effects, mana abilities, turn-based actions — has NO window. Everything else does.

## The Definitive Rule

**CR 117.1** — The player with priority may cast spells, activate abilities, and take special actions.

**CR 117.3b** — Active player receives priority after a spell or ability resolves.

**CR 117.4** — Stack resolves when ALL players pass priority in succession without acting.

**CR 117.5** — Before any player receives priority: SBAs happen, triggers go on stack. No player can act during this.

**CR 605.1** — Mana abilities don't use the stack. They resolve immediately when activated. No player can respond.

## The Pattern

```
NO PRIORITY WINDOW (cannot respond):
  - State-based actions (704) — happen before priority
  - Replacement effects (614) — modify event, no stack
  - Mana abilities (605) — don't use the stack
  - Turn-based actions (703) — happen automatically
  - Lifelink — static ability, simultaneous with damage
  - Untap step — no priority given (CR 502.4)
  - Placing triggers on stack — no priority between SBAs and trigger placement

PRIORITY WINDOW EXISTS (can respond):
  - Any spell on the stack (before it resolves)
  - Any activated ability on the stack (before it resolves)
  - Any triggered ability on the stack (before it resolves)
  - After a spell/ability resolves (active player gets priority — CR 117.3b)
  - Before each combat damage step (priority given in each combat step)
```

## Definitive Conclusions

- **"Can I respond to my opponent's land drop?"** No. Playing a land is a special action (not a spell/ability), it doesn't use the stack (CR 116.2a).
- **"Can I respond between damage dealing and lifelink life gain?"** No. Lifelink is a static ability that makes life gain happen simultaneously with the damage (CR 702.15). One event, no window.
- **"Can I tap my creature for mana in response to a spell being cast?"** Yes — but not "in response." Mana abilities can be activated during the process of casting a spell (CR 605.3). Technically you're not responding — you're activating a mana ability in the mana payment window, which is different.
- **"Can I respond to an SBA killing my creature?"** No. SBAs don't use the stack. You can respond to whatever caused the lethal damage (if it was a spell), but not to the SBA itself.
- **"Can I respond to a triggered ability being placed on the stack?"** No — triggers are placed on the stack as part of the priority-granting process (117.5), before priority is actually given. Once the trigger IS on the stack, yes — you can respond to it before it resolves.
- **"Can I respond to combat damage?"** Not during the damage step itself — damage assignment and dealing are simultaneous. But you have priority BEFORE the combat damage step (in declare blockers or beginning of combat), and AFTER the combat damage step resolves (end of combat).
- **"Can I use a flash creature to save my blocking creature from trample damage?"** If you cast it before combat damage is dealt — yes, by casting it with flash during the declare blockers priority window, potentially adding another blocker. You can't cast it during damage assignment.

## Canonical Example
Opponent casts Lightning Bolt targeting your creature. Priority windows:
1. After Bolt is cast: opponent gets priority → passes → YOU get priority. You can cast Giant Growth to save the creature.
2. You cast Giant Growth → you get priority back → pass → opponent gets priority → passes → Giant Growth resolves.
3. Active player gets priority. Both pass → Lightning Bolt resolves. Creature now has +3/+3. Does 3 damage kill it? Check toughness.

NO window between Lightning Bolt casting and it resolving unless someone acts. But you have the window to respond before it resolves.

## Additional Examples

**Example 2 — Responding to triggered ability:**
Opponent's creature triggers "whenever this attacks, exile target creature." Trigger goes on stack. You have priority before it resolves. You can sacrifice the targeted creature, blink it, give it hexproof, etc. — all valid responses.

**Example 3 — No window for simultaneous triggers:**
Two triggered abilities trigger simultaneously. They're both placed on the stack (in APNAP order) as part of the 117.5 process. Neither player gets priority during the placement. Once both are on the stack, the active player gets priority and can respond to the top trigger.

**Example 4 — Window after resolution:**
Doom Blade resolves. Your creature dies. Active player gets priority (117.3b). Opponent can respond to the triggers that result (if any went on the stack). But the creature is already dead — that can't be undone.

## Commonly Confused With
- **P002 (Replacement vs. Trigger)** — Replacement effects have no window; triggered abilities do.
- **P005 (Simultaneous Events)** — Understanding WHEN priority is given during complex sequences.
