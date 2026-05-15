"use client";

import { ProgressProvider } from "@bprogress/next/app";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

export function BProgressProvider({ children }: Props) {
  return (
    <ProgressProvider
      height="4px"
      color="#ffb600"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}
