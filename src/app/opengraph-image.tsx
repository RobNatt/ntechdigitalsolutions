import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/*
 * The card that renders when the site's link is shared.
 *
 * Until this existed, posting the URL anywhere — a DM, a Facebook post, an
 * email, a text from the CRM — produced a bare grey link with no title and no
 * image. For a company that sells websites, that is the worst possible first
 * frame, and it was showing on every link that had ever been sent.
 *
 * Composition follows the site rather than the template: the dark surface with
 * its gold bloom, content set left with a hard type-scale jump from the
 * overline to the headline, and the mark oversized and cropped by the right
 * edge so the card has a foreground and a background instead of one flat
 * centred plane.
 *
 * COLOUR: gold is action-only per the design system, and nothing on a shared
 * image is clickable. So the gold appears exactly where the site already puts
 * it on a non-interactive element — the hairline beside an overline — and the
 * oversized mark is off-white at low opacity, reading as depth rather than
 * decoration. Dark-surface tokens throughout: #D97706 rather than #A16207,
 * because the light gold only reaches 4.01:1 on this background.
 *
 * Outfit is vendored at src/assets/fonts as two static TrueType instances, so
 * the build doesn't depend on a network call to a third party. Static instances
 * rather than the variable font on purpose: Satori's parser fails outright on
 * Outfit's variable build, and even where a variable font loads it renders the
 * default instance and ignores fontWeight, which would flatten the headline to
 * the same weight as the caption. The OFL licence sits beside them.
 */

export const alt =
  "N-Tech Digital Solutions — one connected system for local businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const N_PATH = "M18 12 H38 L62 62 V12 H82 V88 H62 L38 38 V88 H18 Z";

export default async function OpengraphImage() {
  const fontDir = join(process.cwd(), "src", "assets", "fonts");
  const [regular, bold] = await Promise.all([
    readFile(join(fontDir, "Outfit-Regular.ttf")),
    readFile(join(fontDir, "Outfit-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0C0A09",
          fontFamily: "Outfit",
          overflow: "hidden",
        }}
      >
        {/* The gold bloom the dark sections carry, pushed to the upper left. */}
        <div
          style={{
            position: "absolute",
            top: -260,
            left: -180,
            width: 760,
            height: 760,
            borderRadius: 760,
            background:
              "radial-gradient(circle, rgba(217,119,6,0.20), rgba(217,119,6,0) 62%)",
            display: "flex",
          }}
        />

        {/* Oversized mark, cropped by the right edge. Depth, not decoration. */}
        <div
          style={{
            position: "absolute",
            right: -150,
            top: 40,
            display: "flex",
            opacity: 0.09,
          }}
        >
          <svg width="620" height="620" viewBox="0 0 100 100" fill="none">
            <path d={N_PATH} fill="#FAFAF9" />
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
            width: "100%",
          }}
        >
          {/* Overline, with the gold hairline the site uses beside one. */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 56,
                height: 2,
                backgroundColor: "#D97706",
                display: "flex",
              }}
            />
            <div
              style={{
                display: "flex",
                color: "#A8A29E",
                fontSize: 22,
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              N-Tech Digital Solutions
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                color: "#FAFAF9",
                fontSize: 92,
                fontWeight: 700,
                lineHeight: 1.04,
                letterSpacing: -2.5,
                maxWidth: 780,
              }}
            >
              One connected system.
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                color: "#A8A29E",
                fontSize: 31,
                lineHeight: 1.35,
                maxWidth: 700,
              }}
            >
              Website, phone, follow-up, social, and reviews — running your
              digital office so you don’t have to.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "#A8A29E",
              fontSize: 21,
              letterSpacing: 1,
            }}
          >
            <div style={{ display: "flex" }}>ntechdigital.solutions</div>
            <div style={{ display: "flex" }}>·</div>
            <div style={{ display: "flex" }}>Omaha, NE</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Outfit", data: regular, weight: 400, style: "normal" },
        { name: "Outfit", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
