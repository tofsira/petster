/**
 * Shown when the CMS (content backend) cannot be reached. Deliberately neutral
 * and honest — Petster's trust rules forbid showing placeholder/fake content,
 * so we tell the reader the content service is temporarily unavailable instead.
 */
export function ConnectionNotice({
  title = "ตอนนี้โหลดเนื้อหาไม่ได้",
  detail = "ระบบเชื่อมต่อฐานข้อมูลเนื้อหาไม่ได้ชั่วคราว กรุณาลองใหม่อีกครั้งในอีกสักครู่",
}: {
  title?: string;
  detail?: string;
}) {
  return (
    <div className="connection-notice" role="status" aria-live="polite">
      <span className="connection-notice-icon" aria-hidden="true">
        ⚠
      </span>
      <div className="connection-notice-copy">
        <p className="connection-notice-title">{title}</p>
        <p className="connection-notice-detail">{detail}</p>
      </div>
    </div>
  );
}
