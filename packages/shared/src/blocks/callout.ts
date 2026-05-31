import type { Block } from "payload";

export const calloutBlock: Block = {
  slug: "callout",
  labels: { singular: "Callout", plural: "Callouts" },
  fields: [
    {
      name: "type",
      type: "radio",
      required: true,
      defaultValue: "tip",
      options: [
        { label: "💡 เคล็ดลับ", value: "tip" },
        { label: "⚠️ คำเตือน", value: "warning" },
        { label: "ℹ️ ข้อมูลเพิ่มเติม", value: "info" },
      ],
    },
    {
      name: "message",
      type: "textarea",
      required: true,
    },
  ],
};
