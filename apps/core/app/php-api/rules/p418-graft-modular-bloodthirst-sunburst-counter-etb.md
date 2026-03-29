---
id: p418
name: Graft, Modular, Bloodthirst, and Sunburst — Counter-Based ETB Mechanics and Counter Transfer
category: triggered
cr_refs: [702.58a, 702.58b, 702.43a, 702.43b, 702.54a, 702.54b, 702.54c, 702.44a, 702.44b, 702.44c, 702.44d]
tags: [graft, modular, bloodthirst, sunburst, counter-transfer, +1/+1-counters, enters-with-counters, Simic-Ravnica, Mirrodin-Darksteel, Ravager-Affinity, Arcbound-Ravager, Arcbound-Worker, Walking-Ballista, Rakshasa-Deathdealer, Grizzly-Fate, graft-move-timing, modular-chain, sunburst-colors-not-mana-amounts, bloodthirst-any-damage]
created: 2026-03-29
examples_count: 2
---

# P418 — Graft, Modular, Bloodthirst, and Sunburst — Counter-Based ETB Mechanics and Counter Transfer

## Abstract
These four mechanics all use **+1/+1 counters entering with permanents** but in distinct ways. **Graft** (702.58) enters with N +1/+1 counters and can move them to new entering creatures. **Modular** (702.43) enters with N +1/+1 counters and transfers them to an artifact creature when it dies. **Bloodthirst** (702.54) enters with N +1/+1 counters if an opponent was dealt damage this turn. **Sunburst** (702.44) enters with +1/+1 counters equal to the number of different colors of mana spent to cast it. The non-obvious interactions include: Graft triggers on ANY creature entering (including opponents'); Modular transfer is OPTIONAL and must target at the time the trigger resolves; Bloodthirst checks if an opponent was dealt damage (even 0 damage from a prevented hit doesn't count); and Sunburst counts COLORS not amounts (spending GGGG still gives only 1 counter, not 4).

## The Definitive Rules

**CR 702.58a** (verbatim): *"Graft represents both a static ability and a triggered ability. 'Graft N' means 'This permanent enters with N +1/+1 counters on it' and 'Whenever another creature enters, if this permanent has a +1/+1 counter on it, you may move a +1/+1 counter from this permanent onto that creature.'"*

**CR 702.43a** (verbatim): *"Modular represents both a static ability and a triggered ability. 'Modular N' means 'This permanent enters with N +1/+1 counters on it' and 'When this permanent is put into a graveyard from the battlefield, you may put a +1/+1 counter on target artifact creature for each +1/+1 counter on this permanent.'"*

**CR 702.54a** (verbatim): *"Bloodthirst is a static ability. 'Bloodthirst N' means 'If an opponent was dealt damage this turn, this permanent enters with N +1/+1 counters on it.'"*

**CR 702.54b** (verbatim): *"'Bloodthirst X' is a special form of bloodthirst. 'Bloodthirst X' means 'This permanent enters with X +1/+1 counters on it, where X is the total damage your opponents have been dealt this turn.'"*

**CR 702.44a** (verbatim): *"Sunburst is a static ability that functions as an object is entering the battlefield. 'Sunburst' means 'If this object is entering as a creature, ignoring any type-changing effects that would affect it, it enters with a +1/+1 counter on it for each color of mana spent to cast it. Otherwise, it enters with a charge counter on it for each color of mana spent to cast it.'"*

**CR 702.44b** (verbatim): *"Sunburst adds counters only if the object with sunburst is entering the battlefield from the stack as a resolving spell and only if one or more colored mana was spent on its costs, including additional or alternative costs."*

## The Pattern

