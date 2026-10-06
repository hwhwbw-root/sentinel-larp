import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Firmware uploads go through a Server Action; the default 1MB cap is
    // smaller than an ESP32 .bin. 4MB stays under Vercel's 4.5MB body limit.
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
