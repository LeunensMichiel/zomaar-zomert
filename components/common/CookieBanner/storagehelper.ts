// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalStorage(key: string, defaultValue: any) {
  if (typeof window === 'undefined') return;
  const stickyValue = localStorage.getItem(key);

  return stickyValue !== null && stickyValue !== 'undefined'
    ? JSON.parse(stickyValue)
    : defaultValue;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setLocalStorage(key: string, value: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}
