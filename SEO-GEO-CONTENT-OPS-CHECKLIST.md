# SEO, Local GEO, and Content Ops Checklist (Phases 3-5)

Use this as the operating checklist for your AI PA. Each item is labeled by execution type:
- `One-time`: complete once, then only revisit if business/site changes.
- `Long-term`: recurring operational task with a defined cadence.

---

## Cadence playbook — SEO + GEO + organic growth

**“Set and forget”** here means: done until a **trigger** fires (rebrand, new product line, URL/tracking change, site redesign, major algorithm shift you need to react to). It is not “never maintain” — weekly/monthly/quarterly tasks below cover that.

### Set and forget (baseline)

**Technical & indexation**
- [ ] Google Search Console + Bing Webmaster: property verified, owners correct.
- [ ] `robots.txt` allows crawling of public marketing URLs; `sitemap.xml` points at page sitemap.
- [ ] `sitemap-pages.xml` lists every indexable URL you want discovered (including new routes when shipped).
- [ ] Redirect strategy for retired slugs (301s), no chains on key landings.
- [ ] Core template: canonical URLs, unique `<title>` + meta description per important page, one clear `h1` per page.

**Site structure (national / topic SEO)**
- [ ] Hub: `/services` explains the full offer and links to topic deep-dives.
- [ ] Topic pillars live and interlinked: `/services/websites-and-leads`, `/services/seo-and-visibility`, `/services/automation-and-crm`.
- [ ] Money paths obvious: `/book-call`, `/contact`, `/growth-system` linked from nav and key content.

**Analytics & conversions**
- [ ] GA4 property + web stream; first-party/event capture aligned with site (e.g. inquiry, book-call events).
- [ ] GA4 **key events marked as conversions** for primary actions (book, submit, critical CTAs).
- [ ] Baseline: confirm events fire in debug/real traffic after deploy.

**GEO (generative / AI visibility)**
- [ ] `public/llms.txt` accurate: offerings, positioning, commercial notes, **topic service URLs**, FAQ — update when offers or URLs change.
- [ ] Site copy supports **clear entity + FAQ-style answers** on pillar pages (feeds both SEO snippets and AI citation-style answers).

**Local / trust layer (still worth having even if national-first)**
- [ ] Google Business Profile baseline complete (category, services, hours, links, description).
- [ ] **Canonical NAP** documented (Phase 4 NAP section); applied on site footer, contact, and owned profiles.

**Re-submit sitemaps in GSC/Bing when:** you add/remove routes, change canonical strategy, or after a large batch of new URLs.

---

### Weekly (~60–90 min)

**Search & site health**
- [ ] GSC: Page indexing / coverage — new errors, spikes in “Excluded”, soft 404s.
- [ ] GSC: Performance snapshot — top queries and pages; note surprises (drops/climbs).
- [ ] Quick CWV / mobile sanity check on homepage + one money page (Lighthouse or GSC CWV report).

**Content & distribution**
- [ ] Publish or schedule **1 blog** (dashboard `published_at` if scheduling ahead).
- [ ] **Internal links**: from the new post to `/services`, 1–2 topic pillars, and `/book-call` or `/contact` as appropriate.
- [ ] **GBP post** (if GBP is active for the business) aligned with blog or offer.
- [ ] **Review asks** after client wins (if you use reviews).

**Measurement**
- [ ] GA4 + first-party dashboard: traffic and conversion trend vs. prior week; flag anomalies.

---

### Monthly (~2–3 hours)

**On-page QA (priority URLs)**
- [ ] Spot-check **title, meta, canonical, h1** on: `/`, `/growth-system`, `/services`, topic pillars (`/services/websites-and-leads`, `/services/seo-and-visibility`, `/services/automation-and-crm`), `/book-call`, `/contact`, `/about`, `/blog`, `/roofing`, legal pages.
- [ ] **Internal links**: homepage → services + pillars; recent blogs → pillars + conversion pages.
- [ ] **Refresh 1–2 pages** with GSC data (queries with impressions but weak CTR or position 5–15).

**Analytics**
- [ ] GA4: conversions still match intended events; no duplicate or missing key events after releases.
- [ ] Content ROI: which posts/pages drive engaged sessions and conversion assists.

**Local / citations (lighter pass)**
- [ ] GBP: photos or posts refresh if you have new assets; messaging/hours still accurate.
- [ ] **NAP spot-check** on top citations (see Phase 4 NAP Step 4).

**GEO**
- [ ] Read `llms.txt` vs. live positioning — update if pricing, services, or URLs drift.

---

### Quarterly (half day)

**Strategy & structure**
- [ ] **Topic map**: which new pillar or blog cluster to add next (from GSC + sales questions); avoid cannibalization between pillars.
- [ ] **Service areas / GBP** (if used): still match how you sell (national vs. regional emphasis).
- [ ] **Full NAP / directory pass** (Phase 4 matrix — every row checked).

