import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as apiModule from '@/lib/api';
import { RulesQuickLookup } from '@/components/RulesQuickLookup';

// CardTooltip makes external Scryfall requests — stub it out
vi.mock('@commander/shared/components/CardTooltip', () => ({
  CardTooltip: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

const CR_RESPONSE = {
  band: 'certain' as const,
  data: { rule_number: '116.1', body: 'Priority is the right to cast spells.', examples: ['Example A'] },
  sources: [],
  caveats: [],
};

const PATTERN_RESPONSE = {
  band: 'certain' as const,
  data: { pattern_id: 'P001', name: 'Proliferate triggers', abstract: 'Each proliferate event...', tags: ['proliferate'], cr_refs: ['702.9'] },
  sources: [],
  caveats: [],
};

const UNKNOWN = { band: 'unknown' as const, data: null, sources: [], caveats: ['Not found'] };

async function openDrawer() {
  await userEvent.click(screen.getByRole('button', { name: /quick lookup/i }));
}

describe('RulesQuickLookup', () => {
  beforeEach(() => { vi.clearAllMocks(); });
  afterEach(() => { vi.restoreAllMocks(); });

  it('renders the lookup icon button', () => {
    render(<RulesQuickLookup />);
    expect(screen.getByRole('button', { name: /quick lookup/i })).toBeInTheDocument();
  });

  it('opens the drawer when icon button is clicked', async () => {
    render(<RulesQuickLookup />);
    await openDrawer();
    expect(screen.getByText('Quick Lookup')).toBeInTheDocument();
  });

  it('calls lookupCRRule for a CR number query', async () => {
    const spy = vi.spyOn(apiModule.api, 'lookupCRRule').mockResolvedValue(CR_RESPONSE as never);
    render(<RulesQuickLookup />);
    await openDrawer();
    await userEvent.type(screen.getByRole('textbox'), '116.1');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(spy).toHaveBeenCalledWith('116.1'));
    expect(screen.getByText(/priority is the right/i)).toBeInTheDocument();
  });

  it('strips "CR " prefix before calling lookupCRRule', async () => {
    const spy = vi.spyOn(apiModule.api, 'lookupCRRule').mockResolvedValue(CR_RESPONSE as never);
    render(<RulesQuickLookup />);
    await openDrawer();
    await userEvent.type(screen.getByRole('textbox'), 'CR 116.1');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(spy).toHaveBeenCalledWith('116.1'));
  });

  it('calls getPattern for a P-number query', async () => {
    const spy = vi.spyOn(apiModule.api, 'getPattern').mockResolvedValue(PATTERN_RESPONSE as never);
    render(<RulesQuickLookup />);
    await openDrawer();
    await userEvent.type(screen.getByRole('textbox'), 'P001');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(spy).toHaveBeenCalledWith('P001'));
    expect(screen.getByText('Proliferate triggers')).toBeInTheDocument();
  });

  it('strips leading # from pattern query', async () => {
    const spy = vi.spyOn(apiModule.api, 'getPattern').mockResolvedValue(PATTERN_RESPONSE as never);
    render(<RulesQuickLookup />);
    await openDrawer();
    await userEvent.type(screen.getByRole('textbox'), '#P001');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(spy).toHaveBeenCalledWith('P001'));
  });

  it('shows card name for non-rule, non-pattern input', async () => {
    render(<RulesQuickLookup />);
    await openDrawer();
    await userEvent.type(screen.getByRole('textbox'), 'Sol Ring');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByText('Sol Ring')).toBeInTheDocument());
    expect(screen.getByText(/hover for card preview/i)).toBeInTheDocument();
  });

  it('shows error text when CR lookup returns unknown band', async () => {
    vi.spyOn(apiModule.api, 'lookupCRRule').mockResolvedValue(UNKNOWN as never);
    render(<RulesQuickLookup />);
    await openDrawer();
    await userEvent.type(screen.getByRole('textbox'), '999');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByText('Not found')).toBeInTheDocument());
  });

  it('shows error text when pattern lookup returns unknown band', async () => {
    vi.spyOn(apiModule.api, 'getPattern').mockResolvedValue(UNKNOWN as never);
    render(<RulesQuickLookup />);
    await openDrawer();
    await userEvent.type(screen.getByRole('textbox'), 'P999');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByText('Not found')).toBeInTheDocument());
  });

  it('triggers search when search icon button is clicked', async () => {
    const spy = vi.spyOn(apiModule.api, 'lookupCRRule').mockResolvedValue(CR_RESPONSE as never);
    render(<RulesQuickLookup />);
    await openDrawer();
    await userEvent.type(screen.getByRole('textbox'), '116.1');
    // The search adornment button is the last button rendered inside the TextField
    const buttons = screen.getAllByRole('button');
    const searchBtn = buttons.find((b) => b.querySelector('[data-testid="SearchIcon"]'));
    if (!searchBtn) throw new Error('Search icon button not found');
    await userEvent.click(searchBtn);
    await waitFor(() => expect(spy).toHaveBeenCalled());
  });
});
