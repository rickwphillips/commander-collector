---
id: p258
name: Partner and Background — Multiple Commanders in the Command Zone
category: multiplayer
cr_refs: [702.125a, 702.125b, 702.125c, 702.125d, 702.125e]
tags: [partner, partner-with, background, commander-pair, command-zone, color-identity, Commander-Legends, Baldurs-Gate, Thrasios, Malcolm-Breeches, Faceless-Butcher]
created: 2026-03-28
examples_count: 2
---

# P258 — Partner and Background — Multiple Commanders in the Command Zone

## Abstract
Partner and Background are abilities that let you have two commanders instead of one in the Commander format. **Partner**: both commanders can be put into the command zone at the start of the game; both can be cast, tracked for commander damage separately, and taxed (+{2} each time) independently. **Partner with [specific name]**: a named variant — you may have both halves in the command zone, but only if both specific halves are present. **Background**: a subtype of enchantment — you may choose a Commander with "choose a background" and a legendary enchantment background as your second commander. Color identity for all Partner/Background pairs is the union of both cards' color identities.

## The Definitive Rules

**CR 702.125a** (verbatim): *"Partner is a keyword that modifies the rules for deck construction in the Commander variant (see rule 903). 'Partner' means 'You may designate two legendary creatures as your commanders if both have partner.'"*

**CR 702.125b** (verbatim): *"'Partner with [name]' is a variant of the partner ability. 'Partner with [name]' means 'You may designate two legendary creatures as your commanders if one of them is named [name] and the other has partner with [name].' These two creatures are partners. Partner with [name] also causes the following ability to exist: 'When this permanent enters, target player may search their library for a card named [name], reveal it, put it into their hand, then shuffle.'"*

## The Pattern

```
PARTNER (generic):
  Both commanders have "Partner": you may use them both as commanders simultaneously
  Both start in the command zone
  Both can be cast independently (each pays their own commander tax)
  Commander damage: tracked per commander separately (21 from ONE commander = lose)
  Color identity: UNION of both commanders' color identities
  Example: Thrasios, Triton Hero ({G}{U}) + Tymna the Weaver ({W}{B}) = 4-color deck (Atraxa colors without R)

PARTNER + CASTING:
  Two commanders in command zone → two potential casts per game
  Cast Commander 1 for {mana}. Cast Commander 2 for {mana}. Each tracked separately.
  Commander 1 dies: tax to recast = original cost + {2}.
  Commander 2 dies: tax to recast = original cost + {2}.
  Having two: more card advantage/flexibility, but also more mana investment to maintain both.

PARTNER + COLOR IDENTITY:
  Two 2-color commanders: potentially 4-color deck
  Very powerful in Commander: access to 4 colors of cards
  Partner was banned/limited specifically because this was too powerful in competitive formats
  Partner with specific: both must be in the deck together (less flexible, more focused)

PARTNER WITH [NAME]:
  Named partners: designed to be used together
  Partnered pair: if one is in hand, the other's "Partner with" ability lets you search for the specific partner
  The search happens on ETB: put onto battlefield, search for the partner
  Not a generic "any partner" — must be the named specific partner

  PARTNER WITH PAIRS:
    Gorm the Great + Virtus the Veiled: both legendary; Gorm has menace, Virtus deals half life loss on connection
    Alone Gorm is a defensive wall; Virtus alone is fragile. Together: Gorm must be blocked (menace), Virtus slips through → opponent loses half life.
    The "Partner with" ability: search for the other half on ETB

BACKGROUND:
  Background is a subtype of enchantment (legendary enchantment subtype)
  "Choose a Background" ability on Legendary creature commanders: you may have a Background as your second commander
  The Background is a legendary enchantment that provides ongoing effects
  Dual-commander system: Legendary Creature (with "choose a background") + Background Enchantment

  BACKGROUND RULES:
    The background enchantment can only be your commander if your other commander has "choose a background"
    Background starts in command zone like a normal commander
    Can be cast from command zone (pays commander tax)
    When cast: it's an enchantment that becomes a background; its effect applies
    Color identity: background's identity combined with the creature's identity

  BACKGROUND CARDS (Commander Legends: Battle for Baldur's Gate):
    Sword Coast Sailor ({3}{U}): "Legendary creatures you control have flying and are unblockable." Background.
    Raised by Giants ({5}{G}): "Your commander becomes a legendary 10/10 creature with base power and toughness 10/10." Background.
    Street Urchin ({2}{R}): Background, "your commander has '{T}: This creature deals 1 damage to any target.'" Useful for tapping for damage triggers.

  BACKGROUND POPULAR PAIRS:
    Baeloth Barrityl, Entertainer ({3}{R}) + Street Urchin: goad + direct damage combo
    Karlach, Fury of Avernus + Raised by Giants: 10/10 with extra combats

COMMANDER DAMAGE + PARTNER:
  Each commander tracks damage separately
  21 commander damage from commander A → lose. Does NOT combine.
  But: you take 21 from commander A + 21 from commander B = lose twice over... but the game ends at the first 21.
  "Combined" commander damage doesn't exist: each is tracked individually.
  Two commanders: potential for faster commander damage clock (two separate 21-damage threats).

PARTNER + TOTEM ARMOR/INDESTRUCTIBLE:
  If both commanders have indestructible: very hard to remove either permanently.
  Partners synergize: cast both → have two sources of effects + redundancy if one is removed.

FAMOUS PARTNER PAIRS:
  Thrasios + Tymna: cEDH powerhouse, blue-white-black-green (4-color) infinite mana outlet + life-pay draw.
  Malcolm, Keen-Eyed Navigator + Breeches, Brazen Plunderer: Pirate combo, opponent Exile + cast their cards.
  Gorm the Great + Virtus the Veiled: "half life loss" combo with Gorm guaranteeing Virtus hits.
  Silas Renn, Seeker Adept + Akiri, Line-Slinger: Breya-style 4-color artifact deck.
```

