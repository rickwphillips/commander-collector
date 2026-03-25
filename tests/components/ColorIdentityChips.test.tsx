import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ColorIdentityChips } from '@/components/ColorIdentityChips';

// ManaSymbol renders <img alt="White">, <img alt="Blue">, etc. (full color name, not letter)

describe('ColorIdentityChips', () => {
  it('renders mana symbol image for white', () => {
    render(<ColorIdentityChips colors="W" />);
    expect(screen.getByAltText('White')).toBeInTheDocument();
  });

  it('renders mana symbol image for blue', () => {
    render(<ColorIdentityChips colors="U" />);
    expect(screen.getByAltText('Blue')).toBeInTheDocument();
  });

  it('renders mana symbol image for black', () => {
    render(<ColorIdentityChips colors="B" />);
    expect(screen.getByAltText('Black')).toBeInTheDocument();
  });

  it('renders mana symbol image for red', () => {
    render(<ColorIdentityChips colors="R" />);
    expect(screen.getByAltText('Red')).toBeInTheDocument();
  });

  it('renders mana symbol image for green', () => {
    render(<ColorIdentityChips colors="G" />);
    expect(screen.getByAltText('Green')).toBeInTheDocument();
  });

  it('renders all 5 mana symbol images for "WUBRG"', () => {
    render(<ColorIdentityChips colors="WUBRG" />);
    expect(screen.getByAltText('White')).toBeInTheDocument();
    expect(screen.getByAltText('Blue')).toBeInTheDocument();
    expect(screen.getByAltText('Black')).toBeInTheDocument();
    expect(screen.getByAltText('Red')).toBeInTheDocument();
    expect(screen.getByAltText('Green')).toBeInTheDocument();
  });

  it('renders colorless mana symbol when colors="C"', () => {
    render(<ColorIdentityChips colors="C" />);
    expect(screen.getByAltText('Colorless')).toBeInTheDocument();
  });

  it('falls back to colorless when colors is empty', () => {
    // ColorIdentityChips defaults to "C" when colors is empty
    render(<ColorIdentityChips colors="" />);
    expect(screen.getByAltText('Colorless')).toBeInTheDocument();
  });

  it('renders 2 chips for "WU" and not a third', () => {
    render(<ColorIdentityChips colors="WU" />);
    expect(screen.getByAltText('White')).toBeInTheDocument();
    expect(screen.getByAltText('Blue')).toBeInTheDocument();
    expect(screen.queryByAltText('Black')).not.toBeInTheDocument();
  });

  it('renders unknown color characters using the raw letter as alt text', () => {
    // ManaSymbol falls back to COLOR_NAME[c] ?? c — unknown "X" gets alt="X"
    render(<ColorIdentityChips colors="WX" />);
    expect(screen.getByAltText('White')).toBeInTheDocument();
    expect(screen.getByAltText('X')).toBeInTheDocument();
  });
});
