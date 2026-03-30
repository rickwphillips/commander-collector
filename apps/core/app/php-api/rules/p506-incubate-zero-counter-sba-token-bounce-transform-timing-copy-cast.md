---
id: p506
name: Incubate Deep Edge Cases — Zero-Counter SBA, Token Bounce, Instant-Speed Transform Response, and Copy-vs-Cast
category: triggered
cr_refs: [111.7, 704.5c, 704.5f, 702.155, 701.25a, 603.3]
tags: [incubate, incubator-token, zero-counter, SBA, token-ceases-to-exist, bounce, unsummon, transform, instant-speed, board-wipe, wrath, copy-not-cast, chrome-host-seedshark, sunfall, march-of-the-machine, MOM]
created: 2026-03-29
examples_count: 5
---

# P506 — Incubate Deep Edge Cases — Zero-Counter SBA, Token Bounce, Instant-Speed Transform Response, and Copy-vs-Cast

## Abstract

Incubate creates a double-faced Incubator artifact token whose front face is not a creature. Four non-obvious edge cases arise: (1) incubating 0 creates a 0-counter token that dies to SBA immediately if transformed; (2) bouncing the Incubator token to hand causes it to cease to exist (tokens in non-battlefield zones vanish per SBA); (3) the transform ability uses the stack and can be activated at instant speed, creating a response window before board wipes resolve; and (4) Chrome Host Seedshark's "whenever you cast" trigger requires an actual cast — spell copies don't trigger it, and X=0 spells incubate 0.

## The Definitive Rules

**CR 111.7**: *"A token that has left the battlefield can't move to another zone or come back onto the battlefield. If a token would move from the battlefield to another zone, that token ceases to exist instead."* Wait — actually the CR is more precise:

**CR 111.7 (token zone rule)**: Tokens cease to exist in zones other than the battlefield. This is checked as a state-based action. If a token is moved to a non-battlefield zone (hand, graveyard, exile), it ceases to exist the moment state-based actions are checked after the move.

**CR 704.5c**: *"If a creature has toughness 0 or less, it's put into its owner's graveyard."* A transformed Incubator token is a 0/0 Phyrexian artifact creature. Its toughness is 0 plus the +1/+1 counters on it. If it has zero counters, toughness = 0 → immediate SBA death.

**CR 704.5f**: Tokens cease to exist if they are in a zone other than the battlefield or are phased out. This applies immediately after a token changes zones.

**CR 702.155 (Incubate N)**: *"Create an Incubator token with N +1/+1 counters on it. It has '{2}: Transform this token.'"* Nothing prevents N from being 0. A 0-counter Incubator token is a legal game object but a 0-counter transformed Incubator is a 0/0 creature (toughness = 0 + 0 counters = 0) → SBA kills it.

**Transform ability uses the stack**: The ability "{2}: Transform this token" is an activated ability that goes on the stack (it is not a mana ability). Opponents can respond to it.

**CR 603.3 / "cast" requirement**: Chrome Host Seedshark says "whenever you *cast* a noncreature spell." A copy of a spell placed on the stack is not cast. CR 707.10: *"To copy a spell, activated ability, or triggered ability means to put a copy of it onto the stack. A copy of a spell or ability isn't cast or activated."*

**2023-04-14 ruling (Chrome Host Seedshark)**: *"If the noncreature spell has {X} in its mana cost, use the value chosen for X when calculating that spell's mana value."* So if X=0, the mana value used for incubate is 0.

## The Pattern

