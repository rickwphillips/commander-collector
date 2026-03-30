---
id: p532
name: Permanent Ability Transfer to Tokens via Zone-Referenced Cards — Host-Dependent Persistence
category: continuous
cr_refs: [113.6, 607.1, 614.1, 704.5d, 110.4]
tags: [ability-transfer, zone-reference, token, artifact, food, host-dependent, hazel-brewmaster]
created: 2026-03-30
examples_count: 3
---

# P532 — Permanent Ability Transfer to Tokens via Zone-Referenced Cards — Host-Dependent Persistence

## Abstract

Some permanents grant **all activated abilities** of cards in a specific zone (usually exile) to tokens. When a token gains these abilities, the token can execute them — even if the token is not a creature and the original ability has creature-only restrictions. **Critical distinction**: the abilities are **contingent on the host permanent** (the one granting them) remaining on the battlefield. If the host leaves the battlefield, the granted abilities cease immediately (they are not a "linked pair" under CR 607.2, but a **duration-based grant** under CR 607.1). The transferred abilities are rewritten with "this permanent" replacing the source card name. Tokens can gain activated abilities; triggered and static abilities are generally excluded unless explicitly granted.

## The Definitive Rules

**CR 113.6 (Granted Abilities):** *"An object can gain an ability that another object has. This ability is treated exactly as though the object that gained it were the original source of the ability."*

**CR 607.1 (Linked Abilities):** *"A duration for an effect is expressed as '[Duration] for as long as [permanent] remains on the battlefield.' If a permanent that's in a duration clause leaves the battlefield, the effect expires."*

