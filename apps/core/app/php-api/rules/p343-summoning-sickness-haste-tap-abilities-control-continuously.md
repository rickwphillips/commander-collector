---
id: p343
name: Summoning Sickness, Haste, and Tap Symbol Abilities — Control Continuity
category: combat
cr_refs: [302.6, 602.5a, 702.10a, 702.10b, 702.10c, 702.10d, 508.1a]
tags: [summoning-sickness, haste, tap-symbol, untap-symbol, control-continuously, attack-restriction, activated-ability, most-recent-turn, Elvish-Mystic, Birds-of-Paradise, Goblin-Guide, Sneak-Attack, gain-control, Act-of-Treason, Deceiver-Exarch, Kiora-the-Crashing-Wave, Restoration-Angel]
created: 2026-03-29
examples_count: 2
---

# P343 — Summoning Sickness, Haste, and Tap Symbol Abilities — Control Continuity

## Abstract
A creature can't attack or activate tap/untap symbol abilities unless it has been under its controller's control **continuously since their most recent turn began** (CR 302.6). This informal rule is called "summoning sickness." **Haste** bypasses both restrictions (702.10b–c). The rule is about the **controller's** most recent turn, not the card's age — a creature stolen from an opponent is under new control and must wait until the new controller's next turn (unless it has haste). Activated abilities that don't use the tap symbol are NOT restricted by summoning sickness. Only {T} and {Q} in the activation cost are blocked.

## The Definitive Rules

**CR 302.6** (verbatim): *"A creature's activated ability with the tap symbol or the untap symbol in its activation cost can't be activated unless the creature has been under its controller's control continuously since their most recent turn began. A creature can't attack unless it has been under its controller's control continuously since their most recent turn began. This rule is informally called the 'summoning sickness' rule."*

**CR 602.5a** (verbatim): *"A creature's activated ability with the tap symbol ({T}) or the untap symbol ({Q}) in its activation cost can't be activated unless the creature has been under its controller's control since the start of their most recent turn. Ignore this rule for creatures with haste (see rule 702.10)."*

**CR 702.10b** (verbatim): *"If a creature has haste, it can attack even if it hasn't been controlled by its controller continuously since their most recent turn began."*

**CR 702.10c** (verbatim): *"If a creature has haste, its controller can activate its activated abilities whose cost includes the tap symbol or the untap symbol even if that creature hasn't been controlled by that player continuously since their most recent turn began."*

## The Pattern

