---
id: p447
name: Training, Compleated, Reconfigure, Casualty, and Connive — Innistrad/New Capenna Mechanics
category: triggered
cr_refs: [702.149a, 702.149b, 702.150a, 702.151a, 702.151b, 702.153a, 702.153b, 701.50a, 701.50b, 701.50d, 1301.5c]
tags: [training, compleated, reconfigure, casualty, connive, phyrexian-mana, loyalty-counter, ETB-entry, Equipment-creature-duality, power-comparison, copy-spell, cast-trigger, nonland-discard, counter-accumulation, Hopeful-Initiate, Jace-Perfected-Mind, Lion-Sash, Make-Disappear, Ledger-Shredder, Innistrad-Midnight-Hunt, New-Capenna, Kamigawa-Neon-Dynasty, Phyrexia-All-Will-Be-One]
created: 2026-03-29
examples_count: 2
---

# P447 — Training, Compleated, Reconfigure, Casualty, and Connive — Innistrad/New Capenna Mechanics

## Abstract
Five mechanics from recent sets. **Training** (702.149) puts a +1/+1 counter on a creature when it attacks alongside a creature with greater power — unlike Mentor (P440), Training has no targeting restriction and no power-check at resolution. **Compleated** (702.150) reduces loyalty counter entry for Phyrexian-mana planeswalkers when life is paid. **Reconfigure** (702.151) is a dual-state Equipment/creature mechanic: not attached = creature; attached = Equipment (not creature). **Casualty** (702.153) is a triggered copy ability enabled by an additional creature sacrifice. **Connive** (701.50) is a draw-discard effect that rewards discarding nonland cards with +1/+1 counters. Key non-obvious interactions: (1) **Training fires once per attack, not per greater-powered attacker** — if five creatures with greater power attack alongside a training creature, the trigger fires once (for each training instance on the creature, but not per greater-powered attacker); (2) **Compleated only reduces loyalty if life was paid DURING CASTING** — Reanimating or copying a compleated planeswalker enters with full loyalty; (3) **Reconfigure cards lose creature status while attached** — they can't be destroyed by "destroy target creature" while attached, and they can't attack or block while attached; (4) **Casualty's copy fires when you CAST the spell** — the copy is a separate object; if the original is countered, the copy may still resolve.

## The Definitive Rules

**CR 702.149a** (verbatim): *"Training is a triggered ability. 'Training' means 'Whenever this creature and at least one other creature with power greater than this creature's power attack, put a +1/+1 counter on this creature.'"*

**CR 702.150a** (verbatim): *"Compleated is a static ability found on some planeswalker cards. Compleated means 'If this permanent would enter with one or more loyalty counters on it and the player who cast it chose to pay life for any part of its cost represented by Phyrexian mana symbols, it instead enters the battlefield with that many loyalty counters minus two for each of those mana symbols.'"*

**CR 702.151a** (verbatim): *"Reconfigure represents two activated abilities. Reconfigure [cost] means '[Cost]: Attach this permanent to another target creature you control. Activate only as a sorcery' and '[Cost]: Unattach this permanent. Activate only if this permanent is attached to a creature and only as a sorcery.'"*

**CR 702.151b** (verbatim): *"Attaching an Equipment with reconfigure to another creature causes the Equipment to stop being a creature until it becomes unattached from that creature."*

**CR 702.153a** (verbatim): *"Casualty N means 'As an additional cost to cast this spell, you may sacrifice a creature with power N or greater,' and 'When you cast this spell, if a casualty cost was paid for it, copy it. If the spell has any targets, you may choose new targets for the copy.'"*

**CR 701.50a** (verbatim): *"Certain spells and abilities instruct a permanent to connive. To do so, that permanent's controller draws a card, then discards a card. If a nonland card is discarded this way, that player puts a +1/+1 counter on the conniving permanent."*

## The Pattern

