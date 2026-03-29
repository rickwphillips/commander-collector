---
id: p058
name: Crew — Vehicle Activation and Power Check
category: combat
cr_refs: [702.122a, 702.122b, 702.122c, 702.122d]
tags: [crew, vehicle, artifact-creature, power-check, tap, summoning-sickness, become-crewed, combat]
created: 2026-03-28
examples_count: 2
---

# P058 — Crew — Vehicle Activation and Power Check

## Abstract
Crew is an activated ability on Vehicle cards. Tapping creatures with total power N or greater converts the Vehicle into an artifact creature until end of turn. The power check is aggregate — you can tap multiple creatures whose combined power meets or exceeds N. Crew activation uses the standard "tap creatures as a cost" structure (not combat), so summoning sickness doesn't prevent a creature from crewing. The Vehicle becomes a creature until end of turn but retains its artifact type. When a Vehicle is crewed, abilities that trigger "when this Vehicle becomes crewed" fire.

## The Definitive Rule

**CR 702.122a** (verbatim): *"Crew is an activated ability of Vehicle cards. 'Crew N' means 'Tap any number of other untapped creatures you control with total power N or greater: This permanent becomes an artifact creature until end of turn.'"*

**CR 702.122b** (verbatim): *"A creature 'crews a Vehicle' when it's tapped to pay the cost to activate a Vehicle's crew ability."*

**CR 702.122c** (verbatim): *"If an effect states that a creature 'can't crew Vehicles,' that creature can't be tapped to pay the crew cost of a Vehicle."*

**CR 702.122d** (verbatim): *"Some Vehicles have abilities that trigger when they become crewed. 'Whenever [this Vehicle] becomes crewed' means 'Whenever a crew ability of [this Vehicle] resolves.' If that ability has an intervening 'if' clause that refers to information about the creatures that crewed it, it means only creatures that were tapped to pay the cost of the crew ability that caused it to trigger."*

## The Pattern

```
CREW SEQUENCE:
  1. Announce crew activation (it's an activated ability)
  2. Choose creatures to tap (must have total power ≥ crew number)
  3. Pay cost: tap the chosen creatures
  4. Crew ability resolves: Vehicle becomes an artifact creature until end of turn

POWER CHECK:
  Only checks at activation (when choosing which creatures to tap)
  Total power of tapped creatures must be ≥ N at time of tapping
  If a chosen creature's power changes after tapping (pump spell): doesn't matter
    (Power was checked and met when cost was paid)

WHAT CAN CREW?
  Any untapped creature you control
  Even creatures with summoning sickness (tapping is YOUR ability, not theirs)
  Even 0-power creatures (contribute 0 to total — need others to compensate)
  Cannot: tap the Vehicle itself to crew itself (CR 702.122a: "other untapped creatures")
  Cannot: tap a creature that "can't crew Vehicles" (CR 702.122c)

VEHICLE AS ARTIFACT CREATURE:
  Until end of turn only — reverts at cleanup step
  While crewed: has the P/T printed on the Vehicle card
  While crewed: can be targeted by creature removal
  While crewed: can attack and block normally
  While crewed: still an artifact (artifact creature — both types)
  During end step: SBAs don't remove "artifact creature" status — cleanup removes it

MULTIPLE CREW ACTIVATIONS:
  Can crew same Vehicle multiple times in a turn
  Each crew activation creates a new "becomes crewed" trigger
  Already-creature Vehicle becoming "crewed" again still triggers "becomes crewed"

CREW ABILITY — SORCERY SPEED:
  Crew is an activated ability → activatable at instant speed (if you have priority)
  No sorcery-speed restriction on crew activation
  You can crew during opponent's attack step (to block), during upkeep, etc.

"BECOMES CREWED" TRIGGERS:
  Trigger fires when the crew ability RESOLVES (not when cost is paid)
  Intervening if clause: "if crewed by a creature with power ≥ X" — checks at resolution
    AND at trigger time (double-check rule, P006)
```

## Definitive Conclusions

- **Crew taps creatures with total power ≥ N.** Can combine multiple smaller creatures.
- **Summoning sickness doesn't prevent crewing.** The tap is the Vehicle's activated ability, controlled by you.
- **Vehicles become artifact creatures (both types) until end of turn.** They can attack, block, and be targeted as creatures.
- **Crew can be activated at instant speed.** No sorcery-speed restriction.
- **Multiple crew activations on same Vehicle are allowed** — each triggers "becomes crewed" abilities.

## Canonical Example
**Smuggler's Copter (Crew 1):**
Crew 1: tap any untapped creature(s) you control with total power ≥ 1. You tap a 1/1 token (power 1 ≥ 1). Smuggler's Copter becomes a 3/3 flying artifact creature until end of turn. It can attack this turn (no summoning sickness since it wasn't a creature when it entered, but it's been on the battlefield since before this turn).

**Example 2 — Crew to block:**
During opponent's attack step, you crew a Vehicle you control (0 summoning sickness issue — it's been on the battlefield). Vehicle becomes a 4/4 artifact creature. You can now declare it as a blocker.

## Commonly Confused With
- **P045 (Convoke)** — Convoke taps creatures to pay for generic mana when casting a spell. Crew taps creatures to activate a Vehicle ability. Both use "tap creatures as cost" and ignore summoning sickness.
- **P039 (Equipment)** — Equip is sorcery-speed; Crew is any time. Equipment attaches permanently; Vehicle becomes a creature only until end of turn.
