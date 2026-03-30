---
id: p512
name: Omens (TDM) — Zone Identity, All-Illegal-Targets GY Trap, Omniscience, and Whirlwing Flash Grant
category: zones
cr_refs: [708.4, 601.2, 702.6, 608.2b]
tags: [omen, dragon, double-faced, zone-identity, all-illegal-targets, graveyard, omniscience, whirlwing-stormbrood, runescale-stormbrood, flash, library-shuffle, tarkir-dragonstorm, TDM]
created: 2026-03-30
examples_count: 4
---

# P512 — Omens (TDM) — Zone Identity, All-Illegal-Targets GY Trap, Omniscience, and Whirlwing Flash Grant

## Abstract
**Omens** (Tarkir: Dragonstorm, 2025) are two-faced cards where the front face is a Dragon creature and the back face is an instant or sorcery with the subtype "Omen." When cast as an Omen, the card shuffles back into its owner's library on resolution. The critical zone rule: **an Omen card is a creature card in every zone except the stack** — in the graveyard, hand, exile, and library it presents as a Dragon creature, not as its Omen face. One crucial trap: if an Omen spell has **all-illegal targets** when it tries to resolve, it is put into the **graveyard** (not shuffled into the library) — this creates a permanent GY presence and enables reanimation. Casting an Omen is **not** casting it for an alternative cost — effects like Omniscience that let you cast spells without paying mana costs can be applied to the Omen face. Whirlwing Stormbrood ({4}{U}: 4/3 Flash/Flying; "you may cast sorcery spells and Dragon spells as though they had flash") creates a powerful interaction: all other Omen cards' Dragon faces are Dragon spells, so Whirlwing grants them flash — letting you cast Omen Dragons at instant speed.

## The Definitive Rules

**Official Ruling (2025-04-04):** *"An omen card is a creature card in every zone except the stack, as well as while on the stack if not cast as an Omen. Ignore its alternative characteristics in those cases. For example, while it's in your graveyard, Twinmaw Stormbrood is a white creature card whose mana value is 6."*

**Official Ruling (2025-04-04):** *"When casting a spell as an Omen, use the alternative characteristics and ignore all of the card's normal characteristics. The spell's color, mana cost, mana value, and so on are determined by only those alternative characteristics."*

**Official Ruling (2025-04-04):** *"If an Omen spell has one or more targets and all of those targets are illegal when the spell tries to resolve, it won't resolve. None of its effects will happen, and it will be put into its owner's **graveyard**. It won't be shuffled into its owner's library."*

**Official Ruling (2025-04-04):** *"If an Omen spell is countered or an effect causes it to otherwise leave the stack, it won't be shuffled into its owner's library."*

**Official Ruling (2025-04-04):** *"Casting a card as an Omen isn't casting it for an alternative cost. Effects that allow you to cast a spell for an alternative cost or without paying its mana cost may allow you to apply those to the Omen."*

**Official Ruling (2025-04-04):** *"If a spell is cast as an Omen, its controller shuffles it into its owner's library instead of putting it into its owner's graveyard as it resolves."*

## The Pattern

