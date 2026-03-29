---
id: p357
name: Companion — Out-of-Game Setup, Deckbuilding Constraints, and the {3} Special Action
category: zones
cr_refs: [702.139a, 702.139b, 702.139c, 702.139d, 103.2b, 116.2g]
tags: [companion, out-of-game, deckbuilding-constraint, Lurrus, Yorion, Obosh, Umori, Kaheera, Jegantha, Gyruda, special-action, Commander-companion, singleton, companion-errata, sideboard-companion, main-phase-only]
created: 2026-03-29
examples_count: 2
---

# P357 — Companion — Out-of-Game Setup, Deckbuilding Constraints, and the {3} Special Action

## Abstract
**Companion** (702.139a) is a keyword that functions **outside the game** — before the game begins, a player may reveal one card they own from outside the game as their companion, provided their **starting deck** fulfills the companion's condition (103.2b). Once per game, the player may pay **{3}** as a special action (no stack, sorcery speed, main phase only) to put the companion card into their hand (116.2g). After being put into the hand, the companion enters the game normally and can be cast from the hand (702.139c). Companions are not sideboard cards — they're a separate out-of-game designation. The deckbuilding constraint is checked against the **starting deck** (after sideboard removal), not the in-game library state. A critical historical note: companions were errata'd — they originally could be cast from outside the game for free; now they require the {3} payment to first enter your hand.

## The Definitive Rules

**CR 702.139a** (verbatim): *"Companion is a keyword ability that functions outside the game. It's written as 'Companion—[Condition].' Before the game begins, you may reveal one card you own from outside the game with a companion ability whose condition is fulfilled by your starting deck. Once during the game, any time you have priority and the stack is empty, but only during a main phase of your turn, you may pay {3} and put that card into your hand. This is a special action that doesn't use the stack. This is a change from previous rules."*

**CR 103.2b** (verbatim): *"If any players wish to reveal a card with a companion ability that they own from outside the game, they may do so. A player may reveal no more than one card this way, and they may do so only if their deck fulfills the condition of that card's companion ability. The revealed card remains outside the game."*

**CR 702.139b** (verbatim): *"If a companion ability refers to your starting deck, it refers to your deck after you've set aside any sideboard cards. In a Commander game, this is also before you've set aside your commander."*

**CR 702.139c** (verbatim): *"Once you take the special action and put the card with companion into your hand, it remains in the game until the game ends."*

## The Pattern

