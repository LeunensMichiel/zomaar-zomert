import "./globals.css";

import type { Metadata } from "next";
import { Open_Sans, Oswald } from "next/font/google";
import Link from "next/link";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-oswald",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pagina niet gevonden | Zomaar Zomert",
  description: "Deze pagina is even van de kaart gevallen.",
};

// Catches URLs that don't match any route at all. The project's root
// layout sits under a [locale] dynamic segment, so a regular
// app/not-found.tsx would be nested inside [locale]/layout.tsx during
// SPA navigation and produce duplicate html/body + hydration errors.
// global-not-found bypasses the layout chain — must declare its own
// html/body and load globals.css + fonts. No next-intl context here,
// so copy is in NL (default locale). Enabled via
// experimental.globalNotFound in next.config.js.
export default function GlobalNotFound() {
  return (
    <html lang="nl" className={`${oswald.variable} ${openSans.variable}`}>
      <body className="bg-blue-900 font-sans text-pink-50">
        <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="font-display shadow-sticker-lg inline-block rotate-1 border-2 border-gray-900 bg-blue-500 px-6 py-3 text-7xl leading-[0.85] font-bold text-yellow-400 uppercase md:px-10 md:py-5 md:text-9xl xl:text-[12rem]">
            404
          </h1>
          <p className="font-display shadow-sticker-sm mt-6 inline-block -rotate-2 border-2 border-gray-900 bg-pink-300 px-4 py-2 text-base font-bold text-gray-900 uppercase md:mt-8 md:text-xl">
            Pagina niet gevonden
          </p>
          <p className="mt-8 max-w-md text-base text-pink-50/85 md:mt-10 md:text-lg">
            Deze pagina is even van de kaart gevallen. Geen probleem — terug
            naar het festival.
          </p>
          <Link
            href="/"
            className="font-display shadow-sticker-sm md:shadow-sticker mt-10 inline-block cursor-pointer border-2 border-gray-900 bg-yellow-400 px-5 py-3 text-lg font-bold text-gray-900 uppercase transition-all hover:-translate-y-0.5 hover:bg-yellow-300"
          >
            Terug naar home
          </Link>
        </main>
      </body>
    </html>
  );
}
