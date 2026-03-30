---
id: p531
name: Token Copy Attachment During Continuous Effects — Layer Order and Physical Attachment
category: continuous
cr_refs: [613.1, 613.2, 613.7, 614.1c, 603.6b, 110.3j]
tags: [token-copy, attachment, aura, equipment, continuous-effects, layers, etb-trigger, arna-kennerud]
created: 2026-03-30
examples_count: 3
---

# P531 — Token Copy Attachment During Continuous Effects — Layer Order and Physical Attachment

## Abstract

When a continuous effect creates a **token copy of an attached permanent** (Aura or Equipment), the token must be **attached to its source during creation** — not after layers complete. Aura tokens have an explicit attachment requirement: they must attach or cease to exist (CR 614.1c). Equipment tokens can enter unattached. The critical rule: **attachment happens within the effect resolution itself** (Layer 1, as part of the copy mechanism), not as a separate Layer 6 effect. Once attached, ETB triggers of the token fire immediately (CR 603.6b). The physical link persists through subsequent turns unless broken by removal or explicit detachment.

## The Definitive Rules

**CR 110.3j (Token Copies):** *"A token that is a copy of a card copies the characteristics of that card, including type line, color, mana cost, and printed abilities. Tokens can be copies of permanents that are not creatures."*

**CR 614.1c (Replacement Effects — "Enters With"):** *"Some effects define a permanent as entering with certain properties or in certain states. These are not defining the permanent's characteristics; they are replacement effects that modify how the permanent enters."*

**CR 603.6b (Enters-The-Battlefield Triggers):** *"Whenever a permanent enters the battlefield, all applicable triggered abilities that trigger when that permanent enters fire simultaneously."*

**Official Ruling (Arna Kennerüd, Skycaptain — 2025-06-06):** *"When Arna's ability resolves, it creates one or more token copies of the permanents attached to the target creature. Those token copies enter as copies of those permanents. If a token copy is an Aura, it enters attached to that creature."*

**Official Ruling (Three Dog, Galaxy News DJ — 2025-06-06):** *"If an Aura you control becomes attached during an effect that's resolving, that Aura enters the battlefield at that time. Triggers that trigger when an Aura enters fire at that moment."*

## The Pattern

```
TOKEN COPY OF ATTACHED PERMANENT:

  Effect: "Create a token that's a copy of [attached permanent]."

  If attached permanent is an AURA:
    - Token enters the battlefield attached to the same target
    - Attachment is part of the token creation process (Layer 1)
    - Token must be attached or it ceases to exist (CR 614.1c)
    - ETB triggers fire for the token (CR 603.6b)

  If attached permanent is EQUIPMENT:
    - Token enters the battlefield unattached
    - Equipment tokens are not required to be attached
    - Token CAN be attached via other effects in same layer sequence

LAYER ORDER AND ATTACHMENT:

  Layer 1 (Copiable Effects): Token is created as a copy; attachment link established
  Layer 1a (Self-replacement effects): Aura token applies its attachment requirement
  Layer 6 (Ability-adding): Aura's abilities are now part of the token
  Layer 6a/b (Aura's granted static abilities): Apply to the attached creature

  Attachment does NOT happen in Layer 6; it's a Layer 1 phenomenon.
  The attachment link persists through all subsequent layers.

AURA TOKEN ATTACHMENT REQUIREMENT:

  When an Aura token is created by an effect:
    - It must enter attached or cease to exist (CR 614.1c)
    - It enters attached to the original creature (same as source Aura)
    - Shroud/hexproof don't apply (attachment is automatic, not targeted)
    - The token exists on the battlefield attached, not in a zone-change state

  Example: Arna Kennerüd creates Aura token copy.
    - Token enters attached to Arna's target creature
    - Token's ETB ability (if any) fires immediately
    - Token persists as attached as long as creature is on field

EQUIPMENT TOKEN ATTACHMENT:

  Equipment tokens created by effects:
    - Enter the battlefield UNATTACHED
    - Can be attached in the same turn (normal Equipment rules)
    - Do not have implicit attachment requirements (unlike Aura tokens)
    - Can be equipped or attached by other effects

AURA TOKEN COPY EDGE CASES:

  If the source Aura was attached to [creature A] and is still attached:
    - Token copy enters attached to the same [creature A]
    - Both Aura (source) and token (copy) are on [creature A]
    - Normal enchantment stacking rules apply

  If the source Aura's target is removed before token creation:
    - Token has no valid target to attach to
    - Token is created without a target → ceases to exist (CR 704.5d)

  If the source Aura would create multiple tokens (Doubling Season):
    - Each token must be attached independently
    - All tokens attached to the same creature
    - All token ETB triggers fire

PANHARMONICON AND AURA TOKENS:

  Panharmonicon ({3}{U}{U}): "If an artifact or creature enters and it triggers
    an ability, that ability triggers an additional time."

  Question: Does Panharmonicon double the ETB trigger of an Aura token?
  Answer: YES — the Aura token enters the battlefield (it's an ETB event); ETB
    triggers fire for the token (CR 603.6b); Panharmonicon sees this and doubles
    the trigger. The Aura token's attachment is not a triggered ability, so it
    doesn't get doubled — only the ETB ability fires twice.
```

