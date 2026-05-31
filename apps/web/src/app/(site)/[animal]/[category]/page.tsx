import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cmsFind } from "@/lib/cms";
import { getCategoryStaticParams } from "@/lib/cms-paths";
import { imageFrom, type ArticleDoc, type CategoryDoc } from "@/lib/content-types";
import { slugToAnimal, animalLabel, articleUrl, animalToSlug } from "@/lib/url";

type Params = Promise<{ animal: string; category: string }>;

export const dynamic = "force-static";

async function getCategoryData(animalSlug: string, categorySlug: string) {
  const animal = slugToAnimal(animalSlug);
  if (!animal) return null;

  const catRes = await cmsFind<CategoryDoc>("categories", {
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

  const articles = await cmsFind<ArticleDoc>("articles", {
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
        <Link href={`/${animalToSlug(animal)}`}>{animalLabel(animal)}</Link>
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
            const hero = imageFrom(article);

            return (
              <Link
                key={article.id}
                className="topic-card"
                href={articleUrl(animal, categorySlug, article.slug)}
              >
                {hero && (
                  <figure className="topic-card-image">
                    <Image
                      src={hero.url}
                      alt={hero.alt || article.title}
                      fill
                      sizes="(min-width: 900px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </figure>
                )}
                <h3>{article.title}</h3>
                {article.excerpt && <p>{article.excerpt}</p>}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
