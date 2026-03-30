---
id: p413
name: Morph and Megamorph — Face-Down Casting, 2/2 Blank Characteristics, and Turn-Face-Up Special Action
category: zones
cr_refs: [702.37a, 702.37b, 702.37c, 702.37e, 708.2, 708.2a, 708.3, 708.4, 708.5, 708.6, 708.8, 708.9]
tags: [morph, megamorph, face-down, face-up, special-action, 2/2-no-characteristics, no-ETB-on-turnfaceup, reveal-on-leaving, turn-face-up-anytime, alternative-cost, Onslaught, Khans-of-Tarkir, Grinning-Demon, Vesuvan-Shapeshifter, Willbender, Exalted-Angel, Ainok-Survivalist, Rattleclaw-Mystic, face-down-status, morph-cost-paid, copiable-values-face-down]
created: 2026-03-29
examples_count: 2
---

# P413 — Morph and Megamorph — Face-Down Casting, 2/2 Blank Characteristics, and Turn-Face-Up Special Action

## Abstract
**Morph** (702.37) lets you cast a creature card face down as a **2/2 colorless creature with no text, no name, no subtypes, and no mana cost** by paying {3} as an alternative cost. The face-down permanent has exactly those characteristics — nothing else. At any time you have priority, you may turn it face up by paying its morph cost (a **special action**, not a spell or activated ability — it doesn't use the stack). When turned face up, the creature regains its normal characteristics, but **ETBs do NOT trigger** (the permanent was already on the battlefield). If a face-down permanent leaves the battlefield for any reason, its owner **must reveal it** to all players. **Megamorph** is morph with an additional +1/+1 counter placed when turned face up using the megamorph cost.

## The Definitive Rules

**CR 702.37a** (verbatim): *"Morph is a static ability that functions in any zone from which you could play the card it's on, and the morph effect works any time the card is face down. 'Morph [cost]' means 'You may cast this card as a 2/2 face-down creature with no text, no name, no subtypes, and no mana cost by paying {3} rather than paying its mana cost.'"*

**CR 702.37b** (verbatim): *"Megamorph is a variant of the morph ability. 'Megamorph [cost]' means 'You may cast this card as a 2/2 face-down creature with no text, no name, no subtypes, and no mana cost by paying {3} rather than paying its mana cost' and 'As this permanent is turned face up, put a +1/+1 counter on it if its megamorph cost was paid to turn it face up.' A megamorph cost is a morph cost."*

**CR 702.37e** (verbatim): *"Any time you have priority, you may turn a face-down permanent you control with a morph ability face up. This is a special action; it doesn't use the stack (see rule 116). To do this, show all players what the permanent's morph cost would be if it were face up, pay that cost, then turn the permanent face up. (If the permanent wouldn't have a morph cost if it were face up, it can't be turned face up this way.) The morph effect on it ends, and it regains its normal characteristics. Any abilities relating to the permanent entering the battlefield don't trigger when it's turned face up and don't have any effect, because the permanent has already entered the battlefield."*

**CR 708.2** (verbatim): *"Face-down spells and face-down permanents have no characteristics other than those listed by the ability or rules that allowed the spell or permanent to be face down. Any listed characteristics are the copiable values of that object's characteristics."*

**CR 708.2a** (verbatim): *"If a face-up permanent is turned face down by a spell or ability that doesn't list any characteristics for that object, it becomes a 2/2 face-down creature with no text, no name, no subtypes, and no mana cost. A permanent that enters the battlefield face down also has these characteristics unless otherwise specified by the effect that put it onto the battlefield face down or allowed it to be cast face down. These values are the copiable values of that object's characteristics."*

**CR 708.3** (verbatim): *"Objects that are put onto the battlefield face down are turned face down before they enter the battlefield, so the permanent's enters-the-battlefield abilities won't trigger (if triggered) or have any effect (if static)."*

**CR 708.4** (verbatim): *"Objects that are cast face down are turned face down before they are put onto the stack, so effects that care about the characteristics of a spell will see only the face-down spell's characteristics. Any effects or prohibitions that would apply to casting an object with these characteristics (and not the face-up object's characteristics) are applied to casting this object."*

**CR 708.8** (verbatim): *"As a face-down permanent is turned face up, its copiable values revert to its normal copiable values. Any effects that have been applied to the face-down permanent still apply to the face-up permanent. Any abilities relating to the permanent entering the battlefield don't trigger and don't have any effect, because the permanent has already entered the battlefield."*

**CR 708.9** (verbatim): *"If a face-down permanent or a face-down component of a merged permanent moves from the battlefield to any other zone, its owner must reveal it to all players as they move it. If a face-down spell moves from the stack to any zone other than the battlefield, its owner must reveal it to all players as they move it."*

## The Pattern

```
CASTING WITH MORPH (702.37a, 708.4):
  Alternative cost: pay {3} instead of normal mana cost.
  The card is turned face down BEFORE going on the stack (708.4).
  The face-down spell has characteristics: 2/2 colorless creature, no text, no name,
    no subtypes, no mana cost.
  Counterspells targeting the face-down spell only know it's "a 2/2 colorless creature."
  A counterspell saying "counter target colored spell" CANNOT counter it (it's colorless).
  A counterspell saying "counter target creature spell" CAN counter it (it is a creature spell).

FACE-DOWN PERMANENT CHARACTERISTICS (708.2, 708.2a):
  On the battlefield: 2/2 face-down creature.
  NO name: can't be targeted by effects saying "target creature named [X]".
  NO subtypes: not a Zombie, not an Elf, not a Wizard. No tribal benefits.
  NO abilities: no flying, no vigilance, no ETBs or static abilities.
  NO mana cost: mana value = 0. (Relevant for "costs {2} or less" effects.)
  These are the COPIABLE VALUES. Important for clones (see P414).
  The creature IS still colorless, creature type "Creature" (no subtypes), 2/2.

WHAT A FACE-DOWN MORPH IS:
  A face-down morph is a 2/2 colorless creature. Nothing more.
  It can attack and block as normal for a 2/2.
  It can receive +1/+1 counters and equipment. Those stay when it turns face up.
  It can be targeted by anything that can target "a creature."
  It doesn't have protection or hexproof (face-down = no abilities).
  It can be destroyed, exiled, etc. normally.
  Opponent sees: "2/2 face-down creature" and nothing else.
  You see: the actual card (708.5: "at any time, you may look at a face-down
    spell/permanent you control").

TURNING FACE UP (702.37e):
  "Any time you have priority" — at instant speed. Even in combat!
  Special action: doesn't use the stack. Can't be responded to.
  You must show all players the permanent's morph cost.
  You pay the morph cost.
  The permanent turns face up: regains its real characteristics.
  CRITICAL: No ETBs trigger. No static ETB effects apply. The permanent was
    already on the battlefield. "Enters" abilities don't fire.
  HOWEVER: Any abilities that trigger on TURN FACE UP (not ETB) DO trigger.
    Example: Willbender ({1}{U}: 1/2, morph {1}{U}, "when Willbender is turned face up,
      change the target of target spell or ability with a single target"):
    Willbender's ability says "when turned face up" — NOT "when it enters."
    This DOES trigger when it turns face up. This is the key!
  DIFFERENCE: "When [creature] enters" vs. "When [creature] is turned face up":
    "Enters" = ETB trigger. Doesn't fire when turned face up (already on battlefield).
    "Turned face up" = specifically triggers on the face-up event. DOES fire.

MEGAMORPH ADDITION (702.37b):
  Same as morph, BUT: "as this permanent is turned face up, put a +1/+1 counter on it
    if its megamorph cost was paid."
  The counter goes ON as the permanent turns face up (not after, not as an ETB).
  Example: Ainok Survivalist ({1}{G}: 2/1, megamorph {2}{G}, "when Ainok Survivalist is
    turned face up, destroy target artifact or enchantment"):
    Turned face up via megamorph: gains +1/+1 counter (3/2) and destroys an artifact.
  Turned face up via regular morph cost (if it has one)?... Megamorph creatures only have
    megamorph, not morph. So only the megamorph cost can turn them face up.
    → The +1/+1 counter always happens when turned face up (since there's only the mega cost).

FACE-DOWN LEAVES BATTLEFIELD: MANDATORY REVEAL (708.9):
  If a face-down permanent is destroyed, exiled, bounced, sacrificed, etc.:
    Owner MUST reveal what it was to all players.
  This is mandatory — not optional. Your opponent finds out what it was.
  WHY THIS MATTERS:
    If you morph a bluff (a face-down permanent you never plan to flip), and it gets
      removed, opponents learn what it was. No bluffing after the fact.
    If you morph a Blistering Firecat (3/1 haste morph {R}{R}; at end of turn,
      sacrifice Blistering Firecat), you can attack, deal damage, then opponent gets
      to see what it was when it's sacrificed at end of turn.

FACE-DOWN SPELL COUNTERED: REVEAL (708.9):
  "If a face-down spell moves from the stack to any zone other than the battlefield,
    its owner must reveal it."
  If your face-down morph spell is countered: the spell goes to GY. You must reveal it.
  No secrets when counterspells are involved.
  If your morph somehow resolves but can't enter battlefield (unusual scenario):
    Goes to GY. Must reveal.

PAYING THE MORPH COST:
  702.37e: "show all players what the permanent's morph cost would be if it were face up,
    pay that cost, then turn the permanent face up."
  You MUST show the cost to all players (part of the special action).
  This confirms the identity of the card (the morph cost narrows down what it is).
  If the permanent wouldn't have a morph cost (e.g., it was put face down by a non-morph
    effect), it can't be turned face up this way.

EFFECTS THAT APPLIED TO THE FACE-DOWN PERMANENT (708.8):
  "Any effects that have been applied to the face-down permanent still apply to the
    face-up permanent."
  Example: You enchant a face-down morph with Curiosity (enchantment: "whenever enchanted
    creature deals damage to an opponent, you may draw a card").
  The morph turns face up as Silklash Spider (2/7 reach, "{X}: Silklash Spider deals X
    damage to each creature with flying").
  The Curiosity aura stays on the now-face-up Spider. Still draws cards on damage.
  Example: You Giant Growth'd the face-down morph (+3/+3 until EOT).
  It turns face up. It's now a 3/3 morph creature + the +3/+3 = 6/6 until EOT.
  The continuous effect still applies.

MULTIPLE FACE-DOWN PERMANENTS (708.6):
  "You must ensure at all times that your face-down spells and permanents can be easily
    differentiated from each other."
  Common methods: counters, dice, order on table.
  This is a tournament rule: at any time you must be able to say which face-down is which.
  You can use different physical markers but may not mix up their identities.
```

## Definitive Conclusions

- **A face-down morph is EXACTLY a 2/2 colorless creature with NO name, NO type, NO abilities, NO mana cost** — any spell/effect that checks for these characteristics sees only the 2/2; tribal buffs, protection, hexproof, etc. are inaccessible while face down.
- **Turning face up is a special action (doesn't use the stack)** — opponents cannot respond to the turn-face-up action itself; it happens instantaneously when you announce it and pay the cost.
- **ETBs do NOT trigger when turned face up** — the permanent was already on the battlefield; "when [creature] enters" abilities are irrelevant; only "when [creature] is turned face up" abilities trigger.
- **When a face-down permanent leaves the battlefield for any reason, it must be revealed** — mandatory, not optional; opponents will always learn what it was.
- **Effects on the face-down permanent persist when turned face up** — counters, auras, equipment, and continuous effects (pump spells) carry over to the face-up creature.

## Canonical Example
**Willbender Mid-Combat Turn-Face-Up:**
You control a face-down 2/2 (actually Willbender — {1}{U}: 1/2 morph {1}{U}, "when Willbender is turned face up, change the target of target spell or ability with a single target to Willbender").

Opponent casts Doom Blade targeting your best creature (say, a 4/4 Tarmogoyf).

You have priority after Doom Blade goes on the stack. (Note: turning face up is a special action, which you can take any time you have priority, even with spells on the stack.)

You turn Willbender face up. Show all players: morph cost {1}{U}. Pay {1}{U}. It turns face up.
→ Special action: no stack, no response window.
Willbender is now face up as a 1/2 blue Wizard.

"When Willbender is turned face up" triggers. Goes on stack.
Trigger resolves: change the target of Doom Blade (single target) to Willbender.
Doom Blade now targets Willbender.
Doom Blade resolves: destroys Willbender (the 1/2).
Tarmogoyf is safe. You sacrificed a 3-mana investment (1U face-down + 1U flip) to save your 4/4.

Note: this only works because "turned face up" IS a trigger — unlike ETBs, it fires here.

**Example 2 — Exalted Angel and Bluff Value:**
You morph Exalted Angel ({4}{W}{W}: 4/5 flying; morph {2}{W}{W}; "whenever Exalted Angel deals damage, you gain that much life").

Note: Exalted Angel does NOT have a "when turned face up" trigger. When it turns face up, no ETB-style trigger fires (the permanent was already on the battlefield). You simply reveal a 4/5 flying lifelinker.

Face-down in play: opponent sees a 2/2. They might not kill it immediately.

Turn 3: You have {2}{W}{W} (6 mana). Tap. Turn Exalted Angel face up (show morph cost {2}{W}{W}).
No "turned face up" trigger fires — Exalted Angel has no such ability.
The 4/5 flying lifelinker is now revealed face up.

VS. comparison — cast normally: {4}{W}{W} = 6 mana. Same cost! But face-down:
  You paid {3} on turn 1 (early 2/2 to attack/block).
  You paid {2}{W}{W} on turn 3 to flip (when you have mana to spare).
  No life gain on flip — the life gain ability only triggers when the angel deals damage.

Bluff element: opponent who sees a face-down 2/2 might alpha strike, taking combat damage.
Outcome: they attacked into your face-down creature, took damage, and you flipped a 4/5.
You denied them information, then punished the attack.

## Commonly Confused With
- **P011 (ETB Triggers)** — P011 covers ETB trigger fundamentals. Morph's turn-face-up is NOT an ETB. "When this creature enters" ≠ "when this creature is turned face up." Morph leverages this distinction: ETBs are inaccessible from face-up turns; only explicit "turned face up" abilities fire.
- **P414 (Morph Interactions — Clone Copies Face-Down)** — P413 covers the mechanics of face-down casting. P414 covers specific non-obvious interactions: what Clone does with a face-down morph, what happens when you target a face-down morph for copy effects, etc.
- **P004 (Layer System)** — When a face-down morph turns face up, the "copiable values revert" (708.8). Continuous effects that were applied to the face-down state are re-evaluated in the layer system against the new face-up characteristics. The existing effects still apply in their appropriate layers.
- **P002 (Replacement Effects)** — Some effects try to "turn a face-up permanent face down." Rule 708.2b: a face-down permanent can't be turned face down again. Effects that try to do so simply fail. This is a "can't" effect (614.17) applied to face-down status.
