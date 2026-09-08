import type { ReactNode } from 'react';

/** Props for {@link EmptyState}. */
export interface EmptyStateProps {
  /** Optional large glyph above the title, muted to match the caption colour. */
  icon?: ReactNode;
  /** The headline, e.g. "No decks yet". */
  title: string;
  /** Optional sentence explaining how to fill the void. */
  description?: string;
  /**
   * Label for the call-to-action button. Only rendered together with
   * {@link EmptyStateProps.actionHref}; one without the other renders nothing.
   */
  actionLabel?: string;
  /** Route the call-to-action navigates to. Pairs with `actionLabel`. */
  actionHref?: string;
}
