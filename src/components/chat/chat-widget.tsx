"use client";

import { ChatPanel } from "@/components/chat/chat-panel";
import { cn } from "@/lib/utils";
import { IconMessageCircle, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
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
        onClick={() => setOpen((o) => !o)}
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
