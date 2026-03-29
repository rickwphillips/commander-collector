---
id: p191
name: Mobilize — Create Attacking Warrior Tokens When Attacking
category: combat
cr_refs: [702.181a]
tags: [mobilize, warrior-token, attacking-token, sacrifice-end-step, combat, triggered]
created: 2026-03-28
examples_count: 2
---

# P191 — Mobilize — Create Attacking Warrior Tokens When Attacking

## Abstract
Mobilize is a triggered combat ability: whenever the creature with Mobilize N attacks, create N 1/1 red Warrior creature tokens that enter tapped and attacking. Those tokens are sacrificed at the beginning of the next end step. This turns an attacker into a whole war party — each attack sends N warriors into battle alongside the mobilizing creature. The tokens are temporary (sacrificed at end step), but they deal combat damage, trigger ETB abilities, and can cause significant battlefield pressure for a single turn.

## The Definitive Rules

**CR 702.181a** (verbatim): *"Mobilize is a triggered ability. 'Mobilize N' means 'Whenever this creature attacks, create N 1/1 red Warrior creature tokens. Those tokens enter tapped and attacking. Sacrifice them at the beginning of the next end step.'"*

## The Pattern

```
MOBILIZE:
  Triggered ability: "Whenever this creature attacks..."
  On attack trigger: create N 1/1 red Warrior tokens
  Tokens enter tapped and attacking (already declared as attackers)
  Sacrifice all N tokens at beginning of next end step (delayed SBA)

  MOBILIZE + TOKEN ENTRY:
    Tokens enter tapped and attacking: they ARE attacking when they enter the battlefield
    ETB triggers for the tokens DO fire (they entered the battlefield)
    But: they enter mid-declare-attackers step or later? Actually...
    The trigger fires when the creature attacks (declare attackers step)
    Tokens enter attacking the same player/planeswalker/battle the mobilizing creature attacked
    (Standard rule for "enters attacking" — they attack what the controller chooses or the default)

  MOBILIZE + COMBAT DAMAGE:
    Tokens deal combat damage (1 power each)
    Blockers can block the tokens
    N tokens attacking = N potential blockers needed (good at forcing bad blocks or dealing damage)
    Pumping the tokens (e.g., anthem effects): they can deal more than 1 damage each

  MOBILIZE + END STEP SACRIFICE:
    At the beginning of the NEXT end step (not this turn's end step — but actually, "next end step" means the upcoming end step, which is this turn's if in first main, or later)
    "Beginning of the next end step" — the sacrifice happens regardless of whose end step
    Even if you take another turn somehow: sacrifice at the next end step
    Tokens don't survive between turns typically

  MOBILIZE + ETB SYNERGIES:
    Tokens entering the battlefield can trigger "whenever a creature enters" effects
    Warrior tribal synergies: "whenever a Warrior enters" triggers stack up
    Eminence abilities (Commander) that trigger on creature ETB: each token triggers separately

  MOBILIZE + TRIGGERS WHEN ATTACKING:
    "Whenever this creature attacks" — triggers once per attack
    If the creature has Mobilize 3: three tokens created each time it attacks
    Multiple instances of Mobilize (e.g., via effects that give extra Mobilize): each triggers separately

  MOBILIZE + EVASION:
    The mobilizing creature can have evasion: tokens also enter attacking but may not have evasion
    Menace: the mobilizing creature needs two blockers, but each token needs one blocker separately
    Wide pressure: N tokens + the mobilizing creature = hard to block everything profitably

  MOBILIZE COMPARISON TO MYRIAD (P162):
    Myriad: creates tokens attacking OTHER opponents (in multiplayer)
    Mobilize: creates tokens attacking the SAME target the creature attacks
    Both use "enters tapped and attacking" (similar timing for ETB triggers)
    Mobilize tokens survive only until end step; Myriad tokens exile at end of combat
```

## Definitive Conclusions

- **Mobilize N creates N 1/1 red Warrior tokens** when the creature attacks.
- **Tokens enter tapped and attacking** — they deal combat damage and trigger ETBs.
- **Sacrifice at next end step** — tokens are temporary; gone after combat turn.
- **ETB synergies fire** — each token entering the battlefield triggers "whenever a creature enters" effects.
- **Wide pressure** — force opponents to block multiple creatures in a single attack.

## Canonical Example
**Warboss-style creature with Mobilize 3 (attack with it):**
Declare attackers: creature with Mobilize 3 attacks.
Mobilize triggers: create three 1/1 red Warrior tokens entering tapped and attacking.
Total attackers: Mobilize creature + 3 Warriors = 4 attackers this combat.
If you have an anthem like "Warriors get +1/+1": tokens become 2/2s for combat.
End step: sacrifice all three Warriors. But they dealt damage (possibly 3-6 damage + the main creature).

**Example 2 — Mobilize + ETB Synergies:**
You control Judith, the Scourge Diva: "Whenever another nontoken creature dies, Judith deals 1 to any target."
Wait — Judith triggers on NONTOKEN creature deaths. Warrior tokens are tokens.
But: "whenever a creature you control attacks" anthems or rage effects can boost them.
Better synergy: Purphoros, God of the Forge: "whenever a creature enters under your control, deals 2 to each opponent."
Mobilize 3 triggers Purphoros 3 times: 6 damage to each opponent from ETBs alone!
Then the tokens deal combat damage, THEN are sacrificed. Explosive attack turn.

## Commonly Confused With
- **P162 (Myriad)** — Myriad tokens attack other opponents; Mobilize tokens attack the same target as the mobilizing creature.
- **P173 (Exalted)** — Exalted benefits solo attackers with +1/+1. Mobilize creates tokens but the mobilizing creature doesn't benefit from being alone.
- **P160 (Annihilator)** — Annihilator forces sacrifices on attack. Mobilize creates tokens on attack. Both trigger on attacks but do very different things.
