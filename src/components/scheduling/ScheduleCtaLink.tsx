"use client";

import Link from "next/link";
import { CONSTANTS } from "@/constants/links";
import { getCalendlyEventUrl } from "@/constants/scheduling";
import { cn } from "@/lib/utils";

export type ScheduleCtaLinkProps = {
  children: React.ReactNode;
  className?: string;
  /** Query string without leading `?` — only applied when Calendly is not configured (in-app `/book-call`). */
  bookCallSearch?: string;
} & Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "onClick" | "aria-label" | "id" | "title" | "style"
>;

/**
 * Primary “schedule / book a call” CTA: opens Calendly when `NEXT_PUBLIC_CALENDLY_EVENT_URL` is set,
 * otherwise `/book-call` with optional `bookCallSearch`.
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
