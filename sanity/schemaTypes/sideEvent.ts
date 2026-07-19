import { CalendarIcon } from "@sanity/icons";
import { type ReactNode } from "react";
import { defineField, defineType } from "sanity";

const nlValue = (
  arr: { language?: string; value?: string }[] | undefined,
): string | undefined =>
  arr?.find((v) => v.language === "nl")?.value ?? arr?.[0]?.value;

const imageWithAlt = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({ name: "alt", title: "Alternative text", type: "string" }),
    ],
  });

export const sideEvent = defineType({
  name: "sideEvent",
  title: "Side event",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "signup", title: "Signup" },
    { name: "downloads", title: "Route downloads" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero eyebrow",
      description: 'Small sticker label above the title (e.g. "Vrijdag").',
      type: "internationalizedArrayString",
      group: "content",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero title",
      description: "Chunky-block headline at the top of the page.",
      type: "internationalizedArrayString",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      description: "Lead paragraph under the title.",
      type: "internationalizedArrayText",
      group: "content",
    }),
    {
      ...imageWithAlt("heroImage", "Hero image"),
      group: "media",
    },
    defineField({
      name: "facts",
      title: "Quick facts",
      description:
        "At-a-glance tiles (distance, start time, price, location). Drag to reorder.",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          name: "fact",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Distance", value: "distance" },
                  { title: "Clock", value: "clock" },
                  { title: "Location", value: "location" },
                  { title: "Price", value: "euro" },
                  { title: "Info", value: "info" },
                ],
                layout: "radio",
              },
              initialValue: "info",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "internationalizedArrayString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "internationalizedArrayString",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { icon: "icon", label: "label", value: "value" },
            prepare: (sel: {
              icon?: string;
              label?: { language?: string; value?: string }[];
              value?: { language?: string; value?: string }[];
            }) => ({
              title: nlValue(sel.label) ?? sel.icon ?? "Fact",
              subtitle: nlValue(sel.value),
            }),
          },
        },
      ],
    }),
    defineField({
      name: "tracks",
      title: "Distances / parcours",
      description:
        "One card per distance or discipline (e.g. Mountainbike, Gravel, 7 km, 14 km).",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          name: "track",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "internationalizedArrayString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "distance",
              title: "Distance",
              description: 'e.g. "35 of 50 km".',
              type: "internationalizedArrayString",
            }),
            defineField({
              name: "wayfinding",
              title: "Wayfinding",
              description:
                'Optional navigation badge on the card (e.g. "Volg de pijlen", "GPX-tocht").',
              type: "internationalizedArrayString",
            }),
            defineField({
              name: "body",
              title: "Description",
              type: "internationalizedArrayText",
            }),
          ],
          preview: {
            select: { name: "name", distance: "distance" },
            prepare: (sel: {
              name?: { language?: string; value?: string }[];
              distance?: { language?: string; value?: string }[];
            }) => ({
              title: nlValue(sel.name) ?? "Track",
              subtitle: nlValue(sel.distance),
            }),
          },
        },
      ],
    }),
    defineField({
      name: "sections",
      title: "Text sections",
      description: "Longer narrative blocks below the distances.",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          name: "section",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "internationalizedArrayString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "internationalizedArrayText",
            }),
          ],
          preview: {
            select: { title: "title" },
            prepare: (sel: {
              title?: { language?: string; value?: string }[];
            }) => ({ title: nlValue(sel.title) ?? "Section" }),
          },
        },
      ],
    }),
    defineField({
      name: "practicalNote",
      title: "Practical note",
      description:
        "Extra practical details (bikewash, douches, betaalwijze, nummer-pickup).",
      type: "internationalizedArrayText",
      group: "content",
    }),
    defineField({
      name: "signupUrl",
      title: "Signup form URL",
      type: "url",
      group: "signup",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "signupEnabledFrom",
      title: "Signup opens from",
      description:
        "The signup button shows “Binnenkort” until this moment, then links to the form.",
      type: "datetime",
      group: "signup",
    }),
    defineField({
      name: "gpxVisibleFrom",
      title: "Downloads open from",
      description:
        "The GPX download section stays hidden until this moment (e.g. Friday 15:00 for the bike, Sunday 09:00 for the run). Leave empty to keep it hidden.",
      type: "datetime",
      group: "downloads",
    }),
    defineField({
      name: "gpxVisibleUntil",
      title: "Downloads hidden after",
      description:
        "The section disappears again after this moment (e.g. end of the ride day). Leave empty to keep it available.",
      type: "datetime",
      group: "downloads",
      validation: (rule) =>
        rule.custom((until, context) => {
          const from = (
            context.document as { gpxVisibleFrom?: string } | undefined
          )?.gpxVisibleFrom;
          if (until && from && new Date(until) <= new Date(from)) {
            return "Must be later than “Downloads open from”.";
          }
          return true;
        }),
    }),
    defineField({
      name: "gpxRoutes",
      title: "Route downloads & links",
      description:
        "One card per route. Attach a .gpx file, a Strava route link, or both. Add none to hide the whole section. Drag to reorder.",
      type: "array",
      group: "downloads",
      validation: (rule) =>
        rule
          .custom((routes, context) => {
            const hasRoutes = Array.isArray(routes) && routes.length > 0;
            const from = (
              context.document as { gpxVisibleFrom?: string } | undefined
            )?.gpxVisibleFrom;
            if (hasRoutes && !from) {
              return "Set “Downloads open from” or the section stays hidden.";
            }
            return true;
          })
          .warning(),
      of: [
        {
          type: "object",
          name: "gpxRoute",
          validation: (rule) =>
            rule.custom((route) => {
              const r = route as
                | { file?: { asset?: { _ref?: string } }; stravaUrl?: string }
                | undefined;
              const hasFile = !!r?.file?.asset?._ref;
              const hasStrava = !!r?.stravaUrl;
              if (!hasFile && !hasStrava) {
                return "Add a GPX file, a Strava route link, or both.";
              }
              return true;
            }),
          fields: [
            defineField({
              name: "title",
              title: "Route name",
              description:
                'Shown on the card (e.g. "Mountainbike · 50 km", "Parcours · 7 km").',
              type: "internationalizedArrayString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "file",
              title: "GPX file",
              description: "Optional if a Strava link is provided.",
              type: "file",
              options: { accept: ".gpx,application/gpx+xml" },
            }),
            defineField({
              name: "stravaUrl",
              title: "Strava route link",
              description:
                "Optional. Full Strava route URL (e.g. https://www.strava.com/routes/1234). Opens in a new tab.",
              type: "url",
              validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: {
              title: "title",
              filename: "file.asset.originalFilename",
              stravaUrl: "stravaUrl",
            },
            prepare: (sel: {
              title?: { language?: string; value?: string }[];
              filename?: string;
              stravaUrl?: string;
            }) => ({
              title: nlValue(sel.title) ?? "Route",
              subtitle:
                sel.filename ?? (sel.stravaUrl ? "Strava route" : undefined),
            }),
          },
        },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      description: "Photos shown lower on the page. Drag to reorder.",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heroTitle", media: "heroImage" },
    prepare: (sel: {
      title?: { language?: string; value?: string }[];
      media?: unknown;
    }) => ({
      title: nlValue(sel.title) ?? "Side event",
      media: sel.media as ReactNode,
    }),
  },
});
