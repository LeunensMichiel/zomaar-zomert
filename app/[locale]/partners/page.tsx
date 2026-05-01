import { type Locale } from '@lib/i18n/routing';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import PartnersGrid from './_components/partners-grid';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'partners' });
  return {
    title: t('SEO.title'),
    description: t('SEO.description'),
    openGraph: {
      title: t('SEO.openGraph.title'),
      description: t('SEO.openGraph.description'),
    },
  };
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'partners' });

  return (
    <section className="container-wide section-y-sm">
      <h1 className="mb-14 text-center font-bold uppercase md:mb-20 xl:mb-36">
        {t('main.header')}
      </h1>
      <p className="mb-16 text-center">{t('main.paragraph')}</p>
      <PartnersGrid />
    </section>
  );
}
