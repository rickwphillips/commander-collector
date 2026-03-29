---
id: p109
name: Vigilance — Attacking Without Tapping
category: combat
cr_refs: [702.20a, 702.20b, 702.20c, 508.1f]
tags: [vigilance, attacking, tap, untap, summoning-sickness, blocker-next-turn, static-ability]
created: 2026-03-28
examples_count: 2
---

# P109 — Vigilance — Attacking Without Tapping

## Abstract
Vigilance is a static ability that modifies the declare attackers step — a vigilance creature doesn't tap when declared as an attacker. This means it remains untapped during the attack, can still be used for blocking if it somehow re-enters defense (irrelevant normally), and crucially: it can attack AND still block on opponent's next turn. Vigilance doesn't affect the summoning sickness rule — a creature with vigilance that just entered still can't attack (summoning sickness is about not having haste, not about tapping).

## The Definitive Rule

**CR 702.20b** (verbatim): *"Attacking doesn't cause creatures with vigilance to tap. (See rule 508, 'Declare Attackers Step.')"*

## The Pattern

```
VIGILANCE — CORE RULE:
  When a creature with vigilance is declared as an attacker:
    It does NOT tap
    It remains untapped throughout the attack
  Normal creatures: tap when declared as attackers (508.1f)
  Vigilance: skip that tapping step

WHAT VIGILANCE ENABLES:
  Attack + still be untapped to:
    - Block on opponent's next turn
    - Use tap-cost activated abilities after attacking
    - Be affected by untap effects that require it to be tapped (if it were tapped)
  Note: vigilance has no value if you won't want to do any of those things

WHAT VIGILANCE DOES NOT DO:
  Does NOT override summoning sickness:
    A creature that just entered this turn STILL can't attack (unless it has haste)
    Vigilance and haste are separate abilities
  Does NOT prevent tapping from other effects:
    "Tap target creature" effects still tap a vigilance creature
    Vigilance only exempts from the "attacking tap" rule
  Does NOT allow double-blocking or attacking twice

VIGILANCE + SUMMONING SICKNESS:
  A 3/3 with vigilance enters. It does NOT have haste.
  Can't attack this turn (summoning sickness)
  Next turn: CAN attack and stays untapped

VIGILANCE ON NON-CREATURES:
  Irrelevant for non-creatures (vehicles, etc.) — they don't declare as attackers the same way
  Unless crewed and attacking: crewing creates a creature, vigilance would apply then

MULTIPLICITY:
  Multiple instances of vigilance are redundant (702.20c)
```

## Definitive Conclusions

- **Vigilance creatures don't tap when attacking.** They remain untapped throughout combat.
- **Vigilance doesn't override summoning sickness.** A creature without haste can't attack its first turn regardless.
- **Other tap effects still work.** "Tap target creature" taps a vigilance creature normally.
- **Main benefit: attack + block next turn.** Or attack + activate tap abilities.

## Canonical Example
**Baneslayer Angel (Flying, First Strike, Lifelink, Protection, Vigilance):**
You attack with Baneslayer. It doesn't tap. Combat damage happens. Baneslayer stays untapped.
Opponent attacks on their turn. Baneslayer can block (it's untapped and available).

**Example 2 — Vigilance + tap ability:**
3/3 vigilance creature with "T: draw a card."
Attack with it on your turn (it stays untapped). After combat, still in your main phase: activate the tap ability. Result: attacked AND drew a card.

## Commonly Confused With
- **P113 (Haste)** — Haste overrides summoning sickness; vigilance does not. Both are commonly given together on creatures meant for aggressive-defensive play.
- **P106 (First Strike + Double Strike)** — Vigilance is often combined with first strike for maximum defensive value (attack, stay untapped, block at first strike next turn).
