---
id: p416
name: Split Second — Can't Cast or Activate, but Triggered Abilities and Special Actions Still Work
category: stack
cr_refs: [702.61a, 702.61b, 702.61c, 116.2, 116.2a, 116.2b, 116.2c, 116.2d, 116.2e]
tags: [split-second, special-actions, triggered-abilities, mana-abilities, morph-flip, phasing, can't-cast-can't-activate, Sudden-Death, Krosan-Grip, Sudden-Shock, split-second-morph, triggered-abilities-stack, split-second-planeswalker, land-plays, split-second-response]
created: 2026-03-29
examples_count: 2
---

# P416 — Split Second — Can't Cast or Activate, but Triggered Abilities and Special Actions Still Work

## Abstract
**Split second** (702.61) prevents players from casting spells or activating non-mana abilities while the split-second spell is on the stack. This makes it the closest Magic gets to an "uncounterable" spell — opponents can't cast counterspells in response. However, two critical categories of actions **remain fully available**: (1) **triggered abilities** still trigger and are placed on the stack as normal, and (2) **special actions** (CR 116.2) — turning a morph face up, paying an echo cost, suspending a card — can still be taken. Notably, mana abilities can also still be activated. These exceptions create a non-obvious strategic landscape: you can't Krosan Grip response to a Wrath, but if a creature with a triggered ability would trigger, it still does.

## The Definitive Rules

**CR 702.61a** (verbatim): *"Split second is a static ability that functions only while the spell with split second is on the stack. 'Split second' means 'As long as this spell is on the stack, players can't cast other spells or activate abilities that aren't mana abilities.'"*

**CR 702.61b** (verbatim): *"Players may activate mana abilities and take special actions while a spell with split second is on the stack. Triggered abilities trigger and are put on the stack as normal while a spell with split second is on the stack."*

**CR 702.61c** (verbatim): *"Multiple instances of split second on the same spell are redundant."*

**CR 116.2** (verbatim): *"Taking special actions doesn't use the stack. A special action is any of the following..."*

**CR 116.2a** (verbatim): *"Playing a land. (See rule 305, 'Lands.')"*

**CR 116.2b** (verbatim): *"Turning a face-down permanent face up using a morph ability. (See rule 702.37.)"*

**CR 116.2c** (verbatim): *"Casting a spell with foretell from exile during your turn. (See rule 702.143.)"*

**CR 116.2d** (verbatim): *"Suspending a card. (See rule 702.62.)"*

**CR 116.2e** (verbatim): *"Paying the echo cost of a permanent. (See rule 702.30.)"*

## The Pattern

