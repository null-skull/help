import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "dist",
  redirects() {
    return [
      // The redesigned landing page used to live at /home-new before it
      // replaced the old root page; keep old links working.
      { source: "/home-new", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
