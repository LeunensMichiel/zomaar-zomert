'use client';

import { Button, type ButtonProps } from '@components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@components/ui/dialog';
import { Fieldset } from '@components/ui/fieldset';
import { Radio } from '@components/ui/radio-group';
import { usePathname, useRouter } from '@lib/i18n/navigation';
import { routing } from '@lib/i18n/routing';
import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { type ChangeEvent, useState, useTransition } from 'react';

export const LangCode: Record<string, string> = {
  nl: 'Nederlands',
  fr: 'Français',
  en: 'English',
};

type LanguagePickerProps = {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  className?: string;
  withText?: boolean;
};

export function LanguagePicker({
  size = 'xs',
  variant = 'transparent',
  className,
  withText = true,
}: LanguagePickerProps) {
  const t = useTranslations('common');
  const lang = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value as (typeof routing.locales)[number];
    if (!LangCode[next] || next === lang) return;

    startTransition(() => {
      router.replace(pathname, { locale: next });
      setOpen(false);
    });
  };

  return (
    <>
      <Button
        type="button"
        iconLeft={<Globe className="h-4 w-4" />}
        onClick={() => {
          setOpen(true);
        }}
        variant={variant}
        size={size}
        className={className}
      >
        {withText && LangCode[lang]}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="inset-x-4 inset-y-12 max-w-[600px] bg-yellow-200 p-8 pt-16">
          <DialogTitle className="sr-only">{t('i18n.select')}</DialogTitle>
          <Fieldset label={t('i18n.select')} withFeedback={false}>
            {routing.locales.map((lng) => (
              <Radio
                key={lng}
                label={LangCode[lng]}
                onChange={handleLangChange}
                value={lng}
                defaultChecked={lng === lang}
                disabled={isPending}
                name="language"
                tabIndex={0}
              />
            ))}
          </Fieldset>
        </DialogContent>
      </Dialog>
    </>
  );
}
