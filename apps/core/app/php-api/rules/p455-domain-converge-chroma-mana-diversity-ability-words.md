---
id: p455
name: Domain, Converge, and Chroma — Basic Land Type Count, Colors-Spent Scaling, and Mana Symbol Counting
category: costs
cr_refs: [207.2c, 305.6, 601.2f, 300.1, 202.2, 613.4a]
tags: domain, converge, chroma, ability-word, basic-land-types, colors-of-mana-spent, mana-symbol-count, invasion, battle-for-zendikar, lorwyn, scaling
created: 2026-03-29
examples_count: 9
---

# P455 — Domain, Converge, and Chroma — Basic Land Type Count, Colors-Spent Scaling, and Mana Symbol Counting

## Abstract

Three ability words (CR 207.2c) scale effects based on mana diversity or land composition: **Domain** counts the number of basic land types among lands you control (maximum 5: Plains, Island, Swamp, Mountain, Forest); **Converge** scales based on how many colors of mana were actually spent to cast the spell; and **Chroma** counts specific colored mana symbols (usually in the mana costs of permanents you control). All three create non-obvious interactions: domain counts land *types*, not the number of lands with those types; converge checks *paid* mana (not available mana), so cost reduction can reduce the achievable count; and chroma counts printed mana symbols, including hybrid and Phyrexian symbols, in a specific way.

## The Definitive Rules

### Domain (CR 207.2c)
Domain text pattern: *"[Effect] for each basic land type among lands you control."*

**CR 305.6**: "The basic land types are Plains, Island, Swamp, Mountain, and Forest." There are exactly 5 basic land types.

Domain counts distinct types, not distinct lands. A Breeding Pool (Island, Forest) counts as both Island AND Forest for domain. Five basic land types = domain count of 5 (maximum).

### Converge (CR 207.2c)
Converge text pattern: *"[Effect] for each color of mana spent to cast this spell."* (Maximum 5 colors.)

**CR 601.2f**: When casting a spell, the player determines the total cost and pays it. The mana actually paid (including which colors) is what converge checks.

