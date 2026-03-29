---
id: p164
name: Rebound — Exile After Resolving, Cast Again Next Upkeep
category: zones
cr_refs: [702.88a, 702.88b, 702.88c]
tags: [rebound, exile, upkeep, delayed-trigger, alternative-cast, free, Rise-of-Eldrazi, Distortion-Strike]
created: 2026-03-28
examples_count: 2
---

# P164 — Rebound — Exile After Resolving, Cast Again Next Upkeep

## Abstract
Rebound is a static ability that creates a delayed triggered ability. When you cast an instant or sorcery with rebound from your hand and it resolves, instead of going to the graveyard, it's exiled. At the beginning of your next upkeep, you may cast it again for free (without paying its mana cost). After that free cast, it goes to the graveyard normally. The key constraint: rebound only works when cast from the **hand** — if cast from graveyard, exile, or anywhere else, rebound doesn't trigger. This gives instants/sorceries a "two-for-one" over two turns.

## The Definitive Rules

**CR 702.88a** (verbatim): *"Rebound appears on some instants and sorceries. It represents a static ability that functions while the spell is on the stack and may create a delayed triggered ability. 'Rebound' means 'If this spell was cast from your hand, instead of putting it into your graveyard as it resolves, exile it and, at the beginning of your next upkeep, you may cast this card from exile without paying its mana cost.'"*

## The Pattern

```
REBOUND:
  Static ability (while spell is on stack)
  If cast from HAND: instead of going to graveyard, exile it
  Delayed trigger: at beginning of YOUR next upkeep, may cast from exile for free
  After the free cast: goes to graveyard normally

  REBOUND + FROM HAND ONLY:
    Key restriction: "if this spell was cast from your hand"
    If cast from graveyard (e.g., via Snapcaster Mage flashback): NOT from hand → rebound doesn't apply
    If cast from exile (Plot, etc.): NOT from hand → no rebound
    Only natural cast from hand triggers rebound

  REBOUND + UPKEEP TIMING:
    Triggers at YOUR next upkeep (not opponent's)
    "You may" — optional: can decline to cast
    If you don't cast it: it stays in exile (NOT returned to hand or graveyard)
    The card stays in exile if you pass on the upkeep cast

  REBOUND + FREE CAST:
    The upkeep cast is without paying mana cost
    X costs: X = 0 when cast for free
    Targets: chosen again (new spell on stack)
    Copying the upkeep cast: makes a copy of the spell (without paying mana cost was irrelevant for copying)

  REBOUND + COUNTERED:
    If the original spell is countered: it doesn't resolve → doesn't get to exile step → goes to graveyard normally
    Rebound requires the spell to RESOLVE to trigger the exile replacement

  REBOUND + COPIED SPELL:
    Copies of spells with rebound: the copy is not "cast from hand" → rebound doesn't apply to copies

  REBOUND + SUSPEND COMPARISON:
    Suspend: exile from hand with time counters, cast later via triggered ability
    Rebound: cast from hand, exile after resolving, cast again next upkeep
    Key difference: rebound requires the first cast to happen AND resolve; suspend starts before first cast

  REBOUND CARDS:
    Distortion Strike (Rebound, {U}): target creature gets +1/+0 and is unblockable until end of turn
      → Cast on turn 1: creature unblockable, connects for damage
      → Rebound: upkeep cast again → creature unblockable for two turns total from one card
    Emerge Unscathed (Rebound): protection from chosen color until end of turn
      → Cast to dodge a spell, then rebound the next turn for another protection
    Staggershock (Rebound): deal 2 damage
      → 2+2 = 4 total damage from one card over two turns
```

## Definitive Conclusions

- **Rebound only works when cast from hand** — not from graveyard, exile, or command zone.
- **The card is exiled after resolving** — not the graveyard.
- **At your next upkeep, cast it for free** — optional.
- **If declined at upkeep**, the card remains in exile (not graveyard).
- **Copying a rebound spell**: the copy doesn't rebound (wasn't cast from hand).

## Canonical Example
**Distortion Strike (Rebound — {U}):**
Turn 1: Cast Distortion Strike on your infect creature (Blighted Agent) → it's +1/+0 and unblockable.
Distortion Strike is exiled.
Turn 2 upkeep: Rebound trigger → cast Distortion Strike for free → creature is unblockable again.
Two turns of unblockable attacks from one card → infect strategies love this.

**Example 2 — Staggershock (Rebound — {2}{R}):**
Cast Staggershock → deal 2 damage to target creature or player.
Exiled by rebound. Next upkeep: cast again for free → deal 2 more damage.
Total: 4 damage from one 3-mana spell over two turns.
Split-damage: kill a 2-toughness creature the first cast, then finish off a weakened player the second cast.

## Commonly Confused With
- **P163 (Retrace)** — Retrace casts from graveyard with an additional cost. Rebound exiles after resolving and casts for free from exile at upkeep.
- **P146 (Suspend)** — Suspend exiles BEFORE first casting with a countdown. Rebound exiles AFTER the first resolving cast.
- **P128 (Plot)** — Plot exiles proactively for a free future cast at any main phase. Rebound exiles automatically after resolving and triggers at next upkeep.
