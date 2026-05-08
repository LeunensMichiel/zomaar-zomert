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
    "/info": {
      nl: "/info",
      fr: "/infos",
      en: "/info",
    },
    "/menu": "/menu",
    "/contact": "/contact",
    "/history": {
      nl: "/historie",
      fr: "/histoire",
      en: "/history",
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
