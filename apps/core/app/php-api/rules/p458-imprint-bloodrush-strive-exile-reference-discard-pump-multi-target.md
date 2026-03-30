---
id: p458
name: Imprint, Bloodrush, and Strive — Exile-Reference, Discard-to-Pump, and Multi-Target Additional Cost
category: costs
cr_refs: [207.2c, 607.1, 701.13, 601.2b, 601.2f, 603.2]
tags: imprint, bloodrush, strive, ability-word, exile-reference, discard-to-pump, multi-target-cost, mirrodin, gatecrash, journey-into-nyx, linked-abilities, additional-cost
created: 2026-03-29
examples_count: 7
---

# P458 — Imprint, Bloodrush, and Strive — Exile-Reference, Discard-to-Pump, and Multi-Target Additional Cost

## Abstract

Three ability words (CR 207.2c) from different blocks create activated or alternative-cost effects with non-obvious mechanics: **Imprint** (Mirrodin) exiles a card to create a permanent reference that another linked ability on the same object uses; **Bloodrush** (Gatecrash) is a discard-for-instant-speed-pump mechanic (activated, not a spell cast) that bypasses normal cast-time restrictions; and **Strive** (Journey into Nyx) allows paying an additional cost multiple times to add extra targets to a spell. None have individual CR entries — all mechanics follow from standard game rules.

## The Definitive Rules

### Imprint (CR 207.2c + linked abilities)
Imprint text pattern: *"When [X] enters the battlefield / is activated, you may exile [a card]. An [ability] can produce [effect involving the exiled card]."*

**CR 607.1** (Linked Abilities): Two abilities are linked if one creates an object in a particular zone and the other references "the [object] exiled by this" or similar. The second ability can only refer to cards exiled by the first ability of that same permanent.

When the imprint permanent leaves the battlefield, the exile reference is lost (the permanent no longer exists to "own" the link). The exiled card remains exiled, but the link is broken — a new copy of the permanent entering would not have a reference to the previously exiled card.

### Bloodrush (CR 207.2c)
Bloodrush text pattern: *"Bloodrush — [Cost], Discard [this card]: Target attacking creature gets +N/+N and gains [abilities] until end of turn."*

