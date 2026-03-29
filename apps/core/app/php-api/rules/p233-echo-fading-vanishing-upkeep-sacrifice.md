---
id: p233
name: Echo, Fading, and Vanishing — Pay Again or Sacrifice
category: triggered
cr_refs: [702.30a, 702.32a, 702.63a]
tags: [echo, fading, vanishing, upkeep, sacrifice, time-counter, fade-counter, Urza, Nemesis, Onslaught, Temporal-Adept, Parallax-Wave]
created: 2026-03-28
examples_count: 2
---

# P233 — Echo, Fading, and Vanishing — Pay Again or Sacrifice

## Abstract
Three related "temporary permanents" mechanics with upkeep-based sacrifice conditions. **Echo**: when a permanent first comes under your control, you must pay its echo cost at your next upkeep or sacrifice it — a "rent" for keeping the permanent. **Fading N**: enters with N fade counters; one is removed each upkeep; when none remain, sacrifice it — a built-in clock. **Vanishing N**: similar to Fading but uses time counters and is sacrificed when the last time counter is removed. All three create permanents with a limited lifespan unless resources are committed.

## The Definitive Rules

**CR 702.30a** (verbatim): *"Echo is a triggered ability. 'Echo [cost]' means 'At the beginning of your upkeep, if this permanent came under your control since the beginning of your last upkeep, sacrifice it unless you pay [cost].'"*

**CR 702.30b** (verbatim): *"Urza block cards with the echo ability were printed without an echo cost. These cards have been given errata in the Oracle card reference; each one now has an echo cost equal to its mana cost."*

**CR 702.32a** (verbatim): *"Fading is a keyword that represents two abilities. 'Fading N' means 'This permanent enters with N fade counters on it' and 'At the beginning of your upkeep, remove a fade counter from this permanent. If you can't, sacrifice the permanent.'"*

**CR 702.63a** (verbatim): *"Vanishing is a keyword that represents three abilities. 'Vanishing N' means 'This permanent enters with N time counters on it,' 'At the beginning of your upkeep, if this permanent has a time counter on it, remove a time counter from it,' and 'When the last time counter is removed from this permanent, sacrifice it.'"*

## The Pattern

```
ECHO:
  Triggered: at beginning of YOUR upkeep
  Condition: if this permanent came under your control since the beginning of your LAST upkeep
  Choice: pay echo cost OR sacrifice
  Echo cost: usually equal to the permanent's mana cost (original Urza block had no stated cost — now errata)
  TIMING: triggers only on the FIRST upkeep after gaining control
  If you already controlled it before your last upkeep: echo doesn't trigger (you already paid or it's been around)

ECHO + CONTROL CHANGE:
  If you gain control of an echo permanent mid-game: it triggers echo at YOUR next upkeep
  Even if the original controller already paid echo: your control means YOU must pay next upkeep
  Relinquishing control and regaining it: triggers echo again when you regain control
  Gaining control DURING your upkeep: triggers at the FOLLOWING upkeep (not same one)

ECHO + SACRIFICE OUTLET:
  Since echo is a triggered upkeep ability, it goes on the stack
  You can sacrifice the permanent in response to the trigger (before having to pay)
  But: you get no benefit from the permanent this way (it was going to sacrifice anyway)
  Better: sacrifice for another effect BEFORE the trigger resolves

ECHO + PAYING:
  Echo cost follows normal payment rules (601.2)
  Can pay with any combination of mana abilities
  If you can't pay: must sacrifice
  If you CAN pay but CHOOSE not to: must sacrifice (the "unless you pay" clause)

ECHO CARDS (Urza's Legacy / Saga):
  Palinchron ({5}{U}{U}): 7/8 flying, "untap up to 7 lands when enters or untaps"
  Echo cost (errata): {5}{U}{U} — so on second turn you pay again to keep it
  Temporal Adept ({1}{U}{U}): "Put target permanent on top of its owner's library" (paid ability)
  Echo = {1}{U}{U}: pay 3 mana each upkeep to keep the Adept
  Peregrine Drake ({4}{U}): echo = {4}{U}; "when enters, untap up to 5 lands"
  These were powerful ETB effects for their era — the "rent" balanced them

FADING:
  ETB: enters with N fade counters
  Triggered: at beginning of YOUR upkeep, remove ONE fade counter
  When you can't remove (0 counters remain): sacrifice
  Lifespan: N upkeeps before sacrificed
  Fading 1: last one upkeep (already 0 counters when your NEXT upkeep arrives → sacrifice immediately? No: it enters with 1, first upkeep removes it, then you can't remove → sacrifice)
  Fading 3: survives for 3 upkeeps, then sacrificed on the 4th

FADING + PROLIFERATE:
  Proliferate adds a fade counter if you choose the permanent: extends its life!
  Doubling Season or other counter-doublers affect ETB counter placement: enters with 2N counters
  This can extend fading permanents significantly

FADING CARDS (Nemesis):
  Parallax Wave ({3}{W}): enchantment Fading 5 — "Remove a fade counter from Parallax Wave: Exile target creature. Return that card to the battlefield under its owner's control when Parallax Wave leaves the battlefield."
  5 uses to exile creatures, then when the Wave leaves → all return
  Famous interaction: Flicker Parallax Wave to remove it from battlefield → all exiled creatures return, then you can exile them again with a fresh Parallax Wave

VANISHING:
  Identical to Fading but uses TIME COUNTERS instead of fade counters
  Enters with N time counters
  At upkeep: remove one time counter
  When last removed: sacrifice
  Key difference from Fading: the trigger for sacrifice fires WHEN the last counter is removed
  Not at the upkeep when you find 0 — instead, the removal trigger fires sacrifice

VANISHING + PROLIFERATE:
  Proliferate adds time counters (extending vanishing permanents)
  Suspend also uses time counters — Vanishing permanents use the same counter type
  If a Vanishing permanent also has Suspend: time counters matter for both (rare edge case)

VANISHING + COUNTER REMOVAL:
  An opponent can remove time counters from YOUR vanishing permanents (with effects like "remove a counter")
  This can accelerate sacrifice of your permanents
  Normally can't be done by opponents (no common ways), but noteworthy

ECHO vs FADING vs VANISHING:
  Echo: pay again or sacrifice (choice-based, triggers once or when control changes)
  Fading: fixed number of uses before sacrifice (counter-removal each upkeep)
  Vanishing: functionally same as Fading but uses time counters (and sacrifice triggers from counter removal)
```