```
TRAINING (702.149a):
  "Whenever this creature AND at least one other creature with power greater than this
   creature's power attack, put a +1/+1 counter on this creature."

  FIRES ONCE PER ATTACK:
    One trigger fires per attack event (regardless of how many qualifying attackers there are).
    5 creatures with greater power attacking alongside: Training fires ONCE (not 5 times).
    "At least one" = just needs to be true. One or more is sufficient to trigger once.

  POWER CHECK AT TRIGGER TIME (DECLARE ATTACKERS):
    "Creature with power greater than this creature's power": checked when the trigger would fire
      (at declare attackers). If the condition is met at that moment, the trigger goes on the stack.
    NO INTERVENING IF CLAUSE: unlike Felidar Sovereign, there's no "if condition is still true."
      Training fires when the condition is true at declare attackers. There's no re-check at
      resolution. The counter is placed when the trigger resolves regardless of what happened.

  COMPARE TO MENTOR (P440):
    Mentor: "put a +1/+1 counter on TARGET attacking creature with power LESS THAN this creature."
      Mentor requires a TARGET with a power restriction; that restriction is checked at resolution.
      If the target's power changes: target may become illegal → Mentor does nothing.
    Training: "put a +1/+1 counter on THIS creature" — no targeting. No resolution-time power check.
    If the greater-powered attacker dies before Training resolves: Training still puts the counter.
      The counter goes on the TRAINING creature, not the greater-powered one. No restriction at resolution.

  MULTIPLE TRAINING INSTANCES (702.149b):
    Each instance triggers separately. Two training instances = two triggers = two counters per attack.

  TRAINING AND PUMP:
    The training creature has power X before the attack. Another creature attacks with power X+1.
    Training fires. In response, opponent uses a -1/-1 pump on the greater-powered creature,
      bringing its power to X. Now the greater-powered creature is no longer greater.
    Training trigger: no intervening if clause. Fires regardless. Counter is placed.
    The initial trigger condition was met at declare attackers. Resolution doesn't re-check.

COMPLEATED (702.150a):
  REDUCTION FOR LIFE PAYMENT:
    If you pay life (not mana) for ANY Phyrexian mana symbol {P}:
    Enters with (normal loyalty - 2) per {P} symbol paid with life.
    Jace, the Perfected Mind ({2}{U}{U/P}: normally enters with 4 loyalty):
      Pay {2}{U}{U}: no life paid. Enters with 4 loyalty. Full power.
      Pay {2}{U} + 2 life: one {P} paid with life. Enters with 2 loyalty.
    The reduction is "for each of those [Phyrexian mana] symbols" you paid life for.
    If there are two {P} symbols and you pay life for both: -4 total loyalty.

  ONLY APPLIES TO CASTING:
    "The player who cast it chose to pay life" — requires the card to have been CAST.
    Reanimating a compleated planeswalker (Reanimate, unearth): it enters without being cast.
      No Phyrexian mana payment was made. No loyalty reduction.
      Planeswalker enters with its full printed loyalty.
    Copying a compleated planeswalker (Copy Enchantment, Spark Double): the copy enters
      without being cast. Enters with full printed loyalty (no reduction).
    Using a tutor that puts a planeswalker onto the battlefield directly: same — not cast.

  ETB REPLACEMENT NATURE:
    Compleated is an ETB replacement effect: "if this permanent WOULD ENTER with loyalty
    counters and life was paid." Modifies how the permanent enters.
    This is a 614.1c/d type effect (entering with different characteristics).

RECONFIGURE (702.151):
  DUAL STATE:
    NOT attached to a creature:
      → This card is an artifact creature (Creature + Artifact card types).
      → Can attack, block, crew Vehicles.
      → Subject to "destroy target creature," "target creature gets +1/+1," etc.
      → Has summoning sickness (creature rules apply).
    ATTACHED to a creature (as Equipment):
      → This card is NOT a creature (702.151b).
      → Card types: Artifact + Equipment subtype (but not Creature).
      → Not subject to creature-targeting effects.
      → Doesn't attack or block.
      → Grants the equipped creature its abilities and bonuses.

  RECONFIGURE ONLY AS SORCERY:
    Can only attach/unattach during your main phase with empty stack.
    Can't reconfigure in response to removal targeting the Equipment.
    Can't reconfigure to dodge combat (opponents can't be surprised by a sudden creature).
    Can't unattach during opponent's turn to block.

  RECONFIGURE AND SUMMONING SICKNESS:
    When the reconfigure card enters the battlefield: it's an artifact creature. It has
      summoning sickness (was just put under your control).
    Same turn: you can reconfigure it (sorcery speed, but summoning sickness only prevents
      attacking and {T} abilities — not casting spells or paying sorcery-speed costs).
    Once attached: it's not a creature. Summoning sickness is irrelevant (not a creature).
    If it's unattached later: it's a creature again. Does it still have summoning sickness?
      CR 302.6: creature can't attack unless under continuous control since start of turn.
      When it was unattached, it "became" a creature again. Was it under continuous control
      since the start of the turn? YES — it's been on the battlefield the whole time.
      So no summoning sickness after unattaching: can attack immediately (if turn started with it).
    EDGE CASE: unattached this turn. The "became a creature" check:
      CR 302.6 checks: "has it been under its controller's continuous control since the
        start of their most recent turn." The permanent has been there. The TYPE changed.
        Unlike a Vehicle (P436), which uses the same principle: if it's been under control
        since before this turn, no summoning sickness when it "becomes a creature."

CASUALTY (702.153a):
  "As an additional cost: sacrifice a creature with power N or greater."
  "When you cast this spell, if casualty cost was paid, copy it."

  SACRIFICE + COPY (TRIGGERED ABILITY):
    Sacrifice happens during cost payment (part of casting the spell).
    The triggered ability fires "when you cast this spell" — after the spell is on the stack.
    The copy is placed on the stack above the original.
    Copy resolves first. Then the original resolves.

  IF THE ORIGINAL IS COUNTERED:
    Counterspelling the original: the original is countered and removed from the stack.
    The copy is a SEPARATE OBJECT on the stack. Countering the original doesn't affect the copy.
    The copy may still resolve (unless also countered separately).

  CASUALTY AND NEW TARGETS FOR COPY:
    "If the spell has any targets, you may choose new targets for the copy."
    You MAY choose new targets (optional). You can keep the same targets.
    The copy and the original can hit different things (great for removal spells).

  CASUALTY AND AFTERLIFE:
    If the sacrificed creature has afterlife: it goes to GY → afterlife fires → Spirit tokens.
    The Spirit tokens enter after the casualty sacrifice, before the spell resolves.
    Timing: sacrifice (creature to GY), afterlife trigger goes on stack, then the casualty copy
      trigger fires, then the copy is placed on stack. Both triggers resolve eventually.

CONNIVE (701.50a):
  "Draw a card, then discard a card. If a nonland card is discarded, put a +1/+1 counter on the conniving permanent."

  DRAW THEN DISCARD:
    Order matters: draw FIRST, then discard. You see the drawn card before deciding what to discard.
    Can discard the card you just drew (if it's non-optimal).
    Can discard any card in hand.

  COUNTER ONLY FOR NONLAND DISCARD:
    If you discard a land: no counter. Only nonland cards grant the counter.
    Discarding a basic land: no counter.
    Discarding an artifact land (Seat of the Synod): it's a land AND an artifact. But is it a land?
      Yes — "nonland card" means not a land. Land cards are land (even if they're also artifacts).
      Discarding Seat of the Synod: land card → no counter.

  CONNIVE TRIGGERS ONCE PER INSTRUCTION:
    If multiple permanents are instructed to connive simultaneously: 701.50d applies.
      APNAP order: each player handles their permanent's connive separately.
      "The first player in APNAP order chooses one of THEIR permanents and it connives. Then next."

  CONNIVE N (701.50e):
    Draw N, discard N. Counter per nonland discarded.
    Can get multiple counters in one connive N if you discard N nonland cards.
    Connive 3: draw 3, discard 3. If all 3 discards are nonland: +3 counters.
```

