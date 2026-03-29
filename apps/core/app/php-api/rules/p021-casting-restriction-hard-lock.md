---
id: p021
name: Casting Restriction Hard Lock
category: stack
cr_refs: [601.3, 117.1a, 117.3a, 605.1a, 608.2d]
tags: [casting-restriction, hard-lock, knowledge-pool, teferi, cant-cast, sorcery-speed, exile, timing, stack]
created: 2026-03-28
examples_count: 1
---

# P021 — Casting Restriction Hard Lock

## Abstract
When a casting restriction ("you may only cast spells at sorcery speed") combines with a mechanic that creates a casting opportunity outside that timing window (triggered ability resolving mid-stack, exile-based casting offer), the restriction prevents the opportunity from being used. If the opportunity is mandatory to advance (you must cast the offered card to get your original spell back), the result is a complete lock: the restricted player can never successfully cast spells from hand. Their hand spells are permanently exiled and inaccessible.

## The Definitive Rule

**Teferi, Mage of Zhalfir oracle text**: *"Each opponent can cast spells only any time they could cast a sorcery."*

**Teferi ruling (2021-03-19)**: *"Teferi's last ability means that in order for an opponent to cast a spell, it must be that opponent's turn, during a main phase, and the stack must be empty. This is true even if a rule or effect allows a sorcery to be cast at another time."*

**Teferi ruling (2021-03-19)**: *"If a spell or ability lets an opponent cast a spell as part of its effect (such as suspend and rebound do), that opponent can't cast that spell since the resolving ability is still on the stack."*

**Knowledge Pool oracle text**: *"Whenever a player casts a spell from their hand, that player exiles it. If the player does, they may cast a spell from among other cards exiled with this artifact without paying its mana cost."*

**Knowledge Pool ruling (2011-06-01)**: *"Timing restrictions based on the card's type are ignored [for the exile cast]. Other restrictions, such as Spinal Embrace's 'Cast... only during combat' are not ignored."*

**CR 601.3**: A player can't cast a spell if doing so is illegal.

## The Pattern

```
KNOWLEDGE POOL ALONE (no lock):
  1. Opponent casts spell from hand → trigger fires
  2. Trigger resolves (stack is not empty — trigger is on it)
  3. Opponent may cast an exiled card "without paying its mana cost"
     → Casting here is allowed — the trigger gives them permission
  4. Hand spell is permanently exiled (can't be returned)

KNOWLEDGE POOL + TEFERI LOCK:
  1. Opponent casts spell from hand (during their main phase, ok)
  2. Knowledge Pool trigger fires, goes on stack
  3. Trigger resolves — the stack is NOT empty (trigger is resolving)
  4. Opponent offered: "cast a spell from among exiled cards"
     → Teferi restriction: opponents can only cast "any time they
        could cast a sorcery" = main phase + empty stack
     → Stack is NOT empty (trigger is resolving) → can't cast
  5. Opponent declines / can't cast the offered spell
  6. Hand spell is permanently exiled — it was already exiled by step 1
  7. The "if the player does" clause was met (spell was exiled)
     regardless of whether they cast from exile

  Result: every spell the opponent casts from hand is permanently
  exiled. They can never use Knowledge Pool's offer (stack is always
  non-empty when the trigger resolves). Their hand is stripped card
  by card. No meaningful spells can be cast.

LOCK CONDITIONS:
  → Teferi must be on the battlefield (restriction active)
  → Knowledge Pool must be on the battlefield (exile trigger active)
  → Lock affects all opponents
  → Permanents cast from hand ARE still exiled (that part resolves first)
  → Cards cast from NON-hand zones (graveyard, command zone, etc.)
     do NOT trigger Knowledge Pool, so commanders and flashback spells
     are unaffected
```

## Definitive Conclusions

- **Complete lock on hand spells.** Opponents casting from hand have their spells permanently exiled — no return, no recast.
- **The lock is one-sided.** Teferi restricts *opponents*, not you. You can freely use Knowledge Pool's offers (your turn, main phase, even with trigger on stack because YOUR restriction is different — Teferi doesn't restrict you at all).
- **Command zone is safe.** Commanders are cast from the command zone, not from hand, so Knowledge Pool doesn't trigger on them. Teferi still restricts when opponents can cast their commanders (sorcery speed), but the Knowledge Pool exile doesn't apply.
- **Flashback / graveyard casts are safe from Knowledge Pool.** Knowledge Pool only triggers on hand casts. Flashback, unearth, escape, etc. cast from graveyard — no exile trigger.
- **The restriction takes precedence over the permission.** Teferi ruling: "The restriction of Teferi's last ability takes precedence over that permission." Even if Knowledge Pool explicitly gives permission to cast at that moment, Teferi overrides it.
- **Counterspell interaction.** If you counter the Knowledge Pool trigger, the hand spell was already exiled (the exile happens during the trigger's resolution, but the exiling is the first effect of the trigger — if the trigger is countered before it resolves, the spell is NOT yet exiled).

## Canonical Example
**Knowledge Pool + Teferi, Mage of Zhalfir (hard lock):**
You control both. An opponent in their main phase casts Swords to Plowshares from hand. Knowledge Pool trigger fires. Trigger goes on stack. Opponent may respond (they're at priority). They don't or can't break the lock. Trigger resolves: "exile the hand spell" — done. "May cast a spell from among exiled cards" — stack is non-empty (just resolving), Teferi says no → they decline. Their Swords is gone forever. Repeat for every spell they try to cast from hand.

**Teferi, Time Raveler vs. Teferi, Mage of Zhalfir:**
Both Teferis restrict opponents to sorcery timing. With Knowledge Pool + either Teferi, the lock functions the same way.

## Commonly Confused With
- **P008 (Can't vs. May)** — P008 covers direct conflicts between "can't" and "can/may" effects. P021 is about a restriction on *timing/conditions* that makes a granted permission inaccessible — the restriction doesn't say "can't cast" directly, it says "only when X" and X is never true.
- **P007 (Priority Windows)** — P007 covers the window to respond between events. P021 is about whether a granted opportunity can be used within its window, given external casting restrictions.
- **P015 (Mana Ability Identification)** — Unrelated. Mana abilities bypass timing restrictions but are a specific exception only for mana abilities. Non-mana casts fully subject to Teferi's restriction.
