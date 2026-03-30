---
id: p473
name: Shadow, Fear, Fading, and Provoke — Two-Tier Blocking, Black/Artifact-Evasion, Timed Sacrifice, and Force-Block
category: combat
cr_refs: [702.27, 702.35, 702.32, 702.39, 509.1, 704.5m, 704.5f, 508.1, 603.2]
tags: shadow, fear, fading, provoke, formal-keyword, evasion, blocking-restriction, timed-permanent, forced-block, tempest, onslaught, nemesis
created: 2026-03-29
examples_count: 7
---

# P473 — Shadow, Fear, Fading, and Provoke — Two-Tier Blocking, Black/Artifact-Evasion, Timed Sacrifice, and Force-Block

## Abstract

Four formal keywords from older sets with distinct mechanics: **Shadow** (CR 702.27, Tempest block) is a two-tier evasion where shadow creatures can only be blocked by shadow creatures and can only block shadow creatures — creating a parallel combat track; **Fear** (CR 702.35, Onslaught / pre-Intimidate era) means the creature can only be blocked by black and/or artifact creatures; **Fading** (CR 702.32, Nemesis) puts N fade counters on a creature when it enters, removes one per upkeep, and sacrifices the creature when no counters remain; and **Provoke** (CR 702.39, Onslaught) forces a target creature to block the provoking creature if able when the provoking creature attacks.

## The Definitive Rules

### Shadow (CR 702.27)
**CR 702.27a verbatim:** *"Shadow means 'This creature can't be blocked except by creatures with shadow' and 'This creature can't block creatures without shadow.'"*

Shadow creates a completely separate combat tier: shadow creatures block and attack only in the shadow "plane." Two shadow creatures can fight each other; a shadow creature bypasses non-shadow blockers; but a shadow creature is also useless at blocking non-shadow attackers.

### Fear (CR 702.35)
**CR 702.35a verbatim:** *"Fear means 'This creature can't be blocked except by artifact creatures and/or black creatures.'"*

Fear is like Intimidate but only for black and artifact creatures. It was errata'd/replaced by Intimidate in many contexts, which generalizes the mechanic to the creature's own colors.

### Fading (CR 702.32)
**CR 702.32a verbatim:** *"Fading N means 'This permanent enters the battlefield with N fade counters on it' and 'At the beginning of your upkeep, remove a fade counter from this permanent. If you can't, sacrifice this permanent.'"*

Fading is a countdown mechanic: the permanent enters with N counters and counts down each upkeep. At zero, it's sacrificed. Unlike Vanishing (which uses time counters), Fading uses "fade counters."

### Provoke (CR 702.39)
**CR 702.39a verbatim:** *"Whenever this creature attacks, you may have target creature defending player controls untap and block this creature if able."*

Provoke is a triggered ability that fires when the provoking creature attacks. You may target a tapped defender and force it to untap and block the provoking creature. The defender must block if it's able (unless it's been given an inability to block).

## The Pattern

```
SHADOW pattern:
Two-tier combat: Shadow creatures are in a "separate" combat dimension
  → Shadow creature attacks: only shadow creatures can block it
    → Non-shadow defenders: can't block → shadow creature slips through
  → Shadow creature blocks: can ONLY block shadow creatures
    → Non-shadow attacker: shadow creature can't block it
  → Two shadow creatures: fight each other normally
  → Shadow + non-shadow armies: both attack, one through the other unblocked
  → Double shadow: if BOTH players have shadow creatures attacking, they DO interact
  → Key interaction: shadow creatures that gain non-shadow can suddenly block normally
    → "Until end of turn, creatures you control lose shadow": all shadow creatures
      can now block normally and can be blocked normally
  → Shadow and flying: a shadow creature with flying can only be blocked by shadow creatures
    → The shadow restriction is MORE RESTRICTIVE than flying; shadow overrides flying
      in the sense that flying blockers can't block if they lack shadow

FEAR pattern:
Blocking restriction: "Can't be blocked except by artifact creatures and/or black creatures"
  → ONLY black and/or artifact creatures can block
  → A creature that is both black AND an artifact: absolutely can block
  → A white creature with a black equip: the creature isn't black, artifact → still can't block
    (it's the CREATURE's type/color, not what it's carrying)
  → Colorless creatures: colorless ≠ black → can't block fear creatures (only artifact colorless can)
  → An artifact creature with no colors: CAN block (it's an artifact)
  → Fear is now largely replaced by Intimidate (CR 702.76) in modern sets
    → Intimidate: "Can't be blocked except by artifact creatures and/or creatures that share
      a color with [this creature]"
  → A fear creature is black: intimidate would say "except by artifact and black creatures"
    → Same result for black creatures with fear vs. intimidate

FADING N pattern:
Enter with N fade counters:
  → Each of your upkeeps: remove 1 fade counter
  → If you can't (0 fade counters): sacrifice this permanent
  → Proliferate adds fade counters → extends the permanent's life
  → "Remove a counter" effects (Vampire Hexmage) can accelerate fading
  → Fading vs. Vanishing: both count down; Fading uses "fade counters," Vanishing uses
    "time counters"; they're different counter types (Proliferate/Time Travel affect
    ONLY time counters, not fade counters)
  → Adding fade counters: any effect that adds fade counters extends the permanent's life
    → "Put a fade counter on target permanent" extends it by 1 turn
  → Fading at 0 upkeep: if you start your upkeep with 0 fade counters, sacrifice immediately
  → The sacrifice happens as a STATE-BASED ACTION? NO — fading's sacrifice is triggered
    from the upkeep trigger "if you can't remove a counter, sacrifice this permanent."
    It's a triggered ability in the upkeep trigger, not an SBA.

PROVOKE pattern:
Trigger: "Whenever this creature attacks, you may have target creature defending player controls
          untap and block this creature if able."
  → Optional: you "may" choose to target — no obligation
  → Target: any creature the defending player controls (can be tapped or untapped)
  → If tapped: the target UNTAPS then must block
  → "If able" clause: the target blocks the provoking creature IF it can
    → If the target gains "can't block" before blocking is declared: it doesn't block
    → If the provoked creature leaves combat before blocking declared: can't block it
  → Multiple provoke triggers from the same attack: each trigger targets independently
    → Two provoke creatures attacking: each can provoke a different defender
  → Provoke forces the opponent's creature into a fight — it may die blocking
  → Provoking a creature with first strike: provoke it into your deathtouch creature
    → Defender's first strike creature untaps and blocks your creature
    → First strike damage kills your creature; no deathtouch damage to defender
    → Wait: your deathtouch creature has deathtouch; opponent's creature has first strike
    → First strike damage hits your deathtouch creature, possibly killing it
    → Your deathtouch damage doesn't happen if your creature died in first strike step
    → This is a risk of provoke — forced blocks can backfire
```

