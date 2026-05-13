import { TagIcon } from "@sanity/icons";
import { type ReactNode } from "react";
import { defineField, defineType } from "sanity";

export const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tier",
      title: "Sponsorship tier",
      type: "number",
      description:
        "Tier 1 are the lead partners shown in big cards. Tiers 2–4 appear as smaller logos.",
      options: {
        list: [
          { title: "Tier 1 — Partner", value: 1 },
          { title: "Tier 2 — Premium", value: 2 },
          { title: "Tier 3 — Plus", value: 3 },
          { title: "Tier 4 — Basic", value: 4 },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required().integer().min(1).max(4),
    }),
    defineField({
      name: "logo",
      title: "Logo (white on dark)",
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
      name: "logoSize",
      title: "Logo display size",
      type: "string",
      description: "Visual scale of the logo inside its card.",
      options: {
        list: [
          { title: "Small", value: "sm" },
          { title: "Medium", value: "md" },
          { title: "Large", value: "lg" },
          { title: "Extra large", value: "xl" },
        ],
        layout: "radio",
      },
      initialValue: "md",
    }),
    defineField({
      name: "website",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "active",
      title: "Active this edition",
      type: "boolean",
      description: "Inactive partners are hidden from the public site.",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "name", media: "logo", tier: "tier", active: "active" },
    prepare(selection: {
      title?: string;
      media?: unknown;
      tier?: number;
      active?: boolean;
    }) {
      const tierLabel = selection.tier
        ? `Tier ${String(selection.tier)}`
        : "No tier";
      return {
        title: selection.title,
        subtitle: selection.active ? tierLabel : `${tierLabel} · inactive`,
        media: selection.media as ReactNode,
      };
    },
  },
  orderings: [
    {
      title: "Tier, then name",
      name: "tierName",
      by: [
        { field: "tier", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
});
