import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "fr", "en"],
  localePrefix: "never",
  defaultLocale: "nl",
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 100,
  },
  pathnames: {
    "/": "/",
    "/line-up": {
      nl: "/line-up",
      fr: "/programmation",
      en: "/line-up",
    },
    "/line-up/[slug]": {
      nl: "/line-up/[slug]",
      fr: "/programmation/[slug]",
      en: "/line-up/[slug]",
    },
    "/info": {
      nl: "/info",
      fr: "/infos",
      en: "/info",
    },
    "/menu": "/menu",
    "/contact": "/contact",
    "/history": {
      nl: "/ons-verhaal",
      fr: "/notre-histoire",
      en: "/our-story",
    },
    "/partners": {
      nl: "/partners",
      fr: "/partenaires",
      en: "/partners",
    },
    "/privacy-policy": {
      nl: "/privacybeleid",
      fr: "/politique-de-confidentialite",
      en: "/privacy-policy",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
// Pathnames without dynamic segments — safe to pass as a bare string to
// `<Link href>` and `router.replace(...)` without supplying `params`.
export type StaticAppPathname = Exclude<
  AppPathname,
  `${string}[${string}]${string}`
>;
