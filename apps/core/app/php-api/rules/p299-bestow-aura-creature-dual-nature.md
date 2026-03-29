---
id: p299
name: Bestow — Enchantment Creature That Can Become an Aura
category: costs
cr_refs: [702.103a, 702.103b, 702.103c, 702.103d, 702.103e, 702.103f]
tags: [bestow, aura, enchantment-creature, bestow-cost, target-illegal, falls-off, Theros, Eidolon-of-Countless-Battles, Nighthowler, Herald-of-Torment, Boon-Satyr, Ethereal-Armor]
created: 2026-03-29
examples_count: 2
---

# P299 — Bestow — Enchantment Creature That Can Become an Aura

## Abstract
Bestow is a static ability from the Theros block that lets you cast a creature card as an Aura enchantment instead of as a creature. When cast "bestowed," the spell becomes an Aura enchantment targeting a creature you control. If the Aura's target becomes illegal before the spell resolves — or if the enchanted creature leaves the battlefield while the Aura is attached — the Aura falls off and becomes a creature instead of going to the graveyard. This "falls off as a creature" behavior makes bestow especially resilient: destroying the enchanted creature gives the bestow card new life as a separate creature.

## The Definitive Rules

**CR 702.103a** (verbatim): *"Bestow represents a static ability that functions in any zone from which you could play the card it's on. 'Bestow [cost]' means 'As you cast this spell, you may choose to cast it bestowed. If you do, you pay [cost] rather than its mana cost.'"*

**CR 702.103b** (verbatim): *"As a spell cast bestowed is put onto the stack, it becomes an Aura enchantment and gains enchant creature. It is a bestowed Aura spell, and the permanent it becomes as it resolves will be a bestowed Aura."*

**CR 702.103e** (verbatim): *"As a bestowed Aura spell begins resolving, if its target is illegal, it ceases to be bestowed and the effect making it an Aura spell ends. It continues resolving as a creature spell."*

**CR 702.103f** (verbatim): *"If a bestowed Aura becomes unattached, it ceases to be bestowed. If a bestowed Aura is attached to an illegal object or player, it becomes unattached and ceases to be bestowed."*

## The Pattern

```
BESTOW BASICS:
  The card: an enchantment creature with "Bestow [cost]"
  When casting: you choose EITHER:
    (A) Normal cast: pay the regular mana cost. Enters as a creature.
    (B) Bestowed cast: pay the bestow cost (usually higher). Enters as an Aura.

  AS A NORMAL CREATURE:
    Enters the battlefield as a creature with any enchantment abilities
    Dies normally when destroyed, etc.

  AS A BESTOW AURA:
    Spell becomes an Aura enchantment + gains "enchant creature"
    Must target a creature you control
    Resolves: attaches to the target creature
    Gives the enchanted creature whatever bonuses the bestow card has
    The bestow card is an Aura — not a creature — while attached

BESTOW FALLS OFF (key interaction):
  Two situations where the bestow Aura "falls off":

  1. Target becomes illegal before resolution (CR 702.103e):
     You cast Nighthowler bestowed targeting your Tarmogoyf.
     Opponent casts Fatal Push with your spell on the stack.
     Target (Tarmogoyf) is destroyed. Nighthowler's target is now illegal.
     "As a bestowed Aura spell begins resolving, if target is illegal, it ceases to be bestowed."
     Nighthowler continues resolving as a creature spell (not an Aura).
     Nighthowler enters the battlefield as a creature.
     Opponent's removal killed the creature but gave you the Nighthowler body for free!

  2. Enchanted creature leaves the battlefield (CR 702.103f):
     Nighthowler is bestowed on your 4/5 Polukranos.
     Opponent casts Wrath of God: all creatures destroyed.
     Polukranos dies. The Aura (Nighthowler) becomes unattached.
     "If a bestowed Aura becomes unattached, it ceases to be bestowed."
     Nighthowler ceases to be an Aura → becomes a creature.
     Nighthowler enters the battlefield as a creature (survives the Wrath!).
     This is NOT a triggered ability — it's a state-based action / rule.

  CRITICAL: the bestow creature survives wraths when attached.
    Opponent's sweeper kills the enchanted creature.
    The bestow card falls off and becomes a creature instead of dying.

NOTABLE BESTOW CARDS (Theros block):
  Nighthowler ({1}{B}{B}, bestow {4}{B}{B}): Creature — Horror.
    "Nighthowler and enchanted creature each get +X/+X where X = creature cards in all graveyards."
    Bestow for {4}{B}{B}: give a creature +X/+X scaling with graveyard fill.
    Normal cast for {1}{B}{B}: a Horror that grows itself with graveyards.
    In late game with 15 creatures in GYs: Nighthowler is a 15/15.

  Herald of Torment ({1}{B}{B}, bestow {3}{B}{B}): Creature — Demon.
    "Flying, bestow {3}{B}{B}. Enchanted creature gets +3/+3 and has flying."
    "At the beginning of your upkeep, you lose 1 life."
    Bestow: grant flying + +3/+3 at a modest cost. Attached creature becomes a 3-power flier.
    Falls off on sweeper → demon body (3/3 flying) that costs you 1 life/upkeep.

  Eidolon of Countless Battles ({1}{W}{W}, bestow {3}{W}{W}): Creature — Spirit.
    "Enchanted creature gets +1/+1 for each creature you control and for each Aura you control."
    Variable pump: scales with your board. Excellent in white enchantment decks.
    Bestowed: +X/+X where X = your creature count + aura count.

  Boon Satyr ({1}{G}{G}, bestow {3}{G}{G}): Creature — Satyr.
    "Flash, bestow {3}{G}{G}. Enchanted creature gets +4/+2."
    Flash + Bestow: instant-speed combat trick at {3}{G}{G}.
    Cast at end of opponent's turn: their attacker suddenly faces a +4/+2 creature… wait.
    Actually: cast bestowed at instant speed → surprise +4/+2 to a blocker.
    Flash matters here: can bestow or creature-cast at instant speed.

BESTOW + TARGETING RULES:
  Bestow requires a legal target when cast: a creature you control
  "Enchant creature" = must target a creature when put on the stack
  If opponent responds to the bestow spell by killing the target:
    Target is illegal → falls off as a creature (CR 702.103e)
  The creature "given" the bestow bonus is a target: hexproof creatures can't be the target
    Targeting hexproof creature with bestow: illegal (hexproof prevents targeting)
    Your own hexproof creature: still can't be targeted by your own spells for bestow
    Unless the hexproof says "by your opponents" — standard hexproof blocks all targeting

BESTOW + FLICKER:
  If you flicker (exile and return) a bestowed Aura:
    It leaves the battlefield as an Aura: returns as... what?
    Flickered permanents return to the battlefield as their "base" form.
    A bestow card's default form is a creature. It returns as a creature.
    NOT as an Aura when flickered.

BESTOW + COPY:
  If you copy a bestowed Aura spell on the stack:
    CR 702.103c: "If a bestowed Aura spell is copied, the copy is also a bestowed Aura spell."
    The copy must choose a target for its Aura (you can choose a different creature).
    If no legal target: the copy falls off and resolves as a creature.
```

