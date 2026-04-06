import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["xlsx"],
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/tools-preview", destination: "/", permanent: true },
      { source: "/pricing", destination: "/#pricing", permanent: true },
      { source: "/case-studies", destination: "/", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
