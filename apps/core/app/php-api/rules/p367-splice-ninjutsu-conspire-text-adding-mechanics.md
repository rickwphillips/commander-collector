---
id: p367
name: Splice, Ninjutsu, and Conspire — Text-Adding, Hand-Zone Activations, and Copy-on-Tap
category: stack
cr_refs: [702.47a, 702.47b, 702.47c, 702.47d, 702.47e, 702.49a, 702.49b, 702.49c, 702.49d, 702.78a, 702.78b]
tags: [splice, splice-onto-arcane, ninjutsu, commander-ninjutsu, conspire, additional-cost, text-changing, color-identity-not-gained, unblocked-attacker, combat-trick, copy-if-paid, Glacial-Ray, Reach-Through-Mists, Ninja-of-the-Deep-Hours, Yuriko, Ink-Treader-Nephilim]
created: 2026-03-29
examples_count: 2
---

# P367 — Splice, Ninjutsu, and Conspire — Text-Adding, Hand-Zone Activations, and Copy-on-Tap

## Abstract
**Splice onto [quality]** (702.47a) lets you add a card's rules text to another spell of the correct quality as an additional cost. The spliced card remains in your hand — you're adding its text, not casting it. Crucially: the main spell gains the text but NOT other characteristics (color, name, types) of the spliced card — creating a Blue spell that deals "damage to any target" after splicing a red card is legal. **Ninjutsu** (702.49a) is an activated ability that functions only from the hand: pay cost, reveal the Ninja, return an unblocked attacker you control to your hand — the Ninja enters the battlefield tapped and attacking the same target. No casting, no summoning sickness, no haste needed (it's attacking by the ability's effect). **Conspire** (702.78a) is a two-part keyword: an additional cost (tap two creatures sharing a color with the spell) and a triggered ability (when you cast this, if conspire cost was paid, copy it). The copy IS created by a triggered ability — it's not cast, so "when you cast" effects don't trigger for the copy.

## The Definitive Rules

**CR 702.47a** (verbatim): *"Splice is a static ability that functions while a card is in your hand. 'Splice onto [quality] [cost]' means 'You may reveal this card from your hand as you cast a [quality] spell. If you do, that spell gains the text of this card's rules text and you pay [cost] as an additional cost to cast that spell.'"*

**CR 702.47c** (verbatim): *"The spell has the characteristics of the main spell, plus the rules text of each of the spliced cards. This is a text-changing effect (see rule 612, 'Text-Changing Effects'). The spell doesn't gain any other characteristics (name, mana cost, color, supertypes, card types, subtypes, etc.) of the spliced cards. Text gained by the spell that refers to a card by name refers to the spell on the stack, not the card from which the text was copied."*
*Example (verbatim): "Glacial Ray is a red card with splice onto Arcane that reads, 'Glacial Ray deals 2 damage to any target.' Suppose Glacial Ray is spliced onto Reach Through Mists, a blue spell. The spell is still blue, and Reach Through Mists deals the damage. This means that the ability can target a creature with protection from red and deal 2 damage to that creature."*

**CR 702.49a** (verbatim): *"Ninjutsu is an activated ability that functions only while the card with ninjutsu is in a player's hand. 'Ninjutsu [cost]' means '[Cost], Reveal this card from your hand, Return an unblocked attacking creature you control to its owner's hand: Put this card onto the battlefield from your hand tapped and attacking.'"*

**CR 702.49c** (verbatim): *"The creature put onto the battlefield with the ninjutsu ability enters attacking the same player, planeswalker, or battle as the creature that was returned to its owner's hand."*

**CR 702.78a** (verbatim): *"Conspire is a keyword that represents two abilities. The first is a static ability that functions while the spell with conspire is on the stack. The second is a triggered ability that functions while the spell with conspire is on the stack. 'Conspire' means 'As an additional cost to cast this spell, you may tap two untapped creatures you control that each share a color with it' and 'When you cast this spell, if its conspire cost was paid, copy it. If the spell has any targets, you may choose new targets for the copy.'"*

## The Pattern

