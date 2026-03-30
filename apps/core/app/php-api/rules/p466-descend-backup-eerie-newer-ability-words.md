---
id: p466
name: Descend, Backup, and Eerie — Permanent-GY-Count, Counter-Share-Ability-Grant, and Enchantment/Room-Unlock Triggers
category: triggered
cr_refs: [207.2c, 603.2, 603.4, 603.6a, 400.7, 700.4, 704.5d, 613.6]
tags: descend, backup, eerie, ability-word, permanent-count-gy, counter-and-ability, enchantment-trigger, lost-caverns-ixalan, wilds-of-eldraine, modern-horizons-3
created: 2026-03-29
examples_count: 7
---

# P466 — Descend, Backup, and Eerie — Permanent-GY-Count, Counter-Share-Ability-Grant, and Enchantment/Room-Unlock Triggers

## Abstract

Three ability words from recent sets introduce novel conditions and interactions: **Descend N** (Lost Caverns of Ixalan, 2023) activates when you have N or more permanent cards in your graveyard — counting only permanent cards (not instants/sorceries); **Backup N** (Lost Caverns of Ixalan, 2023) places N +1/+1 counters on a target creature and temporarily grants it all non-Backup abilities of the Backup creature until end of turn; and **Eerie** (Modern Horizons 3, 2024) triggers whenever an enchantment enters the battlefield under your control or you unlock a Room. All three have non-obvious interactions with token permanents in the GY, ability-granting rules during backup, and the Room mechanic for Eerie.

## The Definitive Rules

### Descend N (CR 207.2c)
Descend text pattern: *"Descend N — [Effect] if there are N or more permanent cards in your graveyard."*

Or triggered: *"Whenever [trigger], if there are N or more permanent cards in your graveyard, [effect]."*

"Permanent cards" = cards with a permanent type (Artifact, Creature, Enchantment, Land, Planeswalker, Battle). Instants and sorceries are NOT permanent cards (CR 300.1: permanents are only lands, creatures, enchantments, artifacts, planeswalkers, and battles). Token permanents are NOT cards (CR 110.5a) — they briefly enter the GY when they die, but by the time descend is checked, the SBA (CR 704.5d) has already removed them from the GY. So tokens don't count toward descend.

### Backup N (CR 207.2c)
Backup text pattern: *"Backup N — When this creature enters the battlefield, put N +1/+1 counters on target creature. If that target isn't this creature, it gains [list of abilities this creature has minus the Backup ability itself] until end of turn."*

Key: Backup grants ALL non-Backup abilities of the Backup creature to the target. This is a one-time ETB triggered ability. The target keeps its counters permanently but only has the borrowed abilities until end of turn.

### Eerie (CR 207.2c)
Eerie text pattern: *"Eerie — Whenever an enchantment you control enters the battlefield or you unlock a Room, [effect]."*

Eerie uses the OR connector: either an enchantment entering OR unlocking a Room triggers it. Rooms (a subtype from Duskmourn: House of Horror and later sets) are double-sided enchantments where one side can be "unlocked" by paying a cost, triggering the unlock ability.

## The Pattern

```
DESCEND N pattern:
Check: Are there N or more permanent CARDS in your GY right now?
  → Permanent card types: Artifact, Creature, Enchantment, Land, Planeswalker, Battle
  → NOT: Instant, Sorcery (these aren't permanent cards)
  → NOT: Tokens (not cards per CR 110.5a; also removed from GY by SBAs)
  → Triggered "descend" typically uses intervening-if clause → checked at trigger and resolution
  → Static "descend" conditions re-check continuously as GY changes
  → Descend 4: need 4+ permanent cards in GY (any combination of types)
  → Descend 8: need 8+ permanent cards in GY
  → Spells cast from GY (escape, flashback, jump-start) exile cards from GY
    → These reduce the descend count; can break the threshold mid-combo
  → GY hate (Rest in Peace, Surgical Extraction) can drop below N and disable descend

BACKUP N pattern:
ETB trigger: "When [backup creature] enters the battlefield:"
  1. Put N +1/+1 counters on target creature
  2. IF that target is NOT the backup creature itself:
     → That target gains all of [this creature's non-Backup abilities] until end of turn
  → Can target ITSELF (the backup creature):
     → Gets N counters
     → Does NOT gain the abilities (the "if not this creature" condition)
  → The granted abilities are ALL non-Backup abilities:
     → Keywords (flying, trample, etc.)
     → Triggered abilities ("Whenever this creature attacks, draw a card")
     → Activated abilities ("{T}: Do X")
     → The granted abilities are "until end of turn" effects
  → Giving a triggered ability to another creature:
     → The gained ability triggers if the condition occurs while the grant is active
     → E.g., gain "Whenever this creature attacks, draw a card" → attacks this turn → draws
  → Backup counters are permanent; the ability grant is temporary
  → Copying a backup creature: the copy enters, triggers backup again (ETB trigger)
    → New backup trigger targets a creature and grants abilities

EERIE pattern:
Trigger: "Whenever an enchantment you control enters the battlefield OR you unlock a Room"
  → Two distinct trigger conditions:
    1. Any enchantment ETB under your control (auras, enchantments, sagas, rooms)
       → Including the Eerie creature/enchantment itself if it's an enchantment ETB
       → A token enchantment entering triggers Eerie
    2. You unlock a Room (pay the unlock cost to flip/unlock a Room enchantment)
  → Multiple enchantments entering simultaneously each trigger Eerie separately
  → Sagas are enchantments; each Saga entering triggers Eerie
  → The Eerie permanent itself entering the battlefield (if it's an enchantment) triggers Eerie
    → Only if the Eerie source is an enchantment that just ETB'd
    → Non-enchantment creatures with Eerie (granted by text) don't trigger their own Eerie
```

