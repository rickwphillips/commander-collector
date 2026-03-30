---
id: p505
name: Backup — Hexproof Timing, Keyword Redundancy, and Self-Target Limits
category: triggered
cr_refs: [702.4, 702.11b, 702.154, 603.3, 608.2b, 704.5f]
tags: [backup, hexproof, targeting-timing, keyword-redundancy, first-strike, double-strike, self-target, boon-bringer-valkyrie, saiba-cryptomancer, march-of-the-machine, MOM]
created: 2026-03-29
examples_count: 4
---

# P505 — Backup — Hexproof Timing, Keyword Redundancy, and Self-Target Limits

## Abstract

Backup's triggered ability uses the stack and targets on announcement — not on resolution. This means hexproof granted by the resolving backup ability cannot retroactively protect the target from the trigger that granted it. Additionally, granting a keyword a creature already possesses is redundant (multiple instances of the same keyword are functionally identical). Self-targeting a backup creature gives it counters only, never the printed abilities below backup. All three subtleties appear consistently across MOM backup cards.

## The Definitive Rules

**CR 603.3**: *"Once a triggered ability has triggered, its controller puts it on the stack as a triggered object as soon as a player would receive priority. At that time, it's already a triggered object — not a spell. Any choices required (including targets) are made when the trigger goes on the stack, not when it resolves."*

**CR 608.2b / targeting-at-announcement principle**: When a triggered ability requires targeting, legal targets must exist and are chosen when the ability is placed on the stack. Hexproof gained later (e.g., when the ability resolves) cannot retroactively make the targeting illegal — the target was already chosen before hexproof applied.

**CR 702.4 (Double Strike) / 702.11b (First Strike)**: Multiple instances of first strike on a creature are redundant — a creature with first strike that gains first strike again still has first strike only once. First strike and double strike do not combine to grant "triple strike." A creature with double strike that gains first strike via backup does not change — double strike already includes the first-strike combat damage step.

**CR 702.154 (Backup)**: *"If a backup ability targets the creature with backup, that creature gets the listed number of +1/+1 counters but does not gain any of the listed abilities."* The abilities below backup are granted only to a different target.

**2023-04-14 rulings**: *"Backup confers only abilities that are actually printed below it. Any abilities that are gained by the permanent are ignored, including abilities gained due to a resolving spell or ability or copy effects."* And: *"The abilities that backup grants to the target creature are determined only once, at the time the ability triggers."*

## The Pattern

```
BACKUP TRIGGER TARGETING TIMELINE:
  1. Backup creature enters battlefield
  2. Backup triggered ability goes on stack → TARGET is chosen NOW
     (target must be legal — can't be hexproof at this moment)
  3. Backup trigger resolves → grants counters + abilities to target
     (target gains hexproof HERE — too late to protect against this trigger)
  4. Target now has hexproof going forward in the turn

  Saiba Cryptomancer example:
    → You target Creature X with backup trigger
    → Trigger resolves: Creature X gets +1/+1 counter and gains hexproof until EOT
    → Hexproof does NOT protect Creature X from this same backup resolution
    → Hexproof DOES protect Creature X from new targeting spells/abilities from
       opponents for the rest of the turn

KEYWORD REDUNDANCY (FIRST STRIKE):
  Boon-Bringer Valkyrie: backup grants flying, first strike, lifelink

  Case A — Target already has first strike:
    → Target gains first strike again → redundant
    → Still has exactly one instance of first strike
    → Does NOT become double strike (double strike is a distinct keyword, CR 702.4)
    → DOES still gain flying and lifelink from backup (non-redundant keywords apply)

  Case B — Target has double strike:
    → Gaining first strike is redundant
    → Double strike already includes both combat damage steps
    → Adding first strike changes nothing
    → DOES still gain flying and lifelink from backup

  Case C — Target has neither:
    → Gains flying, first strike, and lifelink normally until EOT

  Rule of thumb: redundant keyword instances are inert; they do not upgrade
  to the "next tier" keyword (first strike + first strike ≠ double strike)

SELF-TARGET RESTRICTION:
  Backup ability can legally target the backup creature itself
  → BUT: the creature gets the +1/+1 counter(s) WITHOUT gaining the listed abilities
  → The abilities are only granted to a *different* creature
  → This is explicit in the rules, not just default redundancy behavior

  Practical consequence:
    Saiba Cryptomancer backs itself up → gets +1 counter, does NOT gain hexproof
    Boon-Bringer Valkyrie backs itself up → gets +1 counter, does NOT gain
      flying, first strike, or lifelink (it already has them, but this is moot —
      it simply doesn't get granted them by backup)

ABILITIES ARE DETERMINED AT TRIGGER TIME (NOT RESOLUTION TIME):
  If Boon-Bringer Valkyrie loses first strike before the backup trigger resolves
  (e.g., opponent Stifles the enchantment that gave it first strike), the
  backup trigger still grants whatever was printed at trigger time — because
  "the abilities are determined only once, at the time the ability triggers."
  (2023-04-14 ruling)
  HOWEVER: "backup confers only abilities that are actually printed below it" —
  so Valkyrie's printed abilities (flying, first strike, lifelink) are what
  matter, regardless of what Valkyrie happens to have/lack at resolution.
```

