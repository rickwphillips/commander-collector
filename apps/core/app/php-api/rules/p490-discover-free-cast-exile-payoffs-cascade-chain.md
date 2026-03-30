---
id: p490
name: Discover — Free Cast from Exile Payoffs, Cast-Trigger Interactions, and Cascade-Chain Differences
category: zones
cr_refs: [701.57, 702.85, 603.2, 603.6a, 117.6, 400.7, 112.7a, 601.2b]
tags: discover, cascade, free-cast, cast-from-exile, prowess, storm, magecraft, quintorius-kand, geological-appraiser, infinite-combo, sorcery-timing-bypass, grafdiggers-cage, chimil, lost-caverns-ixalan
created: 2026-03-29
examples_count: 7
---

# P486 — Discover — Free Cast from Exile Payoffs, Cast-Trigger Interactions, and Cascade-Chain Differences

## Abstract

**Discover N** (CR 701.57, Lost Caverns of Ixalan 2023) is a keyword action that exiles cards from the library top until hitting a nonland with MV ≤ N, then offers a free cast or a put-into-hand choice. P459 covers the core mechanism. This pattern addresses three deeper interaction clusters that have created notable tournament rulings and combo potential: (1) the free cast via Discover IS a genuine cast, triggering prowess, storm, magecraft, and "cast from exile" payoffs such as Quintorius Kand; (2) the timing of the free cast bypasses normal timing restrictions, enabling sorcery-speed cards to be cast as part of a Discover resolution at instant speed in certain situations; and (3) how Discover chains differ critically from Cascade chains — particularly the *Geological Appraiser* infinite loop case — and how Grafdigger's Cage interacts.

## The Definitive Rules

### Discover Is a Cast (CR 701.57, 601.2)
When you cast a card found by Discover "without paying its mana cost," you are genuinely casting it. This is not putting it onto the battlefield directly. The card goes from exile onto the stack as a spell. All cast-related triggers fire normally:
- Prowess triggers ("whenever you cast a noncreature spell")
- Storm counts it
- Magecraft triggers ("whenever you cast or copy an instant or sorcery")
- "Cast from exile" triggers (Quintorius Kand, Prosper Tome-Bound, etc.)
- "Cast" ETB conditions (e.g., Geological Appraiser: "if you cast it")

### Timing During Discover Resolution
When a Discover trigger resolves, you have an opportunity to cast the discovered card in the middle of the Discover trigger's resolution. The Discover trigger is resolving on the stack. Casting the discovered card is part of that resolution — the timing rules for the card (sorcery speed, instant speed) are BYPASSED because the instruction to cast comes from the resolving ability, not from the player taking a normal game action. This is analogous to how cascade works: you can cast a sorcery found by cascade even during the opponent's turn.

**Limitation:** You still must follow all other casting restrictions: legal targets must exist, format legality, zone legality. You must pay any mandatory additional costs.

### X Costs in Discover (CR 107.3b)
If the discovered card has {X} in its mana cost and you choose to cast it without paying its mana cost, you must choose X = 0. You cannot pay any amount for X via the free cast.

### Grafdigger's Cage (CR 614.12)
Grafdigger's Cage says "Spells can't be cast from graveyards or libraries." Discover casts from exile (the card was exiled from the library, then cast from exile). Cage does NOT prevent casting from exile — it only blocks casting from graveyards or libraries. Discover's free cast can proceed normally under Cage. However, Cage DOES interact with other cards-from-library mechanics (like some older cascade variants that put cards onto the stack from the library rather than first exiling them).

Wait — checking: the official ruling from Trumpeting Carnosaur (2023-11-10) confirms "you may cast it without paying its mana cost" after exiling it. The card was moved to exile first, then cast from exile. Cage blocks casting from library/GY, not exile. Discover is unaffected by Cage.

