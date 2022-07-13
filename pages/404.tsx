import { Layout } from '@components/common';
import { Chevron } from '@components/icons';
import { Button } from '@components/ui';
import cn from 'classnames';
import Link from 'next/link';

import styles from './styles/404.module.scss';

const Custom404 = () => {
  return (
    <div className={cn('container', styles.custom404, 'py-container')}>
      <h1>
        <span className={styles.colorized}>404</span> — Festival not found
      </h1>
      <div className={styles.grid}>
        <div className={styles.info}>
          <p>
            Looks like you entered a page that does not exist. Please contact us
            if this should not be the case.
          </p>
          <Link passHref href="/">
            <Button variant="primary" as="a" iconRight={<Chevron />}>
              Return to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Custom404;

Custom404.Layout = Layout;
