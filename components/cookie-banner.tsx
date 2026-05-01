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
    <div className="fixed right-4 bottom-8 left-4 z-[10000] grid max-w-3xl items-center gap-2 bg-white p-4 md:right-auto md:bottom-4 md:left-1/2 md:w-full md:-translate-x-1/2 md:grid-cols-[1fr_auto]">
      <div className="flex flex-col gap-2 text-xs">
        <div className="font-display">{t("cookies.title")}</div>
        <div className="font-sans leading-snug font-normal">
          {t.rich("cookies.text", {
            strong: (chunks) => <strong>{chunks}</strong>,
            br: () => <br />,
            policy: (chunks) => (
              <Link href="/privacy-policy" className="font-bold underline">
                {chunks}
              </Link>
            ),
          })}
        </div>
      </div>
      <div className="flex w-full justify-end gap-8 md:justify-start md:gap-2">
        <Button
          onClick={() => {
            handleConsent("denied");
          }}
          size="xs"
          variant="minimal-dark"
        >
          {t("cookies.deny")}
        </Button>
        <Button
          onClick={() => {
            handleConsent("granted");
          }}
          size="xs"
          variant="primary"
        >
          {t("cookies.consent")}
        </Button>
      </div>
    </div>
  );
}
