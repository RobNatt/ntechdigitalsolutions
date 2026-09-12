import type { LucideIcon } from "lucide-react";
import { Layers, Network, Rocket } from "lucide-react";

/*
 * The packages — how the services are actually bought.
 *
 * A service page answers "what is this and what does it do". A package page
 * answers "what happens when several of them run together", which is a
 * different question and the one the offer actually turns on. Nobody buys a
 * review generator; they buy a business that answers its phone, follows up, and
 * looks credible when someone checks.
 *
 * NO PRICES ANYWHERE. Final decision, 11 September 2026, after several
 * reversals — recorded in my-brain/offers.md. Price is a conversation on the
 * call. Do not add a price field to this interface; its absence is the rule.
 *
 * NAMING COLLISION, RESOLVED 11 September 2026. "Digital Foundation" was briefly
 * both a package and a service, because website + CRM + follow-up automations
 * had been merged into a single service. Rob's call: split the service back into
 * Branded Websites, CRM & Calendar Integrations, and Text & Email Automations,
 * and keep Digital Foundation as a package only. /services/digital-foundation
 * redirects to this package so the old URL never 404s.
 */

export interface PackageFaq {
  q: string;
  /**
   * APPROVED 12 September 2026, along with every other answer on the site.
   *
   * The two disambiguation answers in this file carry more weight than the
   * rest: they are what stops the voice agent confusing Digital Foundation with
   * The Digital Office, which it did on live calls before they existed. Changing
   * them is changing the fix.
   */
  a: string;
}

export interface Package {
  slug: string;
  name: string;
  icon: LucideIcon;
  /** Nav and card ordering, entry level first. */
  order: number;
  /** One line, used on cards and in the nav. */
  positioning: string;
  /** Who this is the right answer for. */
  forWho: string;
  /**
   * ONE UNAMBIGUOUS SENTENCE SAYING WHICH PACKAGE THIS IS AND WHICH IT IS NOT.
   *
   * Added 12 September 2026 after the GoHighLevel voice agent confused Digital
   * Foundation with The Digital Office on live calls. The names are near
   * synonyms in English and one package contains the other, so a retrieval
   * system given only prose about "the foundation everything plugs into" has
   * nothing decisive to latch onto. This field exists to be that decisive
   * sentence — it names the other package explicitly and states the boundary,
   * so the nearest match is never ambiguous. Keep it blunt; it is written for a
   * machine to quote as much as for a person to read.
   */
  distinct: string;
  /** The hero headline on the package's own page. */
  promise: string;
  /** Pain: what is happening now, without this. */
  pain: {
    heading: string;
    lead: string;
    rows: { n: string; title: string; body: string }[];
  };
  /** Story: the narrative of it changing. */
  story: {
    heading: string;
    lead: string;
    beats: { n: string; title: string; body: string }[];
  };
  /** Solution: what is in it, and why the combination is the point. */
  solution: {
    heading: string;
    lead: string;
    /** Slugs from lib/services.ts, rendered as links. The core of the internal linking. */
    serviceSlugs: string[];
    together: string;
  };
  faqs: PackageFaq[];
  /** The package to send someone to next, so every package page links sideways. */
  relatedPackage: string;
  /** Slug from lib/posts.ts. The required blog link. */
  featuredPost: string;
}

