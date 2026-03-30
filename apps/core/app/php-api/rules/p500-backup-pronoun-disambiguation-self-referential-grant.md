---
id: p500
name: Backup — Pronoun Disambiguation in Granted Self-Referential Abilities and Protection Interactions
category: triggered
cr_refs: [702.165, 702.16, 702.165c, 702.165d]
tags: [backup, self-referential, pronoun, this-creature, sacrifice, last-known-power, layer-effect, protection, targeting, voldaren-thrillseeker, boon-bringer-valkyrie, enduring-bondwarden, march-of-the-machine, MOM]
created: 2026-03-30
examples_count: 3
---

# P500 — Backup — Pronoun Disambiguation in Granted Self-Referential Abilities and Protection Interactions

## Abstract
**Backup** (March of the Machine, 2023; CR 702.165) is a triggered ability that grants a creature abilities until end of turn. When the granted ability contains self-referential pronouns like "this creature," "sacrifice this creature," or "this creature's power," the pronoun refers to **the creature that currently has the ability** — not the backup creature that originally had the text. This has major consequences: Voldaren Thrillseeker's sacrifice ability, when granted to Creature B, causes Creature B to sacrifice itself and deal damage equal to Creature B's last-known power. Three additional non-obvious rules: (1) the ability grant survives the backup creature's death — it's a layer effect tied to the grant, not to the source; (2) Backup cannot grant the Backup keyword itself (only non-Backup abilities printed below it); (3) if the backup trigger's target has protection from the backup creature's color, the trigger cannot legally target that creature.

## The Definitive Rules

**CR 702.165a:** "Backup N (When this creature enters, put N +1/+1 counters on target creature. If that's another creature, it gains the following abilities until end of turn.)"

**CR 702.165c:** "A backup ability grants only the abilities printed below the backup keyword and reminder text on the card with the backup ability." — Backup does NOT grant abilities gained from other sources (equipment, auras, other effects).

**CR 702.165d:** "The set of abilities to grant is determined when the backup trigger is put on the stack." — If the backup creature loses abilities before the trigger resolves, the grant still delivers the abilities locked in at stack time.

**CR 702.16b (Protection):** "Protection from [quality] means: The protected permanent can't be targeted by sources with that quality." — The backup trigger is an ability of the backup creature; if the target has protection from the backup creature's color, the trigger can't legally target it.

## The Pattern

```
PRONOUN DISAMBIGUATION — "THIS CREATURE" IN GRANTED ABILITIES:

  When Backup grants an activated ability to Creature B, and that ability contains
    "this creature," "sacrifice this creature," or "this creature's power," the
    pronoun refers to CREATURE B (the creature with the ability) — not the
    original Backup creature.

  This follows the standard rules for abilities: an ability is evaluated in the context
    of the permanent that CURRENTLY HAS IT, not where it came from.

  VOLDAREN THRILLSEEKER ({2}{R}: 1/1, Backup 2):
    "Backup 2 (When this creature enters, put two +1/+1 counters on target creature.
      If that's another creature, it gains the following abilities until end of turn.)
    {1}, Sacrifice this creature: It deals damage equal to its power to any target."

  When Voldaren targets Creature B (e.g., a 5/5 Dragon):
    → Dragon gains: "{1}, Sacrifice this creature: It deals damage equal to its power."
    → "This creature" in "Sacrifice this creature" → refers to the Dragon (Creature B).
    → "Its power" → refers to the Dragon's current power.
    → Dragon sacrifices itself and deals 5 damage to any target.
    → Voldaren Thrillseeker itself is NOT sacrificed.
    → Damage is equal to the Dragon's LAST-KNOWN POWER (at the time it leaves the
      battlefield via sacrifice). If the Dragon was 5/5, 5 damage is dealt.

  LAST-KNOWN POWER:
    "It deals damage equal to its power" uses last-known information — the creature's
      power at the moment it left the battlefield (sacrificed).
    If a pump spell made the Dragon 8/8, then it sacrifices: 8 damage dealt.
    If a counter was removed reducing it to 3/3 before sacrifice: 3 damage.

  BACKUP GRANTS ONLY PRINTED ABILITIES:
    "Gained abilities" from equipment, auras, or other effects are NOT granted by Backup.
    Example: Voldaren Thrillseeker is equipped with Sword of Fire and Ice.
      Backup targets Creature B. Creature B gains ONLY the "Sacrifice this creature: deal
      damage" ability — NOT the Sword's ability (not printed below backup on Voldaren).
    This applies even if the equipment has been attached for the entire game.

ABILITY GRANT SURVIVES BACKUP CREATURE'S DEATH:

  The ability grant is a continuous layer effect (layer 6: ability-adding effects).
  It was established at the time the backup trigger resolved.
  The grant specifies a duration ("until end of turn") and an object (Creature B).
  The grant does NOT require the backup creature to remain in play.

  Official ruling: If Voldaren Thrillseeker dies after granting the ability to Creature B,
    Creature B KEEPS the ability until end of turn. The backup creature's death has no
    effect on the grant.

  This is important for combat:
    → Voldaren attacks, then backup triggers targeting an ally creature.
    → Voldaren is then blocked and killed.
    → The allied creature still has the sacrifice ability until end of turn.

BACKUP CANNOT GRANT THE BACKUP ABILITY ITSELF:

  CR 702.165c: Backup grants only "abilities printed below the backup keyword and
    reminder text." The Backup keyword line itself is not "below" it — it IS the keyword.
  Therefore, a creature with Backup can never grant backup to another creature.
  No chain-backup scenarios are possible.

PROTECTION FROM THE BACKUP CREATURE'S COLOR:

  The backup trigger is an ability of the backup creature. When the trigger goes on the
    stack, you choose a target. If the only valid target has protection from the backup
    creature's color, it cannot legally be targeted.

  Example: Voldaren Thrillseeker (red) enters. You want to target a creature with
    protection from red with the backup trigger. You CANNOT — protection prevents targeting
    by red sources, and Voldaren (the source of the trigger) is red.

  If protection is gained AFTER the target is chosen (after the trigger is on the stack):
    → Protection doesn't retroactively make the target illegal.
    → But when the trigger resolves: protection also prevents the +1/+1 counters from
      being placed (DEBT: damage, enchanting, blocking, targeting — counters placed are
      covered by "all effects dealt by sources with [quality]").
    → If the target gained protection from red between targeting and resolution:
      the trigger tries to resolve, but protection now prevents the counters and ability
      grant. The trigger is countered due to illegal target (if protection prevents targeting,
      the trigger fizzles — but if it prevented the effects, the trigger resolves but
      the counters and grant don't apply). Actually: protection prevents targeting at the
      point of targeting. If protection is gained after targeting, the target becomes
      illegal at resolution → trigger is countered by game rules (CR 608.2b).

ABILITIES LOCKED IN AT TRIGGER TIME (CR 702.165d):

  The backup trigger captures the set of abilities to grant when the trigger goes on
    the stack — not when it resolves.
  If Voldaren Thrillseeker has additional abilities from temporary effects (e.g., it
    gained haste from an aura during the declare-attackers step, but the aura falls off
    before the trigger resolves), the haste is NOT granted — only the abilities locked
    in at stack time are granted.
  If Voldaren LOSES its printed ability before the trigger resolves (e.g., Humility):
    → The trigger already locked in the ability at stack time.
    → The grant still delivers the ability to Creature B even though Voldaren no longer
      has that ability.

ENDURING BONDWARDEN — COUNTER RELAY:
  Enduring Bondwarden ({W}: 0/1 Human Soldier; Backup 1):
    "Backup 1. When this creature dies, put its counters on target creature you control."

  When Bondwarden backs up Creature B (puts 1 +1/+1 counter on it, grants ability):
    Creature B gains: "When this creature dies, put its counters on target creature
      you control." (The ability is now Creature B's.)

  If Creature B then dies:
    → The death trigger fires for Creature B.
    → "Put ITS counters on target creature" = Creature B's counters (the +1/+1 from
      Backup, plus any other counters on Creature B).
    → ALL types of counters on Creature B are moved, not just +1/+1.
    → If Creature B had a -1/-1 counter, that also moves to the new target.

  This creates a counter-relay chain: each creature can pass its counters on death
    to the next creature, as long as the Backup grant is still active (until end of turn).
```

