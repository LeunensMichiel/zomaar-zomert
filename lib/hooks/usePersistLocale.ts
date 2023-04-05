import { useRouter } from 'next/router';
import { useEffect } from 'react';

const COOKIE_NAME = 'NEXT_LOCALE';

export function usePersistLocaleCookie() {
  const { locale } = useRouter();

  useEffect(persistLocaleCookie, [locale]);

  function persistLocaleCookie() {
    if (locale) {
      const date = new Date();
      const expireMs = 100 * 24 * 60 * 60 * 1000; // 100 days
      date.setTime(date.getTime() + expireMs);
      document.cookie = `${COOKIE_NAME}=${locale};expires=${date.toUTCString()};path=/`;
    }
  }
}
