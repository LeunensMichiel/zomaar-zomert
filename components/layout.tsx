import { CookieBanner } from "@components/cookie-banner";
import { Navbar } from "@components/navbar";
import { type ReactNode } from "react";

type Props = { children: ReactNode; footer: ReactNode };

export function Layout({ children, footer }: Props) {
  return (
    <>
      <Navbar isTransparent />
      <main className="min-h-[75%]">{children}</main>
      {footer}
      <CookieBanner />
    </>
  );
}
