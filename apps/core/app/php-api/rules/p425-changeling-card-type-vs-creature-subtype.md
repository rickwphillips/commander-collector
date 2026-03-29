---
id: p425
name: Changeling Does Not Grant Card Types — Creature Subtypes vs. Artifact/Enchantment/Land Card Types
category: continuous
cr_refs: [702.73a, 205.2a, 205.3m, 205.3d, 205.2b, 604.3]
tags: [changeling, card-types, creature-subtypes, artifact-creature, type-confusion, CDA-limits, Modular-changeling, protection-from-artifact, equipment-changeling, enchantment-changeling, land-changeling, Avian-Changeling, Arcbound-Ravager, Modular, construct-vs-artifact, type-line-parsing, 205-card-types]
created: 2026-03-29
examples_count: 2
---

# P425 — Changeling Does Not Grant Card Types — Creature Subtypes vs. Artifact/Enchantment/Land Card Types

## Abstract
**Changeling** (702.73) makes an object "every creature type" — but **creature types are subtypes** (CR 205.3m), while **artifact, enchantment, land, and planeswalker are card types** (CR 205.2a). These are entirely separate categories on the type line. A Changeling creature that is not printed as an artifact is NOT an artifact, regardless of the fact that Construct, Golem, and Myr (artifact-flavored creature subtypes) are among the creature types it has. This means: (1) **Modular's death transfer can't target a Changeling** unless it's also an artifact by card type; (2) effects that check for "artifact creature" (as a combination of card type + creature type) require both — a Changeling isn't an artifact creature unless it's also an artifact; (3) Equipment can still attach to Changelings (they're creatures, which is the card type Equipment cares about); and (4) Changeling also doesn't grant the Land subtype (Forest, Island, etc.) or Enchantment subtypes (Aura, etc.) because those are subtypes of different card types that the object doesn't have.

## The Definitive Rules

**CR 702.73a** (verbatim): *"Changeling is a characteristic-defining ability. 'Changeling' means 'This object is every creature type.' This ability works everywhere, even outside the game."*

**CR 205.2a** (verbatim): *"The card types are artifact, battle, conspiracy, creature, dungeon, enchantment, instant, kindred, land, phenomenon, plane, planeswalker, scheme, sorcery, and vanguard."*

**CR 205.3m** (verbatim, first sentence): *"Creatures and kindreds share their lists of subtypes; these subtypes are called creature types."* [Followed by the full list of creature types: Advisor, Elf, Goblin, Construct, Golem, Myr, Shapeshifter, Sliver, etc.]

**CR 205.3d** (verbatim): *"An object can't gain a subtype that doesn't correspond to one of that object's types."*

**CR 205.2b** (verbatim): *"Some objects have more than one card type (for example, an artifact creature). Such objects satisfy the criteria for any effect that applies to any of their card types."*

## The Pattern

