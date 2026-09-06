# ntechdigital.solutions — build

N-Tech Digital Solutions' own site. Notes and decisions live in
`my-brain/projects/ntechdigital-solutions/context.md` — this folder is files only.

**Status:** prepped, not scaffolded. Stack decision is blocking (see context.md).

## Design direction

Pattern — **Trust & Authority + Conversion** (from the `ui-ux-pro-max` skill):

1. Hero — mission and credibility
2. Proof — what's real, not a fake logo wall
3. Solution overview — the five pieces of the Scalable Digital Infrastructure
4. Clear CTA path

Primary CTA is "Get Quote"/"Contact"; secondary lives in the nav.

## Tokens (starting point, palette to be warmed)

```css
:root {
  --color-primary:          #0F172A;  --color-on-primary:        #FFFFFF;
  --color-secondary:        #334155;  --color-on-secondary:      #FFFFFF;
  --color-accent:           #0369A1;  --color-on-accent:         #FFFFFF;
  --color-background:       #F8FAFC;  --color-foreground:        #020617;
  --color-card:             #FFFFFF;  --color-card-foreground:   #020617;
  --color-muted:            #E8ECF1;  --color-muted-foreground:  #475569;
  --color-border:           #E2E8F0;
  --color-destructive:      #DC2626;  --color-on-destructive:    #FFFFFF;
  --color-ring:             #0369A1;
}
```

These are the generator's output and they are contrast-checked, so they work as-is. But
slate-and-blue is the default agency palette, and N-Tech's whole position is *not* being a
faceless agency. Warm the primary and accent before building, keeping every foreground/
background pair at 4.5:1 or better.

## Pre-delivery checklist

- [ ] No emoji used as icons — SVG only (Heroicons or Lucide)
- [ ] `cursor-pointer` on everything clickable
- [ ] Hover states transition in 150–300ms
- [ ] Text contrast 4.5:1 minimum in light mode
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive at 375, 768, 1024 and 1440px
- [ ] Nothing on the page claims a client, testimonial, or result that doesn't exist

## Dependencies

Installed here, never at the `AI Projects` root — see `builds/README.md`. `motion`
(formerly `framer-motion`, both at 13.2.0) goes in this project's own `package.json` at
scaffold time.

---

## Stack

Next.js 16.3.4 (App Router, `src/`) · React 19.2.8 · TypeScript 5 · Tailwind CSS 4 ·
motion 13.2.0 · ESLint 9. Deployed on Vercel. Forms post into GoHighLevel.

```bash
npm run dev     # local dev server
npm run build   # production build
npm run lint    # eslint
```

This is the standard stack for **every** N-Tech build, client sites included — see
`my-brain/stack.md`. Nothing is built on GoHighLevel; GHL is integrated, not built on.
