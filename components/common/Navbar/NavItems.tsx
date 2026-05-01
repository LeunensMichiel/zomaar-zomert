'use client';

import cn from 'classnames';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('common');
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
        <NavItem label={t('links.home')} href="/" />
        <NavItem label={t('links.line-up')} href="/line-up" />
        <NavItem label={t('links.info')} href="/info" />
        <motion.span
          initial={false}
          transition={{ delay: !navDrawerOpen ? 0 : 0.1 }}
          animate={navDrawerOpen ? { width: '100%' } : { width: 0 }}
          className={styles.line}
        />
        <NavItem label={t('links.contact')} href="/contact" />
        <NavItem label={t('links.history')} href="/history" />
        <NavItem label={t('links.partners')} href="/partners" />
      </div>
    </motion.div>
  );
};

export default NavItems;
