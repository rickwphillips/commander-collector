'use client';

import { ColorSymbols } from './ManaSymbol';

interface ColorIdentityChipsProps {
  colors: string;
  size?: 'small' | 'medium' | 'large';
  /** Reserve a consistent fixed bounding box regardless of pip count. */
  fixed?: boolean;
}

const SIZE_MAP = { small: 20, medium: 28, large: 36 };

export function ColorIdentityChips({ colors, size = 'medium', fixed = false }: ColorIdentityChipsProps) {
  return <ColorSymbols colors={colors || 'C'} size={SIZE_MAP[size]} fixed={fixed} />;
}
