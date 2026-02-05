import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Only use static export for production builds
  ...(isDev ? {} : { output: 'export' }),
  basePath: isDev ? '' : '/app/projects/commander',
  trailingSlash: true,

  // Proxy PHP API requests in development
  async rewrites() {
    return isDev
      ? [
          {
            source: '/php-api/:path*',
            destination: 'http://localhost:8080/php-api/:path*',
          },
        ]
      : [];
  },
};

export default nextConfig;
