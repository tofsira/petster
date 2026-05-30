export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav-row">
        <a className="brand" href="/" aria-label="Petster home">
          <span className="brand-mark">P</span>
          <span className="brand-text">Petster</span>
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          <a href="/#topics">หมวดหลัก</a>
          <a href="/dogs">สุนัข</a>
          <a href="/cats">แมว</a>
        </nav>

        <a className="nav-trust" href="/principles">หลักการคัดข้อมูล</a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-row">
        <div>
          <p className="footer-brand">Petster</p>
          <p className="footer-copy">
            ความรู้เรื่องหมาและแมว ที่น่าเชื่อถือและพร้อมต่อยอดเป็นคลังความรู้จริง
          </p>
        </div>
        <p className="footer-note">
          Phase 1 concept homepage for brand, media, and SEO foundation
        </p>
      </div>
    </footer>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Bottom navigation">
      <a href="/#topics">หมวด</a>
      <a href="/dogs">สุนัข</a>
      <a href="/cats">แมว</a>
      <a href="/principles">ข้อมูล</a>
    </nav>
  );
}
