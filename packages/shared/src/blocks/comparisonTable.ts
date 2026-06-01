import type { Block } from "payload";

export const comparisonTableBlock: Block = {
  slug: "comparisonTable",
  labels: { singular: "ตารางเปรียบเทียบ", plural: "ตารางเปรียบเทียบ" },
  fields: [
    { name: "heading", type: "text" },
    { name: "leftLabel", type: "text", required: true },
    { name: "rightLabel", type: "text", required: true },
    {
      name: "rows",
      type: "array",
      required: true,
      minRows: 1,
      labels: { singular: "แถว", plural: "แถว" },
      fields: [
        { name: "topic", type: "text", required: true },
        { name: "left", type: "textarea", required: true },
        { name: "right", type: "textarea", required: true },
      ],
    },
  ],
};
