/*
 * The founder interview, conducted by Stuart.
 *
 * EVERY ANSWER IS ROB'S OWN WORDS, lightly edited for punctuation and line
 * breaks only. That is the entire value of this page — it is the one place on
 * the site where a prospect hears a person instead of a company, and rewriting
 * it into marketing prose would destroy the thing it exists to do. If an answer
 * needs to change, it changes because Rob said something different, not because
 * it could be phrased more smoothly.
 *
 * Stuart's questions are written to set up the answers he actually gave, which
 * is what an interview transcript is. They are the only invented text here.
 *
 * THE GUARANTEE ANSWER, settled 12 September 2026. Rob's first draft said he
 * would guarantee the receptionist takes "99% of the calls you will miss" and
 * that brand management gives "more reach than ever before". Both are numeric
 * or absolute performance promises, and the terms page states in bold that no
 * specific number of leads, calls, bookings, reviews, rankings, followers or
 * revenue is promised — so publishing them would have put the site in direct
 * contradiction with its own terms, on the one page whose entire argument is
 * that this company tells the truth. He replaced them himself with the "catches
 * most of your missed calls" answer below, which is stronger precisely because
 * it admits a failure mode and then shrugs at it. Do not reintroduce a number
 * here without changing the terms page in the same commit.
 *
 * THE HAIRLINE IS IN, at Rob's instruction. It reads as an edit only if you do
 * not know he wrote it himself.
 *
 * ORDER MATTERS. It opens on where he came from, stays light through Omaha and
 * Sundays, gives Stuart his one joke, and only then turns serious — so the page
 * ends on the no-guarantees answer and the "don't buy from us" close, which are
 * the two that actually sell. The gag gets someone reading; the last two answers
 * are what makes them call.
 */

export interface Exchange {
  /** Stuart's question. Written to tee up the answer. */
  q: string;
  /** Rob's answer, one string per paragraph. */
  a: string[];
}

export const FOUNDER = {
  name: "Rob Nattrass",
  title: "Founder",
  location: "Omaha, Nebraska",
  /**
   * Sits under the name. Rewritten 12 September 2026 — the first version ended
   * "interviewed, because he insisted, by the receptionist he built", which
   * read as a boast about Rob when the page's actual job is to demonstrate
   * Stuart. The framing now points at the receptionist, not the founder.
   */
  standfirst:
    "Twenty years in sales and leadership, and the same problem in every industry he worked in.",
  /** The line that explains the format, and why the format is the point. */
  framing:
    "Every question below was asked by Stuart — the same AI receptionist we build for our clients. He runs on what this website tells him. This page is part of what he knows.",
  /** Relative to /public. Rendered only if the file is actually on disk. */
  photo: "/brand/rob-nattrass.png",
  photoAlt: "Rob Nattrass, founder of N-Tech Digital Solutions",
} as const;

export const INTERVIEW: Exchange[] = [
  {
    q: "You spent twenty years in sales and leadership before this. What kept showing up?",
    a: [
      "Twenty years combined, across multiple industries, and I saw the same thing everywhere I went. A lot of complicated systems, built by complicated people, for people who don't know how to use them.",
      "That's why I founded N-Tech.",
    ],
  },
  {
    q: "Where does it actually break for the owner?",
    a: [
      "The worst part is the work. Answering every call when it comes in. Responding to every review, every message.",
      "Unless you have a dedicated rep, nobody has time to do that stuff. No matter how motivated you are.",
    ],
  },
  {
    q: "You build the website for free. Most people would call that backwards.",
    a: [
      "I build websites for free with our offers because a website isn't a commodity anymore. It's the beginning of your digital footprint.",
      "With the right integrations, your website becomes your hardest working employee. It never breaks a sweat and it never complains about the job.",
    ],
  },
  {
    q: "What are you genuinely good at?",
    a: [
      "Developing efficiencies beyond efficiencies. I see a system and I find a shorter path to get from A to Z, while still hitting every destination along the way.",
      "That's why I do this.",
    ],
  },
  {
    q: "Why Omaha?",
    a: [
      "Omaha is home to me. I've moved around the country, but I came back during covid to be close to family. This is where I set up, so I can take care of them.",
    ],
  },
  {
    q: "What does a Sunday look like?",
    a: [
      "Sundays are for rest and reading. I'll typically get a workout in as well, and barbecue up some chicken. Most days I'm walking my dogs a few miles and hitting the gym.",
      "I'm a normal person who wants efficiency, and a system that runs when I'm away. If it works for me, it'll work for you.",
    ],
  },
  {
    q: "Last one, and it's mine. Why did you build me — and be honest, was it the hair?",
    a: [
      "Stuart, you know I'm bald, so that's not funny.",
      "I built you to show the world that not only can these processes be reachable, they can be fun.",
      "You like talking to people, and so far everyone has liked you. You're an asset.",
      "Just don't mention my hairline.",
    ],
  },
  {
    q: "Your terms say, in bold, that you don't guarantee results. Why put that on your own website?",
    a: [
      "Because every experience is different. What we build is sustainable, and that's what differentiates us from everyone else.",
      "I'm not going to promise you extra leads every month without ads. What I will stand behind is that brand management puts you in front of more people than you've been in front of before.",
      "Our AI receptionist catches most of your missed calls. I haven't seen it miss any, but I'd expect it to miss some if your inbound call volume is ridiculous — and then we just get another receptionist or two. No big deal.",
      "Always include a margin for error, because nothing is perfect.",
    ],
  },
  {
    q: "So when should someone not buy from us?",
    a: [
      "If it doesn't make sense for your business, don't buy from us.",
      "What we build is a digital infrastructure that makes your business scalable without extra effort on your part. So think about it plainly. If you missed thirteen calls, and you could have gotten half of them into a meeting, and you close half of those meetings — would it make sense to put our agent on your back end to catch the calls you're missing?",
      "Think about walking into your office and seeing booked appointments on your calendar, with hot leads ready to move forward.",
      "Makes sense to me.",
    ],
  },
];
