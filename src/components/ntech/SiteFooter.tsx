import Image from "next/image";
import Link from "next/link";
import { ChannelChip } from "@/components/ntech/primitives";
import { SITE_CONTACT_EMAIL, SITE_SERVICE_AREAS, SITE_BUSINESS_PHONE, siteTelHref } from "@/constants/site";

const COLUMNS = [
  {
    heading: "System",
    links: [
      { name: "Infrastructure", href: "/infrastructure" },
      { name: "Pricing", href: "/pricing" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Book With Us", href: "/book-call" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-and-conditions" },
    ],
  },
] as const;

export function SiteFooter() {
  const tel = siteTelHref();
  return (
    <footer className="border-t border-rule bg-field-sunken">
      <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/ntech-logo.png"
              alt="N-Tech Digital Solutions"
              width={669}
              height={598}
              className="h-16 w-auto object-contain"
            />
            <p className="mt-4 max-w-xs text-[0.875rem] leading-relaxed text-muted-ink">
              {SITE_SERVICE_AREAS}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <ChannelChip tone="muted">Omaha, NE</ChannelChip>
              <ChannelChip tone="muted">Lincoln, NE</ChannelChip>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="type-data text-[0.75rem] uppercase text-muted-ink">{col.heading}</p>
              <ul className="mt-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      prefetch={link.href === "/blog" ? false : undefined}
                      className="flex min-h-11 items-center text-[0.9375rem] text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-data text-[0.75rem] text-muted-ink">
            © {new Date().getFullYear()} N-Tech Digital Solutions
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={`mailto:${SITE_CONTACT_EMAIL}`}
              className="type-data inline-flex min-h-11 items-center text-[0.75rem] text-ink underline-offset-4 hover:underline"
            >
              {SITE_CONTACT_EMAIL}
            </a>
            {tel && SITE_BUSINESS_PHONE ? (
              <a
                href={tel}
                className="type-data inline-flex min-h-11 items-center text-[0.75rem] text-ink underline-offset-4 hover:underline"
              >
                {SITE_BUSINESS_PHONE}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
