---
id: p459
name: Discover, Mill, and Collect Evidence — Library-Exile Free Cast, Library-to-GY, and GY-Exile-as-Cost Keyword Actions
category: zones
cr_refs: [701.57, 701.17, 701.59, 604.1, 400.7, 714.2]
tags: discover, mill, collect-evidence, keyword-action, library, graveyard, free-cast, exile-cost, lost-caverns-ixalan, murders-karlov-manor, grafdiggers-cage
created: 2026-03-29
examples_count: 7
---

# P459 — Discover, Mill, and Collect Evidence — Library-Exile Free Cast, Library-to-GY, and GY-Exile-as-Cost Keyword Actions

## Abstract

Three keyword actions (CR 701.x) involve library and graveyard manipulation: **Discover N** (Lost Caverns of Ixalan, CR 701.57) exiles cards from the top of the library until hitting a nonland with mana value ≤ N, then offers a free cast or a put-into-hand choice; **Mill N** (CR 701.17) puts the top N cards of a library into the graveyard — a formally defined keyword action since Core Set 2021; and **Collect Evidence N** (Murders at Karlov Manor, CR 701.59) exiles cards from your graveyard with total mana value ≥ N as an additional cost for enhanced spell effects. All three create non-obvious interactions with graveyard hate, counterspells, and cascade-like rules.

## The Definitive Rules

### Discover (CR 701.57)
**CR 701.57a verbatim:** *"'Discover N' means 'Exile cards from the top of your library until you exile a nonland card with mana value N or less. You may cast that card without paying its mana cost if the resulting spell's mana value is less than or equal to N. If you don't cast it, put that card into your hand. Put the remaining exiled cards on the bottom of your library in a random order.'"*

**CR 701.57b**: A player has discovered after the process is complete, even if some or all actions were impossible.

**Key difference from Cascade (702.85):** Cascade requires casting a nonland card with lesser mana value (you must exile until you find one cheaper); Discover allows casting OR putting in hand if you don't want to cast it.

### Mill (CR 701.17)
**CR 701.17a verbatim:** *"For a player to mill a number of cards, that player puts that many cards from the top of their library into their graveyard."*

**CR 701.17b verbatim:** *"A player can't mill a number of cards greater than the number of cards in their library. If given the choice to do so, they can't choose to take that action. If instructed to do so, they mill as many as possible."*

**CR 701.17c**: An effect that refers to a milled card can find that card in the zone it moved to from the library (e.g., if a replacement effect puts cards elsewhere, the "milled card" is where it ended up).

### Collect Evidence (CR 701.59)
**CR 701.59a verbatim:** *"To 'collect evidence N' means to exile any number of cards from your graveyard with total mana value N or greater."*

**CR 701.59b**: If you can't exile cards with total MV ≥ N, you can't choose to collect evidence.

**CR 701.59c**: A spell with "collect evidence as an additional cost" and an ability that "refers to whether evidence was collected" are linked (CR 607).

## The Pattern

```
DISCOVER pattern:
1. Exile cards one at a time from library top
   → Stop when exiling a nonland card with MV ≤ N
   → If library exhausted first: discover is complete, no card to cast or put in hand
2. May cast the discovered card without paying its mana cost
   → The cast is still a CAST (not a copy) — triggers "when you cast" abilities
   → The cast is subject to timing restrictions (sorcery speed = must be your main phase + stack empty,
     unless it's an instant or the discover is during your main phase)
   → Actually: cards cast via "without paying their mana cost" can be cast any time the
     discover trigger resolves, regardless of the card's normal timing restrictions
   → X spells cast this way: X = 0
   → Grafdigger's Cage: prevents casting cards from exile — Discover's free cast would be blocked
     by Cage, but you can still put the card in hand
3. If not casting: put the discovered card into your hand
4. Put remaining exiled cards on bottom in random order

MILL pattern:
Mill N:
  → Move top N cards from library to GY simultaneously
  → If library has fewer than N cards: mill all remaining cards, then nothing happens
    (no "draw from empty library" loss — that SBA only happens when instructed to draw)
  → Replacement effects: Leyline of the Void exiles cards that would go to any GY
    → Milled cards under Leyline go to exile instead of GY
    → "An effect referring to the milled card" finds it in exile (CR 701.17c)
  → Raking Claws / Rest in Peace: same as Leyline
  → Graveyard shuffling effects: if GY is shuffled into library mid-mill, remaining mills
    come from the newly reshuffled library

COLLECT EVIDENCE pattern:
1. Check: Can I exile cards from my GY with total MV ≥ N?
   → If not: can't choose to collect evidence (can't pay the cost)
2. Choose cards to exile from GY totaling MV ≥ N
   → You can exile MORE than exactly N (overpay is fine)
   → You must exile at least enough to meet N
   → Exiled cards are removed from GY for all other purposes
3. Spell resolves with the "collected evidence" bonus if evidence was collected
```

