---
id: p359
name: Vehicles and Crew — Artifact Creatures, Timing, and Summoning Sickness
category: combat
cr_refs: [702.122a, 702.122b, 702.122c, 702.122d, 301.7, 301.7a, 301.7b, 302.6, 510.1]
tags: [vehicle, crew, artifact-creature, summoning-sickness, crew-timing, Smugglers-Copter, Heart-of-Kiran, Peacewalker-Colossus, crew-size, crewing-instant-speed, vehicles-are-artifacts-not-creatures, summoning-sickness-vehicle, tapping-for-crew]
created: 2026-03-29
examples_count: 2
---

# P359 — Vehicles and Crew — Artifact Creatures, Timing, and Summoning Sickness

## Abstract
**Vehicles** (rule 301.7) are artifact permanents with the "Vehicle" subtype. They have printed power and toughness but are **not creatures** by default — those characteristics only matter if they're also creatures (301.7a). The **crew** keyword (702.122a) is an activated ability: tap any number of untapped creatures you control with total power ≥ N, and the Vehicle becomes an artifact creature until end of turn. Crew can be activated at **instant speed** (it's an activated ability, not a special action). Critically: Vehicles don't have summoning sickness themselves (they're not creatures when they enter) — but **creatures used to crew** are subject to summoning sickness. A creature that just entered this turn can crew a Vehicle (tapping for the crew cost isn't affected by summoning sickness — only attacking and {T} abilities are). After the Vehicle becomes an artifact creature, if it **just entered this turn** as a Vehicle, can it attack? Yes: the summoning sickness rule checks when the creature was under your control — the Vehicle was already there; becoming a creature doesn't "reset" the sickness clock.

## The Definitive Rules

**CR 702.122a** (verbatim): *"Crew is an activated ability of Vehicle cards. 'Crew N' means 'Tap any number of other untapped creatures you control with total power N or greater: This permanent becomes an artifact creature until end of turn.'"*

**CR 702.122b** (verbatim): *"A creature 'crews a Vehicle' when it's tapped to pay the cost to activate a Vehicle's crew ability."*

**CR 301.7a** (verbatim): *"Each Vehicle has a printed power and toughness, but it has these characteristics only if it's also a creature. See rule 208.3."*

**CR 301.7b** (verbatim): *"If a Vehicle becomes a creature, it immediately has its printed power and toughness. Other effects, including the effect that makes it a creature, may modify these values or set them to different values."*

**CR 302.6** (summoning sickness, verbatim): *"A creature's activated ability with the tap symbol or the untap symbol in its activation cost can't be activated unless the creature has been under its controller's control continuously since their most recent turn began. A creature can't attack unless it has been under its controller's control continuously since their most recent turn began."*

## The Pattern

```
VEHICLES ARE NOT CREATURES BY DEFAULT (301.7a):
  A Vehicle enters the battlefield as an artifact. NOT a creature.
  Its printed power and toughness are vestigial: they only matter when it's ALSO a creature.
  Examples:
    Smuggler's Copter ({2}): 3/3 flying Vehicle with Crew 1. Enters as artifact.
      NOT a 3/3. NOT a creature. It has 3/3 printed stats but they're inactive.
      Can't attack. Can't block. Is not subject to "creature" effects.
  When crewed:
    Becomes an artifact creature with its printed power and toughness.
    Now: 3/3 artifact creature with flying. Can attack and block.
    This lasts until end of turn.
  Relevance: removal spells that target creatures can't target an uncrewed Vehicle.
    Doom Blade ("destroy target nonblack creature"): can't target Smuggler's Copter if not crewed.
    Lightning Bolt ("deal 3 damage to any target"): CAN target it (targets any target, not just creatures).
    Destroy target artifact: can target it (it's always an artifact).

CREW TIMING — INSTANT SPEED:
  Crew is an activated ability. Activated abilities can be activated any time you have priority (117.1b).
  Activated abilities have no inherent timing restriction unless stated.
  "Equip" says "activate only as a sorcery." Crew does NOT say this.
  Therefore: crew can be activated at INSTANT SPEED.
  You can crew:
    - During your combat (before attackers declared): to attack with it.
    - After blockers declared: to make it a bigger blocker.
    - During opponent's turn (in response to something).
    - In response to a spell or ability on the stack.
  You can even crew AFTER being attacked: if opponent attacks into your untapped crew creatures,
    you can tap those creatures to crew your Vehicle as a blocker response.
  Note: the crewing creatures tap to pay the crew cost. They don't become "blockers" automatically.
    You still need to declare the Vehicle as a blocker during the declare blockers step.

SUMMONING SICKNESS AND CREW:
  THE VEHICLE DOESN'T HAVE SUMMONING SICKNESS WHEN IT BECOMES A CREATURE:
    Summoning sickness rule (302.6): checks if the creature "has been under its controller's control
      continuously since their most recent turn began."
    When a Vehicle became a creature (via crewing) THIS turn: it was already on the battlefield
      as an artifact under your control since before this turn (or since it entered this turn).
    Wait: if the Vehicle ENTERED the battlefield THIS turn: it entered as an artifact.
      It's been under your control since it entered (even if that was just this turn).
      When it becomes a creature via crew: has it been under your control since THIS turn began?
        If it entered BEFORE this turn: yes, since before the turn started. Can attack.
        If it entered DURING this turn (you played it this turn): it came under control after
          the turn began. But it entered as an ARTIFACT, not a creature.
          When it becomes a creature via crew: is this when summoning sickness is checked?
          302.6 says "a creature... unless the creature has been under control since their most
            recent turn began." The OBJECT has been under control since it entered.
          If entered this turn: it entered DURING your turn (after the turn began). Has NOT been
            under control "since your most recent turn began" (which was the beginning of this turn).
          So: Vehicle that entered this turn becomes a creature via crew: has summoning sickness.
          IT CAN'T ATTACK on the turn it entered.
        If the Vehicle entered on a PREVIOUS turn: no summoning sickness. Can attack.
  THE CREATURES USED TO CREW:
    Tapping a creature to pay the crew cost is NOT a {T} ability on the creature.
    It's tapping as a cost for the Vehicle's ability.
    Does summoning sickness affect this? 302.6: "a creature's activated ability with the tap symbol
      in its ACTIVATION COST can't be activated unless..."
    The tap is the VEHICLE'S ability's cost, not the creature's activated ability.
    So: creatures with summoning sickness CAN still tap to crew a Vehicle.
    A creature that entered this turn (normally with summoning sickness) CAN crew a Vehicle.
    The summoning sickness only prevents the creature from ATTACKING and from using its OWN {T} abilities.
    Tapping to pay another card's crew cost: unrestricted.

CREW SIZE AND MULTIPLE CREATURES:
  Crew N: tap creatures with TOTAL power ≥ N.
  You can tap any number of creatures as long as their total power sums to ≥ N.
  Example: Heart of Kiran ({2}): 4/4 flying legendary Vehicle. Crew 3.
    You can tap one 3/3 (power 3 = 3). Crew requirement met.
    You can tap one 4/4 (power 4 > 3). Also works.
    You can tap three 1/1s (total power 3). Also works.
    You can tap ten 1/1s. Overkill, but legal.
  Can you use a 0/0 to crew? Total power 0 < 3 = requirement not met alone.
    Combined with others: 0+0+0+0... still 0. But if you have enough creatures: fine.
  Actually: a 0/1 tapped for crew contributes 0 to the power total (power = 0).
  Some creatures have 0 power and can't help crew. But you can tap them as part of the group
    as long as others make up the required total.
  SPECIAL RULE (702.122a): "any number of OTHER untapped creatures you control."
    "Other" means the Vehicle itself doesn't count even if it's already a creature.
    (Vehicles are rarely creatures before crewing, but this matters if a Vehicle gained creature
      status from another effect and you try to crew it.)

VEHICLES AND TYPE-CHANGING EFFECTS:
  Blood Moon turns nonbasic lands into Mountains. Doesn't affect artifacts.
  Huatli's ability "all creatures get +1/+1": would affect the Vehicle ONLY while it's crewed.
  While uncrewed: it's not a creature, so creature-affecting effects don't apply.
  "Destroy all creatures": can't destroy an uncrewed Vehicle (it's an artifact, not a creature).
  "Exile all artifacts": CAN affect even an uncrewed Vehicle (it's an artifact).

VEHICLES WITH ADDITIONAL CREW TRIGGERS (702.122d):
  Some Vehicles have "whenever [this] becomes crewed" triggered abilities.
  This triggers when the crew ability RESOLVES (not when you activate it, but when it resolves).
  Example (hypothetical): "Whenever this Vehicle becomes crewed, draw a card."
    Activate crew ability. Ability resolves. Vehicle becomes a creature. THEN: draw a card trigger fires.
    Respond to the crew activation: crew activation on stack. Opponent responds with something.
    Crew activation resolves → Vehicle becomes creature → trigger fires.
```

## Definitive Conclusions

- **Vehicles are artifacts by default** — not creatures; their printed P/T is inactive until crewed; creature-targeting spells can't target them while uncrewed.
- **Crew can be activated at instant speed** — unlike equip (which is sorcery speed), crew has no timing restriction; you can crew in response to spells or during combat.
- **Creatures with summoning sickness CAN crew** — tapping a creature to pay crew cost is not activating the creature's own {T} ability; summoning sickness only restricts the creature's own attacking and {T} abilities.
- **Vehicles that entered this turn DO have summoning sickness** when they become creatures — the Vehicle's summoning sickness check applies when it becomes a creature based on when the object came under your control.
- **Crew ends at end of turn** — the Vehicle reverts to just an artifact at end of turn; it can be crewed again on subsequent turns.
- **"Crew N" uses total power ≥ N across any number of creatures** — tap multiple small creatures or one large creature; the cost just requires total power to meet the threshold.

## Canonical Example
**Smuggler's Copter — Crewing and Combat Interaction:**
Turn 3: You cast Smuggler's Copter ({2}): enters as a 3/3 artifact Vehicle with flying. BUT: it just entered this turn. It's only an artifact.

Can it attack turn 3? Only if you crew it AND it entered on a previous turn (or has haste).
Turn 3 = it entered THIS turn. Even after crewing, it has summoning sickness (entered this turn).
Can't attack turn 3.

Turn 4: You control Smuggler's Copter (entered last turn). In your main phase before combat:
  Declare attack: want to attack with Copter. But Copter isn't a creature yet.
  Special: You can activate Crew during BEGINNING OF COMBAT (before attackers declared).
    Activate Crew 1: tap a 1/1 creature (power 1 ≥ 1 requirement met).
    Crew resolves: Copter becomes an artifact creature (3/3 flying) until end of turn.
  Declare Copter as attacker (it's now a creature, under your control since last turn, no summoning sickness).
  Copter attacks: 3/3 flying. Opponent likely can't block (flying).
  Copter's ability: "Whenever Copter attacks, you may discard a card. If you do, draw a card."
    This is a "whenever attacks" trigger — fires when Copter is declared as attacker.
    You loot: discard, draw.
  Combat resolves. Copter returns to being just an artifact at end of turn (crew effect ends).

Turn 5: You play a 1/1 creature. It just entered this turn. Can it crew?
  Yes: tapping the 1/1 to pay crew cost is fine (its own summoning sickness only stops its own {T} abilities and attacking).
  The 1/1 taps → crew activates → Copter becomes a creature.
  The 1/1 can't ATTACK but can crew.

**Example 2 — Heart of Kiran and Planeswalker Crew:**
Heart of Kiran ({2}): 4/4 flying legendary Vehicle. Crew 3. "You may remove a loyalty counter from a planeswalker you control rather than pay the crew cost."
This means: instead of tapping creatures, remove a loyalty counter from a planeswalker.

Scenario: You control Heart of Kiran and Chandra, Torch of Defiance (8 loyalty).
Activate crew: instead of tapping creatures, remove 1 loyalty counter from Chandra.
Heart of Kiran becomes a 4/4 artifact creature with flying until end of turn.
Chandra now has 7 loyalty.
Heart of Kiran can attack (if it entered on a previous turn — no summoning sickness).

This interaction is notable in Standard/Pioneer:
  You don't need any creature to crew.
  Using planeswalker loyalty as crew cost = new resource dimension.
  Protect Chandra by having a 4/4 flyer doing combat.
  Note: you can ALSO tap creatures for Heart of Kiran (it has both options — but the printed
    "crew 3" is one option and the alternative "remove loyalty counter" is the second).
  You can't combine them (can't tap creatures AND remove loyalty): it's one or the other.

## Commonly Confused With
- **P343 (Summoning Sickness)** — Summoning sickness applies to the Vehicle based on when the artifact entered under your control, not when it became a creature. P343 covers the summoning sickness rules; P359 covers how they apply specifically to Vehicles.
- **P354 (Equipment/Auras)** — Equip is also an activated ability but is sorcery-speed (702.6a: "activate only as a sorcery"). Crew has no such restriction (702.122a doesn't say "activate only as a sorcery"). This is a common confusion: players assume crew is also sorcery-speed because equip is. It's not.
- **P341 (Combat Phase)** — Crew can be activated at the start of combat step (before declare attackers) to make the Vehicle a creature in time to attack. Timing: combat begins → beginning of combat step (players can activate abilities here) → activate crew → Vehicle is a creature → declare attackers step begins (can now declare Vehicle as attacker).
- **P004 (Layer System)** — When a Vehicle becomes a creature via crew, the crew ability creates a "type-adding" effect in Layer 4 (creature type). The Vehicle's P/T (printed) becomes active (Layer 7b would set it). Other continuous effects then stack on top in appropriate layers.
