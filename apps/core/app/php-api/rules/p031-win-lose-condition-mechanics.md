---
id: p031
name: Win/Lose Condition Mechanics — Stack vs. SBA vs. Replacement
category: stack
cr_refs: [104.1, 104.2a, 104.2b, 104.3b, 104.3c, 104.3d, 104.3e, 104.3f, 104.4a, 704.5a, 614.1]
tags: [win-game, lose-game, state-based-action, replacement-effect, triggered-ability, lab-maniac, thassas-oracle, felidar-sovereign, angels-grace, cant-lose, simultaneous, draw]
created: 2026-03-28
examples_count: 4
---

# P031 — Win/Lose Condition Mechanics — Stack vs. SBA vs. Replacement

## Abstract
Magic has three mechanically distinct categories of win and lose conditions, and they interact with the stack in completely different ways. State-based losses (life ≤ 0, mill, poison) happen automatically at the next SBA check — no stack, no response window once the condition is met. Effect-based wins/losses from triggered or activated abilities go on the stack and can be countered or responded to. Replacement-based wins (Laboratory Maniac) apply within the event itself with no stack involvement, though the event that causes them can still be responded to. Understanding which category applies determines whether any response is possible.

## The Definitive Rule

**CR 104.1** (verbatim): *"A game ends immediately when a player wins, when the game is a draw, or when the game is restarted."*

**CR 104.3b** (verbatim): *"If a player's life total is 0 or less, that player loses the game the next time a player would receive priority. (This is a state-based action. See rule 704.)"*

**CR 104.3c** (verbatim): *"If a player is required to draw more cards than are left in their library, they draw the remaining cards and then lose the game the next time a player would receive priority. (This is a state-based action.)"*

**CR 104.3d** (verbatim): *"If a player has ten or more poison counters, that player loses the game the next time a player would receive priority. (This is a state-based action.)"*

**CR 104.3e**: *"An effect may state that a player loses the game."* (Effect on the stack.)

**CR 104.2b**: *"An effect may state that a player wins the game."* (Effect on the stack.)

**CR 104.3f** (verbatim): *"If a player would both win and lose the game simultaneously, that player loses the game."*

**CR 104.4a** (verbatim): *"If all the players remaining in a game lose simultaneously, the game is a draw."*

**CR 104.2a** (verbatim): *"A player still in the game wins the game if that player's opponents have all left the game. This happens immediately and overrides all effects that would preclude that player from winning the game."*

**CR 614.1**: Replacement effects apply within the replaced event, not on the stack.

## The Pattern

```
CATEGORY 1 — STATE-BASED LOSS (no stack):
  Conditions: life ≤ 0, draw from empty library, 10+ poison counters
  Mechanism: SBA (CR 704.5a/5b/5c)
  Timing: "next time a player would receive priority"
  → Checked before priority is given after each spell/ability resolves
  → No priority window AFTER the condition is met
  → Prevention must be in place BEFORE the condition occurs
    (Angel's Grace must resolve before life drops to 0)

  Can you respond? Not after the condition is met. Yes before:
    - Cast Angel's Grace in response to the lethal attack
    - Angel's Grace resolves, creates "can't lose" static effect
    - Lethal damage deals, life drops (or damage prevented going below 1)
    - SBA checks: "can't lose this turn" blocks the loss SBA → you survive

CATEGORY 2 — EFFECT-BASED WIN/LOSS (uses the stack):
  From triggered abilities: "At the beginning of your upkeep, if you have 40+
    life, you win the game." (Felidar Sovereign)
  From resolving spells/abilities: "Target player loses the game."
  Mechanism: Goes on the stack → can be responded to
  Can be countered (with Counterspell, Stifle, etc.)
  Intervening-if clause applies if present (P006): condition checked twice

  Thassa's Oracle ETB trigger:
    "When this creature enters... if X ≥ number of cards in library, you win."
    → This is a triggered ability on the stack
    → Opponents can respond: counter it, reduce your devotion to blue, add
      cards to your library (Surgical Extraction on a key card won't help,
      but something that moves cards back to library would)
    → If X < library count at resolution, trigger does nothing (P006 check)
    → If X ≥ library count at resolution, you win — game ends immediately

  Note: "If X is greater than or equal to the number of cards in your library"
  in Thassa's Oracle is NOT an intervening-if clause (the "if" follows the
  comma in the middle of the effect, not at the trigger event). The trigger
  always triggers; the win happens if the condition is true when it resolves.

CATEGORY 3 — REPLACEMENT WIN (no stack, within event):
  Example: Laboratory Maniac
    "If you would draw a card while your library has no cards in it, you win
     the game instead."
  Mechanism: Replacement effect (CR 614.1) — replaces the draw event
  The draw event → replacement fires → you win instead of drawing
  NO stack involvement for the replacement itself

  Can you respond?
    Not to the replacement applying (it's within the draw event)
    YES to whatever spell/ability is causing the draw:
      Opponent casts "draw a card" effect targeting you → it's on the stack →
      you can respond before it resolves
      If Lab Maniac is removed before it resolves, the replacement won't apply

  Critical: Lab Maniac must be on the battlefield when the draw event occurs
    If it's killed in response to the spell that would cause you to draw, the
    replacement no longer exists → you draw from empty library → lose instead

SIMULTANEOUS WIN AND LOSE:
  CR 104.3f: If you would both win and lose simultaneously → you lose
  Example: Platinum Angel ("you can't lose") removed same turn Felidar Sovereign
    trigger resolves while opponent has effect ending your game → lose

  CR 104.4a: All remaining players lose simultaneously → draw
  Example: Final Fortune + last turn effects → both players lose same time → draw

CAN'T LOSE / CAN'T WIN EFFECTS:
  Angel's Grace: "You can't lose the game this turn and your opponents can't
    win the game this turn"
  → Blocks SBA-based losses (704.5a "can't lose" prevents the SBA firing)
  → Blocks effect-based wins/losses (the "effect may state" is also blocked)
  → Separate effect: "damage that would reduce your life total to less than 1
    reduces it to 1 instead" — replacement effect preventing going below 1

  Platinum Angel: "You can't lose the game and your opponents can't win the game"
  → Permanent version of the above
  → If Angel is removed, the continuous effect ends and SBAs can fire next check

104.2a OVERRIDE:
  "A player wins if all opponents have left the game. This happens immediately
   and overrides all effects that would preclude that player from winning."
  → Even Platinum Angel effects can't prevent winning this way
  → This is the only override to "can't win" effects
```

