"use client";

import { forwardRef } from "react";
import { MENU_COLORS } from "./menu.config";
import type { MenuToggleProps } from "./types";

const BAR_CLASS =
  "absolute left-0 h-0.5 w-full rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none";

export const MenuToggle = forwardRef<HTMLButtonElement, MenuToggleProps>(
  function MenuToggle({ open, controlsId, onToggle }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onToggle}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={controlsId}
        data-menu-focusable
        className="pointer-events-auto relative grid size-11 place-items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current motion-reduce:transition-none bg-red-500 "
        style={{
          color: "white",
          transitionDelay: open ? "120ms" : "350ms",
        }}
      >
        <span className="relative block h-2.5 w-7">
          <span
            className={`${BAR_CLASS} top-0`}
            style={{
              transform: open
                ? "translateY(4px) rotate(45deg)"
                : "translateY(0) rotate(0deg)",
            }}
          />
          <span
            className={`${BAR_CLASS} bottom-0`}
            style={{
              transform: open
                ? "translateY(-4px) rotate(-45deg)"
                : "translateY(0) rotate(0deg)",
            }}
          />
        </span>
      </button>
    );
  },
);
