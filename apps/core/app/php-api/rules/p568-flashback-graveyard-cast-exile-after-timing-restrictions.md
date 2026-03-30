---
id: p568
name: Flashback — Graveyard Cast, Exile After Resolution, Timing Restrictions Apply
category: costs
cr_refs: [702.34, 702.34a, 601.2b]
tags: [flashback, graveyard, cast, exile, alternative-cost, timing-restrictions, countered-still-exiled, snapcaster-mage, mana-value]
created: 2026-03-31
examples_count: 3
---

# P568 — Flashback — Graveyard Cast, Exile After Resolution, Timing Restrictions Apply

## Abstract

**Flashback lets you cast an instant or sorcery from your graveyard by paying its flashback cost, then exiles it regardless of what happens.** Unlike madness, flashback does NOT override timing restrictions — sorceries require sorcery timing even with flashback. The flashback cost is an alternative cost (can't combine with other alternative costs like overload). After the spell leaves the stack for any reason — resolves, countered, or otherwise — it is exiled (not returned to graveyard). This makes flashback a one-shot use from the graveyard. MV is always determined by the original mana cost, not the flashback cost. A spell can be cast via flashback even if it was never "cast" initially (e.g., milled directly).

## The Definitive Rules

**CR 702.34a (Flashback):** *"'Flashback [cost]' means 'You may cast this card from your graveyard if the resulting spell is an instant or sorcery spell by paying [cost] rather than paying its mana cost' and 'If the flashback cost was paid, exile this card instead of putting it anywhere else any time it would leave the stack.'"*

**Official Ruling (2021-03-19):** *"You must still follow any timing restrictions and permissions, including those based on the card's type. For instance, you can cast a sorcery using flashback only when you could normally cast a sorcery."*

**Official Ruling (2021-03-19):** *"A spell cast using flashback will always be exiled afterward, whether it resolves, is countered, or leaves the stack in some other way."*

**Official Ruling (2021-03-19):** *"If you cast a spell with flashback, you can't pay any alternative costs such as overload costs. You can pay additional costs such as kicker costs."*

**Official Ruling (2021-03-19):** *"You can cast a spell using flashback even if it was somehow put into your graveyard without having been cast."*

**Official Ruling (2021-03-19):** *"If a card with no mana cost gains flashback, it has no flashback cost. It can't be cast this way."*

## The Pattern

```
FLASHBACK MECHANICS:

  Cast from graveyard → pay flashback cost → spell on stack → exile after

  Requirements:
    - Card must be in YOUR graveyard
    - Must be an instant or sorcery (or become one)
    - Must follow normal timing restrictions (sorcery = sorcery speed)
    - Pay flashback cost (alternative cost)

  After leaving the stack (for ANY reason):
    - Exile the card (replacement effect)
    - Resolves? → Exiled
    - Countered? → Exiled
    - Bounced to hand? → Exiled instead
    - Any zone it would go to → Exile instead

FLASHBACK VS MADNESS TIMING:

  Flashback: timing restrictions APPLY
    → Sorcery with flashback: only during your main phase, stack empty
    → Instant with flashback: any time you have priority

  Madness: timing restrictions OVERRIDDEN
    → Sorcery with madness: can cast at instant speed

  This is a key difference. Don't confuse the two.

ALTERNATIVE COST RULES:

  Flashback cost IS an alternative cost:
    - Can't combine with other alternative costs (overload, mutate, etc.)
    - CAN pay additional costs (kicker, buyback, entwine)
    - MUST pay mandatory additional costs
    - Cost increases/reductions still apply to the total

  MV = original mana cost (NOT flashback cost):
    - Card costs {3}{U}{U} with flashback {5}{U}{U}
    - MV = 5 regardless of which cost was paid

  X spells:
    - If flashback cost includes {X}: you choose X and pay it
    - If original spell had {X} but flashback cost doesn't: X isn't relevant
    - If gaining flashback "equal to its mana cost" and spell has {X}:
      you choose X and pay it

EXILE IS ABSOLUTE:

  The "exile instead" replacement effect applies to ANY zone the card
  would go to from the stack:
    - Resolves → would go to graveyard → exiled instead
    - Countered → would go to graveyard → exiled instead
    - Remand → would go to hand → exiled instead
    - "Return to hand" → exiled instead
    - "Put on top of library" → exiled instead

  The ONLY exception: if another replacement effect sends it to exile
  (it's already going there, so no conflict).

GRAVEYARD ENTRY DOESN'T REQUIRE CASTING:

  A card can be flashed back even if it was never cast:
    - Milled into graveyard
    - Discarded
    - Put there by another effect
    - Doesn't matter how it got there

SNAPCASTER MAGE INTERACTION:

  Snapcaster Mage: "Target instant or sorcery in your graveyard gains
  flashback until end of turn. The flashback cost is equal to its mana cost."

  - Grants flashback to a card that doesn't naturally have it
  - Flashback cost = the card's mana cost
  - All flashback rules apply (timing, exile after, etc.)
  - If the card has no mana cost: can't be cast via flashback (no cost)
  - If the card is removed from graveyard in response: can't cast

FLASHBACK + BUYBACK:

  Buyback: "If buyback cost was paid, put this spell into your hand
  instead of your graveyard as it resolves."
  Flashback: "Exile instead of putting anywhere else."

  Both are replacement effects for the same event.
  Flashback's exile wins: the card is EXILED (not returned to hand).
  You spent the buyback mana for nothing.

MULTIPLE FLASHBACK COSTS:

  If a card has multiple instances of flashback (702.34a allows this
  via effects like Snapcaster + natural flashback):
    - Choose which flashback cost to pay
    - Still exiled after regardless
```

## Definitive Conclusions

- **Timing restrictions apply** — unlike madness, sorceries with flashback need sorcery speed.
- **Always exiled after** — whether resolved, countered, bounced, or otherwise leaving the stack.
- **Alternative cost** — can't combine with overload, mutate, etc. Can add kicker.
- **MV = original mana cost** — not the flashback cost, ever.
- **Doesn't need to have been cast** — milled/discarded cards can be flashed back.
- **Buyback doesn't save it** — flashback's exile replacement overrides buyback's hand return.

## Canonical Example

**Snapcaster Mage Granting Flashback:**

You have Lightning Bolt in your graveyard. You cast Snapcaster Mage; on ETB, target Lightning Bolt. It gains flashback with cost {R} (its mana cost).

During your opponent's turn, you cast Lightning Bolt from your graveyard for {R} (flashback). It resolves, dealing 3 damage. Bolt is then exiled (not returned to graveyard).

**Example 2 — Flashback Countered:**

You flash back a sorcery for its flashback cost. Opponent counters it with Counterspell. The sorcery would go to your graveyard from the stack, but flashback's replacement effect exiles it instead. The card is in exile — you can't flash it back again.

**Example 3 — Sorcery Timing:**

You have a sorcery with flashback in your graveyard. It's your opponent's turn. You want to flash it back. You can't — sorcery timing requires your main phase with an empty stack. Flashback does NOT override timing restrictions (unlike madness).

You wait until your main phase. Stack is empty. You cast it via flashback. Legal.

## Commonly Confused With

- **P566 (Madness)** — P566 covers madness (overrides timing); P568 covers flashback (timing restrictions apply). Key difference.
- **P559 (Cascade Free Cast)** — P559 covers "without paying mana cost"; P568 covers flashback (pay flashback cost as alternative).
- **P556 (Hideaway Free Cast)** — P556 covers hideaway's free play; P568 covers flashback's graveyard cast with exile.
