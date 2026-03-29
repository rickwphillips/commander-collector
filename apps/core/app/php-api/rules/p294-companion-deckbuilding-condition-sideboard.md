---
id: p294
name: Companion — Deckbuilding Condition and the {3} Sideboard Put-Into-Hand Action
category: zones
cr_refs: [103.2b, 116.2g, 702.139a, 702.139b, 702.139c, 702.139d]
tags: [companion, deckbuilding, sideboard, outside-the-game, special-action, Ikoria, Lurrus-of-the-Dream-Den, Yorion-Sky-Nomad, Jegantha-the-Wellspring, Umori-the-Collector, Keruga-the-Macrosage, Lutri-the-Spellchaser]
created: 2026-03-29
examples_count: 2
---

# P294 — Companion — Deckbuilding Condition and the {3} Sideboard Put-Into-Hand Action

## Abstract
Companion is a keyword ability that functions outside the game. Before the game begins, a player may reveal one card they own from outside the game (their sideboard) as their companion — but only if their starting deck satisfies that companion's deckbuilding condition. Once during the game, the companion's controller may pay {3} as a special action (not a spell, uses no stack) to put the companion into their hand. From there it can be cast normally. A companion whose condition isn't met cannot be revealed. The {3} cost is mandatory and was added in the August 2020 rules update to nerf the mechanic.

## The Definitive Rules

**CR 103.2b** (verbatim): *"If any players wish to reveal a card with a companion ability that they own from outside the game, they may do so. A player may reveal no more than one card this way, and they may do so only if their deck fulfills the condition of that card's companion ability. The revealed card remains outside the game."*

**CR 116.2g** (verbatim): *"A player who has chosen a companion may pay {3} to put that card from the outside the game into their hand. This is a special action. A player may take this action any time they have priority and the stack is empty during a main phase of their turn, but only once."*

**CR 702.139a** (verbatim): *"Companion is a keyword ability that functions outside the game. It's written as 'Companion—[Condition].' Before the game begins, you may reveal one card you own from outside the game with a companion ability whose condition is fulfilled by your starting deck. Once during the game, any time you have priority and the stack is empty, but only during a main phase of your turn, you may pay {3} and put that card into your hand. This is a special action that doesn't use the stack."*

**CR 702.139b** (verbatim): *"If a companion ability refers to your starting deck, it refers to your deck after you've set aside any sideboard cards. In a Commander game, this is also before you've set aside your commander."*

**CR 702.139c** (verbatim): *"Once you take the special action and put the card with companion into your hand, it remains in the game until the game ends."*

## The Pattern

```
COMPANION SETUP (before game starts):
  You own the card in your sideboard (outside the game)
  Your starting deck must fulfill the companion's deckbuilding condition EXACTLY
  At game start: reveal the companion (it stays outside the game, revealed to all)
  You may NOT reveal more than one companion
  Only one companion per player per game

  DECKBUILDING CONDITIONS (examples):
    Lurrus of the Dream-Den: "Each nonland permanent in your starting deck has mana value 2 or less."
    Yorion, Sky Nomad: "Your starting deck contains at least 20 cards more than the minimum deck size."
      (In Standard with 60-minimum: deck must have 80+ cards)
    Jegantha, the Wellspring: "No card in your starting deck has a mana cost that contains
      the same mana symbol more than once."
      Example: Niv-Mizzet, Parun ({U}{U}{U}{R}{R}{R}) violates this condition.
      OK: basics, cards with WUBRG each once, colorless.
    Umori, the Collector: "Each nonland card in your starting deck must share a card type."
      All creatures. Or all instants. Or all sorceries. Not a mix.
    Keruga, the Macrosage: "Your starting deck contains only cards with mana value 3 or greater
      and land cards."
      No 1-drops or 2-drops (except lands).
    Lutri, the Spellchaser: "Each nonland card in your starting deck is unique."
      This is ALWAYS met in formats with a singleton rule (Commander, Brawl)!
      In regular formats: no copies. Banned in most for this reason.

  CHECKING THE CONDITION:
    Condition checked against the STARTING deck — the 60 (or 100) card deck pre-sideboard
    After sideboards are set aside, that remaining deck must meet the condition
    In Commander: condition checked before setting aside your commander
    Any violation = cannot use that companion

USING THE COMPANION (during the game):
  Any time you have priority + stack is empty + it's your main phase
  Pay {3} (any three mana, generic)
  Special action: doesn't go on the stack, can't be responded to
  The companion card moves from "outside the game" to YOUR HAND
  From hand: cast it normally like any other card
  This special action can only happen ONCE (even if the card later leaves your hand)

  TIMING CLARIFICATION:
    The {3} special action puts it in HAND — it's not cast yet
    After putting in hand: you can hold it, cast it next turn, etc.
    The one-time limit: paying {3} to move it to hand. This action happens once.
    If the companion dies after being cast: it goes to GY. You CANNOT get it back for another {3}.
    The companion is now "in the game" — it's no longer accessible as a companion from outside.

  COMPANION IN COMMANDER:
    Commander decks can use companions (CR 702.139d)
    Color identity rules apply: companion must fit within the commander's color identity
    Yorion in Commander: deck size is already 100 (singleton), so Yorion would require 120 cards!
      Most Commander Yorion decks are 99+commander (100), so Yorion isn't typically usable in Commander
    Lutri, the Spellchaser: always legal as a companion in Commander (all cards already unique)
      Banned in Commander anyway (Rules Committee decision due to free inclusion with no cost)

  COMPANION + THE GAME:
    Once in your hand, the companion is "in the game" permanently
    If an effect says "get a card from outside the game" — companion is now out of the range
    If companion is put back into the library (e.g., Portent): it's now in the game (library)
    Bounced/countered: goes to hand/GY, NOT back to sideboard

COMPANION INTERACTION WITH EFFECTS:
  "Reveal the top card / cast without paying its mana cost": companion in hand benefits from these
  "Add a card from your sideboard to hand": this is a DIFFERENT ability — companion isn't the only way
    to get sideboard cards in some formats
  Companion condition checking: happens at game start, not during the game
    If an effect changes your deck composition MID-GAME: doesn't invalidate the companion
    You already revealed it; the window to validate was at game start

ERRATA / HISTORY:
  Original release (Ikoria): companion went into hand for free (just reveal + cast later)
  July 2020: rules update added the mandatory {3} payment
  Reason: companions were warping constructed formats dramatically (Lurrus in every Legacy/Vintage deck)
  The {3} tax made companion usage a real cost instead of a free resource
```

