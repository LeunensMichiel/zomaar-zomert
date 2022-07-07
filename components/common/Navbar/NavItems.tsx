import cn from 'classnames';
import { motion } from 'framer-motion';
import { VFC } from 'react';

import NavItem from './NavItem';
import styles from './NavItems.module.scss';

type NavItemsProps = {
  navDrawerOpen?: boolean;
  isTransparent?: boolean;
};

const NavItems: VFC<NavItemsProps> = ({
  navDrawerOpen = false,
  isTransparent = false,
}) => (
  <motion.div
    initial={false}
    layout
    className={cn(styles.navMenuContainer, {
      [styles.navContainerOpen]: navDrawerOpen,
      [styles.navigationTransparent]: isTransparent,
    })}
  >
    <div className={cn(styles.navMenuList)}>
      <NavItem label="Home" link={{ href: '/' }} />
      <NavItem label="Line-Up" link={{ href: '/line-up' }} />
      <NavItem label="Info" link={{ href: '/info' }} />
      <NavItem label="Contact" link={{ href: '/contact' }} />
    </div>
  </motion.div>
);

export default NavItems;
