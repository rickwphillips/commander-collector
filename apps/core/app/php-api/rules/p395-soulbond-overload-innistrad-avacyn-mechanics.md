---
id: p395
name: Soulbond and Overload — Creature Pairing and Text-Replacing Alternative Costs
category: triggered
cr_refs: [702.95a, 702.95b, 702.95c, 702.95d, 702.95e, 702.96a, 702.96b, 702.96c, 612.1]
tags: [soulbond, overload, paired-creature, unpaired-creature, pairing-bond, loses-control-unpairs, text-changing-effect, target-becomes-each, alternative-cost-overload, Avacyn-Restored, Return-to-Ravnica, Silverblade-Paladin, Wolfir-Silverheart, Cyclonic-Rift, Mizzium-Mortars, Bonfire-of-the-Damned, pairing-triggers, can-pair-with-self, cant-target-when-overloaded]
created: 2026-03-29
examples_count: 2
---

# P395 — Soulbond and Overload — Creature Pairing and Text-Replacing Alternative Costs

## Abstract
**Soulbond** (702.95) is a keyword representing two linked triggered abilities: when a soulbond creature enters (or another creature enters while a soulbond creature is unpaired), the two creatures may be "paired." Paired creatures share the benefits of any abilities that reference being paired. A creature can only be paired with one other creature; pairings break when either creature leaves the battlefield, stops being a creature, or changes controller. **Overload** (702.96) is an alternative cost mechanic on instants/sorceries: pay the overload cost instead of the normal cost, and the spell's text is changed so every instance of "target" becomes "each" — the spell no longer targets anything and instead affects everything of the given type. This is a text-changing effect (rule 612) that means the overloaded spell can't be countered by "counter target spell" if the effect only targets creatures, and it bypasses hexproof and shroud.

## The Definitive Rules

**CR 702.95a** (verbatim): *"Soulbond is a keyword that represents two triggered abilities. 'Soulbond' means 'When this creature enters, if you control both this creature and another creature and both are unpaired, you may pair this creature with another unpaired creature you control for as long as both remain creatures on the battlefield under your control' and 'Whenever another creature you control enters, if you control both that creature and this one and both are unpaired, you may pair that creature with this creature for as long as both remain creatures on the battlefield under your control.'"*

**CR 702.95b** (verbatim): *"A creature becomes 'paired' with another as the result of a soulbond ability. Abilities may refer to a paired creature, the creature another creature is paired with, or whether a creature is paired. An 'unpaired' creature is one that is not paired."*

**CR 702.95c** (verbatim): *"When the soulbond ability resolves, if either object that would be paired is no longer a creature, no longer on the battlefield, or no longer under the control of the player who controls the soulbond ability, neither object becomes paired."*

**CR 702.95d** (verbatim): *"A creature can be paired with only one other creature."*

**CR 702.95e** (verbatim): *"A paired creature becomes unpaired if any of the following occur: another player gains control of it or the creature it's paired with; it or the creature it's paired with stops being a creature; or it or the creature it's paired with leaves the battlefield."*

**CR 702.96a** (verbatim): *"Overload is a keyword that represents two static abilities that function while the spell with overload is on the stack. Overload [cost] means 'You may choose to pay [cost] rather than pay this spell's mana cost' and 'If you chose to pay this spell's overload cost, change its text by replacing all instances of the word "target" with the word "each."' Casting a spell using its overload ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.96b** (verbatim): *"If a player chooses to pay the overload cost of a spell, that spell won't require any targets. It may affect objects that couldn't be chosen as legal targets if the spell were cast without its overload cost being paid."*

**CR 702.96c** (verbatim): *"Overload's second ability creates a text-changing effect. See rule 612, 'Text-Changing Effects.'"*

## The Pattern

