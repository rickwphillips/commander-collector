---
id: p142
name: Battle Cry, Outlast, and Dethrone — Attack and Counter Mechanics
category: combat
cr_refs: [702.91a, 702.91b, 702.107a, 702.105a, 702.105b]
tags: [battle-cry, outlast, dethrone, attack, counter, power, sorcery-speed, life-total, multiplayer]
created: 2026-03-28
examples_count: 3
---

# P142 — Battle Cry, Outlast, and Dethrone — Attack-Based and Counter Mechanics

## Abstract
Three mechanics that interact with attacking and counters. **Battle Cry** pumps all other attackers when this creature attacks. **Outlast** is a sorcery-speed tap-to-add-counter ability for sustained growth. **Dethrone** rewards attacking the player with the most life by giving the attacker a +1/+1 counter. All three synergize with aggressive strategies.

## The Definitive Rules

**CR 702.91a** (verbatim): *"'Battle cry' means 'Whenever this creature attacks, each other attacking creature gets +1/+0 until end of turn.'"*

**CR 702.107a** (verbatim): *"'Outlast [cost]' means '[Cost], {T}: Put a +1/+1 counter on this creature. Activate only as a sorcery.'"*

**CR 702.105a** (verbatim): *"'Dethrone' means 'Whenever this creature attacks the player with the most life or tied for most life, put a +1/+1 counter on this creature.'"*

## The Pattern

```
BATTLE CRY:
  Triggered attack ability
  When THIS creature attacks: each OTHER attacking creature gets +1/+0 until end of turn
  Note: the battle cry creature itself does NOT get +1/+0 from its own battle cry
  Multiple battle cry creatures: each triggers separately → additive bonuses
  Two battle cry creatures: each other gets +2/+0 (+1 from each trigger)
    Actually: Creature A's battle cry gives +1/+0 to Creature B and all others
    Creature B's battle cry gives +1/+0 to Creature A and all others
    Both A and B get +1/+0 from the other's battle cry

  BATTLE CRY TIMING:
    Triggers when declared as attacker → resolves before damage
    All other attackers at time of resolution get the bonus

OUTLAST:
  Activated ability: [Cost], {T}: Put a +1/+1 counter on this creature
  Activate only as a sorcery: main phase only, stack empty
  Requires tapping: the creature must be untapped to outlast
  Summoning sickness: a creature with summoning sickness can't tap for outlast
  (Unless it has haste → but haste + outlast is unusual)

  OUTLAST ONCE PER TURN LIMIT:
    Once per turn: after outlasting, the creature is tapped
    Can't outlast again until untapped (natural untap step)

  OUTLAST + VIGILANCE:
    A vigilance creature that attacks stays untapped
    After combat: still untapped → can outlast in postcombat main phase
    Attack AND outlast in the same turn!

  OUTLAST PAYOFFS:
    Many Khans of Tarkir cards have abilities that trigger based on outlast counters
    "Creatures you control with counters get +1/+1" etc.

DETHRONE:
  Triggers when this creature attacks the player with the MOST life (or tied for most)
  Effect: put a +1/+1 counter on this creature
  Conditions: which player has the most life is checked when the trigger resolves

  DETHRONE + MULTIPLAYER:
    In multiplayer (Commander): "player with most life" changes over time
    If two players are tied for most life: attacking EITHER of them triggers dethrone
    If the player you're attacking is NOT the highest-life player: no trigger

  DETHRONE + VOTING:
    If opponent on Monarch gains additional life and you attack them: triggers
    In Commander, players with high life totals are dethrone targets

  DETHRONE + CARD: Marchesa, the Black Rose
    Marchesa has dethrone AND "whenever a creature with a +1/+1 counter on it dies, return it to battlefield under your control"
    The combo: give any creature a counter (via dethrone or other) → when it dies → return to battlefield
    Essentially: all your creatures with counters have "undying" while Marchesa is out

DETHRONE LIFE CHECK TIMING:
  Condition "player with most life" checked at resolution (not just at trigger time)
  If the player's life changes between trigger and resolution: may affect whether the condition is met
  (Standard intervening-if rules may apply — but dethrone text doesn't explicitly use "if" clause)
```

## Definitive Conclusions

- **Battle cry gives +1/+0 to OTHER attackers** — not itself. Multiple battle cries stack.
- **Outlast requires tapping, sorcery speed.** Vigilance enables attack + outlast same turn.
- **Dethrone gives +1/+1 when attacking the highest-life player.** Multiplayer payoff.
- **Marchesa, the Black Rose** uses dethrone to build a counter on herself, then grants return-from-death to all creatures with counters.

## Canonical Example P142a — Battle Cry:
**Champion of the Parish (no battle cry) + Signal Pest (Battle Cry 1/1):**
Declare both as attackers. Signal Pest's battle cry triggers: Champion of the Parish gets +1/+0 until end of turn.
Champion attacks as a 2/1 (1/1 base + 1/+0 from Signal Pest's battle cry).

**Example P142b — Outlast:**
Ainok Bond-Kin (Outlast {W}):
First main phase: pay {W}, tap it → +1/+1 counter on Ainok Bond-Kin.
Now 2/2 with first strike (assuming Outlast payoff). Next turn: untap → outlast again → 3/3 with first strike.

**Example P142c — Dethrone + Marchesa:**
Marchesa, the Black Rose (Dethrone) attacks opponent at 25 life (you have 15, opponent has 20, another player has 25).
Your life ≤ 25 (tied for most or below): target the 25-life player → dethrone triggers → Marchesa gets +1/+1 counter.
Now Marchesa has a counter → "whenever a creature with a +1/+1 counter on it dies, return it to battlefield under your control" applies to Marchesa herself.

## Commonly Confused With
- **P076 (Mentor)** — Mentor gives counters to OTHER attackers with lower power. Battle cry gives +1/+0 to all other attackers. Both are attack triggers but different targets.
- **P071 (Prowess)** — Prowess pumps the prowess creature itself when you cast spells. Outlast grows via tapping. Both grow creatures, different timing.
- **P077 (Evolve)** — Evolve grows when bigger creatures enter. Dethrone grows when attacking the right opponent. Both give counters from triggered conditions.
