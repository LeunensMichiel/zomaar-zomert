import partnersData from "@lib/data/partners.json";

export type Partner = (typeof partnersData)[number];

const visible = (): Partner[] => partnersData.filter((p) => !p.disabled);

export const loadLeadPartners = (): Partner[] =>
  visible()
    .filter((p) => p.formula === 1)
    .sort((a, b) => a.name.localeCompare(b.name));

export const loadSupportPartners = (): Partner[] =>
  visible()
    .filter((p) => p.formula !== 1)
    .sort((a, b) => a.formula - b.formula || a.name.localeCompare(b.name));

export const loadFeaturedPartnerLogos = (count = 8): Partner[] =>
  visible()
    .filter((p) => p.logoWhite)
    .slice(0, count);
