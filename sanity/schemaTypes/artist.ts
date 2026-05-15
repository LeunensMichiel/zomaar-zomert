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
      day: "day",
      hour: "hour",
      showFrom: "showFrom",
    },
    prepare(selection: {
      title?: string;
      media?: unknown;
      day?: string;
      hour?: string;
      showFrom?: string;
    }) {
      const subtitleParts: string[] = [];
      if (selection.day) subtitleParts.push(selection.day);
      if (selection.hour) subtitleParts.push(selection.hour);
      if (selection.showFrom && new Date(selection.showFrom) > new Date()) {
        subtitleParts.push("hidden");
      }
      return {
        title: selection.title,
        subtitle: subtitleParts.join(" · "),
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
      title: "Day, then set time",
      name: "dayHour",
      by: [
        { field: "day", direction: "asc" },
        { field: "hour", direction: "asc" },
      ],
    },
  ],
});
