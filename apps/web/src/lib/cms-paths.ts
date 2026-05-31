import { cmsFind } from "@/lib/cms";
import type { ArticleDoc, CategoryDoc } from "@/lib/content-types";
import { animalToSlug, slugToAnimal, type AnimalSlug } from "@/lib/url";

export async function getAnimalStaticParams() {
  return [{ animal: "dogs" }, { animal: "cats" }] satisfies { animal: AnimalSlug }[];
}

export async function getCategoryStaticParams() {
  const categories = await cmsFind<CategoryDoc>("categories", { limit: 100 });

  const params: { animal: AnimalSlug; category: string }[] = [];
  for (const animalSlug of ["dogs", "cats"] as const) {
    const animal = slugToAnimal(animalSlug);
    if (!animal) continue;

    for (const category of categories.docs) {
      if (category.animal === animal || category.animal === "both") {
        params.push({ animal: animalSlug, category: category.slug });
      }
    }
  }

  return params;
}

export async function getArticleStaticParams() {
  const articles = await cmsFind<ArticleDoc>("articles", { depth: 1, limit: 500 });

  const params: { animal: AnimalSlug; category: string; slug: string }[] = [];
  for (const article of articles.docs) {
      const category =
        typeof article.category === "object" && article.category
          ? article.category.slug
          : null;
      if (!category) continue;

      params.push({
        animal: animalToSlug(article.animal),
        category,
        slug: article.slug,
      });
  }

  return params;
}
