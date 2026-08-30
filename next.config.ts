import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["xlsx"],
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "@tabler/icons-react", "framer-motion", "motion"],
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  async redirects() {
    return [{ source: "/tools-preview", destination: "/", permanent: true }];
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