**Technical debt**
- [ ] Redirect audit, broken internal links, orphan pages.
- [ ] Sitemap vs. live routes: anything indexable missing from `sitemap-pages.xml`?

**Competitive & SERP reality**
- [ ] Spot-check target queries: who ranks; what format wins (guides, tools, video); adjust one pillar if needed.

---

## Phase 3 - Search Foundation

### Completion Snapshot
- `Done`: Google Search Console + Bing Webmaster — properties verified, sitemaps submitted, baseline healthy (keep weekly checks in the table below).
- `Done`: `sitemap.xml`, `sitemap-pages.xml`, and `robots.txt` alignment.
- `Done`: Performance + mobile — Lighthouse / Core Web Vitals + mobile usability baseline validated on key URLs (keep monitoring on cadence below).
- `Done`: Homepage primary headline is a semantic `h1` (matches page title intent).
- `Done`: Core metadata/canonical work on key marketing and legal pages (including `/roofing` landing: canonical, OG, `h1`, JSON-LD).
- `Done`: Legacy roofing demo slug permanently redirects to `/roofing` (301).
- `Done`: GA4 conversion goals configured for primary actions (`inquiry_submit`, `info_submit`, `calendar_booking_click`); monitoring events retained for reporting (`new_visitor`, `page_view`, `funnel_view`, `form_click`, `pa_interaction`).
- `Ongoing`: Index coverage spot-checks, CWV drift, and conversion-definition audits per the Phase 3 table (not one-time).

### Phase 3 Closeout Tasks

| Task | Type | Cadence | Owner | Follow-up trigger |
|---|---|---|---|---|
| Submit/refresh `https://ntechdigital.solutions/sitemap-pages.xml` in GSC + Bing | One-time | Once now; then when URL structure changes | AI PA + Owner | New page/route added, removed, or redirected |
| Validate indexing coverage in GSC (Page Indexing report) | Long-term | Weekly | AI PA | Excluded pages increase, soft 404, duplicate canonical warning |
| Validate Core Web Vitals and mobile usability | Long-term | Weekly quick check, monthly deep check | AI PA | Any URL drops to "Needs improvement" or "Poor" |
| Confirm canonical + title + meta + H1 presence on priority pages | Long-term | Monthly | AI PA | New page published or conversion drops |
| Confirm internal links from homepage/services/blog into money pages | Long-term | Monthly | AI PA | New blog/page goes live |
| Confirm GA4 key events are marked as conversions (book-call, inquiry submit, key CTA) | One-time + Long-term audit | Initial setup + monthly audit | Owner + AI PA | Event name changes or tracking update |
| Verify analytics dashboard date-range reporting works post deploy | Long-term | Weekly | AI PA | Any sudden traffic or lead anomaly |

### Priority Pages to Include in Monthly QA
- `/`
- `/growth-system`
- `/services`
- `/services/websites-and-leads`
- `/services/seo-and-visibility`
- `/services/automation-and-crm`
- `/roofing`
- `/book-call`
- `/contact`
- `/about`
- `/blog`
- `/privacy-policy`
- `/terms-and-conditions`

---

## Phase 4 - Local and GEO Visibility

### Task Classification for AI PA

| Task | Type | Cadence | Owner | Follow-up trigger |
|---|---|---|---|---|
| Fully complete Google Business Profile baseline (primary category, secondary categories, services, hours, links, description) | One-time | Initial setup | Owner + AI PA | Rebrand, service expansion, or relocation |
| Add high-quality photo set (team, work, office, before/after) | One-time + Long-term refresh | Initial upload + monthly refresh | AI PA | New completed project or seasonal change |
| Configure service areas and verify match with site messaging | One-time + Quarterly audit | Initial + quarterly | AI PA | New city/service area added |
| Ensure NAP consistency across citations/directories | One-time + Quarterly audit | Initial + quarterly | AI PA | Any phone/address/name update |
| Publish GBP posts (offers, updates, proof) | Long-term | Weekly | AI PA | New blog, promo, case study, or offer launch |
| Build and maintain review-generation flow | Long-term | Weekly asks + monthly analysis | AI PA + Team | New completed client milestone |
| Build location pages tied to intent (city + core service) | Long-term growth | Biweekly to monthly | AI PA + Owner | Priority keyword gap found |
| Expand service pages by intent clusters (problem + service + location modifiers) | Long-term growth | Monthly | AI PA + Owner | Search Console query gaps found |

### Suggested GBP Baseline Fields (One-time completion)
- Primary category set to best revenue-driving service
- Secondary categories added
- Service list completed
- Service areas completed
- Hours and holiday hours set
- Website + appointment links set
- Description finalized
- Messaging enabled (if staffed)

### NAP + citations audit (post-GBP)

