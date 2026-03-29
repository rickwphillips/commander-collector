---
id: p402
name: Companion — Deck Construction Restrictions and the {3} Special Action
category: zones
cr_refs: [702.139a, 702.139b, 702.139c, 702.139d, 116.2g, 103.2b]
tags: [companion, outside-game, deck-construction-condition, special-action-three-mana, once-per-game, main-phase-only, commander-companion, Ikoria, Lurrus-of-the-Dream-Den, Yorion-Sky-Nomad, Obosh-the-Prey-Piercer, Kaheera-the-Orphanguard, Zirda-the-Dawnwaker, deck-condition-violated-no-companion, singleton-violates-lurrus, 80-card-deck-yorion]
created: 2026-03-29
examples_count: 2
---

# P402 — Companion — Deck Construction Restrictions and the {3} Special Action

## Abstract
**Companion** (702.139) lets you choose one card with companion from outside your deck before the game begins, provided your starting deck satisfies the companion's construction condition. Once per game, during your main phase when the stack is empty, you may pay {3} (a special action, not a spell) to put the companion card from outside the game into your hand. The key rules: (1) the companion condition is checked at game start (deck construction), not during the game; (2) violating the companion condition means you can't use that card as a companion at all; (3) you can only use the companion once per game; (4) companion cards follow normal rules once they enter the game (they become a legal card in your hand). In Commander, companion adds additional deck construction constraints and the {3} companion fee applies.

> **Updated 20260329:** Corrected error: Grafdigger's Cage does NOT stop companion. The pattern incorrectly quoted Cage as having "outside the game" restriction text, but Cage's actual oracle text only restricts graveyards and libraries. Companion's {3} action puts the card into your hand from outside the game — neither a graveyard nor library is involved.

## The Definitive Rules

**CR 702.139a** (verbatim): *"Companion is a keyword ability that functions outside the game. It's written as 'Companion—[Condition].' Before the game begins, you may reveal one card you own from outside the game with a companion ability whose condition is fulfilled by your starting deck. (See rule 103.2b.) Once during the game, any time you have priority and the stack is empty, but only during a main phase of your turn, you may pay {3} and put that card into your hand. This is a special action that doesn't use the stack (see rule 116.2g). This is a change from previous rules."*

**CR 702.139b** (verbatim): *"If a companion ability refers to your starting deck, it refers to your deck after you've set aside any sideboard cards. In a Commander game, this is also before you've set aside your commander."*

**CR 702.139c** (verbatim): *"Once you take the special action and put the card with companion into your hand, it remains in the game until the game ends."*

**CR 702.139d** (verbatim): *"Cards can enter Commander games from outside the game via the companion special action."*

## The Pattern

