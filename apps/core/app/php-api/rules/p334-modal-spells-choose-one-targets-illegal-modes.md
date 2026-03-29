---
id: p334
name: Modal Spells — Choose One/Two/Any Number, Illegal Modes, Target Selection, Copies
category: stack
cr_refs: [700.2, 700.2a, 700.2b, 700.2c, 700.2d, 700.2f, 700.2g, 700.2h, 700.2i]
tags: [modal, choose-one, choose-two, choose-any, bulleted-list, illegal-mode, target-selection, charm, Cryptic-Command, Abzan-Charm, Confluence, Entwine, split-second-modes, copy-modal, cascade-modal, Kicker-choose-any]
created: 2026-03-29
examples_count: 2
---

# P334 — Modal Spells — Choose One/Two/Any Number, Illegal Modes, Target Selection, Copies

## Abstract
A **modal spell or ability** has two or more options (modes) in a bulleted list preceded by "Choose one —", "Choose two —", etc. The controller chooses mode(s) when casting (or when placing a triggered ability on the stack). **Illegal modes** (e.g., a mode that requires a target when no legal target exists) cannot be chosen. If a modal triggered ability has ALL modes illegal, it's removed from the stack. Copies of modal spells inherit the modes chosen by the original — the copy's controller cannot choose different modes. The "choose same mode more than once" option allows duplicate mode selection only if explicitly permitted by the card.

## The Definitive Rules

**CR 700.2** (verbatim): *"A spell or ability is modal if it has two or more options in a bulleted list preceded by instructions for a player to choose a number of those options, such as 'Choose one —.' Each of those options is a mode."*

**CR 700.2a** (verbatim): *"The controller of a modal spell or activated ability chooses the mode(s) as part of casting that spell or activating that ability. If one of the modes would be illegal (due to an inability to choose legal targets, for example), that mode can't be chosen. (See rule 601.2b.)"*

**CR 700.2b** (verbatim): *"The controller of a modal triggered ability chooses the mode(s) as part of putting that ability on the stack. If one of the modes would be illegal (due to an inability to choose legal targets, for example), that mode can't be chosen. If no mode is chosen, the ability is removed from the stack."*

**CR 700.2d** (verbatim): *"If a player is allowed to choose more than one mode for a modal spell or ability, that player normally can't choose the same mode more than once. However, some modal spells include the instruction 'You may choose the same mode more than once.' If a particular mode is chosen multiple times, the spell is treated as if that mode appeared that many times in sequence."*

**CR 700.2g** (verbatim): *"A copy of a modal spell or ability copies the mode(s) chosen for it. The controller of the copy can't choose a different mode."*

**CR 700.2h** (verbatim): *"Some modal spells have one or more modes with a cost listed before the effect of that mode. This indicates that the mode has an additional cost that must be paid as the spell is cast if that mode is chosen."*

## The Pattern

