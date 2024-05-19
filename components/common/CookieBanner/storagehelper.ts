export function getLocalStorage<R>(
  key: string,
  defaultValue: R
): R | undefined {
  if (typeof window === 'undefined') return defaultValue;
  const stickyValue = localStorage.getItem(key);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return stickyValue !== null && stickyValue !== 'undefined'
    ? JSON.parse(stickyValue)
    : defaultValue;
}

export function setLocalStorage<T = unknown>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}
