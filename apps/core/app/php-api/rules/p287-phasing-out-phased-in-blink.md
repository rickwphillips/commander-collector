---
id: p287
name: Phasing — Permanents That Temporarily Leave Without Leaving
category: replacement
cr_refs: [702.26a, 702.26b, 702.26c, 702.26d, 702.26e, 702.26f, 702.26g, 702.26h, 702.26i, 702.26j]
tags: [phasing, phase-out, phase-in, untap-step, blink-like, Teferi-Hero-of-Dominaria, Teferi-Time-Raveler, Smoke-and-Mirrors, Reality-Ripple, Vodalian-Soldiers, Teferi-Mage-of-Zhalfir]
created: 2026-03-29
examples_count: 2
---

# P287 — Phasing — Permanents That Temporarily Leave Without Leaving

## Abstract
Phasing is a keyword (and effect) from early Magic that causes permanents to "phase out" — temporarily removing them from the game without leaving the battlefield. A phased-out permanent is treated as though it doesn't exist, but it's NOT in any other zone; it stays attached to its position as if temporarily invisible. Phased-out permanents don't untap during their controller's untap step and don't trigger "leaves the battlefield" abilities. They phase back in at the start of their controller's untap step. Modern cards use "phase out" as an effect (to protect permanents from removal) and "phasing" as a keyword for repeated phasing.

## The Definitive Rules

**CR 702.26a** (verbatim): *"Phasing is a static ability that modifies the rules of the untap step. During each player's untap step, before the active player untaps their permanents, all phased-in permanents with phasing that player controls phase out, and all phased-out permanents that player controlled when they phased out phase in."*

**CR 702.26d** (verbatim): *"The phasing event is treated as though the permanent is untapping or tapping for purposes of abilities that trigger on those events, but it's not considered to have untapped or tapped."*

**CR 702.26e** (verbatim): *"If a permanent phases out, its status doesn't change. If it was tapped when it phased out, it's still tapped when it phases back in."*

**CR 702.26f** (verbatim): *"If a permanent phases out, auras and Equipment that were attached to it come with it. Fortifications that were attached to it come with it. Equipment, Fortifications, and Auras that were attached to it do not. They remain in the same zone they were in and become unattached from it."*

**CR 702.26g** (verbatim): *"If a permanent phases out or a permanent is exiled while it is attached to a permanent, the phased-out or exiled permanent is no longer attached to the other permanent."*

**CR 702.26h** (verbatim): *"If an effect causes a permanent to phase out, the permanent's controller is the player who last controlled it before it phased out."*

**CR 702.26i** (verbatim): *"Phased-out permanents are treated as though they don't exist. They can't be the targets of spells or abilities, they're not considered to be attacking or blocking, they don't count toward the game state or affect the game in any other way."*

## The Pattern

