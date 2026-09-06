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
  /* config options here */
};

export default nextConfig;