```
SPLICE ONTO ARCANE (702.47a):
  WHAT IT IS:
    Splice is a static ability on cards in your hand.
    "Splice onto Arcane [cost]": you may reveal this card from your hand when casting an Arcane spell.
    If you do: that spell gains the TEXT of the splice card as additional text.
    You pay the splice cost as additional cost to cast the spell.
    THE SPLICED CARD STAYS IN YOUR HAND. You did not cast it. You added its text.
  CHARACTERISTICS NOT GAINED (702.47c):
    The main spell gains TEXT ONLY (rules text).
    NOT gained: name, mana cost, color, supertypes, types, subtypes of the splice card.
    KEY IMPLICATION: color identity of the main spell is unchanged.
      Glacial Ray ({1}{R}) spliced onto Reach Through Mists ({U}):
        Reach Through Mists remains a Blue spell (it's the main spell).
        It gains the text "Glacial Ray deals 2 damage to any target."
        But the spell is BLUE. Not red.
        Protection from red DOES NOT apply to the damage it deals (it's from the blue spell).
    TARGETING: The new text targets separately. You choose targets for the added text
      during normal target selection (601.2c). (702.47d)
  MULTIPLE SPLICES:
    Can splice multiple cards onto one spell. (702.47b)
    Reveal all simultaneously. Choose order of effects.
    Main spell's effects happen first, then spliced effects in chosen order.
    Can't splice the same card twice on the same spell.
  SPLICE CARD REMAINS IN HAND:
    This is the KEY advantage: splice card stays in hand.
    Can be spliced again on a future Arcane spell.
    Can eventually be cast normally (paying its full mana cost).
    702.47a example: "It can even be discarded to pay a 'discard a card' cost of the spell it's spliced onto."
      Interesting: you splice Glacial Ray onto a spell with "discard a card" in the splice text...
      Actually: the example means: the spliced card (still in hand) can be discarded to pay
        a cost on the MAIN SPELL that says "discard a card." (But this is unusual.)
  ARCANE AS A SPELL SUBTYPE:
    Splice onto Arcane works with Arcane spells — instants and sorceries with the subtype Arcane.
    The Kamigawa block had many Arcane spells. Outside Kamigawa: very few.
    Modern has some: Goryo's Vengeance (Arcane), Through the Breach (Arcane), etc.
  INTERACTION WITH COPY:
    If you copy a spliced spell: the copy has the combined text (the splice text is part of it).
    The copy has all targets, including those chosen for the spliced text.
    You may choose new targets for the copy.
    BUT: the copy doesn't represent the splice card being in hand (it doesn't use the splice card).
    The splice just modified the text; the text is now part of the spell; copies copy that text.

NINJUTSU (702.49a):
  WHAT IT IS:
    Ninjutsu is an activated ability that functions ONLY IN YOUR HAND.
    "[Cost], Reveal this card, Return an unblocked attacking creature you control to your hand:
      Put this card onto the battlefield tapped and attacking."
    This is an ACTIVATED ABILITY, not a casting event.
  WHEN CAN YOU ACTIVATE:
    During combat, after blockers are declared:
      Blockers are declared. An attacker is declared unblocked.
      You can activate ninjutsu using that unblocked attacker as the creature to return.
    Timing: after blockers are declared and before damage. You need priority.
    Can also use ninjutsu after first-strike damage but before normal damage step.
    Activated ability: can be used any time you have priority (in combat = after blockers declared).
  THE "UNBLOCKED" REQUIREMENT:
    The creature must be "unblocked" at time of activation.
    A creature is unblocked once the declare blockers step passes without being blocked.
    Can't ninjutsu with a blocked creature — it has blockers assigned.
  ENTERING TAPPED AND ATTACKING (702.49c):
    The Ninja enters ATTACKING THE SAME TARGET as the returned creature.
    Same player, planeswalker, or battle as the creature it replaced.
    The Ninja enters attacking — no "attack restriction" (like "can't be blocked") applies
      to the ninjutsu declaration (it's just entering attacking, not a legal attack declaration
      during declare attackers step).
    SUMMONING SICKNESS: The Ninja enters tapped and attacking. It's in combat.
      When combat ends: the Ninja is on the battlefield. It came under your control "this turn."
      Next turn: it has summoning sickness. Can't attack again (unless it has haste).
    NO ETB SUPPRESSION: The Ninja enters as normal (it wasn't "cast" but it still enters).
      Wait: actually, it IS entering the battlefield. ETB triggers fire.
      Ninjutsu puts it onto the battlefield, triggering any ETB abilities the Ninja has.
    KEY NINJUTSU CARDS:
      Ninja of the Deep Hours ({3}{U}): "Ninjutsu {1}{U}. Whenever Ninja of the Deep Hours deals
        combat damage to a player, you may draw a card."
        ETB: fires when it enters via ninjutsu. (Ninja has no ETB, but the damage trigger fires.)
        The ninjutsu Ninja is attacking. If it deals damage: draw a card.
        The original creature (returned to hand): it can be re-cast next turn to provide
          another unblocked attacker for ninjutsu next time.
      Yuriko, the Tiger's Shadow ({1}{U}{B}): "Commander ninjutsu {U}{B}."
        702.49d: Commander ninjutsu functions from the command zone as well as the hand.
        When Yuriko deals combat damage to a player: each player loses life equal to the
          mana value of the top card of your library; you draw a card.
        This is an ETB trigger? No: it's a "whenever deals combat damage" trigger.
        But: Yuriko's commander ninjutsu means she can bypass commander tax to some extent
          (ninjutsu cost doesn't scale with command zone returns).
  RETURNED CREATURE (TO HAND):
    The creature you return to your hand during ninjutsu:
      It went from battlefield to hand. This is a zone change (battlefield → hand).
      All enchantments on it fall off (go to GY). Equipment detaches (stays on battlefield).
      It's now a "new object" in hand (zone change). No memory of being the attacker.
      Any "when this creature leaves the battlefield" triggers fire.
      It can be re-cast from hand later for its normal mana cost.

CONSPIRE (702.78a):
  WHAT IT IS:
    Conspire is two abilities: additional cost + triggered ability.
    Cost: tap two untapped creatures sharing a color with the spell.
    Trigger: "When you cast this spell, if conspire cost was paid, copy it."
  COPY IS NOT CAST:
    The copy created by conspire is NOT cast.
    "When you cast this spell" — the copy was never cast; the trigger just puts it on the stack.
    So: prowess doesn't trigger for the copy. Storm count doesn't increase for the copy.
    "When you cast a spell" effects don't fire for the copy.
  COLOR REQUIREMENT:
    The two creatures tapped for conspire must share A COLOR with the spell (not all colors).
    If the spell is Red: you need creatures that are at least Red.
    Multi-colored creatures work: a Red/Blue creature can conspire a Red spell.
    A colorless creature CANNOT conspire any colored spell (no shared color).
    An artifact creature that's also Red: can conspire a Red spell.
  MULTIPLE INSTANCES:
    702.78b: Multiple instances of conspire each work separately. Pay each separately.
    Two conspire abilities → pay the cost twice (each triggers based on its own payment).
    Result: two copies (one from each conspire trigger).
  INTERACTION WITH TARGETING:
    The copy has the same targets by default. You may choose new targets for the copy.
    If you choose different targets: both the original and the copy resolve (each with their own targets).
  WHAT CONSPIRE DOES (COMBO):
    Classic: cast a cheap effective spell (say, Nettlevine Blight or Burn Trail), conspire it.
    Pay with two creatures: get the effect twice.
    This is like a "free copy" in exchange for tapping two creatures.
    Most useful when creature-heavy and spell-light (can tap idle creatures for value).
```

