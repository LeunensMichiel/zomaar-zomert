import { FC, ReactNode } from 'react';

import styles from './Card.module.scss';

type Props = {
  title: string;
  children?: ReactNode;
};
export const Card: FC<Props> = ({ title, children }) => {
  return (
    <div className={styles.root}>
      <span className={styles.title}>{title}</span>
      <div className={styles.body}>{children}</div>
    </div>
  );
};
