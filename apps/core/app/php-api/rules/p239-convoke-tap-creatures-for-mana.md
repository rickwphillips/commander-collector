---
id: p239
name: Convoke — Tap Untapped Creatures to Pay for Spells
category: costs
cr_refs: [702.51a, 702.51b, 702.51c, 702.51d]
tags: [convoke, tap-creatures, mana-payment, cost-reduction, Ravnica, Selesnya, Siege-Wurm, Chord-of-Calling, Sundering-Growth]
created: 2026-03-28
examples_count: 2
---

# P239 — Convoke — Tap Untapped Creatures to Pay for Spells

## Abstract
Convoke allows you to tap untapped creatures you control to help pay for a spell's total cost: each tapped creature contributes either colored mana matching its color or one generic mana. Unlike kicker or additional costs, Convoke is NOT an additional or alternative cost — it's a payment method applied after the total cost is calculated. This means cost reductions (like Heartless Summoning) apply first, then convoke can reduce the remaining cost. Selesnya (green/white) popularized convoke as "your creatures vote for you by tapping," but the most competitive convoke card is Chord of Calling — an instant-speed creature tutor.

## The Definitive Rules

**CR 702.51a** (verbatim): *"Convoke is a static ability that functions while the spell with convoke is on the stack. 'Convoke' means 'For each colored mana in this spell's total cost, you may tap an untapped creature of that color you control rather than pay that mana. For each generic mana in this spell's total cost, you may tap an untapped creature you control rather than pay that mana.'"*

**CR 702.51b** (verbatim): *"The convoke ability isn't an additional or alternative cost and applies only after the total cost of the spell with convoke is determined."*

**CR 702.51c** (verbatim): *"A creature tapped to pay for mana in a spell's total cost this way is said to have 'convoked' that spell."*

**CR 702.51d** (verbatim): *"Multiple instances of convoke on the same spell are redundant."*

**CR 702.51b example** (verbatim): *"Heartless Summoning says, in part, 'Creature spells you cast cost {2} less to cast.' You control Heartless Summoning and cast Siege Wurm, a spell with convoke that costs {5}{G}{G}. The total cost to cast Siege Wurm is {3}{G}{G}. After activating mana abilities, you pay that total cost. You may tap up to two green creatures and up to three other creatures to pay that cost, and the remainder is paid with mana."*

## The Pattern

```
CONVOKE + COST PAYMENT:
  Convoke applies AFTER total cost is determined (not before reductions)
  Steps:
  1. Announce the spell
  2. Apply all cost modifications (reductions, increases)
  3. Determine total cost
  4. Choose which creatures to tap for convoke (paying colored or generic)
  5. Pay remaining cost with mana

CONVOKE + COLORED MANA:
  To pay {G} in total cost: tap an untapped GREEN creature
  To pay {W} in total cost: tap an untapped WHITE creature
  To pay generic mana {N}: tap any untapped creature (any color)
  Multicolored creatures: can tap for either color they have (player's choice at payment)

CONVOKE + SUMMONING SICKNESS:
  Creatures with summoning sickness (entered this turn, no haste): can they be tapped for convoke?
  YES! Convoke tapping is NOT an activated ability and NOT attacking
  "A creature affected by the legend rule or summoning sickness... can still be tapped as a cost or to pay for mana."
  Wait: rule 302.6 says you can't activate tap abilities of creatures with summoning sickness
  Convoke is NOT an activated ability — it's a static ability allowing payment
  Rule 302.6 applies to ACTIVATED ABILITIES with {T} in the cost
  Convoke just lets you tap as PAYMENT for a spell's cost — not an activated ability
  CONCLUSION: YES, you CAN tap creatures with summoning sickness for convoke

CONVOKE + ATTACKING/BLOCKING:
  You can tap attacking or blocking creatures for convoke (if timing allows)?
  During main phase (casting): creatures not yet in combat
  Can you cast a convoke spell during combat? During main phase 2, yes
  If you cast during second main phase: attacking creatures that survived (now untapped?)
    Actually: attacking creatures are tapped and don't untap until untap step
    They'd be tapped → can't be used for convoke (convoke requires UNTAPPED)

CONVOKE + COST REDUCTION:
  Cost reductions apply FIRST (before convoke):
  Heartless Summoning (-{2}): reduces total cost, THEN convoke taps remaining
  Goblin Electromancer ("instant/sorcery spells you cast cost {1} less"): can this reduce convoke spells?
    Only if the convoke spell is an instant (like Chord of Calling)
    Siege Wurm is a sorcery: no reduction from Goblin Electromancer
  The interaction: always apply mana cost reductions first, then use convoke for remaining

CHORD OF CALLING ({X}{G}{G}{G}, Instant — Convoke): "Search your library for a creature card with mana value X or less and put it onto the battlefield."
  Instant speed + convoke + tutor = powerful interaction
  Tap 5 green creatures: convoke pays {G}{G}{G} + {2} generic = 5 creatures pay {G}{G}{G}{2}
  Remaining: just {X}{G} or so in mana (depending on creatures)
  At end of opponent's turn: convoke Chord at instant speed, finding ANY creature with MV ≤ X
  EDH: Chord for Reclamation Sage (destroys artifact/enchantment), Eternal Witness (return a card), etc.
  Cord of Calling + Elesh Norn: surprise 4/7 with first strike ending combat calculations

CONVOKE + NEW CAPENNA / MODERN:
  Gleeful Demolition ({G}, Modern and Pioneer convoke enabler): creates 3 Goblin tokens with "sacrifice an artifact"
    Then tap those tokens for convoke spells immediately (they entered this turn — summoning sickness? No! They're tokens but convoke doesn't care about summoning sickness)
  Innkeeper's Talent (Wilds of Eldraine): rewards casting for free via convoke

CONVOKE LIMITS:
  Can't tap MORE creatures than the total cost requires
  Each tapped creature pays for exactly ONE mana (colored = that color, generic = any)
  Surplus tapping: not allowed (you don't "save" extra taps)
  Tap creatures one-for-one with each mana symbol you're paying via convoke
```

