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
        <motion.span
          initial={false}
          transition={{ delay: !navDrawerOpen ? 0 : 0.1 }}
          animate={navDrawerOpen ? { width: '100%' } : { width: 0 }}
          className={styles.line}
        />
        <NavItem label={t('links.contact')} link={{ href: '/contact' }} />
        <NavItem label={t('links.history')} link={{ href: '/history' }} />
        <NavItem label={t('links.partners')} link={{ href: '/partners' }} />
      </div>
    </motion.div>
  );
};

export default NavItems;
