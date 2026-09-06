import {
  Bot,
  Globe,
  MessagesSquare,
  Share2,
  Star,
  type LucideIcon,
} from "lucide-react";

/*
 * The five pieces of the offer, as data.
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
    slug: "website",
    name: "Website",
    icon: Globe,
    tagline:
      "The page that answers “are you legit” before anyone picks up the phone.",
    promise:
      "A site that holds up when someone checks you out — and that everything else plugs into.",
    situation: {
      heading: "Most people decide before they ever contact you.",
      lead: "Someone hears your name, looks you up, and makes a judgement in about ten seconds. That judgement happens whether or not you have anything for them to look at.",
      rows: [
        {
          n: "01",
          title: "Nothing to find",
          body: "No site, or a page that hasn't been touched in years. Either way the person looking has no reason to believe you're still operating, let alone the right call.",
        },
        {
          n: "02",
          title: "Nowhere to go next",
          body: "They found you, they're interested, and there's no obvious way to book, call, or ask a question. Interest with no exit turns back into nothing.",
        },
        {
          n: "03",
          title: "Nothing connected to it",
          body: "A site that sits on its own is a brochure. It doesn't know who visited, doesn't follow up, and doesn't tell you anything you can act on.",
        },
      ],
    },
    how: {
      heading: "How it works",
      steps: [
        {
          n: "01",
          title: "Built before you ever sign",
          body: "You see the finished site for your business first. Not a mockup, not a template with your logo dropped in — the real thing, built and working.",
        },
        {
          n: "02",
          title: "Wired into everything else",
          body: "Forms go into the CRM. Calls route to the receptionist. Bookings land on the calendar. The site stops being a leaflet and starts being the front door.",
        },
        {
          n: "03",
          title: "Yours, and kept current",
          body: "Once it's paid for, the site and its content are yours. It doesn't go stale, and you never have to log in and fight a page builder to change a phone number.",
        },
      ],
    },
    included: [
      "A fully branded site, built for your business specifically",
      "Mobile-first — most people looking you up are on a phone",
      "Built to load fast and be found, not just to look good",
      "Contact and booking wired into your CRM and calendar",
      "Hosting and upkeep handled",
    ],
    connects:
      "Every other piece points back here. The receptionist books into the calendar the site exposes, the automations follow up on the leads the site captures, social sends people to it, and reviews are what convince them once they arrive.",
  },
  {
    slug: "follow-up-automations",
    name: "Follow-up automations",
    icon: MessagesSquare,
    tagline:
      "Every lead gets a text or email before they forget they reached out.",
    promise:
      "Nobody sits waiting on you to get around to them.",
    situation: {
      heading: "The gap between reaching out and hearing back is where leads die.",
      lead: "Someone sends an enquiry at 4pm. You see it at 8. By then they've messaged two other people, and whoever replied first is already talking to them.",
      rows: [
        {
          n: "01",
          title: "The reply that comes too late",
          body: "Not because you didn't care — because you were doing the actual work. The lead doesn't know that, and doesn't wait around to find out.",
        },
        {
          n: "02",
          title: "The follow-up nobody made",
          body: "Most enquiries need more than one touch. The second one almost never happens, because remembering to chase people isn't anybody's job.",
        },
        {
          n: "03",
          title: "The lead nobody wrote down",
          body: "A name on a notepad, a voicemail, a message in an inbox with forty other things. If it isn't in one place, it isn't being worked.",
        },
      ],
    },
    how: {
      heading: "How it works",
      steps: [
        {
          n: "01",
          title: "Every lead lands in one place",
          body: "Form, call, message, wherever it came from — it goes into the CRM with a record of what they wanted and when they asked.",
        },
        {
          n: "02",
          title: "They hear back immediately",
          body: "A text or an email goes out straight away, confirming you've got it and telling them what happens next. It goes out whether you've seen it or not.",
        },
        {
          n: "03",
          title: "And again, if they go quiet",
          body: "Follow-ups run on a schedule you set once. The chase happens without anyone having to remember to chase.",
        },
      ],
    },
    included: [
      "A CRM holding every lead in one place",
      "Instant confirmation by text or email when someone reaches out",
      "Follow-up sequences that run on their own",
      "Everything logged, so you can see what actually happened",
      "Written in your voice, not a template",
    ],
    connects:
      "This is the piece that makes the others worth having. The site and the receptionist bring people in; without follow-up, a good share of them quietly go cold before anyone speaks to them.",
  },
  {
    slug: "ai-receptionist",
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
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
