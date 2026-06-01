import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  upload: {
    staticDir: "media",
    imageSizes: [
      { name: "squareSmall", width: 480, height: 480, position: "centre" },
      { name: "squareCard", width: 900, height: 900, position: "centre" },
      { name: "squareHero", width: 1200, height: 1200, position: "centre" },
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
