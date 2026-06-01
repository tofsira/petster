import type { Block } from "payload";

export const stepListBlock: Block = {
  slug: "stepList",
  labels: { singular: "ขั้นตอน", plural: "ขั้นตอน" },
  fields: [
    { name: "heading", type: "text" },
    {
      name: "steps",
      type: "array",
      required: true,
      minRows: 1,
      labels: { singular: "ขั้นตอน", plural: "ขั้นตอน" },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "detail", type: "textarea" },
      ],
    },
  ],
};
