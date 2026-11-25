import type { NavLink } from "./types";

export const MENU_COLORS = {
  accent: "#c9142f",
  surface: "#242424",
  base: "#1a1a1a",
  onSheet: "#ffffff",
} as const;

export const SHEET_LAYER_COLORS: readonly string[] = [
  MENU_COLORS.accent,
  MENU_COLORS.surface,
  MENU_COLORS.base,
];

export const DEFAULT_LINKS: readonly NavLink[] = [
  { label: "About Us", href: "/about" },
  { label: "Our Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
];

export const DEFAULT_SHEET_WIDTH = "38rem";
export const DEFAULT_FOREGROUND = "#0a0a0a";

export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];
export const EASE_CLOSE: [number, number, number, number] = [0.5, 0, 0.2, 1];

export const OPEN_TIMING = { duration: 0.7, stagger: 0.125 } as const;
export const CLOSE_TIMING = { duration: 0.55, stagger: 0.06 } as const;
export const LINK_TIMING = {
  delay: 0.45,
  stagger: 0.07,
  duration: 0.9,
} as const;
export const BACKDROP_TIMING = {
  enter: 0.5,
  exit: 0.45,
  exitDelay: 0.15,
} as const;
