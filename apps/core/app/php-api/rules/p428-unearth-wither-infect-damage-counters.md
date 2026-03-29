---
id: p428
name: Unearth, Wither, and Infect — Damage as Counters and Exile-Replacement Death Mechanics
category: replacement
cr_refs: [702.84a, 702.80a, 702.80b, 702.80c, 702.90a, 702.90b, 702.90c, 702.90d, 702.90e, 120.3, 704.5c, 704.5g]
tags: [unearth, wither, infect, damage-as-counters, exile-instead-of-death, haste-from-unearth, end-step-exile, poison-counters, minus1-counters, persist-wither-interaction, undying-wither-interaction, regeneration-wither, lethal-damage-wither, Blightning, Plague-Stinger, Putrefax, Necroskitter, Devoted-Druid, wither-persist-loop, Phyrexia, Alara, Shadowmoor]
created: 2026-03-29
examples_count: 2
---

# P428 — Unearth, Wither, and Infect — Damage as Counters and Exile-Replacement Death Mechanics

## Abstract
**Unearth** (702.84) returns a creature from the GY temporarily with haste, exiling it at end of turn (or any time it would leave the battlefield). **Wither** (702.80) converts damage dealt to creatures into -1/-1 counters rather than marked damage. **Infect** (702.90) converts damage to players into poison counters AND damage to creatures into -1/-1 counters (the same as wither for creature damage). Key non-obvious interactions: (1) **unearth's exile-replacement applies to ALL zone changes** — if a spell would return the unearthed creature to your hand, it's exiled instead (not returned); (2) **wither/infect damage and regeneration** — wither places -1/-1 counters instead of damage; regeneration removes "damage marked on it" but since wither creates counters, not damage, regeneration removes 0 damage but the counters remain; (3) **wither + persist = persist can't fire if the creature already had a -1/-1 counter** before dying (the counter came from wither), turning off persist; (4) **infect + persist** creates an explicit soft interaction where infect sources can disable persist by landing a -1/-1 counter before the kill; and (5) **Necroskitter** ({2}{B}: 2/1 Hornet; wither; "whenever a creature an opponent controls with a -1/-1 counter is put into a graveyard, return it to the battlefield under your control") creates a powerful takeover with any wither/infect source.

## The Definitive Rules

**CR 702.84a** (verbatim): *"Unearth is an activated ability that functions while the card with unearth is in a graveyard. 'Unearth [cost]' means '[Cost]: Return this card from your graveyard to the battlefield. It gains haste. Exile it at the beginning of the next end step. If it would leave the battlefield, exile it instead of putting it anywhere else. Activate only as a sorcery.'"*

**CR 702.80a** (verbatim): *"Wither is a static ability. Damage dealt to a creature by a source with wither isn't marked on that creature. Rather, it causes that source's controller to put that many -1/-1 counters on that creature. See rule 120.3."*

**CR 702.80b** (verbatim): *"If an object changes zones before an effect causes it to deal damage, its last known information is used to determine whether it had wither."*

**CR 702.80c** (verbatim): *"The wither rules function no matter what zone an object with wither deals damage from."*

**CR 702.90b** (verbatim): *"Damage dealt to a player by a source with infect doesn't cause that player to lose life. Rather, it causes that source's controller to give the player that many poison counters."*

**CR 702.90c** (verbatim): *"Damage dealt to a creature by a source with infect isn't marked on that creature. Rather, it causes that source's controller to put that many -1/-1 counters on that creature."*

## The Pattern

