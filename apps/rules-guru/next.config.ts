import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  transpilePackages: ['@commander/shared'],
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  ...(isDev ? { experimental: { proxyTimeout: 120_000 } } : {}),
  ...(isDev ? {} : { output: 'export' }),
  basePath: isDev ? '' : '/app/projects/commander/rules',
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
  trailingSlash: true,

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
