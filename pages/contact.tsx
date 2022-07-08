import { Layout } from '@components/common';
import Map from '@components/ui/Map';

import styles from './styles/contact.module.scss';

const ContactPage = () => {
  return (
    <div className={styles.map__container}>
      <Map height="100%" />
    </div>
  );
};

export default ContactPage;

ContactPage.Layout = Layout;
