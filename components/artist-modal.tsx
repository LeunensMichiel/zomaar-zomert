"use client";

import { type IImageCard } from "@lib/models";
import { formatArtistName } from "@lib/utils/string-utils";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { sanityImageLoader } from "@/sanity/lib/image-loader";

type Props = { data: IImageCard };

export function ArtistModalContent({ data }: Props) {
  const lang = useLocale();
  const t = useTranslations("common");

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white lg:grid lg:grid-cols-[4fr_5fr]">
      <div className='relative flex h-[70vw] overflow-hidden before:absolute before:inset-0 before:z-[2] before:bg-[image:radial-gradient(rgba(255,255,255,0.2)_1px,rgba(0,0,0,0.15)_1px),radial-gradient(rgba(255,255,255,0.1)_1px,rgba(0,0,0,0.1)_1px)] before:[background-size:3px_3px] before:[background-position:0_0,2px_2px] before:mix-blend-lighten before:content-[""] lg:h-full'>
        <Image
          className="z-[1] object-cover object-center"
          src={data.imgSrc}
          alt={data.title}
          fill
          quality={100}
          sizes="(max-width: 1024px) 100vw, 50vw"
          loader={sanityImageLoader}
        />
        <picture>
          <source
            srcSet="/assets/tear-7-vertical.svg"
            media="(min-width: 1024px)"
          />
          <img
            src="/assets/tear-7.svg"
            alt=""
            aria-hidden="true"
            className="absolute -bottom-0.5 left-0 z-[3] w-full object-cover lg:top-0 lg:-right-0.5 lg:bottom-0 lg:left-auto lg:w-36"
          />
        </picture>
      </div>
      <div className="px-6 pt-2 pb-8 md:px-6 md:pt-4 md:pb-20 lg:p-12">
        <span className="font-display inline-block text-2xl leading-tight font-bold">
          {data.date &&
            new Date(data.date).toLocaleString(lang, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </span>
        <h1 className="mb-6 text-5xl font-bold break-words text-blue-500 uppercase md:text-7xl">
          {formatArtistName(data.title)}
        </h1>
        <span className="font-display mb-12 inline-block bg-gray-900 px-2 py-2 text-sm leading-tight font-bold text-pink-400 uppercase md:text-xl">
          {data.subtitle}
        </span>
        <p className="font-semibold whitespace-pre-line md:text-xl lg:text-base">
          {data.description}
        </p>
        {data.link && (
          <a
            className="mt-4 inline-block"
            href={data.link}
            target="_blank"
            rel="noreferrer noopener"
          >
            {t("register")}
          </a>
        )}
      </div>
    </div>
  );
}
