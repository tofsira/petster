import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  upload: {
    staticDir: "media",
    imageSizes: [
      { name: "thumb", width: 480, height: 320, position: "centre" },
      { name: "card", width: 900, height: 600, position: "centre" },
      { name: "hero", width: 1600, height: 1000, position: "centre" },
    ],
    mimeTypes: ["image/*"],
  },
  fields: [
    { name: "alt", type: "text", required: true },
    { name: "credit", type: "text" },
  ],
};
