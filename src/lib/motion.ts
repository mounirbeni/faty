import type { Variants, Transition } from 'framer-motion';

/* ────────────────────────────────────────────────────────────────────────────
   MOTION SYSTEM  ·  one source of truth
   Premium easing + spring physics tuned the way Apple / Linear / Stripe do it:
   fast to start, gentle to settle, never linear, never floaty.
   ──────────────────────────────────────────────────────────────────────────── */

/** Cubic-bézier curves (4-number tuples are valid framer easings). */
export const EASE: Record<string, [number, number, number, number]> = {
  /** signature ease-out — quick exit from rest, long luxurious settle */
  smooth: [0.16, 1, 0.3, 1],
  /** softer, for large surfaces */
  soft: [0.22, 1, 0.36, 1],
  /** symmetric in-out, for moves that come back */
  inOut: [0.65, 0, 0.35, 1],
  /** slight overshoot — for playful pops */
  back: [0.34, 1.56, 0.64, 1],
};

/** Spring presets. Use these instead of hand-tuning per component. */
export const SPRING: Record<string, Transition> = {
  /** default UI spring — calm, premium */
  gentle: { type: 'spring', stiffness: 140, damping: 18, mass: 0.9 },
  /** snappy press/release feedback */
  snappy: { type: 'spring', stiffness: 420, damping: 30 },
  /** soft entrance for big elements */
  soft: { type: 'spring', stiffness: 90, damping: 16 },
  /** bouncy, for celebratory moments */
  bouncy: { type: 'spring', stiffness: 300, damping: 14 },
};

/** Standard page-to-page transition. */
export const pageTransition: Transition = { duration: 0.55, ease: EASE.smooth };

// ─── Reusable variants ────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE.smooth } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: SPRING.gentle },
};

/** Parent that staggers its children's entrance. */
export const staggerContainer = (stagger = 0.07, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE.smooth } },
};

/** Spread onto any motion element to give it premium press + lift physics. */
export const pressable = {
  whileTap: { scale: 0.96 },
  whileHover: { y: -3, scale: 1.015 },
  transition: SPRING.snappy,
} as const;

/** Heavier press feel for large hero cards. */
export const pressableCard = {
  whileTap: { scale: 0.975 },
  whileHover: { y: -5, scale: 1.02 },
  transition: SPRING.gentle,
} as const;
