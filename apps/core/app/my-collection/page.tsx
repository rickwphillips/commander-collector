'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Alert,
  Collapse,
  IconButton,
  CircularProgress,
  Snackbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import Link from 'next/link';
import { PageContainer } from '@/components/PageContainer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ColorIdentityChips } from '@/components/ColorIdentityChips';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { CardListDisplay } from '@/components/CardListDisplay';
import type { CardListEntry } from '@/components/CardListDisplay';
import { api } from '@/lib/api';
import type { MyCollectionResponse } from '@/lib/types';
import { CoachChat, COACH_DRAWER_WIDTH } from './CoachChat';
import type { CoachChatHandle, ActiveListContext } from './CoachChat';

export default function MyCollectionPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [data, setData] = useState<MyCollectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coachOpen, setCoachOpen] = useState(false);
  const [expandedDeckId, setExpandedDeckId] = useState<number | null>(null);
  const [expandedListId, setExpandedListId] = useState<number | null>(null);
  const [refreshed, setRefreshed] = useState(false);
  const coachRef = useRef<CoachChatHandle>(null);

  // Collapse other section when one expands
  const handleDeckToggle = useCallback((id: number | null) => {
    setExpandedDeckId(id);
    if (id !== null) setExpandedListId(null);
  }, []);

  const handleListToggle = useCallback((id: number | null) => {
    setExpandedListId(id);
    if (id !== null) setExpandedDeckId(null);
  }, []);

  const handleCardClick = useCallback((name: string) => {
    if (coachOpen && coachRef.current) {
      coachRef.current.appendToInput(name);
    }
  }, [coachOpen]);

  // Initial load — uses loading state (triggers early-return spinner)
  useEffect(() => {
    api
      .getMyCollection()
      .then(setData)
      .catch(() => setError('Failed to load your collection data.'))
      .finally(() => setLoading(false));
  }, []);

  // Refresh — only updates decks and lists so the coach is not disrupted
  const handleRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    api
      .getMyCollection()
      .then((fresh) => {
        setData((prev) => prev ? { ...prev, decks: fresh.decks, lists: fresh.lists } : fresh);
        setRefreshed(true);
      })
      .catch(() => setError('Failed to refresh decks and lists.'))
      .finally(() => setRefreshing(false));
  }, [refreshing]);

  // Content push style for persistent drawer on desktop
  const contentSx = {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: 0,
    ...(coachOpen && !isMobile && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: `${COACH_DRAWER_WIDTH}px`,
    }),
  };

  if (loading) {
    return (
      <Box sx={contentSx}>
        <PageContainer title="My Collection">
          <LoadingSpinner message="Loading your collection..." />
        </PageContainer>
        <CoachChat ref={coachRef} notes={[]} open={coachOpen} onToggle={setCoachOpen} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={contentSx}>
        <PageContainer title="My Collection">
          <Alert severity="error">{error || 'Failed to load data.'}</Alert>
        </PageContainer>
        <CoachChat ref={coachRef} notes={[]} open={coachOpen} onToggle={setCoachOpen} />
      </Box>
    );
  }

  if (!data.player) {
    return (
      <Box sx={contentSx}>
        <PageContainer title="My Collection">
          <Alert severity="info">
            No player linked to your account. Go to a player&apos;s detail page and link your
            account to see your collection.
          </Alert>
        </PageContainer>
        <CoachChat ref={coachRef} notes={[]} open={coachOpen} onToggle={setCoachOpen} />
      </Box>
    );
  }

  const { summary, decks, lists, recentGames, commanders, nemeses, nemesisCommanders, streaks, colorStats, podSizeStats, coachNotes } = data;

  return (
    <Box sx={contentSx}>
    <PageContainer
      title="My Collection"
      subtitle={`${data.player.name}'s personal command post`}
      actions={
        <Tooltip title="Refresh decks and lists">
          <IconButton size="small" onClick={handleRefresh} disabled={refreshing}>
            <RefreshIcon fontSize="small" sx={{ transition: 'transform 0.6s', transform: refreshing ? 'rotate(360deg)' : 'none' }} />
          </IconButton>
        </Tooltip>
      }
    >
      {/* Summary Cards */}
      {summary && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <SummaryCard label="Games" value={summary.total_games} color="#D2691E" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <SummaryCard label="Win Rate" value={`${summary.win_rate ?? 0}%`} color="#DAA520" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <SummaryCard label="Decks" value={summary.total_decks} color="#8B4513" />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <SummaryCard
              label="Streak"
              value={
                streaks?.current_type
                  ? `${streaks.current_count} ${streaks.current_type === 'win' ? 'W' : 'L'}`
                  : '-'
              }
              color={streaks?.current_type === 'win' ? '#4CAF50' : '#D2691E'}
              icon={
                streaks?.current_type === 'win' ? (
                  <WhatshotIcon sx={{ fontSize: 18, color: '#4CAF50' }} />
                ) : streaks?.current_type === 'loss' ? (
                  <AcUnitIcon sx={{ fontSize: 18, color: '#D2691E' }} />
                ) : undefined
              }
            />
          </Grid>
        </Grid>
      )}

      {/* My Decks */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            My Decks
          </Typography>
          <Chip label={decks.length} size="small" sx={{ ml: 1 }} />
        </AccordionSummary>
        <AccordionDetails>
          {decks.length === 0 ? (
            <Typography color="text.secondary">No decks yet.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 40 }} />
                    <TableCell>Deck</TableCell>
                    <TableCell>Commander</TableCell>
                    <TableCell align="center">Colors</TableCell>
                    <TableCell align="right">Games</TableCell>
                    <TableCell align="right">Wins</TableCell>
                    <TableCell align="right">Win Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {decks.map((d) => (
                    <DeckRow key={d.id} deck={d} expanded={expandedDeckId === d.id} onToggle={handleDeckToggle} onCardClick={handleCardClick} coachRef={coachRef} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </AccordionDetails>
      </Accordion>

      {/* My Lists */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            My Lists
          </Typography>
          <Chip label={lists.length} size="small" sx={{ ml: 1 }} />
        </AccordionSummary>
        <AccordionDetails>
          {lists.length === 0 ? (
            <Typography color="text.secondary">No card lists yet.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 40 }} />
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Cards</TableCell>
                    <TableCell align="right">Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lists.map((l) => (
                    <ListRow
                      key={l.id}
                      list={l}
                      expanded={expandedListId === l.id}
                      onToggle={handleListToggle}
                      onCardClick={handleCardClick}
                      coachRef={coachRef}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Commander Performance */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Commander Performance
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {commanders.length === 0 ? (
            <Typography color="text.secondary">No game data yet.</Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Commander</TableCell>
                    <TableCell align="right">Games</TableCell>
                    <TableCell align="right">Wins</TableCell>
                    <TableCell align="right">Win Rate</TableCell>
                    <TableCell align="right">Avg Finish</TableCell>
                    <TableCell align="right">Decks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commanders.map((c) => (
                    <TableRow key={c.commander}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          {c.total_games > 0 && Number(c.win_rate) >= 50 && (
                            <EmojiEventsIcon sx={{ fontSize: 16, color: '#DAA520' }} />
                          )}
                          <CardTooltip name={c.commander} onClick={handleCardClick}><span>{c.commander}</span></CardTooltip>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">{c.total_games}</TableCell>
                      <TableCell align="right">{c.wins}</TableCell>
                      <TableCell align="right">
                        <WinRateChip rate={c.win_rate} games={c.total_games} />
                      </TableCell>
                      <TableCell align="right">{c.avg_finish ?? '-'}</TableCell>
                      <TableCell align="right">{c.deck_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Game History */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Game History
          </Typography>
          <Chip label={`Last ${recentGames.length}`} size="small" sx={{ ml: 1 }} />
        </AccordionSummary>
        <AccordionDetails>
          {recentGames.length === 0 ? (
            <Typography color="text.secondary">No games recorded yet.</Typography>
          ) : (
            <Stack spacing={1}>
              {recentGames.map((g) => {
                const isWin = g.finish_position === 1;
                return (
                  <Card
                    key={g.game_id}
                    variant="outlined"
                    onClick={() => window.open(`/games/detail?id=${g.game_id}`, '_blank')}
                    sx={{ cursor: 'pointer', borderLeft: 3, borderColor: isWin ? 'success.main' : '#D2691E' }}
                  >
                    <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {isWin ? 'Win' : `#${g.finish_position}`}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {g.deck_name} (<CardTooltip name={g.commander} onClick={handleCardClick}><span>{g.commander}</span></CardTooltip>)
                            </Typography>
                          </Stack>
                          {!isWin && g.winner_name && (
                            <Typography variant="caption" color="text.secondary">
                              Won by {g.winner_name}
                            </Typography>
                          )}
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label={`${g.pod_size}p`} size="small" variant="outlined" />
                          {g.winning_turn && (
                            <Chip label={`T${g.winning_turn}`} size="small" variant="outlined" />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {new Date(g.played_at + 'T00:00:00').toLocaleDateString()}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Nemeses */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Nemeses
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Players
          </Typography>
          {nemeses.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Not enough data yet.
            </Typography>
          ) : (
            <TableContainer sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Opponent</TableCell>
                    <TableCell align="right">Games</TableCell>
                    <TableCell align="right">Their Wins</TableCell>
                    <TableCell align="right">Your Wins</TableCell>
                    <TableCell align="right">Differential</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nemeses.map((n) => {
                    const diff = n.my_wins - n.their_wins;
                    return (
                      <TableRow key={n.opponent_id}>
                        <TableCell>{n.opponent_name}</TableCell>
                        <TableCell align="right">{n.games_together}</TableCell>
                        <TableCell align="right">{n.their_wins}</TableCell>
                        <TableCell align="right">{n.my_wins}</TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            color={diff > 0 ? 'success.main' : diff < 0 ? '#D2691E' : 'text.secondary'}
                            sx={{ fontWeight: 600 }}
                          >
                            {diff > 0 ? '+' : ''}{diff}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Commanders That Beat You
          </Typography>
          {nemesisCommanders.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Not enough data yet.
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Commander</TableCell>
                    <TableCell align="right">Games</TableCell>
                    <TableCell align="right">Their Wins</TableCell>
                    <TableCell align="right">Your Wins</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nemesisCommanders.map((nc) => (
                    <TableRow key={nc.enemy_commander}>
                      <TableCell>
                        <CardTooltip name={nc.enemy_commander} onClick={handleCardClick}><span>{nc.enemy_commander}</span></CardTooltip>
                      </TableCell>
                      <TableCell align="right">{nc.games_against}</TableCell>
                      <TableCell align="right">{nc.their_wins}</TableCell>
                      <TableCell align="right">{nc.my_wins}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Color & Pod Performance */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Performance Breakdown
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            By Color Identity
          </Typography>
          {colorStats.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No data yet.
            </Typography>
          ) : (
            <TableContainer sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Colors</TableCell>
                    <TableCell align="right">Games</TableCell>
                    <TableCell align="right">Wins</TableCell>
                    <TableCell align="right">Win Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {colorStats.map((cs) => (
                    <TableRow key={cs.colors}>
                      <TableCell>
                        <ColorIdentityChips colors={cs.colors} size="small" />
                      </TableCell>
                      <TableCell align="right">{cs.total_games}</TableCell>
                      <TableCell align="right">{cs.wins}</TableCell>
                      <TableCell align="right">
                        <WinRateChip rate={cs.win_rate} games={cs.total_games} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            By Pod Size
          </Typography>
          {podSizeStats.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No data yet.
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Pod Size</TableCell>
                    <TableCell align="right">Games</TableCell>
                    <TableCell align="right">Wins</TableCell>
                    <TableCell align="right">Win Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {podSizeStats.map((ps) => (
                    <TableRow key={ps.pod_size}>
                      <TableCell>{ps.pod_size}-player</TableCell>
                      <TableCell align="right">{ps.total_games}</TableCell>
                      <TableCell align="right">{ps.wins}</TableCell>
                      <TableCell align="right">
                        <WinRateChip rate={ps.win_rate} games={ps.total_games} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Coach Chat — side drawer with FAB toggle */}
      <CoachChat ref={coachRef} notes={coachNotes} open={coachOpen} onToggle={setCoachOpen} />

      <Snackbar
        open={refreshed}
        autoHideDuration={2500}
        onClose={() => setRefreshed(false)}
        message="Decks and lists refreshed"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </PageContainer>
    </Box>
  );
}

// ── Helper components ─────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string | number;
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', py: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0.5}>
          {icon}
          <Typography variant="h5" sx={{ fontWeight: 700, color }}>
            {value}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function WinRateChip({ rate, games }: { rate: number | null; games: number }) {
  if (games === 0 || rate === null) return <Typography variant="body2" color="text.secondary">-</Typography>;
  const color = Number(rate) >= 50 ? 'success' : Number(rate) >= 25 ? 'warning' : 'error';
  return <Chip label={`${rate}%`} size="small" color={color} variant="outlined" />;
}


function DeckRow({
  deck,
  expanded,
  onToggle,
  onCardClick,
  coachRef,
}: {
  deck: import('@/lib/types').CollectionDeck;
  expanded: boolean;
  onToggle: (id: number | null) => void;
  onCardClick: (name: string) => void;
  coachRef: React.RefObject<CoachChatHandle | null>;
}) {
  const [profile, setProfile] = useState<import('@/lib/types').DeckProfile | null>(null);
  const [loadingCards, setLoadingCards] = useState(false);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const handleToggle = async () => {
    if (expanded) {
      onToggle(null);
      coachRef.current?.setActiveDeck(null);
      return;
    }
    onToggle(deck.id);
    if (profile === null && deck.card_count > 0) {
      setLoadingCards(true);
      try {
        const fetched = await api.getDeckProfile(deck.id);
        setProfile(fetched);
        coachRef.current?.setActiveDeck({
          deckId: deck.id,
          deckName: deck.name,
          cardCount: fetched.cards.length,
          commander: deck.commander,
          colors: deck.colors,
        });
      } catch {
        setProfile({ cards: [] });
      } finally {
        setLoadingCards(false);
      }
    } else if (profile) {
      coachRef.current?.setActiveDeck({
        deckId: deck.id,
        deckName: deck.name,
        cardCount: profile.cards.length,
        commander: deck.commander,
        colors: deck.colors,
      });
    }
  };

  const cards = profile?.cards;

  return (
    <>
      <TableRow
        onClick={deck.card_count > 0 ? handleToggle : undefined}
        sx={{ '& > *': { borderBottom: expanded ? 'unset' : undefined }, cursor: deck.card_count > 0 ? 'pointer' : 'default', '&:hover': { bgcolor: deck.card_count > 0 ? 'action.hover' : undefined } }}
      >
        <TableCell sx={{ p: 0.5 }}>
          {deck.card_count > 0 && (
            <KeyboardArrowRightIcon fontSize="small" sx={{ display: 'block', color: 'text.secondary', transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          )}
        </TableCell>
        <TableCell>{deck.name}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <CardTooltip name={deck.commander} onClick={onCardClick}><span>{deck.commander}</span></CardTooltip>
        </TableCell>
        <TableCell align="center">
          <ColorIdentityChips colors={deck.colors} size="small" />
        </TableCell>
        <TableCell align="right">{deck.total_games}</TableCell>
        <TableCell align="right">{deck.wins}</TableCell>
        <TableCell align="right">
          <WinRateChip rate={deck.win_rate} games={deck.total_games} />
        </TableCell>
      </TableRow>
      {deck.card_count > 0 && (
        <TableRow ref={rowRef}>
          <TableCell sx={{ py: 0, borderBottom: expanded ? undefined : 'none' }} colSpan={7}>
            <Collapse in={expanded} timeout="auto" unmountOnExit onEntered={() => {
              rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }}>
              <Box sx={{ py: 1, pl: 2 }}>
                <Box sx={{ mb: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<OpenInNewIcon fontSize="inherit" />}
                    href={`/decks/decklist?id=${deck.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    component={Link}
                    sx={{ fontSize: '0.7rem', py: 0.25, px: 1 }}
                  >
                    Edit Deck
                  </Button>
                </Box>
                {loadingCards ? (
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 1 }}>
                    <CircularProgress size={14} />
                    <Typography variant="caption" color="text.secondary">Loading deck profile...</Typography>
                  </Stack>
                ) : cards && cards.length > 0 ? (
                  <CardListDisplay cards={cards} onCardClick={onCardClick} />
                ) : (
                  <Typography variant="caption" color="text.secondary">No cards loaded.</Typography>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

// CardListEntry (from CardListDisplay) is the shared shape for both DeckRow and ListRow
type ExpandableCard = CardListEntry;

function ListRow({
  list,
  expanded,
  onToggle,
  onCardClick,
  coachRef,
}: {
  list: import('@/lib/types').CollectionList;
  expanded: boolean;
  onToggle: (id: number | null) => void;
  onCardClick: (name: string) => void;
  coachRef: React.RefObject<CoachChatHandle | null>;
}) {
  const [cards, setCards] = useState<ExpandableCard[] | null>(null);
  const [loadingCards, setLoadingCards] = useState(false);
  const rowRef = useRef<HTMLTableRowElement>(null);

  const handleToggle = async () => {
    if (expanded) {
      onToggle(null);
      coachRef.current?.setActiveList(null);
      return;
    }
    onToggle(list.id);
    const ctx: ActiveListContext = { listId: list.id, listName: list.name, cardCount: list.card_count };
    if (cards === null && list.card_count > 0) {
      setLoadingCards(true);
      try {
        const detail = await api.getList(list.id);
        setCards(detail.cards);
        coachRef.current?.setActiveList({ ...ctx, cardCount: detail.cards.reduce((s, c) => s + c.quantity, 0) });
      } catch {
        setCards([]);
      } finally {
        setLoadingCards(false);
      }
    } else {
      coachRef.current?.setActiveList(ctx);
    }
  };

  return (
    <>
      <TableRow
        onClick={list.card_count > 0 ? handleToggle : undefined}
        sx={{ '& > *': { borderBottom: expanded ? 'unset' : undefined }, cursor: list.card_count > 0 ? 'pointer' : 'default', '&:hover': { bgcolor: list.card_count > 0 ? 'action.hover' : undefined } }}
      >
        <TableCell sx={{ p: 0.5 }}>
          {list.card_count > 0 && (
            <KeyboardArrowRightIcon fontSize="small" sx={{ display: 'block', color: 'text.secondary', transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          )}
        </TableCell>
        <TableCell>{list.name}</TableCell>
        <TableCell align="right">{list.card_count}</TableCell>
        <TableCell align="right">{new Date(list.updated_at).toLocaleDateString()}</TableCell>
      </TableRow>
      {list.card_count > 0 && (
        <TableRow ref={rowRef}>
          <TableCell sx={{ py: 0, borderBottom: expanded ? undefined : 'none' }} colSpan={4}>
            <Collapse in={expanded} timeout="auto" unmountOnExit onEntered={() => {
              rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }}>
              <Box sx={{ py: 1, pl: 2 }}>
                <Box sx={{ mb: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    endIcon={<OpenInNewIcon fontSize="inherit" />}
                    href={`/lists/detail?id=${list.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    component={Link}
                    sx={{ fontSize: '0.7rem', py: 0.25, px: 1 }}
                  >
                    Edit List
                  </Button>
                </Box>
                {loadingCards ? (
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 1 }}>
                    <CircularProgress size={14} />
                    <Typography variant="caption" color="text.secondary">Loading list...</Typography>
                  </Stack>
                ) : cards && cards.length > 0 ? (
                  <CardListDisplay cards={cards} onCardClick={onCardClick} />
                ) : (
                  <Typography variant="caption" color="text.secondary">No cards in list.</Typography>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
