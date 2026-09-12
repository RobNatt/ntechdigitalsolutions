import {
  Bot,
  CalendarCheck,
  Globe,
  Megaphone,
  MessagesSquare,
  Search,
  Share2,
  Star,
  type LucideIcon,
} from "lucide-react";

/*
 * The offer, as data.
 *
 * SPLIT 11 September 2026. Website, CRM and follow-up automations were one
 * service called the Digital Foundation. They are now three services —
 * Branded Websites, Text & Email Automations, and CRM & Calendar Integrations —
 * and the Digital Foundation is a PACKAGE only, in lib/packages.ts. A service
 * page answers what one thing does; a package page answers what happens when
 * several run together, and the Foundation was always the second kind of page
 * wearing the first kind's clothes. /services/digital-foundation redirects to
 * the package.
 *
 * Superseded note, kept for the reasoning:
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
 * NO PRICING ANYWHERE ON THE SITE. Settled 11 September 2026 and described by
 * Rob as final after several reversals: no price appears on a service page, a
 * package page, or anywhere else. The pricing tier component was deleted rather
 * than unmounted so it cannot quietly return. Price is a conversation on the
 * call.
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
  /**
   * DRAFT ANSWERS. True and conservative — no results, no price, no client
   * named — but not Rob's approved wording. These matter more than normal
   * copy: Stuart's knowledge base is built by crawling these pages, so a wrong
   * answer here becomes a wrong answer on a call.
   */
  faqs: { q: string; a: string }[];
  /** The package this service belongs to. One of the four required links. */
  relatedPackageSlug: string;
  /** The post this service sends people to. One of the four required links. */
  featuredPostSlug: string;
}

