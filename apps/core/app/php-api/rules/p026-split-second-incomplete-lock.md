---
id: p026
name: Split Second — Incomplete Priority Lock
category: stack
cr_refs: [702.61a, 702.61b, 116.2b, 116.2f, 116.2h, 117.2a]
tags: [split-second, priority, triggered-ability, special-action, morph, mana-ability, krosan-grip, hard-lock, stack]
created: 2026-03-28
examples_count: 2
---

# P026 — Split Second — Incomplete Priority Lock

## Abstract
Split Second prevents players from casting spells or activating non-mana abilities while the Split Second spell is on the stack. It is widely perceived as a total shutdown, but it leaves three channels open: mana abilities can be activated freely, triggered abilities fire and go on the stack above the Split Second spell normally, and special actions (turning a morph face-up, exiling suspend/foretell cards from hand) can still be taken. This makes Split Second an *incomplete* lock — powerful but not absolute.

## The Definitive Rule

**CR 702.61a** (verbatim): *"Split second is a static ability that functions only while the spell with split second is on the stack. 'Split second' means 'As long as this spell is on the stack, players can't cast other spells or activate abilities that aren't mana abilities.'"*

**CR 702.61b** (verbatim): *"Players may activate mana abilities and take special actions while a spell with split second is on the stack. Triggered abilities trigger and are put on the stack as normal while a spell with split second is on the stack."*

**CR 116.2b**: *"Turning a face-down creature face up is a special action. A player can take this action any time they have priority."*

**CR 116.2f**: Exiling a suspend card from hand is a special action.

**CR 117.2a**: Triggered abilities can trigger at any time and are placed on the stack the next time a player would receive priority — Split Second does not prevent this.

## The Pattern

```
WHILE SPLIT SECOND IS ON THE STACK:

  BLOCKED:
    Cast any spell (instants, counterspells, flash creatures)
    Activate any non-mana ability (tap abilities, sac outlets,
      regeneration abilities, Stifle, Riftsweeper, etc.)

  PERMITTED:
    Activate mana abilities (tap lands, Lotus Petal, etc.)

    Take special actions:
      Turn a morph creature face-up (CR 116.2b)
      Exile a suspend card from hand (CR 116.2f)
      Exile a foretell card from hand (CR 116.2h, own turn only)

    Triggered abilities:
      Any trigger that fires when the Split Second spell is cast
        → goes on stack ABOVE the Split Second spell
        → resolves first, before the Split Second spell
      Any trigger from any other game event during this window
        → goes on stack normally

CRITICAL ASYMMETRY:
  "Whenever an opponent casts a spell, [effect]" → TRIGGERS, goes on stack above
  "T: Do something" → BLOCKED, can't activate

  A triggered sac outlet ("whenever this is targeted, sacrifice it") → WORKS
  An activated sac outlet ("{T}: sacrifice a creature") → BLOCKED
```

## Definitive Conclusions

- **Split Second cannot be countered.** No instant-speed counterspell can be cast while it's on the stack.
- **Triggered abilities resolve above Split Second.** If the casting of a Split Second spell triggers anything, those triggers go on the stack first and resolve before Split Second does.
- **Morph face-up works through Split Second.** Turning a morph creature face-up is a special action (CR 116.2b), not an activated ability. It is explicitly permitted (CR 702.61b).
- **Activated sacrifice outlets cannot be used.** Viscera Seer, Altar of Dementia, any "{cost}: sacrifice" ability is blocked.
- **Triggered sac responses still work.** A creature with a triggered "whenever this is targeted, sacrifice it" ability fires and goes on the stack above the Split Second spell.
- **Stifle cannot interact with a triggered ability already on the stack above the Split Second spell.** Stifle is a spell — casting it is blocked. The trigger resolves unimpeded.
- **Triggered abilities that resolve while split second is on the stack CANNOT cast spells as part of their resolution.** Even though triggered abilities slip through Split Second and resolve first, the split second spell is still on the stack during that resolution. If the triggered ability's text says "cast a spell" as part of its effect (e.g., a Cascade trigger, a "cast target instant/sorcery" effect), that spell cannot be cast. (Gatherer ruling 3/19/2021: "If the resolution of a triggered ability involves casting a spell, that spell can't be cast if a spell with split second is on the stack.")
- **Multiple Split Second spells on the stack don't stack their restrictions.** CR 702.61c: redundant instances have no additional effect.

## Canonical Example
**Krosan Grip + "Whenever an opponent casts a spell" trigger:**
Player A casts Krosan Grip (Split Second) targeting Player B's Oblivion Ring. Player B controls Teferi's Puzzlebox (triggers "whenever a player casts a spell") — that trigger fires, goes on the stack above Krosan Grip, and resolves first. Player B cannot then cast a spell to counter Krosan Grip, but the triggered ability's effect happens before Krosan Grip destroys the Oblivion Ring.

**Example 2 — Morph Surprise:**
Opponent casts Krosan Grip targeting your Birchlore Rangers (face-down morph). You have priority. You turn Birchlore Rangers face-up (special action, CR 116.2b) — now it's a 1/1 Elf, not an artifact or enchantment. Krosan Grip resolves: its target (the face-down creature treated as a 2/2 colorless, no type) is now face-up Birchlore Rangers, an Elf creature. Krosan Grip says "destroy target artifact or enchantment" — Birchlore Rangers is neither. The spell fizzles (illegal target on resolution, CR 608.2b). Your creature survives.

Wait — morph creatures are not artifacts or enchantments even face-down. Let me revise: the better morph + Split Second example is any face-down morph that has a powerful face-up ability. The opponent casts a Split Second spell that *would* affect you. You turn your Exalted Angel face-up (special action), which changes the game state before the Split Second spell resolves. You couldn't respond with a spell, but you changed the board.

## Commonly Confused With
- **P007 (Priority Windows)** — P007 covers whether there is any response window at all between events. P026 is specifically about *what* can and cannot be done during the window Split Second creates (it gives priority but restricts options).
- **P021 (Casting Restriction Hard Lock)** — P021 is a full casting hard lock (no one can cast anything under certain conditions). P026 is a partial lock: triggered abilities and special actions still work.
- **P008 (Can't vs. May)** — Split Second's "can't cast" is a "can't" effect (P008), but P026 focuses on the mechanics of what slips through it rather than the conflict resolution itself.
