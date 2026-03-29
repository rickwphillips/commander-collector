---
id: p284
name: Ward, Hexproof, and Shroud — Targeting Protection Spectrum
category: continuous
cr_refs: [702.20a, 702.20b, 702.20c, 702.20d, 702.20e, 702.11a, 702.12a, 702.13a, 702.14a]
tags: [ward, hexproof, shroud, targeting, protection, untargetable, Sheoldred, Wandering-Emperor, Teferi-Mage-of-Zhalfir, Thrun-the-Last-Troll, Greater-Good, targeting-restriction]
created: 2026-03-29
examples_count: 2
---

# P284 — Ward, Hexproof, and Shroud — Targeting Protection Spectrum

## Abstract
Three mechanics that protect permanents from being targeted. **Shroud**: the permanent can't be targeted by spells or abilities — including by its own controller. **Hexproof**: the permanent can't be targeted by spells or abilities that opponents control — your own targeting still works. **Ward N**: whenever a spell or ability an opponent controls targets this permanent, that opponent must pay an additional N mana (or life, etc.) or the spell/ability is countered. Ward is a tax, not immunity; Hexproof is partial immunity; Shroud is complete immunity. Understanding which applies — and to whom — is critical for understanding removal resistance.

## The Definitive Rules

**CR 702.18a** (verbatim): *"Shroud is a static ability. 'Shroud' means 'This permanent or player can't be the target of spells or abilities.'"*

**CR 702.11a** (verbatim): *"Hexproof is a static ability. 'Hexproof' means 'This permanent or player can't be the target of spells or abilities your opponents control.'"*

**CR 702.20a** (verbatim): *"Ward is a triggered ability. 'Ward [cost]' means 'Whenever this permanent becomes the target of a spell or ability an opponent controls, counter that spell or ability unless that player pays [cost].'"*

## The Pattern

```
PROTECTION SPECTRUM (from weakest to strongest at preventing targeting):

  WARD (weakest — taxing):
    Triggered: when an opponent targets this permanent → they must pay [cost] or spell/ability countered
    Ward CAN be paid: {2}, or a life payment, or other cost
    Opponent who doesn't pay: the spell is countered (on resolution of the Ward trigger)
    Multiple Ward instances: each triggers separately → opponent must pay EACH ward cost
    Ward doesn't stop targeting — it punishes insufficient payment
    KEY: opponents CAN target it; they just need to pay the tax
    You CAN target your own ward permanent freely (Ward only triggers off opponent control)

  HEXPROOF (middle — partial immunity):
    Static: opponents CAN'T target this permanent with their spells or abilities
    You CAN target it with YOUR spells and abilities
    Opponents: literally can't choose it as a target → not a valid target for their spells
    Exception: "can't be targeted by blue spells" with Protection from Blue: the permanent has
      protection from blue → you ALSO can't target it with your own blue spells
    Hexproof is ONLY about opponents — self-targeting always works
    Common mistake: trying to buff your hexproof creature with an aura (you CAN do this)
    The creature has hexproof → OPPONENTS can't enchant it → YOU can

  SHROUD (strongest — complete immunity):
    Static: NO ONE can target this permanent — not you, not opponents
    Your own auras, pump spells, protective instants: CAN'T target it
    Teferi, Mage of Zhalfir gives everything shroud? No: flash and can't-be-counterspelled is a different card.
    Thrun, the Last Troll ({2}{G}{G}): 4/4 Hexproof (wait — Thrun specifically has hexproof, not shroud)
    True shroud examples: Sidar Jabari (Protection and Shroud in some texts)
    Classic shroud cards: Asceticism enchantment gives all creatures hexproof (not shroud)
    Actual shroud keyword is rarely printed post-Magic 2010 (replaced by hexproof for usability)

  COMPARISON TABLE:
    | Protection | Own Targeting | Opponent Targeting |
    |Ward        | Unrestricted  | Allowed (with tax) |
    |Hexproof    | Unrestricted  | Blocked           |
    |Shroud      | Blocked       | Blocked           |

WARD DETAILS:
  Ward costs can be diverse:
  Ward {2}: opponent pays {2} or spell countered. Most common.
  Ward {3}: Sheoldred, the Apocalypse's ward variant (Commander).
  Ward — discard a card: Rishada Port ward variant.
  Ward — pay 2 life: some newer cards use life payments.
  Ward — sacrifice a creature: some ward cards require sacrifice (steep cost).

  WARD TRIGGERS TIMING:
    Ward is a triggered ability: triggers when targeted → goes on stack → opponent may pay → resolves.
    Between targeting and ward resolution: the spell/ability is still on the stack.
    Both the spell AND the ward trigger are on the stack simultaneously.
    The ward trigger is on top → resolves first.
    If opponent pays the ward cost → ward trigger resolves → spell proceeds normally.
    If opponent can't or won't pay → ward trigger resolves by countering the targeting spell.
    KEY: opponent must have mana available when the ward trigger resolves (not when they target).

  WARD + MULTIPLE INSTANCES:
    A creature with Ward {2} and Ward {2} (from two sources): opponent must pay {4} total.
    Each ward triggers separately, each must be paid separately.
    Ward stacks: each instance is a separate trigger.

HEXPROOF FROM [QUALITY]:
  "Hexproof from [quality]" (CR 702.11b): can't be targeted by [quality] spells/abilities
  Narrower than full hexproof: only from one color, type, etc.
  Example: "Hexproof from white" — opponent's white spells can't target it, but black/blue/etc. can.
  Hexproof from instants, hexproof from noncreature spells: variety of partial protections.

SHROUD vs HEXPROOF IN PRACTICE:
  Shroud cards (classic): Autumn's Veil grants hexproof TO YOUR CREATURES AND PLANESWALKERS this turn.
  If a card says "hexproof" post-Magic 2010: guaranteed you can target your own stuff.
  If a card says "shroud" (older cards): you can't target it either.
  Building around Shroud permanents: can't buff them with auras or targeted instants.
  Building around Hexproof permanents: you CAN aura them up (opponents can't remove the auras).

NOTABLE EXAMPLES:
  Ward {3} Sheoldred, the Apocalypse ({2}{B}{B}): "Whenever you draw a card, you gain 2 life. Whenever
    an opponent draws a card, they lose 2 life. Ward {3}."
    Ward {3}: any opponent removal spell costs {3} more → effectively a 5-7 mana removal cost.
    Combined with life drain: Sheoldred is extremely oppressive AND hard to remove.

  Wandering Emperor ({2}{W}{W}): Legendary Planeswalker with Ward {2}.
    Opponents targeting the Emperor with removal: must pay {2} extra or lose the removal.
    Ward on a planeswalker: rare, makes her significantly harder to kill with targeted removal.

  Thrun, the Last Troll ({2}{G}{G}): 4/4, Hexproof, Regenerate.
    Can't be targeted by opponent spells → survives most removal.
    Regenerate {1}{G}: if destroyed by non-regeneration effects → regenerate.
    Two layers: hexproof (can't target) + regenerate (can't destroy).
```

