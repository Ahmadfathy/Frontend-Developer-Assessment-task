import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Hides the fixed dev-mode route indicator (the small icon pinned to
  // a screen corner). Dev-only cosmetic overlay — compile/runtime errors
  // still surface, and it's already absent from production builds.
  devIndicators: false,
};

export default nextConfig;
