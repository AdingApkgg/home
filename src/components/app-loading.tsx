import { useEffect, useState } from "react";
import { isPrerendered } from "@/lib/prerender";
import { usePresence } from "@/lib/presence";
import { useMain } from "@/store/main";

export function AppLoading() {
  const loaded = useMain((s) => s.imgLoaded);
  // 预渲染过的首屏已经带着壁纸，遮罩先不显示，过一会儿再交回常规逻辑。
  const [veilOff, setVeilOff] = useState(isPrerendered);

  useEffect(() => {
    if (!veilOff || !loaded) return;
    const timer = setTimeout(() => setVeilOff(false), 800);
    return () => clearTimeout(timer);
  }, [veilOff, loaded]);

  const { mounted, leaving } = usePresence(!loaded && !veilOff, 400);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-[#0a0a0a] ${
        leaving ? "anim-veil-out pointer-events-none" : "anim-veil-in"
      }`}
    >
      <div
        aria-hidden
        className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/80"
      />
      <span className="sr-only">加载中</span>
    </div>
  );
}
