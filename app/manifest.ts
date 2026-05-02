import { ZZ_YEAR } from "@lib/models";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `Zomaar Zomert ${ZZ_YEAR}`,
    short_name: "Zomaar Zomert",
    start_url: "/",
    display: "standalone",
    background_color: "#de350b",
    theme_color: "#de350b",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