```
MODAL SPELL MECHANICS:
  "Choose one —" = exactly one mode.
  "Choose two —" = exactly two modes.
  "Choose one or both —" = one or two modes.
  "Choose any number —" = zero or more modes.
  "Choose one or more —" = at least one mode, up to all.

MODE SELECTION TIMING:
  CR 700.2a: for spells and activated abilities: chosen WHEN CASTING / ACTIVATING.
    This is announced as part of casting (step 601.2b): announce modes before targets.
  CR 700.2b: for triggered abilities: chosen when putting on the stack.
    The trigger fires, then as it's placed on the stack, controller chooses modes.

ILLEGAL MODES:
  If a mode would be illegal: can't choose it.
  CR 700.2a: "If one of the modes would be illegal (due to an inability to choose legal targets, for example), that mode can't be chosen."
  Example: Cryptic Command ({1}{U}{U}{U}): "Choose two —"
    Mode options: counter target spell / return target permanent to hand / tap all creatures opponents control / draw a card.
    If there's no spell on the stack: mode "counter target spell" is ILLEGAL.
    You can't choose that mode.
    You can still cast Cryptic Command — just choose two from the remaining legal modes.
  IMPORTANT: "choose two" is satisfied by any two legal modes. The spell is legal as long as enough modes are available to satisfy the "choose N" requirement.
    If Cryptic Command needs two modes but only one is legal: can't cast it.
    If only one mode is legal and the spell says "choose one": fine.

MODAL TRIGGERED ABILITY — ALL MODES ILLEGAL:
  CR 700.2b: "If no mode is chosen, the ability is removed from the stack."
  If ALL modes are illegal when a modal triggered ability would be placed on the stack:
    No mode can be chosen → ability is removed from stack.
    It never resolves. Effectively "fizzles" before resolution.
  Example: a triggered ability "choose one — counter target spell OR return target nonland permanent to hand."
    If both modes are illegal (no spell on stack, no nonland permanent): the triggered ability is removed.

SAME MODE TWICE (CR 700.2d):
  By default: if "choose two," can't choose the same mode twice.
  Exception: if the card says "you may choose the same mode more than once."
    Example: Cantrip-style modal spell: "Choose two — draw a card; ... you may choose the same mode more than once."
    In that case: choose "draw a card" twice → draw two cards.
  Most "choose two" cards don't allow same mode twice. Charms, Confluences, etc. default to no repeats.

COPIES OF MODAL SPELLS (CR 700.2g):
  Copying a modal spell → copy inherits the modes chosen by the original.
  The copy's controller CANNOT choose different modes.
  Example: you cast Cryptic Command choosing [counter spell + draw card].
    Opponent Forks the Cryptic Command (creates a copy).
    The Fork copy ALSO has modes "counter target spell + draw card."
    Fork's controller can choose different targets, but not different modes.
    Fork's copy must still target "a spell" for the counter mode.
  This is a crucial distinction from copies of non-modal spells (P314): modal copies lock in the modes.

CHARMS AND THEIR CHOICES:
  Charms: three-mode "choose one" spells at a low mana cost.
  Mardu Charm ({R}{W}{B}): "Choose one — Create two 1/1 Warrior tokens / Target creature gets -3/-3 / Discard a card at random."
  Only one mode: simple decision.
  Abzan Charm ({W}{B}{G}): "Choose one — Exile target creature with power 5 or greater / Put two +1/+1 counters on target creature / Draw 2 cards, then put 1 card from hand on top of library."
  Each option is powerful: the "choose one" creates a multipurpose spell.
  Charms get better when the "right" mode is most impactful in context.

CRYPTIC COMMAND:
  {1}{U}{U}{U}: "Choose two —"
  Modes: A) Counter target spell, B) Return target permanent to hand, C) Tap all creatures opponents control, D) Draw a card.
  Only mode A has a specific target requirement (a spell on the stack).
  Modes B: target permanent. C: no target (all creatures). D: no target.
  Common uses: A+D (counter + draw), B+C (bounce blocker + tap), A+B (hard counter + bounce).
  If you have no spell to counter: you can't use A. Choose from B/C/D.
  Four options → C(4,2) = 6 possible combinations. Very flexible.

ENTWINE (CR 702.42a):
  Entwine: "You may choose all modes instead of the specified number. If you do, pay [additional cost]."
  Entwine is not technically a "choose more modes" — it's an additional cost that changes the spell to allow all modes.
  Example: Tooth and Nail ({5}{G}{G}): Entwine {2}.
    "Choose one — search library for two creature cards, reveal, put in hand. OR put two creature cards from hand onto battlefield."
    With Entwine ({2} extra cost = {7}{G}{G} total): do both — search AND put on battlefield.
    This effectively "tutor two creatures onto battlefield."

MODES WITH COSTS (CR 700.2h):
  Some modal spells list additional costs for specific modes:
  Example: "Choose one or more — {W}: Do X / {R}: Do Y"
    Choosing the white mode requires paying {W} as an additional cost.
    This appears on some "kicker-style" modal spells from newer sets (e.g., Charms from later sets).
  The cost is paid when casting, along with the spell's mana cost.

PAWPRINT MODES (CR 700.2i):
  Some Modal spells use {P} pawprint symbols instead of bullets.
  "Choose up to 3 {P} worth of modes": total pawprints of chosen modes ≤ 3.
  A mode with {P} costs 1 "worth." A mode with {P}{P} costs 2 "worth."
  Choose any combination summing to ≤ 3.
  This is a newer design space (post-2024 sets) allowing granular mode selection.
```

