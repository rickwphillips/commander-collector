---
id: p260
name: Jump-Start, Ascend, and Assist — Ixalan Block Mechanics
category: costs
cr_refs: [702.131a, 702.131b, 702.131c, 702.132a, 702.133a]
tags: [jump-start, ascend, assist, city-blessing, card-discard, multiplayer, Rivals-of-Ixalan, Dominaria, Chemister-Insight, Brass-Squall, Timestream-Navigator]
created: 2026-03-28
examples_count: 2
---

# P260 — Jump-Start, Ascend, and Assist — Ixalan Block Mechanics

## Abstract
Three mechanics from the Ixalan/Rivals of Ixalan era. **Jump-Start**: cast an instant/sorcery from the graveyard by discarding a card as an additional cost — then exile it. Similar to Flashback but the cost is always "discard a card" plus the jump-start mana cost. **Ascend**: if you control 10 or more permanents, you get "the city's blessing" for the rest of the game — a persistent designation that unlocks additional abilities. **Assist**: another player may help pay the generic mana portion of a spell's cost — a cooperative multiplayer mechanic.

## The Definitive Rules

**CR 702.133a** (verbatim): *"Jump-start appears on some instants and sorceries. It represents two static abilities: one that functions while the card is in a player's graveyard and another that functions while the card is on the stack. 'Jump-start' means 'You may cast this card from your graveyard if the resulting spell is an instant or sorcery spell by discarding a card as an additional cost to cast it' and 'If this spell was cast using its jump-start ability, exile this card instead of putting it anywhere else any time it would leave the stack.'"*

**CR 702.131a** (verbatim): *"Ascend on an instant or sorcery spell represents a spell ability. It means 'If you control ten or more permanents and you don't have the city's blessing, you get the city's blessing for the rest of the game.'"*

**CR 702.131b** (verbatim): *"Ascend on a permanent represents a static ability. It means 'Any time you control ten or more permanents and you don't have the city's blessing, you get the city's blessing for the rest of the game.'"*

**CR 702.132a** (verbatim): *"Assist is a static ability that modifies the rules of paying for the spell with assist (see rules 601.2g-h). If the total cost to cast a spell with assist includes a generic mana component, before you activate mana abilities while casting it, you may choose another player. That player has a chance to activate mana abilities. Once that player chooses not to activate any more mana abilities, you have a chance to activate mana abilities. Before you begin to pay the total cost of the spell, the player you chose may pay for any amount of the generic mana in the spell's total cost."*

## The Pattern

