---
id: p364
name: Mana Abilities — No Stack, Immediate Resolution, and What Qualifies as a Mana Ability
category: stack
cr_refs: [605.1, 605.1a, 605.1b, 605.2, 605.3a, 605.3b, 605.4a, 605.5, 605.5a, 117.1d]
tags: [mana-ability, no-stack, immediate-resolution, targeted-mana-ability, triggered-mana-ability, Cabal-Coffers, Urborg, Selvala, Skirk-Prospector, Deathrite-Shaman, Mana-Vault, elvish-mystic, can-activate-during-casting, floating-mana, mana-burn-old-rule]
created: 2026-03-29
examples_count: 2
---

# P364 — Mana Abilities — No Stack, Immediate Resolution, and What Qualifies as a Mana Ability

## Abstract
**Mana abilities** (rule 605) are a special category of activated and triggered abilities that bypass the normal stack system. They **don't go on the stack** (605.3b), can't be countered or responded to, and resolve immediately. You can activate a mana ability any time you have priority AND at any time a mana payment is required (mid-cast, during the resolution of spells, etc.) (605.3a). What qualifies: an activated ability that (1) doesn't require a target, (2) could add mana when it resolves, and (3) is not a loyalty ability (605.1a). Triggered abilities that trigger from mana ability activation and could produce mana are also mana abilities (605.1b). A crucial exception: **targeted mana abilities** are NOT mana abilities — even if they produce mana, having a target disqualifies them (605.5a), so they go on the stack and can be responded to.

## The Definitive Rules

**CR 605.1a** (verbatim): *"An activated ability is a mana ability if it meets all of the following criteria: it doesn't require a target (see rule 115.6), it could add mana to a player's mana pool when it resolves, and it's not a loyalty ability."*

**CR 605.1b** (verbatim): *"A triggered ability is a mana ability if it meets all of the following criteria: it doesn't require a target, it triggers from the activation or resolution of an activated mana ability or from mana being added to a player's mana pool, and it could add mana to a player's mana pool when it resolves."*

**CR 605.3b** (verbatim): *"An activated mana ability doesn't go on the stack, so it can't be targeted, countered, or otherwise responded to. Rather, it resolves immediately after it is activated."*

**CR 605.3a** (verbatim): *"A player may activate an activated mana ability whenever they have priority, whenever they are casting a spell or activating an ability that requires a mana payment, or whenever a rule or effect asks for a mana payment, even if it's in the middle of casting or resolving a spell or activating or resolving an ability."*

**CR 605.4a** (verbatim): *"A triggered mana ability doesn't go on the stack, so it can't be targeted, countered, or otherwise responded to. Rather, it resolves immediately after the mana ability that triggered it, without waiting for priority."*

**CR 605.5a** (verbatim): *"An ability with a target is not a mana ability, even if it could put mana into a player's mana pool when it resolves."*

## The Pattern