```
THE TYPE LINE STRUCTURE (CR 205.1):
  A type line looks like: [Supertypes] [Card Types] — [Subtypes]
  Example: "Legendary Artifact Creature — Construct"
    Supertypes: Legendary
    Card types: Artifact, Creature
    Subtypes: Construct (this is a creature subtype, correlated to the Creature card type)

  THE THREE DISTINCT CATEGORIES ARE NOT INTERCHANGEABLE:
    CARD TYPES (205.2a): artifact, creature, enchantment, land, planeswalker, instant, sorcery,
      battle, kindred, conspiracy, dungeon, etc.
    CREATURE SUBTYPES (205.3m): Elf, Goblin, Dragon, Construct, Golem, Myr, Shapeshifter, etc.
      (Listed after the dash on a creature's type line)
    LAND SUBTYPES (205.3i): Forest, Island, Mountain, Plains, Swamp, Cave, Desert, Gate, etc.
    ARTIFACT SUBTYPES (205.3g): Equipment, Treasure, Clue, Blood, Food, Vehicle, etc.
    ENCHANTMENT SUBTYPES (205.3h): Aura, Saga, Class, Shrine, Cartouche, etc.

WHAT CHANGELING GRANTS:
  702.73a: "This object is every creature type."
  "Creature type" = the subtypes listed in 205.3m: Elf, Goblin, Construct, Golem, Myr,
    Shapeshifter, Sliver, Dragon, Vampire, Zombie, Zombie, etc.
  Changeling makes the object EVERY ITEM ON THE CR 205.3m LIST.
  That's it.

WHAT CHANGELING DOES NOT GRANT:
  1. ARTIFACT CARD TYPE:
     "Artifact" is a card type (205.2a). Changeling doesn't grant card types.
     Even though Construct, Golem, and Myr are artifact-flavored creature subtypes, having
       those subtypes doesn't make the object an Artifact.
     A Changeling creature card is NOT an artifact unless:
       - It is printed as an artifact (like a Shapeshifter artifact card), OR
       - An effect makes it an artifact (Liquimetal Torque, Mycosynth Lattice, etc.)
     "Artifact creature" in many rules texts = object with BOTH the Artifact card type AND
       Creature card type. A non-artifact Changeling is just a creature, not an artifact creature.

  2. LAND CARD TYPE AND LAND SUBTYPES:
     "Land" is a card type. Changeling doesn't grant it.
     Forest, Island, Mountain, etc. are LAND SUBTYPES (205.3i). Changeling doesn't grant these.
     A Changeling doesn't tap for mana like a Forest just because it "is every creature type."
     205.3d: "An object can't gain a subtype that doesn't correspond to one of that object's types."
     A creature without the Land card type can't have land subtypes (Forest, Island, etc.).

  3. ENCHANTMENT SUBTYPES:
     Aura, Saga, Shrine, etc. are enchantment subtypes (205.3h). Changeling doesn't grant them.
     A Changeling creature is not an Aura enchantment.

  4. ARTIFACT SUBTYPES:
     Equipment, Treasure, Clue, etc. are artifact subtypes (205.3g). Changeling doesn't grant them.
     A Changeling creature is not Equipment.

MODULAR + CHANGELING — THE KEY RULING:
  Modular's death trigger (702.43a): "put a +1/+1 counter on target ARTIFACT CREATURE for each
    +1/+1 counter on this permanent."
  TARGET REQUIREMENT: "artifact creature" = a permanent that is both:
    (1) an artifact (Artifact card type), AND
    (2) a creature (Creature card type or has creature subtypes... actually "creature" = card type).
  Wait: "artifact creature" just means the permanent has both the Artifact and Creature card types.
    CR 205.2b: objects with multiple card types satisfy effects for any of their types.
    An "artifact creature" is an object with BOTH Artifact AND Creature as card types.
  A Changeling (non-artifact) has Creature card type only. NOT artifact. NOT an "artifact creature."
  CONCLUSION: Modular's death trigger cannot target a Changeling that is not also an artifact.
  Even though Changeling is a Construct (creature subtype for artifact-flavored things), Construct
    ≠ Artifact. Construct is a creature subtype; Artifact is a card type.

  EXCEPTION CASES (when a Changeling CAN be targeted by Modular):
    1. The Changeling card is printed as an artifact creature (rare; most Changelings are just
       creature cards). Some artifact Shapeshifters exist.
    2. An effect makes the Changeling an artifact:
       Mycosynth Lattice ({6}: artifact; "all permanents are artifacts"): all permanents including
         your Changeling become artifacts. Now the Changeling IS an artifact creature. Modular can
         target it.
       Liquimetal Torque ({2}: artifact, {2}{T}: "target permanent becomes an artifact until EOT"):
         target your Changeling with Liquimetal Torque. Changeling temporarily becomes an artifact.
         During that turn, it's a legal Modular target.
    3. The "artifact creature" effect doesn't target artifacts specifically but targets creatures:
       This is a common confusion reduction. If an effect targets "creatures" (not "artifact
       creatures"), a Changeling is a legal target because it IS a creature.

EQUIPMENT + CHANGELING:
  Equipment attaches to creatures (card type: creature). Changeling IS a creature.
  Equipment can be attached to Changelings normally — no special rules.
  This is NOT an issue because "creature" here refers to the Creature card type, which
    Changelings have (they're creature cards).
  Changeling being "every creature type" is irrelevant to Equipment attachment — Equipment
    doesn't care about creature subtypes, just the Creature card type.

PROTECTION INTERACTIONS:
  "Protection from artifacts": prevents damage from artifact sources, targeting by artifacts,
    blocking by artifacts, and equipment/fortification attachment.
  A non-artifact Changeling is NOT an artifact source. Protection from artifacts doesn't
    apply against a Changeling (it's not an artifact).
  "Protection from [creature type]" (like protection from Goblins):
    Changeling IS a Goblin (creature subtype). Protection from Goblins applies.
    Damage from Changeling to a creature with protection from Goblins is prevented.
    A creature with protection from Goblins can't be blocked by Goblin creatures — Changeling
    (which IS a Goblin by creature subtype) can't block the protected creature when it attacks.
  The distinction: creature TYPE protection = creature subtype check (Changeling IS affected);
    artifact protection = card type check (non-artifact Changeling is NOT affected).

COMMON MISCONCEPTION — "CONSTRUCT MEANS ARTIFACT":
  Players see Changeling is a "Construct" and think it's an artifact. It's not.
  CR 205.3m lists Construct as a creature type — it's a SUBTYPE of creature, not a card type.
  Being a Construct means nothing mechanically except:
    - You satisfy "target Construct creature" requirements
    - Tribal effects that care about Constructs apply
    - Champion a Construct requirements are met
  Being a Construct does NOT grant the Artifact card type.
  Similarly: Golem (creature subtype) ≠ Artifact. Myr (creature subtype) ≠ Artifact.
  Only cards printed with "Artifact" in their card type line, or affected by type-granting
    effects, are artifacts.
```

