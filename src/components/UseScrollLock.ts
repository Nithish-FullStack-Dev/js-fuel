import { useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useScrollLock(locked: boolean): void {
  useIsomorphicLayoutEffect(() => {
    if (!locked) return;

    const root = document.documentElement;
    const { body } = document;
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const basePaddingRight =
      Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    body.style.overflow = "hidden";
    body.style.paddingRight = `${basePaddingRight + scrollbarWidth}px`;
    root.style.setProperty("--scrollbar-compensation", `${scrollbarWidth}px`);

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      root.style.removeProperty("--scrollbar-compensation");
    };
  }, [locked]);
}