## Definitive Conclusions

- **Mode choices are locked in at casting time** — you can't change modes after the spell is on the stack.
- **Illegal modes can't be chosen** — if too many modes are illegal to satisfy the "choose N" requirement, the spell can't be cast.
- **Modal triggered abilities with all modes illegal are removed from the stack** — they don't resolve.
- **Same mode can't be chosen twice UNLESS explicitly permitted** — no double-choosing from "Choose two."
- **Copies of modal spells inherit the modes** — copy controller can't pick different modes.
- **Entwine pays an additional cost to enable all modes** — not the same as choosing extra modes freely.

## Canonical Example
**Cryptic Command — Choosing the Right Two Modes:**
Modern control game. You have Cryptic Command in hand with {1}{U}{U}{U} available.
Opponent attacks with three 3/3 creatures at 7 damage total. You have no blockers.
Mode analysis: A) Counter target spell — no spell on stack. ILLEGAL.
  B) Return target permanent to hand — opponent has many permanents. LEGAL.
  C) Tap all creatures opponents control — all their attackers tap. LEGAL.
  D) Draw a card — always legal. LEGAL.
Best choice: B+C (bounce one attacker to hand + tap the other two).
Wait: bouncing one + tapping two = 0 damage through. Perfect.
Cast Cryptic Command choosing B+C. Target one 3/3 to return to hand. All opponent's creatures tap.
Cryptic Command resolves: 3/3 bounced. Other two creatures tap (become "tapped" but they were declared as attackers... wait).
CR 509: attacking creatures are already declared. Tapping them doesn't remove them from combat.
Hmm: "Tap all creatures opponents control." These creatures are attacking — can you tap them?
Tapping an already-attacking creature: the creature is tapped during the attack (after damage). Tapping it now removes... nothing? It's already in the attack.
Wait: the spell says "tap all creatures opponents control." If they're declared as attacking, they're already tapped. Cryptic Command mode C on already-attacking creatures: they're already tapped; the tap effect does nothing new for them.
CORRECTION: the C mode of Cryptic Command is most effective as a pseudo-fog when creatures aren't already attacking (e.g., before attacks) or tapping potential blockers on opponent's turn.

Actual best use in this scenario: Cast during opponent's declare attackers step (if they haven't attacked yet — but they declared attackers already). Better: cast in opponent's main phase BEFORE they attack, tapping all their creatures so they can't attack this turn.
Mode C utility: use before attackers are declared to prevent attacks entirely.

**Example 2 — Modal Triggered Ability with Illegal Mode:**
Skill: Riku of Two Reflections ({2}{G}{U}{R}, Commander): "Whenever you cast an instant or sorcery spell, you may pay {U}{R}. If you do, copy that spell. You may choose new targets for the copy."
Casting: you cast a modal spell "Choose one — Counter target spell OR Draw two cards."
You chose mode D (draw two cards). No target.
Riku trigger: copy the spell.
The COPY has mode "draw two cards" — it inherited the mode chosen (CR 700.2g).
You may choose new targets... but there are no targets for this mode.
The copy resolves: draw two more cards.
Now: if you had instead chosen mode A (counter target spell), and chose to copy it via Riku:
The copy also has mode "counter target spell" and needs a target.
You may choose the SAME target or a DIFFERENT spell to counter.
Two counterspells for {2}{U}{R} extra mana. Powerful.

## Commonly Confused With
- **P302 (Overload)** — Overload changes "target X" to "each X," effectively modifying the spell's text. It's an alternative cost, not a mode choice. An overloaded Cyclonic Rift doesn't have modes; it has ONE effect applied to all nonland permanents.
- **P317 (Modal DFC)** — Modal double-faced cards allow choosing which FACE to cast as an alternative cost, not choosing between bulleted modes. When a modal DFC is on the stack, it's one specific face — the controller can't switch faces.
- **P329 (Casting Costs)** — Modal spells with per-mode additional costs follow the additional cost rules. Choosing a mode with an additional cost is announced as part of casting, following 601.2b's ordering.
- **P314 (Copy Effects)** — Copies of spells copy the modes. "You may choose new targets" for a copy lets the copy controller pick different targets but not different modes.
