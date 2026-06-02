import type { MetadataRoute } from "next";
import { cmsFind } from "@/lib/cms";
import { categorySlugFrom, type ArticleDoc, type CategoryDoc } from "@/lib/content-types";
import { articleUrl, categoryUrl, getSiteUrl, type Animal } from "@/lib/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const [articles, categories] = await Promise.all([
    cmsFind<ArticleDoc>("articles", { depth: 1, limit: 1000 }),
    cmsFind<CategoryDoc>("categories", { limit: 100 }),
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

  const articleUrls: MetadataRoute.Sitemap = [];
  for (const article of articles.docs) {
    if (!article.publishedAt) continue;
    const catSlug = categorySlugFrom(article.category);
    articleUrls.push({
        url: `${site}${articleUrl(article.animal, catSlug, article.slug)}`,
        lastModified: article.updatedAt ? new Date(article.updatedAt) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    });
  }

  return [...staticUrls, ...categoryUrls, ...articleUrls];
}
