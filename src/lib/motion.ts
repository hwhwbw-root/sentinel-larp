import type { Transition, Variants } from "framer-motion";

/** Shared spring used across the app so motion feels consistent, not bespoke per component. */
export const spring: Transition = { type: "spring", stiffness: 100, damping: 20 };

/** Parent wrapper for a group of children that should reveal in sequence. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

/** Individual item within a staggerContainer. */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: spring },
};

/** Hover/tap feedback for clickable cards and buttons. */
export const liftOnHover = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.98 },
  transition: spring,
};

/** Continuous breathing pulse for genuinely-live indicators (e.g. a live status dot). Pair with useReducedMotion to disable the loop, not just slow it. */
export const breathingPulse: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.15, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};
