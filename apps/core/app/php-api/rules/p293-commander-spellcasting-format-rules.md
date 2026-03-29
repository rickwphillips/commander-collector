---
id: p293
name: Commander Format Rules — Color Identity, Singleton, Command Zone, and Commander Damage
category: multiplayer
cr_refs: [903.1, 903.2, 903.3, 903.4, 903.5, 903.6, 903.7, 903.8, 903.9, 903.10, 903.11]
tags: [commander, edh, singleton, color-identity, command-zone, commander-tax, 40-life, commander-damage, 100-card-deck, banned-list, companion]
created: 2026-03-29
examples_count: 2
---

# P293 — Commander Format Rules — Color Identity, Singleton, Command Zone, and Commander Damage

## Abstract
Commander (formerly Elder Dragon Highlander, EDH) is a multiplayer format with unique rules: 100-card singleton decks, 40 life totals, a command zone where the commander starts, and the commander tax (each commander cast costs {2} more per previous cast). Deck construction restricts cards to the **color identity** of the commander — a card's color identity includes all colored mana symbols in its mana cost AND rules text. A player who has been dealt 21 or more combat damage by the same commander loses the game. This is separate from the 40-life win condition.

## The Definitive Rules

**CR 903.4** (verbatim): *"The Commander variant uses color identity to determine what cards can be included in a deck. A card's color identity is its color plus the color of any mana symbols in that card's rules text. A card is the color of any mana symbol that appears in its mana cost or rules text."*

**CR 903.5a** (verbatim): *"Each deck must contain exactly 100 cards, including its commander. In other words, the minimum deck size and the maximum deck size are both 100."*

**CR 903.5b** (verbatim): *"Other than basic lands, each card in a Commander deck must have a different English name."*

**CR 903.6** (verbatim): *"At the start of a game, each player puts their commander face up into the command zone."*

**CR 903.8** (verbatim): *"A player may cast their commander from the command zone. A commander cast from the command zone costs an additional {2} for each previous time it has been cast from the command zone this game."*

**CR 903.10** (verbatim): *"If a commander is in a graveyard or in exile and that card was put into that zone since the last time state-based actions were checked, its owner may put it into the command zone."*

**CR 903.11** (verbatim): *"If a commander deals 21 or more combat damage to a player over the course of the game, that player loses the game."*

## The Pattern

