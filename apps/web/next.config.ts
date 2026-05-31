import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // apps/web is the public site only. It reads CMS content through CMS_URL.
  // Trace from the monorepo root so standalone / Vercel output stays complete.
  outputFileTracingRoot: path.join(dirname, "../../"),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
