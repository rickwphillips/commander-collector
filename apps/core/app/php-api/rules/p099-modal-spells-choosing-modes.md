---
id: p099
name: Modal Spells — Choosing Modes and Escalate
category: stack
cr_refs: [700.2, 702.120a]
tags: [modal, modes, choose, escalate, choose-one, choose-two, overrule, copy-modes]
created: 2026-03-28
examples_count: 2
---

# P099 — Modal Spells — Choosing Modes and Escalate

## Abstract
Modal spells require choosing one or more modes at casting time. The chosen modes determine the spell's effects. Copies of modal spells inherit the same modes as the original (unless the copy effect specifies new targets/modes). Escalate is a variant that lets you choose additional modes by paying extra costs. The key rules question: can modes be changed on copies? Can the same mode be chosen twice?

## The Definitive Rule

**CR 700.2**: "Some spells and abilities have text that reads 'Choose one—' or similar, followed by choices. These are modal spells and abilities."

**CR 702.120a** (verbatim): *"Escalate is a static ability of modal spells (see rule 700.2) that functions while the spell with escalate is on the stack. 'Escalate [cost]' means 'For each mode you choose beyond the first as you cast this spell, you pay an additional [cost].' Paying a spell's escalate cost follows the rules for paying additional costs in rules 601.2f–h."*

## The Pattern

```
MODAL SPELL STRUCTURE:
  "Choose one —" = exactly one mode
  "Choose two —" = exactly two modes (can choose the same mode twice if no "different" restriction)
  "Choose one or more —" = at least one, up to all available modes
  "Choose one or both —" = one or both (not multiple of same)

CHOOSING MODES:
  Done when casting the spell (during announcement, CR 601.2d)
  You choose which mode(s) to use before paying costs
  The chosen modes are locked in (can't change after announcement)

SAME MODE TWICE:
  "Choose two" — can you choose the same mode twice?
  "You may choose the same mode more than once" must be stated explicitly
  Without that text: typically can choose same mode twice if the spell doesn't say "different"
  This is a common rules question — check each spell's wording

COPIES AND MODES:
  Copies of modal spells copy the modes chosen for the original (CR 707.10)
  "You may choose new targets" when copying: this is about TARGETS, not modes
  To change MODES on a copy: the copy effect must say "you may choose new modes"
  Without explicit permission: copy has same modes as original

ESCALATE:
  "Escalate [cost]" — for each mode beyond the first, pay the escalate cost
  Choose 1 mode: no escalate cost
  Choose 2 modes: pay escalate cost once
  Choose 3 modes: pay escalate cost twice
  Escalate lets you access multiple modes for a combined cost

ENTWINE:
  Older mechanic similar to escalate
  "Entwine [cost]" — if you pay the entwine cost, choose ALL modes
  Different from escalate: entwine = all modes at once

OVERLOADED MODAL SPELLS:
  Overload replaces "target" with "each" in the text
  For a modal spell: overload applies to whichever mode(s) were chosen
  → Only the chosen modes get the overload replacement
```

## Definitive Conclusions

- **Modes are chosen at announcement time.** Locked in after casting.
- **Copies inherit the original's modes** unless the copy effect explicitly allows new mode choices.
- **Escalate costs are additional costs** — one payment per mode beyond the first.
- **The same mode can be chosen twice** only if no restriction states "different targets" or "different modes."
- **"You may choose new targets" doesn't let you choose new modes** on a copy.

## Canonical Example
**Cryptic Command (choose two — Counter target spell; Return target permanent to its owner's hand; Tap all creatures your opponents control; Draw a card):**
You choose "Counter target spell" and "Draw a card." Cast Cryptic Command. Copy it with Fork. Copy inherits the same two modes (counter + draw). You may choose new targets for the copy (different spell to counter).

**Example 2 — Escalate:**
Collective Brutality (Escalate {2}): choose one or more modes. Choose all 3 modes: pay normal cost + {2} + {2} = normal cost + {4}. Each additional mode costs {2} beyond the first.

## Commonly Confused With
- **P050 (Overload)** — Overload changes "target" to "each" within chosen modes. Modal + overload: only the chosen mode's "target" is changed.
- **P029 (Spell Copy Targeting)** — "Choose new targets" on copies applies to targets within modes, not the mode choice itself.
