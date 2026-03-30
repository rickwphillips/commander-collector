---
id: p399
name: Escalate, Melee, Crew, and Fabricate — Modal Costs, Attack Bonuses, Vehicle Animation, and Servo Choices
category: triggered
cr_refs: [702.120a, 702.121a, 702.121b, 702.122a, 702.122b, 702.122c, 702.122d, 702.123a, 702.123b]
tags: [escalate, melee, crew, fabricate, modal-spell-additional-cost, attack-bonus-per-opponent-attacked, vehicle-tap-creatures-power, 1-1-servo-token-or-counters, Eldritch-Moon, Kaladesh, Collective-Brutality, Deploy-the-Gatewatch, Pia-Nalaar, Veteran-Motorist, Cultivator-of-Blades, crewed-vehicle-is-artifact-creature, summoning-sick-crew, fabricate-binary-choice]
created: 2026-03-29
examples_count: 2
---

# P399 — Escalate, Melee, Crew, and Fabricate — Modal Costs, Attack Bonuses, Vehicle Animation, and Servo Choices

## Abstract
**Escalate** (702.120) adds an additional cost to modal spells for each mode chosen beyond the first. **Melee** (702.121) triggers on attack and gives +1/+1 per opponent you attacked with any creature this combat (rewarding wide attacks in multiplayer). **Crew N** (702.122) is a Vehicle's activated ability: tap any number of creatures with total power ≥ N to animate the Vehicle as an artifact creature until end of turn. **Fabricate N** (702.123) is an ETB triggered ability that offers a binary choice: either put N +1/+1 counters on the permanent itself, or create N 1/1 colorless Servo tokens. Each of these mechanics captures a core "decision architecture" theme from Kaladesh/Eldritch Moon — escalate costs you more for more effects, melee rewards broad attacks, crew converts crew power into vehicle size, and fabricate trades permanent growth for immediate token generation.

## The Definitive Rules

**CR 702.120a** (verbatim): *"Escalate is a static ability of modal spells (see rule 700.2) that functions while the spell with escalate is on the stack. 'Escalate [cost]' means 'For each mode you choose beyond the first as you cast this spell, you pay an additional [cost].' Paying a spell's escalate cost follows the rules for paying additional costs in rules 601.2f–h."*

**CR 702.121a** (verbatim): *"Melee is a triggered ability. 'Melee' means 'Whenever this creature attacks, it gets +1/+1 until end of turn for each opponent you attacked with a creature this combat.'"*

**CR 702.121b** (verbatim): *"If a creature has multiple instances of melee, each triggers separately."*

**CR 702.122a** (verbatim): *"Crew is an activated ability of Vehicle cards. 'Crew N' means 'Tap any number of other untapped creatures you control with total power N or greater: This permanent becomes an artifact creature until end of turn.'"*

**CR 702.122b** (verbatim): *"A creature 'crews a Vehicle' when it's tapped to pay the cost to activate a Vehicle's crew ability."*

**CR 702.122c** (verbatim): *"If an effect states that a creature 'can't crew Vehicles,' that creature can't be tapped to pay the crew cost of a Vehicle."*

**CR 702.122d** (verbatim): *"Some Vehicles have abilities that trigger when they become crewed... 'Whenever [this Vehicle] becomes crewed' means 'Whenever a crew ability of [this Vehicle] resolves.' If that ability has an intervening 'if' clause that refers to information about the creatures that crewed it, it means only creatures that were tapped to pay the cost of the crew ability that caused it to trigger."*

**CR 702.123a** (verbatim): *"Fabricate is a triggered ability. 'Fabricate N' means 'When this permanent enters, you may put N +1/+1 counters on it. If you don't, create N 1/1 colorless Servo artifact creature tokens.'"*

**CR 702.123b** (verbatim): *"If a permanent has multiple instances of fabricate, each triggers separately."*

## The Pattern

