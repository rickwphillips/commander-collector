---
id: p173
name: Exalted — Bonus When Attacking Alone
category: combat
cr_refs: [702.83a, 702.83b]
tags: [exalted, attack-alone, +1/+1, stacking, Bant, Noble-Hierarch, Sublime-Archangel, singleton]
created: 2026-03-28
examples_count: 2
---

# P173 — Exalted — Bonus When Attacking Alone

## Abstract
Exalted triggers whenever a creature you control attacks alone — that attacking creature gets +1/+1 until end of turn. Multiple exalted instances each trigger separately, stacking the bonus. If you have five permanents with exalted, a solo attacker gets +5/+5. The key rule: the creature must be the only creature attacking in this combat phase. If multiple creatures attack, no exalted triggers. This encourages "voltron" strategies — one powerful attacker buffed by an entire support structure of exalted creatures that stay back.

## The Definitive Rules

**CR 702.83a** (verbatim): *"Exalted is a triggered ability. 'Exalted' means 'Whenever a creature you control attacks alone, that creature gets +1/+1 until end of turn.'"*

**CR 702.83b** (verbatim): *"A creature 'attacks alone' if it's the only creature declared as an attacker in a given combat phase. See rule 506.5."*

## The Pattern

```
EXALTED:
  Triggered: when a creature you control attacks alone
  Effect: that creature gets +1/+1 until end of turn
  Stacking: each exalted instance triggers separately

  EXALTED + ATTACKS ALONE:
    The attacking creature must be the ONLY attacker in this combat phase
    If you declare two attackers: NO exalted triggers (neither attacked alone)
    Even if one is removed before damage: the trigger already didn't fire (checked at declare attackers)

  EXALTED + STACKING:
    Each permanent with exalted that you control triggers when any one of your creatures attacks alone
    The ATTACKER gets the bonus (not the exalted permanent itself)
    Noble Hierarch (exalted): your attacking creature gets +1/+1
    You control 4 permanents with exalted: attacker gets +4/+4
    Sublime Archangel: "Other creatures you control have exalted" + its own exalted = massive stacks

  EXALTED + NOBLE HIERARCH:
    Noble Hierarch (1/1, exalted): taps for {G} or {W} or {U}, has exalted
    In Bant decks: attack with your best creature alone → Noble Hierarch's exalted gives +1/+1
    Also: multiple Noble Hierarchs + Sublime Archangel = large solo attack

  EXALTED + VIGILANCE:
    A vigilant creature attacks (doesn't tap) → still attacks alone if only attacker
    Exalted triggers → vigilant creature untapped AND boosted
    Post-combat: vigilant creature can still block; exalted creature was also boosted

  EXALTED + MULTIPLE ATTACKERS:
    If you want to attack with multiple creatures: lose exalted bonuses
    Strategic tension: attack with 1 strong creature (get exalted) OR attack with many (overwhelm)
    Exalted rewards going wide but attacking narrow

  EXALTED + TOKENS:
    Tokens count for "creature attacks alone" — if only a token attacks, exalted triggers

  EXALTED ON DIFFERENT PLAYERS:
    Exalted triggers for "a creature you control attacks alone"
    If opponent has exalted and attacks: their attacker gets +1/+1 from THEIR exalted
    You can't use an opponent's exalted for your attacker (you don't control the exalted)

  EXALTED + PARTNER COMMANDER:
    Multiple commanders: can attack alone with one → exalted triggers
    The second commander stays back

SPECIFIC EXALTED CARDS:
  Noble Hierarch: mana dork + exalted → staple
  Sublime Archangel: gives all your other creatures exalted + its own exalted → most exalted in one card
  Knight of the Holy Nimbus (Exalted): combat-focused
  Rafiq of the Many (Exalted, double strike when attacking alone): the exalted Commander
```

## Definitive Conclusions

- **Exalted triggers when exactly ONE creature attacks** — multiple attackers prevent all exalted.
- **Multiple exalted permanents stack the bonus** on the single attacker.
- **Sublime Archangel** grants exalted to all other creatures for maximum stacking.
- **Noble Hierarch** is the premiere exalted card: mana + combat bonus.
- **Rafiq of the Many** + exalted = double-strike solo attacks.

## Canonical Example
**Bant Exalted in Legacy:**
Board: Noble Hierarch × 3, Sublime Archangel (exalted + gives others exalted), Rafiq of the Many (exalted).
Attack with Rafiq of the Many alone.
Exalted triggers: 3 Noble Hierarchs (×3 triggers) + Sublime Archangel (×1) + Rafiq itself (×1) = 5 exalted triggers.
Wait: Sublime Archangel says "OTHER creatures have exalted" → the Hierarchs and others get exalted from Archangel AND their own.
Noble Hierarch already has exalted + Sublime Archangel gives exalted = Noble Hierarch triggers twice.
But Noble Hierarch has ONE instance of exalted + granted one from Archangel = TWO triggers per Hierarch.
3 × 2 Hierarch + Sublime Archangel (own exalted) + Rafiq (own exalted) = 6 + 1 + 1 = 8 triggers.
Rafiq gets +8/+8 and has double strike → deals (base) + 8 × 2 combat damage.

**Example 2 — Rafiq of the Many:**
Rafiq is a 3/3. With exalted, he has double strike when attacking alone.
Eight exalted triggers: Rafiq becomes 11/11 with double strike.
First strike step: 11 damage. Second: 11 more. Total 22 damage from a 3-mana 3/3.

## Commonly Confused With
- **P085 (Exalted vs Prowess)** — Prowess grows when you cast spells. Exalted grows solo attackers.
- **P142 (Battle Cry)** — Battle Cry pumps OTHER attackers. Exalted pumps the SOLO attacker.
- **P136 (Renown)** — Renown grows the creature permanently when it deals damage. Exalted is temporary (+1/+1 until end of turn).
