import { commanderValidator } from './commander';
import type { FormatValidator } from './types';
import type { Card } from '../cards/types';
import type { DeckContext } from './types';

const validators: Record<string, FormatValidator> = {
  commander: commanderValidator,
};

export function getValidator(format: string = 'commander'): FormatValidator {
  return validators[format] ?? commanderValidator;
}

export function validate(format: string, cards: Card[], deck?: DeckContext) {
  return getValidator(format).validate(cards, deck);
}

export type { ValidationResult, Violation, FormatValidator, DeckContext } from './types';
