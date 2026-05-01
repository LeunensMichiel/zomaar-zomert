'use client';

import { Fieldset } from '@components/common';
import { RadioButton } from '@components/ui';
import { usePathname, useRouter } from '@lib/i18n/navigation';
import { routing } from '@lib/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { ChangeEvent, useTransition } from 'react';

import { LangCode } from './LanguagePicker';
import styles from './LanguageSelectionModal.module.scss';

export const LanguageSelectionModal = () => {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value as (typeof routing.locales)[number];
    if (!LangCode[next] || next === currentLocale) return;

    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div className={styles.root}>
      <Fieldset label={t('i18n.select')} withFeedback={false}>
        {routing.locales.map((lng) => (
          <RadioButton
            label={LangCode[lng]}
            onChange={handleLangChange}
            value={lng}
            defaultChecked={lng === currentLocale}
            disabled={isPending}
            key={lng}
            name="language"
            tabIndex={0}
          />
        ))}
      </Fieldset>
    </div>
  );
};