## Definitive Conclusions

**Shadow:**
- Shadow creates a fascinating two-tier combat environment. In a pure shadow deck vs. a non-shadow deck, ALL of your creatures slip through unblocked — but your creatures also can't block anything. It's an aggro strategy with zero defensive value.
- Shadow vs. shadow: if both decks have shadow, the shadow creatures CAN fight each other, creating a normal combat scenario in the shadow tier. This is why shadow decks include some non-shadow removal.
- Shadow was from Tempest block (1997) and is found mainly in Legacy/Vintage play. *Waterspout Djinn*, *Shadow Guildmage*, *Soltari Monk* etc.
- Key card: *Dauthi Voidwalker* (MH2): Has shadow. Any card the opponent exiles goes under Dauthi Voidwalker; when Dauthi dies, you can cast one for free. Modern shadow evasion combined with powerful hate effect.
- Key card: *Soltari Monk* (TE): 2/1 protection from black with shadow. An exemplar of shadow's power in 1997: bypassed all common blockers of the era.

**Fear:**
- Fear is functionally identical to Intimidate for black creatures. The main difference: Fear doesn't scale with the creature's color, while Intimidate does.
- Fear creatures fear (ha) white, green, red, and blue non-artifact blockers. Running Fear in a non-black deck doesn't help (Intimidate would be better for the creature's own color).
- Key card: *Severed Legion* (ONS): 2/2 for {1}{B}{B} with fear. Unblockable by non-black, non-artifact creatures.

**Fading:**
- Fading is a "now/later" tradeoff. Fading creatures have strong stats for their cost but a finite life. Efficient use means getting maximum value before they're sacrificed.
- Adding fade counters to reset (extend) the permanent: effects like "put a fade counter on target permanent" give extra turns. In a Proliferate-less environment (pre-Scars), only specific effects could extend fading permanents.
- Key card: *Blastoderm* (NEM): 5/5 for {2}{G}{G} with Shroud and Fading 3. Extremely powerful stats; 3 upkeeps then gone. In its day, Blastoderm was a format-defining card despite being on a timer.
- Key card: *Parallax Wave* (NEM): "Fading 5. Remove a fade counter from Parallax Wave: Exile target creature. When Parallax Wave leaves the battlefield, each player returns to the battlefield all cards they own exiled with it." Uses its fade counters as blink resources.

**Provoke:**
- Provoke is best used to force bad trades for your opponent: provoke their biggest blocker into a fight it won't survive, using your creature as bait.
- Provoke at end of opponent's turn (if your creature has vigilance or untaps) can force a creature to untap and then be available to block — useful for forcing an opponent's key creature into combat.
- Key card: *Nantuko Vigilante* (LGN): "Morph {2}{G}. Provoke." Turn face up and provoke — forces a creature to block.

## Canonical Examples

**Shadow:**
- Full shadow aggro deck: all creatures have shadow → unblockable by all non-shadow blockers. Opponent's 8/8 can't block; you deal damage freely. Opponent's shadow creature does threaten your shadow blockers.

**Fear:**
- *Severed Legion* attacks a board with only green and white creatures: unblockable, deals 2 damage every swing.

**Fading:**
- *Blastoderm* attacks 3 turns as a 5/5 with shroud (can't be targeted), then dies. 15+ potential damage in 3 swings for {2}{G}{G}.

**Provoke:**
- Provoke creature attacks: force opponent's 6/6 blocker to untap and block your 2/2 with deathtouch. Your 2/2 dies, their 6/6 dies. Good trade.

## Commonly Confused With

- **P107** (Flying/Intimidate/Evasion) — Fear and Shadow are both evasion keywords; Fear is "black/artifact only"; Shadow is "shadow-only"; all are blocking restrictions
- **P417** (Suspend/Vanishing) — Vanishing uses TIME counters that count down; Fading uses FADE counters; Proliferate affects only time counters, not fade counters
- **P106** (First Strike/Double Strike) — Provoke forces a creature to block; First Strike interacts with the resulting combat; provoke into first strike can be dangerous
- **P464** (Detain) — Detain prevents attacking AND blocking; Provoke forces blocking; both affect attack/block restrictions
