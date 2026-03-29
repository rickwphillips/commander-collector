---
id: p268
name: Bargain and Craft — Sacrifice an Artifact/Enchantment/Token for Upgraded Effect
category: costs
cr_refs: [702.166a, 702.166b, 702.166c, 702.166d, 702.167a, 702.167b, 702.167c]
tags: [bargain, craft, sacrifice, additional-cost, upgrade, transform, enchantment, artifact, token, Wilds-of-Eldraine, Lost-Caverns-of-Ixalan, Beseech-the-Mirror, Thousand-Moons-Smithy, Ichorplate-Golem]
created: 2026-03-29
examples_count: 2
---

# P268 — Bargain and Craft — Sacrifice an Artifact/Enchantment/Token for Upgraded Effect

## Abstract
Two sacrifice-based mechanics from 2023. **Bargain** (Wilds of Eldraine): an optional additional cost on instants/sorceries — sacrifice an artifact, enchantment, or token. If you pay the bargain cost, the spell is "bargained" and gains an additional effect described on the card. Bargain rewards having expendable artifacts, enchantments, or tokens. **Craft** (Lost Caverns of Ixalan): an activated ability on permanents — exile the permanent plus specific materials from your battlefield and graveyard, returning it to the battlefield transformed. Craft is a sorcery-speed upgrade that turns a front-face permanent into a more powerful back face at the cost of specific exiled resources.

## The Definitive Rules

**CR 702.166a** (verbatim): *"Bargain is a static ability that functions while the spell with bargain is on the stack. 'Bargain' means 'As an additional cost to cast this spell, you may sacrifice an artifact, enchantment, or token.' Paying a spell's bargain cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.166b** (verbatim): *"If a spell's controller declares the intention to pay that spell's bargain cost, that spell has been 'bargained.' See rule 601.2b."*

**CR 702.167a** (verbatim): *"Craft represents an activated ability. It is written as 'Craft with [materials] [cost],' where [materials] is a description of one or more objects. It means '[Cost], Exile this permanent, Exile [materials] from among permanents you control and/or cards in your graveyard: Return this card to the battlefield transformed under its owner's control. Activate only as a sorcery.'"*

## The Pattern

```
BARGAIN:
  Additional cost on instants/sorceries: optionally sacrifice artifact, enchantment, or token
  If you sacrifice (bargain): the spell is "bargained" and gets its bonus effect
  If you don't: the spell works normally without the bargain bonus

  WHAT CAN BE BARGAINED:
    Artifacts: any artifact permanent you control
    Enchantments: any enchantment permanent you control
    Tokens: any token permanent (including creature tokens, Food tokens, Treasure tokens)
    Key: Treasure tokens and Food tokens are common sacrifice targets
    A sacrificed artifact/enchantment/token is gone permanently

  BARGAIN + TOKENS:
    Treasure tokens: created by many cards (ramp artifacts) → perfect bargain fodder
    Food tokens: created by Wilds of Eldraine food-themed cards
    Clue tokens: sacrificeable artifacts for bargain
    A single 1/1 creature token satisfies the bargain cost (it's a token)
    Bargain is particularly strong in token-heavy decks: expendable resources abound

  BARGAIN BONUS — CARD-SPECIFIC:
    Each bargained spell has its own printed bonus if bargained
    Examples: a normal effect PLUS "draw a card" OR a target X becomes much bigger
    "If this spell was bargained, [additional effect]" — linked ability to the bargain keyword

  BARGAIN NOTABLE CARDS (Wilds of Eldraine):
    Beseech the Mirror ({2}{B}{B}, Sorcery, Bargain): "Search for any card and put it in hand. If this
      spell was bargained, you may cast that card without paying its mana cost if it's a spell with
      mana value 4 or less."
      Normal: {2}{B}{B} — tutor any card to hand.
      Bargained (sacrifice Treasure/token): tutor ANY card AND cast it for free if MV ≤ 4.
      Bargained Beseech: tutor Rite of Flame (MV 1), Thoughtseize (MV 1), Fatal Push (MV 1)...
      Or: tutor Dark Ritual + cast it free → 3 mana from {B} → net +2 mana
      In combo decks: Beseech with Bargain enables finding and casting win conditions for free.

    Bitter Reunion ({1}{R}, Instant, Bargain): "Discard any number of cards. Draw that many cards.
      If this spell was bargained, each creature you control gains haste until end of turn."
      Bargained: loot plus your whole team gets haste.

    Hopeless Nightmare ({B}, Enchantment — Aura): "Enchanted opponent... loses 2 life, discards a card."
      ...Plus if it dies: can be a bargain sacrifice fodder for the later Bargain spells.

CRAFT:
  Activated ability: sorcery speed
  Cost: pay the craft cost + exile the permanent itself + exile required materials
  Result: the permanent returns to battlefield TRANSFORMED (back face)
  The craft ability transforms the permanent by exiling it and bringing it back transformed

  CRAFT MATERIALS (CR 702.167b):
    Materials can be: permanents you control OR cards in your graveyard
    Both sources are valid for the exiled materials
    "Exile [materials] from among permanents you control and/or cards in your graveyard"
    You can mix and match: some from battlefield, some from graveyard

  CRAFT + EXILE:
    All the materials are EXILED (removed from game) as part of the cost
    The crafted permanent itself is also exiled and returns transformed
    The exiled materials are gone (unless the craft permanent references them)
    CR 702.167c: An ability of the permanent may refer to the exiled cards used to craft it.

  CRAFT + SORCERY SPEED:
    Activate only as a sorcery: during main phase while stack is empty
    Can't craft in response to removal (sorcery speed limitation)
    Plan ahead: make sure you have the materials before opponent's removal

  CRAFT NOTABLE CARDS (Lost Caverns of Ixalan):
    Thousand-Moons Smithy ({1}{W}, Artifact): "When Thousand-Moons Smithy enters, create a 2/1
      white Pilot creature token with 'whenever this creature crews a Vehicle, it explores.'"
      Craft with four Vehicles {4}{W}: exile this and four Vehicles → return transformed.
      Transformed: Barracks of the Thousand (a legendary land-artifact that generates creatures).
      Cost: {4}{W} + exile Smithy + exile 4 Vehicles → massive resource engine on the back.

    Ichorplate Golem ({3}, Artifact Creature — Golem 3/3): "Creatures you control with oil counters
      get +1/+1. Craft with two artifacts {4}."
      Craft: exile Ichorplate + two artifacts → transformed back face.
      Back face: more powerful Golem with additional abilities.
      Materials: two artifacts from battlefield or graveyard + pay {4}.

    Quintorius Kand ({4}{R}{W}, Legendary Creature 5/3): not a craft card but has synergy.

    The key: Craft is an upgrade path — turn a useful card into a much more powerful version
    at the cost of specific resources that must be committed to the transformation.

BARGAIN vs CRAFT COMPARISON:
  Bargain: optional additional cost on spells → extra effect if paid
  Craft: activated ability → transforms a permanent using exiled materials
  Both: sacrifice/exile resources for upgraded effects
  Bargain: one-time (spell resolves and is gone); Craft: transforms a permanent (stays on board)
```

