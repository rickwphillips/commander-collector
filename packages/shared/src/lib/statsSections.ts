import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StyleIcon from '@mui/icons-material/Style';
import PeopleIcon from '@mui/icons-material/People';
import PaletteIcon from '@mui/icons-material/Palette';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HandshakeIcon from '@mui/icons-material/Handshake';
import BarChartIcon from '@mui/icons-material/BarChart';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import type { SvgIconComponent } from '@mui/icons-material';

export type StatsSectionId =
  | 'overall'
  | 'topPlayers'
  | 'topDecks'
  | 'topCommanders'
  | 'h2h'
  | 'multiplayer'
  | 'twoHg'
  | 'colorMeta'
  | 'colorPresence'
  | 'colorCount'
  | 'podSize'
  | 'playerStreaks'
  | 'deckStreaks';

export interface StatsSectionDef {
  id: StatsSectionId;
  label: string;
  description: string;
  icon: SvgIconComponent;
}

export const STATS_SECTIONS: StatsSectionDef[] = [
  {
    id: 'overall',
    label: 'Overall Stats',
    description: 'Total games, players, decks, and average game length',
    icon: BarChartIcon,
  },
  {
    id: 'topPlayers',
    label: 'Top Players',
    description: 'Player win rates and rankings',
    icon: EmojiEventsIcon,
  },
  {
    id: 'topDecks',
    label: 'Top Decks',
    description: 'Deck win rates and rankings',
    icon: StyleIcon,
  },
  {
    id: 'topCommanders',
    label: 'Top Commanders',
    description: 'Commander popularity and win rates',
    icon: PeopleIcon,
  },
  { id: 'h2h', label: 'Head-to-Head', description: '1v1 matchup records', icon: CompareArrowsIcon },
  {
    id: 'multiplayer',
    label: 'Multiplayer',
    description: 'Multiplayer matchup records',
    icon: GroupsIcon,
  },
  {
    id: 'twoHg',
    label: 'Two-Headed Giant',
    description: 'Team records, pairings, and recent games',
    icon: HandshakeIcon,
  },
  {
    id: 'colorMeta',
    label: 'Color Meta Analysis',
    description: 'Win rates by color identity',
    icon: PaletteIcon,
  },
  {
    id: 'colorPresence',
    label: 'Color Presence',
    description: 'Win rates for all decks containing each color',
    icon: PaletteIcon,
  },
  {
    id: 'colorCount',
    label: 'Color Complexity',
    description: 'Performance by number of colors (mono vs two-color vs multi)',
    icon: PaletteIcon,
  },
  {
    id: 'podSize',
    label: 'Performance by Pod Size',
    description: 'Player stats broken down by pod size',
    icon: GroupsIcon,
  },
  {
    id: 'playerStreaks',
    label: 'Player Streaks & Form',
    description: 'Current streaks, best streaks, and trends',
    icon: TrendingUpIcon,
  },
  {
    id: 'deckStreaks',
    label: 'Deck Streaks & Form',
    description: 'Deck streaks, best streaks, and trends',
    icon: TrendingUpIcon,
  },
];

export const DEFAULT_SECTION_ORDER: StatsSectionId[] = STATS_SECTIONS.map((s) => s.id);

export const VALID_SECTION_IDS = new Set<string>(DEFAULT_SECTION_ORDER);

export function getSectionDef(id: StatsSectionId): StatsSectionDef | undefined {
  return STATS_SECTIONS.find((s) => s.id === id);
}
