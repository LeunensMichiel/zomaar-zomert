import cn from 'classnames';
import { motion } from 'framer-motion';
import { MouseEventHandler, VFC } from 'react';

import styles from './MenuButton.module.scss';

type MenuButtonProps = {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  navBarOpen?: boolean;
  navBarTransparent?: boolean;
};

const MenuButton: VFC<MenuButtonProps> = ({
  onClick,
  className,
  navBarOpen,
  navBarTransparent,
}) => (
  <motion.button
    initial={false}
    animate={navBarOpen ? 'open' : 'closed'}
    onClick={onClick}
    className={cn(styles.root, {
      [styles.navBarTransparent]: navBarTransparent,
    })}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
      <motion.path
        variants={{
          closed: { d: 'M3 12, L21 12' },
          open: { d: 'M6 6, L18 18' },
        }}
        // <line x1="3" y1="12" x2="21" y2="12" />
        // <line x1="3" y1="6" x2="21" y2="6" />
        // <line x1="3" y1="18" x2="21" y2="18" />
        fill="transparent"
        strokeWidth="2"
        stroke="currentColor"
      />
      <motion.path
        d="M3 6, L21 6"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
        fill="transparent"
        strokeWidth="2"
        stroke="currentColor"
      />
      <motion.path
        variants={{
          closed: { d: 'M3 18, L21 18' },
          open: { d: 'M6 18, L18 6' },
        }}
        fill="transparent"
        strokeWidth="2"
        stroke="currentColor"
      />
    </svg>
  </motion.button>
);

export default MenuButton;
