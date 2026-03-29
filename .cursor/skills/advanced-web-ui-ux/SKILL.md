---
name: advanced-web-ui-ux
description: Design and improve high-converting, accessible website UI/UX for Next.js + Tailwind + shadcn/ui. Use when creating or refining landing pages, marketing pages, forms, CTAs, page copy, or conversion flows, and when the user asks for better UI, UX, readability, or engagement.
---

# Advanced Web UI/UX

## Quick Start

When asked to improve a webpage:

1. Clarify page goal and primary action.
2. Audit current layout and copy against the checklist below.
3. Propose the smallest high-impact changes first.
4. Implement improvements in existing components before adding new abstractions.
5. Verify accessibility and responsive behavior before finalizing.

## Primary Objective

Increase clarity and conversions while preserving visual quality and implementation simplicity.

## UX Copy Rules (Priority)

- Lead with outcome-focused headlines, not feature names.
- Put user value in the first 1-2 lines of each section.
- Keep CTA labels action-oriented (`Get started`, `Book a call`, `See pricing`) and avoid vague text (`Submit`, `Click here`).
- Reduce paragraph length; prefer short blocks and scannable bullets.
- Match one section to one message: problem, value, proof, action.
- Add trust signals near CTAs (testimonials, client logos, guarantees, concise proof points).

## Layout and Visual Hierarchy

- Ensure one dominant CTA per viewport section.
- Use clear heading scale and consistent spacing rhythm.
- Group related items with cards, separators, or whitespace.
- Keep line length readable (roughly 45-75 characters for body text).
- Use contrast to direct attention: neutral surfaces + one primary accent for actions.

## Next.js + Tailwind + shadcn/ui Defaults

- Prefer semantic HTML (`main`, `section`, `nav`, `header`, `footer`, `button`, `label`).
- Prefer existing shadcn components before custom primitives.
- Use Tailwind utility consistency: spacing scale, text scale, container widths.
- Keep interactive states explicit: hover, focus-visible, disabled, loading.
- Keep class lists maintainable; extract repeated patterns into reusable UI components when repeated 3+ times.

## Accessibility Baseline

- All actionable controls must be keyboard reachable.
- Add visible `focus-visible` states on links, buttons, and form controls.
- Ensure text/background contrast meets WCAG AA.
- Use explicit form labels and helpful inline error text.
- Provide meaningful alt text for informative images.

## Conversion-Oriented Section Pattern

Use this default order for marketing pages:

1. Hero: value proposition + primary CTA + supporting proof.
2. Pain/Problem: what is currently broken or costly.
3. Solution/Benefits: 3-5 clear outcomes.
4. Proof: testimonials, logos, metrics, case snippet.
5. Objections: concise FAQ.
6. Final CTA: repeat primary action with reduced friction.

## Implementation Workflow

Use this checklist while working:

- [ ] Page goal and user intent identified
- [ ] Primary CTA defined and repeated strategically
- [ ] Headline and subheadline rewritten for clarity/value
- [ ] Sections reordered for narrative flow
- [ ] Visual hierarchy and spacing improved
- [ ] Accessibility baseline verified
- [ ] Mobile layout and text wrapping verified

## Output Format for Recommendations

When asked for suggestions only, present:

1. Top 3 highest-impact changes
2. Why each change matters
3. Exact copy/UI replacement suggestion
4. Optional follow-up improvements

## Additional Resources

- For reusable copy/UI patterns, see [examples.md](examples.md).