## Definitive Conclusions

- **Companion deckbuilding condition must be met before the game starts** — no mid-game check.
- **Pay {3} as a special action** (not a spell, stack stays empty) to put companion into hand.
- **This action happens once** — after it's in hand and cast, if it dies it goes to GY, not back outside.
- **In Commander, color identity still applies** — companion must fit the commander's colors.
- **Yorion requires 80+ cards in 60-minimum formats; 120+ in Commander** — almost never used in Commander.

## Canonical Example
**Lurrus of the Dream-Den in Modern Jund:**
Deck: 60 cards. All nonland permanents have MV ≤ 2: Inquisition of Kozilek (instant, irrelevant), Tarmogoyf (MV 2), Dark Confidant (MV 2), Mishra's Bauble (MV 0), Seal of Fire (MV 1).
At game start: reveal Lurrus of the Dream-Den as companion. Deck condition met.
Game state: it's your turn, main phase 1. Stack is empty. You have {3} available.
Pay {3}: Lurrus moves from outside the game to your hand.
Next main phase 2: cast Lurrus ({1}{W}{B}). 3/2 lifelink.
Lurrus ability: "During your turn, you may cast one permanent spell with mana value 2 or less from your GY."
GY has Dark Confidant (MV 2). Cast it from GY for free (Lurrus covers the cost ability).
Lurrus turns the GY into recurring resource.
If Lurrus dies: goes to your GY. Cannot use the {3} companion action again — it's "in the game."

**Example 2 — Jegantha, the Wellspring Companion in Five-Color:**
Deck: five-color goodstuff. No card has a mana cost that contains the same mana symbol twice.
Key inclusions: Niv-Mizzet Reborn ({W}{U}{B}{R}{G}) — all five colors once. OK.
Key exclusion: can't include Force of Will ({3}{U}{U}) — contains {U}{U}, two blue symbols.
Can't include Tarmogoyf... wait, Tarmogoyf is {1}{G}: only one {G}. That's fine.
Jegantha as companion: your five-color deck naturally avoids duplicate symbols.
Game start: reveal Jegantha, the Wellspring as companion.
Mid-game: pay {3}, Jegantha enters hand.
Cast Jegantha ({4}{R/G}): 5/5.
Jegantha's activated ability: "{T}: Add {W}{U}{B}{R}{G}." Five mana of any color.
Jegantha taps: get full five-color mana.
Companion cost for Jegantha: nearly free to include in any rainbow deck that avoids duplicate symbols.

## Commonly Confused With
- **P282 (Escape/Delve)** — Both let you cast cards outside the normal zone. Companion comes from outside the game; escape is from your own graveyard.
- **P283 (Foretell)** — Foretell exiles cards face-down for later; companion is always revealed and kept outside the game until the {3} special action.
- **P269 (Plot)** — Plot exiles cards from your hand for later; companion starts entirely outside the game and has a deckbuilding prerequisite.
- **P293 (Commander Format Rules)** — Commander companions must still meet color identity requirements, and Lurrus/Yorion conditions are harder to meet in 100-card singleton.
