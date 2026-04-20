let timeout: ReturnType<typeof setTimeout> | null = null;

export function debounce(fn: () => void, wait = 300) {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => fn(), wait);
}
