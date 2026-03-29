---
id: p454
name: Addendum, Adamant, and Spell Mastery — Main-Phase Cast, Same-Color Three-Mana, and GY Instant/Sorcery Count Conditions
category: costs
cr_refs: [207.2c, 500.1, 601.2, 604.1, 703.4, 300.1]
tags: addendum, adamant, spell-mastery, ability-word, main-phase-condition, same-color-mana, graveyard-instant-sorcery, cast-condition, ravnica-allegiance, throne-of-eldraine, magic-origins
created: 2026-03-29
examples_count: 8
---

# P454 — Addendum, Adamant, and Spell Mastery — Main-Phase Cast, Same-Color Three-Mana, and GY Instant/Sorcery Count Conditions

## Abstract

Three ability words (CR 207.2c) create conditional bonuses based on *how* a spell is cast or what's in your graveyard at the time of casting. **Addendum** (Ravnica Allegiance) triggers an enhanced effect if the spell is cast during your main phase; **Adamant** (Throne of Eldraine) triggers an enhanced effect if at least three mana of the same color was spent to cast the spell; and **Spell Mastery** (Magic Origins) provides a bonus if two or more instant and/or sorcery cards are in your graveyard at the time the spell resolves. All three are pure ability words with no CR entries — their mechanics come entirely from the card text.

## The Definitive Rules

### Ability Words (CR 207.2c)
Addendum, Adamant, and Spell Mastery are ability words — italicized grouping labels with no individual CR rules. The actual mechanic is in the card's text.

### Addendum — Cast During Main Phase
Addendum text pattern: *"If you cast this spell during your main phase, [additional effect]."*

**CR 500.1**: "A turn consists of five phases, in this order: beginning, precombat main, combat, postcombat main, and ending."

Both precombat main phase and postcombat main phase qualify as "your main phase." The condition does NOT require the stack to be empty — only that the spell was cast during the main phase.

A player with Flash can cast an addendum spell at any time they have priority. If they cast it during an opponent's turn, addendum doesn't apply. If they cast it during their own main phase (even in response to a spell), addendum applies.

### Adamant — Three or More Same-Color Mana Spent
Adamant text pattern: *"If at least three mana of the same color was spent to cast this spell, [effect]."*

The condition checks the **mana actually spent** during casting (step 601.2f), not the mana cost printed on the card. Hybrid mana symbols paid as a specific color count for that color.

**CR 601.2f**: "The player determines the total cost of the spell." The payment made matters.

If a cost reduction effect reduces the spell's cost below 3 mana of a given color, adamant for that color may fail. But if you pay {W}{W}{W} plus other mana for a spell that costs {3}{W}, adamant (white) is satisfied.

### Spell Mastery — Two+ Instant/Sorcery Cards in GY
Spell Mastery text pattern: *"If there are two or more instant and/or sorcery cards in your graveyard, [effect]."*

The condition checks **card type of cards in your graveyard at the time of resolution** (not at casting time). Instant and sorcery *cards* — not tokens, not permanents that happen to have been instants/sorceries.

This is a static condition checked at resolution. If the graveyard count drops below 2 between casting and resolution, spell mastery fails.

## The Pattern

```
ADDENDUM pattern:
Check: Is this spell being cast during the active player's main phase?
  → Main phase = precombat main OR postcombat main phase of your own turn
  → YES if: you cast during main phase 1 or 2 of YOUR turn
  → NO if: you cast during opponent's turn, during combat, during beginning/ending phases
  → Flash + addendum: if you have flash, casting during your own main phase triggers addendum
  → Condition is checked at cast time (when the spell is put on the stack)
  → Responding to a spell/ability during your own main phase: you can still cast addendum spells

ADAMANT pattern:
Check: Was at least three mana of the same color spent to cast this?
  → Count mana of each color actually paid in step 601.2f
  → Hybrid: {W/U} paid as White counts as 1 White mana
  → Phyrexian: {W/P} paid with 2 life counts as nothing (life was paid, not mana)
  → {W/P} paid with {W}: counts as 1 White mana
  → Cost reduction: if White costs reduced from 3 to 1, you only pay 1 White — not adamant
  → Multiple colors can each satisfy their own adamant condition independently
    (a card with two adamant conditions could satisfy both if you pay 3W and 3U)

SPELL MASTERY pattern:
Check: Are there 2+ instant cards and/or sorcery cards in your graveyard right now?
  → Checked at RESOLUTION (not at casting time)
  → Cards only — tokens don't have card types in graveyards
  → An instant/sorcery with flashback that was exiled: no longer in GY, doesn't count
  → A counterspelled instant that went to GY: counts (it's a card in the GY)
  → GY manipulation between cast and resolve can break the condition
```

