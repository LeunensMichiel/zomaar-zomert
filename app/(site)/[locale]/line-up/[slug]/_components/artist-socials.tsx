import { Facebook } from "@components/icons/facebook";
import { Instagram } from "@components/icons/instagram";
import { Soundcloud } from "@components/icons/soundcloud";
import { Spotify } from "@components/icons/spotify";
import { Tiktok } from "@components/icons/tiktok";
import { Youtube } from "@components/icons/youtube";
import { cn } from "@lib/utils";
import { Globe } from "lucide-react";
import { type ComponentType, type SVGProps } from "react";

import {
  type ArtistSocial,
  type ArtistSocialNetwork,
} from "@/sanity/lib/queries";

type IconComp = ComponentType<SVGProps<SVGSVGElement>>;

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
  tiktok: {
    Icon: Tiktok,
    label: "TikTok",
    tile: "bg-gray-900 text-white",
  },
  youtube: {
    Icon: Youtube,
    label: "YouTube",
    tile: "bg-red-500 text-white",
  },
  soundcloud: {
    Icon: Soundcloud,
    label: "SoundCloud",
    tile: "bg-orange-400 text-gray-900",
  },
  website: {
    Icon: Globe,
    label: "Website",
    tile: "bg-yellow-300 text-gray-900",
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
                  "font-display shadow-sticker inline-flex items-center gap-0 border-2 border-gray-900 p-3 text-sm font-bold uppercase transition-transform hover:-translate-y-0.5 hover:rotate-0 focus-visible:-translate-y-0.5 focus-visible:rotate-0 focus-visible:outline-none md:gap-2 md:px-4 md:py-2.5 md:text-base",
                  tile,
                )}
              >
                <Icon className="h-5 w-5 md:h-5 md:w-5" />
                <span className="sr-only md:not-sr-only">{label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
