import { describe, it, expect, afterEach, vi } from 'vitest';

// remoteQrOrigin() branches on a module-level `isDev` const (NODE_ENV==='development'),
// so exercising the dev LAN-swap path requires a fresh module import with a stubbed env.

describe('remoteQrOrigin', () => {
  const realLocation = window.location;

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    Object.defineProperty(window, 'location', { configurable: true, value: realLocation });
  });

  it('returns the page origin when not in dev mode', async () => {
    // Default NODE_ENV under vitest is 'test' → isDev is false.
    const { remoteQrOrigin } = await import('@/lib/api');
    expect(remoteQrOrigin()).toBe(window.location.origin);
  });

  it('swaps in the LAN host (keeping the port) when in dev on localhost', async () => {
    vi.resetModules();
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_DEV_LAN_HOST', '192.168.1.50');
    // Default jsdom location is http://localhost:3000/ → hostname localhost, port 3000.
    const { remoteQrOrigin } = await import('@/lib/api');
    expect(remoteQrOrigin()).toBe('http://192.168.1.50:3000');
  });

  it('swaps in the LAN host with no port when on 127.0.0.1 without a port', async () => {
    vi.resetModules();
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_DEV_LAN_HOST', '192.168.1.50');
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { protocol: 'http:', hostname: '127.0.0.1', port: '', origin: 'http://127.0.0.1' },
    });
    const { remoteQrOrigin } = await import('@/lib/api');
    expect(remoteQrOrigin()).toBe('http://192.168.1.50');
  });

  it('returns the page origin in dev when no LAN host is configured', async () => {
    vi.resetModules();
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_DEV_LAN_HOST', '');
    const { remoteQrOrigin } = await import('@/lib/api');
    expect(remoteQrOrigin()).toBe(window.location.origin);
  });

  it('returns the page origin in dev when on a non-local hostname', async () => {
    vi.resetModules();
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_DEV_LAN_HOST', '192.168.1.50');
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { protocol: 'http:', hostname: '192.168.1.99', port: '3000', origin: 'http://192.168.1.99:3000' },
    });
    const { remoteQrOrigin } = await import('@/lib/api');
    expect(remoteQrOrigin()).toBe('http://192.168.1.99:3000');
  });
});
