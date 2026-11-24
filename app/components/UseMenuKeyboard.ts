"use client";

import { useEffect, type RefObject } from "react";

interface UseMenuKeyboardOptions {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

const FOCUSABLE_SELECTOR = "[data-menu-focusable]";

export function useMenuKeyboard({
  open,
  onClose,
  returnFocusRef,
}: UseMenuKeyboardOptions): void {
  useEffect(() => {
    if (!open) return;

    const returnTarget = returnFocusRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      const first = nodes.at(0);
      const last = nodes.at(-1);
      if (!first || !last) return;

      const active = document.activeElement as HTMLElement | null;
      const isInside = active !== null && nodes.includes(active);

      if (event.shiftKey && (!isInside || active === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!isInside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      returnTarget?.focus({ preventScroll: true });
    };
  }, [open, onClose, returnFocusRef]);
}
