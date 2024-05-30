import ChevronRight from '@components/icons/Chevron';
import { Button, Input, TextArea } from '@components/ui';
import cn from 'classnames';
import useTranslation from 'next-translate/useTranslation';
import { forwardRef, ReactNode, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import styles from './Form.module.scss';
import { Toast } from '../../ui/Toast/Toast';

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

type FormProps = {
  wrapperClassName?: string;
  children?: ReactNode;
};

const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ children, wrapperClassName, ...rest }, ref) => {
    const { t } = useTranslation('contact');
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
          body: encode(formName, {
            ...values,
          }),
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
        ref={ref}
        className={cn(styles.form, wrapperClassName)}
        name={formName}
        method="POST"
        data-netlify="true"
        onSubmit={handleSubmit(onSubmit)}
        netlify-honeypot="bot-field"
        {...rest}
      >
        <input type="hidden" name="form-name" value={formName} />
        <label style={{ display: 'none' }}>
          Don’t fill this out if you’re human:
          <input name="bot-field" />
        </label>
        <Input
          label={t('form.name.label')}
          type="text"
          placeholder={t('form.name.placeholder')}
          error={errors?.naam}
          {...register('naam', { required: t('form.name.error') })}
        />
        <Input
          label={t('form.email.label')}
          type="email"
          placeholder={t('form.email.placeholder')}
          error={errors?.email}
          {...register('email', {
            required: t('form.email.error'),
          })}
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
          error={errors?.onderwerp}
          placeholder={t('form.subject.placeholder')}
          {...register('onderwerp', {
            required: t('form.subject.error'),
          })}
        />
        <TextArea
          label={t('form.message.label')}
          placeholder={t('form.message.placeholder')}
          error={errors?.bericht}
          {...register('bericht', {
            required: t('form.message.error'),
          })}
        />
        <Button
          type="submit"
          size="lg"
          variant="primary"
          className={styles.form__button}
          iconRight={<ChevronRight />}
          loading={isSubmitting}
        >
          {t('form.button')}
        </Button>
        <Toast duration={5000} isShown={isSubmitted}>
          {t('form.success')}
        </Toast>
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';

export default Form;
