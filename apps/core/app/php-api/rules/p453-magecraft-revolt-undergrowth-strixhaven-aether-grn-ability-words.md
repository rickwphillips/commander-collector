---
id: p453
name: Magecraft, Revolt, and Undergrowth — Cast-or-Copy Triggers, Permanent-Left Conditions, and Graveyard Creature Scaling
category: triggered
cr_refs: [207.2c, 603.2, 706.10, 400.7, 120.3, 700.4]
tags: magecraft, revolt, undergrowth, ability-word, cast-or-copy, permanent-left-battlefield, graveyard-scaling, strixhaven, aether-revolt, guilds-ravnica
created: 2026-03-29
examples_count: 8
---

# P453 — Magecraft, Revolt, and Undergrowth — Cast-or-Copy Triggers, Permanent-Left Conditions, and Graveyard Creature Scaling

## Abstract

Three ability words (CR 207.2c) create mechanics that differ critically from their lookalike cousins: **Magecraft** (Strixhaven) triggers "whenever you cast or copy an instant or sorcery spell" — the word "copy" is absent from prowess and similar effects, making magecraft trigger on Storm copies, Replicate copies, and Fork-created copies that don't "cast"; **Revolt** (Aether Revolt) creates conditions that check "if a permanent you controlled left the battlefield this turn" — a check that includes your own sacrifice effects, opponents exiling your permanents, and phasing; and **Undergrowth** (Guilds of Ravnica) scales effects based on the number of *creature cards* in your graveyard — meaning tokens (which cease to exist when they leave the battlefield) never count, but exiled creatures don't count either.

## The Definitive Rules

### Ability Words (CR 207.2c)
Magecraft, Revolt, and Undergrowth have no individual CR entries. All rules derive from the text on the cards.

### Magecraft — "Cast OR Copy" Distinction
Magecraft text pattern: *"Whenever you cast or copy an instant or sorcery spell, [effect]."*

The critical distinction from Prowess (702.108a) and similar "whenever you cast a noncreature spell":
- **Cast** = put the spell on the stack using the normal casting process (CR 601)
- **Copy** = use an ability to create a copy of a spell on the stack (CR 706.10). Copies are not cast.
  - Storm copies (CR 702.40a): "copy it for each spell cast before it this turn" — these are copies, not casts
  - Replicate copies: created by a triggered ability, not casting
  - Fork/Reverberate effect copies: create a copy of a spell on the stack — copy, not cast
  - Magecraft triggers on ALL of these; Prowess does NOT

**CR 706.10a verbatim:** *"A copy of a spell... becomes a new object..."*
**CR 706.10b** establishes that copying a spell on the stack creates a new spell object on the stack that isn't cast — it was created as a copy.

### Revolt — Permanent-Left Condition
Revolt text pattern: *"[Effect] if a permanent you controlled left the battlefield this turn."*

The condition tracks any permanent leaving the battlefield under your control during the current turn. This includes:
- Permanents you sacrificed (costs, effects)
- Permanents destroyed/exiled by opponents
- Permanents that phased out (exception: phasing is NOT a zone change — see below)
- Tokens that ceased to exist (tokens leave the battlefield when they go to another zone, triggering revolt)
- Fetch land activation (the land is sacrificed to the ability)

**CR 400.7**: Zone changes create new objects; the "left the battlefield" event still counts for Revolt.

**CR 702.26b**: Phasing causes the permanent's status to change but it doesn't change zones and doesn't trigger "leaves the battlefield" effects. Therefore phasing does NOT satisfy Revolt.

### Undergrowth — Creature CARDS in Graveyard
Undergrowth text pattern: *"[Effect scaled by] the number of creature cards in your graveyard" or "if [N] or more creature cards are in your graveyard."*

The key restriction: **creature CARDS** — not creature tokens. Tokens cease to exist when they leave the battlefield (CR 704.5d) and never exist in the graveyard. A creature token that "dies" is briefly in the graveyard before it ceases to exist, but by the time Undergrowth checks, it's gone.

Also: cards that are in EXILE are not in the graveyard. Undergrowth doesn't count exiled creatures.

## The Pattern

```
MAGECRAFT pattern:
Whenever ANY of these happen with an instant or sorcery:
  → You CAST one (put it on the stack via casting) → Magecraft triggers
  → You COPY one (any copy effect creates a copy on the stack) → Magecraft triggers
    - Storm spell creates N copies → N separate Magecraft triggers
    - Replicate paid N times → N separate Magecraft triggers
    - Fork resolves, creates a copy → 1 Magecraft trigger
    - Isochron Scepter imprint, cast from imprint → 1 Magecraft trigger
  → Compare: Prowess says "whenever you cast a noncreature spell" → Prowess does NOT trigger on copies

REVOLT pattern:
Check: "Did a permanent I controlled leave the battlefield this turn?"
  → YES if: you sacrificed something, opponent destroyed/exiled your permanent,
             token died (tokens do temporarily exist in GY during LTB), etc.
  → NO for: phasing (not a zone change), exiling (permanent went to exile, not "left" in a way that)...
    wait — exile IS leaving the battlefield. "Left the battlefield" = any zone change FROM the battlefield
  → Phasing out: does NOT satisfy revolt (permanent doesn't change zones)
  → Even if the permanent returned (blink): it "left the battlefield" between zones, so revolt IS satisfied
  → Fetch land: sacrifice the land to activate → land left battlefield → revolt satisfied

UNDERGROWTH pattern:
Count: creature CARDS in your graveyard only
  → Include: creature cards that died (went to GY), milled creature cards
  → Exclude: tokens (they cease to exist before Undergrowth resolves)
  → Exclude: exiled creature cards
  → Count checks at the time Undergrowth spell/ability resolves (or when permanent's static ability applies)
  → Opponent's Relic of Progenitus activating exiles all GY cards → count drops to 0
```