## Definitive Conclusions

- **Aura tokens must attach during creation** — attachment happens in Layer 1, not Layer 6; the token ceases to exist if it cannot attach (CR 614.1c).
- **Attachment is automatic and non-targeted** — shroud/hexproof don't prevent Aura token attachment; the attachment link is established as part of token creation.
- **Equipment tokens enter unattached** — they can be equipped or attached via other effects in the same turn, but have no implicit attachment requirement.
- **ETB triggers fire for tokens** — Aura tokens' ETB abilities fire immediately upon entering attached (CR 603.6b); Panharmonicon doubles these triggers.
- **Attachment persists through layers** — the physical link established in Layer 1 remains through Layers 2–7; it only breaks via removal or explicit detachment.
- **Token copies preserve attachment relationships** — a token copy of an Aura attached to creature X enters attached to creature X (the same target).

## Canonical Example

**Arna Kennerüd Creates Aura Token:**

You control Arna Kennerüd, Skycaptain ({2}{W}{U}{B}: 4/4) with an Aura enchanting it (e.g., Curious Pair grants +1/+1 and flying). You activate Arna: "Whenever a modified creature you control attacks, double the number of each kind of counter on it. Then for each nontoken permanent attached to it, create a token that's a copy of that permanent attached to that creature."

Arna attacks. Arna's first ability fires (doubling counters, if any). Arna's second ability fires: Create a token that's a copy of Curious Pair attached to Arna.

Token enters the battlefield as a copy of Curious Pair, **attached to Arna**. The token's ETB ability (if Curious Pair had one) fires. Both the source Aura and the token Aura are now enchanting Arna (normal stacking).

**Example 2 — Doubling Season + Aura Token:**

You control Doubling Season. Arna Kennerüd (with one attached Aura) attacks. Arna's ability creates a token copy of the Aura.

Doubling Season doubles token creation: one Aura token → two Aura tokens. Both tokens enter the battlefield attached to Arna. Both ETB triggers fire (or one is doubled by Panharmonicon if it exists). Arna is now enchanted by: source Aura + 2 token copies = 3 total Auras.

**Example 3 — Aura Token with No Valid Target:**

You control Arna Kennerüd enchanted by an Aura. The creature has Protection from White (Arna is white). Arna's ability tries to create a token copy of the white Aura.

The Aura token must attach to Arna, but Arna has protection from white → the Aura cannot attach. Token ceases to exist (CR 704.5d). No token is created.

## Commonly Confused With

- **P004 (Continuous Effects Layer Order)** — P004 covers the seven-layer system; P531 applies layer order specifically to token attachment (Layer 1 phenomenon, not Layer 6).
- **P006 (Triggered Ability Double-Trigger)** — P006 covers whether abilities fire once or twice; P531 clarifies when they fire (at token creation, not layer application).
- **P018 (Static Ability Scope)** — P018 covers whether static effects apply in all zones; P531 clarifies that attachment (a static link) is established during Layer 1.
