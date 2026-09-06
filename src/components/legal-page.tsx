import type { ReactNode } from "react";

/*
 * Shared shell for the legal pages.
 *
 * Deliberately plain: no motion, no glass, no current running through it. These
 * pages exist to be read and believed, and decorating them would work against
 * that. They still use the design system's type scale and colour tokens, so
 * they belong to the site rather than looking like a bolted-on afterthought.
 *
 * Measure is capped at 68ch per the type rules — legal prose is the one place
 * on the site where someone actually reads every line.
 */

interface LegalPageProps {
  title: string;
  updated: string;
  intro: string;
  children: ReactNode;
}

export function LegalPage({ title, updated, intro, children }: LegalPageProps) {
  return (
    <main className="flex-1 px-6 pb-32 pt-40 md:px-12 md:pt-48 lg:px-20">
      <article className="mx-auto max-w-[68ch]">
        <p className="text-overline uppercase text-muted-foreground">
          Last updated {updated}
        </p>
        <h1 className="mt-6 text-h1 font-heading text-foreground">{title}</h1>
        <p className="mt-8 text-body-lg text-muted-foreground">{intro}</p>

        <div className="mt-16 space-y-12">{children}</div>

        <p className="mt-20 border-t border-border pt-8 text-small text-muted-foreground">
          Questions about anything on this page? Email{" "}
          <a
            href="mailto:hello@ntechdigitalsolutions.com"
            className="text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            hello@ntechdigitalsolutions.com
          </a>{" "}
          and a person will answer.
        </p>
      </article>
    </main>
  );
}

export function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-h3 font-heading text-foreground">{heading}</h2>
      <div className="mt-4 space-y-4 text-body text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}
