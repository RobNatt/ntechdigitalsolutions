import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";

/*
 * Footer.
 *
 * Deliberately minimal — it exists so the page ends with who and where, which
 * a prospect checking N-Tech out actually wants, rather than a wall of links to
 * pages that don't exist yet.
 *
 * The legal links are real pages, not placeholders — a dead or missing policy
 * link on a site that asks for your details is exactly the wrong corner to cut.
 */

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background px-6 py-16 md:px-12 lg:px-20">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3">
          <LogoMark
            id="ntech-footer"
            title="N-Tech Digital Solutions"
            variant="duotone"
            className="h-8 w-8 text-primary"
          />
          <span className="font-heading text-body font-semibold tracking-[0.14em] text-foreground">
            N-TECH
          </span>
        </div>

        <div className="text-body text-muted-foreground">
          <p className="text-foreground">N-Tech Digital Solutions</p>
          <p className="mt-2">Serving Omaha, NE and the surrounding area</p>
          <p className="mt-2">
            <a
              href="mailto:hello@ntechdigitalsolutions.com"
              className="inline-flex min-h-[24px] items-center underline-offset-4 transition-colors duration-[180ms] hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              hello@ntechdigitalsolutions.com
            </a>
          </p>

          {/* min-h-[24px] on each link is the design system's target-size rule, not
              decoration: these rendered at 23px (and the email above at 20px), under the
              24x24 WCAG 2.5.8 minimum. The inline exception covers a link inside a running
              sentence; a row of navigation links is not that. inline-flex grows the hit
              area without shifting the text off its baseline. */}
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-small">
            <Link
              href="/services"
              className="inline-flex min-h-[24px] items-center underline-offset-4 transition-colors duration-[180ms] hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Services
            </Link>
            <Link
              href="/privacy"
              className="inline-flex min-h-[24px] items-center underline-offset-4 transition-colors duration-[180ms] hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="inline-flex min-h-[24px] items-center underline-offset-4 transition-colors duration-[180ms] hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
