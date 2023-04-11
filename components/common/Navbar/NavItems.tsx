import cn from 'classnames';
import { motion } from 'framer-motion';
import useTranslation from 'next-translate/useTranslation';
import { FC } from 'react';

import NavItem from './NavItem';
import styles from './NavItems.module.scss';

type NavItemsProps = {
  navDrawerOpen?: boolean;
  isTransparent?: boolean;
};

const NavItems: FC<NavItemsProps> = ({
  navDrawerOpen = false,
  isTransparent = false,
}) => {
  const { t } = useTranslation('common');
  return (
    <motion.div
      initial={false}
      layout
      className={cn(styles.navMenuContainer, {
        [styles.navContainerOpen]: navDrawerOpen,
        [styles.navigationTransparent]: isTransparent,
      })}
    >
      <div className={cn(styles.navMenuList)}>
        <NavItem label={t('links.home')} link={{ href: '/' }} />
        <NavItem label={t('links.line-up')} link={{ href: '/line-up' }} />
        <NavItem label={t('links.info')} link={{ href: '/info' }} />
        <NavItem label={t('links.contact')} link={{ href: '/contact' }} />
      </div>
    </motion.div>
  );
};

export default NavItems;
