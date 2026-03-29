---
id: p161
name: Dash — Alternative Cost for Haste, Returns at End Step
category: costs
cr_refs: [702.109a]
tags: [dash, alternative-cost, haste, end-step, return-to-hand, Rakdos, Mardu, Kolaghan, speed-play]
created: 2026-03-28
examples_count: 2
---

# P161 — Dash — Alternative Cost for Haste, Returns at End Step

## Abstract
Dash lets you cast a creature at a reduced alternative cost instead of its mana cost. If you pay the dash cost, the creature enters with haste and is returned to your hand at the beginning of the next end step. You get an immediate attack with haste, avoid summoning sickness, and the creature doesn't stay on the battlefield to die to removal — it bounces back to your hand for next turn's dash (or regular cast). The trade-off: you can't keep the creature permanently unless you pay its normal cost.

## The Definitive Rules

**CR 702.109a** (verbatim): *"Dash represents three abilities: two static abilities that function while the card with dash is on the stack, one of which may create a delayed triggered ability, and a static ability that functions while the object with dash is on the battlefield. 'Dash [cost]' means 'You may cast this card by paying [cost] rather than its mana cost,' 'If this spell's dash cost was paid, return the permanent this spell becomes to its owner's hand at the beginning of the next end step,' and 'As long as this permanent's dash cost was paid, it has haste.' Casting a spell for its dash cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
DASH:
  Three abilities:
    1. Static (stack): may cast by paying [dash cost] instead of mana cost
    2. Delayed triggered (stack): if dash cost paid, return to hand at beginning of next end step
    3. Static (battlefield): as long as dash cost was paid, this has haste

  DASH HASTE:
    The creature enters with haste if dashed
    Can attack the turn it enters (no summoning sickness)
    Can activate {T} abilities too

  DASH + END STEP RETURN:
    The return is a DELAYED TRIGGERED ABILITY created when the spell resolves
    "At the beginning of the next end step": ANY player's next end step (including opponent's)
    Wait: "next end step" — if you dash on YOUR turn, the end step is YOUR end step
    The creature attacks → your end step begins → delayed trigger fires → return to hand
    Opponent can respond to the return trigger (but can't counter it without a counter for triggered abilities)

  DASH + OPPONENT'S END STEP:
    If you dash during your turn: return happens at your end step
    If you cast a creature with flash via dash during opponent's turn:
    The next end step is OPPONENT'S end step → returns at end of opponent's turn
    So: dash a creature at instant speed (if it has flash) → get it for their attack, then returns

  DASH + PROTECTION:
    The creature returns to hand before it can be killed by removal next turn
    Opponent's sorcery-speed removal (Wrath): happens on opponent's turn
    If your end step already passed and you dashed on your turn: creature is ALREADY in your hand
    Protection from "opponent casts sorcery-speed removal next turn"

  DASH + ETB:
    Each time you dash the creature: it enters → ETB triggers fire each time
    Dash a creature with a powerful ETB every turn → ETB effect every turn
    Dashable ETB creatures: Goblin Dark-Dwellers (exile and cast instant/sorcery)

  DASH + CAST NORMALLY:
    You can choose NOT to dash: cast at regular cost → stays permanently
    Strategic: dash if you want the attack now + ETB recurring; cast normally if you want it to stick

  DASH + COST COMPARISON:
    Dash cost is usually cheaper than normal cost
    Dash {1}{B}: cheaper than actual cost, but only temporary
    Normal cast at full cost: stays on battlefield permanently
    Choose based on situation

  DASH + DIES BEFORE END STEP:
    If the dashed creature dies before end step: it's in the graveyard
    The delayed trigger fires at end step: looks for the permanent → it's in the graveyard → can't return to hand
    Wait: the delayed trigger says "return the permanent this spell becomes" — if it's dead, there's nothing to return
    The trigger resolves: look for the permanent, it's gone → trigger does nothing
    If the creature is in the graveyard instead of the battlefield: it's NOT returned (dead is dead)
```

## Definitive Conclusions

- **Dashed creatures have haste** — can attack or use {T} abilities immediately.
- **Return to hand happens at the BEGINNING of the next end step** — yours if dashed on your turn.
- **If the creature dies** before the end step: the delayed trigger finds nothing, creature stays dead.
- **Dash enables ETB loops** — dash every turn for recurring ETB effects.
- **Choose dash vs normal cast** based on whether you need it to stick.

## Canonical Example
**Kolaghan, the Storm's Fury (Dash {4}{B}{R}):**
Regular cost: {4}{B}{R}{R} (6 mana). Dash cost: {4}{B}{R} (6 mana... same!).
Wait: Kolaghan dash vs regular cost... Hmm. Let's use a better example.
**Zurgo Bellstriker (Dash {R}):**
Regular cost: {R} (1 mana, 2/2 haste for 1). Dash is {R} (same cost actually, but it returns).
Better: **Aven Skirmisher variants or** Flamewake Phoenix ({1}{R}{R}, Dash {2}{R}).
Dash {2}{R}: 3-mana attack with haste. Regular {1}{R}{R}: 3-mana permanent 2/1 with flying haste.
With Dash: it bounces back, you can dash again next turn without recasting.
With regular: it stays on battlefield, subject to removal.

**Example 2 — Dash ETB Loop:**
Goblin Dark-Dwellers (Dash, ETB: exile an instant/sorcery in graveyard and cast it for free):
Dash every turn: ETB fires each time → cast a free Lightning Bolt from graveyard each turn.
The creature bounces back at end step, never dying to removal, providing a recurring engine.

## Commonly Confused With
- **P113 (Evoke)** — Evoke enters then sacrifices itself. Dash enters then bounces to hand at end step.
- **P147 (Ninjutsu)** — Ninjutsu swaps in during combat. Dash is a cast alternative, not a swap.
- **P082 (Unearth)** — Unearth returns from graveyard temporarily. Dash starts from hand.
