import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cmsFind } from "@/lib/cms";
import {
  categoryNameFrom,
  categorySlugFrom,
  imageFrom,
  type ArticleDoc,
  type CategoryDoc,
} from "@/lib/content-types";
import { articleUrl, categoryUrl, type Animal } from "@/lib/url";

const FALLBACK_IMAGES = {
  hero: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
  health: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
  food: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=900&q=80",
  behavior: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=900&q=80",
  "daily-care": "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80",
  dog: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
  cat: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80",
} as const;

export const metadata: Metadata = {
  title: "Petster | ความรู้หมาแมวที่น่าเชื่อถือ",
  description:
    "Petster รวมบทความหมาแมวที่อ่านง่าย มีโครงสร้างชัด และเน้นข้อมูลที่ใช้ได้จริงสำหรับเจ้าของสัตว์เลี้ยง",
};

async function getHomepageData() {
  const [featured, categories, dogArticles, catArticles] = await Promise.all([
    cmsFind<ArticleDoc>("articles", {
      where: { featured: { equals: true } },
      sort: "-publishedAt",
      depth: 2,
      limit: 1,
    }),
    cmsFind<CategoryDoc>("categories", { sort: "name", limit: 4 }),
    cmsFind<ArticleDoc>("articles", {
      where: { animal: { equals: "dog" } },
      sort: "-publishedAt",
      depth: 1,
      limit: 3,
    }),
    cmsFind<ArticleDoc>("articles", {
      where: { animal: { equals: "cat" } },
      sort: "-publishedAt",
      depth: 1,
      limit: 3,
    }),
  ]);

  return {
    featured: featured.docs[0] ?? null,
    categories: categories.docs,
    dogArticles: dogArticles.docs,
    catArticles: catArticles.docs,
  };
}

