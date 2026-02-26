const sitePv = ref<number | null>(null);
const siteUv = ref<number | null>(null);
let fetched = false;

async function fetchBusuanzi() {
  if (fetched) return;
  fetched = true;

  try {
    const res = await fetch("https://bsz.saop.cc/api", {
      method: "POST",
      credentials: "include",
      headers: { "x-bsz-referer": location.href },
    });
    const { success, data } = await res.json();
    if (success) {
      sitePv.value = data.site_pv;
      siteUv.value = data.site_uv;
    }
  } catch {
    fetched = false;
  }
}

export function useBusuanzi() {
  onMounted(fetchBusuanzi);
  return { sitePv, siteUv };
}
