// import { Globe } from '@components/icons';
import { Button } from '@components/ui';
import { useUI } from '@lib/hooks';
import useTranslation from 'next-translate/useTranslation';
import { FC } from 'react';

export const LangCode: Record<string, string> = {
  nl: 'Nederlands',
  fr: 'Français',
  en: 'English',
};

type LanguagePickerProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  outlined?: boolean;
};

export const LanguagePicker: FC<LanguagePickerProps> = ({ size = 'xs' }) => {
  const { t, lang } = useTranslation('common');
  const { openModal, setModalView } = useUI();

  const handleLanguageBtnClick = () => {
    setModalView('LANGUAGE_VIEW', t('i18n.select'));
    openModal();
  };

  return (
    <Button
      type="button"
      //   iconLeft={<Globe />}
      onClick={handleLanguageBtnClick}
      variant="transparent"
      size={size}
    >
      {LangCode[lang]}
    </Button>
  );
};