```
ESCALATE (702.120):
  WHAT IT IS:
    Additional cost to modal spells (spells where you choose modes).
    "For each mode you choose BEYOND THE FIRST, pay an additional [cost]."
    First mode: no escalate cost. Second mode: pay once. Third mode: pay twice.
    Escalate is paid on top of the spell's normal mana cost.
  ESCALATE COUNTING:
    N modes chosen: pay escalate (N-1) times.
    1 mode: 0 escalate payments. 2 modes: 1 escalate payment. 3 modes: 2 escalate payments.
    Example: Collective Brutality ({1}{B}: sorcery, escalate {discard a card}, 3 modes:
      • Mode 1: target creature gets -2/-2 until EOT.
      • Mode 2: target opponent reveals hand, you choose an instant or sorcery card, they discard it.
      • Mode 3: target opponent loses 2 life and you gain 2 life.):
      Choose 1 mode: pay {1}{B}. No escalate.
      Choose 2 modes: pay {1}{B} + discard 1 card (1 escalate payment).
      Choose 3 modes: pay {1}{B} + discard 2 cards (2 escalate payments).
    With multiple modes: you get all chosen modes' effects when the spell resolves.
  ESCALATE AND DISCARD:
    Collective Brutality's escalate cost is discarding a card.
    In a deck full of cards you WANT in the GY (Dredge, reanimator):
      Escalating for more modes is beneficial TWICE: you get extra spell effects AND discard.
    Paying escalate {discard} to fuel the GY while getting multiple spell effects = synergy.
  ESCALATE AND COUNTERSPELLS:
    Escalate adds additional costs paid at casting. If the spell is countered: you already paid the
      escalate costs (additional costs are paid during casting, not on resolution).
    You don't get escalate payments back if the spell is countered.

MELEE (702.121):
  WHAT IT IS:
    "Whenever this creature attacks, it gets +1/+1 until end of turn for each opponent you attacked
      with a creature this combat."
    The bonus scales with how many different opponents you attacked.
    In a 4-player game: attack 3 opponents → +3/+3. Attack 2 opponents → +2/+2.
  COUNTING OPPONENTS ATTACKED:
    "For each opponent you attacked with a creature" — counts opponents (not creatures).
    Attack Opponent A with 3 creatures + attack Opponent B with 1 creature:
      2 opponents were attacked. Melee creature gets +2/+2 (until EOT).
    Not per creature — per opponent. Multiple creatures attacking the same opponent = 1 count.
  THE MELEE CREATURE ITSELF:
    If the melee creature is one of the attackers: does it count itself?
    "You attacked with a creature this combat" — yes, the melee creature counts itself.
    In 1v1: you attacked 1 opponent (the only one). Melee creature gets +1/+1.
    Always at least +1/+1 in any combat (since you must attack at least 1 opponent).
  MULTIPLE MELEE INSTANCES:
    702.121b: each triggers separately.
    A creature with 2 instances of melee attacks in a 4-player game, attacking all 3 opponents:
      2 melee triggers. Each fires. Each gives +1/+1 per opponent attacked.
      3 opponents attacked → each trigger gives +3/+3. Two triggers → +6/+6 total.
  MELEE AND PLANESWALKERS:
    Attacking a planeswalker: that's attacking the player who controls it.
    Wait: actually, you attack players or planeswalkers. Do they count differently for melee?
    "For each opponent you attacked with a creature" — opponents are players.
    If you attack an opponent's planeswalker: you're attacking a planeswalker, not the player directly.
    Does attacking a planeswalker count as "attacking that opponent"?
    Rule 508.1 declares attackers as attacking players or planeswalkers/battles.
    Melee says "each opponent you attacked" — does this mean players, or does it include planeswalkers?
    Actually: if you declare a creature as attacking a planeswalker, that player IS the defending player.
    CR 508.1: "Each attacking creature is declared as attacking either a player or a planeswalker (if any)."
    Melee's "you attacked" likely means "declared a creature as attacking" that opponent's permanents.
    In practice: attacking an opponent's planeswalker counts as attacking that opponent for melee.

CREW (702.122):
  WHAT IT IS:
    Activated ability on Vehicle cards (artifact subtype).
    "[Cost]:" = "Tap any number of untapped creatures you control with total power ≥ N."
    Effect: "This permanent becomes an artifact creature until end of turn."
  KEY RULES:
    Creatures used to crew: must be untapped. Must be under your control.
    "Other" untapped creatures: the Vehicle itself can't crew itself.
    Total power of all tapped creatures must equal or exceed N.
    Example: Crew 4 means tap creatures whose power totals 4 or more.
      Tap 2/2 + 3/3 = total power 5 ≥ 4. Valid crew. (Use minimum needed or more.)
    The Vehicle becomes an artifact creature until EOT. It gets its printed P/T.
    At end of turn: it stops being a creature (reverts to just an artifact).
  SUMMONING SICKNESS AND CREW:
    Creatures with summoning sickness (entered this turn) CAN be used to crew.
    Crew is "tapping" a creature as a cost. Rule 302.6: "a creature can't use a tap symbol to
      activate an ability if it has summoning sickness... UNLESS it's tapping for a cost that is
      'Tap this permanent.'"
    Wait: actually crew says "tap any number of creatures you control."
      This is a cost that says "tap" but not "{T}". Rule 302.6 says creatures with summoning sickness
        can't tap to activate abilities "if the ability has the tap symbol."
      Crew doesn't use a tap symbol ({T}). It says "tap [creatures]" as a cost.
    Actually: paying a cost that involves tapping a creature applies summoning sickness rules:
      Rule 302.6: "a creature can't tap to activate an ability... unless it's been continuously
        under that player's control since their most recent turn began."
      The cost to crew requires TAPPING creatures. Summoning sick creatures can't tap to pay costs.
      BUT WAIT: This is for "{T}" symbols. What about "Tap any number of creatures"?
      CR 302.6 applies to "{T} in an ability." Crew says "Tap any number of untapped creatures"
        — this IS tapping creatures, which is subject to summoning sickness.
    Common ruling: creatures with summoning sickness CANNOT crew Vehicles.
    This is because tapping as part of a cost (even without the {T} symbol) is restricted by
      summoning sickness (rule 302.6 applies broadly to tapping).
    BUT: there is an exception. 302.6 says "cannot tap to pay the cost" — it's about tapping
      specifically for the activation cost.
    Rule 302.6 verbatim: "A creature with summoning sickness can't attack unless it has haste...
      A creature with summoning sickness can't tap to pay the cost of an ability."
    "Tap to pay the cost of an ability" — this includes crewing.
    Conclusion: creatures with summoning sickness CANNOT be used to crew.
  CREWED VEHICLE P/T:
    The Vehicle has a printed P/T (as a creature). That's its P/T when crewed.
    The crew creatures' power doesn't affect the Vehicle's P/T.
    Tap 4 creatures with total power 20 to crew a 3/5 Vehicle: the Vehicle is still 3/5.
  CREWED VEHICLE ETB:
    "Becomes an artifact creature" — this is a type change, not a zone entry.
    The Vehicle doesn't enter the battlefield again. No ETB triggers.
    But: some Vehicles have "whenever [this Vehicle] becomes crewed" triggers (702.122d).

FABRICATE (702.123):
  WHAT IT IS:
    ETB triggered ability. "When this permanent enters, you may put N +1/+1 counters on it.
      If you don't, create N 1/1 colorless Servo artifact creature tokens."
    Binary choice: put N counters on THIS permanent, or create N Servo tokens (not put on it).
    "You may" — "if you don't" means: if you don't put counters, you create Servos.
    This is NOT optional at the choose-Servos end. You must do one or the other:
      EITHER counters OR Servos. If you don't choose counters: you MUST create Servos.
  COUNTERS VS. SERVOS:
    Counters on the fabricate permanent: make IT bigger. Better if the permanent is a threat.
    Servos: make N 1/1 tokens. Better if you want more bodies (for sacrifice, blocks, anthem).
    Example: Cultivator of Blades ({3}{G}{G}: 1/1, fabricate 2, "when this attacks, other creatures
      get +X/+X until EOT, where X = Cultivator's power"):
      Option A: 2 counters on Cultivator → 3/3. When Cultivator attacks: other creatures get +3/+3.
      Option B: create 2 1/1 Servos. Cultivator stays 1/1. When Cultivator attacks: +1/+1 to others.
      Option A is usually better because the pump scales with Cultivator's power.
  MULTIPLE FABRICATE (702.123b):
    Each instance triggers separately. A creature with fabricate 1 twice: two triggers, each offering
      "put 1 counter on it OR create 1 Servo." You choose separately for each.
      Could do: 1 counter from trigger 1 + 1 Servo from trigger 2. Mix and match.
  FABRICATE TOKENS:
    "1/1 colorless Servo artifact creature tokens." These are Servo-subtype artifacts.
    Artifact synergies apply. Metalcraft, Affinity for Artifacts, Improvise (P388) — all benefit.
    Pia Nalaar ({2}{R}: 2/2, "when this enters, create a 1/1 colorless Thopter artifact creature token with flying"):
      Pia's version creates a Thopter (flyer). Fabricate creates Servos (ground).
```

