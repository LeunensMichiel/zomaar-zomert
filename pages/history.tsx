/* eslint-disable react/jsx-key */
import { Layout } from '@components/common';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';

import styles from './styles/about.module.scss';
const HistoryPage = () => {
  const { t } = useTranslation('history');
  return (
    <>
      <NextSeo
        title="History"
        description="Find out how Zomaar Zomert came to be! Only for the realy interested."
        openGraph={{
          title: 'History',
          description:
            'Find out how Zomaar Zomert came to be! Only for the realy interested.',
        }}
      />
      <section className={cn('container-page py-container--sm', styles.root)}>
        <h1 className={'header'}>{t('title')}</h1>
        <Trans
          i18nKey="content"
          ns="history"
          components={[
            <p />,
            <img
              src="/assets/random/crew.webp"
              alt="The Zomaar Zomert Crew"
              className={styles.image}
            />,
          ]}
        />
      </section>
    </>
  );
};

export default HistoryPage;

HistoryPage.Layout = Layout;
