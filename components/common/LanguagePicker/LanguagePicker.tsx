import { Globe } from '@components/icons';
import { Button } from '@components/ui';
import { useUI } from '@lib/hooks';
import useTranslation from 'next-translate/useTranslation';
import { CSSProperties, FC } from 'react';
import { ButtonVariant } from '../../ui/Button/Button';

export const LangCode: Record<string, string> = {
  nl: 'Nederlands',
  fr: 'Français',
  en: 'English',
};

type LanguagePickerProps = {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: CSSProperties;
  variant?: ButtonVariant;
  withText?: boolean;
};

export const LanguagePicker: FC<LanguagePickerProps> = ({
  size = 'xs',
  className,
  variant = 'transparent',
  withText = true,
  style,
}) => {
  const { t, lang } = useTranslation('common');
  const { openModal, setModalView } = useUI();

  const handleLanguageBtnClick = () => {
    setModalView('LANGUAGE_VIEW', t('i18n.select'));
    openModal();
  };

  return (
    <Button
      type="button"
      iconLeft={<Globe />}
      onClick={handleLanguageBtnClick}
      variant={variant}
      size={size}
      className={className}
      style={style}
    >
      {withText && LangCode[lang]}
    </Button>
  );
};
