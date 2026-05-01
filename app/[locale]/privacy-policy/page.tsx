import type { Locale } from '@lib/i18n/routing';
import cn from 'classnames';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import styles from './page.module.scss';

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    title: t('title'),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return (
    <section className={cn('container-page py-container--sm', styles.root)}>
      <h1 className="header">{t('title')}</h1>
      <p style={{ fontWeight: 400 }}>{t('block1')}</p>
      <p style={{ fontWeight: 400, marginTop: '1rem' }}>{t('block2')}</p>
      <p style={{ fontWeight: 400, marginTop: '1rem' }}>{t('block3')}</p>
      <p style={{ fontWeight: 400, marginTop: '1rem' }}>{t('block4')}</p>
      <p style={{ fontWeight: 400, marginTop: '1rem' }}>{t('block5')}</p>
    </section>
  );
}
