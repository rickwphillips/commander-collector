---
id: p292
name: Annihilator — Forced Permanent Sacrifice When Attacked
category: combat
cr_refs: [702.86a, 702.86b]
tags: [annihilator, eldrazi, sacrifice, attack-trigger, forced-sacrifice, Rise-of-Eldrazi, Emrakul-the-Aeons-Torn, Ulamog-the-Infinite-Gyre, Kozilek-Butcher-of-Truth, Blightsteel-Colossus]
created: 2026-03-29
examples_count: 2
---

# P292 — Annihilator — Forced Permanent Sacrifice When Attacked

## Abstract
Annihilator is a triggered ability on the original Eldrazi titans. When a creature with Annihilator N attacks, the defending player must sacrifice N permanents before blockers are declared. The sacrifice is mandatory, happens immediately as the trigger resolves (before blocks), and the defending player chooses which permanents to sacrifice. Annihilator N means N permanents go away before any blocking, combat damage, or defensive strategy — making large Eldrazi creatures almost impossible to deal with in combat without being crippled first.

## The Definitive Rules

**CR 702.86a** (verbatim): *"Annihilator is a triggered ability. 'Annihilator N' means 'Whenever this creature attacks, defending player sacrifices N permanents.'"*

**CR 702.86b** (verbatim): *"If a creature has multiple instances of annihilator, each triggers separately."*

## The Pattern

```
ANNIHILATOR TRIGGER:
  "Whenever this creature attacks" → trigger fires when declared as an attacker
  Defending player sacrifices N permanents
  This happens BEFORE the declare blockers step
  The sacrifice is mandatory: defending player MUST sacrifice N permanents (or as many as they can)
  The defending player CHOOSES which permanents to sacrifice

  TIMING:
    Declare attackers step: attacker is declared → Annihilator trigger fires.
    All triggers resolve (APNAP order) before declare blockers step.
    Annihilator trigger resolves: defending player sacrifices N permanents.
    THEN declare blockers.
    The defending player has weakened their position BEFORE they can decide whether to block.

  ANNIHILATOR + MULTIPLE INSTANCES:
    CR 702.86b: each instance of Annihilator triggers separately.
    A creature with Annihilator 6 (Emrakul): one trigger → sacrifice 6.
    A creature with Annihilator 2 and Annihilator 2 (from effects): two triggers → 2 + 2 = sacrifice 4 total.
    But: the triggers resolve separately. Between the first and second trigger resolving:
    state-based actions check. If a player is at 0 life (from other effects), they lose before second triggers.

  ANNIHILATOR + CREATURE COUNT:
    If the defending player has fewer permanents than N: they sacrifice as many as they can.
    With 3 permanents and Annihilator 4: sacrifice all 3. Can't sacrifice what you don't have.

  ANNIHILATOR PERMANENTS SACRIFICED:
    All permanents: lands, creatures, artifacts, enchantments, planeswalkers.
    The defending player chooses: sacrifice blockers to avoid damage? Or sacrifice lands to keep blockers?
    Hard choices: both options are usually terrible.

  ANNIHILATOR + PROTECTION:
    Indestructible creatures: can still be sacrificed (indestructible doesn't prevent sacrifice).
    Hexproof creatures: can still be chosen for sacrifice (sacrifice isn't targeting).
    Sacrifice removes even "protected" permanents — no defense against sacrifice.

ANNIHILATOR NOTABLE CARDS (Rise of the Eldrazi):
  Emrakul, the Aeons Torn ({15}): Flying, Protection from colored spells, Annihilator 6.
    Flying: can't be blocked without fliers.
    Protection from colored spells: can't be targeted by any colored spell.
    Annihilator 6: defending player sacrifices 6 permanents before blocking.
    A 15/15 that requires sacrificing your entire board before you even block.
    Effectively: playing Emrakul means opponent loses 6 permanents + takes 15 flying damage.

  Ulamog, the Infinite Gyre ({11}): Indestructible, Annihilator 4. When cast: destroy any permanent.
    Cast trigger: destroy a permanent immediately (before it even enters).
    11/11 Indestructible + 4 permanents sacrificed per attack = devastating.
    "Indestructible" means it can't be destroyed by combat damage: can't be killed in combat.

  Kozilek, Butcher of Truth ({10}): Annihilator 4. When cast: draw 4 cards.
    Similar power level to Ulamog but draw value instead of destroy value on cast.

  Blightsteel Colossus ({12}): Infect + Trample + Indestructible (no Annihilator, but similar threat level).
    Not Eldrazi, no Annihilator. Common comparison piece.

ANNIHILATOR + HASTE:
  A creature with Annihilator that also has Haste: can attack the turn it enters!
  Attack on enter → Annihilator trigger → opponent sacrifices N permanents.
  Emrakul with Haste (if given): attack immediately on the turn it enters.
  Some ways to cheat Emrakul into play with Haste (Show and Tell, Aetherworks Marvel) → immediate Annihilator.

ANNIHILATOR + MULTIPLE ATTACKERS:
  Only the attacking Annihilator creature triggers Annihilator.
  Other creatures don't have Annihilator (unless they do).
  Multiple Annihilator creatures attacking: each triggers separately.
  Two Eldrazi with Annihilator 4 each: sacrifice 4, then sacrifice 4 again = 8 total.

DEFENDING AGAINST ANNIHILATOR:
  Fog effects: prevent combat damage (you still sacrifice from Annihilator — Fog only prevents damage)
  Fog doesn't prevent Annihilator sacrifice: "Prevent all combat damage" ≠ "prevent triggers"
  Annihilator trigger fires when attacking is DECLARED — before damage step.
  Even if no damage will be dealt (via Fog), Annihilator already forced sacrifices.
  To avoid Annihilator: don't let them attack (tap effects, Act of Authority, or eliminate the creature)
  Pacifism effects: "enchanted creature can't attack" → Annihilator never triggers.
  Maze of Ith: untap the attacker after it deals damage (Annihilator already resolved by then).
```

