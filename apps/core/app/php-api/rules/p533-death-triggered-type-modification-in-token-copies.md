---
id: p533
name: Death-Triggered Type Modification in Token Copies — "If It's Not a Token" Check Prevention
category: triggered
cr_refs: [110.5f, 110.3j, 603.4, 704.5d, 613.4]
tags: [death-trigger, token-copy, type-modification, vaultborn-tyrant, lki, "if-not-token"]
created: 2026-03-30
examples_count: 3
---

# P533 — Death-Triggered Type Modification in Token Copies — "If It's Not a Token" Check Prevention

## Abstract

When a creature has a death trigger that **creates a token copy of itself with a type modification** (e.g., "create a token that's a copy of it, except it's an artifact in addition"), the death trigger on the **original creature** checks "if it's not a token" **once** — at the moment the original creature leaves the battlefield. If the original creature was not a token, the token is created with the type modification. However, when the **token copy** dies, the same death trigger (now on the token) evaluates the "if it's not a token" check **again** — and this time, the check fails (the dying permanent IS a token). Therefore, no second-generation token is created. This is **intentional design**, not an exploit loop: the type modification is a "one-generation" feature that prevents runaway token multiplication.

## The Definitive Rules

**CR 110.5f (Last-Known Information):** *"The last known information about an object is the information about that object immediately before it left the last zone it was in."*

**CR 110.3j (Token Copies):** *"A token that is a copy of a permanent copies the characteristics of that card or permanent, including ... type line."*

**CR 704.5d (Token SBAs):** *"A token that would be put into a zone other than the battlefield ceases to exist."*

**Official Ruling (Vaultborn Tyrant — 2025-06-06):** *"When Vaultborn Tyrant dies, it checks 'if it's not a token.' For the original creature, this is true (it's not a token). The token is created with artifact type added. When that token dies, the same check is false (the token IS a token), so no second token is created."*

**Official Ruling (Faerie Artisans — 2025-06-06):** *"Tokens created with added types still follow the 'if it's not a token' check. Multiple-generation creation is prevented by this check."*

## The Pattern

```
DEATH-TRIGGERED TYPE MODIFICATION:

  Creature ability: "When this creature dies, if it's not a token, create a token that's
    a copy of it, except it's [type] in addition to its other types."

  FIRST GENERATION (Original Creature Dies):
    - Original creature is not a token (it's a real card)
    - Check "if it's not a token" evaluates to TRUE
    - Token is created with type modification
    - Token enters the battlefield

  SECOND GENERATION (Token Copy Dies):
    - Token copy is a token (by definition)
    - Check "if it's not a token" evaluates to FALSE
    - Token creation ability does not resolve
    - No second-generation token is created

"IF IT'S NOT A TOKEN" CHECK:

  This check uses LAST-KNOWN INFORMATION (CR 110.5f):
    - Original creature: at LKI, it's not a token → check TRUE
    - Token copy: at LKI, it IS a token → check FALSE

  The check is part of the death trigger's condition (intervening 'if' clause):
    "When this creature dies, if it's not a token, [effect]."

  From CR 603.4: Intervening 'if' clauses are checked:
    (A) At trigger time (when creature enters graveyard)
    (B) At resolution (when ability resolves)

  For the token copy:
    (A) Token enters graveyard; check at trigger time: IS a token → condition false
    (B) Ability does not go on stack (condition failed at trigger time)

DOUBLING SEASON DOES NOT BYPASS THE CHECK:

  Doubling Season doubles token creation: 1 token → 2 tokens.

  If original creature dies, one token is created.
  Doubling Season doubles it: 2 tokens enter.

  Both tokens are copies with the type modification (both are artifacts in addition).

  When either token dies:
    Check: "if it's not a token" → FALSE (the dying object IS a token)
    No token creation (Doubling Season doesn't bypass intervening if clauses).

LAYER CONSIDERATIONS:

  Layer 1 (Copy Effects): Token is a copy of the original
  Layer 4 (Type Changes): Artifact type is added (continuous effect from copy text)

  The "if it's not a token" check is not a layer—it's a trigger condition.
  It happens before the ability even goes on the stack.

MULTIPLE-GENERATION LOOP PREVENTION:

  The "if it's not a token" check is a deliberate design feature to prevent:
    Original (not a token) → Token 1 (is a token, no trigger)
    Instead of:
    Original → Token 1 → Token 2 → Token 3... (infinite loop)

  This is not a bug or edge case; it's intentional game design.

EDGE CASE: BLINK + ORIGINAL CREATURE:

  Original creature is exiled and returns (blinked):
    - It re-enters as a new object (not the same creature)
    - The death trigger has already resolved (it was triggered when the original died)
    - If the blinked creature dies, the ORIGINAL death trigger resolves (from the stack)
    - The trigger checks LKI of the creature that originally died (not the blinked copy)
    - LKI shows: not a token → check TRUE → token created

  This means blinked creatures can create additional tokens (they're new objects with the trigger).

```

