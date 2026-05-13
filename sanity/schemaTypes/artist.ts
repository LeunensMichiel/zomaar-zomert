import { UserIcon } from "@sanity/icons";
import { type ReactNode } from "react";
import { defineField, defineType } from "sanity";

export const artist = defineType({
  name: "artist",
  title: "Artist",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
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
      name: "link",
      title: "External link",
      type: "url",
      description: "Spotify, YouTube, website, etc.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "internationalizedArrayText",
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
