import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // website and follow-up-automations were separate services before they were
  // merged into the Digital Foundation. Redirect rather than 404 — the URLs may
  // already have been shared.
  async redirects() {
    return [
      { source: "/services/website", destination: "/services/digital-foundation", permanent: true },
      { source: "/services/follow-up-automations", destination: "/services/digital-foundation", permanent: true },
    ];
  },
  // Taken from the old project: tree-shakes the icon and motion imports, both
  // of which this site uses heavily.
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default nextConfig;
