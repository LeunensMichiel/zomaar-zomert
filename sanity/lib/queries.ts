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

export type PartnerLogoSize = "sm" | "md" | "lg" | "xl";

export type PartnerSanityImage = {
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
  logo: PartnerSanityImage | null;
};
