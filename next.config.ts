import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // website and follow-up-automations were separate services before they were
  // merged into the Digital Foundation. Redirect rather than 404 — the URLs may
  // already have been shared.
  async redirects() {
    return [
      // Digital Foundation stopped being a service on 11 September 2026 and became
      // a package. These three all predate that and must not 404.
      { source: "/services/website", destination: "/services/branded-websites", permanent: true },
      { source: "/services/follow-up-automations", destination: "/services/text-email-automations", permanent: true },
      { source: "/services/digital-foundation", destination: "/packages/digital-foundation", permanent: true },
      { source: "/services/social-media-management", destination: "/services/brand-management", permanent: true },
    ];
  },
  // Taken from the old project: tree-shakes the icon and motion imports, both
  // of which this site uses heavily.
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
};

export default nextConfig;