export const PACKAGES: Package[] = [
  {
    slug: "digital-foundation",
    name: "Digital Foundation",
    icon: Layers,
    order: 1,
    positioning:
      "The website, the CRM, and the follow-up — the three that only work as one.",
    forWho:
      "A business with either no website or one that does nothing, and no system holding the people who get in touch.",
    distinct:
      "Digital Foundation is the entry package. It is three things: a website, a CRM, and the follow-up automations between them. It does NOT include the AI receptionist, brand management or review generation — those are in the Digital Office, which is the larger package.",
    promise: "The groundwork, done once, properly.",
    pain: {
      heading: "A website on its own is a brochure nobody asked for.",
      lead: "Most businesses this size have some version of all three of these, and no connection between any of them. That is the actual problem — not the website.",
      rows: [
        {
          n: "01",
          title: "The site that just sits there",
          body: "It loads, it lists what you do, and nothing happens after that. Someone reads it, decides to think about it, and closes the tab. There was never a next step for them to take.",
        },
        {
          n: "02",
          title: "The enquiry in four places",
          body: "One came through the website form, one is a voicemail, one is a text on your personal phone, one is written on the back of an envelope. None of them are in the same place, so none of them get worked the same way.",
        },
        {
          n: "03",
          title: "The follow-up that depends on you remembering",
          body: "You meant to call them back Tuesday. Tuesday was busy. By Thursday it feels late, and by the following week it feels strange. Nobody decided to drop it — it just went.",
        },
      ],
    },
    story: {
      heading: "What changes in the first month",
      lead: "Not a redesign. A system that catches what the business is already generating and does something with it.",
      beats: [
        {
          n: "01",
          title: "Everything lands in one place",
          body: "The website form, the phone, the messages — all of it arrives in the same CRM, as the same kind of record, with the same history attached. You stop keeping the list in your head because the list exists somewhere.",
        },
        {
          n: "02",
          title: "The first reply stops being manual",
          body: "Someone gets in touch and hears back immediately, with something useful rather than an auto-reply saying we got your message. The gap where people go cold closes without anyone doing anything.",
        },
        {
          n: "03",
          title: "The site starts asking for something",
          body: "Every page has a next step on it and a reason to take it. The difference between a brochure and a front door is whether there is a handle.",
        },
      ],
    },
    solution: {
      heading: "What's in it",
      lead: "Three pieces. You genuinely cannot have one without the others and get anything out of it.",
      serviceSlugs: [
        "branded-websites",
        "crm-calendar-integrations",
        "text-email-automations",
      ],
      together:
        "The site collects, the CRM holds, the automations respond. Buy the site alone and you have a brochure. Buy the CRM alone and you have an empty database. The combination is the only version that does anything.",
    },
    faqs: [
      {
        q: "What's the difference between Digital Foundation and The Digital Office?",
        a: "Digital Foundation is three things: the website, the CRM and the follow-up automations. The Digital Office is those same three plus the AI receptionist, brand management and review generation — six things. Foundation is the smaller package and Infrastructure contains it. The quickest way to tell which one you are being quoted is whether the AI receptionist is included: if it is, that is the Digital Office.",
      },
      {
        q: "Do I own the website?",
        a: "Yes. Once you have paid for it, the site's content, branding and copy are yours — that is written into our terms. We keep our own methods and templates, and the platforms we build on keep their own terms.",
      },
      {
        q: "What happens to my existing website?",
        a: "It stays up until the new one is ready, then we point the domain across. You do not have a gap where nothing is live.",
      },
      {
        q: "How long does it take?",
        a: "The timeline depends on how quickly we get content, access and approvals from you — that is usually the long pole, not the build. We will give you a real date once we have seen what is involved.",
      },
      {
        q: "Do I have to learn the CRM?",
        a: "No. It is set up and run for you. You can log in and look at it whenever you want, and most people do at the start and then stop bothering.",
      },
    ],
    relatedPackage: "digital-office",
    featuredPost: "website-that-does-nothing",
  },
  {
    slug: "digital-office",
    name: "The Digital Office",
    icon: Network,
    order: 2,
    positioning:
      "Everything in the Foundation, plus the phone answered, the follow-up run and the reputation kept.",
    forWho:
      "A business where the work is good and the bottleneck is that everything routes through one person.",
    distinct:
      "The Digital Office is the middle package, and it contains all of Digital Foundation. It is six things: the website, the CRM and the follow-up automations, plus the AI receptionist, brand management and review generation. It does NOT include paid ads or SEO — those are in Growth Engine.",
    promise: "Your digital office, running without you in it.",
    pain: {
      heading: "The business doesn't stop while you're doing the actual work.",
      lead: "You're on a job, in a room with a customer, or head-down on the thing you're actually paid for. The phone, the search results and the reviews carry on without you, and they don't wait.",
      rows: [
        {
          n: "01",
          title: "The call you couldn't take",
          body: "It rang while your hands were full. It went to voicemail, or it just rang out, and whoever called is already talking to the next name on the list. You will never know it happened.",
        },
        {
          n: "02",
          title: "The follow-up that arrives too late",
          body: "You call back that evening. They were ready that morning. Nothing about your work was the problem — the gap was.",
        },
        {
          n: "03",
          title: "The reputation nobody is tending",
          body: "The happy customers say nothing publicly. The one bad day gets written up in detail. The page a stranger finds is an accident, not a record of how you actually work.",
        },
        {
          n: "04",
          title: "The evening admin shift",
          body: "The messages, the quotes, the chasing, the posting — it all happens after the real work is done, which means it happens badly or not at all.",
        },
      ],
    },
    story: {
      heading: "What changes when the office runs itself",
      lead: "Nothing about how you do the work changes. What changes is that the business keeps operating during the hours you are unavailable.",
      beats: [
        {
          n: "01",
          title: "The phone gets answered",
          body: "Every call, including the ones at 8pm and the ones while you are mid-job. The caller talks to something that knows what you do, answers what they asked, and puts the appointment in the calendar.",
        },
        {
          n: "02",
          title: "Nobody waits on you",
          body: "The reply, the reminder, the nudge before the appointment and the check-in after it all run on their own. The follow-up stops being a thing you owe people.",
        },
        {
          n: "03",
          title: "The public record starts matching the work",
          body: "Every customer gets asked, at the moment they are most likely to say yes. The happy ones are handed a direct link. Anyone less happy is asked privately what would have made it better — and nothing stops them posting publicly if they want to.",
        },
        {
          n: "04",
          title: "You get the evening back",
          body: "The admin shift was never the job. It was what happened because there was no system, and a system is a cheaper fix than another pair of hands.",
        },
      ],
    },
    solution: {
      heading: "What's in it",
      lead: "The Foundation, plus the three that run the business while you're busy being in it.",
      serviceSlugs: [
        "branded-websites",
        "crm-calendar-integrations",
        "text-email-automations",
        "ai-receptionist",
        "brand-management",
        "review-generator",
      ],
      together:
        "Each of these is worth something alone and considerably more connected. The receptionist books into the same calendar the automations watch. The automations ask for the review at the point the job is marked done. The reviews feed what a stranger finds when the site brought them in. It is one loop, not a stack of separate subscriptions.",
    },
    faqs: [
      {
        q: "What's the difference between Digital Foundation and The Digital Office?",
        a: "Digital Foundation is three things: the website, the CRM and the follow-up automations. The Digital Office is those same three plus the AI receptionist, brand management and review generation — six things. Foundation is the smaller package and Infrastructure contains it. The quickest way to tell which one you are being quoted is whether the AI receptionist is included: if it is, that is the Digital Office.",
      },
      {
        q: "Will callers know they're talking to an AI?",
        a: "We do not pretend otherwise. In practice most callers care about getting an answer and getting booked in, not about who picked up.",
      },
      {
        q: "What happens to calls it can't handle?",
        a: "It hands off. Anything outside what it has been given goes to you as a message with the context attached, rather than the caller being stuck in a loop.",
      },
      {
        q: "Are you filtering out bad reviews?",
        a: "No, and that would breach Google's policies. Everyone gets asked. Happy customers get a direct link because that is the step most people never get around to. Anyone less happy is asked privately what went wrong — and they can still post publicly whenever they like. We are not helping write a bad review; we are not blocking one either.",
      },
      {
        q: "Can I keep my existing phone number?",
        a: "Usually yes. It depends on your current carrier and how the number is held, and it is one of the first things we check.",
      },
      {
        q: "What do you need from me each month?",
        a: "Less than you would think, and the honest answer is that it front-loads — the first few weeks need your input on how you actually work, and after that it mostly runs.",
      },
    ],
    relatedPackage: "growth-engine",
    featuredPost: "missed-call-math",
  },
  {
    slug: "growth-engine",
    name: "Growth Engine",
    icon: Rocket,
    order: 3,
    positioning:
      "The full infrastructure, plus paid traffic and search — demand pointed at a system that can hold it.",
    forWho:
      "A business whose infrastructure already works and whose limit is now how many people know it exists.",
    distinct:
      "Growth Engine is the largest package, and it contains all of the Digital Office. It is everything in that package — website, CRM, follow-up automations, AI receptionist, brand management, review generation — plus paid ads management and SEO/AEO. Ad spend is separate and goes directly to Meta or Google.",
    promise: "Turn the volume up on something that already works.",
    pain: {
      heading: "Traffic into a business that can't catch it is money set on fire.",
      lead: "This is the package that comes last on purpose. Advertising a business that misses calls and never follows up is paying to find people you will then lose.",
      rows: [
        {
          n: "01",
          title: "Ads pointed at a page that can't convert",
          body: "The click costs the same whether the page works or not. Most agencies will happily run the campaign anyway, because the campaign is what they sell.",
        },
        {
          n: "02",
          title: "Ranking for things nobody searches",
          body: "Effort went into SEO, something moved, and nothing came of it — because the thing that moved was a term with no buying intent behind it.",
        },
        {
          n: "03",
          title: "Invisible to the thing people now ask",
          body: "A growing share of searches never reach a results page. Someone asks an assistant, gets one answer, and acts on it. If your business is not in what those tools can read, you are not in the running.",
        },
      ],
    },
    story: {
      heading: "What changes when demand meets a system",
      lead: "The infrastructure is the multiplier. Traffic is just the input.",
      beats: [
        {
          n: "01",
          title: "Every click lands somewhere that holds it",
          body: "The ad points at a page built to convert, the form feeds the CRM, the follow-up starts immediately, and the phone is answered if they would rather call. Nothing leaks between the click and the conversation.",
        },
        {
          n: "02",
          title: "Search works on intent, not vanity",
          body: "The target is the terms someone types when they are ready to spend money, not the ones with the biggest volume.",
        },
        {
          n: "03",
          title: "The site is written to be quoted",
          body: "Clear answers to real questions, structured so the tools people now ask can actually use them. The same work that makes a page rank makes it citable.",
        },
      ],
    },
    solution: {
      heading: "What's in it",
      lead: "Everything in the Digital Office, plus the two that bring people to it.",
      serviceSlugs: [
        "branded-websites",
        "crm-calendar-integrations",
        "text-email-automations",
        "ai-receptionist",
        "brand-management",
        "review-generator",
        "paid-ads",
        "seo-aeo",
      ],
      together:
        "Paid ads buy attention now; search earns it over time. Both of them empty into the same infrastructure, which is the only reason either is worth running. We would rather tell you to fix the catching before you pay for the throwing.",
    },
    faqs: [
      {
        q: "Is ad spend included?",
        a: "No. Ad spend goes directly to Meta or Google and is separate from what we charge to manage it. You see exactly what was spent and where.",
      },
      {
        q: "How long until SEO does anything?",
        a: "Longer than anyone selling it wants to say. It is a compounding channel, not a switch, which is exactly why it runs alongside paid rather than instead of it.",
      },
      {
        q: "What is AEO?",
        a: "Answer Engine Optimisation — being the source an AI assistant uses when someone asks it a question instead of running a search. It overlaps heavily with good SEO, and it is increasingly where the answer actually gets given.",
      },
      {
        q: "Can I start here?",
        a: "You can, and we would usually talk you out of it. Pointing paid traffic at a business that cannot catch it is the most expensive way to find out the infrastructure was the problem.",
      },
    ],
    relatedPackage: "digital-office",
    featuredPost: "ads-before-infrastructure",
  },
];

export function getPackage(slug: string) {
  return PACKAGES.find((p) => p.slug === slug);
}

export const PACKAGES_BY_ORDER = [...PACKAGES].sort((a, b) => a.order - b.order);
