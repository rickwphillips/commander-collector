---
id: p028
name: Simultaneous ETB — Newcomers See Each Other
category: triggered
cr_refs: [603.6a, 603.2c, 603.3b]
tags: [ETB, enters-the-battlefield, simultaneous, newcomers, cathars-crusade, soul-warden, panharmonicon, trigger-count, APNAP]
created: 2026-03-28
examples_count: 3
---

# P028 — Simultaneous ETB — Newcomers See Each Other

## Abstract
When a single event places multiple permanents onto the battlefield simultaneously, all permanents on the battlefield — including the new arrivals themselves — are checked for ETB triggers matching that event. This means each newcomer "sees" all other newcomers enter. A permanent with "whenever another creature enters" triggers once per other creature that entered in the same event. A permanent with "whenever a creature enters" triggers once per creature in the event, including for its own arrival. This has major practical consequences: abilities like Cathars' Crusade, Soul Warden, and Warstorm Surge scale differently against simultaneous entries vs. sequential entries.

## The Definitive Rule

**CR 603.6a** (verbatim): *"Enters-the-battlefield abilities trigger when a permanent enters the battlefield. These are written, 'When [this object] enters, . . .' or 'Whenever a [type] enters, . . .' Each time an event puts one or more permanents onto the battlefield, all permanents on the battlefield (including the newcomers) are checked for any enters-the-battlefield triggers that match the event."*

**CR 603.2c** (verbatim): *"An ability triggers only once each time its trigger event occurs. However, it can trigger repeatedly if one event contains multiple occurrences."*
**CR 603.2c example**: *"A permanent has an ability whose trigger condition reads, 'Whenever a land is put into a graveyard from the battlefield, . . .' If someone casts a spell that destroys all lands, the ability will trigger once for each land put into the graveyard during the spell's resolution."*

**CR 603.3b**: Multiple simultaneously triggered abilities are placed on the stack in APNAP order. Each player places their triggers in the order they choose.

## The Pattern

```
EVENT: N permanents enter the battlefield simultaneously
  (from a single effect: token creation, Living Death, Collected Company resolving, etc.)

CHECK: All permanents on the battlefield (including all N newcomers) are checked
       for ETB triggers matching the event.

TRIGGER COUNT for each trigger condition:
  "Whenever a creature enters" (no "another"):
    - Fires for EACH creature entering, including self
    - A newcomer with this ability triggers N times (including once for itself)
    - An existing permanent with this ability triggers N times

  "Whenever ANOTHER creature enters":
    - Fires for each OTHER creature entering, excluding self
    - A newcomer with this ability triggers N-1 times (for each other newcomer)
    - An existing permanent with this ability triggers N times (all newcomers are "another")

PRACTICAL CONSEQUENCE — Cathars' Crusade:
  Sequential entries (N=5, one at a time):
    5th creature enters → 1 trigger fires → +1/+1 on all creatures
    4th creature enters → 1 trigger → +1/+1 on all
    3rd → +1/+1 on all; 2nd → +1/+1 on all; 1st → +1/+1 on all
    Result per creature: varies (creature 1 saw 4 triggers; creature 5 saw 0)
    Each of the 5 new creatures gets: 4, 3, 2, 1, 0 counters respectively
    (plus counters from pre-existing creatures, if any)

  Simultaneous entry (N=5, all at once):
    5 triggers fire simultaneously → APNAP order on stack
    Each trigger resolves: "+1/+1 on EACH creature you control" (all 5 newcomers present)
    Result: each of the 5 creatures gets 5 +1/+1 counters
    Simultaneous entry is strongly preferred for Cathars' Crusade strategies

MUTUAL TRIGGER BETWEEN NEWCOMERS:
  A and B both enter simultaneously, both have "whenever another creature enters, deal 1 damage"
    → A's trigger fires for B entering (1 damage)
    → B's trigger fires for A entering (1 damage)
    → 2 damage total, from a single simultaneous entry event
    (Compare: if A already existed when B entered, only B's trigger fires for A being there
     before entry — wait, that's reversed. A's trigger fires for B entering regardless.)

NOTE ON "ANOTHER" SELF-EXCLUSION:
  Soul Warden text: "Whenever another creature enters the battlefield, you gain 1 life."
  Soul Warden does NOT trigger when it itself enters — "another" excludes self
  But the token it creates (if any) entering IS another creature

  A hypothetical "Whenever a creature enters, gain 1 life" WOULD trigger for its own entry
  The word "another" is the specific self-exclusion; without it, self-entry triggers.
```

