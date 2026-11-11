import { useEffect, useRef, useState } from "react";
import type { Starfield } from "@/lib/fx/starfield";
import { isPrerendered } from "@/lib/prerender";

/**
 * 壁纸上的一层星尘。canvas 永远渲染（hydration 要对得上），
 * three.js 在 effect 里懒加载，构建期快照只留一块空 canvas。
 */
export function StarField({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!active || !canvas || isPrerendered()) return;

    let disposed = false;
    let field: Starfield | null = null;

    const boot = async () => {
      try {
        const { createStarfield } = await import("@/lib/fx/starfield");
        if (disposed) return;
        field = await createStarfield(canvas, {
          reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        });
        if (disposed) {
          field.dispose();
          field = null;
          return;
        }
        setLive(true);
      } catch {
        // 没有 WebGL 就安静地退回纯壁纸。
        setLive(false);
      }
    };

    void boot();

    return () => {
      disposed = true;
      field?.dispose();
      field = null;
      setLive(false);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-[1200ms] ease-out ${
        live ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
