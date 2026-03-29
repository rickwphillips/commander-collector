---
id: p147
name: Ninjutsu — Swap for Unblocked Attacker
category: combat
cr_refs: [702.49a, 702.49b, 702.49c, 702.49d]
tags: [ninjutsu, commander-ninjutsu, unblocked, attacker, hand, enter-tapped-attacking, combat-trick, kamigawa]
created: 2026-03-28
examples_count: 2
---

# P147 — Ninjutsu — Swap for Unblocked Attacker

## Abstract
Ninjutsu is an activated ability used from the hand (or command zone for Commander Ninjutsu). Pay the cost, reveal the ninja card, return an unblocked attacking creature to your hand, and the ninja enters tapped and attacking in its place. This enables combat surprise: swing with a cheap creature, and if it's unblocked, swap it for a ninja that deals damage and triggers any "deals combat damage to a player" abilities. The returned creature was never blocked, so it can attack again next turn without summoning sickness restrictions.

## The Definitive Rules

**CR 702.49a** (verbatim): *"Ninjutsu is an activated ability that functions only while the card with ninjutsu is in a player's hand. 'Ninjutsu [cost]' means '[Cost], Reveal this card from your hand, Return an unblocked attacking creature you control to its owner's hand: Put this card onto the battlefield from your hand tapped and attacking.'"*

**CR 702.49c** (verbatim): *"The creature put onto the battlefield with the ninjutsu ability enters attacking the same player, planeswalker, or battle as the creature that was returned to its owner's hand."*

**CR 702.49d** (verbatim): *"Commander ninjutsu is a variant of the ninjutsu ability that also functions while the card with commander ninjutsu is in the command zone. 'Commander ninjutsu [cost]' means '[Cost], Reveal this card from your hand or from the command zone, Return an unblocked attacking creature you control to its owner's hand: Put this card onto the battlefield tapped and attacking.'"*

## The Pattern

```
NINJUTSU:
  Activated ability from hand only (special case: Commander Ninjutsu from command zone too)
  Timing: anytime you have priority (typically after blockers are declared, once creature is confirmed unblocked)
  Cost: [ninjutsu cost] + reveal the ninja + return an unblocked attacker you control to hand
  Effect: ninja enters tapped and attacking the same target as the returned creature

  NINJUTSU WINDOW:
    Can be activated during combat, specifically after blockers are declared
    Most common window: declare blockers step, once a creature is confirmed unblocked
    Can also be done before blockers are declared (unusual, more risk)
    The returned creature must be unblocked at time of activation

  NINJUTSU + ETB TRIGGERS:
    The ninja enters the battlefield → ETB triggers fire!
    Common ninja abilities: "when this creature deals combat damage to a player"
    But ETB also fires: Higure the Still Wind (ETB: search library for ninja)
    This is the core advantage: get ETB + combat damage trigger

  NINJUTSU + COMBAT DAMAGE:
    Ninja enters tapped and attacking → if unblocked, it deals combat damage
    Ninja "deals combat damage to a player" trigger fires
    Many ninjas have: "Whenever this deals combat damage to a player, [powerful effect]"

  NINJUTSU + RETURNED CREATURE:
    The returned creature goes back to hand (not graveyard)
    It can be played again next turn
    If it had an ETB ability: the ability fires again when recast!
    Cyclical pattern: cast ETB creature → swing → ninjutsu → replay ETB creature

  NINJUTSU + AURAS/EQUIPMENT:
    If the returned attacker had equipment: equipment stays on the battlefield unattached
    Auras attached to the returned creature: Aura checks if it can enchant the creature
    If it can't (creature returned to hand): Aura falls off to graveyard
    Equipment: stays on battlefield as an unattached equipment

  NINJUTSU + COMMANDER:
    Commander Ninjutsu (702.49d) works from the command zone
    Pay the commander ninjutsu cost, reveal from command zone, return unblocked attacker
    This bypasses commander tax for that activation?
    Wait: Commander Ninjutsu has its own cost listed — it IS the cost including what's paid
    Commander tax (additional {2} for each previous cast) applies to CASTING the commander
    Commander Ninjutsu is an ACTIVATED ABILITY, not a spell cast → commander tax doesn't apply!
    → Commander Ninjutsu can be used repeatedly without paying commander tax

  NINJUTSU + BLOCKED CREATURE:
    Can only be used with UNBLOCKED attackers
    If a creature becomes blocked then unblocked (e.g., Fog Bank removed): it's unblocked
    If a creature is currently blocked: can't use ninjutsu with it

  NINJUTSU + VIGILANCE:
    A vigilant attacking creature can be returned for ninjutsu
    The returned vigilant creature: goes to hand
    Can be re-cast and attack again (but needs to untap first unless it has haste)
```

## Definitive Conclusions

- **Ninjutsu replaces an unblocked attacker with the ninja** — ninja enters tapped and attacking.
- **ETB triggers fire** when the ninja enters, plus "deals combat damage" triggers if damage is dealt.
- **Commander Ninjutsu bypasses commander tax** — it's an activated ability, not casting a spell.
- **The returned creature goes to hand**, enabling an ETB + ninjutsu loop.
- **Equipment stays on battlefield** if the equipped creature is ninjutsued back to hand.

## Canonical Example
**Yuriko, the Tiger's Shadow (Commander Ninjutsu {1}{U}{B}):**
Swing with a 1/1 Changeling Outcast (unblockable because it has no creature types). Declare blockers step: it's unblocked. Activate Yuriko's Commander Ninjutsu from command zone. Return Changeling Outcast to hand. Yuriko enters tapped and attacking.
Combat damage: Yuriko deals 2 damage to player. Yuriko's trigger fires: each opponent loses life equal to the top card's converted mana cost; you draw a card.
Next turn: recast Changeling Outcast, swing again, ninjutsu Yuriko back, draw another card.

**Example 2 — Ninja of the Deep Hours:**
Swing with a 1/1 creature. Ninjutsu {1}{U}. Creature unblocked → return it, Ninja enters attacking.
"Whenever Ninja of the Deep Hours deals combat damage to a player, you may draw a card."
Deals 2 damage → draw a card. The returned 1/1 replayed next turn continues the engine.

## Commonly Confused With
- **P149 (Dredge)** — Completely different; dredge replaces draws. Both keep cards cycling but very different mechanics.
- **P113 (Evoke)** — Evoke is a cost to enter and immediately sacrifice. Ninjutsu puts a creature in from hand during combat.
- **P136 (Skulk)** — Skulk also helps creatures connect unblocked, enabling ninjutsu setups, but they're separate mechanics.