## Definitive Conclusions

- **Life ≤ 0 → next SBA check, not instantly.** You don't die "during" the spell — you die at the next SBA check after the spell resolves. There's no window between then to act, but you can cast preventatives before that point.
- **Thassa's Oracle's win condition is a triggered ability on the stack.** It can be countered. Reducing your devotion to blue or adding cards to your library before it resolves can prevent the win.
- **Laboratory Maniac's win is a replacement effect.** It happens within the draw event itself. Kill Lab Maniac before the draw event triggers and the replacement is gone — you lose instead.
- **If Lab Maniac's replacement fires but you can't win** (opponent has Angel's Grace or similar "can't win" effect), you still don't lose. The ruling (2021-03-19): "If for some reason you can't win the game (because your opponent has cast Angel's Grace this turn, for example), you won't lose for having tried to draw a card from a library with no cards in it. The draw was still replaced." — The replacement applied (draw was replaced by "win"), even though the winning was blocked. The draw-from-empty-library never happened, so the SBA that would cause you to lose never triggers.
- **Angel's Grace prevents SBA losses** (life ≤ 0 doesn't kill you if you can't lose), effect-based losses, and also prevents damage from taking you below 1.
- **Win and lose simultaneously → lose.** No exception; losing always wins the tiebreaker in 104.3f.
- **All players lose simultaneously → draw** (104.4a). Relevant in multiplayer.
- **The only thing that overrides "can't win" effects is 104.2a** (opponents all leave the game). Nothing else breaks through Platinum Angel.
- **Conceding is instant (104.3a).** It doesn't use the stack. A player who concedes leaves the game immediately.
- **Angel's Grace "can't lose" does NOT allow overpaying life.** Even if you can't lose this turn, you can't pay more life than your current total. Example: you have 3 life with Angel's Grace in effect — you cannot pay 5 life for a Phyrexian mana cost. Angel's Grace ruling (2021-03-19): "You can't pay more life than you have, even if you won't lose the game."

## Canonical Example
**Thassa's Oracle entering with empty library:**
You control Thassa's Oracle and no other blue permanents. Your devotion to blue = {U}{U} from Thassa's Oracle (X=2). Your library has 0 cards. ETB trigger goes on stack: "look at top 2, if X ≥ library count (2 ≥ 0), you win." Opponent counters the trigger with Stifle. The triggered ability is countered — you don't win. You still have Thassa's Oracle on battlefield. Your library still has 0 cards. At the next draw step you'll try to draw and lose (SBA, mill from empty library).

**Example 2 — Lab Maniac vs. Oracle which is better?**
You need to win with an empty library. Lab Maniac requires that you actually DRAW a card (something must make you draw — an effect on the stack). Your opponent can kill Lab Maniac in response before you draw. Thassa's Oracle requires devotion ≥ library count at trigger resolution. Your opponent can counter the trigger. Lab Maniac's win is harder to interact with (the replacement fires within the draw event), but requires a draw effect and that the Maniac survive to the draw step.

**Example 3 — Felidar Sovereign + opponent kills you first:**
Your upkeep, you have 42 life. Felidar Sovereign trigger goes on stack: "if you have 40+ life, you win." Opponent casts Lightning Bolt targeting you (3 damage, 42→39 life). Bolt resolves. Your life is 39. Felidar trigger resolves: check condition — "if you have 40 or more life" — you have 39 → condition fails → trigger removed from stack, does nothing. You don't win. (This is P006 — intervening-if double check.)

**Example 4 — Angel's Grace vs. lethal damage:**
Opponent swings for lethal. You have 2 life, opponent deals 10 damage. You cast Angel's Grace in response. It has split second — opponent can't respond. Angel's Grace resolves: "you can't lose this turn; damage that would reduce life below 1 reduces it to 1 instead." The 10 damage resolves; the replacement reduces your life to 1 (not -8). SBA check: life ≥ 1 (and even if it weren't, "can't lose" blocks the SBA). You survive the turn.

## Commonly Confused With
- **P006 (Intervening If Clause)** — Many win-condition triggers have intervening-if clauses (Felidar Sovereign). P006 covers the double-check at trigger time and resolution. P031 covers the broader category of win/loss mechanisms (stack vs. SBA vs. replacement).
- **P002 (Replacement vs. Trigger)** — Lab Maniac's win is a replacement effect; Felidar Sovereign's is a triggered ability. P002 is the foundational framework that distinguishes these. P031 applies that distinction to the specific consequences of win/loss mechanics.
- **P007 (Priority Windows)** — P031 establishes that SBA-based losses have no post-condition response window. P007 covers the mechanics of the priority system more broadly.
