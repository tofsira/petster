import Link from "next/link";

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <Link href="/#topics">หมวด</Link>
      <Link href="/dogs">สุนัข</Link>
      <Link href="/cats">แมว</Link>
      <Link href="/principles">ข้อมูล</Link>
    </nav>
  );
}
