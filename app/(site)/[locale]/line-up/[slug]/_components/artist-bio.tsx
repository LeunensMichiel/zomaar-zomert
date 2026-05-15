import { cn } from "@lib/utils";
import { PortableText, type PortableTextComponents } from "next-sanity";

import { type Artist } from "@/sanity/lib/queries";

// Extracts a YouTube video id from any of:
//   youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID,
//   youtube.com/shorts/ID, music.youtube.com/watch?v=ID
const youtubeId = (url: string): string | null => {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.hostname.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const seg = u.pathname.split("/").filter(Boolean);
      if (seg[0] === "embed" || seg[0] === "shorts") return seg[1] ?? null;
    }
    return null;
  } catch {
    return null;
  }
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="leading-relaxed font-semibold md:text-xl">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-brand-500 font-bold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = (value as { href?: string } | undefined)?.href ?? "";
      const external = /^https?:\/\//.test(href) || href.startsWith("mailto:");
      return (
        <a
          href={href}
          {...(external && { target: "_blank", rel: "noreferrer noopener" })}
          className="text-brand-500 underline decoration-2 underline-offset-2 transition-[text-decoration-thickness] hover:decoration-4"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    youtube: ({ value }) => {
      const url = (value as { url?: string } | undefined)?.url ?? "";
      const id = youtubeId(url);
      if (!id) return null;
      return (
        <figure className="my-10 md:my-12">
          <div className="shadow-sticker-lg relative -rotate-1 border-2 border-gray-900 bg-gray-900 md:rotate-1">
            <div className="relative aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </figure>
      );
    },
  },
};

export function ArtistBio({
  bio,
  fallback,
  className,
}: {
  bio: Artist["bio"];
  fallback: string;
  className?: string;
}) {
  if (bio.length === 0) {
    return (
      <p className={cn("text-lg text-gray-500 italic", className)}>
        {fallback}
      </p>
    );
  }
  return (
    <div className={cn("space-y-6", className)}>
      <PortableText value={bio} components={components} />
    </div>
  );
}
