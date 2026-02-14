let timeout: ReturnType<typeof setTimeout> | null = null;

function debounce(func: () => void, wait = 300, immediate = false): void {
  if (timeout !== null) {
    clearTimeout(timeout);
  }
  if (immediate) {
    const callNow = !timeout;
    timeout = setTimeout(() => {
      timeout = null;
    }, wait);
    if (callNow && typeof func === "function") {
      func();
    }
  } else {
    timeout = setTimeout(() => {
      if (typeof func === "function") {
        func();
      }
    }, wait);
  }
}

export default debounce;
