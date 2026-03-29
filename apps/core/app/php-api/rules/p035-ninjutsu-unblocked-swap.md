---
id: p035
name: Ninjutsu — Unblocked Swap Mechanics
category: combat
cr_refs: [702.49a, 702.49b, 702.49c, 702.49d, 509.1h]
tags: [ninjutsu, unblocked, attacking, swap, enters-attacking, not-declared-attacker, hand, haste, commander-ninjutsu]
created: 2026-03-28
examples_count: 3
---

# P035 — Ninjutsu — Unblocked Swap Mechanics

## Abstract
Ninjutsu is an activated ability that swaps an unblocked attacking creature back to hand and puts the ninja onto the battlefield tapped and attacking. Because the ninja "enters attacking" rather than being "declared as an attacker," abilities that trigger on creatures being declared as attackers do NOT trigger. The returned creature is removed from combat (it goes to hand). The ninja is also not subject to summoning sickness restrictions for the attack — it enters attacking directly. Ninjutsu can only be activated after blockers are declared, when the attacker is confirmed unblocked.

## The Definitive Rule

**CR 702.49a** (verbatim): *"Ninjutsu [cost]" means "[Cost], Reveal this card from your hand, Return an unblocked attacking creature you control to its owner's hand: Put this card onto the battlefield from your hand tapped and attacking."*

**CR 702.49c** (verbatim): *"The creature put onto the battlefield with the ninjutsu ability enters attacking the same player, planeswalker, or battle as the creature that was returned to its owner's hand."*

**CR 702.49d**: Commander ninjutsu can also function from the command zone.

## The Pattern

```
NINJUTSU ACTIVATION:
  Requirements:
  - Ninjutsu card is in your hand
  - You control an unblocked attacking creature
  - Timing: after declare blockers (you need to know the creature is unblocked)
    → Can activate during declare blockers step, combat damage step,
       or any priority window during combat where the creature is still unblocked
  - Pay the cost: reveal ninja + return unblocked attacker to hand + pay mana

  Result:
  - Returned creature is removed from combat (goes to hand)
  - Ninja enters battlefield tapped and attacking
  - Ninja attacks same target as the returned creature
  - Ninja is a "blocking creature" or "attacking creature" but NOT "declared as attacker"

IMPORTANT: "ENTERS ATTACKING" ≠ "DECLARED AS ATTACKER"
  Does NOT trigger: "Whenever [creature] attacks" or "Whenever a creature attacks"
  DOES still: deal combat damage in the current combat damage step
  DOES still: be an attacking creature for all other purposes (menace blocking
    requirements for defending player, etc.)
  Does NOT get attack triggers it normally would if declared normally

SUMMONING SICKNESS AND NINJUTSU:
  A creature with summoning sickness CAN be put onto the battlefield via ninjutsu
  and attack — entering attacking bypasses the "can't attack if it entered this
  turn under your control" restriction (which is about DECLARING as an attacker)
  But: if the ninja has {T} abilities, it can't use them (still has summoning sickness)
  The ninja IS tapped (it enters tapped as part of ninjutsu)

"UNBLOCKED" REQUIREMENT:
  Creature must be unblocked at the time ninjutsu is activated (CR 509.1h)
  Creature was declared blocked? Even if all its blockers were removed, it's STILL
    blocked (P030) — it does NOT satisfy the "unblocked" requirement for ninjutsu
  You can't ninjutsu in on a blocked creature even if blockers died

RETURNED CREATURE:
  Goes to hand (owner's hand, not necessarily controller's)
  No longer attacking; removed from combat
  Can be played again later in the turn (if it has flash, or in a future turn)
  If opponent gained control of it: it returns to the OPPONENT's hand (owner = original player)

ETB TRIGGERS:
  Ninja enters the battlefield, so ETB triggers fire normally
  But: it doesn't trigger "attacks" triggers
```

## Definitive Conclusions

- **Ninjutsu bypasses summoning sickness for attacking.** The ninja enters attacking directly — it doesn't "declare as attacker," so the summoning sickness attack restriction doesn't apply.
- **"Enters attacking" does not trigger attack triggers.** "Whenever [creature] attacks" abilities don't fire for a creature that entered via ninjutsu.
- **Can't ninjutsu on a blocked creature even if its blockers died.** A blocked creature is still blocked (P030) and doesn't satisfy the "unblocked" requirement.
- **The returned creature goes to its OWNER's hand.** If your opponent controls it (via Act of Treason), it goes to your opponent's hand.
- **Ninjutsu can be activated at any combat priority window after the attacker is confirmed unblocked.** You can wait until after combat damage if you want to deal damage with the original creature, then ninjutsu in.
- **Multiple ninjutsu activations are possible.** You could ninjutsu a second ninja using the first ninja as the returned creature (if the first was unblocked), creating a chain.

## Canonical Example
**Ornithopter (0/2 flyer) + Fallen Shinobi:**
You attack with Ornithopter. Opponent has no flyers, no blockers — it's unblocked. After declare blockers step, you activate Fallen Shinobi's ninjutsu ability. Return Ornithopter to hand, Fallen Shinobi enters tapped and attacking. Fallen Shinobi "enters attacking" — no "declare attacker" trigger fires. But Fallen Shinobi itself has "whenever this creature deals combat damage to a player, exile top 2 of their library, you may cast them without paying mana." It deals damage, trigger fires, you cast their spells.

**Example 2 — Can't ninjutsu on blocked creature:**
You attack with two creatures: a 1/1 and a 2/2. Opponent blocks the 2/2 with a 3/3, then lets the 1/1 through (unblocked). You kill the 3/3 with a combat trick. Now the 2/2 has no blockers — but it's still "blocked" (P030). You can only use ninjutsu with the 1/1 (truly unblocked). Can't ninjutsu on the 2/2 even though its blocker died.

**Example 3 — Ninjutsu enables double ninja swap:**
You attack with a 1/1, opponent has no blockers. After blockers: ninjutsu in Ninja #1 (return 1/1 to hand). Ninja #1 is now unblocked and attacking. You can activate Ninja #2's ninjutsu (if you have one in hand): return Ninja #1 to hand, Ninja #2 enters attacking. Ninja #1 goes back to hand, Ninja #2 deals damage. Chain continues with as many ninjas as you have in hand.

## Commonly Confused With
- **P030 (Blocked Status)** — Blocked creatures can't be used for ninjutsu. A "blocked" creature is still blocked even with no blockers remaining.
- **P028 (Simultaneous ETB)** — The ninja entering the battlefield can trigger ETBs. It enters attacking but ETBs still fire (P028 applies for simultaneous entries).
