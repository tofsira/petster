import type { Block } from "payload";

export const whenToSeeVetBlock: Block = {
  slug: "whenToSeeVet",
  labels: { singular: "เมื่อไรควรพบสัตวแพทย์", plural: "เมื่อไรควรพบสัตวแพทย์" },
  fields: [
    {
      name: "urgency",
      type: "select",
      defaultValue: "soon",
      options: [
        { label: "เฝ้าดูอาการ", value: "watch" },
        { label: "ควรนัดตรวจ", value: "soon" },
        { label: "ควรพบสัตวแพทย์ทันที", value: "urgent" },
      ],
    },
    { name: "message", type: "textarea", required: true },
  ],
};
