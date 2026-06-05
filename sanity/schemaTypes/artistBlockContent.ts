import { defineArrayMember, defineField, defineType } from "sanity";

export const artistBlockContent = defineType({
  name: "artistBlockContent",
  title: "Artist rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: "URL",
                description:
                  "External URL (https://...) or internal path starting with /.",
                validation: (rule) =>
                  rule.required().uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto"],
                  }),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "object",
      name: "youtube",
      title: "YouTube embed",
      fields: [
        defineField({
          name: "url",
          type: "url",
          title: "YouTube URL",
          description:
            "Paste a YouTube watch, share, or embed URL. The video plays inline inside the bio.",
          validation: (rule) =>
            rule.required().uri({ scheme: ["http", "https"] }),
        }),
      ],
      preview: {
        select: { url: "url" },
        prepare(selection: { url?: string }) {
          return {
            title: "YouTube",
            subtitle: selection.url ?? "",
          };
        },
      },
    }),
    defineArrayMember({
      type: "object",
      name: "soundcloud",
      title: "SoundCloud embed",
      fields: [
        defineField({
          name: "url",
          type: "url",
          title: "SoundCloud URL",
          description:
            "Paste a SoundCloud track, set, or profile URL. The player plays inline inside the bio.",
          validation: (rule) =>
            rule.required().uri({ scheme: ["http", "https"] }),
        }),
      ],
      preview: {
        select: { url: "url" },
        prepare(selection: { url?: string }) {
          return {
            title: "SoundCloud",
            subtitle: selection.url ?? "",
          };
        },
      },
    }),
  ],
});
