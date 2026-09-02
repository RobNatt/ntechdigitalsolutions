# Site rebuild — handoff

The marketing site was rebuilt on a design system derived from N-Tech's own brand
and its own operational artifact. This lists what still needs a real value from
the client, and the decisions worth knowing about before editing.

## Open `TODO(client):` items

Each of these renders visibly on the live site until it is filled in. They are
deliberate — nothing is faked, and no placeholder statistic appears anywhere.

| # | Where | What's needed |
|---|---|---|
| 1 | Homepage hero, `/contact`, `/book-call` | **AI receptionist inbound number.** Set `NEXT_PUBLIC_BUSINESS_PHONE`. This is the single highest-value item: calling the receptionist is the fastest proof of the product, and the CTA is built and waiting for it. |
| 2 | Homepage, section 01 | **First case-study results** — call volume, follow-up time, review count. The section is built to take real numbers without a redesign. |
| 3 | `/about` | Year N-Tech was founded, and a headshot for the founder section. |
| 4 | `/book-call` | Set `NEXT_PUBLIC_GHL_CALENDAR_URL` to the GoHighLevel booking calendar. Until then the page routes visitors to email and the receptionist line rather than a broken embed. |
| 5 | `/booked` | Set `NEXT_PUBLIC_VSL_EMBED_URL` to the walkthrough video. The slot renders nothing until a real URL exists — no "coming soon" card. |
| 6 | `/booked` | The case-study-phase monthly retainer figure. **This page is the only place on the site where a price may appear.** |
| 7 | `/blog` | No posts published yet. Publish from Dashboard → Blog posts and they appear automatically. |
| 8 | `/signup` | Self-serve registration is not wired. The page is `noindex` until it is. |

## Decisions that constrain future edits

- **Pricing.** No figure appears on any public page. `/pricing` explains the
  withholding as a position rather than dodging it. The only page permitted a
  price is `/booked`, which sits behind a completed booking.
- **Proof.** There is no logo bar, no testimonial, and no invented number
  anywhere, because none exist yet. The homepage's live form (section 04) does
  that job instead: it runs the real lead automation on the visitor. Do not
  replace it with a testimonial slab until there are real testimonials.
- **Dark mode.** Exactly one page is dark: `/booked`. That is deliberate — it is
  the only screen a visitor sits still on to watch video, and the only one where
  they have already committed. The sitewide theme toggle was removed from the
  marketing surface. (The `/dashboard` OS app keeps its own theming.)
- **Cyan `#28C4D9`** marks a state change and nothing else: a stage completing, a
  node arriving, an active border. It is never used for body text or decoration
  — it fails contrast as text on the light field.
- **Booking** has one path: GoHighLevel. The Cal.com and Calendly marketing CTAs
  were removed. (`/api/webhooks/calendly` and the OS lead tooling still use
  Calendly for inbound booking ingestion — that is separate and untouched.)
- **`PACKAGES-AND-PRICING.md` was deleted.** Its stated source of truth
  (`src/components/startup-landing/pricing.tsx`) no longer existed, and its four
  tiers contradicted the live one-retainer offer.

## Design system

Tokens live at the bottom of `src/app/globals.css`; components in
`src/components/ntech/`.

- `--color-ink #0E2340` · `--color-muted-ink #5C6675` · `--color-field #FBFAF8`
  · `--color-action #1E6FB8` · `--color-live #28C4D9`. Rules are ink at 10%.
- Geist (display) · Inter (body, 16px/1.6) · Geist Mono (all timestamps and
  data). Scale 1.25 from 16px.
- `ActivityRow`, `ChannelChip` and `OutcomeBlock` in
  `src/components/ntech/primitives.tsx` are the site's three shapes. `ChannelChip`
  is the only badge on the site — don't introduce a second pill shape.

## Verified at handoff

Lighthouse, production build, mobile viewport:

| Page | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| `/` | 93 | 100 | 96 | 92 |
| `/infrastructure` | 94 | 100 | 96 | 100 |
| `/pricing` | 96 | 100 | 96 | 92 |
| `/about` | 95 | 100 | 96 | 92 |
| `/booked` | 98 | 100 | 96 | 69 |
| `/contact` | 88 | 100 | 96 | 100 |

Three deductions are expected and explained:

- **SEO 92 — `link-text`.** Lighthouse flags "Learn More" as non-descriptive. It
  is the client's mandated primary CTA, so the visible label stays; each instance
  carries a distinct `aria-label` that contains it, so the accessible names are
  unique and WCAG 2.4.4 (Link Purpose in Context) passes. Lighthouse's heuristic
  is stricter than the standard here.
- **SEO 69 on `/booked`** — the page is intentionally `noindex`.
- **Best practices 96 — `errors-in-console`.** Google Analytics and Vercel
  Analytics are unreachable from the build sandbox. Both resolve on Vercel.

Also checked: every internal route returns 200, `/blog/<unknown>` returns 404,
no broken in-page anchors, every focusable element has a visible focus ring, and
no rendered text contains leaked editorial notes, hype adjectives, or
unverifiable statistics.
