import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clash-of-clans-s3.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
