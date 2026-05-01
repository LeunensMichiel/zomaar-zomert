export function getLocalStorage<R>(
  key: string,
  defaultValue: R,
): R | undefined {
  if (typeof window === "undefined") return defaultValue;
  const stickyValue = localStorage.getItem(key);
  if (stickyValue === null || stickyValue === "undefined") return defaultValue;
  return JSON.parse(stickyValue) as R;
}

export function setLocalStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}
