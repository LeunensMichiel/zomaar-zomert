"use client";

import { type CONSENT } from "@components/cookie-banner";
import { getLocalStorage } from "@lib/utils/storage";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

export function ConsentVideo() {
  const [consent, setConsent] = useState<CONSENT | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is not SSR-safe
    setConsent(getLocalStorage<CONSENT>("cookie_consent", "pending"));
  }, []);

  return (
    <section className="section-y-sm bg-brand-500 w-full pt-10!">
      <div className="container-wide">
        <div className="relative h-0 overflow-hidden pb-[56.25%]">
          <div className="absolute inset-0 z-[1] h-full w-full">
            {consent && consent !== "denied" && (
              <ReactPlayer
                width="100%"
                height="100%"
                controls
                src="https://www.youtube.com/embed/G2s9r_BohUE"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
