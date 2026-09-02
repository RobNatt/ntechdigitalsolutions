"use client";

import { cn } from "@/lib/utils";

export type GetMoreInfoButtonProps = {
  children: React.ReactNode;
  className?: string;
  formId?: string;
} & Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "aria-label" | "id" | "title" | "style"
>;

/**
 * CTA button that scrolls to the intake form at the bottom of the page.
 * Replaces external booking links with an in-page form experience.
 */
export function GetMoreInfoButton({
  children,
  className,
  formId = "intake-form",
  onClick,
  "aria-label": ariaLabel,
  id,
  title,
  style,
}: GetMoreInfoButtonProps) {
  function handleClick() {
    onClick?.();
    const element = document.getElementById(formId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(className)}
      aria-label={ariaLabel}
      id={id}
      title={title}
      style={style}
    >
      {children}
    </button>
  );
}
