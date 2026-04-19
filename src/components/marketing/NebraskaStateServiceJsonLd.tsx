import { SITE_URL } from "@/constants/site";

type NebraskaStateServiceJsonLdProps = {
  path: string;
  name: string;
  description: string;
  serviceType: string;
};

/**
 * Service + BreadcrumbList for Nebraska statewide SEO / marketing landings.
 */
export function NebraskaStateServiceJsonLd({
  path,
  name,
  description,
  serviceType,
}: NebraskaStateServiceJsonLdProps) {
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
