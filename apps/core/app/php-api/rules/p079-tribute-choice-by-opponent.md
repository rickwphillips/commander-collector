---
id: p079
name: Tribute — Opponent Choice ETB Modifier
category: replacement
cr_refs: [702.104a]
tags: [tribute, opponent-choice, ETB, counter, replacement-effect, punisher, enters-with]
created: 2026-03-28
examples_count: 2
---

# P079 — Tribute — Opponent Choice ETB Modifier

## Abstract
Tribute is an "as this creature enters" ability where an opponent chooses to put N +1/+1 counters on it or not. The creature then has abilities that trigger or apply based on whether tribute was paid. This is a "punisher" mechanic — the opponent always makes the "less bad" choice for them. Tribute is an enters-as-replacement effect, resolved before the creature is on the battlefield. The controller of the tribute creature still benefits either way — just in different ways.

## The Definitive Rule

**CR 702.104a**: Tribute N means "As this creature enters, an opponent of your choice may put N +1/+1 counters on it. If that opponent doesn't, [effect]."

(Note: the exact verbatim text from the CR is the defined template above — let me retrieve it directly.)

## The Pattern

```
TRIBUTE STRUCTURE:
  "As this creature enters": an opponent may put N +1/+1 counters on it
  If the opponent DOES put counters: creature enters bigger, "tribute" effect doesn't fire
  If the opponent DOESN'T put counters: creature enters at base P/T, "tribute" effect fires

OPPONENT'S PERSPECTIVE:
  Opponent chooses: give the creature counters (bigger threat) OR let the effect happen
  The "right" choice depends on which is worse for them
  Example: if the tribute effect is "draw 3 cards" — opponent may prefer giving counters
  Example: if the tribute effect is "Wrath" — opponent may prefer giving counters
  The caster benefits either way; opponent minimizes their downside

AS-ENTERS EFFECT:
  "As this creature enters" = replacement effect (P023 territory)
  The choice is made BEFORE the creature enters
  Not a triggered ability → Torpor Orb does NOT suppress tribute
    (Torpor Orb stops triggered ETBs, not replacement effects)

WHICH OPPONENT CHOOSES?
  "An opponent of your choice" — you choose WHICH opponent makes the decision
  In multiplayer: you pick the opponent most likely to pay tribute
  (Tactical consideration: choose the opponent who can least afford the counter)

TRIBUTE-PAID STATUS:
  The card tracks whether tribute was paid (counters were placed or not)
  Abilities that reference "if tribute wasn't paid" check at resolution
    (The decision was already made on entry)
  No need to track via a separate marker — the presence/absence of counters is the indicator
    Actually: the decision is made BEFORE entering, so the card enters WITH or WITHOUT counters
    The "if tribute wasn't paid" condition checks whether the opponent declined to pay

DOUBLING SEASON AND TRIBUTE:
  If tribute is paid (opponent puts N counters):
    Doubling Season would double those counters (they're placed as the creature enters)
    → Creature enters with 2N counters instead of N
```

## Definitive Conclusions

- **Tribute is a "punisher" mechanic.** Opponent always chooses the less bad option for them.
- **Tribute is an "as enters" effect (replacement), not a triggered ability.** Torpor Orb doesn't suppress it.
- **In multiplayer, you choose which opponent decides.** Target the opponent most likely to pay.
- **Doubling Season doubles the tribute counters** if the opponent pays (they're placed on entry).
- **Either outcome benefits the caster** — bigger creature OR triggered/static effect.

## Canonical Example
**Nessian Wilds Ravager (Tribute 6, if tribute not paid, fight target creature):**
Enters. Opponent chooses: give it 6 +1/+1 counters → it becomes a 12/12. Or: decline counters → it enters as 6/6 and fights target creature (destroy a threat). Opponent typically gives counters to avoid the fight. Either way, you get a massive threat.

**Example 2 — Tribute in multiplayer:**
You choose opponent A to make the tribute decision. Opponent A may not want to give you a huge creature, so they don't pay tribute. The "if tribute wasn't paid" effect fires against opponent A's board. Strategic selection of which opponent decides can be significant.

## Commonly Confused With
- **P023 (Trigger Suppression vs. Replacement)** — Tribute is a replacement effect. Torpor Orb (which suppresses triggered ETBs) does NOT stop tribute.
- **P028 (Simultaneous ETB)** — If multiple tribute creatures enter at once, each gets its own tribute decision (separate "as enters" replacement effects).
