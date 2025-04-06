import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Force SWC transforms even with custom Babel config
    forceSwcTransforms: true,

    // Enable SWC loader for specific features
    swcPlugins: [
      // Add any necessary SWC plugins here
    ],
  },
  compiler: {
    // Ensure font optimization works with SWC
    styledComponents: true, // If you're using styled-components
  },
};

export default nextConfig;