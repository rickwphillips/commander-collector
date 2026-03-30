---
id: p489
name: Craft — Transformation Object Identity, Response Windows, and "Used to Craft" Tracking
category: zones
cr_refs: [702.185, 400.7, 400.7a, 112.7a, 601.2b, 603.2, 706.2, 706.10, 704.5q]
tags: craft, transform, object-identity, new-object, response-window, stifle, used-to-craft, exile-tracking, DFC, lost-caverns-ixalan, locus-of-enlightenment, mastercraft-raptor, throne-grim-captain
created: 2026-03-29
examples_count: 7
---

# P485 — Craft — Transformation Object Identity, Response Windows, and "Used to Craft" Tracking

## Abstract

**Craft** (CR 702.185, Lost Caverns of Ixalan 2023) is an activated ability that exiles the craft source card plus specified materials to return the card transformed under its owner's control. While P476 covers the basic mechanism, three deeper edge-case clusters remain underexplored: (1) whether the transformed back face is the "same object" as the front face for targeting and counter purposes; (2) the response window between paying the craft cost and the ability resolving — what can opponents do and what happens if the source is removed in response; and (3) how back faces that reference "cards used to craft it" track those exiled materials through controller changes, copy effects, and re-exile scenarios. These combine in non-obvious ways on cards like *Locus of Enlightenment*, *Mastercraft Raptor*, and *The Grim Captain*.

## The Definitive Rules

### Craft Activation and Cost Payment (CR 702.185, 601.2b)
Craft is an activated ability. Activating it follows the normal procedure: declare intent, pay costs (mana + exile this + exile materials). Once costs are paid and the ability is on the stack, the materials are already in exile. The ability then resolves (sorcery speed restriction means this must happen at sorcery speed — typically your main phase with an empty stack).

### Object Identity After Transformation (CR 706.2, 400.7)
When a double-faced card transforms, it remains the same object. The card doesn't change zones — it's still the same physical card on the battlefield (or wherever) but now showing the back face. Transformation preserves counters, attachments, and identity.

**However, Craft is different.** The front-face craft permanent is exiled as a cost, goes to the exile zone, and then the ability returns it transformed to the battlefield. This is a zone change: exile → battlefield. By CR 400.7, objects that move between zones become new objects (with new object identity) — they lose all memory of their previous state. The returned back face is a **new object** on the battlefield.

### What Happens If the Source Is Removed in Response (CR 112.7a, 602.2b)
When you activate a craft ability, the exile of the craft source is part of the cost. The source is exiled the moment you activate the ability (when costs are paid). If an opponent responds to the craft ability on the stack, the craft source is already in exile — they cannot destroy it to prevent the craft. However:
- If the ability itself is countered (Stifle), the card stays in exile and does NOT return to the battlefield. The materials remain exiled.
- If the ability resolves but the card "isn't a transforming double-faced card" (e.g., the card was somehow replaced with a non-DFC copy), it stays in exile and doesn't return per CR 702.185 ruling.

### "Used to Craft" Tracking (CR 702.185 official rulings, 2023-11-10)
The back face of some Craft cards gains abilities based on what was exiled to craft them. "Cards used to craft it" are tracked as long as:
- Those cards remain in exile, AND
- The crafted permanent remains on the battlefield

Tracking persists through controller changes and copy effects on the crafted permanent. If the crafted permanent leaves the battlefield, the tracking ends. If the exiled materials are somehow removed from exile (unusual), the tracking ends for those cards.

**Token exception:** Tokens exiled as craft materials don't remain in exile (tokens cease to exist when they leave play). They are considered "used to craft" momentarily, but since they don't persist in exile, any ability that references "exiled cards used to craft it" will find nothing for those tokens.

## The Pattern

```
CRAFT ACTIVATION sequence:
  1. Declare craft ability activation (sorcery speed only)
  2. Pay costs simultaneously:
     a. Pay mana cost
     b. Exile this card (the front face)
     c. Exile required materials (from battlefield and/or GY as specified)
  3. Craft ability is on the stack (can be responded to)
  4. Ability resolves → card returns to battlefield transformed (back face)

KEY: costs are paid BEFORE the ability goes on the stack (step 2 before step 3)
  → Opponents cannot destroy the craft source to prevent the craft
  → The source is already in exile when the ability hits the stack

RESPONSE WINDOW — what opponents CAN do:
  → Stifle / Trickbind the craft ability: source stays in exile, ability doesn't resolve
     → Materials stay exiled too — permanent loss for the crafter
  → Respond to the trigger/ability after it's on the stack with removal of:
     → Other permanents on battlefield (craft doesn't care about these)
     → Redirect opponents' own plans
  → Cannot: Destroy the craft source (already exiled)
  → Cannot: Remove materials (already exiled)

OBJECT IDENTITY — front face vs. back face:
  → Craft involves exile then return (zone change: battlefield → exile → battlefield)
  → The returned back face is a NEW OBJECT (CR 400.7)
  → This means:
     → Counters on the front face are gone (new object has no memory of them)
       → Exception: if the back face enters with counters as part of its own text
     → Auras/Equipment attached to the front face fall off at exile, may re-attach
       to the back face if legal (Equipment must be re-equipped as a new action;
       Auras may re-attach or go to GY per SBAs)
     → Spells or abilities targeting the front face fizzle (no longer legal target)
     → Delayed triggers that referenced the front face by ID no longer apply
  → Compare to simple transform (DFC transforming without zone change):
     → DFC transforming in place (Innistrad werewolves, Ixalan flip lands):
        SAME object, counters preserved, auras stay attached, targets still valid

CRAFT vs. in-place TRANSFORM:
  Craft: exile source + return transformed → NEW OBJECT (zone change occurred)
  Transform in-place (e.g., Delver of Secrets): no zone change → SAME OBJECT

"USED TO CRAFT" TRACKING:
  After crafting, back face abilities reference "exiled cards used to craft it":
    → Locus of Enlightenment: gains activated abilities of the exiled cards
    → Mastercraft Raptor: power = total power of exiled Dinosaur cards
    → The Grim Captain: can put exiled crafted creatures onto battlefield attacking

  Tracking rules:
    → The exiled materials are "used to craft it" as long as:
       a) They remain in exile
       b) The crafted permanent is on the battlefield
    → Controller change on the crafted permanent: tracking continues
       (materials are still considered used to craft it — the ability works for new controller)
    → Copy effects on the crafted permanent: tracking continues for the original
       (the copy itself doesn't have "used to craft" materials — it's a copy, not a crafted card)
    → Crafted permanent leaves battlefield: tracking ends
    → Materials removed from exile: tracking ends for those specific cards
    → Token materials: never persist in exile → tracking is vacuously empty
       → Locus of Enlightenment would gain no abilities from a token's "abilities"
       → Mastercraft Raptor's power contribution from a token = 0 (nothing in exile)

NON-DFC COPIES receiving Craft:
  → If a non-DFC object copies a card with Craft and you activate that craft ability:
    → The non-DFC card is exiled (cost paid)
    → The ability resolves, but the card cannot return transformed (not a DFC)
    → The card stays in exile (CR 702.185 ruling: non-DFC stays in exile)
```

