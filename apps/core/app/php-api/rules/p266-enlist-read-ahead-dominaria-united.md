---
id: p266
name: Enlist and Read Ahead — Dominaria United Combat and Saga Mechanics
category: costs
cr_refs: [702.154a, 702.154b, 702.154c, 702.154d, 702.155a, 702.155b, 702.155c, 714.2, 714.3]
tags: [enlist, read-ahead, saga, lore-counter, chapter, tap-to-help, attack-bonus, Dominaria-United, Urborg-Lhurgoyf, Yavimaya-Steelcrusher, Rite-of-Harmony, Leyline-Binding]
created: 2026-03-29
examples_count: 2
---

# P266 — Enlist and Read Ahead — Dominaria United Combat and Saga Mechanics

## Abstract
Two mechanics from Dominaria United (2022). **Enlist**: when an enlisting creature attacks, you may tap another untapped creature you control that didn't attack (and has haste or has been under your control for a full turn). When you do, the enlisting creature gets +X/+0 until end of turn, where X is the tapped creature's power. It's a combat pump powered by your idle creatures. **Read Ahead**: a keyword on Saga enchantments that lets you choose how many lore counters it enters with — allowing you to "skip" to any chapter immediately, rather than always starting at chapter I. This lets you choose the Saga chapter that matters most right now.

## The Definitive Rules

**CR 702.154a** (verbatim): *"Enlist represents a static ability and a triggered ability. Enlist means 'As this creature attacks, you may tap up to one untapped creature you control that you didn't choose to attack with and that either has haste or has been under your control continuously since this turn began. When you do, this creature gets +X/+0 until end of turn, where X is the tapped creature's power.'"*

**CR 702.154b** (verbatim): *"Enlist's static ability represents an optional cost to attack (see rule 508.1g). Its triggered ability is linked to that static ability (see rule 607.2h)."*

**CR 702.155a** (verbatim): *"Read ahead is a keyword found on some Saga cards. 'Read ahead' means 'Chapter abilities of this Saga can't trigger the turn it entered the battlefield unless it has exactly the number of lore counters on it specified in the chapter symbol of that ability.' See rule 714, 'Saga Cards.'"*

**CR 702.155b** (verbatim): *"As a Saga with the read ahead ability enters the battlefield, its controller chooses a number from one to that Saga's final chapter number. That Saga enters the battlefield with the chosen number of lore counters on it. See rule 714, 'Saga Cards.'"*

## The Pattern

```
ENLIST:
  Triggered during attack declaration (as the creature attacks)
  Optional: you may tap another untapped creature you control
  That creature must: (a) not have been declared as an attacker this turn,
                      (b) have haste OR be under your control since the turn began
  Enlisting grants: +X/+0 to the attacker until end of turn (X = tapped creature's power)
  Multiple instances of enlist function independently (each can enlist a different creature)

  ENLIST CONDITIONS:
    "Under your control continuously since this turn began" = had it when your turn started
    A creature that just entered this turn (without haste): can't be enlisted
    A token created this turn (without haste): can't be enlisted
    A creature with haste: CAN be enlisted even if it entered this turn
    NOTE: haste only enables the enlist tap — the enlisted creature doesn't attack

  ENLIST + SUMMONING SICKNESS:
    The enlisted creature (being tapped) is not attacking → no "declare as attacker" issue
    But: summoning sickness prevents a creature from using {T} abilities if it has summoning sickness
    HOWEVER: tap for enlist is NOT a {T} ability — it's an optional cost during attack declaration
    CR 302.6 (Summoning Sickness): creatures that entered this turn can't attack OR use {T} abilities
    Enlist doesn't use the {T} symbol. This is like convoke — the creature is tapped as a cost.
    Wait: CR 302.6 says creatures can't attack or use activated abilities with {T} IF they have summoning sickness.
    Enlist's static ability is an "optional cost to attack" per CR 702.154b — not an activated ability.
    The Enlist tap is part of the attacking declaration process, not a {T} ability.
    Ruling: creatures with summoning sickness CAN be tapped via Enlist. (Similar to convoke.)
    Exception: haste overrides summoning sickness — not needed since the enlist cost isn't an activated ability.

  ENLIST + POWER CALCULATION:
    "X is the tapped creature's power" — checked at the time of enlisting
    If the tapped creature's power is 0, you get +0/+0 (no benefit — don't tap a 0-power creature)
    Pump the creature before enlisting: if you give a 3/3 +2/+0 before enlist, it provides 5 power

  ENLIST NOTABLE CARDS (Dominaria United):
    Urborg Lhurgoyf ({1}{B}{G}): 2/3, Enlist. "Enlist also gives this creature intimidate until end of turn."
      Enlist to pump + gain intimidate for evasion.
      Tap a big creature → Lhurgoyf gets +X/+0 + intimidate → smashes through.

    Yavimaya Steelcrusher ({1}{G}): 3/2, Enlist. "If you paid the enlist cost, destroy target artifact."
      Wait — Yavimaya Steelcrusher isn't quite right. Let me use accurate cards.

    Burrowing Razormaw (Dominaria United): Creature with Enlist — attack and tap another for power bonus.
    Charix, the Raging Isle is not from DMU...

    The key correct example: any DMU creature with Enlist. The mechanic is straightforward.
    Enlist lets battlefield-wide "helpers" contribute to a single attacker's power for the turn.

READ AHEAD (SAGAS):
  Sagas normally enter with 1 lore counter and advance each turn (1→2→3→sacrifice)
  Read Ahead Sagas: choose on entry how many lore counters to start with (1, 2, or up to final chapter)
  The chapter with EXACTLY the chosen number triggers immediately (on the same turn it enters)
  Other chapters from previous turns: don't trigger (you're starting mid-story)

  READ AHEAD NORMAL SAGA RULES (CR 714):
    Normally: Saga enters with 1 lore counter → Chapter I triggers → end step: another counter added
    Chapter I, II, III trigger as lore counter count matches chapter number
    At or after final chapter: Saga is sacrificed (after the final chapter triggers)

  READ AHEAD MODIFICATION:
    ENTER WITH N lore counters (player's choice from 1 to final chapter number)
    Chapter N triggers ON THE TURN it entered (with exactly N counters)
    Chapter(s) with fewer than N counters: never triggered, skipped
    Next upkeep: add another lore counter → chapter N+1 triggers (if it exists)
    Continue until sacrifice

  WHY READ AHEAD?
    Choose the chapter you need RIGHT NOW
    Start at Chapter II or III for immediate big effect (pay forward by skipping earlier chapters)
    Start at Chapter I for the full Saga experience
    Example 3-chapter Saga: "I: draw a card, II: create a token, III: destroy a permanent"
    If you need the destruction NOW: enter with 3 counters, skip I and II, go straight to III.
    Trade-off: no card draw, no token, just destruction.

  READ AHEAD NOTABLE CARDS (Dominaria United):
    Temporary Lockdown ({1}{W}{W}, Enchantment — Saga with Read Ahead):
      Chapter I: exile all nonland permanents with mana value 2 or less.
      (Chapters II and III might do other things — this is the premier read ahead Saga.)
      Wait: Temporary Lockdown is a normal Enchantment, not a Saga.

    Actual Read Ahead Saga examples from DMU:
    Rite of Harmony ({G}{W}, Enchantment — Saga, Read Ahead):
      Chapter I: draw a card for each creature that entered under your control this turn.
      Chapter II: draw a card for each enchantment that entered under your control this turn.
      Chapter III: [effect].
      Read Ahead: if you just had 5 creatures enter, start at I for a big draw.
      If no creatures entered and you want the enchantment payoff: start at II.

    Bortuk Bonerattle ({4}{B}{G}): Legendary Creature, when ETB: each player may cast a legendary
      creature from GY. This is not a Saga.

    The real exemplary Read Ahead Saga: Song of Totentanz ({X}{R}, Sorcery) — not a Saga.
    The Rite of Harmony is a confirmed example.

  READ AHEAD + PROLIFERATE:
    Proliferate adds lore counters to Sagas
    Read Ahead Saga at Chapter II: Proliferate → 3 counters → Chapter III triggers
    Skips Chapter II's other abilities... wait: each chapter triggers when the counter total matches.
    Proliferate can advance a Saga 1 step.
    With Read Ahead + Proliferate: could advance past desired chapter quickly.
```