## Definitive Conclusions

- **Convoke taps creatures as payment** — not an additional cost, applies AFTER total cost calculation.
- **Colored mana**: tap a creature of that color. **Generic mana**: tap any creature.
- **Summoning sickness does NOT prevent convoke** — tapping for convoke is not an activated ability.
- **Cost reductions apply first**: reduce the total cost, then convoke pays the remainder.
- **Chord of Calling** is the most competitive convoke: instant-speed creature tutor using your battlefield.

## Canonical Example
**Chord of Calling at Instant Speed:**
Turn 4. Battlefield: 4 green creatures (Forest, Dryad Arbor, Elvish Mystic, Llanowar Elves). Mana available: {G}{G}{G}{G}.
Opponent's end step: cast Chord of Calling with X = 3 (finds creatures with MV ≤ 3).
Total cost: {3}{G}{G}{G} (X=3 + {G}{G}{G}).
Tap 3 green creatures for convoke: they pay {G}{G}{G}.
Remaining: {3} in generic. Pay with {G}{G}{G} from the 4th creature? Wait:
Actually pay: tap Elvish Mystic ({G}), Llanowar Elves ({G}), Dryad Arbor ({G}) → each pays {G}.
Total convoke payment: {G}{G}{G}. Remaining cost: {3} generic.
Pay {G}{G}{G}{G} from mana (Forests). Total: {G}{G}{G}{G}.
Wait: X=3 means {3}{G}{G}{G} = 6 total mana. Convoke provides {G}{G}{G} (3 creatures).
Remaining: {3} generic → pay with {G}{G}{G} from lands.
Actually: {G}{G}{G} paying green symbols + {G}{G}{G} paying generic = 6 total. Chord resolves.
Find Reclamation Sage: ETB destroys opponent's key enchantment at instant speed.

**Example 2 — Summoning Sickness Convoke (Token Flood):**
Opponent declared: "Your creatures can't attack."
Your turn: cast Gleeful Demolition ({G}), saccing an artifact → create three 1/1 Goblin tokens.
Those tokens enter with summoning sickness (can't attack or use activated {T} abilities).
BUT: you can STILL tap them for convoke!
Cast Siege Wurm ({5}{G}{G}, convoke): tap all three Goblins for convoke.
Three Goblins pay {G}{G}{G} (they're green creatures paying colored mana).
Remaining: {5} generic → pay with mana.
Siege Wurm ({5}{G}{G}) with convoke, three goblins paying: only need {5} more mana.
This is the "flood the board with tokens then convoke a big spell" plan.

## Commonly Confused With
- **P210 (Kicker)** — Kicker is an ADDITIONAL cost you choose to pay; Convoke is a PAYMENT METHOD for the existing cost.
- **P218 (Devour)** — Devour sacrifices creatures for ETB counters; Convoke taps creatures as mana payment (creatures survive the cast).
- **P241 (Replicate)** — Replicate pays additional cost to get copies; Convoke is just about paying the spell's cost more efficiently.
