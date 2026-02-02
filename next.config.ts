import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/app/projects/commander',
  trailingSlash: true,
};

export default nextConfig;
