export const groupBy = <T>(
  array: T[],
  predicate: (v: T) => string
): Record<string, T[]> =>
  array.reduce<Partial<Record<string, T[]>>>((acc, value) => {
    (acc[predicate(value)] ??= []).push(value);
    return acc;
  }, {}) as Record<string, T[]>;
