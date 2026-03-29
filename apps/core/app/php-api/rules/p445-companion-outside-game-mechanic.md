---
id: p445
name: Companion — Outside-the-Game Card, Paid-Into-Hand Special Action, and Deck Restrictions
category: costs
cr_refs: [702.139a, 702.139b, 702.139c, 702.139d, 116.2g, 103.2b]
tags: [companion, outside-game, special-action, deck-restriction, put-into-hand, sorcery-speed, Yorion, Lurrus, Kaheera, Keruga, Obosh, Umori, Zirda, Gyruda, Jegantha, companion-condition, starting-deck, Commander, sideboard, Ikoria]
created: 2026-03-29
examples_count: 2
---

# P445 — Companion — Outside-the-Game Card, Paid-Into-Hand Special Action, and Deck Restrictions

## Abstract
**Companion** (702.139) is a keyword that designates a card as a potential "extra card" that starts outside the game but can be paid {3} to put into your hand during your main phase. It is NOT a spell cast, NOT a mana ability, and NOT an activated ability that uses the stack — it is a **special action** (CR 116.2g) that cannot be countered, responded to, or prevented by effects that would stop casting spells from outside the game. Key non-obvious interactions: (1) **the companion condition is checked against your STARTING deck** (before mulligans and before the game begins), not against your current hand or graveyard; (2) **putting the companion into hand costs exactly {3} with no substitute** — improvise, convoke, and other cost-reduction mechanics don't apply (it's a special action, not casting a spell); (3) **once in hand, the companion is a completely normal card** — it can be discarded, countered when cast as a spell, tutored back from the GY, etc.; (4) **in Commander, the companion condition is checked against your 99-card deck** (not including the commander).

## The Definitive Rules

**CR 702.139a** (verbatim): *"Companion is a keyword ability that functions outside the game. It's written as 'Companion—[Condition].' Before the game begins, you may reveal one card you own from outside the game with a companion ability whose condition is fulfilled by your starting deck. Once during the game, any time you have priority and the stack is empty, but only during a main phase of your turn, you may pay {3} and put that card into your hand. This is a special action that doesn't use the stack (see rule 116.2g). This is a change from previous rules."*

**CR 102.2b** (verbatim): *"Before the game begins, you may reveal one card you own from outside the game with a companion ability whose condition is fulfilled by your starting deck."*

**CR 116.2g** (verbatim): *"A player who has chosen a companion may pay {3} to put that card from outside the game into their hand. A player may take this action any time they have priority and the stack is empty, but only during a main phase of their turn."*

## The Pattern

```
COMPANION SETUP (before the game):
  1. Look at your starting deck. Verify the companion condition is met.
  2. Reveal the companion card (from outside the game / sideboard).
  3. The companion is designated: it's now your "companion" for this game.
  4. The companion card starts the game outside the game.

  CONDITION CHECK TIMING:
    The condition is checked against your STARTING DECK (before mulligans).
    Mulligans don't affect whether the condition was satisfied.
    If you have cards from outside the game in your starting hand (e.g., Chaos Orb or
      similar unusual effects): the condition was already evaluated before those enter.
    In Commander: starting deck = your 99-card deck (after setting aside the commander).
    702.139b: "companion refers to your starting deck after setting aside sideboard cards.
      In Commander, also after setting aside your commander."

  ONE COMPANION PER GAME:
    You can only have one companion revealed.
    If you violate the condition (e.g., you lie about deck contents), that's a rules violation.
    Each player can independently have a companion.

PUTTING THE COMPANION INTO HAND:
  116.2g: "any time you have priority and the stack is empty, during a main phase of your turn"
  Pay {3}: companion goes from outside the game to your hand.
  This is a SPECIAL ACTION:
    - Doesn't use the stack
    - Can't be countered (no spells or activated abilities are on the stack)
    - Can't be responded to with instants (the action doesn't use the stack)
    - Can't be prevented by "you can't cast spells from outside the game" effects (it's NOT a cast)
    - "Once during the game" — you can only do this ONCE per game.
  Cost is EXACTLY {3}: no alternative costs, no cost reduction (not casting a spell; not an
    activated ability; improvise/convoke/cost reducers don't apply to special actions).
  The {3} must be colorless generic mana. No color requirements.

ONCE IN HAND, THE COMPANION IS NORMAL:
  702.139c: "Once you take the special action and put the card into your hand, it remains
    in the game until the game ends."
  After entering your hand: it's a normal card.
  You can cast it, discard it, exile it, have it countered, etc.
  If discarded or milled: it's in your GY, castable via GY recursion (Reanimate, etc.).
  If cast and countered: it goes to GY (or wherever countered spells go).
  If cast and destroyed: goes to GY. Can be recurred.
  KEY: you don't get to put it back "outside the game." Once in hand, it stays in the game.

CONDITION CHECKING AND EDGE CASES:
  YORION, SKY NOMAD: "starting deck contains at least 20 more than minimum deck size."
    Minimum deck size in Standard/Pioneer/Modern: 60. Yorion requires 80+ card deck.
    In Commander (minimum 100): Yorion requires 120+ card deck.
  LURRUS OF THE DREAM-DEN: "each permanent card in your starting deck has MV 2 or less."
    Every permanent card (not spells) must have MV ≤ 2.
    Non-permanent cards (instants, sorceries): no restriction from Lurrus's condition.
  KAHEERA, THE ORPHANGUARD: "each creature card in your starting deck is a Cat, Elemental,
    Nightmare, Dinosaur, or Beast card."
    Creature cards only (not artifact creatures that aren't those types, etc.).
  JEGANTHA, THE WELLSPRING: "no card in your starting deck has more than one of the same
    mana symbol in its mana cost."
    Affects spells with mana costs like {W}{W}, {U}{U}, {R}{R}, etc.
    Split cards: each half is checked separately (the combined mana cost in hand/library
    would have both symbols, but IIRC Jegantha checks the printed cost).

COMPANION IN COMMANDER:
  You can have a companion in Commander if it meets the condition AND the commander is legal
  with the companion. The commander's color identity still applies to deck building.
  The companion's color identity must be within your commander's color identity (standard
  deck building rule), but the companion starts outside the game — not in the command zone.
  The companion's condition is checked against the 99-card deck (not the commander card).
  702.139d: "Cards can enter Commander games from outside the game via the companion special action."
  Once put into hand: it's in the game and can be cast normally if you have mana.

CAN YOU HAVE A COMPANION AND A COMPANION IN YOUR DECK?
  No: the companion condition requires that the companion card itself is NOT in your main deck.
  It starts outside the game (sideboard). You reveal it as outside the game.
  Having that card in your main deck AND as a companion would violate the rules:
  you can't have a card both in your starting deck and outside the game simultaneously.
```

