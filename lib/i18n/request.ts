import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

type Namespace = Record<string, unknown>;
type ImportedJson = { default: Namespace };

const loadMessages = async (locale: string) => {
  const [
    common,
    contact,
    history,
    home,
    info,
    lineUp,
    menu,
    partners,
    privacy,
  ] = (await Promise.all([
    import(`@/locales/${locale}/common.json`),
    import(`@/locales/${locale}/contact.json`),
    import(`@/locales/${locale}/history.json`),
    import(`@/locales/${locale}/home.json`),
    import(`@/locales/${locale}/info.json`),
    import(`@/locales/${locale}/line-up.json`),
    import(`@/locales/${locale}/menu.json`),
    import(`@/locales/${locale}/partners.json`),
    import(`@/locales/${locale}/privacy.json`),
  ])) as ImportedJson[];

  return {
    common: common.default,
    contact: contact.default,
    history: history.default,
    home: home.default,
    info: info.default,
    "line-up": lineUp.default,
    menu: menu.default,
    partners: partners.default,
    privacy: privacy.default,
  };
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
