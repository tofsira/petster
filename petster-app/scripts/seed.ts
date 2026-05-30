import { getPayload } from "payload";
import config from "../src/payload.config.ts";

type CategorySeed = {
  name: string;
  slug: string;
  animal: "dog" | "cat" | "both";
  intro: string;
  heroImageUrl?: string;
};

type ArticleSeed = {
  title: string;
  slug: string;
  animal: "dog" | "cat";
  categorySlug: string;
  excerpt: string;
  body: string;
  heroImageUrl: string;
  sources: { label: string; url?: string }[];
  faq: { question: string; answer: string }[];
  featured?: boolean;
};

const UNSPLASH = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const categories: CategorySeed[] = [
  {
    name: "สุขภาพ",
    slug: "health",
    animal: "both",
    intro: "อาการเบื้องต้น สัญญาณเตือน และสิ่งที่ควรรู้ก่อนพาไปสัตวแพทย์",
    heroImageUrl: UNSPLASH("1587300003388-59208cc962cb"),
  },
  {
    name: "อาหาร",
    slug: "food",
    animal: "both",
    intro: "พื้นฐานโภชนาการ การเลือกอาหารตามวัย และปริมาณที่เหมาะสม",
    heroImageUrl: UNSPLASH("1568640347023-a616a30bc3bd"),
  },
  {
    name: "พฤติกรรม",
    slug: "behavior",
    animal: "both",
    intro: "เข้าใจนิสัย สัญญาณความเครียด และปัญหาที่กระทบชีวิตประจำวัน",
    heroImageUrl: UNSPLASH("1530281700549-e82e7bf110d6"),
  },
  {
    name: "การดูแลประจำวัน",
    slug: "daily-care",
    animal: "both",
    intro: "กิจวัตรพื้นฐาน การทำความสะอาด อาบน้ำ และจัดบ้านให้เหมาะกับสัตว์เลี้ยง",
    heroImageUrl: UNSPLASH("1516734212186-a967f81ad0d7"),
  },
];