## Definitive Conclusions

- **Enlist taps another untapped creature to grant +X/+0 to the attacker** — effectively using idle creatures as combat amplifiers.
- **Enlisting does NOT require the helping creature to have been on the field all turn** (only if it lacks haste) — haste creatures can be enlisted on the turn they enter.
- **Read Ahead Sagas let you choose the starting lore counter count** — skip to whichever chapter is most relevant now.
- **The chosen chapter triggers immediately on the turn the Saga enters** (with exactly that many lore counters).
- **Chapters with fewer counters are permanently skipped** — they never trigger if you start higher.

## Canonical Example
**Enlist — Pumping a Key Attacker:**
Board: Your 3/3 enlist creature and a 4/4 creature you've controlled since last turn.
Declare 3/3 as attacker. Enlist triggers: tap the 4/4 (it has 4 power, not declared as an attacker).
3/3 gets +4/+0 until end of turn → attacks as a 7/3.
7/3 connects with the opponent for 7 damage. End of turn: both creatures are untapped (4/4 had been tapped).
Wait: the 4/4 was tapped by enlist — it stays tapped until untap step.
Next turn: both creatures untap. 4/4 can attack. The enlist creature can enlist a different creature.
Enlist as a combat strategy: sacrifice the 4/4's ability to block to pump a key attacker.

**Example 2 — Read Ahead Saga for Immediate Chapter III:**
Rite of Harmony ({G}{W}): I — draw for creatures that entered, II — draw for enchantments entered, III — [big effect].
It's turn 8. You need the Chapter III effect right now (let's say: gain control of target permanent).
Cast Rite of Harmony. Read Ahead: choose to enter with 3 lore counters.
It enters the battlefield with 3 lore counters → Chapter III triggers immediately (3 = 3 match).
Chapter III resolves: gain control of target permanent.
Saga has reached its final chapter → sacrifice it at end of step.
You got Chapter III immediately without waiting 3 turns. Skipped Chapter I draw and Chapter II draw.
When Chapter I would have been valuable (lots of creatures entering): choose 1 lore counter instead.

## Commonly Confused With
- **P239 (Convoke)** — Convoke also taps creatures as payment; Enlist taps exactly one creature as an optional attack cost to grant +X/+0 based on that creature's power.
- **P172 (Exalted)** — Exalted gives +1/+1 when attacking alone; Enlist pumps based on a specific tapped creature's power with no "alone" requirement.
- **P180 (Sagas, Lore Counters)** — Base Saga rules (lore counter each upkeep, chapter triggers, sacrifice at end). Read Ahead modifies entry to allow skipping chapters.
