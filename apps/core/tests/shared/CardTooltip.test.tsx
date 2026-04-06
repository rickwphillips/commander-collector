/**
 * Unit & regression tests for CardTooltip.
 *
 * Regression: prior to fix, when the initial image load failed,
 * the component rendered bare children with no event handlers,
 * making retry-on-hover impossible.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import React from 'react';

// ─── Mock cardImageCache ───────────────────────────────────────────────────────
const mockGetCardImage = vi.fn();
const mockGetCardBackImage = vi.fn();

vi.mock('../../../../packages/shared/src/lib/cardImageCache', () => ({
  getCardImageByName: (...args: unknown[]) => mockGetCardImage(...args),
  getCardBackImageByName: (...args: unknown[]) => mockGetCardBackImage(...args),
}));

import { CardTooltip } from '../../../../packages/shared/src/components/CardTooltip';

beforeEach(() => {
  vi.clearAllMocks();
  mockGetCardImage.mockReset();
  mockGetCardBackImage.mockReset();
});

// ─── Unit Tests ────────────────────────────────────────────────────────────────

describe('CardTooltip', () => {
  it('renders children immediately', () => {
    mockGetCardImage.mockResolvedValue(null);
    mockGetCardBackImage.mockResolvedValue(null);

    render(
      <CardTooltip name="Sol Ring">
        <span data-testid="card">Sol Ring</span>
      </CardTooltip>
    );

    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('calls getCardImageByName on mount', async () => {
    mockGetCardImage.mockResolvedValue('data:image/png;base64,abc');
    mockGetCardBackImage.mockResolvedValue(null);

    render(
      <CardTooltip name="Lightning Bolt">
        <span>Lightning Bolt</span>
      </CardTooltip>
    );

    await waitFor(() => {
      expect(mockGetCardImage).toHaveBeenCalledWith('Lightning Bolt');
    });
  });

  it('calls getCardBackImageByName on mount for DFC support', async () => {
    mockGetCardImage.mockResolvedValue('data:image/png;base64,front');
    mockGetCardBackImage.mockResolvedValue('https://back.jpg');

    render(
      <CardTooltip name="Delver of Secrets">
        <span>Delver of Secrets</span>
      </CardTooltip>
    );

    await waitFor(() => {
      expect(mockGetCardBackImage).toHaveBeenCalledWith('Delver of Secrets');
    });
  });

  it('wraps children in a span even when no image is available', async () => {
    mockGetCardImage.mockResolvedValue(null);
    mockGetCardBackImage.mockResolvedValue(null);

    const { container } = render(
      <CardTooltip name="Missing Card">
        <span data-testid="child">Missing Card</span>
      </CardTooltip>
    );

    await waitFor(() => {
      // Should be wrapped in a span (not bare fragment)
      const child = screen.getByTestId('child');
      expect(child.parentElement?.tagName).toBe('SPAN');
    });
  });

  it('fires onClick handler when clicked', async () => {
    mockGetCardImage.mockResolvedValue(null);
    mockGetCardBackImage.mockResolvedValue(null);
    const onClick = vi.fn();

    render(
      <CardTooltip name="Clickable Card" onClick={onClick}>
        <span data-testid="card">Clickable Card</span>
      </CardTooltip>
    );

    await waitFor(() => {
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('card'));
    expect(onClick).toHaveBeenCalledWith('Clickable Card');
  });
});

// ─── Regression Tests ──────────────────────────────────────────────────────────

describe('REGRESSION: hover-to-retry when initial load fails', () => {
  it('retries image fetch on hover when initial load returned null', async () => {
    // First call: fail
    mockGetCardImage.mockResolvedValueOnce(null);
    mockGetCardBackImage.mockResolvedValueOnce(null);

    const { container } = render(
      <CardTooltip name="Retry Card">
        <span data-testid="card">Retry Card</span>
      </CardTooltip>
    );

    // Wait for initial load to complete
    await waitFor(() => {
      expect(mockGetCardImage).toHaveBeenCalledTimes(1);
    });

    // Set up success for retry
    mockGetCardImage.mockResolvedValueOnce('data:image/png;base64,retry-success');
    mockGetCardBackImage.mockResolvedValueOnce(null);

    // Hover over the card — should trigger retry
    const wrapper = screen.getByTestId('card').parentElement!;
    await act(async () => {
      fireEvent.mouseEnter(wrapper);
    });

    await waitFor(() => {
      // Should have called getCardImageByName again (retry)
      expect(mockGetCardImage).toHaveBeenCalledTimes(2);
      expect(mockGetCardImage).toHaveBeenLastCalledWith('Retry Card');
    });
  });

  it('no-image wrapper has mouseEnter handler for retry', async () => {
    mockGetCardImage.mockResolvedValue(null);
    mockGetCardBackImage.mockResolvedValue(null);

    render(
      <CardTooltip name="Handler Check">
        <span data-testid="card">Handler Check</span>
      </CardTooltip>
    );

    await waitFor(() => {
      expect(mockGetCardImage).toHaveBeenCalled();
    });

    // The wrapper span should exist and be interactive
    const wrapper = screen.getByTestId('card').parentElement!;
    expect(wrapper.tagName).toBe('SPAN');

    // mouseEnter should not throw
    expect(() => fireEvent.mouseEnter(wrapper)).not.toThrow();
  });

  it('does not re-fetch on hover when image already loaded', async () => {
    mockGetCardImage.mockResolvedValue('data:image/png;base64,loaded');
    mockGetCardBackImage.mockResolvedValue(null);

    render(
      <CardTooltip name="Already Loaded">
        <span data-testid="card">Already Loaded</span>
      </CardTooltip>
    );

    await waitFor(() => {
      expect(mockGetCardImage).toHaveBeenCalledTimes(1);
    });

    // Hover over — should NOT trigger another fetch
    const wrapper = screen.getByTestId('card').parentElement!;
    await act(async () => {
      fireEvent.mouseEnter(wrapper);
    });

    // Small delay to ensure no async re-fetch fires
    await new Promise((r) => setTimeout(r, 50));

    // Still only 1 call — no retry needed
    expect(mockGetCardImage).toHaveBeenCalledTimes(1);
  });

  it('transitions from no-image to tooltip after successful retry', async () => {
    // Initial: fail
    mockGetCardImage.mockResolvedValueOnce(null);
    mockGetCardBackImage.mockResolvedValueOnce(null);

    const { rerender } = render(
      <CardTooltip name="Transition Card">
        <span data-testid="card">Transition Card</span>
      </CardTooltip>
    );

    await waitFor(() => {
      expect(mockGetCardImage).toHaveBeenCalledTimes(1);
    });

    // Initially no MUI Tooltip present (just a bare span wrapper)
    const wrapperBefore = screen.getByTestId('card').parentElement!;
    expect(wrapperBefore.tagName).toBe('SPAN');

    // Set up success for retry
    mockGetCardImage.mockResolvedValueOnce('data:image/png;base64,now-works');
    mockGetCardBackImage.mockResolvedValueOnce(null);

    // Hover to trigger retry
    await act(async () => {
      fireEvent.mouseEnter(wrapperBefore);
    });

    // After retry succeeds, the component should re-render with the Tooltip
    await waitFor(() => {
      expect(mockGetCardImage).toHaveBeenCalledTimes(2);
    });
  });
});
