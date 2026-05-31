import type { GlobalConfig } from "payload";

export const Settings: GlobalConfig = {
  slug: "settings",
  access: { read: () => true },
  fields: [
    { name: "siteName", type: "text", defaultValue: "Petster" },
    { name: "tagline", type: "text" },
    {
      name: "healthDisclaimer",
      type: "textarea",
      defaultValue: "ข้อมูลในเว็บไซต์เป็นข้อมูลทั่วไป ไม่ได้แทนการวินิจฉัยจากสัตวแพทย์",
    },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        { name: "platform", type: "text" },
        { name: "url", type: "text" },
      ],
    },
  ],
};