const articles: ArticleSeed[] = [
  {
    title: "สุนัขอาเจียน ควรดูอะไรก่อนพาไปสัตวแพทย์",
    slug: "dog-vomiting-when-to-see-vet",
    animal: "dog",
    categorySlug: "health",
    featured: true,
    heroImageUrl: UNSPLASH("1583337130417-3346a1be7dee"),
    excerpt:
      "แยกอาการที่เฝ้าดูได้ออกจากสัญญาณที่ควรรีบพาไปพบสัตวแพทย์ พร้อม checklist เบื้องต้นที่เจ้าของทำได้เอง",
    body:
      "สุนัขอาเจียนเป็นอาการที่พบบ่อย บางครั้งเกิดจากการกินเร็วเกินไป หรือกินอาหารแปลกๆ แต่บางครั้งเป็นสัญญาณของโรคที่ต้องรักษา การแยกแยะระหว่างอาเจียนทั่วไปกับอาเจียนที่อันตรายช่วยให้เจ้าของตัดสินใจได้ถูก\n\nสัญญาณที่ควรพาไปสัตวแพทย์ทันที: อาเจียนติดต่อกันมากกว่า 24 ชั่วโมง อาเจียนมีเลือดปน อาเจียนพร้อมท้องเสีย ซึม ไม่กินอาหาร หรือมีไข้ร่วม",
    sources: [
      { label: "AVMA - Vomiting in Dogs", url: "https://www.avma.org/" },
      { label: "VCA Hospitals - Vomiting in Dogs", url: "https://vcahospitals.com/" },
    ],
    faq: [
      {
        question: "สุนัขอาเจียน 1-2 ครั้งแล้วหายเอง ต้องพาไปหาหมอไหม",
        answer:
          "ถ้าหลังอาเจียนสุนัขยังร่าเริง กินน้ำได้ ไม่ซึม สังเกตอาการต่อ 24 ชั่วโมง ถ้าไม่กลับมาอีกถือว่าปกติ",
      },
      {
        question: "อาเจียนกับสำรอกอาหารต่างกันยังไง",
        answer:
          "อาเจียนคืออาหารถูกขับออกจากกระเพาะ มักมีน้ำดี ส่วนสำรอกคืออาหารยังไม่ลงกระเพาะ ออกมาเป็นก้อน ไม่มีอาการเกร็งท้อง",
      },
    ],
  },
  {
    title: "ตารางวัคซีนสุนัขที่เจ้าของควรรู้",
    slug: "dog-vaccine-schedule",
    animal: "dog",
    categorySlug: "health",
    heroImageUrl: UNSPLASH("1576091160550-2173dba999ef"),
    excerpt:
      "วัคซีนหลักและวัคซีนเสริมในแต่ละช่วงวัย พร้อมระยะเวลาฉีดกระตุ้นที่ควรจดไว้",
    body:
      "วัคซีนช่วยป้องกันโรคติดเชื้อร้ายแรง ลูกสุนัขควรได้รับวัคซีนชุดแรกตั้งแต่อายุ 6-8 สัปดาห์ และฉีดกระตุ้นต่อเนื่อง\n\nวัคซีนหลัก ได้แก่ ไข้หัด ตับอักเสบ พาร์โว เลปโตสไปโรซิส และพิษสุนัขบ้า ส่วนวัคซีนเสริมเช่น คอกหวัด โคโรนา ขึ้นกับสภาพแวดล้อมและความเสี่ยง",
    sources: [
      { label: "WSAVA Vaccination Guidelines", url: "https://wsava.org/" },
      { label: "กรมปศุสัตว์ - โรคพิษสุนัขบ้า", url: "https://www.dld.go.th/" },
    ],
    faq: [
      {
        question: "ลูกสุนัขฉีดวัคซีนได้ตั้งแต่อายุเท่าไร",
        answer: "เริ่มได้ตั้งแต่ 6-8 สัปดาห์ขึ้นไป โดยฉีดเป็นชุด 3-4 เข็มห่างกัน 3-4 สัปดาห์",
      },
    ],
  },
  {
    title: "เลือกอาหารสุนัขตามอายุและขนาดตัว",
    slug: "choose-dog-food-by-age-size",
    animal: "dog",
    categorySlug: "food",
    heroImageUrl: UNSPLASH("1581888227599-779811939961"),
    excerpt:
      "อาหารลูกสุนัข อาหารสุนัขโต และอาหารสุนัขสูงวัยต่างกันอย่างไร พร้อมแนวทางเลือกตามขนาดสายพันธุ์",
    body:
      "อาหารสุนัขแบ่งตามอายุ ขนาดตัว และระดับกิจกรรม ลูกสุนัขต้องการพลังงานและโปรตีนมากกว่าสุนัขโต ส่วนสุนัขสูงวัยต้องการแคลอรี่น้อยลง แต่ต้องดูแลข้อต่อและไต\n\nสุนัขพันธุ์ใหญ่ที่โตช้าควรเลือกอาหารที่มีแคลเซียมพอดี ไม่มากเกิน เพื่อป้องกันปัญหาข้อสะโพก",
    sources: [
      { label: "AAFCO Pet Food Standards", url: "https://www.aafco.org/" },
    ],
    faq: [
      {
        question: "เปลี่ยนอาหารใหม่ ทำยังไงให้สุนัขไม่ท้องเสีย",
        answer:
          "ค่อยๆ ผสมอาหารใหม่กับอาหารเดิม เริ่มจาก 25% ใน 3 วันแรก เพิ่มเป็น 50% / 75% / 100% ใน 7-10 วัน",
      },
    ],
  },
  {
    title: "หมาเครียดหรือเบื่อ สังเกตจากภาษากายอย่างไร",
    slug: "dog-stress-vs-boredom-body-language",
    animal: "dog",
    categorySlug: "behavior",
    heroImageUrl: UNSPLASH("1518717758536-85ae29035b6d"),
    excerpt:
      "สัญญาณภาษากายที่บ่งบอกว่าสุนัขเครียด เบื่อ หรือกลัว และวิธีปรับสภาพแวดล้อมให้ดีขึ้น",
    body:
      "สุนัขสื่อสารผ่านภาษากายเป็นหลัก เลียจมูก หาวบ่อย ก้มหัว หางตก เป็นสัญญาณของความเครียด ส่วนการเดินวน เห่าใส่ผนัง กัดของเล่นทำลาย มักเกิดจากความเบื่อหรือพลังงานเหลือ\n\nการเดินเล่นทุกวัน ของเล่นปริศนา และเวลาคุณภาพกับเจ้าของช่วยลดทั้งความเครียดและความเบื่อ",
    sources: [
      { label: "ASPCA - Canine Body Language", url: "https://www.aspca.org/" },
    ],
    faq: [
      {
        question: "หมากัดของในบ้านบ่อยขึ้น เป็นเพราะอะไร",
        answer:
          "ส่วนใหญ่เกิดจากความเบื่อ พลังงานเหลือ หรือกังวลเมื่ออยู่บ้านคนเดียว ลองเพิ่มเวลาออกกำลังกายและของเล่นที่ต้องใช้ความคิด",
      },
    ],
  },
  {
    title: "อาบน้ำหมาให้ถูกต้อง บ่อยแค่ไหนถึงพอดี",
    slug: "how-often-bathe-dog",
    animal: "dog",
    categorySlug: "daily-care",
    heroImageUrl: UNSPLASH("1591946614720-90a587da4a36"),
    excerpt: "ความถี่ในการอาบน้ำ การเลือกแชมพู และขั้นตอนที่ไม่ทำร้ายผิวหนังสุนัข",
    body:
      "สุนัขส่วนใหญ่ไม่ต้องอาบน้ำบ่อย ทุก 4-6 สัปดาห์ก็เพียงพอ การอาบบ่อยเกินไปทำให้ผิวแห้ง สูญเสียน้ำมันธรรมชาติที่ปกป้องผิวหนัง\n\nใช้แชมพูสำหรับสุนัขเท่านั้น แชมพูคนค่า pH ไม่เหมาะกับผิวสุนัข ล้างให้สะอาด เช็ดให้แห้งโดยเฉพาะหู เพื่อป้องกันการอักเสบ",
    sources: [
      { label: "AKC - Dog Bathing Guide", url: "https://www.akc.org/" },
    ],
    faq: [
      {
        question: "ใช้แชมพูคนกับหมาได้ไหม",
        answer:
          "ไม่ควร แชมพูคนค่า pH ไม่เหมาะ ทำให้ผิวหมาแห้งและคันได้ ควรใช้แชมพูสำหรับสุนัขโดยเฉพาะ",
      },
    ],
  },
  {
    title: "แมวไม่กินอาหาร เริ่มเช็กจากอะไรก่อน",
    slug: "cat-not-eating-first-checks",
    animal: "cat",
    categorySlug: "health",
    featured: true,
    heroImageUrl: UNSPLASH("1574158622682-e40e69881006"),
    excerpt:
      "แมวไม่กินข้าวเกิน 24 ชั่วโมงอาจเสี่ยงตับเป็นไขมัน วิธีเช็กสาเหตุเบื้องต้นและสัญญาณที่ควรพาไปสัตวแพทย์",
    body:
      "แมวที่ไม่กินอาหารเกิน 24-48 ชั่วโมงเสี่ยงเป็นโรคตับเป็นไขมัน (Hepatic Lipidosis) ซึ่งอันตรายถึงชีวิต ต่างจากสุนัขที่อดอาหารได้นานกว่า\n\nสาเหตุที่พบบ่อย: อาหารเปลี่ยน บรรยากาศบ้านเปลี่ยน เครียด ปวดฟัน หรือป่วย ลองเปลี่ยนกลับเป็นอาหารเดิม ดูว่าแมวกินไหม ถ้ายังไม่กินใน 24 ชั่วโมง ควรพาไปหาหมอ",
    sources: [
      { label: "Cornell Feline Health Center", url: "https://www.vet.cornell.edu/" },
      { label: "ICatCare - Anorexia in Cats", url: "https://icatcare.org/" },
    ],
    faq: [
      {
        question: "แมวเปลี่ยนยี่ห้ออาหารแล้วไม่ยอมกิน ต้องทำยังไง",
        answer:
          "ค่อยๆ ผสมอาหารใหม่กับอาหารเดิม เพิ่มสัดส่วนทีละ 25% ทุก 3 วัน ใช้เวลา 7-14 วันเพื่อให้แมวปรับตัว",
      },
      {
        question: "แมวไม่กินอาหารกี่ชั่วโมงควรกังวล",
        answer:
          "ถ้าเกิน 24 ชั่วโมงควรเริ่มเฝ้าใกล้ชิด เกิน 48 ชั่วโมงต้องพาไปสัตวแพทย์ทันที เพราะเสี่ยงโรคตับ",
      },
    ],
  },
  {
    title: "แมวอ้วก แยกอย่างไรว่าปกติหรือต้องไปหาหมอ",
    slug: "cat-vomiting-normal-or-not",
    animal: "cat",
    categorySlug: "health",
    heroImageUrl: UNSPLASH("1511044568932-338cba0ad803"),
    excerpt:
      "อ้วกขนเป็นเรื่องปกติของแมว แต่อ้วกบ่อย อ้วกพร้อมอาการอื่น อาจเป็นสัญญาณของโรค",
    body:
      "แมวอ้วกขนเป็นครั้งคราว (1-2 ครั้งต่อเดือน) ถือว่าปกติ แต่ถ้าอ้วกถี่ขึ้น อ้วกเป็นน้ำดี อ้วกพร้อมท้องเสีย ซึม หรือน้ำหนักลด ควรพาไปสัตวแพทย์\n\nการแปรงขนสัปดาห์ละ 2-3 ครั้งช่วยลดการกลืนขนเข้าไป",
    sources: [
      { label: "VCA Hospitals - Vomiting in Cats", url: "https://vcahospitals.com/" },
    ],
    faq: [
      {
        question: "แมวอ้วกขนบ่อย ผิดปกติไหม",
        answer:
          "อ้วกขน 1-2 ครั้งต่อเดือนปกติ ถ้าเกินสัปดาห์ละครั้ง ควรเพิ่มการแปรงและพิจารณาอาหารช่วยขับขน",
      },
    ],
  },
  {
    title: "เลือกอาหารแมวอย่างไร โปรตีนสำคัญกว่าที่คิด",
    slug: "choose-cat-food-protein-matters",
    animal: "cat",
    categorySlug: "food",
    heroImageUrl: UNSPLASH("1513360371669-4adf3dd7dff8"),
    excerpt: "แมวเป็น obligate carnivore ต้องการโปรตีนจากเนื้อสัตว์เป็นหลัก",
    body:
      "แมวเป็น obligate carnivore ระบบย่อยถูกออกแบบมารองรับโปรตีนจากเนื้อสัตว์ ไม่ใช่พืช อาหารแมวที่ดีควรมีโปรตีนจากเนื้อ ≥ 30% (อาหารเม็ด) หรือ ≥ 8% (อาหารเปียก)\n\nหลีกเลี่ยงอาหารที่ระบุ \"พืชเป็นส่วนผสมหลัก\" หรือมี by-product เยอะ แมวต้องการ taurine ซึ่งมีในเนื้อสัตว์เท่านั้น",
    sources: [
      { label: "AAFCO Cat Food Nutrient Profiles", url: "https://www.aafco.org/" },
    ],
    faq: [
      {
        question: "แมวกินอาหารหมาได้ไหม",
        answer:
          "ไม่ได้ในระยะยาว เพราะอาหารหมาไม่มี taurine และโปรตีนต่ำกว่า แมวกินนานๆ จะขาดสารอาหาร",
      },
    ],
  },
  {
    title: "แมวข่วนเฟอร์นิเจอร์ แก้ที่ต้นเหตุ ไม่ใช่ที่นิสัย",
    slug: "cat-scratching-furniture-solutions",
    animal: "cat",
    categorySlug: "behavior",
    heroImageUrl: UNSPLASH("1495360010541-f48722b34f7d"),
    excerpt:
      "การข่วนเป็นพฤติกรรมธรรมชาติของแมว ห้ามไม่ได้แต่ชี้นำได้ ด้วยการจัดที่ข่วนที่เหมาะสม",
    body:
      "แมวข่วนเพื่อลับเล็บ ทำเครื่องหมายอาณาเขต และยืดกล้ามเนื้อ การห้ามไม่ได้ผล แต่ให้ที่ข่วนที่เหมาะสมแทน\n\nที่ข่วนควรสูงพอให้แมวยืดตัวได้เต็มที่ ตั้งใกล้จุดที่แมวเคยข่วน ใช้วัสดุที่แมวชอบ (sisal, กระดาษลูกฟูก) และโรย catnip ช่วยดึงดูด",
    sources: [
      { label: "ASPCA - Destructive Scratching", url: "https://www.aspca.org/" },
    ],
    faq: [
      {
        question: "ตัดเล็บแมวบ่อยแค่ไหน",
        answer: "ตัดทุก 2-4 สัปดาห์ ตัดเฉพาะปลายเล็บที่ใส ไม่ตัดเข้าใกล้ส่วนชมพู (quick) ที่มีเส้นเลือด",
      },
    ],
  },
  {
    title: "จัดมุมกระบะทรายให้แมวใช้งานง่าย",
    slug: "litter-box-setup-best-practices",
    animal: "cat",
    categorySlug: "daily-care",
    heroImageUrl: UNSPLASH("1519052537078-e6302a4968d4"),
    excerpt:
      "กฎ N+1 ขนาด ตำแหน่ง และความสะอาดที่ทำให้แมวไม่ฉี่นอกกระบะ",
    body:
      "กฎพื้นฐาน: จำนวนกระบะทราย = จำนวนแมว + 1 เช่น เลี้ยง 2 ตัว ควรมี 3 กระบะ วางคนละจุดในบ้าน\n\nกระบะควรใหญ่กว่าแมว 1.5 เท่า เพื่อให้แมวกลับตัวได้สบาย ทรายควรลึก 5-7 ซม. ตักทุกวัน เปลี่ยนทั้งกระบะทุก 1-2 สัปดาห์",
    sources: [
      { label: "Ohio State - Indoor Cat Initiative", url: "https://indoorpet.osu.edu/" },
    ],
    faq: [
      {
        question: "แมวเริ่มฉี่นอกกระบะ เป็นเพราะอะไร",
        answer:
          "สาเหตุพบบ่อย: กระบะสกปรก กระบะเล็กไป ทรายเปลี่ยน เครียด หรือป่วย (โรคทางเดินปัสสาวะ) ควรพาไปสัตวแพทย์ก่อนสรุปว่าเป็นพฤติกรรม",
      },
    ],
  },
];

