---
id: p527
name: Endure (TDM) + Planeswalker Loyalty Counters — Can Endure Put Loyalty Counters on Planeswalkers?
category: cross-mechanic
cr_refs: [306.5, 121.1, 701.4a]
tags: [endure, planeswalker, loyalty-counter, noncreature-permanent, counter-placement, tarkir-dragonstorm, TDM]
created: 2026-03-30
examples_count: 2
---

# P527 — Endure (TDM) + Planeswalker Loyalty Counters — Can Endure Put Loyalty Counters on Planeswalkers?

## Abstract
Endure grants "+1/+1 counters or create Spirit token" — both options are counters. The +1/+1 counter is a specific counter type. The question: can Endure's +1/+1 counter be placed on a planeswalker? **No.** Planeswalkers specifically track loyalty counters, which are a separate counter type from +1/+1 counters. Endure specifies "+1/+1 counters" — it cannot place loyalty counters on a planeswalker or any other permanent. A planeswalker cannot receive +1/+1 counters at all (they only track loyalty). Therefore, if Endure would put counters on a planeswalker, the counter path is blocked (planeswalker is an illegal target for "put +1/+1 counters"). However, Endure must choose ONE path at resolution: if the counter path is illegal, the controller MUST create a Spirit token instead (fallback, per P518 rules).

## The Definitive Rules

**CR 306.5 (Planeswalker Loyalty):** *"Loyalty is represented by loyalty counters on a planeswalker. A planeswalker that has loyalty is able to use planeswalker abilities. A planeswalker that no longer has loyalty is put into its owner's graveyard."*

**CR 121.1 (Counters):** *"Many objects have the potential to have counters on them. Counters are small indicators used on a permanent to represent its current value. Multiple types of counters exist; each type has its own name and symbol."* Loyalty counters are distinct from +1/+1 counters.

**Endure Definition (P518):** *"Endure N means put N +1/+1 counters on this permanent OR create an N/N white Spirit token."* The counter type is explicitly "+1/+1", not "loyalty" or generic counters.

**Official Ruling (Endure zone-failure, 2025-04-04):** *"If you can't put +1/+1 counters on the creature for any reason... you'll just create a Spirit token."* — Extended: any reason includes target being a planeswalker (illegal target for +1/+1).

## The Pattern

