import { Phone } from "lucide-react";
import { SITE_BUSINESS_PHONE, siteTelHref } from "@/constants/site";
import { cn } from "@/lib/utils";

/**
 * Secondary CTA: call the AI receptionist and hear the product answer.
 * For a buyer whose blocker is "does this actually run?", the demo line is
 * the shortest proof available — so it is a real CTA, not a fallback.
 * Renders a visible TODO until the number is provisioned.
 */
export function ReceptionistDemoCta({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const tel = siteTelHref();

  if (!tel || !SITE_BUSINESS_PHONE) {
    return (
      <p
        className={cn(
          "type-data inline-flex items-center gap-2 rounded-lg border border-dashed px-4 py-3 text-[0.8125rem]",
          tone === "light" ? "border-rule-strong text-muted-ink" : "border-white/25 text-white/60",
          className
        )}
      >
        <Phone className="h-4 w-4 shrink-0" aria-hidden />
        TODO(client): AI receptionist inbound number
      </p>
    );
  }

  return (
    <a
      href={tel}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 py-3 text-[0.9375rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action",
        tone === "light"
          ? "border-rule-strong bg-white text-ink hover:border-ink"
          : "border-white/25 bg-white/5 text-white hover:bg-white/10",
        className
      )}
    >
      <Phone className="h-4 w-4 shrink-0" aria-hidden />
      Call it right now — {SITE_BUSINESS_PHONE}
    </a>
  );
}
