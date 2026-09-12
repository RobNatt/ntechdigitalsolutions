/*
 * The blog.
 *
 * Posts are data rather than MDX on purpose. The whole point of this section is
 * that Stuart's knowledge base is built by crawling the site — when he takes a
 * call, the answers he gives come from what the crawler found here. Structured
 * blocks mean every post renders with the same semantic shape (one h1, ordered
 * h2s, real paragraphs), which is what makes a page parseable. Freehand MDX
 * drifts, and a drifting page becomes a gap in what he can answer on the phone.
 *
 * ALL POST BODIES ARE DRAFTS written in Rob's register but not by him. They
 * claim no results, name no clients, and quote no statistics — every number
 * would have to be sourced, and there is no client data yet to source one from.
 * Nothing here should go in front of a prospect until he has read it.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface Post {
  slug: string;
  title: string;
  /** Meta description and the card line on the index. */
  excerpt: string;
  /** ISO date. Used for sitemap lastModified and the visible byline. */
  date: string;
  readingMinutes: number;
  /** Shown as an overline. Keep the set small — these are not tags for their own sake. */
  category: string;
  body: Block[];
  /** Required internal links out of every post: a service, a package. */
  relatedServiceSlug: string;
  relatedPackageSlug: string;
}

export const POSTS: Post[] = [
  {
    slug: "website-that-does-nothing",
    title: "Your website isn't broken. It just doesn't do anything.",
    excerpt:
      "Most small business websites load fine, look fine, and generate nothing. The problem usually isn't the design — it's that there was never a next step on the page.",
    date: "2026-09-11",
    readingMinutes: 4,
    category: "Foundations",
    body: [
      {
        type: "p",
        text: "When a business owner tells us their website isn't working, they usually mean it looks dated. That is almost never the actual problem. The site loads, it lists the services, the photos are fine. Someone reads it, thinks about it, and closes the tab — and nothing about that sequence had anything to do with the design.",
      },
      {
        type: "h2",
        text: "A brochure and a front door are different objects",
      },
      {
        type: "p",
        text: "A brochure describes a business. A front door lets someone in. Most small business websites are brochures: they answer what do you do and stop there, leaving the visitor to work out on their own what they are supposed to do next, at the exact moment they were most likely to act.",
      },
      {
        type: "p",
        text: "The test is simple. Open any page of your site and ask what the single next action is. If the honest answer is scroll, or read the next paragraph, or find the phone number in the header if you happen to look up, then the page is a brochure.",
      },
      {
        type: "h2",
        text: "Where the enquiries actually go",
      },
      {
        type: "p",
        text: "The second half of the problem is what happens after someone does get in touch. In most businesses this size the enquiries arrive in four different places — the website form, a voicemail, a text to a personal phone, and something written down during a call. None of them are in the same system, so none of them get handled the same way.",
      },
      {
        type: "p",
        text: "This is why a new website on its own so often changes nothing. It improves the front door of a building with no hallway behind it.",
      },
      {
        type: "h2",
        text: "What to fix first",
      },
      {
        type: "ul",
        items: [
          "Put one obvious next step on every page, and make it the same step.",
          "Send every enquiry into one place, regardless of which channel it arrived through.",
          "Reply immediately and automatically, with something useful — not an acknowledgement.",
          "Write down what happens to an enquiry after it arrives, then automate that sequence.",
        ],
      },
      {
        type: "quote",
        text: "A website that collects nothing is not a cheap website. It is an expensive one that happens to be paid for already.",
      },
      {
        type: "p",
        text: "None of this requires a redesign. It requires the site, the CRM and the follow-up to be the same system rather than three things bought separately, which is the whole reason we stopped selling them separately.",
      },
    ],
    relatedServiceSlug: "branded-websites",
    relatedPackageSlug: "digital-foundation",
  },
  {
    slug: "missed-call-math",
    title: "The missed call is the most expensive thing in your business",
    excerpt:
      "Nobody tracks the calls they didn't take, which is exactly why they keep happening. Here is what is actually going on in the forty-five minutes before you call back.",
    date: "2026-09-11",
    readingMinutes: 5,
    category: "Operations",
    body: [
      {
        type: "p",
        text: "Every business has a number it never looks at: the calls that rang out. There is no report for it, no notification, nothing that lands in an inbox. The call simply does not happen, and the day carries on. That invisibility is the whole problem — you cannot manage a loss you never see.",
      },
      {
        type: "h2",
        text: "What happens in the gap",
      },
      {
        type: "p",
        text: "Someone needs the thing you do. They search, they find three businesses, they call the first one. Your hands are full — you are on a job, in a room with a customer, or driving. It rings out.",
      },
      {
        type: "p",
        text: "They do not leave a voicemail. Almost nobody leaves a voicemail any more. They call the second number on the list, and if that one answers, the decision is made before you have finished what you were doing. By the time you call back that afternoon, the job is booked with someone else. Nothing about your work was ever compared to theirs.",
      },
      {
        type: "h2",
        text: "Why calling back faster is not the fix",
      },
      {
        type: "p",
        text: "The obvious response is to try harder — check the phone more, call back quicker. It does not hold, because the constraint is not effort. You cannot answer the phone while doing the work that the phone is calling about. Every business that tries this solves it the same way eventually: by having something else answer.",
      },
      {
        type: "p",
        text: "Historically that meant hiring someone, which is a salary to solve a problem that occupies a few minutes an hour. The alternative is a system that picks up every time, knows what you do, answers what was asked, and books the appointment into the same calendar you already use.",
      },
      {
        type: "h2",
        text: "What good looks like",
      },
      {
        type: "ul",
        items: [
          "Every call is answered, including evenings and while you are mid-job.",
          "The caller gets a real answer to the question they asked, not a menu.",
          "Anything outside what the system knows is handed to you with the context attached.",
          "The booking lands in the calendar your follow-up automations already watch.",
        ],
      },
      {
        type: "quote",
        text: "You will never see the report for the calls you missed. That is precisely why it is worth fixing.",
      },
    ],
    relatedServiceSlug: "ai-receptionist",
    relatedPackageSlug: "digital-infrastructure",
  },
  {
    slug: "ads-before-infrastructure",
    title: "Why we'll talk you out of running ads first",
    excerpt:
      "Paid traffic into a business that can't catch it is the most expensive possible way to discover your infrastructure was the problem.",
    date: "2026-09-11",
    readingMinutes: 4,
    category: "Growth",
    body: [
      {
        type: "p",
        text: "Paid advertising is the easiest thing in this industry to sell, because it is the easiest thing to start. A budget, a campaign, some creative, and there is visible activity within a day. It is also the thing most likely to waste a business owner's money, and the order of operations is the reason.",
      },
      {
        type: "h2",
        text: "The click costs the same either way",
      },
      {
        type: "p",
        text: "An ad buys a visit. What happens after the visit is entirely determined by the infrastructure behind it. If the page has no clear next step, if the form does not feed a system, if the phone rings out when they would rather call — the click cost the same as it would have if all of those things worked.",
      },
      {
        type: "p",
        text: "Paying to send people into a business that cannot catch them does not just fail to work. It actively costs money per person to demonstrate that the problem was never traffic.",
      },
      {
        type: "h2",
        text: "The order that works",
      },
      {
        type: "ul",
        items: [
          "First, the site collects and the CRM holds what comes in.",
          "Then the follow-up runs on its own and the phone is always answered.",
          "Then the reputation is tended, so a stranger checking you out finds a record rather than an accident.",
          "Only then is it worth paying to increase how many strangers arrive.",
        ],
      },
      {
        type: "h2",
        text: "What about search?",
      },
      {
        type: "p",
        text: "Search is the same argument on a longer timescale, with one addition. A growing share of searches never reach a results page at all — someone asks an assistant, gets a single answer, and acts on it. Being the source that answer is drawn from is a different job from ranking, and it depends on having pages that clearly answer real questions.",
      },
      {
        type: "quote",
        text: "We would rather tell you to fix the catching before you pay for the throwing.",
      },
    ],
    relatedServiceSlug: "paid-ads",
    relatedPackageSlug: "growth-engine",
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}

export const POSTS_BY_DATE = [...POSTS].sort((a, b) =>
  b.date.localeCompare(a.date),
);
