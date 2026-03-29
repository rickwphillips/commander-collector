---
id: p236
name: Ninjutsu — Swap an Unblocked Attacker for a Ninja from Hand
category: combat
cr_refs: [702.49a, 702.49b, 702.49c, 702.49d]
tags: [ninjutsu, commander-ninjutsu, unblocked, swap, enters-tapped-attacking, Kamigawa, Mistblade-Shinobi, Yuriko, Throat-Slitter]
created: 2026-03-28
examples_count: 2
---

# P236 — Ninjutsu — Swap an Unblocked Attacker for a Ninja from Hand

## Abstract
Ninjutsu is an activated ability that lets you swap an unblocked attacking creature you control with a Ninja card from your hand: return the unblocked creature to your hand, then put the Ninja onto the battlefield tapped and attacking the same target. This creates a hidden threat: small or cheap creatures attack hoping to go unblocked, then at the last moment (after declare blockers) you swap in a Ninja — one that deals direct damage to the player, has ETB triggers, or has abilities that only fire when it deals combat damage. The "returned to hand" creature isn't lost — it can be recast next turn (or itself be the ninjutsu target again). Commander ninjutsu also works from the command zone.

## The Definitive Rules

**CR 702.49a** (verbatim): *"Ninjutsu is an activated ability that functions only while the card with ninjutsu is in a player's hand. 'Ninjutsu [cost]' means '[Cost], Reveal this card from your hand, Return an unblocked attacking creature you control to its owner's hand: Put this card onto the battlefield from your hand tapped and attacking.'"*

**CR 702.49b** (verbatim): *"The card with ninjutsu remains revealed from the time the ability is announced until the ability leaves the stack."*

**CR 702.49c** (verbatim): *"The creature put onto the battlefield with the ninjutsu ability enters attacking the same player, planeswalker, or battle as the creature that was returned to its owner's hand."*

**CR 702.49d** (verbatim): *"Commander ninjutsu is a variant of the ninjutsu ability that also functions while the card with commander ninjutsu is in the command zone. 'Commander ninjutsu [cost]' means '[Cost], Reveal this card from your hand or from the command zone, Return an unblocked attacking creature you control to its owner's hand: Put this card onto the battlefield tapped and attacking.'"*

## The Pattern

```
NINJUTSU SEQUENCE:
  1. Declare attackers: a creature you control attacks (becomes tapped + attacking)
  2. Declare blockers step: opponent declares blocks (or doesn't block your creature)
  3. After blockers declared: if your creature is UNBLOCKED, ninjutsu window is open
  4. Activate ninjutsu: pay cost, reveal Ninja, return the unblocked attacker to hand
  5. Ninja enters: tapped and attacking the same target as the returned creature
  6. Proceed to combat damage: Ninja deals its power in damage

NINJUTSU + "UNBLOCKED":
  Unblocked = no creature has been assigned as a blocker for this creature
  Even if blockers step is done: you can activate ninjutsu any time the creature is unblocked
  Multiple ninjutsu activations: can chain multiple Ninjas if multiple unblocked attackers
  Can activate ninjutsu even if opponent has NO creatures (all attacks unblocked)

NINJUTSU + TIMING:
  Can be activated during the declare blockers step (after blockers declared)
  Can be activated during combat damage step (before damage, if creature still unblocked)
  Best window: after declare blockers, before damage — opponent committed to blocking plan

NINJUTSU + HASTE:
  The Ninja enters tapped and attacking: it has "haste" for the purpose of attacking this turn
  But: it's already attacking — haste is irrelevant
  No, wait: the Ninja is on the battlefield tapped and attacking — no need for haste
  It's already in the attack; the haste question doesn't apply
  If the creature would die (to damage) — the Ninja WAS attacking this combat

NINJUTSU + ETB:
  Ninjutsu puts the card "onto the battlefield from your hand": ETB triggers fire!
  Mistblade Shinobi ({1}{U}) Ninjutsu {U}: 1/1, "when this creature deals combat damage to a player, return target creature that player controls to their hand"
  Throat Slitter ({3}{B}) Ninjutsu {2}{B}: 2/2, "when this creature deals combat damage to a player, destroy target nonblack creature that player controls"
  BOTH: the ETB fires when the Ninja enters via ninjutsu

NINJUTSU + RETURNED CREATURE:
  The unblocked attacker goes BACK TO HAND (not sacrificed, not exiled)
  You can re-attack with it next turn and ninjutsu again
  Strategy: cheap 1/1 attackers cycle through ninjutsu targets indefinitely
  Ornithopter ({0}): free ninjutsu fodder each turn
  Invisible Stalker (hexproof, unblockable): guaranteed ninjutsu target every turn

YURIKO, THE TIGER'S SHADOW:
  Yuriko ({1}{U}{B}) — Commander Ninjutsu {U}{B}: whenever Yuriko deals combat damage to a player, reveal top card of library, put it into hand, each opponent loses life equal to that card's mana value.
  Commander Ninjutsu: works from COMMAND ZONE (not just hand)
  Start Yuriko in command zone: attack with any creature → it goes unblocked → ninjutsu Yuriko from command zone
  Yuriko bypasses commander tax for ninjutsu activations (command zone → battlefield)
  Wait: commander tax applies to casting from command zone, not to abilities. Ninjutsu is an activated ability.
  So: Yuriko's commander ninjutsu cost stays at {U}{B} regardless of how many times used!
  Each ninjutsu activation: Yuriko ETBs, attacks, deals damage → reveal top card, drain equal to CMC
  High-CMC decks with Yuriko: drain for 10+ per trigger

NINJUTSU + NINJUTSU:
  If you ninjutsu a Ninja into combat, can you ninjutsu that Ninja?
  No — the Ninja enters tapped and attacking, and IS currently attacking (it's not "being attacked")
  But: after ninjutsu resolves, the Ninja is an unblocked attacker
  Can you THEN ninjutsu the Ninja out to swap for another Ninja?
  Yes! If you have multiple ninjutsu cards in hand, you can chain them
  The first Ninja is now in your hand (returned) — so chain: Ninja A in → Ninja B in → Ninja A is now unblocked attacker → Ninja B is in hand
  Actually the sequence:
    Original creature attacks unblocked
    Ninjutsu Ninja A: original returns to hand, Ninja A enters attacking
    Ninja A is now unblocked (it just entered attacking — no one blocked it)
    Ninjutsu Ninja B: Ninja A returns to hand, Ninja B enters attacking
    You now have both Ninjas in hand, Ninja B attacking
    Or: continue chaining as long as you have ninjutsu cards
```

