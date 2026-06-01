import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { cmsFind } from "@/lib/cms";
import {
  categoryNameFrom,
  categorySlugFrom,
  imageFrom,
  type ArticleDoc,
} from "@/lib/content-types";
import { animalUrl, articleUrl, categoryUrl, type Animal } from "@/lib/url";

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
  const [featured, dogArticles, catArticles] = await Promise.all([
    cmsFind<ArticleDoc>("articles", {
      where: { featured: { equals: true } },
      sort: "-publishedAt",
      depth: 2,
      limit: 1,
    }),
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
    dogArticles: dogArticles.docs,
    catArticles: catArticles.docs,
  };
}

function ArticleListItem({
  article,
  fallback,
}: {
  article: ArticleDoc;
  fallback: string;
}) {
  const animal = article.animal as Animal;
  const catSlug = categorySlugFrom(article.category);
  const catName = categoryNameFrom(article.category);
  const img = imageFrom(article, fallback, "squareSmall");

  return (
    <Link className="pet-list-link reveal" href={articleUrl(animal, catSlug, article.slug)}>
      <figure className="pet-list-image">
        <Image
          src={img.url}
          alt={img.alt || article.title}
          fill
          sizes="(min-width: 980px) 104px, 84px"
        />
      </figure>
      <div className="pet-list-copy">
        <h3>{article.title}</h3>
        {catName && <p>{catName}</p>}
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const { featured, dogArticles, catArticles } = await getHomepageData();

  const featuredImg = featured ? imageFrom(featured, FALLBACK_IMAGES.hero, "squareHero") : null;
  const featuredCat = featured ? categorySlugFrom(featured.category) : "";
  const featuredHref = featured
    ? articleUrl(featured.animal as Animal, featuredCat, featured.slug)
    : "/dogs";

  return (
    <main id="top">
      <section className="app-home shell">
        <div className="hero-copy reveal">
          <p className="eyebrow">Petster</p>
          <h1>คำตอบเรื่องหมาแมว ที่หาเจอไว</h1>
          <p className="hero-lead">
            เว็บความรู้สัตว์เลี้ยงภาษาไทยสำหรับเจ้าของหมาแมว อ่านง่าย อ้างอิงได้ และไม่ทำให้เรื่องสุขภาพดูเบาเกินจริง
          </p>
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
        </form>

        <div id="topics" className="hero-paths reveal" aria-label="ทางลัด">
          <Link href={animalUrl("dog")}>ดูแลสุนัข</Link>
          <Link href={animalUrl("cat")}>ดูแลแมว</Link>
          <Link href={categoryUrl("dogs", "health")}>สุขภาพ</Link>
          <Link href={categoryUrl("dogs", "food")}>อาหาร</Link>
          <Link href={categoryUrl("dogs", "behavior")}>พฤติกรรม</Link>
          <Link href={categoryUrl("dogs", "daily-care")}>ดูแลประจำวัน</Link>
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

      <section id="questions" className="shell section">
        <div className="section-heading reveal">
          <p className="eyebrow">เริ่มจากปัญหาที่เจอบ่อย</p>
          <h2>คำถามยอดนิยม</h2>
        </div>

        <div className="question-list">
          <Link className="question-link reveal" href={categoryUrl("dogs", "health")}>
            <h3>หมาอาเจียน ต้องกังวลแค่ไหน</h3>
            <p>สุขภาพสุนัข</p>
          </Link>
          <Link className="question-link reveal" href={categoryUrl("cats", "health")}>
            <h3>แมวไม่กินอาหาร เกิดจากอะไร</h3>
            <p>สุขภาพแมว</p>
          </Link>
          <Link className="question-link reveal" href={categoryUrl("dogs", "daily-care")}>
            <h3>อาบน้ำหมาบ่อยแค่ไหนดี</h3>
            <p>ดูแลประจำวัน</p>
          </Link>
          <Link className="question-link reveal" href={categoryUrl("cats", "behavior")}>
            <h3>แมวข่วนเฟอร์นิเจอร์ แก้ยังไง</h3>
            <p>พฤติกรรม</p>
          </Link>
        </div>
      </section>

      <section id="dogs" className="shell section pet-columns-section">
        <div className="section-heading reveal">
          <p className="eyebrow">อ่านตามสัตว์เลี้ยง</p>
          <h2>สุนัขและแมว</h2>
        </div>

        <div className="pet-columns">
          <section className="pet-column" aria-labelledby="home-dogs">
            <div className="pet-column-head reveal">
              <h3 id="home-dogs">สุนัข</h3>
              <Link href={animalUrl("dog")}>ดูสุนัข</Link>
            </div>
            <div className="pet-list">
              {dogArticles.map((a) => (
                <ArticleListItem key={a.id} article={a} fallback={FALLBACK_IMAGES.dog} />
              ))}
            </div>
          </section>

          <section id="cats" className="pet-column" aria-labelledby="home-cats">
            <div className="pet-column-head reveal">
              <h3 id="home-cats">แมว</h3>
              <Link href={animalUrl("cat")}>ดูแมว</Link>
            </div>
            <div className="pet-list">
              {catArticles.map((a) => (
                <ArticleListItem key={a.id} article={a} fallback={FALLBACK_IMAGES.cat} />
              ))}
            </div>
          </section>
        </div>
      </section>

      <section id="trust" className="shell section trust-section">
        <div className="trust-copy reveal">
          <p className="eyebrow">หลักการคัดข้อมูล</p>
          <h2>อ้างอิงได้ ไม่แทนสัตวแพทย์</h2>
          <p>ทุกบทความสุขภาพมีแหล่งอ้างอิง วันที่อัปเดต และคำเตือนชัดเจน</p>
        </div>

        <div className="trust-points">
          <article className="trust-point reveal">
            <h3>มีแหล่งอ้างอิง</h3>
            <p>เชื่อมกลับไปยัง guideline และ source ที่ทีมใช้จริง</p>
          </article>
          <article className="trust-point reveal">
            <h3>อ่านเข้าใจง่าย</h3>
            <p>แปลภาษายากให้ใช้ได้จริง โดยไม่ลดความรับผิดชอบ</p>
          </article>
          <article className="trust-point reveal">
            <h3>ไม่วินิจฉัยแทน</h3>
            <p>บทความสุขภาพมีขอบเขตและเตือนเมื่อควรพบสัตวแพทย์</p>
          </article>
        </div>
      </section>
    </main>
  );
}