```
SOULBOND (702.95):
  TWO TRIGGERED ABILITIES:
    Trigger 1: "When THIS creature enters, if you control both this creature and another creature
      and both are unpaired, you may pair this creature with another unpaired creature you control."
    Trigger 2: "Whenever ANOTHER creature you control enters, if you control both that creature
      and this one and both are unpaired, you may pair that creature with this creature."
    Together: soulbond fires on the soulbond creature's own ETB, AND on future ETBs of other creatures.
  PAIRING CONDITIONS (702.95c):
    The soulbond ability resolves. At resolution, check:
      - Is each creature still on the battlefield? If either left: no pairing.
      - Is each still a creature? (Could have become a non-creature somehow.) If not: no pairing.
      - Does the controller still control both? If control changed: no pairing.
    ALL conditions must be true for the pairing to occur.
    "You may" — pairing is optional. You choose whether to pair when the trigger resolves.
  WHAT PAIRING DOES:
    Pairing itself has no rules meaning. It's a shared designation.
    The soulbond creature's abilities reference "as long as [this/that creature] is paired with [a creature]."
    Example: Silverblade Paladin ({1}{W}{W}: 2/2, soulbond, "as long as Silverblade Paladin is
      paired with another creature, both creatures have double strike"):
      When Silverblade Paladin enters: pair it with a creature you control.
      Both get double strike while paired.
    Example: Wolfir Silverheart ({3}{G}{G}: 4/4, soulbond, "as long as Wolfir Silverheart is paired
      with another creature, each of those creatures gets +4/+4"):
      Both get +4/+4. Wolfir Silverheart becomes 8/8; its pair becomes [x+4]/[y+4].
  ONE PAIRING AT A TIME (702.95d):
    Each creature can only be paired with one other creature.
    A creature that's already paired is not "unpaired." It can't pair with a third creature.
    To re-pair: the pairing must break first (702.95e).
    Breaking conditions: either creature leaves the battlefield, stops being a creature,
      or changes controller.
    Note: "stops being a creature" includes:
      - Opalescence effects making enchantments into creatures then back
      - Humility removing all creature types
      - Becoming a land (but remaining a permanent)
  SOULBOND IN MULTIPLAYER:
    "Another unpaired creature you control" — MUST be under YOUR control.
    You can only pair with YOUR OWN creatures. Not an opponent's.
    If an opponent gains control of one paired creature (Threaten effect):
      702.95e: "another player gains control of it" → unpairing. Both become unpaired.
    After control returns: the creatures are still unpaired. No automatic re-pairing.
      To re-pair: a soulbond trigger must fire again (another creature entering, or bounce + re-cast).
  ENTERING SIMULTANEOUSLY:
    If two creatures enter simultaneously (e.g., mass reanimation):
      One has soulbond. Both triggers fire (one for each ETB event).
      They can pair with each other during resolution.
      But: 702.95c checks "if you control both... and both are unpaired" at resolution.
        If resolved in APNAP order: first soulbond trigger resolves first.
        Both are on the battlefield (simultaneous entry). Controller controls both. Both unpaired.
        First trigger resolves → pairs A with B.
        Second trigger tries to resolve → A and B are now PAIRED (no longer unpaired) → doesn't pair.
        Only one pairing from simultaneous entry, not multiple.

OVERLOAD (702.96):
  THE ALTERNATIVE COST:
    "Overload [cost]" — pay this cost INSTEAD of the normal mana cost.
    When paid: the spell's text changes — all instances of "target" become "each."
    This is a text-changing effect on the stack (rule 612). The spell is literally different.
  NO TARGETS:
    702.96b: if overload cost was paid, the spell "won't require any targets."
    No targets = no targeting choices = not a targeted spell.
    Cannot be countered by "counter target spell targeting [something]" in response to targeting.
    Wait — can any spell counter it? Yes, a general "counter target spell" works (the spell is still on the stack).
    But: "counter target spell targeting a creature"? If overloaded, no creature is targeted.
      Such a counter spell can't target the overloaded spell at all.
    Hexproof and shroud: don't apply. Those protect from being targeted. If the overloaded spell
      doesn't target: it isn't targeting them. It can still affect them via "each [permanent type]."
    This is one of the defining strategic uses of overload: hit hexproof/shroud creatures!
  THE TEXT-CHANGE (702.96c, rule 612):
    Overload's text-change effect applies while the spell is on the stack.
    All instances of "target" become "each":
      "Destroy target creature" → "Destroy each creature"
      "Return target permanent to its owner's hand" → "Return each permanent to its owner's hand"
    This can produce surprising results if the spell has multiple instances of "target":
      Each one changes to "each."
    COPYING AN OVERLOADED SPELL:
      Copies made of a resolving spell — not typically applicable.
      But: if you copy a spell on the stack with overload: the copy is made from the modified text.
        The copy is also "overloaded" (has the same text-changing effect).
      Wait: when you copy a spell on the stack (Fork, Reverberate), you copy its current text.
        The overloaded spell has "each" in it. The copy also has "each."
        The copy also has no targets (since it's based on the modified text).
  OVERLOAD AND MODAL SPELLS:
    If an overloaded spell had modes with "target": each mode's "target" becomes "each."
    You still choose modes (unless the spell says "choose all modes" when overloaded).
    The overloaded version of each mode affects "each" qualifying permanent.
  EXAMPLE — CYCLONIC RIFT:
    Cyclonic Rift ({1}{U}: Instant, "Return target nonland permanent you don't control to its owner's hand."
      Overload {6}{U}: instead of returning one permanent, overloaded Cyclonic Rift returns
      ALL nonland permanents you don't control to their owners' hands.)
    Overloaded version: "Return each nonland permanent you don't control to its owner's hand."
    This hits everything: creatures, artifacts, enchantments, planeswalkers, battles, etc.
    Hexproof? Shroud? Doesn't matter — the spell doesn't target.
    Protection? Protection protects from being targeted (and from damage, blocking, equipping).
      "Can't be the target of spells or abilities" — if the spell doesn't target: protection irrelevant.
      But: "can't be dealt damage from... colored sources" and similar protection effects don't apply here.
      Wait: protection says: "can't be the target of... spells [with the given quality]."
        Overloaded Cyclonic Rift is blue, instant, doesn't target. Protection from blue?
          Normally: protection from blue would prevent targeting by blue spells.
          Overloaded: the spell doesn't TARGET the creature. The effect just says "each."
          So: protection from blue does NOT protect from overloaded Cyclonic Rift?
          Actually: protection's 4 effects (DEBT): Damage, Enchanted/equipped, Blocked, Targeted.
          Protection prevents TARGETED effects. Not non-targeted. Overloaded = not targeted.
          Result: protection from blue does NOT prevent being bounced by overloaded Cyclonic Rift.
  EXAMPLE — MIZZIUM MORTARS:
    Mizzium Mortars ({1}{R}: Sorcery, "Mizzium Mortars deals 4 damage to target creature you don't control."
      Overload {3}{R}{R}{R}: each creature you don't control.):
    Overloaded: deals 4 damage to each creature you don't control.
    Note: your own creatures are safe. "You don't control" — your creatures aren't targeted or affected.
    Opponents' creatures all take 4 damage.
    No hexproof protection. Even indestructible creatures... take the damage (they survive it, but take it).
```

