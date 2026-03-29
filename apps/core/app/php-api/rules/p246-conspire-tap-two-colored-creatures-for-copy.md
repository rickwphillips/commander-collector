---
id: p246
name: Conspire — Tap Two Same-Colored Creatures for a Free Copy
category: stack
cr_refs: [702.78a, 702.78b]
tags: [conspire, copy, tap-creatures, color-match, Shadowmoor, Eventide, Burn-Trail, Waves-of-Aggression, Raven-Crime]
created: 2026-03-28
examples_count: 2
---

# P246 — Conspire — Tap Two Same-Colored Creatures for a Free Copy

## Abstract
Conspire is a keyword representing two abilities: an additional cost option (tap two untapped creatures that each share a color with the spell) and a triggered copy ability if the conspire cost was paid. Unlike Replicate (which pays mana per copy) or Storm (which counts all spells), Conspire uses your battlefield creatures as the payment — tap two creatures sharing a color with the conspire spell to get one free copy. The copy can be given new targets. Conspire rewards creature-dense strategies, especially when those creatures would be tapped anyway (after attacking) and can be used for Conspire in second main phase. Shadowmoor block introduced Conspire as part of its "teamwork" theme.

## The Definitive Rules

**CR 702.78a** (verbatim): *"Conspire is a keyword that represents two abilities. The first is a static ability that functions while the spell with conspire is on the stack. The second is a triggered ability that functions while the spell with conspire is on the stack. 'Conspire' means 'As an additional cost to cast this spell, you may tap two untapped creatures you control that each share a color with it' and 'When you cast this spell, if its conspire cost was paid, copy it. If the spell has any targets, you may choose new targets for the copy.' Paying a spell's conspire cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.78b** (verbatim): *"If a spell has multiple instances of conspire, each is paid separately and triggers based on its own payment, not any other instance of conspire."*

## The Pattern

```
CONSPIRE:
  Additional cost: tap TWO untapped creatures you control that EACH share a color with the spell
  If paid: triggered ability fires → copy the spell (with new target options)
  Net: one extra copy of the spell for the cost of tapping two creatures

CONSPIRE + COLOR SHARING:
  "Share a color" = creature has at least one color in common with the spell
  The conspire spell is {R}: tap any two red creatures (red shares red with the spell)
  The conspire spell is {G}{U}: each creature must share at least one of: green, blue
    Tap a green creature (shares green) AND a blue creature (shares blue): legal!
    Tap two green creatures (both share green): legal!
  Colorless creatures: no colors → can't share a color → can't be tapped for conspire

CONSPIRE + TAPPING:
  Creatures must be UNTAPPED when you pay the conspire cost
  Tapping attackers in second main phase: attacked, untapped? No — attackers tap and stay tapped
  Wait: you declare attackers during combat. They're tapped. In second main phase: they're STILL tapped.
  Untapped creatures during second main phase: blockers that didn't block, non-attackers
  But: creatures that gain vigilance (don't tap to attack) could conspire after attacking
  Best Conspire use: second main phase with untapped utility creatures or non-attackers

CONSPIRE + DOUBLE CONSPIRE:
  If a spell has Conspire twice (very rare): each instance is paid separately
  Paying one Conspire: 1 copy
  Paying both Conspirants: 2 copies
  Each requires tapping two creatures sharing the spell's color

CONSPIRE CARDS (Shadowmoor):
  Burn Trail ({3}{R}, Sorcery — Conspire): "Burn Trail deals 3 damage to target creature or player."
    Normal: 3 damage for {3}{R}.
    With Conspire (tap 2 red creatures): 6 damage for {3}{R} + tapping 2 creatures.
    New targets: original deals 3 to one target, copy deals 3 to a different target.
    Efficient: 6 total damage for 4 mana + 2 tapped creatures.

  Waves of Aggression ({3}{R}{R}, Sorcery — Conspire): "Untap all creatures you control. After this main phase, there is an additional combat phase followed by an additional main phase."
    Conspire: copy the spell → 2 additional combat phases! (from the two copies)
    Each additional combat phase: attack again with all creatures.
    With haste creatures: attack 3 times in one turn.
    Retrace {Discard a land}: can recast from GY each turn for repeated extra combats.

  Raven's Crime ({B}, Sorcery — Conspire, Retrace): "Target player discards a card."
    Conspire (tap 2 black creatures): 2 discards for {B} + 2 creatures.
    Retrace {Discard a land}: cast again from GY each turn with land discard.
    Combined: discard engine making opponents empty-handed while you reuse lands.

CONSPIRE + MULTIPLE COPIES:
  Can you conspire the same spell multiple times? A spell only has one conspire keyword (usually)
  But if it has conspire twice: pay twice, get 2 copies
  Or: have two different spells with conspire: each can conspire separately

CONSPIRE + TRIGGERING:
  The conspire copy trigger fires when you CAST the spell (not when it resolves)
  So: even if the original is countered, the conspire copy was already created (triggered on casting)
  Wait: "When you cast this spell, if its conspire cost was paid, copy it"
  The trigger fires on CASTING. Copies go on stack. Original is then countered.
  Copies are still on the stack (copies of spells aren't countered by countering the original — unless specifically stated)

CONSPIRE + STORM:
  Both count/copy spells. Can they interact?
  Storm: "when you cast this spell, copy it for each spell cast this turn" (including conspiried copies)
  Wait: are the Conspire copies "cast"? No — they're created as copies by a triggered ability
  Storm counts CAST spells. Conspire copies are not cast.
  So a Conspire copy doesn't add to Storm count.
  But a Storm spell could Conspire: cast Storm spell, conspire it (tap 2 creatures) → gets 1 Conspire copy + Storm copies from spell count.
```