**Official Ruling (Hazel's Brewmaster — 2025-04-04):** *"Food tokens you control have all activated abilities of all creature cards exiled with Hazel's Brewmaster. If Hazel's Brewmaster leaves the battlefield, those abilities cease."*

**Official Ruling (Agatha's Soul Cauldron — 2025-04-04):** *"The ability doesn't require the creature to be in exile anymore; once granted to the token, the ability persists as long as the Host permanent remains on the battlefield."*

**Official Ruling (Dark Impostor — 2025-04-04):** *"Creature abilities granted to other permanents via Dark Impostor cease if Dark Impostor leaves the battlefield or the exiled creature leaves exile."*

## The Pattern

```
ABILITY TRANSFER TO TOKENS:

  Permanent effect: "Tokens you control have all activated abilities of all [cards/creatures]
    [in zone X]."

  When token gains these abilities:
    - Activated abilities TRANSFER (and can be activated by token)
    - Triggered abilities are EXCLUDED (only by explicit rule text)
    - Static abilities are EXCLUDED (only by explicit rule text)
    - Token can execute any granted activated ability

  Rewriting rule: "Ability text references [source card name]" becomes "[this permanent]"
    Example: Creature exiled has "{T}: Target opponent discards a card."
             Token gains: "{T}: Target opponent discards a card." (same ability)

    If source ability had "Whenever this creature deals combat damage":
      Token gains: "Whenever this permanent deals combat damage" (if damage is possible for token)

CREATURE-ONLY COST RESTRICTIONS:

  If exiled creature has ability "{B}, Sacrifice a creature: Draw a card":
    Token (which is a non-creature Food artifact) gains this ability.
    Can the Food token execute it? YES — it can tap itself (if it has tap ability).
    Can the Food sacrifice itself? DEPENDS — if the ability says "sacrifice a creature,"
      and Food is not a creature, the Food cannot be sacrificed. BUT if the ability says
      "sacrifice a permanent," the Food can be sacrificed.

  If exiled creature has ability "{T}: Add {U}":
    Token gains this. Token can tap itself for {U} (mana abilities don't require creature type).

HOST-DEPENDENT PERSISTENCE:

  The granted abilities persist "for as long as [host] remains on the battlefield."

  If host (e.g., Hazel's Brewmaster) leaves the battlefield:
    - Granted abilities cease IMMEDIATELY
    - Token still exists but has no granted abilities
    - If host returns (blinked, reanimated), abilities are granted again

  If exiled source card is removed from exile:
    - Granted abilities PERSIST (they don't track the source anymore)
    - Example: Hazel's Brewmaster exiles creature, grants Food tokens its abilities.
      If creature is returned from exile (Pull from Eternity), Food still has the abilities
      (they're "granted," not "referenced").

  This is different from "linked abilities" (CR 607.2), which break when the source leaves.
  This is a "duration-based grant" (CR 607.1) that persists with the host.

ZONE-REFERENCE VS. LINKED ABILITIES:

  Linked Ability Pair (e.g., Oblivion Ring):
    - First ability exiles a card
    - Second ability returns it when source leaves
    - If first ability hasn't triggered, second ability doesn't have a target
    - When source leaves, the return effect breaks (no card to return)

  Duration-Based Grant (e.g., Hazel's Brewmaster):
    - Source permanently exiles cards
    - Granted abilities persist as long as source is on field
    - If source leaves, the grant duration ends (but exiled cards stay exiled)
    - If source returns, grant resumes (no explicit return needed)

MULTIPLE EXILED CREATURES:

  Hazel's Brewmaster exiles Creature A, then Creature B.
  Food tokens gain ALL abilities of both A and B (all abilities compound).
  If A is removed from exile, Food still has B's abilities (and A's if they transferred).
  If Hazel leaves, ALL granted abilities cease.

TOKEN EXECUTION OF GRANTED ABILITIES:

  Food token gains {T}: "Target opponent discards a card."
    → Food can activate this (as long as Hazel's is on field)

  Food token gains "Whenever this creature deals combat damage":
    → Food cannot deal combat damage (it's not a creature, not a combatant)
    → Trigger never fires (precondition fails)

  Food token gains "{2}, Sacrifice this creature: Draw a card":
    → Food can pay {2} and sacrifice itself (if the ability says "permanent" or "Food")
    → If ability explicitly says "sacrifice a creature," Food cannot do it (not a creature)

DOUBLING SEASON AND GRANTED ABILITIES:

  Doubling Season doubles tokens created, NOT abilities granted to existing tokens.
  → If Hazel creates a Food token under Doubling Season, one token → two tokens
  → Both tokens have the same granted abilities (they both gain ALL abilities of exiled creatures)
```

## Definitive Conclusions

- **Granted activated abilities persist on tokens** — tokens can execute any activated ability from exiled creatures, rewritten with "this permanent" replacing source names.
- **Granted abilities are host-dependent, not source-dependent** — if the host (Hazel's Brewmaster) leaves, granted abilities cease; if the exiled source leaves, granted abilities persist.
- **Creature-only restrictions apply per ability text** — if an ability says "sacrifice a creature," a non-creature token cannot execute it; if it says "sacrifice a permanent," the token can.
- **Triggered and static abilities are not granted** — only activated abilities transfer unless the host explicitly says otherwise.
- **Tokens with granted abilities can activate multiple times** — the duration persists (as long as host is on field), not one-use-per-duration.

## Canonical Example

**Hazel's Brewmaster Grants Food Token Abilities:**

You control Hazel's Brewmaster ({3}{B}: 1/3). During your turn, you activate Hazel's ability: "exile a card from a graveyard" (let's say Viscera Seer, a creature with "{1}: Sacrifice another creature. If you do, Viscera Seer gets +1/+1 until end of turn and you gain 1 life."). You create a Food token.

Food token gains: "{1}: Sacrifice another permanent. If you do, this permanent gets +1/+1 and you gain 1 life."

You can now activate this ability on your Food token, sacrificing another creature (or permanent) to pump the Food and gain life. The ability persists as long as Hazel's Brewmaster is on the battlefield.

**Example 2 — Multiple Exiled Creatures:**

You control Hazel's Brewmaster. Over time, you exile Creature A (with ability "{T}: Add {U}") and Creature B (with "{2}, Tap, Sacrifice: Draw a card").

Your Food token gains BOTH abilities:
- "{T}: Add {U}" (from A)
- "{2}, Tap, Sacrifice: Draw a card" (from B)

You can now activate either ability on the Food, as long as Hazel's remains on field.

**Example 3 — Host Leaves, Grant Ends:**

You control Hazel's Brewmaster with Food tokens that have granted abilities. Opponent casts Swords to Plowshares, exiling Hazel's Brewmaster.

All Food tokens IMMEDIATELY lose the granted abilities. The tokens still exist (they're permanents), but they no longer have the activated abilities from the exiled creatures. If Hazel's were somehow reanimated, the grant would resume.

## Commonly Confused With

- **P006 (Triggered Ability Double-Trigger)** — P006 covers triggered ability timing; P532 covers activated ability transfer and host-dependency.
- **P607 (Linked Abilities and Exile)** — P607 covers linked-ability pairs that break; P532 clarifies that grants use CR 607.1 (duration), not CR 607.2 (linked pairs).
- **P018 (Static Ability Scope)** — P018 covers whether static effects apply across zones; P532 clarifies that granted abilities apply only while host is on field.
