---
id: p081
name: Suspend — Time Counters and Cast from Exile
category: zones
cr_refs: [702.62a, 702.62b, 702.62c, 702.62d]
tags: [suspend, time-counters, exile, upkeep, cast-from-exile, haste, free-cast, special-action]
created: 2026-03-28
examples_count: 2
---

# P081 — Suspend — Time Counters and Cast from Exile

## Abstract
Suspend allows a card to be exiled with time counters by paying a usually-cheaper cost. Each upkeep, one time counter is removed. When the last time counter is removed, the spell may be cast from exile without paying its mana cost (free cast). If cast as a creature spell this way, it gains haste. Exiling a card for suspend is a special action (doesn't use the stack). Suspend cards wait in exile, publicly visible, creating a timed threat opponents must plan around.

## The Definitive Rule

**CR 702.62a** (verbatim): *"Suspend is a keyword that represents three abilities. The first is a static ability that functions while the card with suspend is in a player's hand. The second and third are triggered abilities that function in the exile zone. 'Suspend N—[cost]' means 'If you could begin to cast this card by putting it onto the stack from your hand, you may pay [cost] and exile it with N time counters on it. This action doesn't use the stack,' and 'At the beginning of your upkeep, if this card is suspended, remove a time counter from it,' and 'When the last time counter is removed from this card, if it's exiled, you may play it without paying its mana cost if able. If you don't, it remains exiled. If you cast a creature spell this way, it gains haste until you lose control of the spell or the permanent it becomes.'"*

## The Pattern

```
SUSPEND SEQUENCE:
  SETUP (from hand, any time you could begin to cast the card):
    Pay suspend cost + exile the card with N time counters
    Special action: doesn't use the stack (can't be countered)

  COUNTDOWN:
    Each of your upkeeps: remove one time counter (triggered ability in exile)

  CAST TRIGGER:
    When last time counter removed: trigger fires
    You MAY cast the card from exile without paying its mana cost
    If creature: gains haste
    If you don't cast: card stays exiled (not sacrificed, not lost — just stays)

FREE CAST DETAILS:
  "Without paying its mana cost" = alternative cost (mana cost = 0)
  X in mana cost: X = 0 on a free cast (CR 107.3b — X defaults to 0 without payment)
  Kicker CAN be paid (additional cost on top of free cast)
  Spell timing: respects the card type's timing
    → Creature spell suspended: cast it when the trigger fires (which can be upkeep)
    → Haste makes this immediately relevant for creatures

HASTE SCOPE:
  "Until you lose control of the spell or the permanent it becomes"
  Haste is lost if: opponent steals the creature, or it leaves the battlefield
  The haste is tied to the "it was cast from suspend" condition

SUSPEND CARD IS VISIBLE:
  Suspended cards are in exile face-up (unless effect says otherwise)
  Opponents can see what's coming and how many turns remain
  This is the "timing signal" aspect of suspend

IF "CAN'T CAST" AT TRIGGER TIME:
  "You may play it without paying its mana cost if able" — if not able: stays exiled
  Example: opponent has "you can't cast spells" effect when last counter removed
  → Can't cast → stays exiled → still suspended (counters are gone but in exile)
  → Future upkeep triggers: the triggered ability fires when card is "suspended" (CR 702.62b)
  But card no longer has time counters → not "suspended" → upkeep trigger doesn't fire?
  Actually: CR 702.62b: a card is "suspended" if in exile zone, has suspend, AND has a time counter
  Once last counter removed and cast trigger fired (even if can't cast): no longer "suspended"
  → No more upkeep triggers. The cast trigger fires once, attempts the cast, that's it.

PROLIFERATE AND SUSPEND:
  Proliferate can ADD time counters to a suspended card (counters are there, proliferate adds more)
  This delays the suspend countdown — intentional interaction to slow your opponent's suspend
```

## Definitive Conclusions

- **Exiling for suspend is a special action.** Doesn't use the stack; can't be countered.
- **Creature spells cast from suspend gain haste.**
- **The cast trigger fires once when the last counter is removed.** If you can't cast, card stays exiled (not re-suspended).
- **X = 0 in a free suspend cast.** Pay kicker on top if desired.
- **Proliferate can add time counters to delay the countdown.**

## Canonical Example
**Ancestral Vision (Suspend 4—{U}):**
Pay {U}, exile Ancestral Vision with 4 time counters. No mana cost (CMC 0 — can't be cast normally). After 4 upkeeps, last counter removed. Trigger: cast Ancestral Vision without paying its mana cost. Ancestral Vision draws 3 cards. (It's not a creature — no haste relevant.)

**Example 2 — Rift Bolt (Suspend 1—{R}):**
Pay {R}, exile Rift Bolt with 1 time counter. Next upkeep: remove the counter. Trigger: cast Rift Bolt (deal 3 damage to any target) for free. Since suspended for {R} and then casts for free, net cost was {R} over two turns — same as Lightning Bolt but with one turn delay and no flash.

## Commonly Confused With
- **P060 (Foretell)** — Both exile a card from hand via special action. Foretell allows instant cast on future turn; Suspend uses time counters and casts free at the triggered end.
- **P034 (Cascade)** — Cascade also provides a free cast from exile. Suspend uses time counters; cascade is triggered immediately.
