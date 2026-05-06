"use client";

import { usePathname, useRouter } from "@lib/i18n/navigation";
import { type Locale, routing } from "@lib/i18n/routing";
import { cn } from "@lib/utils";
import { motion } from "motion/react";
import { useLocale } from "next-intl";
import { useTransition } from "react";

const LANG_CODES: Record<Locale, string> = {
  nl: "NL",
  fr: "FR",
  en: "EN",
};

type Props = {
  className?: string;
};

/**
 * Compact two-letter locale switcher. Inactive codes sit at low opacity so
 * the control stays subtle; the active one gets a yellow underline that
 * slides between codes via `motion`'s `layoutId` — matches the yellow
 * accent the kinetic nav links use on hover, so the visual vocabulary lines
 * up.
 *
 * Replaces the older globe-icon-opens-a-dialog pattern with a single tap
 * to switch.
 */
export function LocaleSwitcher({ className }: Props) {
  const lang = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSelect = (next: Locale) => {
    if (next === lang || isPending) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "font-display inline-flex items-center gap-1 text-xs leading-none font-bold tracking-wider uppercase",
        className,
      )}
    >
      {routing.locales.map((lng) => {
        const isActive = lng === lang;
        return (
          <button
            key={lng}
            type="button"
            onClick={() => {
              handleSelect(lng);
            }}
            aria-pressed={isActive}
            disabled={isPending}
            className={cn(
              "relative cursor-pointer px-1.5 py-1 transition-opacity outline-none",
              "focus-visible:opacity-100",
              isActive ? "opacity-100" : "opacity-50 hover:opacity-100",
            )}
          >
            {LANG_CODES[lng]}
            {isActive && (
              <motion.span
                layoutId="locale-bar"
                aria-hidden="true"
                className="absolute inset-x-1 -bottom-0.5 h-0.5 bg-yellow-400"
                transition={{ type: "spring", duration: 0.45, bounce: 0.25 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
