import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardLookupTips } from '@/components/cards/CardLookupTips';

describe('CardLookupTips', () => {
  it('renders the help icon button', () => {
    render(<CardLookupTips />);
    expect(screen.getByLabelText('Scryfall search syntax help')).toBeInTheDocument();
  });

  it('popover is not visible before clicking', () => {
    render(<CardLookupTips />);
    expect(screen.queryByText('Scryfall Search Syntax')).not.toBeInTheDocument();
  });

  it('opens cheat sheet popover on click', async () => {
    const user = userEvent.setup();
    render(<CardLookupTips />);
    await user.click(screen.getByLabelText('Scryfall search syntax help'));
    expect(screen.getByText('Scryfall Search Syntax')).toBeInTheDocument();
  });

  it('cheat sheet contains basic search section', async () => {
    const user = userEvent.setup();
    render(<CardLookupTips />);
    await user.click(screen.getByLabelText('Scryfall search syntax help'));
    expect(screen.getByText('Basic search')).toBeInTheDocument();
  });

  it('cheat sheet contains color filter syntax', async () => {
    const user = userEvent.setup();
    render(<CardLookupTips />);
    await user.click(screen.getByLabelText('Scryfall search syntax help'));
    expect(screen.getByText('Colors & identity')).toBeInTheDocument();
  });

  it('cheat sheet explains query mode activation', async () => {
    const user = userEvent.setup();
    render(<CardLookupTips />);
    await user.click(screen.getByLabelText('Scryfall search syntax help'));
    expect(screen.getByText(/activates query mode automatically/)).toBeInTheDocument();
  });
});
