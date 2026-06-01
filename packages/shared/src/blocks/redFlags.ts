import type { Block } from "payload";

export const redFlagsBlock: Block = {
  slug: "redFlags",
  labels: { singular: "สัญญาณอันตราย", plural: "สัญญาณอันตราย" },
  fields: [
    { name: "heading", type: "text", defaultValue: "สัญญาณที่ควรระวัง" },
    {
      name: "items",
      type: "array",
      required: true,
      minRows: 1,
      labels: { singular: "สัญญาณ", plural: "สัญญาณ" },
      fields: [{ name: "text", type: "text", required: true }],
    },
  ],
};
