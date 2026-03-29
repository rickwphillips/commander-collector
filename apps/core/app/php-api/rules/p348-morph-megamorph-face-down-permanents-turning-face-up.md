---
id: p348
name: Morph, Megamorph, and Face-Down Permanents — Casting Face-Down, Turning Face-Up, and Bluffing
category: zones
cr_refs: [702.37a, 702.37b, 702.37c, 702.37d, 702.37e, 708.2, 708.2a, 708.3, 708.4, 708.5, 708.6, 708.7, 708.8, 708.9]
tags: [morph, megamorph, face-down, turning-face-up, bluffing, secret-card, Willbender, Ixidron, Bane-of-the-Living, Den-Protector, Grinning-Demon, Nantuko-Vigilante, special-action, ETB-not-on-face-up, Exalted-Angel]
created: 2026-03-29
examples_count: 2
---

# P348 — Morph, Megamorph, and Face-Down Permanents — Casting Face-Down, Turning Face-Up, and Bluffing

## Abstract
**Morph** lets you cast a creature face-down for {3} as a 2/2 with no name, types, or abilities (702.37c). The opponent doesn't know what the card is. At any time you have priority, you may turn a morph face-up as a special action by paying its morph cost — no stack, no response window (702.37e). Face-down permanents have **no characteristics** except what the rules or effect grant them (708.2a). ETB abilities DON'T trigger when a face-down permanent is turned face-up — the permanent already entered the battlefield (708.8). **Megamorph** adds a +1/+1 counter when turned face-up with its megamorph cost (702.37b). Players must always be able to distinguish their face-down permanents — you can look at your own face-down cards but not opponents' (708.5).

## The Definitive Rules

**CR 702.37c** (verbatim): *"To cast a card using its morph ability, turn it face down and announce that you're using a morph ability. It becomes a 2/2 face-down creature card with no text, no name, no subtypes, and no mana cost. Any effects or prohibitions that would apply to casting a card with these characteristics (and not the face-up card's characteristics) are applied to casting this card. These values are the copiable values of that object's characteristics. Put it onto the stack (as a face-down spell with the same characteristics), and pay {3} rather than pay its mana cost."*

**CR 702.37e** (verbatim): *"Any time you have priority, you may turn a face-down permanent you control with a morph ability face up. This is a special action; it doesn't use the stack. To do this, show all players what the permanent's morph cost would be if it were face up, pay that cost, then turn the permanent face up. The morph effect on it ends, and it regains its normal characteristics. Any abilities relating to the permanent entering the battlefield don't trigger when it's turned face up and don't have any effect, because the permanent has already entered the battlefield."*

**CR 708.2a** (verbatim): *"If a face-up permanent is turned face down by a spell or ability that doesn't list any characteristics for that object, it becomes a 2/2 face-down creature with no text, no name, no subtypes, and no mana cost. A permanent that enters the battlefield face down also has these characteristics unless otherwise specified by the effect that put it onto the battlefield face down or allowed it to be cast face down. These values are the copiable values of that object's characteristics."*

**CR 708.8** (verbatim): *"As a face-down permanent is turned face up, its copiable values revert to its normal copiable values. Any effects that have been applied to the face-down permanent still apply to the face-up permanent. Any abilities relating to the permanent entering the battlefield don't trigger and don't have any effect, because the permanent has already entered the battlefield."*

**CR 708.9** (verbatim): *"If a face-down permanent or a face-down component of a merged permanent moves from the battlefield to any other zone, its owner must reveal it to all players as they move it."*

## The Pattern

