import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cmsFind } from "@/lib/cms";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { defaultJSXConverters } from "@payloadcms/richtext-lexical/react";
import { getArticleStaticParams } from "@/lib/cms-paths";
import {
  slugToAnimal,
  animalLabel,
  animalToSlug,
  articleUrl,
  type Animal,
} from "@/lib/url";

type Params = Promise<{ animal: string; category: string; slug: string }>;

export const dynamic = "force-static";

const CALLOUT_LABELS = { tip: "💡 เคล็ดลับ", warning: "⚠️ คำเตือน", info: "ℹ️ ข้อมูล" } as const;

const bodyConverters = ({ defaultConverters }: { defaultConverters: typeof defaultJSXConverters }) => ({
  ...defaultConverters,
  blocks: {
    callout: ({ node }: { node: any }) => {
      const { type, message } = node.fields as { type: "tip" | "warning" | "info"; message: string };
      return (
        <div className={`block-callout block-callout-${type}`}>
          <span className="block-callout-label">{CALLOUT_LABELS[type]}</span>
          {message}
        </div>
      );
    },
    imageBlock: ({ node }: { node: any }) => {
      const { image, caption } = node.fields as {
        image: { url: string; alt?: string };
        caption?: string;
      };
      if (!image?.url) return null;
      return (
        <div className="block-image">
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.alt || caption || ""} />
          </figure>
          {caption && <figcaption>{caption}</figcaption>}
        </div>
      );
    },
  },
});

async function getArticle(animalSlug: string, categorySlug: string, slug: string) {
  const animal = slugToAnimal(animalSlug);
  if (!animal) return null;

  const res = await cmsFind<any>("articles", {
    where: {
      and: [
        { slug: { equals: slug } },
        { animal: { equals: animal } },
        { "category.slug": { equals: categorySlug } },
      ],
    },
    depth: 2,
    limit: 1,
  });

  return res.docs[0] ?? null;
}

async function getRelated(animal: Animal, categorySlug: string, excludeSlug: string) {
  const res = await cmsFind<any>("articles", {
    where: {
      and: [
        { animal: { equals: animal } },
        { "category.slug": { equals: categorySlug } },
        { slug: { not_equals: excludeSlug } },
      ],
    },
    sort: "-publishedAt",
    depth: 1,
    limit: 3,
  });
  return res.docs;
}

function imgFrom(article: Record<string, unknown>) {
  const upload = article.heroImage as { url?: string; alt?: string } | null;
  if (upload && typeof upload === "object" && upload.url) {
    return { url: upload.url, alt: upload.alt || "" };
  }
  const url = article.heroImageUrl as string | undefined;
  return url ? { url, alt: "" } : null;
}

export async function generateStaticParams() {
  return getArticleStaticParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { animal, category, slug } = await params;
  const article = await getArticle(animal, category, slug);
  if (!article) return { title: "ไม่พบบทความ" };

  const seo = article.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return {
    title: seo?.metaTitle || article.title,
    description: seo?.metaDescription || article.excerpt || undefined,
  };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { animal: animalSlug, category, slug } = await params;
  const article = await getArticle(animalSlug, category, slug);
  if (!article) notFound();

  const animal = slugToAnimal(animalSlug)!;
  const categoryObj = article.category as { name: string; slug: string } | string;
  const categoryName = typeof categoryObj === "string" ? category : categoryObj.name;
  const hero = imgFrom(article as any);
  const related = await getRelated(animal, category, slug);

  const published = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <article className="shell article-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="/">หน้าแรก</a>
        <span aria-hidden="true">›</span>
        <a href={`/${animalToSlug(animal)}`}>{animalLabel(animal)}</a>
        <span aria-hidden="true">›</span>
        <a href={`/${animalToSlug(animal)}/${category}`}>{categoryName}</a>
      </nav>

      <header className="article-head">
        <p className="article-tag">
          {animalLabel(animal)} / {categoryName}
        </p>
        <h1 className="article-title">{article.title}</h1>
        {article.excerpt && <p className="article-lead">{article.excerpt}</p>}
        {published && <p className="article-meta">เผยแพร่ {published}</p>}
      </header>

      {hero && (
        <figure className="article-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={hero.url} alt={hero.alt || article.title} />
        </figure>
      )}

      <div className="article-body">
        <p className="article-disclaimer">
          <strong>หมายเหตุ:</strong> ข้อมูลในบทความเป็นข้อมูลทั่วไป
          ไม่ได้แทนการวินิจฉัยจากสัตวแพทย์
        </p>

        {article.body && (
          <RichText data={article.body} converters={bodyConverters} />
        )}

        {Array.isArray(article.sources) && article.sources.length > 0 && (
          <section className="article-sources">
            <h2>แหล่งอ้างอิง</h2>
            <ul>
              {article.sources.map((s: { label: string; url?: string }, i: number) => (
                <li key={i}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  ) : (
                    s.label
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {Array.isArray(article.faq) && article.faq.length > 0 && (
          <section className="article-faq">
            <h2>คำถามที่พบบ่อย</h2>
            <dl>
              {article.faq.map((q: { question: string; answer: string }, i: number) => (
                <div key={i} className="faq-item">
                  <dt>{q.question}</dt>
                  <dd>{q.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <section className="article-related">
          <h2>อ่านต่อในหมวด {categoryName}</h2>
          <div className="channel-grid">
            {related.map((a) => {
              const img = imgFrom(a as any);
              return (
                <a
                  key={a.id}
                  className="channel-card"
                  href={articleUrl(animal, category, a.slug)}
                >
                  {img && (
                    <figure className="channel-card-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt={img.alt || a.title} />
                    </figure>
                  )}
                  <h3>{a.title}</h3>
                  {a.excerpt && <p>{a.excerpt}</p>}
                </a>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