```
COMPANION SETUP (103.2b, 702.139a):
  BEFORE GAME BEGINS:
    1. After decks are cut/shuffled, but before mulligans.
    2. Any player who has a card with companion ability that they own from outside the game:
         May reveal it if their starting deck fulfills the companion's condition.
         "Starting deck" = your deck after sideboards are set aside (702.139b).
         In Commander: after setting aside the commander.
    3. You may reveal at most ONE companion.
    4. The companion stays outside the game — it doesn't go into the library or command zone.
       (In Commander: this is an exception where outside-the-game cards can enter — 702.139d.)

  DECKBUILDING CONDITIONS:
    Each companion has a specific deckbuilding condition. Examples:
    Lurrus of the Dream-Den ({1}{W/B}{W/B}): "Companion — Each permanent card in your starting deck
      has mana value 2 or less."
      Your entire deck (every permanent card): each must have mana value ≤ 2.
      Spells/instants/sorceries: check their mana value. Creatures/artifacts/enchantments: same.
    Yorion, Sky Nomad ({3}{W}{U}): "Companion — Your starting deck contains at least 20 cards more
      than the minimum deck size."
      Standard minimum: 60 cards. So your deck must have at least 80 cards.
      Commander minimum: 100 cards. So your commander deck must have at least 120 cards.
    Obosh, the Preypiercer ({3}{B/R}{B/R}): "Companion — Each nonland card in your starting deck
      with a mana value has an odd mana value."
      All nonland cards: odd mana values only (1, 3, 5, 7, etc.).
    Jegantha, the Wellspring ({4}{R/G}): "Companion — No card in your starting deck has more than
      one of the same mana symbol in its mana cost."
      Cards with {U}{U} or {G}{G}{G} in their cost: NOT allowed. Cards with hybrid: check each symbol.
    Kaheera, the Orphanguard ({2}{G/W}{G/W}): "Companion — Each non-Human creature card in your
      starting deck is a Beast, Elemental, Cat, Nightmare, or Dinosaur."
      All non-Human creatures in your deck: must be one of those creature types.
      Human creatures: no restriction. Spells/artifacts: no restriction.

  WHAT "STARTING DECK" MEANS:
    After sideboards are removed (702.139b). Before the game begins.
    In Limited: the deck you registered, minus the sideboard portion.
    In Constructed: main deck (60-card minimum), not the 15-card sideboard.
    The condition is checked ONCE at game start, not throughout the game.
    If your deck has a card that violates the condition but you didn't notice: companion is invalid.
      In official play: tournament judges handle this as a deck check violation.

USING YOUR COMPANION (702.139a, 116.2g):
  ONCE PER GAME:
    You may put your companion into your hand once per game.
    Pay {3} as a special action.
    Special action: no stack, no response window. Happens immediately.
    Requirements: you have priority, stack is empty, it's your main phase.
    SORCERY SPEED: can't do this during upkeep, combat, opponent's turn.
  AFTER ENTERING HAND:
    The card is now in your hand. It's "in the game" (702.139c).
    You can cast it normally from your hand for its normal mana cost.
    You can also cast it for alternative costs (escape, kicker, etc.) from your hand.
    Once in the game, it behaves like any other card in your hand.
    If discarded from hand: goes to your graveyard (it's in the game now).
    If it goes to the GY and dies on the battlefield: it stays in the game's GY.
  CASTING FROM HAND:
    After paying {3} to put it in hand: still need to cast it for its mana cost.
    {3} special action ≠ casting the companion. Two separate actions.
    {3} puts it in hand. Then on a subsequent turn (or same turn if you have enough mana):
      Cast it from your hand normally.
  PROTECTION FROM OPPONENTS:
    The companion is outside the game until you pay {3}.
    Opponents can't target it (it's not in any game zone).
    Cards that affect "cards in your hand" don't affect it while it's outside the game.
    After paying {3}: it's in your hand. Opponents can discard it with effects ("target player discards").

COMPANION IN COMMANDER:
  Companions can be used in Commander (702.139d: "Cards can enter Commander games from outside
    the game via the companion special action").
  The Commander deck condition is checked against the 100-card deck + commander = starting deck.
  But the condition checks the deck AFTER setting aside the commander (702.139b).
  So: Lurrus in Commander checks all permanent cards in the 99-card library for MV ≤ 2.
  You'd have to run a Commander with MV ≤ 2 AND a 99-card deck with only MV ≤ 2 permanents.
  Very restrictive but possible (e.g., Lurrus as commander with companions Lurrus AND another companion?
    No: you can reveal at most ONE companion. You can't have multiple companions.)
  Some competitive Commander players use companions as an additional resource for specific combo lines.

HISTORICAL NOTE — ERRATA:
  Original companion rule: you could cast your companion directly from outside the game as if
    it were in your hand. No {3} payment required.
  This was extremely powerful: guaranteed access to a specific card every game was like a free
    "8th card" in hand with no cost. Companions warped formats severely.
  Errata fix (summer 2020): added the {3} payment and "put it into your hand" step.
  Now: you pay {3} to put it in hand FIRST, then cast it for its mana cost.
  This means: at minimum, you spend {3} + mana cost to get your companion onto the battlefield.
  Lurrus ({1}{W/B}{W/B}): pays {3} to get in hand = {3} + {1}{W/B}{W/B} = total ~{5} to land.
  This made companions significantly weaker but still usable in decks built around them.
```

## Definitive Conclusions

- **Companions are revealed before the game begins from outside the game** — the deckbuilding condition must be met by the starting deck (main deck only, no sideboard).
- **Paying {3} is a sorcery-speed special action** — puts the companion into hand; this doesn't cast it; you still need to cast it from your hand for its mana cost.
- **After entering hand, the companion is in the game permanently** — it can be discarded, countered, killed, and doesn't return to outside-the-game status.
- **Only ONE companion per player per game** — you can't reveal multiple companions; maximum one.
- **Deckbuilding condition is checked at game start only** — if you draw into cards that "would violate" the condition during the game, that's irrelevant (you already satisfied it at start).
- **Companions function in Commander** — the 100-card singleton constraint adds to the companion's deckbuilding restriction, making most companions very restrictive in that format.

