/** Props for {@link LoadingSpinner}. */
export interface LoadingSpinnerProps {
  /** Text under the spinner. Defaults to {@link DEFAULT_LOADING_MESSAGE}. */
  message?: string;
}

/** Shown when a caller has nothing more specific to say. */
export const DEFAULT_LOADING_MESSAGE = 'Loading...';