## Definitive Conclusions

- **Training fires once per attack regardless of how many qualifying creatures attack** — "at least one" just needs to be true; the trigger fires once; no power re-check at resolution (unlike Mentor which checks power at targeting and at resolution).
- **Compleated loyalty reduction only applies when CAST** — reanimating or copying a compleated planeswalker gives full loyalty; only the casting player's choice to pay life reduces loyalty.
- **Reconfigure cards are NOT creatures while attached** — they lose the Creature card type; they can't be destroyed by "destroy target creature" while attached; they can't attack or block while attached.
- **Reconfigure unattaching later in the same turn doesn't re-apply summoning sickness** — the permanent has been under continuous control since the turn started; it can attack immediately after unattaching if it was controlled before the turn began.
- **Casualty's copy survives if the original is countered** — the copy is a separate object on the stack; countering the original doesn't affect the copy.
- **Connive draws first, then discards** — you see your drawn card before discarding; the counter only applies for nonland discards; land discard gives no counter.

## Canonical Example
**Training vs. Mentor power-check comparison:**
Battlefield: Hopeful Initiate (1/1; training; "{2}{W}, remove 2 counters from among creatures you control: destroy target artifact or enchantment") and a 3/3 creature you control.

Both attack. Training fires: "1/1 and another creature with power > 1 (the 3/3 has power 3 > 1) attack." Trigger fires. On the stack.