```
CASTING A MORPH SPELL (CR 702.37c–d):
  How:
    Turn the card face-down. Announce "using morph ability."
    Put it on the stack face-down for {3}.
    Resolves → enters battlefield face-down (unless it would enter with ETB face-up effects,
      in which case it just enters face-down normally).
  CHARACTERISTICS WHILE FACE-DOWN (708.2a):
    Name: none.
    Types: creature (generic).
    Subtypes: none.
    Rules text: none.
    Mana cost: none.
    Power/toughness: 2/2.
    Color: colorless.
  WHY THIS MATTERS:
    "Can't be countered if it's a blue spell": face-down is colorless → not blue → can be countered.
    "Can't target creatures with mana value 3+": face-down has no mana cost → MV 0 → CAN be targeted.
    "Destroy all white creatures": face-down is colorless → not white → survives.
    Target an Exalted Angel morphed face-down: it's a 2/2 colorless creature with MV 0.
      Effects targeting "target white creature" can't find it. It's colorless.
  MORPH COSTS:
    Morph costs vary. Usually color-specific (e.g., Exalted Angel {5}{W}: morph {2}{W}{W}).
    Megamorph ({3} cost, {morph cost} to turn up, plus +1/+1 counter): same structure.
    A card's morph cost is PUBLIC KNOWLEDGE when turned face-up (you reveal it, 702.37e).
    BUT: while face-down, it's a bluff. Opponent can't tell which morph you cast.

TURNING FACE-UP (CR 702.37e):
  SPECIAL ACTION — doesn't use the stack:
    Happens instantly. Opponent CANNOT respond to it.
    No priority window between "I'm turning this face-up" and "it's face-up."
    Relevant: if you want to use the face-up creature's ability in response to something,
      you MUST turn it face-up at the appropriate priority window.
    Example: Cast removal at opponent's creature, they respond by morphing in a blocker
      and immediately turning it face-up as Willbender (morph creature with "turn target spell
      to a new target" ability). No window to stop this — it's a special action.
  ETB ABILITIES DON'T FIRE (708.8):
    This is critical. When you turn a morph face-up: NO ETB trigger.
    The creature ALREADY entered the battlefield (when it was cast face-down).
    "When [this] enters" triggers fired when it entered face-down — but since it had no text
      while face-down, those triggers were suppressed (708.3: objects put onto battlefield face-down
      don't trigger ETB abilities, since they're face-down before entering).
    Wait: 708.3 says: "Objects that are put onto the battlefield face down are turned face down
      before they enter the battlefield, so the permanent's enters-the-battlefield abilities won't
      trigger (if triggered) or have any effect (if static)."
    So: ETB triggers don't fire when ENTERING face-down either.
    ETB abilities NEVER fire for morphed creatures (neither on entry nor on face-up). Ever.

  EFFECTS ALREADY APPLIED CONTINUE (708.8):
    If a +2/+2 pump was given to the face-down 2/2 this turn: when it turns face-up, it still has +2/+2.
    The pump effect stays.
    If an Aura was attached to the face-down creature: it stays attached after turning face-up.
      (Unless the Aura can't enchant the face-up creature type — then SBA forces Aura to GY.)

DISTINGUISHING FACE-DOWN PERMANENTS (708.6):
  You control multiple face-down permanents: MUST be clearly distinguishable at all times.
  Common methods: dice, counters, different orientations, order on table.
  You can look at your OWN face-down permanents any time (708.5).
  You CANNOT look at opponents' face-down permanents.
  If a face-down permanent leaves the battlefield: REVEAL IT to all players (708.9).
    Going to GY, exile, hand, library: must show what it was.
    This prevents gaming the secret information after the fact.

FACE-DOWN FROM OTHER EFFECTS (not morph):
  Some effects turn permanents face-down (not via morph):
    Ixidron ({4}{U}{U}): "Each other nontoken creature on the battlefield enters or becomes face-down."
      These face-down creatures have no morph ability. They can't be turned face-up as a special action.
      Only an effect that explicitly says "turn face up" can restore them.
    Bane of the Living (morph creature): "When morphed [face-up], all creatures get -X/-X..."
      This WOULD be an ETB-like ability, but per 708.8: no ETB abilities trigger on turning face-up.
      Wait: Bane of the Living's ability says "When this is turned face up..." — this is NOT an ETB ability.
        "When turned face up" is a different triggered ability from "when enters."
        This ability DOES trigger when turned face-up. (ETBs don't; "when face-up" abilities do.)
      IMPORTANT DISTINCTION:
        "When [permanent] enters" = ETB trigger. Does NOT fire when turning face-up.
        "When [permanent] is turned face up" = face-up trigger. DOES fire when turned face-up.

MEGAMORPH (702.37b):
  "Megamorph [cost]": same as morph, PLUS "as this permanent is turned face up, put a +1/+1 counter on it if its megamorph cost was paid to turn it face up."
  Same "special action" rules as morph.
  Extra effect: entering face-up with a +1/+1 counter if megamorph cost paid.
  Example: Den Protector ({1}{G}, megamorph {1}{G}): 2/2 creature.
    Face-down: 2/2 colorless.
    Turned face-up with megamorph cost: becomes Den Protector with +1/+1 counter = 3/3.
    Den Protector face-up ability: "When this is turned face up, return target card from GY to hand."
      This triggers because it says "when turned face up" (not ETB).

WHEN TO TURN FACE-UP:
  BEFORE COMBAT (beginning of combat step): turn morph face-up to get its abilities for combat.
    Example: Krosan Colossus (morph {6}{G}{G}): 9/9 when face-up. Turn it face-up before attackers are declared.
  AFTER BLOCKERS DECLARED: reveal a flash-effect morph as a surprise.
    Example: Willbender (morph {1}{U}): "When turned face up, change the target of target spell or ability."
      Turn face-up in response to opponent's removal spell (after they target something, during their priority on the stack). Willbender triggers on face-up → redirect the spell.
      Since turning face-up is a SPECIAL ACTION (not on stack): you can turn it face-up at any priority window.
      Then the "when turned face up" trigger goes on the stack. Opponent can respond to THAT trigger.
      But they can't stop the face-up action itself.
  AS A BLOCKER SURPRISE:
    Attack with a face-down 2/2 morph. Blocker declared. Turn face-up to reveal a 10/10 creature.
    After blockers declared: damage assignment happens based on current P/T. The 10/10 deals 10 damage.

INFORMATION VISIBILITY:
  Opponent knows:
    That you have a face-down creature (visible on battlefield).
    That you paid {3} to cast it (morph cost is always {3}).
    Any counters or effects applied to it.
  Opponent does NOT know:
    Which morph card it is.
    The card's actual morph turn-up cost (until it's revealed).
  BLUFFING ELEMENT:
    You can cast morph creatures specifically to bluff. An expensive-to-turn-up morph (Exalted Angel {5}{W}{W}) is a threat. Opponent must respect it.
    Even if you have a "vanilla" morph with low impact: face-down maintains the bluff.
```

