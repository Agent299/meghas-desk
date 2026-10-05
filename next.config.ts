import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: the default bottom-left badge sits on the sidebar's account button.
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
