---
id: p070
name: Backup — ETB Counter and Ability Grant
category: triggered
cr_refs: [702.165a, 702.165b, 702.165c, 702.165d]
tags: [backup, ETB, counter, ability-grant, printed-abilities, until-end-of-turn, self-target, non-backup]
created: 2026-03-28
examples_count: 2
---

# P070 — Backup — ETB Counter and Ability Grant

## Abstract
Backup is a triggered ability that fires when the creature with backup enters the battlefield. It puts N +1/+1 counters on a target creature. If the target is ANOTHER creature (not the backup creature itself), that creature also gains all non-backup abilities printed after the backup ability until end of turn. The grant only applies to printed abilities — not gained abilities from copy effects or other effects. The abilities granted are locked in when the trigger is placed on the stack, not when it resolves.

## The Definitive Rule

**CR 702.165a** (verbatim): *"Backup is a triggered ability. 'Backup N' means 'When this creature enters, put N +1/+1 counters on target creature. If that's another creature, it also gains the non-backup abilities of this creature printed below this one until end of turn.'"*

**CR 702.165b** (verbatim): *"If a permanent enters the battlefield as a copy of a permanent with a backup ability or a token is created that is a copy of that permanent, the order of abilities printed on it is maintained."*

**CR 702.165c** (verbatim): *"Only abilities printed on the object with backup are granted by its backup ability. Any abilities gained by a permanent, whether due to a copy effect, an effect that grants an ability to a permanent, or an effect that creates a token with certain abilities, are not granted by a backup ability."*

**CR 702.165d** (verbatim): *"The abilities that a backup ability grants are determined as the ability is put on the stack. They won't change if the permanent with backup loses any abilities after the ability is put on the stack but before it resolves."*

## The Pattern

```
BACKUP TRIGGER SEQUENCE:
  1. Backup creature enters the battlefield
  2. Backup trigger goes on the stack
  3. Choose target: any creature (including the backup creature itself)
  4. Trigger resolves:
     → Put N +1/+1 counters on the target
     → IF the target is ANOTHER creature (not self):
        → That creature gains all non-backup abilities printed below the backup line
        → Until end of turn

SELF-TARGET:
  Can target the backup creature itself
  If self-targeted: gets the counters but NOT the ability grant
    (The grant only applies to "another creature")
  Useful when you have no other targets or want to pump the backup creature itself

WHICH ABILITIES ARE GRANTED:
  Only PRINTED abilities below the backup line on the physical card
  NOT: abilities gained from equipment, auras, other effects
  NOT: the backup ability itself (it's above the printed non-backup abilities)
  NOT: abilities gained after the token/copy was created via copy effects

ABILITY GRANT TIMING:
  Abilities are determined when the trigger goes on the stack (CR 702.165d)
  If backup creature loses abilities (e.g., opponent plays Humility) after trigger is on stack:
    The granted abilities are still the ones that were printed when trigger was placed
    → They were locked in at stack placement time

GRANT DURATION:
  Until end of turn (temporary)
  The +1/+1 counters are permanent (they stay after end of turn)
  The ability grant expires at cleanup step

COPY OF BACKUP CREATURE:
  A copy maintains order of printed abilities (CR 702.165b)
  The backup ability on the copy grants the same non-backup printed abilities
  But abilities gained by the copy (not printed) are NOT granted (CR 702.165c)
```

## Definitive Conclusions

- **Backup grants abilities only to ANOTHER creature.** Self-targeting gives counters but no ability grant.
- **Only printed abilities are granted.** Gained abilities (from effects, equipment, etc.) are not passed.
- **Abilities granted are locked in when the trigger goes on the stack.** Changes to the backup creature after that don't affect the grant.
- **Counters are permanent; ability grant expires end of turn.**
- **The backup ability itself is not among the granted abilities.**

## Canonical Example
**Glorious Enforcer (Backup 2, printed abilities below: haste, double strike):**
Glorious Enforcer enters. Backup trigger: target another creature (your 3/3 Soldier). Trigger resolves: put 2 +1/+1 counters on Soldier (now 5/5), Soldier gains haste and double strike until end of turn. Attack with the 5/5 double striker this turn.

**Example 2 — Backup self-target:**
Glorious Enforcer enters. No other creatures on your side. Target: Glorious Enforcer itself. Trigger resolves: 2 +1/+1 counters on Glorious Enforcer. No ability grant (self-target). Enforcer becomes bigger but doesn't gain extra abilities from the backup.

## Commonly Confused With
- **P028 (Simultaneous ETB)** — If multiple backup creatures enter simultaneously, each triggers separately and both triggers resolve.
- **P023 (Trigger Suppression vs. Replacement)** — Backup is a triggered ability (Torpor Orb would suppress it). If Torpor Orb is in play, backup doesn't trigger.