```
GRAFT (702.58a):
  WHAT IT IS:
    Static: enters with N +1/+1 counters.
    Triggered: "Whenever another creature enters, if this permanent has a +1/+1 counter,
      you may move a +1/+1 counter from this permanent onto that creature."
  KEY POINTS:
    Triggers on ANY creature entering — including opponents' creatures.
    You may choose to move a counter to an opponent's creature.
    This is rare but can have value: move a counter to an opponent's creature that will die
      later (Modular interaction!) or pass on the trigger.
    You must have a counter on the graft creature to even make the choice.
    If the graft creature has no +1/+1 counters: the triggered ability doesn't trigger
      (the condition "if this permanent has a +1/+1 counter" gates the trigger).
    Moving the counter is optional. You may choose not to.
    GRAFT + COUNTER MATTERS:
      Graft permanent has N counters. Each new creature arriving: potential counter move.
      You can distribute counters to build multiple strong creatures or keep them centralized.
      Counter movement is one-at-a-time: one trigger = move one counter.
      Multiple graft creatures: multiple triggers per entering creature.

MODULAR (702.43a):
  WHAT IT IS:
    Static: enters with N +1/+1 counters.
    Triggered: "When this permanent is put into a graveyard from the battlefield, you may
      put a +1/+1 counter on TARGET ARTIFACT CREATURE for each +1/+1 counter on this permanent."
  KEY POINTS:
    Targets an artifact creature. Not just any creature.
    The target is chosen when the trigger resolves.
    Number of counters transferred = how many were on the modular artifact AT THE TIME
      OF TRANSFER (when the trigger resolves).
    If the modular artifact gained extra counters before dying: those all transfer.
    MODULAR CHAINS:
      Arcbound Ravager ({2}: 0/0 artifact creature; "you may sacrifice an artifact: put a
        +1/+1 counter on Arcbound Ravager"; modular 1):
      Sacrifice an artifact creature to Ravager → that artifact's modular trigger fires →
        transfer its counters to Ravager → Ravager grows → sacrifice Ravager to itself?
        Wait: Ravager can sacrifice artifacts, not itself. But if Ravager is targeted for
        removal: in response, sacrifice artifacts to Ravager → Ravager has many counters →
        when Ravager dies (to the removal): all counters transfer to ANOTHER artifact creature.
      Classic play: with multiple artifact creatures, when one is removed, save the counters.
      Example: Arcbound Ravager has 5 +1/+1 counters. Opponent targets it with removal.
        In response: activate Ravager: sacrifice another artifact, adding a counter (6 total).
        Ravager dies: modular trigger fires. Transfer 6 +1/+1 counters to a target artifact creature.
        Choose: Arcbound Worker (which you have as a 1/1 + 6 = 7/7 after counters).
    OPTIONAL TRANSFER:
      The transfer is optional ("you may put"). If no valid target (no artifact creature in play):
        the trigger is still placed on the stack but fizzles (no target possible, or you just
        choose not to transfer — if you choose not to, the counters are simply lost when the
        artifact goes to the GY).
    MODULAR AND EXILE:
      Modular triggers on "put into a graveyard from the battlefield."
      If exiled instead: modular doesn't trigger. Counters are lost.
      This is like soulshift (P406): only triggers on GY death.

BLOODTHIRST (702.54a):
  WHAT IT IS:
    Static ability during ETB.
    "If an opponent was dealt damage this turn, this permanent enters with N +1/+1 counters."
  KEY POINTS:
    "Was dealt damage" — doesn't matter how much. Even 1 damage to an opponent satisfies it.
    "This turn" — from any source: combat, spell, ability, opponent's own effects.
    Doesn't matter if the damage was to the player entering the permanent (could be any opponent).
    BLOODTHIRST AND DAMAGE PREVENTION:
      If damage would be dealt to an opponent but is fully prevented: the damage never happened.
      Prevented damage ≠ "was dealt damage." Bloodthirst requires actual damage taken.
      If damage is reduced to 0 by prevention: no damage dealt → bloodthirst doesn't trigger.
    BLOODTHIRST X (702.54b):
      "Bloodthirst X" counts TOTAL damage dealt to ALL opponents this turn.
      Example: you deal 3 damage to one opponent and 5 to another (in multiplayer).
        Bloodthirst X = 8 counters.
      In 1v1: equals damage dealt to the one opponent this turn.
    BLOODTHIRST AND DIRECT DAMAGE:
      Deal 1 damage with Shock ({R}: deal 2 damage to any target, target is opponent):
        Bloodthirst satisfied for the rest of the turn for all cards you cast.
      Deal 0 damage (opponent at 0, no damage actually dealt): bloodthirst not satisfied.
      Playing aggressive: hit opponent turn 1 → all bloodthirst cards cast later have counters.

SUNBURST (702.44a):
  WHAT IT IS:
    Static ability during ETB.
    "If entering as a creature: enter with +1/+1 counter for each COLOR OF MANA spent."
    "If entering as noncreature: enter with a charge counter for each color of mana spent."
  KEY: COLORS, NOT AMOUNTS:
    {G}{G}{G} spent → only 1 counter (one color: green).
    {G}{U}{R}{W}{B} spent → 5 counters (five different colors).
    {2} generic mana has NO color → doesn't contribute to sunburst.
  SUNBURST NONCREATURE:
    Spellbombs and other artifacts with sunburst enter with charge counters (not +1/+1).
    Chromatic Sphere ({1}: artifact, sunburst): if cast for {G}{U}, enters with 2 charge counters.
  SUNBURST AND FREE CASTING:
    702.44b: "adds counters only if entering the battlefield from the stack as a resolving spell
      and only if one or more colored mana was spent on its costs, including additional or
      alternative costs."
    If cast for FREE (no mana paid at all): sunburst adds 0 counters.
      Example: reanimated with Animate Dead (not cast from stack) → no sunburst.
      Example: suspended creature cast from exile for free → the free cast via suspend has
        specific mana paid? Actually: suspend's free cast says "play it without paying its
        mana cost." No mana cost paid. No colored mana spent → sunburst = 0.
    If cast with kicker or other colored additional costs: those colors count!
      Pay {G}{W} for a kicked sunburst creature: 2 colors → 2 counters.
  SUNBURST TIMING (as an ETB replacement):
    Sunburst is an ETB replacement: the counters are placed as the permanent enters.
    They're part of the entering event (like "enters with N counters" effects in P614.12).

GRAFT + MODULAR COUNTER INTERACTIONS:
  A creature entering triggers Graft: move a graft counter to the entering creature.
  If the graft counter is moved to an ARTIFACT CREATURE with Modular:
    When that artifact creature dies: its modular trigger fires, transferring counters
    (including the one moved to it by Graft) to another artifact creature.
  Chain: Graft distributes → Modular artifacts collect → Modular transfers on death.
  Example:
    Turn 1: Simic Initiate (0/0 graft 2) enters. Has 2 counters.
    Turn 2: Arcbound Worker ({1}: 1/1 artifact creature; modular 1) enters. Has 1 counter.
    Simic Initiate's graft triggers: move a counter from Initiate to Worker.
    Worker now has 2 counters (1 modular + 1 from graft). Initiate has 1.
    Turn 3: Worker is destroyed (Shock).
    Modular trigger: transfer 2 counters to target artifact creature.
    Arcbound Ravager gets 2 counters. Becomes 2/2 (plus its 0/0 base = 2/2).
    The Graft counter "survived" through the Modular chain.
```

