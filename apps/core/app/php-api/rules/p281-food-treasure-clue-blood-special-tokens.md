---
id: p281
name: Food, Treasure, Clue, and Blood Tokens — Special Artifact Tokens With Built-In Effects
category: zones
cr_refs: [111.9, 111.10, 111.11, 111.12]
tags: [food, treasure, clue, blood, artifact-token, sacrifice, gain-life, add-mana, draw-card, discard-draw, Eldraine, Ixalan, Shadows-over-Innistrad, Innistrad-Crimson-Vow, Tireless-Provisioner, Academy-Manufactor]
created: 2026-03-29
examples_count: 2
---

# P281 — Food, Treasure, Clue, and Blood Tokens — Special Artifact Tokens With Built-In Effects

## Abstract
Four types of special artifact tokens that are commonly created in modern MTG and have standardized built-in activated abilities. **Food**: "{2}, Sacrifice this artifact: Gain 3 life." **Treasure**: "Sacrifice this artifact: Add one mana of any color." **Clue**: "{2}, Sacrifice this artifact: Draw a card." **Blood**: "{1}, Sacrifice this artifact: Discard a card, then draw a card." These tokens are all nontoken artifact subtypes — not creatures — and act as persistent resources that convert to specific effects when sacrificed. They interact significantly with artifact-matters cards and sacrifice synergies.

## The Definitive Rules

**CR 111.9** (verbatim): *"A Food token is a colorless Food artifact token with '{2}, Sacrifice this artifact: You gain 3 life.'"*

**CR 111.10** (verbatim): *"A Treasure token is a colorless Treasure artifact token with 'Sacrifice this artifact: Add one mana of any color.'"*

**CR 111.11** (verbatim): *"A Clue token is a colorless Clue artifact token with '{2}, Sacrifice this artifact: Draw a card.'"*

**CR 111.12** (verbatim): *"A Blood token is a colorless Blood artifact token with '{1}, Sacrifice this artifact: Discard a card, then draw a card.'"*

## The Pattern

```
FOOD TOKENS ({2}, Sacrifice: Gain 3 life):
  Pure life gain: 3 life at the cost of {2} mana + sacrificing the Food
  Efficient when you have excess mana and are in danger
  Inefficient on the mana investment (3 life for 2 mana is below rate in most formats)
  Synergies: sacrifice matters (Korvold), life gain matters (Ajani's Pridemate, Sunbond), artifact matters
  Strategy: hold Foods until critical; convert when health drops to dangerous levels

  FOOD + ENCHANTMENT (Wilds of Eldraine):
    Faeries in Eldraine often create Food tokens as a bonus
    The Witch's Oven + Cauldron Familiar combo: Cat dies → Oven triggers → create a Food token → sacrifice food to recur Cat.
    Sacrifice engine: Oven creates Food from Familiar; Familiar can be returned using Food.
    Food becomes part of a sacrifice recursion loop.

  NOTABLE FOOD GENERATORS:
    Trail of Crumbs ({1}{G}): when you sacrifice a Food, look at top 2 cards, put one in hand.
    The Great Henge ({7}{G}{G}): each creature entering puts a +1/+1 counter on it; you create Food.
    Tireless Provisioner ({2}{G}): whenever a land enters, create a Food or Treasure token.

TREASURE TOKENS (Sacrifice: Add one mana of any color):
  Mana acceleration: each Treasure is effectively a "save up" mana source
  Colorless → any color: flexible. "Add one mana of any color" = you choose the color.
  Timing: Treasures can be sacrificed any time mana is needed (even during spells resolving)
  Artifact: Treasure tokens are artifacts → synergy with artifact-matters cards

  TREASURE SYNERGIES:
    Korvold, Fae-Cursed King ({2}{B}{R}{G}): "Whenever you sacrifice a permanent, Korvold gets +1/+1
      counter and you draw a card." Sacrificing Treasures = draw cards.
    Pitiless Plunderer ({3}{B}): "Whenever a creature you control dies, create a Treasure."
    Xorn (Artifact Creature): "If you would create one or more Treasure tokens, instead create that
      many plus one."

  TREASURE + LANDFALL:
    Tireless Provisioner ({2}{G}): each land entering → create Food OR Treasure.
    In a fetchland deck: every fetch → create a Treasure (pay fetchland cost, get a land AND a Treasure).
    Net positive mana from fetches.

CLUE TOKENS ({2}, Sacrifice: Draw a card):
  Deferred draws: hold Clue, pay {2} when convenient, draw a card.
  Costed at {2}: relatively expensive per card; compensated by timing flexibility.
  Artifact: artifact-matters synergies (Mechanized Production, Academy Manufactor).
  Investigation theme: Shadows over Innistrad, Murders at Karlov Manor — mystery/detective flavor.

  CLUE SYNERGIES:
    Tireless Tracker ({2}{G}): whenever a land enters, investigate. Then whenever you sacrifice a Clue,
      Tireless Tracker gets a +1/+1 counter. Infinite scaling in land-heavy games.
    Academy Manufactor ({3}, Artifact Creature): "If you would create a Clue, Food, or Treasure token,
      instead create those tokens plus one of each of the other two."
      Create one Clue → create Clue + Food + Treasure.
      Create one Food → create Food + Clue + Treasure.
      Every token creation becomes a windfall.

BLOOD TOKENS ({1}, Sacrifice: Discard a card, then draw a card):
  Looting: discard then draw = card filtering
  Costs {1} (cheaper than Clue's {2}). But you must discard first.
  Strategy: use Blood to discard cards you want in the graveyard (madness, flashback, escape)
  Blood synergies: discard-matters (madness triggers, Faithless Looting style effects)

  BLOOD + MADNESS:
    Discard a Fiery Temper for Blood: Madness trigger fires → cast Fiery Temper for {R}.
    Each Blood token activation: cheap loot AND potential madness cast.
    Blood in Innistrad Crimson Vow: vampire-themed loot with discard-focused flavor.

  NOTABLE BLOOD GENERATORS (Innistrad: Crimson Vow):
    Edgar, Charmed Groom: creates Blood tokens.
    Bloodtithe Harvester ({B}{R}): creates a Blood token when enters.

ACADEMY MANUFACTOR INTERACTION:
  Manufactor says: "If you would create [Clue/Food/Treasure], create that AND one of each other two."
  Creating one Food with Manufactor out: create Food + Clue + Treasure (three tokens total).
  Multiple Manufactors: each one's effect applies.
  With 2 Manufactors:
    Trigger 1: create Food → create Food + Clue + Treasure.
    Each of those three tokens triggers Manufactor again?
    Wait: the replacement effect fires when you "would create" a token.
    Creating three tokens at once (from one initial creation) with one Manufactor: that's one event.
    Multiple Manufactors: each Manufactor applies independently as a replacement effect.
    2 Manufactors + Food creation: "would create 1 Food" → [replacement 1]: create 1 Food + 1 Clue + 1 Treasure.
    Does replacement 2 also apply? Yes: "would create a Clue/Food/Treasure" → apply replacement 2.
    Result: more tokens... the math compounds quickly with multiple Manufactors.

TOKEN TYPE COMPARISON:
  Food: {2} + sacrifice → 3 life (life gain)
  Treasure: sacrifice → 1 mana any color (acceleration)
  Clue: {2} + sacrifice → draw 1 (card advantage)
  Blood: {1} + sacrifice → discard then draw (filtering/looting)
```

