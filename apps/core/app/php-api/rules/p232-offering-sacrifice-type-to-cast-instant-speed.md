---
id: p232
name: Offering — Sacrifice a Permanent of a Type to Cast at Instant Speed With Cost Reduction
category: costs
cr_refs: [702.48a, 702.48b, 702.48c]
tags: [offering, sacrifice-to-cast, instant-speed, cost-reduction, Kamigawa, Patron-of-the-Orochi, Orochi-Patron]
created: 2026-03-28
examples_count: 2
---

# P232 — Offering — Sacrifice a Permanent of a Type to Cast at Instant Speed With Cost Reduction

## Abstract
Offering is a static ability: "[Type] Offering" means you may sacrifice a permanent of the specified type as an additional cost when casting this spell, and if you do, two things happen: (1) the spell's total cost is reduced by the sacrificed permanent's mana cost, and (2) you may cast the spell any time you could cast an instant (even if it's a sorcery). This creates a "sacrifice your permanent type for instant-speed access + mana reduction" trade. Patron spells in Kamigawa used creature type offerings to allow instant-speed casting and cost-efficient plays.

## The Definitive Rules

**CR 702.48a** (verbatim): *"Offering is a static ability that functions while the spell with offering is on the stack. '[Quality] offering' means 'As an additional cost to cast this spell, you may sacrifice a [quality] permanent. If you chose to pay the additional cost, this spell's total cost is reduced by the sacrificed permanent's mana cost, and you may cast this spell any time you could cast an instant.'"*

**CR 702.48b** (verbatim): *"You choose which permanent to sacrifice as you make choices for the spell (see rule 601.2b), and you sacrifice that permanent as you pay the total cost (see rule 601.2h)."*

**CR 702.48c** (verbatim): *"Generic mana in the sacrificed permanent's mana cost reduces generic mana in the spell's total cost. Colored and colorless mana in the sacrificed permanent's mana cost reduces mana of the same type in spell's total cost, and any excess reduces that much generic mana in spell's total cost."*

## The Pattern

```
OFFERING:
  Optional additional cost when casting: sacrifice a permanent of the specified type
  If paid:
  1. COST REDUCTION: total cost reduced by the sacrificed permanent's mana cost
  2. TIMING: may cast the spell any time you could cast an instant (even if it's a sorcery)

OFFERING + COST REDUCTION:
  The sacrificed permanent's mana cost reduces the offering spell's total cost
  Generic reduction: generic mana in the sacrifice reduces generic in the total cost
  Colored reduction: exact color matches reduce the same color, excess reduces generic
  Example: sacrifice {2}{G}{G} permanent to an Offering spell: reduce {2} generic and {G}{G} colored
  If the offering spell costs {5}{G}{G}: reduced by {2}{G}{G} → pay {3}

OFFERING + INSTANT SPEED:
  If offering cost is paid (sacrifice made): you may cast the spell any time you could cast an instant
  Sorcery-speed spells (main phase, stack empty) → become instant-speed!
  Cast on opponent's end step, in response to their effects, etc.

OFFERING + TYPE:
  "Snake Offering": sacrifice a Snake permanent
  "Dragon Offering": sacrifice a Dragon
  "Spirit Offering": sacrifice a Spirit
  The type must be the permanent's actual type at time of sacrifice (not creature type changing effects... usually the printed type)
  Cards with Offering: Kamigawa Patron cycle (each requires sacrificing a specific creature type)

PATRON CYCLE (Kamigawa Betrayers):
  Patron of the Orochi ({6}{G}{G}): 7/7 Snake, "Snake offering. Tap all untapped lands and/or creatures target player controls."
  Sacrifice a Snake → reduce cost by Snake's mana cost + can cast at instant speed
  A 1-mana Snake ({G}): reduces Patron cost by {G}, and allows instant-speed cast
  Total: {6}{G}{G} − {G} = {6}{G} to cast at instant speed (if sacrificing a 1-mana Snake)

  Patron of the Moon ({5}{U}{U}): "Moonfolk offering. Play up to three additional lands this turn."
  Patron of the Kitsune ({4}{W}{W}): "Fox offering. Each of your creatures gains first strike until end of turn."
  Each Patron rewards having the specific creature type to sacrifice

OFFERING + TIMING INTERACTION:
  Normally: these are sorceries/permanents with "offering" that enable instant-speed play
  Without paying the offering cost: must be cast at normal sorcery-speed if it's a sorcery
  With offering cost paid: instant-speed is unlocked

OFFERING + SACRIFICE TARGET:
  The permanent is chosen when you declare the spell and making choices (601.2b)
  The permanent is sacrificed when you pay costs (601.2h)
  Between choice and cost: opponent can respond? No — choices and costs are part of one action
  Once you announce you're casting with offering, you're committed to sacrificing that permanent
  The permanent is sacrificed as part of the cost payment (before the spell is on the stack)

OFFERING + MANA COST OF SACRIFICED PERMANENT:
  What if the sacrificed permanent has {0} mana cost? The cost is reduced by {0} = no reduction
  The instant-speed benefit still applies even if cost reduction is zero
  A 0-cost permanent sacrificed: no cost reduction but instant-speed access → still useful!

OFFERING + ALTERNATIVE COSTS:
  If casting with an alternative cost AND offering: additional costs still apply to the total
  Offering is an additional cost, not an alternative cost
  Can stack with other additional costs but NOT with other alternative costs simultaneously
```

## Definitive Conclusions

- **Offering sacrifices a permanent of the type** for cost reduction + instant-speed access.
- **Cost reduction** equals the sacrificed permanent's mana cost.
- **Instant speed**: if offering cost is paid, the spell can be cast any time an instant could be.
- **Sacrifice happens as part of paying costs** — choose target first, sacrifice on payment.
- **The Patron cycle** (Kamigawa) showcases Offering with powerful creature type sacrifice themes.

## Canonical Example
**Patron of the Orochi with Snake tribal:**
Hand: Patron of the Orochi ({6}{G}{G}, 7/7, Snake Offering).
Battlefield: Sakura-Tribe Elder ({1}{G}, 1/1 Snake: "sacrifice, search for a basic land").
Normally: Patron costs {6}{G}{G} = 8 mana, sorcery-speed timing.
With Snake Offering: sacrifice Sakura-Tribe Elder ({1}{G} mana cost).
Reduce {6}{G}{G} by {1}{G}: pay {5}{G} instead of {6}{G}{G} = one less colored mana needed.
AND: may cast at instant speed.
Opponent's end step: cast Patron of the Orochi at instant speed for {5}{G}.
Activate Patron's tap ability: tap all opponent's lands and creatures.
Surprise: opponent has no blockers next turn AND all lands tapped going into their turn.

**Example 2 — 0-Cost Offering for Instant Speed:**
Patron with offering {0}: any 0-cost permanent can be sacrificed.
Sacrifice Memnite ({0} cost: 1/1 artifact creature): cost reduced by {0} = no reduction.
But: Patron can now be cast at instant speed!
Trade a Memnite for instant-speed access to a powerful Patron effect.
In formats with lots of {0}-cost artifacts (Affinity): easy instant-speed access to Offering spells.

## Commonly Confused With
- **P150 (Convoke)** — Convoke taps creatures to reduce mana cost (creatures aren't sacrificed). Offering sacrifices creatures to reduce cost AND unlock instant speed.
- **P210 (Kicker)** — Kicker is an additional cost for a bonus. Offering is an additional cost (sacrifice) for cost reduction + timing change.
- **P217 (Goad)** — Goad is a combat mechanic. Unrelated to Offering.
