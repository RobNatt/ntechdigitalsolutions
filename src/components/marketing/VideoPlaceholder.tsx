"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type VideoPlaceholderProps = {
  title: string;
  description?: string;
  /** Direct video URL (mp4/webm) or an embeddable iframe URL (YouTube/Vimeo). Omit until a real video exists. */
  videoUrl?: string;
  /** Set when `videoUrl` is an iframe-embeddable URL rather than a direct video file. */
  embed?: boolean;
  className?: string;
};

/**
 * Reusable video slot for VSLs and "Learn more" explainers. Renders a poster + play button when
 * no `videoUrl` is set yet, so the layout is ready ahead of the real recording — swap in a URL
 * (or wire it to an env var / CMS field) once one exists, no layout changes needed.
 */
export function VideoPlaceholder({ title, description, videoUrl, embed, className }: VideoPlaceholderProps) {
  const [playing, setPlaying] = useState(false);

  if (videoUrl && (playing || embed)) {
    return (
      <div className={cn("relative aspect-video overflow-hidden rounded-2xl bg-black", className)}>
        {embed ? (
          <iframe
            src={videoUrl}
            title={title}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video src={videoUrl} controls autoPlay className="h-full w-full" />
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => videoUrl && setPlaying(true)}
      className={cn(
        "group relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-900 to-neutral-800 text-center dark:border-neutral-800",
        videoUrl ? "cursor-pointer" : "cursor-default",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-neutral-900 shadow-lg transition",
          videoUrl && "group-hover:scale-105",
        )}
        aria-hidden
      >
        <Play className="ml-0.5 h-6 w-6" fill="currentColor" />
      </span>
      <div className="px-6">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs text-neutral-300">{description ?? "Video coming soon."}</p>
      </div>
    </button>
  );
}