## Definitive Conclusions

- **Paying {3} for the companion is a special action, not casting a spell** — it can't be countered, reduced in cost by cost-reduction effects, or prevented by "can't cast spells from outside the game" effects; the {3} is the exact cost, always.
- **The companion condition is checked against your starting deck before mulligans** — mulligans don't affect whether the condition is satisfied; what matters is what's in your library at game start.
- **Once the companion enters your hand, it's a completely normal card** — it can be discarded, countered, destroyed, milled, or recurred from the GY by any normal means.
- **You get one companion use per game** — the special action can only be taken once; after paying {3} and putting it in hand, the ability is exhausted for the game.
- **In Commander, the condition is checked against the 99-card deck, not the commander** — the commander's color identity still applies to the companion's own color identity.

## Canonical Example
**Lurrus of the Dream-Den companion in Modern:**
You're playing Modern with 60 cards, all permanents having MV ≤ 2 (creatures, artifacts, enchantments). Your 60-card main deck: 22 lands + 38 non-land permanents, all with MV ≤ 2.
Lurrus ({1}{W/B}{W/B}: legendary cat, 3/2, lifelink; "once during each of your turns, you may cast a permanent spell with MV ≤ 2 from your graveyard"; companion: each permanent card in starting deck has MV ≤ 2) starts outside the game (your sideboard).

Game begins: you verify all 60 cards have MV ≤ 2 permanent cards. Condition met. Reveal Lurrus.

Turn 4: priority in your main phase, stack empty. Pay {3} (special action).
Lurrus enters your hand. No response window — it was a special action.

You cast Lurrus for {1}{W/B}{W/B}. Lurrus enters the battlefield.
Opponent responds with Force of Negation: counter Lurrus.
Lurrus is countered and goes to your GY.
You can Reanimate/Unearth it from GY (it's now a normal card in your GY).

Key: the {3} special action can't be countered. Once it was in your hand, it was in the game.
The CAST of Lurrus was countered (that's a normal spell), not the {3} special action.

**Example 2 — Companion condition violation:**
You reveal Lurrus as your companion. During the game, an opponent Mind's Eyes or casts effects to look at your deck, discovering you have a Gideon of the Trials ({1}{W}{W}: planeswalker, MV 3) in your library.

This violates Lurrus's condition (permanent card with MV > 2).
This is a rules violation / cheating. In a tournament: game loss penalty.
In a casual game: correct the error (remove Lurrus as companion or remove the offending card from the deck and resolve it as appropriate).
The key point: the companion condition must genuinely be satisfied; bluffing or mistakes have consequences.

## Commonly Confused With
- **P407 (Sideboard rules)** — Companions start outside the game (effectively in the sideboard). Normal sideboard rules (swapping between games) don't apply to companions the same way. Companions come into the main game via the special action.
- **P439 (Cost mechanics)** — Improvise, convoke, and undaunted reduce the cost of casting spells. The {3} companion payment is a SPECIAL ACTION, not a spell cast — these cost-reduction mechanics do NOT apply to it.
- **P438 (Foretell)** — Foretell exiles a card face-down as a special action and casts from exile later. Companion is also a special action but costs {3} to bring into hand (not exile). Both are special actions that can't be countered in the act itself.
