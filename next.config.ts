import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const nextConfig: NextConfig = {
  // The Cloudflare adapter consumes the standalone Next.js output.
  output: 'standalone',
};

export default nextConfig;

initOpenNextCloudflareForDev();
