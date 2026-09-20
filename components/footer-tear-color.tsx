import "server-only";

import { colorHex, type TearColor } from "./paper-tear";

export const FOOTER_TEAR_VAR = "--footer-tear";

export function FooterTearColor({ color }: { color: TearColor }) {
  return <style>{`:root{${FOOTER_TEAR_VAR}:${colorHex[color]}}`}</style>;
}
