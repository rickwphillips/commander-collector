---
id: p337
name: Devotion and Characteristic-Defining Abilities — Conditional Creatures, Layer 7a, and Mana Symbol Counts
category: continuous
cr_refs: [700.5, 700.5a, 604.3, 604.3a, 613.3, 613.4a, 208.2a]
tags: [devotion, characteristic-defining-ability, CDA, conditional-creature, layer-7a, mana-symbols, devotion-count, hybrid-devotion, Gods-Theros, Purphoros, Erebos, Heliod, Thassa, Nylea, Karametra, Phenax, enchantment-creature, P-T-defines]
created: 2026-03-29
examples_count: 2
---

# P337 — Devotion and Characteristic-Defining Abilities — Conditional Creatures, Layer 7a, and Mana Symbol Counts

## Abstract
**Devotion** counts mana symbols of a given color among the mana costs of permanents you control. **Hybrid mana symbols** count for BOTH component colors. The Theros Gods are legendary enchantment creatures with a **characteristic-defining ability (CDA)** that says "As long as your devotion to [color] is less than N, [this card] isn't a creature." CDAs apply in Layer 6 (types) before other continuous effects, and in Layer 7a for P/T. This means checking devotion happens BEFORE other type-affecting effects are calculated. CDAs also function in all zones (hand, GY, exile), not just the battlefield.

## The Definitive Rules

**CR 700.5** (verbatim): *"A player's devotion to [color] is equal to the number of mana symbols of that color among the mana costs of permanents that player controls. A player's devotion to [color 1] and [color 2] is equal to the number of mana symbols among the mana costs of permanents that player controls that are [color 1], [color 2], or both colors."*

**CR 700.5a** (verbatim): *"A player's devotion to each color and combination of colors, taking into account any effects that modify devotion, is calculated after considering any copy, control, or text-changing effects but before any other effects that modify the characteristics of permanents."*

**CR 604.3** (verbatim): *"Some static abilities are characteristic-defining abilities. A characteristic-defining ability conveys information about an object's characteristics that would normally be found elsewhere on that object (such as in its mana cost, type line, or power/toughness box). Characteristic-defining abilities can add to or override information found elsewhere on that object. Characteristic-defining abilities function in all zones."*

**CR 613.3** (verbatim): *"Within layers 2–6, apply effects from characteristic-defining abilities (CDAs) first, then all other effects in timestamp order."*

**CR 613.4a** (verbatim): *"Layer 7a: Effects from characteristic-defining abilities that define power and/or toughness are applied."*

## The Pattern

