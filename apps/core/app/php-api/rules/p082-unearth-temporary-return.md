---
id: p082
name: Unearth — Temporary Graveyard Return with Exile Lock
category: zones
cr_refs: [702.84a]
tags: [unearth, graveyard, return, haste, exile, end-step, replacement, any-leave-battlefield]
created: 2026-03-28
examples_count: 2
---

# P082 — Unearth — Temporary Graveyard Return with Exile Lock

## Abstract
Unearth returns a creature from the graveyard to the battlefield with haste, but exiles it at the beginning of the next end step. More importantly, if the unearthed creature would leave the battlefield for ANY reason (bounce, destroy, sacrifice), it's exiled instead. This exile-on-any-exit is a replacement effect — the creature can never return to graveyard, hand, or library from the battlefield after unearthing. Unearth is sorcery-speed and can only be activated from the graveyard.

## The Definitive Rule

**CR 702.84a** (verbatim): *"Unearth is an activated ability that functions while the card with unearth is in a graveyard. 'Unearth [cost]' means '[Cost]: Return this card from your graveyard to the battlefield. It gains haste. Exile it at the beginning of the next end step. If it would leave the battlefield, exile it instead of putting it anywhere else. Activate only as a sorcery.'"*

## The Pattern

```
UNEARTH SEQUENCE:
  1. Activate unearth from graveyard (sorcery-speed): pay cost, return to battlefield
  2. Creature enters battlefield (ETBs trigger), has haste
  3. A delayed triggered ability is created: "at beginning of next end step, exile this"
  4. A static ability is on the creature: "if this would leave the battlefield, exile it instead"

EXILE-ON-ANY-EXIT (replacement effect):
  If the creature would go to ANY zone other than exile:
    → Goes to exile instead
  Examples:
    Destroyed: exile (not graveyard — can't persist/undying from here)
    Sacrificed: exile (not graveyard)
    Bounced with Unsummon: exile (not hand!)
    Exiled by opponent: exile (same destination — replacement does nothing visible here)
  This prevents ANY graveyard recursion on the unearthed creature

PERSIST/UNDYING INTERACTION:
  Persist: "when this dies, if no -1/-1 counter, return to battlefield with -1/-1"
  Unearth: "if this would go to graveyard from battlefield, exile instead"
  When unearthed creature "dies": instead of going to graveyard, it's exiled
  Persist trigger fires on "put into graveyard from battlefield" — but the replacement redirects to exile
  → The creature never goes to graveyard → persist trigger doesn't fire
  → Unearth's exile replacement wins (prevents persist)

BOUNCE AND UNEARTH:
  Opponent bounces the unearthed creature
  "Return to hand" = leaving the battlefield
  Unearth's exile replacement: exile instead of going to hand
  Creature goes to exile — NOT the hand
  This protects against a common blowout (opponent bouncing your unearthed value creature)

DELAYED END-STEP TRIGGER:
  At beginning of NEXT end step: trigger exiles the creature
  If the creature is already in exile (left battlefield earlier): trigger finds nothing
  If the creature somehow avoided dying (indestructible + not sacrificed + not bounced):
    End step: exiled by the delayed trigger
  Note: indestructible + unearth → creature can't be destroyed → only end-step exile removes it

HASTE DURATION:
  Haste is granted by unearth's static ability (while on battlefield from unearth)
  Lasts until the creature leaves the battlefield
```

## Definitive Conclusions

- **Unearthed creatures are exiled instead of going to ANY other zone.** Can't persist, undying, regrow, or bounce to hand.
- **The exile replacement fires before any zone-change effects.** Persist/undying don't trigger because the creature never reaches the graveyard.
- **Haste enables attacking immediately.** Great for ETB/attack value.
- **End-step exile is a delayed trigger.** If creature already left, trigger fizzles.
- **Sorcery-speed only.** Can't unearth in response or on opponent's turn.

## Canonical Example
**Rotting Regisaur (Unearth {2}{B}):**
Pay {2}{B}, Rotting Regisaur returns from graveyard as a 7/6 with haste. Attack for 7. Opponent tries to bounce it with Unsummon → exile instead (not hand). Regisaur is gone. At end step: delayed trigger would exile it, but it's already in exile — does nothing.

**Example 2 — Unearth + Persist interaction:**
Unearthed creature has persist. Opponent destroys it. Exile replacement: instead of going to graveyard, it's exiled. Persist trigger requires "put into a graveyard from the battlefield" — the creature went to exile, not graveyard → persist doesn't fire. Creature is simply exiled, permanently.

## Commonly Confused With
- **P062 (Escape)** — Escape casts from graveyard normally. Unearth returns directly to battlefield. Unearth has the exile-on-any-exit lock; Escape doesn't.
- **P038 (Persist/Undying)** — Persist looks for "goes to graveyard." Unearth replaces the graveyard destination with exile. Persist never triggers on an unearthed creature's death.
