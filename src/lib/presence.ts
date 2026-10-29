import { useEffect, useState } from "react";

export type Presence = { mounted: boolean; leaving: boolean };

/**
 * 给纯 CSS 进场/退场用：`open` 变 true 立即挂载，变 false 先留 `exitMs` 再卸载，
 * 期间 `leaving` 为 true，组件据此挂上退场动画类。
 */
export function usePresence(open: boolean, exitMs: number): Presence {
  const [state, setState] = useState<"open" | "leaving" | "closed">(open ? "open" : "closed");

  useEffect(() => {
    if (open) {
      setState("open");
      return;
    }
    setState((prev) => (prev === "open" ? "leaving" : prev));
  }, [open]);

  useEffect(() => {
    if (state !== "leaving") return;
    const timer = setTimeout(() => setState("closed"), exitMs);
    return () => clearTimeout(timer);
  }, [state, exitMs]);

  return { mounted: state !== "closed", leaving: state === "leaving" };
}
