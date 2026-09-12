"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

/*
 * A nav item that opens a list of its own pages.
 *
 * Services and Packages both have children now, and a nav that only links to
 * the index makes someone take two steps to reach the page they actually want.
 *
 * BEHAVIOUR, and why each part is here:
 *
 *  - Opens on hover AND on click. Hover alone strands touch users, who have no
 *    hover; click alone makes a mouse user work for something a hover would
 *    have given them. Both, with the same state, costs nothing.
 *  - The trigger is a <button>, not a link, because it toggles something. The
 *    index page is reachable as the first item inside the panel ("Everything in
 *    …"), so nothing is lost by the trigger not being a link itself.
 *  - Escape closes and returns focus to the trigger. Clicking outside closes.
 *    Moving focus out of the whole group closes, which is what makes tabbing
 *    through the nav behave.
 *  - aria-expanded and aria-controls are on the trigger, so a screen reader
 *    announces the state rather than the user discovering it by accident.
 *
 * The panel animates with opacity and translate only, under 200ms, per the
 * motion rules in design-system.md. It is a menu, not a moment.
 */

export interface NavChild {
  label: string;
  href: string;
  blurb?: string;
}

export function NavDropdown({
  label,
  indexHref,
  indexLabel,
  items,
  lifted,
}: {
  label: string;
  indexHref: string;
  /** The wording for the link to the section's own index page. */
  indexLabel: string;
  items: NavChild[];
  /** True once the pill has gone white, so the trigger matches the nav. */
  lifted: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wide = items.length > 4;
  const groupRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!groupRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={groupRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-small transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
          lifted
            ? "text-[#57534E] hover:bg-[#0C0A09]/[0.05] hover:text-[#1C1917]"
            : "text-white/70 hover:bg-white/10 hover:text-white"
        }`}
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 transition-transform duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/*
        Two columns once there are more than four items. With eight services and
        a blurb each, a single column measured 746px — taller than the viewport
        on a laptop, so the last two services were unreachable. Two columns
        halves the height and costs nothing at three items, where the panel
        stays single-column and narrow.
      */}
      <div
        id={panelId}
        hidden={!open}
        className={`absolute left-1/2 top-full z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 pt-3 ${
          wide ? "w-[600px]" : "w-[340px]"
        }`}
      >
        <div className="overflow-hidden rounded-xl border border-black/[0.06] bg-white/98 p-2 shadow-[0_16px_48px_rgba(12,10,9,0.18),0_2px_8px_rgba(12,10,9,0.08)] backdrop-blur-xl">
          <ul className={wide ? "grid grid-cols-2 gap-x-1" : ""}>
            {items.map(({ label: childLabel, href, blurb }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 transition-colors duration-[180ms] hover:bg-[#0C0A09]/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="block text-small font-medium text-[#1C1917]">
                    {childLabel}
                  </span>
                  {blurb ? (
                    <span className="mt-0.5 block text-[0.8125rem] leading-snug text-[#57534E]">
                      {blurb}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-1 border-t border-black/[0.06] pt-1">
            <Link
              href={indexHref}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-small font-medium text-[#A16207] transition-colors duration-[180ms] hover:bg-[#A16207]/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {indexLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
