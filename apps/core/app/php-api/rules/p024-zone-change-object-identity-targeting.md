---
id: p024
name: Zone-Change Object Identity in Targeting
category: zones
cr_refs: [706.10, 603.7c, 400.7, 112.7a]
tags: [zone-change, new-object, targeting, delayed-trigger, sneak-attack, conjurers-closet, oblivion-ring, fizzle, specific-object]
created: 2026-03-28
examples_count: 2
---

# P024 — Zone-Change Object Identity in Targeting

## Abstract
When a permanent leaves and returns to the battlefield via a zone change (exile and return, death and reanimate, bounce and recast), it becomes a new object with no memory of its previous existence. Any delayed triggered ability, continuous effect, or reference that was tracking the *original* object can no longer find it — those effects see only permanents currently on the battlefield, and the new object is a stranger to them. Delayed triggers with "sacrifice that creature" or "return that card" fizzle if the object they're tracking has changed zones.

## The Definitive Rule

**CR 706.10**: *"Two objects are the same object only if they are in the same zone. If an object changes zones, it becomes a new object with no memory of its past."*

**CR 400.7**: *"An object that moves from one zone to another becomes a new object with no memory of or connection to its previous existence."*

**CR 603.7c**: *"A delayed triggered ability will not trigger if... the object it's supposed to affect is no longer in the zone it's supposed to be in."*

**CR 112.7a**: *"An effect that refers to a particular permanent can identify that permanent only by its current characteristics."* Once the permanent becomes a new object, the old reference is broken.

**Sneak Attack ruling (2020-08-07)**: *"You sacrifice the creature only if you still control it. If that creature has left the battlefield, even if it came back, you don't sacrifice it."*

## The Pattern

```
DELAYED TRIGGER WATCHING A SPECIFIC OBJECT:
  "At the beginning of the next end step, sacrifice [that creature]"
  "At the beginning of the next end step, return [that card]"

  Object leaves battlefield (zone change) → new object on return
  Delayed trigger looks for original object → not found (new object)
  Trigger fizzles

HOW TO EXPLOIT:
  1. Sneak Attack: sacrifice trigger watches for original object
     → Exile with Conjurer's Closet at end step (before sacrifice trigger resolves)
     → Object is now new after returning → sacrifice trigger fizzles → keep creature

  2. Act of Treason: "at the beginning of the next end step, return control"
     → Bounce the creature (return to hand / exile it)
     → Object no longer on battlefield → delayed trigger has nothing to return
     → Cast it on your next turn → you own it permanently

  3. Oblivion Ring: "when this leaves, return the exiled card"
     → This is a linked ability — specifically designed to track its exile-pile
     → Different from a simple delayed trigger: P011 covers this
     → Zone-change of the exiled card itself breaks the link (P003)

SAME-ZONE STAYS SAME OBJECT:
  Phasing (P016): not a zone change → same object → tracked by all effects
  Blink effects (exile+return): zone change → new object → all tracking broken
```

## Definitive Conclusions

- **Blink breaks Sneak Attack.** Any exile-and-return effect (Conjurer's Closet, Erratic Portal bounce, Deadeye Navigator) makes the creature a new object. Sneak Attack's sacrifice trigger cannot find it.
- **Act of Treason stolen creatures can be kept permanently** if you bounce them before the end step, then replay them. The "return control" delayed trigger watches the original object, which is now in a hand/graveyard. New object on battlefield has no obligation.
- **Death and return is NOT the same as phasing.** Phasing keeps the same object (P016). Zone changes create new objects (P003). This is the fundamental distinction.
- **Oblivion Ring's LTB is a linked ability, not a delayed trigger.** It uses a different mechanism (P011) and isn't subject to this pattern the same way. The exile IS tracked; what breaks it is the exiled *card* changing zones.
- **Delayed triggers track objects, not cards.** If the object is gone, even if the card came back, the trigger is lost.

## Canonical Example
**Sneak Attack + Conjurer's Closet (permanent haste creatures):**
Sneak Attack into Emrakul. At end step: Conjurer's Closet trigger fires, exile Emrakul, return it as new object. Sneak Attack's "sacrifice that creature" trigger resolves — Emrakul (original) is gone. Trigger fizzles. New Emrakul stays permanently, now under your normal control.

**Example 2 — Act of Treason bounce:**
Steal opponent's Eldrazi with Act of Treason (haste until end of turn, return control at beginning of next end step). Sacrifice it to Altar of Dementia (or bounce it to hand with a bounce spell before end step). The creature leaves the battlefield. The delayed "return control" trigger at end of step has nothing to find. You drew cards / milled; the Eldrazi goes to their graveyard as normal.

## Commonly Confused With
- **P003 (Zone Change Identity)** — P003 is the foundational rule this pattern applies. P024 specifically focuses on the *consequence* for delayed triggers and effect tracking.
- **P011 (Linked Ability Zone Reset)** — Linked ETB/LTB pairs (Oblivion Ring) have their own tracking through a special linked mechanism. P024 is about *non-linked* delayed triggers watching specific objects.
- **P016 (Phasing — Not a Zone Change)** — Phasing is the specific exception: not a zone change, same object, effects still track it. P024 applies to actual zone changes.
