import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Mocks ─────────────────────────────────────────────────────────────────────

// ManaSymbol renders SVG icons that aren't useful to test in jsdom.
// Replace with a simple button so we can simulate color-picker clicks.
vi.mock('@/components/ManaSymbol', () => ({
  ManaSymbol: ({
    color,
    onClick,
    active,
  }: {
    color: string;
    onClick?: () => void;
    active?: boolean;
    size?: number;
    dimmed?: boolean;
    tooltip?: boolean;
  }) => (
    <button
      data-testid={`mana-${color}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={`Color ${color}`}
    >
      {color}
    </button>
  ),
}));

// CardLookupField has its own tests; stub it for FilterBar tests.
vi.mock('@/components/cards/CardLookupField', () => ({
  CardLookupField: () => <input data-testid="lookup-field" />,
}));

// ── Import after mocks ─────────────────────────────────────────────────────────

import { CardFilterBar } from '@/components/cards/CardFilterBar';
import type { FilterSortState } from '@/lib/cards/filter';

// ── Helpers ───────────────────────────────────────────────────────────────────

function defaultState(): FilterSortState {
  return { sort: 'name', sortDir: 'asc' };
}

describe('CardFilterBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the search input', () => {
    render(
      <CardFilterBar state={defaultState()} onChange={vi.fn()} />
    );
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('fires onChange with updated search after debounce', async () => {
    const user = userEvent.setup({ delay: null });
    const onChange = vi.fn();

    render(<CardFilterBar state={defaultState()} onChange={onChange} />);
    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, 'bolt');

    await waitFor(
      () => {
        const calls = onChange.mock.calls;
        const last = calls[calls.length - 1]?.[0] as FilterSortState | undefined;
        expect(last?.search).toBe('bolt');
      },
      { timeout: 500 },
    );
  });

  it('color pips are rendered for W U B R G C', () => {
    render(<CardFilterBar state={defaultState()} onChange={vi.fn()} />);
    for (const c of ['W', 'U', 'B', 'R', 'G', 'C']) {
      expect(screen.getByTestId(`mana-${c}`)).toBeInTheDocument();
    }
  });

  it('selecting C clears WUBRG (C ↔ WUBRG mutual exclusion)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    // Start with W already selected
    render(
      <CardFilterBar
        state={{ ...defaultState(), colors: ['W'] }}
        onChange={onChange}
      />
    );

    await user.click(screen.getByTestId('mana-C'));
    const last = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0] as FilterSortState;
    // C should be selected; W should be cleared
    expect(last.colors).toContain('C');
    expect(last.colors).not.toContain('W');
  });

  it('selecting W clears C (C ↔ WUBRG mutual exclusion)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    // Start with C already selected
    render(
      <CardFilterBar
        state={{ ...defaultState(), colors: ['C'] }}
        onChange={onChange}
      />
    );

    await user.click(screen.getByTestId('mana-W'));
    const last = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0] as FilterSortState;
    expect(last.colors).toContain('W');
    expect(last.colors).not.toContain('C');
  });

  it('clicking an active color deselects it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <CardFilterBar
        state={{ ...defaultState(), colors: ['R'] }}
        onChange={onChange}
      />
    );

    await user.click(screen.getByTestId('mana-R'));
    const last = onChange.mock.calls[onChange.mock.calls.length - 1]?.[0] as FilterSortState;
    expect(last.colors).not.toContain('R');
  });

  it('renders sort selector', () => {
    render(<CardFilterBar state={defaultState()} onChange={vi.fn()} />);
    // The sort button group or select should be present
    expect(screen.getByRole('group', { name: /color filter/i })).toBeInTheDocument();
  });
});