### Discover Chaining vs. Cascade Chaining (CR 702.85 vs. 701.57)
- **Cascade** (CR 702.85): When a cascade spell resolves, you exile cards until finding a cheaper one and may cast it. If THAT cast card also has cascade, its cascade ability triggers on the stack. This creates chains.
- **Discover**: When the discover trigger resolves and you cast the discovered card, if THAT card has a discover trigger (e.g., an ETB discover trigger), that discover trigger goes on the stack as a new trigger after the cast card enters the battlefield. Discover triggers chain if the discovered cards have discover ETB abilities.
- **Key difference:** Cascade chains from the mechanic itself; Discover only chains if the discovered card has its own discover trigger. Casting a card from Discover that has cascade DOES trigger cascade (it's a genuine cast).

## The Pattern

```
DISCOVER cast interaction map:

When you cast the discovered card:
  → It is a genuine cast — all "when you cast" triggers fire:
     ✓ Prowess (if noncreature was cast — discovery hits instants/sorceries)
     ✓ Storm (counts as a cast this turn)
     ✓ Magecraft (if it's an instant or sorcery)
     ✓ "Cast from exile" payoffs (Quintorius Kand: 2 damage + 2 life per cast from exile)
     ✓ Cascade trigger (if the discovered card has Cascade)
     ✓ ETB "if you cast it" conditions (Geological Appraiser: "if you cast it, discover 3")
  → "When you cast" ≠ "when it enters the battlefield" — it fires on the stack

TIMING BYPASS in Discover resolution:
  → You may cast the discovered card regardless of its normal timing restrictions
  → A sorcery found by Discover during opponent's end step can be cast right then
  → This is because the instruction comes from a resolving ability (like cascade)
  → You still need legal targets, mandatory costs paid, etc.
  → You CANNOT use alternative costs (e.g., can't pay {1} to cast a card normally costing {3}{R}
    via its Prototype alternative — you're already casting it without paying its mana cost)
  → If the discovered card has a mandatory additional cost (e.g., "sacrifice a creature"),
    you MUST pay that cost or choose not to cast it (put it in hand instead)

GRAFDIGGER'S CAGE interaction:
  Cage: "Spells can't be cast from graveyards or libraries."
  Discover: exiles first, then offers cast from EXILE
  → Cage does NOT block Discover's free cast (exile ≠ library or graveyard)
  → Chimil, the Inner Sun (LCI): "Spells you control can't be countered. At beginning of end step, discover 5."
    → Chimil's discover triggers during the end step
    → Cage doesn't stop Chimil's discover free casts either
  → What Cage DOES prevent: casting from GY (Flashback, Escape) and from library (some effects)

DISCOVER vs. CASCADE — structural differences:

  CASCADE (702.85):
    → Mechanical keyword on the spell being cast
    → On resolution: exile until cheaper nonland card found, then cast it
    → Chaining: if the free-cast card ALSO has cascade, that cascade triggers
    → No hand option: cascade says cast it OR put it and all other revealed cards on bottom
      → Actually: cascade says "you may cast it without paying its mana cost"
      → If you don't cast it: revealed cards go on bottom in random order (including the found card)
    → Zero-MV cards: You must find a card with MV STRICTLY less than the cascade card's MV
      → A 0-cost card can be hit by cascade from any cascade card with MV > 0
    → The cast is mandatory if legal (you must cast it if you can)
      → Actually re-checking: cascade says "you may cast it" — it is optional too
    → But the exile is mandatory: you must exile until you find one

  DISCOVER (701.57):
    → Keyword action triggered by other effects (ETBs, activated abilities, etc.)
    → "You may cast that card without paying its mana cost OR put it into your hand"
    → The hand option is the key difference from cascade
    → Chaining: if the discovered card has a Discover ETB trigger, that trigger goes on
      the stack after the card enters the battlefield — a new trigger, not part of this Discover
    → Zero-MV cards: Discover N can hit a 0-MV card (MV 0 ≤ N for any N ≥ 0)
    → Grafdigger's Cage doesn't block Discover's cast (from exile, not library/GY)

GEOLOGICAL APPRAISER INFINITE LOOP:
  Geological Appraiser (LCI): "{W}{U}{R}{G} — 4/3. When this creature enters the battlefield,
   if you cast it, discover 3."
  → Discover 3 can find another Geological Appraiser (MV = 4... wait, MV 4 > 3)
  → Actually Geological Appraiser costs 4 mana (MV 4), Discover 3 finds MV ≤ 3
  → A SECOND APPRAISER would NOT be found by Discover 3 (MV 4 > 3)

  The actual combo was with Geological Appraiser + Glasspool Mimic (MV 2):
  → Appraiser ETB → Discover 3 → hits Glasspool Mimic (MV 2)
  → Cast Glasspool Mimic as a copy of Geological Appraiser
  → Copy of Appraiser ETBs... does it trigger Discover?
  → "If you cast it" — Glasspool Mimic was CAST (from exile via discover), so YES
  → Glasspool Mimic copies Geological Appraiser, ETBs, triggers discover
  → The actual "infinite" version required the deck to be built to only hit Appraisers
    or Mimic-type cards, creating repeated discover loops

  Format note: Geological Appraiser was banned in Standard 2024 due to combo potential
  with specific configurations enabling forced loops/whiffing to desired cards.

QUINTORIUS KAND + DISCOVER:
  Quintorius Kand: "Whenever you cast a spell from exile, Quintorius Kand deals 2 damage
   to each opponent and you gain 2 life."
  → Discover free cast is casting FROM EXILE → triggers Quintorius
  → Each Discover hit that results in a cast = 2 damage to each opponent + 2 life
  → With Chimil, the Inner Sun (discover 5 every end step), each successful cast
    via Chimil's discover triggers Quintorius once
  → Quintorius's own −3 loyalty ability: "Discover 4" — the card found and cast from
    that Discover also triggers Quintorius's own first ability

CHIMIL, THE INNER SUN combo notes:
  → "Spells you control can't be countered" — applies only while on battlefield
  → Chimil itself CAN be countered before it resolves (it's a spell on the stack,
    not yet a permanent — the static ability doesn't apply while it's on the stack)
  → The counterspell just needs to resolve before Chimil does
  → Once Chimil is on the battlefield, your subsequent spells can't be countered
  → The discover 5 trigger happens each end step — if you pass priority to opponent's
    end step, no discover (Chimil's trigger only says "your end step")
```

## Definitive Conclusions

**Cast Triggers:**
- Discover's free cast fires every "cast" trigger — prowess, storm, magecraft, "cast from exile" payoffs. This is categorically different from effects that say "put onto the battlefield" or "create." Quintorius Kand in particular turns every successful Discover hit into incidental burn-and-lifegain.
- Storm counts the discover cast in the storm count for subsequent storm spells that turn, but the discover cast itself only counts cards cast BEFORE it (storm reads the number of spells cast before the storm spell).

**Timing Bypass:**
- The ability to cast a sorcery at instant speed via Discover is real but narrow: the cast happens during the Discover trigger's resolution window. In practice this means Discover found during an opponent's end step can cast a sorcery into their upkeep — sometimes relevant for combat tricks or sweepers.
- The restriction "can't cast sorceries unless it's your main phase and the stack is empty" is a default timing rule. Effects that instruct you to cast a card as part of their resolution (cascade, Discover, Bonecrusher Giant's Adventure) override this default.

**Grafdigger's Cage:**
- Cage does NOT interact with Discover's free cast. The card is in exile when the cast happens, and Cage only blocks casting from library or graveyard. This was a point of confusion at early LCI tournaments.
- Cage DOES block effects that cast from the library directly (unusual) and all flashback/escape/etc. from GY.

**Split Cards, Adventures, MDFCs via Discover:**
- The combined MV rule for split cards means Discover 4 cannot hit most split cards (e.g., a {1}{W} // {3}{U} split card has MV = 1+3 = 4 total, but the split card's MV is 4, which is NOT ≤ 4... wait, MV ≤ 4 means 4 qualifies). Actually ≤ N includes equal — a split card with total MV = 4 IS found by Discover 4.
- Adventure cards: MV is the creature face's mana cost (the full card cost), not the adventure cost. So a creature with MV 4 on the main face is found by Discover 4, and you can then cast either the creature or the adventure (if the adventure's MV ≤ 4 as well).

## Canonical Examples

**Quintorius Kand + Chimil:**
- Chimil triggers at end step → Discover 5 → find a nonland with MV ≤ 5 → cast it from exile → Quintorius triggers: 2 damage to each opponent, gain 2 life. Each end step, Chimil + Quintorius generates damage.

**Prowess + Discover:**
- You have a creature with prowess on the battlefield. An effect says "Discover 4." You find a sorcery (MV 3) and cast it. Prowess triggers — the sorcery cast from Discover is a genuine cast of a noncreature spell.

**Geological Appraiser "if you cast it" distinction:**
- You put Geological Appraiser onto the battlefield with Collected Company (PutOTB without casting). The ETB trigger has "if you cast it" — the condition fails. Discover 3 does NOT trigger. You get a 4/3 with no bonus. This is the safety valve: Appraiser only discovers when it was actually cast.

**Mandatory additional cost:**
- Discover 4 finds a card with "as an additional cost to cast this spell, discard a card." You want to cast it for free via Discover. You MUST discard a card (the mandatory additional cost) or choose not to cast it and put it in your hand instead.

**Cascade + Discover interaction:**
- You cast a cascade spell. Cascade finds a card with "When this creature enters, discover 3." Cascade casts that card. The creature resolves, enters the battlefield, and its Discover 3 trigger fires — this is a SEPARATE trigger, not cascade chaining. Priority is passed, Discover 3 trigger resolves independently.

## Commonly Confused With

- **P034** (Cascade) — Cascade is mechanically similar but structurally different: cascade is a keyword on the spell; Discover is a keyword action triggered by other effects; cascade doesn't offer the hand option; both do real casts; see this pattern for detailed comparison table
- **P459** (Discover/Mill/Collect Evidence basics) — P459 covers core Discover mechanics including split cards and X costs; this pattern covers cast-trigger firing, timing bypass, Quintorius-type payoffs, and the Appraiser combo case
- **P015** (Mana Ability Identification) — Not directly related, but free casts via Discover still require paying any additional costs (non-mana ones like sacrifice), so understanding cost components matters
- **P036** (Storm Count) — Discover's free cast counts toward storm; players sometimes assume "free" cast means "not counted" but it's a real cast
