# Article Sheet — คู่มือคนทำ content

แผ่นงานนี้คือ **ที่ร่างบทความ** สำหรับ GoodPet ทีม content กรอกที่นี่ → ระบบ sync เข้า
Payload CMS เป็น **draft** → reviewer ตรวจและ publish

> 1 แถว = 1 บทความ · sync เป็นทางเดียว (Sheet → CMS) · ระบบจะไม่ทับบทความที่ publish แล้ว

ดูภาพรวม pipeline ที่ [`docs/content-workflow.md`](../content-workflow.md)

## เริ่มต้นใช้งาน

1. สร้าง Google Sheet ใหม่ → **File → Import → Upload** ไฟล์
   [`article-sheet-template.csv`](./article-sheet-template.csv) → เลือก **Replace current sheet**
2. แชร์ Sheet ให้อีเมล Google service account (reviewer/dev จะส่งให้) แบบ **Viewer**
3. ลบแถวตัวอย่าง (status `ตัวอย่าง (ลบทิ้งได้)`) ออกได้เลย แล้วเริ่มกรอกของจริง

## คอลัมน์

| คอลัมน์ | ใครกรอก | จำเป็น | กติกา |
|---|---|---|---|
| `status` | คน | ✅ | `Draft` = ยังร่าง (ระบบข้าม) · **`Ready for review`** = พร้อม sync เข้า CMS |
| `title` | คน | ✅ | ชื่อบทความภาษาไทย |
| `slug` | คน | — | เว้นว่างได้ ระบบสร้างจาก title ให้ · ถ้ากรอกเองใช้ได้แค่ a-z 0-9 และ `-` ห้ามเว้นวรรค/ภาษาไทย |
| `animal` | คน | ✅ | `dog` หรือ `cat` เท่านั้น |
| `category` | คน | ✅ | `health` · `food` · `behavior` · `daily-care` (ตัวใดตัวหนึ่ง) |
| `excerpt` | คน | ✅ | สรุปสั้น ≤ 240 ตัวอักษร (ใช้ในการ์ดและ meta description) |
| `body` | คน | ✅ | เนื้อหาเต็ม — ดู [รูปแบบ body](#รูปแบบ-body) |
| `sources` | คน | ⚠️ | แหล่งอ้างอิง — ดู [รูปแบบ sources](#รูปแบบ-sources) · **บทความ health ต้องมีอย่างน้อย 1** |
| `faq` | คน | — | คำถามที่พบบ่อย — ดู [รูปแบบ faq](#รูปแบบ-faq) |
| `image_url` | คน | — | ลิงก์รูป hero (ระบบจะดึงไปอัปให้) · เว้นว่างได้ ให้ reviewer อัปใน admin |
| `featured` | คน | — | `TRUE` = ดันขึ้นเป็นบทความเด่นหน้าแรก · ปกติ `FALSE` |
| `author` | คน | — | ชื่อผู้เขียน (ถ้ามี) · reviewer จะ map เข้า Authors ให้ |
| `cms_id` | **ระบบ** | — | อย่าแก้ — ระบบเขียน ID ของบทความใน CMS กลับมา |
| `synced_at` | **ระบบ** | — | อย่าแก้ — เวลาที่ sync ล่าสุด |
| `sync_error` | **ระบบ** | — | อย่าแก้ — ถ้ามีข้อความ แปลว่าแถวนั้นกรอกผิด ให้แก้ตามที่บอก |

## รูปแบบ body

- เขียนเป็นย่อหน้าปกติ
- **ขึ้นย่อหน้าใหม่ = เว้นบรรทัดว่าง 1 บรรทัด** (ในช่องเดียวกัน กด `Alt+Enter` เพื่อขึ้นบรรทัด)
- ระบบแปลงแต่ละย่อหน้าเป็น paragraph ใน CMS อัตโนมัติ
- องค์ประกอบพิเศษ (กล่องเตือน, ตารางเปรียบเทียบ, checklist, สัญญาณอันตราย ฯลฯ)
  **ใส่ใน Sheet ไม่ได้** — ให้ reviewer เติมในขั้นตรวจที่ /admin

## รูปแบบ sources

หนึ่งแหล่งต่อหนึ่งบรรทัด รูปแบบ `ชื่อแหล่ง | URL` (คั่นด้วย ` | `)

```
AKC - How to Stop Your Dog From Barking | https://www.akc.org/expert-advice/training/how-to-stop-dog-barking/
VCA - Dog Behavior Problems Barking | https://vcahospitals.com/know-your-pet/dog-behavior-problems-barking
```

URL เว้นว่างได้ (ใส่แค่ชื่อแหล่งก็ได้) แต่**บทความหมวด `health` ต้องมีอย่างน้อย 1 แหล่ง** ตาม Trust Rules

## รูปแบบ faq

หนึ่งข้อต่อหนึ่งบรรทัด รูปแบบ `คำถาม | คำตอบ` (คั่นด้วย ` | `)

```
หมาเห่ากลางคืนบ่อย ทำยังไง | ลองเพิ่มการออกกำลังกายช่วงเย็นและลดสิ่งเร้า ถ้าไม่ดีขึ้นปรึกษาสัตวแพทย์
```

เว้นว่างได้ถ้าไม่มี FAQ

## รูปภาพ

- มีลิงก์รูป → วางใน `image_url` (ต้องเป็น URL ที่เปิดดูได้สาธารณะ เช่น ลิงก์ Drive แบบ public)
  ระบบจะดึงไปอัปเข้า Media ของ CMS ให้
- ไม่มีลิงก์ → เว้นว่าง แล้ว **reviewer อัปรูปจริงเองที่ /admin** ตอนตรวจ
- ใช้รูปจริง/มีลิขสิทธิ์ถูกต้อง ไม่ใช้รูป stock มั่ว

## เมื่อกรอกเสร็จ

1. ตั้ง `status` ของแถวนั้นเป็น **`Ready for review`**
2. ระบบ sync (รันโดย dev/อัตโนมัติ) จะสร้าง draft ใน CMS แล้วเขียน `cms_id` + `synced_at` กลับมา
3. ถ้า `sync_error` มีข้อความ → แก้ตามที่บอกแล้วรอ sync รอบถัดไป
4. reviewer ตรวจ draft ที่ /admin → อัป/แก้รูป → ติ๊ก checklist → **Publish**
5. หลัง publish แล้ว **อย่าแก้แถวนั้นใน Sheet อีก** (ระบบ lock ไม่ sync ทับงานที่ publish แล้ว)
   ถ้าต้องแก้บทความที่ publish แล้ว ให้แก้ที่ /admin โดยตรง