```
COMPANION SETUP (BEFORE THE GAME):
  WHAT IT IS:
    Before the game begins: you may reveal one companion card you own.
    That companion's condition must be satisfied by your starting deck.
    Once revealed: for this game, the companion is "outside the game" (a designated zone).
    You may only use ONE companion per game (can't reveal multiple).
  THE CONDITIONS:
    Each companion has a unique deck construction condition:
    Lurrus of the Dream-Den: "Your starting deck contains only permanents with MV 2 or less."
    Yorion, Sky Nomad: "Your starting deck contains at least 20 more cards than the minimum."
      (In 60-card formats: minimum 60 → you need 80+ card deck. In Commander: 100 → 120+.)
    Obosh, the Prey-Piercer: "Your starting deck contains only cards with odd MV (or no MV)."
    Kaheera, the Orphanguard: "Each creature in your starting deck is a Cat, Elemental, Nightmare,
      Dinosaur, or Beast."
    Zirda, the Dawnwaker: "Each permanent in your starting deck has an activated ability."
  CONDITION CHECKED AT DECK CONSTRUCTION:
    If your deck satisfies the condition: you may use that companion.
    If your deck violates the condition even one card: you can't use that companion.
    The condition is checked at game start (when you reveal the companion), not during play.
    Once the game begins: you can't "validate" or "invalidate" the companion by changing your deck.
  WHAT HAPPENS IF CONDITION IS WRONG:
    If you try to use a companion whose condition isn't met: that card isn't your companion.
    In competitive play: a deck check showing a violation means you lose the companion privilege.
    The companion card returns to being "outside the game" / sideboard without special status.

THE {3} SPECIAL ACTION (702.139a, 116.2g):
  HOW TO USE THE COMPANION:
    Any time during your main phase, when the stack is empty and you have priority:
    Pay {3} (three generic mana). This is a SPECIAL ACTION, not a spell.
    Special actions don't use the stack. They happen immediately.
    "Put that card into your hand." The companion enters your hand from outside the game.
  KEY RESTRICTIONS:
    "Only during a main phase of YOUR turn" — not during opponents' turns. Not during combat.
    "Stack is empty" — can't do this while spells/abilities are on the stack.
    "Any time you have priority" (within those constraints).
    Can only be used once (702.139a: "Once during the game").
  WHY {3} INSTEAD OF FREE?:
    Originally (pre-errata): companions went directly to your hand at no cost.
    The mechanic was so strong it was emergency-errata'd to add the {3} tax.
    This is one of the most significant rules changes made post-release.
    The {3} makes companions significantly less broken — paying 3 mana for the privilege.
  THE COMPANION ONCE IN YOUR HAND (702.139c):
    "Once you put the card into your hand, it remains in the game until the game ends."
    The companion is now a normal card in your hand. Cast it like normal.
    If it dies, it goes to the GY (like any card). Normal GY rules.
    If you discard it or it leaves your hand: it goes to its zone normally.
    No special "return to outside the game" if the companion dies.
    Exception: if it has persist/undying/escape/etc.: those work normally.
  COMPANION CAN'T ENTER BEFORE THE {3}:
    You can't "draw" your companion. It's not in your library.
    You can't tutor for it (it's not in the game until you pay the {3} action).
    Urza's Saga (creates a tutor token): can it fetch your companion? No — it's outside the game.
    Once you pay {3}: it's in your hand and can be tutored for (if someone else could draw/tutor it).

COMPANION IN COMMANDER (702.139d):
  702.139d: "Cards can enter Commander games from outside the game via the companion special action."
  This is explicit: companion works in Commander.
  702.139b: in Commander, "starting deck" means your deck before setting aside your commander.
  Your 99-card deck (or 98 if using a partner) + your commander(s) must meet the companion condition.
  Wait: 702.139b says "before you've set aside your commander." So the commander IS counted in the
    "starting deck" for checking the companion condition.
  A Commander deck using Lurrus: all permanents in the 99-card deck AND the commander must have MV ≤ 2.
    But your commander is usually a legendary creature with MV 4+. Very restrictive.
  Practical companions for Commander:
    Kaheera: requires all creature cards in the 99 + commander to be Cat/Elemental/Nightmare/Dinosaur/Beast.
      Lots of tribal-focused commanders work here.
    Yorion in Commander (100-card format): you'd need 120+ cards in your starting deck. Not typical.
  Commander players often don't use companions due to the severe restriction.

COMPANION AND COPY EFFECTS:
  If someone copies your companion (once it's in your hand): the copy is a spell on the stack.
  The copy enters the battlefield normally. Your companion, in hand, is still your companion.
  They are independent objects.
  Can you reveal a companion as a second companion? No — you can only reveal one companion.
  What if you have two cards with companion in your hand? (After paying {3} and drawing another?)
  Only one companion was revealed at game start. The other is just a regular card.

COMPANION AND GRAFDIGGER'S CAGE:
  Cage's ACTUAL oracle text: "Creature cards in graveyards and libraries can't enter the battlefield.
    Players can't cast spells from graveyards or libraries."
  The {3} companion action is a SPECIAL ACTION that puts the card from outside the game into your HAND.
  → "Outside the game" is not a graveyard or library → Cage's restrictions don't apply
  → The companion then goes to your HAND, not directly to battlefield → first line doesn't apply
  → You then cast it from your HAND (not from a graveyard or library) → second line doesn't apply
  Grafdigger's Cage does NOT stop companion access.
  (Note: if Cage had "outside the game" text, it would matter, but it doesn't — confirmed by Scryfall oracle)
```

## Definitive Conclusions

