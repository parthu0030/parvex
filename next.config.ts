import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile one directory up makes Next guess the wrong workspace
  // root. Pin it to this project.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  images: {
    // 75 = default grid quality; 90 = full-screen photography viewer.
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    // Unsplash serves pre-optimized images via their own CDN query params
    // (w=, q=, auto=format). Next.js optimization is still active so local
    // and Cloudinary images are processed normally. If you see ECONNRESET
    // errors for specific Unsplash images, add `unoptimized` on that
    // individual <Image> component instead of disabling it globally.
  },
  allowedDevOrigins: ["*.trycloudflare.com", "192.168.29.112"],
};

export default nextConfig;
