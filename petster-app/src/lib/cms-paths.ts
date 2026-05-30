import { getPayloadClient } from "@/lib/payload";
import { animalToSlug, slugToAnimal, type AnimalSlug } from "@/lib/url";

export async function getAnimalStaticParams() {
  return [{ animal: "dogs" }, { animal: "cats" }] satisfies { animal: AnimalSlug }[];
}

export async function getCategoryStaticParams() {
  const payload = await getPayloadClient();
  const categories = await payload.find({
    collection: "categories",
    limit: 100,
  });

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
  const payload = await getPayloadClient();
  const articles = await payload.find({
    collection: "articles",
    depth: 1,
    limit: 500,
  });

  return articles.docs
    .map((article) => {
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
    .filter((entry): entry is { animal: AnimalSlug; category: string; slug: string } =>
      Boolean(entry),
    );
}
