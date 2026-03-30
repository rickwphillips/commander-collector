---
id: p256
name: Hideaway — ETB Exile Face-Down, Cast With Condition
category: zones
cr_refs: [702.75a, 702.75b]
tags: [hideaway, exile, face-down, conditional-cast, Lorwyn, Shelldock-Isle, Windbrisk-Heights, Mosswort-Bridge, Spinerock-Knoll, Sheltered-Thicket]
created: 2026-03-28
examples_count: 2
---

# P256 — Hideaway — ETB Exile Face-Down, Cast With Condition

## Abstract
Hideaway N is a triggered ability: when the permanent enters, you look at the top N cards of your library, exile one face down (only you can see it), and put the rest on the bottom in random order. The land or permanent then has an activated ability with a condition: if the condition is met, you can play the hidden card for free. Hideaway lands (Lorwyn cycle) each have a unique condition — Shelldock Isle (cast a spell while 20 or fewer cards remain in library), Windbrisk Heights (attack with three or more creatures), etc. Hideaway creates a "hidden treasure" that rewards specific game conditions.

## The Definitive Rules

**CR 702.75a** (verbatim): *"Hideaway is a triggered ability. 'Hideaway N' means 'When this permanent enters, look at the top N cards of your library. Exile one of them face down and put the rest on the bottom of your library in a random order. The exiled card gains "The player who controls the permanent that exiled this card may look at this card in the exile zone."'"*

**CR 702.75b** (verbatim): *"Previously, the rules for the hideaway ability caused the permanent to enter the battlefield tapped, and the number of cards the player looked at was fixed at four. Cards printed before this rules change had the printed text 'Hideaway' with no numeral after the word. Those older cards have received errata in the Oracle card reference to have 'Hideaway 4' and the additional ability '[This permanent] enters tapped.'"*

## The Pattern

```
HIDEAWAY SEQUENCE:
  1. Permanent with Hideaway N enters: ETB triggers
  2. Look at top N cards of library
  3. Exile one face down (only the controller of the permanent may look at it)
  4. Put the rest on the bottom of library in random order
  5. The hideaway permanent now has an activated ability (printed on the card)
  6. When the activation condition is met: may play the hidden card for FREE

HIDEAWAY + FACE-DOWN EXILE:
  The exiled card is face down — opponents can't see it
  Only the controller of the permanent that exiled it may look at it in exile
  This creates strategic uncertainty: opponent doesn't know what you've hidden

HIDEAWAY + CASTING THE HIDDEN CARD:
  Each hideaway land has its OWN condition to unlock the free play
  The hidden card is cast/played "without paying its mana cost"
  Land cards: "play" (can be your land drop for the turn, or not if it's not a land drop effect)
  Non-land cards: cast for free

HIDEAWAY LANDS (Lorwyn, enters tapped per errata):
  Shelldock Isle ({Hideaway 4}): "Play the hidden card if A library has 20 or fewer cards."
    Condition: ANY player's library has 20 or fewer cards — not just yours.
    (Gatherer ruling 2007-10-01: "It doesn't matter which library has twenty or fewer cards in it.")
    Hidden cards: in decks that mill themselves (Dredge, etc.), Shelldock Isle fires frequently.
    Classic: self-mill to 20 cards → play anything from library for free.
    Also: if an OPPONENT has been milled to 20 cards, your Shelldock Isle condition is met.
    Combo: hide Emrakul or another huge card; once any library is at 20 cards, cast it for free.

  Windbrisk Heights ({W}, Hideaway 4): "Play the hidden card if you attacked with 3+ creatures this turn."
    Condition: aggressive attacking.
    Hide: a powerful instant (Wrath?) or permanent to reward flooding with creatures.
    White weenie: attack with 5 1/1s → cast Elspeth, Sun's Champion for free.

  Mosswort Bridge ({G}, Hideaway 4): "Play the hidden card if your creatures have 10 or more total power this turn."
    Condition: power-intensive board.
    Green ramp: get enough big creatures → cast hidden card for free.
    With Elf decks: 10+ total power on turn 3 → free cast.

  Sheltered Thicket ({R/G}, Hideaway 4): cycling land that enters tapped.
    Hideaway 4 but also cycles. Cycling thins deck and draws.
    Wait: Sheltered Thicket doesn't have hideaway — it has cycling. Different land.

  Spinerock Knoll ({R}, Hideaway 4): "Play the hidden card if an opponent lost 7+ life this turn."
    Condition: dealing 7+ damage in one turn.
    Aggressive red: Goblin burn dealing 7+ → free spell (likely another burn or threat).

HIDEAWAY + CHEATING:
  You choose WHICH card to hide (from the top 4)
  Tutor setup: if one of your top 4 cards is an Emrakul or big bomb: hide it
  Then fulfill the condition: cast anything huge for free!
  Shelldock Isle + Emrakul = the classic Dredge finisher

HIDEAWAY + FACE-DOWN RULES:
  While in exile face down: it has no characteristics (not a creature, not an instant, etc.)
  It's just a "card in exile that may be looked at by the controller"
  No abilities function on the card while it's face down in exile
  Can't be interacted with as a specific card (opponents don't know what it is)

HIDEAWAY + FLICKERING:
  If the hideaway permanent is blinked (exiled and returned): does the old face-down card reset?
  The new object entering would trigger ETB hideaway again → new face-down card
  The old face-down card from the previous ETB: still in exile but no longer associated with the current permanent
  The activated ability on the new permanent now refers to the NEW face-down card
  "The player who controls the permanent that exiled this card": the old card was exiled by the OLD permanent
  When the permanent blinked: the new permanent is a different object → old hideaway card has no permanent "owning" it
  The old card stays in exile (potentially inaccessible): the new hideaway card is fresh

HIDEAWAY + COPYING:
  If the hideaway permanent is copied (e.g., Clone): Clone enters and also triggers hideaway
  Clone has its own face-down exile card (separate from the original)
  Two hideaway permanents: two different hidden cards in exile

HIDEAWAY NONLAND (Lorwyn):
  Windbrisk Heights, Mosswort Bridge, Spinerock Knoll, Wanderwine Hub are all lands
  Later sets added hideaway to nonland permanents (enchantments, creatures)
  The nonlands DON'T enter tapped (only the original Lorwyn lands got that errata)
```