Opponent's Giant Growth on 3/3 in response? If the 3/3 becomes a 6/6: training trigger already fired. At resolution: no re-check. Training puts a +1/+1 counter on Hopeful Initiate. (2/2 now.)

Contrast with Mentor (P440): if Hopeful Initiate were mentoring the 3/3 (Hopeful Initiate would need power 4+ for that) and the 3/3 were pumped to equal power: Mentor's target becomes illegal at resolution.

Key difference: Training targets ITSELF (no separate target). No resolution-time targeting restriction.

**Example 2 — Reconfigure during removal:**
Lion Sash ({W}: 1/1 artifact creature Equipment; "{W}: exile a GY card, if permanent card put +1/+1 counter on this permanent"; reconfigure {2}) not attached, currently a 1/1 artifact creature with 3 +1/+1 counters (4/4 effectively; equipped creature gets +4/+4).

Opponent casts Doom Blade targeting Lion Sash (it's a nonblack creature).
Can you reconfigure to avoid the removal? No — reconfigure is sorcery speed. You're in your opponent's turn (or combat). Can't use a sorcery-speed ability.

If during your main phase with empty stack: you could reconfigure (attach Lion Sash to a creature). Once attached: Lion Sash is NOT a creature. "Destroy target creature" can't target it (not a creature).
Now your creature is equipped with Lion Sash (+4/+4) and Lion Sash itself can't be Doom Bladed.

## Commonly Confused With
- **P440 (Mentor)** — Mentor and training both care about power comparisons when attacking. The key difference: Mentor targets another creature and checks power at BOTH targeting and resolution; Training targets itself and only checks power AT THE TRIGGER EVENT (no re-check at resolution).
- **P441 (Mutate)** — Reconfigure and mutate both create unusual permanent interactions. Mutate merges two cards into one; reconfigure makes a creature become Equipment temporarily. In both cases, the permanent's card types change in non-obvious ways affecting what can target them.
- **P427 (Cascade + Additional Costs)** — Casualty's sacrifice is an additional cost (like kicker). The copy trigger fires when the spell is cast (like conspire, which creates a copy via a triggered ability). Both casualty and conspire create copies, but the mechanism differs: casualty's copy trigger is linked to the additional cost payment; conspire requires tapping two colored creatures.
- **P428 (Wither)** — Connive grants +1/+1 counters when nonland cards are discarded. Wither places -1/-1 counters. Both mechanics use counters as their primary effect. Connive counters and wither counters cancel each other (SBA: one +1/+1 counter + one -1/-1 counter on the same permanent = both removed).
