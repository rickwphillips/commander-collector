import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Note: Static export (output: 'export') removed because dynamic routes
  // with database-driven IDs don't work well with static generation.
  // For Bluehost deployment, consider using Vercel for the Next.js app
  // and keeping only the PHP API + MySQL on Bluehost.
};

export default nextConfig;
