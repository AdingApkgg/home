import { useEffect, useState } from "react";
import { fetchBusuanzi } from "@/lib/api";

let cache: { pv: number; uv: number } | null = null;
let inflight: Promise<{ pv: number; uv: number } | null> | null = null;

export function useBusuanzi() {
  const [stats, setStats] = useState(cache);
  useEffect(() => {
    if (cache) return;
    if (!inflight) inflight = fetchBusuanzi();
    inflight.then((d) => {
      if (d) {
        cache = d;
        setStats(d);
      }
    });
  }, []);
  return stats;
}
