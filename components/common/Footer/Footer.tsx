import { Facebook, Instagram, Youtube } from '@components/icons';
import { ZZ_DATES } from '@lib/models';
import cn from 'classnames';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { FC } from 'react';

import partners from '../../../public/partners.json';
import { LanguagePicker } from '../LanguagePicker/LanguagePicker';
import styles from './Footer.module.scss';

const variants = {
  initial: {
    y: 0,
    transition: {
      duration: 0.3,
      type: 'spring',
    },
  },
  tap: {
    y: 4,
    transition: {
      duration: 0.3,
      type: 'spring',
    },
  },
  hover: {
    y: -2,
    color: 'var(--color-yellow-2)',
    transition: {
      duration: 0.3,
      type: 'spring',
    },
  },
};

const Footer: FC = () => {
  const { t, lang } = useTranslation();
  return (
    <>
      <div className={styles.socials}>
        <div className={styles.social__items}>
          <div className={styles.social__items__inner}>
            <motion.a
              href="https://facebook.com/zomaarzomert"
              target="_blank"
              rel="noreferrer noopener"
              className={styles.social__item}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              variants={variants}
            >
              <Facebook />
            </motion.a>
            <motion.a
              href="https://www.instagram.com/zomaarzomert/"
              target="_blank"
              rel="noreferrer noopener"
              className={styles.social__item}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              variants={variants}
            >
              <Instagram />
            </motion.a>
            <motion.a
              href="https://www.youtube.com/watch?v=G2s9r_BohUE"
              target="_blank"
              rel="noreferrer noopener"
              className={styles.social__item}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              variants={variants}
            >
              <Youtube />
            </motion.a>
          </div>
          <img
            src="/assets/tear-5.svg"
            alt="paper tear"
            className={cn('tear', 'tear--top')}
          />
          <img
            src="/assets/tear-6.svg"
            alt="paper tear"
            className={cn('tear', 'tear--bottom')}
          />
        </div>
      </div>
      <footer className={cn(styles.footer, 'py-container--sm')}>
        <div className={cn(styles.footer__nav, 'container')}>
          <div className={styles.footer__block}>
            <span className={styles.footer__block__title}>
              {t('footer.line-up.title')}
            </span>
            <Link
              href={{
                pathname: '/line-up',
                query: {
                  date: ZZ_DATES[0],
                },
              }}
              passHref
              className={styles.footer__block__link}
            >
              {new Date(ZZ_DATES[0]).toLocaleString(lang, {
                weekday: 'long',
              })}
            </Link>
            <Link
              href={{
                pathname: '/line-up',
                query: {
                  date: ZZ_DATES[1],
                },
              }}
              passHref
              className={styles.footer__block__link}
            >
              {new Date(ZZ_DATES[1]).toLocaleString(lang, {
                weekday: 'long',
              })}
            </Link>
            <Link
              href={{
                pathname: '/line-up',
                query: {
                  date: ZZ_DATES[2],
                },
              }}
              passHref
              className={styles.footer__block__link}
            >
              {new Date(ZZ_DATES[2]).toLocaleString(lang, {
                weekday: 'long',
              })}
            </Link>
          </div>
          <div className={styles.footer__block}>
            <span className={styles.footer__block__title}>
              {t('footer.info.title')}
            </span>
            {/* <Link href="/news" passHref className={styles.footer__block__link}>
              {t('links.news')}
            </Link> */}
            <Link
              href="/history"
              passHref
              className={styles.footer__block__link}
            >
              {t('links.history')}
            </Link>
            <Link
              href="/partners"
              passHref
              className={styles.footer__block__link}
            >
              {t('links.partners')}
            </Link>
            <Link href="/menu" passHref className={styles.footer__block__link}>
              {t('links.menu')}
            </Link>
            <Link
              href="/privacy-policy"
              passHref
              className={styles.footer__block__link}
            >
              {t('links.legal')}
            </Link>
          </div>
          <div className={styles.footer__block}>
            <span className={styles.footer__block__title}>
              {t('footer.contact.title')}
            </span>
            <Link href="/info" passHref className={styles.footer__block__link}>
              {t('footer.contact.activities')}
            </Link>
            <Link
              href="/contact"
              passHref
              className={styles.footer__block__link}
            >
              {t('footer.contact.contact')}
            </Link>

            <div className={styles.contact__person__block}>
              <span>info@zomaarzomert.be</span>
              <span>Plankenstraat 23, Itterbeek</span>
            </div>
          </div>
        </div>
        <div className={cn(styles.partners, 'container')}>
          {partners
            .sort(
              (a, b) => a.formula - b.formula || a.name.localeCompare(b.name)
            )
            .filter((p) => !p.disabled)
            .map((p) => (
              <a
                className={classNames({
                  [styles.scale_down]: p.logoSize === 'sm',
                  [styles.scale_up]: p.logoSize === 'lg',
                  [styles.scale_up__xl]: p.logoSize === 'xl',
                })}
                key={p.name}
                {...(p.site && {
                  href: p.site,
                  target: '_blank',
                  rel: 'noreferrer noopener',
                })}
              >
                {p.logoWhite ? (
                  <img src={p.logoWhite} alt={p.name} />
                ) : (
                  <span>{p.name}</span>
                )}
              </a>
            ))}
        </div>
        <div className={cn('container', styles.footer__bottom)}>
          <LanguagePicker />
          <span className={cn(styles.copy)}>
            ©{new Date().getFullYear()}{' '}
            <Trans
              i18nKey="footer.copy"
              ns="common"
              components={[
                <a
                  key="michiel leunens"
                  href="https://leunesmedia.netlify.app/"
                  target="_blank"
                  rel="noreferrer noopener"
                />,
                <a
                  key="lars puttaert"
                  href="https://www.linkedin.com/in/lars-puttaert/"
                  target="_blank"
                  rel="noreferrer noopener"
                />,
              ]}
            />
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
