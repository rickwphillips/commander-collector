---
id: p190
name: Harmonize — Cast from Graveyard by Tapping a Creature
category: costs
cr_refs: [702.180a, 702.180b]
tags: [harmonize, graveyard-cast, alternative-cost, tap-creature, power-reduction, exile-after-use]
created: 2026-03-28
examples_count: 2
---

# P190 — Harmonize — Cast from Graveyard by Tapping a Creature

## Abstract
Harmonize is an alternative cost mechanic that lets you cast a spell from your graveyard. To use it, you pay the harmonize cost AND tap up to one untapped creature you control (instead of the normal mana cost). The tapped creature provides a cost reduction equal to its power in generic mana. After the spell resolves (or leaves the stack), it's exiled instead of going anywhere else. This "one-time cast from graveyard" mechanic rewards having powerful creatures in play — a large creature makes the harmonized spell cheaper — but the spell is gone forever after use.

## The Definitive Rules

**CR 702.180a** (verbatim): *"Harmonize represents three static abilities: one that functions while the card is in a player's graveyard and two that function while the spell with harmonize is on the stack. 'Harmonize [cost]' means 'You may cast this card from your graveyard by paying [cost] and tapping up to one untapped creature you control rather than paying this spell's mana cost,' 'If you cast this spell using its harmonize ability, its total cost is reduced by an amount of generic mana equal to the tapped creature's power,' and 'If the harmonize cost was paid, exile this card instead of putting it anywhere else any time it would leave the stack.' Casting a spell using its harmonize ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.180b** (verbatim): *"You choose which creature to tap as you choose to pay a spell's harmonize cost (see rule 601.2b), and then tap that creature as you pay the total cost."*

## The Pattern

```
HARMONIZE:
  Three static abilities in one:
  1. FROM GRAVEYARD: "May cast from graveyard by paying harmonize cost + tap up to one untapped creature"
  2. ON STACK: "Cost reduced by tapped creature's power (generic mana)"
  3. ON STACK: "If harmonize cost was paid, exile instead of going anywhere else when leaving stack"

  HARMONIZE + CASTING:
    Must be in graveyard (not hand or other zones)
    Alternative cost: pay harmonize cost (a different mana cost) + tap a creature
    The tap is part of the payment (happens as you pay costs per 601.2)
    "Up to one" creature: can tap 0 or 1 creature
    If you tap 0: no cost reduction, just pay the harmonize cost from graveyard

  HARMONIZE + COST REDUCTION:
    Choose a creature to tap → its power = generic mana reduction
    A 4-power creature → reduce generic cost by 4
    The tapped creature's power is checked at the time you pay costs (rule 602.4b)
    Can reduce to 0 generic but still must pay colored mana in harmonize cost
    Cannot reduce below 0 (normal cost reduction rules)

  HARMONIZE + SUMMONING SICKNESS:
    The creature you tap for harmonize must be untapped
    Summoning sick creatures: cannot tap them (they can't tap for any reason except attacking/blocking rules)
    Actually: creatures with summoning sickness CAN be tapped by other effects/costs
    Wait: rule 302.6 says creature can only ACTIVATE a tap ability if not summoning sick
    But paying a cost that requires tapping a creature is different from ACTIVATING an ability
    For COSTS that say "tap a creature you control": summoning sick creatures can be tapped
    The harmonize cost is not an activated ability of the creature — it's a cost you pay when casting
    So: you CAN tap a summoning sick creature to pay the harmonize cost
    The creature doesn't "use" an ability — you tap it as a cost

  HARMONIZE + EXILE:
    If you used the harmonize ability: when the spell leaves the stack, it's exiled
    This means: even if countered, the card goes to exile (not graveyard)
    You get only ONE cast from graveyard per game per card instance
    After use: the card is gone from the game

  HARMONIZE VS FLASHBACK/ESCAPE:
    Flashback: exile on resolution, graveyard cast for flashback cost
    Escape: exile N other cards + mana cost, graveyard cast
    Harmonize: tap a creature + reduced harmonize cost, graveyard cast → exile
    Key difference: harmonize scales with creature power → synergizes with big creatures

  HARMONIZE + VEHICLES:
    Vehicles are creatures when crewed (artifact creatures)
    Can tap a crewed Vehicle for harmonize? Yes, if it's an untapped creature (crewed Vehicle)
    Power of the Vehicle applies as power of the "tapped creature"
    Big Vehicles with high power → big harmonize discount

  HARMONIZE + POWER CHANGES:
    Power buffs before paying harmonize: affect the reduction amount
    Giant Growth on the tapped creature before paying: would increase the discount
    The power is evaluated at time of payment (as costs are being paid)
```

## Definitive Conclusions

- **Harmonize is a graveyard alternative cost** — tap harmonize cost (not normal mana cost) + tap up to one creature.
- **Power reduction**: the tapped creature's power reduces the generic mana cost.
- **Exile on resolution** — if harmonize cost was paid, the card is exiled when it leaves the stack (countered or resolved).
- **One use per card** — the card is gone after harmonize use; can't graveyard-cast it twice.
- **"Up to one" creature** — tapping 0 creatures is legal (just no discount).

## Canonical Example
**A sorcery with "Harmonize {2}{G}" and printed cost {5}{G}{G}:**
Sorcery is in graveyard. You control an untapped 4-power creature.
Choose to harmonize: pay {2}{G} + tap the 4-power creature.
Cost reduced by 4 generic: {2}{G} − {4} generic = pay just {G} colored (the {2} generic becomes 0, reduced below {G} colored not possible so just {G}).
Wait: reduce {2} by 4? Can't go below 0 — so pay {0+G} = just {G}.
Spell resolves. Instead of going to hand/graveyard: exiled.
That sorcery is now gone from the game.

**Example 2 — Harmonize in Creature-Heavy Green:**
A heavy green deck with many big creatures: a 6/6 trampler on the field.
A good sorcery with Harmonize {3}{G}: tapping the 6-power creature reduces by 6 generic.
Effective cost: {3}{G} − {6} generic → {0}{G} = just {G}.
Cast a powerful late-game spell for just {G} by tapping the big creature.
Synergy: big creature strategies get more value from spells in the graveyard.

## Commonly Confused With
- **P149 (Dredge)** — Dredge replaces draws to return cards from graveyard; never actually casts from graveyard.
- **P168 (Escape)** — Escape exiles N other cards from graveyard as additional cost; doesn't involve tapping creatures.
- **P163 (Retrace)** — Retrace casts from graveyard by discarding a land; doesn't exile afterward (goes back to graveyard).
- **P164 (Rebound)** — Rebound exiles then casts from exile at upkeep; harmonize is specifically graveyard → exile.
