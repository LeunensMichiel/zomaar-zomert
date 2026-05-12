import { CookieBanner } from "@components/cookie-banner";
import { Doodle } from "@components/doodle";
import { Navbar } from "@components/navbar";
import { type ReactNode } from "react";

type Props = { children: ReactNode; footer: ReactNode };

export function Layout({ children, footer }: Props) {
  return (
    <>
      <Navbar
        starBurst={
          <Doodle
            shape="star-burst"
            color="linear-sunset"
            className="h-full w-full"
          />
        }
      />
      <main className="min-h-[75%]">{children}</main>
      {footer}
      <CookieBanner />
    </>
  );
}
