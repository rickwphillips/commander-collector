---
id: p285
name: Vehicles and Crew — Artifact Creatures That Need Activation
category: continuous
cr_refs: [702.122a, 702.122b, 702.122c, 702.122d, 702.122e]
tags: [vehicle, crew, artifact-creature, pilot, animate, power, tap-creatures, Kaladesh, Smugglers-Copter, Heart-of-Kiran, Skysovereign-Consul-Flagship, Peacewalker-Colossus]
created: 2026-03-29
examples_count: 2
---

# P285 — Vehicles and Crew — Artifact Creatures That Need Activation

## Abstract
Vehicles are a subtype of artifact introduced in Kaladesh (2016). By default, a Vehicle is not a creature — it's just an artifact. The Crew N activated ability (sorcery speed by default) allows you to tap any number of creatures you control with total power N or greater to animate the Vehicle — it becomes an artifact creature until end of turn. This mechanic represents "piloting" a vehicle: your creatures provide the power to drive it. Vehicles are immune to most "dies" triggers and summoning sickness when they animate, since they're already on the battlefield when crewing.

## The Definitive Rules

**CR 702.122a** (verbatim): *"Crew is an activated ability of a Vehicle that can be activated any time you could cast an instant. 'Crew N' means 'Tap any number of untapped creatures you control with total power N or greater: This permanent becomes an artifact creature until end of turn.'"*

**CR 702.122b** (verbatim): *"Only a Vehicle can have crew."*

**CR 702.122c** (verbatim): *"Tapping a creature to pay the crew cost of a Vehicle is a special action and doesn't use the stack. It's made once for each untapped creature tapping to pay the cost, one at a time."*

**CR 702.122d** (verbatim): *"A player may crew any Vehicle they control, even if that Vehicle has summoning sickness."*

**CR 702.122e** (verbatim): *"Vehicles with crew can be crewed more than once in a single turn. However, each crew activation causes the Vehicle to become an artifact creature until end of turn, which it already is if it's been crewed at least once this turn. Thus, additional crewings this turn won't have any additional effect."*

## The Pattern

```
VEHICLE STATES:
  DEFAULT (uncrew): artifact, NOT a creature
    - Can be targeted by artifact removal
    - Can't be targeted by creature removal
    - Can't attack or block
    - Not affected by creature Wraths (e.g., Wrath of God targets creatures → doesn't hit uncrewd Vehicle)

  CREWED: artifact creature (until end of turn)
    - IS a creature AND an artifact
    - Can attack and block
    - Vulnerable to BOTH artifact removal AND creature removal while crewed
    - Power and toughness as printed on the Vehicle
    - Uses the crew controller's creatures as "fuel"

CREW ACTIVATION:
  Timing: can crew any time you could cast an instant (different from Saddle which is sorcery speed)
  Wait: CR 702.122a says "any time you could cast an instant" — this is INSTANT SPEED crew!
  Unlike Saddle (sorcery speed), Crew can be activated at instant speed.
  Practical use: crew in response to removal (can crew during combat step too).
  Opponent's removal targets uncreated Vehicle: crew it in response → it's now a creature.
  However: "targeting" occurs when the spell is cast; if you crew AFTER targeting, the spell still resolves
  Ward would matter if the Vehicle had ward; crew just changes type.

CREWING YOURSELF:
  Can you crew with the Vehicle? No: "tap any number of creatures you control" — Vehicle must tap CREATURES.
  A Vehicle can't tap itself to crew (it's not a creature until crewed, and even if crewed, it can't use
  a {T} ability to pay its own crew cost — it would need to already be a creature with power ≥ N).
  Ruling: you can't crew a Vehicle with itself.

CREW + SUMMONING SICKNESS:
  CR 702.122d: a Vehicle can be crewed even if it has summoning sickness.
  The Vehicle itself enters, has summoning sickness. But you can immediately crew it.
  Crewed Vehicle: becomes a creature, but it entered as an artifact → no summoning sickness applies.
  Wait: summoning sickness applies to creatures that "came under your control this turn."
  The Vehicle came under your control this turn → would have summoning sickness IF it were a creature.
  Once crewed: it's a creature. Does summoning sickness retroactively apply? YES.
  A Vehicle entered this turn, crewed this turn: it has summoning sickness → can't attack.
  Exception: if the Vehicle has Haste, it can attack the turn it enters.
  CR 702.122d says you can CREW a Vehicle with summoning sickness — not that the crewed Vehicle can attack.
  Clarification: you CAN crew a Vehicle with summoning sickness (tapping creatures to animate is fine).
  The resulting creature still has summoning sickness unless it has haste.

CREW + MULTIPLE ACTIVATIONS:
  CR 702.122e: crewing multiple times has no additional effect after the first.
  Once crewed, the Vehicle IS an artifact creature until end of turn. Crewing again: still a creature.
  Waste case: crewing multiple times just wastes creatures' tap abilities.
  Why crew twice? Usually you don't need to; but some interactions might matter (no mechanical benefit).

VEHICLE NOTABLE CARDS (Kaladesh):
  Smuggler's Copter ({1}{U}, Vehicle 3/3 Flying, Crew 1):
    Crew 1: tap ANY creature with power ≥ 1 → Copter is a 3/3 Flying creature.
    When Copter attacks or blocks: loot (draw a card, then discard a card).
    Instant speed crew: crew during opponent's attack step to block with a 3/3 flying!
    The loot triggers on attacks AND blocks — both directions.
    One of the most efficient vehicles ever printed (banned in Standard).

  Heart of Kiran ({2}, Vehicle 4/4 Flying Vigilance, Crew 3):
    Crew 3: need a creature with power 3+ (or multiple summing to 3+).
    Vigilance: once crewed, attacks AND doesn't tap → can block too.
    Or: use a Planeswalker's loyalty counters instead of a creature (Kaladesh rule).
    Wait: "you may remove a loyalty counter from a planeswalker you control" instead of tapping a creature.
    Heart of Kiran has a special ability: remove a loyalty from a PW to crew.
    Gideon of the Trials crewing Heart of Kiran: remove 1 loyalty, Heart is a 4/4 Flying Vigilant.

  Skysovereign, Consul Flagship ({5}, Vehicle 6/5 Flying, Crew 3):
    When attacks or enters: deals 3 damage to target creature or planeswalker.
    Giant 6/5 flyer with a 3-damage ETB/attack trigger.
    Crew 3: tapping a 3/3+ or multiple smaller creatures.

CREW + INSTANT SPEED COMBAT TRICKS:
  Opponent attacks → declare blockers step → crew a Vehicle in response to attacks
  Vehicle is now a creature → can block (wait: blocking is declared before crew could be activated?)
  Declare blockers step: active player declares attackers, then defending player declares blockers.
  BETWEEN declaration: priority is passed.
  Crew during your priority window in declare attackers step: Vehicle is a creature → can now block.
  Timing: crew BEFORE blockers are declared → Vehicle is available as a blocker.

VEHICLE + REMOVAL AVOIDANCE:
  Opponent has "Destroy target creature" → your 4/4 Vehicle is uncrewd (not a creature).
  They can't target the Vehicle with creature removal (it's not a creature).
  They CAN target it with artifact removal.
  "Exile target creature or artifact" would get it in either state.
```

