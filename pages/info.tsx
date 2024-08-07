import { Layout, TexturedImage } from '@components/common';
import ChevronRight from '@components/icons/Chevron';
import { Button, Card } from '@components/ui';
import Map from '@components/ui/Map';
import { NextSeo } from 'next-seo';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import React from 'react';
import Masonry from 'react-masonry-css';

import {
  ENABLE_LINKS_DATE,
  PAELLA_LINK,
  PETANQUE_LINK,
  ZZ_DATE_SUNDAY,
} from '../lib/models';
import styles from './styles/info.module.scss';

const breakpointColumns = {
  default: 3,
  '1023': 2,
  '639': 1,
};

const InfoPage = () => {
  const { t } = useTranslation('info');
  const today = new Date();
  const signupDisabled =
    today < new Date(ENABLE_LINKS_DATE) || today > new Date(ZZ_DATE_SUNDAY);
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

      <section className="container py-container--sm">
        <h1 className={'header'}>{t('title')}</h1>
        <Masonry
          breakpointCols={breakpointColumns}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          <Card title={t('faq.1.title')}>
            <p>
              <Trans i18nKey="faq.1.content" ns="info" components={[<br />]} />
            </p>
          </Card>
          <div className={styles.map__container}>
            <div className={styles.map__container__inner}>
              <Map height="100%" />
            </div>
          </div>
          <Card title={t('faq.2.title')}>
            <p>
              <Trans i18nKey="faq.2.content" ns="info" components={[<br />]} />
            </p>
          </Card>
          <Card title={t('faq.3.title')}>
            <p>
              <Trans
                i18nKey="faq.3.content"
                ns="info"
                components={[<strong />, <br />]}
              />
            </p>
          </Card>
          <Card title={t('faq.4.title')}>
            <p>
              <Trans i18nKey="faq.4.content" ns="info" components={[<br />]} />
            </p>
          </Card>
          <TexturedImage src="/assets/random/terras.jpg" alt="Terras" />
          <Card title={t('faq.5.title')}>
            <p>{t('faq.5.content')}</p>
          </Card>
          <Card title={t('faq.6.title')}>
            <p>{t('faq.6.content')}</p>
          </Card>
          <Card title={t('faq.7.title')}>
            <p>
              <Trans
                i18nKey="faq.7.content"
                ns="info"
                components={[<strong />, <br />]}
              />
            </p>
          </Card>
          <TexturedImage src="/assets/random/petanque.jpg" alt="" />
          <Card title={t('faq.8.title')}>
            <p>
              <Trans
                i18nKey="faq.8.content"
                ns="info"
                components={[<br />, <strong />]}
              />
            </p>
            <div className={styles.buttons}>
              <Button
                as="a"
                {...(!signupDisabled && {
                  href: PETANQUE_LINK,
                  target: '_blank',
                  rel: 'noreferrer noopener',
                })}
                size="sm"
                disabled={signupDisabled}
                variant="primary"
                outlined
                iconRight={<ChevronRight />}
              >
                {t('faq.8.petanque')}
              </Button>
              <Button
                as="a"
                {...(!signupDisabled && {
                  href: PAELLA_LINK,
                  target: '_blank',
                  rel: 'noreferrer noopener',
                })}
                disabled={signupDisabled}
                variant="primary"
                outlined
                size="sm"
                iconRight={<ChevronRight />}
              >
                {t('faq.8.paella')}
              </Button>
            </div>
          </Card>
          <TexturedImage src="/assets/random/food.jpg" alt="A sausage" />
        </Masonry>
      </section>
    </>
  );
};

export default InfoPage;

InfoPage.Layout = Layout;
