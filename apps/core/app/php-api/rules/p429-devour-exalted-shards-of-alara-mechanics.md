---
id: p429
name: Devour and Exalted — Shards of Alara ETB Sacrifice and Solo-Attack Mechanics
category: triggered
cr_refs: [702.82a, 702.82b, 702.82c, 702.83a, 702.83b, 506.5]
tags: [devour, exalted, ETB-sacrifice, solo-attack, attacks-alone, multiple-exalted, devour-0-is-legal, devour-token-loop, Godsire, Mycoloth, Progenitus, Noble-Hierarch, Rafiq-of-the-Many, Battlegrace-Angel, double-strike-exalted, devour-trigger-vs-ETB, attacks-alone-definition, vigilance-attacks-alone, Shards-of-Alara]
created: 2026-03-29
examples_count: 2
---

# P429 — Devour and Exalted — Shards of Alara ETB Sacrifice and Solo-Attack Mechanics

## Abstract
**Devour** (702.82) lets a permanent enter with extra +1/+1 counters by sacrificing creatures as it enters. **Exalted** (702.83) gives a creature a +1/+1 bonus until end of turn whenever it attacks alone. Key non-obvious interactions: (1) **devour's sacrifice is an ETB replacement** — it happens AS the permanent enters, not after; creatures sacrificed to devour can't have ETBs fire that would prevent devour from happening; (2) **you may sacrifice 0 creatures to devour** — it's "you may" and the minimum is 0; (3) **devour N means N counters per creature**, not N counters total; (4) **multiple exalted abilities all stack** — if three permanents have exalted and one creature attacks alone, it gets +3/+3 (one trigger per exalted instance); (5) **"attacks alone" is defined per combat phase** — a creature attacks alone if it's the only attacker; (6) **Rafiq of the Many** gives the attacking creature double strike, which stacks with exalted; and (7) vigilance creatures that attack alone still get the exalted bonus (vigilance doesn't change "attacks alone" status).

## The Definitive Rules

**CR 702.82a** (verbatim): *"Devour is a static ability. 'Devour N' means 'As this object enters, you may sacrifice any number of creatures. This permanent enters with N +1/+1 counters on it for each creature sacrificed this way.'"*

**CR 702.82b** (verbatim): *"Some objects have abilities that refer to the number of creatures the permanent devoured. 'It devoured' means 'sacrificed as a result of its devour ability as it entered the battlefield.'"*

**CR 702.82c** (verbatim): *"Devour [quality] is a variant of devour. 'Devour [quality] N' means 'As this object enters, you may sacrifice any number of [quality] permanents. This permanent enters with N +1/+1 counters on it for each permanent sacrificed this way.'"*

**CR 702.83a** (verbatim): *"Exalted is a triggered ability. 'Exalted' means 'Whenever a creature you control attacks alone, that creature gets +1/+1 until end of turn.'"*

**CR 702.83b** (verbatim): *"A creature 'attacks alone' if it's the only creature declared as an attacker in a given combat phase. See rule 506.5."*

## The Pattern

```
DEVOUR (702.82a):
  "As this object enters, you may sacrifice any number of creatures. This permanent enters
   with N +1/+1 counters on it for each creature sacrificed this way."

  DEVOUR IS AN ETB REPLACEMENT ("as...enters"):
    CR 614.1c/d: "as [permanent] enters" effects are replacement effects.
    Devour happens AS the permanent enters, simultaneously with the entering event.
    This is NOT a triggered ability ("when enters") — it's part of the entering event itself.
    CONSEQUENCE: the devoured creatures are sacrificed BEFORE any ETB triggers fire.
      Wait — more precisely: the sacrifice happens AS PART OF entering. The devour creature
      doesn't yet exist as a permanent when devour is applied (it's entering).
      The creatures sacrificed to devour: their sacrifice happens while the devour permanent
      is entering the battlefield (not before, not after — simultaneously).
      Any ETBs from the devour permanent only fire AFTER it's on the battlefield.
      The devoured creatures are already gone before other ETBs fire.

  HOW MANY COUNTERS:
    Devour N = N counters PER CREATURE SACRIFICED.
    Sacrifice 3 creatures to Devour 2 = 6 counters.
    Sacrifice 0 creatures: 0 counters. The permanent enters normally with no counters.
    "May sacrifice any number" = the minimum is 0. Devour is optional.

  CAN YOU SACRIFICE CREATURES YOU JUST CREATED VIA THE DEVOUR PERMANENT'S ETB?
    No — the devour permanent itself isn't on the battlefield yet when devour is applied
      (it's part of the entering event). Its own ETB hasn't fired.
    You can only sacrifice creatures that are ALREADY on the battlefield before the
      devour permanent enters.

  DEVOUR AND TOKENS:
    Can you sacrifice tokens? Yes — tokens are creatures you control.
    Sacrifice tokens to devour: the tokens go to GY immediately (devour sacrifice).
    Tokens sacrifice to devour = count for devour counters.
    SYNERGY: create tokens, then sacrifice them to a devour creature for a large counter total.
    Mycoloth ({3}{G}{G}: 4/4; devour 2; "at beginning of upkeep, create X 1/1 Saproling tokens
      where X is Mycoloth's power"):
    You sacrifice 5 Saproling tokens to Mycoloth: enters with 10 +1/+1 counters (Devour 2 × 5).
    Mycoloth: 14/14. Upkeep: create 14 Saproling tokens. Next devour cycle: sacrifice 14 tokens
      → even bigger Mycoloth. Exponential scaling.

  DEVOUR AND "AS [PERMANENT] ENTERS" CHOICES:
    Devour happens during the "as ... enters" window. Other "as enters" replacements also apply
    at this time. They're applied in whatever order the controller chooses (614.12).
    If multiple ETB replacements need to be applied: controller chooses order.

  DEVOUR AND RETURNING TO HAND:
    If a devour creature is bounced and re-enters: the devour happens again (new entering event).
    You may sacrifice creatures again for new counters.
    The old counters: if the creature was bounced (went to hand), it returns as a new object
      with no counters from previous devour (counters don't follow zone changes, CR 122.2).

  DEVOUR AND SACRIFICE TRIGGERS:
    When you sacrifice creatures to devour, "when this permanent leaves the battlefield" and
    "when this creature dies" triggers fire for each sacrificed creature.
    Sacrifice a creature with persist to devour: persist triggers (goes to GY, had no -1/-1
      counter). The persist trigger puts the creature back on the battlefield with a -1/-1 counter.
    So: you "sacrifice" a persist creature to devour, it comes back (persist), devour gets
      the counter for the sacrifice, AND you have the persist creature back on the board.
    This is powerful but requires the persist creature to enter without a -1/-1 counter.
    If it has persist and no counter: sacrifice to devour → persist returns it with -1/-1 counter.
    Next time you can't sacrifice it to devour (it has a -1/-1 counter... actually you can still
      sacrifice it; devour will count it. Persist WON'T fire again (has -1/-1 counter)).

EXALTED (702.83a):
  "Whenever a creature you control attacks alone, that creature gets +1/+1 until end of turn."

  ATTACKS ALONE (702.83b, CR 506.5):
    "A creature attacks alone if it's the only creature declared as an attacker in a given
     combat phase."
    During the declare attackers step, if you declare only ONE creature as an attacker:
      that creature "attacks alone."
    If you declare multiple attackers: no creature attacks alone. No exalted triggers.
    This is checked at the moment of declaration. If you declare 1 attacker, exalted fires;
      even if that creature is removed before damage.

  MULTIPLE EXALTED:
    Each instance of exalted is a separate triggered ability.
    If 3 permanents you control have exalted and a creature attacks alone:
      3 separate exalted triggers fire. EACH puts +1/+1 on the attacking creature.
      Total: +3/+3 for the one creature.
    Example: Noble Hierarch ({G}: 1/1 Exalted; {T}: add {G/W/U}); you have 3 copies of
      Noble Hierarch. One creature attacks alone: +3/+3 until end of turn.
    STACKING: many exalted sources stack cumulatively.
      Rafiq of the Many ({1}{G}{W}{U}: 3/3; exalted; "whenever a creature attacks alone,
        it gains double strike until EOT") adds exalted trigger + double strike.
      With Rafiq + 2 Noble Hierarchs + Rhox War Monk (exalted too):
        Creature attacks alone: +4/+4 (4 exalted triggers) + double strike from Rafiq's other ability.

  VIGILANCE AND EXALTED:
    A creature with vigilance doesn't tap when attacking. Does it still "attack alone"?
    YES — "attacks alone" means only one creature is declared as an attacker.
    Vigilance doesn't affect declaration. The creature is still the only attacker.
    Exalted triggers. The vigilance creature doesn't tap and gets +1/+1 from exalted.

  EXALTED SOURCE ≠ MUST BE THE ATTACKER:
    Exalted says "whenever A creature you control attacks alone, THAT CREATURE gets +1/+1."
    The creature with exalted doesn't have to be the attacker.
    Noble Hierarch attacks alone: Hierarch gets +1/+1 from its own exalted.
    Your 10/10 attacks alone: Noble Hierarch's exalted triggers, 10/10 gets +1/+1.
    The exalted creature provides the buff to WHICHEVER CREATURE attacks alone.

  EXALTED IN MULTIPLAYER:
    In multiplayer: "creatures you control" includes all your creatures.
    "Attacks alone" — in multiplayer, you may attack multiple opponents simultaneously.
    Attacking player declares attackers (which can be split across opponents).
    If attacking one opponent with ONE creature: that creature attacks alone (against that opponent).
    But in multiplayer, "the only creature declared as an attacker in a given combat phase" means
      ONE total creature attacking across all opponents. Not "one per player."
    So: attacking Player A with one creature and Player B with another = 2 attackers declared.
      Neither attacks alone. No exalted triggers.

  EXALTED AND DOUBLE STRIKE:
    Rafiq of the Many: "whenever a creature you control attacks alone, it gains double strike
      until end of turn." This is a SEPARATE triggered ability from Rafiq's exalted trigger.
    Two triggers from Rafiq's attack alone event: (1) exalted: +1/+1; (2) double strike.
    Combined: the solo attacker has double strike AND +1/+1 (plus any other exalted stacking).
    With double strike, the creature deals damage in BOTH first strike and regular damage steps.
    Exalted triggers only once (not per damage step).
```

## Definitive Conclusions

- **Devour is an ETB replacement, not a triggered ability** — the sacrifice happens AS the permanent enters; you can only sacrifice creatures already on the battlefield (not from an ETB the devour permanent itself would generate); the devoured creatures are gone before any ETBs fire.
- **Devour N means N counters per creature** — sacrifice 4 creatures to Devour 3 = 12 counters; you may sacrifice 0 creatures (minimum).
- **Sacrificing persist creatures to devour gets you the counter AND the creature back** — persist triggers when the devoured creature goes to GY (no -1/-1 counter on it); it returns with a -1/-1 counter; devour still counted it.
- **Multiple exalted instances each trigger separately and stack** — three permanents with exalted = +3/+3 when a creature attacks alone; each trigger is independent.
- **"Attacks alone" is board-wide** — the only attacker in the combat phase; vigilance creatures can still attack alone; multiple attackers (even across different opponents in multiplayer) prevent any from attacking alone.
- **The exalted-holding permanent doesn't need to be the attacker** — Noble Hierarch untapped, giving another creature the exalted bonus while Noble Hierarch taps for mana, is a common Bant play.

## Canonical Example
**Mycoloth + Saproling Sacrifice (Devour scaling):**
You control: 5 Saproling tokens (1/1 each). Cast Mycoloth ({3}{G}{G}: 4/4; devour 2; "at beginning
  of upkeep, create X 1/1 Saproling tokens where X = Mycoloth's power").

As Mycoloth enters: devour triggers. You may sacrifice any creatures.
Sacrifice all 5 Saprolings: Mycoloth enters with 5 × 2 = 10 +1/+1 counters.
Mycoloth: 14/14.

The 5 Saprolings go to GY. They don't have persist/undying so nothing recursion happens.
Next upkeep: create X Saproling tokens where X = Mycoloth's power = 14.
Create 14 Saproling tokens. You now have 14 1/1 creatures.

Next cycle (if you bounce and replay Mycoloth or sacrifice it and reanimate):
Sacrifice 14 Saprolings: 14 × 2 = 28 counters. Mycoloth 32/32. Creates 32 Saprolings next upkeep.

Persist interaction: if your tokens had persist (e.g., Kitchen Finks proxy in a hypothetical):
Sacrifice persist creature (no -1/-1 counter) to devour: persist fires, creature returns with
  -1/-1 counter. You got the devour counter for that creature AND kept the creature.
Next time: sacrifice same creature (now has -1/-1 counter). Persist WON'T fire. Creature lost.

**Example 2 — Exalted Stacking with Rafiq:**
Your creatures: Rafiq of the Many (3/3; exalted; "solo attacker gains double strike"), Noble
  Hierarch (1/1; exalted; {T}: {G/W/U}), Rhox War Monk (3/4; lifelink; exalted), Elspeth Knight-
  Errant emblem giving all your creatures +3/+3... wait, simplified:

You control: Rafiq of the Many + 2 Noble Hierarchs + Rhox War Monk. All have exalted.
4 permanents with exalted total.

You attack alone with Rafiq (3/3).
4 exalted triggers fire (one per exalted source):
  Trigger 1 (Rafiq's exalted): Rafiq gets +1/+1 → 4/4.
  Trigger 2 (Noble Hierarch 1's exalted): Rafiq gets +1/+1 → 5/5.
  Trigger 3 (Noble Hierarch 2's exalted): Rafiq gets +1/+1 → 6/6.
  Trigger 4 (Rhox War Monk's exalted): Rafiq gets +1/+1 → 7/7.
Rafiq's "attacks alone" additional trigger: Rafiq gains double strike.

Rafiq attacks as 7/7 with double strike.
First strike damage: 7 damage to blocker/opponent.
Regular damage: 7 more damage.
Total: 14 damage from a "3/3" creature.

## Commonly Confused With
- **P418 (Graft/Modular/Bloodthirst/Sunburst)** — Devour and graft both put +1/+1 counters on permanents as they enter, but differently. Devour uses a sacrifice cost (ETB replacement); graft moves counters from one permanent to another via triggered ability. Devour's "as it enters" vs. graft's "whenever another creature enters" timing differs.
- **P005 (Simultaneous Deaths/APNAP)** — Multiple exalted triggers fire simultaneously (one per exalted source). They go on the stack in APNAP order. The attacking player controls all their exalted triggers; they resolve in the chosen order, each adding +1/+1.
- **P419 (Persist/Undying Counter Cancellation)** — Sacrificing persist creatures to devour is a subtle interaction: devour gets the counter, persist fires and returns the creature. Combined with counter cancellation from P419 (Melira removes -1/-1 counters), you could sacrifice persist creatures to devour infinitely.
- **P429 cross-reference with P422 (Changeling)** — Devour sacrifices "any number of creatures." Changeling creatures are legal devour fodder (they're creatures). No special interaction, just a usage note.
