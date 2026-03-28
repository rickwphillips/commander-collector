---
id: p003
name: Zone Change Identity
category: zones
cr_refs: [400.7, 603.6, 706.10, 903.9a, 903.9b, 903.10a]
tags: [zone, graveyard, exile, commander, copy, token, new-object, identity, leaves-battlefield, LKI]
created: 2026-03-28
examples_count: 5
---

# P003 — Zone Change Identity

## Abstract
When an object moves between zones, the game may treat it as the **same object** (continuous effects persist) or as a **new object** (no memory of previous state). The distinction determines whether counters carry over, whether "last known information" applies, whether commander tax tracks, and whether damage-tracking resets.

## The Definitive Rule

**CR 400.7** — If a continuous effect modifying an object's characteristics applies to it in a non-battlefield zone, it continues to apply when it moves to the battlefield and vice versa, for the duration of the effect.

**CR 706.10** — An object that moves to a new zone is a new object with no memory of its previous existence, UNLESS an effect specifically says otherwise. This is the core rule.

**CR 603.6c** — Leaves-the-battlefield triggers use **last known information (LKI)** — the game looks at the permanent's state just before it left the battlefield.

**CR 903.9a** — Commander returns from graveyard/exile to command zone as a state-based action. The card retains the commander designation (903.3) because that's an attribute of the card, not a characteristic.

**CR 903.10a** — Commander damage tracks "the same commander over the course of the game." If the commander leaves and returns, it IS a new object — combat damage tracking resets.

## The Pattern

```
WHEN object moves to a new zone:
  → It is a NEW OBJECT (706.10)
  → Previous counters, damage, auras, equipment = gone
  → Triggered abilities referencing "that permanent" lose the object

EXCEPTIONS (same object persists):
  → The commander designation persists through all zones (it's an attribute, not a characteristic)
  → Continuous effects with duration persist if the effect says so (400.7)
  → "Last known information" lets triggers look backward at what the object was (603.6c)

COMMANDER-SPECIFIC:
  → Commander tax accumulates per casting from command zone — this IS tracked because tax tracks the commander designation, not the object instance
  → Combat damage tracking RESETS because it refers to "the same commander" as an object, and the returning commander is a new object
```

## Definitive Conclusions

- **+1/+1 counters on a creature that dies and returns (undying/persist)**: New object. Counters don't carry over. Undying's counter is added ON THE NEW OBJECT as it enters.
- **Auras and Equipment**: When a creature dies and returns, Auras fall off (their attachment link is severed). They don't automatically re-attach.
- **Commander tax**: Persists across zone changes. Tax doesn't track the object instance — it tracks how many times you've cast the commander card from the command zone (the designation persists).
- **Commander combat damage**: RESETS if the commander leaves and returns. The returning commander is a new object (706.10), and 21-damage SBA tracks "the same commander."
- **Copies**: A copy of a permanent is a new object. Copying a card that was on the battlefield as a particular instance doesn't inherit counters, damage, or history.
- **"Last known information" for triggers**: "When [X] dies, do something to it in the zone it moved to" — the trigger checks for the card in the graveyard. If it left the graveyard before the trigger resolved, the trigger finds nothing and fizzles for that part.
- **Tokens**: Leave the battlefield → new zone (even momentarily) → cease to exist (SBA 704.5d). Tokens have no representation in other zones.

## Canonical Example
Skullclamp equips a 1/1 token. Token dies. "When equipped creature dies, draw 2 cards" triggers. The trigger fires (603.10a looks back to the battlefield state), and you draw 2. The token itself ceases to exist (SBA) but the trigger already captured the event from LKI.

## Additional Examples

**Example 2 — Undying + Counters:**
A 2/2 with undying dies with no -1/-1 counter. Returns as new object, enters with one -1/-1 counter (from undying's replacement effect — applied as it enters). The new object has exactly that counter and no memory of anything else.

**Example 3 — Aura after return:**
You control an enchanted creature. It dies. The Aura goes to graveyard (SBA 704.5m). If the creature returns to the battlefield (new object), the Aura does not re-attach. A new Aura must be cast.

**Example 4 — Commander combat damage reset:**
You've been dealt 15 combat damage by your opponent's Commander. It gets exiled, then returned to command zone, cast again, and attacks you for 6. Total combat damage dealt by this commander (new object): 6. You do NOT lose the game because the 15 damage was dealt by a different "same commander" object instance.

**Example 5 — Clone copying a creature with history:**
You cast Clone as a copy of a 5/5 with 3 +1/+1 counters. Clone enters as a 5/5 (copying base characteristics), but it does NOT copy the counters — counters are not copiable values (they're applied in layer 7c after the copy effect in layer 1). Clone is a 5/5, not an 8/8.

## Commonly Confused With
- **P002 (Replacement vs. Trigger)** — "As it enters" effects apply to the new object as it arrives, not to the old instance.
- **P004 (Layer Dependency)** — Copy effects (layer 1) determine what the copiable values are; counters (layer 7c) are not copiable.