## Definitive Conclusions

- **Partner** allows two legendary creatures to both be your commander — cast each independently.
- **Color identity is the union** of both commanders — potentially 4 colors from two 2-color partners.
- **Commander damage is tracked per commander** — 21 from one commander, not combined.
- **Partner with [name]** is a named pair with a triggered search to find the other half on ETB.
- **Background** pairs a creature commander with a legendary enchantment — the Background provides ongoing effects.

## Canonical Example
**Thrasios + Tymna in Competitive EDH:**
Commanders: Thrasios, Triton Hero ({1}{G}{U}, "pay {4}: scry 1, if land flip it onto battlefield, otherwise put in hand") + Tymna the Weaver ({1}{W}{B}, "pay X life, X = # opponents dealt damage this turn: draw X cards").
Color identity: {G}{U}{W}{B} = Atraxa colors (no red). Access to all best cards in those colors.
Turn 1: cast Tymna for {1}{W}{B}. Turn 2: cast Thrasios for {1}{G}{U}.
Tymna + combat damage = draw extra cards. Thrasios = mana sink to put lands into play.
Together: infinite mana (via Thrasios mana sink outlet) + hand advantage (via Tymna life-pay).
cEDH: Thrasios/Tymna is the "fair" 4-color cEDH deck backbone.

**Example 2 — Gorm + Virtus Partnership:**
Gorm the Great ({3}{G}): 2/7 Vigilance Menace, "Gorm the Great must be blocked if able. Partner with Virtus the Veiled."
Virtus the Veiled ({2}{B}): 1/1 Deathtouch, "whenever Virtus the Veiled deals combat damage to a player, that player loses half their life, rounded up. Partner with Gorm the Great."
ETB of Gorm: search for Virtus. ETB of Virtus: search for Gorm.
Attack: both Gorm and Virtus attack.
Opponent must block Gorm (menace: needs 2 blockers). Virtus: opponent has no blockers left or can only assign 1.
Virtus gets through: deals 1 damage → player loses HALF their life.
At 40 life: lose 20. Two Virtus connections: 20 → 10 → dead.
Gorm protects Virtus by forcing all blocks onto Gorm.

## Commonly Confused With
- **P208 (Commander Zone)** — Base commander rules. Partner extends commander to two separate commanders.
- **P206 (Class)** — Class levels are enchantment upgrades. Background is a Background enchantment subtype for a commander pair system.
- **P217 (Goad)** — Goad forces opponents to attack. Partner commanders can carry goad (via Baeloth) but goad is a separate mechanic.
