import { Facebook } from "@components/icons/facebook";
import { Instagram } from "@components/icons/instagram";
import { Spotify } from "@components/icons/spotify";
import { cn } from "@lib/utils";
import { type ComponentProps } from "react";

import {
  type ArtistSocial,
  type ArtistSocialNetwork,
} from "@/sanity/lib/queries";

type IconComp = (props: ComponentProps<"svg">) => React.JSX.Element;

const networkMeta: Record<
  ArtistSocialNetwork,
  { Icon: IconComp; label: string; tile: string }
> = {
  spotify: { Icon: Spotify, label: "Spotify", tile: "bg-blue-500 text-white" },
  instagram: {
    Icon: Instagram,
    label: "Instagram",
    tile: "bg-pink-400 text-gray-900",
  },
  facebook: {
    Icon: Facebook,
    label: "Facebook",
    tile: "bg-brand-500 text-white",
  },
};

const TILT = [-3, 2, -2];

type Props = {
  socials: ArtistSocial[];
  heading: string;
};

export function ArtistSocials({ socials, heading }: Props) {
  if (socials.length === 0) return null;
  return (
    <div className="mt-8 md:mt-10">
      <span className="font-display block text-xs font-bold tracking-[0.2em] text-gray-900/70 uppercase md:text-sm">
        {heading}
      </span>
      <ul className="mt-3 flex flex-wrap gap-3 md:gap-4">
        {socials.map((social, i) => {
          const { Icon, label, tile } = networkMeta[social.network];
          return (
            <li key={`${social.network}-${social.url}`}>
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                style={{
                  transform: `rotate(${String(TILT[i % TILT.length])}deg)`,
                }}
                className={cn(
                  "font-display shadow-sticker inline-flex items-center gap-2 border-2 border-gray-900 px-3 py-2 text-sm font-bold uppercase transition-transform hover:-translate-y-0.5 hover:rotate-0 focus-visible:-translate-y-0.5 focus-visible:rotate-0 focus-visible:outline-none md:px-4 md:py-2.5 md:text-base",
                  tile,
                )}
              >
                <Icon className="h-4 w-4 md:h-5 md:w-5" />
                <span>{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
