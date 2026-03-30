---
id: p422
name: Changeling — Characteristic-Defining Ability in All Zones and Universal Type Interactions
category: continuous
cr_refs: [702.73a, 604.3, 604.3a, 613.1, 613.3]
tags: [changeling, characteristic-defining-ability, CDA, all-zones, tribal-synergy, lord-effects, sliver-changeling, champion-changeling, protection-changeling, Avian-Changeling, Mothdust-Changeling, Mirror-Entity, Taurean-Mauler, Shapesharer, prowl-changeling, lord-of-atlantis, sliver-lords, tribal-instants-sorceries, Lorwyn, all-creature-types, type-checking-in-zones]
created: 2026-03-29
examples_count: 2
---

# P422 — Changeling — Characteristic-Defining Ability in All Zones and Universal Type Interactions

## Abstract
**Changeling** (702.73) is a **characteristic-defining ability** (CDA) that makes the object every creature type. The critical non-obvious property is that it functions **in all zones, including outside the game** — not just on the battlefield. This means discarding a Changeling triggers "when you discard an Elf"; dredging a Changeling from a GY triggers "when a Goblin leaves your graveyard"; a Changeling in your library satisfies "search for a Faerie"; and a Changeling in exile activates Prowl costs for every creature type. On the battlefield, Changeling interacts with every tribal effect simultaneously: all lords grant bonuses to it, all Champion requirements are met by it, it gains all Sliver abilities from Sliver lords, and it's dealt reduced/no damage by creatures with protection from any specific type (since Changeling IS that type). The most unintuitive interaction: a creature with **protection from Humans** cannot be damaged by a Changeling, because Changelings are Humans (among every other type).

## The Definitive Rules

**CR 702.73a** (verbatim): *"Changeling is a characteristic-defining ability. 'Changeling' means 'This object is every creature type.' This ability works everywhere, even outside the game. See rule 604.3."*

**CR 604.3** (verbatim): *"Some static abilities are characteristic-defining abilities. A characteristic-defining ability conveys information about an object's characteristics that would normally be found elsewhere on that object... Characteristic-defining abilities function in all zones. They also function outside the game and before the game begins."*

**CR 604.3a** (verbatim): *"A static ability is a characteristic-defining ability if it meets the following criteria: (1) It defines an object's colors, subtypes, power, or toughness; (2) it is printed on the card it affects... (3) it does not directly affect the characteristics of any other objects; (4) it is not an ability that an object grants to itself; and (5) it does not set the values of such characteristics only if certain conditions are met."*

## The Pattern

