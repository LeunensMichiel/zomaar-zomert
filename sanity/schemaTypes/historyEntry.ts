import { ClockIcon } from "@sanity/icons";
import { type ReactNode } from "react";
import { defineField, defineType } from "sanity";

export const historyEntry = defineType({
  name: "historyEntry",
  title: "History entries",
  type: "document",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "year",
      title: "Year label",
      description: 'Display string, e.g. "1998" or "2026".',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      description: "Lower numbers render earlier in the timeline.",
      type: "number",
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: "label",
      title: "Sticker label",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "body",
      type: "internationalizedArrayText",
    }),
    defineField({
      name: "poster",
      title: "Edition poster (optional)",
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
  ],
  preview: {
    select: { title: "year", subtitle: "label", media: "poster" },
    prepare(selection: {
      title?: string;
      subtitle?: { language?: string; value?: string }[];
      media?: unknown;
    }) {
      const nl = selection.subtitle?.find((v) => v.language === "nl")?.value;
      const fallback = selection.subtitle?.[0]?.value;
      return {
        title: selection.title,
        subtitle: nl ?? fallback,
        media: selection.media as ReactNode,
      };
    },
  },
  orderings: [
    {
      title: "Timeline order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