```
OMEN CARD ZONE RULES:

  Zone: Library, Hand, Graveyard, Exile, Command Zone:
    → The card IS a creature card with the Dragon face's characteristics.
    → MV = Dragon face's mana cost (NOT the Omen's cost).
    → Example: Twinmaw Stormbrood ({5}{W}) — MV 6 as a creature card in the GY.
    → Example: Dirgur Island Dragon // Skimming Strike:
        Dragon: {5}{U} 4/4 Flying, Ward {2}
        Omen: {1}{U} — Tap creature, draw card
        In library/GY/hand: a blue creature card of MV 6 (5+1? No — just Dragon face MV).
        Wait: Omen cards in non-stack zones use Dragon face characteristics ONLY.
        So Dirgur Island Dragon is MV 6 in the library (Dragon face: {5}{U} = 6).

  Zone: Stack (cast as an Omen):
    → ONLY the Omen face's characteristics apply.
    → Dragon face is ignored entirely.
    → Example: Skimming Strike is on the stack as a {1}{U} instant — MV 2.
    → You cast "Twinmaw Stormbrood as Charring Bite" — on the stack it's {1}{R} sorcery.

  Zone: Stack (cast normally as Dragon):
    → Dragon face characteristics apply.
    → It's a creature spell with the Dragon's cost, color, type, abilities.

CHOOSING HOW TO CAST:

  At cast time, you choose: cast as the Dragon (normal) OR cast as the Omen.
  You cannot cast both faces simultaneously.
  You cannot choose partway — it's entirely one face or the other.

  Legality check for Omen cast: uses ONLY Omen characteristics.
    Example: Thundermane Dragon says "cast creature spells with power 4+ from top of library."
    Twinmaw Stormbrood is on top: you may cast it as Dragon (power 5+) but NOT as Charring
      Bite (it's a sorcery, not a creature when on the stack as an Omen).

ON-RESOLUTION SHUFFLE:

  If the Omen spell resolves successfully: shuffles into its owner's library.
  → This is NOT a "put into the graveyard" event.
  → Cards that trigger when spells go to graveyard don't trigger.
  → You shuffle your entire library after inserting the card.
  → The card is now somewhere in the library, ready to be drawn again.

ALL-ILLEGAL-TARGETS TRAP — OMEN GOES TO GRAVEYARD:

  Standard targeting fizzle rule: if ALL targets of a spell are illegal at resolution,
    the spell doesn't resolve and is put into its owner's graveyard (CR 608.2b).

  For Omen spells: this rule OVERRIDES the shuffle-into-library rule.
  Official ruling: "It will be put into its owner's graveyard. It won't be shuffled."

  Example: You cast Chilling Screech ({1}{U} Instant-Omen: counter target spell with MV ≤ 2)
    targeting an opponent's Lightning Bolt ({R}: MV 1). The opponent casts another instant
    that gives their bolt +2 MV (hypothetical) or the bolt is countered first.
    → The Chilling Screech's target is now illegal.
    → Chilling Screech goes to GY as Runescale Stormbrood creature card (MV 4).
    → The card is now reanimatable! Opponent cannot prevent this.

  WHY THIS MATTERS:
    Omen cards are expensive Dragons in the graveyard.
    Charring Bite (Omen face: {1}{R}) has all-illegal-target fizzle → Twinmaw Stormbrood
      (Dragon face: {5}{W}, 5/5 Flying, ETB gain 5 life) goes to GY.
    You can now reanimate a 5/5 flying lifelinking Dragon from the graveyard.
    This is by design — Omen users have access to their Dragons even if the Omen fails.

  CONTRAST WITH COUNTER:
    If an Omen spell is COUNTERED: goes to GY (not shuffled).
    "If an Omen spell is countered, it won't be shuffled into its owner's library."
    → Countering any Omen effectively gives you a free Dragon in your graveyard.

OMNISCIENCE + OMENS:

  Omniscience: "You may cast spells without paying their mana costs."
  Casting an Omen as an Omen is NOT an alternative cost — it's just a casting mode.
  Therefore: Omniscience CAN pay the Omen's mana cost for you.

  Example: Omniscience out. Cast Skimming Strike ({1}{U}) without paying its mana cost.
    It resolves: tap creature, draw card. Then shuffle into library.
    Result: you spent no mana, bounced a creature, drew a card, and the Omen is back in
    your library — to potentially draw and cast again.

  Omniscience + Dragons as Omen faces:
    Any ability that lets you cast spells without paying mana costs can cast Omen faces for free.
    Plot/Suspend/Cascade that let you cast something "without paying its mana cost" interact
    normally with Omen faces IF the Omen face is the right type.

  FREE CAST FROM EXILE vs. OMEN CAST:
    Effects like "you may cast this card from exile without paying its mana cost":
    You can choose to cast it as the Dragon face (without paying Dragon's mana cost) OR
    as the Omen face (without paying Omen's mana cost).
    Either is valid — "cast" applies to whichever face you're casting.

WHIRLWING STORMBROOD — DRAGON FLASH GRANT:

  Whirlwing Stormbrood ({4}{U}: 4/3 Flash/Flying):
    "You may cast sorcery spells and Dragon spells as though they had flash."

  Dragon spells = spells that are Dragon creature spells (Dragon type).
  When you cast an Omen card AS ITS DRAGON FACE, it's a Dragon creature spell.
  → Whirlwing grants it flash: you may cast ANY Omen card's Dragon face at instant speed.

  Example: Twinmaw Stormbrood would normally be sorcery-speed (creature, main phase stack
    empty). With Whirlwing out, you can cast Twinmaw Stormbrood at instant speed.

  Also: Omen faces that are Sorceries get flash from Whirlwing's sorcery-flash grant.
    Dynamic Soar ({2}{G} Sorcery-Omen) can be cast at instant speed.
    Charring Bite ({1}{R} Sorcery-Omen) can be cast at instant speed.

  COMBINED EFFECT: With Whirlwing, ALL Omen cards can be cast at instant speed as EITHER
    face — Dragon faces via Dragon-flash, Sorcery Omen faces via sorcery-flash.

RUNESCALE STORMBROOD — CASTING OMENS AS NONCREATURES:

  Runescale Stormbrood ({3}{R}: 2/4 Flying):
    "Whenever you cast a noncreature spell or a Dragon spell, this creature gets +2/+0."

  When you cast another Omen card as an Omen (instant or sorcery face):
    On the stack, it's a noncreature spell → Runescale's trigger fires (+2/+0).
  When you cast the Dragon face of an Omen card:
    It's a Dragon spell → Runescale's trigger fires (+2/+0).

  EITHER WAY: casting any Omen card (as either face) triggers Runescale.

COPY EFFECTS ON OMEN SPELLS:

  "If an Omen spell is copied, that copy is also an Omen and is shuffled into its owner's
   library as it resolves. Its owner still shuffles their library, but the copy ceases
   to exist as a state-based action."

  → Copying Skimming Strike: the copy also resolves normally (tap creature, draw card)
    then shuffles into its owner's library. The copy ceases to exist as an SBA.
  → The original also resolves and shuffles.
  → BOTH copies try to shuffle — but one ceases to exist as SBA. Net: one shuffle.
  → The original card is now in the library (shuffled in by its own resolution).
```