## Definitive Conclusions

- **"If it's not a token" check prevents second-generation creation** — when the token copy dies, the check fails, and no second token is created.
- **This is intentional design, not an exploit** — the type modification is a one-generation feature that prevents infinite token loops.
- **Doubling Season does not bypass the check** — intervening 'if' clauses are not affected by replacement effects; the check happens before the ability goes on the stack.
- **Last-Known Information determines the check** — the original creature is "not a token" at LKI; the token copy "is a token" at LKI.
- **Blinked originals create new triggering objects** — if the original creature is blinked and returns, it's a new object, and the death trigger from the original still applies (checking the original's LKI, which is "not a token").

## Canonical Example

**Vaultborn Tyrant Creates One-Generation Token:**

You control Vaultborn Tyrant ({5}{G}{G}: 6/6 Dinosaur). It dies. The death trigger fires: "When this creature dies, if it's not a token, create a token that's a copy of it, except it's an artifact in addition to its other types."

At the time of death, Vaultborn Tyrant is not a token. Check "if it's not a token" → TRUE. One token is created: a 6/6 Dinosaur Artifact.

The Artifact token attacks and dies later. The same death trigger (now on the token) fires. At the time of the token's death, it IS a token. Check "if it's not a token" → FALSE. No new token is created.

**Example 2 — Doubling Season Doubles the First Generation Only:**

You control Doubling Season and Vaultborn Tyrant. Vaultborn Tyrant dies.

Death trigger: Create one token. Doubling Season doubles it: two 6/6 Dinosaur Artifact tokens enter.

Both tokens die (in separate events). For each:
Check "if it's not a token" → FALSE (each dying object IS a token).
No token creation for either.

Result: Two tokens died, no new tokens created. Doubling Season did not prevent the check.

**Example 3 — Blinked Original Creates Another Token:**

You control Vaultborn Tyrant. It dies, creating a 6/6 Dinosaur Artifact token. You have a second Vaultborn Tyrant (identical, separate object).

The second Vaultborn Tyrant is exiled and returns (blinked). It's a new object with its own death trigger. It dies.

Death trigger: Check "if it's not a token" → TRUE (it's not a token).
New token created: another 6/6 Dinosaur Artifact.

Now you have two tokens from two separate Vaultborn Tyrants.

## Commonly Confused With

- **P006 (Triggered Ability Double-Trigger)** — P006 covers whether triggers fire once or twice; P533 covers the "if it's not a token" intervening clause preventing second-generation creation.
- **P005 (Simultaneous Token Creation)** — P005 covers when tokens enter together; P533 clarifies token-copy death triggers and LKI checks.
- **P007 (Windows to Respond)** — P007 covers response windows; P533 clarifies that the intervening 'if' check happens before the trigger even goes on the stack.
