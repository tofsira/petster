import type { Metadata } from "next";
import { Prompt, Sarabun } from "next/font/google";
import "../globals.css";
import "./petster.css";
import { SiteHeader, SiteFooter, BottomNav } from "@/components/site-chrome";
import { RevealOnScroll } from "@/components/reveal-on-scroll";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-prompt",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
});

export const metadata: Metadata = {
  title: { default: "Petster | ความรู้หมาแมวที่น่าเชื่อถือ", template: "%s | Petster" },
  description:
    "Petster รวบรวมความรู้เรื่องหมาและแมวแบบอ่านง่าย น่าเชื่อถือ และค้นหาต่อได้ไว สำหรับเจ้าของสัตว์เลี้ยงยุคใหม่",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%231b8a86'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' font-family='Prompt,sans-serif' font-size='38' font-weight='700' fill='white' dominant-baseline='middle'%3EP%3C/text%3E%3C/svg%3E",
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${prompt.variable} ${sarabun.variable}`}>
      <body>
        <div className="page-noise" aria-hidden="true" />
        <SiteHeader />
        {children}
        <SiteFooter />
        <BottomNav />
        <RevealOnScroll />
      </body>
    </html>
  );
}
