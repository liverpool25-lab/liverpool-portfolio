/**
 * motion.ts — Shared Motion System
 * Consistent timing, easing, and variants for the Liverpool Portfolio.
 *
 * All values use the iOS-inspired spring/ease curve [0.16, 1, 0.3, 1]
 * as the primary ease, with spring physics for interactive transitions.
 */

// ─── Easing ──────────────────────────────────────────────────────────────────
export const IOS_EASE = [0.16, 1, 0.3, 1] as const;

// ─── Spring Configurations ───────────────────────────────────────────────────
export const iosSpringTransition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 30,
  mass: 0.8,
};

export const navSpring = {
  type: "spring" as const,
  stiffness: 450,
  damping: 35,
};

export const langSpring = {
  type: "spring" as const,
  stiffness: 500,
  damping: 38,
};

// ─── Duration Map ────────────────────────────────────────────────────────────
export const DUR = {
  micro: 0.12,     // 120ms — button press feedback
  nav: 0.18,       // 180ms — nav hover, active states
  popup: 0.22,     // 220ms — tooltips, small dropdowns
  modal: 0.28,     // 280ms — modal entry
  section: 0.45,   // 450ms — section entrance
  spatial: 0.4,    // 400ms — larger spatial shifts
} as const;

// ─── Base Variants ───────────────────────────────────────────────────────────

/** Standard fade + slide-up entrance used for most section content */
export const iosFadeSlideVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DUR.section,
      ease: IOS_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.22, ease: IOS_EASE },
  },
};

/** Stagger container — wraps iosFadeSlideVariants children */
export const staggerContainer = (staggerAmt = 0.09, delayChildren = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerAmt,
      delayChildren,
    },
  },
});

/** Card pop-in — for project cards, gallery items */
export const cardPopIn = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DUR.section, ease: IOS_EASE },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.99,
    transition: { duration: 0.2, ease: IOS_EASE },
  },
};

/** Modal entry — backdrop + panel */
export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DUR.modal },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.22 },
  },
};

export const modalPanel = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DUR.modal, ease: IOS_EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.2, ease: IOS_EASE },
  },
};

/** Dropdown / compact popover */
export const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.96, y: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DUR.popup, ease: IOS_EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -4,
    transition: { duration: 0.15 },
  },
};

/**
 * Viewport entrance config for whileInView.
 * Set once: false so sections re-animate when re-entering viewport.
 */
export const viewportConfig = {
  once: false,
  margin: "-60px",
  amount: 0.15,
} as const;