```
INCUBATE 0 — ZERO-COUNTER TOKEN:
  Sunfall exiles no creatures → incubate 0
  → Incubator token enters with 0 +1/+1 counters
  → Front face: colorless artifact (not a creature) → safe from SBA 704.5c
  → Token can sit on battlefield indefinitely in artifact form
  → If you pay {2} to transform it:
      Back face: 0/0 Phyrexian artifact creature
      0 counters → toughness 0 → SBA 704.5c immediately kills it
  → Result: transforming a 0-counter Incubator is always pointless unless you
    can add counters BEFORE or AS PART OF the transformation (counters via
    proliferate, bolster, etc. must already be on the token)

  CONFIRMED by 2023-04-14 Sunfall ruling:
    "If Sunfall resolves but doesn't exile any creatures, you'll incubate 0,
    creating an Incubator token but putting no +1/+1 counters on it."

TOKEN BOUNCE (UNSUMMON, VAPOR SNAG, ETC.):
  Incubator token (front face, artifact) is bounced with Unsummon
  → Token moves to owner's hand
  → State-based actions checked: token in non-battlefield zone → ceases to exist
  → Token disappears from hand immediately
  → All +1/+1 counters on it are lost
  → Cannot be replayed, tutored, or returned from graveyard (it never reached GY)

  Key distinction: the token briefly passes through hand (triggering any "when
  you return a permanent to your hand" effects if they exist) before ceasing
  to exist. But it cannot be cast from hand — it's gone.

  Same applies to graveyard: if the Incubator token (front face) somehow went
  to graveyard (e.g., sacrificed or destroyed), it ceases to exist there.
  Cannot be reanimated from the graveyard.

  NOTE: Incubator tokens are ARTIFACTS on their front face, not creatures.
  A board wipe that destroys "all creatures" (Wrath of God) does NOT destroy
  an untransformed Incubator. Only "all permanents" or "all artifacts" board
  wipes remove untransformed Incubators.

INSTANT-SPEED TRANSFORM AS BOARD WIPE RESPONSE:
  The "{2}: Transform this token" ability can be activated any time you have
  priority, including in response to a spell or ability on the stack.

  Scenario — responding to a sorcery-speed board wipe (e.g., Day of Judgment):
    → Opponent casts Day of Judgment (destroys all creatures)
    → You have Incubator token with 2+ counters on battlefield
    → You activate transform in response (pays {2}, goes on stack)
    → Transform resolves: Incubator becomes a 2/2+ Phyrexian artifact creature
    → Day of Judgment resolves: destroys all creatures including your new creature
    → Wasted! You transformed it just to have it die

  Scenario — responding to an instant board wipe already in the transform window:
    The Incubator IS better served staying as an artifact (immune to creature
    board wipes) UNTIL you want a blocker/attacker. Transform in response only
    makes sense if the board wipe hits artifacts too, or if you need the
    creature body for something specific (e.g., to sacrifice, to trigger
    creature-matters effects).

  Scenario — Indestructible shenanigans:
    If the Incubator token had been granted Indestructible (e.g., via Heroic
    Intervention), then transforming before a Wrath means the creature form
    survives. This is a legitimate play line.

  NOTE: Opponents can respond to the transform activation before it resolves.
  The activation uses the stack — it can be Stifled, or an opponent can kill
  the Incubator token in response to prevent the transform from resolving.

CHROME HOST SEEDSHARK — COPIES DON'T TRIGGER:
  Seedshark: "Whenever you cast a noncreature spell, incubate X."

  Copies are NOT cast (CR 707.10). These do NOT trigger Seedshark:
    - Copies via Twincast, Fork, Reverberate (copy = not cast)
    - Copies from Storm (each storm copy is not cast)
    - Copies from Thousand-Year Storm, Melek, etc.

  These DO trigger Seedshark (they are actual casts):
    - Flashback, retrace, escape (all are cast from non-hand zones)
    - Foretell cast (cast from exile)
    - Overloaded spells (still cast)
    - Spree spells (cast with additional modes)

  X SPELLS AND INCUBATE VALUE:
    Seedshark triggers on casting a noncreature spell with X in its cost
    → X is the value chosen for X when the spell was cast (not just the base cost)
    → Banefire with X=5 → incubate 7 (5 + {R} = MV 6... wait: MV = chosen X + other)
    → Example: Torment of Hailfire X=3, {2}{B} → MV = 3+2+1 = 6 → incubate 6
    → Example: Any spell with X=0 → MV = 0 + other costs → incubate = that MV
    → Example: A pure {X} spell (no other costs) cast with X=0 → MV = 0 → incubate 0
      → Creates 0-counter Incubator → see INCUBATE 0 section above
```

## Definitive Conclusions

- **Incubate 0 is legal.** You get an Incubator token with no counters. It sits safely as an artifact. Transforming it immediately kills it (0 toughness SBA). Only useful if you can add counters later.
- **Bouncing an Incubator token destroys it permanently.** Tokens cease to exist in non-battlefield zones (SBA 704.5f). Counters are lost. The token cannot return from hand or graveyard.
- **The transform activation uses the stack.** It can be responded to, Stifled, or used to respond to other spells/abilities. Transforming before a "destroy all creatures" wipe only saves the creature if it also has indestructibility — untransformed Incubators are immune to creature-only wipes already.
- **Chrome Host Seedshark's trigger requires a real cast.** Copies (Storm copies, Fork copies, Reverberate copies) do not trigger it. X=0 spells do trigger it, creating a 0-counter Incubator.
- **Untransformed Incubators are artifacts, not creatures.** Standard creature board wipes (Wrath of God, Day of Judgment) leave them untouched.

## Canonical Examples

**Sunfall with no creatures:**
Sunfall resolves with an empty battlefield. You incubate 0. An Incubator token with 0 counters enters. You can pay {2} to transform it — but when it becomes a 0/0 Phyrexian creature, SBA immediately kills it. The incubate 0 is meaningful only as setup for future counter-adding effects.

**Unsummon targeting an Incubator:**
Opponent Unsummons your Incubator token (3 counters). It moves to your hand. Before you can do anything, SBA check: token in non-battlefield zone → ceases to exist. You don't get to replay it. The 3 counters are gone.

**Chrome Host Seedshark + Storm:**
You cast Grapeshot with storm (storm count 5). Chrome Host Seedshark triggers from the original cast: incubate X where X = MV of Grapeshot = 1 → incubate 1 (one 1-counter Incubator). The five storm copies do NOT trigger Seedshark. Total: 1 Incubator, not 6.

**Chrome Host Seedshark + Fireball X=0:**
You cast Fireball choosing X=0 (MV = 0 + {R} = 1). Seedshark triggers: incubate 1 → one Incubator with 1 counter. Useful if you just wanted the Incubator and had no other spells.

**Instant-speed transform + board wipe:**
Opponent casts Wrath of God. You have two Incubators with 4 counters each. You choose not to transform — Wrath only hits creatures. Incubators survive. This is the correct play if your goal is to keep the resources. Transforming in response would have created two 4/4 creatures that then died to Wrath.

## Commonly Confused With
- **P460 (Incubate basics)** — P460 covers what incubate is, the double-faced token structure, and summoning sickness on the back face. P503 covers zero-counter edge cases, token bounce, instant-speed transform responses, and the copy-not-cast distinction.
- **P003 (Zone Change Identity)** — The token-ceases-to-exist rule is a special case of token zone behavior, separate from the "new object" rule for non-tokens. Tokens don't just become new objects in other zones; they cease to exist entirely.
- **P499 (Battles)** — Also from MOM; battles are different zone-based objects with different targeting rules.
