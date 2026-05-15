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

const localizedFlat = (field: string) => /* groq */ `
  coalesce(
    ${field}[language == $locale][0].value,
    ${field}[language == "en"][0].value,
    ${field}[language == "nl"][0].value,
    ""
  )
`;

export const MENU_QUERY = defineQuery(/* groq */ `
  *[_type == "menuItem"] | order(category asc, order asc, price asc) {
    _id,
    category,
    price,
    "img": coalesce(image.asset->url, ""),
    "name": ${localizedFlat("name")},
    "description": ${localizedFlat("description")},
    "subCategory": ${localizedFlat("subCategory")}
  }
`);

export const ASSETS_BY_TAGS_QUERY = defineQuery(/* groq */ `
  *[_type == "sanity.imageAsset"
    && references(*[_type == "media.tag" && name.current in $tags]._id)
  ] | order(_createdAt asc) {
    _id,
    "url": url,
    "alt": coalesce(altText, ""),
    "dims": metadata.dimensions { width, height },
    "tags": opt.media.tags[]->name.current
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0] {
    contactEmail,
    "contactAddress": ${localizedFlat("contactAddress")},
    socials[] { network, url },
    paellaSignupUrl,
    petanqueSignupUrl
  }
`);

export const HISTORY_ENTRIES_QUERY = defineQuery(/* groq */ `
  *[_type == "historyEntry"] | order(order asc) {
    _id,
    year,
    order,
    "label": ${localizedFlat("label")},
    "body": ${localizedFlat("body")},
    "posterUrl": poster.asset->url,
    "posterAlt": coalesce(poster.alt, "")
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

export const MenuType = {
  DRINKS: "Drinks",
  FOOD: "Food",
} as const;
export type MenuType = (typeof MenuType)[keyof typeof MenuType];

export type MenuItem = {
  _id: string;
  category: MenuType;
  price: number;
  img: string;
  name: string;
  description: string;
  subCategory: string;
};

export type TaggedAsset = {
  _id: string;
  url: string;
  alt: string;
  dims: { width: number; height: number } | null;
  tags: string[];
};

export type SocialNetwork =
  | "instagram"
  | "facebook"
  | "spotify"
  | "youtube"
  | "tiktok";

export type SiteSettings = {
  contactEmail: string;
  contactAddress: string;
  socials: { network: SocialNetwork; url: string }[] | null;
  paellaSignupUrl: string | null;
  petanqueSignupUrl: string | null;
};

export type HistoryEntry = {
  _id: string;
  year: string;
  order: number;
  label: string;
  body: string;
  posterUrl: string | null;
  posterAlt: string;
};
