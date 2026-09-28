import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site, deployable to GitHub Pages or any static host.
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  reactStrictMode: true,
  images: {
    // Responsive widths are pre-rendered by scripts/optimize-images.mjs.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 960, 1280, 1920],
    imageSizes: [96, 256, 384],
  },
};

export default nextConfig;
