---
id: p200
name: Sneak — Cast Permanent at Instant Speed During Declare Blockers
category: combat
cr_refs: [702.190a, 702.190b]
tags: [sneak, alternative-cost, declare-blockers, instant-speed, enters-attacking, return-to-hand, Avatar, Universes-Beyond]
created: 2026-03-28
examples_count: 2
---

# P200 — Sneak — Cast Permanent at Instant Speed During Declare Blockers

## Abstract
Sneak is a unique alternative cost mechanic from Avatar: The Last Airbender Universes Beyond. During your declare blockers step, any time you could cast an instant, you may cast a Sneak spell by paying its sneak cost AND returning an unblocked creature you control to hand. The spell's permanent enters the battlefield tapped and attacking the same player/planeswalker/battle as the returned creature. This allows surprise mid-combat additions to your attacking force — creatures that weren't declared as attackers but join the fray during blockers. The Sneak creature jumps into battle while the returned creature retreats.

## The Definitive Rules

**CR 702.190a** (verbatim): *"Sneak is a keyword that represents a static ability that functions while the spell with sneak is on the stack. 'Sneak [cost]' means 'Any time you could cast an instant during your declare blockers step, you may choose to pay [cost] and return an unblocked creature you control to its owner's hand rather than pay this spell's mana cost.'"*

**CR 702.190b** (verbatim): *"A permanent spell cast using sneak enters the battlefield tapped and attacking (see rule 506.3a). It will be attacking the same player, planeswalker, or battle as the creature that was returned to its owner's hand to pay the sneak cost of the spell that became that permanent."*

## The Pattern

```
SNEAK:
  Alternative cost: pay sneak cost + return an unblocked creature to hand
  Timing restriction: "during your declare blockers step, any time you could cast an instant"
  The permanent enters tapped and attacking (same target as the returned creature)

  SNEAK + TIMING:
    ONLY during your declare blockers step (not other steps)
    "Any time you could cast an instant during that step" — with priority, no special timing restriction
    You can cast it in response to opponent declaring blockers
    You can cast it after opponent blocks (before damage)

  SNEAK + UNBLOCKED CREATURE REQUIREMENT:
    The returned creature must be UNBLOCKED at the time of casting
    Fully blocked creatures: can't use them for sneak cost
    "Unblocked" = not blocked by any creatures (no blockers assigned to it)
    If a creature was blocked but the blocker was removed: is it now "unblocked"?
    Once blocked, a creature is blocked for the rest of combat (rule 509.1h)
    So: removing a blocker doesn't un-block the attacker — it's still "blocked"
    Only truly unblocked (never had blockers declared) creatures qualify

  SNEAK + ENTERS ATTACKING:
    The sneaking permanent enters tapped and attacking
    It attacks the same player/planeswalker/battle as the creature that was returned
    Attacks the same TARGET, not just the same player — if returned creature attacked a planeswalker, sneaker also attacks that planeswalker
    ETB triggers fire when it enters (it's a new permanent entering the battlefield)

  SNEAK + WHAT'S RETURNED:
    An unblocked attacker is returned to hand (bounced)
    Leaves-the-battlefield triggers fire for the returned creature
    That creature's combat damage is no longer dealt (it left the battlefield)
    But: the Sneak creature takes its place as an attacker (same target)

  SNEAK + SURPRISE COMBAT:
    Opponent has declared blockers, distributed them across your attackers
    Unblocked attacker is going through — but you use it for Sneak cost
    Sneak creature enters: same target, possibly bigger (more damage) or with relevant abilities
    Opponent can't re-assign blockers after Sneak (blockers are declared; Sneak happens after)
    The Sneak creature is now unblocked (no blockers declared for it — they were declared before it existed)

  SNEAK + SNEAK CREATURE ABILITIES:
    The entering creature may have abilities relevant in combat: trample, lifelink, double strike
    It enters as an attacker, unblocked (opponent had no chance to block it)
    Deathtouch + unblocked: guaranteed lethal damage through

  SNEAK + NINJUTSU COMPARISON (P147):
    Ninjutsu: return an unblocked attacker to hand, put Ninja from hand into play attacking
    Sneak: pay sneak cost + return unblocked attacker, Sneak creature enters attacking
    Key difference:
    - Ninjutsu is an activated ability (not a spell cast)
    - Sneak is casting a spell (it uses the stack, can be responded to)
    - Ninjutsu works at instant speed generally; Sneak only during declare blockers

  SNEAK + ETB vs NINJUTSU:
    Sneak uses the stack: opponent can respond (counter the spell before it enters)
    Ninjutsu is an activated ability that goes on the stack similarly
    Both create enters-attacking permanents

  AVATAR FLAVOR:
    Sneaking past guards (Air Nomads, Aang's evasion style)
    "Sneak" = tactical insertion of a fighter into combat mid-battle
    Avatar UB: characters with Sneak represent stealthy combat insertions
```

## Definitive Conclusions

- **Sneak enables mid-combat creature deployment** — during declare blockers step.
- **Return an unblocked creature** + pay sneak cost instead of mana cost.
- **Sneak creature enters tapped and attacking** the same target as the returned creature.
- **Opponent can't block it** — blockers were already declared before the Sneak spell.
- **Can be countered** — it's a spell on the stack (unlike Ninjutsu which is an activated ability).

## Canonical Example
**Aang, Air Nomad with Sneak {1}{U} (normally {4}{U}):**
Your declare blockers step: opponent has blocked 2 of your 3 attackers. One 1/1 is unblocked.
Use Sneak: pay {1}{U} + return the 1/1 unblocked attacker to hand.
Aang (3/3 flying, powerful abilities) enters tapped and attacking (same target as the returned 1/1).
Aang is unblocked — no blockers were declared for it.
Aang deals 3 damage. ETB triggers from Aang entering.
Net: replaced 1 damage (from the 1/1) with 3+ damage (from Aang) + ETB value.

**Example 2 — Sneak Timing:**
Opponent has declared all blockers. You have an unblocked 2/2 (heading for opponent's face).
Instead of 2 unblocked damage: Sneak in a 5/5 trampler.
Return the 2/2 (bounce it). 5/5 enters unblocked, attacking opponent.
5 trample damage vs. 2 plain damage — significant upgrade.
After combat: cast the 2/2 again next turn (ETB fires if it has ETB).
Sneak served both purposes: combat advantage this turn + future ETB value.

## Commonly Confused With
- **P147 (Ninjutsu)** — Ninjutsu is an activated ability (not a spell cast), works at instant speed generally. Sneak is a spell cast, only during declare blockers.
- **P148 (Morph)** — Morph is a face-down casting alternative. Sneak is a mid-combat casting alternative.
- **P161 (Dash)** — Dash gives haste and bounces at end step. Sneak is a one-time combat deployment (not an end-step bounce for the sneaking creature).