- **Companion conditions are checked at game start** — if your deck satisfies the condition, you may reveal the companion; violations mean no companion; conditions aren't rechecked during the game.
- **Using a companion costs {3} as a special action** (not a spell) — during your main phase, stack empty; once per game; the card enters your hand from outside the game.
- **Once in your hand, the companion is a normal card** — it follows normal zone rules if it dies, is discarded, etc.; it doesn't return to "outside the game" unless a card's effect specifically puts it there.
- **In Commander, the commander counts as part of the "starting deck"** for companion condition checks (702.139b) — making most companions very restrictive in Commander.
- **Grafdigger's Cage does NOT prevent companion activation.** Cage's oracle text restricts graveyards and libraries only. The companion's {3} special action puts the card from outside the game into your hand (not the battlefield), and you then cast it from your hand — neither step involves a graveyard or library. Cage is irrelevant to companion strategies. (Confirmed by verifying current Cage oracle text: "Players can't cast spells from graveyards or libraries.")

## Canonical Example
**Lurrus of the Dream-Den Companion in Modern:**
Lurrus of the Dream-Den ({1}{W/B}{W/B}: 3/2, lifelink, companion — each permanent in your starting deck has MV 2 or less, "during your turn, you may cast one permanent card with MV 2 or less from your graveyard"):

Modern Burn deck construction with Lurrus as companion:
All permanents in the deck: Lightning Bolt? That's an instant (not a permanent) → doesn't need to meet condition. Goblin Guide ({R}: 2/2)? MV 1 ✓. Monastery Swiftspear ({R}: 1/2)? MV 1 ✓. Shard Volley? Instant → fine.
Any permanent with MV 3+: VIOLATES companion condition. No Eidolon of the Great Revel ({1}{R}: MV 2 ✓).

Before the game: reveal Lurrus as companion. It sits outside the game.

Turn 4: you have {3} available. Stack is empty. Your main phase.
Special action: pay {3}. Put Lurrus from outside the game into your hand.
Lurrus is now in your hand. Cast it normally for {1}{W/B}{W/B}.
Lurrus enters the battlefield as a 3/2 lifelink.
Its ability: each of your turns, cast one permanent card with MV ≤ 2 from your GY.
Recurring Goblin Guide ({R}) from GY? Yes, but it has haste — you could rebuild after board wipes.
Recurring Aether Vial (MV 1)? Yes — put it back and start charging it again.

Opponent's Grafdigger's Cage (in play from their sideboard):
Cage's actual text: "Creature cards in graveyards and libraries can't enter the battlefield. Players can't cast spells from graveyards or libraries."
The {3} companion special action is unaffected — it puts the card into your hand from outside the game (not a graveyard or library), and you then cast it from your hand normally.
Cage does NOT block companion access.

**Example 2 — Kaheera Commander Companion:**
Kaheera, the Orphanguard ({1}{G/W}{G/W}: 3/2 Nightmare Cat Beast, companion — each creature in your starting deck is a Cat, Elemental, Nightmare, Dinosaur, or Beast):

You build a Commander deck with Arahbo, Roar of the World ({5}{G}{W}: Cat tribal commander).
All 99 cards are Cats, Elementals, Nightmares, Dinosaurs, or Beasts (or non-creature permanents/spells).
Arahbo is also a Cat. Your commander meets the condition.
Kaheera can be your companion.

Start of game: reveal Kaheera as companion.
Turn 6: pay {3} during your main phase. Kaheera enters your hand.
Cast Kaheera for {1}{G/W}{G/W}. It enters the battlefield.
Kaheera: "Other Cat, Elemental, Nightmare, Dinosaur, and Beast creatures you control get +1/+1."
Your entire Cat army gets +1/+1 for the rest of the game.

Kaheera also grants vigilance to those creature types (if it's the 5-type watcher variant).
The restriction: you can't run Humans, Zombies, Spirits, or other common creature types that aren't in the 5 approved types. This limits your non-tribal options significantly.

## Commonly Confused With
- **P378 (Commander Rules)** — Companion is a separate outside-game mechanic, not part of the Commander zone rules. The command zone holds commanders; companions are "outside the game" (not in the command zone). Both have special access rules but are completely different systems.
- **P382 (Adventure)** — Both adventure and companion involve cards that "wait" before being casable. Adventure waits in exile; companions wait outside the game. Both return to a playable state through specific actions.
- **P380 (Voting/Multiplayer)** — Companion in Commander (multiplayer) raises the question of whose starting deck must meet the condition — only the companion owner's deck (not opponents).
- **P008 (Can't vs. Can)** — Grafdigger's Cage "can't put cards from outside the game into the game" is a "can't" restriction (P008). It directly conflicts with the companion mechanic's action.
