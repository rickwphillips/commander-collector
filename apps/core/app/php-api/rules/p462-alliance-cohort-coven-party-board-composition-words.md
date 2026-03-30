---
id: p462
name: Alliance, Cohort, and Coven — Creature-Enters Trigger, Ally-Tap-Together, and Three-Different-Powers Conditions
category: triggered
cr_refs: [207.2c, 603.2, 603.3b, 700.4, 603.6a, 508.1, 700.5]
tags: alliance, cohort, coven, ability-word, creature-enters, ally-tap, different-powers, baldurs-gate, oath-of-gatewatch, innistrad-midnight-hunt
created: 2026-03-29
examples_count: 7
---

# P462 — Alliance, Cohort, and Coven — Creature-Enters Trigger, Ally-Tap-Together, and Three-Different-Powers Conditions

## Abstract

Three ability words (CR 207.2c) from different sets create non-obvious board-state conditions: **Alliance** (Commander Legends: Battle for Baldur's Gate, 2022) triggers whenever another creature enters the battlefield under your control; **Cohort** (Oath of the Gatewatch, 2016) is an activated ability requiring you to tap the creature itself plus an untapped Ally you control; and **Coven** (Innistrad: Midnight Hunt, 2021) provides a bonus when you control three or more creatures with different powers. Each has specific rules questions around tokens, simultaneous ETBs, and what "different powers" means when power changes.

## The Definitive Rules

### Alliance (CR 207.2c)
Alliance text pattern: *"Alliance — Whenever another creature enters the battlefield under your control, [effect]."*

Alliance is a triggered ability (CR 603.2). It triggers once for each creature that enters under the controller's control. "Another creature" means a creature other than the Alliance creature itself. Multiple creatures entering simultaneously each trigger Alliance once per Alliance creature (CR 603.3b: triggered once per occurrence).

### Cohort (CR 207.2c)
Cohort text pattern: *"{T}, Tap an untapped Ally you control: [effect]."*

Cohort is an **activated ability** (not triggered). The cost requires two tap symbols: tapping the Cohort creature itself AND tapping a separate untapped Ally you control. The Cohort creature must itself be an Ally (it's tapping itself AND another Ally).

Key: the Cohort creature itself is usually an Ally — tapping an Ally as the additional cost is in addition to {T} (tapping the Cohort creature).

### Coven (CR 207.2c)
Coven text pattern: *"[Effect]. Coven — [Bonus effect] if you control three or more creatures with different powers."*

"Three or more creatures with different powers" means you control at least three creatures, and at least three of them have pairwise-distinct power values. If you control a 1/1, a 2/2, and a 3/3, you have three creatures with three different powers → coven is active. If you control a 1/1, a 1/3, and a 2/2, you have a 1, 1, and 2 → only two distinct powers → coven is NOT active.

Power is measured as the creature's current power on the battlefield (after all continuous effects).

## The Pattern

```
ALLIANCE pattern:
Trigger: "Whenever another creature enters the battlefield under your control"
  → Triggers once per creature entering
  → "Another" means the Alliance creature is already on the battlefield
    → Alliance does NOT trigger when the Alliance creature itself enters
    → If two Alliance creatures are in play and a third creature enters:
      BOTH Alliance creatures trigger (each separately)
  → Tokens count: a Goblin token entering triggers Alliance
  → Tokens entering simultaneously: each token triggers Alliance separately
    → 5 tokens created simultaneously → 5 Alliance triggers per Alliance creature in play
  → Alliance creature entering via a subsequent action triggers other Alliance creatures in play
  → The Alliance trigger is in response to the creature's ETB — not the same event
    (triggered abilities go on stack after ETB resolves, per CR 603.3)

COHORT pattern:
Activation cost: {T}, Tap an untapped Ally you control:
  → Two separate tap costs:
    1. Tap the Cohort creature itself ({T})
    2. Tap a DIFFERENT untapped Ally you control
  → The Cohort creature is usually an Ally — it's tapping ITSELF and one other Ally
  → Both must be tapped simultaneously as part of paying the cost
  → Summoning sickness applies: the Cohort creature AND the other Ally must both
    be able to tap (unless they have haste or were on the battlefield since your last upkeep)
  → The other Ally can be any Ally you control (other than the Cohort creature itself)
  → If you only have the Cohort creature (no other Ally), you can't activate Cohort
  → Activated ability → can be Stifled, can be countered

COVEN pattern:
Check: Do you control 3+ creatures with pairwise-distinct power values?
  → "Different powers" = each must have a unique power value
  → You need AT LEAST 3 creatures with 3 distinct power values
  → Having a 1/1, 2/2, 3/3 → coven active (three different powers: 1, 2, 3)
  → Having a 1/1, 1/2, 2/3 → NOT coven (powers are 1, 1, 2 → only two distinct values)
  → Having a 1/1, 2/2, 3/3, 4/4 → coven active (at least 3 distinct powers, more is fine)
  → Power is measured CURRENTLY on the battlefield (after all continuous effects)
  → +1/+1 counters, pump spells, lord effects all modify power for coven checking
  → A 2/2 that gets +1/+1 becomes 3/3 — if a 3/3 is already in play, both are power 3
    → Coven may be broken by adding power to a creature
  → Static coven conditions re-check continuously as power changes
```

## Definitive Conclusions

**Alliance:**
- Alliance is one of the most combo-friendly ability words: every token, every creature ETB, every blink/flicker triggers it. Running a token generator alongside Alliance creatures creates cascading triggers.
- When the Alliance creature itself enters the battlefield, it does NOT trigger its own Alliance ability (the trigger says "another creature"). Other Alliance creatures already in play DO trigger for the new creature.
- Simultaneous ETBs: If Parallel Evolution creates 5 tokens, each token entering counts as a separate trigger for Alliance (CR 603.2c: triggered ability triggers once per occurrence, and each token entering is a separate occurrence). Result: 5 separate Alliance triggers per Alliance creature.
- Key card: *Rumor Gatherer* (Streets of New Capenna/UNF): "Alliance — Whenever another creature you control enters, scry 1. If this is the second time this ability has resolved this turn, draw a card instead." Scries for each creature ETB, and on the second creature entering each turn converts to a draw. (Note: Volo, Itinerant Scholar does NOT have Alliance.)

**Cohort:**
- Cohort requires both the Cohort creature and another Ally to tap. If you have 3 Cohort creatures but no other Allies, you can't use any of their Cohort abilities.
- Two Cohort creatures can tap each other as "the other Ally" — Ally A taps itself + Ally B, Ally B taps itself + Ally A. But each activation is separate, and after Ally A's activation taps Ally B, Ally B is now tapped and can't be used for Ally A's activation again until untap.
- Key cards: *Spawnbinder Mage* (OGW): "Cohort — {T}, Tap an untapped Ally you control: Tap target creature." Running two Spawnbinder Mages: first activation taps both, second Mage's cohort now has no target. Only one activation per pair of Allies per turn.
- Cohort doesn't trigger on combat damage or attacks — it's an activated ability that you use at sorcery speed (unless it says "any time you have priority"). Check individual card text; some Cohort abilities specify timing.

**Coven:**
- Coven is hardest to maintain because pumping your own creatures can accidentally break it. Giving a +1/+1 counter to a creature can equalize two creatures' powers, disabling coven.
- The cleanest coven setup is having naturally different base powers: a 1-power, 2-power, and 3-power creature.
- Shapeshifters and power-setting effects can disable coven — if Sublime Archangel gives all creatures +X/+0, suddenly many creatures may share the same modified power.
- Key card: *Sigarda, Champion of Light* (MID): "Humans you control get +1/+1. Coven — Whenever Sigarda attacks, if you control three or more creatures with different powers, look at the top five cards of your library. You may reveal a Human creature card from among them and put it into your hand." Sigarda herself has coven as an attack trigger — the bonus fires when Sigarda attacks and coven is active.
- Key card: *Liesa, Forgotten Archangel* (MID): Does NOT have Coven. She has flying and lifelink, and her triggered abilities return nontoken creatures you control from the GY to hand at end of turn, and exile opponent creatures that die instead. She is a recursion engine but not a Coven card.

## Canonical Examples

**Alliance:**
- *Rumor Gatherer*: Scries 1 on each creature ETB; on the second creature entering that turn, draws a card instead. Rewards flooding the board with creatures.
- *Celebrity Fencer* (Streets of New Capenna): "Alliance — Whenever another creature you control enters, put a +1/+1 counter on this creature." Grows with each creature ETB. (Note: Lae'zel, Vlaakith's Champion does NOT have Alliance.)

**Cohort:**
- *Spawnbinder Mage* (OGW): "Cohort — {T}, Tap an untapped Ally you control: Tap target creature." Two-Ally tap to tap a blocker. (Note: Kor Entanglers has Rally, not Cohort.)

**Coven:**
- *Sigarda, Champion of Light* (MID): Flagship coven card. Gives Humans +1/+1 and has a coven attack trigger to find Human cards.
- *Katilda, Dawnhart Prime*: "Humans you control have '{T}: Add one mana of any color.'" Non-coven, but illustrates Human synergy that intersects with coven decks.

## Commonly Confused With

- **P451** (Eminence/Battalion/Raid) — Battalion requires exactly 3+ attackers this combat; Alliance triggers on any creature ETB; both are creature-count matters but different conditions
- **P448** (Ninjutsu) — Ninjutsu creatures entering attacking don't trigger "whenever a creature enters the battlefield" — wait, actually they DO enter the battlefield, so Alliance DOES trigger for ninjutsu creatures entering attacking
- **P441** (Mutate) — Mutating a creature doesn't trigger Alliance because the mutating spell's creature doesn't "enter" the battlefield as a new object; it merges with the existing permanent
- **P452** (Enrage/Ferocious/Formidable) — Ferocious checks for 4+ power creature; Formidable checks for 8+ total power; Coven checks for 3+ distinct power values — all are power-based conditions but measuring different things
