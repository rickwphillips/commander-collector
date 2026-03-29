---
id: p192
name: Job Select — Equipment ETB Creates and Equips to Hero Token
category: triggered
cr_refs: [702.182a]
tags: [job-select, equipment, hero-token, etb, auto-equip, Final-Fantasy, Universes-Beyond]
created: 2026-03-28
examples_count: 2
---

# P192 — Job Select — Equipment ETB Creates and Equips to Hero Token

## Abstract
Job Select is a triggered ability from the Final Fantasy Universes Beyond set. When an Equipment with Job Select enters the battlefield, it creates a 1/1 colorless Hero creature token, then attaches itself to that token. This is a self-contained deployment: the Equipment arrives and immediately finds its wielder. No equip cost is needed — the Equipment auto-attaches to the freshly-created token. This represents the "job system" in Final Fantasy: characters take on roles by equipping weapons or armor that define their job class.

## The Definitive Rules

**CR 702.182a** (verbatim): *"Job select is a triggered ability. 'Job select' means 'When this Equipment enters, create a 1/1 colorless Hero creature token, then attach this Equipment to it.'"*

## The Pattern

```
JOB SELECT:
  Triggered ETB ability: "When this Equipment enters..."
  Trigger fires when Equipment enters the battlefield
  Effect: create a 1/1 colorless Hero creature token
  Then: attach the Equipment to that token (no equip cost)

  JOB SELECT + TOKEN CREATION:
    Token is 1/1 colorless Creature — Hero subtype
    Hero subtype has no inherent rules (creature type, not a class/enchantment)
    The token is created first, THEN the Equipment attaches
    Token enters the battlefield, then Equipment attaches to it

  JOB SELECT + EQUIPMENT RULES:
    The Equipment becomes attached to the token without paying equip cost
    Equip cost is NOT paid here — this is the job select ETB effect
    Equip cost can still be paid later to move the Equipment to another creature
    If the Hero token dies: Equipment becomes unattached (falls off), can re-equip

  JOB SELECT + ENTER TRIGGERS:
    Hero token entering the battlefield: triggers any "whenever a creature enters" effects
    Equipment entering: triggers any "whenever an artifact enters" effects
    Both enter the battlefield (token first, Equipment attaches after token exists)

  JOB SELECT + MULTIPLE COPIES:
    Cast two Equipment cards with Job Select: each creates its own Hero token and attaches to it
    Two Hero tokens, each with their own Equipment
    In Commander/multiplayer: can build an army of equipped Heroes

  JOB SELECT + BLINKING EQUIPMENT:
    Blink/exile-return the Equipment: triggers Job Select again (new ETB)
    Creates another Hero token and re-attaches the Equipment
    Previous Hero token stays (now without equipment); new token gets equipped
    Can accumulate Hero tokens via repeated blinks

  JOB SELECT + HERO SYNERGIES:
    Equipment with buffs applying to the attached creature: the Hero token starts at 1/1
    Equipment might give +2/+2: Hero becomes a 3/3 for free
    Equipment with keywords (flying, lifelink, etc.): granted to the 1/1 Hero token
    Final Fantasy flavor: "job class" abilities defined by the equipment

  JOB SELECT + TRIBAL:
    Hero is a creature subtype — tribal effects for Heroes (if any) would apply
    Currently a new subtype (Final Fantasy UB set), so tribal payoffs are within that set

  JOB SELECT COMPARISON:
    For Mirrodin! (P184): ETB creates a 2/2 red Rebel token and attaches — similar pattern
    Job Select: creates a 1/1 colorless Hero token and attaches
    Both are Equipment-creates-creature-then-equips patterns
    Key difference: Final Fantasy vs Phyrexia flavor; token types differ
```

## Definitive Conclusions

- **Job Select is a triggered ETB** — fires when the Equipment enters the battlefield.
- **Creates a 1/1 colorless Hero token**, then attaches the Equipment to it.
- **No equip cost** — the attachment is part of the trigger effect.
- **Blink resets** — exile/return the Equipment creates a new Hero token and re-equips.
- **Final Fantasy UB set** — Hero subtypes synergize within the set.

## Canonical Example
**Buster Sword (Equipment with Job Select, gives +3/+2 and haste):**
Cast Buster Sword (Equipment). Job Select triggers.
Creates a 1/1 colorless Hero token. Attaches Buster Sword to it.
Hero token is now 4/3 with haste.
If Buster Sword is subsequently unequipped from the Hero and equipped elsewhere:
The Hero token is still 1/1 (loses the +3/+2 from the sword).
If Buster Sword is blinked: a NEW 1/1 Hero token is created, Buster Sword attaches to the new one.
Two Hero tokens now — old one unequipped, new one equipped.

**Example 2 — Job Select in Commander:**
Multiple Job Select Equipments in a Final Fantasy-themed Commander deck.
Each Equipment cast: creates a Hero token and equips for free.
With 4 Job Select Equipments cast over 4 turns: 4 Hero tokens, each equipped.
Eerie Interlude (blink all your creatures) exits and returns: the tokens leave and return.
When the Equipment re-enters? No — Equipment might not have blinked.
If only tokens blink: Equipment detaches when tokens leave, then tokens return unequipped.
But if blink a permanent with Job Select — it would re-trigger, creating new tokens.

## Commonly Confused With
- **P184 (For Mirrodin!)** — For Mirrodin! creates a 2/2 red Rebel token then attaches. Same structure, different set/flavor/token type.
- **P178 (Reconfigure)** — Reconfigure toggles Equipment being a creature itself, not creating a new token.
- **P192 vs Equip Cost** — Job Select bypasses equip cost for initial attachment; equip cost still applies for later equip actions.
