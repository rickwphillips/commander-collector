'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FlipIcon from '@mui/icons-material/SyncAlt';
import StarIcon from '@mui/icons-material/Star';
import StyleIcon from '@mui/icons-material/Style';
import type { ScannedCard } from '@/lib/types';

interface CardReviewGridProps {
  cards: ScannedCard[];
  cropMap: Record<string, string>;
  onChangeQuantity: (id: string, delta: number) => void;
  onToggleProxy: (id: string) => void;
  onToggleCommander: (id: string) => void;
  onOpenVersionPicker: (card: ScannedCard) => void;
  onOpenEdit: (card: ScannedCard) => void;
  onRemove: (id: string) => void;
}

export function CardReviewGrid({
  cards,
  cropMap,
  onChangeQuantity,
  onToggleProxy,
  onToggleCommander,
  onOpenVersionPicker,
  onOpenEdit,
  onRemove,
}: CardReviewGridProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  function toggleFlip(id: string) {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card) => (
        <Grid key={card.id} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
          <Card
            sx={{
              height: '100%',
              outline: card.is_commander ? '2px solid' : card.is_proxy ? '2px dashed' : undefined,
              outlineColor: card.is_commander ? 'warning.main' : card.is_proxy ? 'error.main' : undefined,
              opacity: card.notFound ? 0.7 : 1,
            }}
          >
            {card.image_uri ? (
              <Box sx={{ position: 'relative', aspectRatio: '488/680', perspective: '600px' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.5s ease',
                    transform: flippedCards.has(card.id) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  <Box
                    component="img"
                    src={card.image_uri}
                    alt={card.card_name}
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backfaceVisibility: 'hidden',
                    }}
                  />
                  {card.back_image_uri && (
                    <Box
                      component="img"
                      src={card.back_image_uri}
                      alt={`${card.card_name} (back)`}
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    />
                  )}
                </Box>
                {card.back_image_uri && (
                  <IconButton
                    size="small"
                    onClick={() => toggleFlip(card.id)}
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                      width: 28,
                      height: 28,
                    }}
                  >
                    <FlipIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                )}
              </Box>
            ) : card.notFound && cropMap[card.id] ? (
              <Box
                component="img"
                src={cropMap[card.id]}
                alt={card.card_name}
                sx={{ aspectRatio: '488/680', width: '100%', objectFit: 'contain', bgcolor: 'action.hover' }}
              />
            ) : (
              <Box
                sx={{
                  aspectRatio: '488/680',
                  bgcolor: 'action.hover',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 1,
                }}
              >
                <Typography variant="caption" textAlign="center" color="text.secondary">
                  {card.notFound ? 'Not found' : card.card_name}
                </Typography>
              </Box>
            )}
            <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
              <Typography variant="caption" noWrap display="block" title={card.card_name}>
                {card.card_name}
              </Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.5}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <IconButton size="small" onClick={() => onChangeQuantity(card.id, -1)}>
                    <Typography variant="caption" lineHeight={1}>−</Typography>
                  </IconButton>
                  <Typography variant="caption">{card.quantity}</Typography>
                  <IconButton size="small" onClick={() => onChangeQuantity(card.id, 1)}>
                    <Typography variant="caption" lineHeight={1}>+</Typography>
                  </IconButton>
                </Stack>
                <Stack direction="row">
                  <IconButton
                    size="small"
                    title={card.is_proxy ? 'Mark as real' : 'Mark as proxy'}
                    onClick={() => onToggleProxy(card.id)}
                    color={card.is_proxy ? 'error' : 'default'}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    size="small"
                    title="Mark as commander"
                    onClick={() => onToggleCommander(card.id)}
                    color={card.is_commander ? 'warning' : 'default'}
                  >
                    <StarIcon fontSize="inherit" />
                  </IconButton>
                  {card.scryfall_id && (
                    <IconButton
                      size="small"
                      title="Change version/set"
                      onClick={() => onOpenVersionPicker(card)}
                    >
                      <StyleIcon fontSize="inherit" />
                    </IconButton>
                  )}
                  <IconButton size="small" title="Edit" onClick={() => onOpenEdit(card)}>
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    size="small"
                    title="Remove"
                    color="error"
                    onClick={() => onRemove(card.id)}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
