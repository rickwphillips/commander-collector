/** Check if bold text looks like an MTG card name (not a keyword, CR ref, or section header) */
export function looksLikeCardName(text: string): boolean {
  if (!text || text.length < 2) return false;
  if (text.includes(':')) return false;           // CR refs, labels
  if (/^\d/.test(text)) return false;             // "7c", "117.3"
  if (text === text.toUpperCase()) return false;  // "APNAP", "SBA"
  if (text.split(' ').length > 7) return false;   // no real card has 8+ words
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
