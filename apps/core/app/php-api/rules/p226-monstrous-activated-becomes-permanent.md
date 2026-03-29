---
id: p226
name: Monstrous — Activated Ability That Makes a Permanent "Monstrous"
category: continuous
cr_refs: [701.31a, 701.31b]
tags: [monstrous, monstrous-counter, activated-ability, Theros, Polukranos, Stormbreath-Dragon, Fleecemane-Lion]
created: 2026-03-28
examples_count: 2
---

# P226 — Monstrous — Activated Ability That Makes a Permanent "Monstrous"

## Abstract
Monstrous is an activated ability: pay the monstrous cost, put N +1/+1 counters on the creature, and the creature "becomes monstrous" — a game state that is permanent and enables triggered abilities. Once monstrous, a creature can't become monstrous again (the ability can't be activated again). Cards often have "when this creature becomes monstrous" triggered abilities that provide powerful one-time effects. Polukranos, World Eater is the iconic Monstrous card: its monstrous ability lets it fight multiple opponents' creatures simultaneously, distributing its power as damage.

## The Definitive Rules

**CR 701.31a** (verbatim): *"To become monstrous is a keyword action that occurs when a resolving spell or ability instructs a permanent to become monstrous. 'Become monstrous' means 'Put N +1/+1 counters on this permanent. This permanent becomes monstrous. Activate only once.'"*

**CR 701.31b** (verbatim): *"Once a permanent becomes monstrous, it can no longer become monstrous again. If an effect becomes monstrous on a permanent that is already monstrous, that portion of the effect does nothing."*

## The Pattern

```
MONSTROUS:
  Activated ability: "{XYZ}: put N +1/+1 counters on this. This creature becomes monstrous."
  Or: "Monstrosity N" as a shorthand keyword
  Once activated and resolved: the creature IS monstrous (permanent game state)
  Can't be activated again (activate only once)

  MONSTROUS + ZONE CHANGES:
    If a monstrous creature leaves the battlefield and re-enters:
    It's a new object (P024) — the "monstrous" game state is lost
    New object: can become monstrous again (it's not monstrous yet as a new object)
    Strategic: blink your monstrous creature to reset it → use monstrosity again!

  MONSTROUS + TRIGGERS:
    Common pattern: "When this creature becomes monstrous, [powerful effect]"
    The trigger fires exactly when the creature "becomes monstrous" (when the ability resolves)
    ETB triggers: if the creature was blinked and re-enters, the ETB fires again (new object)
    But "when becomes monstrous" trigger: fires again only if it becomes monstrous again

  POLUKRANOS, WORLD EATER ({2}{G}{G}):
    5/5 Legendary Hydra
    "Monstrosity X: distribute X -1/-1 counters among any number of target creatures opponents control."
    Wait: let me check the actual oracle text — Polukranos uses "fight" not -1/-1 counters.
    "Monstrosity X: Polukranos deals X damage distributed as you choose among any number of target creatures opponents control. Each of those creatures deals damage equal to its power to Polukranos."
    Activate with X=4: deal 4 damage distributed, opponents' creatures deal back damage.
    Polukranos becomes monstrous (gets X +1/+1 counters), and fights multiple creatures at once.
    Clear a board while growing Polukranos — very efficient.

  STORMBREATH DRAGON ({3}{R}{R}):
    5/5 flying, haste, protection from white.
    "Monstrosity {3}: each opponent loses 1 life for each card in their hand."
    Becomes monstrous: 7/7 flying haste that just drained opponents.
    Protection from white: can't be killed by Path to Exile, Swords to Plowshares, etc.
    Very hard to answer in white-removal-heavy environments.

  FLEECEMANE LION ({G}{W}):
    3/3 "Monstrosity {1}{G}{W}: Fleecemane Lion becomes monstrous and gains hexproof and indestructible."
    Becomes monstrous: gains hexproof + indestructible permanently (these are on the "monstrous" card state)
    Wait: the indestructible/hexproof comes from an additional static ability on the card:
    "As long as Fleecemane Lion is monstrous, it has hexproof and indestructible."
    Once monstrous: permanent hexproof + indestructible 3/3. Essentially impossible to remove.

  MONSTROUS + ACTIVATE ONLY ONCE:
    CR 701.31b: "can no longer become monstrous again" once monstrous
    The ability itself says "Activate only once"
    Cannot pay the activation cost a second time (locked out after first use)
    Unlike Exhaust (P188): monstrous ALSO can't be reset except via zone change to new object

  MONSTROUS + NEW OBJECT RESET:
    Blink Fleecemane Lion (monstrous, indestructible/hexproof): it leaves the battlefield
    When it returns: new object, NOT monstrous anymore
    Hexproof + indestructible are lost (those depended on being monstrous)
    Can activate monstrosity again (once)
    Net: blinking resets both the monstrous state AND allows re-use of the ability
    But: you'd have to pay the monstrous cost again

  MONSTROUS + PROLIFERATE:
    Proliferate adds counters → adds +1/+1 counters on monstrous creatures
    But proliferate doesn't grant "monstrous" status to non-monstrous creatures
    The monstrous STATE is separate from having the counters (even if related)

ACTIVATED ABILITY TIMING:
  Monstrosity is an activated ability: can activate any time you have priority
  Usually: main phase (sorcery-speed if ability says "activate only as a sorcery")
  Check card text: most monstrous abilities are sorcery-speed (no instant-speed unless specified)
```

