import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cmsFind } from "@/lib/cms";
import { getCategoryStaticParams } from "@/lib/cms-paths";
import { imageFrom, type ArticleDoc, type CategoryDoc } from "@/lib/content-types";
import { slugToAnimal, animalLabel, articleUrl, animalToSlug, categoryUrl } from "@/lib/url";

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
  const [featuredArticle, ...latestArticles] = articles;

  return (
    <main className="shell category-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href={`/${animalToSlug(animal)}`}>{animalLabel(animal)}</Link>
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
                <div className="section-heading">
                  <p className="eyebrow">อ่านก่อน</p>
                  <h2>บทความแนะนำ</h2>
                </div>

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
                <div className="section-heading">
                  <p className="eyebrow">Latest</p>
                  <h2>บทความล่าสุด</h2>
                </div>

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
            <header className="section-heading">
              <h2>เริ่มจากสิ่งที่เห็น</h2>
            </header>
            <div className="category-path-note">
              ถ้าอาการรุนแรง ซึมมาก หายใจลำบาก หรือมีเลือดปน ควรติดต่อสัตวแพทย์ทันที ก่อนอ่านต่อ
            </div>
            <Link className="category-path" href={categoryUrl(animal, categorySlug)}>
              <span>กินน้อยหรือไม่กิน<small>แยกความเครียด เบื่ออาหาร และสัญญาณป่วย</small></span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="category-path" href={categoryUrl(animal, categorySlug)}>
              <span>อาเจียนหรือถ่ายเหลว<small>ดูความถี่ อาการร่วม และเวลาที่ควรไปคลินิก</small></span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="category-path" href={categoryUrl(animal, categorySlug)}>
              <span>คัน เกา หรือขนร่วง<small>เริ่มจากผิวหนัง เห็บหมัด แพ้อาหาร และการอาบน้ำ</small></span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="category-path" href={categoryUrl(animal, categorySlug)}>
              <span>ดูแลสุนัขสูงวัย<small>เช็กน้ำหนัก ข้อ ฟัน และพฤติกรรมที่เปลี่ยนไป</small></span>
              <span aria-hidden="true">→</span>
            </Link>
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
        <p>{variant === "featured" ? "อ่าน 4 นาที" : "บทความ"}</p>
        {variant === "featured" ? <h2>{article.title}</h2> : <h3>{article.title}</h3>}
        {article.excerpt && <span>{article.excerpt}</span>}
      </div>
    </Link>
  );
}
