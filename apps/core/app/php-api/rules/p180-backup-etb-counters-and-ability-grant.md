---
id: p180
name: Backup — ETB Counter Plus Ability Grant to Another Creature
category: triggered
cr_refs: [702.165a, 702.165b, 702.165c, 702.165d]
tags: [backup, +1/+1, ETB, ability-grant, printed-abilities, March-Machine, Mirrodin-faction]
created: 2026-03-28
examples_count: 2
---

# P180 — Backup — ETB Counter Plus Ability Grant to Another Creature

## Abstract
Backup N is an ETB triggered ability: when the backup creature enters, put N +1/+1 counters on target creature. If that target is a DIFFERENT creature (not the backup creature itself), it also gains all the non-backup abilities printed below the backup ability until end of turn. This lets you "back up" a powerful attacker with both a counter and a full set of keyword abilities for a turn. If you target the backup creature itself, it just gets N counters (no ability grant to itself — it already has its own abilities). The abilities granted are strictly the printed ones — no granted or copied abilities pass through backup.

## The Definitive Rules

**CR 702.165a** (verbatim): *"Backup is a triggered ability. 'Backup N' means 'When this creature enters, put N +1/+1 counters on target creature. If that's another creature, it also gains the non-backup abilities of this creature printed below this one until end of turn.'"*

**CR 702.165c** (verbatim): *"Only abilities printed on the object with backup are granted by its backup ability. Any abilities gained by a permanent, whether due to a copy effect, an effect that grants an ability to a permanent, or an effect that creates a token with certain abilities, are not granted by a backup ability."*

**CR 702.165d** (verbatim): *"The abilities that a backup ability grants are determined as the ability is put on the stack. They won't change if the permanent with backup loses any abilities after the ability is put on the stack but before it resolves."*

## The Pattern

```
BACKUP:
  ETB triggered ability: when this creature enters
  Target: a creature (can be itself or another)
  Effect: put N +1/+1 counters on the target
  If target is ANOTHER creature: also gains non-backup abilities printed below backup until end of turn

  BACKUP + SELF-TARGET:
    You can target the backup creature itself
    Effect: put N counters on itself (grows permanently)
    No ability grant (it already has its abilities)
    Use case: you don't have a good target; take the counters for yourself

  BACKUP + ABILITIES GRANTED:
    Only abilities PRINTED on the card, below the backup line
    Flying, first strike, lifelink, "whenever this attacks": all granted if printed below backup
    Abilities granted TO the backup creature by other effects: NOT transferred
    "Gained" abilities (from enchantments, lords, etc.) don't pass through backup

  BACKUP + TIMING:
    Abilities granted: "until end of turn" — temporary
    The counters: permanent (+1/+1 stays on the target creature)
    Counter growth is the lasting effect; ability grant is the combat trick

  BACKUP + MULTIPLE ABILITIES:
    A backup creature with flying, first strike, lifelink BELOW the backup line:
    Target another creature → it gets N counters + flying + first strike + lifelink until end of turn
    A "flying, first strike, lifelink 4/4 until end of turn" is a formidable combat creature

  BACKUP + COPYING:
    If you copy a backup creature: the copy has the same printed abilities
    The copy's backup triggers normally and grants the same printed abilities

  BACKUP CARDS (March of the Machine):
    Eleventh Doctor (Backup 1, with a regeneration-like ability): grows others + grants protection ability
    Many 2/2 and 3/3 creatures with Backup 1-2 and keywords below the backup line

BACKUP + ABILITY DETERMINATION:
  CR 702.165d: abilities determined when the trigger is PUT ON THE STACK, not when it resolves
  If backup creature loses its abilities in response to the trigger: still grants the abilities as determined when the trigger was created
```

## Definitive Conclusions

- **Backup N gives +1/+1 counters** to target creature — permanent growth.
- **If targeting ANOTHER creature**, it also gains all non-backup printed abilities until end of turn.
- **Only printed abilities** pass through backup — not gained or granted abilities.
- **Self-targeting** gives only counters (no ability grant to self).
- **Abilities are determined when trigger is placed on stack** — can't be denied by removing abilities later.

## Canonical Example
**Glissa, Herald of Predation (Backup 1, then Flying, First Strike, Deathtouch printed below):**
Cast Glissa → backup ETB triggers → target your best attacker (a 5/5 with no abilities).
Effect: 5/5 gets +1/+1 counter (now 6/6 permanently) AND gains flying, first strike, deathtouch until end of turn.
That 6/6 attacks with flying (evasion), first strike (kills first), deathtouch (any hit lethal) — devastating.
Glissa herself is a 4/4 with those abilities and will attack next turn as normal.

**Example 2 — Self-Target Backup:**
You control a Backup 2 creature with Vigilance and Trample below the backup line.
No other creature to target → target the backup creature itself.
It gets 2 +1/+1 counters (permanent growth, becomes more powerful for future turns).
But you don't GAIN the abilities (you already have them).

## Commonly Confused With
- **P180 vs Mentor (P076)** — Mentor gives a counter to other attacking creatures with lower power. Backup gives counters (and abilities) on ETB to any target creature.
- **P175 (Soulbond)** — Soulbond shares abilities as long as creatures are paired. Backup grants abilities only until end of turn.
- **P142 (Outlast)** — Outlast adds counters at sorcery speed via tapping. Backup adds counters on ETB.
