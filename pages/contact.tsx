import { Form, Layout } from '@components/common';
import Map from '@components/ui/Map';
import cn from 'classnames';

import styles from './styles/contact.module.scss';

const ContactPage = () => {
  return (
    <>
      <section className={cn(styles.root, 'container py-container--sm')}>
        <div className={styles.map__container}>
          <Map height="100%" />
        </div>
        <Form />
      </section>
    </>
  );
};

export default ContactPage;

ContactPage.Layout = Layout;
