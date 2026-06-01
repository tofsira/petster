import type { Block } from "payload";

export const keyTakeawaysBlock: Block = {
  slug: "keyTakeaways",
  labels: { singular: "สรุปประเด็นสำคัญ", plural: "สรุปประเด็นสำคัญ" },
  fields: [
    { name: "heading", type: "text", defaultValue: "สรุปสั้น ๆ" },
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      labels: { singular: "ประเด็น", plural: "ประเด็น" },
      fields: [{ name: "text", type: "text", required: true }],
    },
  ],
};
