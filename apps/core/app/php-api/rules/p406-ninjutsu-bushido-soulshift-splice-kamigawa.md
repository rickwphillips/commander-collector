---
id: p406
name: Ninjutsu, Bushido, Soulshift, and Splice — Kamigawa Combat Substitution, Combat Buff, Spirit Recursion, and Text-Adding
category: combat
cr_refs: [702.49a, 702.49b, 702.49c, 702.49d, 702.45a, 702.45b, 702.46a, 702.46b, 702.47a, 702.47b, 702.47c]
tags: [ninjutsu, bushido, soulshift, splice, unblocked-swap, combat-pump-on-block, spirit-graveyard-recursion, add-text-to-arcane-spell, Kamigawa, Betrayers-of-Kamigawa, Mistblade-Shinobi, Throat-Slitter, Higure-the-Still-Wind, Yuki-Onna, Arcane-Denial, Glacial-Ray, ETB-fires-on-ninjutsu, commander-ninjutsu, splice-text-change]
created: 2026-03-29
examples_count: 2
---

# P406 — Ninjutsu, Bushido, Soulshift, and Splice — Kamigawa Combat Substitution, Combat Buff, Spirit Recursion, and Text-Adding

## Abstract
**Ninjutsu** (702.49) is an activated hand ability: pay the ninjutsu cost, reveal the ninja, and return an unblocked attacking creature to hand to put the ninja directly onto the battlefield tapped and attacking. The ninja enters attacking the same player/planeswalker as the creature it replaced. This triggers the ninja's ETB. **Bushido N** (702.45) triggers whenever the bushido creature blocks or becomes blocked: it gets +N/+N until end of turn. **Soulshift N** (702.46) triggers when the permanent dies: return a Spirit card with MV N or less from your GY to your hand. **Splice onto Arcane** (702.47) lets you add the splice card's text to an Arcane spell you're casting (paying an additional splice cost), while the splice card stays in your hand.

## The Definitive Rules

**CR 702.49a** (verbatim): *"Ninjutsu is an activated ability that functions only while the card with ninjutsu is in a player's hand. 'Ninjutsu [cost]' means '[Cost], Reveal this card from your hand, Return an unblocked attacking creature you control to its owner's hand: Put this card onto the battlefield from your hand tapped and attacking.'"*

**CR 702.49b** (verbatim): *"The card with ninjutsu remains revealed from the time the ability is announced until the ability leaves the stack."*

**CR 702.49c** (verbatim): *"The creature put onto the battlefield with the ninjutsu ability enters attacking the same player, planeswalker, or battle as the creature that was returned to its owner's hand."*

**CR 702.49d** (verbatim): *"Commander ninjutsu is a variant of the ninjutsu ability that also functions while the card with commander ninjutsu is in the command zone."*

**CR 702.45a** (verbatim): *"Bushido is a triggered ability. 'Bushido N' means 'Whenever this creature blocks or becomes blocked, it gets +N/+N until end of turn.' (See rule 509, 'Declare Blockers Step.')"*

**CR 702.46a** (verbatim): *"Soulshift is a triggered ability. 'Soulshift N' means 'When this permanent is put into a graveyard from the battlefield, you may return target Spirit card with mana value N or less from your graveyard to your hand.'"*

**CR 702.47a** (verbatim): *"Splice is a static ability that functions while a card is in your hand. 'Splice onto [quality] [cost]' means 'You may reveal this card from your hand as you cast a [quality] spell. If you do, that spell gains the text of this card's rules text and you pay [cost] as an additional cost to cast that spell.'"*

## The Pattern