export default async function HomePage() {
  const { featured, categories, dogArticles, catArticles } = await getHomepageData();

  const featuredImg = featured ? imageFrom(featured, FALLBACK_IMAGES.hero) : null;
  const featuredCat = featured ? categorySlugFrom(featured.category) : "";
  const featuredHref = featured
    ? articleUrl(featured.animal as Animal, featuredCat, featured.slug)
    : "/dogs";

  return (
    <main id="top">
      <section className="app-home shell">
        <div className="hero-copy reveal">
          <p className="eyebrow">Petster</p>
          <h1>คำตอบเรื่องหมาแมวที่อ่านง่ายทุกวัน</h1>
          <p className="hero-lead">ความรู้ที่อ้างอิงได้ เขียนให้คนเลี้ยงใช้งานจริง</p>
        </div>

        <form className="search-panel reveal" role="search">
          <label className="search-label" htmlFor="pet-search">
            ค้นหาคำถามเกี่ยวกับหมาและแมว
          </label>
          <div className="search-row">
            <input
              id="pet-search"
              name="q"
              type="search"
              placeholder="เช่น แมวไม่กินอาหาร, หมาอาเจียน"
            />
            <button type="submit">ค้นหาบทความ</button>
          </div>
          <p className="search-trust">
            <span aria-hidden="true">✓</span>
            ทุกบทความสุขภาพมีแหล่งอ้างอิงและวันที่อัปเดต
          </p>
        </form>

        <div className="search-tags reveal" aria-label="Popular searches">
          <Link href="/dogs/health">หมาอาเจียน</Link>
          <Link href="/dogs/food">อาหารสุนัข</Link>
          <Link href="/cats/health">แมวไม่กินอาหาร</Link>
          <Link href="/dogs/behavior">พฤติกรรม</Link>
          <Link href="/dogs/health">ฉีดวัคซีน</Link>
          <Link href="/cats/health">แมวอ้วก</Link>
          <Link href="/dogs/daily-care">อาบน้ำหมา</Link>
          <Link href="/cats/daily-care">กระบะทรายแมว</Link>
        </div>

        {featured && featuredImg && (
          <Link className="hero-feature reveal" href={featuredHref}>
            <figure className="hero-photo">
              <Image
                src={featuredImg.url}
                alt={featuredImg.alt || featured.title}
                fill
                sizes="(min-width: 900px) 45vw, 100vw"
              />
            </figure>
            <div className="hero-feature-copy">
              <p className="signal-label">อ่านต่อก่อน</p>
              <h2>{featured.title}</h2>
              <span className="inline-link">อ่านแนวทาง</span>
            </div>
          </Link>
        )}
      </section>

      <section id="topics" className="shell section">
        <div className="section-heading reveal">
          <p className="eyebrow">หมวดความรู้</p>
          <h2>หมวดหลัก</h2>
        </div>

        <div className="topic-grid">
          {categories.map((c) => {
            const fallback =
              (FALLBACK_IMAGES as Record<string, string>)[c.slug] || FALLBACK_IMAGES.hero;
            const img = imageFrom(c, fallback);
            return (
              <Link key={c.id} className="topic-card reveal" href={categoryUrl("dogs", c.slug)}>
                <figure className="topic-card-image">
                  <Image
                    src={img.url}
                    alt={img.alt || c.name}
                    fill
                    sizes="(min-width: 900px) 25vw, (min-width: 640px) 50vw, 100vw"
                  />
                </figure>
                <h3>{c.name}</h3>
                {c.intro && <p>{c.intro}</p>}
              </Link>
            );
          })}
        </div>
      </section>

      <section id="dogs" className="shell section split-section">
        <div className="section-heading reveal">
          <p className="eyebrow">สำหรับคนเลี้ยงสุนัข</p>
          <h2>สุนัข</h2>
        </div>

        <div className="channel-grid">
          {dogArticles.map((a) => {
            const catSlug = categorySlugFrom(a.category);
            const catName = categoryNameFrom(a.category);
            const img = imageFrom(a, FALLBACK_IMAGES.dog);
            return (
              <Link
                key={a.id}
                className="channel-card reveal"
                href={articleUrl("dog", catSlug, a.slug)}
              >
                <figure className="channel-card-image">
                  <Image
                    src={img.url}
                    alt={img.alt || a.title}
                    fill
                    sizes="(min-width: 900px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </figure>
                <h3>{a.title}</h3>
                {catName && <p>{catName}</p>}
              </Link>
            );
          })}
        </div>
      </section>

      <section id="cats" className="shell section split-section cats-tone">
        <div className="section-heading reveal">
          <p className="eyebrow">สำหรับคนเลี้ยงแมว</p>
          <h2>แมว</h2>
        </div>

        <div className="channel-grid">
          {catArticles.map((a) => {
            const catSlug = categorySlugFrom(a.category);
            const catName = categoryNameFrom(a.category);
            const img = imageFrom(a, FALLBACK_IMAGES.cat);
            return (
              <Link
                key={a.id}
                className="channel-card reveal"
                href={articleUrl("cat", catSlug, a.slug)}
              >
                <figure className="channel-card-image">
                  <Image
                    src={img.url}
                    alt={img.alt || a.title}
                    fill
                    sizes="(min-width: 900px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </figure>
                <h3>{a.title}</h3>
                {catName && <p>{catName}</p>}
              </Link>
            );
          })}
        </div>
      </section>

      <section id="trust" className="shell section trust-section">
        <div className="trust-copy reveal">
          <p className="eyebrow">หลักการคัดข้อมูล</p>
          <h2>อ้างอิงได้ ไม่แทนสัตวแพทย์</h2>
          <p>ทุกบทความสุขภาพมีแหล่งอ้างอิง วันที่อัปเดต และคำเตือนชัดเจน</p>
        </div>

        <div className="trust-points">
          <article className="trust-card reveal">
            <h3>มีแหล่งอ้างอิง</h3>
            <p>เชื่อมกลับไปยัง guideline และ source ที่ทีมใช้จริง</p>
          </article>
          <article className="trust-card reveal">
            <h3>อ่านเข้าใจง่าย</h3>
            <p>แปลภาษายากให้ใช้ได้จริง โดยไม่ลดความรับผิดชอบ</p>
          </article>
          <article className="trust-card reveal">
            <h3>ค้นต่อได้</h3>
            <p>ทุก section ชวนไปยังหมวดและบทความที่ลึกขึ้น</p>
          </article>
        </div>
      </section>
    </main>
  );
}
