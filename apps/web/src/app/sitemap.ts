import type { MetadataRoute } from "next";
import { cmsFind } from "@/lib/cms";
import { articleUrl, animalToSlug, categoryUrl, type Animal } from "@/lib/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [articles, categories] = await Promise.all([
    cmsFind<any>("articles", { depth: 1, limit: 1000 }),
    cmsFind<any>("categories", { limit: 100 }),
  ]);

  const staticUrls = ["/", "/dogs", "/cats", "/principles"].map((path) => ({
    url: `${site}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const categoryUrls = categories.docs.flatMap((c) => {
    const animals: Animal[] =
      c.animal === "both" ? ["dog", "cat"] : ([c.animal] as Animal[]);
    return animals.map((a) => ({
      url: `${site}${categoryUrl(a, c.slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  });

  const articleUrls = articles.docs
    .filter((a) => a.publishedAt)
    .map((a) => {
      const cat = a.category as { slug: string } | string;
      const catSlug = typeof cat === "string" ? "" : cat.slug;
      return {
        url: `${site}${articleUrl(a.animal as Animal, catSlug, a.slug)}`,
        lastModified: a.updatedAt ? new Date(a.updatedAt) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      };
    });

  return [...staticUrls, ...categoryUrls, ...articleUrls];
}
