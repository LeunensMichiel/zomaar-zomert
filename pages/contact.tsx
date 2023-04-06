import { Form, Layout } from '@components/common';
import Map from '@components/ui/Map';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';

import styles from './styles/contact.module.scss';

const ContactPage = () => {
  const { t } = useTranslation('contact');
  return (
    <>
      <NextSeo
        title={t('SEO.title')}
        description={t('SEO.description')}
        openGraph={{
          title: t('SEO.openGraph.title'),
          description: t('SEO.openGraph.description'),
        }}
      />
      <section className={cn('container py-container--sm')}>
        <h1 className={'header'}>{t('title')}</h1>
        <div className={styles.root}>
          <Form />
          <div className={styles.map__container}>
            <Map height="100%" />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;

ContactPage.Layout = Layout;
