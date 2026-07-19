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
  "slug": slug.current,
  sets[]{ day, hour },
  showFrom,
  socials[]{ network, url },
  "imgSrc": coalesce(image.asset->url, ""),
  "imgLqip": image.asset->metadata.lqip,
  "imgHotspot": image.hotspot { x, y },
  "bio": coalesce(
    bio[language == $locale][0].value,
    bio[language == "en"][0].value,
    bio[language == "nl"][0].value,
    []
  )
`;

const headlinerProjection = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  "day": sets[0].day,
  "hour": sets[0].hour,
  "imgSrc": coalesce(image.asset->url, ""),
  "imgLqip": image.asset->metadata.lqip,
  "imgHotspot": image.hotspot { x, y }
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

export const ARTIST_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "artist"
    && slug.current == $slug
    && showFrom <= now()
    && showFrom >= $yearStart
  ][0] {
    ${artistProjection}
  }
`);

export const ARTIST_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "artist"
    && defined(slug.current)
    && showFrom <= now()
    && showFrom >= $yearStart
  ]{ "slug": slug.current }
`);

const localizedFlat = (field: string) => /* groq */ `
  coalesce(
    ${field}[language == $locale][0].value,
    ${field}[language == "en"][0].value,
    ${field}[language == "nl"][0].value,
    ""
  )
`;

const localizedFlatArray = (field: string) => /* groq */ `
  coalesce(
    ${field}[language == $locale][0].value,
    ${field}[language == "en"][0].value,
    ${field}[language == "nl"][0].value,
    []
  )
`;

export const ACTIVITIES_QUERY = defineQuery(/* groq */ `
  *[_type == "activity"] | order(orderRank asc) {
    _id,
    day,
    doodle,
    linkTarget,
    "name": ${localizedFlat("name")},
    "timeLabel": ${localizedFlat("timeLabel")},
    "image": *[
      _type == "sanity.imageAsset"
      && ^.imageTag in opt.media.tags[]->name.current
    ] | order(_createdAt asc)[0] {
      "url": url,
      "lqip": metadata.lqip
    }
  }
`);

export const MENU_QUERY = defineQuery(/* groq */ `
  *[_type == "menuItem" && enabled != false]
    | order(category asc, orderRank asc) {
    _id,
    category,
    subCategory,
    price,
    "img": coalesce(image.asset->url, ""),
    "name": ${localizedFlat("name")},
    "description": ${localizedFlat("description")}
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
    "lqip": metadata.lqip,
    "tags": opt.media.tags[]->name.current
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0] {
    contactEmail,
    "contactAddress": ${localizedFlat("contactAddress")},
    socials[] { network, url },
    "marqueeItems": marqueeItems[] {
      "value": ${localizedFlat("text")}
    },
    paellaSignupUrl,
    paellaSignupEnabledFrom,
    petanqueSignupUrl,
    petanqueSignupEnabledFrom,
    petanqueFull,
    "petanquePrice": ${localizedFlat("petanquePrice")},
    "quizPrice": ${localizedFlat("quizPrice")}
  }
