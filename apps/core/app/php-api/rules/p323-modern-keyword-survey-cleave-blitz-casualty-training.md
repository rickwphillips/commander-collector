---
id: p323
name: Modern Keyword Survey — Cleave, Blitz, Casualty, Training, Backup, Toxic
category: costs
cr_refs: [702.148a, 702.149a, 702.152a, 702.153a, 702.154a, 702.164a, 702.165a]
tags: [cleave, blitz, casualty, training, backup, toxic, compleated, reconfigure, enlist, squad, text-changing, alternative-cost, additional-cost, Innistrad-Crimson-Vow, Streets-of-New-Capenna, Phyrexia-All-Will-Be-One, March-of-the-Machine]
created: 2026-03-29
examples_count: 2
---

# P323 — Modern Keyword Survey — Cleave, Blitz, Casualty, Training, Backup, Toxic

## Abstract
A survey of keywords introduced in 2021–2023 across multiple sets. **Cleave**: alternative cost that removes bracketed text from the spell. **Blitz**: alternative cost for haste + draw a card on death + sacrifice at end of turn. **Casualty**: additional cost sacrifice creates a copy of the spell. **Training**: grows creatures when attacking with bigger allies. **Backup**: ETB that shares abilities with another creature until end of turn. **Toxic**: deals poison counters from combat damage in ADDITION to normal damage. Each has specific rules covering what "the cost" entails and its precise effects.

## The Definitive Rules

**CR 702.148a** (verbatim): *"'Cleave [cost]' means 'You may cast this spell by paying [cost] rather than paying its mana cost' and 'If this spell's cleave cost was paid, change its text by removing all text found within square brackets in the spell's rules text.'"*

**CR 702.149a** (verbatim): *"Training is a triggered ability. 'Training' means 'Whenever this creature and at least one other creature with power greater than this creature's power attack, put a +1/+1 counter on this creature.'"*

**CR 702.152a** (verbatim): *"'Blitz [cost]' means 'You may cast this card by paying [cost] rather than its mana cost,' 'If this spell's blitz cost was paid, sacrifice the permanent this spell becomes at the beginning of the next end step,' and 'As long as this permanent's blitz cost was paid, it has haste and "When this permanent is put into a graveyard from the battlefield, draw a card."'"*

**CR 702.153a** (verbatim): *"Casualty N means 'As an additional cost to cast this spell, you may sacrifice a creature with power N or greater,' and 'When you cast this spell, if a casualty cost was paid for it, copy it. If the spell has any targets, you may choose new targets for the copy.'"*

**CR 702.164a** (verbatim): *"Toxic is a static ability. It is written 'toxic N,' where N is a number."*

**CR 702.164c** (verbatim): *"Combat damage dealt to a player by a creature with toxic causes that creature's controller to give the player a number of poison counters equal to that creature's total toxic value, in addition to the damage's other results."*

**CR 702.165a** (verbatim): *"'Backup N' means 'When this creature enters, put N +1/+1 counters on target creature. If that's another creature, it also gains the non-backup abilities of this creature printed below this one until end of turn.'"*

## The Pattern

