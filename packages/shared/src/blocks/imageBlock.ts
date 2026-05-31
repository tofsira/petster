import type { Block } from "payload";

export const imageBlock: Block = {
  slug: "imageBlock",
  labels: { singular: "รูปภาพ", plural: "รูปภาพ" },
  fields: [
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "caption", type: "text" },
  ],
};