```
JUMP-START:
  Activated ability from GRAVEYARD: cast this instant/sorcery from GY
  Additional cost: discard a card from hand
  After resolving (or leaving stack for any reason): the card is EXILED (not returned to GY)
  One use only: unlike Flashback (which has its own cost), Jump-Start always costs "discard a card"

  JUMP-START vs FLASHBACK:
    Flashback: cast from GY for a specific flashback cost (different from base mana cost)
    Jump-Start: cast from GY for the SAME mana cost + discard a card
    Both: exile after leaving the stack
    Jump-Start discard can be: lands, other cards you've already used (cycling their function)
    The discard is "free" in the sense that you choose what to discard (use it strategically)

  JUMP-START + MADNESS:
    Discarding for jump-start can trigger Madness on the discarded card
    Discard a Fiery Temper (madness {R}): Madness trigger fires → cast Fiery Temper for {R}
    Net: use jump-start AND get a bonus madness cast from the discard cost
    Discard for value: any discard-matters effect triggers on jump-start payment

  JUMP-START CARDS (Guilds of Ravnica):
    Chemister's Insight ({3}{U}, Instant — Jump-Start): "Draw two cards."
      Normal: {3}{U} for 2 draws. Jump-Start: {3}{U} + discard → draw 2 AGAIN from GY.
      Two casts: 4 cards drawn total for {3}{U}×2 + discard 1. Excellent card advantage.
    Radical Idea ({1}{U}, Instant — Jump-Start): "Draw a card."
      Cheap jump-start: {1}{U} + discard → draw 1 from GY. Useful filler.

ASCEND:
  Two variants: spell ability (on instants/sorceries) and static ability (on permanents)
  Spell ability: if you control 10+ permanents → get the city's blessing FOR THE REST OF THE GAME
  Static ability: any time you control 10+ permanents (continuously checked) → get city's blessing
  City's blessing: a permanent game designation ("you have the city's blessing for the rest of the game")
  Once gotten: you keep it even if your permanent count drops below 10

  CITY'S BLESSING USES:
    "As long as you have the city's blessing" abilities become active:
    Timestream Navigator ({1}{U}): Legendary 1/1, Ascend. "Pay {4}{U}{U}, {T}: Take an extra turn... Only if you have city's blessing."
    Treasure Map (transforms): if city's blessing → transforms to Treasure Cove (tap for {C}).
    Many permanents have bonus abilities that unlock with city's blessing.

  ASCEND + PERMANENTS:
    Count: lands, creatures, artifacts, enchantments, planeswalkers — all permanents count
    10 permanents is achievable in token strategies, ramp, or token-generating decks
    Ixalan tribal decks (Pirates, Dinosaurs, Merfolk, Vampires) can hit 10 quickly

  FAMOUS ASCEND CARDS:
    Twilight Prophet ({2}{B}{B}): 2/4 Flying, Ascend. "At beginning of your upkeep, if you have city's blessing, reveal top card, each opponent loses that card's MV in life, you gain that much."
      Ascend to city's blessing → each upkeep drain opponents based on top card's mana cost.
    Path of Discovery ({3}{G}): Enchantment, Ascend. "Whenever a creature enters, it explores. If you have city's blessing, put a +1/+1 counter on it instead."
      City's blessing turns ETB explores into guaranteed counters.

ASSIST:
  Multiplayer cooperative mechanic
  Another player may help pay the generic mana portion of your spell
  Process: before paying, choose a player → they activate mana abilities for the generic portion → you pay remaining
  The helping player's mana pays for generic mana only (not colored)
  This enables political deal-making: "I'll help you cast this if you help me next turn"

  ASSIST CARDS (Battlebond — 2-headed giant focused):
    Huddle Up ({1}{U}, Assist): "Assist. Each player draws two cards." — All players draw 2, assisted casting.
    Noble Banneret ({2}{W}, Assist): "Assist. Whenever another creature attacks, put a +1/+1 counter on it."
    Assist cards are mostly in the Battlebond and Conspiracy sets designed for multiplayer.

  ASSIST + COMMANDER:
    In Commander: you can use assist when any other player chooses to help
    Political: "I need help casting this 8-mana spell. Who will contribute mana to help defeat the threat on the board?"
    The contributing player loses resources for a diplomatic agreement.
```

## Definitive Conclusions

- **Jump-Start** casts from GY by discarding a card — then exiles. Always additional "discard" cost.
- **Discard for Jump-Start can trigger Madness** — pay jump-start + get the madness card for cheap.
- **Ascend** grants the city's blessing at 10+ permanents — a permanent state that unlocks abilities.
- **City's blessing is permanent** — dropping below 10 permanents doesn't remove it.
- **Assist** allows another player to help pay generic mana — political cooperative mechanic.

## Canonical Example
**Chemister's Insight Jump-Start Advantage:**
Opponent at 7 life. Hand is getting thin.
Cast Chemister's Insight ({3}{U}): draw 2 cards. Now 2 new cards in hand.
One card drawn was another Chemister's Insight (lucky draw!). But it's also in GY now.
Discard a land (no longer needed): activate Jump-Start on Chemister's Insight in GY.
Pay {3}{U} + discard land → draw 2 more cards.
Total: 4 cards drawn for {3}{U}×2 + 1 discard. Excellent grinding value in control.

**Example 2 — Timestream Navigator Ascend:**
Turn 9. You control 10 permanents (5 lands, 2 creatures, 3 artifacts). Ascend condition met.
Timestream Navigator enters: triggers its static Ascend → if you have 10+ permanents → city's blessing!
You now have the city's blessing permanently.
Next turn: activate Timestream Navigator ({4}{U}{U}, {T}): take an extra turn (only if city's blessing — condition met!).
You take an extra turn. Then: "Put Timestream Navigator on the bottom of your library."
Extra turn: activate other abilities, attack, then put Navigator on bottom.
In a deck that can get Navigator back (Brainstorm + shuffles): loop extra turns.

## Commonly Confused With
- **P211 (Flashback)** — Flashback has a specific printed flashback cost; Jump-Start always costs "discard a card" + original mana cost.
- **P163 (Retrace)** — Retrace casts from GY by discarding a land specifically; Jump-Start discards any card.
- **P255 (Suspend)** — Suspend exiles with counters for future free cast; Jump-Start is a single-use cast from GY.