## Canonical Example
**Lurrus of the Dream-Den in Modern Reanimator:**
You build a Modern deck:
  Deckbuilding condition for Lurrus: "Each permanent card in your starting deck has mana value 2 or less."
  Your permanent cards: all creatures, artifacts, enchantments — each must be MV ≤ 2.
  Spells (instants/sorceries): no restriction.
  Example legal deck: 4x Young Pyromancer (1), 4x Arclight Phoenix (4?) — WAIT: Arclight Phoenix is MV 4.
  NOT LEGAL. Arclight Phoenix violates Lurrus's condition.
  Legal alternatives: 4x Soul-Scar Mage (1), 4x Monastery Swiftspear (1), 4x Thunderclap (sorcery, fine), etc.

Game start:
  Reveal Lurrus from outside the game. Lurrus stays outside (not in hand).
  Mulligan, keep 7 cards.

Turn 3:
  You have priority. Stack empty. Your main phase.
  Pay {3}: special action — Lurrus enters your hand. No stack, can't respond.
  Your hand now has 7 cards + Lurrus.

Turn 4 or 5:
  Cast Lurrus from hand for {1}{W/B}{W/B} (2 mana, hybrid).
  Lurrus enters: 3/2 lifelink.
  Lurrus's ability: "During each of your turns, you may cast one permanent spell with mana value 2 or less from your graveyard."
  Each turn: cast a cheap permanent from GY (e.g., a destroyed Soul-Scar Mage returns).
  Lurrus enables a reuse engine with your low-MV creatures.

**Example 2 — Yorion + 80-Card Deck:**
You decide to build a Standard deck with Yorion, Sky Nomad as companion.
Yorion's condition: "Your starting deck contains at least 20 cards more than the minimum deck size."
Standard minimum: 60 cards. Required: ≥ 80 cards.
You build an 80-card deck (or 81, 82, etc. — all legal as long as ≥ 80).

Game start:
  Reveal Yorion from outside the game.

Turn 6:
  Pay {3} (special action): Yorion enters your hand.
  Cast Yorion for {3}{W}{U} (MV 5).
  Yorion ETB: "When Yorion enters, exile any number of other nonland permanents you own and control.
    Return them to the battlefield at the beginning of the next end step."
  This "blinks" all your other permanents (Sagas reset to chapter 1, ETBs fire again, etc.).

Playing an 80-card deck means: less consistency (you see individual cards less often), but:
  A companion is like a free guaranteed card in your strategy.
  Yorion adds "free" card value on ETB.
  Tradeoff: slightly lower card density in exchange for the guaranteed Yorion access.
  In competitive formats, Yorion in 80-card shells became powerful because the ETB value
    outweighed the consistency loss from the extra 20 cards.

## Commonly Confused With
- **P349 (Monarch/Initiative/Emblems)** — Emblems also exist in a non-standard zone (command zone). But emblems are created during the game; companions are set up before the game. Companions enter the hand as a special action; emblems go to the command zone. Two different "out-of-game-ish" mechanics.
- **P330 (Commander Rules)** — Commanders are also outside the game initially (or more accurately, in the command zone). Companions in Commander are additionally outside the game until the {3} action, and the condition must still be met. You can have a companion AND a commander simultaneously.
- **P354 (Equipment/Auras)** — No direct connection, but Lurrus specifically allows casting permanents from the GY, and often applies to Equipment cards. Lurrus + Colossus Hammer (MV 1): use Hammer, creature dies, cast Hammer from GY next turn via Lurrus's ability.
- **P346 (Cycling/Kicker/Adventure)** — All alternate-cost mechanics. Companion's {3} payment is also a special action but not a spell cast — it just moves the card to hand. Companion is unique in being the only game mechanic where a card starts completely outside the game (not sideboard, not exile, not even a zone) and enters during play.