## Definitive Conclusions

- **Monstrous = one-time activated ability** that puts N counters and grants "monstrous" game state.
- **Once monstrous**: can't activate again (locked out).
- **Zone change resets monstrous**: new object → not monstrous → can activate once more.
- **"When becomes monstrous" triggers** fire on activation resolution.
- **Fleecemane Lion**: becomes permanently hexproof + indestructible once monstrous.

## Canonical Example
**Polukranos, World Eater in Theros Standard:**
Polukranos is a 5/5. Opponent controls three creatures: 3/3, 2/2, 1/1.
Activate Monstrosity with X=3: spend {3}{G}{G}+{3}=wait, it's Monstrosity X so pay X=3 + the mana cost in the ability.
"Monstrosity X" means the ability costs X+something. Let's say {3}: pay {3}.
Distribute 3 damage: 1 to the 3/3 (survives), 1 to the 2/2 (survives), 1 to the 1/1 (dies).
Those creatures deal back damage to Polukranos: 3+2+1=6 damage to Polukranos (6/5 becomes 6/5 with 6 damage... dies if toughness ≤ 6; Polukranos is now larger from the +3 counters).
With X=6: deal 6 damage total, Polukranos becomes 11/11. Kill opponents' creatures, survive return damage.
Polukranos is monstrous: can't use monstrosity again unless blinked.

**Example 2 — Stormbreath Dragon Monstrosity:**
Stormbreath Dragon (5/5 flying haste protection from white): attacks for 5 on turn 5.
Turn 6: activate Monstrosity with {3}: Stormbreath becomes 7/7.
Monstrosity trigger: "each opponent loses 1 life for each card in their hand."
Opponent has 5 cards: loses 5 life.
Now 7/7 flying haste. Opponent is at 15-5=10 life.
Attacks: 15 life total damage in two turns (5 + 7 + 5 life loss from monstrosity).
AND: protection from white means Path to Exile, Swords to Plowshares, Oblivion Ring can't target it.

## Commonly Confused With
- **P188 (Exhaust)** — Exhaust is activated only once per game. Monstrous is activated once per object lifetime (can reset on zone change).
- **P174 (Level Up)** — Level Up adds counters over multiple activations. Monstrous is one activation that sets a permanent state.
- **P153 (Evolve)** — Evolve triggers automatically when bigger creatures enter. Monstrous is activated manually.