## Definitive Conclusions

- **Vehicles aren't creatures by default** — immune to creature removal/wraths when uncrewd.
- **Crew can be activated at instant speed** — unlike Saddle (sorcery speed).
- **A Vehicle crewed on the turn it enters has summoning sickness** — it can't attack unless it has haste.
- **Crewing multiple times in one turn has no mechanical benefit** — the Vehicle is already a creature.
- **Creatures with summoning sickness CAN be used to crew** — but the resulting crewed vehicle still has its own summoning sickness if it entered this turn.

## Canonical Example
**Smuggler's Copter Block Trick:**
Opponent's turn. Opponent attacks with 3/3 creature.
Before you declare blockers: you have a Smuggler's Copter on the battlefield (uncrewd, not a creature).
You also have a 1/1 token. Instant speed opportunity!
Activate Crew 1 on Smuggler's Copter: tap your 1/1 token.
Smuggler's Copter becomes a 3/3 Flying creature until end of turn.
Declare blockers: Copter blocks the 3/3. Both deal 3 damage → both die (or trade).
Copter was not affected by summoning sickness (it was already on the battlefield before this turn).
Net: blocked a 3/3 for free (sacrificed the 1/1 as crew fuel), got rid of opponent's threat.
Also: if the Copter had attacked or been crewed while attacking: loot trigger would fire.

**Example 2 — Wrath of God Avoidance:**
You have three artifacts: Smuggler's Copter (uncrewd), Heart of Kiran (uncrewd), another artifact.
Opponent casts Wrath of God: "Destroy all creatures."
Your two Vehicles are NOT creatures (uncrewd) → Wrath doesn't affect them.
Opponent loses their creatures. You lose your creatures used to crew (if any were on field and also creatures).
But your Vehicles survive the Wrath.
After Wrath: you have two Vehicles. Crew them → two powerful artifact creatures, no need for defenders.
Vehicles survived a board wipe that cleared all your creatures and opponents'.
Next turn: crew both with newly cast creatures → attack with 4/4 Flying Vigilant + 3/3 Flying.

## Commonly Confused With
- **P270 (Saddle)** — Saddle is sorcery speed, makes Mounts "saddled" (they're already creatures); Crew is instant speed, makes Vehicles into creatures until end of turn.
- **P264 (Reconfigure)** — Reconfigure is a creature that attaches to another creature as equipment; Vehicles are artifacts that become creatures via crew.
- **P267 (Living Metal)** — Living Metal auto-animates a Vehicle on your turn without crew; standard Vehicles require crew activation.