## Definitive Conclusions

- **Omen cards are always Dragon creatures outside the stack** — GY, hand, library, exile all use Dragon face characteristics; reanimation, cascade, and graveyard searches see a Dragon creature.
- **All-illegal-targets fizzle sends Omen to GY, not library** — countering or targeting-fizzle creates a free Dragon in your graveyard; this can be intentional with the right reanimation tools.
- **Omniscience applies to Omen casts** — casting an Omen is not an alternative cost; free-cast effects can pay the Omen's mana cost or the Dragon's mana cost freely.
- **Whirlwing Stormbrood grants ALL Omen card casts flash** — Dragon faces get flash via "Dragon spell," Sorcery Omen faces get flash via "sorcery spell"; every Omen card becomes instant-speed with Whirlwing.
- **Runescale Stormbrood triggers on both faces of any Omen** — Dragon face = Dragon spell trigger; Omen face = noncreature spell trigger.
- **Copied Omen spells shuffle on resolution but cease as SBAs** — copying is generally not advantageous since the copy ceases to exist; the original resolves and shuffles normally.

## Canonical Example

**Chilling Screech — All-Illegal-Targets Graveyard Trap:**

You control Runescale Stormbrood ({3}{R}: 2/4). You cast Chilling Screech ({1}{U} Instant-Omen: counter spell with MV ≤ 2) targeting an opponent's Lightning Bolt ({R}: MV 1) on the stack.

Runescale triggers: +2/+0 until end of turn (it's a noncreature spell cast).

The opponent casts Giant Growth giving the Bolt +3/+3 ... wait, that doesn't change MV. The opponent counters the Lightning Bolt with Mana Leak. Now Chilling Screech's target is illegal (the Bolt is no longer on the stack).

Chilling Screech resolves: all targets illegal → **goes to GRAVEYARD** (not shuffled into library). Runescale Stormbrood also resolves (its trigger stays regardless).

In your GY: Runescale Stormbrood // Chilling Screech as a {3}{R} 2/4 Flying Dragon creature card. You can now Animate Dead it, or Persist it if it dies... it's a Dragon creature in the GY now.

**Example 2 — Whirlwing + Flash on All Omens:**

You control Whirlwing Stormbrood ({4}{U}: 4/3 Flash). During an opponent's combat step, you want to cast Twinmaw Stormbrood ({5}{W}: Dragon) as the Dragon face.

Normally: creature spell = sorcery speed. But Whirlwing says Dragon spells may be cast as though they had flash. Twinmaw Stormbrood is a Dragon spell. You cast it at instant speed during combat.

Twinmaw enters: you gain 5 life. You now have a 5/5 flying blocker.

**Example 3 — Omniscience + Skimming Strike:**

You control Omniscience. You have Dirgur Island Dragon // Skimming Strike in hand.

You choose to cast it as Skimming Strike (Instant-Omen: tap up to one creature, draw a card) without paying its mana cost.

Skimming Strike resolves: tap an opponent's creature, draw a card. Shuffle into library.

No mana spent. The Dragon is back in your library, not in your graveyard. Next time you draw it, you can use it again.

**Example 4 — Zone-Identity for Reanimation:**

An opponent mills Twinmaw Stormbrood // Charring Bite from your deck. What's in your graveyard?

A creature card: Twinmaw Stormbrood, {5}{W}, 5/5, Flying, with ETB: "gain 5 life." MV 6. White.

You cast Reanimate on it from your GY. It enters as a 5/5 Flying creature. ETB: gain 5 life (minus your life payment for Reanimate, but the life gain still happens).

The Omen face (Charring Bite) is irrelevant in the GY — it doesn't exist there.

## Commonly Confused With
- **P204 (Double-Faced Cards)** — DFCs have a front and back face but are separate states accessed by transformation. Omens are different: you choose which face to cast but the card never "transforms" — it's either a Dragon on the stack or an Omen on the stack, and always a Dragon in all other zones.
- **P509 (Rooms)** — Rooms also have two faces but are even more different: both faces can be active simultaneously on the battlefield. Omens are never both faces at once.
- **P172 (Foretell)** — Foretell exiles face-down for a discount. Omens shuffle back into the library on resolution. Both provide recurrence but through fundamentally different mechanisms.
