---
id: p436
name: Crew/Vehicles, Fabricate, Overload, and Scavenge — Kaladesh/Ravnica Activated and Modal Mechanics
category: costs
cr_refs: [702.122a, 702.122b, 702.122c, 702.122d, 702.123a, 702.123b, 702.96a, 702.96b, 702.96c, 702.97a]
tags: [crew, vehicle, fabricate, overload, scavenge, artifact-creature-until-EOT, tap-power-total, servo-tokens, counters-or-tokens, text-changing-effect, target-becomes-each, Smuggler-Copter, Skysovereign, Gonti's-Aether-Heart, Panharmonicon-fabricate, Cyclonic-Rift, Mizzium-Mortars, Deadbridge-Goliath, scavenge-exile, fabricate-panharmonicon, crew-summoning-sickness, vehicle-damage, Kaladesh, Aether-Revolt]
created: 2026-03-29
examples_count: 2
---

# P436 — Crew/Vehicles, Fabricate, Overload, and Scavenge — Kaladesh/Ravnica Activated and Modal Mechanics

## Abstract
Four mechanics from Kaladesh and Ravnica blocks. **Crew** (702.122) taps creatures with combined power ≥ N to animate a Vehicle as an artifact creature until end of turn. **Fabricate** (702.123) is an ETB triggered ability offering a binary choice: put counters on itself or create tokens. **Overload** (702.96) is an alternative cost that replaces "target" with "each" in the spell's text, making it hit all valid objects. **Scavenge** (702.97) is a GY-only activated ability that exiles a card from the GY to put counters on a creature. Key non-obvious interactions: (1) **crewing uses POWER, not toughness or mana value** — a 1/10 can't crew a Vehicle requiring 2 alone (power = 1, not enough); (2) **Vehicles are not creatures until crewed** — summoning sickness, "when this creature enters" ETBs, and creature-targeting effects don't apply to uncrewed Vehicles; (3) **fabricate is all-or-nothing** — you can't split the N counters and tokens; you put N counters on IT or create N tokens; (4) **overload creates a text-changing effect** — "Split second" with an overloaded spell means no one can respond; (5) **scavenge exiles the card** — unlike dredge (returns to hand) or flashback (exiles on resolution), scavenge permanently removes the card from GY.

## The Definitive Rules

**CR 702.122a** (verbatim): *"Crew is an activated ability of Vehicle cards. 'Crew N' means 'Tap any number of other untapped creatures you control with total power N or greater: This permanent becomes an artifact creature until end of turn.'"*

**CR 702.123a** (verbatim): *"Fabricate is a triggered ability. 'Fabricate N' means 'When this permanent enters, you may put N +1/+1 counters on it. If you don't, create N 1/1 colorless Servo artifact creature tokens.'"*

**CR 702.96a** (verbatim): *"Overload is a keyword that represents two static abilities that function while the spell with overload is on the stack. Overload [cost] means 'You may choose to pay [cost] rather than pay this spell's mana cost' and 'If you chose to pay this spell's overload cost, change its text by replacing all instances of the word "target" with the word "each."' Casting a spell using its overload ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.97a** (verbatim): *"Scavenge is an activated ability that functions only while the card with scavenge is in a graveyard. 'Scavenge [cost]' means '[Cost], Exile this card from your graveyard: Put a number of +1/+1 counters equal to the power of the card you exiled on target creature. Activate only as a sorcery.'"*

## The Pattern

```
CREW (702.122a):
  ACTIVATION: "Tap any number of other untapped creatures you control with total power ≥ N:
    This permanent becomes an artifact creature until end of turn."

  POWER, NOT TOUGHNESS OR MANA VALUE:
    Total POWER of the tapped creatures must be ≥ N.
    Example: Smuggler's Copter (Vehicle; crew 1; fly; loot when it attacks or blocks):
      One creature with power ≥ 1 can crew Copter. A 0/3 cannot (power 0 < 1). A 1/1 can.
    This means high-toughness, low-power creatures are poor crew options.
    A 1/10 Wall can only crew a Vehicle requiring ≤ 1 power alone.

  VEHICLES ARE NOT CREATURES UNTIL CREWED:
    Uncrewed Vehicles are Artifact permanents (no Creature card type).
    No summoning sickness (summoning sickness only applies to creatures).
      Wait: summoning sickness prevents attacking and using {T} abilities. Vehicles are artifacts.
      An uncrewed Vehicle has no attack and no {T} abilities from summoning sickness.
      When crewed (becomes an artifact creature), it gains the Creature card type.
      Does it have summoning sickness? YES — "an artifact creature that just became a creature
      has summoning sickness if it was under its controller's control since the start of that
      player's most recent turn." But wait: summoning sickness applies when a creature comes
      under your control. The Vehicle came under your control when you played it (entering as
      an artifact). When it becomes a creature via crew: it "became" a creature but was under
      your control since before the start of your turn (or this turn if you played it).
      CR 302.6: "A creature can't attack unless it has been under its controller's continuous
      control since the start of their turn (summoning sickness)." The Vehicle was under control
      since the start of its controller's turn (or entered this turn). The "continuous control"
      check uses the moment it "became" a creature AND whether it was under control since the
      start of the turn. If you played the Vehicle this turn AND crewed it this turn: it has
      summoning sickness (entered this turn). If it was played a previous turn and crewed this
      turn: NO summoning sickness. It's been under continuous control since before this turn started.
    ETBs: the Vehicle doesn't ETB as a creature when crewed. Crew activates an ability that
      changes the permanent's card type for the turn. No zone change. No ETB.
    CREW RESULT: artifact creature until end of turn. Same permanent, different card type.

  DAMAGE TO VEHICLES:
    While a Vehicle is an artifact creature: it can be damaged in combat.
    The damage is marked on it (like any creature).
    After end of turn: it stops being a creature (type change). The damage remains marked.
    At the start of the next turn: it's an artifact (not a creature). Damage marking on
      non-creatures: doesn't cause destruction (creatures are destroyed if damage ≥ toughness;
      non-creatures are not). The damage fades (is removed) at the beginning of the cleanup step.
    RESULT: a Vehicle that survives combat damage (enough toughness) persists; the damage
      is removed at cleanup; it's back to a normal artifact the next turn.

  CREW AND TAPPING:
    "Tap any number of other untapped creatures." The word "other" means you can't tap the
    Vehicle itself (it's not a creature before crewing; and even if it were, "other" prevents
    using itself).
    Multiple creatures can be tapped. Total power must meet or exceed the crew cost.
    Tapping creatures for crew: they're tapped, can't block this turn (already tapped).

FABRICATE (702.123a):
  "When this permanent enters, you may put N +1/+1 counters on it. If you don't, create
   N 1/1 colorless Servo artifact creature tokens."

  BINARY CHOICE (all counters or all tokens):
    You either put N counters on the fabricate permanent OR create N tokens.
    You can't split: put some counters AND some tokens. It's all-or-none per trigger.
    With Fabricate 2: put 2 counters OR create 2 tokens. Not 1 counter + 1 token.

  MULTIPLE FABRICATE INSTANCES:
    702.123b: each instance triggers separately.
    Two instances of Fabricate 2: two separate triggers. For each, independently choose:
      put 2 counters, OR create 2 tokens.
    First trigger: choose counters. Second trigger: choose tokens. Total: 2 counters + 2 tokens.
    Or: both choose counters = 4 counters. Or: both choose tokens = 4 tokens.

  FABRICATE AND PANHARMONICON:
    Panharmonicon ({4}: artifact; "whenever an artifact or creature enters, if it has an ETB
      trigger, that trigger triggers an additional time"):
    Fabricate is triggered by "when this permanent enters." Panharmonicon doubles ETB triggers.
    If the fabricate permanent is an artifact (typical): Panharmonicon causes fabricate to fire twice.
    Two fabricate triggers: choose independently for each. Can get both counters AND tokens.

OVERLOAD (702.96a):
  ALTERNATIVE COST + TEXT CHANGE:
    Pay overload cost instead of mana cost. If paid: "target" → "each" in the spell's text.
    Cyclonic Rift ({1}{U}: "return target nonland permanent you don't control to its owner's hand;
      overload {6}{U}"):
    Cast with overload {6}{U}: "return each nonland permanent you don't control to its owner's hand."
    The text-change is a STATIC effect of the spell (text-changing effect, 702.96c).
    Because "target" becomes "each": the spell requires no targets when overloaded.
    It affects all valid objects regardless of hexproof, shroud, or "can't be targeted" effects.
    SPELL BECOMES UNTARGETABLE BY OPPONENT'S COUNTERSPELLS THAT TARGET SPELLS?
    No — "can't be countered" must be on the SPELL, not based on targeting. Overloaded spells
    are still counterable (by generic "counter target spell" effects).
    The spell just affects all objects rather than targeting specific ones.

  OVERLOAD AND "CAN'T BE TARGETED" CREATURES:
    Hexproof, shroud, or "can't be the target of spells" abilities: prevent TARGETING.
    Overloaded Cyclonic Rift: "return EACH nonland permanent" — this doesn't TARGET. It affects
    each one without targeting. Hexproof/shroud are irrelevant against overloaded effects.
    RESULT: overloaded spells bypass protection that only prevents targeting.

  OVERLOAD AND SPLIT SECOND:
    Split second prevents casting and non-mana activations while on the stack.
    Overloaded spells can still be cast (they're on the stack, waiting to resolve). Split second
    prevents casting IN RESPONSE TO the overloaded spell. But can you overload while split second
    is on the stack? No — you can't cast ANY spell while split second is on the stack (split
    second prevents all casting).

SCAVENGE (702.97a):
  "Exile this card from your GY: Put counters equal to the POWER of the exiled card on target creature."

  POWER OF THE EXILED CARD:
    Scavenge puts counters equal to the POWER of the card you exiled (the scavenge card itself).
    Deadbridge Goliath ({2}{G}{G}: 5/5; scavenge {4}{G}{G}):
      At time of scavenging: Deadbridge Goliath's power = 5. Scavenge puts 5 counters on a creature.
    A card with a variable power CDA (like Mortivore, whose power = number of creature cards in all
      graveyards) would have its power checked in the GY at the moment scavenge resolves.
    IMPORTANT: the power is WHEN EXILED (when scavenge resolves), not when the card entered the GY.

  SCAVENGE PERMANENTLY EXILES:
    The scavenged card is exiled from the GY. Cannot be retrieved via normal GY recursion.
    Contrast: dredge (returns card to hand); flashback (exiles on resolution but the SPELL resolves
    first); unearth (returns card from GY to battlefield).
    Scavenge: exile + put counters. The card is gone from GY.

  SCAVENGE ONLY FROM GY:
    702.97a: "functions only while the card with scavenge is in a graveyard."
    Can't scavenge from exile or other zones.
    Grafdigger's Cage: doesn't affect scavenge (scavenge doesn't CAST from GY; it's an activated
    ability that puts counters on a creature. Cage restricts casting spells, not activated abilities).
    Wait: does Cage affect scavenge? Cage says "players can't cast spells from graveyards or
    libraries." Scavenge isn't casting a spell — it's activating an ability. Cage doesn't stop scavenge.
```

## Definitive Conclusions

- **Crew uses total power, not toughness or mana value** — a 1/10 creature contributes 1 to the crew total; walls and high-toughness, low-power creatures are poor crew choices.
- **Vehicles that have been on the battlefield since before the start of your turn have no summoning sickness when crewed** — they can attack immediately after crewing; Vehicles played this turn can't attack (summoning sickness applies from when they entered, checked against when they became creatures).
- **Fabricate is all-or-nothing** — put N counters on the permanent OR create N tokens; you can't split between them; but multiple fabricate instances each choose independently.
- **Overloaded spells bypass hexproof and shroud** — "target" becomes "each"; hexproof only prevents being targeted; overloaded effects don't target anything.
- **Grafdigger's Cage does NOT stop scavenge** — scavenge is an activated ability, not a spell cast from the GY; Cage only restricts casting spells.
- **Scavenging exiles the card permanently** — unlike dredge (hand return) or flashback (cast from GY), scavenged cards are gone from the GY.

## Canonical Example
**Smuggler's Copter + Summoning Sickness:**
You play Smuggler's Copter ({2}: Artifact — Vehicle; 3/3 flying; crew 1; "whenever Copter attacks or blocks, loot") on turn 1.
Turn 2 (your next turn): Copter has been under your continuous control since start of this turn (it was under control since last turn). You crew it (tap a 1/1 creature). Copter becomes an artifact creature 3/3 flying. Can it attack? YES — no summoning sickness. It was under control since before this turn started.

Now: play a new Vehicle on turn 2, then crew it this same turn.
New Vehicle entered this turn → summoning sickness. When crewed: "has been under controller's
  continuous control since start of this turn? YES (entered at the start of this turn). But
  the "continuous control since start of turn" for summoning sickness: the Vehicle entered this
  turn, but when did it "become a creature"? At the moment it was crewed. Was it under control as
  a creature since the START of the turn? No — it became a creature during this turn.
  CR 302.6 specifically says: "A creature can't attack unless it has been under its controller's
  continuous control since the start of their most recent turn." Entering as a creature this turn
  means summoning sickness. Can't attack this turn.

**Example 2 — Overload vs. Hexproof:**
Opponent controls creatures, including one with hexproof.
You cast Cyclonic Rift with overload ({6}{U}).
Text becomes: "return each nonland permanent you don't control to its owner's hand."
The hexproof creature: hexproof prevents targeting. Overloaded Rift doesn't target. It affects "each."
The hexproof creature IS bounced. Hexproof is irrelevant against overloaded effects.

Compare: Cyclonic Rift without overload (target one nonland permanent). Opponent's hexproof
  creature: you CAN'T target it with the non-overloaded version (hexproof blocks targeting).
  Only the overloaded version bypasses hexproof.

## Commonly Confused With
- **P418 (Graft/Modular — Counter Mechanics)** — Scavenge puts +1/+1 counters on a creature (like modular), but scavenge activates from the GY and exiles the card; modular triggers on death and transfers to artifact creatures. Both put counters on creatures; different timing and zones.
- **P415 (Dredge)** — Scavenge and dredge both involve GY mechanics. Dredge replaces a draw and returns the card to hand; scavenge is an activated ability that exiles the card and puts counters on a creature. Neither is stopped by Grafdigger's Cage (different reasons: dredge isn't casting; scavenge isn't casting either).
- **P431 (Bestow)** — Bestow spell on the stack is an Aura enchantment (P435). If an overloaded spell would affect all enchantments, a bestowed Aura would be affected. No special interaction; just noting that overloaded "affect all enchantments" hits bestowed Auras.
- **P434 (Fabricate and Devoid/Colorless)** — The Servo tokens created by fabricate are "1/1 colorless Servo artifact creature tokens." These are colorless (no color from printing, not from devoid). Effects checking for colored permanents don't count Servos.
