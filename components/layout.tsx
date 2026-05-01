"use client";

import { CookieBanner } from "@components/cookie-banner";
import { Footer } from "@components/footer";
import { Navbar } from "@components/navbar";
import { usePathname } from "@lib/i18n/navigation";
import { cn } from "@lib/utils";
import { type ReactNode } from "react";

type Props = { children: ReactNode };

const transparentRoutes = ["/"];

export function Layout({ children }: Props) {
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
      <Footer />
      <CookieBanner />
    </>
  );
}