```
CLEAVE (Innistrad: Crimson Vow):
  Cards with Cleave have bracketed text: "[not] target" or "[each/target]."
  Example: Dig Up ({B} or Cleave cost {3}{B}{G}):
    Normal cast: "Search for a basic land card."
    Cleave cast (pay {3}{B}{G}): removes [basic land card] → searches for ANY card.
  The brackets indicate what's removed when Cleave is paid.
  Normal cast: weaker but cheaper. Cleave cast: powerful but expensive.
  Thirst for Discovery ({2}{U}, Cleave {4}{U}):
    Normal: "Draw 3 cards, then discard 2."
    Cleave: removes "discard 2" → "Draw 3 cards." (No discard when cleaved.)
  The alternative cost rules apply: paying Cleave cost means NOT paying the normal cost.
  The text-changing effect is applied while the spell is on the stack.

BLITZ (Streets of New Capenna):
  An alternative cost for "speed casting" for temporary advantage.
  "Blitz [cost]": pay the blitz cost to get:
    1. Haste (can attack immediately).
    2. Sacrifice at beginning of next end step.
    3. When sacrificed (put into GY from battlefield): draw a card.
  Net: spend the blitz cost → get an immediate attacking creature → draw a card.
  Effectively trades the permanent for haste + card draw (but you paid mana for a temp creature).
  When is this good? When the creature's attack deals enough damage to justify the trade.
  Or: when you need one turn of a powerful body.
  Example: Hypnotic Grifter ({U}{B}, Blitz {2}{U}{B}): 2/1. Blitz gives haste + draw.
    Normal: {U}{B}. Enters without haste. Must wait a turn.
    Blitz: pay {2}{U}{B}, attacks immediately, then goes to GY drawing a card.
    {2}{U}{B} total for one attack + a card. Usually worse than just casting normally.
    But: some Blitz creatures are situationally very powerful for that one turn.

CASUALTY (Streets of New Capenna):
  Additional cost: sacrifice a creature with power ≥ N.
  If you pay the casualty cost: the spell is COPIED.
  The copy is put on the stack — you may choose new targets for it.
  This is powerful: sacrifice a creature → get the spell's effect twice.
  Casualty 2: sacrifice a 2+ power creature.
  Casualty 1: sacrifice any creature with power 1+.
  Example: Body Count ({B}, Casualty 1): "Draw a card for each creature that died this turn."
    Pay Casualty 1 (sacrifice a creature): get TWO copies of Body Count.
    Each draws a card for each creature that died this turn.
    The sacrificed creature itself counts as dying → each copy draws at least 1 card.
    With a large board that just died to a board wipe: two Body Counts for {B} + sacrifice.

  IMPORTANT: The copy is created when you cast the spell (triggered by paying the additional cost).
  The copy is put on the stack on top of the original.
  Resolve the copy first (LIFO). Then resolve the original.

TRAINING (Innistrad: Crimson Vow):
  Triggered: "whenever this creature and at least one other creature with greater power attack."
  Each attack where a more-powerful ally attacks too: put a +1/+1 counter on this creature.
  "Greater power" = at the time the training trigger would trigger.
  Note: the training creature must actually be attacking AND another creature with more power is also attacking.
  Build a "mixed power" attacking team → smaller creatures train up.
  Champion of the Perished (Zombie lord, 1/1, "whenever a Zombie enters, gets +1/+1") doesn't have training.
  Training example: Hopeful Initiate ({W}): 1/1. Training. "When Hopeful Initiate trains, you may pay {2} and remove a counter from it to destroy an artifact or enchantment."
    Attack with 1/1 Initiate alongside a 3/3 Human: training triggers → Initiate becomes 2/2.
    Also: "when this creature trains" ability triggers → option to destroy artifact/enchantment.

BACKUP (March of the Machine):
  "Backup N" on ETB: put N +1/+1 counters on target creature.
  If the target is ANOTHER creature (not itself): it also gains all of this creature's non-backup abilities until EOT.
  Important: can target itself (but doesn't gain abilities targeting yourself — only if it's another creature).
  Backup 1 example: Tangled Skyline ({4}{G}): 0/0, Backup 1. Has "flying, reach, trample, vigilance."
    Enters: put 1 counter on target creature. If it's another creature: that creature gets flying, reach, trample, vigilance until EOT.
    The Backup creature itself: also gets 1 counter on it if targeting another creature.
    Wait: the N counters go on the TARGET, not on the Backup creature itself.
    If targeting ITSELF: get N counters. No abilities granted (can't grant abilities to itself).
    If targeting ANOTHER creature: that creature gets N counters AND the non-backup abilities.
  This is a "give your team keywords for a turn" mechanic.

TOXIC (Phyrexia: All Will Be One):
  Toxic N: when this creature deals combat damage to a player, give that player N poison counters.
  This is IN ADDITION to normal damage (unlike infect which replaces damage with counters).
  Compare with Infect (see P325 if created): Infect replaces damage entirely.
  Toxic: still deals damage AND gives poison counters.
  Player loses at 10+ poison counters.
  Toxic 1 = 1 poison counter per combat connection.
  With multiple toxic creatures hitting the same player: poison counters accumulate.
  Example: Venerated Rotpriest ({1}{G}): 1/2. "Whenever a spell you control targets one of
    your creatures, target opponent gets a poison counter."
    This works with Backup (Backup targets a creature you control, Venerated Rotpriest triggers).

RECONFIGURE (Kamigawa: Neon Dynasty):
  Equipment keyword: attach and detach like a living creature.
  When unattached: it's a creature (and an Equipment).
  When attached: stops being a creature (Equipment only).
  Special: Equipment and creature in one card.
  Reconfigure {cost}: pay cost at sorcery speed. Attach to another target creature.
    Or: pay cost to unattach (becomes a creature again).
  Example: Lion Sash ({1}{W}): 1/1, Reconfigure {2}{W}. When equipped, grants +1/+1 and exiles GY things.
    Unattached: it's a 1/1 creature that attacks/blocks.
    Equip to another creature: Lion Sash becomes just an Equipment on that creature.

COMPLEATED (Phyrexia: All Will Be One):
  On Phyrexian planeswalkers.
  Some loyalty costs contain Phyrexian mana ({W/P}, {U/P}, etc.).
  Compleated: "if the player who cast it paid life for any Phyrexian mana symbols, it enters
    with 2 fewer loyalty per Phyrexian mana symbol paid with life."
  Pay full mana: enters with full loyalty.
  Pay life for a Phyrexian symbol: enters with 2 fewer loyalty. Potentially very low.
  Tradeoff: save mana (by paying 2 life each) vs. enter with more loyalty.
```

