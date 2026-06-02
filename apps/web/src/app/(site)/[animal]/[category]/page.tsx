import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cmsFind } from "@/lib/cms";
import { getCategoryStaticParams } from "@/lib/cms-paths";
import { imageFrom, type ArticleDoc, type CategoryDoc } from "@/lib/content-types";
import { slugToAnimal, animalLabel, articleUrl, animalToSlug, type Animal } from "@/lib/url";
import { ConnectionNotice } from "@/components/connection-notice";

type Params = Promise<{ animal: string; category: string }>;

export const dynamic = "force-static";

type CategoryData =
  | { status: "ok"; animal: Animal; category: CategoryDoc; articles: ArticleDoc[] }
  | { status: "not-found" }
  | { status: "error" };

async function getCategoryData(animalSlug: string, categorySlug: string): Promise<CategoryData> {
  const animal = slugToAnimal(animalSlug);
  if (!animal) return { status: "not-found" };

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
  if (!category) return catRes.ok ? { status: "not-found" } : { status: "error" };

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

  return { status: "ok", animal, category, articles: articles.docs };
}

export async function generateStaticParams() {
  return getCategoryStaticParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { animal, category } = await params;
  const data = await getCategoryData(animal, category);
  if (data.status !== "ok") {
    return { title: data.status === "error" ? "Petster" : "ไม่พบหมวด" };
  }

  return {
    title: `${data.category.name} ${animalLabel(data.animal)}`,
    description: data.category.intro || undefined,
  };
}

export default async function CategoryHubPage({ params }: { params: Params }) {
  const { animal: animalSlug, category: categorySlug } = await params;
  const data = await getCategoryData(animalSlug, categorySlug);
  if (data.status === "not-found") notFound();
  if (data.status === "error") {
    return (
      <main className="shell category-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">หน้าแรก</Link>
        </nav>
        <ConnectionNotice />
      </main>
    );
  }

  const { animal, category, articles } = data;
  const [featuredArticle, ...latestArticles] = articles;

  return (
    <main className="shell category-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">หน้าแรก</Link>
        <span aria-hidden="true">›</span>
        <Link href={`/${animalToSlug(animal)}`}>{animalLabel(animal)}</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{category.name}</span>
      </nav>

      <header className="category-head">
        <div>
          <p className="eyebrow">{animalLabel(animal)}</p>
          <h1>{category.name}</h1>
        </div>
        {category.intro && <p className="category-lead">{category.intro}</p>}
      </header>

      {articles.length === 0 ? (
        <p className="empty-note">ยังไม่มีบทความในหมวดนี้</p>
      ) : (
        <section className="category-content-grid">
          <div>
            {featuredArticle && (
              <section className="category-section">
                <h2 className="section-label">บทความแนะนำ</h2>
                <CategoryArticleLink
                  article={featuredArticle}
                  animal={animal}
                  categorySlug={categorySlug}
                  variant="featured"
                />
              </section>
            )}

            {latestArticles.length > 0 && (
              <section className="category-section">
                <h2 className="section-label">บทความล่าสุด</h2>
                <div className="category-list">
                  {latestArticles.map((article) => (
                    <CategoryArticleLink
                      key={article.id}
                      article={article}
                      animal={animal}
                      categorySlug={categorySlug}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="category-paths" aria-label="ช่วยเลือกเรื่องที่ควรอ่าน">
            <h2 className="section-label">เริ่มจากสิ่งที่เห็น</h2>
            <div className="category-path-note">
              ถ้าอาการรุนแรง ซึมมาก หายใจลำบาก หรือมีเลือดปน ควรติดต่อสัตวแพทย์ทันที ก่อนอ่านต่อ
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}

function CategoryArticleLink({
  article,
  animal,
  categorySlug,
  variant = "list",
}: {
  article: ArticleDoc;
  animal: "dog" | "cat";
  categorySlug: string;
  variant?: "featured" | "list";
}) {
  const hero = imageFrom(article, undefined, variant === "featured" ? "squareCard" : "squareSmall");
  const readingTime = article.readingTimeMinutes ? `อ่าน ${article.readingTimeMinutes} นาที` : null;

  return (
    <Link
      className={variant === "featured" ? "category-featured-link" : "category-article-link"}
      href={articleUrl(animal, categorySlug, article.slug)}
    >
      {hero && (
        <figure className={variant === "featured" ? "category-featured-image" : "category-list-image"}>
          <Image
            src={hero.url}
            alt={hero.alt || article.title}
            fill
            sizes={variant === "featured" ? "(min-width: 760px) 180px, 132px" : "(min-width: 760px) 132px, 96px"}
          />
        </figure>
      )}
      <div className="category-article-copy">
        {readingTime && <p>{readingTime}</p>}
        {variant === "featured" ? <h2>{article.title}</h2> : <h3>{article.title}</h3>}
        {article.excerpt && <span>{article.excerpt}</span>}
      </div>
    </Link>
  );
}
