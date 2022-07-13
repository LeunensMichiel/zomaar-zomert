import { Form, Layout } from '@components/common';
import Map from '@components/ui/Map';
import cn from 'classnames';
import { NextSeo } from 'next-seo';

import styles from './styles/contact.module.scss';

const ContactPage = () => {
  return (
    <>
      <NextSeo
        title="Contact"
        description="Contact the Zomaar Zomert Crew. We try to respond within a day. We're also available through our socials on Facebook and Instagram."
        openGraph={{
          title: 'Contact',
          description:
            "Contact the Zomaar Zomert Crew. We try to respond within a day. We're also available through our socials on Facebook and Instagram.",
        }}
      />
      <section className={cn('container py-container--sm')}>
        <h1 className={'header'}>Contact us</h1>
        <div className={styles.root}>
          <Form />
          <div className={styles.map__container}>
            <Map height="100%" />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;

ContactPage.Layout = Layout;
