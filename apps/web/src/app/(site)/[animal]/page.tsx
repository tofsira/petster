import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cmsFind } from "@/lib/cms";
import { getAnimalStaticParams } from "@/lib/cms-paths";
import {
  categoryNameFrom,
  categorySlugFrom,
  imageFrom,
  type ArticleDoc,
  type CategoryDoc,
} from "@/lib/content-types";
import { slugToAnimal, animalLabel, categoryUrl, articleUrl } from "@/lib/url";

type Params = Promise<{ animal: string }>;

export const dynamic = "force-static";

async function getAnimalData(animalSlug: string) {
  const animal = slugToAnimal(animalSlug);
  if (!animal) return null;

  const [categories, latest] = await Promise.all([
    cmsFind<CategoryDoc>("categories", {
      where: { or: [{ animal: { equals: animal } }, { animal: { equals: "both" } }] },
      sort: "name",
      limit: 12,
    }),
    cmsFind<ArticleDoc>("articles", {
      where: { animal: { equals: animal } },
      sort: "-publishedAt",
      depth: 1,
      limit: 9,
    }),
  ]);

  return { animal, categories: categories.docs, articles: latest.docs };
}

export async function generateStaticParams() {
  return getAnimalStaticParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { animal } = await params;
  const a = slugToAnimal(animal);
  if (!a) return { title: "ไม่พบ | Petster" };
  return {
    title: animalLabel(a),
    description: `รวมความรู้เรื่อง${animalLabel(a)} ครบทุกหมวด — สุขภาพ อาหาร พฤติกรรม และการดูแลประจำวัน`,
  };
}

export default async function AnimalHubPage({ params }: { params: Params }) {
  const { animal: animalSlug } = await params;
  const data = await getAnimalData(animalSlug);
  if (!data) notFound();

  const { animal, categories, articles } = data;

  return (
    <main className="shell animal-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">หน้าแรก</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{animalLabel(animal)}</span>
      </nav>

      <header className="animal-head">
        <div>
          <h1>{animalLabel(animal)}</h1>
        </div>
        <p>
          รวมบทความสำหรับคนเลี้ยง{animalLabel(animal)} ตั้งแต่สุขภาพ อาหาร พฤติกรรม ไปจนถึงการดูแลประจำวัน
        </p>
      </header>

      {categories.length > 0 && (
        <section id="topics" className="animal-card-section">
          <div className="animal-card-grid" aria-label={`หมวดความรู้${animalLabel(animal)}`}>
            {categories.map((category) => {
              const img = imageFrom(category, undefined, "squareCard");
              return (
                <Link key={category.id} className="animal-topic-card" href={categoryUrl(animal, category.slug)}>
                  {img && (
                    <Image
                      src={img.url}
                      alt={img.alt || category.name}
                      fill
                      sizes="(min-width: 720px) 25vw, 50vw"
                    />
                  )}
                  <span className="animal-topic-overlay">
                    <span className="animal-topic-name">{category.name}</span>
                    <span className="animal-topic-arrow" aria-hidden="true">→</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="animal-section">
          <h2 className="section-label">บทความล่าสุด</h2>

          <div className="animal-article-list">
            {articles.map((article) => (
              <AnimalArticleLink key={article.id} article={article} animal={animal} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function AnimalArticleLink({ article, animal }: { article: ArticleDoc; animal: "dog" | "cat" }) {
  const hero = imageFrom(article, undefined, "squareSmall");
  const catSlug = categorySlugFrom(article.category);
  const catName = categoryNameFrom(article.category);

  return (
    <Link className="animal-article-link" href={articleUrl(animal, catSlug, article.slug)}>
      {hero && (
        <figure className="animal-article-image">
          <Image
            src={hero.url}
            alt={hero.alt || article.title}
            fill
            sizes="(min-width: 760px) 132px, 96px"
          />
        </figure>
      )}
      <div className="animal-article-copy">
        {catName && <p className="animal-article-tag">{catName}</p>}
        <h3>{article.title}</h3>
        {article.excerpt && <span>{article.excerpt}</span>}
        {article.readingTimeMinutes && (
          <p className="animal-article-meta">อ่าน {article.readingTimeMinutes} นาที</p>
        )}
      </div>
    </Link>
  );
}
