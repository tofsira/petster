import type { Animal } from "@/lib/url";
import type { SerializedEditorState, SerializedLexicalNode } from "lexical";

export type MediaDoc = {
  url?: string | null;
  alt?: string | null;
  sizes?: Partial<Record<ImageSizeName, { url?: string | null } | null>> | null;
};

export type ImageSizeName = "squareSmall" | "squareCard" | "squareHero" | "thumb" | "card" | "hero";

export type CategoryDoc = {
  id: number | string;
  name: string;
  slug: string;
  animal: Animal | "both";
  intro?: string | null;
  heroImage?: number | MediaDoc | null;
  heroImageUrl?: string | null;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
  } | null;
};

export type ArticleDoc = {
  id: number | string;
  title: string;
  slug: string;
  animal: Animal;
  category: number | string | CategoryDoc;
  excerpt?: string | null;
  body?: SerializedEditorState<SerializedLexicalNode> | null;
  heroImage?: number | MediaDoc | null;
  heroImageUrl?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  featured?: boolean | null;
  readingTimeMinutes?: number | null;
  contentStage?: "draft" | "review" | "ready" | "published" | null;
  sources?: { id?: string | null; label: string; url?: string | null }[] | null;
  faq?: { id?: string | null; question: string; answer: string }[] | null;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
  } | null;
};

export type HeroImageSource = {
  heroImage?: number | MediaDoc | null;
  heroImageUrl?: string | null;
};

export function imageFrom(
  doc: HeroImageSource,
  fallback: string,
  preferredSize?: ImageSizeName,
): { url: string; alt: string };
export function imageFrom(
  doc: HeroImageSource,
  fallback?: string,
  preferredSize?: ImageSizeName,
): { url: string; alt: string } | null;
export function imageFrom(doc: HeroImageSource, fallback?: string, preferredSize?: ImageSizeName) {
  const upload = typeof doc.heroImage === "object" ? doc.heroImage : null;
  const sizedUrl = preferredSize ? upload?.sizes?.[preferredSize]?.url : null;
  if (sizedUrl) return { url: sizedUrl, alt: upload?.alt || "" };
  if (upload?.url) return { url: upload.url, alt: upload.alt || "" };
  if (doc.heroImageUrl) return { url: doc.heroImageUrl, alt: "" };
  return fallback ? { url: fallback, alt: "" } : null;
}

export function categorySlugFrom(category: ArticleDoc["category"]) {
  return typeof category === "object" && category ? category.slug : "";
}

export function categoryNameFrom(category: ArticleDoc["category"]) {
  return typeof category === "object" && category ? category.name : "";
}
