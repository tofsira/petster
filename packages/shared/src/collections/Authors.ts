import type { CollectionConfig } from "payload";

export const Authors: CollectionConfig = {
  slug: "authors",
  access: { read: () => true },
  admin: { useAsTitle: "name" },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "email",
          type: "email",
          admin: { description: "อีเมลผู้เขียน (ไม่แสดงสาธารณะ)" },
        },
      ],
    },
    {
      name: "role",
      type: "select",
      options: [
        { label: "สัตวแพทย์", value: "veterinarian" },
        { label: "บรรณาธิการ", value: "editor" },
        { label: "ผู้ร่วมเขียน", value: "contributor" },
      ],
    },
    { name: "credentials", type: "text", admin: { description: "เช่น DVM, M.Sc." } },
    { name: "bio", type: "textarea" },
    { name: "avatar", type: "upload", relationTo: "media" },
    {
      name: "articles",
      type: "join",
      collection: "articles",
      on: "author",
      admin: { description: "บทความทั้งหมดของผู้เขียนนี้" },
    },
  ],
};