```
UNEARTH (702.84a):
  ACTIVATED ABILITY (from GY, as a sorcery): "[cost]: Return this card from GY to battlefield.
    It gains haste. Exile at beginning of next end step. If it would leave battlefield, exile
    it instead of putting it anywhere else."

  TWO EXILE CLAUSES:
    1. "Exile it at the beginning of the next end step" — delayed trigger. At end step: exile.
    2. "If it would leave the battlefield, exile it instead of putting it anywhere else."

  CLAUSE 2 IS A REPLACEMENT EFFECT (covers ALL zone changes):
    Bounced by Unsummon: would go to hand → exile instead.
    Destroyed by Doom Blade: would go to graveyard → exile instead.
    Exiled by Path to Exile: would go to exile → goes to exile (already exile, no change).
    Tucked by Obliterate: would go to library → exile instead.
    Sacrificed via altar: would go to GY → exile instead.
    RESULT: an unearthed creature can NEVER return to hand, library, or GY.
      Once unearthed, it ALWAYS ends up in exile. The only question is WHEN.

  UNEARTH AND BLINK:
    Ephemerate on an unearthed creature: exile is what Ephemerate does (exile then return).
      "Exile it instead" — the creature goes to exile at step 1. Does it return from Ephemerate?
      Ephemerate creates a delayed trigger: "at the beginning of the next upkeep, return it."
      But the unearth replacement says "exile instead of putting it anywhere else." When
      Ephemerate tries to return it, the creature would enter the battlefield again — this is
      a different event than "leaving the battlefield." The creature already left (went to exile).
      The Ephemerate trigger fires: at next upkeep, return the creature from exile to battlefield.
      When it re-enters via Ephemerate: is it still "the unearthed creature"? Zone change = new
      object (CR 400.7). The new object isn't the unearthed object anymore. It doesn't have the
      unearth replacement effect (the old permanent had it; the new object doesn't).
      WAIT — the "if it would leave the battlefield" clause is a static ability granted to the
      creature while it's on the battlefield. When it leaves and re-enters (new object), the
      new object doesn't inherently have the replacement effect UNLESS it was re-unearthed.
      So: if Ephemerate on an unearthed creature returns it to the battlefield, the returned
      creature is a fresh object without the exile-on-leave replacement.
      The creature returned by Ephemerate stays on the battlefield permanently (not exiled at end step).
      EXCEPTION CAVEAT: The "exile at beginning of next end step" trigger — was that created for
      the OLD object? It's a delayed trigger. Delayed triggers track the specific permanent.
      When the permanent is a new object, the delayed trigger no longer tracks it.
      CONCLUSION: Ephemerate effectively "rescues" an unearthed creature from its exile deadline.
      The creature re-enters as a new permanent without the unearth's exile clause.

  UNEARTH AND HASTE:
    The creature gains haste from unearth. It can attack and use {T} abilities immediately.
    The haste is gained as part of unearth's effect — not from a triggered ability.
    When the creature is exiled at end step, haste is irrelevant (it's gone).

WITHER (702.80a):
  "Damage dealt to a creature by a source with wither isn't marked on that creature. Rather,
   it causes that source's controller to put that many -1/-1 counters on that creature."

  KEY DISTINCTIONS:
    Wither damage is NOT "marked damage." It's COUNTERS.
    This matters for:
      REGENERATION: "Regenerate [permanent]" removes all damage marked on it. But wither
        creates counters, not marked damage. Regeneration removes 0 damage from a wither-damaged
        creature — the -1/-1 counters remain.
        If a creature has regeneration and is being killed by wither damage: the creature
        regenerates (SBA: if lethal damage marked, destroy → regeneration prevents destruction
        by removing marked damage). But wait: if the damage is counters, does the creature even
        have "lethal damage marked"? With wither, the creature doesn't have marked damage at all.
        Instead, it has -1/-1 counters reducing its P/T.
        RESULT: wither reduces P/T. If P/T drops to 0 or below, SBA 704.5f fires ("creature
        with toughness ≤ 0 → put into GY"). Regeneration CANNOT prevent the 704.5f SBA
        (CR 704.5f explicitly states "Regeneration can't replace this event").
        So: if wither reduces a creature's toughness to 0 (via -1/-1 counters), regeneration
        can't save it. The creature dies via SBA 704.5f, not via "lethal damage."
      PERSIST AND WITHER:
        Persist fires if "it had no -1/-1 counters on it" when it dies.
        Wither puts -1/-1 counters on creatures.
        If a wither source puts a -1/-1 counter on a persist creature BEFORE it dies:
          the creature has a -1/-1 counter → persist DOES NOT FIRE when it dies.
        Wither sources can preemptively disable persist.
        STRATEGIC IMPLICATION: to kill a persist creature with wither and DENY the persist
          trigger: first deal 1 damage with wither (puts -1/-1 counter), then kill it.
          The -1/-1 counter from wither disables persist.
      UNDYING AND WITHER:
        Undying fires if "it had no +1/+1 counters on it" when it dies.
        Wither puts -1/-1 COUNTERS, not +1/+1 counters. Wither doesn't affect undying conditions.
        WAIT: wither creates -1/-1 counters. If the creature also has +1/+1 counters that cancel
          the -1/-1 (CR 122.3, from P419): the net effect could be 0 if the wither -1/-1 and
          an existing +1/+1 cancel. But if the creature had a +1/+1 counter from a previous
          undying trigger, a wither -1/-1 counter is placed → SBA: cancel both counters (P419).
          Now the creature has no +1/+1 counter. Undying CAN fire next death.
          Wither indirectly enables re-use of undying by canceling the +1/+1 counter!
      DAMAGE PREVENTION:
        Damage prevention effects (prevent the next N damage) can apply to wither damage.
        If you prevent 2 wither damage: those 2 points of damage are prevented. No -1/-1 counters
        from those 2 points. Damage prevention still works — it prevents the damage event,
        which in turn prevents the counter placement.

    WITHER AND LAST KNOWN INFO (702.80b):
      "If an object changes zones before an effect causes it to deal damage, its last known
       information is used to determine whether it had wither."
      If a wither creature is killed in response to a fight/damage effect: it dealt damage
        last known to have wither. The counters are still placed.

    WITHER FROM ANY ZONE (702.80c):
      "The wither rules function no matter what zone an object with wither deals damage from."
      Spells deal damage from the stack. If the spell has wither: damage to creatures = counters.
      Abilities that deal damage from objects with wither in the GY (Ophiomancer effects, etc.)
        would still apply wither.

INFECT (702.90b, 702.90c):
  DUAL FUNCTION:
    To players: damage doesn't cause life loss; instead: gives that many poison counters.
    To creatures: damage isn't marked; instead: puts that many -1/-1 counters on the creature.

  INFECT VS. WITHER FOR CREATURES:
    Both put -1/-1 counters on creatures instead of marked damage.
    The creature-damage portion is identical to wither (702.80 vs. 702.90c).
    The key difference: infect also affects players (poison counters instead of life loss).
    A creature with BOTH wither and infect: still puts -1/-1 counters on creatures (both say the
      same thing); still gives poison to players (infect only — wither only affects creatures).
    Multiple instances of wither/infect don't "double" the counters — the damage amount is the
      amount of counters placed, regardless of how many instances of these abilities the source has.

  POISON COUNTERS AND WINNING:
    CR 704.5c: "a player with 10 or more poison counters loses the game."
    SBA checked as usual. At 10 poison: lose. At 9: still alive.
    In Commander: same 10 poison rule applies by default.

  INFECT + PERSIST = SOFT COUNTER-DISABLE:
    Infect sources put -1/-1 counters on creatures. These can preemptively disable persist
      (same as wither above).
    In Modern Infect decks: creatures like Plague Stinger ({1}{B}: 1/1 Hornet; flying; infect)
      dealing damage to an opponent's persist creature gives it a -1/-1 counter. If that creature
      then dies, persist doesn't fire.

  NECROSKITTER INTERACTION:
    Necroskitter ({2}{B}: 2/1 Hornet; wither; "whenever a creature an opponent controls with a
      -1/-1 counter on it is put into a graveyard, return it to the battlefield under your control"):
    With any wither or infect source: damage to opponent's creatures places -1/-1 counters.
    When those creatures die (any cause — combat, removal, even just toughness reduced to 0):
      Necroskitter fires: STEAL the dead creature. Enters under YOUR control.
    This is particularly powerful: infect damage places -1/-1 counters while dealing poison,
      and then Necroskitter steals any creature that ever received infect damage.
    RECURSIVE STEALING: if the stolen creature has persist, it dies with a -1/-1 counter (from
      wither/infect), so persist doesn't fire. It just goes to GY. No recursion conflict.

DEVOTED DRUID INTERACTION:
  Devoted Druid ({1}{G}: 0/2; {T}: add {G}; "put a -1/-1 counter on Devoted Druid: untap it"):
  Devoted Druid's own ability puts -1/-1 counters on itself (as a cost to untap).
  Combine with Persist (Kitchen Finks + Devoted Druid example):
    Devoted Druid with wither: if something puts a -1/-1 counter on Devoted Druid, its toughness
    drops. SBA: if toughness ≤ 0, go to GY.
    With a counter-removal effect (Vizier of Remedies: prevent the -1/-1 counter that persist
    would place), Devoted Druid can generate infinite mana. See P419.
```

