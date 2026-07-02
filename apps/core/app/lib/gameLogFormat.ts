import type { GameLogEntry } from '@/lib/types';

// Render one game-log entry as a readable line. Shared by the in-game viewer
// (CenterZone) and the game details page.
export function describeLogEntry(entry: GameLogEntry): string {
  const p = entry.payload ?? {};
  const str = (k: string) => (p[k] == null ? '' : String(p[k]));
  const num = (k: string) => (typeof p[k] === 'number' ? (p[k] as number) : undefined);
  switch (entry.type) {
    case 'game_started': {
      const players = Array.isArray(p.players) ? (p.players as unknown[]) : [];
      return `Game started: ${players.length} players${p.gameType === '2hg' ? ' (2HG)' : ''}`;
    }
    case 'turn_order':
      return `Turn order: ${Array.isArray(p.order) ? (p.order as string[]).join(', ') : ''}`;
    case 'pass_turn':
      return `Turn ${str('turn')}: ${str('to')} to play`;
    case 'turn_change':
      return `Turn ${str('turn')}`;
    case 'turn_revert':
      return `Turn reverted${p.to ? `: back to ${str('to')}` : ''} (turn ${str('turn')})`;
    case 'die_roll': {
      const rolls = Array.isArray(p.rolls) ? (p.rolls as unknown[]).join(', ') : '';
      const total = num('total');
      return `Rolled ${str('die')}: ${rolls}${total != null ? ` (total ${total})` : ''}`;
    }
    case 'roll_for_first': {
      const rolls = Array.isArray(p.rolls) ? (p.rolls as Array<{ player?: string; roll?: number }>) : [];
      return `Roll for first: ${rolls.map((r) => `${r.player} ${r.roll}`).join(', ')}`;
    }
    case 'life_change': {
      const d = num('delta');
      return `${str('player')} life ${str('from')} → ${str('to')} (${d != null && d >= 0 ? '+' : ''}${str('delta')})`;
    }
    case 'poison_change':
      return `${str('player')} poison ${str('from')} → ${str('to')}`;
    case 'commander_damage':
      return `${str('source')} → ${str('target')} commander damage ${str('from')} → ${str('to')}`;
    case 'energy_change':
      return `${str('player')} energy → ${str('to')}`;
    case 'experience_change':
      return `${str('player')} experience → ${str('to')}`;
    case 'commander_tax':
      return `${str('player')} commander tax → ${str('to')}`;
    case 'monarch':
      return `${str('player')} ${p.value ? 'became' : 'lost'} Monarch`;
    case 'initiative':
      return `${str('player')} ${p.value ? 'took' : 'lost'} the Initiative`;
    case 'citys_blessing':
      return `${str('player')} ${p.value ? 'gained' : 'lost'} the City's Blessing`;
    case 'eliminate':
      return `${str('player')} eliminated${p.cause ? ` (${str('cause')})` : ''}${p.source ? ` by ${str('source')}` : ''}${p.turn ? `, turn ${str('turn')}` : ''}`;
    case 'kill_attribution':
      return `${str('player')}'s ${str('cause')} kill credited to ${str('source') || 'unknown'}`;
    case 'concede':
      return `${str('player')} conceded${p.turn ? `, turn ${str('turn')}` : ''}`;
    case 'manual_entry':
      return `Manual entry by ${str('created_by') || 'unknown'}`;
    default:
      return entry.type;
  }
}

// Extract HH:MM:SS from an ISO timestamp (e.g. 2026-07-02T18:15:25Z).
export function logEntryTime(ts: string): string {
  const m = /T(\d{2}:\d{2}:\d{2})/.exec(ts ?? '');
  return m ? m[1] : '';
}
