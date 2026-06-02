export type Animal = "dog" | "cat";
export type AnimalSlug = "dogs" | "cats";

const ANIMAL_TO_SLUG: Record<Animal, AnimalSlug> = { dog: "dogs", cat: "cats" };
const SLUG_TO_ANIMAL: Record<AnimalSlug, Animal> = { dogs: "dog", cats: "cat" };

export const animalToSlug = (animal: Animal): AnimalSlug => ANIMAL_TO_SLUG[animal];

export const slugToAnimal = (slug: string): Animal | null =>
  slug in SLUG_TO_ANIMAL ? SLUG_TO_ANIMAL[slug as AnimalSlug] : null;

export const articleUrl = (animal: Animal, categorySlug: string, slug: string) =>
  `/${animalToSlug(animal)}/${categorySlug}/${slug}`;

export const categoryUrl = (animal: Animal | AnimalSlug, categorySlug: string) => {
  const animalSlug = animal === "dog" || animal === "cat" ? animalToSlug(animal) : animal;
  return `/${animalSlug}/${categorySlug}`;
};

export const animalUrl = (animal: Animal): `/${AnimalSlug}` => `/${animalToSlug(animal)}`;

export const animalLabel = (animal: Animal): string => (animal === "dog" ? "สุนัข" : "แมว");

export const getSiteUrl = (): string =>
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
