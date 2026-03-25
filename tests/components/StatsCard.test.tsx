import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { StatsCard } from '@/components/StatsCard';

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

  it('renders value as a link when href is provided', () => {
    render(<StatsCard title="Games" value={42} href="/games" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/games');
    expect(link).toHaveTextContent('42');
  });

  it('does not render a link when href is omitted', () => {
    render(<StatsCard title="Games" value={42} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders correctly in dark mode', () => {
    const darkTheme = createTheme({ palette: { mode: 'dark' } });
    render(
      <ThemeProvider theme={darkTheme}>
        <StatsCard title="Games" value={42} />
      </ThemeProvider>
    );
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
