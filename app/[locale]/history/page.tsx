import type { Locale } from '@lib/i18n/routing';
import cn from 'classnames';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import styles from './page.module.scss';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'history' });
  return {
    title: t('SEO.title'),
    description: t('SEO.description'),
    openGraph: {
      title: t('SEO.openGraph.title'),
      description: t('SEO.openGraph.description'),
    },
  };
}

export default async function HistoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'history' });

  return (
    <section className={cn('container-page py-container--sm', styles.root)}>
      <h1 className="header">{t('title')}</h1>
      <div>
        {t.rich('content', {
          p: (chunks) => <p>{chunks}</p>,
          image: () => (
            <img
              src="/assets/random/crew.webp"
              alt="The Zomaar Zomert Crew"
              className={styles.image}
            />
          ),
        })}
      </div>
    </section>
  );
}