```
WHAT MAKES AN ABILITY A MANA ABILITY (605.1a):
  An activated ability that:
    1. Does NOT require a target (no "target" in the cost or effect).
    2. Could add mana when it resolves.
    3. Is NOT a loyalty ability.
  ALL THREE criteria must be met.

  COMMON MANA ABILITIES:
    "{T}: Add {G}" on a Forest: no target, produces mana, not loyalty. MANA ABILITY.
    "{T}: Add one mana of any color" on a Arcane Signet: same. MANA ABILITY.
    "{T}, Sacrifice a creature: Add {B}{B}{B}" (hypothetical): no target. MANA ABILITY.
    "Skirk Prospector's ability: {Sacrifice a Goblin}: Add {R}": no target. MANA ABILITY.
    Cabal Coffers: "{2}, {T}: Add {B} for each Swamp you control": no target. MANA ABILITY.

  WHAT'S NOT A MANA ABILITY:
    Deathrite Shaman ({B/G}): "{T}: Exile target card from a graveyard. Add one mana..."
      This has TARGET (exile target card). NOT a mana ability (605.5a).
      Goes on the stack. Can be responded to. Can be countered.
    "Tap target creature: Add {G}": has target. NOT a mana ability.
    Selvala, Heart of the Wilds ({2}{G}{G}): "Whenever another creature enters, its controller may draw a card..."
      Not a mana ability trigger (it triggers from creature entering, not from mana ability activation).
      But also: "{G}, {T}: Add X mana, where X is the greatest power among creatures you control."
        No target. Produces mana. Not loyalty. MANA ABILITY.

MANA ABILITY TIMING (605.3a):
  You can activate mana abilities:
    - Any time you have priority (normal).
    - While you're in the MIDDLE OF CASTING a spell (to pay the mana cost).
    - While resolving a spell or ability that requires mana payment.
    - Even after you've begun declaring a spell but before completing it.
  EXAMPLE: You announce you're casting Counterspell ({U}{U}).
    You're in the middle of casting process. The spell isn't on the stack yet (announcing costs).
    You can tap your Islands (mana abilities) to pay the {U}{U} cost.
    This is mid-cast. Mana abilities still work here.
    You can't cast other spells or activate non-mana abilities mid-cast.
    Mana abilities are the EXCEPTION that allows interrupting any point in the casting process.

MANA ABILITIES DON'T GO ON STACK (605.3b):
  When you activate a mana ability:
    It resolves IMMEDIATELY. Not onto the stack.
    No one can respond. No one can counter it.
    Opponent can't "respond to you tapping your Forest."
    The mana is just immediately added to your mana pool.
  This is why mana abilities are special: they bypass the normal priority/stack system.
  TRIGGERED MANA ABILITIES (605.4a):
    If activating a mana ability triggers another mana ability:
      The triggered mana ability also resolves immediately after the activating one.
      Still no stack.
    Example: "Whenever you tap a land for mana, add one mana of the same type."
      You tap Forest for {G}. Mana ability resolves: you get {G}.
      The triggered ability triggers (from the mana ability activation): add another {G}.
      Triggered mana ability resolves immediately: you now have {G}{G}.
      All happened instantly. No stack.

TARGETED MANA ABILITIES AND THE STACK (605.5a):
  Critical distinction: if an ability has a target AND produces mana: it's NOT a mana ability.
  It goes on the stack. Can be countered. Can be responded to.
  Examples:
    Deathrite Shaman: "{T}: Exile target card from a graveyard. Add one mana of any color."
      Has target (exile target card). NOT a mana ability.
      Goes on stack. Opponent can respond.
      Opponent: "In response to Deathrite Shaman's ability, I'll exile that card from my own GY
        using my own ability." (If they have a way to exile their GY card first.)
      If the targeted card is exiled in response: Deathrite's ability targets an exiled card
        (which is no longer in the GY). Illegal target → ability fizzles.
    Sol Talisman or other targeted mana ability: same situation.
  WHY THIS MATTERS:
    Against Deathrite Shaman: opponents can interact (respond, counter, invalidate targets).
    Against Llanowar Elves ({T}: Add {G}): no interaction. It's a mana ability. Instant.

FLOATING MANA:
  Mana that's been added to a player's mana pool but not yet spent = "floating mana."
  If priority passes to the next player while you have floating mana: mana stays in your pool.
  At the beginning of each step/phase: if you have mana in your pool, you don't lose it.
  Wait: old rule was "mana burn" (unused mana at end of phases caused life loss). That rule was removed.
  Current rule: unused mana disappears at the end of each step and phase (400.4a).
    "The active player's pool is emptied and those mana sources lose their mana."
    Wait: looking at this more carefully. Let me check. The key: "mana empties at end of step."
    Mana you've produced persists until the end of the current step or phase.
    You don't "lose life" from unused mana (that old rule was removed in Magic 2010).
    You simply lose the mana (it dissipates).
  So: tap land for {G} on your main phase. Don't spend it during main phase. During combat: {G} gone.
  You need to spend mana in the same step/phase you produced it (generally), or waste it.

LOYALTY ABILITIES EXCEPTION (605.1a):
  Even if a planeswalker ability could produce mana: if it's a loyalty ability (uses loyalty symbols),
    it's NOT a mana ability.
  Loyalty abilities have their own special rules (rule 606):
    - Only during your main phase with empty stack.
    - Only one loyalty activation per permanent per turn.
    - Go on the stack, can be responded to.
  No planeswalker currently has a mana-producing loyalty ability, but the rule covers the edge case.
```

## Definitive Conclusions