## Definitive Conclusions

**Object Identity:**
- Craft creates a NEW object on the battlefield (zone change breaks identity), unlike in-place transform which preserves identity. This is one of the most important distinctions in the set. A player who attaches Equipment to a Craft artifact and then crafts it will lose the Equipment attachment — the Equipment becomes unattached when the front face is exiled and must be re-equipped to the back face.
- Spells that target the front-face craft card on the battlefield (e.g., "Exile target artifact with a craft ability") fizzle if the front face has already been exiled as part of crafting costs by the time they try to resolve.

**Response to Craft:**
- The main counterplay against Craft is Stifle-type effects on the ability itself, not removal on the source. Once you see someone tap to activate a craft ability and pay costs, the source is already gone. Stifling the ability creates the worst outcome for the crafter: source lost, materials lost, back face never enters.
- Timing note: Craft says "only as a sorcery" — this means you can only activate craft during your own main phase when the stack is empty. It's not castable at instant speed and cannot be done in response to anything.

**"Used to Craft" Edge Cases:**
- *Mastercraft Raptor*: its power is equal to the total power of the Dinosaur cards used to craft Saheeli's Lattice. If those Dinosaur cards have power defined by a characteristic-defining ability (e.g., "power = number of permanent cards in your GY"), the power is checked continuously in exile. The Raptor's power changes dynamically as conditions change.
- *Locus of Enlightenment* (The Enigma Jewel's back face): gains each activated ability of the exiled cards "used to craft" it. Self-references in those abilities are redirected to Locus of Enlightenment (e.g., an ability saying "Sacrifice CARDNAME: draw a card" becomes "Sacrifice Locus of Enlightenment: draw a card"). Each borrowed ability may be activated only once per turn per ability instance — if two copies of the same card were exiled, Locus has two instances of that ability and can use each once per turn.
- *The Grim Captain* (back face of Throne of the Grim Captain): requires four distinct creature types exiled to craft it. One Changeling is NOT sufficient — the four creatures must be four separate objects. The put-onto-battlefield-attacking effect allows choosing which player/planeswalker the entering creature attacks (doesn't have to match the Captain's attack direction).

## Canonical Examples

**Object identity reset on Craft:**
- Player has a *Tithing Blade* with a +1/+1 counter on it (from some effect). Activates Craft. Tithing Blade is exiled (front face). Consuming Sepulcher (back face) enters as a new object — the +1/+1 counter is gone.

**Stifle counters Craft — worst case:**
- Player activates Craft on Unstable Glyphbridge, exiling it and an artifact (materials). Opponent Stifles the craft ability. Unstable Glyphbridge stays in exile, the artifact material stays in exile. The Sandswirl Wanderglyph back face never appears. Crafter has lost both the Glyphbridge and the material permanently.

**"Used to Craft" with token materials:**
- Player crafts Throne of the Grim Captain exiling a Zombie token (as the Vampire requirement, if somehow applicable) plus three creature cards. The Grim Captain's attack trigger says "put an exiled creature card used to craft The Grim Captain onto the battlefield." The Zombie token is not a card, not in exile — Grim Captain can only return the actual creature cards, not the token.

**Locus of Enlightenment self-reference redirect:**
- Player crafts The Enigma Jewel into Locus of Enlightenment, exiling a creature with "{2}, {T}: Sacrifice CARDNAME: draw two cards." Locus of Enlightenment gains that ability but the text now reads "{2}, {T}: Sacrifice Locus of Enlightenment: draw two cards." Activating it sacrifices Locus of Enlightenment itself.

## Commonly Confused With

- **P476** (Prototype/Read Ahead/Craft basics) — P476 covers what Craft does and basic material rules; this pattern covers the object identity implications of the zone change and "used to craft" edge cases
- **P003** (Zone Change Identity) — General rule that objects moving zones become new objects; Craft is a specific application of this rule via exile-and-return
- **P055** (Champion) — Champion also exiles on ETB and returns from exile; both use linked abilities and exile tracking, but Champion involves zone-change of another permanent (not self)
- **P011** (Linked Ability Zone Reset) — Linked abilities lose their memory after zone change; "used to craft" is a special exception that survives on the battlefield by design (explicit oracle text tracking)
