# Claude SEO Plugin — Setup

SEO analysis plugin for Claude Code ([AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo), MIT, v2.3.1).
It adds 25 `/seo` sub-skills and 18 specialist sub-agents that audit technical SEO,
content quality (E-E-A-T), Schema.org markup, Core Web Vitals, local SEO, AI search
(GEO), e-commerce and international SEO, and returns a prioritized action plan.

## Overview

The plugin is declared at **project scope**, so it is version-controlled in this repo
and every teammate who opens the project in Claude Code gets it automatically — no
per-machine `/plugin` commands needed.

`.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "agricidaniel-claude-seo": {
      "source": { "source": "github", "repo": "AgriciDaniel/claude-seo" }
    }
  },
  "enabledPlugins": { "claude-seo@agricidaniel-claude-seo": true }
}
```

Nothing from the plugin itself is vendored into this repo. Claude Code clones it into
its own cache (`~/.claude/plugins/cache/`) on first use.

## 1) One-time setup per machine

| Step | Command | Notes |
|------|---------|-------|
| Trust the project settings | — | Claude Code prompts on first open; accept to enable the plugin |
| Build the Python runtime | `/seo setup` | Creates an isolated venv in Claude's plugin data + Playwright Chromium. Nothing is installed globally |
| Verify | `/seo doctor` | Should report `Runtime: ready` |

Requires **Python 3.10+**. Chromium is optional — it is only needed for SPA rendering
and screenshots. Skip it with `claude-seo setup --skip-browser` if you don't need those.

## 2) Everyday commands

```bash
/seo audit https://ntechdigitalsolutions.com     # full site audit → 0-100 score + action plan
/seo page  https://ntechdigitalsolutions.com/pricing   # deep single-page analysis
/seo schema https://ntechdigitalsolutions.com    # detect / validate / generate JSON-LD
/seo geo   https://ntechdigitalsolutions.com     # AI-search citability (GEO)
/seo local                                        # local SEO / Google Business Profile
/seo technical                                    # crawlability, indexing, Core Web Vitals
/seo content                                      # E-E-A-T and content quality
/seo sitemap generate                             # sitemap from industry templates
```

Full reference: `docs/COMMANDS.md` in the plugin repo (32 commands).

Pair audits with the existing `SEO-GEO-CONTENT-OPS-CHECKLIST.md` in this repo — the
plugin finds issues, the checklist is our standing operating procedure.

## 3) Schema validation hook

The plugin registers a `PostToolUse` hook on `Edit`/`Write` that validates JSON-LD after
every file edit. It self-filters — files without a `<script type="application/ld+json">`
block are skipped silently, so it is quiet on ordinary TypeScript edits.

**It can exit with a blocking status on critical schema errors** (unreplaced
`[Business Name]`-style placeholders, malformed JSON-LD). Relevant when editing:

- `src/components/marketing/ServiceTopicJsonLd.tsx`
- `src/app/page.tsx`, `src/app/(marketing)/{about,pricing,infrastructure}/page.tsx`
- `src/app/(marketing)/blog/[slug]/page.tsx`

Verified against these files at install time — all pass.

## 4) Optional API credentials

Enriched data needs credentials; the plugin works without them using public fetches.

| Feature | Setup |
|---------|-------|
| Search Console, GA4, PageSpeed, CrUX | `/seo google setup` |
| Backlinks (Moz, Keywords Everywhere) | `/seo backlinks setup` |
| MCP extensions (DataForSEO, Firecrawl, Ahrefs, SE Ranking, Profound, Bing Webmaster, Unlighthouse, Banana) | See `docs/MCP-INTEGRATION.md` in the plugin repo |

Keep any keys in `.env.local` / your own credential store — `.env*` is gitignored.

## 5) Cost note

The plugin adds **~4.9k tokens of always-on context** to every Claude Code session in
this project. Five judgment-heavy agents (`seo-content`, `seo-geo`, `seo-sxo`,
`seo-cluster`, `seo-drift`) run on Opus; the other thirteen run on Sonnet, so a full
`/seo audit` is not cheap. Prefer targeted commands (`/seo page`, `/seo schema`) for
routine work and reserve `/seo audit` for periodic deep reviews.

To disable temporarily without touching the repo: `claude plugin disable claude-seo`.

## 6) Troubleshooting

- **`Runtime: setup required`** — run `/seo setup`.
- **Commands not found** — confirm the project settings were trusted, then
  `claude plugin list` should show `claude-seo` as `enabled`, scope `project`.
- **`url_safety: Refusing configured HTTP proxy`** — the plugin's SSRF guard rejects
  loopback proxies. Expected inside Claude Code's sandboxed cloud sessions, which route
  HTTPS through `127.0.0.1`; fetches work normally on a local machine.
- **Update the plugin** — `claude plugin marketplace update agricidaniel-claude-seo`.

More: `docs/TROUBLESHOOTING.md` in the plugin repo.
