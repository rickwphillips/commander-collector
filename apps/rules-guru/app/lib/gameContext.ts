import type { ActiveGameContext, GameContextPlayer } from './types';

/** Map a player record from the game manager ctx payload into GameContextPlayer. */
export function mapRawPlayer(p: Record<string, unknown>): GameContextPlayer {
  return {
    playerName: String(p.playerName ?? 'Unknown'),
    deckName: String(p.deckName ?? ''),
    commander: (p.commander as string | null) ?? null,
    partner: (p.partner as string | null) ?? null,
    deckId: (p.deckId as string | null) ?? null,
    cards: Array.isArray(p.cards) ? (p.cards as string[]) : [],
    life: typeof p.life === 'number' ? p.life : undefined,
    poison: typeof p.poison === 'number' ? p.poison : undefined,
    energy: typeof p.energy === 'number' ? p.energy : undefined,
    experience: typeof p.experience === 'number' ? p.experience : undefined,
    commanderTax: typeof p.commanderTax === 'number' ? p.commanderTax : undefined,
    isEliminated: !!p.isEliminated,
    isConceded: !!p.isConceded,
    isMonarch: !!p.isMonarch,
    hasInitiative: !!p.hasInitiative,
    hasCitysBlessing: !!p.hasCitysBlessing,
    commanderDamage: (p.commanderDamage as Record<string, number[]> | undefined) ?? undefined,
    teamNumber: typeof p.teamNumber === 'number' ? p.teamNumber : undefined,
    teamName: typeof p.teamName === 'string' ? p.teamName : undefined,
  };
}

/** Map the full ctx object from CenterZone / postMessage into ActiveGameContext. */
export function mapRawGameContext(raw: Record<string, unknown>): ActiveGameContext {
  return {
    gameType: (raw.gameType as ActiveGameContext['gameType']) ?? 'commander',
    turnNumber: (raw.turnNumber as number | null) ?? null,
    currentPlayer: (raw.currentPlayer as string | null) ?? null,
    currentTeam: (raw.currentTeam as string | null) ?? null,
    focusPlayerName: raw.focusPlayerName as string | undefined,
    players: (raw.players as Record<string, unknown>[] | undefined ?? []).map(mapRawPlayer),
  };
}

/** One-line board state for the opening UI message in embedded chat. */
export function formatPlayerStateLine(p: GameContextPlayer): string {
  const parts: string[] = [];
  if (p.life != null) parts.push(`${p.life} life`);
  if (p.poison && p.poison > 0) parts.push(`${p.poison} poison`);
  if (p.energy && p.energy > 0) parts.push(`${p.energy} energy`);
  if (p.experience && p.experience > 0) parts.push(`${p.experience} experience`);
  if (p.commanderTax && p.commanderTax > 0) parts.push(`commander tax +${p.commanderTax * 2}`);
  const badges: string[] = [];
  if (p.isMonarch) badges.push('Monarch');
  if (p.hasInitiative) badges.push('Initiative');
  if (p.hasCitysBlessing) badges.push("City's Blessing");
  if (badges.length) parts.push(badges.join(', '));
  if (p.isEliminated) parts.push('eliminated');
  if (p.isConceded) parts.push('conceded');

  let line = parts.join(', ') || 'in game';
  const dmg = p.commanderDamage;
  if (dmg && Object.keys(dmg).length > 0) {
    const dmgParts = Object.entries(dmg).map(([src, vals]) =>
      vals.length > 1 && vals[1] > 0 ? `${vals[0]}+${vals[1]} from ${src}` : `${vals[0]} from ${src}`,
    );
    line += ` (cmd dmg: ${dmgParts.join(', ')})`;
  }
  return line;
}

