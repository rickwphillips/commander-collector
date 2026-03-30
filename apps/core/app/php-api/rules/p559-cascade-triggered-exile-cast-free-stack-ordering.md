---
id: p559
name: Cascade — Triggered Exile, Free Cast, Stack Ordering, and MV Restrictions
category: stack
cr_refs: [702.85, 702.85a, 702.85b, 702.85c, 107.3, 601.2b]
tags: [cascade, triggered-ability, exile, free-cast, stack-ordering, mana-value, split-card, mdfc, adventure, x-cost, bloodbraid-elf, multiple-cascade]
created: 2026-03-31
examples_count: 3
---

# P559 — Cascade — Triggered Exile, Free Cast, Stack Ordering, and MV Restrictions

## Abstract

**Cascade is a triggered ability that fires when you cast the spell, exiles cards from the top of your library until it finds a nonland card with lesser mana value, and lets you cast that card without paying its mana cost.** The cascade trigger goes on the stack above the original spell. If you cast the exiled card, it goes on the stack above the cascade trigger — meaning it resolves BEFORE the original spell. Cascade checks mana value twice: once when exiling (card's MV must be less than the cascade spell's MV) and again when casting (resulting spell's MV must also be less). This double-check prevents abuse with MDFCs and Adventures whose spell MV differs from the card's MV. X = 0 when cast without paying (CR 107.3). Split cards use combined MV for the exile check. If the cascade spell is countered, cascade still resolves. Multiple instances of cascade trigger separately.

## The Definitive Rules

**CR 702.85a (Cascade):** *"Cascade is a triggered ability that functions only while the spell with cascade is on the stack. 'Cascade' means 'When you cast this spell, exile cards from the top of your library until you exile a nonland card whose mana value is less than this spell's mana value. You may cast that card without paying its mana cost if the resulting spell's mana value is less than this spell's mana value. Then put all cards exiled this way that weren't cast on the bottom of your library in a random order.'"*

**CR 702.85b (As You Cascade):** *"If an effect allows a player to take an action with one or more of the exiled cards 'as you cascade,' the player may take that action after they have finished exiling cards due to the cascade ability."*

**CR 702.85c (Multiple Cascade):** *"If a spell has multiple instances of cascade, each triggers separately."*

**Official Ruling (2021-06-18):** *"A spell's mana value is determined only by its mana cost. Ignore any alternative costs, additional costs, cost increases, or cost reductions."*

**Official Ruling (2021-06-18):** *"Cascade triggers when you cast the spell, meaning that it resolves before that spell. If you end up casting the exiled card, it will go on the stack above the spell with cascade."*

**Official Ruling (2021-06-18):** *"When the cascade ability resolves, you must exile cards. The only optional part of the ability is whether or not you cast the last card exiled."*

**Official Ruling (2021-06-18):** *"If a spell with cascade is countered, the cascade ability will still resolve normally."*

**Official Ruling (2021-06-18):** *"If you cast a card 'without paying its mana cost,' you can't choose to cast it for any alternative costs. You can, however, pay additional costs. If the card has any mandatory additional costs, you must pay those to cast the card."*

**Official Ruling (2021-06-18):** *"If the card has {X} in its mana cost, you must choose 0 as the value of X when casting it without paying its mana cost."*

**Official Ruling (2021-06-18):** *"Due to a 2021 rules change to cascade, not only do you stop exiling cards if you exile a nonland card with lesser mana value than the spell with cascade, but the resulting spell you cast must also have lesser mana value."*

**Official Ruling (2021-06-18):** *"The mana value of a split card is determined by the combined mana cost of its two halves. If cascade allows you to cast a split card, you may cast either half but not both halves."*

## The Pattern

```
CASCADE TRIGGER SEQUENCE:

  Step 1: You CAST a spell with cascade
    → Cascade triggers (goes on the stack ABOVE the original spell)
    → Original spell remains on the stack below

  Step 2: Cascade trigger resolves
    → Exile cards from the top of your library one at a time (face up)
    → Stop when you exile a NONLAND card with MV < cascade spell's MV
    → If your library empties without finding one: stop, put all exiled on bottom

  Step 3: May cast the exiled card
    → You MAY cast it WITHOUT paying its mana cost
    → The RESULTING SPELL'S MV must also be < cascade spell's MV (2021 rule)
    → If you choose to cast: new spell goes on stack ABOVE cascade trigger
    → If you choose not to cast: card goes to bottom with the rest

  Step 4: Put remaining exiled cards on bottom of library in random order

  Step 5: Cascade trigger finishes resolving

  Step 6: New spell (if cast) resolves first (it's on top)

  Step 7: Original cascade spell resolves last

STACK ORDER (CRITICAL):

  Before cascade trigger resolves:
    Bottom: [Original Cascade Spell]
    Top:    [Cascade Trigger]

  Cascade trigger resolves → you cast the found card DURING resolution:
    Bottom: [Original Cascade Spell]
    Top:    [Cascaded Spell] (cast during trigger resolution)
    (Cascade trigger is GONE — it finished resolving)

  Result: Cascaded spell resolves BEFORE the original spell.
  Opponent gets priority between each resolution.

MANA VALUE RULES:

  Cascade spell's MV:
    - Determined by mana cost only (CR 202.3)
    - Ignore alternative costs, additional costs, reductions
    - Example: Bloodbraid Elf ({2}{R}{G}) → MV 4

  Exiling check: card's MV < cascade spell's MV
    - Uses the CARD's mana value (not the spell you'd cast)
    - Nonland cards only — land cards are always skipped
    - Split cards: MV = combined mana cost of both halves

  Casting check (2021 rule): resulting spell's MV < cascade spell's MV
    - This is a SEPARATE check from the exile check
    - The "resulting spell" may have a different MV than the card
    - MDFCs: card MV (front face) may differ from back face spell MV
    - Adventure: card MV (creature) may differ from adventure spell MV
    - If the resulting spell's MV is NOT less: you can't cast it via cascade

  Example — MDFC abuse prevention:
    Cascade spell MV 4. Exile Valki, God of Lies (MV 2, card check passes).
    You want to cast the back face: Tibalt, Cosmic Impostor (MV 7).
    Resulting spell MV = 7, which is NOT < 4. You CANNOT cast Tibalt.
    You CAN cast the front face: Valki (MV 2 < 4, passes both checks).

X COSTS WITH CASCADE:

  "Without paying its mana cost" → X = 0 (CR 107.3)
  You cannot choose any other value for X.
  The spell resolves with X = 0.

  Example: Cascade exiles Fireball ({X}{R}, MV 1)
    → Cast without paying: X = 0
    → Fireball deals 0 damage

ALTERNATIVE COSTS AND CASCADE:

  When casting via cascade's "without paying its mana cost":
    - Cannot use OTHER alternative costs (overload, mutate, foretell, etc.)
    - CAN pay additional costs (kicker, buyback, entwine — if you choose)
    - MUST pay mandatory additional costs (e.g., sacrifice a creature)
    - Cannot cast the spell for its adventure cost (adventure is alternative)

COUNTERING THE CASCADE SPELL:

  If the original cascade spell is countered:
    - Cascade trigger is ALREADY on the stack (it triggered when you cast)
    - Cascade still resolves normally
    - You still exile, still may cast the found card
    - The cascaded spell resolves with no original spell above it

  If the CASCADE TRIGGER is countered (e.g., by Stifle):
    - No exiling happens
    - Original spell is still on the stack (resolves normally)

MULTIPLE CASCADE:

  If a spell has multiple instances of cascade:
    - Each triggers separately (702.85c)
    - All go on the stack above the original spell
    - Each resolves independently (exile, find, may cast)
    - Multiple cascaded spells stack on top of each other

  Example: Spell with cascade cascade (e.g., from Maelstrom Nexus + cascade creature)
    → Two cascade triggers on the stack
    → First cascade resolves: may cast spell A
    → Second cascade resolves: may cast spell B
    → B resolves, then A resolves, then original spell resolves

SPLIT CARDS:

  MV of a split card = combined mana cost of BOTH halves
  Example: Fire // Ice has MV = 2 (Fire) + 2 (Ice) = 4
  You can cascade into it only if cascade spell's MV > 4
  If you cast it, you choose ONE half (not both)
  The resulting spell's MV is just the chosen half's MV

TIMING:

  Cascade trigger resolves during the cast of another spell.
  The cascaded spell is cast during resolution of the trigger.
  This means:
    - The cascaded spell DOES trigger "when you cast" abilities
    - If the cascaded spell ALSO has cascade, that cascade triggers too
    - Nested cascade is possible (cascade into cascade into cascade...)
```

## Definitive Conclusions

- **Cascade resolves BEFORE the original spell** — cascaded spell is on top of the stack.
- **Double MV check (2021 rule)** — both the exiled card AND the resulting spell must have lesser MV.
- **X = 0 when cast free** — no choice for X (CR 107.3).
- **Countering the original doesn't stop cascade** — the trigger is independent.
- **Split card MV = combined** — but you cast only one half.
- **No alternative costs via cascade** — "without paying" means you can't use overload, mutate, etc.
- **Multiple cascade = multiple triggers** — each resolves independently.
- **Mandatory exiling** — you MUST exile cards; only the cast is optional.

## Canonical Example

**Bloodbraid Elf Cascade:**

You cast Bloodbraid Elf ({2}{R}{G}, MV 4). Cascade triggers. The stack is: [Bloodbraid Elf] → [Cascade Trigger on top].

Cascade resolves. You exile cards: Mountain (land, skip), Forest (land, skip), Lightning Bolt ({R}, MV 1). MV 1 < 4 → stop exiling. You may cast Lightning Bolt without paying its mana cost. You choose to cast it targeting opponent. Lightning Bolt goes on the stack above cascade.

Stack: [Bloodbraid Elf] → [Lightning Bolt on top].

Lightning Bolt resolves: 3 damage to opponent. Then Bloodbraid Elf resolves: enters the battlefield as a 3/2 with haste. Remaining exiled cards (the two lands) go on the bottom of your library in random order.

**Example 2 — MDFC and 2021 Rule:**

You cast a spell with cascade (MV 4). Cascade exiles Valki, God of Lies (front face MV 2). Card MV check: 2 < 4 ✓.

You want to cast the back face, Tibalt, Cosmic Impostor (MV 7). Resulting spell MV check: 7 < 4 ✗. You CANNOT cast Tibalt via cascade. You can cast Valki (resulting spell MV 2 < 4 ✓) or choose not to cast.

**Example 3 — Cascade Spell Countered:**

You cast Shardless Agent ({1}{G}{U}, MV 3). Cascade triggers. Opponent counters Shardless Agent with Counterspell.

Cascade trigger is still on the stack (it triggered on cast, independently). Cascade resolves normally: exile until you find a nonland with MV < 3. You find Ancestral Vision (MV 0). You cast it without paying its mana cost. Ancestral Vision resolves: draw 3 cards. Shardless Agent is in the graveyard (countered), but the cascade was not wasted.

## Commonly Confused With

- **P556 (Hideaway Free Cast)** — P556 covers hideaway's condition-gated free play; P559 covers cascade's exile-until-found free cast. Both share X = 0 and additional cost rules.
- **P546 (Cost Reduction Spell Copies)** — P546 covers cost reduction not applying to copies; P559 covers cascade's alternative cost restrictions during free cast.
- **P544 (Tiered Modal and Prowess)** — P544 covers single-cast trigger count; cascade's cast-during-resolution DOES trigger "when you cast" abilities.