## Definitive Conclusions

**Descend:**
- The key distinction between Descend and Morbid/Undergrowth: Descend counts permanent CARDS (including artifacts, enchantments, lands, planeswalkers, battles — any permanent type), while Undergrowth counts only creature cards, and Morbid checks if any creature died this turn. Descend is a cumulative counter across the entire game (every permanent that has ever gone to your GY counts).
- Descend is naturally satisfied in the mid-to-late game in normal play: creatures die, artifacts/enchantments get destroyed, lands get discarded to hand-size limits. By turn 6–8 in most games, Descend 4 is trivially achieved; Descend 8 requires more help or a later game.
- Tokens dying don't count — the Goblin tokens that died in combat aren't in your GY by the time descend is checked (SBAs remove tokens from non-battlefield zones).
- Exile effects (Path to Exile, Swords to Plowshares) don't add to descend — the permanent goes to exile, not the graveyard.
- Key card: *Get Lost* (LCI): "Create two Map tokens. Descend 4 — If there are four or more permanent cards in your graveyard, instead exile target permanent." Small benefit for early game, hard removal effect in late game.
- Key card: *Sunken Citadel* (LCI): "Descend 4 — {T}: Add {C}. If there are four or more permanent cards in your graveyard, add one mana of any color instead." A land that upgrades itself based on descend.

**Backup:**
- Backup is particularly powerful because it can grant non-keyword abilities — a creature with "Whenever this creature attacks, create a 1/1 token" can Backup that ability onto a bigger creature that's about to attack, giving the big creature a one-time trigger.
- Backup targeting itself: the creature gets the counters but NOT the abilities. This is the "self-target" case. If you have no other valid targets, or if you want to just buff the backup creature without lending its abilities, target itself.
- Backup granting haste: if the Backup creature has haste and you grant it to another creature with Backup, that creature can attack the turn it enters. Useful for surprise attacks with Backup creatures that have haste.
- Key card: *Ixalli's Lorekeeper* (LCI): "Backup 1. Trample. Haste." ETB: target creature gets +1/+1 and gains trample and haste until end of turn. Common in aggressive Dinosaur decks.
- Key card: *Huatli, Poet of Unity*: Has a backup-like ability granting abilities to creatures.

**Eerie:**
- Eerie triggers on ANY enchantment you control entering — not just enchantments you cast. This includes enchantment tokens, auras that become attached, enchantments returned from exile or GY.
- Eerie and Rooms: The Room mechanic (Duskmourn) creates double-faced enchantment tokens with locked/unlocked sides. Paying the unlock cost triggers Eerie. Rooms entering the battlefield (even still locked) also trigger Eerie as they're enchantments ETB.
- Enchantment creatures entering trigger Eerie — a creature with the enchantment type (e.g., some Theros Gods and enchantment creatures) entering the battlefield triggers Eerie.
- Key card: *Ephara, Ever-Sheltering* (ONE/MKM): Not Eerie, but illustrates enchantment-trigger space.
- *Dreamtail Heron* (IKO) is a mutate creature that granted abilities — a predecessor to backup's ability-granting concept.
- Key card: *Friendly Teddy* (DSK/Duskmourn): Eerie creature that benefits from Room unlocking, getting benefits each time enchantments enter.

## Canonical Examples

**Descend:**
- *Get Lost*: Early game: make 2 Maps. Late game (4+ permanent cards in GY): exile a permanent. The same spell becomes removal once descend is online.

**Backup:**
- *Ixalli's Lorekeeper* (LCI): Backup 1 creature with trample and haste. Attacks immediately and grants another creature the ability to attack with trample and haste.

**Eerie:**
- Any enchantment-heavy deck (Constellation, Theros enchantment synergy) benefits from Eerie. Each aura, saga, or enchantment entering triggers the payoff.

## Commonly Confused With

- **P453** (Magecraft/Revolt/Undergrowth) — Undergrowth counts creature cards in GY; Descend counts ALL permanent cards in GY; different categories of what counts
- **P461** (Threshold/Metalcraft/Delirium) — Threshold counts all cards (7+); Descend counts permanent cards (N+); Delirium counts card types; all are GY-count conditions but with different criteria
- **P431** (Bestow) — Bestow enters as an enchantment if target isn't valid; triggers Eerie if the Eerie controller controls the bestow card — but bestow entering as an enchantment creature triggers Eerie
- **P440** (Mentor/Afflict/Afterlife) — Afterlife creates enchantment tokens (Spirits with flying) — no, Afterlife creates Spirit tokens which are creatures not enchantments; does NOT trigger Eerie
