import { cn } from "@/lib/utils";

type AuroraBackgroundProps = {
  className?: string;
  /** Soft radial highlight so the aurora reads cleanly on the hero (Aceternity-style). */
  showRadialGradient?: boolean;
};

/**
 * Aurora-style moving light bands (bright white palette).
 * Motion pattern inspired by Aceternity UI: https://ui.aceternity.com/components/aurora-background
 */
export function AuroraBackground({ className, showRadialGradient = true }: AuroraBackgroundProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <div
        className="animate-aurora absolute -inset-[38%] opacity-[0.92]"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 6%, rgba(255,255,255,1) 9%, rgba(255,255,255,0.88) 12%, rgba(255,255,255,0) 15%, rgba(255,255,255,0) 20%)",
            "repeating-linear-gradient(118deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 7%, rgba(255,255,255,0.98) 10.5%, rgba(255,255,255,0.65) 14%, rgba(255,255,255,0) 17.5%, rgba(255,255,255,0) 22%)",
          ].join(", "),
          backgroundSize: "300% 200%, 200% 100%",
          backgroundPosition: "50% 50%, 50% 50%",
          filter: "blur(44px)",
        }}
      />
      {showRadialGradient ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 95% 75% at 50% 18%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.55) 42%, rgba(255,255,255,0) 68%)",
          }}
        />
      ) : null}
    </div>
  );
}
