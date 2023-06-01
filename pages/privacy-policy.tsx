import { Layout } from '@components/common';
import cn from 'classnames';
import { NextSeo } from 'next-seo';
import useTranslation from 'next-translate/useTranslation';

import styles from './styles/about.module.scss';

const PrivacyPage = () => {
  const { t } = useTranslation('privacy');
  return (
    <>
      <NextSeo title={t('title')} />
      <section className={cn('container-page py-container--sm', styles.root)}>
        <h1 className={'header'}>{t('title')}</h1>
        <p style={{ fontWeight: 400 }}>{t('block1')}</p>
        <p style={{ fontWeight: 400, marginTop: '1rem' }}>{t('block2')}</p>
        <p style={{ fontWeight: 400, marginTop: '1rem' }}>{t('block3')}</p>
        <p style={{ fontWeight: 400, marginTop: '1rem' }}>{t('block4')}</p>
        <p style={{ fontWeight: 400, marginTop: '1rem' }}>{t('block5')}</p>
      </section>
    </>
  );
};

export default PrivacyPage;

PrivacyPage.Layout = Layout;
