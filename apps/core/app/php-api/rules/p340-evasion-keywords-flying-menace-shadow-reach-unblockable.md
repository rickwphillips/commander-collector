---
id: p340
name: Evasion Keywords — Flying, Menace, Shadow, Reach, Fear, and Unblockable Effects
category: combat
cr_refs: [702.9a, 702.9b, 702.9c, 702.17a, 702.17b, 702.111a, 702.111b, 702.28a, 702.28b, 702.13a, 702.13b, 509.1a, 509.1b]
tags: [evasion, flying, reach, menace, shadow, fear, intimidate, landwalk, unblockable, cant-be-blocked, Rogue-class, Blighted-Agent, Akroma-angel, True-Name-Nemesis, Latch-Seeker, Curiosity-Kraken, Dungeon-Descent, evasion-stack]
created: 2026-03-29
examples_count: 2
---

# P340 — Evasion Keywords — Flying, Menace, Shadow, Reach, Fear, and Unblockable Effects

## Abstract
**Evasion** keywords restrict which creatures can block an attacker. **Flying** requires a blocker to have flying or reach. **Menace** requires two or more blockers. **Shadow** creates a parallel combat lane: shadow creatures can only block/be-blocked by other shadow creatures. **Fear** and **Intimidate** restrict blockers to artifact creatures and black/same-color creatures respectively. Multiple evasion abilities stack — a creature with both flying and menace requires two flying or reach creatures to block it. "Can't be blocked" (appearing in text like True-Name Nemesis) is an absolute restriction, not an evasion keyword, and nothing can make it blockable.

## The Definitive Rules

**CR 702.9b** (verbatim): *"A creature with flying can't be blocked except by creatures with flying and/or reach. A creature with flying can block a creature with or without flying."*

**CR 702.17b** (verbatim): *"A creature with flying can't be blocked except by creatures with flying and/or reach. (See rule 509, 'Declare Blockers Step,' and rule 702.9, 'Flying.')"*

**CR 702.111b** (verbatim): *"A creature with menace can't be blocked except by two or more creatures."*

**CR 702.28b** (verbatim): *"A creature with shadow can't be blocked by creatures without shadow, and a creature without shadow can't be blocked by creatures with shadow."*

**CR 702.13b** (verbatim): *"A creature with intimidate can't be blocked except by artifact creatures and/or creatures that share a color with it."*

## The Pattern

