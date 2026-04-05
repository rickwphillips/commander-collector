import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

import { ColorPicker } from '../../../../packages/shared/src/components/ColorPicker';

describe('ColorPicker — identity mode (no colorMode)', () => {
  it('renders all 6 mana symbol buttons', () => {
    render(<ColorPicker colors={[]} onColorsChange={() => {}} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6);
  });

  it('calls onColorsChange when a color is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorPicker colors={[]} onColorsChange={onChange} />);

    // Click the first button (W)
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(onChange).toHaveBeenCalled();
  });

  it('does not show mode toggle without colorMode prop', () => {
    render(<ColorPicker colors={['W', 'U']} onColorsChange={() => {}} />);
    expect(screen.queryByText('AND')).not.toBeInTheDocument();
    expect(screen.queryByText('OR')).not.toBeInTheDocument();
  });

  it('shows label when provided', () => {
    render(<ColorPicker colors={[]} onColorsChange={() => {}} label="Color Identity" />);
    expect(screen.getByText('Color Identity')).toBeInTheDocument();
  });

  it('shows emptyCaption when no colors selected', () => {
    render(<ColorPicker colors={[]} onColorsChange={() => {}} emptyCaption="Leave empty for colorless" />);
    expect(screen.getByText('Leave empty for colorless')).toBeInTheDocument();
  });

  it('hides emptyCaption when colors are selected', () => {
    render(<ColorPicker colors={['W']} onColorsChange={() => {}} emptyCaption="Leave empty for colorless" />);
    expect(screen.queryByText('Leave empty for colorless')).not.toBeInTheDocument();
  });
});

describe('ColorPicker — filter mode (with colorMode)', () => {
  it('shows AND/OR/Only toggle when colors selected', () => {
    render(
      <ColorPicker colors={['W', 'U']} onColorsChange={() => {}} colorMode="and" onColorModeChange={() => {}} />
    );
    expect(screen.getByText('AND')).toBeInTheDocument();
    expect(screen.getByText('OR')).toBeInTheDocument();
    expect(screen.getByText('Only')).toBeInTheDocument();
  });

  it('hides mode toggle when no colors selected', () => {
    render(
      <ColorPicker colors={[]} onColorsChange={() => {}} colorMode="and" onColorModeChange={() => {}} />
    );
    expect(screen.queryByText('AND')).not.toBeInTheDocument();
  });

  it('hides mode toggle when colorless is selected', () => {
    render(
      <ColorPicker colors={['C']} onColorsChange={() => {}} colorMode="and" onColorModeChange={() => {}} />
    );
    expect(screen.queryByText('AND')).not.toBeInTheDocument();
  });

  it('calls onColorModeChange when mode is toggled', async () => {
    const user = userEvent.setup();
    const onModeChange = vi.fn();
    render(
      <ColorPicker colors={['W', 'U']} onColorsChange={() => {}} colorMode="and" onColorModeChange={onModeChange} />
    );

    await user.click(screen.getByText('OR'));
    expect(onModeChange).toHaveBeenCalledWith('or');
  });

  it('clears colorMode when clicking C', async () => {
    const user = userEvent.setup();
    const onColorsChange = vi.fn();
    const onModeChange = vi.fn();
    render(
      <ColorPicker colors={['W']} onColorsChange={onColorsChange} colorMode="and" onColorModeChange={onModeChange} />
    );

    // Click Colorless (last button)
    const buttons = screen.getAllByRole('button');
    const cButton = buttons[5]; // C is the 6th mana symbol
    await user.click(cButton);

    expect(onModeChange).toHaveBeenCalledWith(undefined);
  });
});
