import "../globals.css";

import { Layout } from "@components/layout";
import { routing } from "@lib/i18n/routing";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { Open_Sans, Oswald } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

const SITE_URL = process.env.SITE_URL ?? "https://zomaarzomert.be";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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

export const viewport: Viewport = {
  themeColor: "#de350b",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  const description = t("seo.description");
  const title = `Zomaar Zomert ${new Date().getFullYear()}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: "%s | Zomaar Zomert",
    },
    description,
    icons: {
      icon: [
        {
          url: "/meta/favicon-32x32.png?v=1",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/meta/favicon-16x16.png?v=1",
          sizes: "16x16",
          type: "image/png",
        },
      ],
      apple: "/meta/apple-touch-icon.png?v=1",
      other: [
        {
          rel: "mask-icon",
          url: "/meta/safari-pinned-tab.svg?v=1",
          color: "#de350b",
        },
        { rel: "shortcut icon", url: "/meta/favicon.ico?v=1" },
      ],
    },
    manifest: "/meta/site.webmanifest?v=1",
    other: {
      "msapplication-TileColor": "#de350b",
      "msapplication-config": "/meta/browserconfig.xml?v=1",
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      type: "website",
      locale,
      siteName: "Zomaar Zomert",
      images: [
        {
          url: "/assets/card.jpg",
          width: 1200,
          height: 630,
          alt: "Zomaar Zomert",
        },
      ],
    },
  };
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${oswald.variable} ${openSans.variable}`}>
      <body>
        <NextIntlClientProvider>
          <Layout>{children}</Layout>
        </NextIntlClientProvider>
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
