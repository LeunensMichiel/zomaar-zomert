"use client";

import { Button } from "@components/ui/button";
import { Link } from "@lib/i18n/navigation";
import { getLocalStorage, setLocalStorage } from "@lib/utils/storage";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

export type CONSENT = "granted" | "denied" | "pending";

type DataLayerWindow = Window & { dataLayer?: unknown[] };

export const updateGoogleConsent = (newConsent: "granted" | "denied") => {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push("consent", "update", {
    ad_storage: newConsent,
    analytics_storage: newConsent,
  });
};

export function CookieBanner() {
  const t = useTranslations("common");
  const [consent, setConsent] = useState<CONSENT | undefined>(undefined);

  const handleConsent = useCallback((next: CONSENT) => {
    if (next === "pending") return;
    updateGoogleConsent(next);
    setConsent(next);
    setLocalStorage("cookie_consent", next);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is not SSR-safe
    setConsent(getLocalStorage<CONSENT>("cookie_consent", "pending"));
  }, []);

  if (consent !== "pending") return null;

  return (
    <div className="shadow-sticker fixed right-4 bottom-6 left-4 z-10000 grid max-w-2xl items-center gap-3 border-2 border-gray-900 bg-pink-50 p-4 md:right-auto md:left-1/2 md:w-full md:-translate-x-1/2 md:grid-cols-[1fr_auto] md:gap-5 md:p-5">
      <div className="flex flex-col gap-1.5">
        <div className="font-display text-sm font-bold tracking-wide text-gray-900 uppercase">
          {t("cookies.title")}
        </div>
        <p className="text-sm leading-snug text-gray-700">
          {t.rich("cookies.text", {
            strong: (chunks) => (
              <strong className="font-bold text-gray-900">{chunks}</strong>
            ),
            br: () => <br />,
            policy: (chunks) => (
              <Link
                href="/privacy-policy"
                className="hover:text-brand-500 font-bold text-gray-900 underline underline-offset-2 transition-colors"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
      <div className="flex items-center justify-end gap-4 md:justify-start">
        <button
          type="button"
          onClick={() => {
            handleConsent("denied");
          }}
          className="font-display hover:text-brand-500 text-xs font-bold tracking-wide text-gray-900 uppercase underline underline-offset-2 transition-colors md:text-sm"
        >
          {t("cookies.deny")}
        </button>
        <Button
          onClick={() => {
            handleConsent("granted");
          }}
          size="sm"
          variant="accent"
          sticker
        >
          {t("cookies.consent")}
        </Button>
      </div>
    </div>
  );
}
