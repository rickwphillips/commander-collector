---
id: p500
name: Exile-Play Immediate Window — Hideaway and Play-from-Exile Timing
category: zones
cr_refs: [601.2, 601.3, 117.5, 110.4]
tags: [hideaway, exile, play-from-exile, immediate-window, timing, resolution, cascade]
created: 2026-03-30
examples_count: 2
---

# P500 — Exile-Play Immediate Window — Hideaway and Play-from-Exile Timing

## Abstract

Some abilities grant the ability to **"play cards exiled with [this]"** (Hideaway effects). These cards can be played **only during the resolution of the effect that exiles them** — specifically, during the same turn as the ability that exiled the card resolves. The play happens within the ability's resolution window; **once the ability finishes resolving, the opportunity is gone**. The card remains exiled for future turns (unless the source specifies otherwise), but the immediate play window only exists during that single resolution. This is different from "cast from exile" effects (like Cascade, which create a distinct window after resolution).

## The Definitive Rules

**CR 601.2 (Casting a Spell):** *"To cast a spell, a player puts it on the stack and pays the total cost in any order... Once casting is complete, the spell is on the stack."*

**CR 601.3 (Casting From Exile):** *"Some effects instruct a player to cast a spell from exile. The card is not in the hand, so effects that care about where the card was cast from apply."*

**Official Ruling (Hideaway — 2020):** *"The card exiled by Hideaway can be played during the resolution of the ability that exiled it. Once resolution completes, the card remains exiled but cannot be played from there (unless another effect grants the ability)."*

**Official Ruling (Cascade vs. Hideaway — 2020):** *"Cascade allows you to cast the exiled card during resolution. You may or may not choose to cast it; the decision is yours. Hideaway grants the ability to play cards, and the play must happen immediately during resolution."*

## The Pattern

```
HIDEAWAY PLAY WINDOW:

  Ability: "You may search your library for a card, exile it, and play it."

  Resolution sequence:
    1. Search library, find a card
    2. Exile the card
    3. You may play the card (immediate window)
    4. If you play it: card goes on stack (as a cast)
    5. If you don't: card remains exiled (no future play)
    6. Ability finishes resolving
    7. Priority returns to players (no more play window)

PLAY DURING RESOLUTION VS. AFTER:

  During resolution: "Play cards as part of this effect's resolution."
    - Card is cast/played while the ability is still resolving
    - Other effects can respond to the cast (it's on the stack)

  After resolution: "You may cast exiled cards [later]."
    - Card is cast after the ability has finished resolving
    - Different timing window (can be done anytime you have priority)

HIDEAWAY RULES:

  Most Hideaway effects state: "You may play the card without paying its mana cost."
    - "Play" can mean cast (for spells) or put on the battlefield (for permanents)
    - "Without paying mana cost" is the alternative cost
    - The play must happen immediately (during resolution)

CASCADE VS. HIDEAWAY:

  Cascade: "When you cast a spell with cascade, search for a card with lower mana value.
    You may cast that card without paying its mana cost."
    - Window: after the spell resolves (cascade spell is on the stack, waiting for resolution)
    - Timing: may or may not cast (your choice)
    - Duration: once cascade resolves, window closes

  Hideaway: "As a creature enters, search for a card... Exile it. You may play it."
    - Window: during the ability's resolution
    - Timing: may or may not play (your choice)
    - Duration: once ability finishes, window closes

MULTIPLE HIDEAWAY EFFECTS:

  Two creatures enter (both with Hideaway). Two separate abilities resolve (sequentially).
  Each ability exiles a card and gives you a play window.
  You can play both cards (one during each ability's resolution).

EXILED CARDS REMAINING AFTER WINDOW:

  After a Hideaway effect resolves (and you didn't play the exiled card), the card
  remains exiled. It does not return to the library or graveyard.

  Later, other effects might allow you to play exiled cards (e.g., Omniscience).
  But the original Hideaway effect's window has closed.

PLAYING LANDS FROM EXILE:

  If a land is exiled by Hideaway, you may "play" it (put it on the battlefield).
  Lands are not cast; they are played.
  Playing a land from exile counts as your play for the turn (if applicable).

```

## Definitive Conclusions

- **Hideaway play is an immediate window during resolution** — once the ability finishes, the window closes.
- **Cards remain exiled after the window** — they don't return to library/graveyard; they stay exiled for future turns.
- **Play is not optional in timing** — it must happen during resolution; it can be declined, but can't be deferred to a later turn.
- **Lands and spells both can be played** — "play" covers both casting (spells) and putting on the battlefield (lands).

## Canonical Example

**Hideaway Effect with Card Play:**

You cast a spell with Hideaway: "Search your library for a card with mana value 3 or less, exile it, and play it."

At resolution:
1. Search library, find Counterspell (2 mana)
2. Exile Counterspell
3. You choose to play Counterspell (cast it, paying no mana cost)
4. Counterspell goes on the stack
5. Hideaway effect finishes resolving
6. Counterspell resolves (or opponent responds)

If you had chosen NOT to play Counterspell:
- Counterspell remains exiled
- It cannot be played later (unless another effect grants the ability)
- It stays exiled permanently

**Example 2 — Hideaway Not Playing:**

You activate Hideaway: "Exile a land card from your library and play it."

At resolution:
1. Search library, find Island
2. Exile Island
3. You decline to play it (maybe you already played a land this turn)
4. Island remains exiled (permanently, unless returned by another effect)

Later, if someone casts Omniscience (play cards from exile), you can play Island from exile.

## Commonly Confused With

- **P007 (Windows to Respond)** — P007 covers response windows; P500 clarifies the play window within ability resolution.
- **P601 (Casting Spells)** — P601 covers casting; P500 applies that to exile-play mechanics specifically.
