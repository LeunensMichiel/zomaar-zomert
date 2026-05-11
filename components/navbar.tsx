"use client";

import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { LocaleSwitcher } from "@components/locale-switcher";
import { MenuBackground } from "@components/menu-background";
import { MenuToggle } from "@components/menu-toggle";
import { Sticker } from "@components/sticker";
import { Logo } from "@components/ui/logo";
import { Link, usePathname } from "@lib/i18n/navigation";
import { type AppPathname } from "@lib/i18n/routing";
import {
  ZZ_DATE_FRIDAY,
  ZZ_DATE_SATURDAY,
  ZZ_DATE_SUNDAY,
  ZZ_YEAR,
} from "@lib/models";
import { cn } from "@lib/utils";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Facebook } from "@/components/icons/Facebook";
import { Instagram } from "@/components/icons/Instagram";
import { Youtube } from "@/components/icons/Youtube";

type NavbarProps = {
  isTransparent?: boolean;
};

type NavLinkData = {
  key: string;
  href: AppPathname;
};

const PRIMARY_LINKS: NavLinkData[] = [
  { key: "line-up", href: "/line-up" },
  { key: "info", href: "/info" },
  { key: "contact", href: "/contact" },
  { key: "history", href: "/history" },
  { key: "partners", href: "/partners" },
];

const SECONDARY_LINKS: NavLinkData[] = [
  { key: "menu", href: "/menu" },
  { key: "legal", href: "/privacy-policy" },
];

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/zomaarzomert/",
    label: "Instagram",
    Icon: Instagram,
  },
  {
    href: "https://facebook.com/zomaarzomert",
    label: "Facebook",
    Icon: Facebook,
  },
  {
    href: "https://open.spotify.com/playlist/1ZBMaGt1qcli9ejTu3spov?si=5d39aa4a607e4eb9",
    label: "Spotify",
    Icon: Youtube,
  },
];

const ease = [0.22, 0.61, 0.36, 1] as const;
const exitEase = [0.4, 0, 1, 1] as const;

// Panel parent — exists only to host the variant context so children can
// resolve `hidden / visible / exit` independently. No animation of its own.
const panelVariants = {
  hidden: {},
  visible: {},
  exit: {},
};

// Primary link — fade in, then slide-up + fade on exit (the inverse of
// the text-reveal entry direction). Index-staggered via `custom`.
// Entry stagger is tight (0.05s) so the five rows feel like one cascade;
// exit is ~⅓ faster than entry.
const primaryItemVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.18 + i * 0.05, ease },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: -30,
    transition: { duration: 0.22, delay: i * 0.03, ease: exitEase },
  }),
};

// Secondary leaves animate in *waves* rather than single-file: paired
// sibling links land together, the three socials follow as one beat,
// locale + date stamp share the closing beat. Same logic on exit so
// multiple sections compress into the same fade window.
//
//                      [link1, link2, soc1, soc2, soc3, locale, stamp]
const SECONDARY_VISIBLE = [0.42, 0.42, 0.5, 0.52, 0.54, 0.6, 0.6];
const SECONDARY_EXIT = [0.12, 0.12, 0.14, 0.15, 0.16, 0.18, 0.18];

const secondaryItemVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.35, delay: SECONDARY_VISIBLE[i] ?? 0.6, ease },
  }),
  exit: (i: number) => ({
    opacity: 0,
    transition: {
      duration: 0.2,
      delay: SECONDARY_EXIT[i] ?? 0.18,
      ease: exitEase,
    },
  }),
};

function StarBullet() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn(
        "block h-5 w-5 shrink-0 text-yellow-300 drop-shadow-[0_2px_0_rgba(0,0,0,0.35)]",
        "transition-transform duration-300 ease-out",
        "group-hover:scale-125 group-hover:rotate-90 group-focus-visible:scale-125 group-focus-visible:rotate-90",
        "sm:h-6 sm:w-6 md:h-7 md:w-7 xl:h-8 xl:w-8",
      )}
    >
      <path
        d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function NavLink({
  href,
  label,
  onNavigate,
}: {
  href: AppPathname;
  label: string;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onNavigate}
      className={cn(
        "font-display group relative flex items-center gap-3 py-1 font-bold uppercase outline-none",
        "sm:gap-4 sm:py-1.5 md:gap-5 md:py-1",
      )}
    >
      <StarBullet />
      <span
        className={cn(
          "relative grid overflow-hidden leading-none",
          "text-4xl sm:text-5xl md:text-6xl xl:text-7xl",
        )}
      >
        <span
          className={cn(
            "col-start-1 row-start-1 block transition-transform duration-300 ease-out",
            "group-hover:-translate-y-full group-focus-visible:-translate-y-full",
            isActive ? "text-yellow-300" : "text-white",
          )}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "col-start-1 row-start-1 block translate-y-full text-yellow-300 transition-transform duration-300 ease-out",
            "group-hover:translate-y-0 group-focus-visible:translate-y-0",
          )}
        >
          {label}
        </span>
      </span>
    </Link>
  );
}

function formatDateStamp() {
  // ZZ_DATE_* are ISO strings like "2026-07-24" — slice the day directly
  // to dodge any timezone shift from `new Date(iso).getDate()`.
  const day = (iso: string) => iso.slice(8, 10).replace(/^0/, "");
  return `${day(ZZ_DATE_FRIDAY)} · ${day(ZZ_DATE_SATURDAY)} · ${day(ZZ_DATE_SUNDAY)} JULI '${String(ZZ_YEAR).slice(-2)}`;
}

