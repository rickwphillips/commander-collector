'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Box,
  Grow,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  IconButton,
  Drawer,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Tooltip,
  Snackbar,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StyleIcon from '@mui/icons-material/Style';
import PeopleIcon from '@mui/icons-material/People';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PaletteIcon from '@mui/icons-material/Palette';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import Link from 'next/link';
import { PageContainer } from '@/components/PageContainer';
import { StatsCard } from '@/components/StatsCard';
import { ColorIdentityChips } from '@/components/ColorIdentityChips';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { ViewSelector } from '@/components/ViewSelector';
import { api } from '@/lib/api';
import { useHiddenStats } from '@/lib/useHiddenStats';
import { STATS_SECTIONS, DEFAULT_SECTION_ORDER } from '@/lib/statsSections';
import type { StatsSectionId } from '@/lib/statsSections';
import type {
  StatsResponse,
  HeadToHeadResponse,
  AdvancedStatsResponse,
  StatPanel,
  StatPanelsResponse,
  ComparisonResult,
} from '@/lib/types';
import { ComparisonPanel, ComparisonPanelSkeleton } from './ComparisonPanel';

type SortDirection = 'asc' | 'desc';
type SortConfig = { key: string; direction: SortDirection };

function StatsPageInner() {
  const searchParams = useSearchParams();
  const panelCode = searchParams.get('panel');
  const panelIdParam = searchParams.get('panel_id');

  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [headToHead, setHeadToHead] = useState<HeadToHeadResponse>({
    twoPlayer: [],
    multiplayer: [],
  });
  const [advancedStats, setAdvancedStats] = useState<AdvancedStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfigs, setSortConfigs] = useState<Record<string, SortConfig>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<string | null>(null);

  // View system
  const [activeView, setActiveView] = useState<'default' | number>('default');
  const [panels, setPanels] = useState<StatPanelsResponse>({ own: [], shared: [] });
  const [activePanelData, setActivePanelData] = useState<StatPanel | null>(null);

  // Comparison panel state (for URL-param / ViewSelector activation)
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  // Inline panels (drawer toggles)
  const [shownPanelIds, setShownPanelIds] = useState<Set<number>>(new Set());
  const [inlinePanelData, setInlinePanelData] = useState<Record<number, ComparisonResult>>({});

  const {
    hiddenSections,
    toggleSection,
    showAll,
    hideAll,
    hiddenPanelIds,
    togglePanelVisibility,
    loaded: hiddenLoaded,
  } = useHiddenStats();

  useEffect(() => {
    fetchData();
  }, []);

  // Helper: activate a panel (handles comparison data fetch)
  const activatePanel = useCallback((panel: StatPanel) => {
    setActiveView(panel.id);
    setActivePanelData(panel);
    setComparisonResult(null);
    if (panel.panel_type === 'comparison' && panel.config) {
      setComparisonLoading(true);
      api
        .getComparison(panel.config)
        .then((r) => setComparisonResult(r))
        .catch(() => setSnackbar('Failed to load comparison data'))
        .finally(() => setComparisonLoading(false));
    }
  }, []);

  const toggleInlinePanel = useCallback(
    (panel: StatPanel) => {
      setShownPanelIds((prev) => {
        const next = new Set(prev);
        if (next.has(panel.id)) {
          next.delete(panel.id);
        } else {
          next.add(panel.id);
          if (panel.panel_type === 'comparison' && panel.config && !inlinePanelData[panel.id]) {
            api
              .getComparison(panel.config!)
              .then((r) => setInlinePanelData((p) => ({ ...p, [panel.id]: r })))
              .catch(() => setSnackbar('Failed to load panel data'));
          }
        }
        return next;
      });
    },
    [inlinePanelData]
  );

  // Handle ?panel_id=<id> URL param (own panels by numeric ID)
  useEffect(() => {
    if (!panelIdParam || loading) return;
    const id = parseInt(panelIdParam, 10);
    if (isNaN(id)) return;
    const match = panels.own.find((p) => p.id === id);
    if (match) activatePanel(match);
  }, [panelIdParam, panels.own, loading, activatePanel]);

  // Handle ?panel=<code> URL param
  useEffect(() => {
    if (panelCode && panels.own.length + panels.shared.length > 0) {
      // Check own panels first, then shared
      const allPanels = [...panels.own, ...panels.shared];
      const match = allPanels.find((p) => p.share_code === panelCode);
      if (match) {
        activatePanel(match);
      } else {
        // Try fetching by code
        api
          .getStatPanelByCode(panelCode)
          .then((p) => {
            activatePanel(p);
          })
          .catch(() => {
            setSnackbar('Shared panel not found');
          });
      }
    } else if (panelCode && !loading) {
      api
        .getStatPanelByCode(panelCode)
        .then((p) => {
          activatePanel(p);
        })
        .catch(() => {
          setSnackbar('Shared panel not found');
        });
    }
  }, [panelCode, panels, loading, activatePanel]);

  const fetchData = async () => {
    try {
      const [statsData, h2hData, advData, panelsData] = await Promise.all([
        api.getStats(),
        api.getHeadToHead(),
        api.getAdvancedStats(),
        api.getStatPanels().catch(() => ({ own: [], shared: [] }) as StatPanelsResponse),
      ]);
      setStats(statsData);
      setHeadToHead(h2hData);
      setAdvancedStats(advData);
      setPanels(panelsData);
    } catch {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (table: string, key: string) => {
    setSortConfigs((prev) => ({
      ...prev,
      [table]: {
        key,
        direction: prev[table]?.key === key && prev[table]?.direction === 'desc' ? 'asc' : 'desc',
      },
    }));
  };

  const sortData = <T,>(table: string, data: T[]): T[] => {
    const config = sortConfigs[table];
    if (!config) return data;
    return [...data].sort((a, b) => {
      const rec = a as Record<string, unknown>;
      const rec2 = b as Record<string, unknown>;
      const aVal = rec[config.key];
      const bVal = rec2[config.key];
      const aNum = Number(aVal);
      const bNum = Number(bVal);
      if (
        !isNaN(aNum) &&
        !isNaN(bNum) &&
        aVal !== '' &&
        aVal !== null &&
        bVal !== '' &&
        bVal !== null
      ) {
        return config.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }
      const aStr = String(aVal ?? '');
      const bStr = String(bVal ?? '');
      return config.direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  };

  const sortHeader = (table: string, key: string, label: string) => (
    <TableSortLabel
      active={sortConfigs[table]?.key === key}
      direction={sortConfigs[table]?.key === key ? sortConfigs[table].direction : 'desc'}
      onClick={() => handleSort(table, key)}
    >
      {label}
    </TableSortLabel>
  );

  const handleViewChange = useCallback(
    (view: 'default' | number) => {
      if (view === 'default') {
        setActiveView('default');
        setActivePanelData(null);
        setComparisonResult(null);
      } else {
        const allPanels = [...panels.own, ...panels.shared];
        const panel = allPanels.find((p) => p.id === view);
        if (panel) {
          activatePanel(panel);
        }
      }
    },
    [panels, activatePanel]
  );

  // Build section renderers
  const sectionRenderers: Record<StatsSectionId, () => React.ReactNode> = {
    overall: () => {
      if (!stats) return null;
      return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatsCard title="Total Games" value={stats.overall.total_games} color="#D2691E" href="/games" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatsCard
              title="Players"
              value={stats.overall.total_players}
              icon={<PeopleIcon />}
              color="#8B4513"
              href="/players"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatsCard
              title="Decks"
              value={stats.overall.total_decks}
              icon={<StyleIcon />}
              color="#DAA520"
              href="/decks"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatsCard
              title="Avg. Game Length"
              value={
                stats.overall.avg_game_length != null
                  ? Number(stats.overall.avg_game_length).toFixed(1)
                  : '-'
              }
              subtitle="turns"
              color="#CD853F"
            />
          </Grid>
        </Grid>
      );
    },

    topPlayers: () => {
      if (!stats || stats.topPlayers.length === 0) return null;
      return (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <EmojiEventsIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Top Players
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (min 3 games)
              </Typography>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('players', 'player_name', 'Player')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('players', 'total_games', 'Games')}
                    </TableCell>
                    <TableCell align="center">{sortHeader('players', 'wins', 'Wins')}</TableCell>
                    <TableCell align="right">
                      {sortHeader('players', 'win_rate', 'Win Rate')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('players', stats.topPlayers).map((player, index) => (
                    <TableRow key={player.player_id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {index === 0 && !sortConfigs['players'] && (
                            <EmojiEventsIcon sx={{ color: '#DAA520', fontSize: 20 }} />
                          )}
                          <Typography
                            sx={{ fontWeight: index === 0 && !sortConfigs['players'] ? 600 : 400 }}
                          >
                            {player.player_name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">{player.total_games}</TableCell>
                      <TableCell align="center">{player.wins}</TableCell>
                      <TableCell align="right">{Number(player.win_rate).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
    },

    topDecks: () => {
      if (!stats || stats.topDecks.length === 0) return null;
      return (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <StyleIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Top Decks
              </Typography>
              <Typography variant="body2" color="text.secondary">
                (min 3 games)
              </Typography>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('decks', 'deck_name', 'Deck')}</TableCell>
                    <TableCell>{sortHeader('decks', 'commander', 'Commander')}</TableCell>
                    <TableCell>{sortHeader('decks', 'player_name', 'Player')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('decks', 'total_games', 'Games')}
                    </TableCell>
                    <TableCell align="right">
                      {sortHeader('decks', 'win_rate', 'Win Rate')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('decks', stats.topDecks).map((deck, index) => (
                    <TableRow key={deck.deck_id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <ColorIdentityChips colors={deck.colors} size="small" />
                          <Typography
                            sx={{ fontWeight: index === 0 && !sortConfigs['decks'] ? 600 : 400 }}
                          >
                            {deck.deck_name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{deck.commander}</TableCell>
                      <TableCell>{deck.player_name}</TableCell>
                      <TableCell align="center">{deck.total_games}</TableCell>
                      <TableCell align="right">{Number(deck.win_rate).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
    },

    topCommanders: () => {
      if (!stats || stats.topCommanders.length === 0) return null;
      return (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Top Commanders
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('commanders', 'commander', 'Commander')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('commanders', 'decks_using', 'Decks Using')}
                    </TableCell>
                    <TableCell align="center">
                      {sortHeader('commanders', 'total_games', 'Games')}
                    </TableCell>
                    <TableCell align="center">{sortHeader('commanders', 'wins', 'Wins')}</TableCell>
                    <TableCell align="right">
                      {sortHeader('commanders', 'win_rate', 'Win Rate')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('commanders', stats.topCommanders).map((commander) => (
                    <TableRow key={commander.commander}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500 }}>{commander.commander}</Typography>
                      </TableCell>
                      <TableCell align="center">{commander.decks_using}</TableCell>
                      <TableCell align="center">{commander.total_games}</TableCell>
                      <TableCell align="center">{commander.wins}</TableCell>
                      <TableCell align="right">{Number(commander.win_rate).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
    },

    h2h: () => {
      if (headToHead.twoPlayer.length === 0) return null;
      return (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Head-to-Head
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('h2h', 'player1_name', 'Matchup')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('h2h', 'total_games', 'Games')}
                    </TableCell>
                    <TableCell align="center">
                      {sortHeader('h2h', 'player1_wins', 'Record')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('h2h', headToHead.twoPlayer).map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography>
                          {record.player1_name} vs {record.player2_name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{record.total_games}</TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography
                            sx={{
                              fontWeight: record.player1_wins > record.player2_wins ? 700 : 400,
                              color:
                                record.player1_wins > record.player2_wins
                                  ? 'primary.main'
                                  : 'text.primary',
                            }}
                          >
                            {record.player1_wins}
                          </Typography>
                          <Typography color="text.secondary">-</Typography>
                          <Typography
                            sx={{
                              fontWeight: record.player2_wins > record.player1_wins ? 700 : 400,
                              color:
                                record.player2_wins > record.player1_wins
                                  ? 'primary.main'
                                  : 'text.primary',
                            }}
                          >
                            {record.player2_wins}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
    },

    multiplayer: () => {
      if (headToHead.multiplayer.length === 0) return null;
      return (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Multiplayer
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('mp', 'player1_name', 'Matchup')}</TableCell>
                    <TableCell align="center">{sortHeader('mp', 'total_games', 'Games')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('mp', 'player1_wins', 'Record')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('mp', headToHead.multiplayer).map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography>
                          {record.player1_name} vs {record.player2_name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{record.total_games}</TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Typography
                            sx={{
                              fontWeight: record.player1_wins > record.player2_wins ? 700 : 400,
                              color:
                                record.player1_wins > record.player2_wins
                                  ? 'primary.main'
                                  : 'text.primary',
                            }}
                          >
                            {record.player1_wins}
                          </Typography>
                          <Typography color="text.secondary">-</Typography>
                          <Typography
                            sx={{
                              fontWeight: record.player2_wins > record.player1_wins ? 700 : 400,
                              color:
                                record.player2_wins > record.player1_wins
                                  ? 'primary.main'
                                  : 'text.primary',
                            }}
                          >
                            {record.player2_wins}
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
    },

    twoHg: () => {
      if (!advancedStats?.twoHgStats || advancedStats.twoHgStats.teamPairings.length === 0)
        return null;
      return (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <HandshakeIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Two-Headed Giant
              </Typography>
            </Stack>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Team Records
            </Typography>
            <TableContainer sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('2hgTeam', 'player1_name', 'Team')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('2hgTeam', 'total_games', 'Games')}
                    </TableCell>
                    <TableCell align="center">{sortHeader('2hgTeam', 'wins', 'Wins')}</TableCell>
                    <TableCell align="right">
                      {sortHeader('2hgTeam', 'win_rate', 'Win Rate')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('2hgTeam', advancedStats.twoHgStats.teamPairings).map((team, i) => (
                    <TableRow key={`${team.player1_id}-${team.player2_id}`}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          {i === 0 && !sortConfigs['2hgTeam'] && (
                            <EmojiEventsIcon sx={{ color: '#DAA520', fontSize: 20 }} />
                          )}
                          <Typography
                            sx={{ fontWeight: i === 0 && !sortConfigs['2hgTeam'] ? 600 : 400 }}
                          >
                            {team.player1_name} & {team.player2_name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">{team.total_games}</TableCell>
                      <TableCell align="center">{team.wins}</TableCell>
                      <TableCell align="right">{Number(team.win_rate).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Individual 2HG Records
            </Typography>
            <TableContainer sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('2hgPlayer', 'player_name', 'Player')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('2hgPlayer', 'total_games', 'Games')}
                    </TableCell>
                    <TableCell align="center">{sortHeader('2hgPlayer', 'wins', 'Wins')}</TableCell>
                    <TableCell align="right">
                      {sortHeader('2hgPlayer', 'win_rate', 'Win Rate')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('2hgPlayer', advancedStats.twoHgStats.players).map((p) => (
                    <TableRow key={p.player_id}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500 }}>{p.player_name}</Typography>
                      </TableCell>
                      <TableCell align="center">{p.total_games}</TableCell>
                      <TableCell align="center">{p.wins}</TableCell>
                      <TableCell align="right">{Number(p.win_rate).toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recent 2HG Games
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('2hgRecent', 'played_at', 'Date')}</TableCell>
                    <TableCell>{sortHeader('2hgRecent', 'winners', 'Winning Team')}</TableCell>
                    <TableCell>{sortHeader('2hgRecent', 'winning_decks', 'Decks')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('2hgRecent', 'winning_turn', 'Turn')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('2hgRecent', advancedStats.twoHgStats.recentGames).map((game) => (
                    <TableRow key={game.id}>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(game.played_at + 'T00:00:00').toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <EmojiEventsIcon sx={{ color: '#DAA520', fontSize: 16 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {game.winners}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {game.winning_decks}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {game.winning_turn && (
                          <Chip label={`T${game.winning_turn}`} size="small" variant="outlined" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
    },

    colorMeta: () => {
      if (!advancedStats || advancedStats.colorMeta.length === 0) return null;
      return (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <PaletteIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Color Meta Analysis
              </Typography>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('colorMeta', 'colors', 'Colors')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('colorMeta', 'deck_count', 'Decks')}
                    </TableCell>
                    <TableCell align="center">
                      {sortHeader('colorMeta', 'total_games', 'Games')}
                    </TableCell>
                    <TableCell align="center">{sortHeader('colorMeta', 'wins', 'Wins')}</TableCell>
                    <TableCell align="right">
                      {sortHeader('colorMeta', 'win_rate', 'Win Rate')}
                    </TableCell>
                    <TableCell align="right">
                      {sortHeader('colorMeta', 'avg_finish_position', 'Avg Position')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('colorMeta', advancedStats.colorMeta).map((row) => (
                    <TableRow key={row.colors}>
                      <TableCell>
                        <ColorIdentityChips colors={row.colors} size="small" />
                      </TableCell>
                      <TableCell align="center">{row.deck_count}</TableCell>
                      <TableCell align="center">{row.total_games}</TableCell>
                      <TableCell align="center">{row.wins}</TableCell>
                      <TableCell align="right">{Number(row.win_rate).toFixed(1)}%</TableCell>
                      <TableCell align="right">
                        {Number(row.avg_finish_position).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
    },

    colorPresence: () => {
      if (!advancedStats || advancedStats.colorPresence.length === 0) return null;
      const colorLabel: Record<string, string> = {
        W: 'White',
        U: 'Blue',
        B: 'Black',
        R: 'Red',
        G: 'Green',
      };
      return (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <PaletteIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Color Presence
              </Typography>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('colorPresence', 'color_key', 'Color')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('colorPresence', 'deck_count', 'Decks')}
                    </TableCell>
                    <TableCell align="center">
                      {sortHeader('colorPresence', 'total_games', 'Games')}
                    </TableCell>
                    <TableCell align="center">
                      {sortHeader('colorPresence', 'wins', 'Wins')}
                    </TableCell>
                    <TableCell align="right">
                      {sortHeader('colorPresence', 'win_rate', 'Win Rate')}
                    </TableCell>
                    <TableCell align="right">
                      {sortHeader('colorPresence', 'avg_finish_position', 'Avg Position')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('colorPresence', advancedStats.colorPresence).map((row) => (
                    <TableRow key={row.color_key}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <ColorIdentityChips colors={row.color_key} size="small" />
                          <Typography variant="body2">{colorLabel[row.color_key]}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">{row.deck_count}</TableCell>
                      <TableCell align="center">{row.total_games}</TableCell>
                      <TableCell align="center">{row.wins}</TableCell>
                      <TableCell align="right">{Number(row.win_rate).toFixed(1)}%</TableCell>
                      <TableCell align="right">
                        {Number(row.avg_finish_position).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
    },

    colorCount: () => {
      if (!advancedStats || advancedStats.colorCount.length === 0) return null;
      const countLabel: Record<number, string> = {
        0: 'Colorless',
        1: 'Mono-color',
        2: 'Two-color',
        3: 'Three-color',
        4: 'Four-color',
        5: 'Five-color',
      };
      return (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <PaletteIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Color Complexity
              </Typography>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('colorCount', 'color_count', 'Colors')}</TableCell>
                    <TableCell>{sortHeader('colorCount', 'color_count', 'Type')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('colorCount', 'deck_count', 'Decks')}
                    </TableCell>
                    <TableCell align="center">
                      {sortHeader('colorCount', 'total_games', 'Games')}
                    </TableCell>
                    <TableCell align="center">
                      {sortHeader('colorCount', 'wins', 'Wins')}
                    </TableCell>
                    <TableCell align="right">
                      {sortHeader('colorCount', 'win_rate', 'Win Rate')}
                    </TableCell>
                    <TableCell align="right">
                      {sortHeader('colorCount', 'avg_finish_position', 'Avg Position')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('colorCount', advancedStats.colorCount).map((row) => (
                    <TableRow key={row.color_count}>
                      <TableCell align="center">
                        <Chip label={row.color_count} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {countLabel[row.color_count] ?? `${row.color_count}-color`}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{row.deck_count}</TableCell>
                      <TableCell align="center">{row.total_games}</TableCell>
                      <TableCell align="center">{row.wins}</TableCell>
                      <TableCell align="right">{Number(row.win_rate).toFixed(1)}%</TableCell>
                      <TableCell align="right">
                        {Number(row.avg_finish_position).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
    },

    podSize: () => {
      if (!advancedStats || advancedStats.gameSizeStats.length === 0) return null;
      return (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <GroupsIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Performance by Pod Size
              </Typography>
            </Stack>
            {advancedStats.gameSizeStats.map((pod) => (
              <Box key={pod.pod_size} sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                  <Chip
                    label={`${pod.pod_size}-Player`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({pod.total_games} games)
                  </Typography>
                </Stack>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          {sortHeader(`pod_${pod.pod_size}`, 'player_name', 'Player')}
                        </TableCell>
                        <TableCell align="center">
                          {sortHeader(`pod_${pod.pod_size}`, 'games_played', 'Games')}
                        </TableCell>
                        <TableCell align="center">
                          {sortHeader(`pod_${pod.pod_size}`, 'wins', 'Wins')}
                        </TableCell>
                        <TableCell align="right">
                          {sortHeader(`pod_${pod.pod_size}`, 'win_rate', 'Win Rate')}
                        </TableCell>
                        <TableCell align="right">
                          {sortHeader(`pod_${pod.pod_size}`, 'avg_finish_position', 'Avg Position')}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortData(`pod_${pod.pod_size}`, pod.entries).map((entry) => (
                        <TableRow key={entry.player_id}>
                          <TableCell>{entry.player_name}</TableCell>
                          <TableCell align="center">{entry.games_played}</TableCell>
                          <TableCell align="center">{entry.wins}</TableCell>
                          <TableCell align="right">{Number(entry.win_rate).toFixed(1)}%</TableCell>
                          <TableCell align="right">
                            {Number(entry.avg_finish_position).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
          </CardContent>
        </Card>
      );
    },

    playerStreaks: () => {
      if (!advancedStats || advancedStats.playerStreaks.length === 0) return null;
      return (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <TrendingUpIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Player Streaks & Form
              </Typography>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('pStreaks', 'player_name', 'Player')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('pStreaks', 'current_streak', 'Streak')}
                    </TableCell>
                    <TableCell align="center">
                      {sortHeader('pStreaks', 'longest_win_streak', 'Best Streak')}
                    </TableCell>
                    <TableCell align="center">
                      {sortHeader('pStreaks', 'last_5_wins', 'Last 5')}
                    </TableCell>
                    <TableCell align="right">
                      {sortHeader('pStreaks', 'overall_win_rate', 'Overall')}
                    </TableCell>
                    <TableCell align="center">{sortHeader('pStreaks', 'trend', 'Trend')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('pStreaks', advancedStats.playerStreaks).map((p) => (
                    <TableRow key={p.player_id}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 500 }}>{p.player_name}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${p.current_streak_type}${p.current_streak}`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            backgroundColor: p.current_streak_type === 'W' ? '#2e7d32' : '#c62828',
                            color: '#fff',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={<EmojiEventsIcon sx={{ fontSize: 16 }} />}
                          label={`W${p.longest_win_streak}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {p.last_5_wins}/{p.last_5_games}
                      </TableCell>
                      <TableCell align="right">{Number(p.overall_win_rate).toFixed(1)}%</TableCell>
                      <TableCell align="center">
                        {p.trend === 'hot' && (
                          <Chip
                            icon={<WhatshotIcon sx={{ fontSize: 16 }} />}
                            label="Hot"
                            size="small"
                            sx={{ backgroundColor: '#ff5722', color: '#fff' }}
                          />
                        )}
                        {p.trend === 'cold' && (
                          <Chip
                            icon={<AcUnitIcon sx={{ fontSize: 16 }} />}
                            label="Cold"
                            size="small"
                            sx={{ backgroundColor: '#1565c0', color: '#fff' }}
                          />
                        )}
                        {p.trend === 'steady' && (
                          <Chip label="Steady" size="small" variant="outlined" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
    },

    deckStreaks: () => {
      if (!advancedStats || advancedStats.deckStreaks.length === 0) return null;
      return (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <TrendingUpIcon color="primary" />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Deck Streaks & Form
              </Typography>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{sortHeader('dStreaks', 'deck_name', 'Deck')}</TableCell>
                    <TableCell>{sortHeader('dStreaks', 'player_name', 'Player')}</TableCell>
                    <TableCell align="center">
                      {sortHeader('dStreaks', 'current_streak', 'Streak')}
                    </TableCell>
                    <TableCell align="center">
                      {sortHeader('dStreaks', 'longest_win_streak', 'Best Streak')}
                    </TableCell>
                    <TableCell align="center">
                      {sortHeader('dStreaks', 'last_5_wins', 'Last 5')}
                    </TableCell>
                    <TableCell align="right">
                      {sortHeader('dStreaks', 'overall_win_rate', 'Overall')}
                    </TableCell>
                    <TableCell align="center">{sortHeader('dStreaks', 'trend', 'Trend')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData('dStreaks', advancedStats.deckStreaks).map((d) => (
                    <TableRow key={d.deck_id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <ColorIdentityChips colors={d.colors} size="small" />
                          <Box>
                            <Typography sx={{ fontWeight: 500 }}>{d.deck_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {d.commander}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{d.player_name}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${d.current_streak_type}${d.current_streak}`}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            backgroundColor: d.current_streak_type === 'W' ? '#2e7d32' : '#c62828',
                            color: '#fff',
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={<EmojiEventsIcon sx={{ fontSize: 16 }} />}
                          label={`W${d.longest_win_streak}`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {d.last_5_wins}/{d.last_5_games}
                      </TableCell>
                      <TableCell align="right">{Number(d.overall_win_rate).toFixed(1)}%</TableCell>
                      <TableCell align="center">
                        {d.trend === 'hot' && (
                          <Chip
                            icon={<WhatshotIcon sx={{ fontSize: 16 }} />}
                            label="Hot"
                            size="small"
                            sx={{ backgroundColor: '#ff5722', color: '#fff' }}
                          />
                        )}
                        {d.trend === 'cold' && (
                          <Chip
                            icon={<AcUnitIcon sx={{ fontSize: 16 }} />}
                            label="Cold"
                            size="small"
                            sx={{ backgroundColor: '#1565c0', color: '#fff' }}
                          />
                        )}
                        {d.trend === 'steady' && (
                          <Chip label="Steady" size="small" variant="outlined" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      );
    },
  };

  // Determine visible sections
  const getVisibleSections = (): StatsSectionId[] => {
    if (activeView !== 'default' && activePanelData) {
      return activePanelData.sections as StatsSectionId[];
    }
    return DEFAULT_SECTION_ORDER.filter((id) => !hiddenSections.has(id));
  };

  // Filter shared panels by hidden state
  const visibleSharedPanels = panels.shared.filter((p) => !hiddenPanelIds.has(p.id));

  if (loading || !hiddenLoaded) {
    return (
      <PageContainer title="Statistics" subtitle="Win rates and analytics">
        <LoadingSpinner message="Loading statistics..." />
      </PageContainer>
    );
  }

  if (!stats || stats.overall.total_games === 0) {
    return (
      <PageContainer title="Statistics" subtitle="Win rates and analytics">
        <EmptyState
          title="No data yet"
          description="Log some games to start seeing statistics"
          actionLabel="Log a Game"
          actionHref="/games/new"
        />
      </PageContainer>
    );
  }

  const visibleSections = getVisibleSections();
  const isDefaultView = activeView === 'default';

  return (
    <PageContainer
      title="Statistics"
      subtitle="Win rates and analytics"
      actions={
        <Stack direction="row" spacing={1} alignItems="center">
          <ViewSelector
            activeView={activeView}
            onViewChange={handleViewChange}
            ownPanels={panels.own}
            sharedPanels={visibleSharedPanels}
          />
          <Tooltip title="Customize panels">
            <IconButton component={Link} href="/stats/customize" size="small">
              <DashboardCustomizeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Section visibility settings">
            <IconButton onClick={() => setDrawerOpen(true)} size="small">
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Active panel banner */}
      {!isDefaultView && activePanelData && (
        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <IconButton size="small" onClick={() => handleViewChange('default')}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          Viewing: <strong>{activePanelData.name}</strong>
          {activePanelData.owner_name && ` by ${activePanelData.owner_name}`}
        </Alert>
      )}

      {/* Comparison panel rendering */}
      {!isDefaultView &&
        activePanelData?.panel_type === 'comparison' &&
        (comparisonLoading ? (
          <ComparisonPanelSkeleton />
        ) : comparisonResult ? (
          <ComparisonPanel result={comparisonResult} />
        ) : null)}

      {/* Rendered sections (predefined panels and default view) */}
      {(isDefaultView || activePanelData?.panel_type !== 'comparison') &&
        visibleSections.map((id, i) => {
          const node = sectionRenderers[id]?.();
          if (!node) return null;
          return (
            <Grow in timeout={800 + i * 200} key={id}>
              <Box sx={{ position: 'relative' }}>
                {isDefaultView && (
                  <Tooltip title="Hide this section">
                    <IconButton
                      size="small"
                      onClick={() => toggleSection(id)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 1,
                        opacity: 0.3,
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      <VisibilityOffIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {node}
              </Box>
            </Grow>
          );
        })}

      {isDefaultView && visibleSections.length === 0 && shownPanelIds.size === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          All sections are hidden. Use the settings gear to show sections or panels.
        </Alert>
      )}

      {/* Inline panels toggled on from the settings drawer */}
      {[...panels.own, ...panels.shared]
        .filter((p) => shownPanelIds.has(p.id))
        .map((panel) => (
          <Box key={panel.id} sx={{ mb: 4 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2 }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {panel.name}
              </Typography>
              {panel.owner_name && (
                <Typography variant="body2" color="text.secondary">
                  by {panel.owner_name}
                </Typography>
              )}
            </Stack>
            {panel.panel_type === 'comparison' ? (
              inlinePanelData[panel.id] ? (
                <ComparisonPanel result={inlinePanelData[panel.id]} />
              ) : (
                <ComparisonPanelSkeleton />
              )
            ) : (
              (panel.sections as StatsSectionId[]).map((id) => {
                const node = sectionRenderers[id]?.();
                return node ? (
                  <Box key={id} sx={{ mb: 3 }}>
                    {node}
                  </Box>
                ) : null;
              })
            )}
          </Box>
        ))}

      {/* Settings Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 320, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Section Visibility
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button size="small" variant="outlined" onClick={showAll}>
              Show All
            </Button>
            <Button size="small" variant="outlined" onClick={() => hideAll(DEFAULT_SECTION_ORDER)}>
              Hide All
            </Button>
          </Stack>

          {STATS_SECTIONS.map((section) => (
            <FormControlLabel
              key={section.id}
              control={
                <Switch
                  checked={!hiddenSections.has(section.id)}
                  onChange={() => toggleSection(section.id)}
                  size="small"
                />
              }
              label={section.label}
              sx={{ display: 'flex', mb: 0.5 }}
            />
          ))}

          {panels.own.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Your Panels
              </Typography>
              {panels.own.map((panel) => (
                <FormControlLabel
                  key={panel.id}
                  control={
                    <Switch
                      checked={shownPanelIds.has(panel.id)}
                      onChange={() => toggleInlinePanel(panel)}
                      size="small"
                    />
                  }
                  label={panel.name}
                  sx={{ display: 'flex', mb: 0.5 }}
                />
              ))}
            </>
          )}

          {panels.shared.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Shared Panels
              </Typography>
              {panels.shared.map((panel) => (
                <FormControlLabel
                  key={panel.id}
                  control={
                    <Switch
                      checked={shownPanelIds.has(panel.id)}
                      onChange={() => toggleInlinePanel(panel)}
                      size="small"
                    />
                  }
                  label={`${panel.name}${panel.owner_name ? ` (${panel.owner_name})` : ''}`}
                  sx={{ display: 'flex', mb: 0.5 }}
                />
              ))}
            </>
          )}
        </Box>
      </Drawer>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={4000}
        onClose={() => setSnackbar(null)}
        message={snackbar}
      />
    </PageContainer>
  );
}

export default function StatsPage() {
  return (
    <Suspense
      fallback={
        <PageContainer title="Statistics" subtitle="Win rates and analytics">
          <LoadingSpinner message="Loading statistics..." />
        </PageContainer>
      }
    >
      <StatsPageInner />
    </Suspense>
  );
}
