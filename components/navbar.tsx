'use client';

import { LanguagePicker } from '@components/language-picker';
import { MenuToggle } from '@components/menu-toggle';
import { Logo } from '@components/ui/logo';
import { Link, usePathname } from '@lib/i18n/navigation';
import { type AppPathname } from '@lib/i18n/routing';
import { cn } from '@lib/utils';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type NavbarProps = {
  isTransparent?: boolean;
};

type NavLink = {
  key: string;
  href: AppPathname;
};

const NAV_LINKS: NavLink[] = [
  { key: 'home', href: '/' },
  { key: 'line-up', href: '/line-up' },
  { key: 'info', href: '/info' },
];
const NAV_LINKS_BOTTOM: NavLink[] = [
  { key: 'contact', href: '/contact' },
  { key: 'history', href: '/history' },
  { key: 'partners', href: '/partners' },
];

function NavLink({ href, label }: { href: AppPathname; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      role="menuitem"
      className={cn(
        'font-display inline-flex items-center p-4 text-5xl leading-none font-bold text-gray-900 transition-colors outline-none hover:text-yellow-400 focus:text-yellow-400 md:text-7xl',
        isActive && 'text-pink-50'
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar({ isTransparent = false }: NavbarProps) {
  const pathname = usePathname();
  const t = useTranslations('common');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  return (
    <header
      className={cn(
        'top-0 left-0 z-50 w-full transition-colors',
        open ? 'fixed' : 'absolute',
        isTransparent && !open
          ? 'bg-transparent text-white'
          : 'bg-pink-50 text-gray-900'
      )}
    >
      <div className="container-wide">
        <nav className="py-3 lg:py-6">
          <div className="relative z-[10000] flex w-full items-center justify-between">
            <Logo
              className={cn(
                'h-10 w-auto md:h-14 lg:h-16',
                isTransparent || open ? 'text-white' : 'text-gray-900'
              )}
            />
            <div className="-mr-2 flex items-center gap-2">
              {open && (
                <LanguagePicker
                  size="lg"
                  variant="minimal-bright"
                  withText={false}
                />
              )}
              <MenuToggle
                open={open}
                transparent={isTransparent || open}
                onClick={() => setOpen((v) => !v)}
                aria-label="Menu"
              />
            </div>
          </div>
        </nav>
      </div>

      <div
        data-open={open ? '' : undefined}
        className={cn(
          'bg-brand-500 fixed inset-0 z-[5] overflow-y-auto pb-4',
          '[clip-path:circle(0%_at_-20%_50%)]',
          'transition-[clip-path] duration-[400ms]',
          '[transition-timing-function:cubic-bezier(0.22,0.61,0.36,1)]',
          'data-[open]:[clip-path:circle(150%_at_50%_50%)]'
        )}
      >
        <motion.div
          initial={false}
          layout
          className="relative mx-auto flex min-h-[calc(100%-7.5rem)] w-full max-w-screen-lg flex-col justify-center px-4 pt-30"
        >
          {NAV_LINKS.map((l) => (
            <NavLink key={l.key} href={l.href} label={t(`links.${l.key}`)} />
          ))}
          <motion.span
            initial={false}
            transition={{ delay: !open ? 0 : 0.1 }}
            animate={open ? { width: '100%' } : { width: 0 }}
            className="bg-brand-700 my-4 block h-0.5"
          />
          {NAV_LINKS_BOTTOM.map((l) => (
            <NavLink key={l.key} href={l.href} label={t(`links.${l.key}`)} />
          ))}
        </motion.div>
      </div>
    </header>
  );
}