```
COLOR IDENTITY:
  The commander's color identity = all colored symbols in mana cost + all colored symbols in rules text
  Examples:
    Jodah, the Unifier ({W}{U}{B}{R}{G}): 5-color identity → any card in deck
    Muldrotha, the Gravetide ({3}{B}{G}{U}): Sultai (black, blue, green)
    Atraxa, Praetors' Voice ({W}{U}{B}{G}): 4-color (no red)
  Card restriction: each card in the deck must have color identity that is a SUBSET of the commander's
    White commander: only cards with white or colorless color identity
    Grixis (B/U/R) commander: can include any black, blue, red, or colorless cards
  Color identity includes mana symbols in TEXT:
    Hybrid cards: a card with {W/U} in cost has both white and blue identity
    Devoid cards: have colorless color identity (no colored symbols)
    Reminder text: color symbols in reminder text DO count for identity
    Phyrexian mana: a card with {W/P} in its cost has WHITE color identity

SINGLETON RULE:
  100 cards exactly (including the commander)
  "No two cards with the same name" — exception: basic lands
  You can have any number of basic lands (Forest, Island, Swamp, Mountain, Plains, Wastes)
  Multiple "Snow Forest": wait — Snow Forests are named "Snow-Covered Forest" not "Forest"
    But CR 903.5b says "same English name." Basic land subtypes?
    Actually: basic LANDS with the same BASIC LAND TYPE can be duplicated.
    "Snow-Covered Forest" and "Forest": different English names → both allowed individually, multiple of each.
    Wait: the rule allows multiple basic lands. "Basic lands" can be duplicated regardless of name.
    Example: 40 Forests in a mono-green Commander deck. All legal.

COMMAND ZONE AND COMMANDER TAX:
  Game starts: commander in command zone, face up
  When commander would go to GY or exile: controller may put it back in command zone instead
  This is a replacement effect (owner's choice each time it would go to GY/exile)
  Casting from command zone: normal casting with +{2} per prior command zone cast
  First cast: normal mana cost
  Second cast: +{2} (2 more mana)
  Third cast: +{4} (4 more mana total additional)
  Tax accumulates across THE ENTIRE GAME: even if commander is exiled for turns, the tax persists

COMMANDER DAMAGE:
  21 combat damage from the SAME commander over the entire game = that player loses
  "Same commander" = identified as the same card (even if it changes zones)
  Commander identity persists through zone changes: a commander that dies and is recast is the SAME commander for damage tracking purposes
  In Commander: 3 different opponents each having a commander → 21 from each = lose from any ONE of them reaching 21
  Your own commander can't deal you commander damage (usually can't attack you anyway)

40 LIFE:
  Commander starts at 40 life (vs. 20 in standard formats)
  This compensates for the longer game and more powerful format
  Both ways to win: reduce life to 0 OR deal 21 commander damage

PARTNER COMMANDERS (P258):
  Two commanders with Partner: both in command zone
  Both have separate commander damage tracking
  21 from commander A OR 21 from commander B = opponent loses
  Combined commander damage doesn't add up: they're tracked separately

COLOR IDENTITY EDGE CASES:
  Lands with colored mana symbols in rules text:
    Savage Lands: "Add {B}, {R}, or {G}" — has black, red, green identity. Requires all three.
    Breeding Pool: "{T}: Add {G} or {U}" — has green and blue identity.
  Colorless commanders: an Eldrazi commander has colorless identity → deck can only include colorless cards + basic wastes
  Note: most decks with colorless commanders include specialized Eldrazi/artifact packages.

COMMANDER BANNED LIST:
  Some powerful cards are banned specifically in Commander (not in other formats):
    Primeval Titan (warping game too much)
    Braids, Cabal Minion (too punishing with multiple opponents)
    Staff of Domination (infinite mana sink)
  Plus some cards banned in all formats.
  The Commander Rules Committee maintains a separate banned list.

COMPANION IN COMMANDER:
  A Companion can be used in Commander — 1 companion per deck
  Companion must follow color identity rules
  Commander + Companion: the companion starts in the sideboard, not the command zone
  Pay the companion cost ({3}): put companion into hand during the game
```

## Definitive Conclusions

- **Color identity includes all colored mana symbols in cost AND rules text** — not just the casting cost.
- **Commander decks are 100-card singleton** — only basic lands can be duplicated.
- **Commander tax adds {2} per previous command zone cast** — persistent across the whole game.
- **21 combat damage from one commander = that opponent loses** — separate from the 40-life win condition.
- **Commander damage is tracked per commander** — partner commanders track separately.

## Canonical Example
**Color Identity Gotcha — Chromatic Lantern in Mono-White:**
Mono-white Commander (e.g., Heliod, Sun-Crowned). Color identity: white only.
You want Chromatic Lantern in your deck: "{3} artifact: tap for any color, your other lands tap for any color."
Chromatic Lantern's rules text: includes "{any color}" language but NO specific colored mana symbols.
The text says "of any color" not "add {G} or {U} or {R}" — no colored symbols in the text itself.
Chromatic Lantern has NO color identity (colorless).
It CAN go in the mono-white deck.
Contrast: a land that says "{T}: Add {G} or {U}" → has green and blue identity → can't go in mono-white.

**Example 2 — Commander Tax Escalating Costs:**
Your commander: Prossh, Skyraider of Kher ({3}{B}{R}{G}). Enters with 6 token-making.
Turn 6: cast Prossh from command zone. Normal cost: {3}{B}{R}{G} = 6 mana.
Turn 8: Prossh is killed. You choose to put it in command zone.
Cast Prossh again: {3}{B}{R}{G} + {2} (tax) = {5}{B}{R}{G} = 8 mana.
Turn 11: Prossh dies again. Back to command zone.
Third cast: {3}{B}{R}{G} + {4} (tax) = 10 mana.
The commander tax accumulates even across death/recast cycles.
Late game: Prossh costs 10-12 mana. The tax punishes repeated board-wipe protection of opponents.

## Commonly Confused With
- **P208 (Commander Zone basics)** — Deeper single-topic exploration of how zone changes interact with the command zone. This pattern covers the overall format rules comprehensively.
- **P258 (Partner Commanders)** — Partner rules for having two commanders; this covers the base format including commander damage tracking for partners.
- **P222 (Phyrexian Mana Color Identity)** — Phyrexian mana in rules text (not just cost) contributes to color identity.
