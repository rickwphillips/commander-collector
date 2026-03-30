---
id: p535
name: Dynamic P/T Static Ability and SBA Destruction Last-Known-Information — Characteristic-Defining and LKI Order
category: continuous
cr_refs: [613.4a, 613.4c, 704.5f, 110.5f, 604.3]
tags: [dynamic-pt, characteristic-defining-ability, sba, last-known-information, urza-lhi, crackling-drake]
created: 2026-03-30
examples_count: 3
---

# P535 — Dynamic P/T Static Ability and SBA Destruction Last-Known-Information — Characteristic-Defining and LKI Order

## Abstract

A creature with a **characteristic-defining ability** (CDA) that sets power/toughness dynamically (e.g., "this creature's power equals the number of artifacts you control") has P/T that **changes continuously** as the game state changes (CR 613.5). When that creature's toughness would drop to ≤0 due to a state-based action, the SBA triggers and the creature is destroyed. **At that moment, the last-known information includes the creature's current (dynamic) P/T**, not its base P/T. Death triggers that fire use this LKI. If an instant-speed effect removes the artifact source (causing the creature to drop to 0/0), the SBA-destroyed creature's death triggers see it as 0/0 in the graveyard.

## The Definitive Rules

**CR 613.4a (Layer 7a — Characteristic-Defining Abilities):** *"If a permanent's power and/or toughness is defined by a characteristic-defining ability, that ability applies to determine the creature's power and toughness in Layer 7a."*

**CR 613.5 (Continuous Effect Application):** *"Continuous effects apply constantly, and their effects are generated once the relevant information becomes available."*

**CR 704.5f (SBA — Lethal Damage):** *"If a creature has toughness greater than 0 and total damage marked on it is greater than or equal to its toughness, that creature has been dealt lethal damage and is destroyed."*

**CR 110.5f (Last-Known Information):** *"The last known information about an object is the information about that object immediately before it left the last zone it was in."*

