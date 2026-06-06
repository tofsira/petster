# GoodPet — แผน Sitemap (Phase 1)

> เอกสารวางแผนโครงสร้างหน้าเว็บ — dogs/cats เท่านั้น, ภาษาไทย, read-only, trust-first
> URL pattern: `animal + topic + intent` (ลำดับชั้นชัดเจน, ไม่ใช่ blog-first)

## โครงสร้างรวม

```
/                                  หน้าแรก
│
├── /dogs                          ฮับสุนัข
│   ├── /dogs/health               สุขภาพ
│   ├── /dogs/food                 อาหาร
│   ├── /dogs/behavior             พฤติกรรม
│   └── /dogs/daily-care           การดูแลประจำวัน
│       └── /dogs/health/<slug>    บทความ เช่น /dogs/health/dog-vomiting-causes
│
├── /cats                          ฮับแมว
│   ├── /cats/health
│   ├── /cats/food
│   ├── /cats/behavior
│   └── /cats/daily-care
│       └── /cats/food/<slug>      เช่น /cats/food/best-food-for-indoor-cats
│
├── /principles                    หลักการคัดข้อมูล (trust/credibility)
│
├── /about                         GoodPet คือใคร (trust แบรนด์)
├── /contact                       ติดต่อ / แจ้งแก้ไขข้อมูล (E-E-A-T)
├── /privacy                       นโยบายความเป็นส่วนตัว
├── /search                        หน้าผลการค้นหาเต็ม
│
├── /sitemap.xml                   auto จาก CMS
└── /robots.txt                    auto
```

> ข้อจำกัดความรับผิด (disclaimer) สำหรับเนื้อหาสุขภาพ — วางไว้ใน footer ทุกหน้า ไม่ต้องเป็นหน้าแยก

## ลำดับชั้น 4 ระดับ

| ระดับ | URL | บทบาท | จำนวน | สถานะ |
|---|---|---|---|---|
| 1. Home | `/` | สร้างความเชื่อมั่น + นำทาง | 1 | มีแล้ว |
| 2. Animal hub | `/dogs`, `/cats` | แยกเส้นทางผู้เลี้ยง 2 กลุ่ม | 2 | มีแล้ว |
| 3. Category hub | `/dogs/health` … | hub page รวม topic cluster | 8 (4×2) | มีแล้ว |
| 4. Article | `/dogs/health/<slug>` | บทความ evergreen | n | มีแล้ว |

## รายละเอียดแต่ละหน้า

### `/` หน้าแรก
บล็อกตามลำดับ: hero → search → category shortcuts → featured articles → dog section → cat section → editorial trust section → latest/popular
- เป้าหมาย: อธิบายว่าเว็บคืออะไร + แสดงว่าเนื้อหาคัดมาอย่างดี

### `/dogs`, `/cats` (animal hub)
- intro สั้น ๆ ของสัตว์นั้น
- การ์ด 4 หมวด (health / food / behavior / daily-care)
- บทความล่าสุดของสัตว์นั้น
- เป็น hub page รวม internal link → ช่วย topical authority

### `/dogs/<category>`, `/cats/<category>` (category hub)
- intro ของหมวด (useful category intro — สำคัญต่อ SEO)
- รายการบทความใน หมวด × สัตว์
- โอกาสทำ FAQ section ของหมวด

### `/<animal>/<category>/<slug>` (article)
- เนื้อหา evergreen + heroImage
- sources (อ้างอิง) + disclaimer สำหรับหัวข้อสุขภาพ
- related articles (3 บทความหมวดเดียวกัน)
- FAQ block (โอกาส rich result)

### `/principles`
- หลักการคัดข้อมูล: source อยู่ NotebookLM, เผยแพร่ผ่าน Payload, AI เป็น support material ไม่ใช่ความจริงสุดท้าย
- เนื้อหา trust หลักของแบรนด์

## ข้อเสนอเพิ่มเติม

### เพิ่มใน Phase 1 (ตัดสินใจแล้ว)

**กลุ่ม trust:**
- **`/about`** — GoodPet คือใคร เชื่อถือได้เพราะอะไร (เสริม `/principles` ในมุมแบรนด์)
- **`/contact`** — ช่องทางติดต่อ / แจ้งแก้ไขข้อมูล = สัญญาณ trust (E-E-A-T)
- **`/privacy`** — นโยบายความเป็นส่วนตัว (จำเป็นถ้ามี analytics/search)
- **disclaimer** — ข้อจำกัดความรับผิดเนื้อหาสุขภาพ วางใน footer ทุกหน้า (ไม่ต้องเป็นหน้าแยก)

**กลุ่ม utility:**
- **`/search`** — หน้าผลการค้นหาเต็ม (hero มีช่อง search อยู่แล้ว)
- **404 ที่ออกแบบดี** — ส่งผู้ใช้กลับเข้าหมวด/ค้นหา

### ตัดออกจาก Phase 1 (ตัดสินใจแล้ว)
- ~~หน้า author `/authors/<slug>`~~ — **ไม่มีผู้เขียน** จึงไม่ทำ

### เลื่อนไป Phase 2 (เลี่ยง vanity complexity)
- `/articles` (รวมทุกบทความ), `/faq`, `/glossary` — เพิ่มความลึก SEO เมื่อเนื้อหาเริ่มเยอะ
- tag pages
- ระบบสมาชิก / คอมเมนต์
- newsletter
- ฟีเจอร์ที่ลดความ trust หรือทำให้ดูเหมือน content farm

## หมายเหตุเชิงเทคนิค (อ้างอิงสำหรับตอน implement)
- `animal` เก็บเป็น singular (`dog`/`cat`) แต่ URL เป็น plural (`/dogs`/`/cats`) — แปลงผ่าน `lib/url.ts`
- `/sitemap.xml` + `/robots.txt` generate อัตโนมัติจาก CMS อยู่แล้ว — เมื่อเพิ่ม route ใหม่ (เช่น `/about`) ต้องเช็กว่าถูกรวมใน `sitemap.ts`
