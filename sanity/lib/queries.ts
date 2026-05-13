import { defineQuery } from "next-sanity";

const partnerProjection = /* groq */ `
  _id,
  name,
  tier,
  logoSize,
  website,
  logo {
    asset->{
      _id,
      url,
      metadata { lqip, dimensions { width, height } }
    },
    alt,
    hotspot,
    crop
  }
`;

const artistProjection = /* groq */ `
  _id,
  name,
  day,
  hour,
  showFrom,
  link,
  "imgSrc": coalesce(image.asset->url, ""),
  "description": coalesce(
    description[language == $locale][0].value,
    description[language == "en"][0].value,
    description[language == "nl"][0].value,
    ""
  )
`;

const headlinerProjection = /* groq */ `
  _id,
  name,
  day,
  hour,
  "imgSrc": coalesce(image.asset->url, "")
`;

export const PARTNERS_QUERY = defineQuery(/* groq */ `
  *[_type == "partner" && active == true] | order(tier asc, name asc) {
    ${partnerProjection}
  }
`);

export const FEATURED_PARTNERS_QUERY = defineQuery(/* groq */ `
  *[_type == "partner" && active == true && defined(logo)]
    | order(tier asc, name asc) [0...8] {
    ${partnerProjection}
  }
`);

export const ARTISTS_QUERY = defineQuery(/* groq */ `
  *[_type == "artist"
    && showFrom <= now()
    && showFrom >= $yearStart
  ] | order(showFrom asc) {
    ${artistProjection}
  }
`);

export const HEADLINER_ARTISTS_QUERY = defineQuery(/* groq */ `
  *[_type == "artist"
    && showFrom <= now()
    && showFrom >= $yearStart
  ] | order(showFrom asc) [0...3] {
    ${headlinerProjection}
  }
`);

export type PartnerLogoSize = "sm" | "md" | "lg" | "xl";

export type SanityImage = {
  asset: {
    _id: string;
    url: string;
    metadata: {
      lqip?: string;
      dimensions?: { width: number; height: number };
    };
  } | null;
  alt?: string;
  hotspot?: unknown;
  crop?: unknown;
};

export type Partner = {
  _id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  logoSize: PartnerLogoSize | null;
  website: string | null;
  logo: SanityImage | null;
};

export type FestivalDay = "friday" | "saturday" | "sunday";

export type Artist = {
  _id?: string;
  name: string;
  day: FestivalDay;
  hour: string;
  imgSrc: string;
  showFrom: string;
  description: string;
  link?: string | null;
};

export type Headliner = {
  _id?: string;
  name: string;
  day: FestivalDay;
  hour: string;
  imgSrc: string;
};