## Definitive Conclusions

- **Cleave is an alternative cost that text-changes the spell** — pay Cleave cost to remove bracketed text, upgrading the spell's effect.
- **Blitz costs provide haste + draw on death but the creature is temporary** — sacrificed at the beginning of the next end step.
- **Casualty costs create copies of spells when the additional cost is paid** — NOT an alternative cost; you still pay the spell's normal mana cost PLUS sacrifice a creature.
- **Training triggers when the training creature attacks alongside a more-powerful ally** — the counter is placed only if both conditions are met at trigger time.
- **Backup puts counters on target; if it's another creature, it gains the Backup creature's non-backup abilities until EOT** — can target itself but won't grant abilities to itself.
- **Toxic gives poison counters IN ADDITION to normal damage** — different from Infect which replaces damage entirely.

## Canonical Example
**Casualty 2 — Double Spell:**
Board: You control Shakedown Heavy ({2}{B}: 4/3). Opponent has a tapped creature.
You cast Ob Nixilis's Cruelty ({2}{B}, Casualty 2): "Target creature gets -5/-5 until EOT."
Pay Casualty 2: sacrifice Shakedown Heavy (4 power ≥ 2). Pay {2}{B} for the spell itself.
Casualty triggered: copy of Ob Nixilis's Cruelty created on the stack.
Two copies of the spell on the stack. Choose two different targets.
Resolve top copy first: target opponent's 3/3. It becomes a -2/2 → dies.
Resolve bottom copy: target opponent's 5/5. It becomes a 0/3 → vulnerable.
Net: sacrificed a 4/3 creature, paid {2}{B}, killed or weakened two creatures.
Shakedown Heavy's death trigger? Shakedown Heavy: "When this creature leaves the battlefield,
  draw a card if your opponent has 4 or more cards." (If that's its Oracle text.)
Any death trigger fires separately. Additional value.
This is the Casualty pattern: sacrifice + powerful spell effect × 2.

**Example 2 — Training + Backup Synergy:**
Board: you control Hopeful Initiate (1/1 Human, Training) and prepare to cast Tangled Skyline.
Turn 4: cast Tangled Skyline ({4}{G}) with Backup 1.
ETB: Backup trigger → put 1 +1/+1 counter on target creature. If another creature: it gains flying, reach, trample, vigilance until EOT.
Target Hopeful Initiate: Initiate becomes 2/2 (1 counter). Initiate gains flying, reach, trample, vigilance until EOT.
Also: Backup is ETB → "When this creature trains" trigger? No, Backup isn't Training.
Hopeful Initiate "when it trains" trigger doesn't fire from Backup.
But: Hopeful Initiate now 2/2 with flying, trample, reach, vigilance until EOT.
You attack with Initiate + another 3/3 creature: Initiate is 2/2, the 3/3 has more power.
Training trigger: Initiate is attacking and a creature with greater power (3/3) is also attacking.
Hopeful Initiate trains: gets another +1/+1 counter → becomes 3/3.
"When Hopeful Initiate trains" trigger: destroy an artifact or enchantment.
Net from one turn: Initiate is now a permanent 3/3 (counter stays), flew over for combat, removed an artifact/enchantment.
Backup was temporary (until EOT): flying, etc. expire. The counter is permanent.
Synergy: Backup gave the abilities that let Initiate attack profitably; Training triggered from the attack.

## Commonly Confused With
- **P298 (Kicker/Additional Costs)** — Casualty is an additional cost (pays in creatures instead of mana); Cleave and Blitz are alternative costs (pay instead of normal mana cost). The distinction matters for rules that care about "additional cost" vs. "alternative cost."
- **P296 (Storm)** — Casualty's copy is NOT a "cast" spell; it's put on the stack by the Casualty trigger. Storm wouldn't re-trigger from a Casualty copy.
- **P313 (X Spells)** — Several of these keywords combine with X costs. A Blitz creature cast with X = 3 and its blitz cost: you must choose to use Blitz OR the normal cost (alternative costs are exclusive).
- **P309 (First Strike)** — Training triggers on attack, not on damage. A training creature that never gets blocked still trains if a more-powerful ally attacks alongside it.