## Definitive Conclusions

- **Ward taxes, doesn't stop targeting** — opponent pays extra or the spell is countered.
- **Hexproof blocks opponent targeting** but allows you to target your own permanents freely.
- **Shroud blocks ALL targeting** — even your own spells and abilities can't target it.
- **Ward triggers are on a stack** — opponent pays when the trigger resolves, not when they declare targeting.
- **Hexproof from [quality]** is narrower protection — only against that specific quality.

## Canonical Example
**Sheoldred Ward {3} Protecting a Threat:**
Opponent has: Fatal Push, Go for the Throat, and {4} mana.
Board: Sheoldred, the Apocalypse (2/4, life drain each draw, Ward {3}).
Opponent casts Fatal Push ({B}) targeting Sheoldred.
Ward trigger: "Whenever an opponent targets this, counter the spell unless they pay {3}."
Opponent must pay {3} or Fatal Push is countered. They have {4} mana: pay {3} → {1} mana left.
Fatal Push resolves. Sheoldred is destroyed.
If opponent had only {3} mana: pay {3}, nothing left but Fatal Push resolves.
If opponent had {2} mana: can't pay {3} → Ward trigger resolves by countering Fatal Push.
Sheoldred survives. Ward made a {1} removal spell cost effectively {4} total (Push + Ward tax).
Double-slotted protection: Ward makes each targeting attempt expensive.

**Example 2 — Hexproof Aura Targeting:**
Your Thrun, the Last Troll (4/4 Hexproof). You want to enchant it with Rancor ({G}).
Can you target Thrun with Rancor? YES: Hexproof only blocks OPPONENT targeting. You're the controller.
Cast Rancor targeting your own Thrun. Rancor enchants Thrun → +2/+0 + Trample.
Thrun is now 6/4 with Trample, Hexproof, and Regeneration.
Opponents: can't target Thrun with any removal (hexproof blocks it).
Can't target Rancor (it's on Thrun): Rancor is an aura enchanting Thrun. Wait: Rancor itself is targetable (it doesn't have hexproof).
Opponent could target Rancor directly with enchantment removal to send it to GY.
But Thrun itself: completely un-targetable by opponents.

## Commonly Confused With
- **P016 (Protection from [Quality])** — Protection stops DEBT: damage, enchanting, blocking, targeting. Hexproof only stops targeting. Protection is strictly stronger.
- **P220 (Ward)** — Ward is a triggered ability (costs apply when triggered resolves); Hexproof is a static ability (passive, no trigger). Ward can be paid; Hexproof can't.
- **P013 (Indestructible)** — Indestructible prevents destruction (not targeting); Hexproof prevents targeting (not destruction from non-destroying effects).