## Definitive Conclusions

- **Bargain sacrifices any artifact, enchantment, or token** — Treasure/Food/Clue tokens are natural bargain fodder.
- **Beseech the Mirror bargained = free cast of MV ≤ 4 tutor** — among the strongest Bargain cards.
- **Craft exiles the permanent AND specified materials** — all permanently gone except the returned transformed permanent.
- **Craft materials can come from battlefield OR graveyard** — flexible sourcing.
- **Craft is sorcery speed** — can't be used in response to removal.

## Canonical Example
**Beseech the Mirror Bargained Combo:**
You have: {2}{B}{B} mana, a Beseech the Mirror in hand, and a Treasure token on the battlefield.
Cast Beseech the Mirror. Pay bargain cost: sacrifice the Treasure token.
The spell is now bargained.
Resolve: search library for any card. You find Demonic Consultation (MV 1, instant).
If it's MV 4 or less and a spell: you may cast it immediately (for free, no mana cost).
Cast Demonic Consultation free → name a card → exile until you find it.
Bargain transformed Beseech from "tutor to hand" to "tutor and immediately cast any spell MV ≤ 4."
Cost: the Treasure token (but you got mana from it to cast Beseech).

**Example 2 — Thousand-Moons Smithy Craft:**
Board: Thousand-Moons Smithy + 4 Vehicles (Smuggler's Copter, Parhelion II, two others).
Your main phase. Pay {4}{W}: Craft ability.
Exile Thousand-Moons Smithy + 4 Vehicles. All five permanents disappear.
Thousand-Moons Smithy returns TRANSFORMED as Barracks of the Thousand.
Barracks: a legendary land that taps for {W} and generates 2/1 Pilot tokens.
Trade: 4 Vehicles (which you attacked with already) + Smithy → permanent land-based token generator.
The exiled Vehicles are gone (but their attack contribution is done — you craft post-combat).

## Commonly Confused With
- **P268 note**: Both Bargain and Craft involve sacrifice/exile of permanents. Key difference: Bargain is an optional additional cost when casting spells; Craft is an activated ability to transform a permanent.
- **P252 (Exploit)** — Exploit sacrifices a creature for an ETB bonus; Bargain sacrifices an artifact/enchantment/token for a spell bonus.
- **P153 (Cycling/Transmute)** — Transmute sacrifices a card to tutor for another; Craft uses materials to transform a permanent, not to search your library.
