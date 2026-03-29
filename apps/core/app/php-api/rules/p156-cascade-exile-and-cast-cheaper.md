---
id: p156
name: Cascade — Exile and Free-Cast a Cheaper Spell
category: stack
cr_refs: [702.85a, 702.85b, 702.85c]
tags: [cascade, exile, free-cast, mana-value, triggered, library, Bloodbraid-Elf, Living-End, Violent-Outburst]
created: 2026-03-28
examples_count: 2
---

# P156 — Cascade — Exile and Free-Cast a Cheaper Spell

## Abstract
Cascade triggers when you cast a spell with cascade. Exile cards from the top of your library until you hit a nonland card with mana value strictly less than the cascading spell's mana value. You may then cast that card for free. All other exiled cards go to the bottom of your library in random order. Cascade creates a "two spells for one" effect — the cascade spell plus whatever it finds. The key constraint is "strictly less than" — cascade cannot find a card with the same or greater mana value. This enables degenerate combos when the deck is built entirely of 0-CMC or specific-CMC cards (Living End, Crashing Footfalls).

## The Definitive Rules

**CR 702.85a** (verbatim): *"Cascade is a triggered ability that functions only while the spell with cascade is on the stack. 'Cascade' means 'When you cast this spell, exile cards from the top of your library until you exile a nonland card whose mana value is less than this spell's mana value. You may cast that card without paying its mana cost if the resulting spell's mana value is less than this spell's mana value. Then put all cards exiled this way that weren't cast on the bottom of your library in a random order.'"*

**CR 702.85c** (verbatim): *"If a spell has multiple instances of cascade, each triggers separately."*

## The Pattern

```
CASCADE:
  Triggered: when you CAST a spell with cascade (not copy, not put on stack)
  Process:
    1. Exile cards from library one by one until hitting a nonland card with CMC < cascading spell's CMC
    2. May cast that nonland card for free (without paying mana cost)
    3. All other exiled cards → bottom of library in random order

  CASCADE + MANA VALUE COMPARISON:
    Strictly less than: cascade finds CMC < N (not ≤)
    Cascading a 4-mana spell: can find 0, 1, 2, or 3 CMC cards (not 4)
    X spells: X = 0 when cast for free (no mana paid for X)
    The CASCADE itself is not a cast for free → if the FOUND card is cast for free, its CMC is its printed CMC for cascade comparison

  CASCADE + FREE CAST:
    Casting the found card is OPTIONAL: "you may cast that card"
    If you don't cast it: also goes to bottom of library
    Casting the found card is still CASTING → triggers its own cast triggers, storm, etc.
    But NOT suspending or other "put onto battlefield" effects

  CASCADE + DELVE/CONVOKE ON FOUND CARD:
    If found card has delve: when cast for free (without paying mana cost), delve still available
    You just... cast it without its mana cost. Delve would let you reduce generic costs
    But since you're not paying mana cost at all: delve is somewhat irrelevant (already free)

  CASCADE COMBO:
    Key insight: cascade finds the FIRST card with CMC < cascading spell
    If your entire deck is CMC = 0 (except cascade cards): cascade always finds CMC 0 card
    Living End (suspend 3, CMC 0) + Violent Outburst (cascade, CMC 3):
      Cascade → exile cards until CMC 0 Living End found → cast Living End for free
      Living End: each player sacrifices creatures, then returns all creatures from your graveyard
    Crashing Footfalls (CMC 0) + Shardless Agent (CMC 3): similar

  CASCADE + STACK ORDER:
    Cascade trigger goes on stack when cast
    Cascade resolves BEFORE the cascading spell resolves
    The found card resolves BEFORE the cascade resolves
    If cascade finds a creature → creature enters → then the cascade spell resolves
    LIFO stack: [cascade spell | cascade trigger | found card spell (if cast)]
    Resolution order: found card → cascade spell

  CASCADE + COUNTERSPELLS:
    Counterspelling the CASCADE spell on the stack: cascade trigger still fires if already on stack
    Cascade trigger is independent once triggered
    If cascade spell is countered: it doesn't resolve, but cascade trigger was already queued
    Actually: cascade triggers when you CAST it (as it's cast, before priority is passed)
    The trigger goes on the stack AFTER casting; if the spell itself is countered: trigger resolves → cascade finds and potentially casts a card → original spell never resolved
    This is a known interaction: cascade → counter the cascade spell → still get the free cast from cascade

  CASCADE + MULTIPLE INSTANCES:
    Two cascade instances on same spell: two separate cascade triggers
    Each fires independently → two chances to exile and cast a free card
    Maelstrom Wanderer (double cascade) triggers twice

  CASCADE RESTRICTION:
    "if the resulting spell's mana value is less than this spell's mana value"
    This is a secondary check at the casting stage
    If the found card's CMC ≥ cascading spell's CMC for some reason: can't cast it
```

## Definitive Conclusions

- **Cascade finds and free-casts a nonland card with strictly lower CMC** than the cascading spell.
- **Cascade trigger is independent** once it fires — countering the cascade spell after the trigger is queued doesn't stop the free cast.
- **X costs are 0 when cast for free** via cascade.
- **Casting the found card is still "casting"** — triggers cascade, storm, etc.
- **Multiple cascade instances trigger separately** — Maelstrom Wanderer gets two free casts.

## Canonical Example
**Bloodbraid Elf (Cascade — CMC 4):**
Cast Bloodbraid Elf → cascade triggers → exile until finding a CMC 0–3 nonland card.
Find Lightning Bolt (CMC 1): cast for free → deal 3 damage. Bloodbraid Elf enters (4/2 haste).
Two threats from one card.

**Example 2 — Violent Outburst (Instant, CMC 3, Cascade):**
Your library contains only Crashing Footfalls (CMC 0) as non-cascade cards.
Cast Violent Outburst → cascade → exile cards until Crashing Footfalls (CMC 0 < 3) is found → cast it for free → create two 4/4 Rhino tokens.
Violent Outburst also resolves: creatures you control get +1/+0 and trample until end of turn.

## Commonly Confused With
- **P146 (Suspend)** — Suspend exiles a card to cast it later. Cascade finds a card during resolution and casts it immediately.
- **P036 (Storm)** — Storm copies a spell. Cascade free-casts a DIFFERENT spell from the library.
- **P148 (Morph)** — Morph is a face-down cast. Cascade is a triggered free cast of a found card.