## Definitive Conclusions

- **Conspire taps two same-colored untapped creatures** to generate one free copy.
- **Color sharing is required**: each tapped creature must share at least one color with the spell.
- **Conspire trigger fires on casting** — countering the original doesn't remove the copy.
- **Second main phase is ideal** for Conspire: untapped creatures that didn't attack.
- **Waves of Aggression + Conspire** = two extra combat phases in one turn.

## Canonical Example
**Waves of Aggression Conspire in Gruul Aggro:**
Battlefield: 4 red/green creatures (2 untapped, 2 tapped after combat).
Main phase 2: Cast Waves of Aggression ({3}{R}{R}) — conspire paying by tapping two untapped red/green creatures.
Conspire trigger fires: copy Waves of Aggression (choose same or new targets — Waves has no target, so it's just a copy).
Both copies resolve:
  Copy 1: untap all creatures, gain extra combat phase + main phase.
  Original: untap all creatures again (they re-untapped from copy), gain ANOTHER extra combat phase + main phase.
Net: 2 additional combat phases total. Attack 3 times this turn.
This is the "Gruul extra combats" package: Waves of Aggression + Conspire doubles the extra combat.

**Example 2 — Burn Trail Targeting:**
Opponent controls 2 creatures (3/3 and 2/2). You control 3 red creatures (untapped).
Cast Burn Trail ({3}{R}) — conspire, tapping two red creatures.
Original targets: the 3/3. Copy targets: the 2/2.
Both deal 3 damage:
  3/3 receives 3 damage: dies.
  2/2 receives 3 damage: dies.
Total: killed two creatures for {3}{R} + tapping 2 creatures.
Alternative: both copies target the opponent's face: deal 6 damage directly.
Burn Trail Conspire = 6 damage for 4 mana + 2 tapped creatures.

## Commonly Confused With
- **P241 (Replicate)** — Replicate pays MANA for each copy (scalable); Conspire pays with CREATURES (one copy per two tapped).
- **P215 (Storm)** — Storm copies based on spell count (not paid cost); Conspire is a deliberate one-copy payment.
- **P239 (Convoke)** — Convoke taps creatures to pay MANA for the spell's cost; Conspire taps creatures for a FREE COPY.
