export function normalizePhoneDigits(phone: string | null | undefined): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function parseTagsInput(raw: string): string[] {
  return raw
    .split(/[,#\n]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 24);
}

export function formatTagsForInput(tags: string[] | null | undefined): string {
  if (!tags?.length) return "";
  return tags.join(", ");
}

export function mergeTagIntoTagsInput(raw: string, tag: string): string {
  const t = tag.trim();
  if (!t) return raw;
  const cur = parseTagsInput(raw);
  if (cur.some((x) => x.toLowerCase() === t.toLowerCase())) return raw;
  return formatTagsForInput([...cur, t]);
}
