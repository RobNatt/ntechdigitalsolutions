import type { ReactNode } from "react";

/**
 * 1-6 `#` at line start only (7+ `#` stays normal text). Optional space after hashes (`##Title` ok).
 * (?!#) after the run prevents treating `#######` as a six-hash heading plus stray `#`.
 */
const MD_HEADING_LINE = /^#{1,6}(?!#)\s*(.+)$/;

const H2_CLASS =
  "mb-4 mt-9 scroll-mt-4 text-base font-semibold tracking-tight text-neutral-900 first:mt-0 dark:text-white sm:text-lg";

export type BlogPostPublic = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published_at: string | null;
};

const LINE_SEPARATOR = String.fromCharCode(0x2028);
const PARAGRAPH_SEPARATOR = String.fromCharCode(0x2029);
const BOM = String.fromCharCode(0xfeff);
const ZERO_WIDTH_CHARS_PATTERN = new RegExp(
  `[${String.fromCharCode(0x200b)}-${String.fromCharCode(0x200d)}${BOM}]`,
  "g"
);
const LINE_SPLIT_PATTERN = new RegExp(`\\n|${LINE_SEPARATOR}|${PARAGRAPH_SEPARATOR}`);

function normalizeBodyNewlines(content: string): string {
  return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function splitBodyLines(content: string): string[] {
  return normalizeBodyNewlines(content).split(LINE_SPLIT_PATTERN);
}

/** Trim + strip BOM / zero-width chars that break `^#` matching when pasting from docs. */
function stripHeadingNoise(line: string): string {
  return line.replace(new RegExp(`^${BOM}`), "").replace(ZERO_WIDTH_CHARS_PATTERN, "").trim();
}

function parseMarkdownHeadingLine(rawLine: string): string | null {
  const t = stripHeadingNoise(rawLine);
  if (!t) return null;
  const m = MD_HEADING_LINE.exec(t);
  if (!m) return null;
  const title = m[1].trim();
  return title.length > 0 ? title : null;
}

function stripMarkdownHeadingLines(text: string): string {
  return splitBodyLines(text)
    .filter((line) => parseMarkdownHeadingLine(line) === null)
    .join("\n")
    .trim();
}

/** Plain teaser for the blog index card (no raw `##` from the body or excerpt). */
export function blogListExcerpt(post: BlogPostPublic, maxLen = 220): string {
  const excerpt = post.excerpt?.trim();
  if (excerpt) {
    const withoutHeadings = stripMarkdownHeadingLines(excerpt);
    let blob = withoutHeadings.trim() ? withoutHeadings : excerpt;
    if (!blob.trim()) {
      for (const line of splitBodyLines(excerpt)) {
        const t = parseMarkdownHeadingLine(line);
        if (t) {
          blob = t;
          break;
        }
      }
    }
    const oneLine = blob.replace(/\s+/g, " ").trim();
    if (!oneLine) return "...";
    if (oneLine.length <= maxLen) return oneLine;
    return `${oneLine.slice(0, maxLen)}...`;
  }
  const body = stripMarkdownHeadingLines(post.content);
  const oneLine = body.replace(/\s+/g, " ").trim();
  if (!oneLine) {
    for (const line of splitBodyLines(post.content)) {
      const title = parseMarkdownHeadingLine(line);
      if (title) {
        return title.length <= maxLen ? title : `${title.slice(0, maxLen)}...`;
      }
    }
    return "...";
  }
  if (oneLine.length <= maxLen) return oneLine;
  return `${oneLine.slice(0, maxLen)}...`;
}

/**
 * Walks line-by-line so `## Title` works after a single newline, not only after a blank line.
 * Consecutive `##` lines each become an h2; lines between headings form paragraphs (blank lines preserved).
 */
export function renderBlogPostBody(content: string): ReactNode[] {
  const lines = splitBodyLines(content);
  const out: ReactNode[] = [];
  const paraBuf: string[] = [];
  let k = 0;

  const flushParagraph = () => {
    if (paraBuf.length === 0) return;
    const text = paraBuf.join("\n");
    paraBuf.length = 0;
    if (!text.trim()) return;
    out.push(
      <p key={k++} className="mb-5 whitespace-pre-wrap last:mb-0 sm:mb-6">
        {text}
      </p>
    );
  };

  for (const line of lines) {
    const title = parseMarkdownHeadingLine(line);
    if (title !== null) {
      flushParagraph();
      out.push(
        <h2 key={k++} className={H2_CLASS}>
          {title}
        </h2>
      );
      continue;
    }
    paraBuf.push(line);
  }
  flushParagraph();
  return out;
}

export function formatBlogDate(iso: string | null): string {
  if (!iso) return "Published";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Published";
  }
}