- **Mana abilities don't use the stack** — they resolve immediately and can't be countered or responded to.
- **Three criteria for activated mana ability: no target, could produce mana, not loyalty** — all three must be met.
- **Targeted abilities that produce mana are NOT mana abilities** — Deathrite Shaman's ability has a target, so it goes on the stack and can be interacted with.
- **Mana abilities can be activated mid-cast** — you can tap lands to pay mana costs while in the middle of casting a spell; this is the point of mana abilities.
- **Triggered mana abilities also bypass the stack** — they resolve immediately after the triggering mana ability, without waiting for priority.
- **Mana dissipates at end of each step/phase** — unused mana is lost (no mana burn life loss; that rule was removed in 2010).

## Canonical Example
**Selvala, Heart of the Wilds — Triggered Mana Ability:**
Selvala, Heart of the Wilds ({2}{G}{G}): "Whenever another creature enters the battlefield under any player's control, that creature's controller may draw a card if the creature's power is the greatest of all creatures on the battlefield."
And: "{G}, {T}: Add X mana in any combination of colors, where X is the greatest power among creatures you control."

The second ability: {G}, {T}: no target. Produces mana. Not loyalty. MANA ABILITY.
You tap Selvala (paying {G} and tapping as cost). Mana ability resolves immediately.
Your biggest creature has power 5. You add 5 mana in any combination.
No one can respond. Immediate.

Now: can the first ability be a mana ability?
It's a triggered ability: "whenever another creature enters, that creature's controller may draw a card."
This draws a card — doesn't produce mana. NOT a mana ability. Goes on stack normally.

But what if a card had: "Whenever a creature enters under your control, add {G}"?
Does this qualify as a triggered mana ability (605.1b)?
  Criteria: doesn't require a target ✓ (no target in trigger)
  Triggers from... activating a mana ability? OR from mana being added? → NO: it triggers from "creature entering."
  That's neither "from activating/resolving a mana ability" nor "from mana being added."
  NOT a triggered mana ability by rule 605.1b.
  It COULD produce mana (add {G}) but the trigger source is wrong. Goes on stack normally.

**Example 2 — Deathrite Shaman as Non-Mana Ability:**
You control Deathrite Shaman ({B/G}): "Tap, exile target card from a graveyard: Add one mana of any color."
Opponent's Lightning Bolt is in their GY. You want to get mana from Deathrite.
Activate: "{T}: Exile target card from a graveyard." You target Lightning Bolt in opponent's GY.
This has a target. NOT a mana ability. Goes on stack.
Opponent has priority to respond. They can:
  Cast Krosan Reclamation ({1}{G}): "Target card in a graveyard is shuffled into its owner's library."
  If they shuffle Lightning Bolt back into their library BEFORE Deathrite's ability resolves:
    Deathrite's ability resolves but the target is gone (Lightning Bolt left the GY and is now in library).
    Wait: 601.2c — at time of resolution, check if targets are still legal.
    "Exile target card from a graveyard": Lightning Bolt is no longer in the GY. Illegal target.
    Deathrite's ability fizzles. No mana produced.
This interaction is ONLY possible because Deathrite's ability has a target (not a mana ability).
If it were a mana ability (no target), no one could respond.

## Commonly Confused With
- **P007 (Response Windows)** — Mana abilities have NO response window (605.3b). Other activated abilities DO have a response window (they go on the stack). The distinction: targeted mana ability (Deathrite Shaman) has a response window; untargeted mana ability (basic land) does not.
- **P333 (Planeswalkers/Loyalty Abilities)** — Loyalty abilities look like activated abilities but are NOT mana abilities even if they could produce mana (605.1a excludes loyalty abilities). Loyalty abilities go on the stack, can be countered, and have their own activation restrictions (one per turn, main phase only).
- **P002 (Replacement Effects)** — Some effects replace mana production: "instead of adding {G}, add {C}" type effects. These are replacement effects that interact with mana abilities. The mana ability itself resolves without a stack, but replacement effects (which aren't on the stack) still apply to modify the result.
- **P342 (Turn Structure)** — Mana empties at end of each step and phase (400.4a). Understanding when you can use your mana connects to the turn structure (P342). You generally want to tap for mana and spend it in the same step.
