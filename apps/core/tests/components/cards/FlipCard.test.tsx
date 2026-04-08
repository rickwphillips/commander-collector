import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlipCard } from '@/components/cards/FlipCard';

describe('FlipCard', () => {
  it('renders front content always', () => {
    render(<FlipCard front={<span>Front Face</span>} />);
    expect(screen.getByText('Front Face')).toBeInTheDocument();
  });

  it('flips on click in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    render(
      <FlipCard
        front={<span>Front</span>}
        back={<span>Back</span>}
        onFlip={onFlip}
      />
    );
    const btn = screen.getByRole('button', { name: 'Flip card' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    await user.click(btn);
    expect(onFlip).toHaveBeenCalledWith(true);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('reflects controlled flip state without internal toggle', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    const { rerender } = render(
      <FlipCard
        front={<span>Front</span>}
        back={<span>Back</span>}
        flipped={false}
        onFlip={onFlip}
      />
    );
    const btn = screen.getByRole('button', { name: 'Flip card' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');

    await user.click(btn);
    // onFlip fires but the button does NOT self-update (parent controls state)
    expect(onFlip).toHaveBeenCalledWith(true);
    expect(btn).toHaveAttribute('aria-pressed', 'false'); // still false — parent hasn't updated

    rerender(
      <FlipCard
        front={<span>Front</span>}
        back={<span>Back</span>}
        flipped={true}
        onFlip={onFlip}
      />
    );
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('Space key flips the card', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    render(
      <FlipCard
        front={<span>Front</span>}
        back={<span>Back</span>}
        onFlip={onFlip}
      />
    );
    const btn = screen.getByRole('button', { name: 'Flip card' });
    btn.focus();
    await user.keyboard(' ');
    expect(onFlip).toHaveBeenCalledWith(true);
  });

  it('Enter key flips the card', async () => {
    const user = userEvent.setup();
    const onFlip = vi.fn();
    render(
      <FlipCard
        front={<span>Front</span>}
        back={<span>Back</span>}
        onFlip={onFlip}
      />
    );
    const btn = screen.getByRole('button', { name: 'Flip card' });
    btn.focus();
    await user.keyboard('{Enter}');
    expect(onFlip).toHaveBeenCalledWith(true);
  });

  it('no-back renders no flip button', () => {
    render(<FlipCard front={<span>Front only</span>} />);
    expect(screen.queryByRole('button', { name: 'Flip card' })).not.toBeInTheDocument();
  });

  it('disabled suppresses the flip button', () => {
    render(
      <FlipCard
        front={<span>Front</span>}
        back={<span>Back</span>}
        disabled
      />
    );
    expect(screen.queryByRole('button', { name: 'Flip card' })).not.toBeInTheDocument();
  });

  it('defaultFlipped starts the card face-down', () => {
    render(
      <FlipCard
        front={<span>Front</span>}
        back={<span>Back</span>}
        defaultFlipped
      />
    );
    const btn = screen.getByRole('button', { name: 'Flip card' });
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });
});
