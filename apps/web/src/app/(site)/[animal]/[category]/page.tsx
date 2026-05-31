import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cmsFind } from "@/lib/cms";
import { getCategoryStaticParams } from "@/lib/cms-paths";
import { slugToAnimal, animalLabel, articleUrl, animalToSlug } from "@/lib/url";

type Params = Promise<{ animal: string; category: string }>;

export const dynamic = "force-static";

async function getCategoryData(animalSlug: string, categorySlug: string) {
  const animal = slugToAnimal(animalSlug);
  if (!animal) return null;

  const catRes = await cmsFind<any>("categories", {
    where: {
      and: [
        { slug: { equals: categorySlug } },
        { or: [{ animal: { equals: animal } }, { animal: { equals: "both" } }] },
      ],
    },
    limit: 1,
  });
  const category = catRes.docs[0];
  if (!category) return null;

  const articles = await cmsFind<any>("articles", {
    where: {
      and: [
        { animal: { equals: animal } },
        { "category.slug": { equals: categorySlug } },
      ],
    },
    sort: "-publishedAt",
    depth: 1,
    limit: 24,
  });

  return { animal, category, articles: articles.docs };
}

export async function generateStaticParams() {
  return getCategoryStaticParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { animal, category } = await params;
  const data = await getCategoryData(animal, category);
  if (!data) return { title: "ไม่พบหมวด | Petster" };

  return {
    title: `${data.category.name} ${animalLabel(data.animal)} | Petster`,
    description: data.category.intro || undefined,
  };
}

export default async function CategoryHubPage({ params }: { params: Params }) {
  const { animal: animalSlug, category: categorySlug } = await params;
  const data = await getCategoryData(animalSlug, categorySlug);
  if (!data) notFound();

  const { animal, category, articles } = data;

  return (
    <main className="shell section">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href={`/${animalToSlug(animal)}`}>{animalLabel(animal)}</a>
      </nav>

      <header className="section-heading">
        <p className="eyebrow">{animalLabel(animal)}</p>
        <h1>{category.name}</h1>
        {category.intro && <p className="hero-lead">{category.intro}</p>}
      </header>

      {articles.length === 0 ? (
        <p>ยังไม่มีบทความในหมวดนี้</p>
      ) : (
        <div className="topic-grid">
          {articles.map((article) => {
            const upload = article.heroImage as { url?: string; alt?: string } | null;
            const heroUrl =
              (upload && typeof upload === "object" && upload.url) ||
              (article.heroImageUrl as string | undefined);
            const heroAlt =
              (upload && typeof upload === "object" && upload.alt) || article.title;

            return (
              <a
                key={article.id}
                className="topic-card"
                href={articleUrl(animal, categorySlug, article.slug)}
              >
                {heroUrl && (
                  <figure className="topic-card-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={heroUrl} alt={heroAlt || ""} />
                  </figure>
                )}
                <h3>{article.title}</h3>
                {article.excerpt && <p>{article.excerpt}</p>}
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}
