import { Form } from "@components/form";
import { Map } from "@components/ui/map";
import { type Locale } from "@lib/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("SEO.title"),
    description: t("SEO.description"),
    openGraph: {
      title: t("SEO.openGraph.title"),
      description: t("SEO.openGraph.description"),
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <section className="container-wide section-y-sm">
      <h1 className="mb-14 text-center font-bold uppercase md:mb-20 xl:mb-36">
        {t("title")}
      </h1>
      <div className="grid items-start gap-8 md:grid-cols-[3fr_2fr]">
        <Form />
        <div className="h-[100vw] md:order-first md:h-full">
          <Map height="100%" />
        </div>
      </div>
    </section>
  );
}
