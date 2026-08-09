import type { NextConfig } from "next";

// Used only to build the `images.remotePatterns` allowlist below, so
// next/image (if used later) can load event/festival photos served by Odoo.
const backendOrigin = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8069";
const backendHostname = (() => {
  try {
    return new URL(backendOrigin).hostname;
  } catch {
    return "localhost";
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: backendOrigin.startsWith("https") ? "https" : "http",
        hostname: backendHostname,
      },
    ],
  },
};

export default nextConfig;