## Definitive Conclusions

- **Soulbond pairing is mutual and requires both creatures to remain under your control** — if either creature changes controller, leaves the battlefield, or stops being a creature, both become unpaired; re-pairing requires a new soulbond trigger to fire.
- **Each creature can only be paired with one other creature** (702.95d) — you can't daisy-chain soulbond pairs; one creature, one partner.
- **Soulbond checks conditions at resolution** (702.95c) — if a creature leaves the battlefield between trigger and resolution, no pairing occurs; this is the intervening-if pattern (P006).
- **Overloaded spells don't target** (702.96b) — they bypass hexproof, shroud, and protection from targeted effects; they still affect permanents with those abilities since the spell just says "each."
- **Overload creates a text-changing effect** (702.96c) — "target" literally becomes "each" in the spell's text; copies of overloaded spells also use the modified text.

## Canonical Example
**Silverblade Paladin Soulbond Sequence:**
Silverblade Paladin ({1}{W}{W}: 2/2, soulbond, "as long as Silverblade Paladin is paired with another creature, both creatures have double strike"):

Turn 4: You have a 3/3 Grizzly Bears and cast Silverblade Paladin.
Silverblade Paladin enters the battlefield. Soulbond trigger fires:
"When this creature enters, if you control both this creature and another creature and both are unpaired..."
Condition: you control Silverblade Paladin and Grizzly Bears, both unpaired. True.
You may pair: you choose Grizzly Bears.
Soulbond trigger resolves: Silverblade Paladin and Grizzly Bears are now paired.

Static ability: "as long as both are paired, both have double strike."
Silverblade Paladin: 2/2 double strike.
Grizzly Bears: 3/3 double strike.

Opponent uses Act of Treason on Silverblade Paladin (gains control until EOT).
702.95e: "another player gains control of it" → both Silverblade Paladin and Grizzly Bears become unpaired.
Grizzly Bears loses double strike. Silverblade Paladin loses double strike.

At end of turn: Act of Treason ends; Silverblade Paladin returns to your control.
BUT: no re-pairing automatically. You need a new soulbond trigger.
Bounce Silverblade Paladin to your hand and recast: new ETB, new soulbond trigger → re-pair.

**Example 2 — Cyclonic Rift Overload:**
3-player Commander game. Opponent A has: 6/6 hexproof Dragon, 4/4 shroud Titan, 2/2 protection-from-blue Soldier.
Opponent B has: 5/5 planeswalker, 3/3 artifact creature.

You cast Cyclonic Rift for its overload cost ({6}{U}).
Text changes: "Return each nonland permanent you don't control to its owner's hand."
No targets. The spell doesn't target anything.

Resolution:
- 6/6 hexproof Dragon: hexproof prevents targeting. No targeting occurred. Bounced anyway.
- 4/4 shroud Titan: same logic. Bounced.
- 2/2 protection-from-blue Soldier: protection from blue protects from being TARGETED by blue spells.
  This spell is blue, but it doesn't target the Soldier. Protection irrelevant. Bounced.
- 5/5 planeswalker: returned to Opponent B's hand.
- 3/3 artifact creature: returned to Opponent B's hand.
- Your own permanents: unaffected ("you don't control" = opponent-controlled only).

All of Opponent A's and B's nonland permanents go back to their hands.
Cyclonic Rift's power: board state reset at instant speed for {6}{U} + any amount of your own card management.

## Commonly Confused With
- **P002 (Replacement Effects)** — Soulbond's pairing is a static ability effect (the shared keyword ability is a continuous effect). Overload's text change is a text-changing effect (rule 612), not a replacement effect.
- **P008 (Can't vs. Can)** — Protection prevents targeted effects. Overloaded spells bypass hexproof/shroud/protection because they don't target. The key principle: "can't be targeted" only applies when targeting is involved.
- **P394 (Renown/Awaken/Devoid)** — Awaken also uses an alternative cost; overload uses an alternative cost that replaces "target" with "each." Both are alternative cost mechanics but with fundamentally different effects.
- **P393 (Extort/Exploit)** — Soulbond pairs creatures for shared bonuses; exploit sacrifices creatures for bonus effects. Superficially similar (involve pairs of creatures) but mechanically different (soulbond grants ongoing benefits; exploit is a one-time sacrifice).