```
FLYING (CR 702.9b):
  Blocked only by: creatures with flying OR reach (or both).
  Flying creature can block: any creature (flying or not).
  COMMON FLYERS:
    Serra Angel ({3}{W}{W}): 4/4 flying vigilance.
    Vendilion Clique ({1}{U}{U}): 3/1 flying flash.
    Baneslayer Angel ({3}{W}{W}): 5/5 flying, first strike, lifelink, protection from Demons/Dragons.
  FLYING INTERACTION WITH REACH:
    A creature with reach CAN block flyers, even though reach has nothing to do with "flying."
    A reach creature is essentially "can block flying creatures" without itself flying.
    Reach example: Plumeveil ({G/U}{G/U}{G/U}): 0/5 Illusion, flying AND reach.
      Wait: Plumeveil has flying. Reach on a flying creature is redundant (it can block other flyers already).
      But: Greatbow Doyen has reach — it can block flying creatures.
    Reach creatures can't fly over opposing flyers when ATTACKING. Only helps with BLOCKING.
      A reach creature attacking: an opposing flying creature can still block it.
      Reach only says "can block creatures with flying." It doesn't give the ability to avoid being blocked.

MENACE (CR 702.111b):
  "Can't be blocked except by two or more creatures."
  Requires the defending player to use at LEAST 2 blockers or let it through.
  TWO-BLOCKER REQUIREMENT:
    If defender has only one creature: can't block the menace creature. It gets through.
    If defender assigns 2 blockers but one is removed before damage step (flicker, sacrifice):
      Check at declaration of blockers. Once legally declared, if one blocker dies before damage:
        The remaining blocker still blocks (is still a legal blocker — it was declared legally).
        The creature is still blocked. No trample damage bypasses unless the creature has trample.
  STACKING EVASION WITH MENACE:
    A creature with flying + menace: requires two blockers, each with flying or reach.
    A creature with menace + trample: two blockers required; excess damage tramples through to player.
    Angrath's Marauders ({5}{R}{R}): menace. If blocked: two blockers needed, but combat damage doubled.

SHADOW (CR 702.28b):
  Shadow creates a separate "combat dimension."
  Shadow creatures: can't be blocked by non-shadow creatures.
  Non-shadow creatures: can't block shadow creatures.
  Shadow creatures: CAN block other shadow creatures.
  This creates two parallel combat lanes: shadow world and non-shadow world.
  PRACTICAL IMPLICATION:
    In an all-shadow deck (Tempest/Urza Block): your shadow creatures punch through opponent's non-shadow creatures freely.
    But: opponent's shadow creature can block yours.
    Not many cards from modern sets use shadow. It's a legacy mechanic.

FEAR (CR 702.13a):
  A creature with fear can't be blocked except by artifact creatures and/or black creatures.
  Fear is old (replaced by intimidate in Zendikar, then menace in Magic Origins+).
  Fear = artifact blockers OR black blockers only.
  Non-black, non-artifact creatures can't block.

INTIMIDATE (deprecated after M14):
  Similar to fear but color-dependent: can't be blocked except by artifact creatures and/or creatures that share a color with the intimidate creature.
  A red creature with intimidate: only artifact or red creatures can block it.
  A green creature with intimidate: only artifact or green creatures can block it.
  MULTICOLOR: a red-green creature with intimidate: blocked by artifact, red, or green creatures.
  Intimidate was removed from the game after M14. Remaining cards had errata or it was phased out.

LANDWALK (deprecated):
  "[Type]walk": can't be blocked if the defending player controls a land of the specified type.
  Islandwalk: can't be blocked if defender controls an Island.
  Swampwalk: can't be blocked if defender controls a Swamp.
  Effective against dual lands (if a land is both Forest and Island: both forestwalk and islandwalk apply).
  Landwalk was removed from Standard printing in M15. Older cards still have it.

"CAN'T BE BLOCKED" (ABSOLUTE RESTRICTION):
  Some creatures or effects make a creature flat-out unblockable.
    True-Name Nemesis ({1}{U}{U}): "As this enters, choose a player. True-Name Nemesis has protection from that player."
      Protection from a player: can't be blocked by creatures that player controls. Can't be targeted by their spells. Can't be dealt damage by permanents they control.
      This is PROTECTION, not technically "can't be blocked." But effectively: can't be blocked by the chosen player's creatures.
    Blighted Agent ({1}{U}): "Infect. Blighted Agent is unblockable." Plain text on the card. Just "unblockable."
      There's no keyword ability "unblockable" — it's rules text saying "can't be blocked."
    Latch Seeker ({1}{U}{U}): "Unblockable." Same — text on card.

  CAN YOU GIVE AN UNBLOCKABLE CREATURE THE ABILITY TO BE BLOCKED?
    No effect "gives blocking ability" to a creature that can't be blocked. You can't make a defender block an unblockable creature.
    "Can't be blocked" on the ATTACKER is an absolute restriction on the BLOCKER: the blocker's controller can't choose an unblockable creature as a valid blocking target.

  WHAT ABOUT "MUST BE BLOCKED" EFFECTS?
    Some effects say "target creature must be blocked if able."
    Against an unblockable creature: "if able" fails because it CAN'T be blocked. The creature still gets through.
    "Must be blocked" overrides a PLAYER'S CHOICE not to block, but not a rule that says "can't be blocked."

EVASION STACKING:
  Multiple evasion abilities combine as restrictions.
  A creature with flying + menace: needs two blockers, each with flying or reach.
  A creature with shadow + flying: can only be blocked by shadow creatures with flying or reach.
    If there are no shadow creatures in the format: this creature is effectively unblockable.
  A creature with fear + flying: only artifact or black creatures with flying or reach can block it.
  If no creature satisfies ALL restrictions: the creature is effectively unblockable.

REACH IS ONLY FOR BLOCKING:
  Reach allows a non-flying creature to BLOCK flying creatures.
  Reach does NOT give the creature any evasion.
  An attacking creature with reach: has no special property for attacking. Can be blocked normally.
  A blocking creature with reach: can block flying attackers.
  COMMON REACH CREATURES:
    Giant Spider (2/4 reach): vanilla reach creature. Classic.
    Nessian Asp (2/7 reach): large ground creature that can block flyers.
    Bow of Nylea (equipment): "Equipped creature has deathtouch. Reach." Gives reach to equipped.

MULTIPLE BLOCKERS AND DAMAGE:
  A single attacker blocked by multiple blockers: attacker assigns damage to blockers in any order.
  Attacker must assign "lethal damage" to one blocker before assigning damage to the next.
  With deathtouch: 1 damage = lethal. Can spread 1 damage to each blocker.
  Without deathtouch: must assign lethal damage to first blocker before moving to next.
  Menace creature blocked by 2: attacker assigns damage between the two. Trample still goes through
    to player only if BOTH blockers are assigned lethal damage (and creature has trample).
```