## Definitive Conclusions

- **Hideaway N** exiles a face-down card from the top N of your library on ETB; the hidden card is yours to see but opponents can't.
- **Each hideaway permanent has its own condition** to cast the hidden card for free.
- **Blink the permanent**: triggers a new hideaway, creating a new hidden card (the old one stays in exile, unclaimed).
- **Shelldock Isle's condition is any library ≤ 20, not just yours.** If an opponent has been milled to 20 or fewer cards, Shelldock Isle's condition is met. (Gatherer ruling 2007-10-01)
- **Shelldock Isle + Emrakul** is the iconic combo: mill down to 20 cards (anyone's), cast Emrakul for free.
- **Windbrisk Heights** rewards attacking with 3+ creatures — the most aggressive hideaway land.

## Canonical Example
**Dredge + Shelldock Isle Combo:**
Turn 3: Shelldock Isle enters tapped (standard Lorwyn errata). ETB: look at top 4. Find Emrakul, the Aeons Torn (15/15). Hide it face down. Put other 3 at bottom.
Turns 3-5: Dredge aggressively. Golgari Grave-Troll mills 6 per draw step. Library shrinks to under 20 cards.
Turn 6: Library has 18 cards. Tap Shelldock Isle: condition met (≤ 20 cards in any player's library). Play the hidden card for free.
Emrakul enters: annihilator 6 triggers. Opponent sacrifices 6 permanents.
Attack with 15/15 Emrakul for 15 damage.
Shelldock Isle finishes Dredge games that went long: one land holds a kill condition.

**Example 2 — Windbrisk Heights in White Weenie:**
White Weenie deck. Turn 3: attack with 5 Soldier tokens (from prior Raise the Alarm).
Five attacking creatures: Windbrisk Heights condition met (3+ attackers).
Tap Windbrisk Heights: play the hidden card for free.
Hidden card (chosen during ETB): Elspeth, Sun's Champion (normally {4}{W}{W} = 6 mana).
Cast Elspeth for free: she enters and +1s → create 3 more Soldier tokens.
Now have 5+3 = 8 Soldiers + Elspeth on turn 3.
White weenie leveraged its creature count to cheat out a 6-mana planeswalker.

## Commonly Confused With
- **P172 (Foretell)** — Foretell exiles face down to cast next turn at a reduced cost; Hideaway exiles face down indefinitely until a condition is met.
- **P207 (Adventure)** — Adventure exiles to cast later at no cost (the main card); Hideaway exiles from your LIBRARY, not your hand.
- **P255 (Suspend)** — Suspend exiles cards from hand with time counters for free future cast; Hideaway exiles from top of library for conditional free cast.
