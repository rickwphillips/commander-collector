---
id: p477
name: Plot, Spree, and Offspring — Exile-for-Free-Later-Cast, Choose-Multiple-Modes, and Pay-More-for-Token-Copy
category: costs
cr_refs: [702.188, 702.190, 702.191, 601.2b, 601.2f, 706.10, 400.7, 300.4]
tags: plot, spree, offspring, formal-keyword, exile-and-cast-later, modal-additional-cost, token-copy, outlaws-thunder-junction, bloomburrow
created: 2026-03-29
examples_count: 7
---

# P477 — Plot, Spree, and Offspring — Exile-for-Free-Later-Cast, Choose-Multiple-Modes, and Pay-More-for-Token-Copy

## Abstract

Three formal keywords from Outlaws of Thunder Junction (2024) and Bloomburrow (2024) with non-obvious interactions: **Plot** (CR 702.188) allows you to pay a reduced cost to exile a card face-up, then cast it for free on a future turn at sorcery speed; **Spree** (CR 702.190) is a multi-mode additional cost mechanic where you must pay at least one mode's additional cost; and **Offspring** (CR 702.191) allows you to pay an extra {2} when casting a creature to also create a 1/1 token copy of it. All three interact with Cascade, copy effects, and alternative casting rules in non-obvious ways.

> **Updated 20260329:** Corrected error: Grafdigger's Cage does NOT stop Plot's free cast. Cage restricts casting from graveyards and libraries only; Plot casts from exile. Oracle text confirmed: "Players can't cast spells from graveyards or libraries." Exile is not included.

## The Definitive Rules

### Plot (CR 702.188)
**CR 702.188a verbatim:** *"Plot [cost] means 'You may pay [cost] and exile this card from your hand face up. It becomes plotted. Play this ability only as a sorcery.'"*

**CR 702.188b:** A plotted card may be cast from exile for free, at sorcery speed, on a future turn.

Key: Plotting is not casting. The card is exiled face-up with a "plotted" designation. On any future turn, you may cast it without paying its mana cost (sorcery speed). Unlike suspend (which has a built-in timer), a plotted card waits indefinitely.

### Spree (CR 702.190)
**CR 702.190a verbatim:** *"Spree means 'As an additional cost to cast this spell, choose one or more of the following modes that have not already been chosen:'"*

Each Spree mode has its own additional cost. You MUST choose at least one mode (choosing zero is not allowed). Each chosen mode adds its cost to the spell's total cost AND applies its effect when the spell resolves. You choose at cast time.

### Offspring (CR 702.191)
**CR 702.191a verbatim:** *"Offspring [cost] means 'You may pay an additional [cost] as you cast this spell. When this permanent enters the battlefield, if its offspring cost was paid, create a 1/1 token that's a copy of this permanent, except it has base power 1 and base toughness 1.'"*

Offspring is an optional additional cost. If paid, when the creature ETBs, a triggered ability creates a 1/1 token copy of it (same name, abilities, creature types — but P/T is 1/1).

## The Pattern

```
PLOT pattern:
Two actions:
  Action 1 (plotting): Pay the plot cost → exile the card face-up (as a sorcery)
    → This is a special action (not casting the spell)
    → The card leaves your hand and enters exile face-up with the "plotted" designation
    → You are NOT casting the card; no "whenever you cast" triggers
    → The card remains in exile indefinitely (no timer unlike Suspend)
  Action 2 (free cast): On any future turn during your main phase (sorcery speed):
    → Cast the plotted card without paying its mana cost
    → This IS casting: "whenever you cast" effects trigger
    → Sorcery speed only (main phase, stack must be empty)
    → The card is exiled from exile as the cast happens
  Key interactions:
    → Grafdigger's Cage: Oracle text says "Players can't cast spells from graveyards or libraries"
      — Cage does NOT stop Plot's free cast. Plotted cards are cast from EXILE, which Cage
      does not restrict. (Scryfall ruling 2019-07-12: "If an effect exiles a card from a library
      and allows a player to cast it, that player may do so. The spell is cast from exile, not a library.")
      Cage is NOT a hard counter to Plot strategies.
    → MV: the card's MV is its printed mana cost (not the plot cost)
      → Cascade checks MV: a 5-MV card can't be found by Cascade looking for MV < 5
        even though its plot cost was only {1}
    → Plot cost MV: the plot cost (reduced cost) doesn't affect the card's MV
    → "Without paying its mana cost" cast: X spells cast this way have X = 0

SPREE pattern:
Additional costs at cast time:
  → Must choose AT LEAST ONE mode (can't choose zero)
  → Can choose multiple modes (pay each chosen mode's additional cost)
  → All chosen modes' effects happen when the spell resolves
  → Mode choices are locked at cast time
  → Copy of a Spree spell: the copy has the same chosen modes as the original
    → Copy has no additional costs to pay (copies don't pay costs)
    → Copy's effects: all the original's chosen modes apply
  → Stifle countering a Spree spell: the spell is countered but each mode's cost was
    already paid as part of casting
  → Cost reduction: reduces the TOTAL cost (base + chosen mode costs), not individually
  → The Spree modes are "additional costs" per CR 601.2b — paid when casting

OFFSPRING pattern:
Optional additional cost at cast time: Pay extra {2} (or printed cost)
  → If paid: an ETB triggered ability fires when the creature enters the battlefield:
    "Create a 1/1 token that's a copy of this permanent, except base P/T 1/1"
  → The token is a COPY: same name, creature types, abilities, colors, etc.
    → BUT base P/T is 1/1 (overriding the original's P/T via layer 7b)
  → Copy of offspring permanent entering: both the original AND the token ETB
    → The original triggers its own ETB abilities (if any)
    → The token enters the battlefield from the create-token effect → triggers ETBs of the token
  → The token is NOT the offspring creature itself casting — it's token creation via triggered ability
    → No "cast" triggers for the token
    → ETB triggers of the token DO fire
  → Offspring token with "when this creature enters, do X": the token triggers X when IT enters
    (the token is a copy of the original and has the ETB ability → triggers on the token's entry)
  → The offspring token can itself create offspring if it has the Offspring keyword AND
    the additional cost was paid again... wait: the token is on the BATTLEFIELD, not being cast.
    Offspring requires paying additional cost when CASTING — tokens aren't cast.
    → Offspring tokens do NOT trigger more offspring (the ETB trigger requires "offspring cost was paid")
```