## Definitive Conclusions

- **Graft triggers on ANY creature entering, including opponents'** — you may move a counter to an opponent's creature; this is rarely beneficial but technically legal.
- **Modular transfers counters equal to what's on the artifact AT THE TIME OF TRANSFER** — not at the time of death; if the artifact gained more counters between death and trigger resolution, those are transferred too (very rare timing window, but real).
- **Bloodthirst requires ACTUAL damage to an opponent** — prevented damage (reduced to 0) does not satisfy bloodthirst; even 1 point of actual damage satisfies it for all N-value bloodthirst cards.
- **Sunburst counts COLORS, not amounts** — spending GGGGG gives 1 counter; spending GWUB gives 3 counters; free casting from suspend or Reanimate effects gives 0 sunburst counters.
- **Modular only triggers on GY death (not exile)** — exiling a modular artifact destroys the counters; protection from colors that would cause the artifact to be exiled loses the counter chain.

## Canonical Example
**Arcbound Ravager Modular Chain (Legacy Affinity):**
You control: Arcbound Ravager (0/0; sacrifice artifact: +1/+1 counter; modular 1), Arcbound Worker (1/1; modular 1), Steel Overseer ({2}: {T}: put +1/+1 counter on each artifact creature you control).

Turn 3: Steel Overseer taps. All artifact creatures get +1/+1 counter.
Ravager: 0/0 base + 1 modular + 1 overseer = 2/2.
Worker: 1/1 base + 1 modular + 1 overseer = 3/3.

