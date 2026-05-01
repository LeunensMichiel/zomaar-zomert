import type { Locale } from '@lib/i18n/routing';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import InfoCards from './_components/InfoCards';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'info' });
  return {
    title: t('SEO.title'),
    description: t('SEO.description'),
    openGraph: {
      title: t('SEO.openGraph.title'),
      description: t('SEO.openGraph.description'),
    },
  };
}

export default async function InfoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'info' });

  return (
    <section className="container py-container--sm">
      <h1 className="header">{t('title')}</h1>
      <InfoCards />
    </section>
  );
}
