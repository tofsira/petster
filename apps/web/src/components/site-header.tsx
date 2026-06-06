import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav-row">
        <Link className="brand" href="/" aria-label="GoodPet home">
          <span className="brand-mark">G</span>
          <span className="brand-text">GoodPet</span>
        </Link>

        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/#topics">หมวดหลัก</Link>
          <Link href="/dogs">สุนัข</Link>
          <Link href="/cats">แมว</Link>
        </nav>

        <Link className="nav-trust" href="/principles">
          หลักการคัดข้อมูล
        </Link>
      </div>
    </header>
  );
}
