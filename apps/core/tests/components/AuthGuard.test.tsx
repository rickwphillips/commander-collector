import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

let pathname = '/';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

import { AuthGuard, useAuth } from '@/components/AuthGuard';

const token = (role: string, exp = Math.floor(Date.now() / 1000) + 3600) =>
  `${btoa('{}')}.${btoa(JSON.stringify({ sub: '1', username: 'rick', display_name: 'Rick', role, exp }))}.sig`;

let location: { href: string; pathname: string; search: string };

beforeEach(() => {
  localStorage.clear();
  pathname = '/';
  location = { href: 'http://localhost:3001/', pathname: '/', search: '' };
  Object.defineProperty(window, 'location', { writable: true, configurable: true, value: location });
});

function Who() {
  return <div>{useAuth().user?.username ?? 'anonymous'}</div>;
}

describe('AuthGuard', () => {
  it('renders children with the signed-in user', async () => {
    localStorage.setItem('auth_token', token('user'));
    render(<AuthGuard><Who /></AuthGuard>);
    await waitFor(() => expect(screen.getByText('rick')).toBeInTheDocument());
  });

  it('redirects a signed-out visitor to login without rendering children', async () => {
    render(<AuthGuard><Who /></AuthGuard>);
    await waitFor(() => expect(location.href).toContain('login'));
    expect(screen.queryByText('anonymous')).not.toBeInTheDocument();
  });

  it('lets anyone reach the public game remote, with no redirect', async () => {
    pathname = '/game-manager/remote';
    render(<AuthGuard><Who /></AuthGuard>);
    expect(screen.getByText('anonymous')).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 20));
    expect(location.href).not.toContain('login');
  });
});
