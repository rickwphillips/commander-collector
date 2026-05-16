'use client';

import { useEffect, useState } from 'react';
import {
  Box, Stack, Typography, Chip, ToggleButton, ToggleButtonGroup,
  Table, TableBody, TableCell, TableHead, TableRow, Paper,
  Pagination, Tooltip, CircularProgress,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import FlagIcon from '@mui/icons-material/Flag';
import { PageContainer } from '../components/PageContainer';
import { AuthGuard } from '../components/AuthGuard';
import { rulesApi } from '../lib/api';

type FeedbackItem = Awaited<ReturnType<typeof rulesApi.getFeedbackReview>>['items'][number];

const LIMIT = 25;

function IssueChips({ item }: { item: FeedbackItem }) {
  const chips = [
    item.wrong_ruling  && { label: 'Wrong ruling',  color: 'error'   as const },
    item.wrong_cr_cite && { label: 'Wrong CR cite', color: 'warning' as const },
    item.incomplete    && { label: 'Incomplete',    color: 'warning' as const },
    item.unclear       && { label: 'Unclear',       color: 'default' as const },
  ].filter(Boolean) as Array<{ label: string; color: 'error' | 'warning' | 'default' }>;

  if (!chips.length) return null;
  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
      {chips.map((c) => (
        <Chip key={c.label} label={c.label} size="small" color={c.color} variant="outlined" />
      ))}
    </Stack>
  );
}

export default function FeedbackReviewPage() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<'all' | 'up' | 'down'>('all');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    rulesApi.getFeedbackReview({
      flagged: flaggedOnly || undefined,
      rating: ratingFilter === 'all' ? undefined : ratingFilter,
      limit: LIMIT,
      offset: (page - 1) * LIMIT,
    })
      .then((r) => { setItems(r.items); setTotal(r.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, ratingFilter, flaggedOnly]);

  const pageCount = Math.ceil(total / LIMIT);

  return (
    <AuthGuard>
      <PageContainer title="Feedback Review">
        <Stack spacing={3}>
          <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
            <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>
              Feedback Review
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              {total} item{total !== 1 ? 's' : ''}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <ToggleButtonGroup
              size="small"
              exclusive
              value={ratingFilter}
              onChange={(_, v) => { if (v) { setRatingFilter(v); setPage(1); } }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="up">
                <ThumbUpIcon sx={{ fontSize: 14, mr: 0.5 }} /> Up
              </ToggleButton>
              <ToggleButton value="down">
                <ThumbDownIcon sx={{ fontSize: 14, mr: 0.5 }} /> Down
              </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButton
              size="small"
              value="flagged"
              selected={flaggedOnly}
              onChange={() => { setFlaggedOnly((p) => !p); setPage(1); }}
              color="warning"
            >
              <FlagIcon sx={{ fontSize: 14, mr: 0.5 }} /> Flagged only
            </ToggleButton>
          </Stack>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : items.length === 0 ? (
            <Typography variant="body2" sx={{ opacity: 0.6, py: 4, textAlign: 'center' }}>
              No feedback yet.
            </Typography>
          ) : (
            <Paper variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Rating</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Issues</TableCell>
                    <TableCell>Notes</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ bgcolor: item.flag_pattern ? 'warning.light' : undefined, opacity: item.flag_pattern ? 1 : 0.9 }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          {item.rating === 'up'
                            ? <ThumbUpIcon sx={{ fontSize: 14, color: 'success.main' }} />
                            : <ThumbDownIcon sx={{ fontSize: 14, color: 'error.main' }} />}
                          {Boolean(item.flag_pattern) && (
                            <Tooltip title="Flagged for pattern review">
                              <FlagIcon sx={{ fontSize: 14, color: 'warning.dark' }} />
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 260 }}>
                        <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
                          Conv #{item.conversation_id}
                          {item.message_id ? ` · Msg #${item.message_id}` : ''}
                        </Typography>
                        {item.message_snippet && (
                          <Typography
                            variant="body2"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {item.message_snippet}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell><IssueChips item={item} /></TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        {item.notes && (
                          <Typography variant="caption" sx={{ opacity: 0.85 }}>
                            {item.notes}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ opacity: 0.6, whiteSpace: 'nowrap' }}>
                          {new Date(item.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}

          {pageCount > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Pagination count={pageCount} page={page} onChange={(_, p) => setPage(p)} />
            </Box>
          )}
        </Stack>
      </PageContainer>
    </AuthGuard>
  );
}
