---
id: p224
name: Threshold, Metalcraft, Delirium — Counting Graveyard and Permanent Conditions
category: continuous
cr_refs: [702.39, 702.76, 702.117]
tags: [threshold, metalcraft, delirium, graveyard-count, seven-cards, three-artifacts, four-card-types, static-condition, Mirrodin, Innistrad]
created: 2026-03-28
examples_count: 2
---

# P224 — Threshold, Metalcraft, Delirium — Counting Graveyard and Permanent Conditions

## Abstract
Threshold, Metalcraft, and Delirium are three similar static-condition mechanics that gate powerful abilities behind achieving a specific game-state count. Threshold (7+ cards in graveyard), Metalcraft (3+ artifacts), and Delirium (4+ card types in graveyard) all function as "if [condition], [bonus]" static abilities. Once the condition is met, the bonus is continuously active; once it's no longer met, the bonus turns off. These create tension around filling your graveyard, maintaining artifacts, or diversifying your graveyard card types — and create interactive targets for opponents trying to break those thresholds.

## The Definitive Rules

**CR 702.39** (verbatim, Threshold): *"'Threshold' appears on cards with abilities that function while a player has seven or more cards in their graveyard. 'Threshold' is a keyword for this condition."*

Note: Threshold, Metalcraft, and Delirium are informal names for specific condition patterns in the rules text. Their formal rule numbers track the conditions:

**Threshold**: CR 702.39 — "as long as you have 7 or more cards in your graveyard, [ability]"
**Metalcraft**: CR 702.76 — "as long as you control three or more artifacts, [ability]"
**Delirium**: CR 702.117 — "as long as there are four or more card types among cards in your graveyard, [ability]"

## The Pattern

```
THRESHOLD:
  Condition: you have 7 or more cards in your graveyard
  Static: "as long as you have threshold" → continuously active/inactive
  Turned on: when your 7th card enters graveyard
  Turned off: if graveyard is reduced below 7 (opponent exiles cards, Wheel effects, etc.)

  THRESHOLD + GRAVEYARD EXILE:
    Opponent casts Surgical Extraction: exiles multiple copies of a card from your graveyard
    If this drops you below 7: threshold abilities turn off immediately
    Dynamic: opponents can "break" your threshold by targeting your graveyard
    Leyline of the Void: cards would go to exile instead of graveyard → threshold never activates

  THRESHOLD CARDS:
    Werebear ({1}{G}): 1/1 "Tap: add {G}" → "With threshold: 4/4 and tap: add {G}."
    Rabid Wombat ({2}{G}{G}) (not threshold, just example)
    Mystic Zealot: "threshold: menace"
    Strength of Lunacy: spell that's better with threshold in your graveyard
    Quick fill: self-mill, looting, cycling to hit 7 quickly

METALCRAFT:
  Condition: you control 3 or more artifacts
  Active: as long as 3+ artifacts are on the battlefield under your control
  Turned off: if artifacts are destroyed, countered, bounced below the 3 threshold

  METALCRAFT CARDS:
    Mox Opal ({0} Legendary Artifact — Mox): "Metalcraft — Tap: add one mana of any color you choose. Activate only if you control three or more artifacts."
    This is the most powerful Metalcraft card — Mox Opal with 3 artifacts = free colored mana each turn
    Banned in Modern (too consistent free mana with Affinity/Artifact decks)
    Galvanic Blast ({R}): "Metalcraft — if you control 3+ artifacts, deals 4 damage instead of 2."
    Iron Myr, Gold Myr, Silver Myr: 1/1 artifact mana producers → easy Metalcraft enablers

  METALCRAFT + AFFINITY:
    Affinity (P041-equivalent): costs reduced by artifacts you control
    Metalcraft: bonus abilities when 3+ artifacts
    Both care about artifact count
    Together: cheap spells AND bonus effects from artifact density

DELIRIUM:
  Condition: 4 or more CARD TYPES among cards in your graveyard
  Card types: creature, sorcery, instant, enchantment, artifact, land, planeswalker, tribal, battle
  "Four card types" means the graveyard contains at least one of each of 4 different types
  Example: 1 creature card + 1 sorcery + 1 instant + 1 land in graveyard = delirium

  DELIRIUM CARD TYPES:
    Common delirium targets: creatures, sorceries, instants, lands (easiest to fill)
    Artifacts and enchantments: less common in main deck
    Planeswalkers: rare in graveyard, but if one dies or is discarded: easy delirium bump

  DELIRIUM CARDS:
    Traverse the Ulvenwald ({G}): "Search your library for a land. Delirium — instead, search for any card."
    Becomes a Demonic Tutor for {G} with delirium — extremely powerful in green shells
    Modern Death's Shadow: self-mill + Traverse delirium for any threat in library
    Ishkanah, Grafwidow ({4}{G}): "Delirium — ETB creates three 1/2 Spider tokens."
    Delirium makes Ishkanah make a team of spiders; without delirium, just a 3/5 Spider.

  DELIRIUM + INSTANT/SORCERY COUNTS:
    Having "a sorcery" and "an instant" in GY = 2 card types from just 2 cards
    Lands go to GY via fetchlands → free land card type
    Creatures die in combat → free creature card type
    Delirium is achievable by turn 3-4 in a typical game if you fetch and trade creatures

  DELIRIUM + GRAVEYARD HATE:
    Tormod's Crypt, Grafdigger's Cage: exile graveyard cards
    This resets delirium (fewer card types in GY or fewer than 4 total types)

CONDITION COMPARISON:
  Threshold: count QUANTITY (7+ total cards)
  Metalcraft: count QUANTITY of specific permanent type (3+ artifacts on battlefield)
  Delirium: count VARIETY of card types (4+ different types in GY)
  Formidable: count POWER (8+ total power among your creatures)
  Ferocious: have a creature with 4+ power
  All are similar "as long as X" conditions with different counts
```