## Definitive Conclusions

- **Hexproof from backup cannot protect the target from the backup trigger itself.** The trigger targeted the creature before hexproof existed on it. The targeting is valid; hexproof then applies going forward.
- **Gaining first strike when you already have first strike does nothing.** It does not create double strike. Multiple keyword instances are redundant by CR rule, not additive.
- **A creature with double strike that gains first strike is unchanged.** Double strike already subsumes first strike's function.
- **Backing up yourself gives counters only, no ability grants.** This is an explicit CR rule, not an inference.
- **Backup's granted abilities are locked in at trigger time.** Even if the backup source loses abilities before the trigger resolves, what was printed below backup at trigger time is what gets granted (though only printed abilities, not gained ones, can be conferred).

## Canonical Examples

**Saiba Cryptomancer self-hexproof timing:**
Saiba Cryptomancer ETBs. You target your own Goblin Token with the backup trigger. The trigger goes on the stack — the Goblin is targeted (does not yet have hexproof). Trigger resolves: Goblin gets a +1/+1 counter and gains hexproof until EOT. The Goblin is now protected from further targeting, but the backup trigger that just granted hexproof already resolved successfully — hexproof arrived after targeting.

**Saiba Cryptomancer self-target:**
You target Saiba Cryptomancer itself with its own backup. Cryptomancer gets +1 counter. It does NOT gain hexproof from this — hexproof is only granted to a *different* target creature.

**Boon-Bringer Valkyrie onto a first-striker:**
You back up your Swiftblade Vindicator (double strike, vigilance, trample). Valkyrie enters, backup trigger targets Vindicator. Vindicator gets +1 counter. It gains flying and lifelink (it didn't have them). It would gain first strike — but already has double strike, making first strike wholly redundant. Net result: Vindicator gains flying and lifelink; its double strike is unchanged.

**Boon-Bringer Valkyrie self-target:**
You target Boon-Bringer Valkyrie itself. It gets +1 counter. It does NOT gain flying, first strike, or lifelink from backup (though it already has them — the self-target rule prevents the grant entirely).

## Commonly Confused With
- **P500 (Backup Pronoun Disambiguation)** — P500 covers what "this creature" means inside a granted ability (the target, not the backup source). P502 covers the timing and redundancy mechanics of backup's grant.
- **P466 (Descend, Backup, Eerie basics)** — P466 gives the top-line summary of backup. P502 is a deep dive into the edge cases of hexproof timing, keyword stacking, and self-targeting rules.
- **P027 (Protection DEBT)** — Protection prevents targeting; hexproof also prevents targeting. The key difference: hexproof does not prevent damage, enchanting, or equipping — only targeting. A creature with hexproof CAN still be backed up (backup targets at trigger time before hexproof exists, or the controller can target their own hexproof creatures).
