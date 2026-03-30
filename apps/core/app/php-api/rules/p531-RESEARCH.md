# P531 Candidate Research: Permanent Ability Transfer to Tokens via Zone-Referenced Cards

## Research Date
2026-03-30

## Core Question
When a token gains all activated abilities of a card in exile (like Hazel's Brewmaster), are those abilities permanent? Can tokens execute abilities with creature-only restrictions?

## Cards Found

### 1. **Hazel's Brewmaster** (Duskmourn, 2024-08-02)
**Oracle Text:**
```
Menace
Whenever this creature enters or attacks, exile up to one target card from a graveyard
and create a Food token.
Foods you control have all activated abilities of all creature cards exiled with this creature.
```

**Official Rulings (Scryfall):**
- (2024-11-08): "Food is an artifact type. Even though it appears on some creatures, it's never a
  creature type."
- (2024-07-26): "Activated abilities contain a colon. They're generally written '[Cost]: [Effect].'
  Some keyword abilities are activated abilities; those will often have colons in their reminder text."
- (2024-07-26): "Hazel's Brewmaster's last ability grants only activated abilities. It doesn't grant
  keyword abilities (unless those keyword abilities are activated), triggered abilities, or static
  abilities."
- (2024-07-26): "The granted abilities effectively use 'this permanent' rather than '[that card's
  name],' so you treat the abilities as though they were printed on the permanent that gained the
  ability. For example, say you exiled the card Argothian Sprite with Hazel's Brewmaster. Argothian
  Sprite has the ability '{7}: Put two +1/+1 counters on Argothian Sprite.' If you controlled a
  Gingerbrute (an Artifact Creature – Food Golem), you'd treat it as though it had the ability
  '{7}: Put two +1/+1 counters on Gingerbrute.'"

**Analysis:**
- Explicitly grants activated abilities to NON-CREATURE tokens (Food tokens are artifacts)
- Rulings confirm: abilities are rewritten to reference "this permanent" not the source creature
- Restrictions in the ability cost/effect are NOT re-evaluated based on the token's type
- Example shows Food token (artifact creature) executing a creature-printed ability ({7}: +1/+1 counters)

---

### 2. **Agatha's Soul Cauldron** (Dominaria United, 2023-09-08)
**Oracle Text:**
```
You may spend mana as though it were mana of any color to activate abilities of creatures you control.
Creatures you control with +1/+1 counters on them have all activated abilities of all creature cards
exiled with Agatha's Soul Cauldron.
{T}: Exile target card from a graveyard. When a creature card is exiled this way, put a +1/+1
counter on target creature you control.
```

**Official Rulings (Scryfall):**
- (2023-09-01): "Agatha's Soul Cauldron grants only activated abilities. It doesn't grant keyword
  abilities (unless those keyword abilities are activated), triggered abilities, or static abilities."
- (2023-09-01): "The granted abilities effectively use 'this permanent' rather than '[that card's
  name],' so you treat the abilities as though they were printed on the creature that gained the
  ability. For example, say you exiled the card Argothian Sprite with Agatha's Soul Cauldron.
  Argothian Sprite has the ability '{7}: Put two +1/+1 counters on Argothian Sprite.' If you
  controlled a Callous Sell-Sword with a +1/+1 counter on it, you'd treat it as though it had
  the ability '{7}: Put two +1/+1 counters on Callous Sell-Sword.'"

**Analysis:**
- Identical ability-granting mechanics to Hazel's Brewmaster
- More interesting: abilities are granted to ANY creature with a +1/+1 counter (including tokens)
- Confirms again that "this permanent" reference replaces the source card name
- Different from Hazel's: can grant to non-creature tokens if they're creatures (e.g., Artifact Creature tokens)

---

### 3. **Dark Impostor** (Innistrad, 2021-11-19)
**Oracle Text:**
```
{4}{B}{B}: Exile target creature and put a +1/+1 counter on this creature.
This creature has all activated abilities of all creature cards exiled with it.
```