```
THE SUMMONING SICKNESS RULE (CR 302.6):
  A creature CAN'T attack OR activate {T}/{Q} abilities unless:
    It has been under its controller's control CONTINUOUSLY SINCE THEIR MOST RECENT TURN BEGAN.
  "Their most recent turn" = the last time the current controller's turn started (untap step).
  CRITERIA:
    1. Creature entered the battlefield during your current turn (before you attack): NO attack this turn.
       You play a 2/2 Forest Bear on turn 1. It entered on your turn 1. Can't attack turn 1.
       Next turn (turn 2): it's been under your control since turn 1's start. NOW it can attack.
    2. Creature was under your control when your most recent turn BEGAN: can attack.
       If a creature enters on your opponent's turn: you control it when YOUR next turn begins → can attack.
    3. Creature stolen from opponent DURING your turn: it entered YOUR control mid-turn.
       It hasn't been under your control since the start of your current turn → can't attack this turn.
       UNLESS it has haste.

  WHAT IS AFFECTED:
    - Attacking (508.1a): must have been controlled since turn began, OR have haste.
    - Activated abilities with {T} in the cost (602.5a): same continuity requirement.
    - Activated abilities with {Q} in the cost: same.
  WHAT IS NOT AFFECTED BY SUMMONING SICKNESS:
    - Blocking: any untapped creature can block regardless of when it entered. No continuity.
    - Triggered abilities: they fire automatically, not activated. No summoning sickness.
    - Static abilities: always on, no activation.
    - Activated abilities WITHOUT {T} or {Q}: can activate even with summoning sickness.
      Example: Prodigal Pyromancer ({2}{R}): "T: deal 1 damage to target." Has {T} → can't use while sick.
      Example: Llanowar Elves: "T: add {G}." Has {T} → can't tap for mana while sick.
      Example: Nantuko Shade ({B}{B}): "{B}: Nantuko Shade gets +1/+1 until end of turn." No {T} → CAN activate while sick.

HASTE (CR 702.10b–c):
  Bypasses BOTH restrictions:
    - Can attack on the turn it enters.
    - Can use {T}/{Q} activated abilities on the turn it enters.
  HASTE IS A STATIC ABILITY (702.10a):
    It doesn't need to be activated. It's always on as long as the creature has it.
  GIVING HASTE RETROACTIVELY:
    If a creature enters WITHOUT haste but you give it haste AFTER it enters (this turn):
      Can it now attack? YES — the summoning sickness check at declare attackers is:
        "Does this creature have haste NOW or has it been here since turn began?"
        If it has haste now: can attack.
    Example: Swiftfoot Boots ({2}, equip {1}): "Equipped creature has hexproof and haste."
      Creature enters turn 2 (no haste). You equip Swiftfoot Boots on turn 2 (same turn, before attack).
      Creature now has haste via Swiftfoot Boots. Can attack turn 2.
      WAIT: Swiftfoot Boots has equip cost. Equip is a {T}? No — equip is an activated ability without {T}.
        Equipping is: "{1}: Attach to target creature you control. Activate only as a sorcery."
        No tap symbol → can activate Swiftfoot Boots equip at sorcery speed without summoning sickness.
      After equipping: creature has haste → can attack.
  LOSING HASTE BEFORE ATTACKERS DECLARED:
    If a creature enters with haste but loses haste before attackers are declared: can it attack?
      It depends on continuity. If it was here since turn began: can attack.
      If it entered this turn and now has no haste: it has summoning sickness. Can't attack.

GAINED CONTROL MID-TURN:
  Act of Treason ({2}{R}): "Gain control of target creature until end of turn. Untap it. It gains haste."
    You take opponent's 5/5 fatty.
    Untap: it becomes untapped.
    Gains haste: bypasses summoning sickness.
    Now you can attack with it this turn! (Haste covers the "hasn't been under control since turn began" issue.)
  WITHOUT HASTE GRANT: if you gain control but creature has no haste:
    Example: Bribery ({4}{U}): "Search opponent's library, put a creature onto the battlefield under your control."
      Creature enters under your control. But Bribery doesn't grant haste.
      Creature now has summoning sickness — can't attack or use {T} abilities this turn.
      Next turn: fine, no restriction.

CONTROL CHANGE — COMPLEX SCENARIOS:
  Scenario 1: Your creature stolen by opponent, then returned on your turn.
    Your Tarmogoyf stolen by opponent via Treachery.
    Next, your turn: you re-steal it (or it returns).
    If it returns to your control BEFORE your current turn began: can attack.
    If it returns to your control AFTER your current turn began: summoning sickness (unless haste).
  Scenario 2: Creature enters on opponent's end step under your control.
    You flash in Restoration Angel ({3}{W}) on opponent's end step.
    It enters under your control. Your turn starts: Restoration Angel has been under your control since
      your most recent turn began (it was in your control when your untap step started).
    Wait: it entered BEFORE your turn started (during opponent's end step). So when YOUR untap step
      begins, it was already under your control. YES — it can attack on your next turn.
    The rule: "since their most recent turn BEGAN." If creature entered before your turn began: it's fine.

BLOCKING IS NOT AFFECTED:
  Any untapped creature can block, regardless of summoning sickness.
  Common mistake: assuming new creatures can't block either.
  A 0/1 token you just created can block right away — no restriction.
  Summoning sickness only prevents ATTACKING and {T}/{Q} abilities.

{T} ABILITIES — MANA DORKS:
  Elvish Mystic, Birds of Paradise, Llanowar Elves: all have "{T}: add mana."
  If they enter with summoning sickness: can't tap for mana this turn.
  This is why playing a mana dork on turn 1 means no mana from it until turn 2.
  EXCEPTION with haste: if given haste (Fires of Yavimaya etc.), can tap for mana immediately.
  Joraga Treespeaker ({G}): Level up creature. Level 1 ability: "{T}: add {G}{G}."
    Can't use the {T} ability until turn 2 (or with haste).
```