```
ENDURE + PLANESWALKER TARGETING:

  If you target a planeswalker with Endure's triggered effect:
    (A) Put N +1/+1 counters on it: ILLEGAL — planeswalkers don't have +1/+1 slots.
    (B) Create an N/N white Spirit token: LEGAL.
    → Since (A) is illegal, you MUST choose (B).
    → Result: Spirit token is created; planeswalker is unaffected.

  This is not a choice between two paths — it's: can't do (A), must do (B).

PLANESWALKER vs. +1/+1 COUNTER COMPATIBILITY:

  Planeswalkers track loyalty counters (their intrinsic counter type).
  Planeswalker loyalty is modified by:
    - Planeswalker abilities ("+2 loyalty" ability)
    - Effects that add/remove loyalty counters specifically
    - NOT by +1/+1 counter placements

  +1/+1 counters are for creatures and other permanents, not loyalty.
  A planeswalker cannot receive +1/+1 counters at all.
  The game rules explicitly prevent it (loyality ≠ +1/+1).

ENDURE TARGETING RULES:

  When Endure triggers, controller chooses TARGET creature.
  If the target is a creature: Endure can place counters or create Spirit.
  If the target is a planeswalker: illegal target for +1/+1 counter path → must create Spirit.
  If the target is a noncreature (artifact, enchantment, land): +1/+1 counters can be placed
    (even though P/T doesn't apply), or Spirit token created.
  If the target is an illegal permanent type (e.g., battle, no longer exists): neither path
    works → ability resolves with no effect.

EXAMPLE: PERSISTENT WARDEN + PLANESWALKER:

  Hypothetical: "Persistent Warden ({2}{G}: 2/2): Whenever another nontoken creature you
    control enters, it endures 2, where it = the entering creature."
  A planeswalker enters the battlefield (via a spell that breaks normal rules for testing).
  Persistent Warden's trigger fires with the planeswalker as target.
  Endure 2 on the planeswalker:
    (A) Put 2 +1/+1 counters: illegal for planeswalker.
    (B) Create two 2/2 white Spirits: legal.
    → Spirits are created; planeswalker is unaffected.

STRATEGIC IMPACT:

  Endure is typically used on creatures in combat (+1/+1 counters for grow, or Spirits for
    bodies). Planeswalker targeting is rare and edge-case.
  If forced to target a planeswalker (by ability wording), the Spirit token path always
    succeeds, and the planeswalker is unchanged.

NONCREATURE PERMANENTS VS. PLANESWALKERS:

  Noncreature permanents (enchantments, artifacts, lands, battles):
    Can receive +1/+1 counters (even if P/T doesn't apply mechanically).
    Example: Urza's Saga (enchantment) can receive +1/+1 counters from Endure
      (useful for future animation synergies).
  Planeswalkers:
    Cannot receive +1/+1 counters (loyalty is their intrinsic counter type).
    Endure will always fall back to Spirit token creation.

CAN ENDURE TARGET A BATTLE?

  Battles are permanents (enchantment subtype). Endure can target them.
  Battles don't have P/T (they have defense value), but they can receive counters.
  Endure can place +1/+1 counters on a battle (unusual but legal).
  Or create a Spirit token instead.
```

## Definitive Conclusions

- **Endure cannot place +1/+1 counters on planeswalkers** — planeswalkers track loyalty counters only; +1/+1 counter placement is illegal.
- **Targeting a planeswalker with Endure forces the Spirit token path** — since +1/+1 counters are illegal, the Spirit fallback applies automatically.
- **Noncreature permanents can receive +1/+1 counters** — battles, enchantments, artifacts, and lands can all receive +1/+1 counters from Endure (even if P/T doesn't apply mechanically).
- **Planeswalker and +1/+1 counter are incompatible counter types** — they are mutually exclusive; a permanent tracks one or the other, not both.

## Canonical Example

**Warden of the Grove Enters Planeswalker (Hypothetical):**

A planeswalker somehow enters the battlefield (via ability, not normal casting). Warden of the Grove ({2}{G}: 2/2; "whenever another nontoken creature enters, it endures X where X = number of counters on Warden") is on the battlefield with 3 +1/+1 counters.

Warden's trigger fires with the planeswalker as target: endure 3.

Counter path: put 3 +1/+1 counters on planeswalker — ILLEGAL (planeswalkers don't accept +1/+1).
Spirit path: create a 3/3 white Spirit token — LEGAL.

Result: 3/3 Spirit token is created; planeswalker is unaffected (no counters added, no loyalty changed).

**Example 2 — Noncreature Permanent vs. Planeswalker:**

Endure 2 with two targets available:
  Target A: Urza's Saga (noncreature enchantment).
  Target B: Jace, the Mind Sculptor (planeswalker).

If you target Urza's Saga: choose +2/+2 counters (stored for future animation) or 2/2 Spirit.
If you target Jace: +2/+2 illegal → must create 2/2 Spirit (Jace is unaffected).

## Commonly Confused With
- **P025 (Counter Placement — Cost vs. Effect)** — P025 covers counter doubling and cost/effect distinctions. P527 clarifies counter types (loyalty vs. +1/+1) are incompatible.
- **P518 (Endure)** — P518 covers zone-failure fallback for creatures. P527 extends that to planeswalker targeting (a different fallback reason: counter type incompatibility).
- **P306 (Planeswalker Basics)** — General planeswalker rules; P527 applies those rules to Endure interaction specifically.
