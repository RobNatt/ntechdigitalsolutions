import { SITE_URL } from "@/constants/site";

type ServiceTopicJsonLdProps = {
  path: string;
  name: string;
  description: string;
  serviceType: string;
};

/**
 * Service + BreadcrumbList JSON-LD for each of the 5 infrastructure components on /infrastructure.
 */
export function ServiceTopicJsonLd({
  path,
  name,
  description,
  serviceType,
}: ServiceTopicJsonLdProps) {
  const base = SITE_URL.replace(/\/$/, "");
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
          { "@type": "ListItem", position: 2, name: "Infrastructure", item: `${base}/infrastructure` },
          { "@type": "ListItem", position: 3, name, item: url },
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
        areaServed: { "@type": "Country", name: "United States" },
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