## Definitive Conclusions

- **Spliced cards stay in your hand** — you add their text to another spell; you don't cast them; they can be used again next Arcane spell.
- **Splice adds text only, not characteristics** — the main spell's color, type, and name are unchanged; a Blue Arcane spell spliced with a Red damage effect is still Blue (protection from red doesn't help).
- **Ninjutsu is an activated ability, not a cast** — no summoning sickness issues with activating it; the Ninja enters attacking without needing to be declared as an attacker.
- **The returned creature goes to hand as a new object** — it can be re-cast; any Auras fall off; Equipment detaches.
- **ETB triggers fire when Ninja enters via ninjutsu** — entering the battlefield is entering the battlefield, regardless of how; ninjutsu doesn't suppress ETBs.
- **Conspire's copy is not a cast event** — it's created by a triggered ability; prowess and other "when you cast" effects don't see the copy.
- **Conspire requires creatures sharing a color** — colorless creatures can't conspire; the color of the spell must be shared by both tapped creatures.

## Canonical Example
**Glacial Ray Splice Chain — Multiple Splices on One Arcane Spell:**
You have in hand: Reach Through Mists ({U}: "Draw a card." Arcane), Glacial Ray ({1}{R}: "Deals 2 damage to any target." Splice onto Arcane {1}{R}), Ideas Unbound ({1}{U}: "Draw 3 cards, discard 2 at end of turn." Arcane... hypothetically).

