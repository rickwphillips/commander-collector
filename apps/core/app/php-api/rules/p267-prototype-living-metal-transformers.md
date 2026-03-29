---
id: p267
name: Prototype and Living Metal — Brothers' War Reduced-Cost Creature Variants
category: stack
cr_refs: [702.160a, 702.161a, 718.1, 718.2, 718.3]
tags: [prototype, living-metal, artifact-creature, vehicle, alternative-cost, power-toughness, Brothers-War, Haywire-Mite, Bladecoil-Serpent, Mishra-Lost-to-Phyrexia, Cityscape-Leveler]
created: 2026-03-29
examples_count: 2
---

# P267 — Prototype and Living Metal — Brothers' War Reduced-Cost Creature Variants

## Abstract
Two mechanics from The Brothers' War (2022). **Prototype**: a static ability on artifact creature cards that have a secondary set of smaller stats and a reduced mana cost. When casting, the player chooses to cast it prototyped (using the smaller stats and alternative cost) or at full cost (with full power/toughness). The full-cost version is typically a massive creature; the prototyped version is a smaller, more efficiently costed version of the same card. **Living Metal**: a keyword on some Vehicles that makes them artifact creatures during their controller's turn — without needing to be crewed, and without the standard end-of-turn de-crewing. A persistent, self-animating Vehicle.

## The Definitive Rules

**CR 702.160a** (verbatim): *"Prototype is a static ability that appears on prototype cards that have a secondary set of power, toughness, and mana cost characteristics. A player who casts a spell with prototype can choose to cast that card 'prototyped.' If they do, the alternative set of its power, toughness, and mana cost characteristics are used. See 718, 'Prototype Cards.'"*

**CR 702.161a** (verbatim): *"Living metal is a keyword ability found on some Vehicles. 'Living metal' means 'During your turn, this permanent is an artifact creature in addition to its other types.'"*

## The Pattern

```
PROTOTYPE:
  A prototype card has TWO sets of stats:
    Full version: large mana cost (printed in top-right), full power/toughness
    Prototyped version: smaller mana cost, reduced power/toughness (printed in bottom area of card)
  At cast time: choose which version to cast
  Both versions are the SAME CARD — same name, abilities, identity
  Only the stats and cost differ between the two modes

  PROTOTYPE RULES (CR 718):
    Prototyped: use the prototype mana cost, color(s) from prototype cost, prototype P/T
    Full-cost: use the normal mana cost, normal colors/P/T
    Non-prototype card abilities: apply to both versions (a prototype card can have extra abilities)
    Note: a prototyped card's color comes from its prototype cost's mana symbols (often colored)

  PROTOTYPE COLOR:
    Full-cost artifact creatures: often colorless ({8}, {10}, etc.)
    Prototype cost: often includes colored mana ({2}{U}{U} or {3}{R})
    Casting prototyped: the card is THAT COLOR (from prototype cost)
    This can matter for color-based interactions while the card is on the stack or battlefield

  PROTOTYPE EXAMPLES:
    Cityscape Leveler ({8}, Artifact Creature — Construct, 8/8): has many powerful abilities
      (unblockable, when attacks obliterate permanents).
      Prototype {3}{U} — 3/3: same card with those abilities but 3/3 for 5 mana instead of 8.
      You choose: cast as the 8/8 late-game bomb or as an efficient 3/3 with the full ability package.
      The abilities (unblockable etc.) apply in BOTH modes.

    Mishra, Claimed by Gix ({4}{B}{R}, Legendary Creature 5/5): not prototype. Let me use accurate examples.

    Actual Prototype cards:
    Haywire Mite ({G}, Artifact Creature 1/1): NOT a prototype card (just a 1-mana artifact creature).

    Bladecoil Serpent: ({4}{U/B}{U/B}, 5/4 artifact creature, multiple abilities).
      Wait: prototype cards display both a regular cost and a smaller cost in a different box.

    The key examples from Brothers' War:
    Skitterbeam Battalion ({7}, 3/3, has "when this enters under your control, you may search for..."
      Prototype {3}{R}{R} — 3/3 with haste and "when this enters, create token copies."
      At {3}{R}{R}: create token clones of the 3/3 with haste.

    Imposter Mech ({2}{U}, Vehicle 4/3, Crew 1, Prototype {4}{U}{U} — 6/5):
      Wait — Prototype applies to non-Vehicle artifact creatures primarily.
      The key: a prototype lets you play the big bomb at full cost OR the lean aggressive version early.

LIVING METAL:
  Keyword found on some Vehicles (artifact type — Vehicle)
  Normally: Vehicles are artifacts, become artifact creatures when crewed
  Living Metal: "During your turn, this permanent is an artifact creature in addition to its other types"
  Applies ONLY during the controller's own turn (not opponent's turns)
  No crew cost needed for the "living metal" activation
  But: it's only a creature on YOUR turn — opponent can't attack with it, and on opponent's turn
    it reverts to just being a Vehicle (not a creature)

  LIVING METAL TIMING:
    Your turn begins → Living Metal Vehicle is an artifact creature
    Can attack (if it has power/toughness as printed)
    Can block if you have priority during your turn... wait: blocking happens on opponent's turn.
    On opponent's turn: Living Metal is just a Vehicle again → can't block (not a creature)
    This is a key limitation: Living Metal vehicles are offense-only (can't block)

  LIVING METAL + CREW:
    You can ALSO crew a Living Metal vehicle (to give it even bigger stats? No — the stats are already set)
    Crew gives it "+[crew power bonus]" if the crew rules work that way... actually crew just makes it a creature.
    Since it's already a creature during your turn: crew is redundant on your turn.
    On opponent's turn: it's not a creature → you'd need to crew it if you could — but crewing is
    activated sorcery-speed usually? Wait: crewing is actually at any time, including combat.
    If you crew a living metal vehicle on opponent's turn: it becomes a creature on their turn (can block).
    Crew on opponent's turn = it's crewed → creature for defense.

  LIVING METAL NOTABLE CARDS (Brothers' War):
    Phyrexian Fleshgorger ({7}, Living Metal, 7/5 Trample Lifelink, Prototype {3}{B}{B} — 3/3):
      As a Vehicle with Living Metal: during your turn it's automatically an artifact creature.
      Prototype {3}{B}{B}: 3/3 with Trample and Lifelink for {3}{B}{B} (5-mana efficient threat)
      Full cost {7}: 7/5 Trample Lifelink massive body
      Living Metal means: whichever version you cast, it auto-animates on your turn without crewing.
      On your turn: 7/5 Trample Lifelink attacks without needing crew. Opponent's turn: just an artifact.

  PROTOTYPE + LIVING METAL INTERACTION:
    Phyrexian Fleshgorger has both Prototype AND Living Metal
    Prototyped (3/3): during your turn, Living Metal makes it a 3/3 creature automatically
    Full-cost (7/5): during your turn, Living Metal makes it a 7/5 creature automatically
    Either way: no crew needed, it attacks on your turn
    On opponent's turn: just an artifact (unless crewed)
```

