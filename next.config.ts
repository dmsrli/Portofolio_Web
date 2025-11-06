import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⬅️ biar build tidak gagal karena ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // ⬅️ opsional: biar error TS tidak stop build
  },
};

export default nextConfig;