## Definitive Conclusions

- **Ninjutsu swaps an unblocked attacker** for a Ninja from hand — the Ninja enters tapped and attacking.
- **Activates after blockers declared** — the opponent committed before the swap.
- **The returned creature is NOT lost** — goes to hand for reuse next turn.
- **ETB triggers fire** when the Ninja enters via ninjutsu.
- **Commander ninjutsu** (Yuriko) works from the command zone and bypasses commander tax.
- **Ninja chaining**: multiple ninjutsu activations on the same attack can swap through multiple Ninjas.

## Canonical Example
**Yuriko Ninjutsu Commander:**
Commander: Yuriko, the Tiger's Shadow (Commander ninjutsu {U}{B}).
Turn 2: attack with Changeling Outcast (0/1, unblockable, ninja creature type — triggers Yuriko's tribal synergy).
Opponent has no blockers: Changeling Outcast is unblocked.
Activate Commander Ninjutsu {U}{B}: return Changeling Outcast to hand, put Yuriko onto battlefield from command zone tapped and attacking.
Yuriko enters: ETB triggers fire. Now dealing combat damage: reveal top card — Emrakul ({15} mana value): each opponent loses 15 life.
Turn 3: attack with Changeling Outcast again → ninjutsu Yuriko back in (she returned to command zone when she died/was removed).
Build: run 20+ high-CMC cards for Yuriko drain. Hits of 10-15 per trigger = 3-4 triggers to win.

**Example 2 — Throat Slitter in 1v1:**
Hand: Throat Slitter ({3}{B}, Ninjutsu {2}{B}): 2/2, "when deals combat damage to a player, destroy target nonblack creature that player controls."
Attack with Ornithopter ({0}, 0/2 flying artifact).
Opponent has no flyers → Ornithopter is unblocked.
Ninjutsu {2}{B}: Ornithopter to hand, Throat Slitter enters tapped and attacking.
Throat Slitter deals combat damage: destroy target nonblack creature (their best blocker or attacker).
Next turn: attack with Ornithopter again → ninjutsu Throat Slitter AGAIN from hand.
Each turn: free removal via Throat Slitter + 2 damage.
Opponent's creature count dwindles: Ornithopter keeps supplying the ninjutsu window.

## Commonly Confused With
- **P187 (Freerunning)** — Freerunning is a cost reduction after dealing combat damage with Assassins; Ninjutsu is a swap ability activated when a creature is unblocked.
- **P200 (Sneak)** — Sneak casts a permanent during declare blockers as an alternative cost; Ninjutsu is an activated ability that swaps unblocked attackers (doesn't cast).
- **P161 (Dash)** — Dash returns to hand at end step as an alternative cast. Ninjutsu is activated mid-combat to swap in from hand.
