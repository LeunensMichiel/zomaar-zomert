import { isGpxDownloadOpen } from "@lib/models";
import { type NextRequest, NextResponse } from "next/server";

import { client } from "@/sanity/lib/client";
import { GPX_DOWNLOAD_QUERY } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

const EVENT_IDS = new Set(["zomaarBike", "zomaarRun"]);

type GpxDownloadResult = {
  gpxVisibleFrom: string | null;
  gpxVisibleUntil: string | null;
  routes: { url: string | null; filename: string | null }[] | null;
};

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const id = params.get("event");
  const index = Number(params.get("index"));

  if (!id || !EVENT_IDS.has(id)) {
    return new NextResponse("Unknown event", { status: 400 });
  }
  if (!Number.isInteger(index) || index < 0) {
    return new NextResponse("Invalid file", { status: 400 });
  }

  const data = await client.fetch<GpxDownloadResult | null>(
    GPX_DOWNLOAD_QUERY,
    {
      id,
    },
  );

  if (!data) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!isGpxDownloadOpen(data.gpxVisibleFrom, data.gpxVisibleUntil)) {
    return new NextResponse("Downloads are closed", { status: 403 });
  }

  const route = data.routes?.[index];
  if (!route?.url) {
    return new NextResponse("Not found", { status: 404 });
  }

  const upstream = await fetch(route.url, { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return new NextResponse("Could not fetch the file", { status: 502 });
  }

  const filename = (route.filename ?? `${id}-${index}.gpx`).replace(
    /["\\]/g,
    "",
  );
  const contentLength = upstream.headers.get("content-length");

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "application/gpx+xml",
      "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(
        filename,
      )}`,
      "Cache-Control": "no-store",
      ...(contentLength ? { "Content-Length": contentLength } : {}),
    },
  });
}