## Definitive Conclusions

- **Threshold**: 7+ cards in your graveyard → bonus active.
- **Metalcraft**: 3+ artifacts you control → bonus active.
- **Delirium**: 4+ card types in your graveyard → bonus active.
- All three are **continuous static conditions** — on/off as the condition is met or broken.
- **Opponents can break these conditions** — graveyard exile breaks threshold/delirium; artifact destruction breaks metalcraft.

## Canonical Example
**Mox Opal (Metalcraft) in Modern Affinity:**
You control: Mox Opal (artifact 1), Ornithopter (artifact 2), Darksteel Citadel (artifact land 3).
Three artifacts → Metalcraft active. Mox Opal taps for any color mana.
Opponent destroys Ornithopter (artifact 2 now gone): only 2 artifacts → Metalcraft off.
Mox Opal can't activate. Critical loss in tempo.
Opponent can also use Stony Silence (prevent artifact activations) — Metalcraft becomes irrelevant.

**Example 2 — Traverse the Ulvenwald (Delirium):**
Turn 1: Fetch land (sacrificed fetch → fetch goes to GY as land type). Turn 1 creature dies in combat → creature type in GY.
Turn 2: Cast Opt (instant in GY). Cast a Sorcery → sorcery type in GY.
Graveyard: land + creature + instant + sorcery = 4 card types = Delirium achieved!
Turn 2: Cast Traverse the Ulvenwald with delirium → search for Death's Shadow (0-cost 13/13 in the right conditions).
Turn 3: Cast Death's Shadow and win.
Delirium Traverse as a tutor is one of the most efficient win conditions in Modern green shells.

## Commonly Confused With
- **P219 (Devotion)** — Devotion counts colored mana symbols in permanents. Threshold/Delirium/Metalcraft count graveyard cards or artifacts.
- **P216 (Proliferate)** — Proliferate interacts with counters, not card counts.
- **P224 vs Hellbent** — Hellbent activates when you have NO cards in hand. These mechanics activate when you have MANY cards in a zone.
