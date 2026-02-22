import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsCard } from '@/app/components/StatsCard';

describe('StatsCard', () => {
  it('renders title', () => {
    render(<StatsCard title="Total Games" value={42} />);
    expect(screen.getByText('Total Games')).toBeInTheDocument();
  });

  it('renders numeric value', () => {
    render(<StatsCard title="Wins" value={17} />);
    expect(screen.getByText('17')).toBeInTheDocument();
  });

  it('renders string value', () => {
    render(<StatsCard title="Win Rate" value="64.3%" />);
    expect(screen.getByText('64.3%')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<StatsCard title="Wins" value={10} subtitle="Last 30 days" />);
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
  });

  it('does not render subtitle when omitted', () => {
    render(<StatsCard title="Wins" value={10} />);
    expect(screen.queryByText('Last 30 days')).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const TestIcon = () => <svg data-testid="test-icon" />;
    render(<StatsCard title="Wins" value={10} icon={<TestIcon />} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('does not render icon slot when icon is omitted', () => {
    render(<StatsCard title="Wins" value={10} />);
    expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument();
  });
});
