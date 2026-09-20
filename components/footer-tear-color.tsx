import "server-only";

import { colorHex, type TearColor } from "./paper-tear";

export const FOOTER_TEAR_VAR = "--footer-tear";

export function FooterTearColor({ color }: { color: TearColor }) {
  const selector = `[data-footer-tear="${color}"]:not([hidden] *)`;
  return (
    <>
      <span hidden data-footer-tear={color} />
      <style>{`:root:has(${selector}){${FOOTER_TEAR_VAR}:${colorHex[color]}}`}</style>
    </>
  );
}