## Definitive Conclusions

**Magecraft:**
- A Strixhaven card with Magecraft and a Grapeshot with Storm 10: casting Grapeshot triggers Magecraft once (the cast), then 10 Storm copies trigger Magecraft 10 more times = 11 total Magecraft triggers.
- Magecraft triggers even if the instant/sorcery is countered (it was "cast" — cast happens as the spell is put on the stack per CR 601.2, not when it resolves).
- Magecraft triggers on copies you create via Thousand-Year Storm, Bonus Round, etc.
- Prowess (702.108) and Magecraft look similar but Prowess says "whenever you cast a noncreature spell" — copies don't trigger prowess. This is a crucial distinction for storm decks.
- The "cast OR copy" wording means Magecraft is essentially "triggers once for each instant/sorcery that appears on the stack from your actions," whether cast or copied.

**Revolt:**
- Revolt is satisfied immediately when a permanent leaves. If you have Revolt on an instant, you can sacrifice a creature in response to your own spell to satisfy revolt before it resolves.
- Revolt checks the current game state at the moment it matters (at casting if a casting restriction, at resolution if an intervening-if clause). Always read the specific card text.
- Fetchland sequence: Activate fetchland → fetchland leaves battlefield (revolt satisfied for that turn) → search. Revolt is available for spells cast after this point.
- Key cards: *Fatal Push* ("Revolt — If a permanent you controlled left the battlefield this turn, instead destroy that creature if it has mana value 4 or less."), *Renegade Rallier*, *Spire of Industry*.

**Undergrowth:**
- Creatures that were milled count. Creatures that were exiled directly do NOT count.
- If your opponent has Deathrite Shaman and exiles a creature card from your graveyard before you use Undergrowth, that card no longer counts.
- Undergrowth DOES count creatures returned from the graveyard by effects that later put them back — as long as they're in the GY at the time Undergrowth resolves.
- Multiple Undergrowth effects on different spells each check the graveyard at their own resolution time; the count can change between resolutions.
- Key cards: *Rhizome Lurcher*, *Izoni, Thousand-Eyed*, *Lotleth Giant*.

## Canonical Examples

**Magecraft:**
- *Prismari Command* + Magecraft creature in play: casting Prismari Command → 1 Magecraft trigger.
- *Grapeshot* in a deck with *Archmage Emeritus*: Cast Grapeshot (1 trigger), Storm creates 9 copies (9 triggers) = 10 total draws from Archmage Emeritus's Magecraft. This is a one-turn draw-10 engine.
- *Lorehold Apprentice*: "Magecraft — Whenever you cast or copy an instant or sorcery spell, create a 1/1 white and red Spirit creature token." In a storm deck, Magecraft creates tokens for every copy made.

**Revolt:**
- *Fatal Push* is the iconic Revolt card: base mode kills creatures with MV 2 or less; revolt mode kills creatures with MV 4 or less. Fetch + Fatal Push is a staple interaction: fetchland leaves → revolt active → Fatal Push destroys a 4-MV creature.
- *Servo Schematic*: "When Servo Schematic enters the battlefield or leaves the battlefield, create a 1/1 colorless Servo artifact creature token." The "leaves" trigger creates a token — and the token leaving later triggers revolt.

**Undergrowth:**
- *Izoni, Thousand-Eyed*: "When Izoni, Thousand-Eyed enters the battlefield, create X 1/1 black and green Insect creature tokens, where X is the number of creature cards in your graveyard." A deck with 6 creatures in the graveyard creates 6 Insects. The tokens themselves don't add to future Undergrowth counts when they die (tokens cease to exist in GY).
- *Lotleth Giant*: "When Lotleth Giant enters the battlefield, it deals X damage to target opponent, where X is the number of creature cards in your graveyard."

## Commonly Confused With

- **P071** (Prowess) — Prowess only triggers on "cast," NOT on copies; Magecraft triggers on both cast and copy
- **P336** (Storm and Cascade "Cast" Triggers) — Storm copies are NOT cast events; they trigger Magecraft but not Prowess
- **P016** (Phasing) — Phasing does NOT satisfy Revolt; the permanent doesn't change zones
- **P338** (Graveyard Recursion) — Undergrowth counts cards currently in the GY; returning creatures from the GY via reanimation removes them from the GY and reduces the Undergrowth count
- **P363** (Tokens) — Tokens that die cease to exist in the GY before most Undergrowth checks; tokens never count for Undergrowth