Use this after GBP baseline is set. Goal: **one canonical business identity** everywhere you control, and no stray descriptions that contradict your current positioning.

#### Step 0 — Lock your canonical record (one-time, Owner)

Fill once; AI PA copies this into every profile.

| Field | Canonical value (fill in) |
|---|---|
| Legal / display name | |
| Public brand line (if different from legal) | |
| Street address (if customer-facing; or “service area business”) | |
| City, state, ZIP | |
| Primary phone (click-to-call) | |
| Primary email | |
| Website | `https://ntechdigital.solutions` |
| Booking / contact URL | `https://ntechdigital.solutions/book-call` |
| Hours (match GBP) | |

Rules: **same spelling and punctuation** for name; **one primary phone**; website and booking links **match GBP**.

#### Step 1 — Site + owned properties (one-time + on change)

| Location | Check |
|---|---|
| Site footer / contact | NAP + links match canonical |
| `/contact`, `/about` | No outdated industry copy |
| Social bios (LinkedIn, Facebook, X) | Name, URL, service area line consistent |
| Email signatures | Phone + URL consistent |

#### Step 2 — Core directories (one-time + quarterly)

For each: open listing → compare name, address (if shown), phone, website, categories, description. Log URL in a sheet.

| Platform | Listing URL | NAP match | Description OK | Action / owner |
|---|---|---|---|---|
| Google Business Profile | | ☐ | ☐ | |
| Bing Places / Bing Webmaster business | | ☐ | ☐ | |
| Apple Business Connect (if used) | | ☐ | ☐ | |
| Facebook Business Page | | ☐ | ☐ | |
| LinkedIn Company Page | | ☐ | ☐ | |
| Yelp (if claimed) | | ☐ | ☐ | |
| Better Business Bureau (if listed) | | ☐ | ☐ | |
| Local / industry chambers (if any) | | ☐ | ☐ | |

**Description OK** = no old vertical-specific copy (e.g. storm leads, homeowner/roofer routing) unless that is still the business model.

#### Step 3 — Snippet and duplicate-listing hunt (one-time)

- Search: `"{business name}"` + phone digits; open top 10 non-owned results.
- Search old phrases if you ever used them (e.g. storm, homeowners, roofers) + brand.
- For each wrong listing: **claim**, **suggest edit**, or **request removal** per platform rules.

#### Step 4 — Ongoing cadence

| Task | Type | Cadence | Owner |
|---|---|---|---|
| Spot-check top citations still match canonical NAP | Long-term | Monthly | AI PA |
| Full directory pass | Long-term | Quarterly | AI PA + Owner |
| Re-run Step 3 after any rebrand or URL change | One-time | Immediately | Owner + AI PA |

---

## Phase 5 - Content Engine

### Task Classification for AI PA

| Task | Type | Cadence | Owner | Follow-up trigger |
|---|---|---|---|---|
| Publish one blog post | Long-term | Weekly | AI PA drafts, Owner approves | Search Console query opportunity or new offer |
| Publish/update one location page | Long-term | Weekly or biweekly | AI PA drafts, Owner approves | New service area priority |
| Add one FAQ or service subpage from recurring sales/support questions | Long-term | Weekly intake, biweekly publish | AI PA + Team | Same question appears 3+ times in 30 days |
| Repurpose each blog into social posts, GBP post, and short-form snippets | Long-term | Same week as blog publish | AI PA | Every new blog |
| Refresh older pages with links, entities, and keyword improvements | Long-term | Monthly | AI PA | Ranking decay or outdated details |
| Track topic performance and content ROI | Long-term | Monthly | AI PA + Owner | Any content with high impressions but low CTR |

---

## AI PA Scheduling Template

### Weekly (60-90 min)
- Check GSC coverage/errors and top query shifts.
- Publish 1 blog and 1 GBP post.
- Request/collect reviews from recent wins.
- Log recurring customer questions for FAQ/service subpages.
- Report wins/risks in a short weekly summary.

### Biweekly (90-120 min)
- Publish or update 1 location page.
- Add internal links from newest content to service and conversion pages.

### Monthly (2-3 hours)
- Run full metadata/H1/canonical/internal-link QA on priority pages.
- Refresh 2-4 existing pages with query-driven improvements.
- Audit conversions in GA4 and first-party analytics trends.
- Refresh GBP photos/posts and citation consistency spot-check.

### Quarterly (Half-day)
- Revisit service areas, category strategy, and content cluster roadmap.
- Re-prioritize location + service intent map based on revenue and rankings.

---

## Definition of Done by Phase

- **Phase 3 complete** when all closeout tasks are green and tracked in weekly/monthly cadence.
- **Phase 4 complete** for baseline once GBP + NAP + initial location/service structure are in place; growth continues long-term.
- **Phase 5 complete** only as an operating system, not a one-time project; success is consistency and iteration.
