import { Facebook, Instagram, Youtube } from '@components/icons';
import cn from 'classnames';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { FC } from 'react';

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
                  date: '2023-07-28',
                },
              }}
              passHref
              className={styles.footer__block__link}
            >
              {new Date('2023-07-28').toLocaleString(lang, {
                weekday: 'long',
              })}
            </Link>
            <Link
              href={{
                pathname: '/line-up',
                query: {
                  date: '2023-07-29',
                },
              }}
              passHref
              className={styles.footer__block__link}
            >
              {new Date('2023-07-29').toLocaleString(lang, {
                weekday: 'long',
              })}
            </Link>
            <Link
              href={{
                pathname: '/line-up',
                query: {
                  date: '2023-07-30',
                },
              }}
              passHref
              className={styles.footer__block__link}
            >
              {new Date('2023-07-30').toLocaleString(lang, {
                weekday: 'long',
              })}
            </Link>
          </div>
          <div className={styles.footer__block}>
            <span className={styles.footer__block__title}>
              {t('footer.info.title')}
            </span>
            <Link href="/news" passHref className={styles.footer__block__link}>
              {t('links.news')}
            </Link>
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
          </div>
        </div>
        <div className={cn(styles.partners, 'container')}>
          <img src="/assets/sponsors/pepsi-max-white.svg" alt="pepsi-max" />
          <img
            src="/assets/sponsors/nationale-loterij--white.svg"
            alt="nationale-loterij"
          />
          <img src="/assets/sponsors/crokaert-white.svg" alt="crokaert" />
          <img src="/assets/sponsors/sound&co--white.svg" alt="sound&co" />
          <img src="/assets/sponsors/megavolt-white.svg" alt="megavolt" />
          <img
            src="/assets/sponsors/limbourg--white.svg"
            alt="limbourg"
            className={styles.scale_up}
          />
          <img src="/assets/sponsors/eagleair-white.svg" alt="eagle air" />
          <img src="/assets/sponsors/callebaut-white.svg" alt="callebaut" />
          <img
            className={styles.scale_down}
            src="/assets/sponsors/dilbeek-white.svg"
            alt="dilbeek"
          />
          <img src="/assets/sponsors/edr-white.svg" alt="edr" />
          <img
            className={styles.scale_up__xl}
            src="/assets/sponsors/moens-white.svg"
            alt="moens"
          />
          <img
            src="/assets/sponsors/timmermans-text-white.svg"
            alt="timmermans"
          />
          <img src="/assets/sponsors/allur--white.svg" alt="allur vastgoed" />
          <img src="/assets/sponsors/wynant-white.svg" alt="wynant" />
          <img
            src="/assets/sponsors/lammens-white.svg"
            alt="lammens"
            className={styles.scale_up}
          />
          <img
            src="/assets/sponsors/itterplastiek-white.svg"
            alt="itterplastiek"
            className={styles.scale_up}
          />
          <img
            src="/assets/sponsors/cameleon-white.svg"
            alt="cameleon"
            className={styles.scale_up}
          />
          <img
            src="/assets/sponsors/optiek-trap-white.svg"
            alt="optiek-trap"
            className={styles.scale_up}
          />
          <img src="/assets/sponsors/spanuit-white.svg" alt="spanuit" />
          <img src="/assets/sponsors/argenta--white.svg" alt="argenta" />
          <img src="/assets/sponsors/fierens--white.svg" alt="fierens" />
          <img
            src="/assets/sponsors/erasmus--white.svg"
            alt="erasmus hogeschool"
          />
          <img src="/assets/sponsors/erkermann-white.svg" alt="ekkermann" />
          <img src="/assets/sponsors/thesora-white.svg" alt="thesora" />
          <img
            src="/assets/sponsors/sint-anna--white.svg"
            alt="cafe-sint-anna"
            className={styles.scale_down}
          />
          <img
            src="/assets/sponsors/hof-te-berchemveld.svg"
            alt="hof-the-berchemveld"
          />
          <img
            className={styles.scale_down}
            src="/assets/sponsors/carrosserie-jans-white.svg"
            alt="carrosserie-jans"
          />
          <img
            src="/assets/sponsors/vlaams-brabant-white.svg"
            alt="vlaams-brabant"
            className={styles.scale_up}
          />
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
              ]}
            />
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
