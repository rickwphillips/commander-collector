---
id: p150
name: Convoke and Improvise — Tap Permanents to Pay Mana
category: costs
cr_refs: [702.51a, 702.51b, 702.51c, 702.126a, 702.126b]
tags: [convoke, improvise, tap-to-pay, creature, artifact, mana-substitute, cost-reduction, ravnica, kaladesh]
created: 2026-03-28
examples_count: 2
---

# P150 — Convoke and Improvise — Tap Permanents to Pay Mana

## Abstract
Convoke and Improvise both let you tap permanents instead of paying mana for a spell, but differ in what you tap. **Convoke** taps creatures — a colored creature taps for 1 colored mana (matching its color), any creature taps for 1 generic. **Improvise** taps artifacts — any artifact taps for 1 generic mana. Neither is an additional cost; they apply after the spell's total cost is calculated, during mana payment. You can combine them with mana abilities as normal. Crucially, tapped creatures/artifacts can't also produce mana the traditional way if they're used for convoke/improvise — tapping is tapping.

## The Definitive Rules

**CR 702.51a** (verbatim): *"Convoke is a static ability that functions while the spell with convoke is on the stack. 'Convoke' means 'For each colored mana in this spell's total cost, you may tap an untapped creature of that color you control rather than pay that mana. For each generic mana in this spell's total cost, you may tap an untapped creature you control rather than pay that mana.'"*

**CR 702.51b** (verbatim): *"The convoke ability isn't an additional or alternative cost and applies only after the total cost of the spell with convoke is determined. Example: Heartless Summoning says, in part, 'Creature spells you cast cost {2} less to cast.' You control Heartless Summoning and cast Siege Wurm, a spell with convoke that costs {5}{G}{G}. The total cost to cast Siege Wurm is {3}{G}{G}. After activating mana abilities, you pay that total cost. You may tap up to two green creatures and up to three other creatures to pay that cost, and the remainder is paid with mana."*

**CR 702.126a** (verbatim): *"Improvise is a static ability that functions while the spell with improvise is on the stack. 'Improvise' means 'For each generic mana in this spell's total cost, you may tap an untapped artifact you control rather than pay that mana.'"*

## The Pattern

```
CONVOKE:
  Static ability on the spell (while on stack)
  Apply AFTER total cost is determined (reductions happen first)
  For COLORED mana: tap a creature of that color to substitute
    → Tap a white creature to pay {W}
    → Tap a blue creature to pay {U}
    → Multicolored creature: can pay for either color?
      Actually: "tap an untapped creature OF THAT COLOR" — multicolor creature can pay for any of its colors
  For GENERIC mana: tap any untapped creature you control

  CONVOKE + SUMMONING SICKNESS:
    Summoning-sick creatures can be tapped for convoke!
    They're paying a cost, not activating a {T} ability of their own
    (Just like saddle in P145)
    → A 1/1 token that just entered can convoke

  CONVOKE + TAPPED CREATURES:
    Only UNTAPPED creatures can be used for convoke
    Creatures that already attacked or were tapped by other effects: can't convoke

  CONVOKE + COST CALCULATION:
    First: determine total cost (base - reductions + additions)
    Then: tap creatures to substitute
    Order matters: if Heartless Summoning reduces cost by {2}, you tap fewer creatures

  CONVOKE + MULTIPLE:
    Multiple instances of convoke are redundant (CR 702.51d)
    Doesn't let you tap twice

IMPROVISE:
  Same structure as convoke but for ARTIFACTS (not creatures)
  Only covers GENERIC mana (can't pay colored mana with artifact taps)
  Any untapped artifact — land-artifacts, creature-artifacts, whatever, as long as it's an artifact
  Summoning-sick artifact creatures: CAN be tapped for improvise (same as convoke rule)

  IMPROVISE + COLORED MANA:
    Improvise only covers generic mana in the cost
    If the spell costs {2}{U}: can use improvise for the {2}, still need {U} from mana
    Can't tap artifacts to pay for {U}

CONVOKE VS IMPROVISE:
  Convoke: tap creatures, can pay colored
  Improvise: tap artifacts, generic only
  Some cards have BOTH convoke and improvise → tap creatures for colored, artifacts for generic

CONVOKE/IMPROVISE + X SPELLS:
  If the spell has {X} in its cost: X is chosen first, then total cost determined, then convoke/improvise
  X spells with convoke: tap creatures to pay for X portion (as generic mana)

CONVOKE + TOKENS:
  Token creatures can convoke
  Selesnya Conclave + convoke: generate tokens, use them to convoke large spells
  March of the Multitudes (convoke): create many tokens, use tokens to cast March again
```

## Definitive Conclusions

- **Convoke taps creatures to pay for colored or generic mana** — colored creatures pay their color.
- **Improvise taps artifacts to pay generic mana only** — can't substitute colored requirements.
- **Neither is an additional or alternative cost** — they apply after total cost is calculated.
- **Summoning-sick creatures and artifacts CAN be tapped** for convoke/improvise.
- **Only UNTAPPED permanents** can be used — already-tapped ones can't contribute.

## Canonical Example
**Chord of Calling (Convoke {X}{G}{G}{G}):**
You control 5 untapped green creatures. Cast Chord of Calling with X = 3.
Total cost: {3}{G}{G}{G}. Tap 3 green creatures to pay {G}{G}{G}. Tap 3 more creatures to pay {3} generic.
Result: Chord resolves for free (or near-free), searching for a creature with CMC ≤ 3.
Even freshly played token creatures can be tapped for Chord's convoke.

**Example 2 — Inspiring Statuary + Improvise:**
Inspiring Statuary: "Nonartifact spells you control have improvise."
You control 4 artifacts. Cast a non-artifact 6-mana spell. Tap 4 artifacts → pay 4 less generic mana.
This turns all your artifact permanents into mana substitutes for big spells.

## Commonly Confused With
- **P117 (Affinity)** — Affinity reduces cost by counting permanents you control. Convoke/Improvise substitutes mana payment by tapping those permanents.
- **P150 vs Delve (P151)** — Delve exiles cards from graveyard to pay generic mana. Convoke/Improvise taps permanents on battlefield. Both reduce casting cost, different resources.
- **P129 (Spree)** — Spree adds per-mode costs. Convoke/Improvise reduces costs by tapping.