Bloodrush is an **activated ability** of the card in hand, not a spell cast from hand. Key consequences:
- Bloodrush can be activated any time you have priority (instant speed), without needing flash
- It does NOT use the stack as a spell — it goes on the stack as an activated ability
- Bloodrush can target only **attacking** creatures
- Bloodrush cannot target blocking creatures or non-attacking creatures
- Using Bloodrush does NOT trigger "whenever you cast a spell" effects (it's not a cast)
- The card is discarded as a cost (601.2b style) — if Bloodrush is activated, the discard has already happened

### Strive (CR 207.2c)
Strive text pattern: *"Strive — [This spell] can have any number of targets. It costs [additional cost] more to cast for each target beyond the first."*

Strive is an **additional cost** applied at cast time (CR 601.2b, 601.2f). The spell can target any number of permanents (or players, depending on the card), but each additional target beyond the first costs the stated additional mana.

**CR 601.2b**: Additional costs are paid before the mana cost.

## The Pattern

```
IMPRINT pattern:
Step 1: Imprint trigger or ability fires → exile a card
  → The exiled card is now "imprinted" on the permanent
  → The card is in exile, but it's linked to the permanent

Step 2: The permanent's related ability references "the card exiled by [this]"
  → This linked ability can only use the imprinted card
  → Multiple imprint triggers (e.g., from multiple ETBs): usually last-in wins or all are tracked

Step 3: When the permanent leaves the battlefield:
  → The link is broken — no new permanent can use the old imprinted card
  → The imprinted card stays in exile
  → If the same permanent re-enters (blink), the new object has no imprinted card
    (unless the ETB trigger fires again and imprints a new card)

BLOODRUSH pattern:
Activate bloodrush during combat, while target creature is attacking:
  → Cost: discard the bloodrush card + any additional cost
  → The discard IS the cost — it happens before resolution
  → Resolves like any activated ability on the stack
  → Can be countered (Stifle) or responded to
  → Does NOT count as "casting" the card — not a spell
  → Prowess and Magecraft do NOT trigger (not a spell)
  → Affects only the target attacking creature until end of turn

STRIVE pattern:
When casting a strive spell, declare all targets and pay costs:
  → 1 target: base cost only
  → 2 targets: base cost + strive additional cost × 1
  → N targets: base cost + strive additional cost × (N-1)
  → Additional cost per target is paid once for each target beyond the first
  → If some targets become illegal before resolution:
    → Remaining legal targets still get the effect
    → If ALL targets become illegal: spell fizzles
  → Copies of strive spells can target any number of new targets independently
```

## Definitive Conclusions

**Imprint:**
- The imprint link is between a specific object and the exiled card. If the permanent with imprint dies and a second copy enters, the second copy has no imprinted card until its own ETB trigger fires.
- Two Isochron Scepters: each Scepter can only use the card it personally imprinted. You can't fire one Scepter with the other's imprinted card.
- If the imprinted card has a mana cost and the related ability says "without paying its mana cost," that means the copy/activation is free.
- What happens if Imprint's exile is used by "exile all" effects? The card is still exiled but no longer "linked" in the way that matters for the imprint ability — the card might be face-down or mixed with other exiles, but the rule is that the link persists as long as the card is in exile AND the permanent is on the battlefield.
- Key cards: *Isochron Scepter* (classic imprint: exile an instant ≤2 CMC; each activation can copy and cast it for free), *Chrome Mox* (exile a nonartifact nonland card; add a mana of one of its colors), *Panoptic Mirror* (exile a nonland card; each upkeep you may cast a copy for free).

**Bloodrush:**
- Bloodrush can only target attacking creatures. You can't Bloodrush a blocking creature or a creature that isn't in combat.
- Bloodrush is instant-speed (you can activate during the declare blockers step or combat damage step) but the pump is until end of turn.
- Since bloodrush is an activated ability, NOT a spell cast, it doesn't trigger Prowess, Magecraft, Storm count, or "whenever you cast a spell" effects.
- A hand full of bloodrush cards acts as a form of "virtual creatures" — they contribute combat power without using creature spell slots.
- Key cards: *Ghor-Clan Rampager* (Bloodrush: {R}{G}, Discard: +4/+4 and trample), *Rubblehulk* (Bloodrush: {1}{R}{G}, Discard: +X/+X where X = number of lands you control).

**Strive:**
- Strive is powerful because you can target ALL of your creatures in one spell for maximum board-wide impact.
- If opponent removes targets in response, only illegal targets are "removed" — each remaining legal target still gets the effect. Targeting 5 creatures with Strive and opponent kills one: remaining 4 still get the effect.
- Strive spells are NOT "for each target" triggers — the effect happens once for each target, but it's the same effect applied to multiple objects simultaneously.
- Cost reduction effects can reduce the total cost of a strive spell, but they don't reduce the strive cost component in a way that bypasses the per-target pricing (cost reduction affects the total, not the formula).
- Key cards: *Ajani's Presence* (Strive {2}{W}: costs {2}{W} more per additional target; each target creature gets +1/+1 and indestructible until EOT), *Dictate of the Twin Gods* (not strive, but related), *Setessan Tactics* (Strive {G}: each target creature gets +1/+1 and gains "{T}: fight another target creature" until EOT).

## Commonly Confused With

- **P047** (Cycling) — cycling is also a discard-activated-ability; bloodrush is different (targets attacking creature, requires an attacker to target)
- **P033** (Madness) — madness triggers when you discard; bloodrush discards as a cost, not for madness
- **P099** (Modal Spells / Choose Modes) — strive is different from escalate (per-additional-mode cost); strive is per-additional-target cost
- **P040** (Aura/Bestow) — imprint exiles a card and references it via linked abilities; different from bestow which casts the card as an Aura
- **P029** (Spell Copy Targeting) — copies of strive spells can choose different targets (any number), not bound to original targets
