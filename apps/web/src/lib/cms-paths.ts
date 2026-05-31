import { cmsFind } from "@/lib/cms";
import { animalToSlug, slugToAnimal, type AnimalSlug } from "@/lib/url";

export async function getAnimalStaticParams() {
  return [{ animal: "dogs" }, { animal: "cats" }] satisfies { animal: AnimalSlug }[];
}

export async function getCategoryStaticParams() {
  const categories = await cmsFind<any>("categories", { limit: 100 });

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
  const articles = await cmsFind<any>("articles", { depth: 1, limit: 500 });

  return articles.docs
    .map((article: any) => {
      const category =
        typeof article.category === "object" && article.category
          ? article.category.slug
          : null;
      if (!category) return null;

      return {
        animal: animalToSlug(article.animal),
        category,
        slug: article.slug,
      };
    })
    .filter((entry: any): entry is { animal: AnimalSlug; category: string; slug: string } =>
      Boolean(entry),
    );
}
