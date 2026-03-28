# MTG Rules Interaction Abstractions — Index

Each entry is a named pattern. When a rules question comes in, scan this index for matching patterns first.
If a question maps to a known pattern, answer from the pattern (faster, more precise).
If it's new, answer from the CR, then file a new abstraction.

**Rules are always definitive.** If the conclusion seems ambiguous, dig deeper into the CR — there is always a concrete answer.

## How to Use This Index

1. Read the question
2. Identify the **underlying mechanic type** (not the card names)
3. Scan for matching patterns below
4. Open the matching file for full ruling + examples
5. After answering: add new example to existing file OR create new abstraction if pattern is novel

---

## Pattern Index

| ID | Name | Core Question | Tags |
|----|------|---------------|------|
| [P001](p001-threshold-damage-assignment.md) | Threshold-Based Damage Assignment | "How much damage must I assign before excess routes elsewhere?" | trample, deathtouch, multiple-blockers, damage-assignment, first-strike |
| [P002](p002-replacement-vs-trigger.md) | Replacement vs. Trigger | "Does this effect replace the event, or react to it?" | replacement, triggered, instead, enters-the-battlefield, death, draw |
| [P003](p003-zone-change-identity.md) | Zone Change Identity | "Is this the same object after it moved zones?" | graveyard, exile, commander, copy, token, new-object |
| [P004](p004-layer-dependency.md) | Layer Dependency Override | "Which of these continuous effects applies first?" | layers, continuous-effects, timestamp, dependency, P/T, type, color |
| [P005](p005-simultaneous-event-ordering.md) | Simultaneous Event Ordering | "When multiple things happen at once, what's the sequence?" | APNAP, SBA, triggers, simultaneous, death, enters |
| [P006](p006-intervening-if-clause.md) | Intervening If Clause | "Does this trigger at all, and does it do anything when it resolves?" | triggered, condition, if-clause, upkeep, state-check |
| [P007](p007-priority-windows.md) | Priority Windows | "Is there a window to respond between these two events?" | priority, stack, instant, response, lifelink, mana, SBA |
| [P008](p008-cant-vs-may.md) | Can't Overrides Can | "When two effects directly conflict, which wins?" | cant, may, override, prevention, restriction |
| [P009](p009-zone-change-trigger-race.md) | Zone-Change Trigger Race | "Multiple triggers on the same object — which one actually executes?" | zone-change, graveyard, trigger, race, persist, undying, fizzle, simultaneous |
| [P010](p010-multi-layer-effect-continuity.md) | Multi-Layer Effect Continuity | "An effect that spans multiple layers — does it survive if its ability is removed mid-evaluation?" | layers, 613.6, continuous-effects, ability-removal, ghost-effect, humility, multi-layer |
| [P011](p011-linked-ability-zone-reset.md) | Linked Ability Zone Reset | "Does the 'return' half of a linked pair remember what this object exiled after a zone change?" | linked-abilities, zone-change, exile, return, oblivion-ring, etb, ltb, new-object, nesting |
| [P012](p012-recursive-replacement.md) | Recursive Replacement | "A replacement effect generates a new event — can the same replacement apply again?" | replacement, recursive, draw, chains-of-mephistopheles, new-event, loop, termination |
| [P013](p013-banding-damage-inversion.md) | Banding Damage Inversion | "Who assigns damage when banding is involved?" | banding, combat, damage-assignment, inversion, blocking, band |
| [P014](p014-player-control.md) | Player Control | "What can you actually do when controlling another player?" | mindslaver, player-control, decisions, resources, concede, commander |

---

## Filing a New Abstraction

Create a new file `p###-short-name.md` and add a row to the table above.

**File format:**
```
---
id: p###
name: Full Pattern Name
category: [combat | stack | zones | continuous | triggered | replacement | costs | multiplayer]
cr_refs: [list of CR rules]
tags: [comma-separated]
created: YYYY-MM-DD
examples_count: N
---
```

**Body must include:**
- Abstract: The generalized principle in one paragraph
- The Definitive Rule: CR citation + what it says
- The Pattern: pseudocode or plain-language formula
- Canonical Example: first instance that surfaced this
- Additional Examples: (added over time)
- Definitive Conclusions: bullet list of concrete rulings
- Commonly Confused With: links to related patterns
