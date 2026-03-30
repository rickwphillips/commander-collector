---
id: p556
name: Hideaway — Exile-Play, Conditional Unlock, X-Cost Resolution, and Timing
category: costs
cr_refs: [702.75, 702.75a, 702.75b, 601.2, 601.2f, 107.3b]
tags: [hideaway, exile, play-without-paying, condition, x-cost, timing, shelldock-isle, windbrisk-heights, face-down]
created: 2026-03-31
examples_count: 3
---

# P556 — Hideaway — Exile-Play, Conditional Unlock, X-Cost Resolution, and Timing

## Abstract

**Hideaway N exiles a card face-down from the top N of your library, then lets you play it without paying its mana cost when a condition is met.** The play ability uses the stack and can be responded to. Playing "without paying its mana cost" means X = 0 for any X in the mana cost (CR 107.3b). Hideaway is an activated ability on the permanent, NOT a mana ability — it uses the stack. The exiled card can only be played during the resolution of the hideaway ability; you can't save it for later. If the permanent leaves the battlefield, the exiled card remains in exile face-down (orphaned — it can't be played by the hideaway ability anymore). Any player who has controlled the hideaway permanent may look at the exiled card. Timing restrictions of the exiled card apply: sorceries can only be played when you could cast a sorcery.

## The Definitive Rules

**CR 702.75 (Hideaway):** *"'Hideaway N' means 'When this permanent enters the battlefield, look at the top N cards of your library. Exile one of them face down and put the rest on the bottom of your library in a random order. The exiled card gains "The player who controls the permanent that exiled this card may look at this card in the exile zone."'"*

**Official Ruling (2022-04-29):** *"Hideaway N means 'When this permanent enters the battlefield, look at the top N cards of your library. Exile one of them face down and put the rest on the bottom of your library in a random order.'"*

**Official Ruling (2022-04-29):** *"Any player who has controlled a permanent with a hideaway ability since a card was exiled with it may look at that card."*

**Official Ruling (2022-04-29):** *"Previously, permanents with hideaway entered the battlefield tapped. This ability has been removed from the definition of hideaway."*

**CR 107.3b (X Costs with "Without Paying"):** *"If a player is casting a spell that has an {X} in its mana cost, the value of X isn't defined by the text of that spell, and an effect lets that player cast that spell while paying neither its mana cost nor an alternative cost that includes X, then the only legal choice for X is 0."*

**CR 601.2 (Casting Spells):** *"To cast a spell, a player follows the steps in this rule in order."*

## The Pattern

