'use client';

import { TexturedImage } from '@components/common';
import ChevronRight from '@components/icons/Chevron';
import { Button, Card } from '@components/ui';
import Map from '@components/ui/Map';
import {
  ENABLE_LINKS_DATE,
  PAELLA_LINK,
  PETANQUE_LINK,
  ZZ_DATE_SUNDAY,
} from '@lib/models';
import { useTranslations } from 'next-intl';
import Masonry from 'react-masonry-css';

import styles from './InfoCards.module.scss';

const breakpointColumns = {
  default: 3,
  '1023': 2,
  '639': 1,
};

const InfoCards = () => {
  const t = useTranslations('info');
  const today = new Date();
  const signupDisabled =
    today < new Date(ENABLE_LINKS_DATE) || today > new Date(ZZ_DATE_SUNDAY);

  const richBr = { br: () => <br /> };
  const richStrongBr = {
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
    br: () => <br />,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      <Card title={t('faq.1.title')}>
        <p>{t.rich('faq.1.content', richBr)}</p>
      </Card>
      <div className={styles.map__container}>
        <div className={styles.map__container__inner}>
          <Map height="100%" />
        </div>
      </div>
      <Card title={t('faq.2.title')}>
        <p>{t.rich('faq.2.content', richBr)}</p>
      </Card>
      <Card title={t('faq.3.title')}>
        <p>{t.rich('faq.3.content', richStrongBr)}</p>
      </Card>
      <Card title={t('faq.4.title')}>
        <p>{t.rich('faq.4.content', richBr)}</p>
      </Card>
      <TexturedImage src="/assets/random/terras.jpg" alt="Terras" />
      <Card title={t('faq.5.title')}>
        <p>{t('faq.5.content')}</p>
      </Card>
      <Card title={t('faq.6.title')}>
        <p>{t('faq.6.content')}</p>
      </Card>
      <Card title={t('faq.7.title')}>
        <p>{t.rich('faq.7.content', richStrongBr)}</p>
      </Card>
      <TexturedImage src="/assets/random/petanque.jpg" alt="" />
      <Card title={t('faq.8.title')}>
        <p>{t.rich('faq.8.content', richStrongBr)}</p>
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
  );
};

export default InfoCards;
