---
id: p193
name: Tiered — Modal Spell Where Each Mode Has an Additional Cost
category: costs
cr_refs: [702.183a, 700.2]
tags: [tiered, modal-spell, additional-cost, choose-one, mode, stack]
created: 2026-03-28
examples_count: 2
---

# P193 — Tiered — Modal Spell Where Each Mode Has an Additional Cost

## Abstract
Tiered is a static ability on modal spells (spells with "Choose one —" style modes) where each mode has an associated additional cost. When casting a Tiered spell, you choose one mode AND pay that mode's associated cost as an additional cost to casting. This creates a "price menu" for a spell's effects — more powerful modes cost more. Unlike normal modal spells where you freely pick any mode, Tiered ensures you invest resources proportional to the effect you want.

## The Definitive Rules

**CR 702.183a** (verbatim): *"Tiered is a static ability found on some modal spells (see rule 700.2) that applies while the spell is on the stack. Tiered means 'Choose one. As an additional cost to cast this spell, pay the cost associated with that mode.'"*

## The Pattern

```
TIERED:
  Static ability on modal spells (works while spell is on the stack)
  Effect: "Choose one. As an additional cost to cast this spell, pay the cost associated with that mode."
  Each mode on the spell has: mode text + associated additional cost
  You choose a mode, then pay BOTH the spell's mana cost AND that mode's additional cost

  TIERED + CASTING PROCESS:
    Announce the spell (put it on the stack)
    Choose which mode you want
    Determine total cost: spell's mana cost + mode's additional cost
    Pay both costs together (as per normal cost payment rules)
    If additional cost can't be paid: can't choose that mode

  TIERED + MODE COSTS:
    Different modes have different additional costs
    Weak mode: low or no additional cost
    Powerful mode: high additional cost (discard a card, sacrifice a creature, pay extra mana, etc.)
    This creates a "price tier" system — more powerful effects cost more

  TIERED + ADDITIONAL COST TYPES:
    Additional costs can be: pay mana, discard cards, sacrifice permanents, exile from graveyard, etc.
    The mode's cost is chosen WHEN you choose the mode
    You can't choose a mode if you can't pay its additional cost (like any additional cost)

  TIERED + ENTWINE (COMPARISON):
    Entwine: pay extra to choose ALL modes simultaneously
    Tiered: choose ONE mode and pay that mode's associated additional cost
    Tiered doesn't allow choosing multiple modes (unless some other effect)

  TIERED + COPIES:
    Copies of Tiered spells don't pay costs
    When copying a Tiered spell: copy already has the mode chosen
    No need to pay the additional cost for the copy (costs aren't paid for copies)

  TIERED + COST REDUCERS:
    "As an additional cost" — cost reducers that reduce additional costs would apply
    However: specific mode costs are additional costs, not total costs
    Generic cost reducers (like Goblin Electromancer) reduce total casting cost
    Mode-specific reducers would need to specifically mention the mode's cost type

  TIERED DECISION TREE:
    Q: "Can I afford the powerful mode?" → A: Yes → choose it for the stronger effect
    Q: "Do I need the effect right now cheaply?" → A: Yes → choose cheaper mode
    Strategic: tiered spells have flexibility in how much you invest
```

## Definitive Conclusions

- **Tiered is "choose a mode + pay that mode's additional cost"** as part of casting.
- **Each mode has its own price** — higher power modes cost more.
- **Can't choose a mode** if you can't pay its associated additional cost.
- **Copies skip the additional cost** — they're copies, not new casts.
- **Flexible investment** — the same spell can be cheap (weak effect) or expensive (strong effect).

## Canonical Example
**A Tiered sorcery "Choose one: • Mode A — Deal 2 damage to target creature. (Additional cost: pay {2}) • Mode B — Deal 5 damage to target creature. (Additional cost: sacrifice a creature)":**
To choose Mode A: pay the spell's mana cost + {2} extra.
To choose Mode B: pay the spell's mana cost + sacrifice a creature.
If you have no creatures: can only choose Mode A.
If you want to kill a 5-toughness creature: must pay for Mode B (sacrifice a creature).
Tiered: the player decides at cast time which "tier" of effect they need.

**Example 2 — Tiered in Attrition Situations:**
Late game: opponent has few threats, your board is wide.
Tiered instant with:
• Cheap mode (pay {1} extra): counter target spell.
• Expensive mode (discard a card): counter and draw 2 cards.
If holding key information card: choose cheap mode (don't discard).
If hand is full: choose expensive mode (counter + draw = pure value).
Tiered rewards reading the board state to optimize mana/resource efficiency.

## Commonly Confused With
- **P152 (Overload)** — Overload replaces "target" with "each" for a higher cost. Single mode, scaled effect. Tiered offers multiple distinct modes each with a cost.
- **P156 (Cascade)** — Cascade casts spells for free. Tiered costs more (additional cost per mode).
- **P148 (Morph)** — Morph is an alternative casting cost for creatures. Tiered is additional costs for modal spells.
- **P150 (Convoke)** — Convoke reduces cost by tapping creatures. Tiered adds costs, doesn't reduce them.
