import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 警告をエラーとして扱わない（ビルドを失敗させない）
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
