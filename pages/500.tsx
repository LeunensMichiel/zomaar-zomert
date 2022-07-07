import { Layout } from '@components/common';
import cn from 'classnames';

import styles from './styles/500.module.scss';

const Custom500Page = () => {
  return (
    <div className={cn('container', styles.custom500)}>
      <h4>Page not found</h4>
      <p>Return to homepage</p>
    </div>
  );
};

export default Custom500Page;

Custom500Page.Layout = Layout;
