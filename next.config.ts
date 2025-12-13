import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
  productionBrowserSourceMaps: true,
  experimental: {
    serverSourceMaps: true,
  },
};

export default nextConfig;