## Definitive Conclusions

- **ETB abilities don't trigger when turning face-up** — they also don't trigger when entering face-down; "when turned face up" abilities DO trigger on face-up.
- **Turning face-up is a special action — no stack, no response window** — it happens instantly at any priority window; opponents can't respond to the action itself.
- **Face-down permanents have no characteristics except 2/2 colorless creature** — this means morph creatures are immune to color-based and type-based destruction while face-down.
- **Revealing a face-down card is mandatory when it leaves the battlefield** — all face-down cards must be revealed when they move from the battlefield to any other zone.
- **Effects applied while face-down persist after turning face-up** — pump spells, Aura attachments, damage marks (if any) all carry over.
- **Multiple face-down permanents must be distinguishable at all times** — use dice, counters, or position to track them separately.

## Canonical Example
**Willbender Surprise — Redirecting Removal:**
You control two face-down morph creatures: one is Willbender ({1}{U}U}: 1/2: morph {1}{U}: "When this is turned face up, change the target of target spell or ability with a single target."), the other is a Grinning Demon (morph {2}{B}{B}).

Opponent casts Doom Blade ({1}{B}): "Destroy target nonblack creature." They target your other creature (a 4/4 Tarmogoyf).

YOU HAVE PRIORITY to respond (Doom Blade is on the stack, active player gets priority after the spell is cast).
Wait: opponent cast the spell. Opponent gets priority first after casting... then both players pass in succession for it to resolve. Before it resolves, you get a priority window.

You take a SPECIAL ACTION: turn Willbender face-up. Pay its morph cost {1}{U}.
Willbender is now face-up. Its "when turned face up" trigger goes on the stack.
The stack (from bottom to top): Doom Blade → Willbender's trigger.

Willbender's trigger resolves first: "change the target of target spell or ability with a single target."
You target Doom Blade (the spell with a single target). Change its target to... what's a legal target?
Doom Blade says "destroy target nonblack creature." Options: any nonblack creature on the battlefield.
You redirect it to Willbender itself (now face-up, 1/2 blue — not black). Doom Blade now targets Willbender.
Or redirect to opponent's creature (if it's nonblack).

Doom Blade resolves: destroys Willbender (its new target). Willbender dies.
Your Tarmogoyf is safe.

Opponent was surprised — they didn't know that face-down creature was Willbender.

**Example 2 — ETB vs. "When Turned Face Up" Distinction:**
You control Exalted Angel ({5}{W}): morph cost {2}{W}{W}.
Normal text: "Flying. Whenever a creature deals damage to you, you gain that much life."
ETB text? None relevant here.
Versus Nantuko Vigilante ({2}{G}): morph {2}{G}: "When this is turned face up, destroy target artifact or enchantment."

Both cast face-down for {3}.

SCENARIO A: Exalted Angel entered face-down (turn 3). Later turns it face-up.
  Nothing triggers when it ENTERED face-down (morph suppresses ETB and static effects).
  Turn face-up: no "when this enters" ability on Exalted Angel. Nothing special happens.
  It's now a 4/5 flying creature with lifelink on any future damage it takes.
  The lifelink ability works going forward; it just didn't trigger when it entered.

SCENARIO B: Nantuko Vigilante entered face-down.
  Turn face-up: "When this is turned face up" ability triggers!
  This is NOT an ETB trigger. It's a specific "on face-up" trigger. It fires.
  Destroy target artifact or enchantment.
  Result: Nantuko Vigilante turned face-up = destroy an artifact or enchantment (your choice of target).

KEY DISTINCTION: "When [creature] enters" → ETB → doesn't trigger when morph enters face-down OR when turned face-up. "When [creature] is turned face up" → face-up trigger → fires WHEN turned face-up (not on entry). Two completely different abilities.

## Commonly Confused With
- **P332 (Phasing vs. Blinking)** — Phasing doesn't cause a zone change; morph's face-down entering also doesn't have a "new object" issue (it entered face-down, then turned face-up as the same object). Unlike blinking, turning morph face-up is the SAME object — no zone change, no new object.
- **P339 (Dies Triggers)** — If a face-down morph creature dies (destroyed while face-down), it's revealed (708.9) and goes to GY. The "dies" trigger fires normally (it's still a creature that was put into the GY from the battlefield — even though it was face-down, it was a creature).
- **P341 (Combat Phase)** — A face-down 2/2 has no evasion (no flying, no unblockable). Turning it face-up mid-combat (after blockers declared) changes its characteristics — combat damage is then calculated based on the face-up P/T.
- **P004 (Layer System)** — When a face-down permanent turns face-up, its copiable values revert (708.8). The layer system then re-applies to the now face-up permanent with its new base characteristics. Continuous effects from before still apply.
