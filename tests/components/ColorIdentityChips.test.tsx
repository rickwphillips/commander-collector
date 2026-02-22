import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ColorIdentityChips } from '@/app/components/ColorIdentityChips';

describe('ColorIdentityChips', () => {
  it('renders "W" letter for white', () => {
    render(<ColorIdentityChips colors="W" />);
    expect(screen.getByText('W')).toBeInTheDocument();
  });

  it('renders "U" letter for blue', () => {
    render(<ColorIdentityChips colors="U" />);
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('renders "B" letter for black', () => {
    render(<ColorIdentityChips colors="B" />);
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('renders "R" letter for red', () => {
    render(<ColorIdentityChips colors="R" />);
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('renders "G" letter for green', () => {
    render(<ColorIdentityChips colors="G" />);
    expect(screen.getByText('G')).toBeInTheDocument();
  });

  it('renders all 5 color letters for "WUBRG"', () => {
    render(<ColorIdentityChips colors="WUBRG" />);
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
    expect(screen.getByText('G')).toBeInTheDocument();
  });

  it('renders colorless chip (no letters) when colors="C"', () => {
    render(<ColorIdentityChips colors="C" />);
    // Colorless renders a single circle with no letter, tooltip says "Colorless"
    expect(screen.queryByText('C')).not.toBeInTheDocument();
  });

  it('renders colorless chip (no letters) when colors is empty', () => {
    render(<ColorIdentityChips colors="" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders 2 chips for "WU"', () => {
    render(<ColorIdentityChips colors="WU" />);
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument();
    expect(screen.queryByText('B')).not.toBeInTheDocument();
  });

  it('ignores unknown color characters silently', () => {
    // 'X' is not in the color map — should render nothing for it
    render(<ColorIdentityChips colors="WX" />);
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.queryByText('X')).not.toBeInTheDocument();
  });
});
