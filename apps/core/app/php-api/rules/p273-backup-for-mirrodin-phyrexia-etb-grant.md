---
id: p273
name: Backup and For Mirrodin! — ETB Counter Grant and Rebel Token Equipment
category: triggered
cr_refs: [702.165a, 702.165b, 702.165c, 702.165d, 702.163a]
tags: [backup, for-mirrodin, ETB, counter, ability-grant, equipment, rebel-token, Phyrexia-All-Will-Be-One, March-of-the-Machine, Boon-Bringer-Valkyrie, Phyrexian-Censor, Melira-the-Living-Cure]
created: 2026-03-29
examples_count: 2
---

# P273 — Backup and For Mirrodin! — ETB Counter Grant and Rebel Token Equipment

## Abstract
Two mechanics from 2023. **Backup N** (March of the Machine): when a creature with Backup enters, it puts N +1/+1 counters on a target creature. If that target is ANOTHER creature (not itself), it also temporarily gains the abilities printed below the Backup keyword on the backing creature — until end of turn. Backup lets a creature enter and either strengthen itself (for a lasting counter) or strengthen another creature AND lend it the Backup creature's abilities for the turn. **For Mirrodin!** (Phyrexia: All Will Be One): when an Equipment with "For Mirrodin!" enters, create a 2/2 red Rebel creature token, then attach the Equipment to that token. It's a built-in recruit — the Equipment creates its own wielder, giving you both a creature AND an equipped creature in one card.

## The Definitive Rules

**CR 702.165a** (verbatim): *"Backup is a triggered ability. 'Backup N' means 'When this creature enters, put N +1/+1 counters on target creature. If that's another creature, it also gains the non-backup abilities of this creature printed below this one until end of turn.' Cards with backup have one or more abilities printed after the backup ability."*

**CR 702.165b** (verbatim): *"If a permanent enters the battlefield as a copy of a permanent with a backup ability or a token is created that is a copy of that permanent, the order of abilities printed on it is maintained."*

**CR 702.165c** (verbatim): *"Only abilities printed on the object with backup are granted by its backup ability. Any abilities gained by a permanent, whether due to a copy effect, an effect that grants an ability to a permanent, or an effect that creates a token with certain abilities, are not granted by a backup ability."*

**CR 702.165d** (verbatim): *"The abilities that a backup ability grants are determined as the ability is put on the stack. They won't change if the permanent with backup loses any abilities after the ability is put on the stack but before it resolves."*

**CR 702.163a** (verbatim): *"For Mirrodin! is a triggered ability. 'For Mirrodin!' means 'When this Equipment enters, create a 2/2 red Rebel creature token, then attach this Equipment to it.'"*

## The Pattern

```
BACKUP N:
  Triggered: "when this creature enters the battlefield"
  Put N +1/+1 counters on target creature (any creature you control, including itself)
  IF the target is another creature (not itself):
    That other creature ALSO gains the non-backup abilities printed below the Backup keyword
    These granted abilities last until end of turn

  BACKUP TARGETING CHOICES:
    Target ITSELF: put N counters on itself (lasting permanent counters). No ability grant.
    Target ANOTHER creature: put N counters on that creature (lasting) AND grant abilities (temporary).
    Self-targeting: pure counter use — build a bigger body.
    Other-targeting: augment a key attacker for THIS turn with both counters and abilities.

  BACKUP GRANTED ABILITIES:
    "Non-backup abilities of this creature printed below this one"
    All abilities on the Backup card that appear AFTER the Backup keyword
    Flying, trample, first strike, lifelink, vigilance, triggered effects — whatever's printed below
    Not the Backup ability itself (that's a non-granted ability)
    Not abilities gained from elsewhere (CR 702.165c): only printed text matters

  BACKUP + TIMING:
    CR 702.165d: abilities granted are determined when the trigger goes on the stack (the moment
    you choose the target and the trigger triggers). Even if the Backup creature loses its abilities
    before resolution, the grant has already been determined.
    Can't "set up" a different ability set by removing abilities just before resolution.

  BACKUP + COPIES:
    A copy of a Backup creature maintains the printed order of abilities (702.165b)
    The copy also has Backup and the granted abilities in the same relative order
    Backup ability on a copy works the same way: when it enters, backup its target

  BACKUP NOTABLE CARDS (March of the Machine):
    Boon-Bringer Valkyrie ({3}{W}{W}, 4/4 Flying Double Strike Lifelink, Backup 1):
      Abilities printed BELOW Backup 1: Flying, Double Strike, Lifelink
      When enters: put 1 counter on a creature.
      If targeting another creature: that creature gets +1/+1 AND gains flying + double strike + lifelink until EOT.
      Turn a ground creature into a 4-hit killing machine for one combat.
      Target your best attacker before combat: it gets flying (evasion) + double strike + lifelink.

    Melira, the Living Cure ({1}{G}, 2/2, Backup 2):
      Abilities below Backup: "When this creature enters, target player gains life equal to life lost..."
      Wait: Melira has a complex triggered ability. Let me use the more straightforward example.

    Phyrexian Censor ({2}{W}, 2/2, Backup 1):
      "When Phyrexian Censor enters, put 1 counter on target creature. If another, it gains [relevant ability]."
      The granted abilities depend on what's printed below the Backup keyword on the specific card.

  BACKUP + BUFFS BEFORE ENTERING:
    The Backup creature's stats when entering don't affect the trigger (it just puts N counters)
    A 1/1 Backup 3 gives 3 counters — the creature's own stats don't matter for the counter count

FOR MIRRODIN!:
  Triggered: "when this Equipment enters"
  Creates a 2/2 red Rebel creature token
  Then AUTOMATICALLY attaches the Equipment to that token
  No additional cost to equip: the Equipment deploys with its own bearer

  FOR MIRRODIN! RULES:
    The token is 2/2 red Rebel (set stats)
    The Equipment is attached to the token immediately (from the same trigger)
    You get: a creature AND an equipped creature in one card
    If the token dies: the Equipment stays on the battlefield as a regular (unequipped) Equipment
    Re-equip the Equipment to another creature using the normal equip cost

  FOR MIRRODIN! EQUIPMENT CARDS (Phyrexia: All Will Be One):
    Kemba's Oathsworn ({3}{W}, Equipment — Sword): "Equipped creature gets +2/+1."
      For Mirrodin!: enter → create 2/2 Rebel → attach Kemba's Oathsworn.
      The 2/2 Rebel immediately has +2/+1 → becomes 4/3 the moment it enters.
      You deployed a 4/3 creature for 4 mana. Plus you have the Equipment if it dies.

    Skrelv's Hive... is not an Equipment. For Mirrodin! appears on multiple White Equipment cards.

    The key: "For Mirrodin!" Equipment are always white and always create the same 2/2 red Rebel.
    Combine Equipment's normal boost with the auto-attachment: immediate efficient deployment.

  FOR MIRRODIN! + EQUIPMENT MATTERS:
    Equipment tribal decks (Puresteel Paladin, Sram, Senior Edificer): "For Mirrodin!" Equipment
    triggers when any Equipment enters → drawing cards.
    Also: the 2/2 Rebel entering triggers "creature enters" abilities.
    Double payoff: Equipment enters (triggers Equipment matters), creature enters (triggers creature matters).

  FOR MIRRODIN! + EQUIPMENT ANIMATION:
    If you use the Equipment on another creature: first move it (pay equip cost) to desired target.
    The Rebel token is now unequipped (still on battlefield as a 2/2).
    Two creatures for one card: the Rebel + whatever the Equipment moves to.
```

