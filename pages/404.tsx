import { Layout } from '@components/common';
import { Chevron } from '@components/icons';
import { Button } from '@components/ui';
import cn from 'classnames';

import styles from './styles/404.module.scss';

const Custom404 = () => {
  return (
    <div className={cn('container', styles.custom404, 'py-container')}>
      <h4>
        <span className={styles.colorized}>404</span> — Festival not found
      </h4>
      <div className={styles.grid}>
        <div className={styles.info}>
          <p>
            This page is still in construction. Please return tomorrow as the
            site is almost finished.
          </p>
          <Button variant="primary" as="a" href="/" iconRight={<Chevron />}>
            Return to homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Custom404;

Custom404.Layout = Layout;