```
WHAT SPLIT SECOND PREVENTS:
  "Players can't cast other spells or activate abilities that aren't mana abilities."
  PREVENTED:
    - Casting any spell (instants, sorceries, creatures, lands as spells, etc.)
    - Activating abilities (tapping creatures, planeswalker abilities, cycling, etc.)
  NOT PREVENTED:
    - Activating mana abilities (tapping lands for mana, mana dorks, etc.)
    - Taking special actions (below)
    - Triggered abilities triggering and going on the stack

MANA ABILITIES STILL WORK (702.61b):
  You can still tap lands for mana while a split-second spell is on the stack.
  You can still use creatures that produce mana (if they're mana abilities).
  Why: mana abilities use a special shortcut (they don't use the stack) and are always
    available. Split second preserves this exception.
  Example: Opponent casts Krosan Grip ({2}{G}: instant, split second, "destroy target artifact
    or enchantment") targeting your Sol Ring.
    You can tap Sol Ring to make mana BEFORE the Grip resolves... wait, you COULD have
    activated Sol Ring before the Grip was cast. But after it's on the stack: you can
    still tap lands for mana (they're mana abilities). Sol Ring itself is an activated
    ability that produces mana — if it's an activated mana ability, you can still tap it.
    Actually: Sol Ring's ability IS a mana ability (it produces mana when tapped).
    702.61b: "mana abilities" can still be activated.
    So: even with Krosan Grip on the stack, you can tap Sol Ring for {2}.
    The Ring will be destroyed when Grip resolves, but you got the mana.

SPECIAL ACTIONS STILL WORK (702.61b, 116.2):
  CR 116.2 defines special actions. The notable ones under split second:
  1. PLAYING A LAND (116.2a):
     Playing a land is a special action (doesn't use the stack).
     You CAN play a land while a split-second spell is on the stack.
     This is relevant in certain formats where land plays matter at strange times.
  2. TURNING A MORPH FACE UP (116.2b + 702.37e):
     Turning a face-down morph face up is a special action.
     YOU CAN FLIP A MORPH WHILE SPLIT SECOND IS ON THE STACK.
     This is highly non-obvious and extremely relevant.
     Example: Opponent casts Sudden Death ({1}{B}{B}: instant, split second, "target
       creature gets -4/-4 until end of turn") targeting your face-down 2/2 morph.
     The morph is actually Exalted Angel ({4}{W}{W}: 4/5 flying; morph {2}{W}{W}).
     With split second on the stack, you CANNOT cast counterspells or activate abilities.
     BUT: you CAN turn your morph face up (special action).
     Pay {2}{W}{W}: flip Exalted Angel face up. It's now a 4/5.
     Sudden Death resolves: "target creature gets -4/-4." The 4/5 becomes 0/1.
     Or: flip a Willbender ({1}{U}: 1/1; morph {1}{U}; "when Willbender is turned face up,
       change the target of target spell or ability with a single target"):
     Willbender flips. "When turned face up" trigger fires (goes on stack ABOVE Sudden Death).
     Wait — can Willbender's triggered ability FIRE while split second is on the stack?
     YES: 702.61b: "Triggered abilities trigger and are put on the stack as normal."
     The trigger fires. It goes on the stack on top of Sudden Death.
     But wait: ALL players can't cast spells or activate abilities while split second is
     on the stack, so nobody can respond to the Willbender trigger either.
     But the trigger STILL RESOLVES: change target of Sudden Death to a different creature.
     Sudden Death now targets a different target (or no target if no valid target).
     This is the "Willbender counter" to split-second removal. Non-obvious and powerful.
  3. SUSPENDING A CARD (116.2d):
     If you have a suspendable card in hand, you can suspend it while split second is on the stack.
     Suspend = special action = allowed.
     Unlikely to matter much in practice, but technically valid.
  4. ECHO PAYMENT (116.2e):
     If an echo trigger is on the stack (from your upkeep), you can pay the echo cost.
     Wait — paying echo is paying a cost in response to a triggered ability. That ability
     is on the stack separately. Split second only prevents casting/activating.
     Actually, echo says "you may pay [cost]" when the trigger resolves. If the trigger is
     already on the stack when split second arrives, you can resolve the echo trigger
     normally when it's that trigger's turn (LIFO). The cost payment for echo is part of
     resolving the trigger, not an activation. So it works.

TRIGGERED ABILITIES STILL TRIGGER (702.61b):
  "Triggered abilities trigger and are put on the stack as normal."
  Any triggered ability that would trigger while a split-second spell is on the stack
    still triggers. The trigger goes on the stack on top of the split-second spell.
  Examples:
    Opponent casts Sudden Shock ({R}: instant, split second, "Sudden Shock deals 2 damage
      to any target") targeting your Llanowar Elves ({G}: 1/1, {T}: add {G}).
    Your Llanowar Elves is targeted. Your "whenever a creature you control is targeted"
      trigger fires (if you have such an ability, e.g., from Shalai, Voice of Plenty).
    The trigger goes on the stack. Sudden Shock is below the trigger.
    Trigger resolves (give hexproof or whatever the ability does). Then Sudden Shock resolves.
  Other triggers:
    Planeswalker loyalty abilities: NOT activated. Planeswalker abilities are activated
      abilities → can't be activated while split second is on the stack.
    Triggered abilities on planeswalkers (from entering, upkeep, etc.): still trigger.
  VERY IMPORTANT — LANDFALL:
    Playing a land (special action) triggers landfall.
    Landfall is a triggered ability.
    Both are allowed while split second is on the stack.
    You can play a land, trigger landfall, and the landfall trigger goes on the stack
    on top of the split-second spell. Landfall resolves first. Then split second resolves.
    This is a powerful interaction in landfall strategies against split-second removal.

SPLIT SECOND AND COUNTERSPELLS:
  The primary use: split second can't be "responded to" with counterspells.
  Opponent casts Krosan Grip on your artifact. You can't counter it.
  Your options:
    → Can't cast Counterspell (it's a spell, blocked by split second).
    → Can't activate any abilities of your artifact to get value before it dies.
    → CAN tap lands for mana (mana abilities still work).
    → CAN flip morphs.
    → CAN have triggered abilities trigger (if something triggers from the artifact
      being targeted, that trigger goes on the stack normally).
  For example: if you have Darksteel Colossus (indestructible), Krosan Grip still resolves
    and "destroys" it — but indestructible means it's not destroyed. Grip does nothing to it.
    Grip says "destroy target artifact or enchantment." Indestructible permanents can't be
    destroyed. The effect happens but has no result.
  If you have an artifact with a trigger: "when this artifact becomes the target of a spell..."
    That trigger fires while split second is on the stack. It goes on the stack. Resolves.

PLANESWALKER ABILITY EXCEPTION:
  Planeswalker abilities are activated abilities.
  Split second: "can't activate abilities that aren't mana abilities."
  Planeswalker loyalty abilities are NOT mana abilities.
  You CANNOT activate a planeswalker's loyalty ability while split second is on the stack.
  This is worth noting: even if you want to use Teferi's -3 to bounce the split-second spell
    back to hand, you can't (activating Teferi's ability is not allowed).
```

