import {
  Bot,
  Layers,
  Megaphone,
  Search,
  Share2,
  Star,
  type LucideIcon,
} from "lucide-react";

/*
 * The offer, as data.
 *
 * Website, CRM and follow-up automations are ONE product — the Digital
 * Foundation — not three. They were briefly separate services and that was
 * wrong: a site with no CRM behind it is a leaflet, and automations with
 * nothing to point at have nothing to automate. Selling them apart invites a
 * client to buy half a thing that can't work.
 *
 * One source drives the catalogue and every service page, so the pages can't
 * drift apart in structure or tone the way five hand-written files would. The
 * names and the one-line descriptions match the home page and `offers.md`
 * exactly — if they diverge, the home page is right and this is wrong.
 *
 * ALL LONG-FORM COPY HERE IS A DRAFT written in Rob's register, not final. It's
 * here so the pages are real enough to judge; every line is his to rewrite.
 *
 * NO PRICING ON THESE PAGES, deliberately. The home page holds the same line —
 * price is a conversation, not a header — and the flagship anchors at $3,000
 * with room to move, which published numbers would undercut. Flagged as a
 * question rather than decided unilaterally.
 */

export interface Service {
  slug: string;
  name: string;
  icon: LucideIcon;
  /*
   * "core" = one of the five pieces of The Scalable Digital Infrastructure.
   * "alacarte" = a standalone service that isn't in the flagship bundle.
   *
   * The distinction matters on the catalogue: flattening all of them into one
   * grid would quietly imply the flagship is seven pieces, which it isn't, and
   * it would make the bundle harder to sell as a bundle.
   */
  tier: "core" | "alacarte";
  /** One line. Matches the home page's stack section word for word. */
  tagline: string;
  /** The promise, for the page's own hero. */
  promise: string;
  situation: { heading: string; lead: string; rows: { n: string; title: string; body: string }[] };
  how: { heading: string; steps: { n: string; title: string; body: string }[] };
  included: string[];
  /** How this piece is worth more connected than alone. */
  connects: string;
}