```
DEVOTION COUNTING (CR 700.5):
  Devotion = COUNT of colored mana symbols in mana costs of permanents you control.
  ONLY counts mana costs. NOT rules text (which counts for color identity — P328).
  ONLY permanents on the BATTLEFIELD. Not hand, GY, exile.
  Examples:
    Purphoros, God of the Forge ({3}{R}): contributes 1 red mana symbol to devotion to red.
    Fanatic of Mogis ({3}{R}{R}): contributes 2 red to devotion to red.
    Nykthos, Shrine to Nyx (land): mana cost is blank. Contributes 0 to any devotion.
    But Nykthos uses devotion to produce mana — it's a separate calculation.

  HYBRID MANA IN DEVOTION:
    {W/B} hybrid symbol counts for BOTH white AND black devotion.
    Nightveil Specter ({U/B}{U/B}{U/B}): each hybrid symbol contributes 1 to blue AND 1 to black.
    3 × hybrid {U/B} symbols: devotion to blue +3, devotion to black +3 from one permanent.
    This makes hybrid cards extremely valuable in devotion-heavy strategies.

  DEVOTION SELF-COUNTING:
    Purphoros has {3}{R} mana cost. It contributes 1 red mana symbol.
    Purphoros's own CDA: "As long as devotion to red < 5, Purphoros isn't a creature."
    Purphoros counts its own {R} symbol. So with just Purphoros on battlefield: devotion to red = 1.
    Need 4 more red symbols from other permanents to make Purphoros a creature.

  WHAT MODIFIES DEVOTION:
    Some cards explicitly say "+1 to devotion": Altar of the Pantheon (add 1 to each devotion), Nyx Lotus.
    Copy/control effects change which permanents you control and therefore shift devotion.
    If you steal an opponent's red permanent: it contributes to YOUR red devotion.
    If you turn a permanent into a colorless artifact: its mana cost is still the ORIGINAL. The type changes but the mana cost characters don't.
    Wait: "turn a permanent into" effects (Opalescence) don't change mana cost. Devotion count doesn't change.
    But: if a permanent's mana cost is changed (text-change effects): the changed cost is used.

CHARACTERISTIC-DEFINING ABILITIES (CDAs):
  A CDA is a static ability that:
    1. Defines an object's color, subtype, power, or toughness.
    2. Is printed on the card (or granted by token creation/copy).
    3. Functions in ALL zones (hand, library, stack, battlefield, GY, exile).
    4. Doesn't directly affect OTHER objects.
    5. Doesn't conditionally set values.
  Examples:
    Tarmogoyf ({1}{G}): "Tarmogoyf's power is equal to the number of card types among cards in all graveyards and its toughness is equal to that number plus one."
      This is a P/T-defining CDA. Applies in layer 7a.
      In hand: Tarmogoyf's P/T is defined but has no effect there.
      On stack: it has the defined P/T (matters for cascade MV comparisons? No: MV = mana cost, not P/T).
      On battlefield: P/T updates continuously as card types enter GYs.
    Nameless Inversion (tribal Instant — Shapeshifter): it's a Shapeshifter spell.
      CDAs for typecycling work in all zones.

  CDAs APPLY IN LAYER 6 AND 7a:
    Layer 6 (type changes): CDAs that add/remove types apply first, then other effects in timestamp.
    Layer 7a (P/T): CDAs that define P/T apply first.
    This means: if two effects interact, the CDA is applied before timestamp-order effects.

THEROS GODS — CONDITIONAL CREATURE STATUS:
  Gods like Purphoros, God of the Forge ({3}{R}): legendary enchantment creature.
    CDA: "As long as your devotion to red is less than 5, Purphoros isn't a creature."
    This applies in Layer 6 (type-changing).
    CR 700.5a: devotion is calculated AFTER copy/control effects, BEFORE other characteristic effects.
    This means: calculate devotion first → determine if the CDA's condition is met → apply type change.

  WHEN PURPHOROS IS NOT A CREATURE:
    It's still an enchantment, a legendary permanent, and an artifact (no), and a God.
    It has the printed P/T (6/5) but isn't a creature.
    Can't attack, can't block, isn't affected by "destroy all creatures."
    CAN be targeted by enchantment removal (Wear/Tear, Disenchant).
    CAN have its abilities activated (loyalty abilities? No, Purphoros has non-loyalty activated abilities).
    CAN use "sacrifice this permanent" if applicable.
    The God's abilities still work (Purphoros's "{2}{R}: Creatures you control get +2/+0 until EOT" still works).
    The TYPE LINE doesn't show "creature" when devotion is below 5.

  WHEN PURPHOROS IS A CREATURE:
    At devotion to red ≥ 5: CDA condition is FALSE → Purphoros retains its "creature" type.
    Now it's an attacking/blocking creature, subject to creature removal, etc.
    If devotion drops below 5 mid-combat: Purphoros is no longer a creature → removed from combat (SBA checks).
    BUT: P/T remains printed on the card. It has a printed 6/5 always (CDA applies regardless).

  GODS AND COMMANDER DAMAGE:
    If Purphoros becomes a creature and attacks: commander damage accumulates.
    If devotion drops mid-combat: Purphoros is removed from combat. Damage already dealt counts.
    On next turn: if devotion ≥ 5 again, it can attack.

  GODS IN MULTIPLAYER (DEVOTION FROM MULTIPLE PLAYERS):
    Devotion counts only YOUR permanents.
    If opponent controls a red permanent: doesn't contribute to YOUR devotion.
    In Commander with Purphoros: you might have very few red permanents depending on deck.
    Nykthos, Shrine to Nyx: lands have blank mana costs, don't contribute to devotion.
    Mogis, God of Slaughter ({2}{B}{R}): devotion to black AND red ≥ 7.
      Counts all black AND red mana symbols. Much easier to hit in a two-color deck.

P/T CDAS (TARMOGOYF AND SIMILAR):
  Tarmogoyf: P = (card types in all GYs), T = P + 1.
  On battlefield: continuously updated. As cards enter/leave GYs, P/T changes.
  State-based action check: if Tarmogoyf's T drops to 0 from damage (unlikely but possible), it dies.
    But Tarmogoyf's P/T is based on GY state. If all card types leave GYs: T = 0 + 1 = 1. Always at least 1/2.
    Actually if 0 card types in GYs: T = 0 + 1 = 1. Never below 1/2.
  Lord of Extinction ({3}{B}{G}): "Lord of Extinction's power and toughness are each equal to the number of cards in all graveyards." CDA, same idea.
  CDAs for P/T apply in layer 7a: before pump effects (7c) and before switches (7d).

NYKTHOS, SHRINE TO NYX — DEVOTION FOR MANA:
  Nykthos: land with "Tap, Pay 2: add an amount of mana of any color equal to your devotion to that color."
    For each color independently.
  Your red devotion is 6: pay {2}, tap Nykthos → add 6 {R} mana.
  This is enormously powerful with high-devotion permanents.
  Red devotion deck: pack many {R}{R} cards → Nykthos produces insane amounts.
  Purphoros alone contributes 1 to red devotion. But Stormbreath Dragon ({2}{R}{R}) contributes 2.
  RDW with Nykthos: Ash Zealot ({R}{R}), Fanatic of Mogis ({3}{R}{R}), Stormbreath Dragon ({2}{R}{R}).
    With 3 of those plus Purphoros: 2+2+2+1 = 7 red devotion.
    Nykthos: pay {2} + tap = add {7}{R} total (7 mana minus 2 paid = 5 net mana gain). Explosive.
```

## Definitive Conclusions

