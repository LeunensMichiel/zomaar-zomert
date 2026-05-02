"use client";

import { cn } from "@lib/utils";
import { useEffect, useRef } from "react";

export function FitText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const fit = () => {
      el.style.fontSize = "";
      let size = parseFloat(getComputedStyle(el).fontSize);
      while (
        size > 8 &&
        (el.scrollWidth > el.clientWidth ||
          parent.scrollHeight > parent.clientHeight)
      ) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => {
      ro.disconnect();
    };
  }, [text]);

  return (
    <span
      ref={ref}
      className={cn("block w-full overflow-hidden text-center", className)}
    >
      {text}
    </span>
  );
}
