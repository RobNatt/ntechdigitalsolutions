import { SITE_URL } from "@/constants/site";

type OmahaLocalServiceJsonLdProps = {
  path: string;
  name: string;
  description: string;
  serviceType: string;
};

/**
 * Local Service + BreadcrumbList for Omaha / Nebraska metro landing pages.
 */
export function OmahaLocalServiceJsonLd({
  path,
  name,
  description,
  serviceType,
}: OmahaLocalServiceJsonLdProps) {
  const base = SITE_URL.replace(/\/$/, "");
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
      {
        "@type": "Service",
        name,
        description,
        serviceType,
        url,
        provider: {
          "@type": "Organization",
          name: "N-Tech Digital Solutions",
          url: base,
        },
        areaServed: [
          {
            "@type": "City",
            name: "Omaha",
            containedInPlace: { "@type": "State", name: "Nebraska" },
          },
          {
            "@type": "City",
            name: "Lincoln",
            containedInPlace: { "@type": "State", name: "Nebraska" },
          },
          { "@type": "State", name: "Nebraska" },
          { "@type": "Country", name: "United States" },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