## Definitive Conclusions

- **Backup targets any creature** — target itself for permanent counters, target another for counters AND temporary abilities.
- **Backup grants abilities printed BELOW the Backup keyword** — only the printed text, not gained abilities.
- **Granted abilities are determined when the trigger goes on the stack** — can't be changed by mid-resolution ability loss.
- **For Mirrodin! creates a 2/2 red Rebel AND attaches the Equipment to it** — one card deploys both creature and equipped creature.
- **The Rebel token serves as the Equipment's default bearer** — if the token dies, the Equipment stays and can be moved.

## Canonical Example
**Boon-Bringer Valkyrie Backup Grants Flight + Double Strike + Lifelink:**
Board: Your 5/5 Green Wurm (no evasion). You cast Boon-Bringer Valkyrie from hand.
Valkyrie ETBs. Backup 1 trigger goes on the stack.
You choose the 5/5 Wurm as the target.
Backup resolves: put 1 +1/+1 counter on the Wurm (it's now 6/6). Since it's ANOTHER creature:
The Wurm also gains Flying + Double Strike + Lifelink until end of turn.
Attack with 6/6 Flying Double Strike Lifelink Wurm.
First strike damage: 6. Regular strike damage: 6. Total 12 damage with lifelink (+12 life).
Opponent's blockers killed by first strike, no second-strike damage back.
After the turn: Wurm loses the granted abilities. But keeps the +1/+1 counter permanently.
Boon-Bringer Valkyrie gave the Wurm a once-per-turn combat alpha strike package.

**Example 2 — For Mirrodin! Equipment Tribal:**
Board: Puresteel Paladin (equipped creature means "draw a card when an Equipment enters").
Cast Kemba's Oathsworn ({3}{W}, Equipment with For Mirrodin!).
Trigger 1: Puresteel Paladin sees Equipment entering → draw a card.
Trigger 2: For Mirrodin! → create 2/2 red Rebel token.
Trigger 3: For Mirrodin! then attaches Kemba's Oathsworn to the Rebel.
Result: 4/3 Rebel token (2/2 + 2/1 from Equipment), drew a card, deployed both creature and equipment.
One 4-mana investment: drew a card, got a 4/3 creature, and have the Equipment ready to move.

## Commonly Confused With
- **P225 (Heroic)** — Heroic triggers from being targeted; Backup triggers when the Backup creature enters (targets another as part of ETB trigger).
- **P163 (Training)** — Training puts +1/+1 counters on a creature when attacking alongside a more powerful creature; Backup puts counters on entry when you target another creature.
- **P167 (Equipment Basics)** — Equipment must be equipped using its equip cost; For Mirrodin! is an ETB auto-attach to a generated token, bypassing the equip cost entirely.
