---
id: p259
name: Afflict, Mentor, Afterlife, and Training — Combat and Death Triggered Counters
category: triggered
cr_refs: [702.130a, 702.134a, 702.135a, 702.149a]
tags: [afflict, mentor, afterlife, training, triggered, combat, death, counter, Amonkhet, Guilds-of-Ravnica, Orzhov, Ixalan, Sunrise-Sovereign, Teysa-Karlov]
created: 2026-03-28
examples_count: 2
---

# P259 — Afflict, Mentor, Afterlife, and Training — Combat and Death Triggered Counters

## Abstract
Four smaller mechanics clustered around combat and death triggers. **Afflict N**: when this creature becomes blocked, the defending player loses N life — punishing blocking. **Mentor**: when this creature attacks, put a +1/+1 counter on another attacking creature with less power — rewards attacking with a "big + small" combination. **Afterlife N**: when this creature dies, create N 1/1 white/black Spirit tokens with flying — death generates tokens. **Training**: when this creature and a more powerful creature attack together, this creature gets a +1/+1 counter — rewards attacking in formation.

## The Definitive Rules

**CR 702.130a** (verbatim): *"Afflict is a triggered ability. 'Afflict N' means 'Whenever this creature becomes blocked, defending player loses N life.'"*

**CR 702.134a** (verbatim): *"Mentor is a triggered ability. 'Mentor' means 'Whenever this creature attacks, put a +1/+1 counter on target attacking creature with power less than this creature's power.'"*

**CR 702.135a** (verbatim): *"Afterlife is a triggered ability. 'Afterlife N' means 'When this permanent is put into a graveyard from the battlefield, create N 1/1 white and black Spirit creature tokens with flying.'"*

**CR 702.149a** (verbatim): *"Training is a triggered ability. 'Training' means 'Whenever this creature and at least one other creature with power greater than this creature's power attack, put a +1/+1 counter on this creature.'"*

## The Pattern

```
AFFLICT:
  Triggered: "whenever this creature becomes blocked"
  Effect: defending player loses N life
  Fires every time the creature is blocked (not just the first time)
  If the afflict creature attacks multiple turns and is blocked: each block triggers Afflict
  "Becomes blocked": fires when a blocker is declared for this creature

  AFFLICT + EVASION:
    If the creature is unblocked: Afflict never triggers
    Afflict is designed to make blocking lose-lose: block → take damage from Afflict + possible die in combat
    Don't block → take combat damage from the creature
    A 2/2 Afflict 3: block it (lose 3 life + take combat trades) OR let it through (take 2 damage).
    The opponent chooses between: "lose 3 life now" or "take 2 damage now."

  AFFLICT + MULTIPLE BLOCKERS:
    "Becomes blocked" fires ONCE (not per blocker)
    Even if 3 creatures block an Afflict creature: Afflict fires once (3 damage doesn't scale per blocker)

  AFFLICT CARDS (Amonkhet):
    Afflict appears on Hazoret the Fervent ({3}{R}): 5/4 Indestructible, Afflict 3. Block Hazoret → lose 3 life.
    Combat math: block a 5/4 with your 4/4 → die AND lose 3 life. Don't block → take 5 damage. Terrible either way.
    Ammit Eternal ({2}{B}): 5/5, Afflict 3, "whenever an opponent casts a spell, put a -1/-1 counter here."

MENTOR:
  Triggered: "whenever this creature attacks"
  Target: another attacking creature with POWER LESS THAN this creature's power
  Effect: put a +1/+1 counter on the target
  The mentor creature itself doesn't get a counter — it upgrades others
  "Power less than": strict less than, not equal to

  MENTOR + CHAIN:
    Multiple mentor creatures attacking: chain of upgrades
    6/6 mentor → targets 4/4 (power less than 6) → 4/4 becomes 5/5.
    5/5 mentor → targets 3/3 → 3/3 becomes 4/4.
    Building the whole attacking force with counters through chained mentors.

  MENTOR + SAME POWER:
    Mentor can't target a creature with the SAME power as the mentor
    "Less than" is strict: a 3/3 mentor can target a 2/2 but not another 3/3
    If opponent buffs the target to equal mentor's power: no longer a valid target? If target becomes invalid between trigger and resolution, trigger fizzles.

  MENTOR CARDS (Guilds of Ravnica):
    Tajic, Legion's Edge ({1}{R}{W}): 3/2 First Strike Haste, Mentor, "damage to non-Commander creatures deals 1 damage instead" (sort of).
    Boros-themed mentor deck: swing with large attackers, chain mentor counters to smaller creatures.
    Adanto Vanguard + Tajic: pump the Vanguard.

AFTERLIFE:
  Triggered: "when this permanent is put into a graveyard from the battlefield"
  Effect: create N 1/1 white and black Spirit creature tokens with flying
  Similar to dying: any death triggers Afterlife (combat, sacrifice, removal)
  Tokens have flying: good aerial coverage from dying creatures

  AFTERLIFE + DOUBLING:
    Teysa Karlov ({2}{W}{B}): "if a creature dying causes a triggered ability to trigger, that ability triggers an extra time."
    Afterlife 1 + Teysa: creature dies → Afterlife triggers → 2 Spirit tokens (doubled)!
    Afterlife 2 + Teysa: creature dies → 4 Spirit tokens.
    Orzhov Teysa Afterlife deck: flood the board with Spirit tokens.

  AFTERLIFE + SACRIFICE SYNERGY:
    Afterlife rewards intentional sacrifice: sacrifice for effects → get spirit tokens as compensation
    Viscera Seer + Afterlife creatures: sacrifice to scry → get flying tokens → sacrifice those too

  AFTERLIFE CARDS (Ravnica Allegiance):
    Tithe Taker ({1}{W}): 2/1, Afterlife 1. "During your turn, spells and abilities opponents control cost {1} more."
    Corpse Knight ({W}{B}): "whenever another creature enters under your control, each opponent loses 1 life." → Afterlife triggers → tokens enter → drain.
    Ministrant of Obligation ({2}{W}): 2/1 Afterlife 2 — dies → 2 Spirit tokens.

TRAINING:
  Triggered: "whenever this creature and at least one other creature with power greater than this creature's power attack"
  Effect: put a +1/+1 counter on this creature
  The creature needs to attack alongside (not alone) a more powerful creature
  "Greater than this creature's power": the OTHER attacking creature must have higher power

  TRAINING + CHAINING:
    Training 2/2 attacks with 4/4: 2/2 becomes 3/3.
    Next turn: training 3/3 attacks with 4/4 (still greater power): becomes 4/4.
    Next turn: training 4/4 attacks with 4/4: NOT triggered (4 is not greater than 4).
    Training has a ceiling: the creature stops growing when it matches or exceeds its "training partner."

  TRAINING CARDS (Innistrad: Midnight Hunt):
    Tenured Inkcaster ({3}{B}): Training. When trained, deal 1 damage to any target.
    Willow Geist ({G}): Training. Growing 1/1 that gains counters alongside bigger allies.
```