export function Navbar({ isTransparent = false }: NavbarProps) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
  };

  const { scrollY } = useScroll();
  const navPadY = useTransform(scrollY, [0, 120], ["1.5rem", "0.5rem"]);
  const logoScale = useTransform(scrollY, [0, 120], [1, 0.7]);

  return (
    <BaseDialog.Root open={open} onOpenChange={setOpen}>
      <header
        className={cn(
          "fixed top-0 left-0 z-50 w-full bg-transparent transition-colors",
          isTransparent || open ? "text-white" : "text-gray-900",
        )}
      >
        <div className="container-wide">
          <motion.nav style={{ paddingTop: navPadY, paddingBottom: navPadY }}>
            <div className="relative flex w-full items-center justify-between">
              <motion.div style={{ scale: logoScale }} className="origin-left">
                <Logo
                  className={cn(
                    "h-10 w-auto md:h-14 lg:h-16",
                    isTransparent || open ? "text-white" : "text-gray-900",
                  )}
                />
              </motion.div>
              <div className="-mr-2 flex items-center gap-2">
                <BaseDialog.Trigger
                  render={
                    <MenuToggle
                      open={open}
                      transparent={isTransparent || open}
                      aria-label="Menu"
                    />
                  }
                />
              </div>
            </div>
          </motion.nav>
        </div>
      </header>

      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-40 bg-black/0" />
        <BaseDialog.Popup className="fixed inset-0 z-40 outline-none data-closed:pointer-events-none data-closed:animate-[dialog-stay-mounted_600ms]">
          <BaseDialog.Title className="sr-only">Menu</BaseDialog.Title>

          <AnimatePresence>
            {open && (
              <motion.div
                key="panel"
                variants={panelVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0 overflow-hidden"
              >
                {/* Background layers — each fades in/out via parent variants. */}
                <MenuBackground />

                {/* Content */}
                <div className="container-wide relative z-10 flex h-full flex-col overflow-y-auto pt-24 pb-6 sm:pt-28 md:pt-32 md:pb-10">
                  {/* Primary nav — fade-in stagger, slide-up + fade on exit. */}
                  <ul
                    className="flex flex-col items-start gap-0 sm:gap-1 md:gap-0.5"
                    role="menu"
                  >
                    {PRIMARY_LINKS.map((l, i) => (
                      <motion.li
                        key={l.key}
                        variants={primaryItemVariants}
                        custom={i}
                        className="block"
                      >
                        <NavLink
                          href={l.href}
                          label={t(`links.${l.key}`)}
                          onNavigate={close}
                        />
                      </motion.li>
                    ))}
                  </ul>

                  {/* Secondary band — every leaf fades on its own delayed beat. */}
                  <div className="mt-auto pt-6 sm:pt-10">
                    <div className="border-t border-white/25 pt-4 sm:pt-6 md:pt-8">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
                        {/* Secondary links */}
                        <ul className="flex flex-col gap-2 sm:gap-2.5">
                          {SECONDARY_LINKS.map((l, i) => (
                            <motion.li
                              key={l.key}
                              variants={secondaryItemVariants}
                              custom={i}
                            >
                              <Link
                                href={l.href}
                                onClick={close}
                                className="font-display group inline-flex items-center gap-3 text-xs font-bold tracking-wider text-white/70 uppercase transition-colors hover:text-white sm:text-sm md:text-base"
                              >
                                <span
                                  aria-hidden="true"
                                  className="block h-px w-5 bg-current transition-all duration-300 group-hover:w-9"
                                />
                                {t(`links.${l.key}`)}
                              </Link>
                            </motion.li>
                          ))}
                        </ul>

                        {/* Right cluster — socials + locale. */}
                        <div className="flex flex-col items-start gap-4 sm:items-end">
                          <div className="flex items-center gap-2 sm:gap-3">
                            {SOCIAL_LINKS.map(({ href, label, Icon }, i) => (
                              <motion.a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={label}
                                variants={secondaryItemVariants}
                                custom={2 + i}
                                className={cn(
                                  "group relative inline-flex items-center justify-center border-2 border-white/40 bg-white/5 text-white outline-none",
                                  "h-9 w-9 sm:h-10 sm:w-10",
                                  "transition-all duration-200 ease-out",
                                  "hover:-translate-y-0.5 hover:rotate-3 hover:border-yellow-300 hover:bg-yellow-300 hover:text-gray-900",
                                  "focus-visible:-translate-y-0.5 focus-visible:border-yellow-300 focus-visible:bg-yellow-300 focus-visible:text-gray-900",
                                )}
                              >
                                <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                              </motion.a>
                            ))}
                          </div>
                          <motion.div
                            variants={secondaryItemVariants}
                            custom={5}
                          >
                            <LocaleSwitcher className="text-white" />
                          </motion.div>
                        </div>
                      </div>

                      <motion.div
                        variants={secondaryItemVariants}
                        custom={6}
                        className="mt-5 flex justify-center sm:mt-8 sm:justify-end"
                      >
                        <Sticker color="ink" size="sm" rotate={-2}>
                          {formatDateStamp()}
                        </Sticker>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
