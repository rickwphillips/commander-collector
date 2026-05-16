/**
 * Client-side card-name catalog.
 *
 * The Rules Guru chat used to wrap any bold text that passed a regex
 * heuristic in CardTooltip. That mis-classified labels like "Card advantage"
 * or "Proliferate is multiplicative" as cards, showing a dotted-link
 * underline on hover-spinners that never resolved.
 *
 * This loader pulls a canonical lowercase Scryfall card-name catalog
 * (~34k names, ~600 KB JSON, ~200 KB gzipped) once per page load and
 * exposes `isKnownCardName(text)` for the dispatcher.
 *
 * Failed catalog loads return false from every lookup, so all bold renders
 * plain. That's the SAFE failure mode: nothing pretends to be a card.
 */

let catalog: Set<string> | null = null;
let loadingPromise: Promise<Set<string> | null> | null = null;

/**
 * Fetch the card-name catalog from the given URL. Idempotent: subsequent
 * calls return the already-loaded Set (or the in-flight promise).
 *
 * Pass a fully-resolved URL that respects the consuming app's basePath
 * (e.g. `/app/projects/commander/rules/card-names.json` in prod,
 * `/card-names.json` in dev). The caller knows the basePath; this loader
 * does not infer it.
 */
export function loadCardCatalog(url: string): Promise<Set<string> | null> {
  if (catalog) return Promise.resolve(catalog);
  if (loadingPromise) return loadingPromise;

  loadingPromise = fetch(url)
    .then((res) => (res.ok ? res.json() : null))
    .then((names: string[] | null) => {
      if (!Array.isArray(names)) return null;
      catalog = new Set(names);
      return catalog;
    })
    .catch(() => null)
    .finally(() => {
      // Keep the loaded catalog cached; clear the in-flight slot.
      loadingPromise = null;
    });

  return loadingPromise;
}

/**
 * Synchronous lookup. Returns false if the catalog hasn't loaded yet OR if
 * the text isn't a known card name. Case-insensitive, trims whitespace.
 *
 * The "not loaded yet" case is intentionally indistinguishable from "not a
 * card" so the dispatcher renders plain bold during the load window.
 */
export function isKnownCardName(text: string): boolean {
  if (!catalog || !text) return false;
  // Normalize typographic apostrophes (U+2019 ' and U+02BC ʼ) to straight (U+0027 ')
  // so LLM output like "Teferi’s Protection" matches the catalog entry.
  const normalized = text.trim().toLowerCase().replace(/[’ʼ]/g, "'");
  return catalog.has(normalized);
}

/** Exposed for testing / inspection. */
export function catalogSize(): number {
  return catalog ? catalog.size : 0;
}