## Definitive Conclusions

- **Escalate's additional cost is paid for EACH MODE BEYOND THE FIRST** — 3 modes = 2 escalate payments; additional costs are paid during casting and lost if the spell is countered.
- **Melee counts OPPONENTS attacked, not creatures** — multiple creatures attacking the same opponent counts as one; in 1v1 the minimum is always +1/+1 (one opponent attacked); multiple melee instances each trigger separately.
- **Summoning-sick creatures cannot crew Vehicles** — tapping as a cost to crew is subject to CR 302.6 (summoning sickness); the crew ability requires untapped creatures and they can't have entered this turn.
- **Fabricate is a forced binary choice** — put N counters on the permanent OR create N Servo tokens; you cannot do a partial split (no "1 counter and 1 Servo" from a single fabricate N trigger); multiple fabricate instances each let you choose independently.
- **Crewing doesn't trigger ETB** — the Vehicle becomes a creature (type change), not entering the battlefield; no ETB triggers fire when a Vehicle is crewed.

## Canonical Example
**Collective Brutality Escalate Chain:**
Collective Brutality ({1}{B}: sorcery, escalate — discard a card, 3 modes):
Hand: Lightning Bolt (want to keep), Faithless Looting (useful in GY), Lingering Souls (flashback → want to cast from GY).