```
HIDEAWAY ETB TRIGGER:

  When a permanent with Hideaway N enters the battlefield:
    1. Look at the top N cards of your library
    2. Choose one card to exile face-down
    3. Put the remaining cards on the bottom in random order
    4. The exiled card gains: "Controller of the hideaway source may look at this"

  The exile is face-down — opponents cannot see what you hid.
  Any player who has EVER controlled the hideaway permanent may look at the card.

HIDEAWAY PLAY ABILITY:

  Each hideaway permanent has a separate activated ability:
    "[Cost]: You may play the exiled card without paying its mana cost
     if [condition is met]."

  This ability:
    - Uses the stack (NOT a mana ability) — opponents can respond
    - Checks the condition on resolution (not activation)
    - If condition is met: you MAY play the card (optional)
    - If condition is NOT met: ability resolves and does nothing
    - "Play" means cast if it's a spell, or put onto battlefield if it's a land

  TIMING RESTRICTIONS APPLY:
    - Sorcery can only be played if you could cast a sorcery (main phase, stack empty)
    - Instant can be played at any legal time
    - Land can only be played if you have a land play available
    - Creature follows normal casting timing

X COSTS WITH HIDEAWAY:

  "Without paying its mana cost" → X = 0 (CR 107.3b)

  Example: Hideaway reveals a spell with {X}{R}{R}
    - Cast without paying mana cost: X = 0
    - The spell is cast as if X were declared as 0
    - You cannot choose a higher X (no mana cost to anchor it)

  This is a common trap: players assume they can choose any X.
  Official rule: X must be 0 when cast without paying.

ORPHANED EXILED CARDS:

  If the hideaway permanent leaves the battlefield:
    - The exiled card remains in exile face-down
    - The hideaway ability no longer exists (permanent is gone)
    - The card is stranded — cannot be played via the old hideaway
    - Any player who controlled the permanent can still LOOK at the card
    - Another hideaway permanent entering doesn't "adopt" the old card

HIDEAWAY + BLINK:

  If the hideaway permanent is blinked (exiled and returned):
    - Old exiled card: orphaned (remains in exile, can't be played)
    - New ETB trigger: look at top N again, exile a new card
    - The permanent now tracks the NEW exiled card
    - Old and new exiled cards are independent

HIDEAWAY + COPY:

  If the hideaway permanent is copied (e.g., Thespian's Stage):
    - The copy enters the battlefield
    - Copy's hideaway ETB triggers: exile a new card
    - The copy does NOT inherit the original's exiled card
    - Each hideaway permanent tracks its own exiled card independently

CONDITIONS ON HIDEAWAY LANDS:

  Each hideaway land has a unique condition:
    - Shelldock Isle: "if a library has twenty or fewer cards in it"
    - Windbrisk Heights: "if you attacked with three or more creatures this turn"
    - Mosswort Bridge: "if creatures you control have total power 10 or greater"
    - Howltooth Hollow: "if each player has no cards in hand"
    - Spinerock Knoll: "if an opponent was dealt 7 or more damage this turn"

  Condition is checked at RESOLUTION of the play ability, not at activation.
  You can activate even if the condition isn't met yet — if it becomes true
  before the ability resolves, the play succeeds.

ADDITIONAL COSTS AND HIDEAWAY:

  "Without paying its mana cost" waives only the MANA COST.
  Additional costs (kicker, buyback, entwine) are still optional and payable.
  Mandatory additional costs must still be paid.

  Example: Hideaway plays a spell with mandatory sacrifice cost
    → Mana cost is free, but sacrifice cost must still be paid
```

## Definitive Conclusions

- **Hideaway is NOT a mana ability** — it uses the stack and can be responded to.
- **X = 0 when cast without paying** — no choice for X (CR 107.3).
- **Condition checked at resolution** — not at activation time.
- **Orphaned cards stay exiled** — if the permanent leaves, the card is stranded.
- **Timing restrictions apply** — sorceries need sorcery timing even when played via hideaway.
- **Additional costs still apply** — only mana cost is waived; kicker etc. are still payable/mandatory.

## Canonical Example

**Shelldock Isle Playing an X Spell:**

You control Shelldock Isle with a face-down exiled Fireball ({X}{R}). An opponent's library has 18 cards.

You activate Shelldock Isle's ability: "{U}, {T}: You may play the exiled card without paying its mana cost if a library has twenty or fewer cards in it."

Ability goes on the stack. Opponent can respond. Ability resolves: condition met (opponent's library has 18 cards). You play Fireball without paying its mana cost. X = 0 (CR 107.3b). Fireball deals 0 damage.

**Example 2 — Windbrisk Heights Sorcery Timing:**

You control Windbrisk Heights with an exiled Day of Judgment (sorcery). You attacked with three creatures this turn.

During your post-combat main phase (stack empty), you activate Windbrisk Heights. Ability resolves: condition met. You may play Day of Judgment without paying its mana cost. Since it's your main phase and the stack is empty, sorcery timing is satisfied. Day of Judgment resolves, destroying all creatures.

If you had tried during combat: ability resolves, condition met, but you CANNOT play Day of Judgment (sorcery timing not met). The ability resolves with no effect.

**Example 3 — Hideaway Permanent Blinked:**

You control Mosswort Bridge with a face-down exiled Craterhoof Behemoth. Opponent blinks Mosswort Bridge (exile and return).

Old exiled card (Craterhoof) is orphaned — remains face-down in exile, can't be played. Mosswort Bridge returns, triggering hideaway again. You look at the top 4 cards and exile a new one. The new exiled card is tracked by the returned Mosswort Bridge.

## Commonly Confused With

- **P500 (Exile-Play Immediate Window)** — P500 covers immediate play windows; P556 covers hideaway's conditional delayed play.
- **P060 (Foretell)** — P060 covers foretell's exile-to-play; P556 covers hideaway's condition-gated free play.
- **P015 (Mana Ability Identification)** — P015 defines mana abilities; P556 confirms hideaway is NOT one.
