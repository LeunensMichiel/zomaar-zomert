/**
 * Splits a PascalCase name like "PartyShakerz" at the first lowercase-to-uppercase boundary.
 * Returns JSX with a <wbr />, or original name if not matched.
 * PartyShakerz → ["Party", "Shakerz"] → Party<wbr />Shakerz
 * "FC Bokken" is skipped because it contains a space.
 * "DJMIKE" is skipped because it’s all caps.
 */
export function formatArtistName(name: string): JSX.Element | string {
  // Skip names with spaces or all-uppercase
  if (name.includes(' ') || name === name.toUpperCase()) {
    return name;
  }

  // Find the first lowercase-uppercase transition (e.g., yS in PartyShakerz)
  const match = name.match(/^([a-zA-Z]+?)([A-Z][a-zA-Z]*)$/);

  if (!match) {
    return name;
  }

  const [, first, second] = match;

  return (
    <>
      {first}
      <wbr />
      {second}
    </>
  );
}
