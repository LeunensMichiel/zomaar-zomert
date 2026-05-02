"use client";

import { Facebook } from "@components/icons/facebook";
import { Instagram } from "@components/icons/instagram";
import { Youtube } from "@components/icons/youtube";
import { LanguagePicker } from "@components/language-picker";
import { Link } from "@lib/i18n/navigation";
import { ZZ_DATES } from "@lib/models";
import { cn } from "@lib/utils";
import partners from "@lib/data/partners.json";
import { motion } from "motion/react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const socialMotion = {
  initial: { y: 0, transition: { duration: 0.3, type: "spring" as const } },
  tap: { y: 4, transition: { duration: 0.3, type: "spring" as const } },
  hover: {
    y: -2,
    color: "#ffb600",
    transition: { duration: 0.3, type: "spring" as const },
  },
};

const SOCIAL_LINKS = [
  { href: "https://facebook.com/zomaarzomert", Icon: Facebook },
  { href: "https://www.instagram.com/zomaarzomert/", Icon: Instagram },
  { href: "https://www.youtube.com/watch?v=G2s9r_BohUE", Icon: Youtube },
];

const tearTop =
  "absolute left-0 top-0 z-10 w-full -translate-y-px object-cover";
const tearBottom =
  "absolute left-0 bottom-0 z-10 w-full translate-y-px object-cover";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid content-start justify-items-center lg:justify-items-start">
      <span className="font-display mb-3 text-2xl font-bold text-yellow-200 uppercase md:mb-4 lg:mb-8">
        {title}
      </span>
      {children}
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: React.ComponentProps<typeof Link>["href"];
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="py-2 leading-tight font-semibold text-white underline"
    >
      {children}
    </Link>
  );
}

const partnerLogoSize = (size: "sm" | "lg" | "xl" | undefined) => {
  switch (size) {
    case "sm":
      return "h-5 md:h-7 lg:h-7";
    case "lg":
      return "h-12 md:h-14 lg:h-20";
    case "xl":
      return "h-16 md:h-20 lg:h-24";
    default:
      return "h-10 md:h-12 lg:h-16";
  }
};

export function Footer() {
  const t = useTranslations("common");
  const lang = useLocale();
  return (
    <>
      <div className="relative flex items-center justify-center overflow-hidden">
        <div className='relative z-[1] w-full bg-[url("/assets/footer.webp")] bg-cover bg-[50%_70%] px-6 py-32 before:absolute before:inset-0 before:-z-[1] before:bg-black/50 before:bg-[image:radial-gradient(rgba(255,255,255,0.2)_1px,rgba(0,0,0,0.15)_1px),radial-gradient(rgba(255,255,255,0.1)_1px,rgba(0,0,0,0.1)_1px)] before:[background-size:4px_4px] before:[background-position:0_0,2px_2px] before:content-[""] xl:py-48'>
          <div className="mx-auto grid max-w-md grid-cols-3 items-center justify-center justify-items-center gap-0.5">
            {SOCIAL_LINKS.map(({ href, Icon }) => (
              <motion.a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="z-10 text-white hover:text-pink-50 focus:text-pink-50"
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={socialMotion}
              >
                <Icon className="h-14 w-14" />
              </motion.a>
            ))}
          </div>
          <img
            src="/assets/tear-5.svg"
            alt=""
            aria-hidden="true"
            className={tearTop}
          />
          <img
            src="/assets/tear-6.svg"
            alt=""
            aria-hidden="true"
            className={tearBottom}
          />
        </div>
      </div>

      <footer className="mt-auto w-full bg-gray-900 text-white">
        <div className="container-wide section-y-sm">
          <div className="grid gap-12 lg:grid-cols-3">
            <FooterColumn title={t("footer.line-up.title")}>
              {ZZ_DATES.map((date) => (
                <FooterLink
                  key={date}
                  href={{ pathname: "/line-up", query: { date } }}
                >
                  {new Date(date).toLocaleString(lang, { weekday: "long" })}
                </FooterLink>
              ))}
            </FooterColumn>
            <FooterColumn title={t("footer.info.title")}>
              <FooterLink href="/history">{t("links.history")}</FooterLink>
              <FooterLink href="/partners">{t("links.partners")}</FooterLink>
              <FooterLink href="/menu">{t("links.menu")}</FooterLink>
              <FooterLink href="/privacy-policy">{t("links.legal")}</FooterLink>
            </FooterColumn>
            <FooterColumn title={t("footer.contact.title")}>
              <FooterLink href="/info">
                {t("footer.contact.activities")}
              </FooterLink>
              <FooterLink href="/contact">
                {t("footer.contact.contact")}
              </FooterLink>
              <div className="mt-4 flex flex-col text-center leading-relaxed text-white lg:text-left">
                <span>info@zomaarzomert.be</span>
                <span>Plankenstraat 23, Itterbeek</span>
              </div>
            </FooterColumn>
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-10">
            {partners
              .sort(
                (a, b) => a.formula - b.formula || a.name.localeCompare(b.name),
              )
              .filter((p) => !p.disabled)
              .map((p) => (
                <a
                  key={p.name}
                  className={cn(
                    "inline-flex max-w-40 items-center justify-center opacity-50 transition-opacity hover:opacity-75",
                    partnerLogoSize(
                      p.logoSize as "sm" | "lg" | "xl" | undefined,
                    ),
                  )}
                  {...(p.site && {
                    href: p.site,
                    target: "_blank",
                    rel: "noreferrer noopener",
                  })}
                >
                  {p.logoWhite ? (
                    <Image
                      src={p.logoWhite}
                      alt={p.name}
                      width={200}
                      height={120}
                      quality={100}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="font-display block w-full text-center text-lg leading-none break-words text-white md:text-xl lg:text-2xl">
                      {p.name}
                    </span>
                  )}
                </a>
              ))}
          </div>

          <div className="mt-12 grid items-center justify-items-center gap-6 lg:mt-20">
            <LanguagePicker />
            <span className="block w-full text-center text-xs leading-tight">
              ©{new Date().getFullYear()}{" "}
              {t.rich("footer.copy", {
                michiel: (chunks) => (
                  <a
                    href="https://leunesmedia.netlify.app/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-inherit underline"
                  >
                    {chunks}
                  </a>
                ),
                lars: (chunks) => (
                  <a
                    href="https://www.linkedin.com/in/lars-puttaert/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-inherit underline"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
