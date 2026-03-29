---
id: p449
name: Absorb, Rampage, and Flanking — Legacy Damage-Modification and Multi-Blocker Keywords
category: combat
cr_refs: [702.64, 702.23, 702.25, 120.4, 702.19, 702.2]
tags: absorb, rampage, flanking, combat, damage-prevention, multi-blocker, legacy-keywords
created: 2026-03-29
examples_count: 8
---

# P449 — Absorb, Rampage, and Flanking — Legacy Damage-Modification and Multi-Blocker Keywords

## Abstract

Three older formal keywords govern how combat damage is modified in multi-blocker scenarios or prevented entirely: **Absorb** statically prevents N damage from any single source; **Rampage** rewards a creature for being blocked by multiple creatures by granting a fixed power/toughness boost per extra blocker; and **Flanking** punishes creatures that block it without having flanking. All three are formally defined in CR 702 but see little modern use, leading to frequent rules misconceptions — especially about absorb's "per source" nature, rampage's once-only calculation, and flanking's specific trigger condition.

## The Definitive Rules

### Absorb (CR 702.64)
**CR 702.64a verbatim:** *"Absorb is a static ability. 'Absorb N' means 'If a source would deal damage to this creature, prevent N of that damage.'"*

**CR 702.64b verbatim:** *"Each absorb ability can prevent only N damage from any one source at any one time. It will apply separately to damage from other sources, or to damage dealt by the same source at a different time."*

**CR 702.64c verbatim:** *"If an object has multiple instances of absorb, each applies separately."*

### Rampage (CR 702.23)
**CR 702.23a verbatim:** *"Rampage is a triggered ability. 'Rampage N' means 'Whenever this creature becomes blocked, it gets +N/+N until end of turn for each creature blocking it beyond the first.'"*

**CR 702.23b verbatim:** *"The rampage bonus is calculated only once per combat, when the triggered ability resolves. Adding or removing blockers later in combat won't change the bonus."*

**CR 702.23c verbatim:** *"If a creature has multiple instances of rampage, each triggers separately."*

### Flanking (CR 702.25)
**CR 702.25a verbatim:** *"Flanking is a triggered ability that triggers during the declare blockers step. 'Flanking' means 'Whenever this creature becomes blocked by a creature without flanking, the blocking creature gets -1/-1 until end of turn.'"*

**CR 702.25b verbatim:** *"If a creature has multiple instances of flanking, each triggers separately."*

## The Pattern

```
ABSORB pattern:
When [source] would deal damage to [creature with Absorb N]:
  → Prevent N of that damage (static, not a trigger, not a replacement you choose)
  → Each source is tracked independently: same source at same time = one application
  → Multiple instances of Absorb: each prevents N separately (Absorb 2 + Absorb 2 = prevent 4 total)
  → Does NOT apply to damage dealt to players, only to the creature with the ability

RAMPAGE pattern:
When [creature with Rampage N] becomes blocked:
  → Count number of blockers
  → If blocked by 1: no bonus (rampage only applies for each blocker BEYOND the first)
  → If blocked by 2: creature gets +N/+N
  → If blocked by 3: creature gets +2N/+2N
  → Bonus is locked in at trigger resolution; adding/removing blockers later doesn't change it
  → Multiple rampage instances each trigger separately; each adds its own bonus

FLANKING pattern:
When [creature with Flanking] becomes blocked by [creature without Flanking]:
  → That blocking creature gets -1/-1 until end of turn (triggered)
  → Triggers once per blocking creature without flanking
  → If blocked by a creature WITH flanking: no trigger
  → Multiple flanking instances: each triggers separately, creature gets -1/-1 per instance
```

## Definitive Conclusions

**Absorb:**
- Absorb prevents damage to the creature only, not to players. A Rampart Crawler with Absorb 1 still lets all damage through to its controller.
- Deathtouch + Absorb: If a 1/1 deathtouch creature deals 1 damage to a creature with Absorb 2, the damage is prevented (0 damage dealt). Deathtouch's "any amount of damage is lethal" rule applies to damage *dealt* — absorbed damage is prevented before it's dealt (CR 120.4), so a creature with absorb 2 is NOT killed by a 1/1 deathtouch attacker dealing 1 damage.
- Absorb does NOT prevent trample excess to the player. The player's own creatures with absorb protect only themselves, not their controller.
- Two Absorb 2 abilities on the same creature: If a source deals 5 damage, the first prevents 2 (3 remaining), the second prevents 2 more (1 gets through). CR 702.64c — each applies separately.
- Absorb is a static ability generating a prevention effect, NOT a triggered ability and NOT a replacement effect. It cannot be Stifled.

**Rampage:**
- A creature with Rampage 2 blocked by 3 creatures gets +4/+4 (two blockers beyond the first × 2). Blocked by 1: no bonus.
- The calculation locks in when the triggered ability resolves. If a blocker is killed before resolution, the count at resolution is what matters.
- Rampage does NOT trigger if the creature is unblocked — it requires "becomes blocked."
- Multiple rampage instances (e.g., Rampage 1 and Rampage 2) each trigger separately and sum their bonuses.

**Flanking:**
- Flanking triggers for each blocker without flanking. A creature with Flanking blocked by three creatures that lack flanking gets three separate -1/-1 triggers.
- A creature with Flanking blocked by a creature WITH Flanking gets no trigger at all for that blocker.
- A creature with two instances of Flanking blocked by one creature without flanking generates two separate -1/-1 triggers, for -2/-2 total to the blocker.
- Flanking + Wither/Infect interaction: The -1/-1 from flanking is a temporary effect (until end of turn), not a -1/-1 counter. Wither and infect deal damage as -1/-1 counters — flanking's -1/-1 is a separate power/toughness reducing effect applied in Layer 7c.

## Canonical Examples

**Absorb:**
- **Cho-Manno's Blessing / Warrior en-Kor** (targeted protection/redirect). The canonical absorb creature is **Aven Mindcensor** with Absorb variants on Varchild's card type: the original Absorb creatures are from Invasion block — **Razorfoot Griffin** and similar. But the clearest Absorb example is CR 702.64b itself: two sources deal damage at different times, absorb prevents N each time.

**Rampage:**
- A 3/3 creature with Rampage 2 is blocked by three 2/2s. Rampage triggers and resolves: 2 blockers beyond the first = +4/+4, making it 7/7. It kills all three blockers (none of which has trample). *Example cards:* Shivan Dragon (has Rampage 1 from older printings), Lord of the Pit (Rampage 1), Stangg (Rampage 1).

**Flanking:**
- A White Knight has Flanking. It attacks and is blocked by three 1/1 Soldiers that lack flanking. Three flanking triggers resolve; each Soldier gets -1/-1 until end of turn, making them 0/0s. They're removed by state-based actions (CR 704.5f). The White Knight is effectively unblocked. *Example cards:* Zebra Unicorn, Jabari's Influence, Zhalfirin Commander.

## Commonly Confused With

- **P037** (Infect/Wither) — wither deals damage as -1/-1 counters; flanking applies -1/-1 as a temporary effect, not counters
- **P027 / P305** (Protection DEBT) — protection prevents damage from sources of the relevant quality; absorb prevents N damage from ANY source
- **P001** (Threshold-Based Damage Assignment / Trample) — trample excess routes to player after assigning lethal to blockers; absorb on the blocker only prevents damage to the blocker, not the player
- **P105** (Deathtouch any damage is lethal) — absorb can prevent deathtouch damage below the threshold, nullifying the kill
