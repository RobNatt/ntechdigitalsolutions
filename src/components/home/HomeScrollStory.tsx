"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Bot,
  Calendar,
  CalendarCheck,
  Handshake,
  Heart,
  Mail,
  MessageSquareText,
  Phone,
  Star,
  User,
} from "lucide-react";

/**
 * Homepage "Section 2" — an ambient, continuously-looping animation of a lead moving through
 * the system (entirely icon/CSS-built, no external video). Plays on its own at a slow, steady
 * pace like something running in the background — scroll never gates it, it only speeds the
 * loop up briefly while the visitor is actively scrolling past, then eases back down. Pauses
 * while off-screen for performance.
 */

// Fixed max-w keeps captions readable, but on narrow screens they'd run under the phone frame
// (which stays pinned to the right at every size) — capping width as a fraction of the
// container guarantees a gap regardless of viewport, and text shrinks a step to match.
const CAPTION_POSITION =
  "absolute left-0 top-1/2 max-w-[54%] -translate-y-1/2 text-sm leading-relaxed text-white opacity-0 sm:max-w-xs sm:text-base md:max-w-sm md:text-lg";

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[230px] w-[115px] rounded-[20px] border-4 border-neutral-800 bg-neutral-900 p-1.5 shadow-xl dark:border-neutral-700 sm:h-[290px] sm:w-[145px] sm:rounded-[24px] sm:p-2 md:h-[340px] md:w-[170px] md:rounded-[28px]">
      <div className="absolute left-1/2 top-1.5 h-1 w-7 -translate-x-1/2 rounded-full bg-neutral-700 sm:top-2 sm:h-1.5 sm:w-10" />
      <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-white dark:bg-neutral-950 sm:rounded-[18px]">
        {children}
      </div>
    </div>
  );
}

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function useReducedMotionPreference(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function HomeScrollStory() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPreference();

  useEffect(() => {
    if (reduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    let idleTimeout: ReturnType<typeof setTimeout> | undefined;

    const ctx = gsap.context(() => {
      // Built as a strict sequential chain — every position is either "default" (after the
      // previous tween ends) or "<" (same start as the previous tween, for crossfade pairs).
      // No absolute label jumps, so there's no cumulative-offset arithmetic to get wrong.
      const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power1.inOut" } });

      // Beat 0: intro person, held briefly, then picks up the phone (cut to Scene A).
      tl.set(".story-intro", { opacity: 1, filter: "blur(0px)" })
        .to({}, { duration: 1.2 })
        .to(".story-intro", { opacity: 0, scale: 0.9, filter: "blur(8px)", duration: 0.5 })
        .to(".scene-a-wrap", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.6 }, "<")
        .to(".scene-a-website", { opacity: 1, y: 0, scale: 1, duration: 0.6 }, "<")
        .to(".caption-website", { opacity: 1, y: 0, scale: 1, duration: 0.6 }, "<0.1")
        .to({}, { duration: 1.4 })
        // Website screen -> form screen.
        .to(".scene-a-website", { opacity: 0, y: -8, duration: 0.5 })
        .to(".caption-website", { opacity: 0, y: -8, duration: 0.5 }, "<")
        .to(".scene-a-form", { opacity: 1, y: 0, scale: 1, duration: 0.6 })
        .to(".caption-form", { opacity: 1, y: 0, scale: 1, duration: 0.6 }, "<0.05")
        .fromTo(
          ".form-fill-bar",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "steps(6)", transformOrigin: "left center" },
          "<0.1",
        )
        .to({}, { duration: 0.6 })
        // Form -> notifications (email, text, call) on the same phone.
        .to(".scene-a-form", { opacity: 0, y: -8, duration: 0.5 })
        .to(".caption-form", { opacity: 0, y: -8, duration: 0.5 }, "<")
        .to(".caption-notify", { opacity: 1, y: 0, scale: 1, duration: 0.6 })
        .fromTo(".notif-email", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, "<0.1")
        .to(".notif-email", { scale: 0.85, opacity: 0, duration: 0.3 }, "+=0.5")
        .fromTo(".notif-text", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 })
        .to(".notif-text", { scale: 0.85, opacity: 0, duration: 0.3 }, "+=0.5")
        .fromTo(".notif-call", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 })
        .to(".notif-call", { scale: 0.85, opacity: 0, duration: 0.3 }, "+=0.5")
        // Cut to AI receptionist <-> customer.
        .to(".scene-a-wrap", { opacity: 0, y: -8, filter: "blur(8px)", duration: 0.5 }, "+=0.3")
        .to(".caption-notify", { opacity: 0, y: -8, duration: 0.5 }, "<")
        .to(".scene-ai", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.6 })
        .to(".caption-ai", { opacity: 1, y: 0, scale: 1, duration: 0.6 }, "<0.05")
        .to(".ai-pulse", { opacity: 1, duration: 0.35, stagger: 0.15, repeat: 3, yoyo: true }, "<0.2")
        .to({}, { duration: 1.2 })
        // Calendar confirms the appointment.
        .to(".scene-ai", { opacity: 0, y: -8, filter: "blur(8px)", duration: 0.5 })
        .to(".caption-ai", { opacity: 0, y: -8, duration: 0.5 }, "<")
        .to(".scene-calendar", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.6 })
        .to(".caption-calendar", { opacity: 1, y: 0, scale: 1, duration: 0.6 }, "<0.05")
        .fromTo(
          ".calendar-badge",
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
          "+=0.3",
        )
        .to({}, { duration: 1 })
        // Cut to social media engagement.
        .to(".scene-calendar", { opacity: 0, y: -8, filter: "blur(8px)", duration: 0.5 })
        .to(".caption-calendar", { opacity: 0, y: -8, duration: 0.5 }, "<")
        .to(".scene-social-wrap", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.6 })
        .to(".caption-social", { opacity: 1, y: 0, scale: 1, duration: 0.6 }, "<0.05")
        .fromTo(
          ".social-heart",
          { opacity: 0, y: 0, scale: 0.5 },
          { opacity: 1, y: -90, scale: 1, duration: 1, stagger: 0.22, ease: "power1.out" },
          "+=0.2",
        )
        .to(".social-heart", { opacity: 0, duration: 0.3 }, "+=0.3")
        // Cut to handshake + reviews.
        .to(".scene-social-wrap", { opacity: 0, y: -8, filter: "blur(8px)", duration: 0.5 }, "+=0.2")
        .to(".caption-social", { opacity: 0, y: -8, duration: 0.5 }, "<")
        .to(".scene-reviews", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.6 })
        .to(".caption-reviews", { opacity: 1, y: 0, scale: 1, duration: 0.6 }, "<0.05")
        .to(".reviews-person-left", { x: 28, duration: 0.4 }, "+=0.2")
        .to(".reviews-person-right", { x: -28, duration: 0.4 }, "<")
        .to(".reviews-people", { opacity: 0, duration: 0.25 }, "+=0.1")
        .fromTo(
          ".reviews-handshake",
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" },
          "<0.05",
        )
        .fromTo(
          ".reviews-star",
          { opacity: 0, y: 10, scale: 0.4 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.1 },
          "+=0.3",
        )
        .to({}, { duration: 1.6 })
        // Loop end: fade out and restart from the top.
        .to(".scene-reviews", { opacity: 0, y: -8, filter: "blur(8px)", duration: 0.5 })
        .to(".caption-reviews", { opacity: 0, y: -8, duration: 0.5 }, "<")
        .to({}, { duration: 0.6 });

      // Scroll only modulates speed — never gates playback. Velocity nudges the loop faster
      // while actively scrolling past. onUpdate only fires on scroll events, so a scroll that
      // stops without momentum (a single wheel tick, keyboard scroll) would otherwise leave
      // timeScale stuck boosted — the idle timer explicitly eases it back to baseline shortly
      // after scrolling goes quiet, instead of relying on more scroll events to walk it down.
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = Math.min(Math.abs(self.getVelocity()) / 1500, 2.5);
          gsap.killTweensOf(tl, "timeScale");
          tl.timeScale(1 + boost);
          clearTimeout(idleTimeout);
          idleTimeout = setTimeout(() => {
            gsap.to(tl, { timeScale: 1, duration: 0.7, ease: "power2.out" });
          }, 150);
        },
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeave: () => tl.pause(),
        onLeaveBack: () => tl.pause(),
      });
    }, rootRef);

    return () => {
      clearTimeout(idleTimeout);
      ctx.revert();
    };
  }, [reduced]);

  if (reduced) {
    return <StaticStoryFallback />;
  }

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-t border-neutral-800 bg-black"
    >
      <div className="flex h-screen flex-col items-center justify-center px-4">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
          One connected system
        </p>
        <h2 className="mb-14 text-center text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Watch a lead move through the system, <span className="text-white">LIVE</span>
        </h2>

        <div className="relative h-[460px] w-full max-w-5xl sm:h-[480px] md:h-[500px]">
          {/* Beat 0: intro person */}
          <div className="story-intro absolute inset-0 flex items-center justify-center opacity-0">
            <span className="flex h-28 w-28 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-white sm:h-32 sm:w-32 md:h-36 md:w-36">
              <User className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20" strokeWidth={1.5} />
            </span>
          </div>

          {/* Captions all share one exact position so crossfades never shift or overlap oddly */}
          <p className={`caption-website ${CAPTION_POSITION}`}>
            Your future customers are looking you up online. This is where it starts. Your
            website needs to be clean and professional, exactly like your business.
          </p>
          <p className={`caption-form ${CAPTION_POSITION}`}>
            Your customer submits their details and then they get added to your CRM where the
            automations take over.
          </p>
          <p className={`caption-notify ${CAPTION_POSITION}`}>
            Every channel — email, text, and call — gets covered the instant they reach out.
          </p>
          <p
            className={`caption-ai ${CAPTION_POSITION} left-1/2 top-[26%] max-w-[80%] -translate-x-1/2 text-center sm:max-w-sm md:max-w-lg`}
          >
            The AI receptionist calls your customer to schedule an appointment. No missed calls
            from this employee.
          </p>
          <p
            className={`caption-calendar ${CAPTION_POSITION} left-1/2 top-[26%] max-w-[80%] -translate-x-1/2 text-center sm:max-w-sm md:max-w-lg`}
          >
            Booked straight onto the calendar — no back-and-forth required.
          </p>
          <p className={`caption-social ${CAPTION_POSITION}`}>
            The best content reaches your customers, which makes your business more visible.
          </p>
          <p
            className={`caption-reviews ${CAPTION_POSITION} left-1/2 top-[26%] max-w-[80%] -translate-x-1/2 text-center sm:max-w-sm md:max-w-lg`}
          >
            Our review automation gets you more 5-star reviews, and helps your business thrive by
            reaching out to every customer you&apos;ve completed work for.
          </p>

          {/* Scene A: website -> form -> notifications, all on one phone (right side) */}
          <div className="scene-a-wrap pointer-events-none absolute inset-y-0 right-0 flex items-center opacity-0">
            <PhoneFrame>
              <div className="scene-a-website absolute inset-0 flex flex-col gap-1.5 p-2 opacity-0">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <div className="mt-2 h-8 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-2 w-4/5 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-2 w-3/5 rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="mt-2 h-6 w-full rounded-full bg-neutral-900 dark:bg-white" />
              </div>

              <div className="scene-a-form absolute inset-0 flex flex-col gap-2 p-2.5 opacity-0">
                <div className="h-2 w-1/2 rounded bg-neutral-300 dark:bg-neutral-700" />
                <div className="h-5 w-full overflow-hidden rounded border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="form-fill-bar h-full w-full origin-left scale-x-0 bg-neutral-400 dark:bg-neutral-500" />
                </div>
                <div className="h-5 w-full rounded border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900" />
                <div className="mt-1 h-6 w-full rounded-full bg-neutral-900 dark:bg-white" />
              </div>

              <div className="relative flex h-full w-full items-center justify-center">
                <div className="notif-email absolute top-6 flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-medium text-neutral-800 shadow-md opacity-0">
                  <Mail className="h-4 w-4 text-neutral-700" /> New email
                </div>
                <div className="notif-text absolute top-6 flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-medium text-neutral-800 shadow-md opacity-0">
                  <MessageSquareText className="h-4 w-4 text-neutral-700" /> New text
                </div>
                <div className="notif-call absolute top-6 flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-medium text-neutral-800 shadow-md opacity-0">
                  <Phone className="h-4 w-4 text-neutral-700" /> Incoming call
                </div>
              </div>
            </PhoneFrame>
          </div>

          {/* AI receptionist calls the customer */}
          <div className="scene-ai pointer-events-none absolute inset-x-0 bottom-10 flex items-center justify-center gap-8 opacity-0 sm:gap-10">
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-white sm:h-24 sm:w-24 md:h-28 md:w-28">
              <Bot className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14" strokeWidth={1.5} />
            </span>
            <div className="flex gap-1.5" aria-hidden>
              <span className="ai-pulse h-2 w-2 rounded-full bg-white opacity-0" />
              <span className="ai-pulse h-2 w-2 rounded-full bg-white opacity-0" />
              <span className="ai-pulse h-2 w-2 rounded-full bg-white opacity-0" />
            </div>
            <span className="flex h-20 w-20 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 sm:h-24 sm:w-24 md:h-28 md:w-28">
              <User className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14" strokeWidth={1.5} />
            </span>
          </div>

          {/* Calendar confirms the appointment */}
          <div className="scene-calendar pointer-events-none absolute inset-x-0 bottom-6 flex items-center justify-center opacity-0">
            <div className="relative flex h-40 w-56 flex-col items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-900 sm:h-44 sm:w-64 md:h-48 md:w-72">
              <Calendar className="h-14 w-14 text-neutral-500 sm:h-16 sm:w-16 md:h-20 md:w-20" strokeWidth={1.25} />
              <div className="calendar-badge absolute -bottom-4 flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-black opacity-0 shadow-lg">
                <CalendarCheck className="h-4 w-4" /> Confirmed
              </div>
            </div>
          </div>

          {/* Social media engagement */}
          <div className="scene-social-wrap pointer-events-none absolute inset-y-0 right-0 flex items-center opacity-0">
            <PhoneFrame>
              <div className="flex h-full w-full flex-col gap-2 p-2.5">
                <div className="h-16 w-full rounded-lg bg-neutral-100 dark:bg-neutral-900" />
                <div className="h-16 w-full rounded-lg bg-neutral-100 dark:bg-neutral-900" />
                <div className="h-16 w-full rounded-lg bg-neutral-100 dark:bg-neutral-900" />
              </div>
              <div className="pointer-events-none absolute inset-0">
                {[0, 1, 2, 3].map((i) => (
                  <Heart
                    key={i}
                    className="social-heart absolute bottom-10 h-5 w-5 fill-rose-500 text-rose-500 opacity-0 sm:h-6 sm:w-6"
                    style={{ left: `${20 + i * 18}%` }}
                  />
                ))}
              </div>
            </PhoneFrame>
          </div>

          {/* Handshake + reviews */}
          <div className="scene-reviews pointer-events-none absolute inset-x-0 bottom-10 flex items-center justify-center opacity-0">
            <div className="relative flex h-24 items-center justify-center sm:h-28">
              <div className="reviews-people flex items-center gap-6 sm:gap-8">
                <span className="reviews-person-left flex h-20 w-20 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 sm:h-24 sm:w-24">
                  <User className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
                </span>
                <span className="reviews-person-right flex h-20 w-20 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300 sm:h-24 sm:w-24">
                  <User className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
                </span>
              </div>
              <span className="reviews-handshake absolute flex h-20 w-20 items-center justify-center rounded-full border border-neutral-300 bg-white text-black opacity-0 sm:h-24 sm:w-24">
                <Handshake className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
              </span>
              <div className="absolute -top-11 flex gap-1.5 sm:-top-14">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="reviews-star h-7 w-7 fill-amber-400 text-amber-400 opacity-0 sm:h-8 sm:w-8"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Static, non-scroll-hijacked fallback for prefers-reduced-motion. */
function StaticStoryFallback() {
  const beats = [
    "Your future customers are looking you up online — your website needs to be clean and professional, exactly like your business.",
    "Your customer submits their details and gets added to your CRM, where the automations take over — email, text, and call, covered instantly.",
    "The AI receptionist calls your customer to schedule an appointment. No missed calls from this employee.",
    "Booked straight onto the calendar — confirmed, no back-and-forth required.",
    "The best content reaches your customers, which makes your business more visible.",
    "Our review automation gets you more 5-star reviews, and helps your business thrive by reaching out to every customer you've completed work for.",
  ];
  return (
    <section className="border-t border-neutral-800 bg-black py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
          One connected system
        </p>
        <h2 className="mt-2 text-center text-2xl font-semibold tracking-tight text-white md:text-3xl">
          Watch a lead move through the system, LIVE
        </h2>
        <ol className="mt-10 space-y-6">
          {beats.map((text, i) => (
            <li key={text} className="flex gap-4 text-base leading-relaxed text-neutral-300">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-700 text-xs font-semibold text-white">
                {i + 1}
              </span>
              {text}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
