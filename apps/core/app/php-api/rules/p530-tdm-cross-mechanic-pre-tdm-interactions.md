---
id: p530
name: TDM Cross-Mechanic Interactions with Pre-TDM Keywords
category: keywords
cr_refs: [601.2b, 601.2f, 601.2g, 701.26, 702.2, 702.32, 702.86, 702.181, 701.63, 702.180]
tags: [harmonize, endure, mobilize, behold, flashback, proliferate, vigilance, cascade, tarkir-dragonstorm, TDM, alternative-costs, additional-costs, triggers, keywords]
created: 2026-03-30
examples_count: 6
---

# P530 — TDM Cross-Mechanic Interactions with Pre-TDM Keywords

## Abstract

**Tarkir: Dragonstorm** mechanics (Harmonize, Endure, Mobilize, Behold) interact with established mechanics in non-obvious ways. Four key interactions reveal rules traps around alternative vs. additional costs, binary choice resolution, trigger sequencing, and cost payment exemptions.

1. **Harmonize + Flashback** — Both are alternative costs from the graveyard; a player chooses one, not both.
2. **Endure + Proliferate** — Proliferate cannot retroactively change Endure's binary choice; it can only enhance existing counters.
3. **Mobilize + Vigilance** — Vigilance prevents tapping but not the attack declaration; Mobilize triggers normally.
4. **Behold + Cascade** — Cascade exempts mana cost only; Behold's additional cost must still be paid.

## Rules Citations

**CR 601.2b** (Alternative Costs): "If the spell has alternative costs, the player chooses which one to use."

**CR 601.2f** (Additional Costs): "If the spell has additional costs, the player may pay any of them."

**CR 601.2g** (Multiple Alternative Costs): "If a spell is cast as an alternative cost, that doesn't prevent another alternative cost from being applied; only one alternative cost can be chosen at a time."

**CR 702.32** (Flashback): "You may cast this card from your graveyard. If you cast this card from your graveyard, [additional cost applies]."

**CR 702.86a** (Cascade): "When you cast a spell with cascade, you may search your library for a card with mana value less than that spell's mana value, reveal it from your library, put it into your hand, then shuffle your library."

**CR 702.86b** (Cascade Cast): "You may cast that card without paying its mana cost."

**CR 702.2** (Vigilance): "Tapping this creature doesn't cause it to become tapped."

**CR 702.181** (Mobilize): "When this creature attacks, create N tapped and attacking 1/1 red Warrior creature tokens. [...] Sacrifice those tokens at the beginning of the next end step."

**CR 701.63** (Endure): "Put N +1/+1 counters on this permanent or create a 2/2 white Spirit creature token."

**CR 702.180** (Harmonize): "You may cast this card from your graveyard by paying [harmonize cost] rather than paying its mana cost. As an additional cost, you may tap an untapped creature to reduce the generic mana in this cost by an amount equal to that creature's power. If this spell would be put into a graveyard from the stack or exiled from the stack, exile it instead."

**CR 701.26** (Proliferate): "Choose any number of permanents and/or players that have a counter. Put a counter on each of those permanents and/or players."

## The Pattern

### INTERACTION 1: HARMONIZE + FLASHBACK

**Question**: Can you Flashback a Harmonize card? Does Flashback count as casting?

**Core Conflict**: Both Harmonize and Flashback are alternative costs to cast from the graveyard. A single spell cannot use two alternative costs simultaneously.

**Rules Resolution** (CR 601.2g):
- Flashback (CR 702.32) allows casting from the graveyard by paying its flashback cost instead of mana cost.
- Harmonize (CR 702.180) allows casting from the graveyard by paying its harmonize cost instead of mana cost.
- Both are ALTERNATIVE COSTS under CR 601.2.
- CR 601.2g states: "If a spell has multiple alternative costs, the player chooses which one to use; they cannot combine them."

**VERDICT: MUTUALLY EXCLUSIVE ALTERNATIVE COSTS**