```
PHASING MECHANICS:
  A permanent with Phasing: at start of controller's untap step, if phased in → phase out.
  If phased out: at start of controller's untap step → phase back in.
  Rhythm: alternates every turn. Phased in on even turns, phased out on odd (or vice versa).
  Old cards (Mirage era): Phasing as a permanent ability.

PHASE OUT (effect):
  Modern cards with "phase out" as an instant/sorcery/triggered effect:
  "Target permanent phases out." (or "phases out until end of turn")
  The permanent disappears until the start of its controller's next untap step.
  Common modern use: protecting your permanents from removal.

PHASED-OUT RULES:
  While phased out:
    - Treated as though it doesn't exist
    - Can't be targeted by spells or abilities
    - NOT "leaving the battlefield" — no zone change
    - Auras and Equipment that were ON it (attached TO the phasing permanent): phase out WITH it
    - Auras and Equipment that IT was attached to (as a host): the host phases out, they stay attached? No:
      CR 702.26f: "Fortifications attached to it come with it. Equipment, Fortifications, and Auras that were
      attached to it DO NOT. They remain in the same zone and become unattached."
      Wait: re-reading: "auras and equipment that were attached to it" vs "equipment attached to IT" (the perm).
      If a creature phases out: auras enchanting it and equipment on it → they phase out WITH the creature.
      If a land phases out: fortifications on it → they phase out WITH the land.
      But: if the permanent was an aura or equipment ATTACHED TO SOMETHING ELSE → the aura/equipment stays,
      the host phases out. The aura/equipment becomes "unattached" from the now-phased-out permanent.

  CRITICAL RULE: "Leaves the battlefield" triggers do NOT fire when a permanent phases out.
  Phasing is not a zone change.
  Important for:
    - "When this creature dies" → phasing out doesn't trigger "dies"
    - "When this creature leaves the battlefield" → phasing out doesn't trigger this
    - Tokens: tokens CAN phase out. Tokens that are phased out don't cease to exist.
      When a token is phased out, it's treated as though it doesn't exist.
      When it phases back in: it's still a token.

  STATUS PRESERVATION (CR 702.26e):
    If a permanent was tapped when it phased out: it's still tapped when it phases back in.
    +1/+1 counters, damage marked on it: all persist through phasing.
    The phased-out permanent is "frozen" in its exact state.

PHASE OUT + EXILE-BASED REMOVAL:
  Opponent tries to exile your creature: in response, phase it out.
  Now it phases out: it's "not in any zone" → it can't be targeted (it doesn't exist).
  The exile effect is countered (no valid target).
  Wait: if the exile effect is an ability or spell with the creature as target:
    The creature phases out AFTER the targeting resolves (you phase it out in response).
    The spell is on the stack with the creature as target.
    If the creature is phased out when the spell resolves: is the target illegal?
    CR 702.26i: "Phased-out permanents are treated as though they don't exist."
    When the removal spell resolves, it looks for its target. The target no longer exists (phased out).
    The spell "fizzles" — has no legal target → doesn't resolve.
    Phase out = effectively dodge targeted removal.

NOTABLE PHASE-OUT CARDS:
  Teferi, Hero of Dominaria ({3}{W}{U}): Planeswalker.
    -3: "Put target non-land permanent into its owner's library third from the top."
    Not phasing — that's tuck. Different mechanic.
    But Teferi is often the PLAYER of phasing effects.

  Smoke and Mirrors ({W}{U}, Instant): "Phase out target permanent." (if this exists — modern phasing spell)
    Protect your permanent until your next untap step.

  Teferi's Protection ({2}{W}, Instant): "Until your next turn, your life total can't change, and you
    have protection from everything. Phase out all permanents you control."
    ALL your permanents phase out until your next untap step.
    Phasing out all your permanents: they ALL avoid destruction, exile, anything.
    Your permanents come back at your next untap step — all at once.
    The most powerful phasing card in Commander: stops all damage, counters everything, protects your whole board.

  Reality Ripple ({1}{U}, Instant): "Phase out target artifact, creature, or land."
    Old Mirage era phasing spell. Target phases out.

TEFERI'S PROTECTION IN COMMANDER:
  Opponent's Cyclonic Rift overloaded: bounces all your stuff.
  Cast Teferi's Protection in response: all your permanents phase out.
  Cyclonic Rift resolves: tries to bounce all non-land permanents → they don't exist (phased out).
  Nothing bounces. Your stuff phases back in at your next untap step.
  Also: you have protection from everything until your next turn → can't lose life.
  A complete defense for one turn.
```

## Definitive Conclusions

- **Phased-out permanents are treated as though they don't exist** — can't be targeted, don't exist for game state purposes.
- **Phasing is NOT a zone change** — "leaves the battlefield" triggers don't fire.
- **Status persists through phasing** — a tapped phased-out permanent is still tapped when it phases back in.
- **Auras and Equipment on a phasing creature phase out WITH it** — they don't fall off.
- **Teferi's Protection phases out all your permanents** — the ultimate "skip this turn" defensive spell in Commander.

## Canonical Example
**Phasing Out to Dodge Wrath:**
Opponent casts Wrath of God. All creatures will be destroyed.
You have Teferi's Protection in hand. Cast in response.
All your permanents phase out. You have protection from everything until your next turn.
Wrath resolves: "Destroy all creatures." Your creatures don't exist (phased out) → unaffected.
Opponent's creatures die. Yours don't.
Your next untap step: all your permanents phase back in. All your creatures return (still tapped if they were).
Result: your board survived a Wrath completely. Opponent lost all their creatures.

**Example 2 — Phase-Out Dodge Targeted Removal:**
Opponent targets your 5/5 commander with Swords to Plowshares (exile).
You have {1}{U} and a "phase out target permanent" instant (Reality Ripple variant).
Cast it targeting your 5/5 commander in response.
Commander phases out before the exile spell resolves.
Swords to Plowshares resolves: it tries to exile the commander. Commander doesn't exist (phased out).
Spell has no legal target → countered on resolution (fizzles).
Your commander phases back in at your next untap step. Saved from exile with just {1}{U}.

## Commonly Confused With
- **P064 (Blink/Flicker)** — Blink exiles and returns a permanent (a zone change → triggers ETB and leaves-the-battlefield). Phasing is NOT a zone change → no triggers.
- **P087 (Exile Zone)** — Exiled permanents are in the exile zone; phased-out permanents are not in any zone. Very different — phased-out returns automatically, exiled requires specific effects.
- **P272 (Impending)** — Impending has time counters counting down on a permanent; phasing alternates every turn automatically. Both create "non-creature" states but via different mechanisms.
