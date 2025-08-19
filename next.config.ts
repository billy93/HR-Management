import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  // Vercel deployment optimizations
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  experimental: {
    serverComponentsExternalPackages: ['prisma', '@prisma/client'],
  },
};

export default nextConfig;
