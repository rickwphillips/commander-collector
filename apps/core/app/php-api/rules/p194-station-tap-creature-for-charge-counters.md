---
id: p194
name: Station — Tap Creature to Add Charge Counters
category: costs
cr_refs: [702.184a, 702.184b, 702.184c, 721]
tags: [station, charge-counters, tap-creature, sorcery-speed, station-card, Final-Fantasy, nonstandard-layout]
created: 2026-03-28
examples_count: 2
---

# P194 — Station — Tap Creature to Add Charge Counters

## Abstract
Station is an activated ability found on "station cards" — a special nonstandard layout from the Final Fantasy Universes Beyond set. The Station ability lets you tap another untapped creature you control to add charge counters to the station permanent equal to that creature's power (sorcery-speed only). Station cards accumulate charge counters and then use them for powerful effects. Additional static abilities can modify how charge counters are determined (e.g., using toughness instead of power). The station keyword itself appears on the permanent; the station card layout includes "station symbols" which are themselves keyword abilities.

## The Definitive Rules

**CR 702.184a** (verbatim): *"Station is an activated ability. 'Station' means 'Tap another untapped creature you control: Put a number of charge counters on this permanent equal to the tapped creature's power. Activate only as a sorcery.'"*

**CR 702.184b** (verbatim): *"Each card printed with a station ability is known as a station card. It has a nonstandard layout and includes station symbols that are themselves keyword abilities. See rule 721, 'Station Cards.'"*

**CR 702.184c** (verbatim): *"Static abilities may modify the result of a station ability by causing it to use a characteristic other than the tapped creature's power to determine the number of counters placed on the permanent with the station ability."*

## The Pattern

```
STATION:
  Activated ability on station cards (nonstandard layout — Final Fantasy UB)
  Activation: Tap another untapped creature you control → add charge counters equal to creature's power
  Timing restriction: "Activate only as a sorcery" — main phase, stack empty, your turn

  STATION + CHARGE COUNTERS:
    Charge counters accumulate on the station permanent
    Tapping a 3-power creature → +3 charge counters
    Tapping multiple creatures over multiple activations: counters stack up
    Station abilities may have thresholds: "when this has 10+ charge counters, do X"

  STATION + POWER CHECK:
    Creature's power is checked at time of tapping (cost payment)
    Buff the creature before tapping for station: more charge counters
    Giant Growth a creature then tap for station: {3} power boost = 3 more counters
    Summoning-sick creatures: cannot tap for station (station is an activated ability the controller activates)
    Actually: rule 302.6 — a creature without haste can't tap as a cost for activating an ability it has
    But station is on the STATION card (permanent), not on the creature being tapped
    Tapping a creature as a COST for another permanent's ability: the creature doesn't activate anything
    So: summoning-sick creatures CAN be tapped as a cost for station activation (just like convoke)

  STATION + TOUGHNESS MODIFIER:
    CR 702.184c: static abilities can change "power" to "toughness" or another characteristic
    Example: Tapestry Warden — creatures with toughness > power use toughness for station
    "Walls" and high-toughness creatures suddenly become great for station activation
    This modifier comes from a static ability, not from station itself

  STATION + SORCERY SPEED:
    Must activate during your main phase when the stack is empty
    Can't use station in response to spells
    Can't use station on an opponent's turn
    Strategic: plan which creatures to tap before entering combat (can't tap before combat if plan to attack)

  STATION SYMBOLS (Rule 721):
    Station cards have "station symbols" in their layout
    Station symbols are themselves keyword abilities (not just reminder text)
    The nonstandard layout displays these symbols distinctively
    Rule 721 governs station card rules specifically

  STATION + COUNTER THRESHOLDS:
    Station cards have abilities that trigger or function at counter thresholds
    Example: "When Station has 5 or more charge counters, sacrifice it: do powerful effect"
    Or: "At the beginning of your upkeep, remove a charge counter from Station. When the last is removed, do X"
    Different station cards have different use patterns for their accumulated counters

  STATION + REMOVAL:
    If the station permanent is destroyed: charge counters are lost (it's destroyed with them)
    Counters are on the permanent — bounce or exile removes the permanent, losing counters
    Plan: activate station enough times, then use the accumulated effect before losing it
```

## Definitive Conclusions

- **Station taps another untapped creature** to add charge counters equal to its power.
- **Sorcery speed only** — activate during your main phase when stack is empty.
- **Power at time of tapping** determines how many counters are added.
- **Summoning-sick creatures CAN be tapped** for station (tapping as cost for another permanent's ability, not the creature's own ability).
- **Static abilities can substitute toughness for power** in determining counter count.

## Canonical Example
**Crystarium Station (station card) with threshold ability "When this has 10+ charge counters, draw 3 cards":**
Turn 1: Tap your 3-power creature → +3 charge counters (total: 3).
Turn 2: Tap your 4-power creature → +4 charge counters (total: 7).
Turn 3: Tap your 3-power creature → +3 charge counters (total: 10).
Threshold reached: draw 3 cards.
Strategic: build up charge counters over multiple turns, then collect the reward.

**Example 2 — Station with Toughness Modifier:**
Tapestry Warden on the battlefield: "creatures with toughness > power use toughness for station."
You control a 0/8 Wall of Omens (0 power, 8 toughness).
Without Tapestry Warden: station activation gives 0 charge counters (0 power).
With Tapestry Warden: 8 toughness > 0 power → use toughness: +8 charge counters!
Defenders/Walls become excellent station fodder with this modifier.

## Commonly Confused With
- **P188 (Exhaust)** — Exhaust is activated only once per object lifetime. Station can be activated repeatedly (once per main phase) as long as you have untapped creatures.
- **P150 (Convoke)** — Convoke taps creatures to reduce casting costs. Station taps creatures to add counters to a permanent.
- **P174 (Level Up)** — Level Up puts level counters on a creature via an activation. Station puts charge counters on itself via tapping other creatures.
