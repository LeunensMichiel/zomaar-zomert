import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "contactAddress",
      title: "Postal address",
      description: "Multi-line OK. Localize if NL/FR/EN differ.",
      type: "internationalizedArrayText",
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          name: "social",
          fields: [
            defineField({
              name: "network",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "Spotify", value: "spotify" },
                  { title: "YouTube", value: "youtube" },
                  { title: "TikTok", value: "tiktok" },
                ],
                layout: "dropdown",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: { select: { title: "network", subtitle: "url" } },
        },
      ],
    }),
    defineField({
      name: "marqueeItems",
      title: "Hero marquee items",
      description:
        "Rotating ribbon of short phrases shown at the top of the home page. Drag-reorder to change ribbon order. Each item is one phrase with NL/FR/EN tabs.",
      type: "array",
      of: [
        {
          type: "object",
          name: "marqueeItem",
          fields: [
            defineField({
              name: "text",
              type: "internationalizedArrayString",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { text: "text" },
            prepare: (sel: {
              text?: { language?: string; value?: string }[];
            }) => ({
              title:
                sel.text?.find((v) => v.language === "nl")?.value ??
                sel.text?.[0]?.value ??
                "(empty)",
            }),
          },
        },
      ],
    }),
    defineField({
      name: "paellaSignupUrl",
      title: "Paella signup form URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "petanqueSignupUrl",
      title: "Pétanque signup form URL",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
