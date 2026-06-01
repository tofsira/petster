const SLUG_ALLOWED_PATTERN = /^[\p{L}\p{M}\p{N}]+(?:-[\p{L}\p{M}\p{N}]+)*$/u;
const THAI_READING_CHARS_PER_MINUTE = 700;

export function slugifyTitle(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/gu, "-")
    .replace(/[^\p{L}\p{M}\p{N}-]+/gu, "")
    .replace(/-+/gu, "-")
    .replace(/^-|-$/gu, "");
}

export function isValidSlug(value: unknown) {
  return typeof value === "string" && SLUG_ALLOWED_PATTERN.test(value);
}

export function extractLexicalText(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  const record = node as { children?: unknown; root?: unknown; text?: unknown };
  const textParts: string[] = [];

  if (typeof record.text === "string") {
    textParts.push(record.text);
  }

  const children = Array.isArray(record.children)
    ? record.children
    : typeof record.root === "object" && record.root
      ? [(record.root as { children?: unknown }).children].flat()
      : [];

  for (const child of children) {
    const childText = extractLexicalText(child);
    if (childText) textParts.push(childText);
  }

  return textParts.join(" ").replace(/\s+/gu, " ").trim();
}

export function estimateReadingTimeMinutes(text: string) {
  const countableText = text.replace(/\s+/gu, "");
  return Math.max(1, Math.ceil(countableText.length / THAI_READING_CHARS_PER_MINUTE));
}

export function estimateArticleReadingTime({
  body,
  excerpt,
  title,
}: {
  body?: unknown;
  excerpt?: null | string;
  title?: null | string;
}) {
  const text = [extractLexicalText(body), excerpt, title].filter(Boolean).join(" ");
  return estimateReadingTimeMinutes(text);
}
