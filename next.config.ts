import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  experimental: {
    // Increase body size limit for the scan endpoint (base64 image payloads)
    serverBodySizeLimit: '10mb',
  },
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
