'use client';

import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  Alert,
  Tooltip,
  IconButton,
  Switch,
  FormControlLabel,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Link from 'next/link';
import { getSectionDef } from '../../lib/statsSections';
import type { StatsSectionId } from '../../lib/statsSections';
import type { StatPanel, ComparisonResult } from '../../lib/types';
import { ComparisonPanel } from '../ComparisonPanel';
import { groupByLabel } from './ComparisonBuilder';

interface PanelCardProps {
  panel: StatPanel;
  isPreviewing: boolean;
  isLoadingPreview: boolean;
  previewResult: ComparisonResult | 'error' | undefined;
  showBuilder: boolean;
  onTogglePreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShareToggle: () => void;
  onCopyShareLink: () => void;
}

export function PanelCard({
  panel,
  isPreviewing,
  isLoadingPreview,
  previewResult,
  showBuilder,
  onTogglePreview,
  onEdit,
  onDelete,
  onShareToggle,
  onCopyShareLink,
}: PanelCardProps) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2, '&:last-child': { pb: isPreviewing ? 1 : 2 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {panel.name}
              </Typography>
              {panel.panel_type === 'comparison' && (
                <Chip
                  icon={<CompareArrowsIcon sx={{ fontSize: 14 }} />}
                  label="Comparison"
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Stack>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
              {panel.panel_type === 'comparison' && panel.config ? (
                <Chip
                  label={`Group by: ${groupByLabel(panel.config.groupBy)}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ) : (
                panel.sections.map((s) => {
                  const def = getSectionDef(s as StatsSectionId);
                  return def ? (
                    <Chip key={s} label={def.label} size="small" variant="outlined" />
                  ) : null;
                })
              )}
            </Stack>
          </Box>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title={isPreviewing ? 'Hide preview' : 'Preview'}>
              <IconButton
                size="small"
                onClick={onTogglePreview}
                color={isPreviewing ? 'primary' : 'default'}
              >
                {isPreviewing ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <FormControlLabel
              control={
                <Switch checked={panel.is_shared} onChange={onShareToggle} size="small" />
              }
              label={
                <ShareIcon fontSize="small" color={panel.is_shared ? 'primary' : 'action'} />
              }
              sx={{ mr: 0 }}
            />
            {panel.is_shared && panel.share_code && (
              <Tooltip title="Copy share link">
                <IconButton size="small" onClick={onCopyShareLink}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Edit">
              <IconButton size="small" onClick={onEdit} disabled={showBuilder}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={onDelete} color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Collapse in={isPreviewing}>
          <Divider sx={{ mt: 1.5, mb: 2 }} />
          {panel.panel_type === 'comparison' ? (
            isLoadingPreview ? (
              <Stack alignItems="center" sx={{ py: 2 }}>
                <CircularProgress size={24} />
              </Stack>
            ) : previewResult === 'error' ? (
              <Alert severity="error" sx={{ mb: 1 }}>
                Failed to load preview.
              </Alert>
            ) : previewResult ? (
              <ComparisonPanel result={previewResult} />
            ) : null
          ) : (
            <List dense disablePadding>
              {panel.sections.map((s) => {
                const def = getSectionDef(s as StatsSectionId);
                if (!def) return null;
                const Icon = def.icon;
                return (
                  <ListItem key={s} disableGutters sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Icon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={def.label}
                      secondary={def.description}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
            <Button
              component={Link}
              href={`/stats?panel_id=${panel.id}`}
              size="small"
              variant="outlined"
            >
              Open in Stats →
            </Button>
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}
