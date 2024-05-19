import { Button } from '@components/ui';
import Link from 'next/link';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { consent } from 'nextjs-google-analytics';
import { useCallback, useEffect, useState } from 'react';

import styles from './CookieBanner.module.scss';
import { getLocalStorage, setLocalStorage } from './storagehelper';

export type CONSENT = 'granted' | 'denied' | 'pending';

export default function CookieBanner() {
  const { t } = useTranslation('common');
  const [cookieConsent, setCookieConsent] = useState<CONSENT | undefined>(
    undefined
  );

  const handleConsent = useCallback((newConsent: CONSENT) => {
    if (newConsent === 'pending') return;

    consent({
      arg: 'update',
      params: {
        ad_storage: newConsent,
        analytics_storage: newConsent,
      },
    });

    setCookieConsent(newConsent);
    setLocalStorage('cookie_consent', newConsent);
  }, []);

  useEffect(() => {
    const storedCookieConsent = getLocalStorage<CONSENT>(
      'cookie_consent',
      'pending'
    );

    setCookieConsent(storedCookieConsent);
  }, [setCookieConsent]);

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
          onClick={() => handleConsent('denied')}
          size="xs"
          variant="minimal-dark"
        >
          {t('cookies.deny')}
        </Button>
        <Button
          onClick={() => handleConsent('granted')}
          size="xs"
          variant="primary"
        >
          {t('cookies.consent')}
        </Button>
      </div>
    </div>
  );
}
