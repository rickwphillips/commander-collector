---
id: p440
name: Mentor, Afflict, Ascend, and Afterlife — Combat Triggers and Death Replacement Checks
category: triggered
cr_refs: [702.134a, 702.134b, 702.130a, 702.130b, 702.131a, 702.131b, 702.131c, 702.131d, 702.135a, 702.135b, 608.2c, 704.5j]
tags: [mentor, afflict, ascend, afterlife, city-blessing, combat-damage, block-trigger, GY-trigger, exile-vs-GY, spirit-token, power-comparison, strictly-less-than, counter-on-attacker, Tajic-Legion-Edge, Ammit-Eternal, Merfolk-Mistbinder, ascend-permanent, afterlife-exile, Guilds-of-Ravnica, Hour-of-Devastation, Rivals-of-Ixalan]
created: 2026-03-29
examples_count: 2
---

# P440 — Mentor, Afflict, Ascend, and Afterlife — Combat Triggers and Death Replacement Checks

## Abstract
Four mechanics from Guilds of Ravnica, Hour of Devastation, and Rivals of Ixalan that interact with combat and death. **Mentor** (702.134) triggers when the creature attacks and places a +1/+1 counter on a target attacking creature with **strictly less** power — power must be less than mentor creature's power at targeting AND at resolution. **Afflict** (702.130) triggers when the creature **becomes blocked** (at declare blockers, before damage) — the defending player loses life regardless of whether any blocker survives. **Ascend** (702.131) gives a player the city's blessing permanently the moment they control 10+ permanents — the blessing can't be lost even if permanents fall below 10. **Afterlife** (702.135) creates Spirit tokens when the permanent is **put into a graveyard from the battlefield** — exile effects (Swords to Plowshares, Leyline of the Void replacement) do NOT trigger afterlife.

## The Definitive Rules

**CR 702.134a** (verbatim): *"Mentor is a triggered ability. 'Mentor' means 'Whenever this creature attacks, put a +1/+1 counter on target attacking creature with power less than this creature's power.'"*

**CR 702.130a** (verbatim): *"Afflict is a triggered ability. 'Afflict N' means 'Whenever this creature becomes blocked, defending player loses N life.'"*

**CR 702.131a** (verbatim): *"Ascend on an instant or sorcery spell represents a spell ability. It means 'If you control ten or more permanents and you don't have the city's blessing, you get the city's blessing for the rest of the game.'"*

**CR 702.131b** (verbatim): *"Ascend on a permanent represents a static ability. It means 'Any time you control ten or more permanents and you don't have the city's blessing, you get the city's blessing for the rest of the game.'"*

**CR 702.131c** (verbatim): *"The city's blessing is a designation that has no rules meaning other than to act as a marker that other rules and effects can identify. Any number of players may have the city's blessing at the same time."*

**CR 702.135a** (verbatim): *"Afterlife is a triggered ability. 'Afterlife N' means 'When this permanent is put into a graveyard from the battlefield, create N 1/1 white and black Spirit creature tokens with flying.'"*

## The Pattern

