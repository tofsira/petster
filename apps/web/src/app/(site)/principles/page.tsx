import type { Metadata } from "next";
import { getPayloadClient } from "@/lib/payload";

export const metadata: Metadata = {
  title: "หลักการคัดข้อมูล | Petster",
  description: "Petster อ้างอิงข้อมูลจากแหล่งที่เชื่อถือได้ ทุกบทความสุขภาพมีแหล่งอ้างอิงและคำเตือนว่าไม่แทนการวินิจฉัยจากสัตวแพทย์",
};

export default async function PrinciplesPage() {
  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({ slug: "settings" });

  return (
    <main className="shell section">
      <header className="section-heading">
        <p className="eyebrow">หลักการคัดข้อมูล</p>
        <h1>อ้างอิงได้ ไม่แทนสัตวแพทย์</h1>
        <p className="hero-lead">
          ทุกบทความสุขภาพมีแหล่งอ้างอิง วันที่อัปเดต และคำเตือนชัดเจน
        </p>
      </header>

      <div className="trust-points">
        <article className="trust-card">
          <h3>มีแหล่งอ้างอิง</h3>
          <p>
            บทความสำคัญจะเชื่อมกลับไปยัง guideline, source หรือโน้ตวิจัยที่ทีมใช้จริง
            พร้อมระบุว่าใช้ข้อมูลเมื่อไร
          </p>
        </article>

        <article className="trust-card">
          <h3>อ่านเข้าใจง่าย</h3>
          <p>
            แปลภาษายากให้ใช้งานได้ในชีวิตประจำวัน โดยไม่ลดความรับผิดชอบของเนื้อหา
            เน้นความถูกต้องเหนือความเรียบง่าย
          </p>
        </article>

        <article className="trust-card">
          <h3>ออกแบบให้ค้นต่อได้</h3>
          <p>
            ทุก section ชวนไปยังหมวดหรือบทความที่ลึกขึ้น เพื่อสร้างเส้นทางความรู้ที่ต่อเนื่อง
            ไม่ใช่บทความที่จบในตัว
          </p>
        </article>

        <article className="trust-card">
          <h3>ไม่แทนสัตวแพทย์</h3>
          <p>
            {settings?.healthDisclaimer ||
              "ข้อมูลในเว็บไซต์เป็นข้อมูลทั่วไป ไม่ได้แทนการวินิจฉัยจากสัตวแพทย์ หากสัตว์เลี้ยงมีอาการผิดปกติ ควรปรึกษาผู้เชี่ยวชาญโดยตรง"}
          </p>
        </article>
      </div>
    </main>
  );
}
