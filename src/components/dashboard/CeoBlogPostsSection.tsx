"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: "draft" | "published";
  published_at: string | null;
  updated_at: string;
};

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
      const res = await fetch("/api/dashboard/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          publish,
          scheduledPublishAt: publish && scheduledPublishAt ? scheduledPublishAt : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to create post.");
        return;
      }
      setMessage(
        publish
          ? scheduledPublishAt
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
            placeholder="Write your article..."
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
              Optional. Use with “Publish now” to schedule a future publish time.
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

      <div className="overflow-hidden rounded-2xl border border-gray-400/40 dark:border-neutral-600/45 bg-gray-300/20 dark:bg-neutral-800/50 shadow-inner">
        <div className="border-b border-gray-400/30 dark:border-neutral-600/35 px-4 py-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-600 dark:text-neutral-400">
            Existing posts
          </h3>
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
                      /blog#{p.slug} · {new Date(p.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-700 dark:text-neutral-300">
                      {p.status}
                    </span>
                    {p.status === "published" && p.published_at ? (
                      <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-sky-800">
                        {new Date(p.published_at).getTime() > Date.now() ? "scheduled" : "live"}
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
