import type { Variants } from "framer-motion";
import {
  BACKDROP_TIMING,
  CLOSE_TIMING,
  EASE_CLOSE,
  EASE_OUT_EXPO,
  LINK_TIMING,
  OPEN_TIMING,
  SHEET_LAYER_COLORS,
} from "./menu.config";

const LAST_LAYER_INDEX = SHEET_LAYER_COLORS.length - 1;

export function createLayerVariants(
  index: number,
  reduceMotion: boolean,
): Variants {
  if (reduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.15 } },
    };
  }

  return {
    hidden: { x: "100%" },
    visible: {
      x: "0%",
      transition: {
        duration: OPEN_TIMING.duration,
        delay: index * OPEN_TIMING.stagger,
        ease: EASE_OUT_EXPO,
      },
    },
    exit: {
      x: "100%",
      transition: {
        duration: CLOSE_TIMING.duration,
        delay: (LAST_LAYER_INDEX - index) * CLOSE_TIMING.stagger,
        ease: EASE_CLOSE,
      },
    },
  };
}

export function createBackdropVariants(reduceMotion: boolean): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0.2 : BACKDROP_TIMING.enter,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: reduceMotion ? 0.15 : BACKDROP_TIMING.exit,
        delay: reduceMotion ? 0 : BACKDROP_TIMING.exitDelay,
        ease: "easeInOut",
      },
    },
  };
}

export function createLinkVariants(
  index: number,
  reduceMotion: boolean,
): Variants {
  if (reduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2 } },
      exit: { opacity: 0, transition: { duration: 0.1 } },
    };
  }

  return {
    hidden: { y: "110%", rotate: 5 },
    visible: {
      y: "0%",
      rotate: 0,
      transition: {
        duration: LINK_TIMING.duration,
        delay: LINK_TIMING.delay + index * LINK_TIMING.stagger,
        ease: EASE_OUT_EXPO,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.15 } },
  };
}