## Definitive Conclusions

- **Annihilator triggers when the creature is declared as an attacker** — sacrifice happens before blockers.
- **The defending player chooses which permanents to sacrifice** — no control for the attacker on which.
- **Sacrifice ignores indestructibility and hexproof** — no permanent type is immune to being sacrificed.
- **Fog effects don't stop Annihilator** — Annihilator triggers on "attacks," not on "deals damage."
- **Multiple instances of Annihilator trigger separately** — two Annihilator 2 instances = two separate sacrifices.

## Canonical Example
**Emrakul Arriving via Show and Tell:**
Opponent does nothing to prevent it. You cast Show and Tell.
Each player puts a permanent from hand onto the battlefield.
You put Emrakul, the Aeons Torn (Flying, Prot-colored, Annihilator 6).
Opponent puts in their best creature or land.
Emrakul enters. No Haste: can't attack this turn.
Turn 2: attack with Emrakul (15/15 Flying).
Annihilator 6 trigger fires: defending player must sacrifice 6 permanents.
They have: 4 lands, 2 creatures (total 6 permanents exactly).
They sacrifice all 6 permanents. Board is empty for them.
Annihilator trigger resolves. Now declare blockers: they have no blockers.
15/15 Flying hits them for 15 damage. They were at 20.
At 5 life with no board and no mana after sacrifice.
Likely win next attack.

**Example 2 — Annihilator + Haste via Aetherworks Marvel:**
Spin Aetherworks Marvel: find Emrakul, the Aeons Torn in the top 6. Cast it for free.
Emrakul enters. Wait: Aetherworks Marvel "cast it" — Emrakul is cast → its cast trigger fires.
Cast trigger: "When you cast this spell, take an extra turn after this one."
Emrakul is a 15/15 with Flying, Prot-colored, Annihilator 6.
Your current turn: Emrakul has summoning sickness (entered this turn → can't attack).
Extra turn: your extra turn begins. Now it's been under your control since your previous turn.
During your extra turn: Emrakul does NOT have summoning sickness (it was under your control since the previous turn).
Wait: the extra turn was granted, but Emrakul still entered THIS turn (the current-when-entering-turn).
Actually: "Has been under your control continuously since the beginning of your turn" applies per-turn.
If you take an extra turn: Emrakul entered on the turn before the extra turn — so it's under your control since the previous turn (which IS before your extra turn begins).
Emrakul CAN attack on the extra turn. Attack → Annihilator 6 → 6 sacrifices → 15 damage = win.

## Commonly Confused With
- **P230 (Entwine)** — Completely unrelated. Common confusion comes from "big spells" generally.
- **P233 (Echo)** — Echo forces sacrifice if a cost isn't paid; Annihilator forces sacrifice when attacking. Very different triggers and targets.
- **P009 (Sacrifice vs Destroy)** — Annihilator uses sacrifice (not destroy): indestructible creatures can still be sacrificed. This is a critical distinction.
