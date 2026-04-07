# Commander Collector — Unified Card Workflow Refactor (v2)

## Context

The deck/list/scan/import/export features evolved independently and now duplicate each other at every layer: data model, PHP endpoints, React components, helpers, and types. The user wants unification at the **behavior and UI** layer without collapsing the **conceptual model**.

### Conceptual model (do NOT change)

**Decks and lists are PEERS. Both are first-class. Neither is subordinate to the other.** This is the most important rule in the plan and the one I have repeatedly gotten wrong. Read the memory note `feedback_commander_collector_deck_list_peers.md` if there is any doubt.

- **Deck = a first-class *idea*.** Name, commander, partner, player, color identity, format. A deck can exist with no attached list and is still complete: it knows its own commander, its own colors, its own pilot. Stats, play history, coach-chat, comparison, head-to-head all work on decks regardless of any list. **`decks.commander`, `decks.partner`, `decks.colors`, `decks.has_*` are deck-native data and stay forever.**
- **List = a first-class *collection of cards*.** Name, cards, format, optional commander/partner rows flagged via `role`. A list can exist standalone with no attached deck and is still complete: wishlist, binder, scan output, deckbuild-in-progress. **`list_cards.role` is list-native data and stays forever.**
- **Attachment is a luxury, not containment.** A deck *may* have a list attached via `lists.deck_id` — the cards become viewable/editable in the deck context. A list *may* be attached to a deck — it gets a permanent home. Either side can be deleted without the other being affected (per deletion semantics).
- **Both sides have their own commander concept.** `decks.commander` is the deck's identity. `list_cards.role='commander'` is the list's claim. They are *allowed to disagree*. The validator can warn on attach but does not block.
- **Scan / Import = input methods that produce a list.** They feed list-editing buffers, never decks directly. The list can later be attached to a deck (or saved as one), at the user's discretion.

So the relationship is:

```
Deck (idea)  1 ──── 0..*  List (cards)        ← deck may have 0, 1, or many lists
List         *  ──── 0..1  Deck               ← a list may or may not belong to a deck
List         1 ──── *      ListCard
```

A standalone list (no deck attached) is a perfectly valid object — that's a wishlist, a binder, a scan in progress.

### Unification goal

The duplication that *must* go is at the UI primitives and the list-handling layer:

- One **filter tool** anywhere a list of cards is shown (text or gallery).
- One **import/export/save panel** anywhere a list is being edited.
- One **flip-card** component.
- One **card tile** component.
- One **list view** component (with view-mode toggle: gallery / text / breakdown).
- One **add/edit card dialog**.
- One **scan input** that produces a list, identical to import producing a list, identical to manual entry producing a list.
- One **list endpoint** and one **list-cards table** that both deck-attached and standalone lists share.

The behavior is unified. The concepts (deck vs list) stay distinct.

---

## Audit: What's Currently Wrong (verified against the codebase)

### Re-audit findings (corrects v1 audit errors)

The original audit had several errors. The full re-audit (2026-04-07) corrected them:

