import type { MouseEvent, ReactNode } from 'react';

/** Props for {@link PageContainer}. */
export interface PageContainerProps {
  /** Page heading, rendered as gradient text. */
  title: string;
  /** Optional line under the heading. A node, so callers can pass chips or links. */
  subtitle?: ReactNode;
  /**
   * Optional card image shown to the left of the title block. Hovering it opens
   * a tooltip holding a larger copy of the same image.
   */
  titleImage?: string | null;
  /** Where the back button goes. Defaults to {@link DEFAULT_BACK_HREF}. */
  backHref?: string;
  /** Back button text. Defaults to {@link DEFAULT_BACK_LABEL}. */
  backLabel?: string;
  /**
   * Optional click interceptor for the back button. Called with the synthetic
   * mouse event before navigation. Call `e.preventDefault()` to cancel the
   * navigation (e.g. an unsaved-changes confirm).
   */
  onBackClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  /** Page body. */
  children: ReactNode;
  /** Optional controls rendered right-aligned on the back-button row. */
  actions?: ReactNode;
}

/** Back button target when a caller does not override it. */
export const DEFAULT_BACK_HREF = '/';

/** Back button text when a caller does not override it. */
export const DEFAULT_BACK_LABEL = 'Back';
