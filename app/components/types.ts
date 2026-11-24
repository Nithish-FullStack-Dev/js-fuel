import type { ReactNode } from "react";

export interface NavLink {
  label: string;
  href: string;
}

export interface HeaderProps {
  logo?: ReactNode;
  links?: readonly NavLink[];
  homeHref?: string;
  foreground?: string;
  sheetWidth?: string;
}

export interface MenuToggleProps {
  open: boolean;
  controlsId: string;
  onToggle: () => void;
}

export interface MenuSheetProps {
  id: string;
  open: boolean;
  links: readonly NavLink[];
  activeHref: string | null;
  sheetWidth: string;
  onClose: () => void;
}
