import { Fieldset } from '@components/common';
import { RadioButton } from '@components/ui';
import setLanguage from 'next-translate/setLanguage';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent } from 'react';

import i18nConfig from '../../../i18n.json';
import { LangCode } from './LanguagePicker';

const { locales } = i18nConfig;

export const LanguageSelectionModal = () => {
  const { t } = useTranslation('common');
  //   const [, setCookie] = useCookies([COOKIE_NAME]);

  const handleLangChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (LangCode[e.target.value]) {
      await setLanguage(e.target.value);
    }
  };
  return (
    <div style={{ padding: '2rem' }}>
      <Fieldset label={t('i18n.select')} withFeedback={false}>
        {locales?.map((lng) => (
          <RadioButton
            label={LangCode[lng]}
            onChange={handleLangChange}
            value={lng}
            key={lng}
            name="language"
            tabIndex={0}
          />
        ))}
      </Fieldset>
    </div>
  );
};
