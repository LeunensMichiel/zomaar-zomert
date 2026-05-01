import { type AppPathname, type Locale, routing } from "@lib/i18n/routing";
import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL ?? "https://zomaarzomert.be";

const routes: AppPathname[] = [
  "/",
  "/line-up",
  "/info",
  "/contact",
  "/history",
  "/partners",
  "/menu",
  "/privacy-policy",
];

const localizedPath = (href: AppPathname, locale: Locale): string => {
  const config = routing.pathnames[href];
  const path = typeof config === "string" ? config : config[locale];
  if (href === "/") return `/${locale}`;
  return `/${locale}${path}`;
};

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((href) => ({
    url: `${SITE_URL}${localizedPath(href, routing.defaultLocale)}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          `${SITE_URL}${localizedPath(href, locale)}`,
        ]),
      ),
    },
  }));
}
