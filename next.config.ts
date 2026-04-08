import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["xlsx"],
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "@tabler/icons-react", "framer-motion", "motion"],
  },
  async redirects() {
    return [
      { source: "/tools-preview", destination: "/", permanent: true },
      { source: "/pricing", destination: "/#pricing", permanent: true },
      { source: "/case-studies", destination: "/", permanent: true },
      { source: "/south-o-roofing", destination: "/", permanent: false },
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
