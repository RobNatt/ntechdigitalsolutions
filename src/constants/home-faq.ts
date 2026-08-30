export type HomeFaqItem = {
  question: string;
  answer: string;
};

export const HOME_FAQ_ITEMS: readonly HomeFaqItem[] = [
  {
    question: "What exactly does N-Tech provide?",
    answer:
      "One connected infrastructure system for local service businesses: a website with a lead form and Call Now button, an AI receptionist that answers and books calls, lead-form automation with instant CRM entry and follow-up, Facebook/Instagram management, and Google review automation — all under one flat monthly retainer.",
  },
  {
    question: "How do I stop missing calls from customers?",
    answer:
      "An AI receptionist answers every call your team can't take — nights, weekends, or busy periods — attempts to book the appointment, and logs the caller's details in your CRM automatically, so no call goes untracked.",
  },
  {
    question: "How do I get more 5-star Google reviews?",
    answer:
      "Review automation routes 5-star experiences to post publicly on Google, while anything below 5 stars is intercepted as private feedback first — protecting your public rating while surfacing real complaints you can act on.",
  },
  {
    question: "Do I need all five components, or can I start with one?",
    answer:
      "The system is built as one connected infrastructure, so our primary offer bundles all five. If budget is a blocker, ask about a smaller starting scope with fewer components.",
  },
  {
    question: "What businesses is this built for?",
    answer:
      "Local service businesses that lose money to missed calls, slow lead follow-up, and inconsistent reviews. We're launching focused on the Omaha metro and Lincoln, Nebraska.",
  },
  {
    question: "How much does it cost to automate a small business's marketing?",
    answer:
      "We're running a limited case-study pricing phase right now to get honest results from real businesses before standard rates take effect. Book a call for the number that applies to your business.",
  },
  {
    question: "Do you manage paid ads too?",
    answer:
      "Not as part of the core system. Ad management and spend are a separate add-on we typically discuss after onboarding, once the infrastructure exists to actually convert the traffic ads generate.",
  },
  {
    question: "How do we get started?",
    answer:
      "Book a call. We'll walk through what's leaking leads in your business today and show you what the infrastructure system would look like for you.",
  },
] as const;
