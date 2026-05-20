import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  transpilePackages: ['@commander/shared'],
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  // Extend dev proxy timeout so slow Claude API calls (30–90s) don't get cut off
  ...(isDev ? { experimental: { proxyTimeout: 120_000 } } : {}),
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
            destination: 'http://127.0.0.1:8081/php-api/:path*',
          },
        ]
      : [];
  },
};

export default nextConfig;
