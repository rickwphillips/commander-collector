---
id: p032
name: Loyalty Ability Restrictions — Once Per Turn, Sorcery Speed, Cost
category: costs
cr_refs: [606.3, 606.4, 606.6, 117.1a, 306.5b]
tags: [planeswalker, loyalty-ability, once-per-turn, sorcery-speed, cost, counter, main-phase, stack-empty]
created: 2026-03-28
examples_count: 2
---

# P032 — Loyalty Ability Restrictions — Once Per Turn, Sorcery Speed, Cost

## Abstract
Planeswalker loyalty abilities are activated abilities with a unique restriction set: they can only be activated during your own main phase when the stack is empty, and only once per planeswalker per turn — not once per player or per game. The loyalty counter adjustment is a COST (not an effect), which means counter-doubling replacements don't apply to activations (P025 covers this). Multiple planeswalkers can each be activated once per turn.

## The Definitive Rule

**CR 606.3** (verbatim): *"A player may activate a loyalty ability of a permanent they control any time they have priority and the stack is empty during a main phase of their turn, but only if no player has previously activated a loyalty ability of that permanent that turn."*

**CR 606.4**: The cost is putting on or removing loyalty counters as shown by the loyalty symbol. This cost may be modified.

**CR 606.6**: A loyalty ability with a negative cost can't be activated unless the permanent has at least that many loyalty counters.

**CR 306.5b**: A planeswalker enters with a number of loyalty counters equal to its printed loyalty (by a static ability generating a replacement effect as it enters).

## The Pattern

```
WHEN YOU CAN ACTIVATE A LOYALTY ABILITY:
  ✓ During YOUR main phase
  ✓ Stack must be empty
  ✓ You must have priority
  ✓ No loyalty ability of THAT permanent has been activated this turn
    (by any player — opponent can't use planeswalker you control, but
     "this turn" tracks activations by anyone on that specific permanent)

WHEN YOU CANNOT:
  ✗ During opponent's turn (even if they gave you priority)
  ✗ During your combat or end step
  ✗ While any spell or ability is on the stack
  ✗ Twice on the same planeswalker in a turn (even if +/− is the same)
  ✗ A negative ability if loyalty count < the absolute value of the cost

PER-PLANESWALKER, NOT PER-TURN:
  You control Jace and Liliana — each can be activated once per turn
  Activation of Jace doesn't prevent activating Liliana

COST NOT EFFECT (per P025):
  "+2" ability: PAY by putting 2 loyalty counters on as cost
  Doubling Season: doesn't double cost payments
  BUT: a planeswalker entering the battlefield gets doubled entry counters
  (entry counters = effect; activation adjustment = cost)

NEGATIVE ABILITY CHECK (CR 606.6):
  Ability costs [−4]: planeswalker needs at least 4 loyalty counters
  Check is made at time of activation (not during resolution)
```

## Definitive Conclusions

- **Loyalty abilities are sorcery-speed with the stack-empty requirement.** Even flash permanents can't make you activate loyalty abilities outside your main phase.
- **Once per planeswalker per turn, not once per player.** Your opponent can't activate your planeswalker's ability.
- **Counter adjustment is a cost.** Doubling Season, Hardened Scales, Vorinclex don't affect activations.
- **Multiple planeswalkers are independent.** Each gets one activation per turn.
- **You can't activate an ability you can't pay for.** Must have ≥ absolute value of a negative cost.

## Canonical Example
**Carth the Lion + planeswalker (CR 606.5 example):**
Carth the Lion says "Planeswalkers' loyalty abilities you control cost an additional [+1] to activate." Your planeswalker has "+1: [effect]" and "−4: [effect]." To activate the +1: put 2 counters on (1+1). To activate the −4: remove 3 counters (cost combination: −4 +1 = −3). Loyalty abilities combine additive loyalty costs, they don't apply sequentially.

**Example 2 — Can't activate twice:**
You activate your Garruk's +1 ability during your first main phase. Later that turn, you have priority and the stack is empty again. You can't activate any loyalty ability of Garruk again this turn — the restriction is "no player has previously activated a loyalty ability of that permanent that turn."

## Commonly Confused With
- **P025 (Counter Placement — Cost vs. Effect)** — P025 is specifically about whether counter-doubling replacements apply. P032 covers the broader loyalty ability activation rules.
- **P007 (Priority Windows)** — The sorcery-speed restriction is about when the stack must be empty, not about the priority system itself.
