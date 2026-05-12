import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

const NAMESPACES = [
  "common",
  "contact",
  "history",
  "home",
  "info",
  "line-up",
  "menu",
  "partners",
  "privacy",
] as const;

type Namespace = Record<string, unknown>;
type ImportedJson = { default: Namespace };

const loadMessages = async (locale: string) => {
  const mods = (await Promise.all(
    NAMESPACES.map((ns) => import(`../../locales/${locale}/${ns}.json`)),
  )) as ImportedJson[];
  return Object.fromEntries(NAMESPACES.map((ns, i) => [ns, mods[i].default]));
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
