import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";
import { RoofingContactSection } from "@/components/roofing/roofing-contact-section";
import { RoofingFooter } from "@/components/roofing/roofing-footer";
import { RoofingHeader } from "@/components/roofing/roofing-header";
import {
  SITE_BUSINESS_PHONE,
  SITE_CONTACT_EMAIL,
  SITE_SERVICE_AREAS,
} from "@/constants/site";
import { canonicalUrl, ogForPath } from "@/lib/seo-metadata";
import { cn } from "@/lib/utils";

const SERVICE_CARDS = [
  {
    title: "Residential Roofing",
    description:
      "Complete roof installations and replacements for homes of every size and style.",
    bullets: [
      "Asphalt, metal & tile options",
      "Energy-efficient materials",
      "Lifetime workmanship warranty",
    ],
  },
  {
    title: "Commercial Solutions",
    description:
      "Durable flat and low-slope roofing systems built for commercial properties.",
    bullets: [
      "TPO, EPDM & modified bitumen",
      "Minimal business disruption",
      "Preventive maintenance plans",
    ],
  },
  {
    title: "Roof Repairs",
    description:
      "Fast, reliable repairs for leaks, storm damage, and wear before small issues become big ones.",
    bullets: [
      "Same-day emergency service",
      "Storm damage specialists",
      "Insurance claim assistance",
    ],
  },
  {
    title: "Roof Inspections",
    description:
      "Thorough inspections with detailed reports to keep your roof in peak condition.",
    bullets: [
      "Drone-assisted assessments",
      "Detailed written reports",
      "Pre-purchase inspections",
    ],
  },
  {
    title: "Gutter Systems",
    description:
      "Custom gutter installation and cleaning to protect your foundation and landscaping.",
    bullets: [
      "Seamless aluminum gutters",
      "Leaf guard systems",
      "Downspout extensions",
    ],
  },
  {
    title: "Skylight Installation",
    description:
      "Bring natural light into your home with professionally installed skylights.",
    bullets: [
      "Velux certified installer",
      "Leak-proof flashing",
      "Solar-powered options",
    ],
  },
] as const;

const GALLERY_ITEMS = [
  {
    src: "/hero1.jpg",
    name: "Heritage Estate",
    year: 2020,
    sizes: "(max-width: 1024px) 100vw, 33vw",
    gridClass:
      "min-h-[260px] sm:min-h-[280px] lg:col-span-2 lg:row-span-2 lg:col-start-1 lg:row-start-1 lg:min-h-[340px]",
  },
  {
    src: "/craftsman-residence1.jpg",
    name: "Craftsman Residence",
    year: 2021,
    sizes: "(max-width: 1024px) 100vw, 20vw",
    gridClass:
      "min-h-[260px] sm:min-h-[300px] lg:col-span-2 lg:row-span-3 lg:col-start-5 lg:row-start-1 lg:min-h-0",
  },
  {
    src: "/commercial-roof1.jpg",
    name: "Commercial Complex",
    year: 2022,
    sizes: "(max-width: 1024px) 100vw, 33vw",
    gridClass:
      "min-h-[200px] sm:min-h-[220px] lg:col-span-2 lg:col-start-3 lg:row-start-2 lg:min-h-[160px]",
  },
  {
    src: "/metal-roof1.jpg",
    name: "Standing Seam Metal",
    year: 2023,
    sizes: "(max-width: 1024px) 100vw, 25vw",
    gridClass:
      "min-h-[200px] sm:min-h-[220px] lg:col-span-2 lg:col-start-1 lg:row-start-3 lg:min-h-[180px]",
  },
  {
    src: "/metal-roof2.webp",
    name: "Modern Metal Roof",
    year: 2026,
    sizes: "(max-width: 1024px) 100vw, 25vw",
    gridClass:
      "min-h-[200px] sm:min-h-[220px] lg:col-span-2 lg:col-start-3 lg:row-start-3 lg:min-h-[180px]",
  },
  {
    src: "/modern-villa1.webp",
    name: "Modern Villa",
    year: 2025,
    sizes: "(max-width: 1024px) 100vw, 33vw",
    gridClass:
      "min-h-[200px] sm:min-h-[220px] lg:col-span-2 lg:col-start-3 lg:row-start-1 lg:min-h-[160px]",
  },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "We had some storm damage and met Byron from the crew through a neighbor's recommendation. To make a long story short, we had a great experience. They worked well with our insurance company, did quality work, and our project coordinator Nicky was amazing. In fact we contracted with them to do a complete remodel of the exterior of our home. This company is honest and reliable. I highly recommend them.",
    date: "4 months ago",
    name: "Geoff Sager",
    location: "Omaha, NE",
  },
  {
    quote:
      "The team made getting our roof done simple and easy — they dealt with my insurance on what they needed which made it hassle free for me. They came at about 630/7am and were gone by 5pm by the time I got home from work and were completely done with the roof! Thank you!",
    date: "2 months ago",
    name: "Sarah Wetzel",
    location: "Omaha, NE",
  },
  {
    quote:
      "The crew installed windows for us; we are very satisfied with their work and warmer too. Weather was a factor but that didn't stop them from freezing as they installed our windows. Looks 100% better inside and out! Very thankful for the help upgrading our home. Stayed true to their word and our budget and will definitely recommend this business to others. Thanks again.",
    date: "Recently",
    name: "Tracy Hanson",
    location: "Omaha, NE",
  },
  {
    quote:
      "I was recommended this roofing crew for storm damage repairs, which proved to be an excellent choice! They moved quickly to replace my roof, gutters and siding. The crew doing the work was efficient, courteous and left my property clean after the installations. Shout-out to Eddie for his professionalism, willingness to work around my schedule, making himself available for any and all questions, and keeping me updated through the process! Their customer-focused approach sets them apart from other similar companies!",
    date: "8 months ago",
    name: "Angela Dewall",
    location: "Bellevue, NE",
  },
  {
    quote:
      "Eddie and the roofing team have been amazing to work with! They managed everything with the insurance company with ease, communicated well throughout the process, and I ended up with a beautiful new roof and gutters. I recommend highly and would use again if ever needed.",
    date: "9 months ago",
    name: "Brooke Evans",
    location: "Papillion, NE",
  },
  {
    quote: `I had the pleasure of working with Eddie Jones and the team after having storm damage to both roof and siding. The salesman and the office help were wonderful in guiding me to make decisions on products and handled all information with my insurance company putting me at ease on what to do. His original comment to me was "I've got you" and he lived up to that for sure. Highly recommend for one-stop help for storm damage.`,
    date: "11 months ago",
    name: "Carol Jensen",
    location: "Omaha, NE",
  },
] as const;

