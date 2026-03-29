---
id: p332
name: Phasing, Blinking, and Flicker Effects — Zone Exits, Re-Entry, and the "Exist" Question
category: zones
cr_refs: [702.26a, 702.26b, 702.26c, 702.26d, 702.26e, 702.26f, 702.26g, 702.26j, 400.7, 603.6, 614.1c]
tags: [phasing, blink, flicker, exile-return, zone-change, ETB-triggers, new-object, Restoration-Angel, Ephemerate, Momentary-Blink, Teferi-Time-Raveler, counters-lost, Auras-fall-off, phased-out-exist, Phase-Out-timing, Soulherder]
created: 2026-03-29
examples_count: 2
---

# P332 — Phasing, Blinking, and Flicker Effects — Zone Exits, Re-Entry, and the "Exist" Question

## Abstract
**Phasing** is a unique mechanic where a permanent transitions between "phased in" (exists) and "phased out" (effectively doesn't exist) without ever leaving the battlefield. No zone-change triggers fire. Counters remain. Auras and Equipment phase out with it. By contrast, **blink effects** (exile then return to battlefield) DO cause zone changes — the permanent leaves and re-enters as a **new object** (P311), losing all counters, falling off Auras, triggering ETB abilities fresh. Understanding whether an effect uses phasing or exile-return is critical to knowing what survives.

## The Definitive Rules

**CR 702.26b** (verbatim): *"If a permanent phases out, its status changes to 'phased out.' Except for rules and effects that specifically mention phased-out permanents, a phased-out permanent is treated as though it does not exist. It can't affect or be affected by anything else in the game."*

**CR 702.26d** (verbatim): *"The phasing event doesn't actually cause a permanent to change zones or control, even though it's treated as though it's not on the battlefield and not under its controller's control while it's phased out. Zone-change triggers don't trigger when a permanent phases in or out. Tokens continue to exist on the battlefield while phased out. Counters and stickers remain on a permanent while it's phased out. Effects that check a phased-in permanent's history won't treat the phasing event as having caused the permanent to leave or enter the battlefield or its controller's control."*

**CR 702.26g** (verbatim): *"When a permanent phases out, any Auras, Equipment, or Fortifications attached to that permanent phase out at the same time. This alternate way of phasing out is known as phasing out 'indirectly.' An Aura, Equipment, or Fortification that phased out indirectly won't phase in by itself, but instead phases in along with the permanent it's attached to."*

**CR 702.26j** (verbatim): *"Abilities that trigger when a permanent becomes attached or unattached from an object or player don't trigger when that permanent phases in or out."*

**CR 400.7** (verbatim): *"An object that moves from one zone to another becomes a new object with no memory of, or relation to, its previous existence. There are nine exceptions to this rule..."*

## The Pattern

```
PHASING MECHANICS:
  A permanent with Phasing (or that becomes phased out by an effect):
    During its controller's untap step, BEFORE untapping:
      - Phased-in permanents with Phasing → phase OUT.
      - Previously phased-out permanents → phase IN.
    This alternates each turn (on/off/on/off).

  WHAT PHASING OUT DOES:
    CR 702.26b: treated as though it doesn't exist.
    Can't be targeted, blocked, or affect the game.
    Doesn't count for "creatures you control" effects while phased out.
    "Wrath of God destroys all creatures" — phased out creature is NOT destroyed (doesn't exist).
    "Draw a card for each creature you control" — phased out creatures don't count.

  WHAT PHASING DOES NOT DO:
    CR 702.26d: NO zone change. The permanent is still on the battlefield.
    → Zone-change triggers DON'T fire: no "leaves the battlefield" trigger, no "enters the battlefield" trigger.
    → Tokens survive phasing out (they'd cease in other zones, but phasing isn't a zone change).
    → Counters REMAIN on phased-out permanents.
    → Effects don't treat phasing as "left the battlefield" for duration purposes — BUT:
      "for as long as" effects that track the permanent end when it phases out (702.26f), because
      they can "no longer see" it.

  AURAS AND EQUIPMENT PHASING (CR 702.26g):
    When a permanent phases out: any attached Auras, Equipment, Fortifications phase out WITH it.
    They're not "unattached" — they stay attached while phased out.
    When the permanent phases back in: attached Auras/Equipment come back in still attached.
    Abilities that trigger "when a permanent becomes attached/unattached" DON'T trigger (CR 702.26j).
    This is the OPPOSITE of blink: blink causes all attachments to fall off and become new objects.

  PHASING AND SUMMONING SICKNESS:
    If a creature phases out and phases back in: it's still the same object, no zone change.
    The "been under controller's control continuously since last turn" rule (302.6) is NOT reset.
    A creature that was phased out and phases in on your turn: can attack (if it met the continuity requirement).
    Wait: CR 702.26d: phasing doesn't count as leaving or entering the battlefield for history purposes.
    So: if a creature has been under your control since before its phase-out, after phase-in, it still has.
    No summoning sickness reset from phasing.

  PHASE OUT AS PROTECTION:
    Some effects say "Phase out target permanent you control." (e.g., Teferi's Protection, Slip Out the Back)
    On your turn: creatures phase in.
    Phase out your creature in response to removal → it doesn't exist when removal resolves.
    Phase in on next untap step (YOUR untap step) → it phases in, can't attack this turn (already untap step).
    Wait: creatures phase in during THEIR CONTROLLER'S untap step. If you phase it out on your turn:
      It phases in during YOUR NEXT untap step.
      On the turn you phased it out: creature misses this turn's attack window.
      But: it avoided the removal.

  EFFECTS THAT PHASE OUT (SPECIFIC):
    Teferi's Protection ({2}{W}): "Until your next turn, you have protection from everything
      and your life total can't change. Phase out all permanents you control."
      All your permanents phase out until your next turn → re-phase-in during your untap step.
      "Until your next turn" duration. Wrath cast after Teferi's Protection: your permanents phased out,
      so Wrath doesn't find them (they don't exist).
    Slip Out the Back ({U}): phase out target creature. Instant.
      Counter removal by phasing out. One creature protected.
    Vanishing mechanic (old): put time counters on ETB; remove one per upkeep; phase out when last removed.
      Aven Riftwatcher: Vanishing 2. Phases out after 2 upkeeps. Gone (phases back in but with 0 counters... hmm).
      Wait: phasing in doesn't trigger ETB. But when it phases back in with Vanishing 0:
      Next upkeep: remove a counter. 0 counters → phase out again. Cycle continues. (Vanishing uses phasing.)

BLINK / FLICKER (EXILE THEN RETURN):
  Effects that say "Exile [permanent], then return it to battlefield under [some condition]."
  Examples:
    Restoration Angel ({3}{W}): "When this enters, you may exile target non-Angel creature you control.
      If you do, return that card to the battlefield under your control."
    Ephemerate ({W}): "Exile target creature you control, then return it to battlefield under your control.
      Rebound."
    Momentary Blink ({1}{W}): same concept.

  WHAT BLINK DOES:
    The permanent leaves the battlefield (zone change: to exile).
    It becomes a NEW OBJECT when it returns (CR 400.7 — new object rule, P311).
    ETB triggers FIRE upon re-entry (it entered the battlefield as a new permanent).
    All counters are LOST (new object, no memory).
    All Auras and Equipment become UNATTACHED (and are subject to SBAs: Auras may fall off to GY if enchanting nothing).
    Targeting: if a spell was targeting the creature, the target is now a new object (spell fizzles if target is illegal or is checked for "same permanent" requirements).
    "Summoning sickness": the new object was just put onto battlefield → needs to be under your control since your LAST turn began to attack. Effectively has summoning sickness until next turn.

  KEY DIFFERENCE FROM PHASING:
    PHASING: no zone change, no ETB trigger, counters and attachments survive, no summoning sickness reset.
    BLINK: zone change to exile and back, ETB triggers, counters/attachments lost, summoning sickness.

USING BLINK FOR VALUE:
  The whole point of blink: ETB triggers again.
  Siege Rhino ETB: opponent loses 3 life, you gain 3. Blink it → ETB again → repeat.
  Wall of Blossoms ETB: draw a card. Blink it → draw again.
  Mulldrifter (evoke + ETB: draw 2 cards): cast normally for {5}, blink it → draw 2 more.
  Soulherder ({2}{W}): at beginning of combat, exile target creature, return it under your control.
    Recurring blink every combat step. Each turn: one ETB trigger of chosen creature.
  Panharmonicon: ETB triggers fire twice when artifact/creature ETBs.
    Blink + Panharmonicon: double ETB triggers EVERY time you blink.

BLINK AND TARGETING INTERACTION:
  Opponent casts Doom Blade targeting your Acidic Slime (destroy target non-black creature).
  In response: you cast Ephemerate on Acidic Slime.
  Ephemerate resolves first: Acidic Slime exiled → new object enters battlefield as Acidic Slime.
  Then Doom Blade resolves: "destroy target non-black creature" → checks the TARGET.
    The original Acidic Slime (now in exile) is no longer on the battlefield.
    The new Acidic Slime on the battlefield is a NEW object — not what Doom Blade targeted.
    Doom Blade's target is the OLD Acidic Slime (which is now in exile, no longer a permanent on the field).
    Doom Blade fizzles: illegal target (target is no longer on the battlefield → not a valid permanent to destroy).
  Result: Acidic Slime survives, gets another ETB trigger (destroy an artifact/enchantment) AND potentially
    gets the Rebound trigger from Ephemerate (another copy next upkeep).

  KEY: "The creature the spell was targeting" refers to the original object. The new object is distinct.

PHASE OUT IN RESPONSE TO REMOVAL:
  Different outcome than blink:
  Opponent casts Doom Blade targeting your creature. You use Slip Out the Back to phase it out.
  Doom Blade resolves: target is the creature → but it's phased out (doesn't exist).
  Doom Blade: "destroy target non-black creature" → target is a phased-out permanent.
    Phased-out permanent doesn't exist for most purposes. Is it a legal target?
    Targeting: you choose a target when casting. The target becomes illegal if it's no longer a "creature."
    A phased-out permanent doesn't exist → not a legal target on resolution.
    Doom Blade fizzles (illegal target on resolution).
  Result: creature phases back in next untap step. No counters lost. Auras still attached.
    This is BETTER than blink for a permanent with counters or attached Auras.
  DOWNSIDE: creature misses this turn's attacks (phased in during untap step).
```

## Definitive Conclusions

- **Phasing does NOT cause zone changes** — no ETB or LTB triggers, counters remain, Auras stay attached.
- **Phased-out permanents don't exist** — unaffected by "destroy all creatures," don't count for "each creature you control," etc.
- **Blinking DOES cause zone changes** — ETB triggers fire, new object is created, counters lost, Auras fall off.
- **Phasing is better for preserving counters and attachments; blinking is better for re-triggering ETBs.**
- **A blinked creature has summoning sickness upon return; a phased-in creature does not** (continuity wasn't broken).
- **Phasing out in response to removal is an effective protective tool** — the removal fizzles when the target doesn't exist on resolution.

## Canonical Example
**Soulherder Engine — Blink Value:**
Commander: Roon of the Hidden Realm ({2}{G}{W}{U}, 5/5): "{W}{U}, {T}: Exile target creature you don't control, return it under its owner's control at next end step. OR exile target creature you do control, return it under your control at next end step."
Board: Soulherder ({1}{W}{U}), Wall of Blossoms ({1}{G}), Acidic Slime ({3}{G}{G}).
Beginning of Combat (your turn): Soulherder trigger fires.
  Exile Acidic Slime → new object enters → Acidic Slime ETB trigger: destroy target artifact or enchantment.
  Opponent has Rhystic Study. Destroy Rhystic Study.
Soulherder grows: whenever a creature is exiled from the battlefield, Soulherder gets +1/+1 counter.
  Acidic Slime was exiled: +1/+1 counter on Soulherder.

Next turn beginning of combat: Soulherder trigger → exile Wall of Blossoms → Wall enters → draw a card.
Soulherder grows again.

After 5 turns: Soulherder is 6/7 (base 1/2 + five +1/+1 counters). And you've drawn 3-5 extra cards, destroyed multiple permanents.

The blink is sustainable: each turn, pick which ETB ability is most valuable at the moment.

**Example 2 — Teferi's Protection — Mass Phase Out:**
You control: 5 creatures, 3 artifacts, 2 enchantments. Opponent casts Cyclonic Rift ({6}{U}) for the Overload cost.
Overload Cyclonic Rift: return all nonland permanents you don't control to owners' hands.
You respond: cast Teferi's Protection ({2}{W}): "Until your next turn, you have protection from everything and your life total can't change. Phase out all permanents you control."
Teferi's Protection resolves: all your permanents phase out.
Cyclonic Rift resolves: "return all nonland permanents you don't control."
Your permanents are phased out → they don't exist → they can't be returned.
Your creatures, artifacts, enchantments: all safe in phased-out limbo.
Opponent's permanents: unaffected (Cyclonic Rift targets permanents YOU don't control → they target their own? No: "return all nonland permanents you don't control" means their own cards... wait: they control their own permanents).
Actually: Cyclonic Rift Overload returns all nonland permanents YOU (the caster) DON'T control.
The caster is the opponent. They return all nonland permanents THEY don't control = YOUR permanents.
Your permanents are phased out → don't exist → Cyclonic Rift doesn't find them.
Result: nothing returns. Opponent wasted 8 mana.
Your next untap step: all permanents phase back in. Full board intact.
One of the most powerful responses in Commander.
