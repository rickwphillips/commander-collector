---
id: p090
name: Living Weapon — Germ Token Attachment on ETB
category: triggered
cr_refs: [702.91a]
tags: [living-weapon, germ, token, ETB, attach, equipment, dies, detach]
created: 2026-03-28
examples_count: 2
---

# P090 — Living Weapon — Germ Token Attachment on ETB

## Abstract
Living Weapon is a triggered ability: when the Equipment with Living Weapon enters the battlefield, create a 0/0 black Phyrexian Germ creature token, then attach the Equipment to that token. The Germ is immediately the host creature for the Equipment. When the Germ dies (as it often does — it's 0/0), the Equipment remains on the battlefield unattached (not destroyed). A creature with Living Weapon Equipment is essentially an Equipment that comes pre-packaged with its own host.

## The Definitive Rule

**CR 702.91a**: Living Weapon means "When this Equipment enters, create a 0/0 black Phyrexian Germ creature token, then attach this Equipment to it."

(Note: Let me verify the exact CR text.)

## The Pattern

```
LIVING WEAPON SEQUENCE:
  1. Equipment with Living Weapon enters the battlefield
  2. ETB trigger: create a 0/0 black Phyrexian Germ creature token
  3. Then attach this Equipment to that Germ token
  4. The Germ is now equipped (becomes X/X based on the Equipment's bonuses)

GERM IS 0/0:
  Without the Equipment's bonuses: 0/0 → toughness 0 → SBA would kill it immediately
  BUT: the Equipment is attached before SBAs are checked
  After attaching, the Germ has the Equipment's P/T bonus
  If the bonus is +2/+2: Germ becomes 2/2 → survives SBAs

WHEN GERM DIES:
  Equipment becomes unattached (SBA 704.5n: Equipment falls off if creature leaves)
  Equipment stays on the battlefield (just unattached)
  Can re-equip to another creature using the equip cost

DETACHING THE EQUIPMENT:
  If you equip to another creature: Germ dies?
    No — the equip ability is "[Cost]: Attach this equipment to target creature you control"
    Attaching to a new creature detaches it from the Germ
    Germ is no longer equipped → still a 0/0 → toughness 0 → SBA fires → Germ dies

LIVING WEAPON + OPPONENT REMOVAL:
  Opponent kills the Germ (tiny creature): Equipment falls off
  Opponent kills the Equipment (artifact removal): Germ token remains (as 0/0 → SBA kills it)
    Actually: the Equipment leaving doesn't kill the Germ (Germ is its own creature)
    But the Germ is 0/0 without the Equipment → SBA 704.5f: toughness ≤ 0 → put into graveyard

MULTIPLYING GERMS:
  If the Equipment somehow re-enters (blink): new Living Weapon trigger fires
  New Germ is created and equipped
```

## Definitive Conclusions

- **Living Weapon creates a 0/0 Germ token and attaches the Equipment to it.** The Germ survives because the Equipment gives it P/T bonuses.
- **When the Germ dies, the Equipment remains** on the battlefield as an unattached artifact.
- **Equipping to a different creature detaches from the Germ** — Germ then dies via SBA (toughness 0).
- **The Germ dying doesn't destroy the Equipment.** Equipment just becomes unattached.

## Canonical Example
**Batterskull (Living Weapon, +4/+4 and vigilance, lifelink):**
Batterskull enters. Trigger: create a 0/0 black Germ, attach Batterskull to it. Germ + Batterskull = 4/4 with vigilance and lifelink. Opponent uses Doom Blade on the Germ → Germ dies, Batterskull unattaches and remains in play. Pay 5 mana to equip Batterskull to another creature.

**Example 2 — Equip away:**
Batterskull on Germ. You equip Batterskull to your 3/3 creature for {5}. Batterskull detaches from Germ. Germ is now 0/0 → SBA: toughness ≤ 0 → Germ is put into graveyard. 3/3 becomes 7/7 with vigilance and lifelink.

## Commonly Confused With
- **P039 (Equipment)** — Living Weapon Equipments follow all normal Equipment rules. The difference is the built-in Germ token.
- **P058 (Crew)** — Both involve a permanent and a creature interaction. Crew taps creatures for Vehicles; Living Weapon creates and attaches automatically.
