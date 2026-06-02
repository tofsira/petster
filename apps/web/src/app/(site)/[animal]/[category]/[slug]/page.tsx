import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cmsFind } from "@/lib/cms";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { defaultJSXConverters } from "@payloadcms/richtext-lexical/react";
import { getArticleStaticParams } from "@/lib/cms-paths";
import {
  categoryNameFrom,
  imageFrom,
  type ArticleDoc,
  type MediaDoc,
} from "@/lib/content-types";
import {
  slugToAnimal,
  animalLabel,
  animalToSlug,
  articleUrl,
  type Animal,
} from "@/lib/url";
import { ConnectionNotice } from "@/components/connection-notice";

type Params = Promise<{ animal: string; category: string; slug: string }>;
type SearchParams = Promise<{ draft?: string; token?: string }>;

export const dynamic = "force-static";

const CALLOUT_LABELS = { tip: "เคล็ดลับ", warning: "คำเตือน", info: "ข้อมูล" } as const;

type BlockNode = {
  fields?: unknown;
};

const bodyConverters = ({ defaultConverters }: { defaultConverters: typeof defaultJSXConverters }) => ({
  ...defaultConverters,
  blocks: {
    callout: ({ node }: { node: BlockNode }) => {
      const { type, message } = node.fields as { type: "tip" | "warning" | "info"; message: string };
      return (
        <div className={`block-callout block-callout-${type}`}>
          <span className="block-callout-label">{CALLOUT_LABELS[type]}</span>
          {message}
        </div>
      );
    },
    imageBlock: ({ node }: { node: BlockNode }) => {
      const { image, caption } = node.fields as {
        image: MediaDoc;
        caption?: string;
      };
      if (!image?.url) return null;
      return (
        <div className="block-image">
          <figure>
            <Image
              src={image.url}
              alt={image.alt || caption || ""}
              fill
              sizes="(min-width: 900px) 680px, 100vw"
            />
          </figure>
          {caption && <figcaption>{caption}</figcaption>}
        </div>
      );
    },
    keyTakeaways: ({ node }: { node: BlockNode }) => {
      const { heading, items } = node.fields as {
        heading?: string;
        items?: { text?: string }[];
      };
      if (!items?.length) return null;
      return (
        <section className="block-panel block-key-takeaways">
          <h2>{heading || "สรุปสั้น ๆ"}</h2>
          <ul>
            {items.map((item, index) => (
              <li key={`${item.text || "takeaway"}-${index}`}>{item.text}</li>
            ))}
          </ul>
        </section>
      );
    },
    redFlags: ({ node }: { node: BlockNode }) => {
      const { heading, items } = node.fields as {
        heading?: string;
        items?: { text?: string }[];
      };
      if (!items?.length) return null;
      return (
        <section className="block-panel block-red-flags">
          <h2>{heading || "สัญญาณที่ควรระวัง"}</h2>
          <ul>
            {items.map((item, index) => (
              <li key={`${item.text || "red-flag"}-${index}`}>{item.text}</li>
            ))}
          </ul>
        </section>
      );
    },
    whenToSeeVet: ({ node }: { node: BlockNode }) => {
      const { urgency, message } = node.fields as {
        urgency?: "soon" | "urgent" | "watch";
        message?: string;
      };
      if (!message) return null;
      const label =
        urgency === "urgent" ? "ควรพบสัตวแพทย์ทันที" : urgency === "watch" ? "เฝ้าดูอาการ" : "ควรนัดตรวจ";
      return (
        <section className={`block-panel block-vet block-vet-${urgency || "soon"}`}>
          <p>{label}</p>
          <h2>เมื่อไรควรพบสัตวแพทย์</h2>
          <div>{message}</div>
        </section>
      );
    },
    stepList: ({ node }: { node: BlockNode }) => {
      const { heading, steps } = node.fields as {
        heading?: string;
        steps?: { detail?: string; title?: string }[];
      };
      if (!steps?.length) return null;
      return (
        <section className="block-steps">
          {heading && <h2>{heading}</h2>}
          <ol>
            {steps.map((step, index) => (
              <li key={`${step.title || "step"}-${index}`}>
                <h3>{step.title}</h3>
                {step.detail && <p>{step.detail}</p>}
              </li>
            ))}
          </ol>
        </section>
      );
    },
    comparisonTable: ({ node }: { node: BlockNode }) => {
      const { heading, leftLabel, rightLabel, rows } = node.fields as {
        heading?: string;
        leftLabel?: string;
        rightLabel?: string;
        rows?: { left?: string; right?: string; topic?: string }[];
      };
      if (!leftLabel || !rightLabel || !rows?.length) return null;
      return (
        <section className="block-comparison">
          {heading && <h2>{heading}</h2>}
          <div>
            <table>
              <thead>
                <tr>
                  <th>เรื่อง</th>
                  <th>{leftLabel}</th>
                  <th>{rightLabel}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={`${row.topic || "row"}-${index}`}>
                    <th scope="row">{row.topic}</th>
                    <td>{row.left}</td>
                    <td>{row.right}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    },
  },
});

async function getArticle(
  animalSlug: string,
  categorySlug: string,
  slug: string,
  preview?: { draft?: boolean; token?: string },
): Promise<{ article: ArticleDoc | null; ok: boolean }> {
  const animal = slugToAnimal(animalSlug);
  if (!animal) return { article: null, ok: true };

  const res = await cmsFind<ArticleDoc>("articles", {
    where: {
      and: [
        { slug: { equals: slug } },
        { animal: { equals: animal } },
        { "category.slug": { equals: categorySlug } },
      ],
    },
    depth: 2,
    draft: preview?.draft,
    limit: 1,
    token: preview?.token,
  });

  return { article: res.docs[0] ?? null, ok: res.ok };
}

async function getRelated(animal: Animal, categorySlug: string, excludeSlug: string) {
  const res = await cmsFind<ArticleDoc>("articles", {
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

export async function generateStaticParams() {
  return getArticleStaticParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { animal, category, slug } = await params;
  const { article } = await getArticle(animal, category, slug);
  if (!article) return { title: "ไม่พบบทความ" };

  const seo = article.seo as { metaTitle?: string; metaDescription?: string } | undefined;
  return {
    title: seo?.metaTitle || article.title,
    description: seo?.metaDescription || article.excerpt || undefined,
  };
}

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}) {
  const { animal: animalSlug, category, slug } = await params;
  const previewParams = await searchParams;
  const isDraftPreview = previewParams?.draft === "true";
  const { article, ok } = await getArticle(animalSlug, category, slug, {
    draft: isDraftPreview,
    token: previewParams?.token,
  });
  if (!ok) {
    return (
      <main className="shell article-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">หน้าแรก</Link>
        </nav>
        <ConnectionNotice />
      </main>
    );
  }
  if (!article) notFound();

  const animal = slugToAnimal(animalSlug)!;
  const categoryName = categoryNameFrom(article.category) || category;
  const hero = imageFrom(article, undefined, "squareHero");
  const related = await getRelated(animal, category, slug);
  const hasSources = Array.isArray(article.sources) && article.sources.length > 0;
  const hasFaq = Array.isArray(article.faq) && article.faq.length > 0;

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
        <Link href="/">หน้าแรก</Link>
        <span aria-hidden="true">›</span>
        <Link href={`/${animalToSlug(animal)}`}>{animalLabel(animal)}</Link>
        <span aria-hidden="true">›</span>
        <Link href={`/${animalToSlug(animal)}/${category}`}>{categoryName}</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{article.title}</span>
      </nav>

      <header className="article-head">
        <p className="article-tag">
          {animalLabel(animal)} / {categoryName}
        </p>
        <h1 className="article-title">{article.title}</h1>
        {article.excerpt && <p className="article-lead">{article.excerpt}</p>}
        <div className="article-meta-row">
          {published && <span>เผยแพร่ {published}</span>}
          <span>อ่าน {article.readingTimeMinutes || 1} นาที</span>
          {hasSources && <a href="#references">มีแหล่งอ้างอิง</a>}
        </div>
      </header>

      {hero && (
        <figure className="article-hero">
          <Image
            src={hero.url}
            alt={hero.alt || article.title}
            fill
            sizes="(min-width: 800px) 760px, 100vw"
            priority
          />
        </figure>
      )}

      <div className="article-body">
        <p className="article-disclaimer">
          <strong>หมายเหตุ:</strong> ข้อมูลในบทความเป็นข้อมูลทั่วไป ไม่ได้แทนการวินิจฉัยจากสัตวแพทย์ หากอาการรุนแรงหรือไม่แน่ใจ ควรพาไปตรวจ
        </p>

        {article.body && <RichText data={article.body} converters={bodyConverters} />}

        {hasSources && (
          <section id="references" className="article-sources">
            <h2>แหล่งอ้างอิง</h2>
            <ul>
              {article.sources!.map((s) => (
                <li key={s.id || s.url || s.label}>
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

        {hasFaq && (
          <section id="faq" className="article-faq">
            <h2>คำถามที่พบบ่อย</h2>
            <dl>
              {article.faq!.map((q) => (
                <div key={q.id || q.question} className="faq-item">
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
          <div className="article-related-list">
            {related.map((a) => {
              const img = imageFrom(a, undefined, "squareSmall");
              return (
                <Link
                  key={a.id}
                  className="article-related-link"
                  href={articleUrl(animal, category, a.slug)}
                >
                  {img && (
                    <figure className="article-related-image">
                      <Image
                        src={img.url}
                        alt={img.alt || a.title}
                        fill
                        sizes="(min-width: 900px) 18vw, 50vw"
                      />
                    </figure>
                  )}
                  <div>
                    <p>{categoryName}</p>
                    <h3>{a.title}</h3>
                    {a.excerpt && <p>{a.excerpt}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