## Definitive Conclusions

- **"This creature" in a granted ability refers to Creature B** (the creature that now has it), not Voldaren Thrillseeker — Creature B sacrifices itself and deals damage equal to its own last-known power.
- **Ability grants survive the backup creature's death** — the grant is a layer effect tied to Creature B until end of turn; Voldaren dying doesn't revoke it.
- **Backup cannot grant itself** — no chain-backup scenarios; only abilities printed below the backup line are eligible.
- **Protection from the backup creature's color blocks targeting** — the trigger cannot legally target a creature with protection from the backup creature's color; if protection is gained after targeting, the trigger is countered at resolution.
- **Abilities are locked in at trigger time** — temporary abilities Voldaren has when the trigger goes on the stack ARE granted; abilities gained or lost before resolution are NOT reflected in the grant.

## Canonical Example

**Voldaren Thrillseeker Backs Up a 6/6 Dragon:**

Voldaren Thrillseeker ({2}{R}: 1/1 Vampire, Backup 2) enters the battlefield. Backup trigger goes on the stack. You target your 6/6 Dragon.

Trigger resolves: Dragon gets two +1/+1 counters (now 8/8). Dragon gains "({1}, Sacrifice this creature: It deals damage equal to its power to any target.)" until end of turn.

Later that turn: you activate the Dragon's new ability. Pay {1}, sacrifice the Dragon. The Dragon is sacrificed — it was 8/8. It deals 8 damage to any target of your choice.

Voldaren Thrillseeker is untouched. It's a 1/1 still on the battlefield.

**Example 2 — Grant Survives Voldaren's Death:**

Same setup. After the backup trigger resolves (Dragon is 8/8 with the sacrifice ability), Voldaren Thrillseeker attacks and is blocked and killed.

The Dragon still has "({1}, Sacrifice this creature: deal damage equal to power)" until end of turn — the grant doesn't depend on Voldaren surviving. You activate it, dealing 8 damage.

**Example 3 — Protection Blocks the Trigger:**

Voldaren Thrillseeker enters. Backup trigger goes on the stack. You try to target your creature that has protection from red.

The trigger's source is Voldaren (red). Protection from red prevents targeting. The creature CANNOT be chosen as the target. If no other legal targets exist, the trigger is placed on the stack without a target and immediately becomes "countered" due to illegal targeting.

If a creature gains protection from red AFTER being targeted (in response to the trigger), the trigger loses its legal target and is countered by game rules at resolution.

## Commonly Confused With
- **P070 (Backup basics)** — P070 covers the core Backup mechanic. P500 covers the pronoun disambiguation (the most common rules question around Backup), the protection interaction, and the grant-survives-death rule.
- **P003 (Object Identity)** — When an ability refers to "this creature," the identity of "this creature" shifts based on which permanent currently has the ability. This is the same principle as how copied abilities resolve from the new object.
- **P006 (Intervening-If / LKI)** — Last-known power is used when the Dragon sacrifices itself; the power is measured at the last moment it existed on the battlefield.
