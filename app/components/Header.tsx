"use client";

import { useCallback, useId, useRef, useState } from "react";
import { MenuSheet } from "./MenuSheet";
import { MenuToggle } from "./MenuToggle";
import {
  DEFAULT_FOREGROUND,
  DEFAULT_LINKS,
  DEFAULT_SHEET_WIDTH,
} from "./menu.config";
import type { HeaderProps } from "./types";
import { useMenuKeyboard } from "./UseMenuKeyboard";
import { useScrollLock } from "./UseScrollLock";
import { BrandMark } from "./BrandMark";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Header({
  logo,
  links = DEFAULT_LINKS,
  homeHref = "/",
  foreground = DEFAULT_FOREGROUND,
  sheetWidth = DEFAULT_SHEET_WIDTH,
}: HeaderProps) {
  const pathname = usePathname();
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [trackedPathname, setTrackedPathname] = useState(pathname);

  if (trackedPathname !== pathname) {
    setTrackedPathname(pathname);
    setOpen(false);
  }

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((current) => !current), []);

  useScrollLock(open);
  useMenuKeyboard({ open, onClose: close, returnFocusRef: toggleRef });

  return (
    <>
      <header
        style={{ color: foreground }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between pb-4 pl-5 pr-[calc(1.25rem+var(--scrollbar-compensation,0px))] pt-[max(1rem,env(safe-area-inset-top))] md:pb-6 md:pl-10 md:pr-[calc(2.5rem+var(--scrollbar-compensation,0px))] md:pt-[max(1.5rem,env(safe-area-inset-top))]"
      >
        <Link
          href={homeHref}
          aria-label="Home"
          data-open={open}
          className="pointer-events-auto transition-colors delay-[350ms] duration-300 data-[open=true]:delay-100 max-md:data-[open=true]:text-white"
        >
          <BrandMark />
        </Link>

        <MenuToggle
          ref={toggleRef}
          open={open}
          controlsId={menuId}
          onToggle={toggle}
        />
      </header>

      <MenuSheet
        id={menuId}
        open={open}
        links={links}
        activeHref={pathname}
        sheetWidth={sheetWidth}
        onClose={close}
      />
    </>
  );
}