You cast Reach Through Mists ({U}). While casting it, you reveal Glacial Ray from your hand.
Splice onto Arcane: pay {1}{R} as additional cost. Total cost: {U} + {1}{R} = {1}{U}{R}.
Reach Through Mists now has the text of Glacial Ray added: "Draw a card. Glacial Ray deals 2 damage to any target."
Choose targets: you need to choose a target for the damage text. Target opponent's 2/2.
Note: the spell is STILL BLUE (Reach Through Mists is blue). NOT red.
Glacial Ray is still in your hand (not cast, not discarded).

Spell resolves:
  First: Reach Through Mists's text resolves: "Draw a card."
  Then: Glacial Ray's added text: "Deals 2 damage" to the targeted 2/2. 2/2 dies.
You drew a card AND dealt 2 damage.
Glacial Ray is still in your hand.

Now: opponent controls a creature with "protection from red."
Can Glacial Ray's spliced text damage it? YES:
  The spell (Reach Through Mists) is BLUE. Protection from red doesn't protect against Blue spells.
  Even though the damage text came from a Red card: the spell is Blue; the effect is from a Blue spell.
  Protection from red doesn't prevent the damage.
This is the canonical Glacial Ray example from CR 702.47c itself.

**Example 2 — Ninja of the Deep Hours Swap:**
Combat phase. Your 1/1 Grizzly Bears is declared attacking (targeting opponent directly).
Declare attackers step: Grizzly Bears is attacking. Opponent declares no blockers.
Grizzly Bears is "unblocked."
In the combat damage step (after blockers): you activate Ninjutsu.
Ninja of the Deep Hours ninjutsu cost: {1}{U}.
Pay {1}{U}, reveal Ninja of the Deep Hours, return Grizzly Bears to your hand.
Ninja enters the battlefield tapped and attacking the opponent.
Grizzly Bears is in your hand. It was "a new object" the moment it left the battlefield.

Ninja of the Deep Hours deals combat damage to opponent (it was unblocked since the creature it replaced was unblocked): 1 damage.
Ninja trigger: "whenever Ninja of the Deep Hours deals combat damage to a player, you may draw a card."
You draw a card.

End of combat: Ninja is on battlefield (under your control this turn — has summoning sickness next turn).
You have Grizzly Bears in hand. You can cast it again next turn as a potential future ninjutsu target.
Running the engine: every turn, re-cast the cheap creature, swing, ninjutsu again for draw.

Commander variant: Yuriko works the same way but uses the command zone as an additional option.
Yuriko costs {U}{B} commander ninjutsu (vs. {3}{U}{B} cast cost).
Each hit: each player loses life equal to top card's MV; you draw.
Return the original creature to hand, re-set for next attack.

## Commonly Confused With
- **P355 (Copy Effects)** — Conspire creates a copy of the spell via a triggered ability (702.78a). The copy is not cast. Splice doesn't create a copy — it adds text to the original spell (702.47a). These are different: conspire copies the whole spell; splice modifies the original spell's text.
- **P354 (Equipment/Auras)** — When a creature with Equipment is ninjutsu-returned to hand: Equipment stays on battlefield (unattached), Auras go to the GY (enchanted object left). This is the standard zone-change rule (P354).
- **P362 (Storm)** — Conspire's copy doesn't trigger storm (not cast). Storm copies are also not cast. Both create non-cast copies. However: if you cast a storm spell and conspire it, the conspire copy fires but doesn't add to storm count (it's not a cast). The original storm spell generates storm copies based on spell count.
- **P366 (Split Second/Suspend)** — Split second prevents casting spells and activating abilities. Ninjutsu is an activated ability. Split second on the stack → you CANNOT use ninjutsu during the split second window (ninjutsu is a non-mana activated ability, blocked by split second).