## Definitive Conclusions

- **Newcomers see each other enter.** Any permanent entering simultaneously with others sees each of them enter (and can trigger ETB abilities for each).
- **"Another" excludes self.** A newcomer's "whenever another creature enters" doesn't fire for its own arrival, but fires for every other simultaneous newcomer.
- **"A creature" (no another) includes self.** A newcomer's "whenever a creature enters" fires for its own arrival, triggering once for itself and once per each other simultaneous newcomer.
- **Simultaneous entry multiplies Cathars' Crusade counters vs. sequential entry.** 5 entering simultaneously → each gets 5 counters. Sequential → 4, 3, 2, 1, 0.
- **Soul Warden sees all simultaneous newcomers.** If you create 5 tokens at once, Soul Warden triggers 5 times for 5 life. It does NOT gain life for its own ETB.
- **Multiple newcomers with mutually-triggering ETBs create a web.** N creatures with "whenever another creature enters" generate N×(N-1) total trigger instances between all newcomers.
- **Multiple Panharmonicons are ADDITIVE, not multiplicative.** Two Panharmonicons cause ETB triggers to fire 3 times (base 1 + 1 + 1), not 4. Three Panharmonicons: 4 times. Each "triggers an additional time" adds 1, they don't multiply. Same applies to multiple Yaroks. (Gatherer ruling 2021-03-19: "If you control two Panharmonicons, an artifact or creature entering the battlefield causes abilities to trigger three times, not four.")
- **You don't need to control the permanent entering — only the permanent with the trigger.** Panharmonicon doubles ETB triggers of YOUR permanents even when your OPPONENT'S artifact or creature enters. (Gatherer ruling 2021-03-19)
- **Triggers are placed on the stack in APNAP order** (CR 603.3b). Each player orders their own triggers. Active player's triggers go on the stack first (meaning they resolve last, as LIFO).

## Canonical Example
**Parallel Lives + 5 token-creating spell (Entreat the Angels for X=5):**
Entreat the Angels creates 5 Angel tokens simultaneously. Parallel Lives doubles that: 10 Angels enter at once. Soul Warden is already on the battlefield. Soul Warden triggers 10 times (once per Angel). You gain 10 life.

If each Angel also had "whenever another creature enters the battlefield, put a +1/+1 counter on this creature," each Angel would trigger 9 times (once for each of the other 9 Angels). That's 90 total trigger instances from a single event — each Angel ultimately gaining 9 +1/+1 counters.

**Example 2 — Cathars' Crusade with Living Death (mass reanimate):**
Living Death puts 8 creatures onto the battlefield simultaneously. Cathars' Crusade fires 8 times. When each trigger resolves, all 8 creatures you control are present. Each of the 8 triggers puts +1/+1 on each of the 8 creatures. Result: every creature enters with 8 +1/+1 counters. This is far more powerful than reanimating them one at a time.

**Example 3 — Two ETB-trigger creatures entering simultaneously:**
You cast Collected Company, hitting Panharmonicon and Fierce Empath (a creature with "when this enters, search for a creature card with power 5 or greater"). Both enter simultaneously. Panharmonicon has "if an artifact or creature entering the battlefield causes a triggered ability of an artifact or creature you control to trigger, that ability triggers an additional time." The question is: does Fierce Empath's ETB trigger twice because Panharmonicon entered simultaneously? Panharmonicon's doubling applies to ETB triggers — but Panharmonicon's doubling is a static ability that's been in play since it entered. Since both entered simultaneously, Panharmonicon IS on the battlefield when the check happens (CR 603.6a: including newcomers). Yes — Fierce Empath's ETB triggers twice.

## Commonly Confused With
- **P005 (Simultaneous Event Ordering)** — P005 covers the APNAP ordering of multiple triggers from a simultaneous event. P028 covers WHETHER the triggers fire at all (do newcomers see each other?). The two patterns combine: newcomers see each other (P028) → multiple triggers result → placed in APNAP order (P005).
- **P009 (Zone-Change Trigger Race)** — P009 covers the situation where a creature dies AND triggers simultaneously (persist vs. undying racing). P028 is about entry, not death.
- **P006 (Intervening If Clause)** — Some ETB triggers have "if" conditions (Cathars' Crusade doesn't, but others do). The simultaneous entry question (P028) is separate from the intervening-if double-check (P006), but both can apply to the same trigger.
