import { type Locale } from "@lib/i18n/routing";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "history" });
  return {
    title: t("SEO.title"),
    description: t("SEO.description"),
    openGraph: {
      title: t("SEO.openGraph.title"),
      description: t("SEO.openGraph.description"),
    },
  };
}

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "history" });

  return (
    <section className="container-page section-y-sm px-6 lg:px-8">
      <h1 className="mb-14 text-center font-bold uppercase md:mb-20 xl:mb-36">
        {t("title")}
      </h1>
      <div>
        {t.rich("content", {
          p: (chunks) => <p className="mb-6 lg:mb-8">{chunks}</p>,
          image: () => (
            <img
              src="/assets/random/crew.webp"
              alt="The Zomaar Zomert Crew"
              className="my-12 block h-auto w-full object-contain"
            />
          ),
        })}
      </div>
    </section>
  );
}
