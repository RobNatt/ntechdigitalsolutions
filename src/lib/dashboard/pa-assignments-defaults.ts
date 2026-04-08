import type { PaAssignment, PaAssignmentFrequency } from "@/lib/dashboard/pa-assignments";

function w(
  id: string,
  title: string,
  frequency: PaAssignmentFrequency,
  description: string,
  weekdaySlot?: number
): PaAssignment {
  return {
    id,
    title,
    description,
    frequency,
    ...(weekdaySlot !== undefined ? { weekdaySlot } : {}),
    lastCompletedAt: null,
    createdAt: new Date().toISOString(),
  };
}

const WEEKDAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

/** Stable IDs so we can merge without duplicating. */
export const NTech_ACCOUNTABILITY_PACK_IDS = new Set(
  [
    "ntech-w-blog",
    "ntech-w-location",
    "ntech-w-faq",
    "ntech-w-repurpose",
    "ntech-w-refresh-pages",
    "ntech-d-mon-tech",
    "ntech-d-tue-onpage",
    "ntech-d-wed-local",
    "ntech-d-thu-content",
    "ntech-d-fri-leads",
    "ntech-d-sat-social",
    "ntech-d-sun-plan",
    "ntech-w-onboarding-portal",
    "ntech-w-launch-welcome-perf",
    "ntech-w-sales-train",
  ] as const
);

/** Full default pack: weekly content cadence + weekday calendar accountability + strategic follow-ups. */
export function getNtechAccountabilityPack(): PaAssignment[] {
  return [
    w(
      "ntech-w-blog",
      "Weekly: publish one blog",
      "weekly",
      "Publish one blog per week."
    ),
    w(
      "ntech-w-location",
      "Weekly/biweekly: location page",
      "weekly",
      "Publish or update one location page per week or biweekly (mark done when you ship one)."
    ),
    w(
      "ntech-w-faq",
      "Ongoing: FAQ or service subpage",
      "weekly",
      "Add one FAQ or service subpage whenever you find a recurring question (mark done each time you ship one)."
    ),
    w(
      "ntech-w-repurpose",
      "Weekly: repurpose blog to social + GBP + short-form",
      "weekly",
      "Repurpose each blog into social posts, GBP posts, and short-form content."
    ),
    w(
      "ntech-w-refresh-pages",
      "Monthly rhythm: refresh old pages",
      "weekly",
      "Refresh old pages monthly with new internal links and keyword improvements — each week, do at least one concrete refresh toward that monthly goal."
    ),

    w(
      "ntech-d-mon-tech",
      "Monday: Technical & tracking",
      "weekday",
      `Check Search Console for indexing issues.
Check Bing Webmaster Tools for crawl issues.
Review form submissions and conversion data.
Test all key pages, forms, and automations.
Confirm no broken links, redirects, or page errors.`,
      0
    ),
    w(
      "ntech-d-tue-onpage",
      "Tuesday: On-page SEO",
      "weekday",
      `Review one service page.
Improve title tag, meta description, headers, and internal links.
Add one FAQ block or clarity section.
Improve copy for search intent and conversion.
Check schema and page speed if needed.`,
      1
    ),
    w(
      "ntech-d-wed-local",
      "Wednesday: Local / GEO",
      "weekday",
      `Update Google Business Profile.
Post one GBP update.
Add or refresh photos.
Respond to any reviews.
Check service area and category accuracy.
Review local pack rankings and map visibility.`,
      2
    ),
    w(
      "ntech-d-thu-content",
      "Thursday: Content",
      "weekday",
      `Publish or schedule one blog.
Add one location page or service-area page.
Update one older post with new stats, links, or examples.
Add internal links from new content to money pages.
Reuse the blog in social posts and GBP posts.`,
      3
    ),
    w(
      "ntech-d-fri-leads",
      "Friday: Lead system",
      "weekday",
      `Review lead quality.
Review follow-up speed.
Review booked-call rate.
Review cold/warm/hot lead distribution.
Adjust qualification rules if junk leads are coming in.
Test one new call-to-action or form variation.`,
      4
    ),
    w(
      "ntech-d-sat-social",
      "Saturday: Social repurposing",
      "weekday",
      `Turn the week's blog into 3-5 short posts.
Turn one client win or internal result into a proof post.
Repost one educational tip.
Link back to the relevant page or lead magnet.`,
      5
    ),
    w(
      "ntech-d-sun-plan",
      "Sunday: Planning",
      "weekday",
      `Choose next week's keyword/theme.
Choose one page to improve.
Choose one local SEO action.
Choose one automation improvement.
Queue all content for the week.
Add a few things to follow up with me on completing.`,
      6
    ),

    w(
      "ntech-w-onboarding-portal",
      "Follow-up: client onboarding portal (CEO authorizes client)",
      "weekly",
      "New client onboarding portal — you'll authorize a client via CEO dashboard when you build the flow. Track progress weekly until shipped."
    ),
    w(
      "ntech-w-launch-welcome-perf",
      "Follow-up: launch, welcome & performance checklists",
      "weekly",
      "Launch checklist, welcome checklist, and ongoing performance checklist — not highest priority but cannot miss; advance one checklist item per week."
    ),
    w(
      "ntech-w-sales-train",
      "Follow-up: sales materials & sales training materials",
      "weekly",
      "Sales materials and sales training materials — maintain weekly progress (draft, review, or ship one piece)."
    ),
  ];
}

export function weekdaySlotLabel(slot: number): string {
  return WEEKDAY_NAMES[slot] ?? `Day ${slot}`;
}
