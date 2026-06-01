import type { CollectionConfig } from "payload";
import { lexicalEditor, BlocksFeature } from "@payloadcms/richtext-lexical";
import { calloutBlock } from "../blocks/callout";
import { imageBlock } from "../blocks/imageBlock";

export const Articles: CollectionConfig = {
  slug: "articles",
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "animal", "category", "publishedAt", "featured"],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "เนื้อหา",
          fields: [
            { name: "title", type: "text", required: true },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              admin: { description: "URL slug — ห้ามมีช่องว่าง" },
            },
            {
              type: "row",
              fields: [
                {
                  name: "animal",
                  type: "radio",
                  required: true,
                  options: [
                    { label: "สุนัข", value: "dog" },
                    { label: "แมว", value: "cat" },
                  ],
                },
                {
                  name: "publishedAt",
                  type: "date",
                  admin: { date: { pickerAppearance: "dayOnly" } },
                },
              ],
            },
            {
              name: "category",
              type: "relationship",
              relationTo: "categories",
              required: true,
            },
            {
              name: "excerpt",
              type: "textarea",
              maxLength: 240,
              admin: { description: "สรุปสั้นๆ ใช้ในการ์ดและ meta description" },
            },
            {
              name: "body",
              type: "richText",
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  BlocksFeature({ blocks: [calloutBlock, imageBlock] }),
                ],
              }),
            },
          ],
        },
        {
          label: "มีเดีย",
          fields: [
            { name: "heroImage", type: "upload", relationTo: "media" },
            {
              name: "heroImageUrl",
              type: "text",
              admin: { description: "ใช้ external URL ถ้ายังไม่ได้ upload heroImage" },
            },
          ],
        },
        {
          label: "เพิ่มเติม",
          fields: [
            {
              name: "sources",
              type: "array",
              labels: { singular: "แหล่งอ้างอิง", plural: "แหล่งอ้างอิง" },
              fields: [
                { name: "label", type: "text", required: true },
                { name: "url", type: "text" },
              ],
            },
            {
              name: "faq",
              type: "array",
              labels: { singular: "FAQ", plural: "FAQ" },
              fields: [
                { name: "question", type: "text", required: true },
                { name: "answer", type: "textarea", required: true },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "author",
                  type: "relationship",
                  relationTo: "authors",
                },
                {
                  name: "featured",
                  type: "checkbox",
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "seo",
              type: "group",
              fields: [
                { name: "metaTitle", type: "text" },
                { name: "metaDescription", type: "textarea" },
                { name: "ogImage", type: "upload", relationTo: "media" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