export const SERVICES: Service[] = [
  {
    slug: "digital-foundation",
    tier: "core",
    name: "Digital Foundation",
    icon: Layers,
    tagline:
      "Your site, your CRM, and the follow-up that runs between them.",
    promise:
      "The foundation everything else is built on — and you can't really have one part without the others.",
    situation: {
      heading: "A site with nothing behind it is a leaflet.",
      lead: "Someone looks you up, decides in about ten seconds whether you're worth contacting, and reaches out. What happens in the next few minutes decides whether that turns into work — and it usually happens without you.",
      rows: [
        {
          n: "01",
          title: "Nothing to find",
          body: "No site, or a page that hasn't been touched in years. Either way the person looking has no reason to believe you're still operating, let alone the right call.",
        },
        {
          n: "02",
          title: "Nowhere for the lead to land",
          body: "A name on a notepad, a voicemail, a message in an inbox with forty other things. If every enquiry isn't in one place, some of them aren't being worked at all.",
        },
        {
          n: "03",
          title: "The reply that came too late",
          body: "They sent it at 4pm. You saw it at 8. By then they'd messaged two other people, and whoever answered first is already talking to them.",
        },
      ],
    },
    how: {
      heading: "How it works",
      steps: [
        {
          n: "01",
          title: "The site gets built first",
          body: "You see the finished site for your business before you sign anything. Not a mockup, not a template with your logo dropped in — the real thing, built and working.",
        },
        {
          n: "02",
          title: "Every enquiry lands in the CRM",
          body: "Form, call, message, wherever it came from. One place, with a record of what they wanted and when they asked, so nothing quietly disappears.",
        },
        {
          n: "03",
          title: "They hear back before they forget",
          body: "A text or an email goes out straight away, whether you've seen it or not — and again if they go quiet. The chase happens without anyone having to remember to chase.",
        },
      ],
    },
    included: [
      "A fully branded site, built for your business specifically",
      "Mobile-first — most people looking you up are on a phone",
      "Built to load fast and be found, not just to look good",
      "A CRM holding every lead in one place",
      "Instant confirmation by text or email when someone reaches out",
      "Follow-up sequences that run on their own, written in your voice",
      "Hosting and upkeep handled",
    ],
    connects:
      "This is the piece everything else plugs into. The receptionist books into the calendar the site exposes, ads and SEO send people to it, social points at it, and reviews are what convince them once they arrive. Take any other service without this and it has nowhere to send the work it generates.",
  },
  {
    slug: "ai-receptionist",
    tier: "core",
    name: "AI receptionist",
    icon: Bot,
    tagline: "Picks up every call and gets it on the calendar, even when you can't.",
    promise: "Meet Stuart. He answers the phone so a missed call stops meaning a lost job.",
    situation: {
      heading: "The phone rings at the worst possible moment, every time.",
      lead: "You're with a customer, driving, or mid-something you can't put down. The call goes unanswered — and the person calling has a list.",
      rows: [
        {
          n: "01",
          title: "The call you couldn't take",
          body: "It rings out. You get to it forty-five minutes later, in the first gap you had. They'd already booked someone else.",
        },
        {
          n: "02",
          title: "The voicemail nobody leaves",
          body: "Most people don't leave one. They hang up and dial the next name, and you never find out the call happened at all.",
        },
        {
          n: "03",
          title: "The hours you're not open",
          body: "Evenings and weekends are when plenty of people finally get round to sorting things out. That's exactly when nobody's answering.",
        },
      ],
    },
    how: {
      heading: "How Stuart works",
      steps: [
        {
          n: "01",
          title: "He picks up",
          body: "Every call, at any hour, including the ones that come in while you're already on another. Nothing lands in a dead voicemail box.",
        },
        {
          n: "02",
          title: "He knows your business",
          body: "What you do, what you don't, your service area, your hours. He's set up on your specifics, so he sounds like your business rather than a switchboard.",
        },
        {
          n: "03",
          title: "He books the work",
          body: "Takes the details, finds the opening, puts it on your calendar. You find out when you check your phone — the job already booked.",
        },
      ],
    },
    included: [
      "Answers calls from the site and catches the ones your business line misses",
      "Available outside your working hours",
      "Set up on your services, your area, and your availability",
      "Books straight into your calendar",
      "Every call logged, with what was said and what was booked",
    ],
    connects:
      "Stuart books into the calendar the website exposes, and the automations pick up anyone he couldn't close on the call. He's also the face of the brand — the same character you'll see in the social content.",
  },
  {
    slug: "social-media-management",
    tier: "core",
    name: "Social media management",
    icon: Share2,
    tagline:
      "Your posts stay active, and the people commenting get followed up with.",
    promise:
      "A feed that looks like a business still trading, without you having to feed it.",
    situation: {
      heading: "An abandoned profile says more than no profile at all.",
      lead: "Someone finds your page, sees the last post was eighteen months ago, and quietly wonders whether you're still going. That's the whole judgement, made in a second.",
      rows: [
        {
          n: "01",
          title: "The account nobody's touched",
          body: "Not because it doesn't matter, but because posting consistently is a job, and it's never the most urgent one on any given day.",
        },
        {
          n: "02",
          title: "The comment nobody answered",
          body: "Someone asked a real question under a post. Nobody saw it. It's still sitting there, publicly, telling everyone else what happens when you ask.",
        },
        {
          n: "03",
          title: "The posts that go nowhere",
          body: "Content for the sake of content, pointing at nothing. Activity without a destination doesn't turn into work.",
        },
      ],
    },
    how: {
      heading: "How it works",
      steps: [
        {
          n: "01",
          title: "A schedule that actually runs",
          body: "Posts go out consistently — part time or full time, depending on what you've taken. You aren't reminded, chased, or asked to approve every one.",
        },
        {
          n: "02",
          title: "Made from your actual work",
          body: "Send b-roll if you have it and it gets used. If you don't, content still goes out — your footage improves it, it doesn't gate it.",
        },
        {
          n: "03",
          title: "Comments get answered",
          body: "People who engage get a reply, and anyone asking a real question gets pointed somewhere they can actually book.",
        },
      ],
    },
    included: [
      "Part time: 3–4 posts a week",
      "Full time: 7 posts a week minimum",
      "Optional b-roll from you — it improves the content, it isn't required",
      "Comments and messages followed up",
      "Everything pointing back at the site",
      "Mascot-branded content available as an add-on",
    ],
    connects:
      "Social is the top of the funnel — it sends people to the site, where the receptionist and the automations take over. On its own it's noise; connected, it's the part that makes people aware you exist at all.",
  },
  {
    slug: "review-generator",
    tier: "core",
    name: "Review generator",
    icon: Star,
    tagline:
      "Happy customers get asked at the right moment. Everyone gets asked.",
    promise:
      "The work you already do, finally visible to people deciding whether to call.",
    situation: {
      heading: "The work is good. There's just nothing saying so.",
      lead: "A stranger comparing you against two competitors has no way to know you're the better call. They have three listings and a star rating, and that's the whole basis of the decision.",
      rows: [
        {
          n: "01",
          title: "The review nobody asked for",
          body: "Happy customers rarely think to leave one unprompted. Not because they wouldn't — because nobody asked, and the moment passed.",
        },
        {
          n: "02",
          title: "The asking that never happens",
          body: "You mean to. You're going to. Then the next job starts and it's a fortnight later and asking now would be strange.",
        },
        {
          n: "03",
          title: "The problem you found out about publicly",
          body: "Someone wasn't happy and you never heard. The first you knew was reading it, in public, with no chance to have fixed it.",
        },
      ],
    },
    how: {
      heading: "How it works",
      steps: [
        {
          n: "01",
          title: "Everyone gets asked",
          body: "After the work is done, while it's still fresh, every customer gets the same invitation to leave a public review. Nobody is filtered out based on what they might say.",
        },
        {
          n: "02",
          title: "And everyone gets a way to tell you privately",
          body: "The same follow-up gives them a direct line to you. If something went wrong, you hear it from them rather than reading it later.",
        },
        {
          n: "03",
          title: "Asked at the moment it's easy to say yes",
          body: "Timing is most of it. Asked right after the job, people say yes. Asked three weeks later, they don't.",
        },
      ],
    },
    included: [
      "Automatic review requests after every completed job",
      "A private channel for feedback, offered to everyone",
      "Timed to go out while the work is still fresh",
      "Requests in your voice, not a generic template",
      "Reviews tracked so you can see what's landing",
    ],
    connects:
      "Reviews are what convince someone the site and the social already brought in. They're the last thing a person checks before calling, and the receptionist answers the call they prompt.",
  },
  {
    slug: "paid-ads",
    tier: "alacarte",
    name: "Paid ads management",
    icon: Megaphone,
    tagline: "Ads on Meta and Google, pointed at a page built to catch them.",
    promise: "Traffic you can turn on — landing somewhere that actually converts.",
    situation: {
      heading: "Most ad money is lost after the click, not before it.",
      lead: "The ad works. Someone taps it, lands on a page that doesn't answer their question or give them a way to book, and leaves. The money was spent the moment they clicked.",
      rows: [
        {
          n: "01",
          title: "Boosting posts and hoping",
          body: "The button is right there and it's easy to press. What it buys is reach, not customers, and there's no way to tell the difference afterwards.",
        },
        {
          n: "02",
          title: "Nothing tracked",
          body: "Money goes out, some work comes in, and nobody can say which ad produced which job. Without that, every decision about spend is a guess.",
        },
        {
          n: "03",
          title: "Traffic landing nowhere",
          body: "The click arrives at a homepage, or a page with no obvious next step. Paying to send people somewhere that doesn't convert is the most expensive way to run ads.",
        },
      ],
    },
    how: {
      heading: "How it works",
      steps: [
        {
          n: "01",
          title: "Pointed at something that converts",
          body: "Ads go to a page built to take the click — the offer, a way to book, a reason to trust you. This is why ads work better once the rest of the system is in place.",
        },
        {
          n: "02",
          title: "Tracked end to end",
          body: "Clicks are tied to leads, and leads to booked work, in the CRM. You see what a customer actually costs rather than what a click costs.",
        },
        {
          n: "03",
          title: "Adjusted on what happened",
          body: "Budget moves toward what produced work and away from what didn't. Not weekly guesswork — decisions made against the numbers.",
        },
      ],
    },
    included: [
      "Campaign setup and management on Meta and Google",
      "Audience, keyword and location targeting for your service area",
      "Ad creative built from your existing content",
      "Conversion tracking wired into the CRM",
      "Plain-language reporting on what produced work",
      "Ad spend is paid directly to Meta and Google and is separate from the management fee",
    ],
    connects:
      "Ads are the fastest tap you can turn on, and the easiest money to waste. They need the website to land on, the receptionist to answer what they generate, and the automations to follow up — without those, you are paying to send people somewhere that drops them.",
  },
  {
    slug: "seo-aeo",
    tier: "alacarte",
    name: "SEO & AEO",
    icon: Search,
    tagline:
      "Get found by search engines — and by the AI tools people now ask instead.",
    promise: "Be the answer, whether they search for it or ask for it.",
    situation: {
      heading: "People stopped scrolling to page two a long time ago.",
      lead: "And increasingly they aren't scrolling at all — they ask an AI assistant and take the answer it gives. If you aren't in the answer, you were never in the running.",
      rows: [
        {
          n: "01",
          title: "Ranking nowhere in particular",
          body: "You come up if someone searches your business name. That only helps people who already know you exist, which is not the group you need.",
        },
        {
          n: "02",
          title: "A listing nobody maintains",
          body: "Wrong hours, an old address, no photos, no categories. The local listing is what decides the map result, and it's usually the least tended thing a business owns.",
        },
        {
          n: "03",
          title: "Invisible to the AI answer",
          body: "Someone asks an assistant who to call for this in their area. It names three businesses. Being unfindable to those tools is the new version of not being on the first page.",
        },
      ],
    },
    how: {
      heading: "How it works",
      steps: [
        {
          n: "01",
          title: "Fix the foundations",
          body: "Site speed, structure, mobile, and the technical groundwork search engines read before they read anything else. Unglamorous, and nothing else works without it.",
        },
        {
          n: "02",
          title: "Answer what people actually ask",
          body: "Pages built around the real questions people type and speak, in your service area — not keyword stuffing, but genuinely being the best answer available.",
        },
        {
          n: "03",
          title: "Make it readable to machines",
          body: "Structured data and clear, well-formed content so search engines and AI assistants can both understand what you do, where, and for whom.",
        },
      ],
    },
    included: [
      "Technical SEO — speed, structure, mobile, crawlability",
      "Local SEO and Google Business Profile management",
      "Content built around real questions in your service area",
      "Structured data so AI assistants can read and cite you",
      "Rank and visibility tracking, reported in plain language",
      "SEO compounds slowly — this is a months-long play, not a switch",
    ],
    connects:
      "SEO and AEO are slow and compounding; paid ads are fast and stop the moment you stop paying. Run together, one covers the other's weakness — and both need a site worth landing on and a receptionist to answer what they produce.",
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
