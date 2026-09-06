import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/services";

/*
 * The 404.
 *
 * Next's default is an unstyled black-on-white line of text, which is a strange
 * thing to show someone thirty seconds after telling them you build good
 * websites. This is the site's own dark surface, and it does the one useful
 * thing a 404 can do: put the routes that exist in front of someone who just
 * asked for one that doesn't.
 *
 * The service list is read from lib/services rather than hard-coded, so a page
 * added or renamed there can't leave a dead link behind here.
 *
 * NO ENTRANCE ANIMATION, DELIBERATELY. The first version wrapped everything in
 * Reveal with trigger="mount" and the page rendered blank — all eleven wrappers
 * sat at opacity 0 in both dev and a production build, because Next does not run
 * those mount animations inside not-found.tsx. The design system forbids content
 * that is invisible by default, and a 404 has the least margin for that failure
 * of any page: it is what someone sees when something has already gone wrong, so
 * it has to be readable with no JavaScript running at all. Static markup is the
 * fix, not a different trigger.
 */

export default function NotFound() {
  return (
    <main className="flex-1">
      <section className="surface-dark grain relative isolate overflow-hidden px-6 pb-24 pt-40 md:px-12 md:pb-32 md:pt-48 lg:px-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-[-10%] top-[-30%] h-[80vh] w-[80vh] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.16),transparent_62%)] blur-[100px]" />
        </div>

        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-4 text-overline uppercase text-muted-foreground">
                <span aria-hidden="true" className="h-px w-12 bg-cta" />
                404
              </p>

              <h1 className="mt-8 max-w-[16ch] text-display font-heading text-foreground">
                That page isn&apos;t here.
              </h1>

              <p className="mt-8 max-w-[50ch] text-body-lg text-muted-foreground">
                Either the link was wrong or we moved something and didn&apos;t
                redirect it properly. If it&apos;s the second one, that&apos;s
                our fault — tell us and we&apos;ll fix it.
              </p>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/"
                  className="group inline-flex items-center justify-center gap-2 rounded-md bg-cta px-8 py-4 text-body font-medium text-on-cta transition-[transform,box-shadow] duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Back to the home page
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </Link>
                <a
                  href="mailto:hello@ntechdigitalsolutions.com?subject=Broken%20link%20on%20ntechdigital.solutions"
                  className="text-body text-muted-foreground underline-offset-4 transition-colors duration-[180ms] hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Report the broken link
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-overline uppercase text-muted-foreground">
                What is here
              </p>

              <ul className="mt-8 border-t border-border">
                {SERVICES.map(({ slug, name, tagline }) => (
                  <li key={slug} className="border-b border-border">
                    <Link
                      href={`/services/${slug}`}
                      className="group flex items-baseline justify-between gap-6 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      <span className="text-body font-medium text-foreground transition-colors duration-[180ms] group-hover:text-cta">
                        {name}
                      </span>
                      <span className="hidden max-w-[22ch] text-right text-small text-muted-foreground sm:block">
                        {tagline}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
