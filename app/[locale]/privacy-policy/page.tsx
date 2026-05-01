import { type Locale } from "@lib/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("title") };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <section className="container-page section-y-sm px-6 lg:px-8">
      <h1 className="mb-14 text-center font-bold uppercase md:mb-20 xl:mb-36">
        {t("title")}
      </h1>
      <p className="mb-6 font-normal">{t("block1")}</p>
      <p className="mt-4 mb-6 font-normal">{t("block2")}</p>
      <p className="mt-4 mb-6 font-normal">{t("block3")}</p>
      <p className="mt-4 mb-6 font-normal">{t("block4")}</p>
      <p className="mt-4 mb-6 font-normal">{t("block5")}</p>
    </section>
  );
}
