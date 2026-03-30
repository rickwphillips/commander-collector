---
id: p518
name: Endure (TDM) — Counter-or-Spirit-Token Choice, Zone Failure Fallback, and Noncreature Permanents
category: triggered
cr_refs: [603.2, 122.1, 111.1, 701.4]
tags: [endure, ability-word, spirit-token, counter, choice, zone-failure, noncreature, tarkir-dragonstorm, TDM, sulti, abzan]
created: 2026-03-30
examples_count: 4
---

# P518 — Endure (TDM) — Counter-or-Spirit-Token Choice, Zone Failure Fallback, and Noncreature Permanents

## Abstract
**Endure** (Tarkir: Dragonstorm, 2025) is an ability word used in TDM's Abzan/Sultai color combinations. "Endure N" means: "put N +1/+1 counters on [this permanent] **or** create an N/N white Spirit creature token." The controlling player chooses which effect at resolution — either grow the permanent in place OR create a new Spirit creature of the appropriate size. The critical rules detail: **if the permanent is no longer on the battlefield when the endure instruction resolves, the controller cannot put counters on it but will still create the Spirit token** — the Spirit creation is the fallback that always works. This applies to all permanents instructed to endure, including noncreature permanents (enchantments, artifacts, lands) — they can receive +1/+1 counters or produce a Spirit token identically to creatures.

## The Definitive Rules

**Official Ruling (2025-04-04):** *"You choose whether to put +1/+1 counters on the creature or create a Spirit token as the ability that includes the endure instruction is resolving. No player may take actions between the time you choose and the time that counters are added or tokens are created."*

**Official Ruling (2025-04-04):** *"If you can't put +1/+1 counters on the creature for any reason as an endure ability resolves (for example, if the creature is no longer on the battlefield), you'll just create a Spirit token."*

**Official Ruling (2025-04-04):** *"If a noncreature permanent is instructed to endure, the effect is the same. You can put +1/+1 counters on that permanent or create a Spirit token."*

**Official Ruling (2025-04-04):** *"If Anafenza dies at the same time as one or more other nontoken creatures you control, Anafenza's last ability triggers for each of those other nontoken creatures."*

## The Pattern

```
ENDURE N DEFINITION:

  "This permanent endures N" means:
    CHOOSE ONE:
    (A) Put N +1/+1 counters on this permanent.
    (B) Create an N/N white Spirit creature token.

  Choice is made at RESOLUTION (not when the ability is announced).
  No priority window between choice and execution.
  The choice is binary — you cannot split (e.g., 1 counter AND a 1/1 Spirit).

ZONE FAILURE FALLBACK:

  If the permanent is no longer on the battlefield when the endure instruction resolves:
    → You CANNOT put counters on it (it's not there to receive them).
    → You CAN still create the Spirit token (fallback).
    → Result: Spirit token is always created when the permanent has left the battlefield.

  Example: Fortress Kin-Guard ({1}{W}: 1/2) enters with "it endures 1."
    Response: opponent kills Fortress Kin-Guard in response to ETB trigger going on stack.
    When endure trigger resolves: Fortress Kin-Guard is in GY — can't receive counters.
    → Create a 1/1 white Spirit creature token anyway. The Spirit is your consolation.

  WHY THIS MATTERS:
    Endure effects can't be completely blanked by removal.
    If an opponent kills the creature in response, you still get the Spirit.
    The Spirit size equals N — so Endure 3 with the creature killed = free 3/3 Spirit token.

NONCREATURE PERMANENTS WITH ENDURE:

  Noncreature permanents can endure (enchantments, artifacts, etc.).
  +1/+1 counters on a noncreature permanent are legal — they just don't affect P/T
    (since the permanent doesn't have P/T).
  The counter is there if the permanent later becomes a creature (via animation effect).
  OR: you skip the counter and create the Spirit token instead.

  Example: A land with "it endures 2" can have:
    (A) Two +1/+1 counters placed on it (useful if the land might be animated later), OR
    (B) A 2/2 white Spirit token created.
    Generally (B) is better for noncreature permanents unless land-animation is planned.

ENDURE X:

  Some cards use variable X:
    Krumar Initiate ({1}{B}: 2/2): "{X}{B}, {T}, Pay X life: This creature endures X."
    → Endure X means N = X. You choose X when activating.
    → Endure 3 → create a 3/3 Spirit OR put 3 counters on Krumar Initiate.

    Warden of the Grove ({2}{G}: 2/2): "Whenever another nontoken creature you control
      enters, it endures X, where X is the number of counters on this creature."
    → X is determined at RESOLUTION (when the trigger resolves), not at trigger time.
    → This is consistent with all "where X =" abilities in Magic (CR 601.2).
    → If Warden has 4 counters when the trigger fires but loses 2 before resolution,
      the entering creature endures 2 (not 4).
    → If Warden has 4 counters at resolution: entering creature endures 4 → 4/4 Spirit OR +4/+4.

ENDURE IN DEATH TRIGGERS:

  Anafenza, Unyielding Lineage ({2}{W}: 2/2; First Strike):
    "Whenever another nontoken creature you control dies, Anafenza endures 2."
  Anafenza endures 2 for EACH nontoken creature that dies simultaneously.
  Multiple creatures dying at once = multiple triggers.
  Each trigger lets you choose: +2/+2 counters on Anafenza OR create a 2/2 Spirit.
  If Anafenza itself dies simultaneously with other creatures: Anafenza's trigger fires
    for each other nontoken creature. When the trigger resolves, Anafenza is gone.
    → Zone failure fallback: create 2/2 Spirit tokens for each trigger.

ENDURE AND REPLACEMENT EFFECTS:

  Doubling Season doubles token creation — if you choose to create a Spirit token,
    Doubling Season makes it two Spirit tokens.
  Doubling Season also doubles counters placed — if you choose +1/+1 counters,
    Doubling Season doubles them (e.g., Endure 3 → 6 counters).
  Vorinclex halves counters: Endure 3 → floor(3/2) = 1 counter.
  Hardened Scales: Endure 3 → 4 counters if choosing the counter option.

CHOOSING STRATEGICALLY:

  Choose COUNTERS when:
    - The permanent will be on battlefield for a while (value from ongoing buff)
    - The permanent benefits more from being larger (commander damage, P/T checks)
    - You have counter-doubling effects (Doubling Season, Hardened Scales)
    - You have token-prevention effects on the board (Meekstone, etc.)

  Choose SPIRIT TOKEN when:
    - The permanent has just entered (it might die soon)
    - You need additional bodies (blockers, sacrifice fodder, synergies)
    - You have token-doubling (Anointed Procession)
    - You have token synergies (Parallel Lives, Cathars' Crusade)
    - The permanent is a noncreature that won't benefit as much from counters
```