```
MENTOR (702.134a):
  "Whenever this creature attacks, put a +1/+1 counter on target attacking creature
   with power LESS THAN this creature's power."

  STRICTLY LESS THAN (not ≤):
    Mentor requires the target's power to be STRICTLY LESS THAN the mentor creature's power.
    Tajic, Legion's Edge (3/2; mentor): can mentor any attacking creature with power 0, 1, or 2.
    Cannot mentor a creature with power 3 (equal, not less than).
    Cannot mentor itself: its own power is equal to its own power — "less than" fails.

  CAN'T MENTOR ITSELF:
    "Target attacking creature with power less than this creature's power."
    This creature's power is equal to itself. A creature can't have power less than itself.
    Targeting itself would require: this creature's power < this creature's power (impossible).
    No self-mentoring.

  POWER CHECK AT TARGETING AND AT RESOLUTION (608.2c):
    The full "with power less than this creature's power" description is a targeting condition.
    Target is chosen when ability goes on the stack (at declare attackers).
    At resolution: if the target creature's power is no longer less than the mentor's power
      (pump effects, anthem effects, new counters), the target is now ILLEGAL.
    Illegal target at resolution → ability fails, no counter placed.
    Example: 3/3 mentor targets a 2/2 attacker. Opponent uses Giant Growth (+2/+2) on the
      targeted 2/2 in response. 2/2 becomes 4/4. At resolution: 4 is NOT less than 3.
      Target is illegal. Mentor ability does nothing.
    Conversely: the mentor creature's power decreasing below the target's power before
      resolution also makes the target illegal.

  MULTIPLE INSTANCES (702.134b):
    Two mentor instances on the same creature: two separate triggers.
    Each trigger separately chooses a target with power less than this creature's power.
    Can target different creatures (or the same legal creature twice).
    Target the same creature twice: it gets two +1/+1 counters.

AFFLICT (702.130a):
  "Whenever this creature becomes blocked, defending player loses N life."

  "BECOMES BLOCKED":
    Trigger fires at the declare blockers step, when this creature first becomes blocked.
    NOT "whenever this creature deals combat damage to a player" — afflict triggers on
      BLOCKING, not on damage.

  TIMING AND THE BLOCKING DECISION:
    Blocking is the trigger event. By the time the ability goes on the stack, the block
      has been declared. The defending player has already made the trade-off:
      "do I block (take N life loss) or not block (take the combat damage)?"
    Afflict N: don't block → take attack damage unblocked.
    Or: block → take N life loss + possibly trade/kill the creature.
    Against a 5/4 afflict 3: blocking costs 3 life PLUS your blocker may die.
    Not blocking costs 5 damage. Players must calculate whether blocking or not is better.

  AFFLICT TRIGGERS REGARDLESS OF BLOCKER SURVIVAL:
    The trigger fires when the creature BECOMES blocked. What happens to blockers later
    (before or during damage) doesn't change the afflict trigger.
    Opponent blocks with a 1/1. Afflict trigger fires: defending player loses 3 life.
    Even if the 1/1 blocker dies before damage: the life loss already triggered. No refund.
    Even if the afflict creature is bounced before damage: the trigger already fired.

  MULTIPLE AFFLICT (702.130b):
    Each instance triggers separately. Afflict 2 + afflict 3 on the same creature:
    two separate triggers when it becomes blocked → 5 life total (2 + 3).

ASCEND (702.131):
  ON PERMANENTS (702.131b):
    Static ability: continuously checks "do I control 10+ permanents AND not have city's blessing?"
    If both conditions are met: you immediately get the city's blessing.
    Once you have the city's blessing: you keep it FOREVER (for the rest of the game).
    Even if your permanent count drops below 10: the city's blessing remains.

  ON INSTANTS/SORCERIES (702.131a):
    Spell ability: when the spell resolves, check if you control 10+ permanents and lack blessing.
    If yes: you get the city's blessing as part of the spell's resolution.

  CITY'S BLESSING IS PERMANENT:
    "For the rest of the game" — no trigger or effect can remove it.
    No effect reads "you lose the city's blessing." It's a one-way door.
    Effects that say "if you have the city's blessing" check this permanent designation.
    Effects that grant city's blessing: don't grant it to someone who already has it (no effect).

  COUNTING PERMANENTS:
    All permanents: lands, creatures, artifacts, enchantments, planeswalkers, battles.
    Including tokens!
    When determining if you have 10: count all permanents you control at that moment.
    10 permanents includes: 5 lands + 3 creatures + 1 artifact + 1 enchantment = 10.
    Reaching 10 mid-combat (tokens created by triggers): if you now control 10+ and lack blessing,
      and you have an ascend permanent, you immediately get the city's blessing.

  AFTER GETTING BLESSING (702.131d):
    "After a player gets the city's blessing, continuous effects are reapplied before the
    game checks to see if the game state or preceding events have matched any trigger conditions."
    This ensures effects that care about city's blessing are properly applied immediately.

AFTERLIFE (702.135a):
  "When this permanent is put into a graveyard from the battlefield, create N Spirit tokens."

  "PUT INTO A GRAVEYARD" — NOT EXILE:
    Afterlife specifically requires the permanent to move to the GRAVEYARD from the battlefield.
    Exile effects: Swords to Plowshares, Path to Exile, Generous Gift (exile + Elk), etc.
      These send the permanent to exile, not GY. Afterlife does NOT trigger.
    Replacement effects that change GY-destination to exile:
      Leyline of the Void ("if a card would be put into an opponent's GY from anywhere, exile it instead"):
      The card is exiled instead of going to GY. Afterlife does NOT trigger.
    Phasing out, returning to hand, being bounced: not going to GY. Afterlife does NOT trigger.

  WHAT DOES TRIGGER AFTERLIFE:
    Lethal damage → destroyed → GY: afterlife triggers.
    "Destroy target creature": creature goes to GY → afterlife triggers.
    Sacrifice for a cost: sacrificed creature goes to GY → afterlife triggers.
    -X/-X effects reducing toughness to 0: GY via SBA → afterlife triggers.
    SBA 704.5f (toughness ≤ 0): goes to GY → afterlife triggers.
    Note: indestructible doesn't prevent going to GY via toughness ≤ 0 (704.5f applies even
      to indestructible creatures: "if a creature with toughness > 0 has lethal damage marked,
      it's destroyed" — but 704.5f says "with toughness 0 or less, put it into owner's GY"
      regardless of indestructibility).

  SACRIFICE + AFTERLIFE:
    Sacrificing a creature to pay a cost: it goes to GY. Afterlife triggers.
    Sacrificing for emerge, exploit, convoke sac, etc.: afterlife fires.
    This creates a useful interaction: sacrifice an afterlife creature for value, get Spirit tokens.
    Pitiless Pontiff ({W}{B}: "{1}, sacrifice another creature: gains deathtouch and indestructible"):
      Sacrifice an afterlife creature to Pontiff: that creature goes to GY, afterlife Spirit enters.
      Now you have a Spirit token AND an indestructible deathtouch Pontiff.

  MULTIPLE AFTERLIFE INSTANCES (702.135b):
    Each instance triggers separately. Afterlife 1 + afterlife 2 on the same permanent:
      death → two triggers → 1 Spirit token + 2 Spirit tokens = 3 Spirits total.
```

