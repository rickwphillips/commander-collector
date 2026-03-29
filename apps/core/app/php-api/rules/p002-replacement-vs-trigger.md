---
id: p002
name: Replacement vs. Trigger
category: replacement
cr_refs: [603.1, 614.1, 614.1a, 614.1b, 614.1c, 614.6, 614.15]
tags: [replacement, triggered, instead, enters-the-battlefield, death, draw, graveyard, lifelink]
created: 2026-03-28
examples_count: 6
---

# P002 — Replacement vs. Trigger

## Abstract
Two fundamentally different categories of effect react to game events. Getting them confused leads to wrong conclusions about timing, responsiveness, and stacking. The distinguishing question: **does this effect happen instead of the event, or because the event happened?**

## The Definitive Rule

**CR 614.1** — Replacement effects watch for a particular event and replace it with something else. They do NOT go on the stack and CANNOT be responded to.
- Key word: **"instead"** (614.1a)
- Key word: **"skip"** (614.1b)
- Key phrases: **"enters with…", "as [permanent] enters…", "[permanent] enters as…"** (614.1c–d)

**CR 603.1** — Triggered abilities trigger when a game event or state matches. They DO go on the stack. They CAN be responded to. They are NOT immediate.
- Key words: **"when", "whenever", "at"**

## The Pattern

```
IF the effect uses "instead" or "skip" or "as [it] enters":
  → Replacement Effect
  → Does NOT use the stack
  → Cannot be responded to
  → Applied immediately at event-time
  → Event is MODIFIED or REPLACED (original never happens)

IF the effect uses "when", "whenever", or "at":
  → Triggered Ability
  → Goes on the stack (at next priority)
  → Can be responded to
  → Applied AFTER the original event happened
  → Original event HAPPENED; trigger reacts to it
```

## Definitive Conclusions

- **Lifelink** is a static ability, NOT a trigger. Damage and life gain happen simultaneously (same event). There is no window to respond between the damage and the life gain.
- **"Whenever a creature dies, do X"** is a trigger. The creature is already dead when the trigger goes on the stack. You cannot prevent the death by responding.
- **"As [this] enters, choose a color"** is a replacement effect. The choice is made before the permanent enters — it never enters unchosen.
- **"When [this] enters, draw a card"** is a trigger. The permanent entered, then you get priority, then the trigger goes on the stack, then it resolves (eventually).
- **Regeneration** is a replacement effect (614.8). "Instead of being destroyed, [do these things]." You can set it up in response to a spell that would destroy the creature, but it must be set up BEFORE the destroy event occurs.
- **Undying/Persist** are triggered abilities. The creature dies (replacement effects don't save it unless one applies), then the trigger goes on the stack.
- **Commander zone-return from graveyard/exile** = state-based action (903.9a) — checked automatically. Commander zone-return from hand/library = replacement effect (903.9b) — applied instead.

## Canonical Example
"Opponent casts Murder targeting my creature. Can I respond to save it with regeneration?" — YES. Regeneration is a replacement effect but must be set up BEFORE the destroy event. You respond to Murder (before it resolves), activate regeneration, Murder resolves and tries to destroy — regeneration shield applies instead. The creature is tapped and removed from combat but not destroyed.

Compare: "Opponent casts Murder. Can I respond to get the 'when this creature dies' trigger?" — The trigger doesn't fire until the creature is already dead. You can't "respond to" a trigger that hasn't fired yet. You can respond to the Murder spell itself, but once it resolves and the creature dies, the trigger goes on the stack and both players have priority to respond to *that*.

## Additional Examples

**Example 2 — ETB replacement vs. ETB trigger:**
Clone enters. "As Clone enters, you may have it be a copy of a creature" = replacement effect. Clone is never a generic Clone creature — it enters already as the copy. Any "when Clone enters" triggers see it as the copy it entered as.

**Example 3 — Draw replacement:**
Teferi's Puzzle Box: "At the beginning of each player's draw step, that player draws seven cards, then discards their hand." Wait — that's a trigger. A card that says "if you would draw a card, instead…" is a replacement. Important for ruling whether mill/shuffle effects intercept draws.

**Example 4 — Damage replacement:**
"If a source would deal damage to you, prevent 2 of that damage" — prevention effect (a type of replacement). Applied instead of the full damage being dealt. There is no "full damage dealt then reduced" — the modified amount is what's dealt.

**Example 5 — Death replacement:**
"If [this creature] would die, exile it instead" — replacement. The creature never reaches the graveyard. Any "when X dies" triggers referencing this creature DO NOT fire (614.6 — the replaced event never happened, so nothing to react to).

**Example 6 — Abundance + Sylvan Library (draw replacement bypasses payment clause):**
Sylvan Library: triggered ability — "draw 2 additional cards. If you do, choose two cards drawn this turn. For each, pay 4 life or put it on top of your library."
Abundance: replacement effect — "If you would draw a card, you may instead choose land or nonland and reveal until you find one."
If Abundance replaces both of Sylvan Library's extra draws, those draws never happen. Sylvan Library's clause says "if you do [draw 2]" — you didn't draw (Abundance replaced the draws). Sylvan Library's official ruling: "If you haven't actually drawn any cards that turn, the rest of the ability has no effect." Zero life paid, full Abundance filtering.
Nuance: your normal draw-step draw is also replaceable. If you replace it too, you drew zero cards total → no payment at all. If you drew normally and replaced only the Sylvan draws, you drew 1 card → must pay 4 life or put that 1 card back.

## Commonly Confused With
- **P007 (Priority Windows)** — Replacement effects have no priority window; triggers do.
- **P006 (Intervening If Clause)** — Triggers can have conditions; replacement effects just apply.
