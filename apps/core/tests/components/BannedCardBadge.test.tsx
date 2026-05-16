import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import * as apiModule from '@/lib/api';
import { BannedCardBadge } from '@/components/BannedCardBadge';

function mockCardNote(kind: string | null, reason?: string) {
  vi.spyOn(apiModule.api, 'getCardNote').mockResolvedValue({
    band: kind === null ? 'unknown' : 'certain',
    data: {
      name: 'Sol Ring',
      format: 'commander',
      kind: kind as never,
      weight: null,
      reason: reason ?? null,
      short_circuit: false,
      source: null,
    },
    sources: [],
    caveats: [],
  } as never);
}

describe('BannedCardBadge', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('renders nothing when card is not banned', async () => {
    mockCardNote('staple');
    const { container } = render(<BannedCardBadge name="Sol Ring" />);
    await waitFor(() => expect(apiModule.api.getCardNote).toHaveBeenCalled());
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when MCP returns unknown band', async () => {
    mockCardNote(null);
    const { container } = render(<BannedCardBadge name="Chaos Orb" />);
    await waitFor(() => expect(apiModule.api.getCardNote).toHaveBeenCalled());
    expect(container.firstChild).toBeNull();
  });

  it('renders banned chip when card is banned', async () => {
    mockCardNote('banned', 'Banned for excessive power');
    render(<BannedCardBadge name="Braids, Cabal Minion" />);
    await waitFor(() => expect(screen.getByText('Banned')).toBeInTheDocument());
  });

  it('calls getCardNote with correct name and default format', async () => {
    mockCardNote(null);
    render(<BannedCardBadge name="Flash" />);
    await waitFor(() => expect(apiModule.api.getCardNote).toHaveBeenCalled());
    expect(apiModule.api.getCardNote).toHaveBeenCalledWith('Flash', 'commander');
  });

  it('calls getCardNote with custom format when provided', async () => {
    mockCardNote(null);
    render(<BannedCardBadge name="Flash" format="legacy" />);
    await waitFor(() => expect(apiModule.api.getCardNote).toHaveBeenCalled());
    expect(apiModule.api.getCardNote).toHaveBeenCalledWith('Flash', 'legacy');
  });
});
