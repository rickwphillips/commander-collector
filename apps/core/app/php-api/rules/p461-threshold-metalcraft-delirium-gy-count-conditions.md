---
id: p461
name: Threshold, Metalcraft, and Delirium — GY Seven-Card, Artifact Three-Count, and Four-Type Conditions
category: triggered
cr_refs: [207.2c, 700.4, 603.4, 305.6, 205.2, 700.5, 400.7]
tags: threshold, metalcraft, delirium, ability-word, graveyard-count, artifact-count, card-type-count, odyssey, scars-of-mirrodin, shadows-over-innistrad
created: 2026-03-29
examples_count: 8
---

# P461 — Threshold, Metalcraft, and Delirium — GY Seven-Card, Artifact Three-Count, and Four-Type Conditions

## Abstract

Three ability words (CR 207.2c) from different blocks unlock bonus effects based on counting things in a specific zone or on the battlefield: **Threshold** (Odyssey, ~2001) activates when you have seven or more cards in your graveyard; **Metalcraft** (Scars of Mirrodin, 2010) activates when you control three or more artifacts; and **Delirium** (Shadows over Innistrad, 2016) activates when you have four or more card types among cards in your graveyard. All three create non-obvious rulings around *what counts* (tokens vs. cards, card types vs. subtypes, artifacts on the stack vs. battlefield), *when the condition is checked* (cast vs. resolution, beginning of ability trigger vs. resolution), and *how graveyard hate disrupts the condition* mid-resolution.

## The Definitive Rules

### Ability Words (CR 207.2c)
Threshold, Metalcraft, and Delirium are ability words with no independent CR entries. The mechanic is entirely in the card text. Conditions are typically checked at resolution unless the card has an intervening-if trigger.

### Threshold — 7+ Cards in Your Graveyard
Threshold text pattern: *"[Effect]. Threshold — [Bonus effect] as long as seven or more cards are in your graveyard."*

Or conditional: *"Threshold — [Effect] if seven or more cards are in your graveyard."*

"Cards in your graveyard" means cards. Tokens are not cards (CR 110.5a: tokens aren't cards; rule 700.5 says "card" refers to the physical object in a zone). Tokens in the graveyard briefly exist then cease to exist via SBAs (CR 704.5d), but they're tokens, not cards. However, by the time threshold is checked, tokens are already gone from the GY.

### Metalcraft — 3+ Artifacts You Control
Metalcraft text pattern: *"[Effect]. Metalcraft — [Bonus effect] as long as you control three or more artifacts."*

"Artifacts you control" = artifacts on the battlefield under your control. Artifacts on the stack (being cast) or in other zones don't count. Artifact creatures count. Artifact tokens count (they're permanents, not cards, but they are artifacts on the battlefield — CR 110.5b).

### Delirium — 4+ Card Types in Your GY
Delirium text pattern: *"[Effect]. Delirium — [Bonus effect] if there are four or more card types among cards in your graveyard."*

**Card types** (CR 205.2): Artifact, Creature, Enchantment, Instant, Land, Planeswalker, Sorcery, Tribal, and Battle. There are 9 possible types. You need 4 or more distinct types represented.

**Subtypes and supertypes don't count**: "Legendary" is a supertype, not a card type. "Equipment" is an artifact subtype. A legendary equipment counts as one card type: Artifact. A legendary enchantment creature counts as two card types: Enchantment and Creature.

## The Pattern

```
THRESHOLD pattern:
Check: Does the affected player have 7+ cards in their GY right now?
  → Cards only — not tokens (tokens aren't cards per CR 110.5a/700.5)
  → Counted at the moment of check (usually resolution)
  → Opponent's GY manipulation (Scavenging Ooze, Surgical Extraction) can drop you below 7
    before the spell/ability resolves
  → Continuous threshold effects (static "as long as") re-check every time a card leaves/enters GY
  → GY size can fluctuate mid-turn (spells cast from GY reduce threshold count)

METALCRAFT pattern:
Check: Does the affected player control 3+ artifacts right now?
  → Battlefield only — artifacts on the stack, hand, GY don't count
  → Artifact tokens count (permanents on battlefield, just no card in GY)
  → Artifact-enchantment count (dual-type object counts as artifact for metalcraft)
  → Artifact creature count
  → Does NOT require nontokens — any artifacts count
  → Continuous metalcraft ("as long as you control 3 or more artifacts") triggers and
    reverts as artifacts enter/leave the battlefield
  → Opponent destroying your artifact in response to metalcraft-gated spell cast:
    if spell is already cast, metalcraft is checked at resolution, not at cast time
    → Destroying 1 of 3 artifacts before resolution → metalcraft fails

DELIRIUM pattern:
Check: Are there 4+ distinct card types among cards in the affected player's GY?
  → Counts CARD TYPES only (not subtypes/supertypes)
  → Legal card types: Artifact, Creature, Enchantment, Instant, Land, Planeswalker, Sorcery,
    Tribal, Battle (CR 205.2)
  → A single multitype card contributes multiple types:
    "Artifact Creature" → both Artifact and Creature count
    "Enchantment Creature" → both Enchantment and Creature count
    "Instant Sorcery" (Lessons, some DFCs) → both types count
  → Land cards in GY count (lands are cards with the Land card type)
  → What's hardest to get into GY: Lands (usually require discard/mill), Instants/Sorceries
    (easier), Creatures (die in combat), Artifacts/Enchantments (need destruction effects or
    discard to put in GY)
  → GY-type check is at resolution (for most delirium effects)
  → Delirium as a continuous static condition: re-checks each time a card leaves/enters GY
```

