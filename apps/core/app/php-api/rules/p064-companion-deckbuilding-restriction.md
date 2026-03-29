---
id: p064
name: Companion — Deck Construction Restriction and Sideboard-to-Hand
category: stack
cr_refs: [702.139a, 702.139b, 702.139c, 702.139d, 116.2g]
tags: [companion, deckbuilding, outside-game, special-action, main-phase, cost, hand, sideboard]
created: 2026-03-28
examples_count: 2
---

# P064 — Companion — Deck Construction Restriction and Sideboard-to-Hand

## Abstract
Companion is a keyword ability that lets a player designate one card from outside the game (sideboard) as their companion, provided their starting deck satisfies the companion's condition. Once per game, you may pay {3} at any time during your main phase while the stack is empty to put the companion into your hand — this is a special action (doesn't use the stack). The companion then stays in the game (not outside it). Note: the current rules require paying {3} before putting it in hand, meaning opponents know it's coming.

## The Definitive Rule

**CR 702.139a** (verbatim): *"Companion is a keyword ability that functions outside the game. It's written as 'Companion—[Condition].' Before the game begins, you may reveal one card you own from outside the game with a companion ability whose condition is fulfilled by your starting deck. Once during the game, any time you have priority and the stack is empty, but only during a main phase of your turn, you may pay {3} and put that card into your hand. This is a special action that doesn't use the stack (see rule 116.2g). This is a change from previous rules."*

**CR 702.139b** (verbatim): *"If a companion ability refers to your starting deck, it refers to your deck after you've set aside any sideboard cards. In a Commander game, this is also before you've set aside your commander."*

## The Pattern

```
COMPANION SETUP (BEFORE THE GAME):
  Choose one card from outside the game (sideboard/outside-game pool)
  That card must have a companion ability whose condition your deck satisfies
  Reveal it before the game starts
  If condition is not met: cannot use that card as companion

COMPANION CONDITION EXAMPLES:
  "Your starting deck contains only cards with even mana values" (Yorion)
  "Your starting deck contains no more than one of any card with the same name" (Lurrus)
  Wait — some companions have restrictions on deck size or card types
  Conditions are checked against starting deck (before sideboard cards)

BRINGING COMPANION IN (DURING THE GAME):
  Once during the game (not once per turn — once total)
  Requirements:
    → You have priority
    → Stack is empty
    → It's your main phase
  Action: pay {3} and put the companion into your hand
  This is a special action (no stack → can't be countered or responded to)
  → But opponents can see you do it (you declare it)

AFTER COMPANION IS IN YOUR HAND:
  The card is now in your hand (in the game)
  You can cast it normally
  If it goes to the graveyard/exile: it stays in the game (CR 702.139c)
  You cannot "re-reveal" it as companion to use the ability again — once used, done

COMPANION CONDITION AND SIDEBOARDING:
  After game 1, if you sideboard in cards that violate the companion's condition:
  → You can still keep the companion revealed but can no longer use the {3} ability
    (Condition is checked at time of bringing in, not just before game starts)
  Wait: CR 702.139a says "whose condition is fulfilled by your starting deck"
    and "starting deck" = post-sideboard adjustments. So:
    Sideboarding: if post-sideboard deck doesn't meet condition, companion is invalid

COMMANDERS AND COMPANION:
  CR 702.139d: companion cards can enter Commander games from outside the game
  In Commander: companion is in the command zone effectively "outside the game"
    When brought in via {3}: it goes to hand from command zone

SPECIAL ACTION = NO STACK:
  Split second doesn't stop it (CR 702.61b: special actions work through split second)
  Can't be countered or responded to
  Opponents just see it happen and can respond AFTER the card is in your hand
```

## Definitive Conclusions

- **Companion requires deck construction compliance.** If your starting deck doesn't meet the condition, you can't use that companion.
- **Bringing companion in costs {3} and is a special action.** Main phase, stack empty, once per game.
- **The {3} cost can't be responded to.** It's a special action, not an ability.
- **Once in the game, companion stays.** If it dies or goes to exile, it remains in the game.
- **After sideboarding, re-check the condition.** If your post-sideboard deck violates the companion's condition, the companion is invalid for that game.

## Canonical Example
**Kaheera, the Orphanguard (companion: all creatures must be Cat, Elemental, Nightmare, Dinosaur, or Beast):**
Reveal Kaheera before game 1. Your deck contains only those creature types. Turn 2, main phase, stack empty: pay {3}, Kaheera goes to hand (special action). Turn 3: cast Kaheera normally. If Kaheera dies, it goes to graveyard and stays in the game.

**Example 2 — Companion and Sideboarding:**
Game 2: you sideboard in a Human creature. Your deck now contains a Human, which violates Kaheera's companion condition. Kaheera can no longer be used as companion for this game (even though it was valid in game 1). You can still use Kaheera as a normal card if you have another way to get it into your hand.

## Commonly Confused With
- **P060 (Foretell)** — Both involve special actions. Foretell is instant-speed (any time during your turn); Companion requires main phase + stack empty + {3} cost. Both bypass the stack.
- **P041 (Morph)** — Another special action (face-up). Morph can happen any time; Companion is main phase only.