## Definitive Conclusions

- **Echo** triggers once (first upkeep after gaining control) and offers "pay or sacrifice."
- **Fading/Vanishing** have a fixed lifespan — N counters = N upkeeps.
- **Proliferate** extends both Fading and Vanishing permanents.
- **Gaining control of an echo permanent** re-triggers echo at YOUR next upkeep.
- **Fading sacrifices at upkeep** (when 0 counters); Vanishing sacrifices when the last counter is removed (slightly different timing).

## Canonical Example
**Parallax Wave (Fading 5) in Combo:**
Parallax Wave ({3}{W}) Enchantment — Fading 5.
Enters with 5 fade counters. Each activation: remove a fade counter, exile a creature.
Over 5 uses: exile 5 opposing creatures.
When Parallax Wave leaves the battlefield: all exiled creatures return under their owner's control.
Classic exploitation: use a second Parallax Wave to flicker the first one.
Flickering (exile + return) the Wave makes it leave the battlefield → all creatures return → fresh Wave with 5 new counters.
Infinite: keep flickering the Waves to exile + return opponents' creatures (or use for ETB abuse with your own creatures).

**Example 2 — Echo Timing (Palinchron):**
Cast Palinchron ({5}{U}{U}, Echo {5}{U}{U}) on Turn 6.
Palinchron ETB: untap up to 7 lands (likely floating mana or comboing with Phantasmal Image).
Turn 7 upkeep: echo triggers — "pay {5}{U}{U} or sacrifice Palinchron."
With 7 untapped lands from the Echo: pay {5}{U}{U} — keep the 7/8 flier.
If you can't pay 7 mana: sacrifice.
Palinchron + High Tide: generate massive mana from the ETB, pay echo, repeat. Classic combo.

## Commonly Confused With
- **P205 (Saga)** — Sagas sacrifice after final chapter, also based on cumulative counters (lore counters). Different: Sagas are enchantments with chapter triggers, not permanent "rent" mechanics.
- **P256 (Suspend)** — Suspend also uses time counters on exiled cards but removes them to cast for free; Vanishing removes them to sacrifice.
- **P209 (Energy)** — Energy counters also persist but are spent proactively; Fading/Vanishing counters are removed automatically on a schedule.
