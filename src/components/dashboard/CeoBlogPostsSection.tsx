"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { renderBlogPostBody } from "@/components/marketing/BlogPostsReader";
import { datetimeLocalInputToIsoUtc, isoUtcToDatetimeLocalValue } from "@/lib/datetime-local";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published";
  published_at: string | null;
  /** Set on drafts when you pick a go-live time before publishing (shown in the list). */
  scheduled_publish_at?: string | null;
  updated_at: string;
};

/** Locale date + time for dashboard labels (scheduled / published). */
function formatDateTimeShort(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function isScheduledFuture(publishedAt: string | null): boolean {
  if (!publishedAt) return false;
  const t = new Date(publishedAt).getTime();
  return !Number.isNaN(t) && t > Date.now();
}

export function CeoBlogPostsSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [scheduledPublishAt, setScheduledPublishAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editScheduledPublishAt, setEditScheduledPublishAt] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editMessage, setEditMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/blog-posts");
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to load posts.");
        setPosts([]);
        return;
      }
      setPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch {
      setError("Failed to load posts.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const publishedCount = useMemo(
    () => posts.filter((p) => p.status === "published").length,
    [posts]
  );

  async function createPost(publish: boolean) {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const rawSchedule = scheduledPublishAt.trim();
      const scheduleIso = rawSchedule ? datetimeLocalInputToIsoUtc(rawSchedule) : null;
      if (rawSchedule && !scheduleIso) {
        setError("Invalid schedule date.");
        return;
      }
      const res = await fetch("/api/dashboard/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          publish,
          scheduledPublishAt: scheduleIso,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to create post.");
        return;
      }
      setMessage(
        publish
          ? scheduleIso
            ? "Post scheduled for publish."
            : "Post published to /blog."
          : "Draft saved."
      );
      setTitle("");
      setExcerpt("");
      setContent("");
      setScheduledPublishAt("");
      await load();
    } catch {
      setError("Failed to create post.");
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(id: string, status: "draft" | "published") {
    try {
      const res = await fetch(`/api/dashboard/blog-posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return;
      await load();
    } catch {
      /* ignore */
    }
  }

  function openEditor(post: BlogPost) {
    setEditing(post);
    setEditTitle(post.title);
    setEditExcerpt(post.excerpt ?? "");
    setEditContent(post.content);
    setEditScheduledPublishAt(
      post.status === "draft"
        ? isoUtcToDatetimeLocalValue(post.scheduled_publish_at ?? null)
        : isoUtcToDatetimeLocalValue(post.published_at ?? null)
    );
    setShowPreview(true);
    setEditError(null);
    setEditMessage(null);
  }

  function closeEditor() {
    setEditing(null);
    setEditError(null);
    setEditMessage(null);
  }

  async function savePostEdits(options?: { publish?: boolean }) {
    if (!editing) return;
    const t = editTitle.trim();
    const c = editContent.trim();
    if (t.length < 3 || c.length < 20) {
      setEditError("Title and body are required (body at least 20 characters).");
      return;
    }
    setEditSaving(true);
    setEditError(null);
    setEditMessage(null);
    try {
      const publish = options?.publish === true;
      const rawSchedule = editScheduledPublishAt.trim();
      const scheduleIso = rawSchedule ? datetimeLocalInputToIsoUtc(rawSchedule) : null;
      if (rawSchedule && !scheduleIso) {
        setEditError("Invalid schedule date.");
        return;
      }
      const body: Record<string, unknown> = {
        title: t,
        excerpt: editExcerpt.trim() || null,
        content: c,
      };
      if (publish) {
        body.status = "published";
        if (scheduleIso) {
          body.scheduledPublishAt = scheduleIso;
        }
      } else if (editing.status === "draft") {
        body.scheduledPublishAt = scheduleIso;
      } else if (editing.status === "published" && scheduleIso) {
        body.scheduledPublishAt = scheduleIso;
      }

      const res = await fetch(`/api/dashboard/blog-posts/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEditError(typeof data.error === "string" ? data.error : "Failed to save.");
        return;
      }
      setEditMessage(
        publish
          ? scheduleIso
            ? "Updates saved; post is scheduled as set."
            : "Updates saved and post is published."
          : "Draft saved."
      );
      await load();
      if (data.post && typeof data.post === "object") {
        const p = data.post as BlogPost;
        setEditing(p);
        setEditTitle(p.title);
        setEditExcerpt(p.excerpt ?? "");
        setEditContent(p.content);
        if (p.status === "draft") {
          setEditScheduledPublishAt(isoUtcToDatetimeLocalValue(p.scheduled_publish_at ?? null));
        } else if (p.published_at) {
          setEditScheduledPublishAt(isoUtcToDatetimeLocalValue(p.published_at));
        } else {
          setEditScheduledPublishAt("");
        }
      }
    } catch {
      setEditError("Failed to save.");
    } finally {
      setEditSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-neutral-200">
            <FileText className="h-4 w-4 text-sky-700" aria-hidden />
            Company blog posts
          </p>
          <p className="mt-1 max-w-xl text-sm text-gray-600 dark:text-neutral-400">
            Draft and publish articles from here. Published posts appear on the public{" "}
            <code className="rounded bg-gray-400/20 px-1 text-xs">/blog</code> page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-gray-200/40 px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-neutral-200 shadow-sm hover:bg-gray-300/50 dark:hover:bg-neutral-800/50"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-400/30 dark:border-neutral-600/35 bg-white/40 p-3 text-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">Total posts</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-neutral-50">{posts.length}</p>
        </div>
        <div className="rounded-xl border border-gray-400/30 dark:border-neutral-600/35 bg-white/40 p-3 text-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">Published</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-neutral-50">{publishedCount}</p>
        </div>
        <div className="rounded-xl border border-gray-400/30 dark:border-neutral-600/35 bg-white/40 p-3 text-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">Drafts</p>
          <p className="mt-1 text-xl font-bold text-gray-900 dark:text-neutral-50">{posts.length - publishedCount}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-gray-300/20 dark:bg-neutral-800/50 p-4 shadow-inner">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">New post</p>
        <div className="mt-3 grid gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white/90 px-3 py-2 text-sm"
          />
          <input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short excerpt (optional)"
            className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white/90 px-3 py-2 text-sm"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Body: blank lines between paragraphs. Put ## Section title on its own line (# through ######) for sub-headings — they render as H2; a blank line before the heading is optional. The post title is the H1."
            rows={10}
            className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white/90 px-3 py-2 text-sm"
          />
          <div className="grid gap-1">
            <label className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">
              Schedule publish date
            </label>
            <input
              type="datetime-local"
              value={scheduledPublishAt}
              onChange={(e) => setScheduledPublishAt(e.target.value)}
              className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white/90 px-3 py-2 text-sm"
            />
            <p className="text-[11px] text-gray-500 dark:text-neutral-400">
              With <strong className="font-semibold">Save draft</strong>, the date is the planned go-live: the post
              becomes public on <code className="rounded bg-gray-400/20 px-0.5">/blog</code> automatically once that
              time passes (when someone opens the blog or CEO Blog tab, or on the Vercel cron).{" "}
              <strong className="font-semibold">Publish now</strong> marks it published immediately (or at the chosen
              future time if you set one).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void createPost(false)}
              className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-neutral-200 disabled:opacity-50"
            >
              Save draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void createPost(true)}
              className="rounded-lg border border-sky-600/50 bg-sky-100/80 px-3 py-1.5 text-xs font-semibold text-sky-900 disabled:opacity-50"
            >
              Publish now
            </button>
          </div>
          {message ? <p className="text-xs text-emerald-800">{message}</p> : null}
          {error ? <p className="text-xs text-red-700">{error}</p> : null}
        </div>
      </div>

      {editing ? (
        <div
          id="blog-post-editor"
          className="rounded-2xl border border-sky-500/40 dark:border-sky-500/35 bg-sky-50/40 dark:bg-sky-950/25 p-4 shadow-inner"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-900 dark:text-sky-200">
                View &amp; edit
              </p>
              <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
                Preview matches the public blog reader. Slug stays{" "}
                <code className="rounded bg-gray-400/20 px-1">{editing.slug}</code> (links stay stable).
              </p>
            </div>
            <button
              type="button"
              onClick={closeEditor}
              className="rounded-lg border border-gray-400/50 px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-neutral-200"
            >
              Close
            </button>
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-2 lg:gap-4">
            <div className="grid gap-3">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white/90 px-3 py-2 text-sm"
              />
              <input
                value={editExcerpt}
                onChange={(e) => setEditExcerpt(e.target.value)}
                placeholder="Short excerpt (optional)"
                className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white/90 px-3 py-2 text-sm"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Body"
                rows={12}
                className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white/90 px-3 py-2 text-sm font-mono"
              />
              <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-gray-700 dark:text-neutral-300">
                <input
                  type="checkbox"
                  checked={showPreview}
                  onChange={(e) => setShowPreview(e.target.checked)}
                  className="rounded border-gray-400"
                />
                Show preview
              </label>
              <div className="grid gap-1">
                <label className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">
                  {editing.status === "draft"
                    ? "Planned go-live (saved with Save draft; or use Publish now below)"
                    : "Adjust publish / display date"}
                </label>
                <input
                  type="datetime-local"
                  value={editScheduledPublishAt}
                  onChange={(e) => setEditScheduledPublishAt(e.target.value)}
                  className="rounded-lg border border-gray-400/50 dark:border-neutral-600/55 bg-white/90 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={editSaving}
                  onClick={() => void savePostEdits()}
                  className="rounded-lg border border-gray-400/50 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-neutral-200 disabled:opacity-50"
                >
                  {editing.status === "draft" ? "Save draft" : "Save changes"}
                </button>
                {editing.status === "draft" ? (
                  <button
                    type="button"
                    disabled={editSaving}
                    onClick={() => void savePostEdits({ publish: true })}
                    className="rounded-lg border border-sky-600/50 bg-sky-100/80 px-3 py-1.5 text-xs font-semibold text-sky-900 disabled:opacity-50"
                  >
                    Publish now
                  </button>
                ) : null}
              </div>
              {editMessage ? <p className="text-xs text-emerald-800">{editMessage}</p> : null}
              {editError ? <p className="text-xs text-red-700">{editError}</p> : null}
            </div>
            {showPreview ? (
              <div className="flex min-h-[280px] flex-col rounded-xl border border-gray-400/40 bg-white/80 p-4 dark:border-neutral-600/45 dark:bg-neutral-900/60">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-neutral-400">
                  Preview
                </p>
                <div className="mt-2 min-h-0 flex-1 overflow-y-auto">
                  <article className="prose-blog text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200">
                    <h1 className="mb-4 text-xl font-semibold text-neutral-900 dark:text-white sm:text-2xl">
                      {editTitle.trim() || "Title"}
                    </h1>
                    {renderBlogPostBody(editContent || "…")}
                  </article>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-gray-300/20 dark:bg-neutral-800/50 shadow-inner">
        <div className="border-b border-gray-400/30 dark:border-neutral-600/35 px-4 py-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">
            Existing posts
          </h3>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-gray-600 dark:text-neutral-400">
            <strong className="font-semibold text-gray-800 dark:text-neutral-200">Dates below:</strong> for{" "}
            <strong className="font-semibold">published</strong> posts, <em>Goes live</em> / <em>Published</em> uses
            the time stored in the database. For <strong className="font-semibold">drafts</strong>,{" "}
            <em>Planned go-live</em> is when the post will flip to published automatically. The public{" "}
            <code className="rounded bg-gray-400/20 px-1 text-[11px]">/blog</code> page only lists posts that are
            published and whose publish time is not in the future.
          </p>
        </div>
        {loading ? (
          <p className="px-4 py-8 text-sm text-gray-600 dark:text-neutral-400">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="px-4 py-8 text-sm text-gray-600 dark:text-neutral-400">No posts yet.</p>
        ) : (
          <ul className="divide-y divide-gray-400/20">
            {posts.map((p) => (
              <li key={p.id} className="px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900 dark:text-neutral-50">{p.title}</p>
                    <p className="text-xs text-gray-500 dark:text-neutral-500">
                      Slug <code className="rounded bg-gray-400/15 px-1 text-[11px]">{p.slug}</code> · Last
                      updated {new Date(p.updated_at).toLocaleString()}
                    </p>
                    {p.status === "published" && p.published_at ? (
                      <p
                        className={
                          isScheduledFuture(p.published_at)
                            ? "mt-1 text-xs font-semibold text-amber-900 dark:text-amber-100"
                            : "mt-1 text-xs text-gray-600 dark:text-neutral-400"
                        }
                      >
                        {isScheduledFuture(p.published_at) ? (
                          <>
                            Goes live on{" "}
                            <time dateTime={p.published_at}>{formatDateTimeShort(p.published_at)}</time>
                            <span className="font-normal text-amber-800/90 dark:text-amber-200/85">
                              {" "}
                              (your local time)
                            </span>
                          </>
                        ) : (
                          <>
                            Published{" "}
                            <time dateTime={p.published_at}>{formatDateTimeShort(p.published_at)}</time>
                          </>
                        )}
                      </p>
                    ) : p.status === "draft" && p.scheduled_publish_at ? (
                      <p
                        className={
                          isScheduledFuture(p.scheduled_publish_at)
                            ? "mt-1 text-xs font-semibold text-amber-900 dark:text-amber-100"
                            : "mt-1 text-xs text-gray-600 dark:text-neutral-400"
                        }
                      >
                        Planned go-live{" "}
                        <time dateTime={p.scheduled_publish_at}>
                          {formatDateTimeShort(p.scheduled_publish_at)}
                        </time>
                        {isScheduledFuture(p.scheduled_publish_at) ? (
                          <span className="font-normal text-amber-800/90 dark:text-amber-200/85">
                            {" "}
                            — draft; click <strong className="font-semibold">Publish</strong> when ready (uses this
                            time on /blog if still in the future).
                          </span>
                        ) : (
                          <span className="font-normal">
                            {" "}
                            — date is in the past; open View &amp; edit to set a new time or publish now.
                          </span>
                        )}
                      </p>
                    ) : p.status === "draft" ? (
                      <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                        Draft — no go-live date saved. Set &quot;Schedule publish date&quot; and Save draft, or open
                        View &amp; edit.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditor(p)}
                      className="rounded-lg border border-gray-400/50 bg-white/80 px-2.5 py-1 text-xs font-semibold text-gray-800 dark:border-neutral-600/55 dark:bg-neutral-800/80 dark:text-neutral-200"
                    >
                      View &amp; edit
                    </button>
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-700 dark:text-neutral-300">
                      {p.status}
                    </span>
                    {p.status === "published" && p.published_at ? (
                      <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-sky-800">
                        {new Date(p.published_at).getTime() > Date.now() ? "scheduled" : "live"}
                      </span>
                    ) : p.status === "draft" && p.scheduled_publish_at ? (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
                        planned
                      </span>
                    ) : null}
                    {p.status === "draft" ? (
                      <button
                        type="button"
                        onClick={() => void setStatus(p.id, "published")}
                        className="text-xs font-semibold text-sky-800 underline"
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void setStatus(p.id, "draft")}
                        className="text-xs font-semibold text-sky-800 underline"
                      >
                        Unpublish
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