## Definitive Conclusions

**Threshold:**
- Cycling and discarding are common ways to rapidly fill your GY toward 7 cards. Dredge decks regularly achieve threshold by turn 2-3.
- Threshold is checked at resolution for triggered/spell effects. If opponent exiles 2 cards from your GY in response, you may fall below 7 and threshold fails.
- Static threshold abilities (e.g., "Werebear: This creature has {T}: Add {G}. Threshold — Werebear gets +3/+3") re-check continuously — if your GY drops below 7, the bonus immediately disappears.
- Cards used to pay escape, flashback, jump-start, delve, etc. are exiled FROM the GY, reducing your threshold count.

**Metalcraft:**
- Equipment attached to creatures still counts as artifacts you control. Unattached equipment counts too.
- Liquimetal Coating ("Target permanent becomes an artifact in addition to its other types until end of turn") can temporarily push you over 3 artifacts for metalcraft.
- Artifact tokens from Thopter Foundry or Servo creation count toward metalcraft — the condition is "artifacts you control," not "artifact cards."
- Tapping artifacts for mana (Mox Opal) doesn't remove them from "control" — tapped artifacts still count toward metalcraft.
- Mox Opal itself requires metalcraft to produce mana: "Metalcraft — {T}: Add one mana of any color. Activate only if you control three or more artifacts." If an opponent destroys an artifact in response to a mana activation, Mox Opal's activation was already on the stack but the mana won't be added (mana abilities don't use the stack — wait, actually mana abilities by CR 605.3 don't use the stack and can't be responded to. But Mox Opal's metalcraft condition is checked when the ability is activated, not as it resolves). Actually: Mox Opal's activated ability is a mana ability (produces mana, not a loyalty ability, no target). Mana abilities (CR 605.1) don't use the stack and resolve immediately. So the metalcraft check is made at activation time; if you have 3 artifacts when you activate, you get the mana.

**Delirium:**
- The most common 4-type combination: Creature (from creatures dying in combat), Instant (cast from hand), Sorcery (cast from hand), and Artifact or Enchantment (needs to be destroyed/discarded). Getting a Land into the GY requires Fetch Lands, discard effects, or land destruction.
- A single card can contribute multiple types: *Enchantment Creature* (contributes Enchantment + Creature), *Artifact Creature* (contributes Artifact + Creature). A single *Artifact Enchantment Creature* contributes three types.
- Grafdigger's Cage prevents casting from GY but doesn't affect what's in the GY for delirium counting — cards remain in the GY and count toward delirium even if Cage blocks their use.
- A card with no card type can't happen — every card has at least one type. But Tribal is rare and Battle is rare (Phyrexia: March of the Machine) — these are exotic types that can push delirium over 4.
- Delirium checks "among CARDS in your graveyard" — not tokens. When a token dies, it briefly enters the GY but SBA removes it. Even if somehow checked before SBAs (impossible in normal play), tokens aren't cards per CR 700.5.

## Canonical Examples

**Threshold:**
- *Werebear* (Odyssey): "Threshold — Werebear gets +3/+3 as long as seven or more cards are in your graveyard." The static bonus applies/disappears continuously as GY changes.
- *Mystic Sanctuary* (ELD): Not threshold, but similar counting — illustrates how GY manipulation matters.
- *Cabal Pit*: "{T}: Add {B}. This land deals 1 damage to you. Threshold — {B}, {T}, Sacrifice Cabal Pit: Target creature gets -2/-2 until end of turn. Activate only if there are seven or more cards in your graveyard." The threshold ability gives a weak but immediate -2/-2 debuff.

**Metalcraft:**
- *Mox Opal* (Scars): The iconic metalcraft card. "Metalcraft — {T}: Add one mana of any color. Activate only if you control three or more artifacts." Cornerstone of Modern/Vintage artifact decks; requires artifacts 1, 2, AND 3 before it taps for mana.
- *Tempered Steel* (Scars): "Artifact creatures you control get +2/+2." Note: Tempered Steel does NOT have Metalcraft — the +2/+2 bonus applies unconditionally as long as the enchantment is on the battlefield. It is a non-Metalcraft example of an artifact-pumping enchantment.

**Delirium:**
- *Traverse the Ulvenwald* (SoI): "Search your library for a basic land card, put it onto the battlefield tapped, then shuffle. Delirium — Search your library for a creature or land card instead." Crucial blue card effect that upgrades into a tutor for any creature.
- *Gnarlwood Dryad* (SoI): "Deathtouch. Delirium — Gnarlwood Dryad gets +2/+2 as long as there are four or more card types among cards in your graveyard." A 1/1 deathtouch that becomes a 3/3 deathtouch is a significant upgrade.
- *Ishkanah, Grafwidow* (SoI): "Delirium — When Ishkanah, Grafwidow enters the battlefield, if there are four or more card types among cards in your graveyard, create three 1/2 green Spider creature tokens with reach." Flagship delirium payoff.

## Commonly Confused With

- **P453** (Magecraft/Revolt/Undergrowth) — Undergrowth counts creature cards (any amount) in GY; Threshold counts all cards (7+); Delirium counts types (4+ types), not quantities
- **P455** (Domain/Converge/Chroma) — Domain counts basic land TYPES on battlefield; Delirium counts card TYPES in GY; both involve type-counting but in different zones
- **P051** (Dredge) — Dredge is a primary way to fill GY for Threshold/Delirium; self-mill strategies target all three conditions
- **P282** (Escape/Delve) — These exile GY cards as costs, which reduces Threshold count and can break Delirium if the exiled card was the only one of its type