## Definitive Conclusions

**Discover:**
- Discover is like cascade but gives you a choice: cast it OR put it in hand. Cascade forces a cast (if you hit a castable card, you must cast it — actually re-checking: cascade says "you may cast it" — so cascade is also optional). The key difference: discover lets you keep the card in hand if you prefer; cascade puts non-cast cards on the bottom with other revealed cards.
- Discover can find zero-MV cards (a {0} cost card qualifies for Discover N at any N ≥ 0).
- The cards exiled and not cast/kept go to the bottom of the library in random order (not the top, not to hand).
- Grafdigger's Cage prevents casting from exile — if Cage is in play, Discover can still find a card but you MUST put it in hand (can't cast from exile). This is actually better for some strategies.
- You can cast a card found by Discover at instant speed during the resolution of the Discover trigger — timing restrictions are bypassed (you're casting via "without paying its mana cost" as part of the trigger resolution).

**Mill:**
- Mill is not drawing. A player who is instructed to "mill 3" and has only 1 card mills that 1 card — they don't lose from the SBA that applies when drawing from an empty library (that SBA applies specifically when a player *draws* from an empty library, per CR 704.5b).
- If you mill yourself into a Library Out situation (empty library), you don't lose immediately from milling — you only lose when you TRY TO DRAW from an empty library.
- Surgical Extraction targeting a card in an opponent's GY after milling can exile all copies of that card from their deck plus GY, effectively removing it from the game.
- Dredge and mill interact: some mill effects are also "self-mill" where you want the cards in your GY; Dredge then replaces draws with further GY building.

**Collect Evidence:**
- The cards exiled for Collect Evidence are gone from the GY permanently — you can't use them for other GY-based effects later.
- Collect Evidence with exact threshold is flexible: if the requirement is Collect Evidence 4, you can exile a 2-MV card and a 3-MV card (total 5) — the overage is fine.
- If your opponent exiles your GY in response to your spell (Rest in Peace, Leyline activated), you can't collect evidence and the spell's enhanced mode is unavailable — but the spell itself still resolves with its base effect (if the collect-evidence was an additional cost, the cost was paid; if it was an optional effect in the text, it was simply not triggered).
- Wait — if collect evidence is an additional cost, it must be paid when casting. If your GY is exiled in response, the cost was already paid (you already exiled the cards). The spell's linked ability checks "if evidence was collected" — it was.

## Canonical Examples

**Discover:**
- *Trumpeting Carnosaur* (Lost Caverns of Ixalan): "When this creature enters, discover 5." You trigger discover, exile until you find a nonland with MV ≤ 5. (Note: *Wildfire Awakener* does NOT have Discover — it is a Convoke creature that creates Elemental tokens.)
- *Geological Appraiser* (Lost Caverns): "When this creature enters, if you cast it, discover 3." Only triggers when cast, not when put onto the battlefield by other means.
- Discover interacting with Cascade: both search libraries for free-cast, but Discover doesn't chain (you discover once from the trigger, not from the cast of the discovered card — unless the discovered card also has Discover).

**Mill:**
- *Hedron Crab* (Zendikar): "Landfall — Whenever a land enters the battlefield under your control, each opponent mills three cards." Each landfall trigger mills 3 cards per opponent. A deck with 40 fetch lands mills opponents for 6 per fetch (landfall twice: fetch entering, fetched land entering).
- *Traumatize*: "Target player mills half their library, rounded down." A player with 30 cards mills 15.

**Collect Evidence:**
- *Evidence Examiner* (Murders at Karlov Manor): "At the beginning of combat on your turn, you may collect evidence 4. Whenever you collect evidence, investigate." Each time you collect evidence, you also create a Clue token. (Note: *Deduce* does NOT have Collect Evidence — it draws a card and Investigates. *Demand Answers* also does NOT have Collect Evidence — it requires sacrificing an artifact or discarding, then draws two cards.)
- *Behind the Mask* (Murders at Karlov Manor): "As an additional cost to cast this spell, you may collect evidence 6. Until end of turn, target artifact or creature becomes an artifact creature with base power and toughness 4/3."

## Commonly Confused With

- **P034** (Cascade) — Cascade is similar to Discover but forces a cast; Discover offers hand-put as alternative; Cascade chains (if the cast card has Cascade); Discover doesn't chain
- **P051** (Dredge) — Dredge replaces a draw with self-mill; standalone mill is different
- **P282** (Escape/Delve — GY exile as cost) — Collect Evidence is similar: exile GY for enhanced effect; Delve and Escape exile for reduced cost rather than conditional bonuses
- **P031** (Win/Lose from empty library) — milling yourself to empty library doesn't cause immediate loss; only drawing from empty library causes loss