const roofingDesc =
  "Residential and commercial roofing, repairs, inspections, and storm restoration across Omaha, Lincoln, and greater Nebraska.";

export const metadata: Metadata = {
  title: "Roofing | Omaha, Lincoln & Greater Nebraska | N-Tech Digital Solutions",
  description: roofingDesc,
  alternates: { canonical: canonicalUrl("/roofing") },
  openGraph: ogForPath("/roofing", "Roofing | N-Tech Digital Solutions", roofingDesc),
  robots: { index: true, follow: true },
};

const roofingJsonLd = {
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  name: "Roofing",
  description: roofingDesc,
  url: canonicalUrl("/roofing"),
  ...(SITE_BUSINESS_PHONE ? { telephone: SITE_BUSINESS_PHONE } : {}),
  email: SITE_CONTACT_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Omaha",
    addressRegion: "NE",
    addressCountry: "US",
  },
  areaServed: SITE_SERVICE_AREAS,
};

export default function RoofingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roofingJsonLd) }}
      />
      <main id="top" className="min-h-screen scroll-smooth">
        <RoofingHeader />

        <section
          id="roofing-hero"
          className="relative min-h-screen"
          aria-label="Hero"
        >
          <Image
            src="/hero1.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/25"
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" aria-hidden />

          <div className="relative z-10 flex min-h-screen flex-col justify-center px-5 pt-24 pb-20 sm:px-8 sm:pt-28 sm:pb-24">
            <div className="mx-auto w-full max-w-6xl">
              <div className="max-w-2xl text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/90 sm:text-sm">
                  Licensed and insured
                </p>

                <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.35rem]">
                  <span className="block">Roofing,</span>
                  <span className="mt-1 block text-white">Hometown Trust.</span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                  Protecting Omaha-area homes for over 25 years with craftsmanship that lasts generations.
                  When quality matters, you call the crew your neighbors trust.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="#contact"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-[#b45309] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_24px_rgba(180,83,9,0.45),0_0_40px_rgba(180,83,9,0.35),0_0_72px_rgba(180,83,9,0.2)] transition hover:bg-[#9a4508] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_4px_28px_rgba(180,83,9,0.55),0_0_48px_rgba(180,83,9,0.4)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                  >
                    Schedule Inspection
                  </Link>
                  <Link
                    href="#gallery"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border-2 border-white bg-transparent px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                  >
                    View our work
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </Link>
                </div>

                <div className="mt-16 grid max-w-xl grid-cols-1 gap-10 border-t border-white/25 pt-10 sm:grid-cols-3 sm:gap-8">
                  <div>
                    <p className="text-3xl font-semibold tabular-nums tracking-tight text-white sm:text-4xl">
                      500+
                    </p>
                    <p className="mt-1.5 text-sm font-medium uppercase tracking-wider text-white/75">
                      Roofs Completed
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold tabular-nums tracking-tight text-white sm:text-4xl">
                      25YR
                    </p>
                    <p className="mt-1.5 text-sm font-medium tracking-wider text-white/75">
                      WARRANTY
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold tabular-nums tracking-tight text-white sm:text-4xl">
                      98%
                    </p>
                    <p className="mt-1.5 text-sm font-medium uppercase tracking-wider text-white/75">
                      Client Satisfaction
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="services"
          className="scroll-mt-20 border-t border-neutral-200 bg-[#f8f9fa] px-5 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <div className="max-w-xl shrink-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b45309] sm:text-sm">
                  What we do
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-[2.5rem] md:leading-tight">
                  Complete roofing Solutions
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base lg:max-w-md lg:text-right">
                From new installations to emergency repairs across Omaha and eastern Nebraska, we handle
                every aspect of your roofing needs with precision and care.
              </p>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_CARDS.map((card) => (
                <article
                  key={card.title}
                  className="group flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition duration-300 ease-out hover:-translate-y-2 hover:border-neutral-300 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)]"
                >
                  <h3 className="text-lg font-semibold text-neutral-900">{card.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">
                    {card.description}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {card.bullets.map((line) => (
                      <li key={line} className="flex gap-2.5 text-sm text-neutral-700">
                        <Check
                          className="mt-0.5 size-4 shrink-0 text-[#b45309]"
                          strokeWidth={2.5}
                          aria-hidden
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="#contact"
                    className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-[#b45309] transition-[gap,color] duration-200 group-hover:gap-2.5 hover:text-[#9a4508]"
                  >
                    Learn more
                    <ArrowRight className="size-4 shrink-0" aria-hidden />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section
          id="gallery"
          className="scroll-mt-20 border-t border-neutral-200 bg-white px-5 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <div className="max-w-xl shrink-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b45309] sm:text-sm">
                  Our Craftsmanship
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-[2.5rem] md:leading-tight">
                  Projects We&apos;re Proud Of
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base lg:max-w-md lg:text-right">
                Every roof tells a story — from Omaha to Lincoln, here are a few we&apos;re especially proud of.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-3 lg:gap-5">
              {GALLERY_ITEMS.map((item) => (
                <figure
                  key={item.src}
                  className={cn(
                    "group relative isolate overflow-hidden rounded-2xl border border-neutral-200/90 bg-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition duration-300 ease-out will-change-transform hover:z-10 hover:scale-[1.03] hover:border-neutral-300 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.18)] sm:col-span-1",
                    item.gridClass
                  )}
                >
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    className="object-cover transition duration-500 ease-out group-hover:scale-110"
                    sizes={item.sizes}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-90 transition duration-300 group-hover:from-black/85"
                    aria-hidden
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 z-[1] p-4 sm:p-5">
                    <p className="text-base font-semibold text-white transition duration-300 group-hover:text-[#fdba73] sm:text-lg">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/95 opacity-0 translate-y-2 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {item.year}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-12 flex justify-center sm:mt-14">
              <Link
                href="#contact"
                className="inline-flex min-h-[48px] items-center justify-center rounded-md bg-[#b45309] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9a4508] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#b45309] focus-visible:ring-offset-2"
              >
                Start your project
              </Link>
            </div>
          </div>
        </section>
        <section
          id="testimonials"
          className="scroll-mt-20 border-t border-neutral-200 bg-[#f8f9fa] px-5 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <div className="max-w-xl shrink-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b45309] sm:text-sm">
                  Client Stories
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-[2.5rem] md:leading-tight">
                  <span className="block">What Our Neighbors</span>
                  <span className="block">Are Saying</span>
                </h2>
              </div>
              <div className="max-w-xs text-right lg:max-w-sm">
                <p className="text-4xl font-semibold tabular-nums tracking-tight text-neutral-900 sm:text-5xl">
                  4.9
                </p>
                <p className="mt-1 text-sm font-semibold text-neutral-800">200+ Reviews</p>
                <p className="mt-3 text-sm leading-snug text-neutral-600">
                  Rated #1 Roofing Contractor in the Omaha metro
                </p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {TESTIMONIALS.map((t, i) => (
                <article
                  key={i}
                  className="flex flex-col rounded-xl border border-neutral-200/80 bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:p-5"
                >
                  <p className="text-[13px] leading-[1.55] text-neutral-600 sm:text-sm sm:leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-3 flex gap-px text-[#b45309]" aria-label="5 out of 5 stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="size-3.5 fill-current" aria-hidden />
                    ))}
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-neutral-100/90 pt-3.5">
                    <div className="min-w-0 pr-1">
                      <p className="text-sm font-semibold leading-tight text-neutral-900">{t.name}</p>
                      <p className="mt-0.5 text-xs text-neutral-500">{t.location}</p>
                    </div>
                    <p className="shrink-0 text-right text-xs font-medium text-neutral-500">
                      {t.date}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <RoofingContactSection />
        <RoofingFooter />
      </main>
    </>
  );
}
