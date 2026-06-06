import type { GlobalConfig } from "payload";

export const Settings: GlobalConfig = {
  slug: "settings",
  access: { read: () => true },
  fields: [
    {
      type: "row",
      fields: [
        { name: "siteName", type: "text", defaultValue: "GoodPet" },
        { name: "tagline", type: "text" },
      ],
    },
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
    {
      type: "collapsible",
      label: "การตั้งค่าขั้นสูง",
      fields: [
        {
          name: "schemaMarkup",
          type: "json",
          admin: {
            description: "JSON-LD schema markup สำหรับ SEO (Organization, WebSite ฯลฯ)",
          },
        },
      ],
    },
  ],
};