- **`decks` has no `commander_card_id` or `partner_card_id` columns.** It has `commander VARCHAR(150)` and `partner VARCHAR(150)` — string card names, not FKs. The validator and "save list as deck" logic must look up cards by name, not by id, OR Phase 2.1 must convert these to scryfall_id columns.
- **`decks` has no `format` column.** Phase 2.1 must add it (default `'commander'`).
- **`decks` has `colors VARCHAR(10)` plus `has_w`/`has_u`/`has_b`/`has_r`/`has_g` boolean columns** for filter speed. These are duplicated state derived from the commander; Phase 5 cleanup should drop them in favor of computing from the flagged commander row.
- **`games` has no `deck_id` column.** All deck references live on **`game_results.deck_id`** — the original audit was correct on this; the v1 plan text was wrong in places where it said "games.deck_id."
- **`coach-chat.php` has 45 `deck_id` references** (not 70+ as the v1 audit claimed). Still significant; the cutover work is the same.
- **`live_game_sessions.state` is JSON containing `players[].deckId`.** Live game deck binding is JSON-embedded, not a FK column. The cutover **does not touch** this — JSON deck references are just integer values that keep working.
- **`rules/active-game.php` reads `deck_cards`** (line 49) for live-game rules context. Already in the Phase 2.2 reader inventory.
- **`list_cards.scryfall_id` is already VARCHAR(64) NULLABLE** — no migration needed to make it nullable. (`deck_cards.scryfall_id` is VARCHAR(36) NULLABLE — narrower; align in Phase 2.1.)
- **`list_cards.is_proxy` already exists.** No migration needed.
- **No `foil` columns anywhere.** (Foil feature is out of scope per gap #8 anyway.)
- **No `is_custom` columns anywhere.** Phase 2.1 adds them.
- **`lists.php` attach/detach is bidirectional COPY between `deck_cards` and `list_cards`** (lines 98–138), NOT a FK relationship. The current "attach" duplicates rows from `deck_cards` into `list_cards`; "detach" duplicates the other way. Phase 2.2 replaces this with simple `lists.deck_id` setter — much cleaner.
- **`scryfall_card_cache.scryfall_id` is VARCHAR(36)** while `list_cards.scryfall_id` is VARCHAR(64). Inconsistent. Phase 2.1 normalizes both to VARCHAR(64).
- **Test infrastructure is installed but ZERO tests exist today.** Vitest is configured (`npm run test:run`) but no `.test.ts` / `.spec.ts` files in the repo. Phase 0/1 test coverage is all greenfield — no legacy tests to update or break.
- **Initial `decks`, `games`, `players` table definitions are NOT in `migrations/`.** They predate the tracked migration system. The current schema must be verified against the live DB before Phase 2.1 ships, since the migration files alone don't reconstruct it.
- **`decks.commander` was extended to allow partners in v4.6.0** with a new `decks.partner VARCHAR(150)` column (added 2026 latest). The current state already supports partners as a string column.
- **`scan_drafts.user_id` is INT** (not VARCHAR), unique-keyed on user. The per-device scan-draft change in Phase 2.1 must respect this.

### Data model — the actual problem

- **Two parallel card-container tables**: `deck_cards` and `list_cards` with identical shapes and identical CRUD code. This is the duplication that should die.
- **Decks are conceptually correct as first-class entities** — but their cards live in a sibling table to the lists table for no reason.
- Scans only write to **decks**, never to standalone lists, so the scan flow can't be reused for "scan my binder."
- No way to attach a list to a deck after the fact (the reverse — "detach deck → list" — exists, which is a tell that the model is confused).
- `is_commander`/`is_proxy` are `0|1` in DB but `boolean` in some TS types. Converters reimplemented 3x.

### Card display — 4 separate renderers
1. `components/CardGridEditor.tsx` (~400 LOC) — used by `/decks/decklist`, `/lists/detail`, `/decks/new`.
2. `decks/scan/components/CardReviewGrid.tsx` (~200 LOC) — scan-only.
3. Inline `GalleryCard` reimplemented twice: `decks/decklist/page.tsx:64-122` and `lists/detail/page.tsx:72-144` (✓ list version is longer; adds a quantity chip).
4. `components/CardListDisplay.tsx` — read-only text list.

### Flip-card animation — 4 implementations (2 patterns)
- **Set-based** (multi-flip): `CardReviewGrid.tsx:42-50`, `CardGridEditor.tsx:134-139`
- **Per-instance state**: `decks/decklist/page.tsx:83-98`, `lists/detail/page.tsx:92-102`

### Add/Edit dialogs — 3 implementations
- `decks/scan/components/CardAddDialog.tsx`
- `decks/scan/components/CardEditDialog.tsx`
- Inline in `CardGridEditor.tsx:141-250`

### Helpers tripled
- `cardFromScryfall()` — `scan/page.tsx:91`, `CardAddDialog:24`, `CardEditDialog:24`. **Audit caveat:** scan variant accepts `proxy` param; dialog variants don't. Phase 0 unification must keep `proxy`.
- `tempId()` — `scan/page.tsx:65`, `CardAddDialog:20`, `CardEditDialog:20` (✓ byte-identical).

### Type categorization — 3x
- `DeckFilters.tsx:10-50`, `DeckBreakdown.tsx:85-97`, `CardListDisplay.tsx` (uses `getTypeCategory()`).

### Card-to-editable converters — 3x
- `decks/decklist/page.tsx:46-60` (`deckCardToEditable`), `lists/detail/page.tsx:54-68` (`listCardToEditable`), `decks/scan/page.tsx:224-239` (inline).

### Filtering — bespoke per page
- `/decks/page.tsx` has its own filter UI. So does the deck card editor, the list page, the comparison builder. No shared `<CardFilterBar>` exists.

### Import/Export — fractured
- `components/CardListImport.tsx` uses shared `parseImport()` ✓.
- `decks/scan/page.tsx:276-360` reimplements its own import logic.
- TCGPlayer text export inlined in scan page only.
- TTS export only exists as `php-api/tts-export.php` — **no UI button**.

### Scryfall — split brain
- `lib/scryfall.ts` makes direct client calls.
- `lib/api.ts` → `php-api/scryfall-cache.php` for cached lookups.
- Inconsistent across pages.

### Save flows — inconsistent
- Decks: 2 calls (`createDeck` then `saveDeckCards`).
- Lists: 1 call (create-with-cards).
- Update flows differ between deck and list pages.

### Monoliths
- `decks/scan/page.tsx` — **1,368 LOC** (✓ confirmed).
- `decks/decklist/page.tsx` — 623 LOC.
- `lists/detail/page.tsx` — 722 LOC, near-duplicate of decklist.

---

## The Big Idea (revised)

> **Decks stay. Lists become the universal card container. A deck "has a current list" the same way it could later "have a Brawl list." The UI primitives are universal across both contexts.**

Concretely:

1. **`decks` table stays.** It keeps `id`, `name`, `commander_card_id`, `partner_card_id`, `player_id`, `colors`, `format`, etc. — everything that makes a deck *an idea*. It loses the embedded card relationship.
2. **`deck_cards` table is deleted.** Its data migrates into `list_cards`.
3. **`lists` table gains `deck_id` (nullable) + `format` (nullable) + `role` (e.g. 'main', 'sideboard', 'maybeboard').** A list with `deck_id` set is "the cards for this deck." A list with `deck_id` null is a standalone list (binder, wishlist, scan buffer).
4. **A deck has 0..N lists.** A freshly created deck has **zero** lists — it's an idea with no cards yet, and that's a valid state. A deck becomes listed in exactly three ways:
   - **(a) Cards added + deck saved.** The user adds cards in the deck context and explicitly saves; a new `lists` row is created with `deck_id` set.
   - **(b) Existing valid list attached.** The user picks an existing standalone list from the typeahead and attaches it; that list's `deck_id` is set to the deck. "Valid" = passes the deck's format rules (e.g. for Commander: contains the commander, color identity matches, singleton, etc.).
   - **(c) New list saved as a deck.** The user is editing a standalone list and chooses "save as deck" — this creates a new `decks` row and sets the list's `deck_id` to it. The list becomes the deck's main list in one move.

   For now the app consumes the first `role='main'` list per deck/format when one exists. The 0..N shape unlocks future formats without another schema migration.

**Listless deck → "Create Deck List" action (Commander only).** When a user opens a **Commander deck** that has no list yet, the deck view shows a **Create Deck List** button. The action is **only exposed in the Commander deck context** — future formats (Brawl, Oathbreaker, etc.) will get their own equivalent when they land, with format-specific seeding rules. Clicking it:
1. Opens the buffered edit flow (`<CardListView editMode>` with an empty buffer) — same primitives as Scan, Import, etc.
2. **Pre-populates the buffer with the deck's commander** as a single row, flagged `role='commander'`. (Partner is also pre-populated and flagged `role='partner'` if the deck has one.)
3. **Does NOT save anything yet.** The buffer is purely client-side; nothing exists in the `lists` table until the user explicitly saves through `SaveToListDialog`.
4. User then adds more cards via any of the four input methods (`CardInputPanel` — Lookup / Import / Paste / Scan), all of which respect the format validator (color identity ⊆ commander identity is now live since the commander row is in the buffer).
5. On Save, `SaveToListDialog` creates the `lists` row with `deck_id` set, `role='main'`, and the auto-name `"<Deck name> — main"`. The empty-list save block does not apply because the buffer always has at least the commander row.

This is just deck-acquires-list path #1 made explicit and seeded with the commander, so the user doesn't have to re-add their own commander as the first card every time.

5. **Deletion semantics.** Nothing cascades. Ever.
   - **Delete a deck** → user is prompted with a dialog showing the deck's attached lists. The user picks per list: *delete this list too* or *keep it as a standalone list*. Each list is decided independently. The deck moves to trash (`deleted_at` set); chosen lists either move to trash or have their `deck_id` cleared. Lists without a `deck_id` are still lists — they keep their name in the `lists` table and appear under `/lists`. They are not "orphans"; they are standalone lists.
   - **Delete a list** → list moves to trash. If it had a `deck_id`, the deck becomes **listless** (a valid state, same as a freshly created deck before any cards are added). The deck is **not** touched, **not** prompted about, **not** deleted.
   - **Detach a list from a deck** (`<DeleteImpactDialog>` is overkill for this — it's just a toolbar button on `CardListView`) → clears `lists.deck_id`. The deck becomes listless; the list remains under `/lists` with its current name. No deletion at all. Surface a small confirmation toast.
   - **`games.deck_id` and any coach-chat `deck_id` references are NEVER nulled or cascaded.** They remain as-is. After a deck is purged from trash (30 days), those FKs dangle. Consumers (stats, coach-chat, comparison) must handle a missing deck gracefully — coach-chat says *"hmm, I can't find that deck, must have been deleted… can you tell me more about what you were looking for?"* and continues. This is the **non-destructive** rule: deleting a deck never deletes downstream history.
   - **30-day trash.** `decks` and `lists` get a nullable `deleted_at` column. Soft delete sets it; main UI queries filter `WHERE deleted_at IS NULL`. A trash view (`/trash` or a tab) shows soft-deleted items for 30 days with a restore button. A daily cleanup job purges anything with `deleted_at < NOW() - INTERVAL 30 DAY`. Hard delete only happens via the cleanup job — there is no "delete forever" UI in v1.
   - **Confirmation dialogs surface impact, not deletion warnings.** `<DeleteImpactDialog>` shows attached lists, recorded games count, coach-chat reference count — but only for *information*, since none of those will be touched. The user sees what survives, not what dies.
5. **Scans always produce a list.** That list may or may not be subsequently attached to a deck via the same `SaveToList` dialog used everywhere else.
6. **One `lists` endpoint, one `list_cards` table.** All card CRUD goes through it. `deck-cards.php` becomes a thin shim or is deleted in Phase 5.

**`deck_id` lives on**, both as a column on `lists` and as the primary identifier the rest of the app (games, coach-chat, comparison, stats) uses. **No FK rewrite cascade** — that was the dangerous part of v1, and it's gone.

---

## Phase 0 — Foundation (lib only, no UI/DB changes)

**Create**
- `app/lib/cards/types.ts` — canonical `Card` interface; `toApiCard`/`fromApiCard` adapters that handle the `0|1` ↔ boolean PHP boundary in ONE place.
- `app/lib/cards/fromScryfall.ts` — single `cardFromScryfall(name, data, opts?: { proxy?: boolean })`. Must keep the `proxy` param.
- `app/lib/cards/tempId.ts` — single `tempId()`.
- `app/lib/cards/categorize.ts` — single `categorizeByType()`. Locate the existing `getTypeCategory()` and merge it in so all 3 sites collapse.
- `app/lib/cards/filter.ts` — pure filter **and sort** functions extracted from `DeckFilters`. Filtering and sorting are one feature; this module exports both predicates (`filterCards(cards, state)`) and comparators (`sortCards(cards, state)`) driven by a single `FilterSortState` shape.
- `app/lib/formats/index.ts` — format validator registry. **One module per format**, no generic rules engine. Everything defaults to Commander; future formats (Brawl, Oathbreaker, Pauper) drop in as new modules.
- `app/lib/formats/types.ts` — shared validation shapes:
  ```ts
  type ValidationResult = { legal: boolean; format: string; violations: Violation[] };
  type Violation = {
    rule: 'singleton' | 'card_count' | 'color_identity' | 'banned' | 'commander_legality' | 'format_legality';
    severity: 'error' | 'warning';
    message: string;
    cardIds?: string[];   // for inline highlighting in CardListView
  };
  ```
- `app/lib/formats/commander.ts` — Commander rules: `validate(cards, deck): ValidationResult`. Checks 100-card count (warning, not error — see below), singleton (basics exempt), color identity ⊆ commander identity (uses `lib/cards/colorIdentity.ts`, axiom-enforced), commander legality, banned cards via cached `scryfall_card_cache.legalities` (**no separately maintained banned list**), format legality.

  **Legality TTL: 90 days.** `scryfall_card_cache.legalities_cached_at` is checked on every read by `scryfall-cache.php`; if older than 90 days OR null, the row's `legalities` is re-fetched from Scryfall before returning. The TTL is independent of the main `cached_at` so image/type/mana data isn't churned alongside legality refreshes. Image data is **never TTL'd** — images don't change. Legality re-fetch is silent and lazy; the user never waits.

  **Manual refresh script.** `scripts/refresh-card-cache.php` walks every cached row and re-fetches legalities (paginated, rate-limited per Scryfall's policy). Run manually after a known ban announcement. Automation deferred to v1.x.

  **Commander setup rule (handles all variants behind one check).** The validator looks at `role='commander'` and `role='partner'` rows in the list:
  - **Exactly one `role='commander'`** → single commander; must be a legal commander (legendary creature or "can be your commander" text).
  - **Two `role='commander'`** → partner pair. Both must have `Partner` or `Friends Forever` keyword, OR one must have `Partner with X` matching the other's exact name.
  - **One `role='commander'` + one `role='partner'`** → the commander must have "Choose a Background" or be a Doctor; the partner row must be a Background (or matching Doctor's companion).
  - **Zero `role='commander'`** → error: "Flag a commander before validating."
  - **More than two combined** → error.

  The user never picks a "mode" — they just flag rows and the validator infers the mechanic from card text and keywords. **Companion is deliberately not in v1**; the enum has only `commander` and `partner`. **Signature spell (Oathbreaker) is added when Oathbreaker support lands**, not now.

  **Severity rules:**
  - **Hard errors (block attach to deck):** color identity violation, banned card, illegal commander, format-illegal card.
  - **Soft warnings (allow attach):** card count off (e.g. 87 instead of 100 — user may be mid-build).

  **Default format.** Every list defaults to `format='commander'` — standalone lists too. No opt-in; Commander validation is always on. Future formats add a `format` selector to `CardListToolbar`.

  **Validation runs live**, debounced 200ms, on every buffer change. Result cached on buffer state. `CardListView` highlights offending cards inline (red border on cards triggering the violation, via `Violation.cardIds`).

  **Server-side validation is skipped.** The client is the source of truth for legality. Single-user app; the cost of a malicious POST creating an illegal deck is zero.
- `app/lib/cards/colorIdentity.ts` — canonical color-identity computation. **AXIOM: a card is colored OR colorless, never both.** `C` is mutually exclusive with W/U/B/R/G — if any colored mana symbol is in the identity, `C` is not. This is a hard invariant the system must never violate; encode it as a runtime assertion in the function (`assert(!(hasColor && hasColorless))`) so any future bug surfaces immediately. **Fixes a known bug in the current filter**: monocolored hybrid mana ("twobrid") like `{2/W}`, `{2/U}`, `{2/B}`, `{2/R}`, `{2/G}` contributes **only the colored half** (white, blue, etc.) — currently treated as also colorless, which violates the invariant. Two-color hybrid like `{G/W}` correctly contributes both colors. Phyrexian like `{W/P}` contributes only the colored half. Unit-test:
  1. `{G/W}` → `['G','W']`
  2. `{2/W}` → `['W']` (not `['W','C']`)
  3. `{W/P}` → `['W']`
  4. `{2}` only → `['C']`
  5. Any colored card → `C` never appears in the identity array.
- `app/lib/cards/matchKey.ts` — `matchKey(card)` and `normalize(name)` for the dedup system. Used by `CardInputPanel`'s dedup logic and anywhere "find this card in a list" is needed.
- `app/lib/cards/index.ts` — barrel.

**Modify**
- `app/lib/types.ts` — re-export from `lib/cards/types`; mark `EditableCard`/`DeckCard`/`ListCard`/`ScannedCard` as `@deprecated` aliases.
- `app/lib/api.ts` — route all card row reads/writes through `fromApiCard`/`toApiCard`.

**Verify** — `npm run lint`, `npm run test:run` clean; smoke test all card pages — no behavioral change.

---

## Phase 1 — Atomic UI primitives (additive, dead code until later phases)

**Create under `app/components/cards/`**

- **`FlipCard.tsx`** — single source for 3D flip. Replaces all 4 copies. Supports both set-based (multi-flip) and per-instance patterns.
- **`CardTile.tsx`** — one card visual (image, mana, qty, foil, commander star). Wraps `FlipCard`.

  **Placeholder asset.** When a card has no resolved Scryfall image, `CardTile` renders the canonical placeholder at `apps/core/public/card-not-found.webp` (34 KB, 680px) or `card-not-found-small.webp` (3.3 KB, 204px) depending on render size. The placeholder is overlaid with a state badge:
  - **Unresolved** (Scryfall returned nothing) → red `?` badge
  - **Pending** (lookup in flight) → spinner overlay
  - **Intentionally custom** (user marked the row as a playtest/custom card) → small "custom" tag, no nag
  - **Cache miss / transient** (network or rate-limit failure) → yellow badge with auto-retry

  The same image is used for all four states; only the badge overlay differs. `CardTile` should use `next/image` so Next handles responsive sizing.

  **Buffer row state machine.** Every row in a `CardListView` buffer carries a `lookupState`:
  - `resolved` — has `scryfall_id`, has image, normal display.
  - `pending` — lookup in flight (scan/paste just produced this row, bulk resolve hasn't returned yet). Spinner overlay.
  - `not_found` — Scryfall returned a clean empty result. Red `?` badge. Persistent until user fixes.
  - `transient_error` — network/5xx/rate-limit/timeout. Yellow badge. **Auto-retry** with exponential backoff (1s, 3s, 9s; 3 attempts). After 3 failures, downgrade to `not_found`. User can also click to manually retry.
  - `custom` — user marked as a playtest/custom card via row context menu ("Mark as custom card"). Neutral "custom" tag, no nag. Lookup attempts skip this row on reload.

  The PHP cache layer (`scryfall-cache.php`) must return enough HTTP context for the client to distinguish `not_found` from `transient_error`.

  **Repair flow.** Click an `not_found` row → opens `CardSearchDialog` in edit mode with the unresolved name pre-filled. User picks the right card from the scrollable Scryfall results. Row is replaced with the resolved version (and the dedup match check from `CardInputPanel` fires against the rest of the buffer).
- **`CardSearchDialog.tsx`** — unified add/edit dialog with Scryfall search. Modes: `"add" | "edit"`. Built on top of `CardLookupField` (below).
- **`CardLookupField.tsx`** — **the** card-name input. Every text field in the app that takes a card name uses it: `CardSearchDialog`, the Lookup tab of `CardInputPanel`, the commander/partner picker in `SaveToListDialog`'s "save as new deck" path, the deck-new wizard, the filter bar's "contains card" filter, anywhere else. Behavior:
  - Debounced lookup as the user types, routed through `php-api/scryfall-cache.php` (never the direct client lib).
  - **Dual-mode** input on a single field:
    - **Autocomplete mode** (default) — fast prefix match via Scryfall `/cards/autocomplete`. Low latency, name only.
    - **Query mode** — auto-activated when the input contains `*`, `:`, `=`, `<`, `>`, `(`, `"`, or starts with `!` or `-`. Routes to Scryfall `/cards/search` with full query syntax. Paginated, same row UI.
  - **Scrollable result list** in both modes (not single-best-match). Results show card image thumbnail, name, set, mana cost, type line.
  - Keyboard navigation (↑/↓/Enter) and mouse scroll/click.
  - **Per-result quantity stepper.** Each result row in the scrollable list has a `[− 1 +]` stepper next to an "Add" button. Default quantity is **1**; user can bump before clicking Add. Single click sends N copies into the buffer (subject to the singleton/dedup rules from `CardInputPanel`). When the buffer's singleton mode is ON, the stepper is hidden — Add always sends 1.
  - Configurable result filter via props (e.g. `legendaryCreaturesOnly` for commander pickers, `partnerOnly` for partner pickers) — applied as additional Scryfall query terms in query mode, post-filter in autocomplete mode.
  - Emits `Card` (or array, when multi-select prop is on).
  - **Help tooltip.** A small `(?)` icon next to the field opens a popover/tooltip with the Scryfall syntax cheat sheet:

    ```
    Card lookup tips

    Wildcards / names
      bolt*              substring match in names
      !"Lightning Bolt"  exact name

    Type
      t:creature         type / subtype / supertype
      t:"legendary dragon"

    Color
      c:wug              colors include W/U/G
      c=wug              exactly WUG
      c<=wug             subset of WUG
      id<=wug            color identity (Commander)
      c:colorless | c:multicolor

    Mana / cost
      cmc=3   cmc>=4   cmc<6
      mana:{2}{u}{u}
      m:{x}              has X in cost

    Power / toughness / loyalty
      pow>=4   tou<=2   loy=3   pow=tou

    Oracle text / keywords
      o:"draw a card"   o:trample
      keyword:flying

    Set / rarity / format
      set:tdm | s:tdm
      r:mythic   r:>=rare
      f:commander   legal:commander   banned:commander
      is:commander   is:partner   is:companion
      is:reserved   is:firstprint   is:reprint

    Price
      usd>=10   eur<5   tix>1

    Misc
      lang:en   unique:cards   not:reprint
      art:dragon   flavor:"text"

    Combine
      t:dragon c:r cmc<=4
      (t:goblin or t:elf)
      -t:land
    ```

  No more bespoke autocompletes. Every card-name input in the app shares this one component, which means scroll behavior, keyboard handling, query syntax, and the help tooltip are uniform.

  **The help tooltip appears on EVERY card-input surface, not just the standalone field.** That includes:
  - The Lookup tab of `CardInputPanel`
  - The Paste text tab of `CardInputPanel` (lines can use the same syntax to bulk-resolve)
  - `CardSearchDialog` (add and edit modes)
  - The commander/partner picker in `SaveToListDialog`
  - The deck-new wizard
  - The "contains card" filter in `CardFilterBar`
  - Any future card input

  Wherever a user can type a card name, they see the same `(?)` icon and the same cheat sheet. One source of truth (a `CardLookupTips` component imported by `CardLookupField`) so updating the syntax docs updates everywhere at once.
- **`CardFilterBar.tsx`** — **THE** filter-AND-sort component. Filtering and sorting are treated as one feature, not two — they share the same UI surface, the same state shape, and the same `lib/cards/filter.ts` (which exports both predicates and comparators). Used by deck list page, list editor, gallery, comparison builder, anywhere a `Card[]` is shown. Default sort: **alphabetical by name**.
- **`CardListView.tsx`** — **THE** list-of-cards display. Props:
  - `cards: Card[]`
  - `viewMode: "gallery" | "text" | "breakdown"` (toggle inside)
  - `editMode: boolean`
  - `onChange?: (cards: Card[]) => void`
  - `commanderId?: string` (lights up commander affordances)
  - `filterState?` (controlled or uncontrolled — `CardFilterBar` integrated)
- **`CardInputPanel.tsx`** — the **single** input surface for adding cards in any edit mode. Exposes ALL four input methods as tabs/buttons that all emit `Card[]` into the same buffer:
  1. **Lookup** — Scryfall search (wraps `CardSearchDialog` in add mode)
  2. **Import file** — upload `.txt` / `.csv` / `.dec` / format-specific files (wraps `parseImport()`)
  3. **Paste text** — textarea that runs `parseImport()` on paste/submit
  4. **Scan** — mounts `<ScanInput>` (Phase 3) inline or in a modal

  Every edit mode — deck cards, standalone list, scan review buffer, import buffer — gets the **same** `CardInputPanel`. There is no context where only some methods are available.

  **Dedup rule.** When any input method emits a card already in the buffer (matched by `scryfall_id`), the behavior is controlled by a **per-input "singleton" toggle** that lives on every tab of `CardInputPanel` (Lookup, Import file, Paste text, Scan):
  - **Singleton ON** → dedupe: keep the existing entry, do not add a duplicate, surface an "already in list" toast.
  - **Singleton OFF** → increment quantity on the existing entry by the incoming quantity.

  The toggle's **default** is derived from the buffer's context (Commander deck → defaults ON; standalone list with no format → defaults OFF), but the user can flip it for any individual input action. This lets you, for example, scan a sheet of duplicates into a Commander deck buffer with singleton temporarily off (to capture quantities first, then prune), or paste a 4-of constructed list into a standalone buffer with singleton on (to collapse to unique cards).

  All four input methods expose the same toggle in the same place, so the rule is identical regardless of how cards enter the buffer. **Basic lands are always exempt** from singleton dedup and increment normally.

  **Match key (Option C with warnings).** Buffer rows can be in three states: resolved (`scryfall_id` present), pending (resolution in flight), unresolved (`notFound: true`). When a new card is inserted, "already in the buffer" is determined by:
  1. If both rows have `scryfall_id` → match on `scryfall_id`. Silent merge per the singleton rule above.
  2. Otherwise → fall back to **`normalize(name)`** comparison (lowercase, strip diacritics, normalize Æ→AE, collapse whitespace, strip punctuation). On a name-fallback match, **show a warning toast** ("Possible duplicate of *X* — merge?") before merging. The user confirms or keeps both. Never silently merge without IDs.
  3. **Async resolve promotion**: when a previously-pending row gets a `scryfall_id`, re-run the match check against the rest of the buffer. If it now collides with a resolved row, apply the same warning-then-confirm flow (singleton on → prompt to drop the new row; singleton off → prompt to merge qty).

  **Printing variation** (same name, different `scryfall_id` — e.g. Sol Ring CMR vs Sol Ring SLD):
  - **Singleton ON** → merge across printings into a single row (Commander cares about logical cards, not physical printings).
  - **Singleton OFF** → keep as **separate rows, do not increment** (binder/wishlist context — the user cares which printings they own).

  **Match-key normalization** lives in `lib/cards/matchKey.ts` so all four input methods, the dedup logic, and any future "find this card in the buffer" feature use one implementation.
- **`CardExportPanel.tsx`** — TCGPlayer text, CSV, TTS (calls `php-api/tts-export.php`). **TTS export already supports both `?deck_id=N` and `?list_id=N`** in the existing PHP — the only gap is that no UI ever called it with `list_id`. `CardExportPanel` always uses `list_id`, so TTS export becomes available on every list (deck-attached or standalone) for the first time.
- **`CardListToolbar.tsx`** — the **single** toolbar that appears above any editable list: opens `CardInputPanel` (all 4 input methods) / export / save / clear / view-mode toggle / edit-mode toggle / **detach from deck** (when viewed in deck context) / **undo** / **redo**. Composes the panels above.

  **Buffer-level undo/redo (pre-save).** `CardListView` keeps an in-memory stack of past buffer states (immutable `Card[]` snapshots). Every input action — Lookup add, Scan batch, Paste batch, Import, manual edit/delete, dedup merge — pushes a snapshot. Undo (Cmd+Z / toolbar button) pops one step; Redo (Cmd+Shift+Z) advances. Stack lives in component state, dies on page navigation. No DB involvement. Cap at 50 steps to bound memory. This is the highest-value undo for the scan-and-walk-away workflow ("oops, I scanned the wrong sheet — undo").
- **`DeleteImpactDialog.tsx`** — confirmation dialog for delete actions with downstream visibility. Shows what's attached and what survives (per the deletion semantics rule). For deck delete: lists per-list checkboxes (delete with deck / keep as standalone). For list delete: shows whether the deck will become listless. For everything: shows recorded game count and coach-chat reference count as information, since those are never touched. Used by deck delete, list delete, and any future "thing with downstream impact" delete.
- **`Trash.tsx`** — page or tab listing soft-deleted decks and lists within the 30-day window. Restore button per row. Shows days remaining before purge.

### Phase 1 cross-cutting requirements

These apply to every primitive in Phase 1, not to any one component:

- **Mobile-first responsive design** as a hard constraint. `CardInputPanel` tabs collapse into a bottom sheet on narrow screens; `CardListToolbar` overflow-menus secondary actions; gallery view becomes single-column with larger tap targets; `CardFilterBar` collapses behind a "Filter" button. Verify by opening every primitive on a 375px viewport — must be usable with thumbs only. Scan flow stays mobile-first (it already is).
- **Virtual scrolling** in `CardListView` when `cards.length > 50`, using `react-window` or the Next.js-recommended equivalent. Below 50, render normally — DOM is cheap, virtualization has its own costs. Verify with a 250-card fixture.
- **Keyboard shortcuts** via a single `useKeyboardShortcuts(handlers)` hook used by `CardListView`:
  - `/` — focus the Lookup tab search
  - `Enter` — add current Lookup result with current qty
  - `Del` / `Backspace` — delete focused card row in edit mode
  - `Cmd+Z` / `Cmd+Shift+Z` — undo / redo
  - `Cmd+S` — open `SaveToListDialog`
  - `V` — cycle view modes (gallery / text / breakdown)
  - `E` — toggle edit mode
  - `?` — open the Scryfall syntax cheat sheet popover
  - `Esc` — close any open dialog

  A `?` help overlay lists them all.
- **Accessibility baseline** per primitive (full a11y audit deferred to v1.x):
  - All interactive elements have ARIA labels.
  - Dialogs trap focus and return focus to the trigger on close.
  - Card grid supports arrow-key navigation between tiles.
  - The 5 lookup-state badges on `CardTile` have `aria-label` text equivalents.
  - Color is never the only signal — every status badge has an icon or text label too.
  - Contrast meets WCAG AA against both light and dark autumn theme.
  - Screen reader smoke test: VoiceOver on Mac walks through `CardListView` and announces each card meaningfully.
- `index.ts` — barrel.

**Tests** — Vitest under `tests/components/cards/` for each new component.

**Verify** — Mount `CardListView` in a dev-only `/dev/cards-sandbox` route against fixtures. Exercise view + edit toggles, filter, add/edit/remove, import, export.

---

## Phase 2 — Unified data model (lists become the universal card container)

This is the heart of the rewrite. Decks stay first-class. `deck_cards` dies. `lists` absorbs the responsibility.

### Phase 2.1 — Migration `migrations/v<next>.sql`

(✓ Audit confirmed: filename must match `package.json` version, currently 4.6.0; bump in same commit.)

**Additive changes first (non-destructive):**

```sql
ALTER TABLE lists
  ADD COLUMN deck_id BIGINT NULL AFTER id,
  ADD COLUMN format VARCHAR(32) NULL AFTER deck_id,    -- 'commander' for now
  ADD COLUMN role VARCHAR(32) NULL DEFAULT 'main' AFTER format,
  ADD COLUMN source ENUM('manual','scan','import') DEFAULT 'manual',
  ADD COLUMN deleted_at TIMESTAMP NULL,                -- 30-day trash
  ADD COLUMN version INT NOT NULL DEFAULT 1,           -- optimistic concurrency
  ADD INDEX idx_lists_deck (deck_id, format, role),
  ADD INDEX idx_lists_deleted (deleted_at);

-- Per-game cardlist snapshot. Lives on game_results (NOT games), because
-- each player in a game has their own deck. Thin shape: scryfall_id + qty + role.
-- Image data lives in scryfall_card_cache, keyed to scryfall_id.
-- Best-effort: backdated games get a "current cardlist" snapshot which may not
-- match what was actually played. Accept the limitation; column is NULL for
-- historical rows pre-migration.
ALTER TABLE game_results
  ADD COLUMN cardlist_snapshot JSON NULL AFTER team_number;

-- Generalize scan_drafts into buffer_drafts: works for ALL input methods
-- (Lookup, Import, Paste, Scan), per-user-per-device-per-context.
RENAME TABLE scan_drafts TO buffer_drafts;
ALTER TABLE buffer_drafts
  ADD COLUMN device_id VARCHAR(64) NOT NULL DEFAULT '',
  ADD COLUMN context_type ENUM('new_list','new_deck_list','existing_list','existing_deck_list') NOT NULL DEFAULT 'new_list',
  ADD COLUMN context_ref BIGINT NULL,  -- list_id or deck_id, depending on context_type
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (user_id, device_id, context_type, context_ref);

-- 30-day trash on decks too.
ALTER TABLE decks
  ADD COLUMN deleted_at TIMESTAMP NULL,
  ADD INDEX idx_decks_deleted (deleted_at);

-- Tiny key/value table for app-level state (last cleanup run timestamp, etc.).
CREATE TABLE system_state (
  k VARCHAR(64) PRIMARY KEY,
  v TEXT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Save audit log (write-only in v1, history view ships in v1.x).
-- Table name TBD — using `list_history` as a placeholder.
CREATE TABLE list_history (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  list_id BIGINT NOT NULL,
  user_id BIGINT NULL,
  action ENUM('create','update','rename','detach','attach','soft_delete','restore') NOT NULL,
  before_snapshot JSON NULL,   -- full cards array + list metadata before
  after_snapshot JSON NULL,    -- full cards array + list metadata after
  source ENUM('manual','scan','import') NULL,  -- dominant input method for this save
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_list_history_list (list_id, created_at),
  INDEX idx_list_history_user (user_id, created_at)
);

-- games.deck_id and any coach-chat deck_id references are NOT touched.
-- We never cascade or null them. If a deck is hard-deleted (after 30 days
-- in trash), the FK will dangle; consumers must handle a missing deck
-- gracefully by name/id. Coach-chat says "hmm, I can't find it, must
-- have been deleted" instead of breaking.

-- list_cards.scryfall_id is ALREADY VARCHAR(64) NULL (verified in re-audit).
-- Just add the new columns.
ALTER TABLE list_cards
  ADD COLUMN is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN role ENUM('commander','partner') NULL AFTER is_custom;
  -- companion and signature_spell deliberately omitted; add when needed.

-- Same on deck_cards. Also widen scryfall_id from VARCHAR(36) to VARCHAR(64)
-- to align with list_cards (re-audit found the inconsistency).
ALTER TABLE deck_cards
  MODIFY COLUMN scryfall_id VARCHAR(64) NULL,
  ADD COLUMN is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN role ENUM('commander','partner') NULL;

-- Same alignment on the cache table.
-- Also add legalities (currently not cached) + a separate TTL timestamp
-- so legality refreshes don't churn the rest of the row.
ALTER TABLE scryfall_card_cache
  MODIFY COLUMN scryfall_id VARCHAR(64) NOT NULL,
  ADD COLUMN legalities JSON NULL,        -- {"commander":"legal","brawl":"banned",...}
  ADD COLUMN legalities_cached_at TIMESTAMP NULL,
  ADD COLUMN prices JSON NULL,            -- {"usd":"1.23","eur":"1.05","tix":"0.04"}
  ADD COLUMN prices_cached_at TIMESTAMP NULL;
  -- Prices: stored in v1, no UI yet. v1.x deck-value display has data when it ships.
  -- TTL likely shorter than legalities (prices move faster than bans).

-- decks needs a `format` column (re-audit confirmed it doesn't exist).
ALTER TABLE decks
  ADD COLUMN format VARCHAR(32) NOT NULL DEFAULT 'commander' AFTER name;

-- Backfill role from is_commander on both tables.
UPDATE deck_cards SET role = 'commander' WHERE is_commander = 1;
UPDATE list_cards SET role = 'commander' WHERE is_commander = 1;
-- decks.partner is a VARCHAR card NAME (not an FK). Match by name to seed the LIST's
-- role='partner' flag. decks.partner itself stays untouched — it is the deck's identity,
-- independent of any list. The list and deck can later disagree; that is allowed.
UPDATE deck_cards dc
  JOIN decks d ON d.id = dc.deck_id
  SET dc.role = 'partner'
  WHERE d.partner IS NOT NULL AND dc.card_name = d.partner;

-- Backfill: ONLY decks that already have cards get a list. Empty decks stay empty.
INSERT INTO lists (deck_id, format, role, name, source, created_at, updated_at)
SELECT d.id, 'commander', 'main', CONCAT(d.name, ' — main'), 'manual', d.created_at, d.updated_at
FROM decks d
WHERE EXISTS (SELECT 1 FROM deck_cards dc WHERE dc.deck_id = d.id);

-- Move deck_cards rows into list_cards, mapped to the just-created lists.
INSERT INTO list_cards (list_id, scryfall_id, card_name, quantity, is_commander, is_proxy, ...)
SELECT l.id, dc.scryfall_id, dc.card_name, dc.quantity, dc.is_commander, dc.is_proxy, ...
FROM deck_cards dc
JOIN lists l ON l.deck_id = dc.deck_id AND l.role = 'main' AND l.format = 'commander';
```

**Critical:** `deck_cards` is **NOT dropped** in this migration. It stays as a read-shadow table during dual-write. Phase 5 drops it.

**Critical:** `decks.id` is **untouched**. `games.deck_id`, `coach-chat.php`, `comparison.php`, `stats.php`, `my-collection.php`, `deck-profile.php`, `advanced-stats.php` — **none of them change**. The 70+ `deck_id` references in `coach-chat.php` keep working. This is the whole point of the v2 design.

### Phase 2.2 — PHP endpoint cutover (single-write, dual-read banned)

**Principle: dual-write is a trap.** We use single-write with a one-shot read cutover. From this phase onward, **every write goes to `list_cards` only**; `deck_cards` is frozen in time and used by nothing. Reads switch over in lockstep so there is never a moment where two tables are both authoritative.

- **`php-api/lists.php`** becomes the canonical card-container endpoint. Extend it to:
  - Accept `?deck_id=N` to fetch the main list for a deck.
  - `POST /lists` accepts `{deck_id?, format?, role?, name, cards: []}`.
  - `PATCH /lists/N` updates cards (the existing pattern, just used universally now).
  - **Every write writes one row to `list_history`** with `before_snapshot` (the prior state) and `after_snapshot` (the new state). Same for create (before=null), soft delete (after=null), rename, attach, detach, restore. The history table is **write-only in v1**; no read endpoint or UI ships yet. Data accumulates so the v1.x history view has content from day one.
  - **Optimistic concurrency on every save.** The client sends the `version` it loaded; the server's UPDATE includes `WHERE id = ? AND version = ?` and bumps `version = version + 1`. If the affected row count is 0, return `409 Conflict`. The client `useList` hook propagates the 409 to `CardListView`, which shows a dialog: *"This list was changed in another tab or device. Your changes haven't been saved. [Reload]"*. **v1 is reload-only**; the buffer is preserved until the user confirms reload (so they can copy cards out manually if needed). Diff/merge UI is a v1.x feature.

  **Universal buffer autosave (`buffer_drafts`).** `scan_drafts` is renamed to `buffer_drafts` and generalized to autosave **any** unsaved buffer regardless of input method. `<CardListView editMode>` autosaves to it on every buffer change, **debounced 2 seconds**. Drafts are keyed to `(user_id, device_id, context_type, context_ref)` where:
  - `context_type` ENUM: `'new_list'`, `'new_deck_list'`, `'existing_list'`, `'existing_deck_list'`
  - `context_ref` BIGINT NULL: the `list_id` or `deck_id` the buffer is editing, NULL for new contexts
  - Multiple concurrent drafts per user/device are allowed because contexts differ
  - **Auto-cleared on successful save** — the saved list IS the recovery point, no draft history kept

  On a fresh edit context open, the client checks for a draft under the current `(user_id, device_id, context_type, context_ref)`. If one exists, restore it. If other devices have drafts for the same context, surface a "Resume draft from laptop?" picker. `device_id` is generated per-browser on first load and persisted in localStorage.

  This means the user can paste 80 cards into a Lookup buffer, close the tab, and resume on the same or another device. Same protection scan already had, now universal across all four input methods.
- **`php-api/deck-cards.php`** stops writing to `deck_cards` entirely. It becomes a **read-shim that resolves to `list_cards` via `lists.deck_id = ? AND role='main'`** and a **write-shim that POSTs to `list_cards`** (via the deck's main list, creating one if needed). Any caller still hitting this endpoint transparently lands on the new table. `deck_cards` is no longer written to from anywhere.
- **`php-api/decks.php`** is **unchanged**. Creating a deck does NOT create a list. The deck stays listless until the user adds cards to it through the unified flow.
- **Coach-chat patched in this phase.** Every `coach-chat.php` SQL query that reads `deck_cards` is rewritten to `JOIN lists ON lists.deck_id = decks.id AND lists.role='main' JOIN list_cards ON list_cards.list_id = lists.id`. The 70+ tool params still take `deck_id` — only the SQL underneath changes. **No SQL view layer**; queries are patched directly.
- **`php-api/cleanup-trash.php`** — new lightweight endpoint that purges `decks` and `lists` rows where `deleted_at < NOW() - INTERVAL 30 DAY`. Triggered **lazily on first request of the day**: `config.php` (or auth middleware) reads `system_state.k='last_cleanup_at'`, and if it's more than 24 hours old, schedules `cleanup-trash.php` via `register_shutdown_function` so the user's request returns immediately and cleanup runs in the background. Updates `last_cleanup_at` on completion. No cron, no GitHub Action, no SSH setup. Single-user sporadic-use friendly: even if the user doesn't open the app for a week, the next visit purges anything that's expired.

- **Other `deck_cards` readers** — all patched in this phase. The full reader list (verified by `Grep deck_cards` against the repo):
  - **PHP API**: `decks.php`, `deck-cards.php`, `coach-chat.php`, `my-collection.php`, `deck-profile.php`, `tts-export.php`, `lists.php` (the legacy "detach deck → list" path — likely obsolete post-cutover, verify and remove).
  - **PHP rules subsystem** (originally missed by the audit): `rules/chat.php`, `rules/active-game.php`. Both are coach-adjacent and probably use the same join pattern.
  - **TypeScript**: `apps/core/app/my-collection/CoachChat.tsx` — almost certainly a string literal in an AI tool description (`"query the deck_cards table..."`). Reword to reference "the deck's card list" so the AI stops generating SQL that won't exist post-Phase 5.
  - **Seed scripts** (3 files): `scripts/seed-precon-decks.php`, `scripts/seed-otj-mkm-fallout-decks.php`, `scripts/seed-more-precon-decks.php`. Rewrite to insert into `list_cards` (auto-creating the deck's main `lists` row). These are how new precon data lands; if not updated, future seed runs will silently bypass the new schema.
  - **Backfill script**: `scripts/backfill-card-cache.php` — read-only, trivial JOIN patch.
  - **Docs**: `docs/architecture-diagrams.puml` — update post-Phase 5; no functional impact but the diagrams will be wrong.
  - **Frozen**: `migrations/v2.0.0.sql` — historical, do not touch.

  All patched in **one PR** so the cutover is atomic.

**Parity script (`scripts/verify-deck-list-parity.sh`) ships with Phase 2.1**, not Phase 5. It compares row-by-row equivalence between every `deck_cards` row and the corresponding `list_cards` row joined via `lists.deck_id`. Runs as a manual gate before Phase 2.2 lands and as a CI check during the soak period. If parity ever drifts, the cutover is wrong and we fix the backfill or the dual-read query before proceeding.

### Phase 2.3 — Client hook + API

- `app/lib/lists/useList.ts` — `useList({ id?, deckId? })` returns `{list, cards, save, addCards, removeCard, updateCard, attachToDeck, detachFromDeck}`. The single hook every list-editing surface uses.
- `app/lib/lists/api.ts` — typed wrappers.
- `app/lib/decks/useDeck.ts` — unchanged in spirit; internally now reads its main list via `useList({deckId})`.

### Risks
- **Atomic cutover, not dual-write.** Phase 2.2 must patch every `deck_cards` reader and writer in one PR. Audit before merging: every PHP file that touches `deck_cards`, every TS file that imports `deck-cards.php`, every script. The parity script must pass cleanly before merge. After merge, `deck_cards` is read-only and unwritten — its only purpose is rollback insurance until Phase 5 drops it.
- **scan_drafts** — keep as sidecar table (✓ current schema is JSON-blob `state`); promote to a `lists` row on save commit (with optional `deck_id` if user picked a deck destination).
- **`list-audit.php`** — already audits lists; nothing to change.
- **Three deck-acquires-list paths**, all routed through `SaveToListDialog` (Phase 3):
  1. **Save (cards added in deck context)** → create new `lists` row with `deck_id` set.
  2. **Attach existing list** → set the chosen list's `deck_id` to the deck. Validate against the deck's format rules first; reject if invalid.
  3. **Save list as deck** → create new `decks` row and set the current list's `deck_id` to it.

  The deck → list transition is always lazy and always explicit — never automatic on deck creation.

  **Auto-naming.** Whenever a list is created via one of these paths, `SaveToListDialog` proposes a default name the user can override:
  - Path 1 (save in deck context) → `"<Deck name> — main"` (or `"<Deck name> — <role>"` for non-main roles).
  - Path 2 (attach existing list) → no rename; the list keeps its current name.
  - Path 3 (save list as deck) → the new deck takes the list's current name; the list is renamed to `"<Deck name> — main"` so deck-attached lists stay consistently named.
  - Standalone list (no deck) → `"Scan <date>"`, `"Import <date>"`, or `"Untitled list <date>"` based on `source`.

  This keeps the lists table self-describing without forcing the user to type a name every time.

  **Renaming: deck and list names are independent after creation.** The auto-name is a snapshot at the moment a list is created; it does not sync. Renaming a deck does NOT touch any of its attached lists' names. Renaming a list does NOT touch the deck. The user can rename either freely without surprise side effects.

  **Single exception — "save unnamed list as deck."** When a standalone list is being saved as a new deck (Path 3) AND the list's current name is the default placeholder (`"Scan <date>"`, `"Import <date>"`, `"Untitled list <date>"`), the new deck takes the user-supplied deck name and the list is renamed to `"<Deck name> — main"` so the deck-attached list isn't sitting there with a stale `"Scan 2026-04-07"` label. If the list already has a non-default user-given name, **leave it alone** — the user named it on purpose.

### Verify
- Snapshot dev DB: `mysqldump commander_collector > /tmp/cc-pre.sql`.
- Parity check: for every deck, `COUNT(deck_cards WHERE deck_id=X)` == `COUNT(list_cards WHERE list_id IN (SELECT id FROM lists WHERE deck_id=X AND role='main'))`.
- Manual:
  1. Open existing deck via `/decks/decklist?id=N` — still works (legacy reads OK).
  2. `GET /php-api/lists.php?deck_id=N` — returns the same cards.
  3. Create a new deck via the existing UI — **no `lists` row is created**; deck is listless until cards are added.
  4. Add the first card to that deck — a `lists` row appears with `deck_id` set.
  5. Create a standalone list (no deck) — works as before.
  5. Start a game from a deck — `games.deck_id` still works.
  6. Ask coach-chat about a deck — still works.
  7. Add a card via the legacy deck editor — appears in BOTH `deck_cards` and `list_cards`.

---

## Phase 3 — Scan and import as input adapters

Goal: gut `decks/scan/page.tsx` (1,368 LOC) into a thin orchestrator. Make scan and import structurally identical.

**Create**
- `app/components/scan/ScanInput.tsx` — owns image editor, OCR pipeline, Scryfall match preview, version picker. Pure producer: `onCardsRecognized: (cards: Card[]) => void`. **No save logic, no destination picker.**
- `app/components/cards/SaveToListDialog.tsx` — generic destination picker. Five destinations, all routed through this one dialog:
  - Save as **new standalone list** (name, optional notes)
  - Save as **new deck** (commander/partner/player picker → creates `decks` row + `lists` row with `deck_id` set in one transaction)
  - **Attach to existing deck** (deck typeahead → sets the current list's `deck_id`, after format validation)
  - **Save into the deck context** (when the user is already editing a deck's cards: creates the deck's first `lists` row with `deck_id` set, or replaces/appends to an existing main list)
  - **Append to existing list** (list typeahead)
  - Reused by scan AND import AND manual entry.

  **Save semantics with unresolved cards.** Saving is **never hard-blocked** by `not_found` rows. Behavior:
  - **All rows resolved or custom** → save proceeds silently.
  - **Any `not_found` rows present** → soft warning dialog: *"3 cards couldn't be matched. Save anyway? You can fix them later."* User confirms or cancels. Confirmed unresolved rows persist with `scryfall_id: null` and the badge until fixed on a later visit.
  - **Any `pending` or `transient_error` rows present** → save button waits briefly (up to 2s) for the in-flight retries to settle, then treats whatever's left as `not_found` and shows the same warning. **`transient_error` does NOT trigger the warning while a retry is in flight** — it'll probably resolve before save completes.
  - **`is_custom` rows** → never trigger any warning. They are intentionally unresolved.

  Hard-blocking saves on unresolved data is too punishing for the scan-and-walk-away workflow; soft-warning preserves user work without losing data.

  **Empty list saves are blocked at the client.** A buffer with zero cards cannot be saved as a list — the Save button is disabled and shows a tooltip ("Add at least one card to save"). This applies to standalone lists and deck-attached lists alike. **Decks themselves can still exist without a list** (a freshly created deck via the wizard is valid before any list is attached) — the rule is specifically that *a list with no cards* is not a savable thing. If a user wants a placeholder for future cards, they create the deck (which is listless) and the first card add triggers list creation through `SaveToListDialog` per the deck-acquires-list paths.

**Extract** (keep behavior, no rewrite)
- `app/lib/scan/ocr.ts`, `app/lib/scan/imageEditor.ts` — pulled from inline scan-page code.

**Modify**
- `decks/scan/page.tsx` collapses to ~150 LOC: it's now just `<CardListView editMode>` with `CardInputPanel` defaulted to the **Scan** tab. The page no longer owns scan-specific UI — scan is one of four equal input methods on the universal panel.
- `components/CardListImport.tsx` — deleted; its callers mount `<CardListView editMode>` directly (which already includes `CardInputPanel` with the Import tab).

**Verify**
- Scan a real card sheet → save to (1) new standalone list, (2) new deck, (3) existing deck's main list, (4) append to existing list. All four paths go through `SaveToListDialog`.
- Import from text → same four destinations.
- `git diff --stat decks/scan/page.tsx` shows ~1,200 LOC removed.

---

## Phase 4 — Page collapse and route restructure

**Conceptual moves**
- `/decks` — stays, lists decks (the *ideas*).
- `/decks/[id]` — stays, the deck's profile/stats/play history. The "edit cards" affordance now opens that deck's main list.
- `/decks/[id]/list` (or `/decks/[id]/cards`) — **new**, edits the deck's main list using `<CardListView editMode>`. Replaces `/decks/decklist`.
- `/lists` — stays, lists standalone lists.
- `/lists/[id]` — uses the same `<CardListView editMode>` component as the deck's list view.

The deck-attached list view and the standalone list view are **literally the same component** with different props (`commanderId` set or not).

**Multi-list-per-deck UX is schema-ready, UI-deferred.** The `lists.role` enum supports `'main'`, `'sideboard'`, `'maybeboard'`, `'acquireboard'`, etc., but in v1 the deck view shows the `role='main'` list only. Maybeboard / acquireboard / multi-format lists are a v1.x follow-up — purely UI work, no migration. Decks with multiple attached lists today reach the non-main lists directly via `/lists/[id]`. The deck view stays silent about them until the multi-list UI ships.

**Thin deck-new wizard.** `/decks/new` stays as a guided shortcut, but its internals collapse to the same primitives as the rest of the app. Just three fields: name, player, commander (via `CardLookupField` filtered to legal commanders). If the chosen commander has Partner / Friends Forever / Choose a Background / Doctor, a second `CardLookupField` appears, filtered to valid second-commanders for that mechanic. **On submit, the wizard creates a `decks` row only** — populating `decks.commander` (and `decks.partner` if applicable), `decks.colors`, `decks.has_w/u/b/r/g`, `decks.player_id`, `decks.format='commander'`. **No `lists` row is created.** The deck is fully complete and meaningful as a deck; an attached list is a separate, optional follow-up. The user reaches it via the "Create Deck List" action (Commander only) on the deck view, which opens an empty buffer pre-seeded with the commander row from `decks.commander`. **No bespoke wizard internals** — same `CardLookupField`, same validator, same primitives. Power users can also reach a deck-with-list state via the standalone-list-then-save-as-deck path.

**Modify (redirect stubs)**
- `decks/decklist/page.tsx` → `redirect('/decks/' + id + '/list')`
- Update navigation in `app/layout.tsx`, `app/page.tsx`, `DeckActions.tsx`.

**Risks** — basePath differs (`''` dev vs `/app/projects/commander` prod). Use `next/navigation` `redirect()` and relative `<Link>`. Test under `npm run build`.

**Verify** — Visit legacy URLs → redirect; deck card editor and standalone list editor have visually & behaviorally identical toolbars, filters, view toggles, save flows. Update Vitest tests with new paths.

---

## Phase 5 — Cleanup (gated, irreversible)

**Rename `list-audit.php` → `list-image-resolve.php`.** The current file is misleadingly named: it's a Scryfall image-resolution backfill (finds `list_cards` rows missing image data, batch-fetches from Scryfall, caches), not a change-history audit. Rename the file and update every caller. Frees the "audit" namespace for the actual `list_history` table.

**Deck-native columns stay.** `decks.commander`, `decks.partner`, `decks.colors`, `decks.has_w/u/b/r/g` are **NOT** dropped in Phase 5 or any other phase. They are deck-native data — the deck's own identity, independent of any attached list. Per the peers rule, the deck knows its commander whether or not a list is attached. The list has its own `role='commander'` flag for the list's perspective, and the two are allowed to disagree.

**Delete**
- `components/CardGridEditor.tsx`
- `components/CardListDisplay.tsx`
- `components/CardListImport.tsx`
- `components/DeckFilters.tsx` (replaced by `CardFilterBar` + `lib/cards/filter`)
- `decks/scan/components/CardReviewGrid.tsx`
- `decks/scan/components/CardAddDialog.tsx`
- `decks/scan/components/CardEditDialog.tsx`
- Inline `GalleryCard` in `decks/decklist` and `lists/detail`
- `lib/scryfall.ts` (after migration to new client lib)

**Create**
- `app/lib/scryfall/client.ts` — single Scryfall client, **always** routes through `php-api/scryfall-cache.php`. Methods: `searchByName`, `getById`, `getPrints`, `getImage`. Used by `CardSearchDialog`, `ScanInput`, `CardImportPanel`.

**Modify**
- `decks.php`, `deck-cards.php` — switch from dual-write to read-only shims (or 410 Gone) for one release.
- New migration `migrations/v<next>.sql` (matching package.json version):
  - Drop `deck_cards` table. **Gated by manual `mysqldump` checkpoint + `scripts/verify-deck-list-parity.sh`.**

**Do NOT touch**
- `decks` table — stays.
- `games.deck_id` — stays.
- `coach-chat.php`'s `deck_id` tool params — stay.
- `comparison.php`, `stats.php`, `advanced-stats.php`, `my-collection.php`, `deck-profile.php` — stay (they read decks, not deck_cards directly in most paths; verify and patch any direct `deck_cards` reads to use `list_cards` joined via `lists.deck_id`).

**Verify**
- `npm run build` clean.
- Full sweep: create deck (auto-creates main list), edit cards via `<CardListView>`, import a list, scan a sheet to a deck, scan a sheet to a standalone list, export TCGPlayer + TTS + CSV, start a game, exercise coach-chat against a deck, run stats / head-to-head / comparison.
- Grep for deleted component names — zero matches.
- Grep for `deck_cards` — zero matches outside the dropped migration history.

---

## What this design buys you

- **Decks remain ideas.** A deck with no list yet is legal. A deck can later have a Brawl list and a Commander list side by side.
- **Lists become the universal card container.** Scan, import, manual entry, deck-attached cardlist, wishlist, binder — all the same table, all the same endpoint, all the same UI.
- **No FK cascade.** `deck_id` keeps its meaning everywhere it already lives. Coach-chat, games, stats, comparison — untouched. The risky part of v1 is gone.
- **One filter bar, one toolbar, one list view, one card tile, one flip card, one search dialog, one import panel, one export panel, one save-to-list dialog.** Used identically whether you're editing a deck's cards, browsing your binder, or reviewing a scan.
- **Future-proof for multi-format decks.** `lists.format` + `lists.role` are already there.

---

## Test coverage targets

**Note from re-audit: zero tests exist today.** Vitest is configured (`npm run test:run`) but no `.test.ts` / `.spec.ts` files in the repo. Phase 0/1 test coverage is **all greenfield** — no legacy tests to update or break. This is good news: every test we write is net new value, and we can pick conventions freely.

**Phase 0 — pure lib: 90% line coverage required.** High enough to catch regressions, low enough to avoid churning on edge-case noise. Tests cover:
- `lib/cards/types.ts` — `toApiCard`/`fromApiCard` round-trip across all fields and the `0|1` ↔ boolean boundary.
- `lib/cards/fromScryfall.ts` — resolved, double-faced, name-only inputs; `proxy` parameter.
- `lib/cards/categorize.ts` — every type bucket; double-types like "Artifact Creature".
- `lib/cards/filter.ts` — color predicate (including the `{2/W}` twobrid case), type predicate, text search; alpha/CMC/type comparators.
- `lib/cards/colorIdentity.ts` — the axiom-enforcement tests already specced (`{G/W}`, `{2/W}`, `{W/P}`, pure colorless, "no colored card has C in identity").
- `lib/cards/matchKey.ts` — `normalize()` against diacritics, Æ→AE, punctuation, case; `matchKey()` for all combinations of present/absent `scryfall_id`.
- `lib/formats/commander.ts` — legal/illegal commander, color identity violations, banned cards, partner pairs (Partner / Friends Forever / Background / Doctor), card-count warnings vs errors.

**Phase 1 — UI primitives: behavior checklist per component.** No coverage %; instead, each primitive has an explicit list of behaviors that must have a passing test. Checklists below are the merge gate.

- `FlipCard` — flips on click, both set-based and per-instance modes, keyboard accessible.
- `CardTile` — renders all 5 lookup states (resolved / pending / not_found / transient_error / custom) with correct overlay; uses `card-not-found.webp` placeholder; respects size variants.
- `CardSearchDialog` — add mode pre-fills, edit mode pre-fills with existing card, calls `onConfirm` with correct shape.
- `CardLookupField` — autocomplete vs query mode auto-detection (test inputs with `*`, `:`, `=`, `<`, `>`, `(`, `"`, `!`, `-`); per-result qty stepper defaults to 1; help tooltip renders.
- `CardFilterBar` — filter and sort state propagation; default sort is alphabetical; respects color identity axiom.
- `CardListView` — view-mode toggle (gallery/text/breakdown), edit-mode gating, undo/redo stack (Cmd+Z), 409 conflict reload dialog, empty-buffer save block.
- `CardInputPanel` — all 4 tabs (Lookup/Import/Paste/Scan) mount and emit `Card[]`; singleton toggle gates dedup; basic lands always exempt; printing-variation rules; name-fallback dedup warning.
- `CardListToolbar` — every button fires the right callback; disabled states; detach button only in deck context.
- `CardImportPanel` (Paste tab) — `parseImport` integration; supported formats round-trip.
- `CardExportPanel` — TCGPlayer text snapshot; CSV round-trip; TTS calls the right endpoint.
- `SaveToListDialog` — all 5 destinations work; auto-naming rules per path; listless-deck flow; unnamed-list-as-deck rename exception.
- `DeleteImpactDialog` — per-list checkboxes for deck delete; correct messaging for list delete with attached deck.
- `Trash` — soft-deleted items appear; restore works; days-remaining counter accurate.

**Phase 2 — DB layer: migration smoke tests + parity script as part of `test:run`.**
- Migration runs cleanly against a fresh seeded `commander_collector` DB (3 decks with cards, 2 standalone lists, 1 listless deck).
- Row-count parity: `COUNT(deck_cards)` == matching `list_cards` after backfill.
- `verify-deck-list-parity.sh` invoked from `npm run test:run` so a parity break fails CI.
- PHP endpoint smoke tests under `tests/php/` for `lists.php` (POST/GET/PATCH) and the new `collections.php`-equivalent.
- `list_history` write tests: every save writes a row; `before_snapshot` null on create; `after_snapshot` null on soft delete; `source` enum populated correctly per input method.

**Phase 3 — scan refactor: snapshot tests on `ScanInput` against fixture images** before deleting old scan code.
- `ScanInput` emits `Card[]` against mock OCR + fixture cards.
- Image editor state transitions (rotate, brightness) preserved through the extract from the old monolith.
- Cross-device draft autosave fires on change; per-device keying respected.

**Phase 4 — page collapse: route redirect tests + integration tests.**
- `/decks/decklist?id=N` → `/decks/[id]/list`.
- `/lists/detail?id=N` → `/lists/[id]`.
- Both new routes use the same `CardListView` component.
- Existing Vitest tests with hard-coded old paths updated to new paths.

**Phase 5 — cleanup: build-green + grep-zero-match assertions.**
- `npm run build` clean.
- Grep for `deck_cards` returns zero matches outside historical migrations and docs.
- Grep for old `lib/scryfall'` import path returns zero matches.
- Grep for deleted component names returns zero matches.
- All prior tests still pass.

---

## Production cutover

Each phase ships to prod via `deploy-commander`. Before the **next** phase can ship, the deployed phase must pass a **usage checklist** — concrete actions exercised against the live code. This replaces calendar soak (wrong for a sporadically-used single-user app). Each checklist item must succeed before moving on.

**Pre-flight (before Phase 0):**
- [ ] Fix the recurring `.htaccess` deploy bug — see `feedback_htaccess_deploy.md` (4th recurrence as of 2026-03-30). Add `.htaccess` preservation to the deploy script. Without this, every deploy below also has to manually restore `.htaccess`.
- [ ] **Confirm prod DB has a regular backup schedule.** The cutover phases call for `mysqldump` snapshots before risky migrations, but those are *additions* to a baseline. If no daily/weekly backup exists, set one up before Phase 0 — separate ticket, must exist before the irreversible Phase 5 lands.
- [ ] **Verify live dev DB schema** against the plan's assumptions. The initial `decks`, `games`, `players` table definitions predate the migration system; we've inferred their shape from PHP queries but never read the schema directly. Run:
      ```bash
      mysqldump --no-data --skip-comments commander_collector \
        decks deck_cards lists list_cards games game_results players \
        scryfall_card_cache scan_drafts live_game_sessions live_game_seats \
        game_settings system_state coach_notes \
        > docs/current-schema.sql
      ```
      Commit `docs/current-schema.sql` to the repo as a reference snapshot. Diff against the plan's assumed columns. **If the live schema differs from the plan, update the plan** (the live schema is the source of truth) — do NOT alter the schema to match the plan. Specifically verify: `decks` has `commander VARCHAR(150)`, `partner VARCHAR(150) NULL`, `colors VARCHAR(10)`, `has_w/u/b/r/g`, no `format`, no `deleted_at`; `deck_cards` has `scryfall_id VARCHAR(36) NULL`, no `is_custom`, no `role`; `list_cards.scryfall_id` is `VARCHAR(64) NULL`; `games` has no `deck_id`; `game_results.deck_id` is the only deck FK; `scryfall_card_cache.scryfall_id` is `VARCHAR(36)` (we widen to 64) and has no `legalities` column.

**Phase 0 + 1 ship together** (code only, dead-coded primitives, no migration). Bump version, deploy.
- [ ] Open deck list, standalone list, scan page. Visually identical to before.
- [ ] `npm run lint` and `npm run test:run` clean.
- [ ] Mount `/dev/cards-sandbox` route, exercise the new primitives against fixtures.

**Phase 2.1 ships next** (first migration — additive only). Bump version, **back up prod first** (`mysqldump rickwphi_app_commander > ~/cc-prod-pre-phase21.sql`), deploy.
- [ ] Migration ran cleanly (check deploy log).
- [ ] Run `verify-deck-list-parity.sh` against prod — zero drift.
- [ ] Open 3 existing decks, edit cards, save. Old code paths still in use; data unchanged.
- [ ] Run parity script again — still zero drift.
- [ ] Create a new deck via the existing wizard — no `lists` row created (deck stays listless until cards added).
- [ ] Verify `list_history` table exists and is empty (no writes happen yet — Phase 2.2 turns those on).

Rollback: restore `cc-prod-pre-phase21.sql`, OR leave columns and revert code (additive migration is forward-compatible with old code).

**Phase 2.2 ships next** (atomic cutover — the scary one). Bump version, deploy.
- [ ] Run parity script BEFORE deploy — must be clean.
- [ ] Deploy.
- [ ] Run parity script immediately after — coach-chat queries return identical data through the new join.
- [ ] Open an existing deck → cards still display.
- [ ] Add a card via legacy editor → saves into `list_cards` (verify with a SELECT).
- [ ] **Ask coach-chat about a specific deck** → answers correctly using the new SQL joins.
- [ ] Start a game referencing a deck → `games.deck_id` still works.
- [ ] Open `/lists/[id]` for an existing standalone list → still works.
- [ ] `list_history` is now receiving rows on every save.
- [ ] Verify `scan_drafts` per-device keying works: open scan from two browsers as the same user → independent drafts.
- [ ] **Run one seed script** (`scripts/seed-precon-decks.php`) against a throwaway dev DB to verify the rewritten seeds insert into `list_cards` cleanly. Easy to forget; would silently bypass the new schema otherwise.

Rollback: redeploy previous commit. Run **back-sync script** (`scripts/sync-list-cards-to-deck-cards.php`) to copy any new `list_cards` writes back into `deck_cards` so the reverted code sees them. The back-sync script ships in Phase 2.2's PR specifically for this rollback.

**Phase 3 + 4 ship together** (scan refactor + page collapse). Bump version (likely a major bump — 4.x → 5.0 — for the route restructure). Deploy.
- [ ] Visit `/decks/decklist?id=N` → redirects to `/decks/[id]/list`.
- [ ] Visit `/lists/detail?id=N` → redirects to `/lists/[id]`.
- [ ] Open a Commander deck → "Create Deck List" button appears (deck is listless) OR the deck's main list shows.
- [ ] Click "Create Deck List" → buffer opens with commander pre-populated, unsaved.
- [ ] Scan a sheet → save to (a) new standalone list, (b) new deck, (c) existing deck, (d) append to existing list. All four paths route through `SaveToListDialog`.
- [ ] Import a text list via `CardInputPanel` Paste tab → same four destinations work.
- [ ] Lookup a card via `CardLookupField` → scrollable results with per-row qty stepper.
- [ ] Help tooltip `(?)` appears on every card-input surface.
- [ ] Buffer undo (Cmd+Z) works inside `CardListView`.
- [ ] Trash view: soft-delete a deck and a list, restore both.
- [ ] Open same list in two browser tabs, save in tab A, save in tab B → tab B gets 409 reload dialog.

Rollback: redeploy previous commit. Routes revert; data unaffected.

**Phase 5 ships last** (cleanup — irreversible). **Back up prod again** (`mysqldump rickwphi_app_commander > ~/cc-prod-pre-phase5.sql`). Bump version, deploy.
- [ ] Parity script clean BEFORE deploy.
- [ ] Migration drops `deck_cards`, `decks.commander_card_id`, `decks.partner_card_id`. Verify tables/columns gone.
- [ ] `list-audit.php` renamed to `list-image-resolve.php`. Verify all callers updated.
- [ ] Full manual sweep: every form of save/load/scan/import/export, coach-chat against a deck, stats/comparison/head-to-head, trash/restore.
- [ ] `npm run build` clean.
- [ ] Grep for `deck_cards` in deployed PHP — zero matches outside historical migrations.

Rollback: restore `cc-prod-pre-phase5.sql`. **This is the only phase where rollback requires a DB restore.**

---

## Out of scope for v1 (acknowledged backlog)

These came up during planning, are valuable, and explicitly DO NOT block this refactor. v1.x and beyond:

- **Disk space monitoring on prod.** TTS sprite sheets in `~/public_html/tts-sheets/`, image cache via `card-image.php`, soft-deleted rows during the 30-day window, and `list_history` rows are all unbounded growth surfaces. Set up periodic disk-usage alerts as a separate ticket.
- **Deck cloning.** "Clone this deck for a tournament build." Cheap to add later — clone a deck = INSERT into `decks` with the same `commander`/`partner`/`colors`; clone an attached list separately if desired. Per the peers rule, the two are independent operations. No new schema.
- **Print / PDF proxy export.** TTS export already montages a sprite sheet via ImageMagick — a print/PDF variant could reuse the montage logic. New format option on `CardExportPanel` when it lands.
- **Multi-list-per-deck UX.** Schema-ready (`lists.role`), UI-deferred. Maybeboard / acquireboard / multi-format lists are pure UI work, no migration.
- **Deck-value display from cached prices.** `scryfall_card_cache.prices` is captured from day one in v1; the v1.x deck-value display has data when it ships.
- **History view from `list_history`.** Table is write-only in v1; the read endpoint and UI ship in v1.x. Data accumulates from day one.
- **Diff/merge UI on save conflict.** v1's 409 dialog is reload-only; merge UI is v1.x.
- **Custom-card image upload.** v1 just shows the placeholder + `is_custom` badge; image upload is v1.x.
- **Companion role** in `list_cards.role` enum. Not in v1; add when needed.
- **Signature spell role** for Oathbreaker support. Add when Oathbreaker support actually lands.
- **Full a11y audit.** Phase 1 ships an a11y baseline (ARIA, focus management, keyboard nav, contrast, screen-reader smoke test). A full audit against WCAG 2.1 AA is v1.x.
- **Bulk Scryfall data download** for cache refresh. v1 uses TTL-based per-row refresh; bulk-download mode is a v1.x optimization.
- **Coach-chat snapshot integration.** `cardlist_snapshot` is stored in `game_results` from v1, but **never auto-fed** to coach-chat. Any future coach-chat integration with snapshots requires explicit user opt-in per query ("Ask coach about this build" button), not implicit context inflation. This is a guardrail, not a feature.

## Live game and deck identity (clarification)

Live games (`live_game_sessions.state` JSON) capture `players[].deckId`, `players[].deckName`, and `players[].commander.name` at session start. **Per the peers rule, a deck's identity (`commander`, `partner`, `colors`) is deck-native and stable** — it does not change when an attached list mutates, because the list is a separate first-class object. Live games read deck identity from `decks`, not from any attached list, so list mutations between session start and end have no effect on the live game state. **No work needed for v1**; this clarification exists so future-me doesn't try to "fix" a non-problem by snapshotting list state into the live game.

## Cross-cutting notes

- **Versioning**: Phases 2.1 and 5 ship migrations. `package.json` version MUST be bumped in the same commit so the migration filename matches (per memory).
- **basePath**: nothing hardcodes routes; use `next/navigation` `redirect()` and relative `<Link>`.
- **Dev DB only** (`commander_collector`). Production cutover is a separate ticket after Phase 5 burns in.
- **Rollback**: Phases 0–1 are pure additions. Phase 2 dual-writes (rollback = stop reading new tables). Phases 3–4 reverted by restoring old page files from git. Phase 5 (dropping `deck_cards`) is the only irreversible step — gate it with a backup + parity script.
- **Sequencing**: 0+1 ship together. 2 must bake one dev cycle before 3. 3+4 ship together. 5 is its own PR after a soak period.

---

## Critical files to read before starting
- `app/lib/types.ts`, `app/lib/api.ts`
- `app/decks/scan/page.tsx` (the 1,368-LOC monolith)
- `app/components/CardGridEditor.tsx`
- `app/decks/decklist/page.tsx` and `app/lists/detail/page.tsx` (near-duplicates)
- `app/php-api/lists.php` (the model for the universalized endpoint)
- `app/php-api/decks.php`, `deck-cards.php` (the dual-write surface)
- `app/php-api/coach-chat.php` ⚠ (70+ `deck_id` refs — **left untouched** in v2; verify it still resolves cards)
