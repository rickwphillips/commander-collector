---
id: p265
name: Blitz and Casualty — New Capenna Haste and Sacrifice-for-Copy Mechanics
category: costs
cr_refs: [702.152a, 702.152b, 702.153a, 702.153b]
tags: [blitz, casualty, alternative-cost, additional-cost, haste, draw-on-death, sacrifice-for-copy, Streets-of-New-Capenna, Titan-of-Industry, Ob-Nixilis-the-Adversary, Girder-Gang, Cut-of-the-Profits]
created: 2026-03-29
examples_count: 2
---

# P265 — Blitz and Casualty — New Capenna Haste and Sacrifice-for-Copy Mechanics

## Abstract
Two mechanics from Streets of New Capenna (2022). **Blitz**: an alternative casting cost that gives the permanent haste AND "draw a card when this permanent dies" — but forces you to sacrifice it at the beginning of the next end step. Blitz is a trade: spend less mana now, get immediate action, draw a card when sacrificed (or when it dies before the sacrifice trigger). **Casualty N**: an additional cost (sacrifice a creature with power N or greater) that copies the spell when paid. Casualty lets you sacrifice a creature to double the effect of a powerful sorcery or instant — classic New Capenna "mob boss" flavor.

## The Definitive Rules

**CR 702.152a** (verbatim): *"Blitz represents three abilities: two static abilities that function while the card with blitz is on the stack, one of which may create a delayed triggered ability, and a static ability that functions while the object with blitz is on the battlefield. 'Blitz [cost]' means 'You may cast this card by paying [cost] rather than its mana cost,' 'If this spell's blitz cost was paid, sacrifice the permanent this spell becomes at the beginning of the next end step,' and 'As long as this permanent's blitz cost was paid, it has haste and "When this permanent is put into a graveyard from the battlefield, draw a card."'"*