/** Board state lines for the embedded chat opener — team-grouped in 2HG. */
export function formatBoardStateLines(ctx: ActiveGameContext): string[] {
  if (ctx.gameType === '2hg') {
    const teams = new Map<number, { name: string; life?: number; poison?: number; heads: string[] }>();
    for (const p of ctx.players) {
      const tNum = p.teamNumber ?? 0;
      const tName = p.teamName ?? `Team ${tNum}`;
      if (!teams.has(tNum)) {
        teams.set(tNum, { name: tName, life: p.life, poison: p.poison ?? 0, heads: [] });
      }
      const headParts: string[] = [];
      if (p.commanderTax && p.commanderTax > 0) headParts.push(`commander tax +${p.commanderTax * 2}`);
      if (p.isMonarch) headParts.push('Monarch');
      if (p.isEliminated) headParts.push('eliminated');
      const dmg = p.commanderDamage;
      if (dmg && Object.keys(dmg).length > 0) {
        const dmgParts = Object.entries(dmg).map(([src, vals]) =>
          vals.length > 1 && vals[1] > 0 ? `${vals[0]}+${vals[1]} cmdr dmg from ${src}` : `${vals[0]} cmdr dmg from ${src}`,
        );
        headParts.push(dmgParts.join(', '));
      }
      const headDetail = headParts.length ? headParts.join('; ') : 'no notable status';
      teams.get(tNum)!.heads.push(`    ${p.playerName}: ${headDetail}`);
    }
    return [...teams.values()].flatMap((team) => {
      const shared: string[] = [];
      if (team.life != null) shared.push(`${team.life} shared life`);
      if (team.poison != null && team.poison > 0) shared.push(`${team.poison} shared poison`);
      const lines = [`  • ${team.name} — ${shared.join(', ') || 'in game'}`];
      lines.push(...team.heads);
      return lines;
    });
  }

  return ctx.players.map((p) => `  • ${p.playerName}: ${formatPlayerStateLine(p)}`);
}

/** Game handed over by the game manager's chat button as `?ctx=` (base64 JSON). */
export interface GameHandoff {
  /** Parsed game context; null when the param is malformed. */
  ctx: ActiveGameContext | null;
  /** Opening "active game" message, when the handoff includes turn info. */
  openingMessage: string | null;
}

/**
 * Read the `?ctx=` handoff from the URL, or null when the page was not opened
 * from the game manager. Called once, from a state initializer.
 */
export function readGameHandoff(): GameHandoff | null {
  const ctxParam = new URLSearchParams(window.location.search).get('ctx');
  if (!ctxParam) return null;
  try {
    const raw = JSON.parse(atob(decodeURIComponent(ctxParam))) as Record<string, unknown>;
    const ctx = mapRawGameContext(raw);
    if (!raw.turnNumber && !raw.currentPlayer) return { ctx, openingMessage: null };

    // Opening UI message — mirrors board state the backend now receives too
    const playerLines = formatBoardStateLines(ctx).join('\n');
    const formatLabel = ctx.gameType === '2hg' ? '2HG' : 'Commander';
    const turnLabel = ctx.currentTeam
      ? `Turn ${raw.turnNumber ?? '?'}, ${ctx.currentTeam}'s turn`
      : `Turn ${raw.turnNumber ?? '?'}, ${raw.currentPlayer ?? '?'}'s turn`;
    const openingMessage = [`**Active ${formatLabel} game — ${turnLabel}**`, playerLines].join('\n');
    // Build hidden timer note for AI context (not shown to user)
    if (raw.timerSeconds && raw.currentPlayer) {
      const elapsed = (raw.elapsedSeconds as number) ?? 0;
      const total = raw.timerSeconds as number;
      const remaining = Math.max(0, total - elapsed);
      const pct = elapsed / total;
      const name = raw.currentPlayer as string;
      const quips =
        pct >= 0.75
          ? [
              `${name} has used ${Math.round(pct * 100)}% of the turn timer and still hasn't acted. Feel free to weave in a gentle ribbing if it's relevant.`,
              `${name} is deep in the tank with only ~${Math.round(remaining)}s left on the timer. You can playfully acknowledge the delay if appropriate.`,
            ]
          : pct >= 0.4
          ? [
              `${name} is about halfway through the turn timer (${Math.round(elapsed)}s elapsed). You can lightly tease them about thinking time if it fits.`,
            ]
          : [
              `${name}'s turn just started — timer is running but no pressure yet.`,
            ];
      ctx._timerNote = quips[Math.floor(Math.random() * quips.length)];
    }
    return { ctx, openingMessage };
  } catch {
    // Malformed ctx param — the page falls back to a DB lookup
    return { ctx: null, openingMessage: null };
  }
}