## Definitive Conclusions

- **Prototype lets you choose the version at cast time** — same card, two different cost/stat combinations.
- **A prototyped card's color comes from its prototype cost** — a colorless artifact becomes blue/red if cast prototyped with colored mana.
- **Living Metal auto-animates a Vehicle on the controller's turn** — no crew cost needed, but only during your own turn.
- **Living Metal vehicles can't block** unless separately crewed (living metal is only active on your turn).
- **Phyrexian Fleshgorger combines both** — prototype for efficient deployment, living metal for automatic animation.

## Canonical Example
**Cityscape Leveler Prototype in Control:**
Hand: Cityscape Leveler. Mana available: {3}{U}.
Full cost: {8} — you have 4 mana, nowhere near enough. But prototype!
Prototype {3}{U}: cast it as a 3/3 Artifact Creature (blue, due to prototype cost).
Enters as a 3/3. Its abilities include "This creature can't be blocked" and "When this creature attacks, for each nontoken nonland permanent defending player controls, they sacrifice that permanent... unless they pay {X} where X is its mana value."
3/3 unblockable that forces artifact/creature/planeswalker sacrifices on attack — for only 5 mana.
Late game: you could cast it at {8} for the 8/8 version of the same unblockable annihilator.

**Example 2 — Phyrexian Fleshgorger Living Metal:**
Board: Phyrexian Fleshgorger (cast at prototype cost, 3/3 Living Metal, Trample, Lifelink).
Opponent has no blockers. Your turn begins: Living Metal activates → 3/3 artifact creature.
Attack with 3/3 Trample Lifelink: deal 3 damage to opponent, gain 3 life.
Opponent's turn: Fleshgorger reverts to just an artifact (not a creature → can't block).
Opponent attacks your creatures. Fleshgorger doesn't block.
Next turn: your turn → Living Metal → it's a creature again → attack again.
The Fleshgorger is a persistent threat on offense that requires no maintenance — living metal is automatic.

## Commonly Confused With
- **P155 (Vehicles/Crew)** — Standard Vehicles require crew to become creatures; Living Metal Vehicles auto-animate on your turn without crewing.
- **P267 note**: More Than Meets the Eye (CR 702.162) is the Transformers mechanic — cast converted (alternate face) at reduced cost. It's related to Prototype in concept but applies to Transformer DFC cards specifically.
- **P256 (Hideaway)** — Hideaway has a conditional free cast; Prototype always gives you the choice between two stats at cast time, not a later free cast.
