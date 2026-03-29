---
id: p369
name: Infect, Wither, Toxic, and Poison Counters — Damage That Bypasses Life and Kills via Counters
category: combat
cr_refs: [702.90a, 702.90b, 702.90c, 702.90d, 702.90e, 702.80a, 702.80b, 702.80c, 702.164a, 702.164b, 702.164c, 701.34a, 104.3d, 120.3b, 120.3g, 122.1f, 704.5c]
tags: [infect, wither, toxic, poison-counter, proliferate, ten-poison-counters, damage-as-minus-counters, damage-bypasses-life, Blighted-Agent, Glistener-Elf, Phyrexian-Crusader, Plague-Myr, Skithiryx, toxic-phyrexian, Urabrask, proliferate-poison]
created: 2026-03-29
examples_count: 2
---

# P369 — Infect, Wither, Toxic, and Poison Counters — Damage That Bypasses Life and Kills via Counters

## Abstract
**Infect** (702.90a) is a static ability with two effects: (1) damage dealt to players gives poison counters instead of life loss, and (2) damage dealt to creatures puts -1/-1 counters instead of marking damage. **Wither** (702.80a) is like infect but only for creatures: damage from a wither source becomes -1/-1 counters. Players still take life loss from wither sources (wither doesn't affect player-damage). **Toxic** (702.164a) is the Phyrexia: All Will Be One mechanic: it deals NORMAL combat damage to players (including life loss) AND ALSO gives poison counters equal to the toxic N value on top of the normal damage. Ten poison counters = a player loses the game (SBA 704.5c). **Proliferate** (701.34a) lets you choose any permanents/players with counters and add one more of each kind they already have — giving one additional poison counter to a poisoned player is a powerful use.

## The Definitive Rules

**CR 702.90b** (verbatim): *"Damage dealt to a player by a source with infect doesn't cause that player to lose life. Rather, it causes that source's controller to give the player that many poison counters. See rule 120.3."*

**CR 702.90c** (verbatim): *"Damage dealt to a creature by a source with infect isn't marked on that creature. Rather, it causes that source's controller to put that many -1/-1 counters on that creature. See rule 120.3."*

**CR 702.80a** (verbatim): *"Wither is a static ability. Damage dealt to a creature by a source with wither isn't marked on that creature. Rather, it causes that source's controller to put that many -1/-1 counters on that creature. See rule 120.3."*

**CR 702.164c** (verbatim): *"Combat damage dealt to a player by a creature with toxic causes that creature's controller to give the player a number of poison counters equal to that creature's total toxic value, in addition to the damage's other results. See rule 120.3."*

**CR 704.5c** (verbatim): *"If a player has ten or more poison counters, that player loses the game."*

**CR 701.34a** (verbatim): *"To proliferate means to choose any number of permanents and/or players that have a counter, then give each one additional counter of each kind that permanent or player already has."*

## The Pattern

```
INFECT (702.90a–f):
  WHAT IT DOES (TWO PARTS):
    Part 1 — Damage to PLAYERS:
      Instead of life loss: give that many POISON COUNTERS.
      10 poison counters = that player loses the game (SBA 704.5c).
      So infect creatures ignore the player's life total — they win on poison.
    Part 2 — Damage to CREATURES:
      Instead of marking damage: put that many -1/-1 COUNTERS.
      Normal marked damage: cleared at end of turn (turns lethal at toughness threshold, then SBA).
      -1/-1 counters: PERMANENT. They don't go away at end of turn.
      So infect shrinks creatures permanently.
  KEY DISTINCTIONS:
    Infect damage to players: ZERO life loss. Opponent at 20 life: infect deals 10 damage → still at 20 life, but 10 poison counters. One more poison = game loss.
    Infect damage to creatures: no marked damage, -1/-1 counters instead.
      Killing a 5/5 with infect: need 5 total infect damage over time (each point is a permanent counter).
      The 5/5 becomes 0/0 (or negative) → SBA destroys it.
      But: each point of damage = one -1/-1 counter = permanent P/T reduction.
  INFECT AND TOUGHNESS REDUCTION:
    A 5/5 hit for 3 infect damage: gets 3 -1/-1 counters.
    Creature is now 2/2 (3 less in each). This is permanent unless counters are removed.
    Later: 2 more infect damage → 2 more counters → creature is 0/0 → SBA destroys.
    Compare with normal damage: 3 damage marked, clears at end of turn (creature is still 5/5 next turn if below lethal).
  INFECT AND COMBAT DAMAGE:
    Infect applies to combat damage and non-combat damage.
    702.90e: "The infect rules function no matter what zone an object with infect deals damage from."
    So: Sharpshooter with infect pinging from the battlefield, a spell with infect, etc.
    However: most infect cards are creatures (Glistener Elf, Blighted Agent, Skithiryx the Blight Dragon).
  PROTECTION AND PREVENTION:
    "Protection from infect" doesn't exist as a keyword.
    Protection from source (e.g., "protection from black") prevents infect damage from black sources.
    Prevent N damage effects: prevented infect damage = no counters (preventing the damage prevents the counters).
    Life gain doesn't help against infect (you're not losing life; you're gaining poison counters).
  INFECT STRATEGY:
    Since you're racing to 10 poison (not 20 life):
      Small infect creatures can win quickly.
      Blighted Agent ({1}{U}): 1/1 with infect AND unblockable. 10 turns to kill solo.
        With pump spells: 1 turn kill (Giant Growth = 4/4 unblockable infect = 4 poison in one hit).
      Pump + infect = quick kills.
    Opponent life doesn't matter (except for non-infect creatures/spells).
    Infect ignores life total → can't gain your way to safety against pure infect decks.
  -1/-1 COUNTERS ON CREATURES FROM INFECT:
    These interact with persist, undying, and other counter-aware mechanics.
    Persist: returns from GY if it had no -1/-1 counter. Infect attacker can break persist.
    Undying: returns from GY if it had no +1/+1 counter. -1/-1 from infect doesn't interact.
    BUT: +1/+1 and -1/-1 counters cancel out (SBA 704.5r: if a creature has both types,
      remove one of each).
    So: an undying creature with +1/+1 counter, hit by infect for 1: -1/-1 counter added.
      SBA: both counters cancel. Creature is back to base P/T.

WITHER (702.80a–d):
  WHAT IT DOES:
    Only affects damage to CREATURES.
    "Damage dealt to a creature by a source with wither isn't marked on that creature.
      Rather... put that many -1/-1 counters on that creature."
    Wither does NOT affect damage to players. (Players take normal life loss from wither sources.)
    So: wither creatures hitting players = normal damage (life loss).
    Wither creatures hitting creatures = -1/-1 counters (permanent).
  WITHER VS. INFECT:
    Infect: replaces damage to players (poison) AND to creatures (-1/-1 counters).
    Wither: replaces damage to creatures (-1/-1 counters) but leaves player damage as normal.
    Infect has BOTH parts. Wither has only the creature part.
    In competitive play: infect was far more powerful because it ignores life totals.
    Wither: still useful in creature combat (permanent P/T reduction rather than just marked damage).

TOXIC (702.164a–c):
  WHAT IT DOES (KEY DIFFERENCE FROM INFECT):
    Toxic gives poison counters ON TOP OF normal damage. NOT instead of.
    "Combat damage dealt to a player by a creature with toxic causes... [player gets] poison counters
      equal to that creature's total toxic value, IN ADDITION TO the damage's other results."
    So: toxic 2 creature deals 3 combat damage to a player:
      Player loses 3 life (normal damage).
      AND: player gets 2 poison counters (toxic effect).
      BOTH happen.
    Compare: infect 3 creature deals 3 damage to a player:
      Player takes 0 life loss (all converted to poison).
      Player gets 3 poison counters.
    TOXIC: double threat (life loss AND poison counters).
    INFECT: single alternative currency (only poison, no life loss).
  TOXIC ONLY TRIGGERS FROM COMBAT DAMAGE:
    702.164c: "Combat damage" — only works from combat.
    Non-combat damage from toxic creatures doesn't give poison counters.
    Contrast: infect works for ALL damage (combat and non-combat, from any zone — 702.90e).
  TOTAL TOXIC VALUE (702.164b):
    If a creature has multiple toxic abilities (e.g., toxic 2 and gains toxic 1):
      Total toxic value = 2 + 1 = 3. It gives 3 poison counters per hit.
    702.164b example: "If a creature with toxic 2 gains toxic 1, its total toxic value is 3."

POISON COUNTERS AND GAME LOSS:
  Ten poison counters = immediate game loss (SBA 704.5c).
  This checks any time SBAs are checked (before priority is given).
  "If a player has ten or more poison counters, that player loses the game."
  Can't be prevented by life gain (poison counters ≠ life).
  Can't be healed away directly (few cards remove poison counters).
  REMOVING POISON COUNTERS:
    Very rare. A few cards specifically remove poison counters:
      Leeches ({3}{W}: "Target player loses all poison counters." — very old card)
      Witch-Maw Nephilim and various proliferate opponents also add.
    Most gameplay assumes poison counters are permanent and race to 10.

PROLIFERATE (701.34a):
  WHAT IT DOES:
    Choose any number of permanents and/or players WITH a counter.
    Give each one additional counter of each kind they already have.
    "Each kind" = if a permanent has three types of counters, it gets one more of each type.
    "Any number" = zero or more. Choosing zero is legal (effectively does nothing).
  KEY WITH POISON:
    A player with 5 poison counters + you proliferate → they now have 6 poison.
    Proliferate again: 7. Again: 8. Again: 9. Again: 10 → they lose.
    5 proliferates from 5 poison = game over. (But each proliferate needs a card/ability.)
  PROLIFERATE AND PLANESWALKERS:
    Planeswalkers have loyalty counters. Proliferate can add loyalty to your planeswalkers.
    Or: add -1/-1 counters to opponent creatures (if they already have some).
    Or: advance charge counters, time counters, etc.
  CARDS WITH PROLIFERATE:
    Contentious Plan ({1}{U}): "Proliferate. Draw a card." — best proliferate card (draws too).
    Karn's Bastion: Land — "Proliferate." — free proliferate each turn.
    Tezzeret's Gambit ({2}{U/P}): "Proliferate. Draw 2 cards." — phyrexian mana version.
```

## Definitive Conclusions

- **Infect converts ALL damage: to players = poison counters (no life loss); to creatures = -1/-1 counters (no marked damage)** — life gain doesn't help against infect; the permanent counter on creatures can't be undone by time.
- **Wither only converts creature damage** — players still take normal life loss from wither sources; wither is infect's "creature-only" cousin.
- **Toxic gives poison counters IN ADDITION TO normal damage** — players lose life AND get poison counters; unlike infect which replaces life loss with poison; toxic only works from combat damage.
- **Ten poison counters = game loss (SBA)** — checked whenever SBAs are checked; can't survive at 10+ poison.
- **Proliferate can advance poison counters** — any player already poisoned can be proliferated toward the loss threshold; very powerful with existing poison strategies.
- **-1/-1 counters from infect/wither are permanent** — they don't clear at end of turn (unlike marked damage); they can cancel +1/+1 counters (SBA 704.5r).

## Canonical Example
**Blighted Agent Infect Kill:**
Turn 1: Cast Blighted Agent ({1}{U}): 1/1 with infect and "Blighted Agent is unblockable."
Turn 2: Blighted Agent attacks (it's not new — entered last turn, has no summoning sickness this turn).
  Blighted Agent is unblockable. Deals 1 infect combat damage to opponent.
  Infect: instead of life loss, opponent gets 1 poison counter.
  Opponent is at 20 life, 1 poison counter.
Turn 3: Attack again. 2 poison counters. Pump with Mutagenic Growth ({2} or 2 life, gives +2/+2):
  Pay 2 life. Agent becomes 3/3. Deals 3 infect damage. +3 poison counters = 5 total.
  Wait: must choose: pay 2 life or {G}{G}. Pay 2 life (Phyrexian mana).
Turn 4: Attack. Cast Giant Growth ({G}): +3/+3. Agent is 4/4. Deals 4 infect damage.
  5 + 4 = 9 poison. One more point and opponent loses.
  OR: Mutagenic Growth again (2 life): Agent is 5/5. Deals 5 infect damage → 10 total.
  Opponent has 10 poison. SBA: loses the game.
  Opponent is still at 14 life (20 - 2 - 4 = 14 from the Mutagenic costs). Life is irrelevant.

The infect kill happens at 14 opponent life. Normal aggro would need 14 more damage.
Infect decks run on an entirely different clock.

Note: opponent can interact — blocking (except Blighted Agent is unblockable), kill the Agent, damage prevention — but infect damage that does land converts entirely to poison counters.

**Example 2 — Toxic vs. Infect: Phyrexian Crusader vs. Jawbone Duelist:**
Phyrexian Crusader ({1}{B}{B}): "First strike, protection from red, protection from white. Infect."
  Hits opponent for 2: 0 life lost, 2 poison counters.
  Pure infect — racing to 10 on poison counter track only.

Jawbone Duelist ({1}{W}): "Double strike. Toxic 1."
  Hits opponent for 2 (double strike, 1 power, deals first-strike damage + regular damage = 2 total):
    Damage: opponent loses 2 life.
    Toxic 1: opponent gets 1 poison counter from first-strike combat damage.
    Wait: does toxic trigger once per combat or once per damage step?
    702.164c: "Combat damage dealt to a player by a creature with toxic."
    Each time combat damage is dealt: the toxic effect applies.
    Double strike deals damage in first strike step AND regular damage step.
    Each step: 1 damage + 1 toxic 1 trigger = 1 poison counter per step = 2 poison counters total?
    Wait: the 702.164c says the poison counters equal "the creature's total toxic value" per combat damage event.
    With double strike: there are two separate combat damage events (two damage steps).
    Each event: 1 damage dealt + 1 poison counter (toxic 1 fires for each separate combat damage event).
    So: Jawbone Duelist with double strike = 2 life lost + 2 poison counters per attack (unblocked).
  Jawbone Duelist is DOUBLE threat: opponent loses life AND gains poison each turn.
  At 5 turns attacking unblocked: opponent lost 10 life AND has 10 poison counters. Game over by either track.

Infect-only strategies: ignore life, race to 10 poison.
Toxic strategies: dual-track pressure (can win via life OR via poison).

## Commonly Confused With
- **P352 (Lifelink/Deathtouch)** — Infect changes HOW damage resolves (to counters), but the damage event still occurs. Lifelink is a static ability that gains life when the source deals damage — if an infect creature has lifelink, the "damage" still "occurs" as converted-to-poison-counters, and lifelink still triggers (you gain life equal to the damage dealt, even as poison counters). Deathtouch + infect: deathtouch kills with any damage; infect converts that damage to -1/-1 counters on the creature — the creature still "received" the damage for deathtouch purposes (1 damage = lethal).
- **P351 (Persist/Undying)** — Infect damage to creatures puts -1/-1 counters. This interacts with persist (which requires no -1/-1 counters to trigger return). An infect attacker hitting a persist creature breaks persist on the next death (the -1/-1 counter blocks the persist return). Undying needs no +1/+1 counters; infect damage's -1/-1 counters cancel out undying's +1/+1 counters when the undying creature returned with a +1/+1 is hit for 1 infect.
- **P002 (Replacement Effects)** — Infect's "damage to player = poison" is a replacement effect (120.3b): the damage is replaced with giving poison counters. Prevention effects can prevent this damage before the replacement applies (you prevent damage before any replacement takes effect — if the infect damage is prevented, no counters are given).
- **P004 (Layer System)** — Giving a creature infect (via an effect) applies to the creature in Layer 6 (ability-adding). A creature gaining infect and losing it are tracked in Layer 6 by timestamp.
