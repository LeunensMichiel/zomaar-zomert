import { Layout } from '@components/common';
import Chevron from '@components/icons/Chevron';
import { Button } from '@components/ui';
import cn from 'classnames';
import Link from 'next/link';

import styles from './styles/500.module.scss';

const Custom500Page = () => {
  return (
    <div className={cn('container', styles.custom500, 'py-container')}>
      <h1>Something went wrong.</h1>
      <p>Please contact us so we can resolve this.</p>
      <Link passHref href="/">
        <Button variant="primary" as="a" iconRight={<Chevron />}>
          Return to homepage
        </Button>
      </Link>
    </div>
  );
};

export default Custom500Page;

Custom500Page.Layout = Layout;
