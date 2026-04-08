import type { Card } from '../cards/types';

export type ValidationResult = {
  legal: boolean;
  format: string;
  violations: Violation[];
};

export type Violation = {
  rule:
    | 'singleton'
    | 'card_count'
    | 'color_identity'
    | 'banned'
    | 'commander_legality'
    | 'format_legality';
  severity: 'error' | 'warning';
  message: string;
  cardIds?: string[]; // for inline highlighting in CardListView
};

export interface FormatValidator {
  format: string;
  validate(cards: Card[], deck?: DeckContext): ValidationResult;
}

export type DeckContext = {
  id?: number;
  commander?: string | null;
  partner?: string | null;
  /**
   * Optional override for the deck's color identity.
   * If provided, this is used instead of inferring from role='commander'/'partner' rows.
   */
  colorIdentity?: Array<'W' | 'U' | 'B' | 'R' | 'G' | 'C'>;
};
