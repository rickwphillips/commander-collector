---
id: p169
name: Companion — Outside-the-Game Special Action
category: zones
cr_refs: [702.139a, 702.139b, 702.139c, 702.139d]
tags: [companion, outside-game, deck-building-restriction, special-action, Ikoria, Lurrus, Yorion, Jegantha]
created: 2026-03-28
examples_count: 2
---

# P169 — Companion — Outside-the-Game Special Action

## Abstract
Companion is a deck-building restriction mechanic: before the game begins, if you fulfill a companion card's condition with your starting deck, you may reveal that card from outside the game as your companion. Once per game, at any time you have priority and the stack is empty during your main phase, you may pay {3} to put the companion into your hand as a special action. This has been errata'd: the old rule (free, at any time) was replaced with the {3} special action to prevent degenerate speed. The companion condition is checked against your STARTING deck, not after sideboarding.

## The Definitive Rules

**CR 702.139a** (verbatim): *"Companion is a keyword ability that functions outside the game. It's written as 'Companion—[Condition].' Before the game begins, you may reveal one card you own from outside the game with a companion ability whose condition is fulfilled by your starting deck. (See rule 103.2b.) Once during the game, any time you have priority and the stack is empty, but only during a main phase of your turn, you may pay {3} and put that card into your hand. This is a special action that doesn't use the stack (see rule 116.2g). This is a change from previous rules."*

## The Pattern

```
COMPANION:
  Pre-game declaration: reveal companion from outside the game (sideboard/etc.)
  Condition: must be fulfilled by starting deck
  In-game: once per game, pay {3} at sorcery speed (main phase, stack empty) → put companion in hand

  COMPANION CONDITIONS (examples):
    Lurrus of the Dream-Den: "Each permanent card in your starting deck has mana value 2 or less"
      → Every permanent in your deck costs 2 or less
      → Extremely restrictive — banned in most formats
    Yorion, Sky Nomad: "Your starting deck contains at least 20 cards more than the minimum deck size"
      → 80-card minimum instead of 60 → more cards, but Yorion can blink them
    Jegantha, the Wellspring: "No two cards in your starting deck have the same mana symbol more than once among their mana costs"
      → Permissive: most decks with diverse mana symbols qualify
    Umori, the Collector: "Each card with a mana cost in your starting deck shares a card type"
      → All permanents, or all instants/sorceries, etc.

  COMPANION + {3} ERRATA:
    Originally: companion could be cast for free at any time
    April 2020 errata: now costs {3} to put into hand
    The {3} is a colorless special action payment — not a mana cost
    After putting companion in hand: can cast it normally on that or future turns

  COMPANION + COMMANDER:
    CR 702.139d: companion can enter Commander games from outside the game
    The companion counts as your 8th card? No — companions are from outside the game
    In Commander: companion card is NOT your commander but can be a companion alongside your commander
    The companion condition still applies to your 99-card deck

  COMPANION + DECK BUILDING:
    The condition is checked against your STARTING deck (before sideboarding)
    In Limited (Draft): companion conditions apply to your 40-card deck
    If you sideboard out a card that violated the condition: doesn't matter, condition was on starting deck

  COMPANION + REVEAL:
    You reveal the companion before the game begins
    Opponents know you have it (they can see it)
    If revealed, the companion effect is available throughout the game

  COMPANION CARDS:
    Lurrus (Lifelink, recurse 2-or-less permanents): most restricted
    Yorion (ETB blink all your nonland permanents): rewards 80-card decks
    Obosh (odd-CMC permanents deal double damage): restrictive but powerful payoff
    Kaheera (Cats/Elementals/Nightmares/Dinosaurs/Beasts go +1/+1): tribal payoff

  COMPANION + BANNING HISTORY:
    Lurrus: banned in Legacy, Modern, Vintage before and after errata
    Zirda: banned in Legacy
    Companion mechanic warped every format it touched
    Many companions banned due to power level of guaranteed 8th-card-in-hand advantage
```

## Definitive Conclusions

- **Companion requires a deck-building restriction** — condition checked against STARTING deck.
- **Pay {3} to put companion in hand** once per game (post-errata).
- **The {3} is a special action** — not a spell, no stack, no responses.
- **Companion cards have been banned** in most formats due to power level.
- **Yorion's 80-card companion** condition enables specific draw manipulation strategies.

## Canonical Example
**Lurrus of the Dream-Den (Companion — each permanent in starting deck has CMC ≤ 2):**
Deck: all lands + 1-2 CMC permanents only (cantrips, fetchlands, creatures).
Pre-game: reveal Lurrus as companion.
Turn 3: pay {3}, put Lurrus in hand. Cast Lurrus ({1}{W}{B}). ETB: nothing.
Lurrus ability: "During each of your turns, you may cast one permanent spell with mana value 2 or less from your graveyard."
Each turn: recur cheap permanents from graveyard. Lurrus was so efficient it was banned in Legacy, Modern, and restricted in Vintage.

**Example 2 — Yorion, Sky Nomad (Companion — starting deck 80+ cards):**
80-card deck with many ETB creatures and enchantments.
Yorion companion: put in hand for {3}. Cast Yorion ({3}{W}{U}).
ETB: exile all other nonland permanents you control, return them at end of step → all ETBs re-trigger.
Each Yorion enters: re-blink your entire board. Repeatable if Yorion dies and is recast.

## Commonly Confused With
- **P169 vs Commander** — Commander is the designated commander general in command zone. Companion is in the sideboard/outside game with a deck condition.
- **P131 (Impending)** — Impending enters with time counters and delays creature status. Companion delays entering the game entirely until you pay {3}.
- **P169 vs Wishes** — Wish effects let you grab cards from outside the game. Companion is a pre-game declaration, not a wish.
