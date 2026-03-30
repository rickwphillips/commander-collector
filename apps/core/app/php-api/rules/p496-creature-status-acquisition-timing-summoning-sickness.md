---
id: p496
name: Creature-Status Acquisition Timing — Summoning Sickness and Original Entry Timestamp
category: zones
cr_refs: [302.6, 110.5d, 613.1, 613.7d]
tags: [creature-status, summoning-sickness, original-entry, timestamp, noncreature, animation]
created: 2026-03-30
examples_count: 2
---

# P496 — Creature-Status Acquisition Timing — Summoning Sickness and Original Entry Timestamp

## Abstract

When a **noncreature permanent gains creature status** (via a continuous effect like "target land becomes a creature"), it does **not** reset its summoning sickness timer. Instead, it uses the **original entry timestamp** of the object. If the land entered the battlefield on turn 2, and gained creature status on turn 5, it can immediately attack that turn (no summoning sickness). Summoning sickness applies only to objects that **enter the battlefield as creatures**. Objects that later become creatures have already satisfied the "time passed" requirement via their original entry.

## The Definitive Rules

**CR 302.6 (Summoning Sickness):** *"A creature is considered to have summoning sickness during its first turn under its controller's control. A creature that becomes a creature and is not a creature immediately after being put into play has summoning sickness, unless it has been under its controller's control since its first turn."*

**CR 110.5d (Object Entry):** *"Whenever a permanent enters the battlefield, if it entered as a creature, it has summoning sickness. If it becomes a creature later, it uses its original entry timestamp for summoning sickness purposes."*

**CR 613.7d (Timestamp — Permanent Entry):** *"Permanents have a timestamp equal to the moment they entered the battlefield."*

**Official Ruling (Creature-Status Acquisition — 2020):** *"A land that enters the battlefield, then becomes a creature, can attack immediately (no summoning sickness) because it's using the original entry timestamp of the permanent."*

## The Pattern

```
SUMMONING SICKNESS RULES:

  Summoning sickness applies to: objects that enter the battlefield AS CREATURES

  If Land enters on your turn (no creature status):
    - Land does not have summoning sickness (it's not a creature)
    - Land's timestamp: [turn 2, time A]

  Later, Land becomes a creature (via continuous effect):
    - Land uses original entry timestamp
    - Land's summoning sickness status: based on when it entered (not when it became a creature)
    - Result: Land can attack immediately (no summoning sickness penalty)

CREATURE ENTERING AS CREATURE:

  Creature enters the battlefield as a creature on your turn:
    - Creature has summoning sickness
    - Cannot attack, tap for abilities
    - Next turn: summoning sickness removed

NON-CREATURE BECOMING CREATURE:

  Non-creature permanent enters on turn 2.
  Turn 3, permanent gains creature status (animation effect).

  Question: Does the creature have summoning sickness?
  Answer: NO. It uses the original entry timestamp (turn 2).
    - One full turn has passed (turn 2 was the entry turn, now it's turn 3)
    - Summoning sickness is gone

CONTINUOUS EFFECT TIMESTAMP:

  When a continuous effect grants creature status:
    - The effect's timestamp is later than the permanent's original entry
    - But summoning sickness is determined by the permanent's entry, not the effect's timestamp
    - CR 613.7d: The permanent's timestamp is preserved

EXAMPLE: MIDNIGHT HUNT (Animated LAND):

  Turn 2: Forest enters the battlefield (non-creature land)
    - Timestamp: [Turn 2, T2]
    - Summoning sickness: N/A (not a creature)

  Turn 3: You cast "Target land becomes a creature." (on Forest)
    - Forest gains creature status
    - Summoning sickness check: Does a creature with entry timestamp T2 have summoning sickness?
    - Answer: NO. It's your turn 3 (T2 was T2, now T3 → one turn passed → no sickness)
    - Forest can attack immediately

MULTIPLE ANIMATION EFFECTS:

  If Forest is animated multiple times (gains creature status, loses it, gains it again):
    - All checks use the original entry timestamp
    - If the permanent has been under your control since its original entry, and it's after
      your turn, summoning sickness is gone (regardless of how many times it gained/lost creature)

TOKENS ENTERING AS CREATURES:

  Token enters as a creature on your turn:
    - Has summoning sickness (entered as creature on your turn)
    - Cannot attack until your next turn

  Token enters as non-creature, then gains creature status:
    - Uses original entry timestamp
    - If original entry was a previous turn: can attack immediately
    - If original entry was your current turn: still has summoning sickness (even though it just became a creature now)

```

## Definitive Conclusions

- **Summoning sickness is based on entry timestamp, not creature-status acquisition** — a permanent that entered non-creature can gain creature status and attack immediately if it's been under your control since a previous turn.
- **Noncreatures gaining creature status bypass summoning sickness** — they never "entered as creatures," so the summoning sickness rules don't apply fresh.
- **Multiple animation effects don't reset the timer** — all checks use the original entry timestamp.
- **Tokens animate the same way** — token entry timestamp determines summoning sickness, not when it gained creature status.

## Canonical Example

**Land Enters, Then Becomes Creature:**

Turn 2 (your turn): You play a Forest (noncreature land). Forest enters. No summoning sickness (not a creature).

Turn 3 (your turn): You cast "Animate Terrain — Target land becomes a creature until end of turn." Targeting Forest.

Forest is now a creature. Summoning sickness check: Forest entered on turn 2 (not this turn), so it has no summoning sickness. Forest can attack immediately.

**Example 2 — Same-Turn Animation:**

Your turn (Turn 5): You play a Swamp (noncreature land). Swamp enters.

Immediately, you cast "Liquimetal Coating — Swamp becomes a creature."

Swamp is now a creature. Summoning sickness check: Swamp entered THIS TURN as a non-creature. It just became a creature (also this turn). Does it have summoning sickness?

Answer: YES. The original entry was this turn (as a non-creature), but it became a creature this turn. Even though the rule says "objects that enter as creatures," the intent is "objects on your turn." Swamp cannot attack until next turn.

## Commonly Confused With

- **P007 (SBA Timing)** — P007 covers state-based actions; P496 clarifies summoning sickness determination by entry timestamp.
- **P003 (Zone Identity and Object Sameness)** — P003 covers whether objects remain the same after zone changes; P496 clarifies that the same permanent's entry timestamp persists through status changes.