```
CHANGELING AS A CDA:
  Changeling: "This object is every creature type."
  This is a CHARACTERISTIC-DEFINING ABILITY — it functions in ALL zones:
    On the battlefield: the permanent is every creature type.
    In your hand: the card is every creature type.
    In your graveyard: the card is every creature type.
    In exile: the card is every creature type.
    On the stack (as a spell): the spell is every creature type.
    In your library: the card is every creature type.
    Even outside the game (sideboard): the card is every creature type.

  WHY THIS MATTERS (zone-by-zone):
    HAND:
      "Discard an Elf to..." effects (e.g., Wirewood Savage, tribal discard costs): discarding a
        Changeling satisfies any tribe-specific discard requirement.
      "When you discard a [type]" — discarding a Changeling triggers all of them.
    GRAVEYARD:
      "Exile a [type] from your graveyard": a Changeling satisfies this for any type.
      Soulshift (P406) returns a Spirit from GY to hand — a Changeling in GY is a Spirit.
      "Count of [type] creatures in graveyards": Changelings count for every type simultaneously.
    ON THE STACK:
      "Counter target [type] spell": Changeling spells can be countered by any tribal counter effect.
      Storm Herald: "when you cast a Warrior spell..." — casting a Changeling triggers ALL tribal
        cast triggers.
      Prowl (702.76): "you may pay the prowl cost if a [type] you controlled dealt combat damage
        this turn." A single Changeling dealing combat damage unlocks prowl for EVERY tribe.
        Cast any prowl card (Thieves' Fortune = Rogue prowl, Morsel Theft = Rogue prowl) for
        free if a Changeling dealt combat damage. Changelings satisfy every prowl requirement.
    IN EXILE:
      Effects that care about exiled cards' types: a Changeling satisfies all of them.
      Champion: a Changeling in exile satisfies champion's "return the exiled card" for any type
        — wait, this is about what's in exile, not in hand. The return trigger returns any card;
        type doesn't matter for the return.
    IN LIBRARY:
      "Search your library for a [type] creature": a Changeling is a legal hit for any type.
        Search for "an Elf", "a Goblin", "a Dragon" — Changeling satisfies all three independently.
        In a deck, this means one card can serve as a tutor target for any tribal search.

CHANGELING ON THE BATTLEFIELD — TRIBAL INTERACTIONS:

  LORD EFFECTS:
    Tribal lords that give bonuses to specific types:
      Lord of Atlantis ({U}{U}: 2/2; "Merfolk you control get +1/+1 and have islandwalk"):
        Your Changelings are Merfolk → they get +1/+1 and islandwalk from Lord of Atlantis.
      Elvish Archdruid ({1}{G}{G}: 2/2; "other Elves you control get +1/+1"):
        Changelings you control are Elves → they get +1/+1. Changelings also count for
          Archdruid's tap ability that generates {G} per Elf you control.
      Goblin King ({1}{R}{R}: 2/2; "Goblins you control get +1/+1 and have mountainwalk"):
        Your Changelings are Goblins → they get +1/+1 and mountainwalk.
    MULTIPLE LORDS:
      If you have Lord of Atlantis AND Elvish Archdruid AND Goblin King:
        Your Changeling gets bonuses from ALL three lords simultaneously.
        Each applies its own effect. Changeling is Merfolk, Elf, AND Goblin at once.

  SLIVER LORDS AND CHANGELINGS:
    Slivers grant abilities to ALL Slivers. Changelings are Slivers.
    Muscle Sliver ({1}{G}: 1/1 Sliver; "Slivers you control get +1/+1"):
      All Changelings you control get +1/+1 from Muscle Sliver.
    Crystalline Sliver ({W}{U}: 1/1 Sliver; "Slivers you control have shroud"):
      All Changelings you control gain shroud.
    Fury Sliver ({5}{R}: 3/3 Sliver; "Slivers you control have double strike"):
      All Changelings you control gain double strike.
    CRITICAL: In a multiplayer game, Sliver lords give bonuses to ALL Slivers — including
      opponents' Slivers. If you play a Changeling in a Sliver-heavy pod:
        Your Changeling gets all Sliver abilities. AND: the Sliver lords treat your Changeling
        as a Sliver they need to grant abilities to — so opponents' Sliver lords benefit your
        Changeling AND your Sliver lords benefit opponents' Slivers.
      Wait: "Slivers you control get X" — "you control" limits it to the controller's Slivers.
      Muscle Sliver grants its bonus only to Slivers ITS CONTROLLER controls. So opponent's
        Muscle Sliver gives +1/+1 to Slivers the OPPONENT controls — not your Changeling.
        BUT: Hive Mind (older printings) effects and some Sliver lords say "all Slivers" not
        "Slivers you control" — those affect all Slivers regardless of controller.
    NOTE: This varies by card printing. Modern Sliver lords say "Slivers you control." Older
      printings (Alpha-style) said "all Slivers." The former is controller-limited; the latter
      affects all Slivers globally including Changelings on both sides.

  CHAMPION + CHANGELING (from P421):
    Any Champion ability requiring a specific type (champion an Elf, champion a Faerie):
      A Changeling satisfies any champion requirement — it's every creature type simultaneously.
      You never need to worry about not having the right type to champion if you have a Changeling.

  PROTECTION INTERACTIONS:
    Protection from [creature type] prevents: damage from, enchanting by, equipping by, blocking
      by, and targeting by sources that are/have that quality.
    Changeling is EVERY creature type. Therefore:
      A creature with protection from Humans: Changeling IS a Human. Changeling's combat damage
        to the protected creature is prevented. Changeling can't block the protected creature
        (wait — "can't be blocked by Humans" = protected creature can't be blocked by Humans when
        attacking; your Changeling can't block them).
      Actually to be precise about the DEBT acronym:
        D — Damage from [type] sources is prevented
        E — [type] Enchantments/Auras can't be attached to it
        B — Can't be Blocked by [type] creatures (when it attacks)
        T — Can't be Targeted by [type] spells/abilities
      So: protection from Humans on creature X means:
        - Damage from Human sources (including Changeling, which is a Human) is prevented
        - X can't be blocked by Humans (Changelings can't block X when X attacks)
        - X can't be targeted by Human spells/abilities (a Changeling-creature's ability targeting X
          would be prevented if it's a Human ability from a Changeling)
    This means: protection from ANY specific creature type = partial protection from Changelings.
    Protection from "all creature types" (hypothetically) = full protection from all Changelings.
    Example: Paladin en-Vec has protection from black AND protection from red.
      Changeling is black and red (and every color? No — Changeling is every CREATURE TYPE, not
      every color. Colors are separate from types.)
      Paladin en-Vec's protection is from colors, not types. Changeling doesn't interact with
      color-based protection unless the Changeling is also those colors.

  TYPE REMOVAL AND CHANGELING:
    Effects that change creature types (e.g., "target creature loses all creature types and
      becomes a Shapeshifter until end of turn"):
      This OVERWRITES the Changeling's types for the duration. Changeling is no longer every
        type — it's just a Shapeshifter. This is a layer 4 effect that applies AFTER the CDA.
      After the duration ends: Changeling returns to being every type again.
    "Loses all creature types": Changeling loses the characteristic-defining ability's effect
      for the duration. The ability itself isn't removed (it's still printed on the card),
      but the type-setting effect is overridden by the layer 4 effect.

  CLONE + CHANGELING:
    If Clone copies a Changeling: the clone gets the Changeling CDA as part of its copiable
      values (CDAs are copiable values per 707.2 and 604.3a).
    The Clone is also every creature type. It has the Changeling keyword ability.
    Wait: actually 707.2 says copies get "printed" values including abilities. Changeling
      is a keyword ability. If Clone copies Changeling creature, Clone has Changeling keyword.
    This is straightforward: Clone of Changeling = another Changeling.

  MIRROR ENTITY ({2}{W}: 1/1 Shapeshifter; changeling; {X}: until end of turn, each creature
    you control has base P/T X/X and gains all creature types):
    Mirror Entity activating: all your creatures temporarily gain ALL creature types.
    Combined with existing lords: all your creatures benefit from every tribal lord you control.
    This is "temporary Changeling" for all your creatures — but without the persistent CDA;
      it's a layer 7b (base P/T) + layer 4 (type) effect for the turn.
```

