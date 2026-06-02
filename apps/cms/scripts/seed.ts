import { getPayload } from "payload";

function toRichText(text: string) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return {
    root: {
      type: "root",
      children: paragraphs.map((p) => ({
        type: "paragraph",
        children: [{ type: "text", text: p, format: 0, version: 1 }],
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      })),
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

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
  // ── บทความจาก article/ folder ──────────────────────────────────────
  {
    title: "คู่มือถอดรหัสภาษากายแมว: ตีความความหมายจากดวงตา หู หนวด และหางของเจ้าเหมียว",
    slug: "cat-body-language-guide",
    animal: "cat",
    categorySlug: "behavior",
    heroImageUrl: UNSPLASH("1495360010541-f48722b34f7d"),
    excerpt:
      "แมวไม่ได้สื่อสารผ่านเสียงร้องเหมียวๆ เท่านั้น แต่พวกเขามีทักษะการใช้ภาษากายที่ละเอียดอ่อนและซับซ้อนอย่างยิ่ง คู่มือฉบับนี้จะพาคุณถอดรหัสสัญญาณทางร่างกายของเจ้าเหมียว ตั้งแต่หาง หู ดวงตา ไปจนถึงหนวดและการกะพริบตาช้าๆ",
    body:
      "แมวแสดงออกถึงอารมณ์ตลอดเวลาผ่านภาษากายที่ละเอียดอ่อน การอ่านสัญญาณเหล่านี้ได้ช่วยป้องกันอุบัติเหตุและสร้างความเชื่อใจระหว่างมนุษย์กับแมว\n\nหาง: หางตั้งตรงปลายงอเล็กน้อย หมายถึงแมวมีความสุขและพร้อมปฏิสัมพันธ์ หางสะบัดเร็วหมายถึงหงุดหงิดหรือ Overstimulation ให้หยุดลูบทันที หางฟูเหมือนแปรงหมายถึงตกใจกลัวหรือถูกคุกคาม\n\nหู: หูชี้ไปข้างหน้าหมายถึงสนใจและผ่อนคลาย หูลู่ด้านข้างเหมือนปีกบินหมายถึงกังวลและต้องการพื้นที่ส่วนตัว หูแบนแนบหัวคือสัญญาณโกรธสูงสุด ห้ามเข้าไปสัมผัสตัวแมวในสภาวะนี้\n\nดวงตา: รูม่านตาขยายกว้างอาจหมายถึงตื่นเต้นหรือกลัว รูม่านตาหดแคบอาจหมายถึงโกรธหรือก้าวร้าว การกะพริบตาช้าๆ คือ \"จูบของแมว\" ที่แสดงความรักและความเชื่อใจ สามารถกะพริบตาตอบกลับเพื่อกระชับความสัมพันธ์\n\nหนวด: หนวดชี้กางด้านข้างแสดงความสบายใจ หนวดลู่แนบแก้มหมายถึงกลัวหรือเตรียมป้องกันตัว หนวดชี้ไปข้างหน้าหมายถึงสนใจหรืออยู่ในโหมดนักล่า การอ่านภาษากายที่ถูกต้องต้องพิจารณาทุกส่วนร่วมกันพร้อมกับสังเกตบริบทและสภาพแวดล้อม",
    sources: [
      { label: "Cornell Feline Health Center - How to Read Your Cat's Body Language", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center" },
      { label: "ASPCA - Cat Body Language", url: "https://www.aspca.org/pet-care/cat-care/common-cat-behavior-issues/cat-body-language" },
      { label: "VCA Animal Hospitals - Understanding Cat Body Language", url: "https://vcahospitals.com/know-your-pet/understanding-cat-body-language" },
    ],
    faq: [],
  },
  {
    title: "ทำไมแมวชอบร้องกวนตอนกลางคืน? ถอดรหัสพฤติกรรมกวนใจยามวิกาลและวิธีปรับตารางชีวิต",
    slug: "cat-nighttime-vocalization",
    animal: "cat",
    categorySlug: "behavior",
    heroImageUrl: UNSPLASH("1574158622682-e40e69881006"),
    excerpt:
      "เจ้าของแมวหลายคนนอนไม่เต็มอิ่มเพราะเสียงร้องยามดึก บทความนี้เจาะลึกสาเหตุตั้งแต่สัญชาตญาณตามธรรมชาติ ความเบื่อหน่าย ไปจนถึงสัญญาณเตือนทางสุขภาพ พร้อมแนวทางปฏิบัติเพื่อคืนความสงบให้ค่ำคืน",
    body:
      "แมวเป็นสัตว์ประเภท Crepuscular ซึ่งกระฉับกระเฉงสูงสุดในช่วงโพล้เพล้และรุ่งสาง สัญชาตญาณนักล่าถูกกระตุ้นในเวลาเหล่านี้ ทำให้แมวตื่นมาร้องเรียกหรือมีพลังงานล้นเหลือในช่วงดึก\n\nสาเหตุของการร้องกวนตอนกลางคืน: ความเบื่อหน่ายและการเรียกร้องความสนใจ (แมวเรียนรู้ว่าการร้องได้รับความสนใจจึงทำซ้ำ) ปัญหาสุขภาพในแมวสูงวัยเช่น ต่อมไทรอยด์เป็นพิษหรือสมองเสื่อม (CDS) ซึ่งทำให้สับสนในเรื่องเวลา\n\nวิธีปรับพฤติกรรม: เล่นกับแมวอย่างจริงจัง 15-20 นาทีก่อนเข้านอน แล้วตามด้วยอาหารมื้อหลัก (เลียนแบบวงจร ล่า-กิน-นอน) ใช้เครื่องให้อาหารอัตโนมัติเพื่อโอนย้ายความคาดหวังจากตัวเจ้าของไปที่เครื่อง เพิ่มสิ่งเร้าในตอนกลางวันเพื่อลดการนอนกลางวัน และฝึก \"การเพิกเฉยอย่างสมบูรณ์\" เมื่อแมวร้องโดยไม่มีเหตุอันตราย\n\nหากปรับพฤติกรรมต่อเนื่อง 2-3 สัปดาห์แล้วไม่ดีขึ้น หรือพบอาการร่วมเช่น น้ำหนักลด ดื่มน้ำบ่อย ควรพาไปพบสัตวแพทย์เพื่อตรวจหาโรคทางกาย",
    sources: [
      { label: "Cornell Feline Health Center - Feline Behavior Problems: Vocalization", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center" },
      { label: "AAFP - Feline Behavior Guidelines", url: "https://catvets.com/guidelines/practice-guidelines/behavior-guidelines" },
      { label: "ASPCA - Nighttime Vocalization in Cats", url: "https://www.aspca.org/pet-care/cat-care/common-cat-behavior-issues/nighttime-vocalization-cats" },
    ],
    faq: [],
  },
  {
    title: "ทำไมแมวชอบข่วนโซฟา? ทำความเข้าใจความต้องการตามธรรมชาติและเทคนิคปกป้องเฟอร์นิเจอร์",
    slug: "cat-scratching-furniture",
    animal: "cat",
    categorySlug: "behavior",
    heroImageUrl: UNSPLASH("1511044568932-338cba0ad803"),
    excerpt:
      "การข่วนเฟอร์นิเจอร์ไม่ใช่การประชดประชัน แต่เป็นสัญชาตญาณที่จำเป็นต่อสุขภาพกายและใจของแมว บทความนี้ชวนเจาะลึกสาเหตุ วิธีเลือกที่ฝนเล็บ และเทคนิคการเบี่ยงเบนเพื่อปกป้องเฟอร์นิเจอร์อย่างยั่งยืน",
    body:
      "แมวข่วนเพื่อ 3 เหตุผลหลัก: บำรุงรักษาเล็บ (ลอกเปลือกเล็บชั้นนอกที่เสื่อมสภาพ) ยืดเหยียดร่างกาย (ยืดกระดูกสันหลังและกล้ามเนื้อ) และสื่อสารอาณาเขต (อุ้งเท้ามีต่อมกลิ่นฟีโรโมน) การห้ามไม่ให้ข่วนเลยเป็นไปไม่ได้และทำลายสุขภาพจิตแมว ทางออกคือการเบี่ยงเบนไปสู่จุดที่เหมาะสม\n\nการเลือกที่ฝนเล็บ: ต้องสูงพอให้แมวยืดตัวได้เต็มที่ แมวบางตัวชอบแนวตั้ง (Vertical Scratchers) บางตัวชอบแนวนอน (Horizontal Scratchers) วัสดุที่นิยมคือเชือกป่านศรนารายณ์ (Sisal) กระดาษลูกฟูก และไม้จริง\n\nการจัดวางตำแหน่ง: วางไว้ข้างๆ ที่นอนแมว (แมวชอบยืดตัวหลังตื่นนอน) วางทับตำแหน่งที่แมวเคยข่วน และวางในพื้นที่สังสรรค์เพื่อให้แมวทิ้งกลิ่นอาณาเขต\n\nการฝึก: โรยแคทนิปบนที่ฝนเล็บ ใช้แผ่นพลาสติกหรือเทปกาวสองหน้าปกป้องโซฟาชั่วคราว ให้รางวัลทันทีที่แมวข่วนถูกจุด ห้ามดุด่าหรือฉีดน้ำ และห้ามผ่าตัดถอดเล็บ (Declawing) ซึ่งเป็นการทารุณกรรมที่ทำลายข้อนิ้วแมวอย่างถาวร",
    sources: [
      { label: "Cornell Feline Health Center - Feline Behavior Problems: Destructive Scratching", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center" },
      { label: "ASPCA - Destructive Scratching", url: "https://www.aspca.org/pet-care/cat-care/common-cat-behavior-issues/destructive-scratching" },
      { label: "VCA Animal Hospitals - Why Cats Scratch and How to Train Them", url: "https://vcahospitals.com/know-your-pet/why-cats-scratch-and-how-to-train-them" },
    ],
    faq: [],
  },
  {
    title: "คู่มือเลือกทรายแมวฉบับสมบูรณ์: เปรียบเทียบข้อดีข้อเสีย ทรายประเภทไหนที่โดนใจคุณและแมว",
    slug: "cat-litter-types-comparison",
    animal: "cat",
    categorySlug: "daily-care",
    heroImageUrl: UNSPLASH("1519052537078-e6302a4968d4"),
    excerpt:
      "ทรายแมวที่มนุษย์คิดว่าดีอาจไม่ตรงกับความต้องการของแมว บทความนี้เปรียบเทียบทราย 4 ประเภทยอดนิยม วิเคราะห์ปัจจัยที่แมวให้ความสำคัญ และเผยเคล็ดลับเปลี่ยนประเภททรายอย่างปลอดภัยไม่ทำให้แมวเครียด",
    body:
      "ทรายแมว 4 ประเภทหลัก: ทรายเบนโทไนท์ (จับตัวเป็นก้อนดี แมวชอบสัมผัสใกล้เคียงดินธรรมชาติ แต่มีฝุ่นมากและหนัก) ทรายเต้าหู้ (ปราศจากฝุ่น ปลอดภัยหากกลืน ทิ้งลงโถได้ แต่ราคาแพงกว่า) ทรายไม้สน (ดักกลิ่นธรรมชาติ ย่อยสลายได้ แต่แมวบางตัวไม่ชอบสัมผัสที่แข็ง) ทรายซิลิกาเจล (เก็บกลิ่นได้ยอดเยี่ยม น้ำหนักเบา แต่ราคาแพงและอันตรายหากกลืนมาก)\n\nปัจจัยที่แมวให้ความสำคัญ: ผิวสัมผัส (แมวส่วนใหญ่ชอบเม็ดละเอียดนุ่มอุ้งเท้า) กลิ่น (หลีกเลี่ยงทรายแต่งกลิ่นน้ำหอม เลือก Unscented จะปลอดภัยที่สุด) ฝุ่นและการลากทรายติดเท้า\n\nการเปลี่ยนประเภทแบบค่อยเป็นค่อยไปใน 7 วัน: วันที่ 1-2 ผสมทรายเก่า 75%/ใหม่ 25% วันที่ 3-4 เปลี่ยนเป็น 50/50 วันที่ 5-6 เป็น 25/75 และวันที่ 7 ใหม่ 100% สังเกตพฤติกรรมตลอดกระบวนการ หากแมวลังเลหรือกลั้นฉี่ ให้ลดสัดส่วนทรายใหม่ลงและยืดเวลาออก",
    sources: [
      { label: "Cornell Feline Health Center - Feline Behavior Problems: House Soiling", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center" },
      { label: "ASPCA - Litter Box Care", url: "https://www.aspca.org/pet-care/cat-care/common-cat-behavior-issues/litter-box-care" },
      { label: "AAFP - Feline Environmental Needs Guidelines", url: "https://catvets.com/guidelines/practice-guidelines/environmental-needs-guidelines" },
    ],
    faq: [],
  },
  {
    title: "รับมือภัยเงียบจากก้อนขนแมว (Hairball): เคล็ดลับการป้องกันและช่วยชีวิตเจ้าเหมียวจากการอุดตัน",
    slug: "cat-hairball-prevention",
    animal: "cat",
    categorySlug: "daily-care",
    heroImageUrl: UNSPLASH("1574158622682-e40e69881006"),
    excerpt:
      "ก้อนขนสะสมอาจนำไปสู่ภาวะลำไส้อุดตันเฉียบพลันอันตรายถึงชีวิต บทความนี้เจาะลึกกลไกการเกิดก้อนขน วิธีแยกแยะอาการสำรอกปกติออกจากสัญญาณอันตราย และแนวทางป้องกันอย่างรอบด้าน",
    body:
      "แมวใช้เวลา 30-50% ของช่วงตื่นไปกับการเลียแต่งขน ลิ้นของแมวมีปุ่มหนาม (Papillae) เหมือนตะขอที่ดักจับขนที่หลุดร่วง แมวกลืนขนเหล่านั้นลงไปโดยไม่สามารถบ้วนออกได้ ปกติขนจะเดินทางผ่านทางเดินอาหารและออกมากับอุจจาระ แต่ถ้ากลืนมากเกินไปหรือการบีบตัวลำไส้ทำงานช้า ขนจะจับตัวกันเป็นก้อนสะสมในกระเพาะ\n\nอาการปกติ: สำรอกก้อนขน 1-2 สัปดาห์ต่อครั้ง หลังจากนั้นแมวยังร่าเริงและกินอาหารได้ปกติ สัญญาณอันตราย: สำรอกแห้งๆ บ่อยครั้งแต่ไม่มีอะไรออกมา ซึม เบื่ออาหาร ท้องผูก หรือน้ำหนักลดเร็ว อาการเหล่านี้อาจเป็นสัญญาณของลำไส้อุดตัน (ภาวะฉุกเฉินต้องผ่าตัด) หรืออาจสับสนกับโรคหอบหืดในแมว\n\nการป้องกัน 3 เสาหลัก: แปรงขนทุกวันเพื่อกำจัดขนตายก่อนที่แมวจะกลืน (สำคัญที่สุดในแมวขนยาว) ปรับอาหารเป็นสูตรควบคุมก้อนขน (มีใยอาหารช่วยเคลื่อนขนออก) และเพิ่มน้ำดื่มเพื่อรักษาความชุ่มชื้นในระบบทางเดินอาหาร ใช้เจลระบายก้อนขน (Hairball Gel) สัปดาห์ละ 1-2 ครั้งหากจำเป็น",
    sources: [
      { label: "Cornell Feline Health Center - Hairballs", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center" },
      { label: "ASPCA - Hairballs in Cats", url: "https://www.aspca.org/pet-care/cat-care/common-cat-behavior-issues/hairballs-cats" },
      { label: "VCA Animal Hospitals - Hairballs in Cats", url: "https://vcahospitals.com/know-your-pet/hairballs-in-cats" },
    ],
    faq: [],
  },
  {
    title: "ลูกแมวกินนมวัวได้ไหม? ไขความจริงเรื่องระบบย่อยอาหารและโภชนาการสำหรับลูกแมววัยเยาว์",
    slug: "kitten-cow-milk-danger",
    animal: "cat",
    categorySlug: "food",
    heroImageUrl: UNSPLASH("1513360371669-4adf3dd7dff8"),
    excerpt:
      "ภาพลักษณ์ในสื่อที่มักแสดงให้เห็นลูกแมวเลียนมวัวนั้นเป็นความเชื่อผิดที่อันตราย นมวัวอาจทำร้ายระบบทางเดินอาหารอันบอบบางของลูกแมว นำไปสู่ท้องเสียรุนแรงและภาวะขาดน้ำเฉียบพลัน",
    body:
      "ลูกแมวในวัยดูดนมมีเอนไซม์แลคเตส (Lactase) สูงเพื่อย่อยนมแม่ แต่เมื่ออายุ 4-6 สัปดาห์เริ่มหย่านม ร่างกายจะลดการผลิตแลคเตสลงจนแทบไม่เหลือ เนื่องจากระบบย่อยวิวัฒนาการเพื่อเปลี่ยนจากน้ำนมมาเป็นเนื้อสัตว์\n\nนมวัวมีน้ำตาลแลคโตสสูงกว่านมแม่แมวมาก แต่โปรตีนและไขมันต่ำกว่าความต้องการของลูกแมว เมื่อลูกแมวดื่มนมวัว แลคโตสที่ไม่ถูกย่อยจะดึงน้ำเข้าสู่ลำไส้ทำให้เกิดท้องเสียแบบ Osmotic Diarrhea และแบคทีเรียในลำไส้ใหญ่หมักแลคโตสทำให้เกิดก๊าซท้องอืด สำหรับลูกแมวตัวเล็กน้ำหนักเพียงไม่กี่ร้อยกรัม ภาวะขาดน้ำเฉียบพลันอาจเป็นอันตรายถึงชีวิตภายในไม่กี่ชั่วโมง\n\nทางเลือกที่ถูกต้อง: หากพบลูกแมวกำพร้าหรือแม่แมวไม่มีนม ให้ใช้นมทดแทนสำหรับลูกแมวโดยเฉพาะ (Kitten Milk Replacer: KMR) ซึ่งมีสัดส่วนสารอาหารใกล้เคียงนมแม่แมวและมีแลคโตสต่ำ ในกรณีฉุกเฉินสามารถใช้นมแพะ 100% เป็นทางเลือกชั่วคราวได้ ห้ามใช้นมถั่วเหลืองหรือนมจากพืช",
    sources: [
      { label: "Cornell Feline Health Center - Cats and Dairy", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center" },
      { label: "ASPCA - Kitten Care & Poison Control: Dairy Products", url: "https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/cow-milk" },
      { label: "VCA Animal Hospitals - Feeding Orphaned Kittens", url: "https://vcahospitals.com/know-your-pet/feeding-orphaned-kittens" },
    ],
    faq: [],
  },
  {
    title: "รับมือแมวกินยากและพฤติกรรมเบื่ออาหาร: ถอดรหัสพฤติกรรมการกินและวิธีช่วยให้เจ้าเหมียวเจริญอาหาร",
    slug: "cat-picky-eater-guide",
    animal: "cat",
    categorySlug: "food",
    heroImageUrl: UNSPLASH("1513360371669-4adf3dd7dff8"),
    excerpt:
      "พฤติกรรมการกินยาก เลือกกิน หรือจู่ๆ เบื่ออาหาร เกิดได้จากหลายสาเหตุทั้งความเครียด สัมผัสอาหาร หรือสัญญาณเตือนความเจ็บป่วย การทำความเข้าใจและระวังภาวะตับวายจากการอดอาหารเป็นสิ่งสำคัญ",
    body:
      "สาเหตุที่แมวกินยาก: ภาวะหนวดล้า (Whisker Fatigue) จากชามที่ลึกเกินทำให้หนวดเสียดสีขอบชาม อุณหภูมิและกลิ่นอาหาร (แมวชอบอาหารอุ่นใกล้อุณหภูมิร่างกายเหยื่อ อาหารเย็นจากตู้เย็นลดความน่ากิน) เนื้อสัมผัส (แมวแต่ละตัวชอบ Gravy, Jelly หรือ Pate ต่างกัน) และความเจ็บป่วยที่ซ่อนเร้นเช่น โรคเหงือก โรคไต หรือไข้\n\nอันตรายสำคัญ: ห้ามปล่อยให้แมว โดยเฉพาะแมวอ้วน อดอาหารเกิน 24-48 ชั่วโมง เพราะร่างกายจะสลายไขมันสะสมไปพอกตับจนเกิดภาวะตับวายเฉียบพลัน (Hepatic Lipidosis) แมวจะมีอาการตัวเหลือง ซึม และเสียชีวิตได้อย่างรวดเร็ว\n\n5 เทคนิคกระตุ้นความอยากอาหาร: อุ่นอาหารเปียก 5-10 วินาทีในไมโครเวฟเพื่อปลุกกลิ่นหอม ใช้จานกว้างและแบนเพื่อลด Whisker Fatigue โรยท็อปปิ้งเช่น ปลาคัตสึโอบุชิหรือผงไก่ฟรีซดราย จัดมุมกินอาหารที่สงบและปลอดภัย เปลี่ยนอาหารโดยผสมทีละน้อยใน 7-14 วัน",
    sources: [
      { label: "Cornell Feline Health Center - Anorexia: Loss of Appetite in Cats", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center" },
      { label: "VCA Animal Hospitals - Cats That Refuse to Eat", url: "https://vcahospitals.com/know-your-pet/cats-that-refuse-to-eat" },
      { label: "Merck Veterinary Manual - Hepatic Lipidosis in Cats", url: "https://www.merckvetmanual.com/digestive-system/hepatic-disease-in-small-animals/hepatic-lipidosis-in-cats" },
    ],
    faq: [],
  },
  {
    title: "โรคระบบทางเดินปัสสาวะส่วนล่างในแมว (FLUTD): สังเกตอาการปัสสาวะติดขัด ภัยด่วนทางสัตวแพทย์",
    slug: "cat-flutd-urinary-tract",
    animal: "cat",
    categorySlug: "health",
    heroImageUrl: UNSPLASH("1574158622682-e40e69881006"),
    excerpt:
      "FLUTD เป็นกลุ่มอาการที่สร้างความทรมานและพบบ่อยในแมวทุกเพศวัย โดยเฉพาะแมวตัวผู้ที่อาจเกิดภาวะท่อปัสสาวะอุดตันซึ่งเป็นภาวะฉุกเฉินอันตรายถึงชีวิต การสังเกตพฤติกรรมการขับถ่ายอย่างใกล้ชิดจึงเป็นสิ่งสำคัญมาก",
    body:
      "FLUTD เกิดได้จาก 3 สาเหตุหลัก: กระเพาะปัสสาวะอักเสบไม่ทราบสาเหตุ (FIC) ซึ่งสัมพันธ์กับความเครียดของแมว พบบ่อยที่สุด 60-70% นิ่วและตะกอนคริสตัลในปัสสาวะ (Struvite หรือ Calcium Oxalate) และการติดเชื้อในระบบทางเดินปัสสาวะซึ่งพบมากในแมวสูงวัย\n\n5 สัญญาณเตือนที่ต้องสังเกต: นั่งเบ่งบ่อยแต่ปัสสาวะออกเพียงหยดเล็กน้อย ร้องครางเจ็บปวดขณะปัสสาวะ ปัสสาวะมีสีชมพูหรือแดง (ปนเลือด) ฉี่นอกกระบะทราย และเลียอวัยวะเพศบ่อยผิดปกติ\n\nอันตรายวิกฤตในแมวตัวผู้: หากแมวตัวผู้ปัสสาวะไม่ออกเลยเกิน 24 ชั่วโมงถือเป็นภาวะฉุกเฉินสูงสุด เพราะท่อปัสสาวะที่แคบกว่าอาจอุดตันสมบูรณ์ ทำให้โพแทสเซียมสูงจนหัวใจหยุดเต้น ไตวายเฉียบพลัน และกระเพาะปัสสาวะแตกได้\n\nการป้องกัน: เพิ่มการดื่มน้ำโดยใช้น้ำพุแมวและอาหารเปียกเป็นหลัก ลดความเครียดด้วยสภาพแวดล้อมที่เป็นมิตร รักษาจำนวนกระบะทราย N+1 และใช้อาหารสูตร Urinary Diet ในแมวที่มีประวัตินิ่ว",
    sources: [
      { label: "Cornell Feline Health Center - Feline Lower Urinary Tract Disease", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center" },
      { label: "VCA Animal Hospitals - Feline Lower Urinary Tract Disease (FLUTD)", url: "https://vcahospitals.com/know-your-pet/feline-lower-urinary-tract-disease-flutd" },
      { label: "Merck Veterinary Manual - Feline Lower Urinary Tract Disease", url: "https://www.merckvetmanual.com/cat-owners/kidney-and-urinary-tract-disorders-of-cats/feline-lower-urinary-tract-disease-flutd" },
    ],
    faq: [],
  },
  {
    title: "โรคไตวายเรื้อรังในแมว (Chronic Kidney Disease): ภัยเงียบสะสมตัวที่ทาสแมวต้องรู้เท่าทัน",
    slug: "cat-chronic-kidney-disease",
    animal: "cat",
    categorySlug: "health",
    heroImageUrl: UNSPLASH("1574158622682-e40e69881006"),
    excerpt:
      "CKD เป็นสาเหตุการเจ็บป่วยและเสียชีวิตอันดับต้นๆ ของแมวสูงวัย มักก่อตัวเงียบเชียบจนไตเสียหายกว่า 75% แล้ว การสังเกตสัญญาณเตือนและดูแลอย่างเหมาะสมช่วยยืดอายุขัยและคุณภาพชีวิต",
    body:
      "แมวที่อายุมากกว่า 10 ปีมีโอกาสเป็น CKD สูงถึง 30-40% สาเหตุมาจากบรรพบุรุษแมวป่าในทะเลทรายที่วิวัฒนาการให้ดื่มน้ำน้อยและไตทำงานหนักมาก เมื่ออายุมากประกอบกับปัจจัยอื่นเช่น ความดันโลหิตสูง การติดเชื้อทางเดินปัสสาวะซ้ำ หรือพันธุกรรม ไตจึงเสื่อมเร็วขึ้น\n\n4 สัญญาณเตือนภัยเงียบ: กินน้ำบ่อยและปัสสาวะบ่อยผิดปกติ (Polydipsia & Polyuria) น้ำหนักลดและกล้ามเนื้อฝ่อโดยเฉพาะที่สันหลัง อาเจียนเป็นฟองและเซื่องซึมนอนทั้งวัน และกลิ่นปากผิดปกติคล้ายปัสสาวะ (จากสารยูเรียสะสม)\n\nการดูแล: น้ำคือหัวใจหลัก ให้อาหารเปียก วางชามน้ำหลายจุด หรือสัตวแพทย์อาจสอนให้น้ำเกลือใต้ผิวหนังที่บ้าน อาหารสูตรไตวาย (Renal Diet) จำกัดฟอสฟอรัสและมีโปรตีนคุณภาพสูงในปริมาณพอดีช่วยชะลอการเสื่อมได้อย่างมีนัยสำคัญ ตรวจสุขภาพทุก 6 เดือนสำหรับแมวอายุ 7 ปีขึ้นไป",
    sources: [
      { label: "Cornell Feline Health Center - Chronic Kidney Disease", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center" },
      { label: "VCA Animal Hospitals - Chronic Kidney Disease in Cats", url: "https://vcahospitals.com/know-your-pet/kidney-disease-chronic-in-cats" },
      { label: "International Renal Interest Society (IRIS) - IRIS Staging of CKD", url: "http://www.iris-kidney.com/guidelines/staging.html" },
    ],
    faq: [],
  },
  {
    title: "เมื่อแมวอ้วนไม่ใช่เรื่องตลก: เจาะลึกอันตรายจากภาวะน้ำหนักเกินและความเสี่ยงต่อสุขภาพ",
    slug: "cat-obesity-health-risks",
    animal: "cat",
    categorySlug: "health",
    heroImageUrl: UNSPLASH("1574158622682-e40e69881006"),
    excerpt:
      "แมวตัวกลมน่ารักบนโซเชียลมีเดียซ่อนความจริงทางการแพทย์ที่น่าตระหนก ภาวะอ้วนในแมวเพิ่มความเสี่ยงโรคเบาหวาน ข้ออักเสบ และตับวายเฉียบพลัน ทำให้อายุขัยสั้นลงเฉลี่ย 2-2.5 ปี",
    body:
      "แมวเลี้ยงมากกว่า 50-60% กำลังเผชิญภาวะน้ำหนักเกินหรืออ้วน เนื้อเยื่อไขมันไม่ใช่แค่ไขมันสะสม แต่หลั่งสารก่อการอักเสบเรื้อรังเข้ากระแสเลือดตลอดเวลา นำไปสู่โรคแทรกซ้อนร้ายแรงได้แก่ โรคเบาหวาน (แมวอ้วนเสี่ยงสูงกว่า 4 เท่า) โรคข้ออักเสบเสื่อม (กระดูกอ่อนสึกหรอจากน้ำหนักที่มากเกิน) และ Hepatic Lipidosis เฉียบพลันเมื่อแมวอดอาหารกะทันหัน\n\nประเมินด้วยตัวเองด้วย 3-Step Check: ลูบข้างลำตัว ในแมวปกติสัมผัสซี่โครงได้ง่ายไม่ต้องออกแรงกด มองจากด้านบนต้องเห็นช่วงเอวคอดเว้าชัดเจน และมองจากด้านข้างหน้าท้องต้องเชิดขึ้นเข้าหาสะโพก ไม่ย้อยยานลงมาขนานพื้น\n\nการลดน้ำหนักที่ปลอดภัย: ปรึกษาสัตวแพทย์เพื่อคำนวณพลังงานที่ต้องการ เป้าหมายลดเพียง 0.5-2% ต่อสัปดาห์ เปลี่ยนมาใช้อาหารสูตรลดน้ำหนักที่มีโปรตีนสูงและใยอาหารมาก งดอาหารแบบตั้งทิ้งตลอดวัน (Free Feeding) เปลี่ยนเป็นกำหนดมื้อชัดเจน และใช้ Puzzle Feeders กระตุ้นการเคลื่อนไหว ห้ามลดอาหารฮวบฮาบเด็ดขาดเพราะเสี่ยง Hepatic Lipidosis",
    sources: [
      { label: "Association for Pet Obesity Prevention (APOP)", url: "https://www.petobesityprevention.org/" },
      { label: "Cornell Feline Health Center - Obesity", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center" },
      { label: "VCA Animal Hospitals - Obesity in Cats", url: "https://vcahospitals.com/know-your-pet/obesity-in-cats" },
    ],
    faq: [],
  },
  // ── จัดมุมกระบะทราย (บทความเดิม) ──────────────────────────────────
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
  // ── สุนัข batch 2 ────────────────────────────────────────────────
  {
    title: "ทำความเข้าใจความก้าวร้าวในสุนัข: สัญญาณความกลัว ความกังวล และวิธีรับมืออย่างปลอดภัย",
    slug: "dog-aggression-causes",
    animal: "dog",
    categorySlug: "behavior",
    heroImageUrl: UNSPLASH("1518717758536-85ae29035b6d"),
    excerpt:
      "ความก้าวร้าวในสุนัขมักไม่ใช่นิสัยดุร้ายโดยกำเนิด แต่เป็นผลพวงจากความกลัว ความกังวล หรือความเจ็บปวด บทความนี้เจาะลึกสาเหตุ สัญญาณเตือนทางร่างกายที่เงียบเชียบ และแนวทางรับมืออย่างปลอดภัยโดยไม่ใช้ความรุนแรง",
    body:
      "ความก้าวร้าวในสุนัขเป็นพฤติกรรมตอบสนองต่อสิ่งเร้า ไม่ใช่ลักษณะนิสัย สาเหตุหลักแบ่งเป็น 4 ประเภท: ความก้าวร้าวจากความกลัว (สุนัขที่ไม่มีทางหนีจะหันมาสู้) การหวงแหนทรัพยากร (อาหาร ของเล่น ที่นอน หรือเจ้าของ) การปกป้องอาณาเขต และความเจ็บปวดทางร่างกาย (สุนัขที่ไม่เคยก้าวร้าวแต่อยู่ๆ แว้งกัดอาจกำลังเจ็บปวด)\n\nสัญญาณเตือนก่อนเกิดเหตุ: ร่างกายเกร็งแข็ง เลียริมฝีปากและหาวบ่อยโดยไม่ง่วง ดวงตาเบิกกว้างจนเห็นตาขาว (Whale Eye) หางตกหรือม้วนใต้ท้อง และหูลู่แนบหัว สุนัขแทบไม่เคยโจมตีโดยไม่มีการเตือนล่วงหน้า\n\nการรับมืออย่างถูกต้อง: ห้ามใช้การลงโทษทางร่างกายเพราะทำให้สุนัขยิ่งกลัวและก้าวร้าวมากขึ้น บันทึกสิ่งที่กระตุ้น (Triggers) แล้วจัดการสภาพแวดล้อมเพื่อหลีกเลี่ยงชั่วคราว ใช้ Counter-Conditioning ค่อยๆ เชื่อมโยงสิ่งเร้ากับประสบการณ์ดีเยี่ยม พาตรวจร่างกายก่อนเสมอ และปรึกษานักพฤติกรรมสัตว์เลี้ยงที่ใช้ Positive Reinforcement",
    sources: [
      { label: "ASPCA - Aggression", url: "https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/aggression" },
      { label: "APDT - Dog Aggression", url: "https://apdt.com/resource-center/dog-aggression/" },
      { label: "VCA Animal Hospitals - Aggression in Dogs", url: "https://vcahospitals.com/know-your-pet/aggression-in-dogs" },
    ],
    faq: [],
  },
  {
    title: "ทำไมสุนัขชอบขุดดิน? ถอดรหัสพฤติกรรมขุดและเทคนิคการปรับพฤติกรรมอย่างเข้าใจ",
    slug: "dog-digging-behavior",
    animal: "dog",
    categorySlug: "behavior",
    heroImageUrl: UNSPLASH("1530281700549-e82e7bf110d6"),
    excerpt:
      "สุนัขกับการขุดดินเป็นของคู่กันตามธรรมชาติ บทความนี้ถอดรหัสสัญชาตญาณการขุดทุกรูปแบบ ไม่ว่าจะเป็นการล่าสัตว์ การระบายความร้อน หรือการคลายเครียด พร้อมแนวทางแก้ไขด้วยวิธีเชิงบวก",
    body:
      "สุนัขขุดดินด้วย 4 เหตุผลหลัก: สัญชาตญาณนักล่า (โดยเฉพาะสายพันธุ์ Terrier และ Dachshund ที่ถูกบรีดมาเพื่อขุดรูไล่สัตว์) การปรับอุณหภูมิร่างกาย (ดินชั้นล่างเย็นกว่าในหน้าร้อน) การกักตุนของมีค่า (กระดูก ของเล่น) และความเบื่อหน่ายหรือ Separation Anxiety\n\nแนวทางปรับพฤติกรรม: สร้าง \"โซนขุดส่วนตัว\" เช่น กระบะทรายในมุมหนึ่งของบ้าน แล้วฝังของเล่นชิ้นโปรดไว้ให้ขุดหา ชมและให้รางวัลทันทีที่ขุดถูกจุด เพิ่มการออกกำลังกายและกิจกรรมฝึกสมอง (Puzzle Toys) เพื่อระบายพลังงาน และหากขุดเพื่อหาความเย็น ให้ตรวจสอบว่ามีร่มเงาและน้ำดื่มเพียงพอไหม\n\nห้ามทำโทษหลังจากเหตุการณ์ผ่านไปแล้ว เพราะสุนัขไม่สามารถเชื่อมโยงการลงโทษในปัจจุบันกับพฤติกรรมในอดีตได้ มีแต่จะสร้างความกลัวและความเครียดสะสม",
    sources: [
      { label: "AKC - Why Do Dogs Dig and How Can You Stop It?", url: "https://www.akc.org/expert-advice/training/why-do-dogs-dig/" },
      { label: "ASPCA - Digging", url: "https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/digging" },
      { label: "VCA Animal Hospitals - Dog Behavior Problems - Digging", url: "https://vcahospitals.com/know-your-pet/dog-behavior-problems-digging" },
    ],
    faq: [],
  },
  {
    title: "ทำไมสุนัขถึงหอน? ถอดรหัสพฤติกรรมดึกดำบรรพ์ของเพื่อนสี่ขา",
    slug: "dog-howling-reasons",
    animal: "dog",
    categorySlug: "behavior",
    heroImageUrl: UNSPLASH("1530281700549-e82e7bf110d6"),
    excerpt:
      "การหอนของสุนัขมีรากเหง้ามาจากบรรพบุรุษอย่างหมาป่า เสียงหอนยังคงทำหน้าที่เป็นภาษาสื่อสารความรู้สึก ความเครียด และอาการบาดเจ็บที่เจ้าของไม่ควรมองข้าม",
    body:
      "เสียงหอนของสุนัขเป็นรูปแบบการสื่อสารด้วยเสียง (Vocal Communication) ที่สืบทอดมาจากหมาป่า มี 5 เหตุผลหลัก: ตอบสนองต่อสิ่งเร้าทางเสียง เช่น ไซเรนหรือเสียงเครื่องดนตรีที่มีความถี่คล้ายเสียงหอน (หยุดเมื่อเสียงดับ) การระบุตำแหน่งและแสดงอาณาเขต (เรียกให้เจ้าของกลับมา) Separation Anxiety เมื่อต้องอยู่คนเดียว ความเจ็บปวดทางร่างกาย (สุนัขที่ปกติไม่หอนแต่อยู่ๆ หอนโดยไม่มีสาเหตุควรพาตรวจร่างกาย) และความตื่นเต้นเมื่อประสบความสำเร็จ\n\nวิธีรับมือกับการหอนที่มากเกินไป: หากเกิดจากความกังวล ให้ฝึก Desensitization ค่อยๆ ให้คุ้นเคยกับการอยู่คนเดียว และใช้ Puzzle Toys เบี่ยงเบนความสนใจ หากเกิดจากความเจ็บป่วยให้รีบพาพบสัตวแพทย์ ห้ามดุด่าหรือลงโทษเพราะจะยิ่งทำให้เครียดและหอนมากขึ้น",
    sources: [
      { label: "AKC - Why Do Dogs Howl?", url: "https://www.akc.org/expert-advice/training/why-do-dogs-howl/" },
      { label: "APDT - Understanding Canine Vocalizations", url: "https://apdt.com/resource-center/" },
      { label: "ASPCA - Separation Anxiety in Dogs", url: "https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/separation-anxiety" },
    ],
    faq: [],
  },
  {
    title: "เคล็ดลับการอาบน้ำสุนัขให้ขนสวยสุขภาพดี: ปลดล็อกเทคนิคกำจัดกลิ่นตัวและบำรุงผิวหนังอย่างล้ำลึก",
    slug: "dog-bathing-tips",
    animal: "dog",
    categorySlug: "daily-care",
    heroImageUrl: UNSPLASH("1591946614720-90a587da4a36"),
    excerpt:
      "การอาบน้ำสุนัขเป็นมากกว่าการทำความสะอาด แต่คือหัวใจสำคัญของสุขภาพผิวหนัง การใช้แชมพูของมนุษย์หรือการไดร์ขนไม่แห้งสนิทอาจทำร้ายสัตว์เลี้ยงโดยไม่ตั้งใจ",
    body:
      "ความถี่ในการอาบน้ำ: สุนัขขนสั้น (บีเกิล ปั๊ก ชิวาวา) อาบทุก 4-6 สัปดาห์ สุนัขขนยาวหรือขนสองชั้น (โกลเดน ฮัสกี) อาบทุก 6-8 สัปดาห์ และต้องเป่าขนชั้นในให้แห้งสนิท สุนัขที่มีปัญหาผิวหนังให้ทำตามคำแนะนำสัตวแพทย์\n\nทำไมห้ามใช้แชมพูของมนุษย์: ผิวหนังสุนัขมีค่า pH 6.2-7.5 (กลางถึงด่างอ่อน) ต่างจากของมนุษย์ที่ 5.2-5.5 (กรดอ่อน) แชมพูคนทำลายเกราะป้องกันผิวหนังตามธรรมชาติ ทำให้แบคทีเรียและเชื้อราเข้าสู่ผิวหนังได้ง่าย\n\nปกป้องจุดอ่อนไหว: อุดหูด้วยสำลีก้อนก่อนอาบน้ำทุกครั้ง เช็ดหน้าด้วยผ้าชุบน้ำแทนการฉีดน้ำใส่โดยตรง สุนัขขนยาวหรือขนสองชั้นต้องเป่าไดร์จนแห้งสนิท 100% โดยเฉพาะบริเวณซอกขาและใต้ท้อง ห้ามปล่อยให้แห้งเองเพราะความชื้นใต้ขนหนาจะก่อเชื้อราและกลิ่นอับ",
    sources: [
      { label: "AKC - How Often Should You Bathe Your Dog?", url: "https://www.akc.org/expert-advice/health/how-often-should-you-bathe-your-dog/" },
      { label: "VCA Animal Hospitals - Bathing and Grooming Your Dog", url: "https://vcahospitals.com/know-your-pet/bathing-and-grooming-your-dog" },
      { label: "ASPCA - Dog Grooming Tips", url: "https://www.aspca.org/pet-care/dog-care/dog-grooming-tips" },
    ],
    faq: [],
  },
  {
    title: "คู่มือตัดเล็บสุนัขด้วยตัวเองอย่างปลอดภัย: เปลี่ยนชั่วโมงแห่งความกลัวให้เป็นเรื่องง่าย",
    slug: "dog-nail-clipping-guide",
    animal: "dog",
    categorySlug: "daily-care",
    heroImageUrl: UNSPLASH("1516734212186-a967f81ad0d7"),
    excerpt:
      "การปล่อยให้เล็บสุนัขยาวเกินไปส่งผลเสียต่อโครงสร้างกระดูกและข้อต่ออย่างรุนแรง บทความนี้นำเสนอคู่มือตัดเล็บอย่างละเอียด ตั้งแต่การเข้าใจโครงสร้างเส้นเลือดในเล็บจนถึงวิธีลดความกลัว",
    body:
      "เล็บยาวเกินไปดันกระดูกนิ้วเท้าให้บิดงอทุกครั้งที่เดิน แรงกดผิดปกติไหลย้อนขึ้นข้อเท้า เข่า สะโพก และกระดูกสันหลัง ทำให้เกิดข้ออักเสบเรื้อรังในระยะยาว โดยเฉพาะสุนัขพันธุ์ใหญ่และสูงวัย\n\nทำความเข้าใจ Quick: เนื้อเยื่อสีชมพูแกนกลางเล็บที่มีเส้นเลือดและประสาท สุนัขเล็บสีอ่อนเห็นได้ชัด ให้ตัดห่างอย่างน้อย 2 มิลลิเมตร สุนัขเล็บดำให้เล็มทีละนิดจนเห็นจุดวงกลมสีเทาตรงกลางหน้าตัด นั่นคือสัญญาณใกล้ Quick ให้หยุดทันที\n\nลดความกลัวด้วย 4 ขั้น: วางกรรไกรไว้ข้างจานข้าวเพื่อสร้างความคุ้นเคยเชิงบวก ฝึกจับอุ้งเท้าและนวดนิ้วพร้อมให้รางวัล แตะกรรไกรที่เท้าและทำเสียงคลิกโดยยังไม่ตัด แล้วเริ่มตัดเล็บเดียวต่อวัน ถ้าเกิดอุบัติเหตุเลือดออกให้ใช้ผงห้ามเลือด (Styptic Powder) กดค้าง 30-60 วินาที",
    sources: [
      { label: "AKC - How to Clip a Dog's Nails Safely", url: "https://www.akc.org/expert-advice/health/how-to-clip-dog-nails-safely/" },
      { label: "WSU College of Veterinary Medicine - Clipping Your Dog's Nails", url: "https://www.vetmed.wsu.edu/outreach/pet-health-topics/categories/procedures/clipping-your-dogs-nails" },
      { label: "VCA Animal Hospitals - Trimming Your Dog's Nails", url: "https://vcahospitals.com/know-your-pet/trimming-your-dogs-nails" },
    ],
    faq: [],
  },
  {
    title: "การดูแลสุนัขสูงวัย: ปรับบ้าน ปรับโภชนาการ และดูแลจิตใจเพื่อนยากในวัยไม้ใกล้ฝั่ง",
    slug: "senior-dog-care",
    animal: "dog",
    categorySlug: "daily-care",
    heroImageUrl: UNSPLASH("1516734212186-a967f81ad0d7"),
    excerpt:
      "การดูแลสุนัขสูงวัยต้องการความละเอียดอ่อนและการปรับเปลี่ยนทั้งด้านโภชนาการ สภาพแวดล้อมในบ้าน และการดูแลสุขภาพเป็นพิเศษ เพื่อให้พวกเขาใช้ชีวิตช่วงบั้นปลายอย่างสุขสบาย",
    body:
      "สุนัขเข้าสู่วัยชราต่างกันตามขนาด: พันธุ์เล็ก (น้ำหนักต่ำกว่า 10 กก.) อายุ 9-11 ปี พันธุ์กลาง 7-8 ปี พันธุ์ใหญ่และยักษ์เพียง 5-6 ปีเท่านั้น เนื่องจากกระบวนการเสื่อมของเซลล์เร็วกว่า\n\nการเปลี่ยนแปลงที่ต้องเผชิญ: โรคข้อเสื่อม (ลุกนั่งลำบาก ไม่อยากขึ้นบันได) ประสาทสัมผัสเสื่อม (ต้อกระจก หูตึง) และภาวะสมองเสื่อม (CCD) ที่ทำให้สับสนหลงทิศทาง ร้องไร้สาเหตุกลางดึก\n\nปรับบ้านให้เหมาะสม: ปูแผ่นยางกันลื่นตามทางเดิน เปลี่ยนที่นอนเป็น Memory Foam รองรับข้อต่อ ติดตั้งทางลาดแทนการกระโดดขึ้นเตียงหรือรถ\n\nโภชนาการและการดูแล: อาหารสูตร Senior มีแคลอรีต่ำแต่โปรตีนคุณภาพสูง เสริมกลูโคซามีน คอนดรอยติน และ Omega-3 จากน้ำมันปลา ตรวจสุขภาพทุก 6 เดือนแทนปีละครั้ง รวมถึงดูแลสุขภาพช่องปากอย่างสม่ำเสมอ",
    sources: [
      { label: "AKC - Caring for a Senior Dog", url: "https://www.akc.org/expert-advice/health/caring-for-a-senior-dog/" },
      { label: "Cornell University - The Special Needs of the Senior Dog", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-topics/special-needs-senior-dog" },
      { label: "VCA Animal Hospitals - Senior Dog Care", url: "https://vcahospitals.com/know-your-pet/senior-dog-care-special-considerations" },
    ],
    faq: [],
  },
  {
    title: "คู่มือการแปรงฟันสุนัขอย่างถูกวิธี ป้องกันหินปูนและกลิ่นปากกวนใจ",
    slug: "dog-teeth-cleaning",
    animal: "dog",
    categorySlug: "daily-care",
    heroImageUrl: UNSPLASH("1516734212186-a967f81ad0d7"),
    excerpt:
      "ปัญหากลิ่นปากและโรคเหงือกอักเสบในสุนัขไม่เพียงน่ารำคาญ แต่สามารถนำไปสู่โรคหัวใจและโรคไตในระยะยาว การแปรงฟันอย่างสม่ำเสมอช่วยยืดอายุสัตว์เลี้ยงได้จริง",
    body:
      "สุนัขมากกว่า 80% ที่อายุเกิน 3 ปีมีสัญญาณโรคช่องปาก (Periodontal Disease) จากคราบแบคทีเรียและหินปูนสะสม ไม่มีอะไรทดแทนการแปรงฟันด้วยแปรงได้\n\nอุปกรณ์ที่ถูกต้อง: ห้ามใช้ยาสีฟันคนเด็ดขาดเพราะมี Fluoride, Xylitol และ SLS ที่เป็นพิษต่อสุนัข เลือกยาสีฟันสุนัขที่กลืนได้และแต่งกลิ่นเนื้อหรือไก่ ใช้แปรงสองหัวแบบด้ามยาวหรือแปรงสวมนิ้วสำหรับสุนัขพันธุ์เล็ก\n\nฝึกแบบค่อยเป็นค่อยไปใน 7 วัน: วันที่ 1-2 ให้เลียยาสีฟันจากนิ้ว วันที่ 3-4 ใช้นิ้วถูฟันเบาๆ วันที่ 5-6 ให้เลียจากแปรง วันที่ 7 เริ่มแปรงจริง แปรงทำมุม 45 องศากับแนวเหงือก วนเป็นวงกลมเล็กๆ เน้นผิวฟันด้านนอกซึ่งหินปูนสะสมมากที่สุด เป้าหมายคือแปรงทุกวัน หรืออย่างน้อยสัปดาห์ละ 3-4 ครั้ง ให้รางวัลหลังแปรงเสมอ",
    sources: [
      { label: "Veterinary Oral Health Council (VOHC)", url: "https://vohc.org" },
      { label: "AVMA - Pet Dental Care", url: "https://www.avma.org" },
      { label: "WSAVA - Global Dental Guidelines", url: "https://wsava.org" },
    ],
    faq: [],
  },
  {
    title: "สุนัขกินข้าวคลุกดีจริงหรือ? เจาะลึกความจริงเรื่องโภชนาการและอันตรายที่แฝงอยู่",
    slug: "dog-rice-food-truth",
    animal: "dog",
    categorySlug: "food",
    heroImageUrl: UNSPLASH("1568640347023-a616a30bc3bd"),
    excerpt:
      "ข้าวคลุกอาหารยอดฮิตในครัวเรือนไทยอาจไม่ใช่คำตอบที่ดีสำหรับสุนัขในระยะยาว บทความนี้เจาะลึกความเสี่ยงของการขาดแคลเซียม อันตรายจากโซเดียมสะสม และแนวทางเปลี่ยนผ่านสู่โภชนาการที่สมดุล",
    body:
      "สุนัขชอบข้าวคลุกเพราะกลิ่นโปรตีนและไขมันที่คลุกเข้ากัน แต่ไม่ใช่เพราะข้าวเอง ปัญหาทางโภชนาการที่ซ่อนอยู่มี 3 ด้านหลัก: คาร์โบไฮเดรตล้นเกิน (ข้าวขาวแปลงเป็นไขมันสะสม เสี่ยงอ้วนและเบาหวาน) ภาวะขาดแคลเซียม (สูตรข้าวคลุกตับมีฟอสฟอรัสสูงมากแต่แทบไม่มีแคลเซียม ฮอร์โมนพาราไทรอยด์จึงดึงแคลเซียมออกจากกระดูก ทำให้กระดูกบางเปราะในลูกสุนัข) และขาดวิตามินและแร่ธาตุจำเป็น\n\nอันตรายแฝงจากวิธีทำ: ปรุงด้วยน้ำปลา ซีอิ๊ว หรือเกลือทำให้ได้โซเดียมสูงมาก ไตสุนัขไม่ถูกออกแบบมารองรับ สะสมนานๆ นำสู่โรคไตวายเรื้อรัง อาหารนุ่มเหลวทำให้คราบหินปูนสะสมเร็ว และก้างปลาที่แกะไม่หมดอาจทิ่มแทงทางเดินอาหาร\n\nการเปลี่ยนผ่าน: ผสมอาหารเม็ดเกรดคุณภาพ (มาตรฐาน AAFCO) เข้ากับข้าวคลุกเดิมในสัดส่วน 25:75 แล้วค่อยๆ เพิ่มในระยะ 7-10 วัน ไม่เปลี่ยนกะทันหันเพราะสุนัขอาจท้องเสีย",
    sources: [
      { label: "AAFCO - Dog and Cat Food Nutrient Profiles", url: "https://www.aafco.org/resources/pet-food-labels/understanding-the-guaranteed-analysis/" },
      { label: "AKC - Homemade Dog Food: Is it Healthy?", url: "https://www.akc.org/expert-advice/nutrition/cooking-for-your-dog-homemade-dog-food-nutritional-information/" },
      { label: "VCA Animal Hospitals - Nutrition - General Feeding Guidelines for Dogs", url: "https://vcahospitals.com/know-your-pet/nutrition-general-feeding-guidelines-for-dogs" },
    ],
    faq: [],
  },
  {
    title: "5 อาหารอันตรายที่เป็นพิษต่อสุนัขที่เจ้าของต้องระวังเป็นพิเศษ",
    slug: "dog-toxic-foods",
    animal: "dog",
    categorySlug: "food",
    heroImageUrl: UNSPLASH("1568640347023-a616a30bc3bd"),
    excerpt:
      "อาหารบางประเภทที่มนุษย์กินเป็นปกติอาจเป็นอันตรายถึงชีวิตเมื่อสุนัขรับประทานเข้าไป การรู้ว่าสิ่งใดเป็นสารพิษต่อสุนัขช่วยป้องกันอุบัติเหตุในบ้านได้อย่างตรงจุด",
    body:
      "5 อาหารอันตรายที่ห้ามให้สุนัขเด็ดขาด:\n\n1. ช็อกโกแลต: มีธีโอบรอมีน (Theobromine) ที่สุนัขย่อยสลายได้ช้ามาก ทำให้หัวใจเต้นผิดจังหวะ สั่น ชัก และอาจเสียชีวิต ดาร์กช็อกโกแลตอันตรายกว่าช็อกโกแลตนมหลายเท่า\n\n2. องุ่นและลูกเกด: แม้กินเพียงไม่กี่ลูกก็ทำให้ไตวายเฉียบพลันได้ สัตวแพทย์ยังหาสารพิษเฉพาะไม่ได้ ต้องระวังเป็นพิเศษ\n\n3. หอมหัวใหญ่ กระเทียม และต้นหอม: สารออร์กาโนซัลเฟอร์ทำลายเม็ดเลือดแดงจนเกิดโลหิตจาง อาการอาจไม่แสดงทันทีแต่จะปรากฏชัดใน 2-3 วัน\n\n4. ไซลิทอล (Xylitol): สารให้ความหวานในหมากฝรั่ง ลูกอม และเนยถั่วบางยี่ห้อ กระตุ้นอินซูลินหลั่งรุนแรงจนน้ำตาลในเลือดตกวิกฤตและตับวาย อาการภายในไม่กี่สิบนาที\n\n5. แอลกอฮอล์และแป้งโดว์ดิบ: แอลกอฮอล์เป็นพิษต่อสมองและตับ ยีสต์ในแป้งดิบหมักตัวในกระเพาะผลิตแอลกอฮอล์และก๊าซจนกระเพาะขยายอันตราย หากสุนัขกินสิ่งเหล่านี้ให้รีบนำส่งสัตวแพทย์ทันที",
    sources: [
      { label: "ASPCA Animal Poison Control Center", url: "https://www.aspca.org/pet-care/animal-poison-control" },
      { label: "Pet Poison Helpline - Top 10 Pet Poisons", url: "https://www.petpoisonhelpline.com" },
      { label: "FDA - Paws Off Xylitol; It's Dangerous for Dogs", url: "https://www.fda.gov" },
    ],
    faq: [],
  },
  {
    title: "อาหารเปียก vs อาหารเม็ด สำหรับสุนัข: เปรียบเทียบข้อดีข้อเสีย เลือกอย่างไรให้เหมาะกับเจ้าตูบ",
    slug: "dog-wet-vs-dry-food",
    animal: "dog",
    categorySlug: "food",
    heroImageUrl: UNSPLASH("1568640347023-a616a30bc3bd"),
    excerpt:
      "ไม่มีคำตอบตายตัวว่าแบบไหนดีกว่า บทความนี้เปรียบเทียบจุดเด่นของอาหารเม็ด (ดูแลฟัน ความคุ้มค่า) กับอาหารเปียก (ความน่ากิน การเติมน้ำ) และแนะนำวิธีผสมผสานที่ลงตัวตามช่วงวัย",
    body:
      "อาหารเม็ดมีความชื้นต่ำ (ประมาณ 10%) ข้อดีหลักคือช่วยขัดคราบพลักและหินปูนเมื่อเคี้ยว เก็บได้นานไม่ต้องแช่เย็น ประหยัดกว่าเมื่อเทียบปริมาณสารอาหาร แต่สุนัขที่ดื่มน้ำน้อยอาจได้รับน้ำไม่เพียงพอ\n\nอาหารเปียกมีความชื้น 70-80% กลิ่นและรสสัมผัสดึงดูดใจกว่ามาก เหมาะกับสุนัขที่กินยากหรือป่วย ช่วยเติมน้ำเข้าร่างกายโดยอ้อม และเคี้ยวง่ายสำหรับสุนัขสูงวัยที่มีปัญหาฟัน แต่บูดเร็วหลังเปิด ราคาสูงกว่า และไม่ช่วยขัดฟัน\n\nการผสมผสาน (Mixed Feeding): ใช้อาหารเม็ดเป็นหลักเพื่อดูแลฟัน และใช้อาหารเปียกเป็น Topper เพื่อกระตุ้นความอยากอาหาร โดยต้องควบคุมแคลอรีรวมไม่ให้เกินความต้องการ ลูกสุนัขเน้นเม็ด สุนัขโตเลือกตามพฤติกรรม สุนัขสูงวัยเน้นเปียกเนื่องจากเคี้ยวง่ายและได้รับน้ำมากขึ้น",
    sources: [
      { label: "AKC - Wet Dog Food vs. Dry Dog Food: Which Is Better?", url: "https://www.akc.org/expert-advice/nutrition/wet-dog-food-vs-dry-dog-food/" },
      { label: "VCA Animal Hospitals - Dry vs. Wet Food: Which is Better for My Dog?", url: "https://vcahospitals.com/know-your-pet/dry-vs-wet-food-which-is-better-for-my-dog" },
      { label: "Tufts University - Deciding between wet and dry food for your pet", url: "https://vetnutrition.tufts.edu/2019/12/deciding-between-wet-and-dry-food-for-your-pet/" },
    ],
    faq: [],
  },
  {
    title: "อาการไข้ในสุนัขและวิธีสังเกตอาการเบื้องต้นที่เจ้าของควรรู้",
    slug: "dog-fever-symptoms",
    animal: "dog",
    categorySlug: "health",
    heroImageUrl: UNSPLASH("1587300003388-59208cc962cb"),
    excerpt:
      "อาการตัวร้อนในสุนัขเป็นสัญญาณเตือนที่ร่างกายกำลังต่อสู้กับสิ่งผิดปกติ เรียนรู้วิธีสังเกตอาการ วัดไข้อย่างถูกต้อง และดูแลเบื้องต้นก่อนส่งตัวให้สัตวแพทย์",
    body:
      "อุณหภูมิปกติของสุนัขอยู่ที่ 37.5-39.2°C (99.5-102.5°F) สูงกว่ามนุษย์ ดังนั้นการใช้มือสัมผัสจึงไม่เพียงพอในการยืนยันว่ามีไข้\n\nสัญญาณเตือนที่ควรสังเกต: ซึม นอนมากกว่าปกติ เบื่ออาหาร ตัวร้อนขึ้นเมื่อสัมผัสบริเวณท้องหรือข้อพับ จมูกแห้งร้อน หายใจหอบถี่โดยไม่ได้ออกกำลังกาย ตาแดงหรืออ่อนล้า และมีอาการสั่น\n\nวิธีวัดไข้ที่แม่นยำ: ใช้เทอร์โมมิเตอร์ดิจิทัลวัดทางทวารหนัก ทาสารหล่อลื่นที่ปลาย สอดเข้าลึก 1-1.5 นิ้ว (พันธุ์ใหญ่) หรือ 0.5 นิ้ว (พันธุ์เล็ก) ถ้าอุณหภูมิเกิน 39.4°C ควรเฝ้าระวัง เกิน 41.1°C ถือเป็นไข้สูงวิกฤตต้องนำส่งโรงพยาบาลสัตว์ทันที\n\nการปฐมพยาบาลเบื้องต้น: เช็ดตัวด้วยผ้าชุบน้ำอุณหภูมิห้อง (ห้ามใช้น้ำเย็นจัดหรือน้ำแข็ง) กระตุ้นให้ดื่มน้ำทีละน้อย และห้ามให้ยาพาราเซตามอลหรือยาแก้ไข้ของคนเด็ดขาด เพราะเป็นพิษร้ายแรงต่อสุนัข",
    sources: [
      { label: "AVMA - Fever in Dogs", url: "https://www.avma.org/" },
      { label: "Merck Veterinary Manual - Fever and Hyperthermia in Dogs", url: "https://www.merckvetmanual.com" },
      { label: "VCA Animal Hospitals - Fever of Unknown Origin in Dogs", url: "https://vcahospitals.com/know-your-pet/fever-of-unknown-origin-in-dogs" },
    ],
    faq: [],
  },
  {
    title: "โรคพยาธิหนอนหัวใจในสุนัข: ป้องกันดีกว่ารักษา กับภัยร้ายที่ยุงร้ายนำพามา",
    slug: "dog-heartworm-prevention",
    animal: "dog",
    categorySlug: "health",
    heroImageUrl: UNSPLASH("1587300003388-59208cc962cb"),
    excerpt:
      "โรคพยาธิหนอนหัวใจมียุงเป็นพาหะและอาจนำไปสู่หัวใจล้มเหลว บทความนี้อธิบายกลไกการติดต่อ อาการเตือน และเหตุผลว่าทำไมการป้องกันรายเดือนจึงดีกว่าการรักษาซึ่งอันตรายและซับซ้อนมาก",
    body:
      "พยาธิหนอนหัวใจ (Dirofilaria immitis) ถูกส่งผ่านยุงที่กัดสุนัขที่มีเชื้อ ตัวอ่อนพัฒนาในยุง 10-14 วัน แล้วเข้าสู่สุนัขใหม่ผ่านบาดแผลจากการกัด ใช้เวลา 6-7 เดือนเดินทางไปปักหลักที่เส้นเลือดแดงปอดและหัวใจห้องขวา พยาธิตัวเต็มวัยยาวถึง 10-12 นิ้ว มีชีวิตอยู่ในร่างกาย 5-7 ปี\n\nอาการตามลำดับความรุนแรง: ไอแห้งเรื้อรังหลังออกกำลังกาย เหนื่อยง่ายอย่างเห็นได้ชัด น้ำหนักลดและเบื่ออาหาร ท้องมานจากหัวใจล้มเหลว และ Caval Syndrome ซึ่งเป็นภาวะวิกฤตเสียชีวิตเฉียบพลัน\n\nทำไมการรักษาถึงอันตราย: ต้องใช้ยาฉีดสารประกอบสารหนูฆ่าพยาธิ แต่ซากพยาธิจะอุดตันเส้นเลือดฝอยในปอด (Pulmonary Thromboembolism) หากสุนัขตื่นเต้นหรือวิ่งเล่น กระแสเลือดที่แรงขึ้นอาจพัดซากไปอุดตันจนเสียชีวิตทันที ต้องกักบริเวณเข้มงวดหลายเดือน ป้องกันรายเดือนด้วยยาเม็ดหรือยาหยดหลังจึงดีกว่าอย่างชัดเจน",
    sources: [
      { label: "American Heartworm Society - Heartworm in Dogs", url: "https://www.heartwormsociety.org/pet-owner-resources/heartworm-in-dogs" },
      { label: "AKC - Heartworm in Dogs: Symptoms, Diagnosis, Treatment, and Prevention", url: "https://www.akc.org/expert-advice/health/heartworm-in-dogs-symptoms-diagnosis-treatment-prevention/" },
      { label: "VCA Animal Hospitals - Heartworm Disease in Dogs", url: "https://vcahospitals.com/know-your-pet/heartworm-disease-in-dogs" },
    ],
    faq: [],
  },
  {
    title: "ภาวะหมดสติจากความร้อน (Heatstroke) ในสุนัข: ภัยเงียบช่วงหน้าร้อนที่ผู้ปกครองต้องระวัง",
    slug: "dog-heatstroke-emergency",
    animal: "dog",
    categorySlug: "health",
    heroImageUrl: UNSPLASH("1587300003388-59208cc962cb"),
    excerpt:
      "ฮีทสโตรกเป็นภาวะฉุกเฉินที่เกิดขึ้นรวดเร็วและอันตรายถึงชีวิต บทความนี้อธิบายว่าทำไมสุนัขระบายความร้อนได้ยาก สัญญาณเตือนภัยที่ต้องจำ และคู่มือปฐมพยาบาลอย่างถูกวิธี",
    body:
      "สุนัขไม่มีต่อมเหงื่อทั่วตัวเหมือนมนุษย์ มีเพียงที่อุ้งเท้า กลไกหลักในการระบายความร้อนคือการหอบหายใจ (Panting) เพื่อแลกเปลี่ยนความร้อนผ่านลิ้นและน้ำลาย เมื่ออุณหภูมิสูงเกิน 39.4°C ระบบควบคุมความร้อนล้มเหลว อวัยวะภายในถูกทำลายและอาจเสียชีวิตภายในไม่กี่นาที สุนัขกลุ่มเสี่ยงสูงคือพันธุ์หน้าสั้น (ปั๊ก บูลด็อก ชิสุ) ขนหนาสองชั้น (ฮัสกี โกลเดน) และสุนัขอ้วน\n\nสัญญาณเตือนตามลำดับ: หอบรุนแรง น้ำลายเหนียวข้น เหงือกแดงจัดหรือแดงอมม่วง สับสนมึนงงทรงตัวไม่ได้ อาเจียนหรือท้องเสีย และชักหรือหมดสติ\n\nปฐมพยาบาลเบื้องต้น: ย้ายเข้าที่ร่มและเย็นทันที ใช้น้ำธรรมดา (ไม่ใช่น้ำแข็ง) ชโลมตัวบริเวณท้อง ขาหนีบ และอุ้งเท้า ใช้พัดลมช่วยเป่า ให้จิบน้ำทีละน้อยถ้ายังมีสติ วัดอุณหภูมิเรื่อยๆ หยุดลดความร้อนเมื่ออุณหภูมิลงมาถึง 39.4°C เพื่อป้องกัน Hypothermia แล้วรีบส่งสัตวแพทย์ทันทีแม้อาการดีขึ้นแล้ว",
    sources: [
      { label: "AKC - Heat Stroke in Dogs: Signs, Symptoms, and Prevention", url: "https://www.akc.org/expert-advice/health/heatstroke-in-dogs/" },
      { label: "VCA Animal Hospitals - Heat Stroke in Dogs", url: "https://vcahospitals.com/know-your-pet/heat-stroke-in-dogs" },
      { label: "Merck Veterinary Manual - Heatstroke in Animals", url: "https://www.merckvetmanual.com/emergency-medicine-and-critical-care/heatstroke/heatstroke-in-animals" },
    ],
    faq: [],
  },
  {
    title: "ข้อสะโพกเสื่อมในสุนัขพันธุ์ใหญ่: สังเกตอาการและแนวทางการดูแลเพื่อคุณภาพชีวิตที่ดีขึ้น",
    slug: "dog-hip-dysplasia",
    animal: "dog",
    categorySlug: "health",
    heroImageUrl: UNSPLASH("1587300003388-59208cc962cb"),
    excerpt:
      "โรคข้อสะโพกเสื่อมในสุนัขพันธุ์ใหญ่ส่งผลต่อโครงสร้างกระดูกและข้อต่ออย่างรุนแรง บทความนี้รวบรวมสาเหตุ อาการสำคัญเช่นท่าเดินกระต่าย และแนวทางดูแลแบบองค์รวมเพื่อยกระดับคุณภาพชีวิต",
    body:
      "ข้อสะโพกปกติทำงานแบบ Ball and Socket ที่หัวกระดูกต้นขาสวมพอดีกับเบ้าสะโพก ในสุนัขที่เป็นโรคนี้ โครงสร้างเจริญเติบโตไม่สมดุล เบ้าตื้นเกินไปหรือหัวกระดูกหลวม เกิดการเสียดสีจนกระดูกอ่อนสึกหรอและเกิดข้ออักเสบเรื้อรัง สายพันธุ์เสี่ยงสูง ได้แก่ โกลเดน ลาบราดอร์ เยอรมันเชพเพิร์ด และร็อตไวเลอร์\n\nสัญญาณที่ควรสังเกต: ลุกขึ้นยากหลังนอน ท่าเดินกระต่ายสองขา (Bunny Hopping) ที่รวบขาหลังทั้งสองข้างกระโดดพร้อมกัน ไม่อยากขึ้นบันไดหรือกระโดดขึ้นรถ กล้ามเนื้อขาหลังลีบแบนและหน้าอกหนาขึ้น และมีเสียงกระดูกลั่นขณะเดิน\n\nการดูแลแบบองค์รวม: ควบคุมน้ำหนักคือสิ่งสำคัญที่สุด ลดแม้เพียง 5-10% ช่วยลดความเจ็บปวดได้มาก เสริมกลูโคซามีน คอนดรอยติน MSM และ Omega-3 ออกกำลังกายแบบแรงกระแทกต่ำเช่นเดินช้าๆ หรือว่ายน้ำ (Hydrotherapy) ปูพรมกันลื่นในบ้านและใช้ที่นอน Orthopedic Foam หากอาการรุนแรงสัตวแพทย์อาจพิจารณาผ่าตัดเปลี่ยนข้อสะโพกเทียม (THR)",
    sources: [
      { label: "AKC - Hip Dysplasia in Dogs", url: "https://www.akc.org/expert-advice/health/hip-dysplasia-in-dogs/" },
      { label: "Cornell University - Hip Dysplasia", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-topics/hip-dysplasia" },
      { label: "VCA Animal Hospitals - Hip Dysplasia in Dogs", url: "https://vcahospitals.com/know-your-pet/hip-dysplasia-in-dogs" },
    ],
    faq: [],
  },
  {
    title: "โรคเยื่อบุช่องท้องอักเสบในแมว (FIP): ภัยจากโคโรนาไวรัสกลายพันธุ์และความหวังใหม่ในการรักษา",
    slug: "cat-fip-coronavirus",
    animal: "cat",
    categorySlug: "health",
    heroImageUrl: UNSPLASH("1574158622682-e40e69881006"),
    excerpt:
      "FIP เคยเป็นโรคร้ายที่รักษาไม่หายและมีอัตราการเสียชีวิตเกือบ 100% จากการกลายพันธุ์ของโคโรนาไวรัสในลำไส้แมว บทความนี้อธิบายความต่างของ FIP แบบเปียกและแบบแห้ง ความท้าทายในการวินิจฉัย และการปฏิวัติการรักษาด้วยยาต้านไวรัส GS-441524",
    body:
      "โรคเยื่อบุช่องท้องอักเสบในแมว (Feline Infectious Peritonitis หรือ FIP) เคยเป็นหนึ่งในโรคที่สร้างความหวาดกลัวให้ผู้เลี้ยงแมวมากที่สุด เพราะมักเกิดขึ้นรวดเร็ว รุนแรง และเกือบทั้งหมดลงเอยด้วยการเสียชีวิต แต่ปัจจุบันวิทยาการทางสัตวแพทย์ก้าวหน้าขึ้นมาก จนมีความหวังใหม่ในการรักษาให้หายขาดได้\n\nต้นตอของ FIP เริ่มจากโคโรนาไวรัสในลำไส้แมว (Feline Enteric Coronavirus: FCoV) ซึ่งเป็นไวรัสที่พบบ่อยมาก โดยเฉพาะบ้านที่เลี้ยงแมวหลายตัวหรือในสถานสงเคราะห์ แมวส่วนใหญ่ที่ติด FCoV มักไม่แสดงอาการหรือมีเพียงท้องเสียเล็กน้อยแล้วหายเอง แต่ในแมวประมาณ 5-10% เชื้อจะกลายพันธุ์ภายในตัวแมวเองจนกลายเป็นเชื้อ FIP ที่แทรกเข้าไปในเซลล์เม็ดเลือดขาวมาโครฟาจและแพร่กระจายไปทั่วร่างกาย กระตุ้นการอักเสบรุนแรงในหลอดเลือดและอวัยวะต่างๆ\n\nปัจจัยกระตุ้นการกลายพันธุ์มักเกี่ยวข้องกับภูมิคุ้มกัน ความเครียด (เช่น ย้ายบ้าน ทำหมัน เปลี่ยนสิ่งแวดล้อม) และพันธุกรรม พบมากที่สุดในลูกแมวอายุต่ำกว่า 2 ปี\n\nFIP แสดงอาการได้ 2 รูปแบบหลัก แบบเปียก (Wet form) พบบ่อยที่สุดราว 60-70% เกิดจากการอักเสบทำให้ผนังหลอดเลือดเสียหายและมีของเหลวโปรตีนสูงรั่วสะสมในช่องท้องหรือช่องอก แมวจะท้องมานขึ้นเรื่อยๆ หายใจลำบาก มีไข้สูงที่ไม่ลดด้วยยาปฏิชีวนะ ซึม เบื่ออาหาร และน้ำหนักลดเร็ว\n\nส่วนแบบแห้ง (Dry form) วินิจฉัยยากกว่าเพราะไม่มีของเหลวสะสม แต่เกิดปุ่มเนื้ออักเสบตามอวัยวะเช่น ไต ตับ สมอง และดวงตา อาการขึ้นกับอวัยวะที่ถูกทำลาย อาจมีอาการทางระบบประสาท (เดินเซ ขาหลังอ่อนแรง ชัก หัวเอียง) หรืออาการทางตา (ม่านตาเปลี่ยนสี ตาขุ่น เลือดออกในลูกตา ตาบอดเฉียบพลัน)\n\nการวินิจฉัยทำได้ยาก ไม่มีการตรวจวิธีใดชี้ชัด 100% สัตวแพทย์ต้องประกอบหลักฐานหลายอย่าง เช่น ผลเลือดที่พบโลหิตจาง ค่าโกลบูลินสูงทำให้อัตราส่วน A:G ต่ำกว่า 0.4-0.6 การตรวจของเหลวที่เจาะได้ (สีเหลืองฟางข้าว เหนียวหนืด โปรตีนสูง Rivalta test เป็นบวก) การตรวจ RT-PCR และการตัดชิ้นเนื้อตรวจทางพยาธิวิทยาซึ่งแม่นยำที่สุดแต่ทำได้ยากในแมวที่อ่อนแอ\n\nจุดเปลี่ยนสำคัญคือการค้นพบยาต้านไวรัส GS-441524 (สารเมตาโบไลต์ของ Remdesivir) จากงานวิจัยของ Dr. Niels Pedersen แห่ง UC Davis ซึ่งยับยั้งการจำลองตัวของไวรัสได้อย่างมีประสิทธิภาพ การรักษาช่วยให้แมวหายจาก FIP ได้สูงถึง 80-90% จากเดิมที่แทบเป็นศูนย์ มาตรฐานการรักษาต้องให้ยาต่อเนื่องอย่างน้อย 84 วัน (12 สัปดาห์) โดยไม่หยุดยา ร่วมกับการติดตามผลเลือดอย่างใกล้ชิด อาการแบบแห้งที่มีอาการทางประสาทหรือทางตาต้องใช้ขนาดยาสูงขึ้นเพื่อให้ผ่านด่านกั้นเลือดและสมอง ปัจจุบันยานี้ใช้รักษาได้อย่างถูกกฎหมายในหลายประเทศรวมถึงไทย\n\nแม้มีความหวังใหม่ แต่การป้องกันยังสำคัญที่สุด ควรดูแลสุขอนามัยในบ้าน หลีกเลี่ยงความแออัดของจำนวนแมว ทำความสะอาดกระบะทรายสม่ำเสมอเพื่อลดการสะสมของ FCoV และลดความเครียด หากพบอาการผิดปกติเช่น ท้องบวม น้ำหนักลดไม่ทราบสาเหตุ หรือเดินเซ ควรรีบพาไปพบสัตวแพทย์ เพราะยิ่งตรวจพบและเริ่มรักษาเร็ว โอกาสรอดยิ่งสูง",
    sources: [
      { label: "Cornell Feline Health Center - Feline Infectious Peritonitis (FIP)", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feline-infectious-peritonitis" },
      { label: "AAFP - 2022 AAFP/EveryCat FIP Diagnosis Guidelines", url: "https://catvets.com/guidelines/practice-guidelines/fip-guidelines" },
      { label: "VCA Animal Hospitals - Feline Infectious Peritonitis (FIP)", url: "https://vcahospitals.com/know-your-pet/feline-infectious-peritonitis" },
    ],
    faq: [],
  },
  {
    title: "โรคเอดส์แมว (FIV) และลูคีเมียแมว (FeLV): การติดต่อ การป้องกัน และการดูแลให้อายุยืน",
    slug: "cat-fiv-felv-retrovirus",
    animal: "cat",
    categorySlug: "health",
    heroImageUrl: UNSPLASH("1574158622682-e40e69881006"),
    excerpt:
      "FIV และ FeLV เป็นโรคติดเชื้อไวรัสในระบบภูมิคุ้มกันของแมวที่ผู้เลี้ยงทุกคนควรรู้จัก บทความนี้เจาะลึกความต่างของสองโรค กลไกการแพร่เชื้อ อาการของภาวะภูมิคุ้มกันบกพร่อง แนวทางป้องกัน และวิธีดูแลแมวที่ติดเชื้อให้มีคุณภาพชีวิตที่ดีและอายุยืน",
    body:
      "โรคเอดส์แมว (Feline Immunodeficiency Virus: FIV) และโรคลูคีเมียแมว (Feline Leukemia Virus: FeLV) เป็นไวรัสกลุ่มเรโทรไวรัสที่ส่งผลต่อระบบภูมิคุ้มกันของแมว แม้กระทบภูมิคุ้มกันเหมือนกัน แต่มีกลไกการติดต่อ อาการ และความรุนแรงต่างกันอย่างสิ้นเชิง การเข้าใจธรรมชาติของโรคช่วยให้ปกป้องแมวได้ถูกต้อง\n\nFIV มีพฤติกรรมคล้ายเชื้อ HIV ในมนุษย์ โดยค่อยๆ ทำลายเม็ดเลือดขาวชนิด T-helper (CD4+) ทำให้ภูมิคุ้มกันลดลงตามเวลา แมวที่ติด FIV มักใช้ชีวิตปกติได้นานหลายปีก่อนเข้าสู่ระยะท้าย ส่วน FeLV รุนแรงกว่า เพราะแทรกเข้าถึงไขกระดูก รบกวนการสร้างเม็ดเลือด ทำให้เกิดภาวะโลหิตจางรุนแรงและเพิ่มความเสี่ยงมะเร็งเม็ดเลือดขาวและมะเร็งต่อมน้ำเหลืองสูงมาก\n\nFIV ติดต่อหลักผ่านแผลกัดลึก เพราะเชื้ออยู่ในน้ำลายและเลือด มักพบในแมวเพศผู้ที่ไม่ทำหมันและออกไปต่อสู้แย่งอาณาเขต ส่วนการอยู่ร่วมกันทั่วไป เลียขนให้กัน ใช้ชามหรือกระบะทรายร่วมกันโดยไม่กัดกัน มีโอกาสติดน้อยมาก เพราะไวรัสอ่อนแอและสลายตัวเร็วนอกร่างกาย\n\nFeLV ติดต่อง่ายกว่ามากจนถูกเรียกว่าโรคแห่งความรัก พบไวรัสปริมาณสูงในน้ำลาย น้ำมูก อุจจาระ ปัสสาวะ และน้ำนม การคลุกคลีใกล้ชิดเช่นเลียขนให้กัน กินอาหารหรือน้ำจากชามเดียวกัน หรือใช้กระบะทรายร่วมกันก็แพร่เชื้อได้ และแม่แมวที่ติดเชื้อยังแพร่สู่ลูกตั้งแต่ในท้องหรือผ่านน้ำนม\n\nอาการมักค่อยๆ พัฒนาเมื่อภูมิคุ้มกันอ่อนแอลง FIV ระยะแรกอาจมีไข้ต่ำๆ ต่อมน้ำเหลืองโตเล็กน้อยแล้วหายไปเอง ตามด้วยระยะแฝงที่แมวดูแข็งแรงหลายปี ก่อนเข้าระยะท้ายที่มีการอักเสบเรื้อรังในช่องปากและเหงือก แผลหายยาก ติดเชื้อผิวหนังและทางเดินหายใจบ่อย น้ำหนักลด และท้องเสียเรื้อรัง ส่วน FeLV มักทำให้ซีดจากโลหิตจางรุนแรง น้ำหนักลดเฉียบพลัน ซึม เบื่ออาหาร ติดเชื้อง่าย และเกิดเนื้องอกหรือมะเร็งโดยเฉพาะมะเร็งต่อมน้ำเหลืองในช่องอกที่ทำให้หายใจลำบาก\n\nการป้องกันที่ดีที่สุดคือไม่ให้แมวรับเชื้อ ควรตรวจคัดกรอง FIV/FeLV ด้วยชุดตรวจ Snap Test ก่อนรับแมวใหม่เข้าบ้านหรือก่อนทำวัคซีน เลี้ยงระบบปิดภายในบ้านเพื่อลดการสัมผัสแมวจร ทำหมันเพื่อลดความก้าวร้าวและการหนีเที่ยว ปัจจุบันมีวัคซีน FeLV ที่มีประสิทธิภาพสูงแนะนำในแมวกลุ่มเสี่ยง ส่วนวัคซีน FIV ยังมีข้อจำกัด ควรปรึกษาสัตวแพทย์เพื่อวางแผนที่เหมาะสม\n\nผลตรวจเป็นบวกไม่ได้แปลว่าชีวิตแมวจะจบลงทันที แมวที่ติดเชื้อยังมีชีวิตยืนยาวและมีความสุขได้หากดูแลเหมาะสม ควรเลี้ยงเดี่ยวหรือเลี้ยงรวมเฉพาะแมวที่ติดเชื้อชนิดเดียวกันเพื่อกันการแพร่เชื้อ เน้นสุขอนามัยและความสะอาด ให้อาหารปรุงสุกคุณภาพสูงโปรตีนครบถ้วนและเลี่ยงอาหารดิบเด็ดขาด ลดความเครียดด้วยสิ่งแวดล้อมที่สงบ และพาไปตรวจสุขภาพเช็กผลเลือดทุก 6 เดือนเพื่อจัดการโรคแทรกซ้อนแต่เนิ่นๆ",
    sources: [
      { label: "Cornell Feline Health Center - Feline Immunodeficiency Virus (FIV)", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feline-immunodeficiency-virus-fiv" },
      { label: "Cornell Feline Health Center - Feline Leukemia Virus (FeLV)", url: "https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/feline-leukemia-virus" },
      { label: "AAFP - 2020 AAFP Feline Retrovirus Testing and Management Guidelines", url: "https://catvets.com/guidelines/practice-guidelines/retrovirus-guidelines" },
    ],
    faq: [],
  },
  {
    title: "ทำไมสุนัขชอบเห่าคนแปลกหน้าหรือเสียงดัง? ถอดรหัสพฤติกรรมและวิธีฝึกควบคุมอย่างถูกวิธี",
    slug: "dog-barking-control",
    animal: "dog",
    categorySlug: "behavior",
    heroImageUrl: UNSPLASH("1518717758536-85ae29035b6d"),
    excerpt:
      "การเห่าเมื่อเจอคนแปลกหน้าหรือเสียงดังเป็นปฏิกิริยาตามธรรมชาติ แต่หากเรื้อรังก็สร้างความรำคาญได้ บทความนี้เจาะลึกสาเหตุและกลไกจิตวิทยาเบื้องหลังเสียงเห่า พร้อมเทคนิคฝึกควบคุมและปรับพฤติกรรมเชิงบวกที่ถูกวิธี",
    body:
      "เสียงเห่าเป็นเครื่องมือสื่อสารสำคัญของสุนัข แต่เมื่อเกิดขึ้นอย่างไร้การควบคุม เช่น เห่าคนเดินผ่านหน้าบ้านหรือเห่าเสียงดังอย่างฟ้าร้องและประทัด อาจกลายเป็นปัญหาที่สร้างความตึงเครียดทั้งกับเจ้าของและเพื่อนบ้าน การแก้ปัญหาอย่างยั่งยืนต้องเริ่มจากเข้าใจก่อนว่าการเห่าไม่ใช่เรื่องผิด แต่เป็นหน้าที่ของเจ้าของที่จะถอดรหัสว่าสุนัขต้องการสื่อสารอะไรและเปลี่ยนพลังงานนั้นให้ออกมาอย่างเหมาะสม\n\nการเห่าจำแนกได้หลายประเภทตามแรงจูงใจ การเห่าเตือนภัยและป้องกันอาณาเขตเกิดเมื่อสุนัขเห็นคนแปลกหน้าหรือสิ่งแปลกปลอมลุกล้ำพื้นที่ มักยืนตัวตรง หางชี้สูง จ้องไม่วางตา การเห่าจากความกลัวเกิดเมื่อเจอเสียงดังกะทันหันหรือสิ่งไม่คุ้นเคย ท่าทางมักลู่หู หางจุกก้น และถอยหลังขณะเห่า ส่วนการเห่าเรียกร้องความสนใจเกิดเมื่อสุนัขเรียนรู้ว่าการเห่าทำให้ได้รับความสนใจจากเจ้าของ แม้จะเป็นการดุก็ตาม\n\nข้อผิดพลาดใหญ่ที่สุดคือการตะโกนสั่งให้เงียบ เพราะสุนัขไม่เข้าใจคำพูดแต่รับรู้โทนเสียงและพลังงาน เมื่อเราตะโกน สุนัขจะตีความว่าเจ้าของกำลังตื่นเต้นและร่วมเห่าไปด้วย ทำให้เห่าดังและนานขึ้น อีกทั้งเสียงตะโกนยังเพิ่มอะดรีนาลีนและความเครียด ดันระดับความตื่นตัวจนสุนัขไม่สามารถเรียนรู้หรือฟังคำสั่งใดได้\n\nการปรับพฤติกรรมต้องอาศัยความใจเย็น สม่ำเสมอ และใช้การเสริมแรงเชิงบวก เทคนิคแรกคือฝึกคำสั่งเงียบ โดยปล่อยให้สุนัขเห่าเตือน 2-3 ครั้งตามธรรมชาติ แล้วเดินเข้าไปอย่างสงบ เรียกชื่อและพูดคำสั่งเงียบด้วยน้ำเสียงราบเรียบแต่หนักแน่น จากนั้นจ่อขนมกลิ่นหอมแรงที่จมูก สุนัขจะหยุดเห่าเพื่อดมกลิ่น รอให้เงียบสนิท 3-5 วินาทีแล้วจึงให้ขนมพร้อมคำชม ทำซ้ำจนสุนัขเชื่อมโยงคำว่าเงียบเข้ากับรางวัล\n\nเทคนิคที่สองคือการเปลี่ยนทิศทางความสนใจก่อนระดับความตื่นตัวจะพุ่งสูง เช่น เตรียมของเล่นสอดไส้ขนมอย่าง Kong ยัดไส้เนยถั่วแช่แข็ง แล้วส่งให้ทันทีเมื่อได้ยินเสียงดังหรือเห็นคนแปลกหน้า การเลียและเคี้ยวช่วยลดอัตราการเต้นของหัวใจและเบี่ยงเบนความสนใจได้ดี\n\nเทคนิคที่สามคือการลดความไวต่อสิ่งเร้า (Desensitization) ร่วมกับการปรับทัศนคติใหม่ กรณีกลัวเสียงดังให้เปิดเสียงบันทึกเบามากจนสุนัขสังเกตเห็นแต่ไม่ตื่นตระหนก พร้อมป้อนขนมหรือเล่นด้วย แล้วค่อยๆ เพิ่มระดับเสียงทีละน้อยในแต่ละวันจนสุนัขเชื่อมโยงเสียงนั้นกับเรื่องดี กรณีเห่าคนแปลกหน้าให้เพื่อนยืนในระยะไกลที่สุนัขเห็นแต่ยังไม่เห่า ให้ขนมเมื่อสุนัขมองแล้วยังสงบ แล้วค่อยๆ ขยับเข้าใกล้ทีละนิดในแต่ละครั้ง\n\nการแก้พฤติกรรมเห่าต้องใช้เวลาและความเข้าใจในธรรมชาติของสุนัขแต่ละตัว สิ่งสำคัญคือหลีกเลี่ยงการลงโทษทางร่างกายหรืออุปกรณ์ที่สร้างความเจ็บปวดอย่างปลอกคอช็อตไฟฟ้า เพราะจะยิ่งเพิ่มความเครียดและความก้าวร้าวในระยะยาว การสร้างสภาพแวดล้อมที่ปลอดภัยและฝึกด้วยความรักความเข้าใจคือคำตอบที่ดีที่สุด",
    sources: [
      { label: "AKC - How to Stop Your Dog From Barking", url: "https://www.akc.org/expert-advice/training/how-to-stop-dog-barking/" },
      { label: "Association of Professional Dog Trainers (APDT) - Barking", url: "https://apdt.com/resource-center/barking/" },
      { label: "VCA Animal Hospitals - Dog Behavior Problems - Barking", url: "https://vcahospitals.com/know-your-pet/dog-behavior-problems-barking" },
    ],
    faq: [],
  },
];

export async function seedDatabase() {
  const { default: config } = await import("@payload-config");
  const payload = await getPayload({ config });

  const adminEmail = process.env.PAYLOAD_ADMIN_EMAIL || "admin@petster.local";
  const adminPassword = process.env.PAYLOAD_ADMIN_PASSWORD || "PetsterAdmin2026!";

  const existingUsers = await payload.find({ collection: "users", limit: 1 });
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: "users",
      data: {
        email: adminEmail,
        password: adminPassword,
        name: "Petster Admin",
      },
    });
    console.log(`  created admin user ${adminEmail}`);
  } else {
    console.log("  admin user already exists");
  }

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
      category: categoryId,
      excerpt: art.excerpt,
      body: toRichText(art.body),
      heroImageUrl: art.heroImageUrl,
      sources: art.sources,
      faq: art.faq,
      featured: art.featured || false,
      contentStage: "published",
      healthDisclaimerChecked: true,
      referencesChecked: true,
      readingTimeMinutes: Math.max(1, Math.ceil(art.body.length / 700)),
      publishedAt: new Date().toISOString(),
      _status: "published",
    };

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

  console.log("\nSeed complete.");
}

const isDirectRun = process.argv[1]?.includes("seed");

if (isDirectRun) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
