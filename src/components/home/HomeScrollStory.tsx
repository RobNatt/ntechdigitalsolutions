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
 * Homepage "Section 2" — a scroll-scrubbed story of a lead moving through the system.
 * Entirely icon/CSS-built (no external video) per current direction; scroll is the only
 * animation driver (scrub, no autoplay). If Higgsfield video is added later, swap the
 * relevant scene's inner markup for a <video> element — the GSAP timeline/timing is
 * independent of what's inside each scene.
 */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[340px] w-[170px] rounded-[28px] border-4 border-neutral-800 bg-neutral-900 p-2 shadow-xl dark:border-neutral-700">
      <div className="absolute left-1/2 top-2 h-1.5 w-10 -translate-x-1/2 rounded-full bg-neutral-700" />
      <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-white dark:bg-neutral-950">
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

    const ctx = gsap.context(() => {
      const pinDistance = Math.round(window.innerHeight * 4.5);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: `+=${pinDistance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      const fadeIn = (target: string, pos?: string) =>
        tl.to(target, { opacity: 1, y: 0, scale: 1, duration: 1 }, pos);
      const fadeOut = (target: string, pos?: string) =>
        tl.to(target, { opacity: 0, y: -10, duration: 0.6 }, pos);

      // Beat 0 -> 1: intro person picks up the phone, cut to Scene A.
      tl.to(".story-intro", { opacity: 0, scale: 0.9, duration: 0.8 })
        .addLabel("sceneA");

      fadeIn(".scene-a", "sceneA");
      fadeIn(".scene-a-website", "sceneA");
      fadeIn(".caption-website", "sceneA+=0.1");

      // Website screen -> form screen.
      tl.addLabel("form", "+=1.2");
      fadeOut(".scene-a-website", "form");
      fadeOut(".caption-website", "form");
      fadeIn(".scene-a-form", "form+=0.15");
      fadeIn(".caption-form", "form+=0.25");
      tl.fromTo(
        ".form-fill-bar",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: "steps(6)", transformOrigin: "left center" },
        "form+=0.3",
      );

      // Form -> notifications (email, text, call) on the same phone.
      tl.addLabel("notify", "+=1.4");
      fadeOut(".scene-a-form", "notify");
      fadeIn(".caption-notify", "notify");
      tl.fromTo(".notif-email", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "notify+=0.1")
        .to(".notif-email", { scale: 0.85, opacity: 0, duration: 0.35 }, "notify+=0.55")
        .fromTo(".notif-text", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "notify+=0.75")
        .to(".notif-text", { scale: 0.85, opacity: 0, duration: 0.35 }, "notify+=1.2")
        .fromTo(".notif-call", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "notify+=1.4")
        .to(".notif-call", { scale: 0.85, opacity: 0, duration: 0.35 }, "notify+=1.85");

      // Cut to AI receptionist <-> customer.
      tl.addLabel("ai", "+=0.3");
      fadeOut(".scene-a", "ai");
      fadeOut(".caption-notify", "ai");
      fadeIn(".scene-ai", "ai+=0.2");
      fadeIn(".caption-ai", "ai+=0.3");
      tl.to(".ai-pulse", { opacity: 1, duration: 0.4, stagger: 0.15, repeat: 2, yoyo: true }, "ai+=0.4");

      // Calendar confirms the appointment.
      tl.addLabel("calendar", "+=1.3");
      fadeOut(".scene-ai", "calendar");
      fadeOut(".caption-ai", "calendar");
      fadeIn(".scene-calendar", "calendar+=0.2");
      fadeIn(".caption-calendar", "calendar+=0.2");
      tl.fromTo(
        ".calendar-badge",
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
        "calendar+=0.6",
      );

      // Cut to social media engagement.
      tl.addLabel("social", "+=1.2");
      fadeOut(".scene-calendar", "social");
      fadeOut(".caption-calendar", "social");
      fadeIn(".scene-social", "social+=0.2");
      fadeIn(".caption-social", "social+=0.3");
      tl.fromTo(
        ".social-heart",
        { opacity: 0, y: 0, scale: 0.5 },
        { opacity: 1, y: -90, scale: 1, duration: 1.1, stagger: 0.25, ease: "power1.out" },
        "social+=0.4",
      ).to(".social-heart", { opacity: 0, duration: 0.3 }, "social+=1.3");

      // Cut to handshake + reviews.
      tl.addLabel("reviews", "+=1.1");
      fadeOut(".scene-social", "reviews");
      fadeOut(".caption-social", "reviews");
      fadeIn(".scene-reviews", "reviews+=0.2");
      fadeIn(".caption-reviews", "reviews+=0.3");
      tl.to(".reviews-person-left", { x: 18, duration: 0.5 }, "reviews+=0.1")
        .to(".reviews-person-right", { x: -18, duration: 0.5 }, "reviews+=0.1")
        .to(".reviews-people", { opacity: 0, duration: 0.3 }, "reviews+=0.6")
        .fromTo(
          ".reviews-handshake",
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
          "reviews+=0.65",
        )
        .fromTo(
          ".reviews-star",
          { opacity: 0, y: 10, scale: 0.4 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.12 },
          "reviews+=1",
        );

      tl.addLabel("end", "+=1");
      fadeOut(".scene-reviews", "end");
      fadeOut(".caption-reviews", "end");
    }, rootRef);

    // ScrollTrigger's own auto-refresh listens for window "load", which has already fired by
    // the time this effect runs in a hydrated SPA — force a measurement pass explicitly,
    // otherwise `end` never resolves and the pin collapses to ~0 scroll distance. setTimeout
    // (not requestAnimationFrame) so this still fires even if the tab starts backgrounded.
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 50);

    return () => {
      clearTimeout(refreshTimer);
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
          Watch a lead move through the system,{" "}
          <span className="text-white">LIVE</span>
        </h2>

        <div className="relative h-[420px] w-full max-w-5xl">
          {/* Beat 0: intro person */}
          <div className="story-intro absolute inset-0 flex items-center justify-center">
            <span className="flex h-24 w-24 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-white">
              <User className="h-12 w-12" strokeWidth={1.5} />
            </span>
          </div>

          {/* Scene A: website -> form -> notifications, all on one phone */}
          <div className="scene-a pointer-events-none absolute inset-0 flex items-center justify-between gap-8 opacity-0">
            <p className="caption-website max-w-sm text-lg leading-relaxed text-white opacity-0">
              Your future customers are looking you up online. This is where it starts. Your
              website needs to be clean and professional, exactly like your business.
            </p>
            <p className="caption-form absolute max-w-sm text-lg leading-relaxed text-white opacity-0">
              Your customer submits their details and then they get added to your CRM where the
              automations take over.
            </p>
            <p className="caption-notify absolute max-w-sm text-lg leading-relaxed text-white opacity-0">
              Every channel — email, text, and call — gets covered the instant they reach out.
            </p>

            <div className="relative ml-auto shrink-0">
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
                  <div className="notif-email absolute top-6 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[10px] font-medium text-neutral-800 shadow-md opacity-0">
                    <Mail className="h-3 w-3 text-neutral-700" /> New email
                  </div>
                  <div className="notif-text absolute top-6 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[10px] font-medium text-neutral-800 shadow-md opacity-0">
                    <MessageSquareText className="h-3 w-3 text-neutral-700" /> New text
                  </div>
                  <div className="notif-call absolute top-6 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[10px] font-medium text-neutral-800 shadow-md opacity-0">
                    <Phone className="h-3 w-3 text-neutral-700" /> Incoming call
                  </div>
                </div>
              </PhoneFrame>
            </div>
          </div>

          {/* AI receptionist calls the customer */}
          <div className="scene-ai pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-10 opacity-0">
            <p className="caption-ai max-w-lg text-center text-lg leading-relaxed text-white opacity-0">
              The AI receptionist calls your customer to schedule an appointment. No missed calls
              from this employee.
            </p>
            <div className="flex items-center gap-10">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-white">
                <Bot className="h-8 w-8" strokeWidth={1.5} />
              </span>
              <div className="flex gap-1.5" aria-hidden>
                <span className="ai-pulse h-1.5 w-1.5 rounded-full bg-white opacity-0" />
                <span className="ai-pulse h-1.5 w-1.5 rounded-full bg-white opacity-0" />
                <span className="ai-pulse h-1.5 w-1.5 rounded-full bg-white opacity-0" />
              </div>
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300">
                <User className="h-8 w-8" strokeWidth={1.5} />
              </span>
            </div>
          </div>

          {/* Calendar confirms the appointment */}
          <div className="scene-calendar pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 opacity-0">
            <p className="caption-calendar max-w-lg text-center text-lg leading-relaxed text-white opacity-0">
              Booked straight onto the calendar — no back-and-forth required.
            </p>
            <div className="relative flex h-32 w-48 flex-col items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-900">
              <Calendar className="h-10 w-10 text-neutral-500" strokeWidth={1.25} />
              <div className="calendar-badge absolute -bottom-4 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black opacity-0 shadow-lg">
                <CalendarCheck className="h-3.5 w-3.5" /> Confirmed
              </div>
            </div>
          </div>

          {/* Social media engagement */}
          <div className="scene-social pointer-events-none absolute inset-0 flex items-center justify-between gap-8 opacity-0">
            <p className="caption-social max-w-sm text-lg leading-relaxed text-white opacity-0">
              The best content reaches your customers, which makes your business more visible.
            </p>
            <div className="relative ml-auto shrink-0">
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
                      className="social-heart absolute bottom-10 h-4 w-4 fill-rose-500 text-rose-500 opacity-0"
                      style={{ left: `${20 + i * 18}%` }}
                    />
                  ))}
                </div>
              </PhoneFrame>
            </div>
          </div>

          {/* Handshake + reviews */}
          <div className="scene-reviews pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 opacity-0">
            <p className="caption-reviews max-w-lg text-center text-lg leading-relaxed text-white opacity-0">
              Our review automation gets you more 5-star reviews, and helps your business thrive
              by reaching out to every customer you&apos;ve completed work for.
            </p>
            <div className="relative flex h-20 items-center justify-center">
              <div className="reviews-people flex items-center gap-4">
                <span className="reviews-person-left flex h-14 w-14 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300">
                  <User className="h-7 w-7" strokeWidth={1.5} />
                </span>
                <span className="reviews-person-right flex h-14 w-14 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-300">
                  <User className="h-7 w-7" strokeWidth={1.5} />
                </span>
              </div>
              <span className="reviews-handshake absolute flex h-14 w-14 items-center justify-center rounded-full border border-neutral-300 bg-white text-black opacity-0">
                <Handshake className="h-7 w-7" strokeWidth={1.5} />
              </span>
              <div className="absolute -top-9 flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="reviews-star h-5 w-5 fill-amber-400 text-amber-400 opacity-0" />
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