## Definitive Conclusions

- **Endure N is a binary choice at resolution** — counters on the permanent OR an N/N Spirit token; no splitting, no middle ground; made at resolution not trigger time.
- **Zone failure always produces the Spirit token** — if the permanent leaves the battlefield before the endure instruction resolves, the counter option fails and the Spirit is created automatically.
- **Noncreature permanents endure identically** — +1/+1 counters land on them (useful for future animation) or Spirit tokens are created.
- **Simultaneous deaths trigger Anafenza multiple times** — each nontoken creature death is a separate trigger; each resolves independently with its own choice.
- **Token doublers affect the Spirit creation path; counter doublers affect the counter path** — Doubling Season affects whichever path you choose.

## Canonical Example

**Warden of the Grove — Cascading Endure:**

You control Warden of the Grove ({2}{G}: 2/2) with 4 +1/+1 counters (making it a 6/6). You cast Inspirited Vanguard ({4}{G}: 3/2; "whenever this creature enters or attacks, it endures 2"). Before that trigger resolves, Warden's trigger fires: "another nontoken creature entered, it endures X where X = 4 (number of counters on Warden)."

Warden trigger resolves first (LIFO): Inspirited Vanguard endures 4. Choose: put 4 counters on Vanguard (making it 7/6) OR create a 4/4 Spirit token.

Then Inspirited Vanguard's own trigger resolves: endure 2. Choose: 2 more counters on Vanguard OR a 2/2 Spirit.

Potential result: Vanguard went from 3/2 to 9/8, or you have a 4/4 + 2/2 Spirit army.

**Example 2 — Zone Failure (Anafenza dies with her creatures):**

You control Anafenza, Unyielding Lineage ({2}{W}: 2/2 First Strike) and two creatures. An opponent casts Wrath of God. All three die simultaneously. Anafenza's trigger fires twice (for each of the two other nontoken creatures). When the triggers resolve, Anafenza is in the graveyard — can't receive counters. Both triggers create 2/2 Spirit tokens. You get two free 2/2 Spirits from a Wrath.

**Example 3 — Doubling Season Path Selection:**

You control Doubling Season ({5}{G}: "if an effect would put one or more tokens... put twice that many instead; if an effect would put one or more counters on a permanent... put twice that many instead"). You activate Krumar Initiate's endure 3 ({3}{B}: pay 3 life, endure 3).

Option A (counters): Doubling Season doubles → 6 +1/+1 counters on Krumar Initiate.
Option B (Spirit): Doubling Season doubles → two 3/3 white Spirit creature tokens.

Both are excellent. The counter path makes Krumar Initiate an 8/8. The Spirit path gives two 3/3s.

**Example 4 — Noncreature Permanent Endure:**

Warden of the Grove's trigger fires when a land enters (hypothetically, if a land-caring variant exists with Endure). The land endures 2.

Option A: Put 2 +1/+1 counters on the land. The land is now a land with 2 counters. Useful only if you plan to animate it (Nissa, Who Shakes the World etc.).
Option B: Create a 2/2 white Spirit token. Immediately useful.

## Commonly Confused With
- **P024 (Zone Change Object Identity)** — When the permanent leaves the battlefield, the counter path fails due to zone change. But the Spirit creation proceeds — this is a different mechanism from targeting (which would fizzle entirely).
- **P009 (Zone-Change Trigger Race)** — Endure's fallback (Spirit token when permanent leaves) is NOT a second trigger — it's a single instruction with an implicit fallback built into the rules wording ("if you can't put counters, create the Spirit").
- **P025 (Counter Placement — Cost vs. Effect)** — Doubling Season doubles both paths of Endure (tokens and counters) depending on which is chosen; both are effects (not costs).
- **P519 (Renew — TDM)** — Renew is a graveyard activation that applies counter-based effects to other creatures. Endure is an in-play trigger that self-buffs or creates Spirits.
