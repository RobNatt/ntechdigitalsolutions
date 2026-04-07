"use client";

import { ChatPanel } from "@/components/chat/chat-panel";
import { ANALYTICS_CUSTOM_EVENTS } from "@/constants/analytics-events";
import { trackClientAnalyticsEvent } from "@/lib/analytics/track-client-event";
import { cn } from "@/lib/utils";
import { IconMessageCircle, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const WELCOME_DELAY_MS = 7000;
/** Session-only: do not re-show after dismiss or after accepting help in this tab. */
const SESSION_PROMPT_KEY = "ntech_chat_welcome_prompt_seen";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setWelcomeOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_PROMPT_KEY)) return;

    const id = window.setTimeout(() => {
      if (typeof window === "undefined") return;
      if (sessionStorage.getItem(SESSION_PROMPT_KEY)) return;
      if (openRef.current) return;
      setWelcomeOpen(true);
    }, WELCOME_DELAY_MS);

    return () => window.clearTimeout(id);
  }, []);

  /** Opening chat (any path) hides the welcome card and skips re-showing it this session. */
  useEffect(() => {
    if (!open) return;
    setWelcomeOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_PROMPT_KEY, "1");
    }
  }, [open]);

  const dismissWelcome = (markSession: boolean) => {
    setWelcomeOpen(false);
    if (markSession && typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_PROMPT_KEY, "1");
    }
  };

  const onAcceptHelp = () => {
    dismissWelcome(true);
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CHAT_WELCOME_ACCEPT, {});
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CHAT_OPEN, { source: "welcome_prompt" });
    setOpen(true);
  };

  const onDeclineHelp = () => {
    trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CHAT_WELCOME_DISMISS, { action: "not_now" });
    dismissWelcome(true);
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence mode="wait">
        {welcomeOpen && !open && (
          <motion.aside
            role="dialog"
            aria-modal="false"
            aria-labelledby="chat-welcome-title"
            aria-describedby="chat-welcome-desc"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto w-[min(100vw-2rem,22rem)] max-w-[100vw]"
          >
            <div className="relative rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-lg">
              <button
                type="button"
                onClick={() => {
                  trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CHAT_WELCOME_DISMISS, {
                    action: "close",
                  });
                  dismissWelcome(true);
                }}
                className="absolute right-2 top-2 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Dismiss"
              >
                <IconX className="size-4" stroke={1.5} />
              </button>
              <p
                id="chat-welcome-title"
                className="pr-7 text-sm font-semibold leading-snug"
              >
                Hi there — glad you stopped by.
              </p>
              <p
                id="chat-welcome-desc"
                className="mt-2 text-sm leading-relaxed text-muted-foreground"
              >
                Would you like a quick hand finding the right fit, or have a
                question we can answer?
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onDeclineHelp}
                  className="order-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted sm:order-1"
                >
                  Not now
                </button>
                <button
                  type="button"
                  onClick={onAcceptHelp}
                  className="order-1 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 sm:order-2"
                >
                  Yes, I&apos;d like help
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-[min(100vw-2rem,28rem)] max-w-[100vw]"
          >
            <ChatPanel onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() =>
          setOpen((o) => {
            if (!o) {
              trackClientAnalyticsEvent(ANALYTICS_CUSTOM_EVENTS.CHAT_OPEN, { source: "fab" });
            }
            return !o;
          })
        }
        className={cn(
          "pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition",
          "bg-primary text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <IconX className="size-7" stroke={1.5} />
        ) : (
          <IconMessageCircle className="size-7" stroke={1.5} />
        )}
      </button>
    </div>
  );
}
