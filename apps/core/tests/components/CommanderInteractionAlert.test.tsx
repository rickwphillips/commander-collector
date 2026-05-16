import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as apiModule from '@/lib/api';
import { CommanderInteractionAlert } from '@/components/CommanderInteractionAlert';

const PATTERN_HIT = {
  band: 'certain' as const,
  data: {
    card_a: 'Atraxa',
    card_b: 'Doubling Season',
    patterns: [{ pattern_id: 'P001', name: 'Counter doubling', abstract: 'Doubles counters placed' }],
    cr_refs_cited: [],
    learned_weight: null,
  },
  sources: [],
  caveats: [],
};

const NO_HIT = {
  band: 'certain' as const,
  data: { card_a: 'X', card_b: 'Y', patterns: [], cr_refs_cited: [], learned_weight: null },
  sources: [],
  caveats: [],
};

const UNKNOWN = { band: 'unknown' as const, data: null, sources: [], caveats: [] };

describe('CommanderInteractionAlert', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });
  afterEach(() => { vi.restoreAllMocks(); });

  it('renders nothing when fewer than 2 commanders', () => {
    const { container } = render(<CommanderInteractionAlert commanders={['Atraxa']} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when commanders list is empty', () => {
    const { container } = render(<CommanderInteractionAlert commanders={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('stays silent when MCP returns unknown band', async () => {
    vi.spyOn(apiModule.api, 'lookupInteraction').mockResolvedValue(UNKNOWN as never);
    render(<CommanderInteractionAlert commanders={['Atraxa', 'Ur-Dragon']} />);
    await waitFor(() => expect(apiModule.api.lookupInteraction).toHaveBeenCalled());
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('stays silent when no pattern hits', async () => {
    vi.spyOn(apiModule.api, 'lookupInteraction').mockResolvedValue(NO_HIT as never);
    render(<CommanderInteractionAlert commanders={['Atraxa', 'Ur-Dragon']} />);
    await waitFor(() => expect(apiModule.api.lookupInteraction).toHaveBeenCalled());
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('shows snackbar with pattern name when hit found', async () => {
    vi.spyOn(apiModule.api, 'lookupInteraction').mockResolvedValue(PATTERN_HIT as never);
    const { container } = render(<CommanderInteractionAlert commanders={['Atraxa', 'Doubling Season']} />);
    // Component returns null until hits arrive; Snackbar appears once hits are set
    await waitFor(() => expect(container.querySelector('.MuiSnackbar-root')).toBeInTheDocument());
    // Pattern name is inside the Collapse — verify via DOM text content
    expect(container.textContent).toContain('Counter doubling');
  });

  it('looks up all commander pairs (n*(n-1)/2)', async () => {
    const spy = vi.spyOn(apiModule.api, 'lookupInteraction').mockResolvedValue(NO_HIT as never);
    render(<CommanderInteractionAlert commanders={['A', 'B', 'C']} />);
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(3));
  });

  it('deduplicates commander names', async () => {
    const spy = vi.spyOn(apiModule.api, 'lookupInteraction').mockResolvedValue(NO_HIT as never);
    render(<CommanderInteractionAlert commanders={['Atraxa', 'Atraxa', 'Ur-Dragon']} />);
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
  });

  it('skips lookup when storageKey was previously dismissed', async () => {
    const spy = vi.spyOn(apiModule.api, 'lookupInteraction').mockResolvedValue(NO_HIT as never);
    const key = 'test-key:Atraxa|Ur-Dragon';
    sessionStorage.setItem(key, '1');
    render(<CommanderInteractionAlert commanders={['Atraxa', 'Ur-Dragon']} storageKey="test-key" />);
    await waitFor(() => {}, { timeout: 200 });
    expect(spy).not.toHaveBeenCalled();
  });

  it('persists dismiss state in sessionStorage on close', async () => {
    vi.spyOn(apiModule.api, 'lookupInteraction').mockResolvedValue(PATTERN_HIT as never);
    render(
      <CommanderInteractionAlert commanders={['Atraxa', 'Doubling Season']} storageKey="dismiss-test" />
    );
    await waitFor(() => expect(screen.getByLabelText('dismiss', { hidden: true })).toBeInTheDocument());
    await userEvent.click(screen.getByLabelText('dismiss', { hidden: true }));
    expect(sessionStorage.getItem('dismiss-test:Atraxa|Doubling Season')).toBe('1');
  });
});
