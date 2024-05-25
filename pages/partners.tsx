import { Layout } from '@components/common';

import cn from 'classnames';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';

import partners from '../public/partners.json';

import styles from './styles/partners.module.scss';
import { Variants, motion } from 'framer-motion';

const cardVariants: Variants = {
  offscreen: {
    y: 30,
  },
  onscreen: {
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

const PartnerPage = () => {
  const { t } = useTranslation('partners');
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
        <h1 className={'header'}>{t('main.header')}</h1>
        <p className={'paragraph'}>{t('main.paragraph')}</p>
        <motion.div className={styles.partners__grid}>
          {partners
            .sort(
              (a, b) => a.formula - b.formula || a.name.localeCompare(b.name)
            )
            .filter((p) => !p.disabled)
            .map((p) => (
              <motion.a
                className={styles['partiners__grid-item']}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0 }}
                variants={cardVariants}
                key={p.name}
                {...(p.site && {
                  href: p.site,
                  target: '_blank',
                  rel: 'noreferrer noopener',
                })}
              >
                {!!p.logoWhite ? (
                  <img src={p.logoWhite} alt={p.name} />
                ) : (
                  <span>{p.name}</span>
                )}
              </motion.a>
            ))}
        </motion.div>
      </section>
    </>
  );
};

export default PartnerPage;

PartnerPage.Layout = Layout;