## Definitive Conclusions

- **Afflict fires once when blocked** (not per blocker) — creates "block and lose life vs. don't block" dilemma.
- **Mentor upgrades another attacking creature with less power** — chains through a full attack step.
- **Afterlife creates Spirit tokens on death** — Teysa Karlov doubles Afterlife tokens.
- **Training accumulates counters** when attacking alongside more powerful creatures — hits a growth ceiling at equal power.

## Canonical Example
**Teysa Karlov + Afterlife Orzhov Tokens:**
Battlefield: Teysa Karlov ({2}{W}{B}), Tithe Taker (2/1, Afterlife 1), Ministrant of Obligation (2/1, Afterlife 2).
Opponent plays Wrath of God: all creatures die simultaneously.
Tithe Taker dies: Afterlife 1 triggers → Teysa doubles it → 2 Spirit tokens created.
Ministrant dies: Afterlife 2 triggers → Teysa doubles it → 4 Spirit tokens created.
After the wipe: 6 1/1 flying Spirit tokens from two dead creatures.
Opponent's Wrath replaced your 2 creatures with 6 fliers. Board state is better after the wipe!

**Example 2 — Mentor Combat Chain:**
Attacking with: Tajic, Legion's Edge (3/2 mentor), Adanto Vanguard (2/1), Goblin token (1/1).
Tajic attacks: Mentor triggers. Target Adanto Vanguard (power 2 < Tajic's 3). Adanto Vanguard becomes 3/2.
Adanto Vanguard (now 3/2) has mentor? No — only Tajic has mentor in this example.
But if both had mentor: next trigger: Adanto Vanguard (3/2) targets Goblin token (1/1 < 3). Goblin becomes 2/2.
Three attackers all get upgraded from one Tajic mentor trigger + one Vanguard mentor.

## Commonly Confused With
- **P225 (Heroic)** — Heroic triggers on being targeted; Mentor triggers when ATTACKING (no targeting of the mentor needed).
- **P227 (Wither)** — Wither deals damage as -1/-1 counters; Afterlife puts +1/+1 counters on TOKENS when a creature DIES.
- **P173 (Exalted)** — Exalted triggers when attacking alone; Training requires attacking WITH at least one more powerful creature.
