/**
 * Shown when the CMS (content backend) cannot be reached. Per GoodPet's trust
 * rules we never fabricate content, so instead of fake articles we keep the
 * page's shape with a clear banner plus inert placeholder tiles. The tiles are
 * deliberately static (no shimmer) so they read as "unavailable", not "loading"
 * — a CMS outage will not resolve on its own until the reader retries.
 */

// Stable, non-index keys so React reconciliation (and lint) stay happy.
const PLACEHOLDER_SLOTS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

export function ConnectionBanner({
  message = "กรุณาลองใหม่อีกครั้งในอีกสักครู่",
}: {
  message?: string;
}) {
  return (
    <div className="connection-banner" role="status" aria-live="polite">
      <span className="connection-banner-icon" aria-hidden="true">
        ⚠
      </span>
      <span>
        <strong>โหลดเนื้อหาไม่ได้ชั่วคราว</strong> — {message}
      </span>
    </div>
  );
}

export function PlaceholderTiles({ count = 6 }: { count?: number }) {
  const slots = PLACEHOLDER_SLOTS.slice(0, Math.min(count, PLACEHOLDER_SLOTS.length));
  return (
    <div className="placeholder-grid" aria-hidden="true">
      {slots.map((slot) => (
        <div className="placeholder-card" key={slot}>
          <span className="placeholder-icon">🐾</span>
          <span className="placeholder-text">ยังโหลดไม่ได้</span>
        </div>
      ))}
    </div>
  );
}

/** Banner + placeholder grid, for sections/pages that show a card grid. */
export function OfflineState({ count = 6 }: { count?: number }) {
  return (
    <>
      <ConnectionBanner />
      <PlaceholderTiles count={count} />
    </>
  );
}