## Definitive Conclusions

- **Food tokens gain 3 life for {2}** — useful in life-pressure situations and sacrifice synergies.
- **Treasure tokens add one mana of any color** — flexible mana acceleration with no additional cost.
- **Clue tokens draw a card for {2}** — deferred card draw with flexible timing.
- **Blood tokens are {1} looting** — discard then draw, excellent with madness and graveyard synergies.
- **Academy Manufactor multiplies all three** — any one token creation generates all three types.

## Canonical Example
**Tireless Provisioner + Fetchland Loop:**
Board: Tireless Provisioner (2/2 creature). You have two fetchlands in hand.
Activate fetchland: pay 1 life → land enters → Tireless Provisioner triggers → create a Treasure.
Use the Treasure for the fetchland activation cost.
Repeat with second fetchland: another land enters → another Treasure.
Net: each fetchland activation + 1 life = 1 Treasure (free mana) + 2 basic lands.
Over a fetch-heavy game: 4-5 Treasures accumulated = 4-5 bonus mana available.
Use Treasures to ramp ahead: play 7-drop on turn 5 with accumulated Treasure mana.

**Example 2 — Academy Manufactor Token Explosion:**
Board: Academy Manufactor (Artifact Creature). Cast Tireless Provisioner.
Activate a fetchland → land enters → Tireless Provisioner: "create a Food or Treasure."
Choose Food. Academy Manufactor sees "would create a Food" → replace: create Food + Clue + Treasure.
Three tokens from one Food creation.
Now do it again with another fetchland → another Food creation → another set of three tokens.
Each fetchland activation: 3 tokens (Food + Clue + Treasure).
In a 4-fetch game: 12 tokens from Manufactor. 4 more from normal Provisioner without Manufactor.
Convert: eat Foods for life, sacrifice Treasures for mana, pay {2} per Clue for draws.
One card (Academy Manufactor) transformed a single-token engine into a triple-token avalanche.

## Commonly Confused With
- **P280 (Investigate)** — Investigate is the action that creates a Clue token; Clue tokens themselves are what this pattern describes (their activation and synergies).
- **P097 (Affinity/Artifact Matters)** — Artifact-matters effects count tokens including Food/Treasure/Clue/Blood as artifacts. These tokens are valid targets for artifact synergies.
- **P244 (Devour)** — Devour sacrifices creatures; Food/Treasure/Clue/Blood are sacrificed as artifacts for different effects.
