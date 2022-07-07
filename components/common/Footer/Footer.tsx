import Link from 'next/link';
import { VFC } from 'react';

import styles from './Footer.module.scss';

const Footer: VFC = () => {
  return <footer className={styles.footer}></footer>;
};

export default Footer;