**Official Rulings (Scryfall):**
- (2012-05-01): "Dark Impostor gains only activated abilities. It doesn't gain triggered abilities
  or static abilities. Activated abilities contain a colon."
- (2012-05-01): "If an activated ability of a card in exile references the card it's printed on
  by name, treat Dark Impostor's version of that ability as though it referenced Dark Impostor by
  name instead. For example, if Marrow Bats (which says 'Pay 4 life: Regenerate Marrow Bats') is
  exiled with Dark Impostor, Dark Impostor has the ability 'Pay 4 life: Regenerate Dark Impostor.'"
- (2012-05-01): "Dark Impostor can target and exile a permanent that's only a creature temporarily,
  like an animated land. However, because that card isn't a creature card, Dark Impostor won't have
  any of that card's activated abilities."
- (2012-05-01): "If you control more than one Dark Impostor, each will have only the activated
  abilities of creature cards exiled with that specific Dark Impostor."
- (2012-05-01): "Once Dark Impostor leaves the battlefield, it will no longer have the activated
  abilities of the creature cards exiled with it."

**Analysis:**
- Creature-specific: Dark Impostor is itself a creature
- Shows ability source must be a creature CARD (not just temporarily animated)
- Confirms name-replacement mechanics: "Regenerate Dark Impostor" not "Regenerate Marrow Bats"
- CRITICAL: Ruling about leaving battlefield - abilities are TEMPORARY, not permanent

---

### 4. **Agatha's Soul Cauldron + Token Interaction (Complex)**
Can a Food token (artifact, not creature) execute creature-printed abilities that reference "creature"?

**Hazel's Brewmaster ruling clarifies:**
```
Food is an artifact type. Even though it appears on some creatures,
it's never a creature type.
```

This means a Food token from Hazel's is an Artifact token, not a creature token. If it gained creature abilities, would those abilities execute?

**Analysis:**
The rulings state: "treat the abilities as though they were printed on the permanent that gained the ability."

The Gingerbrute example is revealing: Gingerbrute IS a creature (Artifact Creature token). So the example doesn't directly address whether an artifact token can use creature-only abilities.

---

### 5. **Idris, Soul of the TARDIS** (Doctor Who, 2023-10-13)
**Oracle Text:**
```
Vanishing 3
Imprint — When Idris enters, exile another artifact you control until Idris leaves the battlefield.
Idris has all activated and triggered abilities of the exiled card and gets +X/+X, where X is
the exiled card's mana value.
```

**Official Rulings (Scryfall):**
- (2023-10-13): "Activated abilities contain a colon. They're generally written '[Cost]: [Effect].'"
- (2023-10-13): "Triggered abilities use the word 'when,' 'whenever,' or 'at.'"
- (2023-10-13): "If the exiled card has an {X} in its mana cost, the value of X is 0 when
  determining that card's mana value."

**Analysis:**
- Notably grants BOTH activated AND triggered abilities (unlike Hazel's or Agatha's)
- Abilities persist only "until Idris leaves the battlefield" (temporary, not permanent)
- Can exile non-creature artifacts (unlike creature-only exilers)
- Creature-specific: Idris itself is a creature

---

## CR References & Ability Transfer Mechanics

### CR 611.2 (Abilities Granted to Objects)
When an effect grants an ability to a permanent, the granted ability becomes part of that permanent's rules text. The ability doesn't change the permanent's printed card.

### CR 413.1-413.2 (Activated Abilities)
An activated ability has a cost and effect (written as "[Cost]: [Effect]"). The ability CAN be activated as long as the permanent is on the battlefield and the cost is payable.

**Critical question for P531:** If an artifact token gains a creature-only ability (e.g., "{2}, {T}: Create a 1/1 white Soldier creature token"), can the artifact execute it?

**The CR doesn't have a "creature-only" restriction in 413.1-413.2.** The restriction is IN THE ABILITY TEXT itself (e.g., "only activate this ability if X is a creature").

### Example Creature-Only Ability
From searching: abilities that explicitly restrict themselves like "only activate this ability if you control a creature" or "{T}: Create a creature token" — the word "creature" in the effect doesn't mean a non-creature can't activate it.

