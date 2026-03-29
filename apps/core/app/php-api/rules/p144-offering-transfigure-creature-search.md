---
id: p144
name: Offering and Transfigure — Sacrifice-to-Search Mechanics
category: costs
cr_refs: [702.48a, 702.48b, 702.48c, 702.71a]
tags: [offering, transfigure, sacrifice, cost-reduction, instant-speed, same-CMC, search-library, kamigawa]
created: 2026-03-28
examples_count: 2
---

# P144 — Offering and Transfigure — Sacrifice-to-Search Mechanics

## Abstract
Two Kamigawa mechanics that involve sacrificing a permanent to enable special casting. **Offering** lets you sacrifice a permanent of the specified type to cast a spell at instant speed with a cost reduction equal to the sacrificed permanent's mana cost. **Transfigure** lets you sacrifice the creature to search your library for a creature with the same mana value and put it directly into play — a perfect tutor-ETB in one activated ability.

## The Definitive Rules

**CR 702.48a** (verbatim): *"'[Quality] offering' means 'As an additional cost to cast this spell, you may sacrifice a [quality] permanent. If you chose to pay the additional cost, this spell's total cost is reduced by the sacrificed permanent's mana cost, and you may cast this spell any time you could cast an instant.'"*

**CR 702.71a** (verbatim): *"'Transfigure [cost]' means '[Cost], Sacrifice this permanent: Search your library for a creature card with the same mana value as this permanent and put it onto the battlefield. Then shuffle your library. Activate only as a sorcery.'"*

## The Pattern

```
OFFERING:
  Optional additional cost: sacrifice a permanent of the specified type
  If you sacrifice:
    1. Spell can be cast at instant speed (even if it's a sorcery!)
    2. Total cost is reduced by the sacrificed permanent's mana cost
  If you don't sacrifice: cast it normally (sorcery speed, full cost)

  COST REDUCTION:
    Reduction = sacrificed permanent's mana cost (as a mana reduction)
    Generic reduction first, then colored mana can reduce colored in the spell cost
    Can't reduce below the remaining mana requirements

  OFFERING + INSTANT SPEED SORCERY:
    A sorcery with "Offering" can be cast at instant speed by paying the offering cost
    Very powerful: turn a sorcery into an instant-speed answer
    Examples: Kami of Tattered Shoji uses Spirit Offering

  OFFERING + EMPTY HAND:
    If you sacrifice the permanent but have no mana to pay remainder: the sacrifice happened
    Can't undo the sacrifice if you can't pay
    (You declare the sacrifice as part of casting, so you must be able to pay total costs)

TRANSFIGURE:
  Activated ability (on the creature itself)
  Cost: [mana] + sacrifice this creature
  Effect: search library for a creature with the SAME mana value → put it directly into play
  Sorcery speed only: must be in main phase with empty stack

  SAME MANA VALUE:
    Search for any creature card with CMC exactly equal to the transfiguring creature's CMC
    Not "up to" — exactly equal
    Examples: Transfigure from a 3-mana creature: search for any 3-mana creature

  TRANSFIGURE AS TUTOR:
    Creature searches for the best 3-drop for the situation
    Unlike normal tutor-to-hand: goes directly to battlefield (ETB triggers fire!)
    No "cast" trigger: the creature enters "put onto battlefield," not cast
    Storm count: not incremented (not casting a spell)
    Cascade: doesn't trigger (not casting)

  TRANSFIGURE + ETB:
    The found creature enters the battlefield → ETB triggers fire
    Powerful: transfigure a 3-mana creature → find ANY 3-mana ETB bomb

  TRANSFIGURE + SELF-SACRIFICE:
    The transfiguring creature sacrifices itself as part of the cost
    Can't get the same card back via transfigure (it's now in the graveyard, not library)
    Unless the library has multiple copies
```

## Definitive Conclusions

- **Offering lets you cast at instant speed + reduced cost** by sacrificing the specified permanent type.
- **The sacrifice is the cost** — commit before paying the mana.
- **Transfigure searches for EXACT same mana value** — puts the found creature directly into play (not hand).
- **Transfigure is "put onto battlefield"** — not casting. ETB triggers fire. Storm and cascade don't.
- **Both are sorcery-speed activations** (offering bypasses sorcery restriction when paid).

## Canonical Example
**Scion of Ugin (Transfigure {3}):**
Pay {3}, sacrifice Scion of Ugin (CMC 5) → search library for any creature with CMC 5 → put it onto battlefield.
This finds the best 5-mana ETB creature (e.g., Mulldrifter at full cost = CMC 5 → enter, draw 2 cards).

**Example 2 — Offering (Spirit Offering):**
Cast a Spirit Offering sorcery. Pay the offering by sacrificing a Spirit you control.
The sorcery can now be cast at instant speed (during opponent's turn, during combat, etc.).
The cost is also reduced by the sacrificed Spirit's mana cost.
Opponent attacks → you sacrifice a 2-mana Spirit → cast the offering sorcery (reduced by {2}) at instant speed.

## Commonly Confused With
- **P086 (Devour)** — Devour sacrifices creatures as a permanent enters. Offering sacrifices to cast a spell.
- **P048 (Emerge)** — Emerge also sacrifices a creature to reduce cost. Key difference: emerge is an alternative cast cost; offering is an additional cost enabling instant speed.
- **P144 Transfigure vs Champion (P055)** — Champion exiles a creature when entering. Transfigure searches for one.
