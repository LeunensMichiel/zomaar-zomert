import ChevronRight from '@components/icons/Chevron';
import { Button, Input, TextArea } from '@components/ui';
import cn from 'classnames';
import {
  ComponentPropsWithRef,
  FC,
  forwardRef,
  useCallback,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';

import styles from './Form.module.scss';

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
};

const Form: FC<ComponentPropsWithRef<'form'> & FormProps> = forwardRef<
  HTMLFormElement,
  FormProps
>(({ children, wrapperClassName, ...rest }, ref) => {
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
        label="Name*"
        type="text"
        placeholder="Enter your name"
        error={errors?.naam}
        {...register('naam', { required: 'Please fill out your full name.' })}
      />
      <Input
        label="Email*"
        type="email"
        placeholder="So we can contact you"
        error={errors?.email}
        {...register('email', {
          required: 'Please fill out your email address.',
        })}
      />
      <Input
        label="Phone"
        type="tel"
        placeholder="+32 4XX XX XX XX"
        {...register('telefoon')}
      />
      <Input
        label="Subject*"
        type="text"
        error={errors?.onderwerp}
        placeholder="Subject of your message/email"
        {...register('onderwerp', {
          required: 'Please tell us why you want to contact us.',
        })}
      />
      <TextArea
        label="Message*"
        placeholder="Let's get in touch!"
        error={errors?.bericht}
        {...register('bericht', {
          required: 'An email should not be empty.',
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
        Send Message
      </Button>
      <p className={styles['message-received']}>
        {isSubmitted && `Message sent! We'll get in touch as soon as possible.`}
      </p>
      {children}
    </form>
  );
});

Form.displayName = 'Form';

export default Form;