## Definitive Conclusions

- **Unearth's "exile instead" clause covers ALL zone changes** — a bounced unearthed creature goes to exile (not hand); a sacrificed one goes to exile (not GY); only Path to Exile sends it to exile without the replacement mattering.
- **Ephemerate can "rescue" an unearthed creature** — the creature exits to exile (from Ephemerate), then re-enters as a new object without the exile-at-end-step clause; the creature remains on the battlefield permanently.
- **Wither damage bypasses regeneration against toughness-reduction deaths** — wither creates -1/-1 counters, not marked damage; regeneration removes marked damage, leaving counters intact; if counters reduce toughness to ≤ 0, SBA 704.5f kills the creature and regeneration explicitly can't prevent 704.5f.
- **Wither/Infect landing a -1/-1 counter before a creature dies disables persist** — persist requires "no -1/-1 counters"; any -1/-1 counter from wither/infect prevents persist from triggering.
- **Wither/Infect can re-enable undying** — if an undying creature has a +1/+1 counter from its previous undying trigger, a wither/infect -1/-1 counter cancels it (SBA 122.3/P419), making undying trigger-eligible again.
- **Necroskitter combined with any wither/infect source steals any opponent's creature that received counters** — the trigger fires "whenever a creature with a -1/-1 counter is put into a graveyard," regardless of the kill cause.