## Definitive Conclusions

**Plot:**
- Plot is a tempo play: pay a smaller cost now to set up a free cast later. You "bank" a spell for a future turn where you need additional spells but don't have the mana to pay full cost.
- In storm strategies: plot several spells, then on a future turn cast them all "for free" — each free cast still counts toward storm count and triggers "whenever you cast" effects.
- **Grafdigger's Cage does NOT stop Plot.** Cage says "Players can't cast spells from graveyards or libraries" — plot casts from EXILE. Exile is neither. Cage is irrelevant to Plot strategies. The hard counter to Plot is effects that exile or remove the plotted card from exile (e.g., Tormod's Crypt won't help since it hits graveyards; you'd need exile-from-exile effects).
- Plot and Cascade: a card being cast for free from exile via Plot was plotted earlier; if a Cascade finds a plotted card... Cascade searches the LIBRARY, not exile. Cascade won't find plotted cards. Unrelated.
- Key card: *Crackling Finale* (OTJ): Can be plotted. Set it up one turn, fire it for free next turn when opponent is tapped out.

**Spree:**
- Spree spells are maximally flexible: choose the modes you can afford and want. Each additional mode costs more but does more.
- The minimum requirement (at least one mode) is the key rules catch: unlike normal modal spells where you can choose zero optional effects, Spree requires at least one selection.
- Spree + cost reduction: total cost is reduced. If base cost + 2 chosen mode costs = {5}{R}{R} and you have a cost reducer for {2}, you pay {3}{R}{R} total — all chosen modes' effects still happen.
- Key card: *Slick Sequence* (OTJ): "Spree. +{1}{U}: Scry 2. +{1}{U}: Draw a card. +{1}{U}: Return target permanent to its owner's hand." Pay all three modes for {U} base + {3}{U}{U}{U} additional = full draw, scry, and bounce for heavy mana.

**Offspring:**
- Offspring is a powerful ETB-ability doubler: creatures with potent ETBs (like "when this enters, draw 3 cards") create a 1/1 copy that also triggers "when this enters, draw 3 cards" — net: draw 6 cards for {2} extra.
- The offspring token's abilities are fully functional: it has all the original's abilities. If the original has "At the beginning of your upkeep, gain 3 life," the offspring token also generates 3 life per upkeep.
- Key card: *Valley Floodcaller* (BLB): Creature with Offspring. Original: 4/4 with an ability. Token: 1/1 copy with the same ability. Paying the offspring cost doubles your creatures and doubles ETB triggers.

## Canonical Examples

**Plot:**
- Cast *Crackling Finale* plot cost on turn 2 → it sits in exile. Turn 4 (tapped out opponent): cast it for free from exile → full effect with no mana investment this turn.

**Spree:**
- *Slick Sequence*: Only afford 1 mode → choose just the bounce. 2 modes → bounce + draw. All 3 modes → full package.

**Offspring:**
- Creature with ETB "draw 2 cards" + Offspring paid: original enters, draw 2. Token enters, draw 2. Total: 4 cards drawn for {2} extra mana.

## Commonly Confused With

- **P438** (Jump-Start/Escape/Foretell) — Foretell also exiles a card face-down for a reduced cost; Plot exiles face-up and casts for free (no cost to cast later); Foretell's cast has a reduced but nonzero cost
- **P099** (Modal Spells — Choose Modes) — Normal modal spells choose one mode from several; Spree requires at least one and allows multiple, each with its own additional cost
- **P409** (Copy Effects) — Offspring creates a token copy via ETB trigger; copy spells create spell copies on the stack; both result in "copies" but different mechanisms and zones
- **P445** (Companion) — Companion and Plot both have pre-game or outside-game elements? No — Companion is outside the game; Plot exiles from hand during the game. Not comparable.
