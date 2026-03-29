---
id: p189
name: Max Speed and Start Your Engines! — Speed/Racing Mechanic
category: continuous
cr_refs: [702.178a, 702.178b, 702.179a, 702.179b, 702.179c, 702.179d, 702.179e, 702.179f]
tags: [max-speed, start-your-engines, speed, racing, Thunder-Junction, state-based-action, triggered]
created: 2026-03-28
examples_count: 2
---

# P189 — Max Speed and Start Your Engines! — Speed/Racing Mechanic

## Abstract
Start Your Engines! and Max Speed are paired mechanics from Outlaws of Thunder Junction (and related sets) that create a "racing" experience. A permanent with Start Your Engines! sets its controller's speed to 1 (a state-based action) if they have no speed. Speed then increases whenever one or more opponents lose life during your turn — up to a maximum of 4. Max Speed is a static ability that grants additional abilities to permanents when the controller reaches speed 4. This creates a gameplay arc: establish your start, keep racing (dealing damage), and unlock powerful Max Speed bonuses.

## The Definitive Rules

**CR 702.178a** (verbatim): *"A max speed ability is a special kind of static ability. 'Max speed — [Ability]' means 'As long as your speed is 4, this object has [Ability].' See rule 702.179, 'Start Your Engines!'"*

**CR 702.178b** (verbatim): *"If an ability granted by a max speed ability states which zones it functions from, the max speed ability that grants that ability functions from those zones."*

**CR 702.179a** (verbatim): *"Start your engines! is a static ability. If a player controls a permanent with start your engines! and that player has no speed, their speed becomes 1. This is a state-based action. See rule 704."*

**CR 702.179b** (verbatim): *"Players do not have speed until a rule or effect sets their speed to a specific value."*

**CR 702.179c** (verbatim): *"If a player has no speed and they are instructed to increase their speed by a certain value, their speed becomes that value."*

**CR 702.179d** (verbatim): *"There is an inherent triggered ability associated with a player having 1 or more speed. This ability has no source and is controlled by that player. That ability is 'Whenever one or more opponents lose life during your turn, if your speed is less than 4, your speed increases by 1. This ability triggers only once each turn.'"*

**CR 702.179e** (verbatim): *"Rules and effects may refer to whether a player has 'max speed.' A player has max speed if their speed is 4."*

**CR 702.179f** (verbatim): *"Some effects refer to a player's speed. If that player has no speed, their speed is 0 for the purpose of an effect that refers to speed."*

## The Pattern

```
SPEED MECHANIC:
  Players start with NO speed (no value)
  Start Your Engines! (SBA): if controlling a permanent with this and no speed → speed becomes 1
  Speed range: 0 (no speed) → 1 → 2 → 3 → 4 (max speed)

  INCREASING SPEED:
    Inherent triggered ability (sourceless): "Whenever one or more opponents lose life during your turn,
    if speed < 4, your speed increases by 1. Triggers only once each turn."
    So max 1 speed increase per your turn (via opponents losing life)
    Speed 1 → 4 requires minimum 3 turns of opponents losing life on your turn

  MAX SPEED (702.178):
    Permanents with "Max speed — [Ability]": grant that ability only when controller's speed = 4
    At speed 4, powerful bonus abilities unlock
    Losing speed drops below 4 → lose Max Speed bonuses

  SPEED TRACKING:
    Speed is a player characteristic (like life total, hand size)
    Independent for each player
    Speed doesn't reset at end of turn (persists)
    Speed doesn't go above 4 (max speed is 4)
    Speed can decrease if effects reduce it

  START YOUR ENGINES! + MULTIPLE PERMANENTS:
    Multiple permanents with Start Your Engines! are redundant — you just need one
    SBA fires until speed is 1 (from no speed), doesn't keep triggering

  SPEED LOSS CONDITION:
    Opponents losing life in any way counts: combat damage, spell damage, lifelink, etc.
    Only during YOUR turn counts for the inherent trigger
    On opponent's turns: opponents can lose life but it won't increase your speed

  MAX SPEED + TACTICAL DECISIONS:
    Knowing opponent's speed matters — "they have max speed" warns of unlocked abilities
    Rush tactics: hit fast each turn to reach max speed quickly
    Disruption: eliminating start your engines permanents removes the speed mechanism
    Once at max speed: it persists, no need to keep the original permanent

  SPEED RESETS:
    Rules don't automatically reset speed between games
    During a game: speed persists until an effect resets it
    Losing the source of speed doesn't remove the speed gained

  MAX SPEED CARDS (Outlaws of Thunder Junction):
    Criminals, Cowboys, Outlaws with racing-themed abilities
    Often: "Max speed — [huge effect like double strike, trample, etc.]"
    Gunslinger-themed gameplay: establish, race, unlock at max speed
```

## Definitive Conclusions

- **Start Your Engines! sets speed to 1** via state-based action when you control such a permanent and have no speed.
- **Speed increases by 1** (once per turn) whenever one or more opponents lose life during your turn.
- **Max Speed = 4** — at speed 4, Max Speed abilities unlock.
- **Speed persists** — it doesn't reset each turn, it accumulates.
- **Max Speed grants conditional abilities** on permanents only while controller has speed 4.

## Canonical Example
**Outlaw crew commander deck with Start Your Engines! permanent:**
Turn 1: Cast permanent with Start Your Engines! → SBA: speed becomes 1.
Turn 2: Attack, deal damage (opponents lose life) → speed becomes 2.
Turn 3: Deal damage again → speed becomes 3.
Turn 4: Deal damage → speed becomes 4 (MAX SPEED!).
Now all Max Speed abilities on your permanents are active.
Creature with "Max speed — double strike": now has double strike permanently (while speed is 4).

**Example 2 — Multiple Opponents Losing Life:**
Extort triggers on the same turn affecting multiple opponents: "one or more opponents lose life" triggers once.
Even if 3 opponents each lose 1 life from Extort: that's ONE trigger, speed +1 once.
Can only hit speed 4 in minimum 3 turns (turns 1-3 each deal some opponent life loss).

## Commonly Confused With
- **P188 (Exhaust)** — Exhaust tracks a single use per object lifetime. Speed tracks a player-level racing progression.
- **P154 (Extort)** — Extort causes life loss which can trigger speed increases, but Extort itself is a cost-payment ability.
- **P172 (Foretell)** — Foretell is a delayed casting mechanic, not a progressive state tracker.
