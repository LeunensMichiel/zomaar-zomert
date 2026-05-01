'use client';

import { Logo } from '@components/ui';
import { usePathname } from '@lib/i18n/navigation';
import cn from 'classnames';
import { FC, ReactNode, useEffect, useState } from 'react';
import { RemoveScroll } from 'react-remove-scroll';

import { MenuButton } from '../IconButtons';
import { LanguagePicker } from '../LanguagePicker/LanguagePicker';
import styles from './Navbar.module.scss';
import NavItems from './NavItems';

type NavbarProps = {
  isTransparent?: boolean;
  children?: ReactNode;
};

const Navbar: FC<NavbarProps> = ({ children, isTransparent = false }) => {
  const pathname = usePathname();
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  useEffect(() => {
    setNavDrawerOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(styles.header, {
        [styles.headerTransparent]: isTransparent,
        [styles.navContainerOpen]: navDrawerOpen,
      })}
    >
      {children}
      <RemoveScroll enabled={navDrawerOpen}>
        <div className={cn(styles.headerContainer, 'container')}>
          <nav
            className={cn(styles.navigation, {
              [styles.navigationTransparent]: isTransparent,
            })}
          >
            <div className={cn(styles.toolbar)}>
              <Logo className={styles.logo} />
              <NavItems
                isTransparent={isTransparent}
                navDrawerOpen={navDrawerOpen}
              />
              <div className={cn(styles.toolbarIcons)}>
                {navDrawerOpen && (
                  <LanguagePicker
                    size="lg"
                    variant="minimal-bright"
                    withText={false}
                  />
                )}
                <MenuButton
                  navBarTransparent={isTransparent ? true : navDrawerOpen}
                  navBarOpen={navDrawerOpen}
                  onClick={() =>
                    setNavDrawerOpen((prevNavDrawerOpen) => !prevNavDrawerOpen)
                  }
                />
              </div>
            </div>
          </nav>
        </div>
      </RemoveScroll>
    </header>
  );
};

export default Navbar;