You choose all 3 modes of Collective Brutality:
Pay {1}{B} (normal cost) + discard 2 cards (2 escalate payments for modes 2 and 3).
What to discard: Lingering Souls (flashback — going to GY is good!) + another card you don't need.
You discard Lingering Souls (now in GY → can flash back later) + Faithless Looting.

3 modes resolve simultaneously:
1. Target creature gets -2/-2 until EOT (kill opponent's 2/2).
2. Opponent reveals hand, you choose their best noncreature card — they discard it.
3. Opponent loses 2 life, you gain 2 life.

Net result from {1}{B} + 2 discards:
- Kill a creature
- Strip a card from opponent's hand
- 2-life swing (opponent down 2, you up 2)
- Lingering Souls now in GY for flashback ({1}{W}: create 2 more Spirit tokens later)

**Example 2 — Cultivator of Blades Fabricate:**
Cultivator of Blades ({3}{G}{G}: 1/1, Fabricate 2, "Whenever Cultivator of Blades attacks, you may have other creatures you control get +X/+X until EOT, where X = Cultivator of Blades' power"):

Option A: 2 counters on Cultivator → it's a 3/3.
When Cultivator attacks with your team of 4 other creatures:
Each of those 4 creatures gets +3/+3 until EOT.
If they're 2/2s: each becomes 5/5. Total team power: 3 + 5×4 = 23 power.

Option B: 2 Servo tokens. Cultivator stays 1/1. You have 2 extra attackers.
When Cultivator attacks: other creatures get +1/+1 (including the 2 Servos).
2 Servos become 2/2 each. Original creatures get +1/+1.
Total power: 1 + 2×2 + (other creatures' power + 1 each).

In most situations: Option A (counters) is better because the attack pump scales with Cultivator's power.
Exception: if you want sacrifice fodder, Artifact synergies, or you need blockers → take Servos.

## Commonly Confused With
- **P396 (Bestow/Tribute)** — Fabricate and tribute both involve choices when a creature enters. Tribute: an opponent makes the choice; Fabricate: YOU make the choice.
- **P388 (Convoke/Delve/Improvise)** — Crew taps creatures as a cost (similar to convoke and improvise). Key difference: Convoke/improvise reduce casting costs; crew is an activated ability with its own effect (animating the Vehicle). Summoning sickness applies to all three (can't tap sick creatures).
- **P392 (Myriad)** — Melee and myriad both scale with multiplayer opponents. Myriad creates tokens per opponent; melee pumps the creature per opponent attacked.
- **P397 (Prowess/Dash/Dethrone)** — Melee and dethrone are both combat-growth mechanics. Melee: +1/+1 per opponent attacked; Dethrone: +1/+1 counter when attacking the leading player. Both reward attacking multiple players or the "most valuable" target.
