---
id: p092
name: Scavenge — Graveyard Power Transfer
category: zones
cr_refs: [702.97a]
tags: [scavenge, graveyard, power, counters, exile, sorcery-speed, +1/+1, activated-ability]
created: 2026-03-28
examples_count: 2
---

# P092 — Scavenge — Graveyard Power Transfer

## Abstract
Scavenge is an activated ability that functions in the graveyard. Pay the scavenge cost and exile the card to put +1/+1 counters equal to the scavenged card's power on a target creature. This transfers the "value" of a dead creature into a living one. Key note: the power checked is the SCAVENGED card's power (the exiled card), not the target creature. Scavenge is sorcery-speed and exiles the card permanently.

## The Definitive Rule

**CR 702.97a** (verbatim): *"Scavenge is an activated ability that functions only while the card with scavenge is in a graveyard. 'Scavenge [cost]' means '[Cost], Exile this card from your graveyard: Put a number of +1/+1 counters equal to the power of the card you exiled on target creature. Activate only as a sorcery.'"*

## The Pattern

```
SCAVENGE:
  Activate from graveyard: pay cost + exile this card
  Effect: target creature gets X +1/+1 counters, where X = the exiled card's power
  "The power of the card you exiled" = the card's printed power (in graveyard = printed + modifications)

WHOSE POWER IS USED?
  The SCAVENGED card's power (what you just exiled)
  Not the target creature's power
  Not an ongoing reference — it's a fixed number at activation

POWER IN GRAVEYARD:
  A card in the graveyard has its printed power (characteristics don't change in graveyard from effects)
  Wait: some effects can modify characteristics in the graveyard (but rare)
  Generally: power = printed power on the scavenged card
  If the creature had counters on it before dying: counters are gone in graveyard (704.5d for tokens;
    for regular cards, counters are a state, not a characteristic — in graveyard the card has
    its printed power)

EXILE IS PERMANENT:
  Exiling the card is the cost (paid when activating)
  If scavenge ability is countered (Stifle): card is still exiled (cost was paid)
  Cannot scavenge the same card twice

DOUBLING SEASON:
  Counters placed on a creature you control by scavenge: Doubling Season would double them
  Scavenge puts X counters → Doubling Season → 2X counters on the target

TIMING:
  Sorcery-speed only (main phase, stack empty)
  Can't activate in response to things
```

## Definitive Conclusions

- **Scavenge uses the exiled card's power** to determine counter count.
- **Exiling is the cost.** Can't be re-scavenged after.
- **Sorcery-speed only.** Can't activate at instant speed.
- **Doubling Season doubles scavenge counters.**
- **Power is measured at activation time** (when the card is in the graveyard).

## Canonical Example
**Deadbridge Goliath (Scavenge {4}{G}{G}, power 5):**
Deadbridge Goliath dies and goes to graveyard. Later: pay {4}{G}{G} and exile Goliath → target creature gets 5 +1/+1 counters (Goliath's power = 5). With Doubling Season: 10 counters.

**Example 2 — Multiple scavenges:**
You have three creatures with scavenge (powers 3, 4, 5). Target one creature with all three: gains 3 + 4 + 5 = 12 +1/+1 counters. Each scavenge activation is separate (must have main phase + stack empty for each).

## Commonly Confused With
- **P037 (Infect/Wither)** — Infect modifies combat damage; scavenge directly places counters outside combat. Different mechanisms for adding -1/-1 or +1/+1 counters.
- **P054 (Proliferate)** — Both add counters. Scavenge places initial counters from graveyard; Proliferate multiplies existing counters.
