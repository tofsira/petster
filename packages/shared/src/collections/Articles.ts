import type { Access, CollectionConfig } from "payload";
import { lexicalEditor, BlocksFeature } from "@payloadcms/richtext-lexical";
import { calloutBlock } from "../blocks/callout";
import { comparisonTableBlock } from "../blocks/comparisonTable";
import { imageBlock } from "../blocks/imageBlock";
import { keyTakeawaysBlock } from "../blocks/keyTakeaways";
import { redFlagsBlock } from "../blocks/redFlags";
import { stepListBlock } from "../blocks/stepList";
import { whenToSeeVetBlock } from "../blocks/whenToSeeVet";
import { estimateArticleReadingTime, isValidSlug, slugifyTitle } from "../utils/editorial";

const authenticated: Access = ({ req }) => Boolean(req.user);

const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: "published" } };
};

const previewBaseUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL || "http://localhost:3001").replace(
    /\/$/,
    "",
  );

const animalToSlug = (animal?: unknown) => (animal === "cat" ? "cats" : "dogs");

const categorySlugFromDoc = (category?: unknown) =>
  typeof category === "object" && category && "slug" in category
    ? String((category as { slug?: unknown }).slug || "")
    : "";

export const Articles: CollectionConfig = {
  slug: "articles",
  access: {
    create: authenticated,
    delete: authenticated,
    read: publishedOrAuthenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "contentStage", "animal", "category", "readingTimeMinutes"],
    listSearchableFields: ["title", "slug", "excerpt"],
    preview: (doc, { token }) => {
      const categorySlug = categorySlugFromDoc(doc.category);
      if (!doc.animal || !categorySlug || !doc.slug) return null;
      const draftToken = token ? `&token=${encodeURIComponent(token)}` : "";
      return `${previewBaseUrl()}/${animalToSlug(doc.animal)}/${categorySlug}/${doc.slug}?draft=true${draftToken}`;
    },
    livePreview: {
      url: ({ data }) => {
        const categorySlug = categorySlugFromDoc(data.category);
        if (!data.animal || !categorySlug || !data.slug) return null;
        return `${previewBaseUrl()}/${animalToSlug(data.animal)}/${categorySlug}/${data.slug}?preview=true`;
      },
    },
  },
  versions: {
    drafts: {
      autosave: {
        interval: 15000,
      },
    },
    maxPerDoc: 30,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;

        const nextData = { ...data };
        if (!nextData.slug && typeof nextData.title === "string") {
          nextData.slug = slugifyTitle(nextData.title);
        } else if (typeof nextData.slug === "string") {
          nextData.slug = slugifyTitle(nextData.slug);
        }

        nextData.readingTimeMinutes = estimateArticleReadingTime({
          body: nextData.body,
          excerpt: typeof nextData.excerpt === "string" ? nextData.excerpt : null,
          title: typeof nextData.title === "string" ? nextData.title : null,
        });

        if (
          (nextData._status === "published" || nextData.contentStage === "published") &&
          !nextData.publishedAt
        ) {
          nextData.publishedAt = new Date().toISOString();
        }

        return nextData;
      },
    ],
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
              required: false,
              unique: true,
              validate: (value: unknown) =>
                !value || isValidSlug(value) || "Slug ใช้ได้เฉพาะตัวอักษร ตัวเลข และขีดกลาง ห้ามเว้นวรรค",
              admin: { description: "ปล่อยว่างได้ ระบบจะสร้างจาก title และห้ามมีช่องว่าง" },
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
                  BlocksFeature({
                    blocks: [
                      calloutBlock,
                      comparisonTableBlock,
                      imageBlock,
                      keyTakeawaysBlock,
                      redFlagsBlock,
                      stepListBlock,
                      whenToSeeVetBlock,
                    ],
                  }),
                ],
              }),
            },
            {
              name: "readingTimeMinutes",
              type: "number",
              min: 1,
              admin: {
                description: "ระบบคำนวณจากเนื้อหาโดยอัตโนมัติ",
                readOnly: true,
              },
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
              type: "collapsible",
              label: "Editorial workflow",
              fields: [
                {
                  name: "contentStage",
                  type: "select",
                  defaultValue: "draft",
                  options: [
                    { label: "Draft", value: "draft" },
                    { label: "Review", value: "review" },
                    { label: "Ready", value: "ready" },
                    { label: "Published", value: "published" },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "referencesChecked", type: "checkbox", defaultValue: false },
                    { name: "healthDisclaimerChecked", type: "checkbox", defaultValue: false },
                    { name: "vetReviewRequired", type: "checkbox", defaultValue: false },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    { name: "reviewedBy", type: "relationship", relationTo: "users" },
                    {
                      name: "reviewedAt",
                      type: "date",
                      admin: { date: { pickerAppearance: "dayAndTime" } },
                    },
                  ],
                },
                { name: "internalNotes", type: "textarea" },
              ],
            },
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
                {
                  name: "metaTitle",
                  type: "text",
                  maxLength: 70,
                  admin: { description: "แนะนำไม่เกิน 70 ตัวอักษร ถ้าเว้นว่างจะใช้ title" },
                },
                {
                  name: "metaDescription",
                  type: "textarea",
                  maxLength: 160,
                  admin: { description: "แนะนำไม่เกิน 160 ตัวอักษร ถ้าเว้นว่างจะใช้ excerpt" },
                },
                { name: "ogImage", type: "upload", relationTo: "media" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