## Definitive Conclusions

- **Changeling works in ALL zones** — a Changeling card in your hand, library, graveyard, or exile satisfies any creature-type check in those zones (discard costs, tutor searches, graveyard exile effects, Prowl unlock).
- **Changeling on the battlefield receives bonuses from ALL tribal lords simultaneously** — it's a Merfolk, Elf, Goblin, Dragon, Angel, Zombie, and every other type at once; every lord that says "your [type]s get +1/+1" applies to it.
- **Changeling gains ALL abilities from Sliver lords** (when those lords say "Slivers you control") — a Changeling in a Sliver deck benefits from every Sliver ability granted by lords; conversely, Changeling in an opponent's Sliver deck benefits from nothing because "Slivers you control" is controller-scoped.
- **A single Changeling dealing combat damage unlocks Prowl for every tribe** — since it's every creature type, it satisfies the "dealt combat damage by a [type]" condition for any prowl spell you cast.
- **Protection from any specific creature type applies against Changelings** — since Changeling is that type, damage prevention applies; a creature with protection from Humans prevents damage from Changelings (Changelings are Humans).
- **Type-changing effects can override Changeling's CDA** — "loses all creature types, becomes a Shapeshifter" applies in layer 4 after the CDA, making the Changeling only a Shapeshifter until the effect ends.