```
NINJUTSU (702.49):
  WHAT IT IS:
    Activated ability. Functions ONLY while the card is in your hand.
    "[Cost], Reveal this card from your hand, Return an unblocked attacking creature you control
      to its owner's hand: Put this card onto the battlefield from your hand tapped and attacking."
  TIMING:
    Can activate ninjutsu "as though it were an instant" — it's an activated ability with a
      timing restriction? Actually: activated abilities can be activated any time you have priority.
    The key timing: you need an unblocked attacking creature. This means:
      - After blockers are declared (you know which attackers are unblocked).
      - Before damage is dealt.
      - During the combat phase, after blockers have been declared.
    But: ninjutsu is an activated ability. You can activate it any time you have priority.
    In practice: you activate during the declare blockers step (after blockers are declared).
    Why? Because before blockers are declared, you don't know if the creature is unblocked.
      After the blockers step: you know. Activate ninjutsu on an unblocked creature.
  THE SWAP:
    Return the unblocked attacker to hand. The ninja enters the battlefield tapped and attacking.
    The ninja attacks the same player/planeswalker as the creature that was returned.
    The returned creature is back in your hand — you can cast it again next turn.
  ETB TRIGGERS ON NINJUTSU:
    The ninja enters the battlefield. ETB triggers fire.
    Example: Throat Slitter ({4}{B}: 2/2 ninja, ninjutsu {2}{B}, "when Throat Slitter deals
      combat damage to a player, that player sacrifices a creature"):
      Throat Slitter enters via ninjutsu. Its ETB (if any) fires.
      Throat Slitter's trigger is "when deals combat damage to a player" — not ETB.
      But some ninjas have ETBs: "when this ninja enters, [effect]."
      Those ETBs fire.
  NINJUTSU AND COMBAT DAMAGE:
    The ninja is "attacking" when it enters. It was never declared as an attacker.
    But: it IS an attacking creature for combat purposes.
    Block assignments: the ninja is unblocked (entered tapped and attacking after blockers were
      declared, or the creature it replaced was already unblocked). No blocker assigned.
    If the original creature had a blocker and wasn't unblocked: you can't ninjutsu it.
      Ninjutsu requires UNBLOCKED. A creature with a blocker assigned is not unblocked.
    The ninja deals combat damage normally (unblocked → assigns damage to defending player).
  COMMANDER NINJUTSU (702.49d):
    Same as ninjutsu but also activatable from the command zone.
    "You may reveal this card from your hand OR from the command zone."
    If from the command zone: return an unblocked attacker, put the ninja onto the battlefield.
    This means: commander ninjas don't need to be in hand first — they can come directly from the
      command zone onto the battlefield attacking.
    Yuriko, the Tiger's Shadow has commander ninjutsu.
  NINJUTSU AND SUMMONING SICKNESS:
    The ninja enters the battlefield tapped. It attacks this turn (already attacking).
    Summoning sickness? The ninja enters "tapped and attacking" — it bypasses the need to be
      untapped and declared as an attacker. It doesn't need haste.
    But: the ninja tapped for ninjutsu. After combat: it will untap next untap step normally.

BUSHIDO (702.45):
  WHAT IT IS:
    Triggered ability. Fires "whenever this creature blocks or becomes blocked."
    "+N/+N until end of turn."
  WHEN IT TRIGGERS:
    "Blocks or becomes blocked" = during the declare blockers step when blockers are assigned.
    If this creature blocks: trigger fires. If this creature is blocked: trigger fires.
    In both roles (attacker being blocked OR blocker blocking): +N/+N.
  MULTIPLE BLOCKERS:
    If a bushido creature is blocked by 3 creatures: it "becomes blocked" once (one event).
    Bushido triggers ONCE (one "becomes blocked" event), regardless of how many blockers.
    The creature gets +N/+N once.
  MULTIPLE BUSHIDO INSTANCES (702.45b):
    Each triggers separately.
    A creature with bushido 1 and bushido 2: both fire. +1/+1 + +2/+2 = +3/+3 total.
  BUSHIDO AND COMBAT TRICKS:
    The +N/+N applies until end of turn (not just during damage).
    If the creature deals first strike damage and then regular damage: the pump applies to both.
    Bushido doesn't trigger on trample excess — it just fires on the block/is-blocked event.

SOULSHIFT (702.46):
  WHAT IT IS:
    Triggered ability. Fires "when this permanent is put into a graveyard from the battlefield."
    "Return target Spirit card with mana value N or less from your graveyard to your hand."
    Optional ("you may").
  THE MV LIMIT:
    "Spirit card with MV N or less" — must target a Spirit in your GY with the right MV.
    If no valid target (no Spirits in GY with MV ≤ N): soulshift trigger fizzles.
    Soulshift 2: return a Spirit with MV ≤ 2.
    Soulshift 6: return a Spirit with MV ≤ 6. (Much broader.)
  SOULSHIFT CHAINS:
    A lower-MV Spirit dies: soulshift returns an even lower-MV Spirit from GY.
    Chain: 6-drop Spirit dies → soulshift returns a 4-drop → that 4-drop dies → soulshift returns 2-drop → etc.
    This creates a "ladder" of Spirit recursion.
  SOULSHIFT AND EXILE:
    "Put into a graveyard from the battlefield" — only on GY death. Not exile.
    Similar to persist/undying/afterlife (P400): exile doesn't trigger soulshift.

SPLICE (702.47):
  WHAT IT IS:
    Static ability in hand. "Splice onto [quality]" adds this card's rules text to a spell of
      that quality when you cast it.
    Most common: "Splice onto Arcane" — adds text to an Arcane spell.
    Arcane: a subtype of instants and sorceries from Kamigawa.
  HOW IT WORKS:
    You cast an Arcane spell (e.g., Reach Through Mists).
    You reveal a splice card from hand (e.g., Glacial Ray — "Glacial Ray deals 2 damage to any target.
      Splice onto Arcane {1}{R}").
    You pay the splice cost ({1}{R}) as an additional cost.
    The Arcane spell gains Glacial Ray's text: it now also deals 2 damage.
    Glacial Ray STAYS IN YOUR HAND. You didn't cast it; you spliced it.
    You can splice multiple cards onto one Arcane spell.
  SPLICE TEXT-CHANGE EFFECT (702.47c):
    The spell gains the splice card's rules text. This is a text-changing effect.
    "The spell doesn't gain any other characteristics (name, mana cost, color, supertypes, etc.)."
    Only the rules TEXT is added.
    Color stays from the original spell. Mana cost stays. Etc.
  SPLICE TARGET INDEPENDENCE:
    The spliced text's targets are chosen independently.
    Example: Glacial Ray spliced onto Reach Through Mists:
      Reach Through Mists is {U}: "draw a card."
      After splice: also "deals 2 damage to any target."
      Choose target for the damage effect normally. The draw has no target.
    You can target the same thing or different things.
  THE SPLICE CARD STAYS IN HAND:
    702.47a: "the card stays in your hand."
    You revealed it and paid its splice cost, but it was not cast.
    You can splice it again onto the next Arcane spell you cast.
    This makes splice potent with repeated Arcane spell casting.
```