export const SERVICES: Service[] = [
  {
    slug: "branded-websites",
    tier: "core",
    name: "Branded Websites",
    icon: Globe,
    tagline: "A site built for your business, not a template with your logo on it.",
    promise: "A site someone believes before they've spoken to you.",
    situation: {
      heading: "Ten seconds decides whether you're worth contacting.",
      lead: "Someone looks you up before they call. What they find in the first few seconds decides whether there is a call at all, and almost none of that decision is about your actual work.",
      rows: [
        {
          n: "01",
          title: "Nothing to find",
          body: "No site, or a page that hasn't been touched in years. Either way the person looking has no reason to believe you're still operating, let alone the right call.",
        },
        {
          n: "02",
          title: "The template everyone else has",
          body: "The same stock photo, the same three icon boxes, the same wording as the two competitors they just looked at. Nothing in it says why you rather than them.",
        },
        {
          n: "03",
          title: "Slow, and unreadable on a phone",
          body: "Most people checking you out are on a phone, standing somewhere, half distracted. A site that takes four seconds and then needs pinching to read has already lost them.",
        },
      ],
    },
    how: {
      heading: "How it works",
      steps: [
        {
          n: "01",
          title: "You see it before you sign anything",
          body: "We build the real site for your business first. Not a mockup and not a template with your logo dropped in — the finished thing, live, so there is nothing to imagine.",
        },
        {
          n: "02",
          title: "Built around the one next step",
          body: "Every page has a single obvious action on it and a reason to take it. That is the difference between a brochure and a front door.",
        },
        {
          n: "03",
          title: "Fast, findable, and yours",
          body: "Built to load quickly and to be read by search engines and AI assistants alike. Once you've paid for it, the content and the branding belong to you.",
        },
      ],
    },
    included: [
      "A fully branded site, designed for your business specifically",
      "Mobile-first — most people looking you up are on a phone",
      "Built to load fast and be found, not just to look good",
      "A clear next step on every page, wired into the CRM",
      "Written to be readable by search engines and AI assistants",
      "Hosting and upkeep handled",
    ],
    connects:
      "The site is what everything else points at. Ads and search send people to it, social gives them a reason to look, reviews convince them once they arrive, and the receptionist picks up when they'd rather call than click.",
    faqs: [
      {
        q: "Do I own the website?",
        a: "Yes. Once you have paid for it, the site's content, branding and copy are yours. We keep our own methods and templates, and the platforms we build on keep their own terms.",
      },
      {
        q: "Can I see it before I commit?",
        a: "That is how we work. The site is built before any conversation about signing, so you are looking at the real thing rather than imagining it.",
      },
      {
        q: "What happens to my existing site?",
        a: "It stays up until the new one is ready, then we point the domain across. There is no window where nothing is live.",
      },
      {
        q: "Can I make changes myself?",
        a: "Changes go through us and are part of what you pay monthly. That is deliberate — it is how the site stays fast and consistent instead of slowly filling up with plugins.",
      },
    ],
    relatedPackageSlug: "digital-foundation",
    featuredPostSlug: "website-that-does-nothing",
  },
  {
    slug: "text-email-automations",
    tier: "core",
    name: "Text & Email Automations",
    icon: MessagesSquare,
    tagline: "The follow-up that runs whether you remember it or not.",
    promise: "Nobody sits waiting on you to get around to them.",
    situation: {
      heading: "The follow-up is where most of the work gets lost.",
      lead: "Not at the enquiry and not at the quote — in the gap between them, where a reply was owed and the day got in the way.",
      rows: [
        {
          n: "01",
          title: "The reply that came too late",
          body: "They sent it at 4pm. You saw it at 8. By then they had messaged two other people, and whoever answered first is already talking to them.",
        },
        {
          n: "02",
          title: "The quote nobody chased",
          body: "You sent it. They said they would think about it. Neither of you mentioned it again, and it was never a decision — it just expired.",
        },
        {
          n: "03",
          title: "The no-show a reminder would have caught",
          body: "They booked, they forgot, the slot went empty. The fix was one message the day before that nobody had time to send.",
        },
      ],
    },
    how: {
      heading: "How it works",
      steps: [
        {
          n: "01",
          title: "They hear back immediately",
          body: "A text or an email goes out the moment someone reaches out, whether you have seen it or not — and it says something useful rather than confirming receipt.",
        },
        {
          n: "02",
          title: "The chase runs on its own",
          body: "If they go quiet, they get followed up. If they booked, they get reminded. If the job is done, they get asked how it went. Written in your voice, sent on a schedule nobody has to remember.",
        },
        {
          n: "03",
          title: "You step in only when it matters",
          body: "The sequence hands off to you at the point a person is actually needed, with the whole history attached rather than a name and a phone number.",
        },
      ],
    },
    included: [
      "Instant confirmation by text or email when someone reaches out",
      "Follow-up sequences that run on their own, written in your voice",
      "Appointment reminders before, and check-ins after",
      "Quote and estimate chasing without you doing the chasing",
      "Consent and opt-out handled correctly, with STOP honoured",
      "Every message logged against the contact in the CRM",
    ],
    connects:
      "Automations need something to automate. They watch the CRM, fire on what the site collects and what the receptionist books, and trigger the review request at the point a job is marked done.",
    faqs: [
      {
        q: "Will this feel like spam to my customers?",
        a: "It should not, and that is a writing problem rather than a technical one. The sequences are written in your voice and are about the thing the person actually asked for.",
      },
      {
        q: "What about text message consent rules?",
        a: "Consent is collected explicitly, opt-outs are honoured automatically when someone replies STOP, and messaging runs on a carrier-registered number. If we operate messaging on your behalf, you remain responsible for how the numbers on your list were obtained.",
      },
      {
        q: "Can I still message people myself?",
        a: "Yes, and it lands in the same thread the automation is using, so nobody gets the same message twice from two directions.",
      },
      {
        q: "What if someone replies?",
        a: "The sequence stops and it comes to you. A reply means a person is ready to talk, and continuing to send scheduled messages at that point is the fastest way to undo the good the system just did.",
      },
    ],
    relatedPackageSlug: "digital-foundation",
    featuredPostSlug: "missed-call-math",
  },
  {
    slug: "crm-calendar-integrations",
    tier: "core",
    name: "CRM & Calendar Integrations",
    icon: CalendarCheck,
    tagline: "Every lead in one place, every booking on one calendar.",
    promise: "Stop keeping the list in your head.",
    situation: {
      heading: "An enquiry in four places is an enquiry in no place.",
      lead: "Most businesses this size run on a mix of a phone, an inbox, a notepad and memory. None of it is one system, so nothing gets handled the same way twice.",
      rows: [
        {
          n: "01",
          title: "Nowhere for the lead to land",
          body: "A name on a notepad, a voicemail, a message in an inbox with forty other things. If every enquiry is not in one place, some of them are not being worked at all.",
        },
        {
          n: "02",
          title: "Double bookings and dead slots",
          body: "The calendar on your phone, the one on the wall and the one in your head disagree. Someone gets booked twice, or the day has a hole in it nobody noticed.",
        },
        {
          n: "03",
          title: "No idea what is actually happening",
          body: "How many people got in touch last month? How many turned into work? For most businesses this size the honest answer is a guess.",
        },
      ],
    },
    how: {
      heading: "How it works",
      steps: [
        {
          n: "01",
          title: "One place, every channel",
          body: "Form, call, text, message — wherever it came from, it arrives as the same kind of record with the same history attached.",
        },
        {
          n: "02",
          title: "One calendar everything writes to",
          body: "The booking link on the site, the receptionist on the phone and you in person all write to the same availability, so a slot cannot be sold twice.",
        },
        {
          n: "03",
          title: "You can finally see the shape of it",
          body: "How many came in, where from, and what happened to them. Not a dashboard to study — just the answer when you want it.",
        },
      ],
    },
    included: [
      "A CRM holding every lead in one place, whatever channel it arrived through",
      "Full history on every contact — what they asked and when",
      "Calendar and booking integration running on real availability",
      "Pipeline stages that match how you actually work",
      "Set up and run for you, not handed over as homework",
    ],
    connects:
      "The CRM is the floor the rest stands on. Automations fire from it, the receptionist books into it, review requests trigger off it, and the site feeds it. Without it, every other service is holding information it has nowhere to put.",
    faqs: [
      {
        q: "Do I have to learn the CRM?",
        a: "No. It is set up and run for you. You can log in and look whenever you want, and most people do at the start and then stop bothering.",
      },
      {
        q: "Can it work with the calendar I already use?",
        a: "Usually, yes. Which calendar you are on is one of the first things we check, because a second calendar nobody looks at is worse than no calendar.",
      },
      {
        q: "What happens to my existing contacts?",
        a: "They come across, as long as they are in something we can export. Bringing history with you is the point — a CRM that starts empty is a CRM you will not trust.",
      },
      {
        q: "Who owns the data?",
        a: "You do. If you ever leave, you take your contacts and their history with you. We will not hold your accounts or your data hostage on the way out, and that is written into our terms.",
      },
    ],
    relatedPackageSlug: "digital-foundation",
    featuredPostSlug: "website-that-does-nothing",
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
    faqs: [
      {
        q: "Will callers know they're talking to an AI?",
        a: "We do not pretend otherwise. In practice most callers care about getting an answer and getting booked in, not about who picked up.",
      },
      {
        q: "What happens to calls it can't handle?",
        a: "It hands off. Anything outside what it has been given goes to you as a message with the context attached, rather than the caller being stuck in a loop.",
      },
      {
        q: "Can I keep my existing phone number?",
        a: "Usually yes. It depends on your current carrier and how the number is held, and it is one of the first things we check.",
      },
      {
        q: "How does it know what to say about my business?",
        a: "It is given a knowledge base built from your website and from what you tell us about how you actually work. If the site does not answer a question, neither can it — which is why the pages and the phone get built together.",
      },
      {
        q: "Does it work outside business hours?",
        a: "Yes, and that is where most of the value is. The calls you are least able to take are the evening and weekend ones.",
      },
    ],
    relatedPackageSlug: "digital-infrastructure",
    featuredPostSlug: "missed-call-math",
  },
  {
    slug: "brand-management",
    tier: "core",
    name: "Brand Management",
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
    faqs: [
      {
        q: "Who writes the posts?",
        a: "We do, in your voice, from what is actually happening in the business. You approve before anything goes out.",
      },
      {
        q: "Do I have to send you photos?",
        a: "It helps enormously and it is the single biggest thing you can do to make this work. Real photographs of real jobs beat anything we can source.",
      },
      {
        q: "What happens when someone comments or messages?",
        a: "It gets picked up and answered rather than sitting there. An unanswered comment from three weeks ago says more about a business than the post above it.",
      },
      {
        q: "Which platforms?",
        a: "The ones your customers actually use, which for most local businesses is fewer than people expect. Posting into five feeds badly is worse than two done properly.",
      },
    ],
    relatedPackageSlug: "digital-infrastructure",
    featuredPostSlug: "website-that-does-nothing",
  },
  {
    slug: "review-generator",
    tier: "core",
    name: "Review generator",
    icon: Star,
    tagline:
      "Happy customers get asked at the right moment, in public. Anything less comes to you first.",
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
          title: "Every customer gets asked",
          body: "After the work is done, while it's still fresh, everyone gets the same question: how did we do? Nobody is skipped, and nobody is chased twice.",
        },
        {
          n: "02",
          title: "Happy customers get a one-tap link",
          body: "If they're pleased, they're handed a direct link to your Google listing while they're still in the moment. Most people would leave a review — they just never get round to finding the page.",
        },
        {
          n: "03",
          title: "If something's off, you hear it first",
          body: "Anything less and they're asked what would have made it better, straight to you. You get the chance to fix it rather than reading about it later. Nobody is prevented from posting publicly if they want to.",
        },
      ],
    },
    included: [
      "Automatic review requests after every completed job",
      "Happy customers handed a direct link to your Google listing",
      "Anyone less than happy asked what would have made it better, privately",
      "Timed to go out while the work is still fresh",
      "Requests in your voice, not a generic template",
      "Reviews tracked so you can see what's landing",
    ],
    connects:
      "Reviews are what convince someone the site and the social already brought in. They're the last thing a person checks before calling, and the receptionist answers the call they prompt.",
    faqs: [
      {
        q: "Are you filtering out bad reviews?",
        a: "No, and that would breach Google's policies. Everyone gets asked. Happy customers get a direct link because that is the step most people never get around to. Anyone less happy is asked privately what would have made it better — and they can still post publicly whenever they like. We are not helping write a bad review; we are not blocking one either.",
      },
      {
        q: "When does the request go out?",
        a: "At the point the job is marked done, which is when someone is most likely to say yes. A request that arrives three weeks later gets ignored.",
      },
      {
        q: "What if someone leaves a bad review anyway?",
        a: "It happens, and a page of nothing but five stars reads as fake in any case. What matters is that it sits among a steady stream of real ones rather than being the only thing there.",
      },
      {
        q: "Does this work for platforms other than Google?",
        a: "Google is where most local buying decisions get checked, so that is the default. Others can be added where they matter for your trade.",
      },
    ],
    relatedPackageSlug: "digital-infrastructure",
    featuredPostSlug: "website-that-does-nothing",
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
    faqs: [
      {
        q: "Is ad spend included?",
        a: "No. Ad spend goes directly to Meta or Google and is separate from what we charge to manage it. You see exactly what was spent and where.",
      },
      {
        q: "How much should I spend?",
        a: "Enough to learn something, which is usually less than people fear and more than they hope. We would rather start small and let the results decide than commit you to a number on day one.",
      },
      {
        q: "Why won't you run ads on their own?",
        a: "Because the click costs the same whether the business can catch the person or not. Pointing paid traffic at a site that collects nothing and a phone that rings out is the most expensive possible way to discover the infrastructure was the problem.",
      },
      {
        q: "Who owns the ad accounts?",
        a: "You do. We work inside your accounts, so if we ever part ways the history and the audiences stay with you.",
      },
    ],
    relatedPackageSlug: "growth-engine",
    featuredPostSlug: "ads-before-infrastructure",
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
    faqs: [
      {
        q: "How long until this does anything?",
        a: "Longer than anyone selling it wants to say. It is a compounding channel rather than a switch, which is exactly why it runs alongside paid rather than instead of it.",
      },
      {
        q: "What is AEO?",
        a: "Answer Engine Optimisation — being the source an AI assistant uses when someone asks it a question instead of running a search. It overlaps heavily with good SEO, and it is increasingly where the answer actually gets given.",
      },
      {
        q: "Can you guarantee a ranking?",
        a: "No, and anyone who does is either guessing or lying. Rankings are set by companies whose algorithms nobody outside them controls.",
      },
      {
        q: "Is this different from what my last SEO person did?",
        a: "Probably in one specific way: the target is terms with buying intent rather than terms with volume. Ranking for something nobody searches with money in hand moves a report and nothing else.",
      },
    ],
    relatedPackageSlug: "growth-engine",
    featuredPostSlug: "ads-before-infrastructure",
  },
];

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}
