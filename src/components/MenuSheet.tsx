import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from "framer-motion";
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
} from "react";
import { MENU_COLORS, SHEET_LAYER_COLORS } from "./menu.config";
import {
  createBackdropVariants,
  createLayerVariants,
  createLinkVariants,
} from "./MenuMotion";
import type { MenuSheetProps, NavLink } from "./types";
import { Link } from "react-router-dom";

type SheetPanelProps = Omit<MenuSheetProps, "open">;

interface SheetLayerProps {
  color: string;
  index: number;
  reduceMotion: boolean;
}

interface SheetLinkProps extends NavLink {
  index: number;
  reduceMotion: boolean;
  isActive: boolean;
  onNavigate: () => void;
}

function SheetLayer({ color, index, reduceMotion }: SheetLayerProps) {
  const variants = useMemo(
    () => createLayerVariants(index, reduceMotion),
    [index, reduceMotion],
  );

  return (
    <motion.div
      variants={variants}
      className="absolute inset-y-0 -left-8 right-0 rounded-l-[2rem] will-change-transform md:left-0"
      style={{ backgroundColor: color }}
    />
  );
}

const SheetLink = forwardRef<HTMLAnchorElement, SheetLinkProps>(
  function SheetLink(
    { label, href, index, reduceMotion, isActive, onNavigate },
    ref,
  ) {
    const variants = useMemo(
      () => createLinkVariants(index, reduceMotion),
      [index, reduceMotion],
    );

    return (
      <li className="overflow-hidden">
        <motion.div
          variants={variants}
          className="origin-top-left will-change-transform"
        >
          <Link
            ref={ref}
            to={href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            data-menu-focusable
            className="block py-[0.05em] text-[clamp(3.25rem,8vw,5.75rem)] uppercase leading-[0.95] text-white transition-colors duration-300 hover:text-(--menu-accent) focus-visible:text-(--menu-accent) focus-visible:outline-none"
          >
            {label}
          </Link>
        </motion.div>
      </li>
    );
  },
);

function SheetPanel({
  id,
  links,
  activeHref,
  sheetWidth,
  onClose,
}: SheetPanelProps) {
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion() ?? false;
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const backdropVariants = useMemo(
    () => createBackdropVariants(reduceMotion),
    [reduceMotion],
  );

  useEffect(() => {
    firstLinkRef.current?.focus({ preventScroll: true });
  }, []);

  const sheetStyle = {
    "--sheet-width": sheetWidth,
    "--menu-accent": MENU_COLORS.accent,
  } as CSSProperties;

  return (
    <motion.div
      className={`fixed inset-0 z-40 ${isPresent ? "" : "pointer-events-none"}`}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        aria-hidden="true"
        variants={backdropVariants}
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <div
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        style={sheetStyle}
        className="absolute inset-y-0 right-0 w-full overflow-hidden md:w-(--sheet-width)"
      >
        {SHEET_LAYER_COLORS.map((color, index) => (
          <SheetLayer
            key={color}
            color={color}
            index={index}
            reduceMotion={reduceMotion}
          />
        ))}

        <nav
          aria-label="Primary"
          className={`relative h-full overflow-y-auto overscroll-contain px-8 pb-10 pt-28 md:px-12 md:pt-32`}
        >
          <ul className="flex flex-col">
            {links.map((link, index) => (
              <SheetLink
                key={link.href}
                ref={index === 0 ? firstLinkRef : undefined}
                {...link}
                index={index}
                reduceMotion={reduceMotion}
                isActive={link.href === activeHref}
                onNavigate={onClose}
              />
            ))}
          </ul>
        </nav>
      </div>
    </motion.div>
  );
}

export function MenuSheet({ open, ...panelProps }: MenuSheetProps) {
  return (
    <AnimatePresence>
      {open ? <SheetPanel key="menu-sheet" {...panelProps} /> : null}
    </AnimatePresence>
  );
}
