"use client";

import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";
import { LocaleSwitcher } from "@components/locale-switcher";
import { MenuToggle } from "@components/menu-toggle";
import { Logo } from "@components/ui/logo";
import { Link, usePathname } from "@lib/i18n/navigation";
import { type AppPathname } from "@lib/i18n/routing";
import { cn } from "@lib/utils";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type NavbarProps = {
  isTransparent?: boolean;
};

type NavLinkData = {
  key: string;
  href: AppPathname;
};

const NAV_LINKS: NavLinkData[] = [
  { key: "home", href: "/" },
  { key: "line-up", href: "/line-up" },
  { key: "info", href: "/info" },
  { key: "contact", href: "/contact" },
  { key: "history", href: "/history" },
  { key: "partners", href: "/partners" },
];

const ease = [0.22, 0.61, 0.36, 1] as const;

const containerVariants = {
  hidden: {
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.35 },
  },
};

const linkItemVariants = {
  hidden: { opacity: 0, y: 30, transition: { duration: 0.18, ease } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

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
        "font-display group relative block px-4 py-2.5 font-bold uppercase outline-none md:py-1",
        "text-4xl md:text-6xl xl:text-7xl",
      )}
    >
      {/* Kinetic text-swap. The overflow-hidden lives on this inner
          wrapper (not the link) and `leading-none` makes the row exactly
          one glyph tall, so `translate-y-full` is a clean 100% shift —
          no peek-through from the duplicate copy. */}
      <span className="relative grid overflow-hidden leading-none">
        <span
          className={cn(
            "col-start-1 row-start-1 block transition-transform duration-300 ease-out",
            "group-hover:-translate-y-full group-focus-visible:-translate-y-full",
            isActive ? "text-yellow-300" : "text-gray-900",
          )}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "col-start-1 row-start-1 block translate-y-full text-yellow-400 transition-transform duration-300 ease-out",
            "group-hover:translate-y-0 group-focus-visible:translate-y-0",
          )}
        >
          {label}
        </span>
      </span>
    </Link>
  );
}

export function Navbar({ isTransparent = false }: NavbarProps) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const close = () => {
    setOpen(false);
  };

  // Header is now permanently `fixed` and shrinks as the page scrolls past
  // the first 120px — vertical padding tightens, the logo scales down 30%.
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
            <div className="relative z-10000 flex w-full items-center justify-between">
              <motion.div style={{ scale: logoScale }} className="origin-left">
                <Logo
                  className={cn(
                    "h-10 w-auto md:h-14 lg:h-16",
                    isTransparent || open ? "text-white" : "text-gray-900",
                  )}
                />
              </motion.div>
              <div className="-mr-2 flex items-center gap-2">
                <AnimatePresence>
                  {open && (
                    <motion.div
                      key="locale"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.55, duration: 0.3, ease },
                      }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    >
                      <LocaleSwitcher />
                    </motion.div>
                  )}
                </AnimatePresence>
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

      <BaseDialog.Portal keepMounted>
        <BaseDialog.Backdrop className="fixed inset-0 z-40 bg-black/0" />
        <BaseDialog.Popup className="fixed inset-0 z-40 outline-none data-closed:pointer-events-none data-closed:animate-[dialog-stay-mounted_300ms]">
          <BaseDialog.Title className="sr-only">Menu</BaseDialog.Title>

          {/* Backdrop slides down from the top — the "gate" drop. */}
          <motion.div
            initial={false}
            animate={{ y: open ? "0%" : "-100%" }}
            transition={{ duration: open ? 0.55 : 0.3, ease }}
            className="bg-brand-500/65 absolute inset-0 backdrop-blur-2xl"
          >
            <div
              aria-hidden="true"
              className='halftone pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply content-[""]'
            />
          </motion.div>

          {/* Stagger fade-in / fade-out of the link list. */}
          <motion.div
            initial={false}
            animate={open ? "visible" : "hidden"}
            variants={containerVariants}
            className="relative mx-auto flex h-full w-full max-w-5xl flex-col items-start justify-center gap-2 overflow-y-auto px-4 py-24 md:gap-1"
            role="menu"
          >
            {NAV_LINKS.map((l) => (
              <motion.div key={l.key} variants={linkItemVariants}>
                <NavLink
                  href={l.href}
                  label={t(`links.${l.key}`)}
                  onNavigate={close}
                />
              </motion.div>
            ))}
          </motion.div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