## Definitive Conclusions

- **Mentor requires strictly less power at both targeting AND resolution** — if a pump spell raises the target's power to equal or greater than the mentor creature's before resolution, the target becomes illegal and no counter is placed.
- **Mentor can't target itself** — a creature can't have power strictly less than its own power.
- **Afflict triggers at declare blockers, not at damage** — life loss is locked in when the creature becomes blocked; bouncing the attacker or killing the blocker afterward doesn't refund the life.
- **City's blessing is permanent once gained** — dropping below 10 permanents doesn't remove it; it's a one-way designation for the rest of the game.
- **Afterlife does NOT trigger when the permanent is exiled** — Swords to Plowshares, Leyline of the Void replacement, and any other "exile from battlefield" effect skips afterlife entirely; only going to the graveyard triggers it.
- **Sacrificing an afterlife creature still triggers afterlife** — sacrificed creatures go to the graveyard; afterlife fires; you can get Spirit tokens while sacrificing for costs or synergy effects.

## Canonical Example
**Tajic, Legion's Edge + Mentor interaction with pump:**
Tajic (3/2; mentor) attacks alongside your 2/2 Knight token.
Mentor triggers: "put a +1/+1 counter on target attacking creature with power less than 3."
You target the 2/2 Knight token.
Opponent responds with Titanic Growth (+4/+4 targeting another creature, not the Knight).
Wait — if the opponent can't pump the Knight but can pump a different 3/3 attacker you have:
You now have a 7/7 alongside. Mentor targets the Knight (power 2 < 3 = valid target).
Trigger resolves: Knight gets +1/+1 counter, becomes 3/3.
But the 7/7: can it mentor the same Knight (power 2 < 7)? Yes, if the 7/7 also had mentor.

Now: opponent uses Giant Growth on the mentor TARGET before resolution.
2/2 Knight is targeted by Giant Growth in response to mentor trigger: becomes 6/6.
At mentor trigger resolution: is 6 less than 3? No. Target is illegal. Mentor does nothing.

**Example 2 — Afterlife + Leyline of the Void:**
You control several afterlife creatures. Opponent controls Leyline of the Void ({2}{B}{B}:
  "if a card would be put into an opponent's graveyard from anywhere, exile it instead").

Your creatures die (combat damage, opponent's removal).
Leyline replaces "put into GY" with "exile instead."
Afterlife: "when this permanent is put into a graveyard from the battlefield."
The permanents go to exile, not GY. The trigger condition is never met. No Spirit tokens.

Compare: same situation WITHOUT Leyline. Your afterlife 2 Guildmage dies: goes to GY.
Afterlife trigger fires: create 2 1/1 white and black Spirit creature tokens with flying.

Strategic implication: Leyline of the Void is a hard counter to afterlife. If you're building
around afterlife, watch for Leyline in the opponent's deck.

## Commonly Confused With
- **P428 (Wither/Infect)** — Mentor places +1/+1 COUNTERS on attacking creatures; wither damage places -1/-1 counters. Both use counters to track power changes. The counter interactions (P428: wither disabling persist) also apply after mentor grants +1/+1 counters — a persist creature mentored twice gets 2 +1/+1 counters; when it dies and gets a -1/-1 counter from persist, the +1/+1 counters cancel (each +1/+1 cancels a -1/-1).
- **P429 (Exalted)** — Exalted and mentor both trigger on attacking. Exalted triggers when a creature attacks ALONE (P429); mentor triggers when this specific creature attacks (regardless of how many creatures attack). Both are combat-declaration triggers.
- **P435 (Bestow sacrifice interaction)** — Afterlife only fires when going to the GY; bestow Auras falling off also raise questions about zone movement. Both mechanics require care about the exact zone the permanent ends up in.
- **P434 (Myriad)** — Myriad creates tokens that are exiled at end of combat; afterlife triggers when permanents go to the GY. If a myriad token with afterlife is created and then exiled at end of combat: the token is EXILED (not put into GY); afterlife does NOT trigger for the myriad token. The myriad tokens are exiled, bypassing afterlife.
