import Link from "next/link";
import { ActivityLog, ActivityRow, ChannelChip, ctaPrimary, ctaSecondary } from "@/components/ntech/primitives";
import { SiteFooter } from "@/components/ntech/SiteFooter";
import { SiteNav } from "@/components/ntech/SiteNav";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main id="main" className="bg-field">
        <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
          <ChannelChip tone="muted">404</ChannelChip>
          <h1 className="type-display mt-6 text-[2.25rem] text-ink sm:text-[3rem]">
            That page never completed.{" "}
            <span className="text-muted-ink">This one is on us, not you.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted-ink">
            The address you followed doesn&apos;t point anywhere. Everything the site actually covers
            is one of the three links below.
          </p>

          <ActivityLog label="Request log" className="mt-10">
            <ActivityRow
              stamp="Just now"
              channel="form"
              action="Page requested"
              outcome="Not found"
              state="failed"
            />
          </ActivityLog>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className={ctaPrimary}>
              Go to the homepage
            </Link>
            <Link href="/infrastructure" className={ctaSecondary}>
              Learn More
            </Link>
            <Link href="/contact" className={ctaSecondary}>
              Contact us
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
