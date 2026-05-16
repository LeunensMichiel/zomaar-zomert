"use client";

import { usePathname, useRouter } from "@lib/i18n/navigation";
import { type Locale, routing } from "@lib/i18n/routing";
import { cn } from "@lib/utils";
import { motion } from "motion/react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useId, useTransition } from "react";

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
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("common");
  // Per-instance scope so the navbar + footer switchers don't share
  // the same shared-layout bar (which would otherwise fly between
  // their two positions on mount).
  const barId = useId();

  const handleSelect = (next: Locale) => {
    if (next === lang || isPending) return;
    startTransition(() => {
      if (pathname === "/line-up/[slug]") {
        const slug = typeof params.slug === "string" ? params.slug : "";
        router.replace(
          { pathname: "/line-up/[slug]", params: { slug } },
          { locale: next },
        );
      } else {
        router.replace(pathname, { locale: next });
      }
      // Invalidate the Router Cache — otherwise prefetched RSC payloads for
      // other routes still hold the previous locale's content, and the next
      // navigation snaps the user back to it. Also covers shared pathnames
      // (e.g. /menu) where `replace` to the same URL is a no-op on its own.
      router.refresh();
    });
  };

  return (
    <div
      role="group"
      aria-label={t("aria.language")}
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
                layoutId={`locale-bar-${barId}`}
                aria-hidden="true"
                className="absolute inset-x-1 -bottom-0.5 h-px bg-yellow-400"
                transition={{ type: "spring", duration: 0.45, bounce: 0.25 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
