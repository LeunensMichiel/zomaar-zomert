"use client";

import "./globals.css";

import { Open_Sans, Oswald } from "next/font/google";
import Link from "next/link";
import { useEffect } from "react";

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

type Props = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

// Replaces the root layout when an error escapes the locale segment's
// error.tsx — typically a crash inside [locale]/layout.tsx itself.
// Must declare its own html/body and load globals.css since it's the
// outermost element when active. No next-intl available here, so copy
// is hardcoded English.
export default function GlobalError({ error, unstable_retry }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className={`${oswald.variable} ${openSans.variable}`}>
      <body className="bg-blue-900 font-sans text-pink-50">
        <title>Something went wrong | Zomaar Zomert</title>
        <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="font-display shadow-sticker-lg bg-brand-500 inline-block rotate-2 border-2 border-gray-900 px-6 py-3 text-7xl leading-[0.85] font-bold text-pink-50 uppercase md:px-10 md:py-5 md:text-9xl">
            Oops.
          </h1>
          <p className="font-display mt-10 text-2xl uppercase md:mt-12 md:text-3xl">
            Something went sideways.
          </p>
          <p className="mt-4 max-w-md text-base text-pink-50/80 md:text-lg">
            The festival site hit an unexpected snag. Try again or head home.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                unstable_retry();
              }}
              className="font-display shadow-sticker-sm md:shadow-sticker bg-brand-500 hover:bg-brand-600 cursor-pointer border-2 border-gray-900 px-5 py-3 text-lg font-bold text-white uppercase transition-all hover:-translate-y-0.5"
            >
              Try again
            </button>
            <Link
              href="/"
              className="font-display shadow-sticker-sm md:shadow-sticker cursor-pointer border-2 border-gray-900 bg-yellow-400 px-5 py-3 text-lg font-bold text-gray-900 uppercase transition-all hover:-translate-y-0.5 hover:bg-yellow-300"
            >
              Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
