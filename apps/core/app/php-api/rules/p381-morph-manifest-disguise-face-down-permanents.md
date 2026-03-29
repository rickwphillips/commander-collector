---
id: p381
name: Morph, Manifest, and Disguise — Face-Down Permanents and Hidden Information
category: zones
cr_refs: [702.37a, 702.37c, 702.37e, 702.37g, 701.40a, 701.40b, 701.40g, 702.168a, 702.168d, 708.2, 708.3, 708.4, 708.5, 708.8, 708.9]
tags: [morph, manifest, disguise, megamorph, face-down, hidden-information, 2/2-face-down, ward-2-disguise, flip-up, ETB-face-down, special-action-no-stack, reveal-on-leaving, Ixidron, Mastery-of-the-Unseen, Den-Protector, Willbender, Birchlore-Rangers, Ethereal-Corpse]
created: 2026-03-29
examples_count: 2
---

# P381 — Morph, Manifest, and Disguise — Face-Down Permanents and Hidden Information

## Abstract
**Morph** (702.37a) lets you cast a card face down as a 2/2 creature for {3} instead of its real mana cost, then pay the morph cost as a special action to turn it face up. **Manifest** (701.40a) puts any card (from library, hand, GY, or anywhere an effect specifies) onto the battlefield face down as a 2/2 — if it's a creature card, you can pay its mana cost to flip it face up; non-creature cards cannot be turned face up via manifest. **Disguise** (702.168a) is morph's newer cousin: also cast as a 2/2 for {3}, but while face down has **ward {2}**, making it harder to target. All three share critical rules: face-down objects enter the battlefield face down (ETB abilities don't trigger — 708.3), face-down objects have NO characteristics except those listed (no name, type, abilities, mana cost — 708.2), and when a face-down permanent leaves the battlefield, its controller must reveal it (708.9). Critically: **turning face up is a special action** (doesn't use the stack, can't be responded to); but effects that FORCE something to turn face up ARE spells/abilities and can be responded to.

## The Definitive Rules

**CR 708.2** (verbatim): *"Face-down spells and face-down permanents have no characteristics other than those listed by the ability or rules that allowed the spell or permanent to be face down. Any listed characteristics are the copiable values of that object's characteristics."*

**CR 708.2a** (verbatim): *"If a face-up permanent is turned face down by a spell or ability that doesn't list any characteristics for that object, it becomes a 2/2 face-down creature with no text, no name, no subtypes, and no mana cost."*

**CR 708.3** (verbatim): *"Objects that are put onto the battlefield face down are turned face down before they enter the battlefield, so the permanent's enters-the-battlefield abilities won't trigger (if triggered) or have any effect (if static)."*

**CR 708.8** (verbatim): *"As a face-down permanent is turned face up, its copiable values revert to its normal copiable values. Any effects that have been applied to the face-down permanent still apply to the face-up permanent. Any abilities relating to the permanent entering the battlefield don't trigger and don't have any effect, because the permanent has already entered the battlefield."*

**CR 708.9** (verbatim): *"If a face-down permanent or a face-down component of a merged permanent moves from the battlefield to any other zone, its owner must reveal it to all players as they move it."*

**CR 702.37a** (verbatim): *"Morph is a static ability that functions in any zone from which you could play the card it's on, and the morph effect works any time the card is face down. 'Morph [cost]' means 'You may cast this card as a 2/2 face-down creature with no text, no name, no subtypes, and no mana cost by paying {3} rather than paying its mana cost.'"*

**CR 702.37e** (verbatim): *"Any time you have priority, you may turn a face-down permanent you control with a morph ability face up. This is a special action; it doesn't use the stack (see rule 116). To do this, show all players what the permanent's morph cost would be if it were face up, pay that cost, then turn the permanent face up."*

**CR 701.40a** (verbatim): *"To manifest a card, turn it face down. It becomes a 2/2 face-down creature card with no text, no name, no subtypes, and no mana cost. Put that card onto the battlefield face down."*

**CR 701.40b** (verbatim): *"Any time you have priority, you may turn a manifested permanent you control face up. This is a special action that doesn't use the stack. To do this, show all players that the card representing that permanent is a creature card and what that card's mana cost is, pay that cost, then turn the permanent face up. (If the card representing that permanent isn't a creature card or it doesn't have a mana cost, it can't be turned face up this way.)"*

**CR 701.40g** (verbatim): *"If a manifested permanent that's represented by an instant or sorcery card would turn face up, its controller reveals it and leaves it face down. Abilities that trigger whenever a permanent is turned face up won't trigger."*

**CR 702.168a** (verbatim): *"Disguise is a static ability that functions in any zone from which you could play the card it's on, and the disguise effect works any time the card is face down. 'Disguise [cost]' means 'You may cast this card as a 2/2 face-down creature with ward {2}, no name, no subtypes, and no mana cost by paying {3} rather than paying its mana cost.'"*

## The Pattern

```
MORPH (702.37):
  WHAT IT IS:
    While in hand (or any zone you can cast from): you may cast the card face down.
    Cost: {3} (not its real mana cost).
    On the stack: a face-down spell with these characteristics ONLY: 2/2, no name, no text,
      no subtypes, no mana cost. (The spell is UNRECOGNIZABLE — opponents can't identify it.)
    Resolves: enters the battlefield face down (ETB abilities don't fire — 708.3).
    Face-down on battlefield: 2/2 creature, no abilities, no type line, colorless.
  TURNING FACE UP:
    Any time you have priority: SPECIAL ACTION (702.37e).
    "Special action": doesn't use the stack. Cannot be responded to.
    You announce you're turning it face up. Show the morph cost. Pay it. Flip it.
    The flip happens BEFORE opponents can respond (special action = no priority window).
    After flipping: the card's real abilities are now active (continuous effects apply).
    Face-up: all abilities function. ETB abilities do NOT re-trigger (708.8).
  WHAT DOESN'T TRIGGER ON FLIP:
    "When this creature enters" — doesn't trigger again (already on battlefield).
    But: "when a permanent is turned face up" or "whenever a face-down creature turns face up"
      DOES trigger — those are separate triggers from being turned face up, not ETB triggers.
    E.g., Den Protector: "When Den Protector is turned face up, return target card from your
      graveyard to your hand." This triggers ON FLIP (not on entering).
  EFFECTS APPLIED BEFORE FLIP:
    If the face-down creature had damage marked, counters, or aura enchantments:
      All of that persists after turning face up (708.8).
    Example: A face-down creature has +2/+2 until end of turn (from an effect).
      When flipped, it becomes its real P/T + 2/2 (the effect still applies).
  MEGAMORPH (702.37b):
    Variant: when turned face up using its megamorph cost, also gets a +1/+1 counter.
    Otherwise: same as morph.

DISGUISE (702.168):
  HOW IT DIFFERS FROM MORPH:
    Same cost ({3}), same face-down 2/2.
    BUT: While face down, the creature has WARD {2}.
    Ward {2}: "Whenever this permanent becomes the target of a spell or ability an opponent
      controls, counter it unless that player pays {2}."
    This means: targeting the face-down creature costs opponents {2} extra.
    Without paying {2}: their targeted spell/ability is countered.
  TURNING FACE UP:
    Same as morph: special action, priority required, pay the disguise cost, flip.
    ETB doesn't re-trigger (same as morph).
  WARD WHILE FACE DOWN:
    The ward {2} is a characteristic of the face-down permanent.
    It persists until flipped.
    Once flipped: the face-up version has its printed characteristics (which may or may not include ward).
  CASTING AT {3}:
    Same logic as morph: opponents see a face-down 2/2. Can't identify it.
    The face-down spell is colorless.

MANIFEST (701.40):
  WHAT IT IS:
    An effect puts a card FACE DOWN as a 2/2 creature.
    NOT cast: it's a permanent entering the battlefield directly (not via the stack usually).
    Any card can be manifested: creature, land, instant, sorcery, enchantment, planeswalker.
    All manifested permanents enter as 2/2 colorless creatures with no abilities.
    ETB triggers DO NOT fire (manifested = face down before entering, 708.3).
  TURNING FACE UP (MANIFESTED CREATURES ONLY):
    You may turn it face up any time you have priority (special action).
    REQUIREMENT: the card must be a CREATURE card.
    Must pay the card's REAL mana cost (not any morph/disguise cost).
    If it's not a creature card (land, instant, sorcery, enchantment, etc.): cannot be turned face up.
    701.40g: instants/sorceries can NEVER be turned face up while manifested.
  MANIFEST vs. MORPH:
    Morph: the CARD has a morph ability. You cast it face down FROM HAND for {3}.
    Manifest: an EFFECT puts it face down. It doesn't matter if the card has morph.
    Morph face-down: turn face up by paying morph cost (not the mana cost).
    Manifest face-down: turn face up by paying the card's mana COST (not a morph cost).
      But only if it's a creature card.
    BOTH: you can always see your own face-down permanents (708.5).
    KEY INTERACTION: if a card has morph and is MANIFESTED:
      You may turn it face up via EITHER: pay morph cost (morph ability) OR pay mana cost (manifest).
      701.40c: "If a card with morph is manifested, its controller may turn it face up using
        either the morph procedure OR the manifest procedure."
      This is flexible: sometimes the morph cost is cheaper, sometimes the mana cost is.
  NON-CREATURE MANIFESTS:
    Lands, enchantments, planeswalkers, instants, sorceries: all become face-down 2/2 creatures.
    They cannot be turned face up via manifest procedure.
    They CAN be turned face up by other effects ("turn target face-down creature face up").
      But: 701.40g — instants/sorceries would be revealed and left face down.
    They leave the battlefield and you must reveal them (708.9).
    Valuable defensive use: manifesting a land = an unblockable fog. Opponent doesn't know.
  MASTERY OF THE UNSEEN (Manifest engine):
    {3}{W}: Manifest the top card of your library.
    Creats surprise value: any card can become a 2/2 blocker/attacker.
    If you manifest a Baneslayer Angel ({3}{W}{W} 5/5): you have a hidden 2/2.
      Next turn: pay {3}{W}{W} to turn it face up as a 5/5. Big swing.
    If you manifest a Plains: it's a useless 2/2 that will never flip. Unfortunate.

FACE-DOWN RULES GENERAL (708):
  NO CHARACTERISTICS EXCEPT LISTED:
    Face-down objects have NO inherent characteristics.
    Type line: "Creature" and that's it (no subtypes).
    Color: colorless.
    Abilities: none (unless the manifest/morph/disguise says otherwise — like disguise's ward {2}).
    Name: no name. Not "unnamed creature" — it literally has no name.
    Mana cost: none. Mana value: 0.
  HIDDEN INFORMATION:
    You CAN look at your own face-down permanents (708.5).
    Opponents CANNOT look at your face-down permanents (unless an effect lets them).
    "Players must ensure face-down objects are differentiable" (708.6):
      You must track which face-down card is which.
      Use dice, counters, tokens placed in a specific order. Tournament enforcement.
  REVEAL ON LEAVING:
    Any time a face-down permanent leaves the battlefield: reveal it (708.9).
    This includes: destroyed, bounced, exiled, sacrificed, etc.
    Everyone sees what it was.
    IMPORTANT: it was never "that card" while face down — turning face down doesn't change what
      zone it was in. It always was that card; just its characteristics were hidden.
  TURNING FACE DOWN VIA SPELLS/ABILITIES:
    Ixidron ({3}{U}{U}): "As Ixidron enters the battlefield, turn all other nontoken creatures
      face down." (Non-morph creatures turned face down — they don't have a face-up cost.)
    Face-down permanents turned face down by Ixidron: they have no morph cost.
    Rule 702.37e: can't turn face up "this way" if the permanent wouldn't have a morph cost.
    These permanents are STUCK face down until they leave the battlefield.
    Exception: if the Ixidron is somehow removed and the permanent has an inherent morph cost
      from its card text... it depends on whether the morph ability still functions face down.
    Morph ability "functions any time the card is face down" (702.37a). So yes — if a card has
      morph and was turned face down by Ixidron, the morph ability still functions.
      You can flip it via morph cost.

SPECIAL ACTION TIMING:
  FACE-UP IS UNCOUNTERABLE:
    Turning face up = special action. Not on the stack.
    Cannot be countered. Cannot be responded to (no priority window between "I flip" and "done").
    But: if an opponent has an instant that can target the face-down creature:
      They must act BEFORE you flip it (while it's still face down).
      Once you announce the flip, it happens immediately.
    Contrast: if an opponent casts "destroy target creature" (an instant):
      They target the face-down creature. That spell is on the stack. You may flip the creature
        in response (the spell is on the stack, you have priority, you can take the special action).
      The morph flip happens before the destroy spell resolves.
      Once face up: the creature has its real P/T and abilities. The destroy spell resolves and
        destroys the now-face-up creature.
      But: if the creature had indestructible when face up (e.g., Airmare), you could flip it
        in response to a destroy to save it.
    This is a key combat trick: flip after blockers declared, before damage.
```

## Definitive Conclusions

- **Face-down permanents have no characteristics except those listed** — colorless, no name, no subtypes, 2/2 (or as specified); morph = 2/2 no special traits; disguise = 2/2 with ward {2}; manifest = same as morph (no traits).
- **ETB abilities don't trigger when a card enters face down** — the card is turned face down before entering the battlefield (708.3); likewise, ETB effects don't re-trigger when the card is turned face up (708.8).
- **Turning face up is a special action** — doesn't use the stack; cannot be countered or responded to; opponents must interact with the face-down creature before the flip is announced.
- **Manifested non-creature cards can never be turned face up via manifest** — instants and sorceries specifically are revealed and left face down (701.40g); non-creature cards can only leave the battlefield face-down (and are then revealed per 708.9).
- **A card with morph that is manifested can use either flip method** — pay morph cost (turn up via morph) OR pay mana cost (turn up via manifest) — whichever is better.
- **Face-down permanents must be revealed when they leave the battlefield** — no secrets at end of game; hidden information is only maintained while the permanent is on the battlefield.

## Canonical Example
**Den Protector Combat Trick:**
Den Protector's front face: {1}{G}: 2/1 with "can't be blocked by creatures with power 2 or greater." Morph cost: {2}{G}. When turned face up: return target card from your GY to your hand.

You cast Den Protector face down on turn 2 for {3}. It's a face-down 2/2 (no abilities).
Turn 3: you have {G}{G} + {3} = {2}{G} spare after attacks. Opponent attacks with their 4/4.
You declare your face-down 2/2 as a blocker. Opponent is happy to trade with it (thinking it's a 2/2).
Declare blockers: after blockers are declared, before combat damage is assigned:

You announce: "I'm turning this face up." Special action — no stack, no responses.
Pay {2}{G}. Reveal: Den Protector.
Den Protector turns face up. It's now a 2/1... but wait: it had been a face-down 2/2 as a blocker.
  (Actually: as a face-down creature blocking, it was declared as 2/2. When it flips to 2/1:
   Combat assignments are already made. The 4/4 still deals 4 to Den Protector. Den Protector dies.
   Den Protector deals 2 to the 4/4 (still has its power as 2/1 after flip, deals 2 damage).
   But: "When Den Protector is turned face up, return target card from your graveyard to your hand."
   That trigger goes on the stack. After combat, Den Protector dies, the return trigger resolves.
   You get a card back from your GY.
The trick: surprise value (maybe they shouldn't have attacked). The GY return is real value.

Better scenario: Use the flip offensively to survive a targeted kill spell.
Opponent casts "Doom Blade" targeting your face-down creature.
You respond: turn Den Protector face up (special action, Den Protector now has real abilities).
Den Protector's front face doesn't have indestructible, but it now triggers "return card from GY."
Doom Blade still resolves and kills Den Protector. BUT: "when turned face up" trigger is on the stack.
Den Protector dies, but you already got the trigger.

**Example 2 — Manifest of a Land (Non-Creature):**
You control Mastery of the Unseen ({1}{W}) with this ability: "{3}{W}: Manifest the top card of your library."

You activate for {3}{W}. Top card: Island (a basic land).
Island enters the battlefield face down as a 2/2 colorless creature with no abilities.
Opponent doesn't know what it is. You know (you can look at your face-down permanents — 708.5).

This face-down Island CANNOT be turned face up via manifest (not a creature card).
If you block with it and it dies: reveal Island to all players (708.9). Your opponent sees the land.

Strategic notes:
- A face-down land is useful as a 2/2 body (better than not having a blocker).
- Don't waste effort trying to flip it — you know it's a land; it stays face down until it dies.
- Sometimes you manifest 5 cards and get 2 creatures + 3 lands: a 2/2 army that disappears quickly.
- When they leave: reveal each. Now opponents know what you've been manifesting.

Better: manifest Elspeth, Sun's Champion ({4}{W}{W}: 3/3 lifelink).
You have a face-down 2/2 (appears cheap, no abilities). Opponent ignores it.
Next turn: {4}{W}{W} mana available. Turn Elspeth face up (special action).
Elspeth enters... wait: "as a face-down permanent is turned face up, ETB abilities don't trigger."
Elspeth's +1/+1 loyalty abilities don't trigger "entering." But she IS a planeswalker now.
Actually: planeswalkers don't have ETB triggers typically — their abilities are activated.
The "enters with N loyalty" counters: this IS affected by the face-down status.
Rule: loyalty counters are placed "as it enters" (CDA for base loyalty). Since it didn't "enter"
  when flipping face up (it already entered), the loyalty counter placement...
Actually: Elspeth as manifested entered the battlefield face down. When you turn it face up,
  she becomes a planeswalker. But the "enters with 4 loyalty" triggered event doesn't re-fire.
She'd have 0 loyalty (no counters were placed as she entered — she entered as a face-down 2/2).
  Wait: loyalty is more nuanced. Face-down is a replacement effect on characteristics.
  When it turns face up: "copiable values revert" (708.8). That includes that it's a planeswalker.
  Loyalty counters from "enters with N loyalty" are placed via a static ability during ETB —
    but ETB doesn't re-trigger (708.8). She enters the battlefield face-down without those counters.
  She'd turn face up as a planeswalker with 0 loyalty (from the face-down phase), immediately
    becoming an SBA sacrifice target (704.5i: planeswalker with 0 loyalty → removed from game).
  This is a real and important manifested-planeswalker gotcha.
Conclusion: manifesting a planeswalker creates a face-down 2/2, but flipping it leaves it at 0
  loyalty — it's immediately sacrificed. Not a useful play.

## Commonly Confused With
- **P374 (Daybound/Nightbound Transform)** — Transform mechanics also flip cards between faces, but they're DFCs with defined front/back faces. Morph/disguise/manifest flip hidden-characteristic cards. DFCs' ETB doesn't re-fire on transform; morph/disguise/manifest ETB also doesn't re-fire on face-up — same rule (708.8), different context.
- **P002 (Replacement Effects)** — Manifest's face-down entry is not technically a replacement effect on the card itself; it's an effect that puts the card down face down (the card is turned face down before entering — 708.3). But effects like Clone entering as a face-down morph creature: Clone copies the face-down characteristics (the 2/2) while face down, then if turned face up, copies the morph card's real characteristics (708.10).
- **P003 (Zone Change — New Object)** — When a face-down permanent is turned face up, it's NOT a zone change. It's a characteristics change. It's the same object (same permanent, same zone — the battlefield). P003's "new object" rule doesn't apply here. Spells targeting the face-down creature while on the stack still resolve against the now-face-up creature.
- **P007 (Split-Second and Priority Windows)** — The "flip is a special action" is the face-down equivalent of a priority-less action. Like paying a morph cost during combat in a priority window: after blockers are declared, before damage, each player gets priority. You use that priority window to announce the special action flip.