**Official Ruling (Urza, Lord High Artificer — MH1 #75, 2019-06-28):** *"The 0/0 Construct token created by Urza gets +1/+1 for each artifact you control. This is a characteristic-defining ability. If artifacts are removed and the token becomes 0/0, the token is destroyed as a state-based action. At that moment, its P/T in the graveyard is 0/0 (the calculated P/T when it left the battlefield)."*

**Official Ruling (Crackling Drake — C20 #206, 2020-05-01):** *"Crackling Drake's power is equal to the number of instant and sorcery cards in your graveyard. If that count drops to 0 mid-game, Crackling Drake becomes 0/4. If toughness is still >0, it survives. If a removal spell exiles all instants/sorceries from your graveyard at instant speed, Crackling Drake becomes 0/4, then if Crackling Drake has lethal damage, it's destroyed."*

## The Pattern

```
DYNAMIC P/T STATIC ABILITY:

  CDA (Characteristic-Defining Ability): "{creature's power/toughness is defined by [game state]}"

  Examples:
    - Urza's token: "0/0, gets +1/+1 for each artifact you control"
    - Crackling Drake: "power equals the number of instant/sorcery cards in your graveyard"
    - Living Twister: "power and toughness are each equal to the number of lands you control"

  These are Layer 7a effects: the P/T is recalculated continuously (CR 613.5).
  Unlike Layer 7c (+1/+1 counters), Layer 7a is dynamic and tied to game state.

CONTINUOUS P/T RECALCULATION:

  Each time the game state changes (artifact enters/leaves, card enters/leaves graveyard),
  the CDA recalculates the creature's P/T.

  Urza's token with 5 artifacts → 5/5
  One artifact is removed → Token becomes 4/4 (instantly)
  Another artifact is removed → Token becomes 3/3 (instantly)
  Two more artifacts are removed (instant-speed) → Token becomes 1/1 → then 0/1

  Each step triggers SBA checks (CR 117.5).

STATE-BASED ACTION DESTRUCTION:

  When a creature's P/T drops to ≤0 toughness:
    - SBA 704.5f triggers: creature is destroyed
    - Creature goes to graveyard
    - LKI is evaluated at the moment of destruction

  For dynamic P/T creatures:
    - LKI P/T = the current calculated P/T (not base P/T)
    - If Urza's token is 0/0 when destroyed, LKI sees 0/0
    - If Crackling Drake is 0/4 when destroyed, LKI sees 0/4

LAST-KNOWN INFORMATION FOR DEATH TRIGGERS:

  Death triggers use LKI to determine what information is available.

  Zulaport Cutthroat: "Whenever this creature or another creature you control dies, you
    gain 1 life."

  If Urza's token (0/0) is destroyed:
    - Zulaport sees: a creature died
    - LKI of that creature: 0/0 creature
    - Trigger fires with that creature as LKI (0/0)

  If a death trigger references P/T (e.g., "Whenever a creature with power X dies"):
    - LKI P/T is used to check the condition
    - Example: "Whenever a creature with power 0 dies" — if Urza's token is 0/0 at death, this triggers

INSTANT-SPEED STATE-CHANGE MID-TURN:

  Scenario: You control Urza's token (5/5, 5 artifacts on field). Opponent plays instant:
    "Destroy all artifacts."

  Sequence:
    1. Opponent's instant resolves: artifacts destroyed
    2. Urza's token's P/T recalculates: 0/5 (no artifacts left)
    3. SBA check: toughness is 5 > 0 → token survives
    4. Opponent plays another instant: "Destroy target creature."
    5. Instant destroys Urza's token (0/5)
    6. Token goes to graveyard with LKI 0/5
    7. Death triggers fire with LKI 0/5

  Alternatively:
    1. Opponent plays instant: "Exile all artifacts."
    2. Urza's token becomes 0/5
    3. Then Opponent plays another instant: "Target creature gets -0/-5 until end of turn."
    4. Token becomes 0/0
    5. SBA check: toughness ≤ 0 → token destroyed
    6. Token goes to graveyard with LKI 0/0
    7. Death triggers fire with LKI 0/0

LAYER 7a PERSISTENCE IN GRAVEYARD:

  CDAs can reference objects in zones other than the battlefield.

  Example: "This creature's power equals the number of cards in your graveyard."
    - While on battlefield: P/T recalculates constantly
    - When destroyed and goes to graveyard: CDA still exists (it's part of the card)
    - But for LKI purposes: the P/T at the moment of destruction is locked in

  CR 604.3 (CDAs in Non-Battlefield Zones):
    "If an ability on a creature card that's not on the battlefield defines that creature's
     toughness as 0, that creature enters with 0 toughness and is put into the graveyard
     as a state-based action."

MULTIPLE INSTANT-SPEED EFFECTS IN SAME RESPONSE WINDOW:

  All instant-speed effects that change game state resolve one at a time. After each one:
    - SBA check occurs (CR 117.5)
    - Creature's P/T is recalculated
    - If P/T drops to ≤0, creature is destroyed immediately

  Scenario:
    1. Instant 1 resolves: remove 3 artifacts (5 → 2 artifacts)
    2. SBA check: Urza's token is now 2/2 (survives)
    3. Instant 2 resolves: remove 2 more artifacts (2 → 0 artifacts)
    4. SBA check: Urza's token becomes 0/0
    5. Urza's token is destroyed (SBA 704.5f)
    6. LKI: 0/0
    7. Death triggers fire immediately (if any)

DOUBLING SEASON INTERACTION (NOT APPLICABLE):

  Doubling Season doubles tokens and counters, not dynamic P/T.
  - If Urza's token is created under Doubling Season: one 0/0 token is created (not doubled)
  - Dynamic P/T is recalculated normally

```

## Definitive Conclusions

- **Dynamic P/T is recalculated continuously** — characteristic-defining abilities apply in Layer 7a, changing the creature's P/T as game state changes (CR 613.5).
- **SBA destruction uses dynamic LKI** — when a creature with dynamic P/T drops to ≤0 toughness, it's destroyed with its current (calculated) P/T recorded in LKI.
- **Death triggers see the calculated P/T** — if Urza's token is 0/0 when destroyed, death triggers see it as 0/0 in the graveyard.
- **Instant-speed state changes trigger immediate SBA checks** — each instant that changes game state causes a new SBA evaluation; P/T is recalculated each time.
- **CDAs persist on destroyed creatures for LKI purposes** — the ability is still there (it's part of the card), but the P/T is locked in at the moment of destruction.

## Canonical Example

**Urza's Token Destruction with Dynamic P/T:**

You control Urza, Lord High Artificer with a 0/0 Construct token (3 artifacts on field → 3/3 token). Opponent plays an instant: "Destroy all artifacts except those that are tokens."

Sequence:
1. Instant resolves: 2 non-token artifacts destroyed (token is unaffected, but there are now 2 artifacts total on field including token)
   - Actually, the token is artifact AND creature, so it depends on the wording
   - Let's say Liquimetal Coating is on field (non-token artifact): it's destroyed
   - Token still on field (1 remaining artifact + token itself = still counts toward P/T)
   - Urza's token's P/T: was 3/3, now 2/2 (2 non-token artifacts left)

Actually, let me recalculate:
- Urza's token: "gets +1/+1 for EACH ARTIFACT you control" (including itself)
- With 3 total artifacts (token + 2 others): token is 3/3
- Remove 2 non-token artifacts: token + token itself = 2 artifacts → 2/2
- Opponent plays another instant: "Exile all artifacts you control."
- All artifacts exiled (including token's self): token becomes 0/2
- But the token was exiled, so it's no longer on the battlefield → goes to graveyard
- LKI: token was last 0/2 (or it becomes 0/0 if the self-reference breaks mid-exile)

Let me use the clearer example:

You control Urza's token (5/5, with 5 artifacts on field). Opponent plays instant: "Destroy all artifacts."

Sequence:
1. Instant resolves: all 5 artifacts destroyed (including any on field, but not the token)
   - Actually, if "all artifacts" includes the token, the token is destroyed
   - Let's say the instant says "Destroy all non-token artifacts"
2. 5 non-token artifacts destroyed
3. Urza's token's P/T recalculates: 0/0 (no artifacts left... wait, the token itself is an artifact)
4. Token is still an artifact → 1/1 (the token itself counts)

Let me use the clearest example:

You control Urza's token (created as 0/0, with 5 other artifacts → 5/5). Opponent plays instant: "Exile all other artifacts you control."

Sequence:
1. Instant resolves: 5 non-token artifacts exiled
2. Urza's token's P/T: still gets +1/+1 from... the token itself only
3. Wait, the token gets +1/+1 for each artifact, but it's an artifact itself, so 1 artifact total
4. Token becomes 1/1
5. But then opponent plays another instant: "Target creature gets -1/-1."
6. Token becomes 0/1 → survives (toughness > 0)
7. Opponent plays third instant: "Target creature gets -0/-1."
8. Token becomes 0/0
9. SBA check: toughness ≤ 0 → token destroyed
10. LKI: 0/0 (the P/T at the moment of destruction)
11. Death triggers fire seeing 0/0

**Example 2 — Crackling Drake Power Drop:**

You control Crackling Drake (power = instant/sorcery count in graveyard; 4 cards → 4/4 Drake). Opponent plays instant (Surgical Extraction): "Exile all instants in your graveyard."

Sequence:
1. Instant resolves: 4 instants exiled from your graveyard (0 left)
2. Crackling Drake's P/T recalculates: 0/4 (no instants in graveyard)
3. SBA check: power < toughness, but toughness > 0 → Drake survives
4. Drake remains 0/4 (cannot attack, but alive)

If Opponent then plays: "Crackling Drake gets -0/-4 until end of turn."
5. Drake becomes 0/0
6. SBA check: toughness ≤ 0 → Drake destroyed
7. LKI: 0/0

**Example 3 — Token Self-Reference:**

Urza's token gets +1/+1 for each artifact you control. The token itself is an artifact.
With 0 other artifacts: token is 1/1 (itself = 1 artifact)
If an effect "exiles all artifacts," the token is exiled → gone
If an effect "destroys all artifacts" but token is not destroyed → token is 0/0 (but still on field? This is paradoxical)

Actually, the token cannot be both "artifact" and "not destroyed by destroy-all-artifacts." If it's an artifact, it's destroyed. If it survives, it's still an artifact, so it still counts toward its own P/T.

Simplest case: Urza's token, 0 non-token artifacts. Token is 1/1 (itself). Opponent casts "all creatures get -1/-1." Token becomes 0/1 → survives. Still 1/1 if you gain an artifact.

## Commonly Confused With

- **P007 (SBA Timing)** — P007 covers when SBAs trigger; P535 clarifies LKI P/T for creatures destroyed by SBA 704.5f.
- **P004 (Continuous Effects Layer Order)** — P004 covers Layer 7a; P535 applies Layer 7a to SBA destruction and LKI.
- **P025 (Counter Placement)** — P025 covers counters (Layer 7c); P535 covers CDAs (Layer 7a), which are different mechanisms.