async function seed() {
  const payload = await getPayload({ config });

  console.log("Seeding categories...");
  const categoryMap = new Map<string, string | number>();
  for (const cat of categories) {
    const existing = await payload.find({
      collection: "categories",
      where: { slug: { equals: cat.slug } },
      limit: 1,
    });
    let id: string | number;
    if (existing.docs.length > 0) {
      id = existing.docs[0].id;
      await payload.update({ collection: "categories", id, data: cat });
      console.log(`  updated ${cat.slug}`);
    } else {
      const created = await payload.create({ collection: "categories", data: cat });
      id = created.id;
      console.log(`  created ${cat.slug}`);
    }
    categoryMap.set(cat.slug, id);
  }

  console.log("\nSeeding articles...");
  for (const art of articles) {
    const categoryId = categoryMap.get(art.categorySlug);
    if (!categoryId) {
      console.log(`  skip ${art.slug} (category ${art.categorySlug} missing)`);
      continue;
    }
    const data = {
      title: art.title,
      slug: art.slug,
      animal: art.animal,
      category: categoryId as any,
      excerpt: art.excerpt,
      heroImageUrl: art.heroImageUrl,
      sources: art.sources,
      faq: art.faq,
      featured: art.featured || false,
      publishedAt: new Date().toISOString(),
    } as any;

    const existing = await payload.find({
      collection: "articles",
      where: { slug: { equals: art.slug } },
      limit: 1,
    });
    if (existing.docs.length > 0) {
      await payload.update({ collection: "articles", id: existing.docs[0].id, data });
      console.log(`  updated ${art.slug}`);
    } else {
      await payload.create({ collection: "articles", data });
      console.log(`  created ${art.slug}`);
    }
  }

  console.log("\nDone.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
