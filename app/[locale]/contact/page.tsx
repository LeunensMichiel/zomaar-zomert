import { Form } from '@components/common';
import Map from '@components/ui/Map';
import type { Locale } from '@lib/i18n/routing';
import cn from 'classnames';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import styles from './page.module.scss';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: t('SEO.title'),
    description: t('SEO.description'),
    openGraph: {
      title: t('SEO.openGraph.title'),
      description: t('SEO.openGraph.description'),
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <section className={cn('container py-container--sm')}>
      <h1 className="header">{t('title')}</h1>
      <div className={styles.root}>
        <Form />
        <div className={styles.map__container}>
          <Map height="100%" />
        </div>
      </div>
    </section>
  );
}