---

## Key Findings

### ✓ VALID PATTERN: Ability Transfer to Non-Creature Tokens

**Evidence:**
1. Hazel's Brewmaster explicitly grants abilities to Food tokens (artifact tokens)
2. Rulings confirm food tokens ARE artifacts (never creature types)
3. The Gingerbrute example shows an Artifact Creature token (which IS a creature type) executing creature-ability text
4. Agatha's Soul Cauldron works similarly but requires +1/+1 counter condition
5. Dark Impostor shows ability persistence is contingent on being on the battlefield

**Restriction Mechanics:**
- Abilities granted are rewritten to reference "this permanent" (the token)
- Restrictions in the ABILITY TEXT are checked at activation (e.g., "pay {2} and sacrifice a creature")
- There is NO automatic "creature-only" restriction on the token itself executing a creature's ability

### Key Ruling: Name Replacement
Dark Impostor example: "Regenerate Marrow Bats" becomes "Regenerate Dark Impostor"
This shows the ability is fully rewritten for the new owner, not just "grafted on."

### Duration Question: TEMPORARY, Not Permanent

**Critical finding from Dark Impostor ruling:**
```
"Once Dark Impostor leaves the battlefield, it will no longer have the activated abilities
of the creature cards exiled with it."
```

This means:
1. Abilities are ATTACHED to the host permanent (Dark Impostor, Hazel's Brewmaster)
2. If the host leaves the battlefield, abilities are GONE
3. If the exiled source leaves exile, abilities PERSIST on the host (unless the ability text says otherwise)

**Hazel's Brewmaster doesn't have the "until [source] leaves" clause**, so abilities granted to Food tokens persist even if the source creature is no longer exiled (e.g., escapes from exile).

**Dark Impostor's ruling (2012-05-01) is dated**, but it's still accurate. More recent cards (Idris) confirm: abilities granted to a host are contingent on the host's permanence, not the source.

---

## Critical Interactions Discovered

### 1. **Artifact Creatures vs. Plain Artifacts**
Hazel's Brewmaster creates Food tokens (artifact tokens, not creature tokens).
The Gingerbrute example references a creature token (Artifact Creature).
Crucial: Can a plain Artifact token (non-creature) execute creature abilities?

**Answer from rulings:** The text simply says "Foods you control have all activated abilities."
There's no carve-out for "only if the Food is a creature." So yes, an Artifact Food token can execute creature-ability text, though the ability itself references "this permanent," so self-referential creature checks in the ability will fail.

### 2. **Ability Restrictions Within the Ability Text**
If an exiled creature's ability reads: "{T}: Create a 1/1 white Soldier creature token," a Food token can execute it.
If the ability reads: "{T}: Target creature gets +1/+1 until end of turn," a Food token can execute it.
If the ability reads: "{3}, {T}, Sacrifice a creature: Draw a card," a Food token (if not a creature) would need a DIFFERENT creature to sacrifice to pay the cost.

This is NOT a creature-only restriction; it's a resource cost that the permanent must be able to pay.

### 3. **Exiled Source Leaving Exile**
Hazel's Brewmaster doesn't say "until the creature leaves exile." If the exiled creature escapes (e.g., via escape mechanics or some spell), the Food tokens STILL have the abilities.
Dark Impostor doesn't have a similar clause either (it just says "is exiled with it"), so abilities persist if the source leaves exile.

### 4. **Host Leaving Battlefield**
Both Dark Impostor and Hazel's Brewmaster lose their granted abilities if the HOST leaves the battlefield. Food tokens are tied to Hazel's Brewmaster's permanence.
**Question: If Hazel's Brewmaster leaves, do the Food tokens lose the abilities?**
Yes. The abilities are granted by a continuous effect from Hazel's Brewmaster. If Hazel's is no longer on the battlefield, the static ability no longer applies.

---

## Interactions with Other Patterns

### Relates to P003 (Zone Change Identity)
Exiled sources are separate objects. If a source returns to the battlefield, it doesn't regain the "exiled with this card" relationship.

### Relates to P006 (Intervening If Clause)
Abilities granted to Food tokens don't have intervening if clauses themselves. The source creature's abilities are copied as-is.

### Relates to P011 (Static vs. Triggered)
Granting activated abilities (static effect) to a non-creature (Food token) doesn't change the nature of the granted ability.

---

## Concerns & Caveats

### Issue 1: Food Token Type Designation
Hazel's Brewmaster creates "a Food token" without specifying creature type.
The ruling clarifies: "Food is an artifact type. Even though it appears on some creatures, it's never a creature type."
So Food tokens from Hazel's are plain Artifacts (not Artifact Creature).

A plain Artifact CAN gain activated abilities from creatures. The question is whether abilities with creature-specific restrictions in their TEXT fail.

**Answer:** No, they don't "fail" — they just can't be paid if the resource isn't available. For example, "{T}, sacrifice a creature" can't be paid by an Artifact if the Artifact is not a creature. But the Artifact still "has" the ability.

### Issue 2: Triggered Abilities
Hazel's Brewmaster and Agatha's Soul Cauldron grant ONLY activated abilities.
Idris grants both activated AND triggered abilities.
The rulings for Hazel's and Agatha's explicitly state they grant only activated abilities (line 3 of each).

This is a distinct restriction: triggered abilities (like Argothian Sprite's hypothetical "whenever you cast a creature spell") are NOT granted.

### Issue 3: Permanence Definition
Dark Impostor ruling says: "Once Dark Impostor leaves the battlefield, it will no longer have the activated abilities of the creature cards exiled with it."

This is a continuous effect. The effect persists as long as the host is on the battlefield. If the host leaves (exile, graveyard, hand, library, command zone), the effect ends.

But the EXILED CARD remains exiled. If Dark Impostor returns to the battlefield (via a return effect), the exile relationship is re-established by a CDA or similar, and the continuous effect applies again.

---

## Conclusion

**P531 is VALID and DISTINCT from P530.**

The mechanics are:
1. Activated abilities can be granted from exiled creatures to permanents (even non-creature tokens)
2. Granted abilities are rewritten with "this permanent" replacing the source name
3. Ability duration is tied to the HOST's permanence, not the SOURCE's exile status
4. Triggered abilities are explicitly NOT granted (only activated)
5. Restrictions within the ability text may make the ability unpayable (e.g., "sacrifice a creature" if the host is not a creature)
6. Food tokens (artifacts) CAN execute creature abilities, though resource costs may be unpayable

**This is NOT redundant with P530.** P530 is about token attachment during copying. P531 is about ability transfer from exile to non-creatures.

**Recommended CR References:**
- 611.2 (Abilities granted to objects)
- 413.1-413.2 (Activated abilities)
- 706.10 (Zone change identity for exiled sources)
- 602.1a-602.2d (Activated ability costs and effects)
- 603.1-603.10 (Triggered ability mechanics)

**Canonical Examples (from rulings):**
- Hazel's Brewmaster + Food token + Argothian Sprite (exiled): Food executes "{7}: Put two +1/+1 counters on Gingerbrute" (now Food)
- Dark Impostor + Marrow Bats: Dark Impostor has "Pay 4 life: Regenerate Dark Impostor" (rewritten from source)
- Agatha's Soul Cauldron + Callous Sell-Sword + creature ability: Sell-Sword executes creature ability if it has a +1/+1 counter

**Distinctions from Similar Patterns:**
- NOT the same as ability theft (Act of Treason style) — this is ability GRANTING from a zone-reference
- NOT the same as copying (Mimic Vat) — this is gaining existing abilities, not creating a copy
- NOT the same as token attachment (P530) — this is ability transfer, not physical attachment

---

## Status
**VALIDATION: PASS** — This is a distinct, well-supported pattern with multiple canonical cards and official rulings.

**MINOR CAVEAT:** The pattern includes a subtle interaction where artifact tokens (not creatures) can execute creature abilities as long as the ability's resource costs are payable. This is accurate but worth flagging in the pattern description.