`);

const sideEventImage = (field: string) => /* groq */ `
  ${field} {
    "url": asset->url,
    "alt": coalesce(alt, ""),
    "lqip": asset->metadata.lqip,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
`;

export const SIDE_EVENT_QUERY = defineQuery(/* groq */ `
  *[_id == $id][0] {
    "heroEyebrow": ${localizedFlat("heroEyebrow")},
    "heroTitle": ${localizedFlat("heroTitle")},
    "intro": ${localizedFlat("intro")},
    "heroImage": ${sideEventImage("heroImage")},
    "facts": facts[] {
      icon,
      "label": ${localizedFlat("label")},
      "value": ${localizedFlat("value")}
    },
    "tracks": tracks[] {
      "name": ${localizedFlat("name")},
      "distance": ${localizedFlat("distance")},
      "wayfinding": ${localizedFlat("wayfinding")},
      "body": ${localizedFlat("body")}
    },
    "sections": sections[] {
      "title": ${localizedFlat("title")},
      "body": ${localizedFlat("body")}
    },
    "practicalNote": ${localizedFlat("practicalNote")},
    signupUrl,
    signupEnabledFrom,
    gpxVisibleFrom,
    gpxVisibleUntil,
    "gpxRoutes": gpxRoutes[defined(file.asset) || defined(stravaUrl)] {
      "title": ${localizedFlat("title")},
      "filename": file.asset->originalFilename,
      "size": file.asset->size,
      "hasFile": defined(file.asset),
      stravaUrl
    },
    "gallery": gallery[] ${sideEventImage("")}
  }
`);

export const GPX_DOWNLOAD_QUERY = defineQuery(/* groq */ `
  *[_id == $id][0] {
    gpxVisibleFrom,
    gpxVisibleUntil,
    "routes": gpxRoutes[defined(file.asset) || defined(stravaUrl)] {
      "url": file.asset->url,
      "filename": file.asset->originalFilename
    }
  }
`);

export const HISTORY_ENTRIES_QUERY = defineQuery(/* groq */ `
  *[_type == "historyEntry"] | order(orderRank asc) {
    _id,
    year,
    "label": ${localizedFlat("label")},
    "body": ${localizedFlat("body")},
    "images": images[] {
      "key": _key,
      "url": photo.asset->url,
      "alt": coalesce(photo.alt, ""),
      "width": photo.asset->metadata.dimensions.width,
      "height": photo.asset->metadata.dimensions.height,
      "lqip": photo.asset->metadata.lqip,
      kind,
      "tag": ${localizedFlat("tag")},
      "caption": ${localizedFlat("caption")}
    }
  }
`);

export const INFO_BLOCKS_QUERY = defineQuery(/* groq */ `
  *[_type == "infoBlock"] | order(orderRank asc) {
    _id,
    layout,
    palette,
    width,
    "title": ${localizedFlat("title")},
    "display": ${localizedFlat("display")},
    "content": ${localizedFlatArray("content")},
    "photoUrl": photo.asset->url,
    "photoAlt": coalesce(photo.alt, ""),
    "photoCaption": ${localizedFlat("photoCaption")}
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

export type ArtistSocialNetwork =
  | "spotify"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "soundcloud"
  | "website";

export type ArtistSocial = {
  network: ArtistSocialNetwork;
  url: string;
};

export type ArtistSet = {
  day: FestivalDay;
  hour: string;
};

// Sanity hotspot focal point (0–1 fractions) — drives object-position
// so cropped artist photos stay centered on the subject.
export type ImageHotspot = { x: number; y: number };

export type Artist = {
  _id?: string;
  name: string;
  slug?: string | null;
  sets: ArtistSet[];
  imgSrc: string;
  imgLqip?: string | null;
  imgHotspot?: ImageHotspot | null;
  showFrom: string;
  bio: PortableTextBlock[];
  socials?: ArtistSocial[] | null;
};

export type ActivityLinkTarget = "bike" | "run" | "info";

export type Activity = {
  _id: string;
  day: FestivalDay;
  doodle: string;
  linkTarget: ActivityLinkTarget;
  name: string;
  timeLabel: string;
  image: { url: string | null; lqip: string | null } | null;
};

export type Headliner = {
  _id?: string;
  name: string;
  slug?: string | null;
  day: FestivalDay;
  hour: string;
  imgSrc: string;
  imgLqip?: string | null;
  imgHotspot?: ImageHotspot | null;
};

export const MenuType = {
  DRINKS: "Drinks",
  FOOD: "Food",
} as const;
export type MenuType = (typeof MenuType)[keyof typeof MenuType];

export type MenuSubCategory =
  | "water"
  | "soft-drinks"
  | "beers"
  | "wines"
  | "cocktails-spirits"
  | "meals"
  | "snacks";

export type MenuItem = {
  _id: string;
  category: MenuType;
  subCategory: MenuSubCategory;
  price: number;
  img: string;
  name: string;
  description: string;
};

export type TaggedAsset = {
  _id: string;
  url: string;
  alt: string;
  dims: { width: number; height: number } | null;
  lqip: string | null;
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
  marqueeItems: { value: string }[] | null;
  paellaSignupUrl: string | null;
  paellaSignupEnabledFrom: string | null;
  petanqueSignupUrl: string | null;
  petanqueSignupEnabledFrom: string | null;
  petanqueFull: boolean | null;
  petanquePrice: string;
  quizPrice: string;
};

export type SideEventImage = {
  url: string | null;
  alt: string;
  lqip: string | null;
  width: number | null;
  height: number | null;
};

export type SideEventFactIcon =
  | "distance"
  | "clock"
  | "location"
  | "euro"
  | "info";

export type SideEventFact = {
  icon: SideEventFactIcon;
  label: string;
  value: string;
};

export type SideEventTrack = {
  name: string;
  distance: string;
  wayfinding: string;
  body: string;
};

export type SideEventSection = {
  title: string;
  body: string;
};

export type SideEventGpxRoute = {
  title: string;
  filename: string | null;
  size: number | null;
  hasFile: boolean;
  stravaUrl: string | null;
};

export type SideEvent = {
  heroEyebrow: string;
  heroTitle: string;
  intro: string;
  heroImage: SideEventImage | null;
  facts: SideEventFact[] | null;
  tracks: SideEventTrack[] | null;
  sections: SideEventSection[] | null;
  practicalNote: string;
  signupUrl: string | null;
  signupEnabledFrom: string | null;
  gpxVisibleFrom: string | null;
  gpxVisibleUntil: string | null;
  gpxRoutes: SideEventGpxRoute[] | null;
  gallery: SideEventImage[] | null;
};

export type HistoryImageKind = "polaroid" | "affiche" | "normal";

export type HistoryImage = {
  key: string;
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  lqip: string | null;
  kind: HistoryImageKind;
  tag: string;
  caption: string;
};

export type HistoryEntry = {
  _id: string;
  year: string;
  label: string;
  body: string;
  images: HistoryImage[] | null;
};

export type InfoBlockPalette =
  | "royal-yellow"
  | "blue-cola"
  | "summer-red"
  | "bubblegum"
  | "milkshake";

export type InfoBlockLayout = "body" | "poster" | "polaroid" | "map";

export type InfoBlockWidth = "narrow" | "wide" | "full";

export type PortableTextBlock = {
  _key: string;
  _type: string;
  children?: { _key: string; _type: string; text?: string; marks?: string[] }[];
  markDefs?: { _key: string; _type: string; href?: string }[];
  style?: string;
};

export type InfoBlock = {
  _id: string;
  layout: InfoBlockLayout;
  palette: InfoBlockPalette;
  width: InfoBlockWidth;
  title: string;
  display: string;
  content: PortableTextBlock[];
  photoUrl: string | null;
  photoAlt: string;
  photoCaption: string;
};
