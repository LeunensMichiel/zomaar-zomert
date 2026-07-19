"use client";

import { Sticker } from "@components/sticker";
import { Button } from "@components/ui/button";
import { isGpxDownloadOpen } from "@lib/models";
import { Check, Download, ExternalLink, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

export type GpxEventId = "zomaarBike" | "zomaarRun";

type GpxRouteView = {
  title: string;
  filename: string | null;
  size: number | null;
  hasFile: boolean;
  stravaUrl: string | null;
};

type GpxLabels = {
  eyebrow: string;
  heading: string;
  hint: string;
  download: string;
  downloading: string;
  retry: string;
  done: string;
  error: string;
  openStrava: string;
};

type Props = {
  event: GpxEventId;
  routes: GpxRouteView[];
  visibleFrom: string | null;
  visibleUntil: string | null;
  /** Server-computed visibility — keeps the first client render in sync. */
  initialVisible: boolean;
  buttonVariant: "sky" | "brand";
  labels: GpxLabels;
};

const MAX_TIMEOUT = 2_147_483_647;

function formatSize(bytes: number | null): string | null {
  if (!bytes || bytes <= 0) return null;
  const kb = bytes / 1024;
  return kb < 1024
    ? `${String(Math.round(kb))} KB`
    : `${(kb / 1024).toFixed(1)} MB`;
}

export function GpxDownloads({
  event,
  routes,
  visibleFrom,
  visibleUntil,
  initialVisible,
  buttonVariant,
  labels,
}: Props) {
  const [visible, setVisible] = useState(initialVisible);

  useEffect(() => {
    const recompute = () => {
      setVisible(isGpxDownloadOpen(visibleFrom, visibleUntil));
    };
    const now = Date.now();
    const boundaries = [visibleFrom, visibleUntil]
      .map((iso) => (iso ? new Date(iso).getTime() : null))
      .filter((t): t is number => t !== null && t > now);
    const timers = [
      setTimeout(recompute, 0),
      ...boundaries.map((t) =>
        setTimeout(recompute, Math.min(t - now + 500, MAX_TIMEOUT)),
      ),
    ];
    return () => {
      for (const id of timers) clearTimeout(id);
    };
  }, [visibleFrom, visibleUntil]);

  if (!visible || routes.length === 0) return null;

  return (
    <section aria-labelledby="gpx-heading" className="mt-16 md:mt-24">
      <Sticker color="yellow" size="sm" rotate={-2}>
        {labels.eyebrow}
      </Sticker>
      <div className="mt-8 max-w-prose md:mt-10">
        <h2
          id="gpx-heading"
          className="font-display text-2xl leading-[0.95] font-bold text-gray-900 uppercase md:text-3xl"
        >
          {labels.heading}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-gray-700 md:text-lg">
          {labels.hint}
        </p>
      </div>
      <ul className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 md:gap-6">
        {routes.map((route, i) => (
          <li key={`${route.filename ?? route.title}-${i}`}>
            <GpxCard
              event={event}
              index={i}
              route={route}
              buttonVariant={buttonVariant}
              labels={labels}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

type CardState = "idle" | "loading" | "error" | "done";

function GpxCard({
  event,
  index,
  route,
  buttonVariant,
  labels,
}: {
  event: GpxEventId;
  index: number;
  route: GpxRouteView;
  buttonVariant: "sky" | "brand";
  labels: GpxLabels;
}) {
  const [state, setState] = useState<CardState>("idle");

  const download = async () => {
    setState("loading");
    try {
      const res = await fetch(`/api/gpx?event=${event}&index=${String(index)}`);
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = href;
      anchor.download = route.filename ?? `${event}-${String(index)}.gpx`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(href);
      setState("done");
    } catch {
      setState("error");
    }
  };

  const size = formatSize(route.size);
  const downloadLabel =
    state === "loading"
      ? labels.downloading
      : state === "error"
        ? labels.retry
        : state === "done"
          ? labels.done
          : labels.download;

  const metaParts: string[] = [];
  if (route.hasFile) metaParts.push(size ? `GPX · ${size}` : "GPX");
  if (route.stravaUrl) metaParts.push("Strava");

  return (
    <div className="shadow-sticker flex h-full flex-col gap-4 border-2 border-gray-900 bg-white p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
      <div className="min-w-0">
        <p className="font-display text-lg leading-tight font-bold text-gray-900 uppercase md:text-xl">
          {route.title}
        </p>
        {metaParts.length > 0 && (
          <p className="font-display mt-1 text-xs font-bold tracking-wider text-gray-500 uppercase">
            {metaParts.join(" · ")}
          </p>
        )}
        {state === "error" && (
          <p
            role="alert"
            className="text-brand-600 mt-2 flex items-center gap-1.5 text-sm font-semibold"
          >
            <TriangleAlert className="h-4 w-4 shrink-0" />
            {labels.error}
          </p>
        )}
      </div>
      <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto">
        {route.hasFile && (
          <Button
            type="button"
            onClick={download}
            loading={state === "loading"}
            disabled={state === "loading"}
            variant={buttonVariant}
            size="sm"
            sticker
            iconLeft={
              state === "done" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Download className="h-4 w-4" />
              )
            }
            className="w-full"
          >
            {downloadLabel}
          </Button>
        )}
        {route.stravaUrl && (
          <Button
            as="a"
            href={route.stravaUrl}
            target="_blank"
            rel="noreferrer noopener"
            variant={route.hasFile ? "ink" : buttonVariant}
            size="sm"
            sticker
            iconLeft={<ExternalLink className="h-4 w-4" />}
            className="w-full"
          >
            {labels.openStrava}
          </Button>
        )}
      </div>
    </div>
  );
}
