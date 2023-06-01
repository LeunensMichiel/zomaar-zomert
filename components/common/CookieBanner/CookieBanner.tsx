/* eslint-disable react/jsx-key */
import { Button } from '@components/ui';
import Link from 'next/link';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { consent } from 'nextjs-google-analytics';
import { useEffect, useState } from 'react';

import styles from './CookieBanner.module.scss';
import { getLocalStorage, setLocalStorage } from './storagehelper';

export type CONSENT = 'granted' | 'denied' | 'pending';

export default function CookieBanner() {
  const { t } = useTranslation('common');
  const [cookieConsent, setCookieConsent] = useState<CONSENT>('pending');

  useEffect(() => {
    const storedCookieConsent: CONSENT = getLocalStorage(
      'cookie_consent',
      'pending'
    );

    setCookieConsent(storedCookieConsent);
  }, [setCookieConsent]);

  useEffect(() => {
    if (cookieConsent === 'pending') return;

    consent({
      arg: 'update',
      params: {
        ad_storage: cookieConsent,
        analytics_storage: cookieConsent,
      },
    });

    setLocalStorage('cookie_consent', cookieConsent);
  }, [cookieConsent]);

  if (cookieConsent !== 'pending') {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.info}>
        <div className={styles.title}>{t('cookies.title')}</div>
        <div className={styles.text}>
          <Trans
            i18nKey="cookies.text"
            ns="common"
            components={[<strong />, <br />, <Link href="/privacy-policy" />]}
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <Button
          onClick={() => setCookieConsent('denied')}
          size="xs"
          variant="minimal-dark"
        >
          {t('cookies.deny')}
        </Button>
        <Button
          onClick={() => setCookieConsent('granted')}
          size="xs"
          variant="primary"
        >
          {t('cookies.consent')}
        </Button>
      </div>
    </div>
  );
}
