---
id: p188
name: Exhaust — Activated Ability Usable Only Once (Ever)
category: costs
cr_refs: [702.177a, 702.177b]
tags: [exhaust, once-only, activated-ability, permanent, Assassins-Creed, Thunder-Junction, once-per-game]
created: 2026-03-28
examples_count: 2
---

# P188 — Exhaust — Activated Ability Usable Only Once (Ever)

## Abstract
Exhaust is a special kind of activated ability that can only be activated once — ever. Unlike "activate only once each turn" (like Boast), an exhaust ability, once activated, cannot be activated again for the remainder of the game. The card "exhausts" its special power. This is a "limited resource" ability — powerful but one-time. If the permanent leaves the battlefield and returns, the exhausted state persists (it was "activated" before). Exhaust enables powerful effects that would be broken if repeatable.

## The Definitive Rules

**CR 702.177a** (verbatim): *"An exhaust ability is a special kind of activated ability. 'Exhaust — [Cost]: [Effect]' means '[Cost]: [Effect]. Activate only once.'"*

**CR 702.177b** (verbatim): *"An effect may allow you to take an action as long as you haven't activated an exhaust ability this turn. Such an effect allows that action only if you haven't begun to activate an exhaust ability this turn."*

## The Pattern

```
EXHAUST:
  Special activated ability: "Activate only once" — across the entire game
  Not "once per turn" — once EVER for that permanent
  Once activated: the exhaust ability is permanently locked out

  EXHAUST + ZONE CHANGES:
    If a permanent with exhaust leaves the battlefield and returns: it's a new object
    As a new object: does the "activated once" restriction reset?
    The restriction is tied to the game state of that specific permanent
    When it re-enters as a new object: the previous activation doesn't apply to the new object
    So: if the permanent leaves and returns → exhaust is fresh (can be activated once more)
    This is important: blink effects reset exhaust!

  EXHAUST + BLINK:
    Flicker/blink a creature with an exhaust ability: it leaves and re-enters as a new object
    New object: exhaust is unused again
    Activate exhaust → blink → activate exhaust again (then blink again, etc.)
    Potential infinite loop with free blink effects if exhaust gives value

  EXHAUST + COPY:
    Copy of a permanent with exhaust: the copy is a new object → exhaust not yet activated
    Copy can use its exhaust ability once independently

  EXHAUST COMPARISON:
    Boast (P132): "activate only if this creature attacked this turn AND only once each turn" → resets each turn
    Exhaust: "activate only once" → never resets (unless zone change creates new object)
    Exhaust > Boast in "permanence" of the restriction

  EXHAUST + POWERFUL EFFECTS:
    Because exhaust is once-only, the ability can be very powerful
    Typical exhaust effects: search your library for a card, create multiple tokens, deal massive damage
    The once-only limitation balances the power

  EXHAUST CARDS:
    Various Assassin's Creed and Outlaws of Thunder Junction cards have exhaust
    Typically on legendary/rare creatures with one-time powerful special moves

  EXHAUST + "ONCE" TRACKING:
    The game tracks whether the exhaust ability has been activated
    Similar to how the game tracks whether a player has taken the companion special action
    Persistent across the game for that object instance
```

## Definitive Conclusions

- **Exhaust can be activated only once** for the lifetime of that object.
- **Zone changes create a new object** — exhaust resets on blink/exile-return (new object identity).
- **Copies start fresh** — a copy of an exhausted permanent can still activate its exhaust.
- **More restrictive than once-per-turn** abilities like Boast.
- **Powerful effects** balanced by the once-only constraint.

## Canonical Example
**A creature with "Exhaust — {T}: Create three 4/4 Dragon tokens":**
Activate once → three 4/4 Dragon tokens. That ability is now gone.
If the creature dies and is reanimated: it's a new object → can activate Exhaust once more.
If it's Flickerwisp'd (exile, return at end of step): new object, Exhaust is fresh again.
Blink engine: flicker the creature repeatedly → create Dragon tokens repeatedly (one per blink cycle).

**Example 2 — Exhaust vs. Boast:**
A 2/2 with Boast: can activate the boast ability once per turn it attacked.
A 2/2 with Exhaust: can activate the exhaust ability once per game (per object).
On day 1: exhaust activated. For the rest of the game (unless blinked): exhaust is locked.
Strategic: save exhaust for the right moment — it won't come back.

## Commonly Confused With
- **P132 (Boast)** — Boast resets each turn. Exhaust is once per game/object.
- **P188 vs Loyalty Abilities** — Planeswalker loyalty abilities can only be activated once per turn. Exhaust abilities can only be activated once per game object lifetime.
- **P169 (Companion)** — Companion's special action can be taken only once per game (similar restriction). But companion is a global game-rule restriction; exhaust is per-ability per-object.
