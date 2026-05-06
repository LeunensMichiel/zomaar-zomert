"use client";

import { CookieBanner } from "@components/cookie-banner";
import { Navbar } from "@components/navbar";
import { usePathname } from "@lib/i18n/navigation";
import { cn } from "@lib/utils";
import { type ReactNode } from "react";

type Props = { children: ReactNode; footer: ReactNode };

const transparentRoutes = ["/", "/redesign"];

export function Layout({ children, footer }: Props) {
  const pathname = usePathname();
  const isTransparent = transparentRoutes.includes(pathname);

  return (
    <>
      <Navbar isTransparent={isTransparent} />
      <main
        className={cn("min-h-[75%]", isTransparent ? "pt-0" : "pt-18 lg:pt-28")}
      >
        {children}
      </main>
      {footer}
      <CookieBanner />
    </>
  );
}