Key: converge checks the **mana spent during casting**, not the mana available. If cost reduction reduces a spell to {0}, you spend 0 mana of 0 colors = converge of 0 (unless you choose to spend floating mana, but you can't pay more than the cost requires).

### Chroma (CR 207.2c)
Chroma text pattern: *"[Effect with a variable equal to] the number of [color] mana symbols in the mana costs of permanents you control."*

This counts the printed colored mana symbols (pip symbols) in mana costs. A card costing {R}{R} contributes 2 red symbols. Hybrid symbols like {R/W} count for the color(s) they can be paid as — in Magic's rules, hybrid symbols are of both colors. Colorless symbols ({C}) and generic symbols ({1}, {2}, etc.) contribute no count.

**CR 202.2**: "Mana cost" appears in the upper right of a card. The symbols within it are what chroma counts.

## The Pattern

```
DOMAIN pattern:
Count: How many distinct basic land types are among lands I control?
  → Plains, Island, Swamp, Mountain, Forest — each type either present or not
  → Maximum 5 (one for each type)
  → Dual lands/shock lands with two types: count for BOTH types
    Breeding Pool = Island + Forest = 2 basic land types contributed
    Sacred Foundry = Mountain + Plains = 2 basic land types contributed
  → Basic lands: Forest = 1 Forest type (basic supertype doesn't matter, type does)
  → Fetch land sacrifice: the fetch land leaves; the fetched basic land is now in play
  → Blood Moon: turns nonbasic lands into Mountains (type change, layer 4)
    → Domain after Blood Moon: only Mountain type exists for nonbasics → big reduction
  → Urborg, Tomb of Yawgmoth: "each land is a Swamp in addition to its other types"
    → Domain: all your lands are now also Swamps, so Swamp type is guaranteed

CONVERGE pattern:
Count: How many distinct colors of mana were actually paid when casting this spell?
  → Maximum 5 colors
  → Hybrid mana paid as a specific color: counts for that color
  → Phyrexian mana paid with life: no color counted
  → Phyrexian mana paid with colored mana: counts for that color
  → Cost reduction reducing colored mana: if you no longer have to pay it, it's not spent
  → Free cast via Cascade, etc.: you spend 0 mana → converge = 0
  → Convoke tapping a creature: the creature's color identity is NOT counted;
    convoke substitutes generic mana only (the mana paid via convoke has no color)
  → Improvise: same as Convoke — the tapped artifact doesn't add a color to converge

CHROMA pattern:
Count: Specific colored mana symbol pips in mana costs of permanents you control
  → Count each symbol: {R}{R} = 2 red symbols
  → Hybrid symbols {R/W}: counted for both colors (or just the relevant one per card)
  → Colorless {C} and generic {1}{2} etc.: not counted
  → Token permanents: tokens typically have no mana cost; do NOT contribute to chroma
  → Face-down morphs: their mana cost is hidden but they have a mana cost;
    for chroma purposes, the actual hidden mana cost is used (copiable values include mana cost)
  → Actually: for chroma, the PRINTED mana cost of visible permanents is counted
    (face-down permanents' chroma contribution depends on card text — usually the actual cost)
```

## Definitive Conclusions

**Domain:**
- Domain counts types, not cards. You can have 5 basic Forests but only Forest type = domain count of 1 for Forest.
- Dual lands that count as multiple types (Breeding Pool = Island/Forest) contribute both types, so you can reach domain 5 with only 5 dual lands (each contributing 2 types) as long as you cover all 5 types across them.
- Blood Moon wrecks domain strategies: after Blood Moon (Layer 4 type change), all your nonbasic lands lose their subtypes and become Mountains. Basic lands keep their types. A deck with only nonbasics goes from domain 5 to domain 1 (only Mountain).
- Urborg, Tomb of Yawgmoth makes all lands Swamps in addition to their other types — so all your lands guarantee the Swamp type, boosting domain to at least 1 (and usually keeping everything else too).
- The maximum possible domain is 5. A spell that says "domain — this spell deals X damage, where X is the number of basic land types among lands you control" deals at most 5 damage.

**Converge:**
- Free casting effects (cascade, suspend, Sneak Attack) bypass paying mana costs entirely — converge = 0 for such casts.
- Convoke and Improvise reduce generic mana by tapping creatures/artifacts. The tapped permanents do NOT contribute a color to converge — only the mana actually paid from your mana pool.
- You CAN strategically use different color sources to maximize converge. If you could pay {3} generically but instead pay {W}{U}{B}{R} to satisfy it, you spent 4 colors = converge of 4.
- Converge checks after the Phyrexian-mana life payments. {W/P} paid with life = 0 white mana was spent for converge.

**Chroma:**
- Chroma is an older mechanic primarily from Lorwyn/Shadowmoor. It appears in less modern sets than domain/converge.
- Token permanents (which typically have no mana cost) don't contribute to chroma counts.
- The most commonly confused aspect: chroma counts symbols on permanents YOU CONTROL, not just permanents of that color. A white permanent with {W}{W}{W} contributes 3 white symbols.
- Multiple instances of chroma on a single card are rare, but each would count separately.

## Canonical Examples

**Domain:**
- *Tribal Flames* (Invasion): "Domain — Tribal Flames deals X damage to any target, where X is the number of basic land types among lands you control." With all 5 types: 5 damage for {1}{R}. A staple in "5-color aggro" or "domain zoo" decks.
- *Lay of the Land* (Invasion): "Domain — Search your library for a basic land card and reveal it. If you control a land of each basic land type, you may put it onto the battlefield tapped instead. Otherwise, put it into your hand."
- *Nishoba Brawler* (Modern Horizons 2): "Domain — Nishoba Brawler's power is equal to the number of basic land types among lands you control." A CDA-powered creature.

**Converge:**
- *Painful Truths* (Battle for Zendikar): "Converge — You draw X cards and lose X life, where X is the number of colors of mana spent to cast Painful Truths." Pay {W}{U}{B} = 3 colors = draw 3, lose 3.
- *Radiant Flames* (Battle for Zendikar): "Converge — Radiant Flames deals X damage to each creature, where X is the number of colors of mana spent to cast Radiant Flames." Pay {R}{G}{W} = 3 colors = board wipe at 3 damage.

**Chroma:**
- *Primalcrux* (Eventide): "Chroma — Primalcrux's power and toughness are each equal to the number of green mana symbols in the mana costs of permanents you control." A deck full of mono-green permanents with many {G} symbols can make this an enormous creature.
- *Phosphorescent Feast* (Eventide): "Chroma — You gain life equal to the number of green mana symbols among the mana costs of permanents you control."

## Commonly Confused With

- **P350** (Land Types/Fetch Lands) — land types are also relevant to domain; Blood Moon's type-changing effect dramatically affects domain
- **P328** (Mana System/Color Identity) — chroma counts mana symbols; color identity (for Commander) also involves mana symbols but is a different calculation
- **P329** (Casting Costs) — converge checks mana actually paid during casting, subject to cost reduction, alternatives, etc.
- **P219** (Devotion) — devotion counts colored mana symbols in permanents you control, similar to chroma; the difference is devotion counts symbols of a specific color while chroma is named after the color being checked
