"use client";

/*
 * N-Tech mark, hand-authored as vector.
 *
 * A redraw of the generated mark rather than an auto-trace: the same idea —
 * a bold N with circuit traces cut out of the letterform, terminating in
 * nodes — rebuilt with clean geometry so it stays crisp at any size and
 * weighs a couple of hundred bytes.
 *
 * The cut-outs are done with a mask so the mark is a SINGLE colour with
 * transparent channels. That means it takes `currentColor` and works on any
 * background — gold on the dark hero, warm black on the light chapters — with
 * no separate light and dark files to keep in sync.
 *
 * `variant="simple"` drops the traces. Below roughly 32px the channels close
 * up and the detail turns to mud, so favicons and small header marks use it.
 */

interface LogoMarkProps {
  className?: string;
  /**
   * full    — traces cut out, single colour via currentColor. The workhorse.
   * simple  — no traces. Below ~32px the channels close up, so favicons use this.
   * display — metallic gold gradient, for large-format moments only: hero
   *           lockups, decks, signage, print at size. Never below ~96px, and
   *           never where it has to survive one-colour reproduction.
   * duotone — solid letterform in currentColor with GOLD traces drawn on top.
   *           This is the black-N-with-gold-circuitry look, and it's the right
   *           call on light surfaces. It cannot work on the dark hero — a dark
   *           N on a dark ground disappears — so dark surfaces use `full`,
   *           which is the same geometry inverted.
   */
  variant?: "full" | "simple" | "display" | "duotone";
  /** duotone only: the trace colour. Defaults to the brand gold. */
  traceColor?: string;
  /** Masks need unique ids when more than one instance is on a page. */
  id?: string;
  title?: string;
}

// Bold N: left stem, diagonal, right stem.
const N_PATH =
  "M18 12 H38 L62 62 V12 H82 V88 H62 L38 38 V88 H18 Z";

export function LogoMark({
  className,
  variant = "full",
  traceColor = "#A16207",
  id = "ntech-mark",
  title,
}: LogoMarkProps) {
  const maskId = `${id}-mask`;
  const gradId = `${id}-grad`;
  const fill = variant === "display" ? `url(#${gradId})` : "currentColor";

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {variant === "display" && (
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E9C46A" />
            <stop offset="38%" stopColor="#D4A03C" />
            <stop offset="62%" stopColor="#A16207" />
            <stop offset="100%" stopColor="#D9A441" />
          </linearGradient>
        </defs>
      )}

      {variant === "duotone" ? (
        <>
          <path d={N_PATH} fill="currentColor" />
          <g
            stroke={traceColor}
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={traceColor}
          >
            <path d="M26 21 V62" />
            <path d="M26 31 H33" />
            <path d="M26 45 H21" />
            <circle cx="26" cy="20" r="3.2" />
            <circle cx="33" cy="31" r="2.8" />
            <circle cx="21" cy="45" r="2.8" />
            <circle cx="26" cy="63" r="3.2" />
            <path d="M72 38 V79" />
            <path d="M72 49 H78" />
            <path d="M72 63 H66" />
            <circle cx="72" cy="37" r="3.2" />
            <circle cx="78" cy="49" r="2.8" />
            <circle cx="66" cy="63" r="2.8" />
            <circle cx="72" cy="80" r="3.2" />
          </g>
        </>
      ) : variant !== "simple" ? (
        <>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            {/* White shows, black cuts through. */}
            <path d={N_PATH} fill="#fff" />
            <g
              stroke="#000"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="#000"
            >
              {/* left stem circuit */}
              <path d="M26 21 V62" />
              <path d="M26 31 H33" />
              <path d="M26 45 H21" />
              <circle cx="26" cy="20" r="3.2" />
              <circle cx="33" cy="31" r="2.8" />
              <circle cx="21" cy="45" r="2.8" />
              <circle cx="26" cy="63" r="3.2" />
              {/* right stem circuit */}
              <path d="M72 38 V79" />
              <path d="M72 49 H78" />
              <path d="M72 63 H66" />
              <circle cx="72" cy="37" r="3.2" />
              <circle cx="78" cy="49" r="2.8" />
              <circle cx="66" cy="63" r="2.8" />
              <circle cx="72" cy="80" r="3.2" />
            </g>
          </mask>
          <rect
            width="100"
            height="100"
            fill={fill}
            mask={`url(#${maskId})`}
          />
        </>
      ) : (
        <path d={N_PATH} fill={fill} />
      )}
    </svg>
  );
}