## Canonical Example
**Wither vs. Persist creature:**
Opponent controls Kitchen Finks (3/2; persist; currently no counters — fresh). You control Necroskitter ({2}{B}: 2/1 wither; triggered steal ability) and Blightning ({1}{B}{R}: sorcery; "Blightning deals 3 damage to each opponent and... wither" — wait, Blightning doesn't have wither).

Use Cinderbones ({2}{B}: 2/1; wither; "{B}: regenerate Cinderbones") as the wither source.
Attack with Cinderbones. Opponent blocks with Kitchen Finks. Combat damage:
Cinderbones (wither) deals 2 damage to Kitchen Finks → 2 -1/-1 counters placed on Kitchen Finks.
Kitchen Finks (2 -1/-1 counters): toughness = 2-2 = 0. SBA 704.5f: toughness ≤ 0, put into GY.

Persist: "when this permanent is put into a graveyard, if it had no -1/-1 counters on it."
Kitchen Finks HAD 2 -1/-1 counters when it died. Persist DOES NOT FIRE.
Kitchen Finks goes to opponent's GY. It has -1/-1 counters on it when it dies (704.5g tracks this).

Necroskitter trigger: "whenever a creature an opponent controls with a -1/-1 counter is put into
  a graveyard" — Kitchen Finks had -1/-1 counters. Necroskitter fires!
Kitchen Finks returns to YOUR battlefield under YOUR control.

Net: wither disabled persist, Necroskitter stole the creature. Opponent lost Kitchen Finks entirely.

**Example 2 — Unearth + Ephemerate:**
Your GY: Hellspark Elemental ({1}{R}: 3/1 trample haste; "at end of turn, sacrifice it"; unearth {R}).
You unearth Hellspark Elemental: pay {R}. Returns as 3/1 with haste. "If it would leave the
  battlefield, exile it instead." "Exile it at beginning of next end step."

You cast Ephemerate ({W}) targeting Hellspark Elemental.
Ephemerate resolves: "exile target creature you control" — the unearth replacement fires:
  "if it would leave the battlefield, exile it instead" — this exile IS the replacement.
  Actually, Ephemerate's exile is a move-to-exile event. The unearth replacement says "exile it
  instead of putting it anywhere else." Ephemerate exiles it... to exile. The result is the same.
  The creature goes to exile.
Then: "return it to the battlefield" — Ephemerate's effect returns it.
Hellspark Elemental enters the battlefield as a NEW OBJECT (CR 400.7). No unearth properties.
It's just a 3/1 trample haste — permanently. No exile at end of turn (that applied to the
  old permanent, which is now a new object).

The "at end of turn, sacrifice it" on the card text: that's a triggered ability on the permanent.
Wait — "at the beginning of the end step, sacrifice it" is a triggered ability on Hellspark Elemental
(not from unearth — it's printed on the card). That trigger fires at end of turn.
So: Hellspark Elemental still gets sacrificed at end of turn (from its own printed ability).
But "sacrifice it" → goes to GY (the unearth replacement only applies to the OLD permanent's
  "leave the battlefield" events, not the new object's).
Actually — the "exile instead" was on the OLD permanent. The new permanent (after Ephemerate)
  doesn't have "exile instead." When the sacrifice trigger fires: goes to GY normally.

Then: you can UNEARTH AGAIN from the GY. Repeat next turn.

Lesson: Ephemerate on unearthed creature = new object (no exile replacement) + still has printed
  sacrifice text, but it returns to GY after being sacrificed, allowing another unearth.

## Commonly Confused With
- **P419 (Persist/Undying Counter Cancellation)** — P419 covers how +1/+1 and -1/-1 counters cancel via SBA, enabling infinite persist loops. P428 covers how wither/infect place those very -1/-1 counters, potentially disabling persist OR enabling counter cancellation that refreshes undying.
- **P420 (Evoke)** — Evoke sacrifice also involves exile for the pitch-evoke elementals; unearth also uses exile. But evoke's sacrifice is a triggered ability that exiles the creature as part of the trigger; unearth's exile is a replacement effect on any zone change. The mechanisms differ.
- **P012 (Blink — ETB Recurrence)** — Ephemerate on an unearthed creature is covered here. P012 covers general blink rules; P428 adds the unearth-specific nuance that the new object loses the exile-replacement.
- **P426 (Champion Exile Resets Counters)** — Both champion and unearth involve exile. Champion deliberately exiles to reset counters; unearth uses exile as a death replacement. Different purposes, same zone.
