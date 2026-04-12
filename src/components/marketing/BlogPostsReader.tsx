"use client";

import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Markdown-style heading at start of a line (# … ######). All render as <h2> for a flat outline under the post <h1>. */
const MD_HEADING = /^#{1,6}\s+(.+)$/;

const H2_CLASS =
  "mb-3 mt-8 scroll-mt-4 text-base font-semibold tracking-tight text-neutral-900 first:mt-0 dark:text-white sm:text-lg";

/**
 * Split body on blank lines; blocks whose first line is a markdown heading become <h2>
 * (any # count). Remaining lines in that block become a paragraph. Other blocks are <p>.
 */
export function renderBlogPostBody(content: string): ReactNode[] {
  const blocks = content.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block, i) => {
    const lines = block.split("\n");
    const first = lines[0] ?? "";
    const m = MD_HEADING.exec(first);
    if (m) {
      const headingText = m[1].trim();
      const rest = lines.slice(1).join("\n").trim();
      return (
        <Fragment key={i}>
          <h2 className={H2_CLASS}>{headingText}</h2>
          {rest ? (
            <p className="mb-4 whitespace-pre-wrap last:mb-0">{rest}</p>
          ) : null}
        </Fragment>
      );
    }
    return (
      <p key={i} className="mb-4 whitespace-pre-wrap last:mb-0">
        {block}
      </p>
    );
  });
}

export type BlogPostPublic = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published_at: string | null;
};

function formatDate(iso: string | null): string {
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

const PostModal = forwardRef<
  HTMLDivElement,
  { post: BlogPostPublic; onClose: () => void }
>(function PostModal({ post, onClose }, ref) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [onKeyDown]);

  return (
    <motion.div
      ref={ref}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        aria-label="Close article"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] dark:bg-black/65"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
        className={cn(
          "relative z-[101] flex max-h-[min(88vh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl",
          "dark:border-neutral-700 dark:bg-neutral-950 dark:shadow-[0_25px_80px_-12px_rgba(0,0,0,0.65)]"
        )}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {formatDate(post.published_at)}
            </p>
            <h1
              id={titleId}
              className="mt-1 text-xl font-semibold leading-snug text-neutral-900 dark:text-white sm:text-2xl"
            >
              {post.title}
            </h1>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-neutral-200 bg-neutral-50 p-2 text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          <article className="prose-blog text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200">
            {renderBlogPostBody(post.content)}
          </article>
        </div>
      </motion.div>
    </motion.div>
  );
});

export function BlogPostsReader({ posts }: { posts: BlogPostPublic[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openPost = posts.find((p) => p.id === openId) ?? null;

  if (posts.length === 0) {
    return (
      <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
        No published posts yet. Create and publish from Dashboard → Blog posts.
      </p>
    );
  }

  return (
    <>
      <ul className="mt-4 list-none space-y-3 p-0">
        {posts.map((post) => (
          <li
            key={post.id}
            className="border-b border-neutral-200 pb-4 last:border-0 dark:border-neutral-800"
          >
            <button
              type="button"
              onClick={() => setOpenId(post.id)}
              className="group w-full rounded-xl border border-transparent px-1 py-1 text-left transition hover:border-neutral-200 hover:bg-neutral-50/80 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/40"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="font-medium text-neutral-900 decoration-neutral-400 decoration-2 underline-offset-2 transition group-hover:underline dark:text-white dark:decoration-neutral-500">
                  {post.title}
                </span>
                <span className="shrink-0 text-sm text-neutral-500 dark:text-neutral-400">
                  {formatDate(post.published_at)}
                </span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">
                {post.excerpt || `${post.content.slice(0, 220)}${post.content.length > 220 ? "…" : ""}`}
              </p>
              <span className="mt-2 inline-block text-xs font-semibold text-sky-700 dark:text-sky-400">
                Read full article
              </span>
            </button>
          </li>
        ))}
      </ul>
      <AnimatePresence>
        {openPost ? (
          <PostModal key={openPost.id} post={openPost} onClose={() => setOpenId(null)} />
        ) : null}
      </AnimatePresence>
    </>
  );
}
