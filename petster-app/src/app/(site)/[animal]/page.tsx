import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";
import { getAnimalStaticParams } from "@/lib/cms-paths";
import { slugToAnimal, animalLabel, animalToSlug, categoryUrl, articleUrl } from "@/lib/url";

type Params = Promise<{ animal: string }>;

async function getAnimalData(animalSlug: string) {
  const animal = slugToAnimal(animalSlug);
  if (!animal) return null;

  const payload = await getPayloadClient();
  const [categories, latest] = await Promise.all([
    payload.find({
      collection: "categories",
      where: {
        or: [{ animal: { equals: animal } }, { animal: { equals: "both" } }],
      },
      sort: "name",
      limit: 12,
    }),
    payload.find({
      collection: "articles",
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
            const upload = c.heroImage as { url?: string; alt?: string } | null;
            const heroUrl =
              (upload && typeof upload === "object" && upload.url) ||
              (c.heroImageUrl as string | undefined);
            const heroAlt =
              (upload && typeof upload === "object" && upload.alt) || c.name;
            return (
              <a key={c.id} className="topic-card" href={categoryUrl(animal, c.slug)}>
                {heroUrl && (
                  <figure className="topic-card-image">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={heroUrl} alt={heroAlt || ""} />
                  </figure>
                )}
                <h3>{c.name}</h3>
                {c.intro && <p>{c.intro}</p>}
              </a>
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
              const upload = a.heroImage as { url?: string; alt?: string } | null;
              const heroUrl =
                (upload && typeof upload === "object" && upload.url) ||
                (a.heroImageUrl as string | undefined);
              const heroAlt =
                (upload && typeof upload === "object" && upload.alt) || a.title;
              const cat = a.category as { name: string; slug: string } | string;
              const catSlug = typeof cat === "string" ? cat : cat.slug;
              const catName = typeof cat === "string" ? "" : cat.name;
              return (
                <a
                  key={a.id}
                  className="channel-card"
                  href={articleUrl(animal, catSlug, a.slug)}
                >
                  {heroUrl && (
                    <figure className="channel-card-image">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={heroUrl} alt={heroAlt || ""} />
                    </figure>
                  )}
                  <h3>{a.title}</h3>
                  {catName && <p>{catName}</p>}
                </a>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
