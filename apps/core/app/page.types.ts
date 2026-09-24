import PeopleIcon from '@mui/icons-material/People';
import StyleIcon from '@mui/icons-material/Style';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import BarChartIcon from '@mui/icons-material/BarChart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CollectionsIcon from '@mui/icons-material/Collections';
import type { SvgIconComponent } from '@mui/icons-material';

/**
 * One tile in the dashboard's navigation grid.
 *
 * `icon` is the icon *component*, not a rendered element, so a tile stays plain
 * data; the dashboard renders it and page.module.scss sizes it. `slug` keys the
 * tile's accent colour out of the `$nav-colors` Sass map in page.module.scss,
 * so colours live in the stylesheet rather than here.
 */
export interface NavItem {
  title: string;
  description: string;
  /** In-app route, relative to the app's basePath. */
  href: string;
  icon: SvgIconComponent;
  slug: string;
  /**
   * True for tiles that leave apps/core (currently only rules-guru, which is a
   * separate Next app). These resolve to an absolute URL instead of `href`.
   */
  external?: boolean;
}

/**
 * The dashboard's navigation tiles, in display order. Accent colours are not
 * here: each tile's `slug` selects one from the `$nav-colors` map in
 * app/page.module.scss.
 */
export const navItems: NavItem[] = [
  {
    title: 'Players',
    description: 'Manage your playgroup',
    href: '/players',
    icon: PeopleIcon,
    slug: 'players',
  },
  {
    title: 'Decks',
    description: 'Track commanders and decks',
    href: '/decks',
    icon: StyleIcon,
    slug: 'decks',
  },
  {
    title: 'Games',
    description: 'View game history',
    href: '/games',
    icon: SportsEsportsIcon,
    slug: 'games',
  },
  {
    title: 'Stats',
    description: 'Win rates and analytics',
    href: '/stats',
    icon: BarChartIcon,
    slug: 'stats',
  },
  {
    title: 'Lists',
    description: 'Standalone card collections',
    href: '/lists',
    icon: PlaylistAddIcon,
    slug: 'lists',
  },
  {
    title: 'My Collection',
    description: 'Your decks, stats & coach',
    href: '/my-collection',
    icon: CollectionsIcon,
    slug: 'collection',
  },
  {
    title: 'Play Game',
    description: 'Log a new Commander match',
    href: '/game-manager',
    icon: AddCircleIcon,
    slug: 'play',
  },
  {
    title: 'Rules Guru',
    description: 'Ask questions about MTG rules',
    href: '/rules/chat',
    icon: MenuBookIcon,
    slug: 'rules',
    external: true,
  },
];

/**
 * Resolve a tile's destination. Internal tiles use `href` as-is (Next prefixes
 * the basePath); the external rules-guru tile points at its own app, which runs
 * on :3003 in dev and is mounted under the commander basePath in prod.
 */
export const resolveNavHref = (item: NavItem): string => {
  if (!item.external) return item.href;
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:3003/chat'
    : '/app/projects/commander/rules/chat';
};
