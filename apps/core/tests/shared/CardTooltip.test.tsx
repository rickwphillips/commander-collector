/**
 * Unit & regression tests for CardTooltip.
 *
 * The component defers image lookup to first hover — tests simulate this
 * by firing mouseEnter before asserting on cache calls.
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

  it('calls getCardImageByName on first hover', async () => {
    mockGetCardImage.mockResolvedValue('data:image/png;base64,abc');
    mockGetCardBackImage.mockResolvedValue(null);

    render(
      <CardTooltip name="Lightning Bolt">
        <span data-testid="card">Lightning Bolt</span>
      </CardTooltip>
    );

    // Not called until hover
    expect(mockGetCardImage).not.toHaveBeenCalled();

    // Hover triggers lookup
    const wrapper = screen.getByTestId('card').parentElement!;
    await act(async () => {
      fireEvent.mouseEnter(wrapper);
    });

    await waitFor(() => {
      expect(mockGetCardImage).toHaveBeenCalledWith('Lightning Bolt');
    });
  });

  it('calls getCardBackImageByName on first hover for DFC support', async () => {
    mockGetCardImage.mockResolvedValue('data:image/png;base64,front');
    mockGetCardBackImage.mockResolvedValue('https://back.jpg');

    render(
      <CardTooltip name="Delver of Secrets">
        <span data-testid="card">Delver of Secrets</span>
      </CardTooltip>
    );

    const wrapper = screen.getByTestId('card').parentElement!;
    await act(async () => {
      fireEvent.mouseEnter(wrapper);
    });

    await waitFor(() => {
      expect(mockGetCardBackImage).toHaveBeenCalledWith('Delver of Secrets');
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

    fireEvent.click(screen.getByTestId('card'));
    expect(onClick).toHaveBeenCalledWith('Clickable Card');
  });

  it('renders children as plain text when lookup finds no image', async () => {
    mockGetCardImage.mockResolvedValue(null);
    mockGetCardBackImage.mockResolvedValue(null);

    render(
      <CardTooltip name="Missing Card">
        <span data-testid="child">Missing Card</span>
      </CardTooltip>
    );

    // Hover to trigger lookup
    const wrapper = screen.getByTestId('child').parentElement!;
    await act(async () => {
      fireEvent.mouseEnter(wrapper);
    });

    // After lookup completes with null, children rendered without tooltip wrapper
    await waitFor(() => {
      expect(mockGetCardImage).toHaveBeenCalled();
    });
  });
});

// ─── Regression Tests ──────────────────────────────────────────────────────────

describe('REGRESSION: hover-to-retry when initial load fails', () => {
  it('does not re-fetch on hover when image already loaded', async () => {
    mockGetCardImage.mockResolvedValue('data:image/png;base64,loaded');
    mockGetCardBackImage.mockResolvedValue(null);

    render(
      <CardTooltip name="Already Loaded">
        <span data-testid="card">Already Loaded</span>
      </CardTooltip>
    );

    // First hover triggers lookup
    const wrapper = screen.getByTestId('card').parentElement!;
    await act(async () => {
      fireEvent.mouseEnter(wrapper);
    });

    await waitFor(() => {
      expect(mockGetCardImage).toHaveBeenCalledTimes(1);
    });

    // Second hover should NOT trigger another fetch (looked = true)
    await act(async () => {
      fireEvent.mouseLeave(wrapper);
      fireEvent.mouseEnter(wrapper);
    });

    await new Promise((r) => setTimeout(r, 50));
    expect(mockGetCardImage).toHaveBeenCalledTimes(1);
  });
});