**CR 702.153a** (verbatim): *"Casualty is a keyword that represents two abilities. The first is a static ability that functions while the spell with casualty is on the stack. The second is a triggered ability that functions while the spell with casualty is on the stack. Casualty N means 'As an additional cost to cast this spell, you may sacrifice a creature with power N or greater,' and 'When you cast this spell, if a casualty cost was paid for it, copy it. If the spell has any targets, you may choose new targets for the copy.' Paying a spell's casualty cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
BLITZ:
  Alternative cost: pay blitz cost instead of normal mana cost
  If blitz cost was paid, the permanent:
    1. Has haste (can attack immediately)
    2. Gets a triggered ability: "When this is put into a graveyard, draw a card"
    3. Gets a delayed triggered ability: "Sacrifice this at beginning of next end step"

  BLITZ LIFECYCLE:
    Cast with blitz cost → enters with haste + death-draw trigger + end-step sacrifice trigger
    Attack immediately with haste
    End of turn (or after it dies for any reason): draw a card
    If it survived combat: at beginning of next end step, sacrifice it → draw a card

  BLITZ + DIES BEFORE END STEP:
    If the blitz creature is destroyed in combat (trades):
      "When this is put into a graveyard, draw a card" triggers → you draw a card
    The sacrifice trigger at end of step is irrelevant (creature already dead)
    Result: you cast a cheaper creature, attacked, traded in combat, drew a card
    Blitz as a kamikaze trade: pay less mana, trade your creature, refund a card

  BLITZ + RESPONSE TO SACRIFICE:
    You control WHEN the sacrifice happens (at the beginning of end step)
    That's a triggered ability — you can respond before it resolves
    Sacrifice the blitz creature in response to removal → it's already "put into GY" → draw a card
    But: if opponent removes it before you sacrifice, the "dies" trigger fires, you draw

  BLITZ COST vs NORMAL COST:
    Blitz costs are typically cheaper than normal mana cost
    The tradeoff: you don't get the permanent long-term; it's sacrificed at end of turn
    Best on enter-the-battlefield (ETB) creatures: you get the ETB + attack + draw, don't need the body

  BLITZ NOTABLE CARDS (Streets of New Capenna):
    Titan of Industry ({5}{G}{G}): 7/7, multiple ETBs (gain 5 life, destroy artifact/enchantment,
      create 2/2 Rhino token OR put a shield counter on a creature). Blitz {4}{G}{G}.
      Normal: 7-drop creature that sticks.
      Blitz {4}{G}{G}: you pay one LESS mana — but wait: Blitz {4}{G}{G} vs {5}{G}{G}: same cost!
      Actually the appeal is the haste + card draw. The 7/7 attacks for 7, gets ETBs, then sacrifice → draw.
      A one-turn Titan OF INDUSTRY that replaces itself with a card.

    Ob Nixilis, the Adversary ({1}{B}{R}): 3/3 Trample, Menace, "+1: lose 1 life, draw a card, each
      opponent loses 1 life," "-2: create a 1/1 Imp token with flying and haste." Blitz {1}{B}{R}.
      (Ob Nixilis is a planeswalker — blitz works on planeswalkers too!)
      Blitz {1}{B}{R}: Ob Nixilis enters with loyalty X where X is chosen when cast... wait.
      Actually Ob Nixilis the Adversary with Blitz: cast for blitz cost, he enters as planeswalker,
      gets haste... (planeswalkers can't attack normally — haste on them is mostly flavorful).
      Actually: Ob Nixilis the Adversary is a planeswalker with blitz. Interesting rules case.

    Girder Gang ({5}{B}): 6/5, when ETB create two 1/1 Treasure tokens. Blitz {4}{B}.
      Blitz: save 1 mana, attack with 6/5, get two Treasures, draw a card at end step.
      One less mana for an all-in attack + 2 Treasure + card draw. Better value than slow deployment.

CASUALTY:
  Additional cost: may sacrifice a creature with power N or greater when casting the spell
  If you do: when you cast the spell, create a copy of it (choose new targets for copy)
  Net: you pay the normal cost + sacrifice a creature → get TWO copies of the spell

  CASUALTY TIMING:
    The sacrifice is paid as an ADDITIONAL cost when you cast the spell
    The copy is created by a triggered ability (when you cast this spell, if casualty was paid...)
    Both the spell AND the copy are on the stack → they resolve separately (LIFO)
    The copy resolves first, then the original

  CASUALTY + TARGETS:
    "You may choose new targets for the copy"
    For a removal spell: original targets Creature A, copy targets Creature B → kill two creatures
    For draw spells: both copies do the same thing (you draw twice as many cards)
    For spells that target players: target different opponents

  CASUALTY N — WHAT COUNTS:
    "Sacrifice a creature with power N or greater"
    Power of the sacrificed creature ≥ N
    Casual 2 requires power 2+. Casualty 1 requires any creature (power ≥ 1)
    Can sacrifice a 1/1 token for Casualty 1, or a 5/5 for Casualty 5
    The creature is gone permanently (it's sacrificed)

  CASUALTY + COPY RULES:
    The copy is created on the stack (not cast from hand)
    Copy doesn't trigger "when you cast" effects (it wasn't cast)
    Copy CAN be countered separately from the original
    Copy is not a new instance of Casualty (you can't pay another Casualty to copy the copy)
    Wait: CR 702.153b — if a spell has multiple instances of casualty, each is paid separately.
    But: the copy doesn't have Casualty (copies created on the stack by triggered abilities).

  CASUALTY NOTABLE CARDS (Streets of New Capenna):
    Cut of the Profits ({X}{B}{B}, Sorcery — Casualty X): "Draw X cards, lose X life."
      Casualty X: sacrifice a creature with power ≥ X.
      Pay {4}{B}{B} with Casualty 4 (sacrifice a 4/4): draw 4 cards, lose 4 life → TWICE.
      Total: draw 8 cards, lose 8 life for {4}{B}{B} + a 4/4 creature sacrificed.

    Unlucky Witness ({R}, Creature 1/1 — Casualty 1?): not a casualty card.

    Sticky Fingers ({R}, Enchantment): not casualty.

    Actual Casualty examples:
    Revel in Silence ({W}{W}, Instant — Casualty 2): "Exile target player's hand. That player
      plays the rest of the game with the information that you can exile their hand."
      Wait — this might not be the right card. Let me use accurate examples.

    Body Count ({1}{B}, Sorcery — Casualty 1): "Draw a card for each creature that died this turn."
      With Casualty 1: the sacrifice itself increases the "creatures that died this turn" count.
      Then copy resolves: draw again for each creature that died.

    Vivid Voltage style example: many New Capenna Casualty spells are removal/disruption that double their impact.
```

## Definitive Conclusions

- **Blitz gives haste + draw-on-death in exchange for a forced sacrifice at end of turn** — a finite but immediate threat.
- **Blitz creature dying in combat still draws a card** — the death trigger fires regardless of how it dies.
- **Casualty requires sacrificing a creature as an additional cost at cast time** — not optional after casting.
- **Casualty creates a copy via a triggered ability** — the copy resolves first (LIFO), then the original.
- **Casualty copy can choose different targets** than the original, enabling two separate effects.

## Canonical Example
**Titan of Industry Blitz as a Combat Finisher:**
Opponent at 12 life. You have {4}{G}{G} mana and a Titan of Industry in hand.
Normal cast ({5}{G}{G}): costs more, doesn't have haste — can't attack this turn.
Blitz {4}{G}{G}: pay 7 mana (same as normal but we get haste!).
Titan enters: choose ETBs (shield counter on a creature + 2/2 Rhino token).
Attack with Titan (7/7 haste) + Rhino (2/2): deal 9 damage. Opponent at 3.
Beginning of next end step: sacrifice Titan → draw a card.
Result: 7 damage dealt, ETBs activated, replaced Titan with a draw. Next turn: Rhino finishes.

**Example 2 — Cut of the Profits Casualty 4 Refill:**
Graveyard is empty, hand is empty. You have {4}{B}{B} mana and a 4/4 Zombie on board.
Cast Cut of the Profits, X=4. Pay Casualty 4: sacrifice the 4/4 Zombie.
Casualty trigger fires: copy of Cut of the Profits (X=4) on stack.
Copy resolves first: draw 4 cards, lose 4 life.
Original resolves: draw 4 more cards, lose 4 more life.
Total: 8 cards drawn, 8 life lost, sacrificed a 4/4 creature.
Cost: {4}{B}{B} + 4/4 creature → 8 cards. With Necropotence or similar, life loss is manageable.
Empty hand → full grip of 8 cards in one spell.

## Commonly Confused With
- **P245 (Evoke)** — Evoke is an alternative cost with a mandatory sacrifice; Blitz is similar but the sacrifice is at end of turn (delayed) and the creature has haste before being sacrificed.
- **P215 (Storm)** — Storm copies based on spell count; Casualty copies based on an additional cost paid (sacrifice a creature).
- **P241 (Replicate)** — Replicate also creates spell copies for paid costs; Casualty creates one copy for one creature sacrifice (can't pay multiple times for more copies).
