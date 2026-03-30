---
id: p160
name: Annihilator — Defender Sacrifices Permanents on Attack
category: combat
cr_refs: [702.86a, 702.86b]
tags: [annihilator, sacrifice, attack, Eldrazi, Emrakul, Ulamog, triggered, defending-player, symmetry]
created: 2026-03-28
examples_count: 2
---

# P160 — Annihilator — Defender Sacrifices Permanents on Attack

## Abstract
Annihilator N is a triggered ability: whenever this creature attacks, the defending player sacrifices N permanents. The sacrifices happen BEFORE blockers are declared — the opponent must sacrifice permanents before they can even assign blockers. This often means losing blockers they needed, lands for mana, or key permanents, all before the Eldrazi even deals damage. In multiplayer, annihilator triggers for each player being attacked. Multiple annihilator instances (e.g., Emrakul, the Aeons Torn with annihilator 6) mean devastating sacrifice requirements per attack.

## The Definitive Rules

**CR 702.86a** (verbatim): *"Annihilator is a triggered ability. 'Annihilator N' means 'Whenever this creature attacks, defending player sacrifices N permanents.'"*

**CR 702.86b** (verbatim): *"If a creature has multiple instances of annihilator, each triggers separately."*

## The Pattern

```
ANNIHILATOR:
  Triggered: whenever this creature ATTACKS (at declare attackers step)
  Effect: defending player sacrifices N permanents

  ANNIHILATOR TIMING:
    Trigger fires at declare attackers (not declare blockers)
    The trigger resolves DURING combat, specifically after attackers are declared
    Before blockers are even declared: annihilator trigger resolves
    Opponent must sacrifice N permanents BEFORE choosing blockers
    If they sacrifice their only viable blocker: the Eldrazi might go unblocked

  ANNIHILATOR + SACRIFICE CHOICE:
    Defending player CHOOSES which permanents to sacrifice
    No restriction: can sacrifice lands, creatures, artifacts, enchantments, planeswalkers
    Opponent makes this choice strategically: lose the "worst" N permanents
    But often there are no good sacrifices

  ANNIHILATOR + N:
    Emrakul, the Aeons Torn: Annihilator 6 → sacrifice 6 permanents per attack
    Ulamog, the Infinite Gyre: Annihilator 4
    Attacking with Emrakul: opponent sacrifices 6 permanents before blocking
    A typical 30-permanent battlefield: sacrifice 6 = 20% of permanents gone per swing

  ANNIHILATOR + MULTIPLE INSTANCES:
    CR 702.86b: each instance triggers separately
    Two annihilator triggers: opponent sacrifices once per trigger
    Annihilator 2 + Annihilator 2 (two triggers): sacrifice 2 + sacrifice 2 = 4 total
    Emrakul has Annihilator 6 (single trigger): sacrifice 6 permanents

  ANNIHILATOR + MULTIPLAYER:
    "Defending player" = the player or planeswalker being attacked
    In Commander: each player attacked triggers annihilator separately for THAT player
    Attack two players: Annihilator triggers for player A and player B separately
    (Actually: attacking two players simultaneously in Commander = defender for each is different)
    Each attacked player sacrifices independently

  ANNIHILATOR + REANIMATION:
    Reanimating a Eldrazi with annihilator: get annihilator without paying the cast cost
    Careful: Emrakul has "can't be put into a graveyard" + shuffle graveyard on death → hard to reanimate
    Ulamog the Infinite Gyre: shuffles itself back when it'd go to graveyard
    But: Eldrazi from Oath of the Gatewatch era don't have this protection

  ANNIHILATOR + FIRST STRIKE / EVASION:
    Annihilator resolves before combat damage
    Even if the Eldrazi dies somehow before damage (rare): the trigger already resolved
    Annihilator is about the attack TRIGGER, not the damage

  ANNIHILATOR + TOKENS:
    Sacrificing tokens counts: opponent might sacrifice tokens to minimize loss
    Token-heavy decks: create tokens specifically to "feed" annihilator
    Ophiomancer (create Deathtouch Snake token each upkeep if you control none): engine for feeding annihilator
```

## Definitive Conclusions

- **Annihilator triggers at declare attackers** — sacrifices happen before blockers are declared.
- **The defending player chooses** which N permanents to sacrifice.
- **Multiple annihilator triggers** each demand separate sacrifices.
- **Annihilator is brutal in Commander** — multiple opponents each sacrifice if attacked.
- **Emrakul, the Aeons Torn** with Annihilator 6 is the definitive annihilator card.
- **Creatures sacrificed via annihilator can't block** — they're gone before the declare blockers step. (Gatherer ruling 2010-06-15)
- **Attacking a planeswalker: if the planeswalker is sacrificed to annihilator, the attacker continues attacking and may be blocked** — but won't deal damage to the player since it was attacking the planeswalker, not the player. (Gatherer ruling 2010-06-15)

## Canonical Example
**Emrakul, the Aeons Torn (Annihilator 6, Flying, Protection from colored spells, CMC 15):**
Attack with Emrakul → annihilator 6 trigger → defending player sacrifices 6 permanents before blocking.
Opponent had 10 permanents: loses 6 (likely key lands + creatures). Now has 4 permanents.
Even if they block (can they? Emrakul flies, needs a flying blocker): still lost 6 permanents.
If not blocked: Emrakul deals 15 damage. One or two attacks = lethal.

**Example 2 — Turn-3 Emrakul via Sneak Attack:**
Sneak Attack ({3}{R}): "{R}: Put a creature card from your hand onto the battlefield. It gains haste. Sacrifice it at the beginning of the next end step."
Activate with Emrakul in hand → Emrakul enters with haste → attacks → annihilator 6 → opponent sacrifices 6 → Emrakul swings for 15 → Emrakul is sacrificed at end step → triggers Emrakul's graveyard shuffle → goes back to library.
The opponent lost 6 permanents + took 15 damage, all for {R} + the activation cost.

## Commonly Confused With
- **P160 vs Edict effects** — Edict effects (Diabolic Edict, Innocent Blood) force sacrifice of one creature. Annihilator forces N any-permanent sacrifices on an attack trigger.
- **P086 (Devour)** — Devour sacrifices YOUR creatures as creatures enter. Annihilator sacrifices the OPPONENT's permanents on attack.
- **P135 (Trample)** — Trample routes excess damage to the player. Annihilator forces sacrifices separately before damage.
