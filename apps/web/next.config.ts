import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // The Payload schema lives in the @petster/shared workspace package.
  // apps/web reads it through the Payload Local API (see src/lib/payload.ts).
  transpilePackages: ["@petster/shared"],
  // Trace from the monorepo root so standalone / Vercel output stays complete.
  outputFileTracingRoot: path.join(dirname, "../../"),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default withPayload(nextConfig);
