---
id: p124
name: Cleave, Training, and Compleated — New Capenna and Phyrexia Keywords
category: costs
cr_refs: [702.148a, 702.149a, 702.149b, 702.149c, 702.150a]
tags: [cleave, training, compleated, text-change, alternative-cost, +1/+1, planeswalker, phyrexian-mana, loyalty]
created: 2026-03-28
examples_count: 3
---

# P124 — Cleave, Training, and Compleated

## Abstract
Three modern keyword mechanics covering different design spaces. **Cleave** is an alternative cost that removes bracketed text from a spell, changing its effect (usually from targeted to sweeper). **Training** is a triggered attack ability that adds a +1/+1 counter when attacking alongside a creature with greater power. **Compleated** is a planeswalker entry ability that reduces loyalty counters if you paid Phyrexian mana for the cost.

## The Definitive Rules

**CR 702.148a** (verbatim): *"'Cleave [cost]' means 'You may cast this spell by paying [cost] rather than paying its mana cost' and 'If this spell's cleave cost was paid, change its text by removing all text found within square brackets in the spell's rules text.'"*

**CR 702.149a** (verbatim): *"Training means 'Whenever this creature and at least one other creature with power greater than this creature's power attack, put a +1/+1 counter on this creature.'"*

**CR 702.150a** (verbatim): *"Compleated means 'If this permanent would enter with one or more loyalty counters on it and the player who cast it chose to pay life for any part of its cost represented by Phyrexian mana symbols, it instead enters the battlefield with that many loyalty counters minus two for each of those mana symbols.'"*

## The Pattern

```
CLEAVE:
  Two abilities in one:
    1. Alternative cost: pay cleave cost instead of mana cost
    2. Text change: remove all text within [square brackets]
  The brackets indicate optional/restrictive parts of the text
  Example: "Destroy [up to one other] creature" with cleave:
    Cleave removes "[up to one other]" → "Destroy creature" (any, not restricted)
  Cleave changes the TEXT, not just the effect — it's a CR 612 text-change effect
  Copies of a cleaved spell: have the cleaved (modified) text

  Casting WITHOUT cleave cost: brackets stay → normal restricted version
  Casting WITH cleave cost: brackets removed → more powerful version

TRAINING:
  Triggered attack ability
  Condition: "this creature AND at least one other creature with power greater than this creature's power attack"
  → Two conditions: this creature attacks, AND another attacker has MORE power
  → Checking power at the time of the trigger (when declared attacking)
  Effect: put a +1/+1 counter on the training creature

  Training grows the trained creature's power → eventually it won't trigger on the same allies
  (Once trained up, its power may exceed what was previously greater)

  Training scales the trained creature toward the largest creature in your attack force

COMPLEATED:
  On some planeswalkers with Phyrexian mana symbols in their cost
  If you chose to pay LIFE (2 life per {P} symbol) instead of colored mana:
    The planeswalker enters with 2 fewer loyalty counters per Phyrexian mana paid with life
  If you paid colored mana for ALL the Phyrexian symbols: no loyalty reduction
  Binary per symbol: each {P} paid with life → 2 fewer loyalty

  Example: Planeswalker enters with 5 loyalty normally.
    Paid 1 life for one {P} symbol: enters with 3 loyalty (5 - 2).
    Paid life for 2 {P} symbols: enters with 1 loyalty (5 - 4).
    Paid mana for all {P}: enters with 5 loyalty.

  Doubling Season: doubles loyalty counters as they enter (from 614.12 replacement)
    But compleated REDUCES the "would enter with" count → fewer to double
    Interaction: compleated reduction happens first, then doubling

TRAINING TRIGGER TIMING:
  Triggers when THIS creature and another greater-power creature attack
  "Greater than this creature's power" = checked at the time of the attack declaration
  Pump effects BEFORE the training trigger resolves can affect whether condition is still met
    (Intervening-if clause would check again at resolution)
  Actually: training doesn't use an intervening-if, so it triggers and resolves regardless
```

## Definitive Conclusions

- **Cleave removes bracketed text by paying an alternative cost** — makes spells more powerful (usually sweepers from targeted spells).
- **Training triggers when you attack with this creature + any attacker with higher power.** Puts a counter on the training creature.
- **Compleated: 2 fewer entry loyalty per Phyrexian mana paid with life.** Faster entry with life payment comes at loyalty cost.

## Canonical Example P124a — Cleave:
**Dig Up the Body (Cleave {2}{B}{B}):**
Normal cast: "Return [up to one] creature from graveyard to hand."
Cleave cast: removes "[up to one]" → "Return creature from graveyard to hand." (Must return exactly one, not limited to "up to one" — the bracket change alters the effect.)

**Example P124b — Training:**
Traveling Minister (Training 1/1) attacks alongside 3/3.
3/3 has greater power than 1/1 → training triggers → 1/1 gets +1/+1 counter → becomes 2/2.
Next attack: 2/2 training creature attacks alongside the same 3/3.
3/3 still has greater power than 2/2 → triggers again → becomes 3/3.
Next attack alongside 3/3: 3/3 = 3/3 (not GREATER THAN) → doesn't trigger.

**Example P124c — Compleated:**
Sheoldred, the Apocalypse (Compleated). Cost has {B/P}{B/P}.
Pay {B}{B}: enters with 5 loyalty (full loyalty, no reduction).
Pay 2 life for one {P}: enters with 3 loyalty.
Pay 4 life for both {P}: enters with 1 loyalty.

## Commonly Confused With
- **P050 (Overload)** — Overload also changes targeting text to "each" (non-targeted). Cleave removes bracketed restrictive text. Different mechanisms, similar effect (broader spell).
- **P076 (Mentor)** — Mentor also gives a counter when attacking with higher-power creature. Training gives a counter to the TRAINING creature; mentor gives a counter to the other (smaller-power) creature.
- **P025 (Counter Placement — Cost vs Effect)** — Compleated reduces loyalty counters "would enter with" — this interacts with Doubling Season (which doubles "would enter with" counters).
