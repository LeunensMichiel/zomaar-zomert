import { UsersIcon } from "@sanity/icons";
import { type ReactNode } from "react";
import { defineArrayMember, defineField, defineType } from "sanity";

export const artist = defineType({
  name: "artist",
  title: "Artists",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "URL segment for the artist detail page (e.g. /line-up/charlotte-de-witte).",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sets",
      title: "Sets",
      description:
        "When the artist plays. One entry per day — an act that plays both Friday and Saturday gets two.",
      type: "array",
      validation: (rule) => rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "set",
          fields: [
            defineField({
              name: "day",
              title: "Festival day",
              type: "string",
              options: {
                list: [
                  { title: "Friday", value: "friday" },
                  { title: "Saturday", value: "saturday" },
                  { title: "Sunday", value: "sunday" },
                ],
                layout: "radio",
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "hour",
              title: "Set time",
              type: "string",
              description: 'Format: "21:30 - 23:00".',
            }),
          ],
          preview: {
            select: { day: "day", hour: "hour" },
            prepare(selection: { day?: string; hour?: string }) {
              return {
                title: selection.day ?? "Set",
                subtitle: selection.hour ?? "",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "showFrom",
      title: "Public reveal",
      type: "datetime",
      description:
        "Artist stays hidden from the public site until this moment.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "socials",
      title: "Social links",
      description:
        "One per network. Only the networks you fill in are shown on the artist page.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "social",
          fields: [
            defineField({
              name: "network",
              type: "string",
              options: {
                list: [
                  { title: "Spotify", value: "spotify" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Facebook", value: "facebook" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "YouTube", value: "youtube" },
                  { title: "SoundCloud", value: "soundcloud" },
                  { title: "Website", value: "website" },
                ],
                layout: "radio",
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
          preview: {
            select: { network: "network", url: "url" },
            prepare(selection: { network?: string; url?: string }) {
              return {
                title: selection.network ?? "Social",
                subtitle: selection.url ?? "",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "bio",
      title: "Biography",
      description:
        "Rich-text bio. Drop in YouTube links via the embed block to play videos inline.",
      type: "internationalizedArrayArtistBlockContent",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      sets: "sets",
      showFrom: "showFrom",
    },
    prepare(selection: {
      title?: string;
      media?: unknown;
      sets?: { day?: string; hour?: string }[];
      showFrom?: string;
    }) {
      const days = (selection.sets ?? [])
        .map((set) => [set.day, set.hour].filter(Boolean).join(" "))
        .filter(Boolean)
        .join(" · ");
      const hidden =
        selection.showFrom && new Date(selection.showFrom) > new Date()
          ? "hidden"
          : "";
      return {
        title: selection.title,
        subtitle: [days, hidden].filter(Boolean).join(" — "),
        media: selection.media as ReactNode,
      };
    },
  },
  orderings: [
    {
      title: "Reveal time",
      name: "showFromAsc",
      by: [{ field: "showFrom", direction: "asc" }],
    },
    {
      title: "Name",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
