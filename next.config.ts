import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ESLintチェックを完全に無効化
    ignoreDuringBuilds: true,
    dirs: [],
  },
  typescript: {
    // 型チェックを無効化
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
