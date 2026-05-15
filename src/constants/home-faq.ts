export type HomeFaqItem = {
  question: string;
  answer: string;
};

export const HOME_FAQ_ITEMS: readonly HomeFaqItem[] = [
  {
    question: "What exactly does NTech provide?",
    answer:
      "We build connected growth systems that combine conversion-focused websites, targeted advertising, and lead tracking dashboards to help businesses generate and manage more qualified leads.",
  },
  {
    question: "Why combine websites, ads, and dashboards together?",
    answer:
      "Most businesses use disconnected tools that make it difficult to track performance and optimize growth. Our systems are designed to work together so traffic, conversion, and lead tracking remain connected.",
  },
  {
    question: "Do you work with specific industries?",
    answer:
      "We primarily work with service-based businesses and companies looking to improve lead generation, visibility, and operational efficiency through modern digital systems.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "Project timelines vary depending on scope, but most website and system builds are completed within a few weeks.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. We offer ongoing support, optimization, reporting, and growth-focused improvements depending on the needs of the business.",
  },
  {
    question: "Will I be able to track leads and performance?",
    answer:
      "Yes. Our dashboards provide visibility into lead activity, campaign performance, and customer engagement in one centralized location.",
  },
  {
    question: "Do I need all three services to work with you?",
    answer:
      "Not necessarily. However, businesses typically see stronger results when websites, advertising, and tracking systems are connected strategically.",
  },
  {
    question: "How do we get started?",
    answer:
      "Start by scheduling a strategy call. We'll learn more about your business, current systems, and growth goals to determine whether we're a strong fit.",
  },
] as const;