## Definitive Conclusions

- **Changeling grants only creature subtypes (CR 205.3m)** — it does not grant the Artifact, Enchantment, Land, or Planeswalker card types, even though some creature subtypes (Construct, Golem, Myr) are artifact-themed.
- **Modular's death trigger can't target a Changeling that isn't an artifact** — "artifact creature" requires both the Artifact and Creature card types; Changeling provides no card types, only creature subtypes.
- **Having the Construct, Golem, or Myr creature subtype does NOT make something an artifact** — CR 205.3m explicitly separates creature subtypes from card types; Construct is listed alongside Elf and Goblin as a creature subtype, not as a card type.
- **Changeling doesn't gain land subtypes (Forest, Island, etc.)** — CR 205.3d: objects can't gain subtypes that don't correspond to one of their card types; a creature without the Land card type can't have land subtypes.
- **Equipment can still be attached to Changelings** — Equipment cares about the Creature card type, which Changelings have; creature subtypes are irrelevant for Equipment attachment.

## Canonical Example
**Arcbound Ravager vs. Avian Changeling:**
You control Arcbound Ravager (Artifact Creature — Beast; Modular 1; sacrifice artifact: put +1/+1 counter on Ravager) with 5 +1/+1 counters. An opponent uses a spell to destroy Ravager.

Ravager dies. Modular trigger fires: "put 5 +1/+1 counters on target artifact creature."

You look at your battlefield. You control:
- Avian Changeling ({3}{W}: Creature — Shapeshifter; 3/3 flying; Changeling): NOT an artifact.
  Avian Changeling is a creature (Creature card type). Changeling makes it every creature subtype
  including Construct, Golem, and Myr. But it is NOT an artifact (no Artifact card type).
  Cannot be targeted by Modular's trigger.
- Ornithopter ({0}: Artifact Creature — Thopter; 0/2 flying): IS an artifact creature.
  Ornithopter has both Artifact and Creature card types. Legal Modular target.

Conclusion: Modular transfers 5 counters to Ornithopter. Avian Changeling receives no counters.

If Mycosynth Lattice were in play ("all permanents are artifacts"):
Avian Changeling BECOMES an artifact (gains Artifact card type from Lattice's effect).
Now Avian Changeling is an "artifact creature." Legal Modular target.
Modular transfers 5 counters to Avian Changeling (now a 8/8 flying artifact creature).

**Example 2 — Protection from Artifacts vs. Changeling:**
Your creature has "protection from artifacts" (e.g., via Sword of Hearth and Home's other sword giving protection). A Changeling (non-artifact) attacks you. Can it deal damage to your protected creature?

Changeling is a Construct, a Myr, a Golem... but NOT an artifact.
Protection from artifacts prevents damage from ARTIFACT sources. Changeling is not an artifact source.
Changeling's combat damage is NOT prevented. Your creature does not have protection against Changelings.

But: if your creature has "protection from Elves" — Changeling IS an Elf (creature subtype).
Protection from Elves applies. Changeling's damage to that creature IS prevented.

The asymmetry: protection from [card type] = check card type (Changeling has Creature, not Artifact);
protection from [creature type] = check creature subtype (Changeling has ALL of them, including Elf).

## Commonly Confused With
- **P422 (Changeling CDA)** — P422 covers what Changeling DOES grant (all creature subtypes in all zones, tribal interactions, Sliver lords, etc.). P425 covers what Changeling DOES NOT grant (card types: artifact, enchantment, land). Both together give the complete picture.
- **P004 (Layer System)** — The distinction between card types (layer 4, type-changing) and subtypes (also layer 4) is handled in the layer system. Effects that change card types operate at the same layer as subtype changes but are applied to separate characteristics.
- **P418 (Modular)** — P418 covers Modular's mechanics including the "only triggers on GY death, not exile" rule and the counter-transfer targeting. P425 is the complementary pattern explaining why non-artifact Changelings can't be Modular targets.
