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
    title: `${animalLabel(a)} | Petster`,
    description: `รวมความรู้เรื่อง${animalLabel(a)} ครบทุกหมวด — สุขภาพ อาหาร พฤติกรรม และการดูแลประจำวัน`,
  };
}

export default async function AnimalHubPage({ params }: { params: Params }) {
  const { animal: animalSlug } = await params;
  const data = await getAnimalData(animalSlug);
  if (!data) notFound();

  const { animal, categories, articles } = data;

  return (
    <main>
      <section className="shell section">
        <header className="section-heading">
          <p className="eyebrow">หมวดความรู้</p>
          <h1>{animalLabel(animal)}</h1>
        </header>

        <div className="topic-grid">
          {categories.map((c) => {
            const hero = imageFrom(c);
            return (
              <Link key={c.id} className="topic-card" href={categoryUrl(animal, c.slug)}>
                {hero && (
                  <figure className="topic-card-image">
                    <Image
                      src={hero.url}
                      alt={hero.alt || c.name}
                      fill
                      sizes="(min-width: 900px) 25vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </figure>
                )}
                <h3>{c.name}</h3>
                {c.intro && <p>{c.intro}</p>}
              </Link>
            );
          })}
        </div>
      </section>

      {articles.length > 0 && (
        <section className="shell section">
          <header className="section-heading">
            <p className="eyebrow">บทความล่าสุด</p>
            <h2>เนื้อหาล่าสุดสำหรับคนเลี้ยง{animalLabel(animal)}</h2>
          </header>

          <div className="channel-grid">
            {articles.map((a) => {
              const hero = imageFrom(a);
              const catSlug = categorySlugFrom(a.category);
              const catName = categoryNameFrom(a.category);
              return (
                <Link
                  key={a.id}
                  className="channel-card"
                  href={articleUrl(animal, catSlug, a.slug)}
                >
                  {hero && (
                    <figure className="channel-card-image">
                      <Image
                        src={hero.url}
                        alt={hero.alt || a.title}
                        fill
                        sizes="(min-width: 900px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </figure>
                  )}
                  <h3>{a.title}</h3>
                  {catName && <p>{catName}</p>}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