## Definitive Conclusions

- **Flying requires flying or reach to block** — reach helps only when blocking, not when attacking.
- **Menace requires two or more blockers** — if only one creature is available, it can't block a menace creature.
- **Shadow creates a separate blocker dimension** — shadow creatures can only interact with other shadow creatures in blocking.
- **"Can't be blocked" is absolute** — no effect can override text saying a creature can't be blocked.
- **Evasion abilities stack** — multiple evasion restrictions must ALL be satisfied for a blocker to be legal.
- **Fear/Intimidate/Landwalk are deprecated** — older mechanics that have been phased out of standard printings; legacy cards still use them.

## Canonical Example
**Blighted Agent — Pure Unblockable Infect:**
Blighted Agent ({1}{U}): 1/1 infect, unblockable.
Rules text says: "Unblockable." This means the creature literally cannot be blocked (no keyword, just text).
No creature in any deck can block Blighted Agent. Even creatures with protection from blue COULD block normally... but the "unblockable" text prevents ALL blocking.
True-Name Nemesis ({1}{U}{U}) vs. Blighted Agent:
  True-Name has "protection from that player." Its ability says "can't be targeted by [chosen player's] spells, damaged by sources they control, or blocked by creatures they control."
  So True-Name can't block Blighted Agent if True-Name's controller is the "chosen player." (They chose themselves or were chosen.) Protection says "creatures they control can't block it."
  And Blighted Agent is unblockable ANYWAY.
With 3 pump spells, Blighted Agent deals 9 poison counters in one attack. One more attack or proliferate: win.

**Example 2 — Multiple Evasion Types Stacking:**
You control: Akroma, Angel of Wrath ({5}{W}{W}{W}): 6/6 flying, first strike, vigilance, trample, haste, protection from black and red.
Opponent wants to block. Their creatures:
  Option 1: Red Dragon (4/4 flying): has flying but is RED → protection from red → can't block Akroma.
  Option 2: Black angel (3/3 flying): has flying but is BLACK → protection from black → can't block.
  Option 3: Black Dragon (5/5 flying): flying + black → protection blocks this too.
  Option 4: Green Dragon (5/5 flying): green, not black or red. CAN block!
    Green Dragon has flying → satisfies the flying/reach requirement.
    Green Dragon is not black or red → not blocked by protection.
    Green Dragon can legally block Akroma.
  Option 5: White Human (3/3): no flying. Can't block (no flying or reach).
  Option 6: Artifact Flier (3/3 flying artifact): no color (colorless). Not black or red. Has flying. CAN block!

Akroma's protection doesn't stop non-black, non-red creatures. Her flying prevents ground creatures. But flying non-black non-red creatures? They can block her.
Akroma is formidable but not unblockable. She's highly evasive against certain deck types.

## Commonly Confused With
- **P305 (Protection DEBT)** — Protection from [quality] includes "can't be blocked by [quality] creatures." It's a specific type of evasion within the broader DEBT framework. Menace, flying, etc. are distinct evasion keywords unrelated to protection.
- **P308 (Trample)** — Trample doesn't provide evasion but works alongside it. A creature with flying + trample: can only be blocked by flying/reach creatures, and if blocked, excess damage tramples through. Two-creature attack (one flying, one trample): each applies independently.
- **P309 (First Strike)** — First strike creates a two-damage-step combat. Evasion abilities affect whether a creature can be BLOCKED. Once blocked, first strike determines the order of damage. Evasion only matters at blocking declaration.
- **P335 (Hexproof)** — Hexproof prevents targeting but doesn't provide any combat evasion. A hexproof creature can still be blocked normally by any legal blocker.
