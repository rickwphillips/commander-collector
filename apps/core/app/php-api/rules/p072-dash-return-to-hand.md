---
id: p072
name: Dash — Alternative Cost with Haste and Return to Hand
category: costs
cr_refs: [702.109a]
tags: [dash, alternative-cost, haste, return-to-hand, end-step, delayed-trigger, reusable, ETB]
created: 2026-03-28
examples_count: 2
---

# P072 — Dash — Alternative Cost with Haste and Return to Hand

## Abstract
Dash is an alternative cost that makes the creature enter with haste and creates a delayed trigger to return it to its owner's hand at the beginning of the next end step. Unlike Blitz (which sacrifices), Dash returns the creature to hand, allowing it to be replayed. This makes Dash creatures "reusable" with ETB abilities — dash in, use ETB, attack with haste, bounce to hand, repeat next turn. If the dash creature is destroyed before end step, the return trigger fires but finds nothing (silently fizzles).

## The Definitive Rule

**CR 702.109a** (verbatim): *"Dash represents three abilities: two static abilities that function while the card with dash is on the stack, one of which may create a delayed triggered ability, and a static ability that functions while the object with dash is on the battlefield. 'Dash [cost]' means 'You may cast this card by paying [cost] rather than its mana cost,' 'If this spell's dash cost was paid, return the permanent this spell becomes to its owner's hand at the beginning of the next end step,' and 'As long as this permanent's dash cost was paid, it has haste.' Casting a spell for its dash cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
DASH SEQUENCE:
  1. Cast using dash cost (alternative cost — pays instead of mana cost)
  2. Permanent enters with haste (static ability while dash cost was paid)
  3. Delayed trigger created: "at the beginning of the next end step, return to owner's hand"
  4. Attack immediately (haste)
  5. At next end step: return trigger fires → permanent returns to hand

RETURN TO HAND:
  "Return to its owner's hand" — not a sacrifice
  The creature leaves the battlefield (LTB triggers fire)
  It goes to the owner's hand (not necessarily the controller's)
  Next turn: can cast it again (with or without dash — your choice)

DASH VS. BLITZ:
  Dash: returns to hand at end step → creature can be replayed → ETB loops possible
  Blitz: sacrificed at end step → gone (draw a card consolation) → can't be replayed easily
  Both grant haste + delayed end-step consequence

ETB ABUSE:
  Dash is specifically designed for creatures with strong ETBs:
  Turn 1: Dash → ETB fires, creature has haste, attacks
  End step: creature returns to hand
  Turn 2: Dash again → ETB fires again, haste, attacks
  Repeat every turn → continuous ETB value

IF DASH CREATURE IS KILLED:
  Delayed return trigger fires at end step
  Trigger looks for the permanent → not found → does nothing (fizzles)
  No additional effect — the return was supposed to happen but the creature is gone

SUNDIAL OF THE INFINITE INTERACTION:
  Can exile the return trigger (end step trigger) → dash creature stays permanently with haste
  (The haste is permanent while dash cost was paid, not just this turn)
  This is an intentional rules interaction (same as Blitz)

CASTING WITHOUT DASH:
  Can always choose to pay the normal mana cost instead
  Choosing normal cost: creature enters normally (no haste, no return trigger)
  The choice is made at casting time
```

## Definitive Conclusions

- **Dash grants haste and creates a delayed return-to-hand trigger.** The return is to the owner's hand.
- **If the dash creature dies before end step,** the return trigger silently fizzles.
- **Dash enables ETB loops.** Cast, trigger ETB, attack, return, repeat next turn.
- **Dash vs. Blitz:** Dash returns to hand (reusable); Blitz sacrifices (draw a card).
- **Sundial of the Infinite can exile the return trigger,** making the dash permanent with haste.
- **A copy of a dashed creature doesn't have haste and won't return to hand.** The copy isn't "a permanent whose dash cost was paid" — the dash cost characteristic belongs to the original object, not the copy. (Gatherer ruling 2021-06-18: "If a creature enters the battlefield as a copy of or becomes a copy of a creature whose dash cost was paid, the copy won't have haste and won't be returned to its owner's hand.")
- **The return trigger requires the creature to still be on the battlefield when it resolves.** If the creature has changed zones (graveyard, exile, etc.) before the trigger resolves, the trigger does nothing and the creature stays in its current zone. (Gatherer ruling 2021-06-18)

## Canonical Example
**Goblin Rabblemaster with Dash (Dash {3}{R}):**
Cast Rabblemaster with dash cost. It enters with haste, creates a 1/1 Goblin token (ETB). Rabblemaster can attack this turn. At end of turn: return Rabblemaster to hand. Next turn: dash it again → another 1/1 Goblin created, attack again. You're generating a Goblin token every time you dash it.

**Example 2 — Dash + kill response:**
Dash creature enters. Opponent kills it with instant in response to the ETB trigger resolving. End of turn: return trigger fires, finds nothing → does nothing. The ETB still resolved (if it had resolved before the creature died), and you got the value.

## Commonly Confused With
- **P066 (Blitz)** — Blitz is nearly identical but sacrifices instead of returning to hand. Blitz: draw on death; Dash: reuse ability.
- **P033 (Madness)** — Both involve discarding/replaying cards. Dash is an alternative cost; madness is a discard replacement. No mechanical overlap.
