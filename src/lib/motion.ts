/**
 * Motion tokens — the single source for every animation in this project.
 *
 * Mirrors section 7 of my-brain/projects/ntechdigital-solutions/design-system.md.
 * Never type a duration or easing directly into a component. If a value here
 * doesn't fit, change it here AND in the design system file.
 */

/** Entrances. Anything arriving. */
export const EASE_OUT = [0.25, 0.46, 0.45, 0.94] as const;

/** State changes, hovers, toggles. */
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

/** Seconds, because `motion` takes seconds. Every entrance is under 0.6s. */
export const DURATION = {
  micro: 0.18,
  reveal: 0.5,
  chapter: 0.55,
  transition: 0.25,
} as const;

/** Between siblings. Never above 0.12 — past that it stops reading as one motion. */
export const STAGGER = 0.08;

/** Travel distance. Small on purpose: a fade with intent, not a slide. */
export const DISTANCE = {
  reveal: 24,
  chapter: 40,
} as const;

/**
 * Shared viewport config for every scroll-triggered entrance.
 *
 * `once: true` is what guarantees nothing animates twice on the same scroll
 * pass. The negative margin starts the animation as the element comes into
 * view, so a 550ms entrance is long finished before the element exits.
 */
export const VIEWPORT = { once: true, margin: "-10%" } as const;
