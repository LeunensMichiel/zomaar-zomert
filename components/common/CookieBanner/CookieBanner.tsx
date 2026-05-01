'use client';

import { Button } from '@components/ui';
import { Link } from '@lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

import styles from './CookieBanner.module.scss';
import { getLocalStorage, setLocalStorage } from './storagehelper';

export type CONSENT = 'granted' | 'denied' | 'pending';

type DataLayerWindow = Window & {
  dataLayer?: unknown[];
};

export const updateGoogleConsent = (newConsent: 'granted' | 'denied') => {
  if (typeof window === 'undefined') return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push('consent', 'update', {
    ad_storage: newConsent,
    analytics_storage: newConsent,
  });
};

export default function CookieBanner() {
  const t = useTranslations('common');
  const [cookieConsent, setCookieConsent] = useState<CONSENT | undefined>(
    undefined
  );

  const handleConsent = useCallback((newConsent: CONSENT) => {
    if (newConsent === 'pending') return;

    updateGoogleConsent(newConsent);

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
          {t.rich('cookies.text', {
            strong: (chunks) => <strong>{chunks}</strong>,
            br: () => <br />,
            policy: (chunks) => <Link href="/privacy-policy">{chunks}</Link>,
          })}
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

export { CookieBanner };
