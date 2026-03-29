---
id: p113
name: Evoke — Alternative Cost with ETB Then Sacrifice
category: triggered
cr_refs: [702.74a, 603.3, 116.2]
tags: [evoke, alternative-cost, ETB, sacrifice, triggered, stack, respond, elemental, mourning-dove]
created: 2026-03-28
examples_count: 2
---

# P113 — Evoke — Alternative Cost with ETB Then Sacrifice

## Abstract
Evoke is an alternative cost that lets you cast a creature for less mana — but includes a triggered ability "when this permanent enters, if its evoke cost was paid, sacrifice it." Critically, this sacrifice trigger uses the stack. There is a window to respond between the ETB triggers resolving and the sacrifice trigger resolving. The sequence: (1) pay evoke cost, (2) creature enters, (3) ETB triggers + evoke sacrifice trigger both go on stack, (4) you can respond before sacrifice resolves. Most evoke creatures are used for their powerful ETB abilities; the sacrifice is the cost of getting a cheaper card.

## The Definitive Rule

**CR 702.74a** (verbatim): *"Evoke represents two abilities: a static ability that functions in any zone from which the card with evoke can be cast and a triggered ability that functions on the battlefield. 'Evoke [cost]' means 'You may cast this card by paying [cost] rather than paying its mana cost' and 'When this permanent enters, if its evoke cost was paid, sacrifice it.' Casting a spell for its evoke cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
EVOKE STRUCTURE:
  1. Cast using alternative evoke cost (or normal mana cost — evoke is optional)
  2. Creature resolves, enters battlefield
  3. All ETB triggers fire simultaneously (from the creature's printed abilities)
  4. The evoke sacrifice trigger ALSO fires if evoke cost was paid
  5. All triggers go on the stack (APNAP order)
  6. Resolve stack: ETB abilities resolve (usually good effects)
  7. Sacrifice trigger resolves: creature is sacrificed

KEY WINDOW: Between entering and sacrifice:
  After creature enters (and triggers are placed on stack):
  You have priority BEFORE sacrifice resolves
  You can: cast instants, activate abilities, equip, enchant
  Opponent can: try to counter the sacrifice trigger with Stifle
  If sacrifice trigger is Stifled: creature stays!

EVOKE SACRIFICE IS A TRIGGER:
  It goes on the stack → it can be countered (Stifle, Trickbind)
  It can be redirected (Willbender-style effects)
  If the creature is killed before the sacrifice trigger resolves:
    The sacrifice trigger resolves (tries to sacrifice) → creature is already in graveyard
    → Does nothing (it's not on the battlefield to sacrifice)

CASTING AT NORMAL COST:
  Evoke is an alternative cost — you don't have to use it
  Cast at full mana cost → evoke sacrifice trigger does NOT fire
  Creature stays on battlefield

BLINK INTERACTION:
  If creature enters via evoke and is blinked (exile + return) before sacrifice trigger resolves:
    The new version of the creature that returned is a NEW object
    The evoke trigger was set up for the old object → fizzles or applies to old (now gone) object
    The new version: did it enter for evoke cost? No → sacrifice trigger doesn't apply to it
  → Blinking is an evoke escape hatch

ETB ORDER ON STACK:
  Multiple triggers from the same player → that player orders them
  Evoke sacrifice trigger is usually put UNDER the ETB ability trigger
  → ETB ability resolves first, then sacrifice
  (Note: APNAP — active player orders their own triggers)
```

## Definitive Conclusions

- **Evoke triggers sacrifice on entry — it uses the stack.** You can respond before sacrifice resolves.
- **Window exists between ETB and sacrifice.** Use it to cast instants, flicker, equip, etc.
- **Stifle counters the sacrifice trigger** → creature stays on battlefield.
- **Blinking an evoked creature before sacrifice fires → creature comes back without evoke trigger.**
- **Casting at full mana cost → no sacrifice trigger fires.**

## Canonical Example
**Mulldrifter (Evoke {2}{U}):**
Pay {2}{U} evoke cost. Mulldrifter enters. "Draw 2 cards" ETB trigger + "sacrifice it" evoke trigger go on stack.
APNAP: you order them — put sacrifice trigger BELOW draw trigger.
Draw 2 resolves. Then sacrifice trigger resolves — sacrifice Mulldrifter.
Result: paid {2}{U} for "draw 2 cards" with a 2/2 on stack briefly.

**Example 2 — Evoke + Stifle:**
Opponent Stifles the evoke sacrifice trigger. Now Mulldrifter stays! You drew 2 AND kept a 2/2 flier. This is a classic combo.

## Commonly Confused With
- **P066 (Blitz)** — Blitz has a mandatory "sacrifice at end of turn" trigger (delayed, end of turn). Evoke has "sacrifice on entry" — much faster, but same idea of temporary creature usage.
- **P056 (Exploit)** — Exploit lets you optionally sacrifice any creature. Evoke sacrifices ITSELF (mandatory if evoke was paid).
- **P074 (Afterlife)** — Afterlife triggers on death. If you evoke a creature with afterlife, afterlife triggers when the evoke sacrifice resolves.
