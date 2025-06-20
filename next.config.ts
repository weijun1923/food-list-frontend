import type { NextConfig } from "next";

const API_POINT = process.env.NEXT_PUBLIC_API_POINT as string;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_POINT}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