## Canonical Example
**Changeling + Sliver Lords (Sliver Overlord deck):**
You control: Avian Changeling ({2}{W}: 2/2; Shapeshifter; flying; changeling), Muscle Sliver ({1}{G}: 1/1 Sliver; "Slivers you control get +1/+1"), Crystalline Sliver ({W}{U}: 1/1 Sliver; "Slivers you control have shroud"), Fury Sliver ({5}{R}: 3/3 Sliver; "Slivers you control have double strike").

Avian Changeling is a Sliver (changeling = every creature type = Sliver too).
Muscle Sliver: Avian Changeling is a Sliver you control → it gets +1/+1. Avian is now 3/3.
Crystalline Sliver: Avian Changeling is a Sliver you control → it gains shroud. Avian can't be targeted.
Fury Sliver: Avian Changeling is a Sliver you control → it gains double strike.

Avian Changeling: 3/3 flier with shroud and double strike. All three Sliver lords stack.

Opponent attempts to target Avian Changeling with Doom Blade. Avian has shroud (from Crystalline).
Doom Blade can't target it. Opponent must use a mass-removal effect.

You attack with Avian (3/3 double strike flying). Opponent blocks with a 3/3.
Double strike: first strike damage — Avian deals 3 damage. 3/3 dies. Avian still alive.
Regular damage step: Avian deals 3 damage again (double strike both steps). Total: 6 damage to opponent.

Note: Changelings also trigger ALL "when a Sliver enters" effects, "when an Elf enters" effects, etc.
simultaneously when they enter the battlefield.

**Example 2 — Changeling enables Prowl:**
Your deck: Avian Changeling, Morsel Theft ({2}{B}{B}: Kindred Sorcery — Rogue; prowl {1}{B}; "target player loses 3 life and you gain 3 life. If this spell's prowl cost was paid, draw a card").

Turn 1: attack with Avian Changeling. It deals combat damage to opponent.
Avian Changeling is a Rogue (changeling). A Rogue you controlled dealt combat damage this turn.
Prowl condition for Rogue prowl cards is satisfied.

Turn 1 post-combat main phase: cast Morsel Theft for its prowl cost {1}{B} instead of {2}{B}{B}.
Result: you spend {1}{B} instead of {2}{B}{B} for the full spell effect (including the draw, since prowl cost was paid).

Avian Changeling is also a Goblin, Merfolk, Warrior, Ninja, Faerie... etc.
ANY prowl-cost card you cast this turn can use the cheaper prowl cost, since Changeling dealt
combat damage and satisfied every creature type for prowl conditions.

## Commonly Confused With
- **P421 (Champion)** — Champion requires exiling a specific creature type; Changeling satisfies any champion requirement. Related but distinct: champion is the mechanism, changeling is the universal enabler.
- **P413 (Morph)** — Both Morph and Changeling involve Shapeshifters in Lorwyn/Onslaught. Morph face-down creatures have NO creature types (2/2 blank); Changelings face-down retain their CDA and are still every type face-down. Key difference: CDA works everywhere; face-down characteristics override the printed values.
- **P004 (Layer System)** — Changeling applies in layer 4 (type-defining). Type-removing effects also apply in layer 4 but at a later timestamp, overriding the CDA's effect. The CDA is in the same layer but applies first (CDAs apply before other effects in the same layer per 613.3).
- **P418 (Graft/Modular/Bloodthirst/Sunburst)** — All four mechanics in P418 have type-relevant interactions; Changelings count for any "creature type you control" condition in those contexts. This overlaps with P422 generally.