## Definitive Conclusions

- **Ninjutsu swaps an unblocked attacker for the ninja** — the ninja enters tapped and attacking the same player; ETBs fire; the returned creature goes to hand; the ninja doesn't need haste (it's already attacking).
- **Ninjutsu can only be used on UNBLOCKED creatures** — a creature with a blocker already assigned can't be the swap target; you must activate ninjutsu after blockers are declared.
- **Bushido fires once when the creature blocks or becomes blocked** — regardless of how many blockers are assigned; multiple bushido instances each trigger separately.
- **Soulshift only triggers on death, not exile** — if the permanent is exiled instead of going to GY, soulshift doesn't fire; if triggered, you must have a Spirit of qualifying MV in your GY.
- **Splice onto Arcane adds text but the splice card stays in hand** — you can splice the same card multiple times (onto different Arcane spells); only the text is added (no name, color, or type change).

## Canonical Example
**Throat Slitter Ninjutsu Setup:**
Turn 1: You cast a 1/1 Changeling Outcast ({B}: 1/1 all creature types, can't block, doesn't tap to attack). It attacks.
Turn 2: Opponent has no blockers (they missed their land drop). Changeling Outcast attacks again.
No blockers declared. Changeling Outcast is unblocked.

You have Throat Slitter ({4}{B}: 2/2 ninja, ninjutsu {2}{B}) in hand.
Activate ninjutsu: pay {2}{B}, reveal Throat Slitter, return Changeling Outcast to your hand.
Throat Slitter enters the battlefield tapped and attacking the opponent.
Throat Slitter is unblocked. Deals 2 combat damage to the opponent.
Throat Slitter's "when Throat Slitter deals combat damage to a player, that player sacrifices a creature" triggers.
Opponent sacrifices their best creature.

Cost breakdown: {B} (Changeling Outcast, turn 1) + {2}{B} (ninjutsu cost) = total 3 mana investment.
You got: 2 damage to opponent + opponent sacrifices a creature.
Plus: Changeling Outcast is back in your hand. Repeat every turn if opponent can't block.

Turn 3: Changeling Outcast attacks again. If unblocked: ninjutsu another ninja.
This repeats the cycle — constant ninja value as long as the 1/1 gets through unblocked.

**Example 2 — Glacial Ray Splice onto Reach Through Mists:**
You have in hand: Reach Through Mists ({U}: Arcane, "draw a card") and Glacial Ray ({1}{R}: Arcane instant, "Glacial Ray deals 2 damage to any target. Splice onto Arcane {1}{R}").

Cast Reach Through Mists ({U}). Before it resolves, you may choose to splice.
Splice: reveal Glacial Ray, pay {1}{R} as additional cost.
Reach Through Mists now has added text: "...and Glacial Ray deals 2 damage to any target."
Choose a target for the damage (opponent, or a creature).

Reach Through Mists resolves:
- Draw a card.
- Deal 2 damage to the targeted creature.

Glacial Ray is still in your hand. You can splice it onto the next Arcane spell you cast.
In a Kamigawa Spirit/Arcane deck: you might cast 3-4 Arcane spells per turn. Each can have Glacial Ray spliced for 2 damage.
Total damage potential: 4 Arcane spells × 2 damage = 8 damage from repeated Glacial Ray splices, spending only {1}{R} extra per Arcane spell.

## Commonly Confused With
- **P395 (Overload)** — Both splice and overload modify spell text. Overload replaces "target" with "each" using an alternative cost; splice adds entirely new text from a separate card using an additional cost.
- **P394 (Awaken)** — Both awaken and ninjutsu involve combat phase timing. Awaken is cast normally (sorcery speed or instant); ninjutsu is an activated ability triggered during combat.
- **P391 (Persist/Undying/Evolve)** — Soulshift triggers on death like persist and undying. Soulshift returns other Spirits to hand; persist returns the creature itself. Both are "dies-triggered" recursive effects.
- **P392 (Myriad)** — Like myriad tokens, ninjutsu-placed ninjas enter the battlefield attacking without being declared as attackers. Both bypass the declare attackers step but are still considered attacking creatures.
