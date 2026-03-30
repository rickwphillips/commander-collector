---
id: p426
name: Champion Exile Resets Persist/Undying Counters — Exile Is Not Death, Zone Change Removes Counters
category: zones
cr_refs: [702.72a, 702.79a, 702.88a, 400.7, 122.2, 704.5q]
tags: [champion, persist, undying, exile-is-not-death, zone-change-counter-reset, counter-removal, new-object, Kitchen-Finks, Glen-Elendra-Archmage, Cloudthresher, Wren's-Run-Packmaster, persist-reset, undying-reset, champion-exile, graveyard-vs-exile, deliberate-reset, Melira, Shadowmoor-combo]
created: 2026-03-29
examples_count: 2
---

# P426 — Champion Exile Resets Persist/Undying Counters — Exile Is Not Death, Zone Change Removes Counters

## Abstract
When Champion (702.72) exiles a creature, that creature does NOT die — it goes to exile, not the graveyard. **Persist** (702.79a) and **Undying** (702.88a) both specifically trigger on "put into a graveyard from the battlefield." Since champion exiles the creature (not to the GY), neither persist nor undying triggers. The deeper non-obvious consequence: when the championed creature is returned to the battlefield (when the champion permanent leaves), it returns as a **new object** with no memory of its prior state (CR 400.7) — including **no counters** (CR 122.2). A persist creature that had already triggered persist once (and was on the battlefield with a -1/-1 counter from its return) loses that counter when championed and returned. The counter reset effectively "refreshes" a used-up persist creature: it can persist again on its next death. This is a deliberate and repeatable strategy with champion creatures that can exile any creature type (or with Changeling champions).

## The Definitive Rules

**CR 702.79a** (verbatim): *"Persist is a triggered ability. 'Persist' means 'When this permanent is put into a graveyard from the battlefield, if it had no -1/-1 counters on it, return it to the battlefield under its owner's control with a -1/-1 counter on it.'"*

**CR 702.88a** (verbatim): *"Undying is a triggered ability. 'Undying' means 'When this permanent is put into a graveyard from the battlefield, if it had no +1/+1 counters on it, return it to the battlefield under its owner's control with a +1/+1 counter on it.'"*

**CR 702.72a** (verbatim): *"Champion represents two triggered abilities. 'Champion an [object]' means 'When this permanent enters, sacrifice it unless you exile another [object] you control' and 'When this permanent leaves the battlefield, return the exiled card to the battlefield under its owner's control.'"*

**CR 400.7** (verbatim excerpt): *"An object that moves from one zone to another becomes a new object with no memory of, or relation to, its previous existence. There are eight exceptions to this rule..."* [none of the exceptions cover counters persisting through zone changes for champion]

**CR 122.2**: Counters on permanents cease to exist when the permanent leaves the battlefield (they are not preserved through zone changes unless a specific rule states otherwise).

## The Pattern

```
THE KEY DISTINCTION — EXILE IS NOT THE GRAVEYARD:
  Persist triggers: "put into a graveyard from the battlefield."
  Undying triggers: "put into a graveyard from the battlefield."
  BOTH require the GRAVEYARD as the destination zone.
  Champion exiles the permanent. Exile ≠ Graveyard.
  RESULT: When champion exiles a persist/undying creature, NEITHER PERSIST NOR UNDYING FIRES.
  The creature sits in exile. It doesn't return. It waits until champion leaves.

  COMPARE:
    Destruction (Doom Blade): creature goes to graveyard. Persist/undying FIRES.
    Sacrifice (Viscera Seer): creature goes to graveyard. Persist/undying FIRES.
    Bounce (Unsummon): creature goes to hand. Persist/undying DOES NOT FIRE (hand ≠ GY).
    Exile (Champion): creature goes to exile. Persist/undying DOES NOT FIRE.
    Champion and bounce both bypass persist/undying — different zones.

CHAMPION EXILE AS A COUNTER RESET:
  Scenario: Kitchen Finks ({1}{G/W}{G/W}: 3/2; persist; "when it enters, you gain 2 life")
  Game state: Kitchen Finks died once, triggered persist, returned to battlefield with -1/-1
    counter (now effectively 2/1, no lifelink due to -1/-1 counters reducing stats, and the
    -1/-1 counter prevents FUTURE persist triggers).
  Problem: Kitchen Finks can no longer trigger persist again (it has a -1/-1 counter).

  SOLUTION via Champion:
    Cast Changeling Titan ({4}{G}: 7/7; champion a creature).
    Changeling Titan has Champion a creature. Kitchen Finks is a creature.
    Changeling Titan enters: champion ETB fires. You exile Kitchen Finks (champion it).
    Kitchen Finks goes to exile. The -1/-1 counter... is on the exile card? No.
    When a permanent leaves the battlefield, counters on it cease to exist (CR 122.2).
    The -1/-1 counter disappears. Kitchen Finks is just "Kitchen Finks" in exile (a card).
  Later: Changeling Titan leaves the battlefield (destroyed, bounced, etc.).
    "Return the exiled card to the battlefield under its owner's control" — Kitchen Finks returns.
    Kitchen Finks enters the battlefield as a NEW OBJECT (CR 400.7). No counters. ETB fires.
    Gain 2 life from the ETB.
    Kitchen Finks is now a fresh 3/2 with persist ready to trigger again on its next death.

  NET EFFECT: Champion "refreshed" persist. The -1/-1 counter was erased by the zone change.
    If Kitchen Finks dies again, persist triggers (no -1/-1 counter on it anymore).
    This is REPEATABLE: if the champion creature can be repeatedly blinked/returned, Kitchen
      Finks gets persistent "refreshes" of its persist counter.

PRACTICAL APPLICATIONS:
  1. DELIBERATE RESET:
     Use champion to intentionally "save" a persist creature that's about to die while it
       already has its -1/-1 counter. Champion it, then let the champion die → creature
       returns with persist ready.
  2. OPPONENT'S CHAMPION:
     If an opponent's champion exiles your persist creature (they chose yours as the champion
       target), your creature is in exile without persist triggering. When opponent's champion
       leaves, your creature returns — but as a fresh object. Potential benefit if your
       creature had accumulated counters you don't want (though normally you'd want persist
       to work, not be suppressed).
  3. BLINK LOOPS WITH CHAMPION:
     Repeatedly blinking a champion creature (P421): champion leaves → creature returns fresh
       → champion re-enters → exiles creature again → creature in exile (counter-free) → repeat.
     Each cycle: the championed persist creature gets its counter wiped.
     This is expensive (blink cost each cycle) but enables infinite persist loops with a
       sacrifice outlet:
       Champion exiles Kitchen Finks (counter-free). Champion gets blinked.
       Kitchen Finks returns (fresh). Champion re-enters, exiles Finks again.
       Finks dies to sacrifice outlet BEFORE being championed → persist triggers.
       Actually: you need to sacrifice Finks BEFORE the champion exiles it. More complex.
       See the Kitchen Finks + Melira combo (P419) for the simpler infinite.

UNDYING PARALLEL:
  Same principle applies to undying. Undying triggers on "put into a graveyard from the battlefield,
    if it had no +1/+1 counters."
  Champion exiles an undying creature: undying doesn't trigger. Creature in exile has no counter.
  When champion leaves: undying creature returns as new object, no +1/+1 counter.
  Undying can trigger again on its next death.
  UNDYING "RESET": an undying creature that had already triggered undying once (now has +1/+1
    counter, so further undying is disabled) can be "reset" by champion exile:
    Champion exiles it (counter disappears in exile). Champion leaves. Creature returns clean.
    Next death: undying triggers again.

PERSIST + UNDYING ASYMMETRY:
  Persist enters with a -1/-1 counter after returning. This HURTS the creature (reduced P/T).
  Undying enters with a +1/+1 counter after returning. This HELPS the creature (increased P/T).
  Champion reset for persist: intentionally beneficial (creature returns better — same P/T
    as original, plus persist ready to fire again).
  Champion reset for undying: potentially beneficial (creature returns at normal P/T, not boosted)
    but less impactful since the undying boost was often desirable.
  For undying, the champion reset LOSES the bonus +1/+1 counter gained from the undying trigger.
  Trade-off: re-enabling undying vs. losing the counter boost.

CHAMPION + PERSIST COUNTER-CANCELLATION (P419 connection):
  P419 covers how Graft (+1/+1 counters move to persist creatures) cancels the -1/-1 counter
    via SBA, enabling multiple persist cycles.
  Champion provides an ALTERNATIVE reset method: instead of counter cancellation via Graft,
    use champion exile to directly erase the counter via zone change.
  Comparison:
    Graft approach (P419): complex setup, requires Graft permanent in play, counter cancellation
      via SBA. Works in combat when the creature is on the battlefield.
    Champion approach (P426): requires champion creature, two ETB events, and timing.
      Champion exiles (zone change → no counter). Champion leaves → fresh creature.
  Both achieve "persist reset" through different mechanisms.
```

## Definitive Conclusions

- **Champion exile doesn't trigger persist or undying** — both require "put into a graveyard"; champion sends the creature to exile instead; the trigger condition isn't met.
- **The championed creature returns as a new object with no counters** — CR 400.7 (zone change = new object) and CR 122.2 (counters disappear on zone change) combine to erase all counters; a persist creature with a -1/-1 counter loses it.
- **Champion effectively resets persist/undying** — a creature that has already used persist (and has its disabling -1/-1 counter) returns from champion exile without that counter; persist can trigger again on its next death.
- **The reset is symmetric** — undying creatures that have a +1/+1 counter from undying lose that counter when championed; they re-enter at base P/T but with undying re-enabled.

## Canonical Example
**Changeling Titan + Kitchen Finks — Persist Reset:**
Kitchen Finks (3/2; persist; "ETB: gain 2 life") has already died and returned via persist, so it's on the battlefield as a 2/1 with a -1/-1 counter. Persist will NOT fire if it dies again.

You cast Changeling Titan ({4}{G}: 7/7; champion a creature).
Champion ETB fires: exile a creature you control. Exile Kitchen Finks.
Kitchen Finks enters exile. The -1/-1 counter on it ceases to exist (CR 122.2). Finks in exile: just a card.

Later: opponent casts Wrath of God, destroying all creatures including Changeling Titan.
Changeling Titan's "leaves battlefield" champion trigger fires: "return the exiled card to the battlefield."
Kitchen Finks returns to the battlefield as a NEW OBJECT. ETB fires: gain 2 life.
Kitchen Finks: 3/2 with persist. No -1/-1 counter (new object). Persist is ready again.

If Kitchen Finks now dies: persist triggers (no -1/-1 counter). Returns with -1/-1 counter.
You gained an extra persist trigger by routing Kitchen Finks through champion exile.

Note: Neither persist (Kitchen Finks didn't go to GY when exiled) nor the -1/-1 counter transferred
(it ceased to exist in exile). Champion provided a clean "reset."

**Example 2 — Glen-Elendra Archmage + Champion:**
Glen-Elendra Archmage ({3}{U}: 2/2 Faerie Wizard; persist; "{T}, sacrifice Glen-Elendra Archmage: counter target noncreature spell") has already persisted once — it's on the battlefield with -1/-1 counter as a 1/1. Persist won't fire again if it dies.

Cast a creature with "champion a Faerie" (e.g., Mistbind Clique — {3}{U}: 4/4; champion a Faerie).
Champion ETB: exile Glen-Elendra Archmage. Counter disappears in exile.

Mistbind Clique is used or removed. Glen-Elendra returns: fresh 2/2, no counter, persist ready.
You have restored Glen-Elendra's full counterspell + persist cycle.

This is a powerful line in Faerie tribal: use Mistbind Clique's champion to protect AND reset
Glen-Elendra when it would otherwise be "dead" from the persist counter perspective.

## Commonly Confused With
- **P419 (Persist/Undying Counter Cancellation)** — P419 covers using Graft (+1/+1 counters) to cancel persist's -1/-1 counter via SBA, enabling multiple persist cycles. P426 covers champion exile as an alternative reset method via zone change. Both achieve "persist reset" but through different mechanisms.
- **P421 (Champion/Hideaway)** — P421 covers champion's general rules (linked abilities, blink interactions, token championing). P426 is specifically the persist/undying interaction with champion's exile effect.
- **P003 (Zone Change Object Identity)** — The fundamental rule that zone changes create new objects is the root cause of the counter reset. Any zone change (bounce, blink, champion, tucking to library) erases counters. Champion's exile is one instance of this general principle.
- **P412 (Mutate + Persist)** — P412 covers how mutate piles interact with persist: only the persist card returns, without the pile. P426 covers how champion exile bypasses persist/undying entirely and resets the counter.