Opponent casts Naturalize targeting Steel Overseer. You respond.
Sacrifice artifacts to Ravager: sacrifice Worker (Ravager gets +1/+1 counter per activation).
Worker being sacrificed: goes to GY. Worker's modular trigger fires: transfer 3 counters (from Worker) to Ravager.
Ravager now has: original modular 1 + overseer 1 + sacrifice counter + Worker's 3 = 6 counters. Ravager is 6/6.

Naturalize resolves: destroys Steel Overseer (not an artifact). Wait — Naturalize targets artifacts OR enchantments. Steel Overseer IS an artifact. It's destroyed.
No counters to save from Overseer (it's a non-modular artifact — just has {T} ability).

Attack with Ravager (6/6). Opponent takes 6 damage.

If opponent tries to kill Ravager: sacrifice remaining artifacts in response, grow Ravager further.
When Ravager dies: modular transfers all its counters to another artifact creature.
Your Walking Ballista (target artifact creature) receives 6 counters → tap to ping for 6 total.

**Example 2 — Sunburst with Chromatic Lantern:**
You control Chromatic Lantern ({3}: artifact; "lands you control have {T}: add one mana of any color"; all permanents tap for {T}: add one mana of any color).

You cast Etched Oracle ({4}: artifact creature; sunburst; {T}, remove four +1/+1 counters from it: target player draws three cards) by tapping:
Land 1 → {G}
Land 2 → {U}
Land 3 → {B}
Land 4 → {W} (from Chromatic Lantern effect on land)

Spent: {G}{U}{B}{W} = 4 colors.
Etched Oracle enters with 4 +1/+1 counters. Now a 4/4.

Later: {T}, remove 4 counters: target player draws 3 cards.
Oracle returns to 0/0... except it has 0 toughness. State-based actions: 0 toughness creature is put into GY (CR 704.5f).

Only one use of the draw ability before Oracle dies. But: 3 cards for a 4-mana investment.

Note: if Oracle had entered with fewer counters (e.g., only {2}{U}{U} spent = 1 color = 1 counter):
  You couldn't activate the ability (need 4 counters). Dead weight until it had enough.
  Sunburst's value scales directly with color diversity of the mana used.

## Commonly Confused With
- **P019 (Counters and Zone Changes)** — Modular specifically tracks +1/+1 counters on an artifact and transfers them on death. The counter transfer is a triggered ability, not a state-based action; it uses the stack and can be responded to.
- **P391 (Persist/Undying/Evolve)** — Persist uses -1/-1 counters; undying uses +1/+1 counters; modular transfers +1/+1 counters. All three have "dies" triggers. Key distinction: persist/undying return the card itself; modular transfers only the counters to a different artifact creature.
- **P417 (Suspend/Vanishing)** — Sunburst is an "enters with counters" mechanic like Vanishing's initial counter loading. Vanishing uses time counters (countdown to sacrifice); sunburst uses +1/+1 counters (enters stronger based on mana diversity). Proliferate interacts with both.
- **P393 (Extort/Exploit/Scavenge/Unleash)** — Scavenge transfers +1/+1 counters from a GY card to a living creature. Modular transfers from a dying artifact to a living artifact creature. Both are "use the GY/death as a counter source" mechanics, but triggered at different times.
