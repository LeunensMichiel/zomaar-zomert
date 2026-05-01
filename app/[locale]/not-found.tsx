import { Chevron } from '@components/icons';
import { Button } from '@components/ui';
import { Link } from '@lib/i18n/navigation';
import cn from 'classnames';

import styles from './not-found.module.scss';

export default function NotFound() {
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
          <Link href="/">
            <Button variant="primary" as="span" iconRight={<Chevron />}>
              Return to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
