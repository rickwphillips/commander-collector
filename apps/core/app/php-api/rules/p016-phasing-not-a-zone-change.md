---
id: p016
name: Phasing — Not a Zone Change
category: zones
cr_refs: [702.26b, 702.26d, 702.26f, 702.26g, 702.26i, 702.26j]
tags: [phasing, zone-change, LTB, ETB, aura, equipment, counters, token, teferi, banishing-light, as-long-as, indirectly]
created: 2026-03-28
examples_count: 1
---

# P016 — Phasing: Not a Zone Change

## Abstract
Phasing is a status change, not a zone change. A permanent that phases out is treated as if it doesn't exist for all game purposes — it can't be targeted, its static abilities go offline, its triggers can't fire — but it never left the battlefield. This means no "leaves the battlefield" triggers fire when it phases out, and no "enters the battlefield" triggers fire when it phases back in. Counters remain, Auras and Equipment travel with the host, tokens survive, and choices made on entry are remembered. Continuous effects with "for as long as" durations expire because they can no longer see the permanent, freeing it from those effects when it returns.

## The Definitive Rule

**CR 702.26b**: *"Except for rules and effects that specifically mention phased-out permanents, a phased-out permanent is treated as though it does not exist."*

**CR 702.26d**: *"The phasing event doesn't actually cause a permanent to change zones or control, even though it's treated as though it's not on the battlefield... Zone-change triggers don't trigger when a permanent phases in or out. Tokens continue to exist on the battlefield while phased out. Counters and stickers remain on a permanent while it's phased out. Effects that check a phased-in permanent's history won't treat the phasing event as having caused the permanent to leave or enter the battlefield."*

**CR 702.26g**: Auras, Equipment, and Fortifications attached to a phasing-out permanent phase out indirectly — they go with the host and return still attached.

**CR 702.26f**: Continuous effects with "for as long as" durations expire when the permanent phases out, because they can no longer track it.

## The Pattern

```
WHEN a permanent phases out:
  ✗ No LTB triggers fire
  ✗ No ETB triggers fire on phase-in
  ✓ Counters remain
  ✓ Tokens survive
  ✓ Entry choices remembered
  ✓ Attached Auras/Equipment phase out indirectly (travel with host)
  ✗ "As long as" effects expire (can no longer track the permanent)
  ✓ Permanent phases back in with no summoning sickness

COMPARED TO zone change (goes to graveyard, exile, etc.):
  Zone change DOES trigger LTB/ETB
  Zone change DOES remove counters (122.2)
  Zone change DOES create new object (706.10)
  Zone change DOES detach Auras/Equipment

Phasing = temporary nonexistence with full memory intact
Zone change = permanent new identity with no memory
```

## Definitive Conclusions

- **No LTB, no ETB.** Phasing never triggers zone-change abilities. Banishing Light, Oblivion Ring, "when X dies" effects — all silent during phasing.
- **Permanents are fully nonexistent while phased out.** Can't be targeted, static abilities offline, triggered abilities can't fire, can't attack or block.
- **Auras and Equipment phase out indirectly.** They travel with the host and return still attached, with no "becomes attached/unattached" triggers.
- **"As long as" effects expire** when the tracked permanent phases out. The permanent returns freed from those effects.
- **Tokens survive phasing.** They phase back in normally (changed from older rules that destroyed phased-out tokens).
- **Counters persist.** A +1/+1 counter on a phased-out creature is still there when it phases back in.
- **No summoning sickness on phase-in.** The permanent was on the battlefield previously; it can attack and tap immediately.
- **Targeted spells become illegal** if the target phases out before they resolve. Triggers/spells with illegal targets fizzle on resolution per normal rules.

## Canonical Example
**Teferi's Protection:**

Cast in response to an opponent's Banishing Light ETB trigger targeting your creature. Your creature phases out. Banishing Light's ETB trigger resolves: target is now phased out (treated as nonexistent) → illegal target → trigger fizzles → your creature was never exiled. Banishing Light sits on the battlefield pointing at nothing. Your creature phases back in at your next untap step with all counters, attached Auras, and no ETB triggers. Banishing Light's "leaves the battlefield" clause never triggers because your creature never left.

**Aura on phased-out creature:** Your Aura enchanting your creature phases out with it indirectly (702.26g). It returns still attached. No "becomes attached/unattached" triggers fire at any point.

**Control effect with "for as long as":** Opponent gains control of your creature "for as long as [condition]." Your creature phases out. The control effect expires (702.26f — can no longer track the permanent). Your creature phases back in under your control.

## Commonly Confused With
- **P003 (Zone Change Identity)** — Zone changes create new objects with no memory. Phasing is the opposite: same object, full memory, just temporarily nonexistent. These are fundamentally different.
- **P011 (Linked Ability Zone Reset)** — P011 covers how linked ETB/LTB ability pairs reset when an object changes zones. Phasing doesn't trigger that reset because there's no zone change — the linked pair is intact when the permanent phases back in.
- **P009 (Zone-Change Trigger Race)** — P009 only applies when zone-change triggers fire. Phasing produces no zone-change triggers, so P009 is irrelevant.
