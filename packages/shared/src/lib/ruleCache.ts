import { apiFetch } from './api';

/**
 * Fetcher + in-memory cache for MTG rule references shown as hover tooltips.
 *
 * Two reference kinds:
 *   - CR rule:  "CR 117.3c", "117.3c", "903.6"        → cr-rule.php (proxies MCP)
 *   - Pattern:  "P523", "#P523"                       → pattern.php (proxies MCP)
 *
 * Failures (404, network error, transport down) are NEVER cached so a recovering
 * MCP transport is picked up on the next hover. Successful lookups are kept for
 * the life of the page.
 */

// ── CR rules ────────────────────────────────────────────────────────────────

export interface CRRule {
  rule_number: string;
  body: string;
  parent?: string | null;
  examples?: string[] | null;
}

const ruleCache = new Map<string, CRRule | null>();
const ruleInFlight = new Map<string, Promise<CRRule | null>>();

/** Normalize "CR 117.3c" / "117.3c" / " CR  117.3C " to "117.3c". */
function normalizeRuleNumber(input: string): string {
  return input.trim().replace(/^CR\s+/i, '').toLowerCase();
}

interface ConfidenceEnvelope<T> {
  band: 'certain' | 'unknown';
  data?: T;
  sources?: string[];
  caveats?: string[];
}

export async function getCRRuleByNumber(input: string): Promise<CRRule | null> {
  const key = normalizeRuleNumber(input);
  if (!key) return null;
  if (ruleCache.has(key)) return ruleCache.get(key) ?? null;
  if (ruleInFlight.has(key)) return ruleInFlight.get(key)!;

  const promise = apiFetch<ConfidenceEnvelope<CRRule | { section: string; rules: CRRule[] }>>(
    `/rules/cr-rule?n=${encodeURIComponent(key)}`
  )
    .then((res) => {
      if (res.band !== 'certain' || !res.data) return null;
      // Section-level lookup returns {section, rules[]}; pick the first as the headline.
      if ('rules' in res.data && Array.isArray(res.data.rules)) {
        return res.data.rules[0] ?? null;
      }
      return res.data as CRRule;
    })
    .then((rule) => {
      if (rule) ruleCache.set(key, rule);
      ruleInFlight.delete(key);
      return rule;
    })
    .catch(() => {
      ruleInFlight.delete(key);
      return null;
    });

  ruleInFlight.set(key, promise);
  return promise;
}

// ── Patterns ────────────────────────────────────────────────────────────────

export interface PatternRef {
  pattern_id: string;
  name: string;
  category?: string;
  abstract?: string | null;
  cr_refs?: string[] | null;
  tags?: string[] | null;
}

const patternCache = new Map<string, PatternRef | null>();
const patternInFlight = new Map<string, Promise<PatternRef | null>>();

/** Normalize "#P523" / "p523" to "P523". */
function normalizePatternId(input: string): string {
  return input.trim().replace(/^#/, '').toUpperCase();
}

export async function getPatternById(input: string): Promise<PatternRef | null> {
  const key = normalizePatternId(input);
  if (!key) return null;
  if (patternCache.has(key)) return patternCache.get(key) ?? null;
  if (patternInFlight.has(key)) return patternInFlight.get(key)!;

  const promise = apiFetch<ConfidenceEnvelope<PatternRef>>(
    `/rules/pattern?id=${encodeURIComponent(key)}`
  )
    .then((res) => (res.band === 'certain' && res.data ? res.data : null))
    .then((pat) => {
      if (pat) patternCache.set(key, pat);
      patternInFlight.delete(key);
      return pat;
    })
    .catch(() => {
      patternInFlight.delete(key);
      return null;
    });

  patternInFlight.set(key, promise);
  return promise;
}
