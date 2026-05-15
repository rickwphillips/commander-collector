/** Check if bold text looks like a Comprehensive Rules reference, e.g. "CR 117.3c", "117.3c", "903.6". */
export function looksLikeCRReference(text: string): boolean {
  if (!text) return false;
  const t = text.trim();
  return /^(CR\s+)?\d{3}(\.\d+[a-z]?)?$/i.test(t);
}

/** Check if bold text looks like a pattern-library reference, e.g. "P523", "#P523", "p523". */
export function looksLikePNumber(text: string): boolean {
  if (!text) return false;
  return /^#?P\d{1,4}$/i.test(text.trim());
}

/** Check if bold text looks like an MTG card name (not a keyword, CR ref, P-ref, or section header) */
export function looksLikeCardName(text: string): boolean {
  if (!text || text.length < 2) return false;
  if (looksLikeCRReference(text)) return false;   // "CR 117.3c", "903.6"
  if (looksLikePNumber(text)) return false;       // "P523", "#P523"
  if (text.includes(':')) return false;           // CR refs, labels
  if (text.startsWith('"') || text.startsWith("'")) return false; // quoted questions/phrases
  if (/^\d/.test(text)) return false;             // "7c", "117.3"
  if (text === text.toUpperCase()) return false;  // "APNAP", "SBA"
  if (text.split(' ').length > 7) return false;   // no real card has 8+ words
  // Section headers ending in common category nouns
  if (/\b(Questions|Examples|Interactions|Scenarios|Cases|Notes|Topics|Concepts|Mechanics|Strategies|Techniques|Methods|Types|Levels|Tricks)$/i.test(text)) return false;
  if (/^(Note|Example|Important|Warning|Summary|Result|Step|Phase|Rule|Effect|Trigger|Action|Cost|Event|Zone|Stack|Turn|Ability|Creature|Spell|Permanent|Player|Target|Source|Object|Card)s?$/.test(text)) return false;
  return true;
}

/** Extract CARDS: manifest from AI response content */
export function parseCardManifest(content: string): { cleaned: string; cards: string[] } {
  const match = content.match(/\nCARDS:\s*(.+)$/m);
  if (!match) return { cleaned: content, cards: [] };
  const bracketMatches = match[1].match(/\[\[([^\]]+)\]\]/g);
  const cards = bracketMatches
    ? bracketMatches.map(s => s.replace(/^\[\[|\]\]$/g, '').trim()).filter(Boolean)
    : match[1].split(',').map(s => s.trim()).filter(Boolean);
  const cleaned = content.replace(/\nCARDS:\s*.+$/m, '').replace(/\[\[([^\]]+)\]\]/g, '**$1**').trimEnd();
  return { cleaned, cards };
}
