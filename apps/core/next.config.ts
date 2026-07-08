import type { NextConfig } from 'next';
import { networkInterfaces } from 'os';

const isDev = process.env.NODE_ENV === 'development';

// The machine's LAN IPv4 (e.g. 192.168.1.153), so a phone on the same Wi-Fi can
// reach the dev server and the in-game "pair a phone" QR encodes a reachable
// host instead of localhost. Detected once at dev-server start; empty in prod.
function detectLanHost(): string {
  for (const list of Object.values(networkInterfaces())) {
    for (const iface of list ?? []) {
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
  }
  return 'localhost';
}
const devLanHost = isDev ? detectLanHost() : '';

const nextConfig: NextConfig = {
  transpilePackages: ['@commander/shared'],
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    // Exposed to the client so the in-game QR can encode the LAN host in dev.
    ...(isDev ? { NEXT_PUBLIC_DEV_LAN_HOST: devLanHost } : {}),
  },
  // Extend dev proxy timeout so slow Claude API calls (30–90s) don't get cut off
  ...(isDev ? { experimental: { proxyTimeout: 120_000 } } : {}),
  // Allow loading dev assets when the app is opened from a phone on the LAN
  // (e.g. http://192.168.1.153:3001). Next 16 otherwise refuses /_next/* to any
  // non-localhost origin, which renders a blank page. Dev-only setting.
  ...(isDev ? { allowedDevOrigins: [devLanHost] } : {}),
  // Only use static export for production builds
  ...(isDev ? {} : { output: 'export' }),
  basePath: isDev ? '' : '/app/projects/commander',
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
  trailingSlash: true,

  // Proxy PHP API requests in development
  async rewrites() {
    return isDev
      ? [
          {
            source: '/php-api/:path*',
            destination: 'http://localhost:8081/php-api/:path*',
          },
        ]
      : [];
  },
};

export default nextConfig;
