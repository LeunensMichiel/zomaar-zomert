import { FitText } from "@components/fit-text";
import { LocaleSwitcher } from "@components/locale-switcher";
import { Sticker } from "@components/sticker";
import { Button } from "@components/ui/button";
import partners from "@lib/data/partners.json";
import { Link } from "@lib/i18n/navigation";
import { ZZ_DATES, ZZ_YEAR } from "@lib/models";
import { cn } from "@lib/utils";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import { PaperTear } from "@/app/[locale]/redesign/_components/paper-tear";
import { StarBurst } from "@/app/[locale]/redesign/_components/star-burst";
import { Facebook } from "@/components/icons/Facebook";
import { Instagram } from "@/components/icons/Instagram";
import { Youtube } from "@/components/icons/Youtube";

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/zomaarzomert/",
    label: "Instagram",
    Icon: Instagram,
    color: "yellow" as const,
    rotate: -4,
  },
  {
    href: "https://facebook.com/zomaarzomert",
    label: "Facebook",
    Icon: Facebook,
    color: "brand" as const,
    rotate: 3,
  },
  {
    href: "https://www.youtube.com/watch?v=G2s9r_BohUE",
    label: "YouTube",
    Icon: Youtube,
    color: "blue" as const,
    rotate: -2,
  },
];

const SOCIAL_TILE = {
  yellow: "bg-yellow-400 text-gray-900",
  brand: "bg-brand-500 text-white",
  blue: "bg-blue-500 text-white",
} as const;

function ColumnHeading({
  children,
  rotate,
  color = "yellow",
}: {
  children: React.ReactNode;
  rotate: number;
  color?: "yellow" | "brand" | "pink";
}) {
  return (
    <Sticker
      color={color}
      size="sm"
      rotate={rotate}
      className="mb-5 self-start"
    >
      {children}
    </Sticker>
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
      className="font-display block py-1 text-lg leading-tight font-bold tracking-wide text-white uppercase transition-colors hover:text-yellow-400 focus-visible:text-yellow-400"
    >
      {children}
    </Link>
  );
}

const partnerLogoSize = (
  size: "sm" | "md" | "lg" | "xl" | undefined,
  tier: "lead" | "support",
) => {
  if (tier === "lead") {
    switch (size) {
      case "sm":
        return "h-7 md:h-9 lg:h-11";
      case "lg":
        return "h-14 md:h-16 lg:h-24";
      case "xl":
        return "h-16 md:h-20 lg:h-28";
      default:
        return "h-12 md:h-14 lg:h-20";
    }
  }
  switch (size) {
    case "sm":
      return "h-4 md:h-5 lg:h-6";
    case "lg":
      return "h-9 md:h-11 lg:h-14";
    case "xl":
      return "h-11 md:h-14 lg:h-16";
    default:
      return "h-7 md:h-9 lg:h-11";
  }
};

type Partner = (typeof partners)[number];

function PartnerLogo({
  partner,
  tier,
}: {
  partner: Partner;
  tier: "lead" | "support";
}) {
  const sizeClass = partnerLogoSize(
    partner.logoSize as "sm" | "md" | "lg" | "xl" | undefined,
    tier,
  );
  const className = cn(
    "inline-flex items-center justify-center transition-opacity",
    tier === "lead"
      ? "max-w-44 hover:opacity-80"
      : "max-w-32 opacity-60 hover:opacity-100",
    sizeClass,
  );
  const content = partner.logoWhite ? (
    <Image
      src={partner.logoWhite}
      alt={partner.name}
      width={240}
      height={120}
      quality={100}
      className="h-full w-full object-contain"
    />
  ) : (
    <FitText
      text={partner.name}
      className={cn(
        "font-display leading-none text-white",
        tier === "lead" ? "text-xl lg:text-2xl" : "text-sm lg:text-base",
      )}
    />
  );
  return partner.site ? (
    <a
      href={partner.site}
      target="_blank"
      rel="noreferrer noopener"
      className={className}
    >
      {content}
    </a>
  ) : (
    <span className={className}>{content}</span>
  );
}

