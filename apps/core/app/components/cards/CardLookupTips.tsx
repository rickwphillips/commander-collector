'use client';

/**
 * CardLookupTips — Scryfall syntax cheat sheet popover.
 *
 * Imported by CardLookupField (via the (?) icon) and any future dialog or panel
 * that exposes Scryfall query syntax to the user. One source of truth.
 *
 * Takes no props — just renders the cheat sheet.
 */

import { useState } from 'react';
import {
  Box,
  Divider,
  IconButton,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// ── Cheat sheet data ──────────────────────────────────────────────────────────

interface TipSection {
  heading: string;
  rows: { syntax: string; description: string }[];
}

const SECTIONS: TipSection[] = [
  {
    heading: 'Basic search',
    rows: [
      { syntax: 'lightning bolt',      description: 'Name contains "lightning bolt"' },
      { syntax: '"lightning bolt"',    description: 'Exact name match' },
      { syntax: '!lightning bolt',     description: 'Exact name (shorthand)' },
    ],
  },
  {
    heading: 'Colors & identity',
    rows: [
      { syntax: 'c:w',           description: 'White cards' },
      { syntax: 'c:wu',          description: 'White AND blue' },
      { syntax: 'id:gw',         description: 'Color identity Green+White' },
      { syntax: 'id<=wubrg',     description: 'Identity subset of 5-color' },
      { syntax: 'c:m',           description: 'Multicolor' },
      { syntax: 'c:colorless',   description: 'Colorless' },
    ],
  },
  {
    heading: 'Types & subtypes',
    rows: [
      { syntax: 't:creature',      description: 'Creatures' },
      { syntax: 't:legendary',     description: 'Legendary permanents' },
      { syntax: 't:instant',       description: 'Instants' },
      { syntax: 't:elf',           description: 'Elf subtype' },
      { syntax: '-t:land',         description: 'Exclude lands' },
    ],
  },
  {
    heading: 'Mana cost & CMC',
    rows: [
      { syntax: 'cmc=3',        description: 'Exactly 3 CMC' },
      { syntax: 'cmc<=2',       description: '2 or fewer CMC' },
      { syntax: 'mana:{G}{G}',  description: 'Costs at least {G}{G}' },
    ],
  },
  {
    heading: 'Power / toughness',
    rows: [
      { syntax: 'pow>=4',   description: 'Power 4 or greater' },
      { syntax: 'tou<=2',   description: 'Toughness 2 or less' },
      { syntax: 'pow=tou',  description: 'Power equals toughness' },
    ],
  },
  {
    heading: 'Oracle text',
    rows: [
      { syntax: 'o:flying',              description: 'Has "flying" in oracle text' },
      { syntax: 'o:"draw a card"',       description: 'Exact phrase in oracle text' },
      { syntax: 'kw:trample',            description: 'Has Trample keyword' },
      { syntax: 'kw:partner',            description: 'Has Partner keyword' },
    ],
  },
  {
    heading: 'Sets & rarity',
    rows: [
      { syntax: 's:cmm',       description: 'From Commander Masters (set code)' },
      { syntax: 'r:rare',      description: 'Rare cards' },
      { syntax: 'r>=uncommon', description: 'Uncommon or rarer' },
    ],
  },
  {
    heading: 'Format legality',
    rows: [
      { syntax: 'f:commander',   description: 'Legal in Commander' },
      { syntax: 'f:pauper',      description: 'Legal in Pauper' },
      { syntax: '-f:standard',   description: 'Not legal in Standard' },
    ],
  },
  {
    heading: 'Combining filters',
    rows: [
      { syntax: 't:creature c:g cmc<=2',         description: 'AND (implicit) — green creatures with CMC ≤ 2' },
      { syntax: 't:instant OR t:sorcery',         description: 'OR — instants or sorceries' },
      { syntax: '-o:flying',                      description: 'NOT — no flying in oracle text' },
      { syntax: '(t:elf OR t:human) c:w',         description: 'Grouping with parentheses' },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function CardLookupTips() {
  // Use state for anchorEl instead of a ref so we avoid reading ref.current during
  // render (react-compiler "cannot access refs during render" rule).
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = anchorEl !== null;

  return (
    <>
      <Tooltip title="Scryfall search syntax" placement="top">
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="Scryfall search syntax help"
          sx={{ color: 'text.secondary', p: 0.5 }}
        >
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '92vw', sm: 440 },
              maxHeight: '70vh',
              overflowY: 'auto',
              p: 2,
            },
          },
        }}
      >
        <Typography variant="subtitle2" gutterBottom fontWeight={700}>
          Scryfall Search Syntax
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
          The search field activates query mode automatically when your input contains{' '}
          <code>*</code> <code>:</code> <code>=</code> <code>{'<'}</code> <code>{'>'}</code>{' '}
          <code>(</code> <code>&quot;</code> or starts with <code>!</code> or <code>-</code>.
        </Typography>

        <Stack spacing={1.5} divider={<Divider />}>
          {SECTIONS.map((section) => (
            <Box key={section.heading}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="primary"
                display="block"
                sx={{ mb: 0.75, textTransform: 'uppercase', letterSpacing: '0.08em' }}
              >
                {section.heading}
              </Typography>

              <Stack spacing={0.5}>
                {section.rows.map((row) => (
                  <Stack
                    key={row.syntax}
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <Box
                      component="code"
                      sx={{
                        flexShrink: 0,
                        minWidth: 160,
                        fontFamily: 'monospace',
                        fontSize: '0.78rem',
                        bgcolor: (theme) =>
                          theme.palette.mode === 'dark'
                            ? 'rgba(255,255,255,0.07)'
                            : 'rgba(0,0,0,0.05)',
                        borderRadius: 0.5,
                        px: 0.75,
                        py: 0.25,
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.syntax}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ pt: 0.25 }}>
                      {row.description}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Full docs:{' '}
            <Box
              component="a"
              href="https://scryfall.com/docs/syntax"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'primary.main' }}
            >
              scryfall.com/docs/syntax
            </Box>
          </Typography>
        </Box>
      </Popover>
    </>
  );
}