A card with both Harmonize and Flashback requires the caster to choose ONE:
- **Route A (Flashback)**: Pay the flashback cost (and any non-alternative additional costs), exiled normally when leaving the stack.
- **Route B (Harmonize)**: Pay the harmonize cost, optionally tap a creature to reduce generic mana, exiled from the stack (per harmonize's always-exile clause).
- **NOT BOTH**: Cannot pay both flashback cost and harmonize cost in a single casting.

Both routes count as "casting" the spell (not a special action or zone manipulation). The spell goes on the stack, can be responded to, resolves or is countered normally.

**Example**:
- Card: "Harmonized Thought ({2}{U}: Target player draws a card. Harmonize {3}{U}. Flashback {2}{U}{R}.)"
- To cast from graveyard, choose:
  - *Via Flashback*: Pay {2}{U}{R} → card resolves, exiled normally after resolution.
  - *Via Harmonize*: Pay {3}{U} (or less if you tap a creature) → card resolves, exiled via harmonize's always-exile clause.

**Canonical Sequence**:
```
Player controls Harmonized Thought in graveyard, with a 2/2 untapped creature in play.

Cast via Flashback: Pay {2}{U}{R} → spell on stack → resolves or countered → exiled.
Cast via Harmonize: Pay {3}{U}, tap 2/2 creature → pay {1}{U} → spell on stack → resolves or countered → exiled (harmonize always-exile).
```

---

### INTERACTION 2: ENDURE + PROLIFERATE

**Question**: Does Proliferate affect the Spirit token choice? (Expected: no.)

**Core Principle**: Endure requires a binary choice at resolution; Proliferate is a separate action that occurs later.

**Rules Resolution**:
- Endure (CR 701.63): "Put N +1/+1 counters on this permanent or create a 2/2 white Spirit creature token."
  - This is a BINARY CHOICE made at resolution time (CR 116.1a: "[At resolution,] the player who cast the spell chooses the mode...").
  - Choice is final once made.

- Proliferate (CR 701.26): "Choose any number of permanents and/or players that have a counter. Put a counter on each of those permanents and/or players."
  - Proliferate ADDS counters; it does not CHANGE an existing choice.
  - Proliferate can only target permanents or players with at least one counter already present.

**VERDICT: PROLIFERATE CANNOT RETROACTIVELY CHANGE ENDURE'S CHOICE**

Once Endure resolves with the player's choice, that choice is fixed:
- **If +1/+1 counters chosen**: Endure puts N counters on the permanent. Later, Proliferate can add ADDITIONAL counters if cast. Net: more counters total.
- **If Spirit token chosen**: Endure creates a 2/2 white Spirit token. The token is a creature without any counters. Later, Proliferate cannot target the Spirit token (it has no counter) and cannot retroactively give the original permanent counters instead.
- **Intermediary**: If Proliferate is cast between Endure trigger firing and Endure resolving, Proliferate still affects the choice only indirectly—the choice itself is still made by the player, not by Proliferate.

**Key Distinction**:
- Endure's binary choice happens at RESOLUTION TIME.
- Proliferate's counter-adding happens at RESOLUTION TIME of proliferate (a different resolution).
- A player cannot "wait" to see if they'll proliferate later to change an Endure choice—the choice is immediate.

**Example**:
```
Anafenza, Unyielding Lineage ({2}{W}: 2/2 Spirit Soldier; Flash, First Strike; "Whenever another nontoken creature you control dies, Anafenza endures 2.") is in play. A nontoken creature dies.

Endure 2 trigger goes on stack. On Anafenza's controller's turn, at resolution:
  → Player chooses: Put 2 +1/+1 counters on Anafenza, OR create a 2/2 white Spirit token.

CHOICE A: Player chooses counters.
  Anafenza now has 2 +1/+1 counters.
  Later that turn, if player casts proliferate (or opponent does, if proliferate isn't restricted to caster), Anafenza can be chosen for proliferate (it has counters). Anafenza gets +1 more counter (3 total).

CHOICE B: Player chooses Spirit token.
  A 2/2 white Spirit token appears.
  Later that turn, if player casts proliferate, the Spirit token CANNOT be chosen (it has no counter on it). Anafenza CANNOT retroactively get counters instead. The choice (Spirit token) is final.
```

**Canonical Rule**: Proliferate does NOT interact with Endure's choice. Proliferate ENHANCES existing counters on permanents that were chosen for +1/+1 counters. Proliferate cannot change a Spirit-token choice retroactively.

---

### INTERACTION 3: MOBILIZE + VIGILANCE

**Question**: If a creature attacks without tapping (vigilance), do Warriors still generate?

**Core Principle**: Vigilance prevents tapping, but does not prevent the attack declaration. Mobilize triggers on attack declaration, not on tapping.

**Rules Resolution**:
- Mobilize (CR 702.181): "When this creature attacks, create N tapped and attacking 1/1 red Warrior creature tokens."
  - Trigger event: "When this creature attacks"
  - A creature "attacks" during the declare-attackers step (CR 509.1a).
  - Vigilance does NOT prevent the attack; vigilance only prevents the creature from tapping.

- Vigilance (CR 702.2): "Tapping this creature doesn't cause it to become tapped."
  - Vigilance is a static ability modifying the tapping rules.
  - Vigilance does NOT affect attack declaration.
  - Vigilance does NOT prevent the trigger "When this creature attacks" from firing.

**VERDICT: VIGILANCE DOES NOT PREVENT MOBILIZE TOKENS**

A vigilance creature still attacks, so Mobilize triggers:
- The creature attacks (vigilance does not prevent this).
- At declare-attackers step, the creature is chosen as an attacker.
- Vigilance causes the creature to not tap (it remains untapped).
- Mobilize trigger "When this creature attacks" fires (the creature did attack).
- Warrior tokens are created tapped and attacking (per Mobilize).
- Net: Vigilance creature attacks untapped, Warrior tokens attack tapped.

**Key Distinction**:
- Tapping and attacking are SEPARATE actions in CR 509.
- Vigilance modifies TAPPING, not ATTACKING.
- Mobilize cares about ATTACKING, not TAPPING.
- Therefore, vigilance does not prevent Mobilize.

**Example**:
```
Bone-Cairn Butcher ({1}{R}{W}{B}: 4/4 Demon; Mobilize 2; "Attacking tokens you control have deathtouch.") gains vigilance (e.g., from Sword of Feast and Famine or an aura).

Combat phase:
  1. Declare attackers step: Bone-Cairn Butcher is chosen as an attacker.
  2. Normally, Butcher would tap. But vigilance prevents it → Butcher is not tapped.
  3. Mobilize trigger fires: "When Bone-Cairn Butcher attacks, create 2 tapped and attacking 1/1 red Warrior tokens."
  4. Two 1/1 red Warrior tokens enter the battlefield tapped and attacking.
     They have deathtouch (per Butcher's static ability).
  5. Butcher is untapped, Warriors are tapped, all three creatures attack.
```

**Canonical Rule**: Vigilance does not prevent Mobilize. Vigilance only prevents the creature from tapping during the attack declaration. Mobilize triggers on the attack itself, so Warrior tokens are always created.

---

### INTERACTION 4: BEHOLD + CASCADE

**Question**: Can you cascade into a card with Behold? Do you have to pay Behold?

**Core Principle**: Cascade exempts the mana cost but not additional costs. Behold is an additional cost (if required) or a cost modifier (if optional).

**Rules Resolution**:
- Cascade (CR 702.86b): "You may cast that card without paying its mana cost."
  - "Without paying its mana cost" exempts the mana cost and all colored/generic mana.
  - Does NOT exempt alternative costs or additional costs (CR 601.2b, CR 601.2f).

- Behold (CR 701.4): "As an additional cost to cast this spell, behold a Dragon. If it's a cost, the player must reveal that card or choose a permanent you control with that subtype."
  - Required behold: "As an additional cost to cast this spell, behold a Dragon."
    - This is a mandatory additional cost (CR 601.2f).
    - Cascade exempts mana cost, but not additional costs.
    - Player must still satisfy the behold cost or cannot cast the spell.
  - Optional behold: "You may behold a Dragon. If a Dragon was beheld, [effect]."
    - This is an optional additional cost (the "may" modifier).
    - Player can choose to behold or not.
    - Enhanced effect applies only if beheld.

**VERDICT: CAN CASCADE INTO BEHOLD; ADDITIONAL COST MUST BE PAID**

Cascading into a Behold card requires the additional cost to be paid (if required) or may be paid (if optional):

**Example 1: Required Behold**
```
Card: Caustic Exhale ({B}: instant; "As an additional cost to cast this spell, behold a Dragon or pay {1}. Target creature gets -3/-3.")

You cast a spell with cascade, find Caustic Exhale (MV < cascade spell MV).

Cascade says: "You may cast that card without paying its mana cost."
  → You don't pay {B} (the mana cost).
  → But "As an additional cost to cast this spell, behold a Dragon or pay {1}."
  → This is an additional cost, not part of the mana cost.
  → You MUST satisfy one of the options: behold a Dragon OR pay {1}.

If you have a Dragon on battlefield or in hand:
  → You can behold the Dragon (no mana required).
  → Cast Caustic Exhale, targeting a creature.

If you have no Dragons:
  → You cannot behold (no Dragons available).
  → You must pay {1} (the "or pay {1}" option).
  → You need {1} remaining mana to complete the cast.

If you have neither Dragons nor remaining {1} mana:
  → You cannot complete the cast.
  → You don't cast Caustic Exhale (cascade allows you to choose not to).
```

**Example 2: Optional Behold**
```
Card: Dispelling Exhale ({1}{U}: instant; "You may behold a Dragon. If a Dragon was beheld, counter target spell unless its controller pays {4}. Otherwise, counter target spell unless its controller pays {2}.")

You cascade into Dispelling Exhale.

Cascade says: "You may cast that card without paying its mana cost."
  → You don't pay {1}{U} (the mana cost).
  → But "You may behold a Dragon" is an optional additional cost.
  → You choose whether to behold or not.

If you behold a Dragon (and have a Dragon in hand or on battlefield):
  → "If a Dragon was beheld" is true.
  → Counter target spell unless its controller pays {4}.

If you don't behold:
  → "If a Dragon was beheld" is false.
  → Counter target spell unless its controller pays {2}.

Either way, you successfully cast Dispelling Exhale.
```

**Canonical Rule**: Cascade exempts mana cost only. Additional costs (Behold, if required) must still be paid. Optional additional costs (optional Behold) can be chosen by the player.

---

## Definitive Conclusions

1. **Harmonize + Flashback are mutually exclusive**: A card with both mechanics requires the player to choose one alternative cost (Flashback or Harmonize), not both. The choice is made before paying costs. Both count as "casting" the spell normally.

2. **Endure + Proliferate don't interact on choice**: Endure's binary choice (counters or Spirit token) is made at resolution and is final. Proliferate can enhance counters chosen via Endure but cannot retroactively change the choice. A player who chose Spirit token cannot later proliferate and get counters instead.

3. **Mobilize + Vigilance are compatible**: Vigilance prevents tapping but not attack declaration. Mobilize triggers on the attack itself, not on any tapping rule. A vigilance creature still attacks, so Mobilize tokens are created. The creature is untapped (vigilance), but the tokens are tapped (Mobilize).

4. **Behold + Cascade require additional cost payment**: Cascade exempts mana cost only. Behold's additional cost (required or optional) must still be paid. A player cascading into a card with required Behold must behold a Dragon or satisfy an alternative option (e.g., "or pay X"). Cascading into optional Behold allows the player to choose whether to behold.

## Commonly Confused With

- **P495 (Behold, Endure, Harmonize, Mobilize)** — The TDM mechanics themselves; this pattern focuses on cross-mechanic interactions with pre-TDM mechanics.
- **P338 (Graveyard Recursion: Flashback, Dredge, Unearth)** — Flashback is one of many graveyard-cast mechanics; this pattern focuses specifically on Flashback + Harmonize conflict.
- **P474 (Surveil, Explore, Venture, Dungeon)** — Proliferate is documented elsewhere; this pattern focuses on Proliferate + Endure interaction only.
- **P438 (Jump-Start, Escape, Foretell)** — Other alternative graveyard-cast costs; Harmonize differs in always-exile behavior.
- **P427 (Cascade)** — Cascade is documented elsewhere; this pattern focuses on Cascade + Behold cost interaction.
- **P524 (Endure + Token Doublers)** — Token doublers interact with Endure's choice; this pattern focuses on Proliferate's counter-adding, not token doubling.

## Canonical Examples

**Example 1: Harmonize + Flashback (Alternative Cost Choice)**

Card: Mystical Insight ({2}{U}: Sorcery; "Look at the top two cards of your library and put one into your hand and the other on the bottom of your library. Harmonize {4}{U}. Flashback {3}{U}.")

Mystical Insight is in your graveyard. You control a 3-power untapped creature.

**Route A (Flashback)**: Cast for {3}{U}, card resolves, exiled normally.
**Route B (Harmonize)**: Cast for {4}{U}, tap 3-power creature → cost reduced to {1}{U}, card resolves, always exiled (per Harmonize).

You choose which route. Not both.

---

**Example 2: Endure + Proliferate (Choice Finality)**

You control Anafenza, Unyielding Lineage (Endure 2 on nontoken creature death). A nontoken creature you control dies.

Endure 2 trigger resolves. You choose:
- **Option A**: Put 2 +1/+1 counters on Anafenza.
- **Option B**: Create a 2/2 white Spirit token.

You choose Option B (Spirit token). The token enters the battlefield.

On your next turn, you cast proliferate (e.g., Evolution Charm). Can you use proliferate to retroactively give Anafenza +1/+1 counters instead?

**Answer**: No. The Endure choice was made and is final. Proliferate can only enhance permanents with existing counters. Anafenza has no counters (you chose Spirit token). Proliferate cannot target Anafenza (no counter) and cannot change the Endure choice.

If you had chosen Option A (counters), then proliferate would add an additional +1/+1 counter to Anafenza (3 total).

---

**Example 3: Mobilize + Vigilance (Token Generation)**

You control Bone-Cairn Butcher ({1}{R}{W}{B}: 4/4 Demon; Mobilize 2; "Attacking tokens you control have deathtouch."). It gains vigilance via Sword of Feast and Famine.

Combat phase: Declare attackers step.
- Bone-Cairn Butcher is chosen as an attacker.
- Vigilance prevents it from tapping → it's untapped after declare-attackers step.
- Mobilize trigger fires: create 2 tapped and attacking 1/1 red Warrior tokens.
- The Warriors have deathtouch (per Butcher's static ability).

Result:
- Bone-Cairn Butcher: attacking, untapped, 4/4, deathtouch (from Mobilize tokens).
- Warrior 1: attacking, tapped, 1/1, deathtouch.
- Warrior 2: attacking, tapped, 1/1, deathtouch.

---

**Example 4: Behold + Cascade (Required Additional Cost)**

You control a Dragon (e.g., Sarkhan's Unsealing). You cast a spell with cascade, find Caustic Exhale ({B}: "As an additional cost to cast this spell, behold a Dragon or pay {1}. Target creature gets -3/-3.") in your library.

Cascade says: cast without paying {B} (the mana cost).

But Caustic Exhale has an additional cost: behold a Dragon or pay {1}.

You choose: behold the Dragon you control (Sarkhan's Unsealing).

Cast Caustic Exhale at no mana cost (cascade + behold). Target a creature and deal -3/-3. Spell resolves normally.

---

**Example 5: Behold + Cascade (Optional, Enhanced Effect)**

You cast a spell with cascade, find Dispelling Exhale ({1}{U}: "You may behold a Dragon. If a Dragon was beheld, counter target spell unless its controller pays {4}. Otherwise, counter target spell unless its controller pays {2}.") in your library.

Cascade says: cast without paying {1}{U} (the mana cost).

Dispelling Exhale has optional behold: "You may behold a Dragon."

You have a Dragon in hand.

**If you behold the Dragon**:
  → "If a Dragon was beheld" is true.
  → Counter target spell unless its controller pays {4}.

**If you don't behold**:
  → "If a Dragon was beheld" is false.
  → Counter target spell unless its controller pays {2}.

You choose which outcome you want. Either way, you cast Dispelling Exhale at no mana cost.

---

## Rules Summary Table

| Interaction | Verdict | Ruling | Reference |
|-------------|---------|--------|-----------|
| **Harmonize + Flashback** | Mutually exclusive; choose one | Player chooses one alternative cost, not both | CR 601.2g |
| **Endure + Proliferate** | Proliferate cannot change choice | Endure's choice is final at resolution | CR 116.1a, 701.26 |
| **Mobilize + Vigilance** | Vigilance doesn't prevent Warriors | Vigilance affects tapping, not attack declaration | CR 702.2, 702.181 |
| **Behold + Cascade** | Must pay additional cost if required | Cascade exempts mana cost only | CR 601.2f, 702.86b |