## Definitive Conclusions

**Addendum:**
- Addendum works during BOTH main phases (precombat and postcombat). A common misconception is that it requires precombat main.
- You cannot cast the spell during your upkeep or draw step and get addendum — those are not main phases.
- If you have flash and cast during your own main phase in response to another spell, addendum applies — you're still in your main phase.
- Addendum checks the CURRENT phase at the moment of casting. It's not affected by what happens between casting and resolution.
- Example: *Depose // Deploy* (the Deploy half has addendum): cast it during your main phase to get all three effects instead of just two.
- Example: *Sphinx's Insight*: "Draw two cards. Addendum — If you cast this spell during your main phase, you also gain 2 life." Cast during combat = 2 cards only. Cast during your main phase = 2 cards + 2 life.

**Adamant:**
- Adamant checks what mana was ACTUALLY SPENT — this is locked in at casting time (when you pay costs).
- Convoke or Improvise reducing the effective mana paid can prevent adamant. If you use Convoke to pay 2 of the 3 required White, and only actually spend 1 White mana, adamant (white) is NOT satisfied.
- Cost reduction effects (Goblin Electromancer, etc.) that reduce the generic portion of a spell's cost don't affect adamant unless they reduce the colored portion.
- Key cards: *Lonesome Unicorn* ("Adamant — If at least three white mana was spent to cast this spell, put a +1/+1 counter on Lonesome Unicorn"), *Torbran, Thane of Red Fell* (creature, but the adamant pattern applies similarly to his domain).

**Spell Mastery:**
- Checked at resolution, not casting. If your opponent has Surgical Extraction in hand and targets your instants in response to your Spell Mastery spell, they can potentially break the condition.
- Key distinction from threshold (P224): threshold counts all 7+ cards in the GY; spell mastery counts specifically instant and sorcery *cards*, and requires only 2.
- A spell that was countered and went to the GY counts for spell mastery (it's an instant/sorcery card in the GY).
- Key cards: *Fiery Conclusion* (Spell Mastery: deals 5 damage instead of 2), *Harbinger of the Tides* (Spell Mastery: return target tapped creature an opponent controls to its owner's hand).

## Canonical Examples

**Addendum:**
- *Emergency Powers* (Ravnica Allegiance): "Each player shuffles their hand and graveyard into their library, then draws seven cards. Addendum — If you cast this spell during your main phase, you may put a permanent card from your hand onto the battlefield." Cast at opponent's end step: each player draws 7. Cast during your main phase: draw 7 AND put a permanent into play.

**Adamant:**
- *Emry, Lurker of the Loch* doesn't have adamant but illustrates the mana-paid concept. A true adamant example: *Blacklance Paragon* ("Flash. Adamant — If at least three black mana was spent to cast Blacklance Paragon, it enters the battlefield with a deathtouch counter and a lifelink counter on it.") You pay {3}{B}{B}{B}: three black mana spent = adamant satisfied.

**Spell Mastery:**
- Graveyard has 2 instants: *Opt* and *Fatal Push*. You cast *Fiery Conclusion* targeting a creature for 2 damage. Spell mastery: 2+ instant/sorcery cards in GY → deals 5 damage instead. Opponent casts a counterspell in response and you counter THEIR counterspell — 3 instant/sorcery cards now in GY. Still satisfied.

## Commonly Confused With

- **P060** (Foretell) — foretell enables casting on "opponent's turn" but addendum won't apply then even with flash
- **P049** (Kicker) — kicker is an optional additional cost paid at cast time; adamant checks mana spent (similar timing) but is a condition on the effect, not a cost
- **P224** (Threshold/Metalcraft/Delirium) — spell mastery is a subset of the "GY card count condition" pattern; threshold counts all 7 cards, spell mastery counts instant/sorcery specifically
- **P080** (Spectacle) — spectacle is a conditional alternative cost; addendum is a conditional additional effect (not a cost change)