## Definitive Conclusions

- **Bestow casts the card as an Aura for the bestow cost** — it's an alternative cost replacing the mana cost.
- **If the enchanted creature dies (while Aura is attached), the bestow card falls off as a creature** — it survives sweepers this way.
- **If the target is illegal when the bestowed spell resolves, it enters as a creature** — removing the target still gives you a creature body.
- **Bestow creatures are not creatures while attached** — they're Auras; creature removal doesn't hit them while attached.
- **Flickering a bestowed Aura returns it as a creature** — it doesn't "re-bestow" on return.

## Canonical Example
**Herald of Torment Surviving a Wrath:**
Turn 5: you control Spirited Companion (2/2). Cast Herald of Torment bestowed targeting it ({3}{B}{B}).
Herald is now an Aura attached to Spirited Companion.
Spirited Companion is now a 5/5 Flying creature.
Opponent casts Supreme Verdict (uncounterable wrath). All creatures die.
Spirited Companion is a creature → destroyed.
Herald of Torment (an Aura) was NOT a creature → NOT hit by the wrath.
But it was attached to Spirited Companion → Spirited Companion dies.
Herald becomes unattached: ceases to be bestowed → enters battlefield as Herald of Torment (3/3 flying).
Result: Supreme Verdict killed Spirited Companion, but Herald of Torment SURVIVED as a 3/3 flier.
Opponent: "Wait, that's a creature now?!" Yes.
Note: Herald's upkeep trigger (lose 1 life) now activates as you control it.

**Example 2 — Boon Satyr Flash Bestow Trick:**
Opponent's turn. They attack with a 5/5 Tarmogoyf. You have a 4/4 Loxodon Smiter as blocker.
Normally: 5/5 vs 4/4 → Smiter dies (5 damage > 4 toughness). Goyf takes 4.
But you have Boon Satyr in hand and {3}{G}{G}.
Declare Smiter as blocker. Priority passes.
Cast Boon Satyr bestowed (Flash allows instant speed) targeting Loxodon Smiter.
Boon Satyr Aura attaches to Smiter: Smiter becomes 8/6 Flying (4+4/4+2 — wait: +4/+2, Smiter becomes 8/6).
Actually Boon Satyr gives +4/+2. So Smiter goes from 4/4 to 8/6.
Combat damage: 5/5 Goyf deals 5 to Smiter (8/6 still alive — 6 toughness > 5 damage).
Smiter deals 8 to Goyf: Goyf is 5/6. 8 damage kills it.
After combat: Opponent's Goyf is dead. Your Smiter (8/6) survives.
Flash bestow was an 8-power surprise in combat for {3}{G}{G}.

## Commonly Confused With
- **P284 (Ward/Hexproof/Shroud)** — Hexproof prevents targeting; you can't bestow onto your own hexproof creatures (bestow requires targeting).
- **P287 (Phasing)** — If a bestowed Aura phases in unattached, it also ceases to be bestowed (CR 702.103g).
- **P264 (Reconfigure)** — Reconfigure also creates a dual-mode permanent that switches between creature and attached-to-creature; unlike bestow, Reconfigure is always on the battlefield (not cast in two modes).
- **P273 (Backup)** — Backup grants abilities temporarily; bestow grants bonuses permanently while attached.
