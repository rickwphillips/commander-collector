---
id: p101
name: Replicate — Copies Per Payment
category: stack
cr_refs: [702.56a, 702.56b]
tags: [replicate, additional-cost, copy, triggered, storm-comparison, new-targets, per-payment]
created: 2026-03-28
examples_count: 2
---

# P101 — Replicate — Copies Per Payment

## Abstract
Replicate is similar to casualty but scales with repeated payments. You pay the replicate cost any number of times as an additional cost to cast the spell. A triggered ability then creates copies equal to the number of times replicate was paid. Each copy can have new targets chosen independently. Unlike storm (which counts all spells this turn), replicate only counts payments made when casting this specific spell.

## The Definitive Rule

**CR 702.56a** (verbatim): *"Replicate is a keyword that represents two abilities. The first is a static ability that functions while the spell with replicate is on the stack. The second is a triggered ability that functions while the spell with replicate is on the stack. 'Replicate [cost]' means 'As an additional cost to cast this spell, you may pay [cost] any number of times' and 'When you cast this spell, if a replicate cost was paid for it, copy it for each time its replicate cost was paid. If the spell has any targets, you may choose new targets for any of the copies.'"*

## The Pattern

```
REPLICATE PAYMENT:
  When casting: pay [replicate cost] any number of times (including 0)
  Each payment is an additional cost on top of the mana cost
  You can pay 1×, 2×, 3×... times

TRIGGER:
  When you cast the spell (after it's on the stack):
  If replicate was paid at least once:
    Create N copies (N = number of replicate payments)
  You may choose new targets for any/all of the copies

DIFFERENCE FROM STORM:
  Storm: count spells cast this turn (by anyone) → make that many copies
  Replicate: count how many times YOU paid replicate THIS cast → make that many copies
  Storm is free (part of cascade/resolution); Replicate costs mana per copy

COPIES AND INDEPENDENT FIZZLE:
  Each copy resolves independently
  If one copy's targets become illegal: that copy fizzles; others resolve
  The original spell resolves with its original targets (unaffected by copies)

MULTIPLE REPLICATE INSTANCES:
  If a spell has multiple replicate abilities: each is paid and triggers separately
  Paying replicate A 2 times AND replicate B 3 times: two separate triggers
    First trigger (A): creates 2 copies
    Second trigger (B): creates 3 copies
    Total: 5 copies + original = 6 effects
```

## Definitive Conclusions

- **Replicate creates one copy per payment.** Pay 3 times → 3 copies.
- **Copies may have new targets chosen independently.**
- **The trigger fires once and creates all copies.** (Not one trigger per payment.)
- **Stifle on the trigger:** all copies prevented if the trigger is countered.
- **Mana-intensive scaling:** unlike storm, every copy costs the replicate mana.

## Canonical Example
**Gigadrowse (Replicate {U}):**
Pay {U} (base) + {U}{U}{U} (three replicate payments). Gigadrowse is cast. Replicate trigger: copy it 3 times. Each copy taps target permanent. Total: 4 tap effects (original + 3 copies). Choose different targets for each copy. Cost: {U}{U}{U}{U} = {4}U-intensive but creates 4 taps.

**Example 2 — Replicate + Stifle:**
Pay replicate twice. Replicate trigger fires. Opponent Stifles the trigger. No copies are created. Original spell still resolves (the trigger was countered, not the spell).

## Commonly Confused With
- **P036 (Storm)** — Storm counts all spells cast this turn (free copies); replicate counts specific payments (paid copies). Storm creates more copies in optimal turn but can't be controlled per-cast.
- **P096 (Casualty)** — Casualty creates one copy via triggered ability if paid; replicate creates N copies (one per payment). Same structure, different scale.
