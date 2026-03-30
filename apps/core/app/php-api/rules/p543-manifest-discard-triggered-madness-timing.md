---
id: p543
name: Manifest + Discard-Triggered Mechanics — Madness Window Timing
category: triggered
cr_refs: [701.26, 603.2, 708.3, 603.6c]
tags: [manifest, madness, discard, survival, graveyard, triggered-ability, zone-change, cast-window]
created: 2026-03-30
examples_count: 2
---

# P543 — Manifest + Discard-Triggered Mechanics — Madness Window Timing

## Abstract

**Manifest creates a face-down 2/2 creature token, not a card copy in the graveyard.** When Survival's Manifest ability mills a card into the graveyard face-down, the card itself is in the graveyard — it is not a token. If that card has Madness, the Madness trigger applies only if the card is **discarded**, not when it enters the graveyard via Manifest (which is a zone change, not a discard). However, if the manifested card is later discarded (via another effect), the Madness window opens at that time. This pattern clarifies the timing window for Madness with cards that entered the graveyard via non-discard means.

## The Definitive Rules

**CR 701.26a (Madness):** *"Madness represents two static abilities. 'Madness [cost]' means 'If a player would put this card into a graveyard from anywhere, that player may exile it instead. If the player does, they may cast it for its madness cost if it's legal to do so. If the player doesn't cast it, they put it into the graveyard.'"*

**CR 708.3 (Face-Down Manifest Tokens):** *"If a permanent would be put into a graveyard from the battlefield, and a face-down creature is created instead (as happens with Manifest), that creature is a token, not the original card."*

**CR 701.26b (Madness Cast Window):** *"The player may cast the exiled card as part of the resolution of the ability that caused it to be discarded. It becomes part of that player's next opportunity to gain priority."*

**CR 603.2 (Triggered Abilities):** *"Triggered abilities trigger automatically when the game state or event matches their trigger condition."*

## The Pattern

```
MANIFEST VIA SURVIVAL:

  Defiant Survivor Survival ability: "At the beginning of your second main phase,
    if this creature is tapped, manifest dread."

  Manifest dread: "Look at the top two cards of your library. Put one onto the
    battlefield face down as a 2/2 creature and the other into your graveyard."

  Result of manifest dread:
    - One card goes to the graveyard as a CARD (not a token)
    - One card goes to the battlefield as a FACE-DOWN 2/2 TOKEN

MADNESS TRIGGER TIMING:

  Madness trigger: "If a player would put this card into a graveyard from anywhere..."

  Manifest dread result:
    - One card goes to graveyard (zone change, not discard)
    - Madness trigger does NOT fire (zone change ≠ discard)

  Later, if that card is discarded (via another effect):
    - Madness trigger fires immediately
    - Player may exile and cast for madness cost

MADNESS CAST WINDOW:

  A card with Madness in the graveyard does NOT have an open cast window
    until it is discarded (which activates Madness).

  Example: Madness card in graveyard (put there via Survival manifest):
    - Cannot cast via Madness window (it wasn't discarded)
    - Can cast via other graveyard-cast mechanics (Flashback, Jump-Start, etc.)
    - If discarded by another effect (Smallpox, Cry of Contrition):
      → Madness trigger fires
      → Player may exile and cast for madness cost

MULTIPLE DISCARDS:

  If a card with Madness is discarded multiple times (e.g., via Faithless Looting
  twice in the same turn), Madness triggers each time.

  Each discard has its own cast window.
  First discard: Madness window opens; player may cast or decline.
  Second discard: Another Madness window opens (if card is in hand again).

MANIFEST + MADNESS INTERACTION:

  Scenario: Survival manifests a Madness card into the graveyard.

  1. Manifest resolves: card enters graveyard (zone change, not discard)
  2. Madness does NOT trigger (no discard event)
  3. Card remains in graveyard as normal card
  4. Other effects that discard from hand:
     → If the card is returned to hand first, then discarded: Madness triggers
     → If the card in the graveyard is exiled by another effect: no Madness

```

## Definitive Conclusions

- **Manifest is not a discard** — cards put into the graveyard via Manifest do not trigger Madness.
- **Madness requires discard event** — Madness cast window opens only when the card is discarded.
- **Card must be in hand to be discarded** — a card in the graveyard cannot be discarded; it can only be exiled or left in the graveyard.
- **Later discards trigger Madness** — if a card is returned to the hand and then discarded, Madness triggers at that time.

## Canonical Example

**Survival + Madness Card in Library:**

You control Defiant Survivor (Survival ability). At the beginning of your second main phase, you tap it. Survival manifests dread: "Look at the top two cards. Put one face-down as a 2/2 creature, the other into the graveyard."

Top card is Crimson Imp (Madness {R}). You put it into the graveyard.

Madness does NOT trigger (Manifest is not a discard). Crimson Imp is in the graveyard as a regular card.

Your opponent plays Smallpox: "Each player sacrifices a creature and discards a card." You discard Crimson Imp from your hand... wait, it's not in your hand; it's in the graveyard. You cannot discard it; you must discard another card from your hand.

Later, if Crimson Imp is returned to your hand (via Snapcaster Mage, Past in Flames, etc.), and then you discard it:
→ Madness triggers
→ You may exile Crimson Imp and cast it for {R}

**Example 2 — Direct Discard After Return:**

You control Crimson Imp in your graveyard (via Survival manifest). Your opponent plays Necrogen Mists: "Whenever Necrogen Mists becomes tapped, each opponent discards a card."

Necrogen Mists triggers. You discard from your hand. But Crimson Imp is not in your hand; it's still in the graveyard. Madness doesn't trigger.

Later, you cast Unburial Rites (graveyard-cast spell), returning Crimson Imp to your hand. On your next turn, you discard Crimson Imp to a discard effect.

Madness triggers: exile Crimson Imp and cast it for {R}.

## Commonly Confused With

- **P033 (Madness)** — P033 covers Madness mechanics; P543 clarifies timing when cards enter graveyard via non-discard means.
- **P514 (Survival)** — P514 covers Survival mechanics; P543 applies Madness triggers to Survival-manifested cards.
