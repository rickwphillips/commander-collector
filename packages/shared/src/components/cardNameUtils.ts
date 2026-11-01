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
