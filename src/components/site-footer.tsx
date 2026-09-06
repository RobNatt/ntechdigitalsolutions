import { LogoMark } from "@/components/brand/logo-mark";

/*
 * Footer.
 *
 * Deliberately minimal — it exists so the page ends with who and where, which
 * a prospect checking N-Tech out actually wants, rather than a wall of links to
 * pages that don't exist yet.
 *
 * No privacy policy link until a privacy policy exists. Linking to a page that
 * isn't written is worse than omitting it, and on a site whose pitch is honesty
 * it's the wrong corner to cut.
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
              className="underline-offset-4 transition-colors duration-[180ms] hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              hello@ntechdigitalsolutions.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
