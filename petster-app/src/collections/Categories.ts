import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  access: { read: () => true },
  admin: { useAsTitle: "name", defaultColumns: ["name", "animal", "slug"] },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "ใช้ใน URL เช่น health, food, behavior, daily-care" },
    },
    {
      name: "animal",
      type: "select",
      required: true,
      options: [
        { label: "สุนัข", value: "dog" },
        { label: "แมว", value: "cat" },
        { label: "ทั้งสองอย่าง", value: "both" },
      ],
    },
    { name: "intro", type: "textarea" },
    { name: "heroImage", type: "upload", relationTo: "media" },
    { name: "heroImageUrl", type: "text" },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "metaTitle", type: "text" },
        { name: "metaDescription", type: "textarea" },
      ],
    },
  ],
};
