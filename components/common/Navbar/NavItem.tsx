'use client';

import { Dropdown } from '@components/ui';
import { Link, usePathname } from '@lib/i18n/navigation';
import type { AppPathname } from '@lib/i18n/routing';
import cn from 'classnames';
import { FC, LiHTMLAttributes, ReactNode, useEffect, useState } from 'react';

import styles from './NavItem.module.scss';

type NavItemProps = {
  label: string;
  href?: AppPathname;
  children?: ReactNode;
} & Omit<LiHTMLAttributes<HTMLLIElement>, 'children'>;

const NavItem: FC<NavItemProps> = ({ children, label, href }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {!children && href ? (
        <Link
          href={href}
          role="menuitem"
          className={cn(styles.navItemContainer, styles.linkContainer, {
            [styles.activeLink]: pathname === href,
          })}
        >
          {label}
        </Link>
      ) : (
        <Dropdown
          label={label}
          role="menu"
          willFloat
          willOpenOnHover
          startOpen={open}
          buttonClassName={cn(styles.subMenuButton, 'parentSubMenuButton')}
          listClassName={styles.subMenuList}
          containerOpenClassName={styles.subMenuOpen}
          containerClassName={cn(
            styles.navItemContainer,
            styles.subMenuContainer
          )}
        >
          {children}
        </Dropdown>
      )}
    </>
  );
};

export default NavItem;