## Definitive Conclusions

- **Summoning sickness only restricts attacking and {T}/{Q} abilities** — static abilities, triggered abilities, and activated abilities without {T}/{Q} work immediately.
- **The check is about the controller's most recent turn beginning** — a creature that entered before the current turn (e.g., flashed in on opponent's end step) can attack on the upcoming turn.
- **Giving haste after entry can enable immediate attacking** — haste is checked at declare attackers; if a creature has haste at that moment (even if newly granted), it can attack.
- **Gaining control mid-turn = summoning sickness unless haste is granted** — this is why Act of Treason and similar effects always include "it gains haste."
- **Blocking is never restricted by summoning sickness** — new creatures, tokens, just-arrived creatures can all block immediately.

## Canonical Example
**Turn 1 Goblin Guide — Haste in Action:**
You cast Goblin Guide ({R}): 2/2 Goblin Scout haste. "Whenever Goblin Guide attacks, defending player reveals the top card of their library. If it's a land card, that player puts it into their hand."

Turn 1. Goblin Guide just entered. It has HASTE.
Declare attackers: Goblin Guide can attack (haste bypasses the "since turn began" requirement).
  Goblin Guide attacks. Triggered ability fires: opponent reveals top card.
  They reveal a land → they take it into their hand.
  Goblin Guide deals 2 damage to opponent. (Assuming no blockers.)
Opponent: was at 20 life. Now 18.

Without haste: Goblin Guide would have summoning sickness. Can't attack turn 1.
With haste: attacks turn 1 for 2 damage and potentially gives opponent a land (ironic upside for them).

**Example 2 — Stolen Creature, Mana Dork, Summoning Sickness Gaps:**
Board: You control Arbor Elf ({G}): 1/1 elf. "T: Untap target Forest."
Arbor Elf entered on YOUR turn 3. It's now YOUR TURN 4 (Arbor Elf has been under control since turn 3 end).
Wait: "since their most recent turn BEGAN." Your turn 4 began → Arbor Elf was here before that → fine.
You can tap Arbor Elf for its {T} ability. ✓

Now: your opponent casts Treachery ({3}{U}{U}): enchant creature, gain control.
They enchant your Arbor Elf. Untap up to 5 lands (Treachery effect).
Now it's THEIR turn. Arbor Elf is under THEIR control.
Their turn began → Arbor Elf just transferred to their control during their turn (or before).
Actually: Treachery resolves on their turn 4. Arbor Elf now under their control.
At the start of THEIR TURN 4: did they control Arbor Elf? They cast Treachery during their TURN 4.
  If Treachery resolved during their main phase (after their turn 4 began): Arbor Elf entered their control mid-turn.
  Their most recent turn began BEFORE Arbor Elf entered their control.
  Result: Arbor Elf has summoning sickness for them this turn. Can't use {T} ability this turn.
  Next turn (their turn 5): Arbor Elf was under their control when their turn 5 began → can activate {T}.

BUT: Treachery has a clause: "When Treachery enters, untap up to 5 lands." The untapping is a triggered ability (no {T} symbol). So untap effect works regardless of summoning sickness.
The {T}: untap a Forest ability on ARBOR ELF: won't work this turn for the opponent (summoning sickness).

## Commonly Confused With
- **P341 (Combat Phase Steps)** — Summoning sickness determines WHICH creatures are legal attackers in the declare attackers step. P343 covers the restriction; P341 covers the full combat phase structure including when the check happens.
- **P332 (Phasing)** — Phased-out and phased-in creatures: when phased back in, do they have summoning sickness? No — phasing doesn't cause a zone change. The creature was under continuous control throughout (it never left). Phased-in creatures can attack immediately if they could attack before phasing out. This is DIFFERENT from flickering (P332), which creates a new object with summoning sickness.
- **P338 (Graveyard Recursion — Unearth)** — Unearth says the creature "gains haste." This is the same as any haste grant: bypasses summoning sickness. But Unearth creatures also can't attack after they're sacrificed/exiled at end step. The haste is the bypass; the exile-at-end is the drawback.