export async function Footer() {
  const lang = await getLocale();
  const t = await getTranslations({ locale: lang, namespace: "common" });
  const year = new Date().getFullYear();

  const visiblePartners = partners.filter((p) => !p.disabled);
  const leadPartners = visiblePartners
    .filter((p) => p.formula === 1)
    .sort((a, b) => a.name.localeCompare(b.name));
  const supportPartners = visiblePartners
    .filter((p) => p.formula !== 1)
    .sort((a, b) => a.formula - b.formula || a.name.localeCompare(b.name));

  return (
    <>
      <div className="relative isolate flex items-center justify-center overflow-hidden">
        <div className='relative z-[1] w-full bg-[url("/assets/footer.webp")] bg-cover bg-[50%_70%] px-6 py-32 before:absolute before:inset-0 before:-z-[1] before:bg-black/55 before:bg-[image:radial-gradient(rgba(255,255,255,0.2)_1px,rgba(0,0,0,0.15)_1px),radial-gradient(rgba(255,255,255,0.1)_1px,rgba(0,0,0,0.1)_1px)] before:[background-size:4px_4px] before:[background-position:0_0,2px_2px] before:content-[""] xl:py-60'>
          <div className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-6">
            <Sticker color="yellow" size="md" rotate={-4}>
              {t("footer.social.eyebrow")}
            </Sticker>
            <ul className="flex items-center justify-center gap-4 md:gap-6">
              {SOCIAL_LINKS.map(({ href, label, Icon, color, rotate }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="group grid h-20 w-20 place-items-center focus-visible:outline-none md:h-24 md:w-24"
                  >
                    <span
                      style={
                        {
                          "--rotate": `${String(rotate)}deg`,
                        } as React.CSSProperties
                      }
                      className={cn(
                        "shadow-sticker md:shadow-sticker-lg flex h-16 w-16 items-center justify-center border-2 border-gray-900 md:h-20 md:w-20",
                        "transform-[rotate(var(--rotate))] transition-transform duration-300 ease-out motion-reduce:transition-none",
                        "group-hover:transform-[rotate(0deg)_translateY(-6px)]",
                        "group-focus-visible:transform-[rotate(0deg)_translateY(-6px)]",
                        "group-active:transform-[rotate(var(--rotate))_translateY(2px)]",
                        SOCIAL_TILE[color],
                      )}
                    >
                      <Icon className="h-8 w-8 md:h-10 md:w-10" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <PaperTear
            edge="bottom"
            tear={3}
            color="pink-50"
            className="absolute inset-x-0 -top-[10px] z-10"
          />
          <PaperTear
            edge="bottom"
            tear={1}
            color="pink-50"
            className="absolute inset-x-0 -bottom-[10px] z-10"
          />
          <PaperTear
            edge="bottom"
            tear={6}
            color="gray-900"
            className="absolute inset-x-0 bottom-0 z-10"
          />
        </div>
      </div>

      <footer className="mt-auto w-full bg-gray-900 text-white">
        <div className="container-wide section-y-sm">
          <div className="grid gap-12 md:gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              {/* Postcard collage — the contact column reads like a
                  pinned festival postcard rather than a stacked text
                  block. Tape strips, halftone wash, dashed cut-line,
                  postmark stamp, and a slight tilt do the work. */}
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="tape-strip absolute -top-2 left-8 z-30 h-5 w-24 -rotate-[16deg] md:left-12"
                />
                <span
                  aria-hidden="true"
                  className="tape-strip absolute -top-3 right-10 z-30 h-5 w-20 rotate-12"
                />

                <article className="shadow-sticker-lg relative -rotate-1 border-2 border-gray-900 bg-pink-50 p-6 text-gray-900 md:p-8">
                  <div
                    aria-hidden="true"
                    className="halftone pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply"
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                      <Sticker color="yellow" size="xs" rotate={-3}>
                        {t("footer.contact.title")}
                      </Sticker>
                      <span
                        aria-hidden="true"
                        className="font-display hidden text-[10px] tracking-[0.3em] uppercase opacity-50 md:inline"
                      >
                        ZZ // {ZZ_YEAR}
                      </span>
                    </div>

                    <a
                      href="mailto:info@zomaarzomert.be"
                      className="font-display text-brand-500 hover:text-brand-700 focus-visible:text-brand-700 mt-5 block text-3xl leading-[0.92] tracking-tight break-all uppercase transition-colors md:text-4xl lg:text-5xl"
                    >
                      info@zomaarzomert.be
                    </a>

                    <div
                      aria-hidden="true"
                      className="my-6 flex items-center gap-3"
                    >
                      <span className="font-display text-[10px] tracking-[0.25em] uppercase opacity-50">
                        Adres
                      </span>
                      <span className="h-px flex-1 border-t border-dashed border-gray-900/40" />
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <address className="text-sm leading-relaxed not-italic md:text-base">
                        Plankenstraat 23
                        <br />
                        1701 Itterbeek
                        <br />
                        <span className="opacity-60">BELGIË</span>
                      </address>

                      <div className="shrink-0">
                        <StarBurst
                          fill="text-brand-500"
                          className="h-24 w-24 md:h-28 md:w-28"
                          style={{ transform: "rotate(-12deg)" }}
                        >
                          <span className="font-display px-1 text-center text-[10px] leading-none tracking-widest text-pink-50 uppercase">
                            ZZ
                            <br />
                            EDITIE
                            <br />
                            {String(ZZ_YEAR).slice(-2)}
                          </span>
                        </StarBurst>
                      </div>
                    </div>
                  </div>
                </article>

                <div className="mt-10 flex flex-wrap items-start gap-3 md:mt-12">
                  <Link href="/contact" className="inline-block rotate-1">
                    <Button
                      as="span"
                      variant="accent"
                      size="md"
                      sticker
                      iconRight={<ChevronRight />}
                    >
                      {t("footer.contact.contact")}
                    </Button>
                  </Link>
                  <Link href="/info" className="inline-block -rotate-2">
                    <Button
                      as="span"
                      variant="brand"
                      size="md"
                      sticker
                      iconRight={<ChevronRight />}
                    >
                      {t("footer.contact.activities")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <nav aria-label="Line-up" className="flex flex-col lg:col-span-3">
              <ColumnHeading rotate={2} color="brand">
                {t("footer.line-up.title")}
              </ColumnHeading>
              <ul>
                {ZZ_DATES.map((date) => (
                  <li key={date}>
                    <FooterLink
                      href={{ pathname: "/line-up", query: { date } }}
                    >
                      {new Date(date).toLocaleString(lang, { weekday: "long" })}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </nav>

            <nav
              aria-label={t("footer.info.title")}
              className="flex flex-col lg:col-span-4"
            >
              <ColumnHeading rotate={-2} color="pink">
                {t("footer.info.title")}
              </ColumnHeading>
              <ul>
                <li>
                  <FooterLink href="/history">{t("links.history")}</FooterLink>
                </li>
                <li>
                  <FooterLink href="/partners">
                    {t("links.partners")}
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/menu">{t("links.menu")}</FooterLink>
                </li>
                <li>
                  <FooterLink href="/privacy-policy">
                    {t("links.legal")}
                  </FooterLink>
                </li>
              </ul>
            </nav>
          </div>

          <section
            aria-label={t("footer.partners.eyebrow")}
            className="mt-20 lg:mt-28"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <Sticker color="yellow" size="sm" rotate={-3}>
                {t("footer.partners.eyebrow")}
              </Sticker>
            </div>

            <div className="mt-10 grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-10 md:grid-cols-3 md:gap-x-12 lg:grid-cols-4 lg:gap-x-16 lg:gap-y-14">
              {leadPartners.map((p) => (
                <PartnerLogo key={p.name} partner={p} tier="lead" />
              ))}
            </div>

            {supportPartners.length > 0 && (
              <>
                <div className="mt-16 flex items-center gap-4">
                  <span
                    className="h-px flex-1 bg-white/15"
                    aria-hidden="true"
                  />
                  <Sticker color="ink" size="xs" rotate={-1}>
                    {t("footer.partners.support")}
                  </Sticker>
                  <span
                    className="h-px flex-1 bg-white/15"
                    aria-hidden="true"
                  />
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:gap-x-12 lg:gap-x-14">
                  {supportPartners.map((p) => (
                    <PartnerLogo key={p.name} partner={p} tier="support" />
                  ))}
                </div>
              </>
            )}
          </section>

          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 lg:mt-24 lg:flex-row">
            <LocaleSwitcher className="text-sm" />
            <span className="text-center text-xs leading-snug opacity-70 lg:text-right">
              ©{year}{" "}
              {t.rich("footer.copy", {
                michiel: (chunks) => (
                  <a
                    href="https://leunesmedia.netlify.app/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-black underline-offset-2 hover:underline"
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
