'use client';

import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import { Toast } from '@components/ui/toast';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  naam: string;
  email: string;
  telefoon?: string;
  onderwerp: string;
  bericht: string;
};

function encode(formName: string, values: FormValues) {
  return Object.keys(values)
    .map(
      (key) =>
        encodeURIComponent(key) +
        '=' +
        encodeURIComponent(
          values?.[key as keyof FormValues] ?? 'Niet opgegeven'
        )
    )
    .join('&')
    .concat(`&form-name=${formName}`);
}

export function Form() {
  const t = useTranslations('contact');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formName = 'contactformulier';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = useCallback((values: FormValues) => {
    try {
      setIsSubmitted(false);
      setIsSubmitting(true);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(formName, { ...values }),
      }).catch((error) => console.error(error));
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <form
      className="grid items-start gap-4"
      name={formName}
      method="POST"
      data-netlify="true"
      onSubmit={handleSubmit(onSubmit)}
      {...{ 'netlify-honeypot': 'bot-field' }}
    >
      <input type="hidden" name="form-name" value={formName} />
      <label className="hidden">
        Don&apos;t fill this out if you&apos;re human:
        <input name="bot-field" />
      </label>
      <Input
        label={t('form.name.label')}
        type="text"
        placeholder={t('form.name.placeholder')}
        error={errors.naam}
        {...register('naam', { required: t('form.name.error') })}
      />
      <Input
        label={t('form.email.label')}
        type="email"
        placeholder={t('form.email.placeholder')}
        error={errors.email}
        {...register('email', { required: t('form.email.error') })}
      />
      <Input
        label={t('form.phone.label')}
        type="tel"
        placeholder="+32 4XX XX XX XX"
        {...register('telefoon')}
      />
      <Input
        label={t('form.subject.label')}
        type="text"
        placeholder={t('form.subject.placeholder')}
        error={errors.onderwerp}
        {...register('onderwerp', { required: t('form.subject.error') })}
      />
      <Textarea
        label={t('form.message.label')}
        placeholder={t('form.message.placeholder')}
        error={errors.bericht}
        {...register('bericht', { required: t('form.message.error') })}
      />
      <Button
        type="submit"
        size="lg"
        variant="primary"
        iconRight={<ChevronRight className="h-6 w-6" />}
        loading={isSubmitting}
        className="md:justify-self-start"
      >
        {t('form.button')}
      </Button>
      <Toast duration={5000} isShown={isSubmitted}>
        {t('form.success')}
      </Toast>
    </form>
  );
}
