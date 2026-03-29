---
id: p210
name: Kicker and Multikicker — Additional Costs for Bonus Effects
category: costs
cr_refs: [702.33a, 702.33b, 702.33c, 702.33d, 702.34a, 702.34b]
tags: [kicker, multikicker, additional-cost, scaling-spell, kicked, Kor-Firewalker, Everflowing-Chalice, Zendikar]
created: 2026-03-28
examples_count: 2
---

# P210 — Kicker and Multikicker — Additional Costs for Bonus Effects

## Abstract
Kicker is an optional additional cost to a spell: pay the kicker cost as you cast the spell to get a bonus effect. Multikicker can be paid any number of times for scaling effects. A spell is "kicked" if its kicker cost was paid. Multiple kicker abilities on one spell each function independently. Kicker and multikicker don't change the spell's mana cost — they're additional costs added on top. The "kicked" state matters for triggered abilities that check "if this spell was kicked" or "for each time it was kicked."

## The Definitive Rules

**CR 702.33a** (verbatim): *"Kicker is a static ability that functions while the spell with kicker is on the stack. 'Kicker [cost]' means 'You may pay an additional [cost] as you cast this spell.' Paying a spell's kicker cost(s) follows the rules for paying additional costs in rules 601.2f–h."*

**CR 702.33b** (verbatim): *"The phrase 'Kicker [cost 1] and/or [cost 2]' means the same as 'Kicker [cost 1]' and 'Kicker [cost 2].'"*

**CR 702.33c** (verbatim): *"Multikicker is a variant of the kicker ability. 'Multikicker [cost]' means 'You may pay an additional [cost] any number of times as you cast this spell.' A multikicker cost is a kicker cost."*

**CR 702.33d** (verbatim): *"If a player pays any kicker costs for a spell, that spell was 'kicked.' If a player pays a kicker cost one or more times, that kicker cost was paid. If a player pays a multikicker cost N times, that player kicked the spell N times and that multikicker cost was paid N times."*

## The Pattern

```
KICKER MECHANICS:
  Kicker: optional additional cost when casting
  Kicked spell: the kicker cost was paid (even once)
  Unkicked spell: kicker cost was not paid

  KICKER EFFECTS:
    Spells check "if this was kicked" or "for each kicker cost paid":
    - "If this spell was kicked, ..." → extra effect for any payment
    - "For each time this was kicked, ..." → scales with payment count (multikicker)
    The kicker effect typically appears in the spell's text or as the card's main effect

  MULTIKICKER SCALING:
    Pay kicker cost 0 times: normal spell effect only
    Pay kicker cost 1 time: normal + one instance of bonus
    Pay N times: normal + N instances of bonus
    Everflowing Chalice: "Multikicker {2}. This enters with a charge counter on it for each time it was kicked."
    Kick 3 times: pay {6} extra → enter with 3 charge counters → taps for {3} each turn

  KICKER + COPIES:
    Copy of a kicked spell: the copy IS also kicked (copies retain all characteristics)
    Copy of a unkicked spell: remains unkicked
    When copying a spell (via Reverberate, etc.): copy the "kicked" status

  KICKER + STORM:
    Storm copies all storm copies independently of whether the original was kicked
    Each storm copy: kicked if original was kicked

  KICKER + SUSPEND:
    When a suspended spell resolves (removed last time counter): it's cast "for free"
    Can you pay kicker when a suspended spell is cast?
    Yes! When the suspended spell resolves and is cast, you can pay its kicker cost
    The suspension doesn't prevent paying optional additional costs at time of casting

  KICKER + BUYBACK:
    Buyback: another "additional cost" keyword (return to hand instead of going to graveyard)
    Buyback + Kicker: can pay both additional costs simultaneously
    Skirk Ridge Exhumer: Buyback {B} — sacrifice a Goblin; Kicker {B}{B} — create a 1/1 Goblin token
    Both additional costs can be paid together

  KICKED PERMANENTS:
    Some permanents enter differently if kicked:
    "Kor Firewalker: If this spell was kicked, it gains first strike."
    Actually: "If this was kicked, create a 1/1 white Kor creature token."
    The "kicked" status is checked when the permanent enters the battlefield
    Permanent "enters as kicked" = the kicked-status replacement effect applies at ETB

  KICKER + COMMANDER NINJUTSU:
    Commander Ninjutsu is an activated ability (not casting), no kicker applies

NOTABLE KICKER CARDS:
  Goblin Bushwhacker (1/1, {R}): Kicker {R}. "If kicked, creatures get +1/+0 and haste."
  Territorial Baloth (5/5, {3}{G}): Kicker {G}. "If kicked, it gets +2/+2."
  Everflowing Chalice (0-cost artifact): Multikicker {2}. Comes in with charge counters.
  Spell Contortion: Kicker {3} — counter a spell. If kicked, draw a card.
  Verazol, the Split Current (commander): P/T = number of times kicked × 2; copies effects.
```

## Definitive Conclusions

- **Kicker is an optional additional cost** — not required to cast the spell.
- **"Kicked" status**: true if any kicker was paid; false if none paid.
- **Multikicker**: pay N times for N instances of the bonus.
- **Copies of kicked spells**: the copy IS kicked if the original was kicked.
- **Can pay kicker on suspended spells**: when they resolve from suspend, you can still pay optional additional costs.

## Canonical Example
**Goblin Bushwhacker ({R}) with Kicker {R}:**
Cast unkicked ({R}): it enters as a 1/1. No haste, no team pump.
Cast kicked ({R}+{R}={R}{R}): it enters; "if kicked: creatures you control get +1/+0 and haste until end of turn."
Turn 3 of wide Goblin deck: 5 Goblins on the field.
Cast Goblin Bushwhacker kicked ({R}{R}): all 5 Goblins + Bushwhacker = 6 creatures with +1/+0 and haste.
Attack for massive damage from nowhere. Classic Goblin Guide + Bushwhacker burst.

**Example 2 — Everflowing Chalice (Multikicker):**
Colorless 0-mana artifact. Multikicker {2}. "Tap: Add {C} for each charge counter on this."
Turn 2: Cast for {2}{2} (kicked twice). Enter with 2 charge counters. Taps for {C}{C}.
Turn 3: Cast for {2}{2}{2} (kicked 3 times). Enter with 3 charge counters. Taps for {C}{C}{C}.
Ramp strategy: invest early for large colorless mana production each turn.
With 4 Chalices kicked multiple times: enormous mana advantage.

## Commonly Confused With
- **P150 (Convoke)** — Convoke taps creatures to reduce mana cost. Kicker adds mana cost for a bonus.
- **P193 (Tiered)** — Tiered requires paying a mode's cost to choose that mode. Kicker is optional (doesn't restrict spell modes).
- **P177 (Casualty)** — Casualty sacrifices a creature for a copy of the spell. Kicker pays mana for a bonus effect (not a copy).
