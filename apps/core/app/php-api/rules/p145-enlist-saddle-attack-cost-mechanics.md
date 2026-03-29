---
id: p145
name: Enlist and Saddle — Tap-Creature-to-Attack-Enhancement
category: combat
cr_refs: [702.154a, 702.154b, 702.154c, 702.154d, 702.171a, 702.171b, 702.171c]
tags: [enlist, saddle, tap, attack, power-bonus, saddled-designation, optional, dominaria, ixalan]
created: 2026-03-28
examples_count: 2
---

# P145 — Enlist and Saddle — Tap-Creature-to-Attack-Enhancement

## Abstract
Two similar mechanics that tap other creatures to enhance an attacking creature. **Enlist** taps one untapped creature you control (that didn't attack) to give the enlisting creature +X/+0 (X = tapped creature's power). **Saddle N** taps any number of creatures with total power N or greater to give the saddled permanent a "saddled" designation for the turn (enabling bonus effects). Both are optional costs to attack. Key difference: enlist uses power of one creature as the bonus; saddle just needs to hit a power threshold.

## The Definitive Rules

**CR 702.154a** (verbatim): *"Enlist means 'As this creature attacks, you may tap up to one untapped creature you control that you didn't choose to attack with and that either has haste or has been under your control continuously since this turn began. When you do, this creature gets +X/+0 until end of turn, where X is the tapped creature's power.'"*

**CR 702.171a** (verbatim): *"'Saddle N' means 'Tap any number of other untapped creatures you control with total power N or greater: This permanent becomes saddled until end of turn. Activate only as a sorcery.'"*

**CR 702.171b** (verbatim): *"'Saddled' is a designation that has no rules meaning other than to act as a marker that spells and abilities can identify. Only permanents can be or become saddled."*

## The Pattern

```
ENLIST:
  Static ability + triggered ability (linked per 702.154b)
  At declare attackers: you MAY tap one qualifying creature
    Qualifying creature: untapped, didn't attack, has haste OR has been under your control since turn began
  If you tap it: this creature gets +X/+0, where X = tapped creature's power

  ENLIST CONSTRAINTS:
    Must be YOUR creature (you control it)
    Must NOT be attacking (didn't choose to attack)
    Must be untapped at the time of enlist
    Summoning sickness: the tapped creature must have haste OR been under your control since turn start
      → A freshly stolen creature (this turn) can't enlist unless it has haste
      → An already-controlled creature: can enlist (was under control since turn began)

  ENLIST + POWER 0:
    Tapping a 0-power creature: +0/+0 → no bonus, but you tapped a creature for nothing
    Not prohibited but functionally useless

  ENLIST LINKED TRIGGER (702.154b):
    The static ability (the optional cost) and the triggered ability (the +X/+0) are linked
    The trigger only fires when the cost was paid (when you tapped the creature)

  ENLIST MULTIPLE INSTANCES (702.154d):
    Multiple instances of enlist are independent
    Each can tap a different creature for separate bonuses

SADDLE:
  Activated ability (of a Saddle vehicle/mount card)
  Activation: tap any number of untapped creatures with total power ≥ N
  Effect: this permanent becomes "saddled" until end of turn
  Activate only as a sorcery: main phase, stack empty

  SADDLED DESIGNATION:
    "Saddled" is a game marker (like "renowned" or the city's blessing)
    Not part of copiable values
    Once saddled, it stays saddled until end of turn or until it leaves the battlefield

  SADDLE + MOUNT BONUSES:
    Mount cards have abilities that say "as long as this is saddled" or "when this creature becomes saddled"
    These activate when the saddled designation is applied

  SADDLE + WHO CAN SADDLE:
    Any untapped creatures YOU control can tap for saddle
    Including creatures with summoning sickness (they can tap for saddle since it's a cost payment, not attack or tap-symbol ability)
    Wait: CR says "tap any number of other untapped creatures you control" — it's the cost of the saddle ability
    Summoning sickness prevents activating {T} abilities, but this is a "tap X creatures as a cost" (not the creature's own {T} ability)
    → The MOUNT's ability is activated (not the creatures' abilities) → no summoning sickness restriction on the tapped creatures
    → Summoning-sick creatures CAN be tapped for saddle
```

## Definitive Conclusions

- **Enlist taps one non-attacking creature to give +X/+0 (X = its power)** — sorcery-speed optional attack cost.
- **Enlist requires the tapped creature to have haste or been under your control since turn began.**
- **Saddle taps creatures with total power ≥ N** to give "saddled" status enabling mount bonuses.
- **Summoning-sick creatures can be tapped for Saddle** (they're paying a cost, not activating their own {T} ability).
- **Saddled is a game designation** — persists until end of turn.

## Canonical Example
**Phyrexian Censor (Enlist):** Attacks. Enlist: tap your 4/4 creature that didn't attack. Phyrexian Censor gets +4/+0 until end of turn. Now swinging much harder.

**Example 2 — Saddle:**
Inti, Seneschal of the Sun (Mount, Saddle 2):
"Saddled — Inti can't be blocked by more than one creature."
Activate saddle ability: tap a 2-power creature. Inti becomes saddled.
Inti attacks — can't be blocked by more than one creature (from saddle bonus).

## Commonly Confused With
- **P058 (Crew)** — Crew taps creatures for a vehicle to become a creature. Saddle taps creatures for a mount to gain the saddled designation. Similar structure, different result.
- **P154 (Enlist) — linked to Dominaria mechanics** — Enlist from Dominaria United.
- **P085 (Exalted)** — Exalted pumps when attacking alone (automatic trigger). Enlist is a manual optional cost.