## Definitive Conclusions

- **Triggered abilities still trigger and stack normally during split second** — split second only prevents CASTING spells and ACTIVATING non-mana abilities; it can't stop triggers.
- **Morph turn-face-up is a special action and IS allowed during split second** — this is the primary counterplay to split-second removal targeting a face-down morph; flip it to change its stats or reveal a triggered ability.
- **Willbender combined with split second** — flip Willbender (special action), its "when turned face up" trigger fires (triggered ability, allowed), and redirects the split-second spell's target; the entire sequence is legal.
- **Playing a land (special action) is allowed, and triggers landfall** — landfall triggers (triggered abilities) then stack on top of the split-second spell.
- **Planeswalker loyalty abilities cannot be activated during split second** — they're activated abilities (non-mana), blocked by split second.

## Canonical Example
**Willbender Beats Sudden Shock (Split Second):**
You control a face-down 2/2 morph (secretly Willbender: {1}{U}: 1/1; morph {1}{U}; "when Willbender is turned face up, change the target of target spell or ability with a single target to Willbender").

You also control a Tarmogoyf (currently 3/4).

Opponent casts Sudden Shock ({R}: instant, split second, "Sudden Shock deals 2 damage to any target") targeting Tarmogoyf.

Split second is now active: you can't cast counterspells, can't activate abilities.

But: you can take special actions. You flip your morph.
Pay {1}{U}: special action. Show all players morph cost. Turn Willbender face up.

Willbender is now a 1/1 face-up.
"When Willbender is turned face up" trigger fires. Goes on stack on top of Sudden Shock.

Stack: [Willbender trigger] [Sudden Shock → targeting Tarmogoyf]

Willbender trigger resolves: change the target of Sudden Shock to Willbender.
Sudden Shock now targets Willbender (1/1).
Sudden Shock resolves: deal 2 damage to Willbender. Willbender dies (2 > 1 toughness).

Tarmogoyf survives. Willbender saved it by dying in its place, through a technically illegal-seeming sequence that's actually fully legal.

**Example 2 — Krosan Grip, Landfall, and Sol Ring Mana:**
Opponent casts Krosan Grip ({2}{G}: instant, split second, "destroy target artifact or enchantment") targeting your Sol Ring.

You can't counter. You can't activate abilities on Sol Ring (it's being targeted, but more importantly, ALL non-mana ability activations are blocked by split second — WAIT: Sol Ring's ability IS a mana ability. You CAN tap Sol Ring for {2} even while Krosan Grip is on the stack!

Tap Sol Ring: add {2}. (Mana ability, allowed by split second exception 702.61b.)
Krosan Grip resolves: Sol Ring is destroyed.

You got {2} from Sol Ring right before it died. That mana is in your mana pool (until end of step/phase).

Additionally: if you have a fetchland, you can crack it (activating it requires... wait, fetchland cracking is an activated ability, not a mana ability — so you CANNOT crack a fetchland while split second is on the stack. But you CAN play a land as a special action.

If you haven't played your land this turn: play a land from hand (special action). If you have a Valakut, the Molten Pinnacle (triggers when a Mountain enters and you have 6+ Mountains), landfall fires while split second is on the stack. The landfall trigger goes on the stack above Krosan Grip.

Landfall trigger resolves: deal 3 damage to target (Valakut). Before Krosan Grip resolves.
Then Krosan Grip resolves: destroys your artifact.

## Commonly Confused With
- **P007 (Priority Windows)** — P007 covers when players have priority to respond. Split second is a "no priority to respond with spells/activations" scenario. Triggered abilities create a priority window (they go on the stack) but casting in response is still blocked.
- **P413 (Morph/Megamorph)** — P413 covers morph's turn-face-up as a special action. P416 applies this: the special-action nature is what makes morph flips legal during split second.
- **P405 (Storm/Affinity/Ward)** — Ward triggers "when this permanent becomes the target of a spell." If a split-second spell targets a ward permanent, ward triggers (triggered ability). The opponent can't pay the ward cost by activating anything, but ward's trigger itself still fires and goes on the stack. The opponent would then need to pay the ward cost when the trigger resolves — they CAN pay it (paying costs during trigger resolution is not "activating an ability," it's responding to a triggered effect).
