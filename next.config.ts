import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable webpack disk cache in dev mode to prevent cache corruption (500 chunk errors)
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
