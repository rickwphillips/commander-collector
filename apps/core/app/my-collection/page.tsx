'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  Box,
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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { PageContainer } from '@/components/PageContainer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ColorIdentityChips } from '@/components/ColorIdentityChips';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { getTypeCategory, TYPE_CATEGORIES } from '@/components/DeckFilters';
import { api } from '@/lib/api';
import type { MyCollectionResponse } from '@/lib/types';
import { CoachChat, COACH_DRAWER_WIDTH } from './CoachChat';
import type { CoachChatHandle } from './CoachChat';

export default function MyCollectionPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [data, setData] = useState<MyCollectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coachOpen, setCoachOpen] = useState(false);
  const [expandedDeckId, setExpandedDeckId] = useState<number | null>(null);
  const coachRef = useRef<CoachChatHandle>(null);

  const handleCardClick = useCallback((name: string) => {
    if (coachOpen && coachRef.current) {
      coachRef.current.appendToInput(name);
    }
  }, [coachOpen]);

  useEffect(() => {
    api
      .getMyCollection()
      .then(setData)
      .catch(() => setError('Failed to load your collection data.'))
      .finally(() => setLoading(false));
  }, []);

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
    <PageContainer title="My Collection" subtitle={`${data.player.name}'s personal command post`}>
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
                    <DeckRow key={d.id} deck={d} expanded={expandedDeckId === d.id} onToggle={setExpandedDeckId} onCardClick={handleCardClick} coachRef={coachRef} />
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
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Size</TableCell>
                    <TableCell align="right">Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lists.map((l) => (
                    <TableRow
                      key={l.id}
                      onClick={() => window.open(`/lists/detail?id=${l.id}`, '_blank')}
                      sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>{l.name}</TableCell>
                      <TableCell align="right">{l.card_count}</TableCell>
                      <TableCell align="right">
                        <Chip label={`${l.card_count} cards`} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell align="right">
                        {new Date(l.updated_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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

function buildDeckContextString(profile: import('@/lib/types').DeckProfile): string {
  const { deck, cards, stats, matchups, recentGames, finishDistribution } = profile;
  const lines: string[] = [];

  const losses = stats.total_games - stats.wins;
  lines.push(`Commander: ${deck.commander} | Colors: ${deck.colors}`);
  lines.push(`Record: ${stats.total_games} games, ${stats.wins}W-${losses}L (${stats.win_rate ?? 0}%) | Avg Finish: ${stats.avg_finish ?? '-'}`);
  if (stats.first_played) lines.push(`Active: ${stats.first_played} to ${stats.last_played}`);

  if (finishDistribution.length > 0) {
    lines.push(`Finish distribution: ${finishDistribution.map((f) => `${f.finish_position}${f.finish_position === 1 ? 'st' : f.finish_position === 2 ? 'nd' : f.finish_position === 3 ? 'rd' : 'th'}: ${f.count}`).join(', ')}`);
  }

  if (matchups.length > 0) {
    lines.push('');
    lines.push('Matchups vs commanders:');
    for (const m of matchups) {
      lines.push(`  vs ${m.opponent_commander}: ${m.games}g, ${m.my_wins}W-${m.their_wins}L`);
    }
  }

  if (recentGames.length > 0) {
    lines.push('');
    lines.push('Recent results:');
    for (const g of recentGames) {
      const result = g.finish_position === 1 ? 'WIN' : `#${g.finish_position}`;
      lines.push(`  ${g.played_at}: ${result} (${g.pod_size}p${g.winning_turn ? `, T${g.winning_turn}` : ''})`);
    }
  }

  lines.push('');
  lines.push(`Cards (${cards.length}):`);
  lines.push(cards.map((c) => `${c.quantity}x ${c.card_name}${c.is_commander ? ' (commander)' : ''}`).join(', '));

  return lines.join('\n');
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
          contextString: buildDeckContextString(fetched),
        });
      } catch {
        setProfile({ deck: { id: deck.id, name: deck.name, commander: deck.commander, colors: deck.colors, player_name: '' }, cards: [], stats: { total_games: 0, wins: 0, win_rate: null, avg_finish: null, first_played: null, last_played: null }, matchups: [], recentGames: [], finishDistribution: [] });
      } finally {
        setLoadingCards(false);
      }
    } else if (profile) {
      coachRef.current?.setActiveDeck({
        deckId: deck.id,
        deckName: deck.name,
        cardCount: profile.cards.length,
        contextString: buildDeckContextString(profile),
      });
    }
  };

  const cards = profile?.cards;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: expanded ? 'unset' : undefined } }}>
        <TableCell sx={{ p: 0.5 }}>
          {deck.card_count > 0 && (
            <IconButton size="small" onClick={handleToggle}>
              {expanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>{deck.name}</TableCell>
        <TableCell>
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
                {loadingCards ? (
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 1 }}>
                    <CircularProgress size={14} />
                    <Typography variant="caption" color="text.secondary">Loading deck profile...</Typography>
                  </Stack>
                ) : cards && cards.length > 0 ? (
                  <DeckCardList cards={cards} onCardClick={onCardClick} />
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

type ProfileCard = import('@/lib/types').DeckProfile['cards'][number];

function DeckCardList({ cards, onCardClick }: { cards: ProfileCard[]; onCardClick: (name: string) => void }) {
  const { commanders, groups } = useMemo(() => {
    const cmdr: ProfileCard[] = [];
    const map: Record<string, ProfileCard[]> = {};
    for (const c of cards) {
      if (c.is_commander) { cmdr.push(c); continue; }
      const cat = getTypeCategory(c.type_line);
      if (!map[cat]) map[cat] = [];
      map[cat].push(c);
    }
    const order = [...TYPE_CATEGORIES, 'Other'] as string[];
    return {
      commanders: cmdr,
      groups: order.filter((t) => map[t]?.length).map((t) => ({ type: t, cards: map[t] })),
    };
  }, [cards]);

  const CardLine = ({ c, isCommander }: { c: ProfileCard; isCommander?: boolean }) => (
    <Box sx={{ lineHeight: 1.6 }}>
      {c.quantity > 1 && <Typography variant="caption" component="span">{c.quantity}x </Typography>}
      <CardTooltip name={c.card_name} onClick={onCardClick}>
        <Typography
          variant="caption"
          component="span"
          sx={{
            borderBottom: '1px dotted',
            borderColor: 'text.disabled',
            cursor: 'pointer',
            fontWeight: isCommander ? 700 : 400,
            color: isCommander ? 'warning.main' : 'text.primary',
          }}
        >
          {c.card_name}
        </Typography>
      </CardTooltip>
    </Box>
  );

  // Build all sections: commanders prepended to creatures
  const sections = useMemo(() => {
    const result: { type: string; cards: ProfileCard[]; isCommander?: boolean }[] = [];
    if (commanders.length > 0) {
      result.push({ type: 'Commander', cards: commanders, isCommander: true });
    }
    for (const g of groups) {
      result.push(g);
    }
    return result;
  }, [commanders, groups]);

  return (
    <Box sx={{ py: 1, columnCount: { xs: 2, sm: 3, md: 4 }, columnGap: 3 }}>
      {sections.map(({ type, cards: group, isCommander }) => (
        <Box key={type} sx={{ breakInside: 'avoid', mb: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: isCommander ? 'warning.main' : 'text.secondary',
              display: 'block',
              mb: 0.5,
            }}
          >
            {type} ({group.reduce((s, c) => s + c.quantity, 0)})
          </Typography>
          {group.map((c, i) => (
            <CardLine key={`${c.card_name}-${i}`} c={c} isCommander={isCommander} />
          ))}
        </Box>
      ))}
    </Box>
  );
}
