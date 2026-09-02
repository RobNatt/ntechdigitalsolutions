"use client";

import Link from "next/link";
import { CONSTANTS } from "@/constants/links";
import { SITE_GHL_CALENDAR_URL } from "@/constants/site";
import { getCalendlyEventUrl } from "@/constants/scheduling";
import { cn } from "@/lib/utils";

export type ScheduleCtaLinkProps = {
  children: React.ReactNode;
  className?: string;
  /** Query string without leading `?` — only applied when booking to `/book-call`. */
  bookCallSearch?: string;
} & Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "onClick" | "aria-label" | "id" | "title" | "style"
>;

/**
 * Primary "schedule / book a call" CTA: prefers GHL calendar on `/book-call`,
 * falls back to Calendly if available, then in-app `/book-call` with optional `bookCallSearch`.
 */
export function ScheduleCtaLink({
  children,
  className,
  bookCallSearch,
  onClick,
  "aria-label": ariaLabel,
  id,
  title,
  style,
}: ScheduleCtaLinkProps) {
  // Prefer GHL calendar — link to /book-call which will embed it
  if (SITE_GHL_CALENDAR_URL) {
    let href = CONSTANTS.BOOK_CALL_PATH;
    if (bookCallSearch) {
      href += bookCallSearch.startsWith("?") ? bookCallSearch : `?${bookCallSearch}`;
    }
    return (
      <Link
        href={href}
        className={cn(className)}
        onClick={onClick}
        aria-label={ariaLabel}
        id={id}
        title={title}
        style={style}
      >
        {children}
      </Link>
    );
  }

  // Fallback to Calendly if configured
  const cal = getCalendlyEventUrl();
  if (cal) {
    return (
      <a
        href={cal}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(className)}
        onClick={onClick}
        aria-label={ariaLabel}
        id={id}
        title={title}
        style={style}
      >
        {children}
      </a>
    );
  }

  // Final fallback to in-app /book-call
  let href = CONSTANTS.BOOK_CALL_PATH;
  if (bookCallSearch) {
    href += bookCallSearch.startsWith("?") ? bookCallSearch : `?${bookCallSearch}`;
  }

  return (
    <Link
      href={href}
      className={cn(className)}
      onClick={onClick}
      aria-label={ariaLabel}
      id={id}
      title={title}
      style={style}
    >
      {children}
    </Link>
  );
}