- **Devotion counts colored mana symbols in mana costs of YOUR permanents on battlefield only** — lands (no mana cost) contribute 0; hybrid symbols count for both component colors.
- **CDAs apply before timestamp-ordered effects in their layer** — for Gods' type conditional, devotion is calculated before the type change is applied.
- **Gods are not creatures when devotion is below threshold** — they still have printed P/T but can't attack/block and don't die to "destroy all creatures."
- **Tarmogoyf's P/T is a CDA that updates continuously** — applied in layer 7a before pump spells.
- **Stealing opponent's permanents shifts devotion** — controlling an opponent's red permanent adds to YOUR red devotion.

## Canonical Example
**Purphoros — Devotion Threshold:**
Mono-red devotion deck. Battlefield state:
  Purphoros, God of the Forge ({3}{R}): devotion +1. Purphoros's CDA checks if devotion ≥ 5.
  Firedrinker Satyr ({R}): +1 devotion. Running total: 2.
  Fanatic of Mogis ({3}{R}{R}): +2 devotion. Running total: 4.
  Nykthos, Shrine to Nyx: +0 (no mana cost). Running total: 4.
Devotion to red = 4. Below 5. Purphoros is NOT a creature. Can't attack.
But: "Whenever another creature enters under your control, Purphoros deals 2 damage to each opponent."
This trigger still fires — it's not a creature ability, it's just the card's ability (the card is a permanent, and abilities work even when not a creature).

Play: cast Dragon Fodder ({1}{R}) → create two 1/1 Goblin tokens.
  Spell #1 this turn: a red instant/sorcery. Doesn't directly change devotion (tokens don't have mana costs that add devotion, but they don't have mana costs at all).
  Wait: the Dragon Fodder SPELL has {1}{R}. But Purphoros's trigger checks creature ENTERING, not mana costs of spells.
  Two 1/1 Goblin tokens enter: Purphoros trigger fires twice (2 damage to each opponent each time = 4 damage total).
Now cast Stormbreath Dragon ({2}{R}{R}): +2 devotion. Running total: 6.
  Devotion to red is now 6. CDA condition: devotion < 5? No: 6 ≥ 5.
  Purphoros IS now a creature (CDA says "isn't a creature" only when devotion < 5 — now false).
  Purphoros becomes 6/5 creature.
  Also: Stormbreath enters → Purphoros trigger → 2 damage to each opponent (they're at 16 life now).
Next turn: Purphoros can attack as a 6/5 with protection from white.

**Example 2 — Tarmogoyf as Continuously-Updating CDA:**
Board: Tarmogoyf ({1}{G}) on battlefield. All graveyards empty.
Tarmogoyf P/T: P = 0 card types in GYs, T = 0 + 1 = 1. Currently 0/1.
Opponent casts Faithless Looting (sorcery), discards two land cards.
GY now contains: Faithless Looting (sorcery), Land card, Land card.
Card types in all GYs: Sorcery (from Looting), Land (from discards). 2 types.
Tarmogoyf: P = 2, T = 3. Now 2/3.
You cast Thoughtseize ({B}), seeing opponent's hand. Thoughtseize goes to GY.
GY contains: Faithless Looting (sorcery), Land, Land, Thoughtseize (sorcery). 2 types still.
Tarmogoyf: still 2/3 (no new card TYPE added).
You cast Tarmogoyf (wait: it's already in play in this example).
Opponent casts Snapcaster Mage (creature, enters battlefield, then GY when Snapcaster dies):
  Snapcaster is a creature card. Goes on battlefield.
  If Snapcaster dies to blocking: goes to GY as a creature card.
  GY now: sorceries + lands + creature. 3 types. Tarmogoyf: 3/4.
Opponent plays a Mountain: land enters GY? No: playing a land doesn't put it in GY.
But: opponent uses fetch land, searches and sacrifices: fetch goes to GY.
  Fetch is a land card. If "Land" type wasn't in GY yet: adds the Land type.
  But we already had lands. Stays at 3 types.
If an artifact enters GY: 4 types. Tarmogoyf 4/5.
At 5 card types in GYs: Tarmogoyf 5/6.

## Commonly Confused With
- **P328 (Mana Types / Color Identity)** — Color identity (for Commander deckbuilding) includes mana symbols in RULES TEXT. Devotion counts mana symbols in MANA COSTS ONLY. These are separate rules: a card with {R} in an activated ability cost counts for both color identity AND devotion.
- **P313 (X Spells)** — X spells' MV with X=0 in hand: Tarmogoyf-like CDAs have MV equal to mana cost (not P/T). X spell in hand has MV = mana cost symbols without X (since X=0 outside stack).
- **P004 (Layer System)** — CDAs apply first within their layer (6 for types, 7a for P/T). Understanding the layer order is essential for God creature-status interactions with effects that also change types.
- **P312 (Legendary Rule)** — Gods are legendary. If you get a second copy of Purphoros: legend rule fires (SBA). Choose which to keep. The type-conditional ability doesn't affect the legend rule (the object's name is still Purphoros whether or not it's a creature).
